import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export interface AuthRequest extends Request {
  session: {
    user: User;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try {
    const decodedToken = jwt.verify(token, "your_secret_key");

    const user = await User.findById(decodedToken.userId);
    req.session = { user };
    
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};
