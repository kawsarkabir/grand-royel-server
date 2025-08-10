import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import User from "../models/User.js";
import admin from "../config/firebase.js";

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { uid } = req.user;

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // Get user info from Firebase
    const firebaseUser = await admin.auth().getUser(uid);

    // Create new user in MongoDB
    const newUser = new User({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
      role: "user",
    });

    await newUser.save();
    console.log("new user register", newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error creating user:", message);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

// Get all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({})
      .select("_id uid email displayName photoURL role createdAt")
      .lean()
      .exec();

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      role: user.role || "user",
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    }));

    return res.status(200).json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching users:", message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      details: process.env.NODE_ENV === "development" ? message : undefined,
    });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, error: "Missing user ID" });
    }

    // Prevent users from deleting themselves
    if (req.user?.uid === id) {
      return res.status(400).json({
        success: false,
        error: "You cannot delete your own account",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Delete user error:", message);
    return res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
};

// Get current authenticated user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { uid } = req.user;
    const user = await User.findOne({ uid })
      .select("_id uid email displayName photoURL role createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Get current user error:", message);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch user" });
  }
};
