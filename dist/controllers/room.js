import Room from "../models/Room.ts";
export const getAllRooms = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const filter = {};
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        const rooms = await Room.find(filter);
        res.json(rooms);
    }
    catch (err) {
        console.error("Failed to fetch rooms:", err);
        res.status(500).json({ error: "Server error" });
    }
};
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        res.json(room);
    }
    catch (err) {
        console.error("Failed to fetch room:", err);
        res.status(500).json({ error: "Server error" });
    }
};
