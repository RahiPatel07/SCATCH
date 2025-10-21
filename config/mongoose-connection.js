const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');
const config = require('config');

// Use environment variable if available (for production), otherwise use config (for development)
const mongoURI = process.env.MONGODB_URI || `${config.get("MONGODB_URI")}/scatch`;

mongoose
    .connect(mongoURI)
    .then(function(){
        dbgr("Connected to MongoDB");
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch(function(err){
        dbgr("MongoDB connection error:", err);
        console.error("❌ MongoDB Connection Failed:", err.message);
    });

module.exports = mongoose.connection;