const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();

const {getInterpretation} = require('../utils/aiOperations.js');

router.post('/interpret', async (req, res) => {
    const vibe = req.body.vibe;
    if(!vibe) {
        console.log("vibe not found");
        return res.status(401).json({});
    }
    try{
        const geminiResponse = await getInterpretation(vibe);
        console.log(geminiResponse);
        return res.status(200).json(geminiResponse);
    }
    catch(err){
        console.log("Error fetching interpretation:", err);
        return res.status(401).json({});
    }

});
module.exports = router