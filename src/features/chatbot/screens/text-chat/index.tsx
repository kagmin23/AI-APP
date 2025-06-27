import { MainTabParamList } from "@/navigations/types";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  deleteMessage,
  getChatHistory,
  sendMessage,
  updateMessage,
} from "../../api/textChat.api";
import { getImageHistory, textImage } from "../../api/textImage.api";
import styles from "./styles";

type ChatItem = {
  _id: string;
  prompt: string;
  response?: string;
  imageUrl?: string;
  isEditing?: boolean;
  type?: "text" | "image";
  createdAt: string;
};

const IMAGE_KEYWORDS = [
  "draw", "generate image", "image of", "picture of", "create image", 
  "make image", "generate picture", "create picture", "draw me", 
  "vẽ", "ảnh", "hình ảnh", "tạo ảnh", "tạo hình", "sinh ảnh"
];

const TextChatScreen: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [waiting, setWaiting] = useState(false);
  
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // Animation effect
  useEffect(() => {
    if (waiting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(typingAnimation, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingAnimation.stopAnimation();
    }
  }, [waiting, typingAnimation]);

  // Utility functions
  const showToast = useCallback((type: string, text1: string, text2?: string) => {
    Toast.show({ type, text1, text2 });
  }, []);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const isImagePrompt = useCallback((text: string) => {
    const lower = text.toLowerCase();
    return IMAGE_KEYWORDS.some(keyword => lower.includes(keyword));
  }, []);

  // Data fetching
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const [textHistory, imageHistory] = await Promise.all([
        getChatHistory(),
        getImageHistory(),
      ]);

      const combinedHistory = [
        ...textHistory.map(item => ({ ...item, type: "text" as const })),
        ...imageHistory.map(item => ({
          _id: item._id,
          prompt: item.prompt,
          imageUrl: item.imageUrl,
          type: "image" as const,
          createdAt: item.createdAt,
        }))
      ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setHistory(combinedHistory);
    } catch (error) {
      showToast("error", "❌ Error loading history", "Please check your network connection.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Message operations
  const updateHistoryItem = useCallback((id: string, updates: Partial<ChatItem>) => {
    setHistory(prev => prev.map(msg => msg._id === id ? { ...msg, ...updates } : msg));
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(msg => msg._id !== id));
  }, []);

  const processImageResponse = useCallback((imageData: any) => {
    if (typeof imageData !== "string") {
      throw new Error("Invalid response type from image API");
    }
    
    if (imageData.startsWith("data:image/") || 
        imageData.startsWith("http://") || 
        imageData.startsWith("https://")) {
      return imageData;
    }
    
    throw new Error("Invalid image data format received from server");
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim()) {
      showToast("info", "Please enter message!");
      return;
    }

    const currentInput = input.trim();
    const isImageRequest = isImagePrompt(currentInput);
    const newMessage: ChatItem = {
      _id: `temp_${Date.now()}`,
      prompt: currentInput,
      type: isImageRequest ? "image" : "text",
      createdAt: new Date().toISOString(),
    };

    setInput("");
    setSending(true);
    setWaiting(true);
    setHistory(prev => [...prev, newMessage]);
    scrollToEnd();

    try {
      if (isImageRequest) {
        const imageData = await textImage(currentInput);
        const imageUrl = processImageResponse(imageData);
        updateHistoryItem(newMessage._id, { imageUrl, type: "image" });
        showToast("success", "🎨 Image generated successfully!");
      } else {
        const reply = await sendMessage(currentInput);
        if (!reply) throw new Error("No response returned from API");
        updateHistoryItem(newMessage._id, { response: reply, type: "text" });
      }
    } catch (error) {
      removeHistoryItem(newMessage._id);
      showToast(
        "error",
        isImageRequest ? "❌ Failed to generate image" : "❌ Failed to send message",
        error instanceof Error ? error.message : "Please try again later."
      );
      setInput(currentInput);
    } finally {
      setSending(false);
      setWaiting(false);
    }
  }, [input, isImagePrompt, showToast, scrollToEnd, updateHistoryItem, removeHistoryItem, processImageResponse]);

  // Edit operations
  const handleEdit = useCallback((id: string) => {
    updateHistoryItem(id, { isEditing: true });
  }, [updateHistoryItem]);

  const handleCancelEdit = useCallback((id: string) => {
    updateHistoryItem(id, { isEditing: false });
  }, [updateHistoryItem]);

  const handleEditSave = useCallback(async (id: string, newPrompt: string) => {
    try {
      setWaiting(true);
      const updated = await updateMessage(id, newPrompt);
      updateHistoryItem(id, { ...updated, isEditing: false });
      showToast("success", "✅ Message updated successfully!");
    } catch (error) {
      showToast("error", "❌ Failed to update message", "Please try again later.");
    } finally {
      setWaiting(false);
    }
  }, [updateHistoryItem, showToast]);

  // Delete operations
  const handleDelete = useCallback(async (id: string) => {
    try {
      if (id.startsWith("temp_")) {
        removeHistoryItem(id);
        showToast("success", "✅ Message deleted");
        return;
      }

      await deleteMessage(id);
      removeHistoryItem(id);
      showToast("success", "✅ Message deleted successfully");
    } catch (error) {
      showToast("error", "❌ Failed to delete message", "Please try again later.");
    }
  }, [removeHistoryItem, showToast]);

  const confirmDelete = useCallback((id: string) => {
    Alert.alert(
      "Confirm deletion",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDelete(id) },
      ],
      { cancelable: true }
    );
  }, [handleDelete]);

  // Render components
  const renderEditingBubble = useCallback((item: ChatItem) => (
    <>
      <TextInput
        style={styles.editInput}
        value={item.prompt}
        onChangeText={(text) => updateHistoryItem(item._id, { prompt: text })}
        multiline
      />
      <View style={styles.editActions}>
        <TouchableOpacity
          style={styles.editActionButton}
          onPress={() => handleEditSave(item._id, item.prompt)}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={16} color="#10b981" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editActionButton}
          onPress={() => handleCancelEdit(item._id)}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </>
  ), [updateHistoryItem, handleEditSave, handleCancelEdit]);

  const renderNormalBubble = useCallback((item: ChatItem) => (
    <>
      <Text style={styles.userText}>{item.prompt}</Text>
      <View style={styles.bubbleActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item._id)}
          activeOpacity={0.6}
        >
          <Ionicons name="pencil" size={12} color="#cbd5e1" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => confirmDelete(item._id)}
          activeOpacity={0.6}
        >
          <Ionicons name="trash" size={12} color="#cbd5e1" />
        </TouchableOpacity>
      </View>
    </>
  ), [handleEdit, confirmDelete]);

  const renderAIResponse = useCallback((item: ChatItem) => {
    if (item.response) {
      return <Text style={styles.aiText}>{item.response}</Text>;
    }
    
    if (item.imageUrl) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.generatedImage}
            resizeMode="cover"
            onError={() => showToast("error", "❌ Failed to load image", "The image URL might be invalid.")}
          />
        </View>
      );
    }

    return (
      <View style={styles.typingContainer}>
        {[1, 2, 3].map(i => (
          <Animated.View
            key={i}
            style={[styles.typingDot, { opacity: typingAnimation }]}
          />
        ))}
        <Text style={styles.typingText}>
          {item.type === "image" ? "Generating image..." : "AI is thinking..."}
        </Text>
      </View>
    );
  }, [typingAnimation, showToast]);

  const renderChatBubble = useCallback(({ item }: { item: ChatItem }) => (
    <View style={styles.chatBubbleContainer}>
      {/* User Message */}
      <View style={styles.userBubbleWrapper}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={12} color="#fff" />
        </View>
        <View style={styles.userBubble}>
          {item.isEditing ? renderEditingBubble(item) : renderNormalBubble(item)}
        </View>
      </View>

      {/* AI Response */}
      <View style={styles.aiBubbleWrapper}>
        <View style={styles.aiAvatar}>
          <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.aiAvatarGradient}>
            <Ionicons name="sparkles" size={12} color="#fff" />
          </LinearGradient>
        </View>
        <View style={styles.aiBubble}>
          {renderAIResponse(item)}
        </View>
      </View>
    </View>
  ), [renderEditingBubble, renderNormalBubble, renderAIResponse]);

  const EmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="chatbubble-outline" size={48} color="#667eea" />
      </View>
      <Text style={styles.emptyTitle}>Start a conversation</Text>
      <Text style={styles.emptySubtitle}>Ask me anything or request an image! ✨🎨</Text>
    </View>
  ), []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LinearGradient
          colors={["#0f0f23", "#1a1a2e", "#16213e", "#0f1419"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.headerIconGradient}>
                <Ionicons name="chatbubbles" size={14} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          ref={flatListRef}
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderChatBubble}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchHistory}
          onContentSizeChange={scrollToEnd}
          ListEmptyComponent={EmptyComponent}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <LinearGradient colors={["#1e293b", "#334155"]} style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor="#64748b"
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || sending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={sending || !input.trim()}
            >
              <LinearGradient
                colors={
                  !input.trim() || sending
                    ? ["#4b5563", "#6b7280"]
                    : ["#667eea", "#764ba2"]
                }
                style={styles.sendButtonGradient}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={17} color="#fff" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default TextChatScreen;