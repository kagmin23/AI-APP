import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  historyList: { marginTop: 20 },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderRadius: 5,
  },
  prompt: { fontWeight: "bold", color: "#333", marginBottom: 5 },
  image: { width: "100%", height: 200, borderRadius: 5, marginBottom: 5 },
});

export default styles;
