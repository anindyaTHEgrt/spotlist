import React, {useRef, useEffect, useState} from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import axios from 'axios';

import useSocket from '../FE_utils/useSocket.js'

import TrackBG from '../media_assets/swipesong_hero_bg.jpeg';

export function SongsCard(props) {

    const isFirstTrackLoaded = useRef(false);
    const isSwipeInProgress = useRef(false);
    const pendingSwipeRef = useRef(null); // Track if we're waiting for a response

    const [showAlert, setShowAlert] = useState(false);
    const [alertStatus, setAlertStatus] = useState("");
    const [alertContent, setAlertContent] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const latestRecommendedID = useRef(null);
    const [recommendedTrackID, setRecommendedTrackID] = useState(null);
    const [trackUri, setTrackUri] = useState(null);
    const [trackImage, setTrackImage] = useState(TrackBG);
    const [trackName, setTrackName] = useState("Can't Tell Me Nothing");
    const [trackArtist, setTrackArtist] = useState("Kanye West");

    const baseVibe = props.baseVibe;
    const playlistName = props.playlistName;
    const playlistID = props.playlistID;

    const socketRef = useSocket((data) => {
        console.log('🔥 ML Response received: ', data);
        console.log('🔥 Recommendation ID: ', data.recommendation);
        setRecommendedTrackID(data.recommendation);
        latestRecommendedID.current = data.recommendation;

        const fetchTrackData = async () => {
            console.log('🚀 Starting to fetch track data for ID:', data.recommendation);
            try {
                const trackData = await axios.get('http://localhost:3001/track/fetchTrack', {
                    params: {
                        access_token: sessionStorage.getItem("access_token"),
                        trackID: data.recommendation
                    }
                });

                console.log("✅ Track Data received:", trackData.data);
                setTrackUri(trackData.data.trackUri);

                const trackInfo = {
                    image: trackData.data.trackImg || TrackBG,
                    name: trackData.data.trackName || "Unknown Track",
                    artist: trackData.data.trackArtists || "Unknown Artist"
                };

                // Always update the UI immediately when new data arrives
                console.log('🎵 Updating UI with new track:', trackInfo.name);
                setTrackImage(trackInfo.image);
                setTrackName(trackInfo.name);
                setTrackArtist(trackInfo.artist);

                if (!isFirstTrackLoaded.current) {
                    console.log('🎯 First track loaded');
                    isFirstTrackLoaded.current = true;
                }

                // Clear loading state and reset card position
                console.log('✅ Clearing loading state');
                setIsLoading(false);
                if (pendingSwipeRef.current) {
                    console.log('🔄 Resetting card position');
                    resetCard();
                    pendingSwipeRef.current = null;
                }

            } catch (error) {
                console.error("❌ Error fetching track:", error);

                // Set fallback data on error
                setTrackImage(TrackBG);
                setTrackName("Error loading track");
                setTrackArtist("Please try again");

                if (!isFirstTrackLoaded.current) {
                    isFirstTrackLoaded.current = true;
                }

                setIsLoading(false);
                if (pendingSwipeRef.current) {
                    resetCard();
                    pendingSwipeRef.current = null;
                }
            }
        };

        fetchTrackData();
    });

    const sendToPlaylist = async (playlistId) => {
        try {
            const access_token = sessionStorage.getItem("access_token");
            const songId = latestRecommendedID.current;
            const data = {
                playlistId: playlistId,
                access_token: access_token,
                songId: songId,
                trackUri: trackUri
            };

            const response = await axios.post(`http://localhost:3001/playlist/addtrack`, data);
            console.log("✅ Added to playlist:", response.data);
            return true;
        } catch (error) {
            console.error("❌ Error adding to playlist:", error);
            return false;
        }
    }

    useEffect(() => {
        const initialData = {
            status: "initial",
            baseVibe: baseVibe,
            swipe: "null",
            songId: "null"
        };
        socketRef.current.emit('swipe_event', initialData);
    }, [baseVibe]);

    const handleSwipe = async (direction) => {
        if (!latestRecommendedID.current) {
            console.warn("⛔ Swipe ignored: recommendation not ready");
            return;
        }

        if (isSwipeInProgress.current) {
            console.warn("⛔ Swipe ignored: already in progress");
            return;
        }

        isSwipeInProgress.current = true;
        pendingSwipeRef.current = direction;
        setIsLoading(true); // Show loading state immediately

        // Handle different swipe directions
        if (direction === "right") {
            setAlertStatus("info");
            setAlertContent("👍 Great! More songs like this.");
        } else if (direction === "left") {
            setAlertStatus("warning");
            setAlertContent("👎 Got it! Less songs like this.");
        } else if (direction === "up") {
            console.log(`Adding to playlist: ${playlistName}`);
            const success = await sendToPlaylist(playlistID);

            if (success) {
                setAlertStatus("success");
                setAlertContent(`⭐ Added to playlist: ${playlistName}!`);
            } else {
                setAlertStatus("error");
                setAlertContent("❌ Failed to add to playlist. Try again.");
            }
        }

        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);

        // Send swipe data to backend
        // Send swipe data to backend
        const swipeData = {
            status: "swipeData",
            baseVibe: baseVibe,
            swipe: direction,
            songId: latestRecommendedID.current,
        };
        console.log('📤 Sending swipe data to backend:', swipeData);
        socketRef.current.emit('swipe_event', swipeData);

        // Reset swipe progress after a short delay
        setTimeout(() => {
            isSwipeInProgress.current = false;
        }, 500);
    };

    const [{ x, y, rotateZ, scale }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rotateZ: 0,
        scale: 1,
        config: { tension: 300, friction: 20 }
    }));

    const resetCard = () => {
        setTimeout(() => {
            api.start({ x: 0, y: 0, rotateZ: 0, scale: 1 });
        }, 150);
    };

    const bind = useDrag(({ down, movement: [mx, my], direction: [dx, dy], distance }) => {
        // Prevent interaction if swipe is in progress or loading
        if ((isSwipeInProgress.current || isLoading) && !down) {
            return;
        }

        // Handle swipe completion
        if (!down && (distance[0] > 20 || distance[1] > 20)) {
            let choiceDirection;

            if (Math.abs(mx) > Math.abs(my)) {
                // Horizontal swipe
                if (mx > 0) {
                    // Right swipe - Good
                    api.start({ x: 400, rotateZ: 20, scale: 1 });
                    console.log('Right swipe - Good! ✅');
                    choiceDirection = "right";
                } else {
                    // Left swipe - Reject
                    api.start({ x: -400, rotateZ: -20, scale: 1 });
                    console.log('Left swipe - Reject! ❌');
                    choiceDirection = "left";
                }
            } else if (my < 0) {
                // Up swipe - Best
                api.start({ y: -400, rotateZ: 0, scale: 1.1 });
                console.log('Up swipe - Best! ⭐');
                choiceDirection = "up";
            } else {
                // Down swipe or insufficient swipe - snap back
                api.start({ x: 0, y: 0, rotateZ: 0, scale: 1 });
                console.log('Snapped back');
                return;
            }

            // Handle the swipe
            handleSwipe(choiceDirection);
            return;
        }

        // Follow the gesture while dragging (only if not loading)
        if (!isLoading) {
            api.start({
                x: down ? mx : 0,
                y: down ? my : 0,
                rotateZ: down ? mx / 15 : 0,
                scale: down ? 1.05 : 1,
                immediate: down
            });
        }
    });


    return (
        <div className="relative w-full h-[400px] flex flex-col justify-center items-center">

            {showAlert && (
                <div
                    role="alert"
                    className={`alert alert-${alertStatus} w-fit mb-3 shadow-md backdrop-blur-md bg-white/10 border border-white/10 text-white`}
                >
                    <span>{alertContent}</span>
                </div>
            )}

            <animated.div
                {...bind()}
                style={{
                    x,
                    y,
                    rotateZ,
                    scale,
                    touchAction: 'none',
                    cursor: isLoading ? 'wait' : 'grab'
                }}
                className="select-none">
                <div
                    id="trackDisplay"
                    className={`card w-80 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl ${isLoading ? 'opacity-70' : ''}`}>
                    <figure className="relative">
                        <img src={trackImage} alt="track" className="h-60 mt-4 rounded-md" />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md mt-4">
                                <div className="loading loading-spinner loading-lg text-white"></div>
                            </div>
                        )}
                    </figure>
                    <div className="card-body text-white">
                        <p className="text-2xl">{trackName}</p>
                        <p className="text-m">{trackArtist}</p>
                        {isLoading && (
                            <p className="text-sm opacity-70">Loading next track...</p>
                        )}
                    </div>
                </div>
            </animated.div>

            <div id="playControls"
                 className="card w-96 bg-white/10 mt-4 backdrop-blur-md border border-white/10 shadow-xl m-0">
                <div className="card-body">
                    <h2 className="card-title">Life hack</h2>
                    <p>How to park your car at your garage?</p>
                </div>
            </div>
        </div>
    );
}