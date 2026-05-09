const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const databaseRoutes = require("./routes/databaseRoutes");

const app = express();


// Security Middleware
app.use(helmet());


// CORS Middleware
app.use(cors());


// Request Logger
app.use(morgan("dev"));


// Body Parser
app.use(express.json());


// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

app.use("/api/databases", databaseRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LIMN CORE API RUNNING"
    });
});


module.exports = app;