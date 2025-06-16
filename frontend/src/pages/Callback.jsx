import React from 'react'
import {Link} from 'react-router'
import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";



const Callback = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        console.log('Callback 1');
        const code = new URLSearchParams(window.location.search).get('code');

        fetch('http://localhost:3001/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        })
            .then(res => res.json())
            .then(data => {
                console.log("Access Token:", data.access_token);
                login(data.access_token, data.refresh_token); // ✅ Store in context
                navigate("/");
                // Store token or redirect
                fetch("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`,
                    },
                })
                    .then(res => res.json())
                    .then(profile => {
                        console.log("✅ Spotify Profile:", profile);
                    });
            });
    }, []);

    return <div>Logging you in...</div>;
}

export default Callback