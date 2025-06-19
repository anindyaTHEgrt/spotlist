const User = require("../models/User");
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();

require('dotenv').config();
const {checkUserExists, registerUser} = require('../utils/dbUserOperations.js');

router.post('/:id/cue', async (req, res) => {
    const id = req.params.id;
    const profile  = req.body;
    // if(!id){
    //     return res.status(400).json({ error: "No ID provided" });
    // }
    // try{
    //
    //     const UserExists = await User.exists({id:id});
    //     if(UserExists){
    //         console.log("User exists");
    //         return res.status(200).json({ exists: true });
    //     }
    //     else{
    //         console.log("User does not exist");
    //         return res.status(404).json({ exists: false });
    //     }
    // }
    // catch(e){
    //     console.error("Server error:", e);
    //     return res.status(500).json({ error: "Internal server error" });
    // }
    const exists = checkUserExists(id);
    if (exists) {
        return res.status(200).json({ exists: true });
        // console.log("route/ user  exists");
    }
    else{
        const regConf = registerUser(profile);
        return res.status(200).json({ exists: false });
        // console.log("route/ user doesnt exists");
    }

});

router.post('/:id/cnu', async (req, res) => {
    const id = req.params.id;
    const profile = req.body;
    const regConf = registerUser(profile);
});
//



module.exports = router;