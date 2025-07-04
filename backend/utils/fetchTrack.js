const fetchTrack = async (access_token, trackID) => {
    if(!access_token) return "Access Token not sent by client";
    if(!trackID) return "Track ID not sent by client";
    try{
        const trackDataFromAPI = await fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
        const trackData = await trackDataFromAPI.json();
        const track = {
            trackID: trackData.id,
            trackName: trackData.name,
            trackImg: trackData.album.images[0].url,
            trackArtists: trackData.artists.map(a => a.name).join(", "),
            trackUri: trackData.uri
        }
        console.log(track);
        return track;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

module.exports = {fetchTrack};