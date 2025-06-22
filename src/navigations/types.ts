import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
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
export type TextChatScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TextChat"
>;
export type TextToImageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TextToImage"
>;
export type ImageToImageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ImageToImage"
>;
export type CameraScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Camera"
>;
export type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Map"
>;
