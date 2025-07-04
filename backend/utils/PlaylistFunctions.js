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
        const playlistData = {
            DBresponse: responseDB,
            spotifyData: responsedata
        }
        return playlistData;
    }
    catch(error){
        console.error('Error creating playlist:', error.response?.data || error.message);
    }
}


const addToPlaylist = async (data) => {

    const apiURL = `https://api.spotify.com/v1/playlists/${data.playlistId}/tracks`;
    const bodydata = {
        uris: [
            data.trackUri,
        ],
        position: 0
    };

    try{
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${data.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodydata)
        });
        const responsedata = await response.json();
        console.log(responsedata);
        return responsedata;
    }
    catch(error){
        console.error('Error creating playlist:', error.response?.data || error.message);
    }
}


module.exports = {makePlaylist, addToPlaylist};


/*
THIS IS CODE FOR SONGCARD:
// if(direction === "up"){
        //     console.log(`Added to playlist: ${playlistName}`);
        //     const ans = sendToPlaylist(playlistID);
        // }


        const [trackUri, setTrackUri] = useState(null);


        setTrackUri(trackData.data.trackUri); // for UI
                trackUri.current = trackData.data.trackUri; // for logic


    // const sendToPlaylist = async (playlistId) => {
    //     const access_token = sessionStorage.getItem("access_token");
    //     const songId = recommendedTrackID.current;
    //     const data = {
    //         playlistId: playlistId,
    //         access_token: access_token,
    //         songId: songId,
    //         trackUri: trackUri
    //     };
    //
    //     const response = await axios.post(`http://localhost:3001/playlist/addtrack`, data);
    //     console.log(response);
    // }
 */