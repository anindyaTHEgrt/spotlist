import React from 'react'
import {Link} from 'react-router'
import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
// import {fetchUserProfile} from "../../../backend/utils/fetchUserProfile.js"
import axios from "axios";

import Logo from '../media_assets/spotlist-high-resolution-logo-transparent.png';


const Callback = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        // ✅ Prevent running twice by checking localStorage or session memory
        if (code && !sessionStorage.getItem("token_handled")) {

            (async () => {
                try {
                    const res = await fetch("http://localhost:3001/api/token", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code }),
                    });

                    const data = await res.json();

                    if (data.token.access_token) {
                        // console.log("✅ Access Token:", data.token.access_token);
                        // console.log("🔁 Refresh Token:", data.token.refresh_token);

                        // login(data.token.access_token, data.token.refresh_token);
                        sessionStorage.setItem("refresh_token", data.token.refresh_token);
                        sessionStorage.setItem("access_token", data.token.access_token);

                        // const profile = await fetchUserProfile(data.token.access_token);
                        const profile = await axios.get(`http://localhost:3001/user/profile?access_token=${data.token.access_token}`, {})
                        // console.log("👤 Spotify Profile:", profile.data);
                        sessionStorage.setItem("userID", profile.data.id);
                        sessionStorage.setItem("product", profile.data.product);
                        // console.log("product type:", sessionStorage.getItem("product"));

                        const userExists = await axios.post(
                            `http://localhost:3001/db/${profile.data.id}/cue`,
                            {
                                profile: profile.data,
                                accessToken: data.token.access_token,
                            }
                        );

                        // console.log(userExists);
                        sessionStorage.setItem("token_handled", "true"); // mark as handled
                        navigate("/");
                    } else {
                        console.error("❌ Failed to get access token:", data);
                    }
                } catch (err) {
                    console.error("🚨 Token exchange error:", err);
                }
            })();
        }
    }, [login, navigate]);

    return (
        <div
            className="mt-4 flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white">
            {/* Logo */}
            <img
                src={Logo}
                alt="SpotList Logo"
                className="h-16 w-auto mb-6 sm:h-20"
            />

            {/* Spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-60 mb-6"></div>

            {/* Text */}
            <h2 className="text-xl sm:text-2xl font-bold animate-pulse text-center">
                Authenticating with Spotify...
            </h2>
            <p className="text-sm sm:text-base mt-2 text-center opacity-80">
                Please wait while we sync your vibe 🎧
            </p>


        </div>
    );
};

export default Callback;