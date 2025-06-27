import { logout } from "@/features/auth/api/auth.api";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { StackActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Cách 1: Import từ 2 file riêng
import styles from "./styles";

// Hoặc Cách 2: Import từ 1 file với named exports
// import { headerStyles as styles, modalStyles } from "./styles";

const Header: React.FC = () => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await logout(); // Xóa token, userId

      // Reset navigation stack và chuyển về Login
      navigation.dispatch(StackActions.replace("Login"));
    } catch (error) {
      console.error("Logout error:", error);
      // Có thể hiển thị toast hoặc modal lỗi khác
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleProfile = () => {
    console.log("Đi tới trang cá nhân");
    // navigation.navigate("Profile");
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleProfile} style={styles.iconWrapper}>
          <EvilIcons name="user" size={30} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>AI Application Development</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.iconWrapper}>
          <AntDesign name="logout" size={17} color="white" />
        </TouchableOpacity>
      </View>

      {/* Custom Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <TouchableWithoutFeedback onPress={cancelLogout}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={["#1e293b", "#334155"]}
                  style={styles.modalGradient}
                >
                  {/* Icon */}
                  <View style={styles.modalIconContainer}>
                    <AntDesign name="logout" size={32} color="#ef4444" />
                  </View>

                  {/* Title */}
                  <Text style={styles.modalTitle}>Logout</Text>

                  {/* Message */}
                  <Text style={styles.modalMessage}>
                    Are you sure you want to log out of the application?
                  </Text>

                  {/* Actions */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={cancelLogout}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalCancelText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalConfirmButton}
                      onPress={confirmLogout}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={["#ef4444", "#dc2626"]}
                        style={styles.modalConfirmGradient}
                      >
                        <Text style={styles.modalConfirmText}>Logout</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Header;