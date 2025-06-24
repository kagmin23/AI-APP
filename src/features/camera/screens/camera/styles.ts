import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#06b6d4",
    textAlign: "center",
    marginTop: 10,
  },
  photoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPhoto: {
    color: "#94a3b8",
    fontSize: 10,
    fontStyle: "italic",
    textAlign: "center",
    paddingBottom: 100,
  },
  image: {
    width: "100%",
    height: 400,
    borderRadius: 12,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#333",
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 6, // khoảng cách giữa chữ và icon
  },

  icon: {
    // Không cần gì thêm trừ khi bạn muốn chỉnh padding/margin thêm
  },
  button: {
    backgroundColor: "#06b6d4",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
  },
});

export default styles;
