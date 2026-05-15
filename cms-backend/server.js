const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// app.use(cors());
app.use(cors({
  origin: "*"
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("CRM API Running");
});

app.use("/api/leads", require("./routes/leadRoutes"));

app.listen(5000, () => console.log("🚀 Server running on port 5000"));