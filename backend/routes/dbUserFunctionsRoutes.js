const User = require("../models/User");
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();

require('dotenv').config();

router.post('/:id/cue', async (req, res) => {
    const id = req.params.id;
    if(!id){
        return res.status(400).json({ error: "No ID provided" });
    }
    try{

        const UserExists = await User.exists({id:id});
        if(UserExists){
            console.log("User exists");
            return res.status(200).json({ exists: true });
        }
        else{
            console.log("User does not exist");
            return res.status(404).json({ exists: false });
        }
    }
    catch(e){
        console.error("Server error:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// const registerUser = async (profile) => {
//     if(!profile){
//         throw new Error("No profile provided");
//     }
//     const name= profile.name;
//     const email= profile.email;
//     const id = profile.id;
//     const accessToken = localStorage.getItem("access_token");
//     const refreshToken = localStorage.getItem("refresh_token");
//     const profileImgUrl = profile.images[0].url;
//     const productType = profile.product;
//     const userHref = profile.href;
//
//     try {
//         const user = new User({name, email, id, accessToken, refreshToken, profileImgUrl, productType, userHref});
//         const savedUser = await user.save();
//         console.log("Saved Successfully - ",savedUser);
//     }
//     catch (e) {
//         console.error(e);
//     }
//
//
// };
//
module.exports = router;