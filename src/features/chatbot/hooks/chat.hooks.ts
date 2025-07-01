import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, FlatList } from "react-native";
import Toast from "react-native-toast-message";
import {
    deleteMessage,
    getChatHistory,
    sendMessage,
    updateMessage,
} from "../api/textChat.api";
import {
    deleteImage,
    getImageHistory,
    textImage,
    updateImage,
} from "../api/textImage.api";
import {
    ALERT_MESSAGES,
    LIMITS,
    TOAST_MESSAGES,
} from "../constants/chat.constants";
import { ChatItem } from "../types/chat.types";
import {
    combineAndSortHistory,
    createTempMessage,
    getErrorMessage,
    isImagePrompt,
    processImageResponse,
} from "../utils/chat.utils";

export const useToast = () => {
  const showToast = useCallback(
    (type: string, text1: string, text2?: string) => {
      Toast.show({ type, text1, text2 });
    },
    []
  );

  return { showToast };
};

export const useScrollToEnd = () => {
  const flatListRef = useRef<FlatList>(null);

  const scrollToEnd = useCallback(() => {
    setTimeout(
      () => flatListRef.current?.scrollToEnd({ animated: true }),
      LIMITS.SCROLL_DELAY
    );
  }, []);

  return { flatListRef, scrollToEnd };
};

export const useTypingAnimation = (waiting: boolean) => {
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (waiting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: LIMITS.ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: LIMITS.ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.stopAnimation();
    }
  }, [waiting, typingAnimation]);

  return typingAnimation;
};

export const useChatHistory = () => {
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const updateHistoryItem = useCallback(
    (id: string, updates: Partial<ChatItem>) => {
      setHistory((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, ...updates } : msg))
      );
    },
    []
  );

  const removeHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((msg) => msg._id !== id));
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const [textHistory, imageHistory] = await Promise.all([
        getChatHistory(),
        getImageHistory(),
      ]);

      const combinedHistory = combineAndSortHistory(textHistory, imageHistory);
      setHistory(combinedHistory);
    } catch (error) {
      showToast(
        "error",
        TOAST_MESSAGES.HISTORY_ERROR,
        "Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    history,
    setHistory,
    loading,
    updateHistoryItem,
    removeHistoryItem,
    fetchHistory,
  };
};

export const useChatOperations = () => {
  const [sending, setSending] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const { showToast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleSendMessage = useCallback(
    async (
      input: string,
      setInput: (value: string) => void,
      setHistory: (updater: (prev: ChatItem[]) => ChatItem[]) => void,
      updateHistoryItem: (id: string, updates: Partial<ChatItem>) => void,
      removeHistoryItem: (id: string) => void,
      scrollToEnd: () => void
    ) => {
      if (!input.trim()) {
        showToast("info", TOAST_MESSAGES.EMPTY_MESSAGE);
        return;
      }

      const currentInput = input.trim();
      const isImageRequest = isImagePrompt(currentInput);
      const newMessage = createTempMessage(currentInput, isImageRequest);

      setInput("");
      setSending(true);
      setWaiting(true);
      setHistory((prev) => [...prev, newMessage]);
      scrollToEnd();

      try {
        if (isImageRequest) {
          const imageData = await textImage(currentInput);
          const imageUrl = processImageResponse(imageData);
          updateHistoryItem(newMessage._id, { imageUrl, type: "image" });
          showToast("success", TOAST_MESSAGES.IMAGE_SUCCESS);
        } else {
          const reply = await sendMessage(currentInput);
          if (!reply) throw new Error("No response returned from API");
          updateHistoryItem(newMessage._id, { response: reply, type: "text" });
        }
      } catch (error) {
        removeHistoryItem(newMessage._id);
        showToast(
          "error",
          isImageRequest
            ? TOAST_MESSAGES.IMAGE_ERROR
            : TOAST_MESSAGES.MESSAGE_ERROR,
          getErrorMessage(error)
        );
        setInput(currentInput);
      } finally {
        setSending(false);
        setWaiting(false);
      }
    },
    [showToast]
  );

  const handleEditSave = useCallback(
    async (
      id: string,
      newPrompt: string,
      history: ChatItem[],
      updateHistoryItem: (id: string, updates: Partial<ChatItem>) => void
    ) => {
      try {
        setUpdatingId(id);
        setWaiting(true);

        const item = history.find((msg) => msg._id === id);
        if (!item) {
          throw new Error("Message not found");
        }

        if (id.startsWith("temp_")) {
          showToast(
            "error",
            TOAST_MESSAGES.UPDATE_ERROR,
            "You can not edit this message."
          );
          console.log("temp_", id);
          return;
        }

        if (item.type === "image") {
          const response = await updateImage(id, newPrompt);
          if (!response.success) {
            const errorMsg =
              "error" in response && typeof response.error === "string"
                ? response.error
                : "Can not update message";
            throw new Error(errorMsg);
          }

          const { image } = response;
          const finalImageUrl = image.imageBase64
            ? `data:image/jpeg;base64,${image.imageBase64}`
            : image.imageUrl;

          updateHistoryItem(id, {
            prompt: newPrompt,
            imageUrl: finalImageUrl,
            isEditing: false,
            createdAt: image.createdAt || item.createdAt,
          });

          showToast("success", TOAST_MESSAGES.REGENERATE_SUCCESS);
        } else {
          const updated = await updateMessage(id, newPrompt);
          if (!updated) {
            throw new Error("Can not update message");
          }

          updateHistoryItem(id, {
            prompt: updated.prompt,
            response: updated.response,
            isEditing: false,
            createdAt: updated.createdAt || item.createdAt,
          });

          showToast("success", TOAST_MESSAGES.UPDATE_SUCCESS);
        }
      } catch (error) {
        showToast("error", TOAST_MESSAGES.UPDATE_ERROR, getErrorMessage(error));
      } finally {
        setUpdatingId(null);
        setWaiting(false);
      }
    },
    [showToast]
  );

  const handleDelete = useCallback(
    async (
      id: string,
      history: ChatItem[],
      removeHistoryItem: (id: string) => void
    ) => {
      try {
        const item = history.find((msg) => msg._id === id);

        if (!item) {
          showToast("error", TOAST_MESSAGES.MESSAGE_NOT_FOUND);
          return;
        }

        if (id.startsWith("temp_")) {
          removeHistoryItem(id);
          showToast("success", TOAST_MESSAGES.DELETE_SUCCESS);
          return;
        }

        if (item.type === "image") {
          await deleteImage(id);
        } else {
          await deleteMessage(id);
        }

        removeHistoryItem(id);
        showToast("success", TOAST_MESSAGES.DELETE_SUCCESS);
      } catch (error) {
        showToast("error", TOAST_MESSAGES.DELETE_ERROR, getErrorMessage(error));
      }
    },
    [showToast]
  );

  const confirmDelete = useCallback(
    (
      id: string,
      history: ChatItem[],
      removeHistoryItem: (id: string) => void
    ) => {
      Alert.alert(
        ALERT_MESSAGES.DELETE_TITLE,
        ALERT_MESSAGES.DELETE_MESSAGE,
        [
          { text: ALERT_MESSAGES.CANCEL_BUTTON, style: "cancel" },
          {
            text: ALERT_MESSAGES.DELETE_BUTTON,
            style: "destructive",
            onPress: () => handleDelete(id, history, removeHistoryItem),
          },
        ],
        { cancelable: true }
      );
    },
    [handleDelete]
  );

  return {
    sending,
    waiting,
    handleSendMessage,
    handleEditSave,
    confirmDelete,
    updatingId,
  };
};
