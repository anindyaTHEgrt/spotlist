import React, {useState} from 'react'
import { useNavigate } from 'react-router';

// import {handleLogin} from './Navbar.jsx'
import {Link} from 'react-router'
import Songswipe from '../pages/Songswipe.jsx'
// import {fetchUserProfile} from "../../../backend/utils/fetchUserProfile.js";
import axios from "axios";

// import {fetchSavedTracks} from "../../../backend/utils/fetchSavedTracks.js";


const MakePlaylist = () => {

    const handleLogin = () => {
        const clientId = "16bc716aa6a84db3979d3afff7051ac2";
        const redirectUri = "http://127.0.0.1:5174/callback";
        const scope = "user-read-private user-read-email user-library-read playlist-modify-public playlist-modify-private";

        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
        window.location.href = authUrl;
    };
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [dataEntered, setDataEntered] = useState(true);
    const [loading, setLoading] = useState(false);

    const handlePLbutton = async () => {

        const playlistName = document.getElementById("nameField").value;
        const vibe = document.getElementById("vibeField").value;
        if(!vibe || !playlistName){
            console.log("enter content");
            return;
        }

        setDataEntered(false);
        if(sessionStorage.getItem("token_handled")){
            setLoading(true);
            const playdata = await handlePlaylistCreation();
            const aiVibe = playdata.vibefromai;
            const playlistID = playdata.playlistID;
            const playlistName = playdata.playlistName;

            console.log(playdata);

            setLoading(false);
            // navigate('/songswipe', {state: {baseVibe: aiVibe}});
            const queryParams = new URLSearchParams({
                baseVibe: aiVibe,
                playlistName: playlistName,
                playlistID: playlistID
            });
            navigate(`/songswipe?${queryParams.toString()}`);
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
            const aivibeinterpretresp = await axios.post(`http://localhost:3001/intel/interpret`, {vibe: vibe});
            // console.log(aivibeinterpretresp);
            const vibefromai = aivibeinterpretresp.data.candidates[0].content.parts[0].text;
            console.log(vibefromai);
            const pl = {
                vibefromai: vibefromai,
                playlistID: sendplres.data.spotifyData.id,
                playlistName:  sendplres.data.spotifyData.name
            }
            return pl;
            // const vibeToPy = await axios.post(`http://localhost:8001/vibe`, {vibe: vibefromai, userID: userID});
            // console.log(vibeToPy);

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

                {loading && (
                    <div className="flex justify-center mt-4">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                {dataEntered && (
                    <>
                    <label className="input input-bordered flex items-center gap-2">
                            Name
                            <input type="text" className="grow" id={"nameField"} placeholder="Midnight Drive"/>
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            Vibe
                            <input id={"vibeField"} type="text" className="grow"/>
                        </label>
                        {/*<Link to={"/songswipe"}>*/}
                        {/*    <button className="btn btn-primary w-1/4 justify-self-center" onClick={fetchSavedTracks(localStorage.getItem("access_token"))}>Create</button>*/}
                        {/*</Link>*/}
                        <button className="btn btn-primary w-1/4 justify-self-center"
                                onClick={handlePLbutton}>Create
                        </button>
                    </>

                )}
            </div>

        </div>
    )
}

export default MakePlaylist