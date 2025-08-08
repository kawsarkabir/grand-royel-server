import { Request, Response } from "express";
import Room from "../models/Room.js";

export const addRoom = async (req: Request, res: Response) => {
  try {
    // Validate required fields
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

    // Validate host object
    const requiredHostFields = ["name", "joined", "superhost", "avatar"];
    for (const field of requiredHostFields) {
      if (!req.body.host[field] && field !== "superhost") {
        return res.status(400).json({ error: `host.${field} is required` });
      }
    }

    // Create new room
    const room = new Room({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      images: req.body.images || [],
      guests: req.body.guests,
      beds: req.body.beds,
      bathrooms: req.body.bathrooms,
      location: req.body.location,
      amenities: req.body.amenities || [],
      host: {
        name: req.body.host.name,
        joined: req.body.host.joined,
        superhost: req.body.host.superhost || false,
        avatar: req.body.host.avatar,
      },
      available: req.body.available !== undefined ? req.body.available : true,
      rating: req.body.rating || 0,
      totalReviews: req.body.totalReviews || 0,
    });

    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    console.error("Failed to add room:", err);
    res.status(500).json({ error: "Server error" });
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

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate the ID format
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
    console.error("Error deleting room:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
