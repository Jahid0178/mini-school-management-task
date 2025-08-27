import jwt from "jsonwebtoken";
import config from "../config";

type JwtPayload = { sub: string; name: string; email: string; role: string };

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: "1h",
  });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: "7d",
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
