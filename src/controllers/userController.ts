import User from "../models/User.js";
import admin from "../config/firebase.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.user; // From Firebase token

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
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Fetch users with proper null checks
    const users = await User.find({})
      .select("_id uid email displayName photoURL role createdAt")
      .lean()
      .exec();

    // Safely format the response
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      role: user.role || "user",
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
};
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ uid })
      .select("_id uid email displayName photoURL role createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
};
