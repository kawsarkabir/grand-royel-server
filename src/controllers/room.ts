import { Request, Response } from "express";
import Room from "../models/Room.js";

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const filter: any = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (err) {
    console.error("Failed to fetch rooms:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (err) {
    console.error("Failed to fetch room:", err);
    res.status(500).json({ error: "Server error" });
  }
};
