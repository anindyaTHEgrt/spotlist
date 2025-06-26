import React from 'react'
import {Link} from "react-router";

import SS_H_BG from "../media_assets/swipesong_hero_bg2.jpeg"
import TrackBG from "../media_assets/swipesong_hero_bg.jpeg"

const Songswipe = () => {
    const trackname = "Can't Tell Me Nothing";
    const artist = "Kanye West";
    return (
        <div>
            <div
                className="hero w-5/6 justify-self-center h-screen mt-5 rounded-md p-0"
                style={{
                    backgroundImage: `url(${SS_H_BG})`,
                }}>
                <div className="hero-overlay bg-opacity-0"></div>
                <div className="hero-content flex flex-col items-center space-y-0 text-neutral-content text-center p-3">
                    <p className="text-sm mb-0">Now Playing</p>
                    <div id="trackDisplay"
                         className=" card w-80 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl m-0">
                        <figure>
                            <img
                                src={TrackBG}
                                alt="car!" className="h-80 mt-4 rounded-md"/>
                        </figure>

                        <div className="card-body">
                            <p className="text-2xl">{trackname}</p>
                            <p className="text-m">{artist}</p>

                        </div>
                    </div>
                    <div id="playControls"
                         className="card w-96 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl m-0">
                        <div className="card-body">
                            <h2 className="card-title">Life hack</h2>
                            <p>How to park your car at your garage?</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default Songswipe;