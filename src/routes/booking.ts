import express from "express";
import { verifyFirebaseToken } from "../middleware/auth";
import {
  createBooking,
  deleteBooking,
  getUserBookings,
  updateBooking,
} from "../controllers/booking";

const router = express.Router();

router.post("/", verifyFirebaseToken, createBooking);
router.get("/my-bookings", verifyFirebaseToken, getUserBookings);
router.patch("/:id", verifyFirebaseToken, updateBooking); 
router.delete("/:id", verifyFirebaseToken, deleteBooking); 

export default router;
