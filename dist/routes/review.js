import express from "express";
import { verifyFirebaseToken } from "../middleware/auth";
import { createReview, getAllReviews, getRoomReviews, } from "../controllers/review";
const router = express.Router();
router.get("/", getAllReviews);
router.get("/:id/reviews", getRoomReviews);
router.post("/", verifyFirebaseToken, createReview);
export default router;
