import mongoose from "mongoose";

const schema = new mongoose.Schema({
  fullname: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Item = mongoose.model("Item", schema);
