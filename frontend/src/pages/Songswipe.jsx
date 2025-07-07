    import React from 'react'
import {useSearchParams, useLocation} from "react-router";

import SS_H_BG from "../media_assets/swipesong_hero_bg2.jpeg"
import TrackBG from "../media_assets/swipesong_hero_bg.jpeg"
import {SongsCard} from "../components/SongsCard.jsx";
import Intro from "../components/Intro.jsx"
import useSocket from '../FE_utils/useSocket.js'

const Songswipe = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const baseVibe = params.get("baseVibe");
    const playlistName = params.get("playlistName");
    const playlistID = params.get("playlistID");

    const propsData = {
        baseVibe,
        playlistName,
        playlistID
    }


    return (
        <div>
            <div
                className="hero w-full max-w-7xl mx-auto h-screen mt-5 rounded-md"
                style={{
                    backgroundImage: `url(${SS_H_BG})`,
                }}>
                <div className="hero-overlay bg-opacity-0"></div>

                <Intro/>

                <div
                    className="hero-content flex flex-col items-center space-y-5  text-neutral-content text-center">
                    <p className="text-sm mb-0">Now Playing</p>
                    <SongsCard {...propsData} />
                </div>
            </div>
        </div>
    );
}
    export default Songswipe;