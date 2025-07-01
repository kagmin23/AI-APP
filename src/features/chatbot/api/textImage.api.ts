import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
interface TextToImagePayload {
  prompt: string;
  userId: string;
}
interface TextToImageResponse {
  success: boolean;
  prompt: string;
  imageBase64: string;
  imageUrl: string;
  size: number;
}
interface ImageItem {
  _id: string;
  prompt: string;
  imageUrl: string;
  imageBase64?: string;
  type?: 'text' | 'image';
  createdAt: string;
}
interface GetImageHistoryResponse {
  success: boolean;
  images: ImageItem[];
}
interface UpdateImagePayload {
  prompt: string;
}
interface UpdateImageResponse {
  success: boolean;
  image: {
    _id: string;
    prompt: string;
    imageUrl: string;
    imageBase64: string;
    createdAt: string;
  };
}
interface DeleteImageResponse {
  success: boolean;
  message?: string;
}

const textImage = async (prompt: string): Promise<string> => {
  try {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      throw new Error("User ID not found in storage");
    }

    const payload: TextToImagePayload = { prompt, userId };

    const response = await axios.post<TextToImageResponse>(
      `${API_BASE_URL}/chatbotAI/generate-image`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 45000, // Tăng timeout vì generate image mất thời gian
      }
    );

    console.log("✅ API Response received:", {
      success: response.data.success,
      hasImageBase64: !!response.data.imageBase64,
      hasImageUrl: !!response.data.imageUrl,
      imageSize: response.data.size,
    });

    // Ưu tiên sử dụng imageBase64 (đã được encode sẵn)
    // Vì nó đã được download và convert thành base64 ở backend
    if (response.data.imageBase64) {
      return response.data.imageBase64;
    }

    // Fallback về imageUrl nếu không có base64
    if (response.data.imageUrl) {
      return response.data.imageUrl;
    }

    throw new Error("No image data returned from server");
  } catch (error) {
    console.error("❌ textImage API Error:", error);

    if (axios.isAxiosError(error)) {
      console.error("❌ Axios Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      // Throw more specific error messages
      if (error.response?.status === 400) {
        throw new Error("Invalid prompt. Please try a different prompt.");
      } else if (error.response?.status === 500) {
        throw new Error(
          "Server error while generating image. Please try again."
        );
      } else if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout. Image generation took too long.");
      }
    }

    throw new Error(
      error instanceof Error ? error.message : "Failed to generate image"
    );
  }
};

const getImageHistory = async (): Promise<ImageItem[]> => {
  try {
    const response = await axios.get<GetImageHistoryResponse>(
      `${API_BASE_URL}/chatbotAI/history-images`
    );

    if (!response.data.success || !response.data.images) {
      throw new Error("Invalid image history response");
    }

    return response.data.images;
  } catch (error) {
    console.error("❌ getImageHistory Error:", error);
    throw new Error("Failed to fetch image history");
  }
};

const updateImage = async (id: string, prompt: string): Promise<UpdateImageResponse> => {
  try {
    const response = await axios.put<UpdateImageResponse>(
      `${API_BASE_URL}/chatbotAI/update-image/${id}`,
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ updateImage error:", error);
    throw new Error("Failed to update image");
  }
};

const deleteImage = async (id: string): Promise<DeleteImageResponse> => {
  try {
    const response = await axios.delete<DeleteImageResponse>(
      `${API_BASE_URL}/chatbotAI/delete-image/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("❌ deleteImage error:", error);
    throw new Error("Failed to delete image");
  }
};

export { deleteImage, getImageHistory, textImage, updateImage };

