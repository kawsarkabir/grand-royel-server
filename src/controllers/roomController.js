import Room from "../models/Room.js";

// GET: FOR ALL DATA WITH FILTERING
export const getAllRooms = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const query = {};
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// GET: FOR SINGLE DATA
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
