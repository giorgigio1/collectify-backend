import express from "express";
import { Card } from "../models/card";
import { AuthRequest } from "../middleware/auth";
import { User } from "../models/user";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cards = await Card.find({});

    res.status(200).json(cards);
  } catch (error) {
    console.error("Failed to fetch cards:", error);
    res.status(500).json({ message: "Failed to fetch cards" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  const { name, description, image, topic, authorId } = req.body;
  const { user } = req.session;

  // თუ ადმინია მარტო იმ შემთხვევაში გამოიყენე body-ში გადმოცემული authorId
  // სხვა შემთხვევაში default ავტორი დალოგინებული user-ია
  let author = user.role === "admin" && authorId ? authorId : user.id;

  try {
    const card = new Card({
      name,
      description,
      topic,
      image,
      author,
    });

    await card.save();

    res.status(200).json(card);
  } catch (error) {
    console.error("Failed to create card:", error);
    res.status(500).json({ message: "Failed to create card" });
  }
});

router.put("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, description, image, topic } = req.body;

  try {
    const result = await Card.updateOne(
      { _id: id },
      { name, description, topic, image }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to update card:", error);
    res.status(500).json({ message: "Failed to update card" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const result = await Card.deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to delete card:", error);
    res.status(500).json({ message: "Failed to delete card" });
  }
});