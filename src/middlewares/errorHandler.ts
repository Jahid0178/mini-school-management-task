import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("An error occurred:", error);

  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  res.status(status).json({
    status,
    error: message,
  });
}
