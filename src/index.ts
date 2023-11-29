import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { router as authRoutes } from "./routes/auth";
import { router as userRoutes } from "./routes/user";
import { router as cardRoutes } from "./routes/card";
import { router as collectionRoutes } from "./routes/collection";
import { authMiddleware } from "./middleware/auth";

const argv = yargs(hideBin(process.argv))
  .options({
    port: { type: "number", alias: "p" },
  })
  .parseSync();

const app = express();
const PORT = argv.port || 443;

app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose
  .connect("mongodb+srv://giorgi:giorgi@cluster0.p2orfkr.mongodb.net/test2")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/auth", authRoutes);
app.use("/user", authMiddleware, userRoutes);
app.use("/card", authMiddleware, cardRoutes);
app.use("/collection", collectionRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
})
