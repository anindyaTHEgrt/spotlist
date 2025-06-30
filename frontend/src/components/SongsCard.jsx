import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import TrackBG from '../media_assets/swipesong_hero_bg.jpeg';

export function SongsCard() {
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
        console.log('Drag event:', { down, mx, my, dx, dy, distance });

        // Handle swipe completion when gesture ends and distance is sufficient
        if ((!down && distance[0] > 20) || (!down && distance[1] > 20)) {
            if (Math.abs(mx) > Math.abs(my)) {
                // Horizontal swipe
                if (mx > 0) {
                    // Right swipe - Good
                    api.start({ x: 400, rotateZ: 20, scale: 1 });
                    console.log('Right swipe - Good! ✅');
                    resetCard();
                } else {
                    // Left swipe - Reject
                    api.start({ x: -400, rotateZ: -20, scale: 1 });
                    console.log('Left swipe - Reject! ❌');
                    resetCard();
                }
            } else if (my < 0) {
                // Up swipe - Best
                api.start({ y: -400, rotateZ: 0, scale: 1.1 });
                console.log('Up swipe - Best! ⭐');
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
        <div className="relative w-full h-[400px] flex justify-center items-center">
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
                className="select-none"
            >
                <div
                    id="trackDisplay"
                    className="card w-80 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl"
                >
                    <figure>
                        <img src={TrackBG} alt="track" className="h-80 mt-4 rounded-md" />
                    </figure>
                    <div className="card-body text-white">
                        <p className="text-2xl">{trackname}</p>
                        <p className="text-m">{artist}</p>
                    </div>
                </div>
            </animated.div>
        </div>
    );
}