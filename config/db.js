const mongoose = require('mongoose');


const cononectionDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://rootloginter:1234@cluster0.4y9i5aq.mongodb.net/');
        console.log("MongoDB connected");
    } catch (error) {
        console.log("DB connection error", error);
    }
}

module.exports = cononectionDB;