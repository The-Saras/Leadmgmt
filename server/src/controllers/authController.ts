import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { RegisterBody, LoginBody, ApiResponse, IUser } from "../types";

// Generate JWT
const generateToken = (id: string, role: "admin" | "sales"): string => {
  const secret = process.env.JWT_SECRET as jwt.Secret;
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};

// @route  POST /api/auth/register
// @access Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role }: RegisterBody = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "sales",
    });

    const token = generateToken(user._id.toString(), user.role);

    const response: ApiResponse<{ token: string; user: Partial<IUser> }> = {
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// @route  POST /api/auth/login
// @access Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginBody = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    const response: ApiResponse<{ token: string; user: Partial<IUser> }> = {
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};