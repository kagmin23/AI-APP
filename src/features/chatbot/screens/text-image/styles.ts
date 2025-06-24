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
  inputSection: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    backgroundColor: "#1f2937",
    borderRadius: 50,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: "#fff",
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: "#06b6d4",
    padding: 7,
    left: 10,
    borderRadius: 50,
  },
  sendButtonDisabled: {
    backgroundColor: "#4b5563",
  },
  imageCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 12,
    borderRadius: 10,
    resizeMode: "cover",
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#60a5fa",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  promptText: {
    fontSize: 15,
    color: "#f9fafb",
    lineHeight: 22,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default styles;