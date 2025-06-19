// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    profileImgUrl:{
        type: String,
        required: true,
    },
    productType:{
        type: String,
        required: true,
    },
    userHref: {
        type: String,
        required: true,
    }
});

// const User = mongoose.model('User', UserSchema);
// export default User;
module.exports = mongoose.model('User', UserSchema);