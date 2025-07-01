// import như cũ...
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
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
import { deleteCameraPhoto, getCameraPhotos, uploadCameraPhoto } from "../../api/camera.api";
import styles from "./styles";

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

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getCameraPhotos();
        setPhotos(data);
      } catch (error) {
        console.error("Error loading photos", error);
      }
    };

    fetchPhotos();
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need camera permission.");
      return;
    }

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
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

        Alert.alert("Uploaded", `Photo ID: ${response.id}`);

        setPhotos((prev) => [
          { _id: response.id, cameraData: base64Data },
          ...prev,
        ]);

        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          delay: 2000,
          useNativeDriver: true,
        }).start(() => setPhoto(""));
      }
    } catch (error) {
      console.error("Camera error", error);
      Alert.alert("Error", "Camera or upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (uri: string) => {
    setPreviewUri(uri);
    setPreviewVisible(true);
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
              <View style={styles.overlayContainer}>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={styles.roundIconButton}
                >
                  <FontAwesome name="camera" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.captureButtonText}>Take another photo</Text>
              </View>
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
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.historyItemWrapper}>
              <TouchableOpacity onPress={() => handlePreview(item.cameraData)}>
                <Image
                  source={{ uri: item.cameraData }}
                  style={styles.historyImage}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.trashIcon}
                onPress={() => {
                  Alert.alert(
                    "Delete",
                    "Are you sure you want to delete this photo?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await deleteCameraPhoto(item._id);
                            setPhotos((prev) =>
                              prev.filter((p) => p._id !== item._id)
                            );
                          } catch (err) {
                            Alert.alert("Error", "Failed to delete photo.");
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <FontAwesome name="trash" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Modal xem ảnh */}
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
    </View>
  );
};

export default CameraScreen;
