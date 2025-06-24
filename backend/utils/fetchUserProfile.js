

const fetchUserProfile = async (access_token) => {
    if(!access_token) {
        throw new Error("No access token provided");
    }
    try{
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status}`);
        }
        const profile = await response.json();

        return profile;
    }
    catch(e){
    console.error("Failed to reach Spotify API: ", e);
    throw e;
    }
};
module.exports = {fetchUserProfile};