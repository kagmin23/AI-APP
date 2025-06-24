import { API_BASE_URL } from "@/config/env";
import { TextToImageScreenNavigationProp } from "@/navigations/types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
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

type Props = {
  navigation: TextToImageScreenNavigationProp;
  route: RouteProp<any, any>;
};

type ImageItem = {
  id: string;
  prompt: string;
  imageUrl: string;
};

const TextToImageScreen: React.FC<Props> = () => {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/text-to-image`);
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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      setGenerating(true);
      const response = await axios.post(`${API_BASE_URL}/text-to-image`, {
        prompt,
      });
      const newImage: ImageItem = {
        id: response.data.id,
        prompt,
        imageUrl: response.data.imageUrl,
      };
      setHistory((prev) => [newImage, ...prev]);
      setPrompt("");
    } catch (error) {
      Alert.alert("Error", "Unable to create image");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/text-to-image/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      Alert.alert("Error", "Photos cannot be deleted");
    }
  };

  return (
    <View style={{ flex: 1, marginBottom: 100 }}>
      {/* Gradient background */}
      <LinearGradient
        colors={[
          "#0a0a0f",
          "#1a1a2e",
          "#16213e",
          "#0f1419",
          "#0a0a0f",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject} // 💡 Ensure this line is correct
      />

      {/* Main Content */}
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>🎨 Create Image from Text</Text>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.imageCard}>
              <Text style={styles.promptLabel}>Prompt</Text>
              <Text style={styles.promptText}>{item.prompt}</Text>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : null}
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={20} color="#f87171" />
              </TouchableOpacity>
            </View>
          )}
          refreshing={loading}
          onRefresh={fetchHistory}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No images have been created yet.
              </Text>
            </View>
          }
        />

        {/* Input section */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter image description..."
            placeholderTextColor="#ccc"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, generating && styles.sendButtonDisabled]}
            onPress={handleGenerate}
            disabled={!prompt.trim() || generating}
          >
            {generating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="sparkles-outline" size={14} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TextToImageScreen;
