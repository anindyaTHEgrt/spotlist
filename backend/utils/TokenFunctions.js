const express = require('express');
const axios = require('axios');

require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
// const redirect_uri = 'http://127.0.0.1:5174/callback';
const redirect_uri = 'https://spotlist.onrender.com/callback';



const createToken = async (code) =>{
    if (!code) {
        return { error: "Authorization code is required" };
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
        console.log("🔄 Requesting token with code:", code.substring(0, 10) + "...");

        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authHeader}`,
            }
        });

        console.log("✅ Token received successfully");

        return {
            success: true,
            token: {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_in: response.data.expires_in,
                token_type: response.data.token_type
            }
        };
    } catch (err) {
        console.error("❌ Token error:", err.response?.data || err.message);

        return {
            success: false,
            error: err.response?.data || "Token exchange failed"
        };
    }
}

const refreshToken = async (refresh_token) => {
    if (!refresh_token) {
        return { error: "Authorization code is required" };
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authHeader}`,
            }
        });

        return {
            success: true,
            token: {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_in: response.data.expires_in,
            }
        };
    } catch (err) {
        console.error("❌ Refresh token error:", err.response?.data || err.message);
        return { error: "Token refresh failed" };
    }
}

module.exports = {createToken, refreshToken};