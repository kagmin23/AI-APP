import { API_BASE_URL } from "@/config/env";
import { MainTabParamList } from "@/navigations/types";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import styles from "./styles";

type ChatItem = {
  id: string;
  prompt: string;
  response: string;
};

const TextChatScreen: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/text-to-text`);
      setHistory(response.data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error loading history",
        text2: "Please check your network connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) {
      Toast.show({ type: "info", text1: "Please enter message!" });
      return;
    }

    const currentInput = input.trim();
    setSending(true);
    setInput("");

    try {
      const response = await axios.post(`${API_BASE_URL}/text-to-text`, {
        prompt: currentInput,
      });

      const newItem: ChatItem = {
        id: response.data.id,
        prompt: currentInput,
        response: response.data.result,
      };

      setHistory((prev) => [newItem, ...prev]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to send message",
        text2: "Please try again later.",
      });
      setInput(currentInput);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/text-to-text/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      Toast.show({ type: "success", text1: "Message deleted." });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: "Please try again.",
      });
    }
  };

return (
  <KeyboardAvoidingView
    style={styles.screen}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
    {/* Gradient Background */}
    <LinearGradient
      colors={[
        "#0a0a0f", // Dark blue-black at top
        "#1a1a2e", // Deep purple-blue
        "#16213e", // Dark navy blue
        "#0f1419", // Very dark blue-gray
        "#0a0a0f", // Back to dark at bottom
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />

    {/* Overlay content */}
    <View style={styles.overlay}>
      <Text style={styles.title}>🤖 Chat with AI</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            {/* Your message rendering here */}
          </View>
        )}
        refreshing={loading}
        onRefresh={fetchHistory}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Start a conversation with AI ✨</Text>
          </View>
        }
      />

      {/* Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter your question..."
          placeholderTextColor="#ccc"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={sending || !input.trim()}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="send" size={14} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
);
}

export default TextChatScreen;
