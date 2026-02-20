import axio from "./api";
import type {
  LoginRequest,
  LoginResponse,
  UserResponse,
  User,
} from "../types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axio.post<LoginResponse>("/auth/login", data);

    if (response.data.token) {
      localStorage.setItem("@App:token", response.data.token);
    }

    return response.data;
  },

  signUp: async (data: User): Promise<UserResponse> => {
    const response = await axio.post<UserResponse>("/auth/signup", data);
    return response.data;
  },
};
