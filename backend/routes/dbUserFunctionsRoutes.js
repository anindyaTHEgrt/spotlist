const User = require("../models/User");
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();

require('dotenv').config();
const {checkUserExists, registerUser} = require('../utils/dbUserOperations.js');


//CUE  = CHECK USER EXISTS
router.post('/:id/cue', async (req, res) => {
    const id = req.params.id;
    const {profile, accessToken}  = req.body;

    const exists = await checkUserExists(id);
    if (exists) {
        return res.status(200).json({ exists: true });
        // console.log("route/ user  exists");
    }
    else{
        const regConf = registerUser(profile, accessToken);
        return res.status(200).json({ exists: false });
        // console.log("route/ user doesnt exists");
    }

});

// CNU = CREATE NEW USER
router.post('/:id/cnu', async (req, res) => {
    const id = req.params.id;
    const {profile, accessToken}  = req.body;
    const regConf = registerUser(profile, accessToken);
});
//



module.exports = router;