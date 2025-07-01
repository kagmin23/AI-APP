import { IMAGE_KEYWORDS } from "../constants/chat.constants";
import { ChatItem } from "../types/chat.types";


export const isImagePrompt = (text: string): boolean => {
  const lower = text.toLowerCase();
  return IMAGE_KEYWORDS.some((keyword) => lower.includes(keyword));
};

export const processImageResponse = (imageData: any): string => {
  if (typeof imageData !== "string") {
    throw new Error("Invalid response type from image API");
  }

  if (
    imageData.startsWith("data:image/") ||
    imageData.startsWith("http://") ||
    imageData.startsWith("https://")
  ) {
    return imageData;
  }

  throw new Error("Invalid image data format received from server");
};

export const combineAndSortHistory = (
  textHistory: any[],
  imageHistory: any[]
): ChatItem[] => {
  const combinedHistory = [
    ...textHistory.map((item) => ({ ...item, type: "text" as const })),
    ...imageHistory.map((item) => ({
      _id: item._id,
      prompt: item.prompt,
      imageUrl: item.imageUrl,
      type: "image" as const,
      createdAt: item.createdAt,
    })),
  ].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return combinedHistory;
};

export const createTempMessage = (
  input: string,
  isImageRequest: boolean
): ChatItem => ({
  _id: `temp_${Date.now()}`,
  prompt: input,
  type: isImageRequest ? "image" : "text",
  createdAt: new Date().toISOString(),
});

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Please try again later.";
};