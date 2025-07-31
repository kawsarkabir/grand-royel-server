import express from "express";
import { verifyFirebaseToken } from "../middleware/auth.js";
import {
  createBooking,
  deleteBooking,
  getUserBookings,
  updateBooking,
} from "../controllers/booking.js";

const router = express.Router();

router.post("/", verifyFirebaseToken, createBooking);
router.get("/my-bookings", verifyFirebaseToken, getUserBookings);
router.patch("/:id", verifyFirebaseToken, updateBooking);
router.delete("/:id", verifyFirebaseToken, deleteBooking);

export default router;
