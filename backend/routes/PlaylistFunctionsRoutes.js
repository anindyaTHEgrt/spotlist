const express = require('express');
const axios = require('axios');
const cors = require('cors');

const {makePlaylist, addToPlaylist} = require("../utils/PlaylistFunctions.js");

const router = express.Router();

router.post('/:id/create', async (req, res) => {

    try{
        const response = await makePlaylist(req.body);
        console.log(response);
        return res.status(200).json(response);
    }
    catch (e) {
        console.error("Error from playlistfunctions",e);
    }

});

router.post('/addtrack', async (req, res) => {

    try{
        const response = await addToPlaylist(req.body);
        console.log(response);
        return res.status(200).json(response);
    }
    catch (e) {
        console.error("Error adding songs to playlist",e);
    }

});

module.exports = router;