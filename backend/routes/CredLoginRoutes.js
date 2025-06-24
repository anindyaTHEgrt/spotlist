const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:5174/callback';

const {createToken, refreshToken} = require('../utils/TokenFunctions.js');


router.post('/token', async (req, res) => {
    const { code } = req.body; // Fix: Extract code from request body

    // Validate that code exists
    if (!code) {
        return res.status(400).json({ error: "Authorization code is required" });
    }

    const response = await createToken(code);
    console.log(response);
    return res.status(200).json(response);

});

router.post('/refresh', async (req, res) => {
    const { refresh_token } = req.body;

    const response = await refreshToken(refresh_token);
    console.log(response);
    return res.status(200).json(response);
});

// export default router;
module.exports = router;

