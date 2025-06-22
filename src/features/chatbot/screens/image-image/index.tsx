import { API_BASE_URL } from "@/config/env"; // Import từ file config thay vì @env
import {
  ImageToImageScreenNavigationProp,
  RootStackParamList,
} from "@/navigations/types";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
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
      console.log("🔄 Đang tải lịch sử từ:", `${API_BASE_URL}/image-to-image`);

      const response = await axios.get(`${API_BASE_URL}/image-to-image`);
      setHistory(response.data);

      console.log("✅ Tải lịch sử thành công:", response.data.length, "mục");
    } catch (error) {
      console.error("❌ Lỗi khi tải lịch sử:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải lịch sử. Vui lòng kiểm tra kết nối mạng."
      );
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
          "Không có quyền truy cập",
          "Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình."
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
      console.error("❌ Lỗi khi chọn ảnh:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  const handleTransform = async (imageUri: string) => {
    try {
      setTransforming(true);
      console.log("🔄 Đang chuyển đổi ảnh...");

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

      console.log("📤 Đang gửi yêu cầu đến:", `${API_BASE_URL}/image-to-image`);

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

      console.log("✅ Chuyển đổi ảnh thành công");

      // Cập nhật lịch sử với ảnh mới
      const newItem: ImageTransformItem = {
        id: apiResponse.data.id,
        originalImage: imageUri,
        transformedImage: apiResponse.data.imageUrl,
      };

      setHistory((prevHistory) => [newItem, ...prevHistory]);

      Alert.alert("Thành công", "Ảnh đã được chuyển đổi thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi chuyển đổi ảnh:", error);
      Alert.alert(
        "Lỗi",
        "Không thể chuyển đổi ảnh. Vui lòng kiểm tra kết nối mạng và thử lại."
      );
    } finally {
      setTransforming(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("🗑️ Đang xóa mục:", id);

      await axios.delete(`${API_BASE_URL}/image-to-image/${id}`);
      setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));

      console.log("✅ Xóa thành công");
      Alert.alert("Thành công", "Đã xóa ảnh khỏi lịch sử.");
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
      Alert.alert("Lỗi", "Không thể xóa. Vui lòng thử lại.");
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa ảnh này khỏi lịch sử?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => handleDelete(id) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Chuyển đổi ảnh</Text>

      <Button
        title={transforming ? "Đang xử lý..." : "Chọn ảnh"}
        onPress={pickImage}
        color="#007AFF"
        disabled={transforming}
      />

      {transforming && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang chuyển đổi ảnh...</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.prompt}>Ảnh gốc:</Text>
              <Image
                source={{ uri: item.originalImage }}
                style={styles.image}
              />

              <Text style={styles.prompt}>Ảnh đã chuyển đổi:</Text>
              {item.transformedImage ? (
                <Image
                  source={{ uri: item.transformedImage }}
                  style={styles.image}
                />
              ) : (
                <Text style={styles.noImageText}>Chưa có ảnh chuyển đổi</Text>
              )}

              <Button
                title="Xóa"
                onPress={() => confirmDelete(item.id)}
                color="#FF3B30"
              />
            </View>
          )}
          style={styles.historyList}
          refreshing={loading}
          onRefresh={fetchHistory}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Chưa có ảnh nào được chuyển đổi.{"\n"}
                Nhấn "Chọn ảnh" để bắt đầu!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ImageToImageScreen;
