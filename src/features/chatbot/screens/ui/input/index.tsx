import {
    COLORS,
    LIMITS,
    PLACEHOLDER_TEXTS,
} from "@/features/chatbot/constants/chat.constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import styles from "./styles";

interface InputComponentProps {
  input: string;
  sending: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onUploadImage?: () => void;
}

export const InputComponent: React.FC<InputComponentProps> = ({
  input,
  sending,
  onChangeText,
  onSend,
  onUploadImage,
}) => (
  <View style={styles.inputContainer}>
    <LinearGradient colors={COLORS.GRADIENT_INPUT} style={styles.inputWrapper}>
      <TextInput
        style={styles.textInput}
        value={input}
        onChangeText={onChangeText}
        placeholder={PLACEHOLDER_TEXTS.INPUT}
        placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
        multiline
        maxLength={LIMITS.MAX_INPUT_LENGTH}
      />

      {/* Upload image button */}
      <TouchableOpacity style={styles.uploadButton} onPress={onUploadImage}>
        <MaterialCommunityIcons name="paperclip" size={20} color="white" />
      </TouchableOpacity>

      {/* Send message button */}
      <TouchableOpacity
        style={[
          styles.sendButton,
          (!input.trim() || sending) && styles.sendButtonDisabled,
        ]}
        onPress={onSend}
        disabled={sending || !input.trim()}
      >
        <LinearGradient
          colors={
            !input.trim() || sending
              ? COLORS.GRADIENT_DISABLED
              : COLORS.GRADIENT_PRIMARY
          }
          style={styles.sendButtonGradient}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={17} color="#fff" />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  </View>
);
