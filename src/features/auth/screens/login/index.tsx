import { Button, Input } from "@/components/common";
import { LoginScreenNavigationProp } from "@/navigator/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { login } from "../../api/auth.api";
import { Login } from "../../types/auth.types";
import styles from "./styles";

const LoginScreen: React.FC = () => {
  const [form, setForm] = useState<Login>({ email: "", password: "" });
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Update form field
  const handleChange = (field: keyof Login, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    try {
      const response = await login({
        email: form.email,
        password: form.password,
      });

      const user = response.user;
      console.log("Login success:", user);

      Alert.alert("Success", "Logged in successfully");

      // TODO: Điều hướng sang trang chính nếu cần
      // navigation.navigate("Home");
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      Alert.alert(
        "Login failed",
        error.response?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{ uri: "https://via.placeholder.com/100" }} // Thay bằng logo thực tế
        style={styles.logo}
      />
      {/* Title and subtitle */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Form */}
      <Input
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
      />
      <Input
        placeholder="Password"
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
      />

      {/* Buttons */}
      <Button
        title="Login"
        onPress={handleLogin}
        disabled={!form.email.trim() || !form.password.trim()}
      />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate("Register")}
        variant="secondary"
      />
    </View>
  );
};

export default LoginScreen;
