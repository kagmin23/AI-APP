// LoginScreen.tsx
import { RootStackParamList } from "@/navigations/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient'; // or 'react-native-linear-gradient'
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { login } from "../../api/auth.api";
import styles from "./styles";

const { width } = Dimensions.get('window');

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Authenticating...");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Connecting to AI network...");
    
    try {
      const response = await login({
        email: email.trim(),
        password: password.trim()
      });

      if (response.token) {
        console.log('Login successful:', response.message);
      }
      
      setLoadingMessage("Neural link established! 🚀");
      
      setTimeout(() => {
        navigation.navigate("TextChat");
      }, 2000);

    } catch (error: any) {
      console.error("Login error:", error);
      let message = "Authentication failed";
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      Alert.alert("Access Denied", message);
      setIsLoading(false);
    }
  };

  // AI Brain Icon Component
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
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.subtitle}>Connect to your intelligent companion</Text>
        </View>
      </View>

      {/* Form Section */}
      <View style={[styles.formSection, { opacity: isLoading ? 0.6 : 1 }]}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#71717a"
            value={email}
            onChangeText={setEmail}
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#71717a"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.textInput}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
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
              styles.loginButton,
              (!email.trim() || !password.trim()) && styles.disabledButton
            ]}
            onPress={handleLogin}
            disabled={!email.trim() || !password.trim()}
          >
            <Text style={styles.loginButtonText}>Access AI Network</Text>
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>New to AI ?</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButtonText}>Create AI Profile</Text>
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

export default LoginScreen;