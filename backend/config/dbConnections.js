const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("CONNECTED: ", connect.connection.host, connect.connection.name);
    } catch (error) {
        console.log("Error: ", error);
        process.exit(1);

    }
}

module.exports = { connectDB }