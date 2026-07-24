import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  console.log("Extracted Token:", token);

  try {
    const decoded = verifyToken(token);

    console.log("Decoded Token:", decoded);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("JWT Verification Error:", error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};