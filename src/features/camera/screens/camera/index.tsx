import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  deleteCameraPhoto,
  getCameraPhotos,
  uploadCameraPhoto,
} from "../../api/camera.api";
import styles from "./styles";

const PhotoItem = memo(
  ({
    item,
    onPreview,
    onDelete,
  }: {
    item: { _id: string; cameraData: string };
    onPreview: (uri: string) => void;
    onDelete: (id: string) => void;
  }) => (
    <View style={styles.historyItemWrapper}>
      <TouchableOpacity onPress={() => onPreview(item.cameraData)}>
        <Image source={{ uri: item.cameraData }} style={styles.historyImage} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.trashIcon}
        onPress={() => {
          Alert.alert("Delete", "Delete this photo?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => onDelete(item._id),
            },
          ]);
        }}
      >
        <FontAwesome name="trash" size={16} color="white" />
      </TouchableOpacity>
    </View>
  )
);

const CameraScreen = () => {
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const [photos, setPhotos] = useState<{ _id: string; cameraData: string }[]>(
    []
  );
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getCameraPhotos();
        setPhotos(data);
      } catch (error) {
        console.error("Error loading photos", error);
        Toast.show({
          type: "error",
          text1: "❌ Failed to load photos",
        });
      }
    };

    fetchPhotos();
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("❌ Permission Denied", "You need camera permission.");
      return;
    }

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
        cameraType: useFrontCamera
          ? ImagePicker.CameraType.front
          : ImagePicker.CameraType.back,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        setPhoto(photoUri);
        fadeAnim.setValue(1);

        const base64 = await FileSystem.readAsStringAsync(photoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const base64Data = `data:image/jpg;base64,${base64}`;
        const response = await uploadCameraPhoto(base64Data);

        Toast.show({
          type: "success",
          text1: "✅ Photo uploaded successfully",
        });

        setPhotos((prev) => [
          { _id: response.id, cameraData: base64Data },
          ...prev,
        ]);

        setCountdown(5);
        let secondsLeft = 5;
        const interval = setInterval(() => {
          secondsLeft -= 1;
          if (secondsLeft === 0) {
            clearInterval(interval);
            setCountdown(null);
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }).start(() => setPhoto(""));
          } else {
            setCountdown(secondsLeft);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Camera error", error);
      Toast.show({
        type: "error",
        text1: "❌ Camera or upload failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (uri: string) => {
    setPreviewUri(uri);
    setPreviewVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCameraPhoto(id);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      Toast.show({
        type: "success",
        text1: "✅ Photo deleted successfully",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "❌ Failed to delete photo",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#0f0f1c", "#141436", "#1e1e4a"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.container}>
        <Text style={styles.title}>📷 Camera</Text>

        <View style={styles.photoBox}>
          {loading ? (
            <ActivityIndicator size="large" color="#06b6d4" />
          ) : photo ? (
            <>
              <Animated.Image
                source={{ uri: photo }}
                style={[styles.previewImage, { opacity: fadeAnim }]}
              />
              {countdown !== null && (
                <View style={styles.overlayDim}>
                  <View style={styles.countdownTextContainer}>
                    <Text style={styles.countdownLabel}>
                      Chuyển đổi ảnh sau
                    </Text>
                    <Text style={styles.countdownNumber}>{countdown}</Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.placeholder}>No photos taken yet</Text>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={styles.roundIconButton}
                >
                  <FontAwesome name="camera" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.captureButtonText}>Take a new photo</Text>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>🖼️ Photos History</Text>
        <FlatList
          data={photos}
          keyExtractor={(item) => item._id}
          horizontal
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <PhotoItem
              item={item}
              onPreview={handlePreview}
              onDelete={handleDelete}
            />
          )}
        />
      </View>

      <Modal visible={previewVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <Image source={{ uri: previewUri }} style={styles.modalImage} />
          <TouchableOpacity
            onPress={() => setPreviewVisible(false)}
            style={styles.modalCloseButton}
          >
            <FontAwesome name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Toast />
    </View>
  );
};

export default CameraScreen;
