import dotenv from "dotenv";
dotenv.config();

interface Config {
  port: string | number;
  env: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpires: number;
    refreshExpires: number;
  };
  salt: number;
  PAGINATION_LIMIT: number;
}

const config: Config = {
  port: process.env.PORT || 8000,
  env: process.env.NODE_ENV || "development",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "accessme",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refreshme",
    accessExpires: parseInt(process.env.JWT_ACCESS_EXPIRES!) || 15,
    refreshExpires: parseInt(process.env.JWT_REFRESH_EXPIRES!) || 7,
  },
  salt: parseInt(process.env.SALT!) || 10,
  PAGINATION_LIMIT: parseInt(process.env.PAGINATION_LIMIT!) || 10,
};

export default config;
