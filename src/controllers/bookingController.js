import Booking from "../models/Booking.js";
import Room from "../models/Room.js"; // ✅ Must import Room

export const createBooking = async (req, res) => {
  try {
    const { roomId, date, guests } = req.body;
    console.log(req.body);

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.isAvailable) {
      return res.status(400).json({ message: "Room is not available" });
    }

    const booking = await Booking.create({
      roomId,
      date,
      guests,
    });

    room.isAvailable = false;
    await room.save();

    res.status(201).json({
      message: "Room booked successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error); // 👈 Add for debug
    res.status(500).json({ message: "Server error", error });
  }
};
