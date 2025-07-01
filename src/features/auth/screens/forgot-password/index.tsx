import { RootStackParamList } from "@/navigations/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { forgotPassword, resetPassword } from "../../api/auth.api";
import styles from "./styles";

type ForgotPasswordScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "⚠️ Missing email",
        text2: "Please enter your registered email address",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await forgotPassword(email.trim());
      Toast.show({
        type: "success",
        text1: "📩 OTP sent!",
        text2: res.message || "Check your email inbox",
      });
      setShowModal(true);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      Toast.show({
        type: "error",
        text1: "❌ Failed",
        text2: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "⚠️ Incomplete fields",
        text2: "All fields are required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "❌ Password mismatch",
        text2: "Passwords do not match",
      });
      return;
    }

    setResetLoading(true);
    try {
      const res = await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
      });

      Toast.show({
        type: "success",
        text1: "✅ Password Reset!",
        text2: res.message,
      });

      setShowModal(false);
      navigation.navigate("Login");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      Toast.show({
        type: "error",
        text1: "❌ Reset Failed",
        text2: msg,
      });
    } finally {
      setResetLoading(false);
    }
  };

  // AIBrainIcon giống login
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
      colors={["#0a0a0f", "#1a1a2e", "#16213e", "#0f1419", "#0a0a0f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <AIBrainIcon />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          We’ll send an OTP code to your email
        </Text>
      </View>

      <View style={styles.formSection}>
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

        <TouchableOpacity
          style={[styles.loginButton, !email.trim() && styles.disabledButton]}
          onPress={handleForgotPassword}
          disabled={!email.trim()}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 14, alignItems: "center" }}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.registerButtonText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Explore with AI</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Advanced Neural Networks
        </Text>
      </View>

      {/* ✅ Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#1e293b",
              borderRadius: 14,
              padding: 20,
              borderWidth: 1,
              borderColor: "#334155",
            }}
          >
            <Text style={[styles.title, { fontSize: 20, marginBottom: 10 }]}>
              Reset Password
            </Text>

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              value={email}
              style={[styles.textInput, { backgroundColor: "#334155" }]}
              editable={false}
            />

            <Text style={[styles.inputLabel, { marginTop: 14 }]}>OTP</Text>
            <TextInput
              placeholder="Enter the OTP code"
              placeholderTextColor="#71717a"
              value={otp}
              onChangeText={setOtp}
              style={styles.textInput}
              keyboardType="numeric"
            />

            <Text style={[styles.inputLabel, { marginTop: 14 }]}>
              New Password
            </Text>
            <TextInput
              placeholder="Enter new password"
              placeholderTextColor="#71717a"
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.textInput}
              secureTextEntry
            />

            <Text style={[styles.inputLabel, { marginTop: 14 }]}>
              Confirm Password
            </Text>
            <TextInput
              placeholder="Re-enter new password"
              placeholderTextColor="#71717a"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.textInput}
              secureTextEntry
            />

            <TouchableOpacity
              style={[
                styles.loginButton,
                (!otp.trim() ||
                  !newPassword.trim() ||
                  !confirmPassword.trim()) &&
                  styles.disabledButton,
              ]}
              onPress={handleResetPassword}
              disabled={
                !otp.trim() || !newPassword.trim() || !confirmPassword.trim()
              }
            >
              {resetLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: "center", marginTop: 6 }}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.registerButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default ForgotPasswordScreen;
