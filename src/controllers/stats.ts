import { Request, Response } from "express";
import User from "../models/User.js";
import Room from "../models/Room.js";

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();

    //TODO: You can add revenue and bookings later here

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRooms,
        // revenue: 0,
        // bookings: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching stats",
    });
  }
};
