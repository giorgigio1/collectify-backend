import express from "express";
import { User } from "../models/user";

export const router = express.Router();

router.get("/fetch-users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });

    res.status(200).json(users);
  } catch (error) {
    console.error("User data fetch error:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

router.post("/block-users", async (req, res) => {
  const ids = req.body;

  try {
    const users = await User.updateMany(
      { _id: { $in: ids } },
      { status: "blocked" }
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("User data fetch error:", error);
    res.status(500).json({ message: "Failed to update user data" });
  }
});

router.post("/unblock-users", async (req, res) => {
  const ids = req.body;
  try {
    const users = await User.updateMany(
      { _id: { $in: ids } },
      { status: "active" }
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("User data fetch error:", error);
    res.status(500).json({ message: "Failed to update user data" });
  }
});

router.post("/make-admin", async (req, res) => {
  const { ids, enable } = req.body;

  try {
    const users = await User.updateMany(
      { _id: { $in: ids } },
      { admin: enable }
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to make users admin:", error);
    res.status(500).json({ message: "Failed to make users admin" });
  }
});

router.post("/delete-users", async (req, res) => {
  const ids = req.body;
  try {
    const users = await User.deleteMany({ _id: { $in: ids } });
    res.status(200).json(users);
  } catch (error) {
    console.error("User data delete error:", error);
    res.status(500).json({ message: "Failed to delete user data" });
  }
});