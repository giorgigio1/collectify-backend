import mongoose from "mongoose";

export type User = {
  id: string;
  fullname: string;
  email: string;
  password: string;
  role: "user" | "admin";
  lastLogin: Date;
  status: string;
  createdAt: Date;
  ownedItems: unknown[];
  likedItems: unknown[];
};

const schema = new mongoose.Schema<User>({
  fullname: String,
  email: { type: String, unique: true },
  password: String,
  lastLogin: Date,
  status: String,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  ownedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  likedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

export const User = mongoose.model("User", schema);
