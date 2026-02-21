import axio from "./api";
import type {
  LoginRequest,
  LoginResponse,
  UserResponse,
  UserRequest,
} from "../types/auth";

export const AUTH_TOKEN_KEY = "@App:token";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axio.post<LoginResponse>("/auth/login", data);

    if (response.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    }

    return response.data;
  },

  signUp: async (data: UserRequest): Promise<UserResponse> => {
    const response = await axio.post<UserResponse>("/auth/signup", data);
    return response.data;
  },
};
