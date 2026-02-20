export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  username: string;
  name: string;
  email: string;
  password: string;
  birth: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}
