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
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  pickButton: {
    backgroundColor: "#06b6d4",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
  },
  pickButtonContent: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pickButtonIcon: {},
  pickButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 5, // khoảng cách giữa chữ và icon
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 25,
    right: 20,
  },

  floatingButton: {
    backgroundColor: "#06b6d4", // màu xanh cyan
    width: 50,
    height: 50,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // pickButtonDisabled: {
  //   backgroundColor: "#888", // khi đang loading
  // },

  pickButtonDisabled: {
    backgroundColor: "#4b5563",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#ccc",
  },
  historyList: {
    flex: 1,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: "relative",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#60a5fa",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 16,
  },
  noImageText: {
    fontSize: 14,
    color: "#aaa",
    fontStyle: "italic",
    marginBottom: 12,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  emptyText: {
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default styles;
