import { Animated } from "react-native";

export type ChatItem = {
  _id: string;
  prompt: string;
  response?: string;
  imageUrl?: string;
  isEditing?: boolean;
  type?: "text" | "image";
  createdAt: string;
};

export interface ChatScreenProps {
  // Add any props if needed in the future
}

export interface EditingBubbleProps {
  item: ChatItem;
  onSave: (id: string, newPrompt: string) => void;
  onCancel: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<ChatItem>) => void;
}

export interface NormalBubbleProps {
  item: ChatItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface AIResponseProps {
  item: ChatItem;
  typingAnimation: any;
  onImageError: () => void;
}

export interface ChatBubbleProps {
  item: ChatItem;
  typingAnimation: Animated.Value;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, newPrompt: string) => void;
  onCancel: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<ChatItem>) => void;
  onImageError: () => void;
  updating?: boolean;
}