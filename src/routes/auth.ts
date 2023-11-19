import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { createHash } from "crypto";

export const router = express.Router();

function hash(input) {
  return createHash("sha256").update(input).digest("hex");
}

async function login(user) {
  user.lastLogin = new Date();

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.fullname,
      status: user.status,
    },
    "your_secret_key",
    {
      expiresIn: "1h",
    }
  );

  user.save();
  return {
    token,
    userId: user._id,
  };
}

router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const hashedPassword = hash(password);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      status: "active",
    });

    // თავიდან მხოლოდ პირველი რეგისტრირებული user ხდება ადმინი
    // შემდეგ ამ ადმინს შეუძლია სხვა user-ები გახადოს ადმინი
    const totalUsers = await User.count({});
    if (totalUsers === 0) {
      newUser.role = "admin";
    }

    await newUser.save();

    const result = await login(newUser);
    res.status(200).json({
      token: result.token,
      userId: result.userId,
    });
  } catch (error) {
    console.log("Error caught:", error);

    if (error.code === 11000 && error.keyPattern.email === 1) {
      res.status(400).json({ message: "Email is already registered" });
    } else {
      res.status(500).json({ message: "Registration failed" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = user.password === hash(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const result = await login(user);

    res.status(200).json({
      token: result.token,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});
