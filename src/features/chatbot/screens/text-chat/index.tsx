import { MainTabParamList } from "@/navigations/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS, TOAST_MESSAGES } from "../../constants/chat.constants";
import {
  useChatHistory,
  useChatOperations,
  useScrollToEnd,
  useToast,
  useTypingAnimation,
} from "../../hooks/chat.hooks";
import { ChatItem } from "../../types/chat.types";
import { ChatBubble, EmptyStateComponent, HeaderComponent } from "../ui/chat";
import { InputComponent } from "../ui/input";
import styles from "./styles";

const TextChatScreen: React.FC = () => {
  const [input, setInput] = useState("");

  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { showToast } = useToast();
  const { flatListRef, scrollToEnd } = useScrollToEnd();

  const {
    history,
    setHistory,
    loading,
    updateHistoryItem,
    removeHistoryItem,
    fetchHistory,
  } = useChatHistory();

  const { sending, waiting, handleSendMessage, handleEditSave, confirmDelete } =
    useChatOperations();

  const typingAnimation = useTypingAnimation(waiting);

  // Initialize data
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Handle send message
  const handleSend = useCallback(async () => {
    await handleSendMessage(
      input,
      setInput,
      setHistory,
      updateHistoryItem,
      removeHistoryItem,
      scrollToEnd
    );
  }, [
    input,
    handleSendMessage,
    setHistory,
    updateHistoryItem,
    removeHistoryItem,
    scrollToEnd,
  ]);

  // Handle edit operations
  const handleEdit = useCallback(
    (id: string) => {
      updateHistoryItem(id, { isEditing: true });
    },
    [updateHistoryItem]
  );

  const handleCancelEdit = useCallback(
    (id: string) => {
      updateHistoryItem(id, { isEditing: false });
    },
    [updateHistoryItem]
  );

  const handleSaveEdit = useCallback(
    async (id: string, newPrompt: string) => {
      await handleEditSave(id, newPrompt, history, updateHistoryItem);
    },
    [handleEditSave, history, updateHistoryItem]
  );

  // Handle delete
  const handleDeleteConfirm = useCallback(
    (id: string) => {
      confirmDelete(id, history, removeHistoryItem);
    },
    [confirmDelete, history, removeHistoryItem]
  );

  // Handle image error
  const handleImageError = useCallback(() => {
    showToast(
      "error",
      TOAST_MESSAGES.IMAGE_LOAD_ERROR,
      "The image URL might be invalid."
    );
  }, [showToast]);

  // Render chat bubble
  const renderChatBubble = useCallback(
    ({ item }: { item: ChatItem }) => (
      <ChatBubble
        item={item}
        typingAnimation={typingAnimation}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onUpdateItem={updateHistoryItem}
        onImageError={handleImageError}
      />
    ),
    [
      typingAnimation,
      handleEdit,
      handleDeleteConfirm,
      handleSaveEdit,
      handleCancelEdit,
      updateHistoryItem,
      handleImageError,
    ]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <LinearGradient
          colors={COLORS.GRADIENT_BACKGROUND}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Header */}
        <HeaderComponent />

        {/* Chat List */}
        <FlatList
          ref={flatListRef}
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderChatBubble}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyStateComponent />}
          onContentSizeChange={scrollToEnd}
          onLayout={scrollToEnd}
        />

        {/* Input */}
        <InputComponent
          input={input}
          sending={sending}
          onChangeText={setInput}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default TextChatScreen;
