import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      success: false,
    });
  const token = header.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = verifyAccessToken(token as string);
    req.user = payload;
    next();
  } catch (error: unknown) {
    console.log(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireRoles =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(userRole))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
