import React, {useContext} from 'react'
import { Routes, Route } from 'react-router';
import Callback from '../pages/Callback.jsx';
// import handleLogin from '../FE_utils/handleLogin.jsx'
import { AuthContext } from "../context/AuthContext";

import Logo from '../media_assets/spotlist-high-resolution-logo-transparent.png';

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const handleLogin = () => {
    const clientId = "16bc716aa6a84db3979d3afff7051ac2";
    const redirectUri = import.meta.env.MODE === 'development'? "http://127.0.0.1:5174/callback" : 'https://spotlist.onrender.com/callback';
    const scope = "streaming user-read-playback-state user-modify-playback-state user-read-private user-read-email user-library-read playlist-modify-public playlist-modify-private";

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
    window.location.href = authUrl;
  };
  return (
    <div>
      <div className="navbar w-5/6 justify-self-center mt-5 rounded-full bg-emerald-700 shadow-lg shadow-gray-80  0/50 text-neutral-content ">
  <div className="navbar-start">
    <div className="dropdown">

    </div>
  </div>
        <div className="navbar-center">
          {/*<img src={Logo} alt="logo" className="h-10 w-auto object-contain"/>*/}
          <a href="/" className="btn btn-ghost text-xl md:text-2xl lg:text-3xl flex items-center gap-2">
            <img src={Logo} alt="logo" className="h-10 w-auto object-contain"/>
          </a>
        </div>
        <div className="navbar-end">

          {isLoggedIn ? (
                  <>
                    <div className="dropdown">
                      <div tabIndex={0} role="button" className="btn m-1 text-sm">Logged In</div>
                      <div
                          tabIndex={0}
                          className="dropdown-content card card-compact bg-primary text-primary-content z-[1] lg:w-40 lg:p-2 shadow">
                        <div className="card-body">
                          <h3 className="card-title text-sm lg:text-xl">You are logged In!</h3>
                          <button className="btn btn-neutral text-sm lg:text-xl" onClick={logout}>Log Out</button>
                        </div>
                      </div>
                    </div>
                  </>)
              :
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn m-1 text-sm ">Login</div>
                <div
                    tabIndex={0}
                    className="dropdown-content card card-compact bg-primary text-primary-content z-[1]  lg:w-40 lg:p-2 shadow">
                  <div className="card-body">
                    <h3 className="card-title text-sm lg:text-xl">Login using Spotify!</h3>
                    <button className="btn btn-neutral text-sm lg:text-xl " onClick={handleLogin}>Login</button>
                  </div>
                </div>
              </div>

          }
        </div>
      </div>
    </div>
  )
}

export default Navbar