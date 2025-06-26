import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

interface SendMessagePayload {
  message: string;
  userId: string;
}

interface ChatResponse {
  reply: string;
}

interface ChatHistoryItem {
  _id: string;
  prompt: string;
  response: string;
  userId: string;
  createdAt: string;
}

const sendMessage = async (message: string): Promise<string> => {
  const userId = await AsyncStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found in storage");
  }

  const payload: SendMessagePayload = { message, userId };

  const response = await axios.post<ChatResponse>(
    `${API_BASE_URL}/chatbotAI/chat`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return response.data.reply;
};

const getChatHistory = async (): Promise<ChatHistoryItem[]> => {
  const userId = await AsyncStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found in storage");
  }

  const response = await axios.get<ChatHistoryItem[]>(
    `${API_BASE_URL}/chatbotAI/history`,
    {
      params: { userId },
    }
  );

  return response.data;
};

const updateMessage = async (
  chatId: string,
  prompt: string
): Promise<ChatHistoryItem> => {
  const response = await axios.put<ChatHistoryItem>(
    `${API_BASE_URL}/chatbotAI/${chatId}`,
    { prompt },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return response.data;
};

const deleteMessage = async (chatId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/chatbotAI/${chatId}`);
};

export { deleteMessage, getChatHistory, sendMessage, updateMessage };
