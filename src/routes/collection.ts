import express from "express";
import { User } from "../models/user";
import { Collection } from "../models/collection";
import { AuthRequest } from "../middleware/auth";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find({}).populate("cards");

    res.status(200).json(collections);
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    res.status(500).json({ message: "Failed to fetch collection" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  const { user } = req.session;

  try {
    const collection = new Collection({
      name: req.body.name,
      author: user.id,
    });

    await collection.save();

    res.status(200).json(collection);
  } catch (error) {
    console.error("Failed to create collection:", error);
    res.status(500).json({ message: "Failed to create collection" });
  }
});