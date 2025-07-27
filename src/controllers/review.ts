import { Request, Response } from "express";
import Review from "../models/Review.js";
import Room from "../models/Room.js";

export const getRoomReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ roomId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { roomId, rating, comment, username, photoURL } = req.body;

    const review = await Review.create({
      username,
      photoURL,
      roomId,
      userEmail: req.user?.email,
      rating,
      comment,
    });

    // Update room rating
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
    console.error("Failed to create review:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().populate("roomId");
    res.json(reviews);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};
