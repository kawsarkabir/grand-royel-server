import express from "express";
import {
  createUser,
  deleteUser,
  getCurrentUser,
  getUsers,
} from "../controllers/userController.js";
import { verifyFirebaseToken } from "@/middleware/auth.js";

const router = express.Router();

// Create or get user profile
router.post("/", verifyFirebaseToken, createUser);
router.get("/", getUsers);
router.get("/me", verifyFirebaseToken, getCurrentUser);
router.delete("/:id", verifyFirebaseToken, deleteUser);

export default router;
