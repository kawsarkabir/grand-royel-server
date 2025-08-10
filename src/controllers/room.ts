import { Request, Response } from "express";
import Room from "../models/Room.js";

export const addRoom = async (req: Request, res: Response) => {
  try {
    const requiredFields = [
      "name",
      "description",
      "price",
      "guests",
      "beds",
      "bathrooms",
      "location",
      "host",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const requiredHostFields = ["name", "joined", "superhost", "avatar"];
    for (const field of requiredHostFields) {
      if (!req.body.host[field] && field !== "superhost") {
        return res.status(400).json({ error: `host.${field} is required` });
      }
    }

    const room = new Room({
      ...req.body,
      host: {
        name: req.body.host.name,
        joined: req.body.host.joined,
        superhost: req.body.host.superhost || false,
        avatar: req.body.host.avatar,
      },
      available: req.body.available ?? true,
      rating: req.body.rating || 0,
      totalReviews: req.body.totalReviews || 0,
    });

    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
};

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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
};

export const getRoomById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
};

export const updateRoom = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID format",
      });
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: message,
    });
  }
};

export const deleteRoom = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID format",
      });
    }

    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
      data: deletedRoom,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: message,
    });
  }
};
