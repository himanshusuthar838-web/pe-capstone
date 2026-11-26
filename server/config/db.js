const mongoose = require("mongoose");

// Cache the connection across serverless invocations (and hot reloads in dev)
let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_URI, { bufferCommands: false })
            .then((m) => {
                console.log("MongoDB Connected");
                return m;
            })
            .catch((error) => {
                cached.promise = null; // allow retry on next request
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

module.exports = connectDB;
