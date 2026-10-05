import api from "./axios";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/users/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const logsoutUser = async () => {
  const response = await api.get("/users/logout");
  return response.data;
};

export const googleLoginUser = async (credential: string) => {
  const response = await api.post("/users/google", { credential });
  return response.data;
};