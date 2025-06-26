import React from 'react'
import {Link} from 'react-router'
import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
// import {fetchUserProfile} from "../../../backend/utils/fetchUserProfile.js"
import axios from "axios";

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
                        console.log("✅ Access Token:", data.token.access_token);
                        console.log("🔁 Refresh Token:", data.token.refresh_token);

                        // login(data.token.access_token, data.token.refresh_token);
                        sessionStorage.setItem("refresh_token", data.token.refresh_token);
                        sessionStorage.setItem("access_token", data.token.access_token);

                        // const profile = await fetchUserProfile(data.token.access_token);
                        const profile = await axios.get(`http://localhost:3001/user/profile?access_token=${data.token.access_token}`, {})
                        console.log("👤 Spotify Profile:", profile.data);
                        sessionStorage.setItem("userID", profile.data.id);

                        const userExists = await axios.post(
                            `http://localhost:3001/db/${profile.data.id}/cue`,
                            {
                                profile: profile.data,
                                accessToken: data.token.access_token,
                            }
                        );

                        console.log(userExists);
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

    return <p>Authenticating with Spotify...</p>;
};

export default Callback;