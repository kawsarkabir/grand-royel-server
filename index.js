const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());

// Dummy middleware (replace with Firebase auth later)
const verifyToken = (req, res, next) => {
  req.user = { email: "testuser@example.com" }; // Replace later with real auth
  next();
};

// ====== SCHEMAS & MODELS ======
const RoomSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  available: Boolean,
});
const Room = mongoose.model("Room", RoomSchema);

const BookingSchema = new mongoose.Schema({
  userEmail: String,
  roomId: String,
  date: String,
});
const Booking = mongoose.model("Booking", BookingSchema);

const ReviewSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", ReviewSchema);

// ====== DATABASE ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ====== ROUTES ======
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/rooms/:id", async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

app.get("/api/rooms/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ roomId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.post("/api/bookings", verifyToken, async (req, res) => {
  const { roomId, date } = req.body;

  try {
    // Check if already booked
    const existingBooking = await Booking.findOne({ roomId });
    if (existingBooking) {
      return res.status(400).json({ error: "Room already booked" });
    }

    const newBooking = await Booking.create({
      userEmail: req.user.email,
      roomId,
      date,
    });

    // Mark room as unavailable
    await Room.findByIdAndUpdate(roomId, { available: false });

    res.send({ message: "Booking confirmed", booking: newBooking });
  } catch (err) {
    res.status(500).send({ error: "Failed to book room" });
  }
});

app.get("/api/my-bookings", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email });

    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const room = await Room.findById(booking.roomId);
        return {
          id: booking._id,
          roomId: room._id,
          roomName: room.name,
          roomImage: room.image,
          price: room.price,
          bookedDate: booking.date,
          status: "confirmed",
        };
      })
    );

    res.send(populatedBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/bookings/:id", verifyToken, async (req, res) => {
  const { newDate } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { date: newDate },
      { new: true }
    );
    res.json({ message: "Booking date updated", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

app.delete("/api/bookings/:id", verifyToken, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  // Make room available again
  await Room.findByIdAndUpdate(booking.roomId, { available: true });

  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking cancelled" });
});

// POST /api/reviews
app.post("/api/reviews", verifyToken, async (req, res) => {
  const { roomId, rating, comment } = req.body;
  const userEmail = req.user.email;

  try {
    const review = await Review.create({
      roomId,
      userEmail,
      rating,
      comment,
      createdAt: new Date(),
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("Review creation failed:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// ====== START SERVER ======
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
