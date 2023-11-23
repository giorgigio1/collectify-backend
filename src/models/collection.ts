import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
});

export const Collection = mongoose.model("Collection", schema);