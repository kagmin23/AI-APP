import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
        onPress: () => {
          // TODO: xử lý logout (xóa token, chuyển hướng, v.v.)
          console.log("User logged out");
          // navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const handleProfile = () => {
    // TODO: điều hướng đến màn hình Profile nếu có
    console.log("Đi tới trang cá nhân");
    // navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity onPress={handleProfile} style={styles.iconWrapper}>
        <EvilIcons name="user" size={30} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>AI Application Development</Text>

      {/* Logout Icon */}
      <TouchableOpacity onPress={handleLogout} style={styles.iconWrapper}>
        <AntDesign name="logout" size={17} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
