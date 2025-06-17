import React from 'react'
import Navbar from './Navbar.jsx'
import {Link} from 'react-router'
import Songswipe from '../pages/Songswipe.jsx'
import {fetchSavedTracks} from "../../../backend/utils/fetchSavedTracks.js";


const MakePlaylist = () => {

    const handleFetchTracks = async () => {
        try {
            const tracks = await fetchSavedTracks(localStorage.getItem("access_token"));
            console.log("Saved tracks:", tracks);
            // Optional: set state here to display in UI
        } catch (err) {
            console.error("Failed to fetch saved tracks", err);
        }
    };

    return (
        <div>
            <div className=" w-3/6 mt-4 justify-self-center space-y-3">
                <p className="mb-5 text-2xl text-center">
                    This is where we create the foundation of your playlist! <br/>
                    Enter the name of your playlist and then tell us the vibe you are going for.
                </p>
                <label className="input input-bordered flex items-center gap-2">
                    Name
                    <input type="text" className="grow" placeholder="Midnight Drive"/>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Vibe
                    <input type="text" className="grow"/>
                </label>
                {/*<Link to={"/songswipe"}>*/}
                {/*    <button className="btn btn-primary w-1/4 justify-self-center" onClick={fetchSavedTracks(localStorage.getItem("access_token"))}>Create</button>*/}
                {/*</Link>*/}
                <button className="btn btn-primary w-1/4 justify-self-center"
                        onClick={handleFetchTracks}>Create
                </button>

            </div>
        </div>
    )
}

export default MakePlaylist