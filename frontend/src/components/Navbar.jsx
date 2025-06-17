import React, {useContext} from 'react'
import { Routes, Route } from 'react-router';
import Callback from '../pages/Callback.jsx';
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const handleLogin = () => {
    const clientId = "16bc716aa6a84db3979d3afff7051ac2";
    const redirectUri = "http://127.0.0.1:5174/callback";
    const scope = "user-read-private user-read-email user-library-read";

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
    window.location.href = authUrl;
  };


  return (
    <div>
      <div className="navbar w-5/6 justify-self-center mt-5 rounded-full bg-emerald-900 shadow-lg shadow-gray-80  0/50 text-neutral-content ">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><a>Homepage</a></li>
        <li><a>Portfolio</a></li>
        <li><a>About</a></li>
      </ul>
    </div>
  </div>
  <div className="navbar-center">
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          {isLoggedIn ? (
                  <>
                    <div className="dropdown">
                      <div tabIndex={0} role="button" className="btn m-1">Logged In</div>
                      <div
                          tabIndex={0}
                          className="dropdown-content card card-compact bg-primary text-primary-content z-[1] w-40 p-2 shadow">
                        <div className="card-body">
                          <h3 className="card-title">You are logged In!</h3>
                          <button className="btn btn-neutral " onClick={logout}>Log Out</button>
                        </div>
                      </div>
                    </div>
                  </>)
              :
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn m-1">Login</div>
                <div
                    tabIndex={0}
                    className="dropdown-content card card-compact bg-primary text-primary-content z-[1] w-40 p-2 shadow">
                  <div className="card-body">
                    <h3 className="card-title">Login using Spotify!</h3>
                    <button className="btn btn-neutral " onClick={handleLogin}>Login</button>
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