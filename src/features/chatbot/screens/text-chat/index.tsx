import { MainTabParamList } from "@/navigations/types";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
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
import { getChatHistory, sendMessage } from "../../api/textChat.api";
import styles from "./styles";

type ChatItem = {
  _id: string;
  prompt: string;
  response: string;
};

const TextChatScreen: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (waiting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.stopAnimation();
    }
  }, [waiting]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getChatHistory();
      setHistory(data.reverse());
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
    setInput("");
    setSending(true);
    setWaiting(true);

    const newMessage: ChatItem = {
      _id: `${Date.now()}`,
      prompt: currentInput,
      response: "",
    };
    setHistory((prev) => [...prev, newMessage]);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const reply = await sendMessage(currentInput);
      setHistory((prev) =>
        prev.map((msg) =>
          msg._id === newMessage._id ? { ...msg, response: reply } : msg
        )
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to send message",
        text2: "Please try again later.",
      });
      setInput(currentInput);
    } finally {
      setSending(false);
      setWaiting(false);
    }
  };

  const renderChatBubble = ({ item }: { item: ChatItem }) => (
    <View style={styles.chatBubbleContainer}>
      {/* User Message */}
      <View style={styles.userBubbleWrapper}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={12} color="#fff" />
        </View>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{item.prompt}</Text>
        </View>
      </View>

      {/* AI Response */}
      <View style={styles.aiBubbleWrapper}>
        <View style={styles.aiAvatar}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.aiAvatarGradient}
          >
            <Ionicons name="sparkles" size={12} color="#fff" />
          </LinearGradient>
        </View>
        <View style={styles.aiBubble}>
          {item.response ? (
            <Text style={styles.aiText}>{item.response}</Text>
          ) : (
            <View style={styles.typingContainer}>
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation,
                  },
                ]}
              />
              <Text style={styles.typingText}>AI is thinking...</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

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

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.headerIconGradient}
              >
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

        <FlatList
          ref={flatListRef}
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderChatBubble}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchHistory}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="chatbubble-outline" size={48} color="#667eea" />
              </View>
              <Text style={styles.emptyTitle}>Start a conversation</Text>
              <Text style={styles.emptySubtitle}>
                Ask me anything and I'll help you out! ✨
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <LinearGradient
            colors={["#1e293b", "#334155"]}
            style={styles.inputWrapper}
          >
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
