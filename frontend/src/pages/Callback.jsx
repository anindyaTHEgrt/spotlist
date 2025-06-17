import React from 'react'
import {Link} from 'react-router'
import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import {fetchUserProfile} from "../../../backend/utils/fetchUserProfile.js"



const Callback = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            handleTokenExchange(code);
        }
    }, []);

    const handleTokenExchange = async (code) => {
        try {
            const res = await fetch("http://localhost:3001/api/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();

            if (data.access_token) {
                console.log("✅ Access Token:", data.access_token);
                console.log("🔁 Refresh Token:", data.refresh_token);

                // Store tokens in context
                login(data.access_token, data.refresh_token);

                // Fetch user profile for testing
                const profile = await fetchUserProfile(data.access_token);
                console.log("👤 Spotify Profile:", profile);
                // Navigate back to homepage
                navigate("/");
            } else {
                console.error("❌ Failed to get access token:", data);
            }
        } catch (err) {
            console.error("🚨 Token exchange error:", err);
        }
    };

    return <p>Authenticating with Spotify...</p>;
};

export default Callback;