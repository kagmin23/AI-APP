import {
  MapScreenNavigationProp,
  RootStackParamList,
} from "@/navigations/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import styles from "./styles";

type Props = {
  navigation: MapScreenNavigationProp;
  route: RouteProp<RootStackParamList, "Map">;
};

const MapScreen: React.FC<Props> = ({ navigation }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Sorry, we need location permissions.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
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
        <Text style={styles.title}>📍 Current location</Text>

        {!location ? (
          <View style={styles.noLocationContainer}>
            <Text style={styles.noLocationText}>No location available</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            />
          </MapView>
        )}

        <TouchableOpacity style={styles.roundButton} onPress={getLocation}>
          <View style={styles.buttonContent}>
            <MaterialIcons name="my-location" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapScreen;
