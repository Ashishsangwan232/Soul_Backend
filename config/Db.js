//connection with database
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("MONGO_URI is not defined in the .env file");
    process.exit(1);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoURI);
        // console.log(`Successfully connected MongoDB: ${conn.connection.host}`);// this and .then() are doing same work
        console.log(`Successfully connected to Server`);// this and .then() are doing same work
        // .then(() => console.log("Successfully connected to MongoDB."))

    } 
    catch (error) {
        console.error("Connection error", error);
        process.exit();
    }
};
module.exports = connectDB;
