import express from "express";
import { Card } from "../models/card";
import { AuthRequest } from "../middleware/auth";
import { Collection } from "../models/collection";
import { ObjectId } from "mongoose";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cards = Card.find({});

    res.status(200).json(cards);
  } catch (error) {
    console.error("Failed to fetch cards:", error);
    res.status(500).json({ message: "Failed to fetch cards" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { user } = req.session;
    const { id } = req.params;

    const { name, description, image, topic, collectionId, authorId } =
      req.body;
    const collection = await Collection.findById(collectionId);
    if (collection.author.toString() !== user.id && user.role === "user") {
      res.status(500).json({ message: "Failed to create card" });
    } else {
      let author = user.role === "admin" && authorId ? authorId : user.id;
      const card = new Card({
        name,
        description,
        topic,
        image,
        author,
      });
      const cardDocument = await card.save();
      const cardId = cardDocument._id;

      const result = await Collection.findOneAndUpdate(
        { _id: collectionId },
        { $push: { cards: cardId } },
        { returnDocument: "after" }
      ).populate("cards author");

      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Failed to create card:", error);
    res.status(500).json({ message: "Failed to create card" });
  }
});

router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { user } = req.session;
    const { id } = req.params;

    const collection = await Collection.findOne({ cards: id });

    if (collection.author.toString() !== user.id && user.role === "user") {
      res.status(500).json({ message: "Failed to update card" });
    } else {
      const { name, description, image, topic } = req.body;
      const result = await Card.updateOne(
        { _id: id },
        { name, description, topic, image }
      );

      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Failed to update card:", error);
    res.status(500).json({ message: "Failed to update card" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { user } = req.session;
    const { id } = req.params;

    const collection = await Collection.findOne({ cards: id });

    if (collection.author.toString() !== user.id && user.role === "user") {
      res.status(500).json({ message: "Failed to delete card" });
    } else {
      await Card.deleteOne({ _id: id });

      const result = await Collection.findOneAndUpdate(
        { cards: id },
        { $pull: { cards: id } },
        { returnDocument: "after" }
      ).populate("cards author");

      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Failed to delete card:", error);
    res.status(500).json({ message: "Failed to delete card" });
  }
});
