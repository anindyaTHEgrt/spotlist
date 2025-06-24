import React from 'react'
import Navbar from './Navbar.jsx'
import {Link} from 'react-router'
import Songswipe from '../pages/Songswipe.jsx'
// import {fetchUserProfile} from "../../../backend/utils/fetchUserProfile.js";
import axios from "axios";
// import {fetchSavedTracks} from "../../../backend/utils/fetchSavedTracks.js";


const MakePlaylist = () => {

    // const handleFetchTracks = async () => {
    //     try {
    //         const tracks = await fetchSavedTracks(localStorage.getItem("access_token"));
    //         console.log("Saved tracks:", tracks);
    //         // Optional: set state here to display in UI
    //     } catch (err) {
    //         console.error("Failed to fetch saved tracks", err);
    //     }
    // };
    const handlePlaylistCreation = async () => {
        try{

            const playlistName = document.getElementById("nameField").value;
            const vibe = document.getElementById("vibeField").value;
            const data = {
                playlistName: playlistName,
                vibe: vibe,
                // accessToken: localStorage.getItem("accessToken")
            };
            const userID = localStorage.getItem("userID");
            console.log("MakePlaylist: ", data);
            const sendplres = await axios.post(`http://localhost:3001/playlist/${userID}/create`, data);
            console.log(sendplres);
        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <div className=" w-3/6 mt-4 justify-self-center space-y-3 mb-8">
                <p className="mb-5 text-2xl text-center">
                    This is where we create the foundation of your playlist! <br/>
                    Enter the name of your playlist and then tell us the vibe you are going for.
                </p>
                <label className="input input-bordered flex items-center gap-2">
                    Name
                    <input type="text" className="grow" id={"nameField"} placeholder="Midnight Drive" />
                </label>
                <label  className="input input-bordered flex items-center gap-2">
                    Vibe
                    <input id={"vibeField"} type="text" className="grow"/>
                </label>
                {/*<Link to={"/songswipe"}>*/}
                {/*    <button className="btn btn-primary w-1/4 justify-self-center" onClick={fetchSavedTracks(localStorage.getItem("access_token"))}>Create</button>*/}
                {/*</Link>*/}
                <button className="btn btn-primary w-1/4 justify-self-center"
                        onClick={handlePlaylistCreation}>Create
                </button>

            </div>
        </div>
    )
}

export default MakePlaylist