// src/navigations/types.ts
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Stack Navigator
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  TextChat: undefined;
  TextToImage: undefined;
  ImageToImage: undefined;
  Camera: undefined;
  Map: undefined;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

// Bottom Tab Navigator
export type MainTabParamList = {
  TextChat: undefined;
  TextToImage: undefined;
  ImageToImage: undefined;
  Camera: undefined;
  Map: undefined;
};

export type TextChatScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  "TextChat"
>;

export type TextToImageScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  "TextToImage"
>;

export type ImageToImageScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  "ImageToImage"
>;

export type CameraScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  "Camera"
>;

export type MapScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  "Map"
>;
