import express from "express";
import { User } from "../models/user";
import { AuthRequest } from "../middleware/auth";

export const router = express.Router();

router.get("/fetch-user", async (req: AuthRequest, res) => {
  try {
    const { user } = req.session;
    user.password = "";

    res.status(200).json(user);
  } catch (error) {
    console.error("User data fetch error:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

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
  const ids  = req.body;

  try {
    const users = await User.updateMany(
      { _id: { $in: ids } },
      { role: "admin" }
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to make users admin:", error);
    res.status(500).json({ message: "Failed to make users admin" });
  }
});

router.post("/remove-admin", async (req, res) => {
  const ids  = req.body;

  try {
    const users = await User.updateMany(
      { _id: { $in: ids } },
      { role: "user" }
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