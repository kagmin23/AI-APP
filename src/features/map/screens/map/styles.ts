import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#06b6d4",
    textAlign: "center",
  },
  noLocationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noLocationText: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#9ca3af",
    textAlign: "center",
    paddingBottom: 100,
  },
  map: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  roundButton: {
    position: "absolute",
    bottom: 25,
    left: "50%", // 👈 đẩy nút ra giữa theo chiều ngang
    transform: [{ translateX: -25 }], // 👈 -½ chiều rộng để canh giữa
    width: 50,
    height: 50,
    borderRadius: 25, // 👈 đúng ½ chiều cao/chiều rộng
    backgroundColor: "#06b6d4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: "row", // giữ lại nếu có nhiều item
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 8, // Khoảng cách giữa chữ và icon
  },
});

export default styles;
