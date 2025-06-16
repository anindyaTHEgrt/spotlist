const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:5174/callback';

app.post('/api/token', async (req, res) => {
    const { code } = req.body; // Fix: Extract code from request body

    // Validate that code exists
    if (!code) {
        return res.status(400).json({ error: "Authorization code is required" });
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

        res.json({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type
        });
    } catch (err) {
        console.error("❌ Token error:", err.response?.data || err.message);

        // Send more specific error information
        if (err.response?.data) {
            res.status(err.response.status).json({
                error: err.response.data.error,
                error_description: err.response.data.error_description
            });
        } else {
            res.status(500).json({ error: "Token exchange failed" });
        }
    }
});

// Add a refresh token endpoint
app.post('/api/refresh', async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ error: "Refresh token is required" });
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

        res.json({
            access_token: response.data.access_token,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type
        });
    } catch (err) {
        console.error("❌ Refresh token error:", err.response?.data || err.message);
        res.status(500).json({ error: "Token refresh failed" });
    }
});

app.listen(3001, () => {
    console.log('Backend running at http://localhost:3001');
});