const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:3000"], // your frontend URL here
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const RoomSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  available: Boolean,
});

const Room = mongoose.model("Room", RoomSchema);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// GET Single Room
app.get("/api/rooms/:id", async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
