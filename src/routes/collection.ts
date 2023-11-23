import express from "express";
import { User } from "../models/user";
import { Collection } from "../models/collection";
import { AuthRequest, authMiddleware } from "../middleware/auth";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find({}).populate("cards author");
    res.status(200).json(collections);
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    res.status(500).json({ message: "Failed to fetch collection" });
  }
});
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { user } = req.session;

    const collectionId = req.params.id;
    const collection = await Collection.findById(collectionId);
    if (collection.author.toString() !== user.id && user.role === "user") {
      res.status(500).json({ message: "Failed to delete collection" });
    } else {
      await Collection.findOneAndDelete({
        _id: collectionId,
      });
      res.status(200).json({
        message: `Deleted collection with id:${collectionId}`,
      });
    }
  } catch (error) {
    console.error("Failed to delete collection:", error);
    res.status(500).json({ message: "Failed to delete collection" });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { user } = req.session;
  try {
    const collection = new Collection({
      name: req.body.name,
      author: user.id,
    });

    await collection.save();
    const populatedCollection = await Collection.findById(
      collection._id
    ).populate("author");

    res.status(200).json(populatedCollection);
  } catch (error) {
    console.error("Failed to create collection:", error);
    res.status(500).json({ message: "Failed to create collection" });
  }
});