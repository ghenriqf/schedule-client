import api from "./api";
import type { Login, LoginResponse, UserResponse, User } from "../types/auth";

export const authService = {
  login: async (data: Login): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);

    if (response.data.token) {
      localStorage.setItem("@App:token", response.data.token);
    }

    return response.data;
  },

  signUp: async (data: User): Promise<UserResponse> => {
    const response = await api.post<UserResponse>("/auth/signup", data);
    return response.data;
  },
};
