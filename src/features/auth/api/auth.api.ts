import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Login, Register } from "../types/auth.types";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

interface AuthResponse {
  message: string;
  user?: { _id: string; name?: string; email: string };
  token?: string;
}

const register = async (data: Register): Promise<AuthResponse> => {
  const url = `${API_BASE_URL}/auth/register`;

  const response = await axios.post<AuthResponse>(url, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  const userId = response.data.user?._id;
  if (!userId) {
    throw new Error("Invalid register response: user._id missing");
  }

  await AsyncStorage.setItem("userId", userId);
  return response.data;
};

const login = async (data: Login): Promise<AuthResponse> => {
  const url = `${API_BASE_URL}/auth/login`;

  const response = await axios.post<AuthResponse>(url, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  const { token, user } = response.data;
  if (!user?._id || !token) {
    throw new Error("Invalid login response: user._id or token missing");
  }

  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("userId", user._id);
  return response.data;
};

const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const url = `${API_BASE_URL}/auth/forgot-password`;
  const response = await axios.post<{ message: string }>(url, { email });
  return response.data;
};

const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const url = `${API_BASE_URL}/auth/reset-password`;
  const response = await axios.post<{ message: string }>(url, payload);
  return response.data;
};

const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem("token");
  return !!token;
};

const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("userId");
};

export {
  forgotPassword, isAuthenticated,
  login,
  logout,
  register, resetPassword
};

