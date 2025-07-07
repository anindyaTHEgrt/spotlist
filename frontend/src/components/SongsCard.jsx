import React, {useRef, useEffect, useState} from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import axios from 'axios';
import baseAxiosURL from "../lib/axios.js";

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

    //WEB PLAYBACK SDK CONTENT
    const playerRef = useRef(null); // Reference to Spotify player
    const deviceIdRef = useRef(null); // Store Spotify device ID
    const [isPlaying, setIsPlaying] = useState(false); // Track play state
    const [playerReady, setPlayerReady] = useState(false); // SDK ready state

    const baseVibe = props.baseVibe;
    const playlistName = props.playlistName;
    const playlistID = props.playlistID;

    const premium = sessionStorage.getItem("product") === "premium";

    // Add safety timeout for loading state
    useEffect(() => {
        let timeoutId;
        if (isLoading) {
            timeoutId = setTimeout(() => {
                // console.log('⚠️ Loading timeout - clearing loading state');
                setIsLoading(false);
                if (pendingSwipeRef.current) {
                    resetCard();
                    pendingSwipeRef.current = null;
                }
                isSwipeInProgress.current = false;
            }, 10000); // 10 second timeout
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isLoading]);

    const fetchTrackData = async (recommendation) => {
        // console.log('🚀 Starting to fetch track data for ID:', recommendation);
        try {
            const trackData = await baseAxiosURL.get('/track/fetchTrack', {
                params: {
                    access_token: sessionStorage.getItem("access_token"),
                    trackID: recommendation
                }
            });

            // console.log("✅ Track Data received:", trackData.data);
            setTrackUri(trackData.data.trackUri);

            const trackInfo = {
                image: trackData.data.trackImg || TrackBG,
                name: trackData.data.trackName || "Unknown Track",
                artist: trackData.data.trackArtists || "Unknown Artist"
            };

            // Always update the UI immediately when new data arrives
            // console.log('🎵 Updating UI with new track:', trackInfo.name);
            setTrackImage(trackInfo.image);
            setTrackName(trackInfo.name);
            setTrackArtist(trackInfo.artist);

            if (!isFirstTrackLoaded.current) {
                // console.log('🎯 First track loaded');
                isFirstTrackLoaded.current = true;
            }

            // Clear loading state and reset card position
            // console.log('✅ Clearing loading state');
            setIsLoading(false);
            isSwipeInProgress.current = false; // Reset swipe progress

            if (pendingSwipeRef.current) {
                // console.log('🔄 Resetting card position');
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
            isSwipeInProgress.current = false; // Reset swipe progress

            if (pendingSwipeRef.current) {
                resetCard();
                pendingSwipeRef.current = null;
            }
        }
    };

    const socketRef = useSocket((data) => {
        // console.log('🔥 ML Response received: ', data);
        // console.log('🔥 Recommendation ID: ', data.recommendation);
        setRecommendedTrackID(data.recommendation);
        latestRecommendedID.current = data.recommendation;

       const fetched =  fetchTrackData(data.recommendation);
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

            const response = await baseAxiosURL.post(`/playlist/addtrack`, data);
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

        console.log(`🎯 Processing ${direction} swipe`);
        isSwipeInProgress.current = true;
        pendingSwipeRef.current = direction;
        setIsLoading(true); // Show loading state immediately

        try {
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

            // Show alert
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            // Send swipe data to backend
            const swipeData = {
                status: "swipeData",
                baseVibe: baseVibe,
                swipe: direction,
                songId: latestRecommendedID.current,
            };
            console.log('📤 Sending swipe data to backend:', swipeData);
            socketRef.current.emit('swipe_event', swipeData);

        } catch (error) {
            console.error('❌ Error in handleSwipe:', error);

            // Clear loading state on error
            setIsLoading(false);
            isSwipeInProgress.current = false;

            if (pendingSwipeRef.current) {
                resetCard();
                pendingSwipeRef.current = null;
            }

            // Show error alert
            setAlertStatus("error");
            setAlertContent("❌ Something went wrong. Please try again.");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
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


    // Initialize Spotify Web Playback SDK
    useEffect(() => {
        if(sessionStorage.getItem("product") === "premium") {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);

            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: 'SwipeSong Player',
                    getOAuthToken: cb => {
                        cb(sessionStorage.getItem("access_token"));
                    },
                    volume: 0.5
                });

                playerRef.current = player;

                player.addListener('ready', ({ device_id }) => {
                    console.log('Spotify Player Ready with Device ID', device_id);
                    deviceIdRef.current = device_id;
                    setPlayerReady(true);
                });

                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                    setPlayerReady(false);
                });

                player.addListener('player_state_changed', state => {
                    if (!state) return;
                    setIsPlaying(!state.paused);
                });

                player.connect().then(success => {
                    if (success) {
                        console.log('Spotify player connected successfully');
                    }
                });

                return () => {
                    player.disconnect();
                };
            };

            return () => {
                document.body.removeChild(script);
                if (playerRef.current) {
                    playerRef.current.disconnect();
                }
            };
        }
        else{
            console.log("Product not premium");
        }


    }, []);

    // Transfer playback to our player when it's ready
    useEffect(() => {
        if (playerReady) {
            axios.put('https://api.spotify.com/v1/me/player', {
                device_ids: [deviceIdRef.current],
                play: false
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
                }
            }).then(() => {
                console.log('Playback transferred to SwipeSong player');
            }).catch(err => {
                console.error('Error transferring playback:', err);
            });
        }
    }, [playerReady]);

    // Play track when trackUri changes
    useEffect(() => {
        if (trackUri && playerReady) {
            playTrack(trackUri);
        }
    }, [trackUri, playerReady]);

    const playTrack = (uri) => {
        if (!playerReady || !deviceIdRef.current) return;

        axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`, {
            uris: [uri],
            position_ms: 0
        }, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
            }
        }).then(() => {
            console.log('Playback started');
            setIsPlaying(true);
        }).catch(err => {
            console.error('Error starting playback:', err);
        });
    };

    const togglePlayback = () => {
        if (!playerReady) return;

        if (isPlaying) {
            axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceIdRef.current}`, {}, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
                }
            }).then(() => {
                setIsPlaying(false);
            }).catch(err => {
                console.error('Error pausing playback:', err);
            });
        } else {
            axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`, {}, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("access_token")}`
                }
            }).then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.error('Error resuming playback:', err);
            });
        }
    };

    return (
        <div
            className="relative w-full max-w-4xl mx-auto px-4 h-fit flex flex-col justify-center items-center overflow-x-hidden">

            {/* Alert */}
            {showAlert && (
                <div
                    role="alert"
                    className={`alert alert-${alertStatus} w-full sm:w-fit max-w-xs mb-3 shadow-md backdrop-blur-md bg-white/10 border border-white/10 text-white text-center`}
                >
                    <span className=" text-sm lg:text-sm">{alertContent}</span>
                </div>
            )}

            {/* Track Card */}
            <animated.div
                {...bind()}
                style={{
                    x,
                    y,
                    rotateZ,
                    scale,
                    touchAction: 'none',
                    cursor: isLoading ? 'wait' : 'grab',
                }}
                className="select-none w-full sm:w-80"
            >
                <div
                    id="trackDisplay"
                    className={`card w-full bg-white/10 backdrop-blur-md border border-white/10 shadow-xl ${
                        isLoading ? 'opacity-70' : ''
                    }`}
                >
                    <figure className="relative">
                        <img src={trackImage} alt="track" className="h-60 mt-4 rounded-md w-full object-cover"/>
                        {isLoading && (
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md mt-4">
                                <div className="loading loading-spinner loading-lg text-white"/>
                            </div>
                        )}
                    </figure>
                    <div className="card-body text-white">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{trackName}</p>
                        <p className="text-sm md:text-base">{trackArtist}</p>
                        {isLoading && <p className="text-sm opacity-70">Loading next track...</p>}
                    </div>
                </div>
            </animated.div>

            {/* Player Controls */}
            <div
                id="playControls"
                className="card w-full sm:w-96 bg-white/10 mt-4 backdrop-blur-md border border-white/10 shadow-xl"
            >
                <div className="card-body">
                    {premium ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={togglePlayback}
                                className="btn btn-circle btn-primary"
                                disabled={!playerReady || !trackUri}
                            >
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                )}
                            </button>

                            <div className="flex-1 text-center sm:text-left">
                                <div className="text-sm sm:text-sm font-semibold ">Swipe Up to add to {playlistName}</div>
                                <div className="text-sm opacity-80 ">Swipe right for more like this</div>
                                <div className="text-sm opacity-80 ">Swipe left to see less </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm lg:text-md text-amber-950 font-bold text-center">
                            Track Player requires premium subscription
                        </div>
                    )}

                    {!playerReady && (
                        <div className="text-sm text-warning mt-0 lg:mt-2 text-center">
                            Connecting to Spotify player...
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}