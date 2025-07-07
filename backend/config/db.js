const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
    }
    catch(e){
        console.error(e + "Error connecting to DB");
        process.exit(1);
    }
}
module.exports = connectDB;