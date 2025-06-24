// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    playlistId: {
        type: String,
        required: true,
    },
    playlistName: {
        type: String,
        required: true,
    },
    playlistDescription: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    tracks:{
        type: mongoose.Schema.Types.Mixed,
        required: false,
    }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);