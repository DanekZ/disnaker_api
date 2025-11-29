import { type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/user-request";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const header = req.header("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.substring(7) : header;
  if (!token) return res.status(401).json({ errors: "Unauthorized" });
  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret) as any;
    req.user = { id: String(payload.sub || payload.id || ""), email: String(payload.email || ""), role: String(payload.role || "") };
    next();
  } catch (_e) {
    res.status(401).json({ errors: "Unauthorized" });
  }
};
