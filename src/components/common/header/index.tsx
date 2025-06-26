import { logout } from "@/features/auth/api/auth.api";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { StackActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

const Header: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Bạn có chắc muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await logout(); // Xóa token, userId
            console.log("User logged out");

            // Reset navigation stack và chuyển về Login
            navigation.dispatch(StackActions.replace("Login"));
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Lỗi", "Đăng xuất thất bại. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  const handleProfile = () => {
    console.log("Đi tới trang cá nhân");
    // navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfile} style={styles.iconWrapper}>
        <EvilIcons name="user" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>AI Application Development</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.iconWrapper}>
        <AntDesign name="logout" size={17} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
