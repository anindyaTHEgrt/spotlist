const axios = require('axios');
const {storePlaylist} = require('./dbPlaylistOperations');
const {getAccessToken} = require('./dbUserOperations');

const makePlaylist = async (data) => {
    // const name = data.name;
    // const desc = data.description;
    // const privType  = false;
    // const accessToken = data.accessToken;

    const apiURL = `https://api.spotify.com/v1/users/${data.id}/playlists`;
    const bodydata = {
        name: data.playlistName,
        desc: data.vibe,
        privType: false
    };

    // accessToken = await getAccessToken(data.id);

    try{
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${data.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodydata)
        });
        const responsedata = await response.json();
        console.log(responsedata);
        //storing playlist in database.
        const responseDB = await storePlaylist(responsedata);
        console.log(responseDB);
        return responseDB;
    }
    catch(error){
        console.error('Error creating playlist:', error.response?.data || error.message);
    }
}
module.exports = {makePlaylist};