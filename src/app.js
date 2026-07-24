const express = require("express");
const cors = require("cors");

var morgan = require('morgan');

const leaveRoutes = require("./routes/leave.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Health Check / Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Management API is Running 🚀",
  });
});

app.use("/api/leaves", leaveRoutes);
app.use("/api/auth", authRoutes);
module.exports = app;