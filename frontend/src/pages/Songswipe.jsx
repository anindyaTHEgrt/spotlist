import React from 'react'
import {useSearchParams} from "react-router";

import SS_H_BG from "../media_assets/swipesong_hero_bg2.jpeg"
import TrackBG from "../media_assets/swipesong_hero_bg.jpeg"
import {SongsCard} from "../components/SongsCard.jsx";
import useSocket from '../FE_utils/useSocket.js'

const Songswipe = () => {
    // const location = useLocation();
    // const baseVibe = location?.state?.baseVibe;
    const [searchParams] = useSearchParams();
    const baseVibe = searchParams.get("baseVibe");
    return (
        <div>
            <div
                className="hero w-5/6 justify-self-center h-screen mt-5 rounded-md p-0"
                style={{
                    backgroundImage: `url(${SS_H_BG})`,
                }}>
                <div className="hero-overlay bg-opacity-0"></div>
                <div className="hero-content flex flex-col items-center space-y-32 text-neutral-content text-center">
                    <p className="text-sm mb-0">Now Playing</p>
                    <SongsCard baseVibe={baseVibe} />

                    {/*PLAY CONTROLS HAVE TO BE A SEPERATE COMPONENT/*/}
                    {/*<div id="playControls"*/}
                    {/*     className="card w-96 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl m-0">*/}
                    {/*    <div className="card-body">*/}
                    {/*        <h2 className="card-title">Life hack</h2>*/}
                    {/*        <p>How to park your car at your garage?</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>
            </div>
        </div>
    );
}
export default Songswipe;