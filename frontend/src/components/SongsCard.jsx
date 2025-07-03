import React, {useRef, useEffect, useState} from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import axios from 'axios';

import useSocket from '../FE_utils/useSocket.js'

import TrackBG from '../media_assets/swipesong_hero_bg.jpeg';

export function SongsCard(props) {

    const trackBufferRef = useRef({ image: null, name: null, artist: null });
    const isFirstTrackLoaded = useRef(false);


    // const [recievedData, setRecievedData] = useState(false);
    const latestRecommendedID = useRef(null);
    const [recommendedTrackID, setRecommendedTrackID] = useState(null);
    const [trackImage, setTrackImage] = useState(TrackBG); // default image
    const [trackName, setTrackName] = useState("Can't Tell Me Nothing");
    const [trackArtist, setTrackArtist] = useState("Kanye West");


    const {baseVibe} = props;
    console.log(baseVibe);
    const socketRef = useSocket((data) => {
        console.log('ML Response: ', data);
        // alert(`ML Suggestion: ${data.recommendation}`);
        setRecommendedTrackID(data.recommendation); // for UI
        latestRecommendedID.current = data.recommendation; // for logic

        const fetchTrackData = async () => {
            try {
                const trackData = await axios.get('http://localhost:3001/track/fetchTrack', {
                    params: {
                        access_token: sessionStorage.getItem("access_token"),
                        trackID: data.recommendation
                    }
                });
                console.log("Track Data:", trackData.data);
                // setTrackImage(trackData.data.trackImg || TrackBG); // fallback to default
                // setTrackName(trackData.data.trackName || "Unknown Track");
                // setTrackArtist(trackData.data.trackArtists || "Unknown Artist");
                trackBufferRef.current = {
                    image: trackData.data.trackImg || TrackBG,
                    name: trackData.data.trackName || "Unknown Track",
                    artist: trackData.data.trackArtists || "Unknown Artist"
                };

                // setRecievedData(true);
            } catch (error) {
                console.error("❌ Error fetching track:", error);
            }
        };

        fetchTrackData(); // ✅ call async inner function
    });


    useEffect(() => {
        const initialData = {
            status: "initial",
            baseVibe: baseVibe,
            swipe: "null",
            songId: "null"
        };
        socketRef.current.emit('swipe_event', initialData);
    }, [baseVibe]);

    const handleSwipe = (direction) => {
        if (!latestRecommendedID.current) {
            console.warn("⛔ Swipe ignored: recommendation not ready");
            return;
        }

        // setRecievedData(false);
        const swipeData = {
            status: "swipeData",
            baseVibe: baseVibe,
            swipe: direction,
            songId: latestRecommendedID.current,
        };
        socketRef.current.emit('swipe_event', swipeData);
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
            const { image, name, artist } = trackBufferRef.current;
            if (image && name && artist) {
                setTrackImage(image);
                setTrackName(name);
                setTrackArtist(artist);
                trackBufferRef.current = { image: null, name: null, artist: null }; // clear buffer
            }
        }, 150);
    };

    let choiceDirection;

    const bind = useDrag(({ down, movement: [mx, my], direction: [dx, dy], distance }) => {
        console.log('Drag event:', { down, mx, my, dx, dy, distance });

        // Handle swipe completion when gesture ends and distance is sufficient
        if ((!down && distance[0] > 20) || (!down && distance[1] > 20)) {
            if (Math.abs(mx) > Math.abs(my)) {
                // Horizontal swipe
                if (mx > 0) {
                    // Right swipe - Good
                    api.start({ x: 400, rotateZ: 20, scale: 1 });
                    console.log('Right swipe - Good! ✅');
                    choiceDirection = "right";
                    handleSwipe(choiceDirection);
                    resetCard();
                } else {
                    // Left swipe - Reject
                    api.start({ x: -400, rotateZ: -20, scale: 1 });
                    console.log('Left swipe - Reject! ❌');
                    choiceDirection = "left";
                    handleSwipe(choiceDirection);
                    resetCard();
                }
            } else if (my < 0) {
                // Up swipe - Best
                api.start({ y: -400, rotateZ: 0, scale: 1.1 });
                console.log('Up swipe - Best! ⭐');
                choiceDirection = "up"
                handleSwipe(choiceDirection);
                resetCard();
            } else {
                // Down swipe or insufficient swipe - snap back
                api.start({ x: 0, y: 0, rotateZ: 0, scale: 1 });
                console.log('Snapped back');
            }
            return;
        }

        // Follow the gesture while dragging
        api.start({
            x: down ? mx : 0,
            y: down ? my : 0,
            rotateZ: down ? mx / 15 : 0,
            scale: down ? 1.05 : 1,
            immediate: down
        });
    });

    const trackname = "Can't Tell Me Nothing";
    const artist = "Kanye West";

    return (
        <div className="relative w-full h-[400px] flex flex-col justify-center items-center">
            <animated.div
                {...bind()}
                style={{
                    x,
                    y,
                    rotateZ,
                    scale,
                    touchAction: 'none',
                    cursor: 'grab'
                }}
                className="select-none">
                <div
                    id="trackDisplay"
                    className="card w-80 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl">
                    <figure>
                        <img src={trackImage} alt="track" className="h-60 mt-4 rounded-md" />
                    </figure>
                    <div className="card-body text-white">
                        <p className="text-2xl">{trackName}</p>
                        <p className="text-m">{trackArtist}</p>
                    </div>
                </div>
            </animated.div>

            {/*PLAY CONTROLS HAVE TO BE A SEPERATE COMPONENT/*/}
            <div id="playControls "
                 className="card w-96 bg-white/10 mt-4 backdrop-blur-md border border-white/10 shadow-xl m-0">
                <div className="card-body">
                    <h2 className="card-title">Life hack</h2>
                    <p>How to park your car at your garage?</p>
                </div>
            </div>
        </div>
    );
}