import express from "express";
import { verifyFirebaseToken } from "../middleware/auth.ts";
import { createReview, getAllReviews, getRoomReviews } from "../controllers/review.ts";
const router = express.Router();
router.get("/", getAllReviews);
router.get("/:id/reviews", getRoomReviews);
router.post("/", verifyFirebaseToken, createReview);
export default router;
