import React, {useState} from 'react'
import { useNavigate } from 'react-router';

// import {handleLogin} from './Navbar.jsx'
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
    const handleLogin = () => {
        const clientId = "16bc716aa6a84db3979d3afff7051ac2";
        const redirectUri = "http://127.0.0.1:5174/callback";
        const scope = "user-read-private user-read-email user-library-read playlist-modify-public playlist-modify-private";

        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
        window.location.href = authUrl;
    };
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);

    const handlePLbutton = async () => {
        if(sessionStorage.getItem("token_handled")){
            await handlePlaylistCreation();
            navigate('/songswipe');
        }
        else{
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 6000);
        }
    }

    const handlePlaylistCreation = async () => {
        try{
            console.log("User ID: ", sessionStorage.getItem("userID"));
            console.log("refresh_token: ", sessionStorage.getItem("refresh_token"));
            console.log("access_token: ", sessionStorage.getItem("access_token"));

            const userID = sessionStorage.getItem("userID");
            const playlistName = document.getElementById("nameField").value;
            const vibe = document.getElementById("vibeField").value;
            const data = {
                id: userID,
                playlistName: playlistName,
                vibe: vibe,
                accessToken: sessionStorage.getItem("access_token"),
            };

            console.log("MakePlaylist: ", data);
            const sendplres = await axios.post(`http://localhost:3001/playlist/${userID}/create`, data);
            console.log(sendplres.data);
        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            {showAlert && (
                <div role="alert" className="alert justify-self-center w-1/3 mt-4 bg-emerald-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-info h-6 w-6 shrink-0">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>You need to Login first!</span>
                    <div>
                        <button className="btn btn-sm btn-primary" onClick={handleLogin} >Login using Spotify!</button>
                    </div>
                </div>
            )}
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
                        onClick={handlePLbutton}>Create
                </button>

            </div>

        </div>
    )
}

export default MakePlaylist