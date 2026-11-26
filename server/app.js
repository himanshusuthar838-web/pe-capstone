const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// CLIENT_URL can be a comma-separated list, e.g. "https://taskflow.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser requests (curl, health checks) and any origin if CLIENT_URL isn't set
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "To-Do API is running",
    });
});

// Make sure the DB is connected before any API route runs
app.use("/api", async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

module.exports = app;
