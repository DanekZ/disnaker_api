import { type Response, type NextFunction } from "express";
import { prismaClient } from "../app/database";
import { UserRequest } from "../types/user-request";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (token) {
    const user = await prismaClient.admins.findFirst({
      where: {
        token: token as string,
      },
    });

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  }

  res.status(401).json({ errors: "Unauthorized" });
};
