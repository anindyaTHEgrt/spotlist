const express = require('express');
const axios = require('axios');
const cors = require('cors');

const router = express.Router();

const {fetchTrack} = require('../utils/fetchTrack.js');

router.get('/fetchTrack', async (req, res) => {
    const access_token = req.query.access_token;
    const trackID = req.query.trackID;
    try{
        const trackResponse = await fetchTrack(access_token, trackID);
        res.status(200).json(trackResponse);
    }
    catch(err){
        console.log(err);
    }

})

module.exports = router;