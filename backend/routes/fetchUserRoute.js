const express = require('express');
const axios = require('axios');
const cors = require('cors');

const router = express.Router();

const {fetchUserProfile} = require('../utils/fetchUserProfile.js');

router.get('/profile', async (req, res) => {
    // const access_token = req.body;
    const access_token = req.query.access_token;
    if (!access_token) {
        console.log("Access token not found");
    }
    try{
        const response = await fetchUserProfile(access_token);
        console.log("user profile: ",response);
        return res.json(response);
    }
    catch(err){
        console.log("Error fetching user:", err);
        return res.status(500).json({ error: "Failed to fetch user", details: err.message });
    }
});

module.exports = router;