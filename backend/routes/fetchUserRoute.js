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
        console.log(response);
        return response;
    }
    catch(err){
        console.log("Error fetching user:", err);
    }
});

module.exports = router;