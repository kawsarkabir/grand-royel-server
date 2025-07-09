// index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const path = require("path");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ========= Firebase Admin Initialization =========
const serviceAccount = require("./firebase-adminsdk.json"); // download from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ========= Middleware =========
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("❌ Firebase token verification failed:", err);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// ========= MongoDB Models =========
const RoomSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: [String], // array of image URLs
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  guests: Number,
  beds: Number,
  bathrooms: Number,
  location: String,
  host: {
    name: String,
    joined: String,
    superhost: Boolean,
    avatar: String,
  },
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
  userEmail: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Review = mongoose.model("Review", ReviewSchema);

// ========= MongoDB Connection =========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ========= Routes =========

// Get all rooms
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single room
app.get("/api/rooms/:id", async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

// Get reviews for a room
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

// Create booking
app.post("/api/bookings", verifyFirebaseToken, async (req, res) => {
  const { roomId, date } = req.body;

  try {
    // Check if already booked (regardless of date)
    const existingBooking = await Booking.findOne({ roomId });
    if (existingBooking) {
      return res.status(400).json({ error: "Room already booked!" });
    }

    const room = await Room.findById(roomId);

    const newBooking = await Booking.create({
      userEmail: req.user.email,
      roomId,
      date,
      roomName: room.name,
      roomPrice: room.price,
      roomImage: room.images?.[0] || "",
    });

    // ✅ Mark room as unavailable
    await Room.findByIdAndUpdate(roomId, { available: false });

    res.send({ message: "Booking confirmed", booking: newBooking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).send({ error: "Failed to book room" });
  }
});

// Get bookings for current user
app.get("/api/my-bookings", verifyFirebaseToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email });

    const populated = await Promise.all(
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

    res.send(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update booking date
app.patch("/api/bookings/:id", verifyFirebaseToken, async (req, res) => {
  const { newDate } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { date: newDate },
      { new: true }
    );
    res.json({ message: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// Delete a booking
app.delete("/api/bookings/:id", verifyFirebaseToken, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  await Room.findByIdAndUpdate(booking.roomId, { available: true });
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking cancelled" });
});

// Submit a review
app.post("/api/reviews", verifyFirebaseToken, async (req, res) => {
  const { roomId, rating, comment } = req.body;
  const userEmail = req.user.email;

  try {
    const review = await Review.create({
      roomId,
      userEmail,
      rating,
      comment,
    });

    // Update rating & totalReviews
    const reviews = await Review.find({ roomId });
    const totalReviews = reviews.length;
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await Room.findByIdAndUpdate(roomId, {
      rating: avgRating,
      totalReviews,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("Review failed:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// ========= Start Server =========
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
