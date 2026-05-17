import api from "./index";
import type { ApiResponse, User } from "../types/index";

interface AuthData {
  token: string;
  user: User;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: "admin" | "sales"
): Promise<ApiResponse<AuthData>> => {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthData>> => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};