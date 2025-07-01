import { PLACEHOLDER_TEXTS } from "@/features/chatbot/constants/chat.constants";
import {
    AIResponseProps,
    ChatBubbleProps,
    EditingBubbleProps,
    NormalBubbleProps,
} from "@/features/chatbot/types/chat.types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    ActivityIndicator,
    Animated,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import styles from "./styles";

// Bubble đang chỉnh sửa
export const EditingBubble: React.FC<
  EditingBubbleProps & { loading?: boolean }
> = ({ item, onSave, onCancel, onUpdateItem, loading = false }) => (
  <>
    <TextInput
      style={styles.editInput}
      value={item.prompt}
      onChangeText={(text) => onUpdateItem(item._id, { prompt: text })}
      multiline
      editable={!loading}
    />
    <View style={styles.editActions}>
      <TouchableOpacity
        style={[styles.editActionButton, {width: 40}]}
        onPress={() => onSave(item._id, item.prompt)}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size={16} color="#10b981" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 10 }}>Send</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editActionButton}
        onPress={() => onCancel(item._id)}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Ionicons name="close" size={16} color="#ef4444" />
      </TouchableOpacity>
    </View>
  </>
);

// Bubble bình thường (chưa chỉnh sửa)
export const NormalBubble: React.FC<NormalBubbleProps> = ({
  item,
  onEdit,
  onDelete,
}) => (
  <>
    <Text style={styles.userText}>{item.prompt}</Text>
    <View style={styles.bubbleActions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onEdit(item._id)}
        activeOpacity={0.6}
      >
        <Ionicons name="pencil" size={12} color="#cbd5e1" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onDelete(item._id)}
        activeOpacity={0.6}
      >
        <Ionicons name="trash" size={12} color="#cbd5e1" />
      </TouchableOpacity>
    </View>
  </>
);

// Bubble AI phản hồi
export const AIResponse: React.FC<AIResponseProps> = ({
  item,
  typingAnimation,
  onImageError,
}) => {
  if (item.response) {
    return <Text style={styles.aiText}>{item.response}</Text>;
  }

  if (item.imageUrl) {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.generatedImage}
          resizeMode="cover"
          onError={onImageError}
        />
      </View>
    );
  }

  return (
    <View style={styles.typingContainer}>
      {[1, 2, 3].map((i) => (
        <Animated.View
          key={i}
          style={[styles.typingDot, { opacity: typingAnimation }]}
        />
      ))}
      <Text style={styles.typingText}>
        {item.type === "image"
          ? PLACEHOLDER_TEXTS.GENERATING_IMAGE
          : PLACEHOLDER_TEXTS.AI_THINKING}
      </Text>
    </View>
  );
};

// ChatBubble chính
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  item,
  typingAnimation,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onUpdateItem,
  onImageError,
  updating,
}) => (
  <View style={styles.chatBubbleContainer}>
    {/* User Message */}
    <View style={styles.userBubbleWrapper}>
      <View style={styles.userAvatar}>
        <Ionicons name="person" size={12} color="#fff" />
      </View>
      <View style={styles.userBubble}>
        {item.isEditing ? (
          <EditingBubble
            item={item}
            onSave={onSave}
            onCancel={onCancel}
            onUpdateItem={onUpdateItem}
            loading={updating}
          />
        ) : (
          <NormalBubble item={item} onEdit={onEdit} onDelete={onDelete} />
        )}
      </View>
    </View>

    {/* AI Response */}
    <View style={styles.aiBubbleWrapper}>
      <View style={styles.aiAvatar}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.aiAvatarGradient}
        >
          <Ionicons name="sparkles" size={12} color="#fff" />
        </LinearGradient>
      </View>
      <View style={styles.aiBubble}>
        <AIResponse
          item={item}
          typingAnimation={typingAnimation}
          onImageError={onImageError}
        />
      </View>
    </View>
  </View>
);

// Empty view
export const EmptyStateComponent: React.FC = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIcon}>
      <Ionicons name="chatbubble-outline" size={48} color="#667eea" />
    </View>
    <Text style={styles.emptyTitle}>{PLACEHOLDER_TEXTS.EMPTY_TITLE}</Text>
    <Text style={styles.emptySubtitle}>{PLACEHOLDER_TEXTS.EMPTY_SUBTITLE}</Text>
  </View>
);

// Header
export const HeaderComponent: React.FC = () => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <View style={styles.headerIcon}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.headerIconGradient}
        >
          <Ionicons name="chatbubbles" size={14} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.headerTitle}>AI Assistant</Text>
      <View style={styles.statusIndicator}>
        <View style={styles.onlineIndicator} />
        <Text style={styles.statusText}>Online</Text>
      </View>
    </View>
  </View>
);
