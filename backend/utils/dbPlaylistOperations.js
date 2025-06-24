const Playlist = require("../models/Playlist");
const storePlaylist = async (playlistData) => {
    if(!playlistData){
        throw new Error('No playlist Data provided provided');
    }
    try{
        const playlistID = playlistData.id;
        const playlistName = playlistData.name;
        const playlistDescription = playlistData.description;
        const userID = playlistData.owner.id;
        const userName = playlistData.owner.display_name;

        try {
            const playlist = new Playlist({playlistID, playlistName, playlistDescription, userID, userName});
            const savedPlaylist = await playlist.save();
            console.log("Saved Successfully - ",savedPlaylist);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    catch(e){
        console.error("Server error (dbplo):", e);
        // return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {storePlaylist};