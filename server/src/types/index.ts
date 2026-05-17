import { Document, Types } from "mongoose";
import { Request } from "express";

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
  createdAt: Date;
}

// Lead Types
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  createdBy: Types.ObjectId;
}


export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "sales";
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  role: "admin" | "sales";
}


export interface AuthRequest extends Request {
  user?: JwtPayload;
}


export interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}


export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}