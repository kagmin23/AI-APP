import { Header } from "@/components/common";
import {
  CameraScreen,
  ImageToImageScreen,
  MapScreen,
  TextChatScreen,
} from "@/features";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";
import { tabBarStyles } from "./styles";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarActiveTintColor: "#06b6d4",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: tabBarStyles.tabBar, // 👈 Gọi style ở đây
        tabBarBackground: () => (
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
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName = "apps";

          switch (route.name) {
            case "TextChat":
              iconName = "chatbubble-ellipses-outline";
              break;
            // case "TextToImage":
            //   iconName = "image-outline";
            //   break;
            case "ImageToImage":
              iconName = "swap-horizontal-outline";
              break;
            case "Camera":
              iconName = "camera-outline";
              break;
            case "Map":
              iconName = "map-outline";
              break;
          }

          return <Ionicons name={iconName as any} size={18} color={color} />;
        },
      })}
    >
      <Tab.Screen name="TextChat" component={TextChatScreen} />
      {/* <Tab.Screen name="TextToImage" component={TextToImageScreen} /> */}
      <Tab.Screen name="ImageToImage" component={ImageToImageScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
