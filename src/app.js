const express = require("express");
const cors = require("cors");

const leaveRoutes = require("./routes/leave.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leaves", leaveRoutes);
app.use("/api/auth", authRoutes);
module.exports = app;