const User = require("../models/User");
const checkUserExists = async (id) => {
    if(!id){
        throw new Error('No ID provided');
    }
    try{

        const UserExists = await User.exists({id:id});
        if(UserExists){
            console.log("User exists");
            return true;
        }
        else{
            console.log("User does not exist");
            return false;
        }
    }
    catch(e){
        console.error("Server error:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
}