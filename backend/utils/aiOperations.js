const axios = require('axios');
const {GoogleGenAI } = require('@google/genai');
const {response} = require("express");

require('dotenv').config();

const getInterpretation = async (data) => {
    const geminiAPI = process.env.GEM_API_KEY;
    const ai = new GoogleGenAI({apiKey: geminiAPI});



    const content = `below are some examples of promts and the kind of song that goes with that prompt. these are song characteristcs that define the song and the prompt. you will be given a prompt and you have to return an output just like what is given in the examples below.
rainy upbeat long drive : danceability: 0.7, energy: 0.6, key: 5, loudness: -8.5, mode: 1, speechiness: 0.05, acousticness: 0.4, instrumentalness: 0.2, liveness: 0.1, valence: 0.7, tempo: 118, duration_ms: 235000
gym hype strength : danceability: 0.85, energy: 0.95, key: 7, loudness: -4.0, mode: 1, speechiness: 0.15, acousticness: 0.1, instrumentalness: 0.05, liveness: 0.2, valence: 0.8, tempo: 140, duration_ms: 200000
sad breakup songs : danceability: 0.3, energy: 0.3, key: 0, loudness: -12.0, mode: 0, speechiness: 0.03, acousticness: 0.8, instrumentalness: 0.1, liveness: 0.08, valence: 0.15, tempo: 75, duration_ms: 280000
chill study focus : danceability: 0.4, energy: 0.3, key: 3, loudness: -15.0, mode: 1, speechiness: 0.02, acousticness: 0.6, instrumentalness: 0.9, liveness: 0.05, valence: 0.4, tempo: 90, duration_ms: 300000
summer party vibes : danceability: 0.9, energy: 0.85, key: 9, loudness: -5.0, mode: 1, speechiness: 0.08, acousticness: 0.2, instrumentalness: 0.01, liveness: 0.3, valence: 0.9, tempo: 125, duration_ms: 210000
romantic dinner : danceability: 0.5, energy: 0.4, key: 2, loudness: -10.0, mode: 1, speechiness: 0.03, acousticness: 0.7, instrumentalness: 0.3, liveness: 0.1, valence: 0.6, tempo: 100, duration_ms: 240000
angry workout : danceability: 0.75, energy: 0.95, key: 4, loudness: -3.5, mode: 0, speechiness: 0.25, acousticness: 0.05, instrumentalness: 0.02, liveness: 0.35, valence: 0.3, tempo: 150, duration_ms: 190000

promt: ${data}`;

    const countTokensResponse = await ai.models.countTokens({
        model: "gemini-2.0-flash",
        contents: data,
    });
    if(countTokensResponse.totalTokens <= 40){
        try{
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: content,
            });
            console.log(response.text);
            return response;
        }
        catch(error){
            console.error("Error from Gemini API",error.response?.data || error.message);
            return error.response;
        }
    }
    else{
        return "Playlist Vibe too long. shorten it.";
    }


}
module.exports = {getInterpretation};