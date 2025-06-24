import { API_BASE_URL } from "@/config/env";
import {
  ImageToImageScreenNavigationProp,
  RootStackParamList,
} from "@/navigations/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import styles from "./styles";

type Props = {
  navigation: ImageToImageScreenNavigationProp;
  route: RouteProp<RootStackParamList, "ImageToImage">;
};

type ImageTransformItem = {
  id: string;
  originalImage: string;
  transformedImage: string;
};

const ImageToImageScreen: React.FC<Props> = ({ navigation }) => {
  const [history, setHistory] = useState<ImageTransformItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transforming, setTransforming] = useState<boolean>(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/image-to-image`);
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

  const pickImage = async () => {
    try {
      // Yêu cầu quyền truy cập thư viện ảnh
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "No access",
          "The app needs access to the photo library to select images."
        );
        return;
      }

      // Mở thư viện ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8, // Giảm chất lượng để tăng tốc độ upload
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets[0]) {
        await handleTransform(result.assets[0].uri);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error when selecting photo",
        text2: "Unable to select photo. Please try again.",
      });
    }
  };

  const handleTransform = async (imageUri: string) => {
    try {
      setTransforming(true);
      console.log("🔄 Image conversion in progress...");

      // Đọc file ảnh dưới dạng base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Tạo FormData để gửi file
      const formData = new FormData();

      // Tạo blob từ base64
      const response = await fetch(`data:image/jpeg;base64,${base64}`);
      const blob = await response.blob();

      formData.append("image", blob as any, "image.jpg");

      console.log("📤 Sending request to:", `${API_BASE_URL}/image-to-image`);

      const apiResponse = await axios.post(
        `${API_BASE_URL}/image-to-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // Timeout 30 giây
        }
      );

      console.log("✅ Image conversion successful");

      // Cập nhật lịch sử với ảnh mới
      const newItem: ImageTransformItem = {
        id: apiResponse.data.id,
        originalImage: imageUri,
        transformedImage: apiResponse.data.imageUrl,
      };

      setHistory((prevHistory) => [newItem, ...prevHistory]);
      Toast.show({
        type: "success",
        text1: "✅ Image has been converted successfully!",
        text2: "Waiting...",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error converting image",
        text2: "Unable to convert image. Please try again.",
      });
    } finally {
      setTransforming(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("🗑️ Deleting items:", id);

      await axios.delete(`${API_BASE_URL}/image-to-image/${id}`);
      setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));

      Toast.show({
        type: "success",
        text1: "✅ Deleted successfully",
        text2: "Photo deleted from history...",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "❌ Error while deleting",
        text2: "Unable to delete. Please try again.",
      });
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Confirm deletion",
      "Are you sure you want to delete this photo from history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(id),
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, marginBottom: 100 }}>
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

      {/* Main Content */}
      <View style={styles.screen}>
        <Text style={styles.title}>🖼️ Convert Photos with AI</Text>

        {transforming && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#06b6d4" />
            <Text style={styles.loadingText}>
              Image conversion in progress...
            </Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#06b6d4" />
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            style={styles.historyList}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.label}>Original photo</Text>
                <Image
                  source={{ uri: item.originalImage }}
                  style={styles.image}
                />

                <Text style={styles.label}>Image converted</Text>
                {item.transformedImage ? (
                  <Image
                    source={{ uri: item.transformedImage }}
                    style={styles.image}
                  />
                ) : (
                  <Text style={styles.noImageText}>No photos yet</Text>
                )}

                <TouchableOpacity
                  onPress={() => confirmDelete(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={20} color="#f87171" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No images have been converted yet.
                </Text>
              </View>
            }
            refreshing={loading}
            onRefresh={fetchHistory}
          />
        )}

        {/* Floating Pick Image Button */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              transforming && styles.pickButtonDisabled,
            ]}
            onPress={pickImage}
            disabled={transforming}
          >
            {transforming ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <MaterialCommunityIcons
                name="image-auto-adjust"
                size={24}
                color="white"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ImageToImageScreen;
