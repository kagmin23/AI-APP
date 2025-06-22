import { API_BASE_URL } from "@/config/env";
import {
  RootStackParamList,
  TextToImageScreenNavigationProp,
} from "@/navigations/types";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  Text,
  TextInput,
  View
} from "react-native";
import styles from "./styles";

type Props = {
  navigation: TextToImageScreenNavigationProp;
  route: RouteProp<RootStackParamList, "TextToImage">;
};

type ImageItem = {
  id: string;
  prompt: string;
  imageUrl: string;
};

const TextToImageScreen: React.FC<Props> = ({ navigation }) => {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ImageItem[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/text-to-image`);
      setHistory(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load history");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/text-to-image`, { prompt });
      setHistory([
        ...history,
        { id: response.data.id, prompt, imageUrl: response.data.imageUrl },
      ]);
      setPrompt("");
    } catch (error) {
      Alert.alert("Error", "Failed to generate image");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/text-to-image/${id}`);
      setHistory(history.filter((item) => item.id !== id));
    } catch (error) {
      Alert.alert("Error", "Failed to delete");
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Text to Image</Text>
      <TextInput
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Describe the image..."
      />
      <Button title="Generate Image" onPress={handleGenerate} color="#007AFF" />
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.prompt}>Prompt: {item.prompt}</Text>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : null}
            <Button
              title="Delete"
              onPress={() => handleDelete(item.id)}
              color="#FF3B30"
            />
          </View>
        )}
        style={styles.historyList}
      />
    </View>
  );
};

export default TextToImageScreen;