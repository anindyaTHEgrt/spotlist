const express = require('express');
const axios = require('axios');
const cors = require('cors');
const {makePlaylist} = require("../utils/PlaylistFunctions.js");
const router = express.Router();

router.post('/:id/create', async (req, res) => {
    // const id = req.params.id;
    //
    // const name = req.body.playlistName;
    // const desc = req.body.vibe;
    // const accessToken = req.body.accessToken;

    // const reqBody = {
    //     id: id,
    //     name: name,
    //     desc: desc,
    //     accessToken: accessToken
    // };
    try{
        // console.log("PLFR: ",reqBody);
        const response = await makePlaylist(req.body);
        console.log(response);
        return res.status(200).json(response);
    }
    catch (e) {
        console.error("Error from playlistfunctions",e);
    }

});

module.exports = router;