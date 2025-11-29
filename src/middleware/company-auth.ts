import jwt from "jsonwebtoken";
import { ResponseError } from "../errors/response-error";
import { type NextFunction, type Response, type Request } from "express";
import { UserRequest } from "../types/user-request";

export const companyAuth = (req: UserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new ResponseError(401, "Unauthorized");

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

    req.company_user = decoded;

    next();
  } catch (error) {
    throw new ResponseError(401, "Token tidak valid");
  }
};
