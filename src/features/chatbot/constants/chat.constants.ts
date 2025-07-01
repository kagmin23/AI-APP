export const IMAGE_KEYWORDS = [
  "draw",
  "generate image",
  "image of",
  "picture of",
  "create image",
  "make image",
  "generate picture",
  "create picture",
  "draw me",
  "vẽ",
  "ảnh",
  "hình ảnh",
  "tạo ảnh",
  "tạo hình",
  "sinh ảnh",
];

export const TOAST_MESSAGES = {
  EMPTY_MESSAGE: "Please enter message!",
  IMAGE_SUCCESS: "🎨 Image generated successfully!",
  IMAGE_ERROR: "❌ Failed to generate image",
  MESSAGE_ERROR: "❌ Failed to send message",
  UPDATE_SUCCESS: "✅ Message updated successfully!",
  UPDATE_ERROR: "❌ Failed to update",
  DELETE_SUCCESS: "✅ Message deleted successfully",
  DELETE_ERROR: "❌ Failed to delete message",
  HISTORY_ERROR: "❌ Error loading history",
  IMAGE_LOAD_ERROR: "❌ Failed to load image",
  MESSAGE_NOT_FOUND: "❌ Message not found",
  REGENERATE_SUCCESS: "🎨 Image regenerated successfully!",
} as const;

export const ALERT_MESSAGES = {
  DELETE_TITLE: "Confirm deletion",
  DELETE_MESSAGE: "Are you sure you want to delete this message?",
  DELETE_BUTTON: "Delete",
  CANCEL_BUTTON: "Cancel",
} as const;

export const PLACEHOLDER_TEXTS = {
  INPUT: "Type your message...",
  GENERATING_IMAGE: "Generating image...",
  AI_THINKING: "AI is thinking...",
  EMPTY_TITLE: "Start a conversation",
  EMPTY_SUBTITLE: "Ask me anything or request an image! ✨🎨",
} as const;

export const COLORS = {
  GRADIENT_PRIMARY: ["#667eea", "#764ba2"],
  GRADIENT_BACKGROUND: ["#0f0f23", "#1a1a2e", "#16213e", "#0f1419"],
  GRADIENT_INPUT: ["#1e293b", "#334155"],
  GRADIENT_DISABLED: ["#4b5563", "#6b7280"],
  TEXT_PLACEHOLDER: "#64748b",
  TEXT_SECONDARY: "#cbd5e1",
  STATUS_SUCCESS: "#10b981",
  STATUS_ERROR: "#ef4444",
} as const;

export const LIMITS = {
  MAX_INPUT_LENGTH: 1000,
  SCROLL_DELAY: 100,
  ANIMATION_DURATION: 800,
} as const;
