import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../prisma/client";
import config from "../../config";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { Role, IUser } from "../../typescript/interface";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role }: IUser = req.body;

    if (role === Role.student) {
      return res.status(400).json({
        status: 400,
        message: "Student registration is not allowed",
        success: false,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 403,
        message: "User already exist",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, config.salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.teacher,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "User not created",
        success: false,
      });
    }

    return res.status(201).json({
      status: 201,
      message: "User create successfully",
      success: true,
    });
  } catch (error: unknown) {
    console.error("Register error: ", error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        success: false,
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
        success: false,
      });
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);

    const refreshToken = signRefreshToken(payload);

    return res.status(200).json({
      status: 200,
      message: "Login successfully",
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error: unknown) {
    console.error("Login error: ", error);
  }
};

const AuthController = {
  register,
  login,
};

export default AuthController;
