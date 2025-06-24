const User = require("../models/User");
const checkUserExists = async (id) => {
    if(!id){
        throw new Error('No ID provided');
    }
    try{

        const UserExists = await User.exists({id:id});
        if(UserExists){
            console.log("User exists");
            return UserExists;
        }
        else{
            console.log("User does not exist");
            return UserExists;
        }
    }
    catch(e){
        console.error("Server error:", e);
        // return res.status(500).json({ error: "Internal server error" });
    }
}

const registerUser = async (profile, accesstoken) => {
    if(!profile){
        throw new Error("No profile provided");
    }
    if(!accesstoken){
        throw new Error("No access Token provided");
    }
    const name= profile.display_name    ;
    const email= profile.email;
    const id = profile.id;
    const profileImgUrl = profile.images[0].url;
    const productType = profile.product;
    const userHref = profile.href;
    const accessToken = accesstoken;

    try {
        const user = new User({name, email, id, profileImgUrl, productType, userHref, accessToken});
        const savedUser = await user.save();
        console.log("Saved Successfully - ",savedUser);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
};

const getAccessToken = async (id) => {
    try {
        const user = await User.findOne({ id: id });

        if (!user) {
            console.error("No user found");
            return null; // Important: return early
        }

        return user.accessToken; // Safe to access now
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
};

module.exports = { checkUserExists, registerUser, getAccessToken };