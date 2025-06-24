import { Input } from "@/components/common";
import { RegisterScreenNavigationProp } from "@/navigations/types";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { register } from "../../api/auth.api";
import { Register } from "../../types/auth.types";
import styles from "./styles";

const { width } = Dimensions.get('window');

const RegisterScreen: React.FC = () => {
  const [form, setForm] = useState<Register>({ email: "", password: "", name: "" });
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Creating account...");

  // Update form field
  const handleChange = (field: keyof Register, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
  if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
    return Alert.alert("Error", "Please fill in all fields");
  }

  setIsLoading(true);
  setLoadingMessage("Connecting to AI network...");

  try {
    const response = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    });

    setLoadingMessage("Neural link established! 🚀");

    Toast.show({
      type: "success",
      text1: "🎉 Registered successfully",
      text2: "Redirecting to login page...",
      visibilityTime: 2000,
    });

    setTimeout(() => {
      navigation.navigate("Login");
    }, 3000);
  } catch (error: any) {
    console.error("Register error:", error);
    let message = "Registration failed";

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    // ❌ Hiển thị lỗi bằng toast
    Toast.show({
      type: "error",
      text1: "😢 Registration failed",
      text2: message,
    });

    setIsLoading(false);
  }
};

  // AI Brain Icon Component (same as LoginScreen)
  const AIBrainIcon = () => (
    <View style={styles.brainContainer}>
      <View style={styles.brainCore}>
        <View style={styles.synapse1} />
        <View style={styles.synapse2} />
        <View style={styles.synapse3} />
        <View style={styles.centerCircuit} />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[
        '#0a0a0f',      // Dark blue-black at top
        '#1a1a2e',      // Deep purple-blue
        '#16213e',      // Dark navy blue
        '#0f1419',      // Very dark blue-gray
        '#0a0a0f'       // Back to dark at bottom
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <AIBrainIcon />
        <View style={[styles.titleSection, { opacity: isLoading ? 0.6 : 1 }]}>
          <Text style={styles.welcomeText}>Join Us!</Text>
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.subtitle}>Create your intelligent account profile</Text>
        </View>
      </View>

      {/* Form Section */}
      <View style={[styles.formSection, { opacity: isLoading ? 0.6 : 1 }]}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <Input
            placeholder="Enter your name"
            placeholderTextColor="#71717a"
            value={form.name}
            onChangeText={(value) => handleChange("name", value)}
            style={styles.textInput}
            keyboardType="default"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <Input
            placeholder="Enter your email"
            placeholderTextColor="#71717a"
            value={form.email}
            onChangeText={(value) => handleChange("email", value)}
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <Input
            placeholder="Create a secure password"
            placeholderTextColor="#71717a"
            value={form.password}
            onChangeText={(value) => handleChange("password", value)}
            style={styles.textInput}
            secureTextEntry
            editable={!isLoading}
          />
        </View>
      </View>

      {/* Loading or Action Section */}
      {isLoading ? (
        <View style={styles.loadingSection}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#06b6d4" />
            <Text style={[
              styles.loadingText,
              { color: loadingMessage.includes('🚀') ? '#10b981' : '#06b6d4' }
            ]}>
              {loadingMessage}
            </Text>
          </View>
          
          {/* Animated progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
            <View style={styles.progressFill} />
          </View>
        </View>
      ) : (
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.registerButton,
              (!form.name.trim() || !form.email.trim() || !form.password.trim()) && styles.disabledButton
            ]}
            onPress={handleRegister}
            disabled={!form.name.trim() || !form.email.trim() || !form.password.trim()}
          >
            <Text style={styles.registerButtonText}>Create AI Account</Text>
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Already have an account?</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Access AI Network</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Advanced Neural Networks</Text>
      </View>
    </LinearGradient>
  );
};

export default RegisterScreen;