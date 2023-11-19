import express from "express";
import { User } from "../models/user";
import { Item } from "../models/item";

export const router = express.Router();

router.post("add-item", async (req, res) => {
  try {
    const { fullname, description, userId } = req.body;

    const item = new Item({
      fullname,
      description,
      owner: userId,
    });

    await item.save();

    const user = await User.findById(userId);
    user.ownedItems.push(item.id);
    await user.save();

    res
      .status(201)
      .json({ message: "Item added and associated with the user" });
  } catch (error) {
    console.error("Iem creaton error:", error);
    res.status(500).json({ messae: "Failed to create item" });
  }
});
