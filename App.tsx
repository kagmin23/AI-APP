import {
  CameraScreen,
  ImageToImageScreen,
  LoginScreen,
  MapScreen,
  RegisterScreen,
  TextChatScreen,
  TextToImageScreen,
} from "@/features";
import { RootStackParamList } from "@/navigations/types";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="TextChat" component={TextChatScreen} />
        <Stack.Screen name="TextToImage" component={TextToImageScreen} />
        <Stack.Screen name="ImageToImage" component={ImageToImageScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
