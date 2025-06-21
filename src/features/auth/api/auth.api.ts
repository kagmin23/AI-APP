// services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { Login, Register } from '../types/auth.types';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface AuthResponse {
  message: string;
  user?: { _id: string; name?: string; email: string };
  token?: string;
}

const register = async (data: Register): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>('/auth/register', data);

  const userId = response.data.user?._id;
  if (!userId) {
    throw new Error('Invalid register response: user._id missing');
  }

  await AsyncStorage.setItem('userId', userId);
  return response.data;
};

const login = async (data: Login): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>('/auth/login', data);

  const { token, user } = response.data;
  if (!user?._id || !token) {
    throw new Error('Invalid login response: user._id or token missing');
  }

  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('userId', user._id);
  return response.data;
};

const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};

const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('userId');
};

export { isAuthenticated, login, logout, register };
