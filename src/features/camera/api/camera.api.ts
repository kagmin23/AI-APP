import axios from "axios";
import Constants from "expo-constants";
import { CameraUploadResponse } from "../types/camera.types";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// Gửi ảnh (base64 string hoặc uri nếu server hỗ trợ)
export const uploadCameraPhoto = async (
  base64Data: string
): Promise<CameraUploadResponse> => {
  const url = `${API_BASE_URL}/camera/upload`;

  const response = await axios.post<CameraUploadResponse>(
    url,
    { camera: base64Data },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  return response.data;
};

export const getCameraPhotos = async (): Promise<any[]> => {
  const url = `${API_BASE_URL}/camera/list`;

  const response = await axios.get<any[]>(url, {
    withCredentials: true,
  });

  return response.data;
};

export const deleteCameraPhoto = async (id: string): Promise<{ message: string }> => {
  const url = `${API_BASE_URL}/camera/${id}`;
  const response = await axios.delete<{ message: string }>(url, {
    withCredentials: true,
  });
  return response.data;
};