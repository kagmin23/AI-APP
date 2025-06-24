import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

const CameraScreen = () => {
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Không có quyền", "Bạn cần cấp quyền sử dụng máy ảnh.");
      return;
    }

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở camera.");
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.title}>📸 Camera</Text>

        <View style={styles.photoContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#06b6d4" />
          ) : photo ? (
            <Image source={{ uri: photo }} style={styles.image} />
          ) : (
            <Text style={styles.noPhoto}>No photos taken yet.</Text>
          )}
        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Take a photo</Text>
              <FontAwesome
                name="camera-retro"
                size={16}
                color="white"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CameraScreen;
