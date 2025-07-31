import { Request, Response } from "express";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { roomId, date } = req.body;

    const existingBooking = await Booking.findOne({ roomId });
    if (existingBooking) {
      return res.status(400).json({ error: "Room already booked!" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const newBooking = await Booking.create({
      userEmail: req.user?.email,
      roomId,
      date,
      roomName: room.name,
      roomPrice: room.price,
      roomImage: room.images[0] || "",
    });

    await Room.findByIdAndUpdate(roomId, { available: false });

    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Failed to book room" });
  }
};

// controllers/booking.controller.ts
export const getUserBookings = async (req: Request, res: Response) => {
  console.log("Received request for bookings with user:", req.user);

  try {
    if (!req.user?.email) {
      console.error("No user email found in request");
      return res
        .status(401)
        .json({ error: "Unauthorized - User email missing" });
    }

    const bookings = await Booking.find({ userEmail: req.user.email });
    console.log("Found bookings:", bookings);

    const populated = await Promise.all(
      bookings.map(async (booking) => {
        const room = await Room.findById(booking.roomId);
        if (!room) {
          console.warn(`Room not found for booking ${booking._id}`);
          return null;
        }
        return {
          id: booking._id,
          roomId: room._id,
          roomName: room.name,
          roomImage: room.images[0],
          price: room.price,
          bookedDate: booking.date,
          status: "confirmed",
        };
      })
    );

    const validBookings = populated.filter(Boolean);
    console.log("Processed bookings:", validBookings);
    res.json(validBookings);
  } catch (err) {
    console.error("Bookings error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { newDate } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { date: newDate },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking updated", booking });
  } catch (err) {
    console.error("Failed to update booking:", err);
    res.status(500).json({ error: "Failed to update booking" });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await Room.findByIdAndUpdate(booking.roomId, { available: true });
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Failed to cancel booking:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};
