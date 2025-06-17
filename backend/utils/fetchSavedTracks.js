export const fetchSavedTracks = async (access_token) => {
    const allTracks = [];
    let offset = 0;
    const limit = 50;
    let total = null;

    if(!access_token) {
        throw new Error("No access token provided");
    }
    try{
        while(true){
            const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Spotify API error: ${response.status}`);
            }
            const data = await response.json();
            allTracks.push(...data.items);

            if(total === null) total = data.total;
            offset += limit;

            if(offset >= total) break;
        }
        const simplifiedTracks = allTracks.map(item => ({
            albumName: item.track.album.name,
            albumImg: item.track.album.images[0],
            albumId: item.track.album.id,
            artist: item.track.artists.map(a => a.name).join(", "),
            trackName: item.track.name,
            id: item.track.id,
            popularity: item.track.popularity
        }));
        return simplifiedTracks;
        // return allTracks;
    }
    catch(e){
        console.error("Failed to reach Spotify API: ", e);
        throw e;
    }
};