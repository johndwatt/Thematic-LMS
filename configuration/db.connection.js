const mongoose = require('mongoose');

require("dotenv").config();
const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/lms";

mongoose.connect(connectionString, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
    console.log("=== MongoDB Connected ===");
});

mongoose.connection.on("error", (error) => {
    console.log("=== MongoDB error ===", error);
});

mongoose.connection.on("disconnected", () => {
    console.log("=== MongoDB disconnected ===");
});