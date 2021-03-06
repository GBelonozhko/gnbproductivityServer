const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

const authRoutes = require("./routes/auth");
const todolistRoutes = require("./routes/todolist");
const numtrackerRoutes = require("./routes/numtracker");
const journalRoutes = require('./routes/journal')

const dotenv = require("dotenv");
const { json } = require("body-parser");
dotenv.config();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));

app.use(bodyParser());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", todolistRoutes);
app.use("/api", numtrackerRoutes);
app.use("/api", journalRoutes)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
