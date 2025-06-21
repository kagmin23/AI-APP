import { Button, Input } from "@/components/common";
import { RegisterScreenNavigationProp } from "@/navigator/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { register } from "../../api/auth.api";
import { Register } from "../../types/auth.types";
import styles from "./styles";

const RegisterScreen: React.FC = () => {
  const [form, setForm] = useState<Register>({ email: "", password: "", name: "" });
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // Update form field
  const handleChange = (field: keyof Register, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

const handleRegister = async () => {
  if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
    return Alert.alert("Error", "Please fill in all fields");
  }

  try {
    const response = await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    console.log("Register success:", response.user);

    Alert.alert("Success", "Account created successfully", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Login"),
      },
    ]);
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    Alert.alert(
      "Register failed",
      error.response?.data?.message || "Something went wrong"
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
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      {/* Form */}
      <Input
        placeholder="Your Name"
        value={form.name}
        onChangeText={(value) => handleChange("name", value)}
        keyboardType="default"
      />
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
        title="Register"
        onPress={handleRegister}
        disabled={!form.email.trim() || !form.password.trim()}
      />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate("Login")}
        variant="secondary"
      />
    </View>
  );
};

export default RegisterScreen;
