import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  photoBox: {
    width: "90%",
    height: 220,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  overlayContainer: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  roundIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  captureButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  emptyBox: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  placeholder: {
    color: "#ccc",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 20,
  },

  buttonInline: {
    flexDirection: "row",
    backgroundColor: "#06b6d4",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    gap: 10,
  },

  buttonOverlay: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    backgroundColor: "rgba(6, 182, 212, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  button: {
    flexDirection: "row",
    backgroundColor: "#06b6d4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 50,
    marginLeft: 8,
  },
  historyImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "70%",
    borderRadius: 16,
    resizeMode: "contain",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },

  historyItemWrapper: {
    position: "relative",
    marginRight: 10,
  },

  trashIcon: {
    position: "absolute",
    top: 8,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 9,
    borderRadius: 10,
    zIndex: 1,
  },
  countdownOverlay: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
  },
  countdownText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  previewImageWrapper: {
    position: "relative",
  },

  overlayDim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  countdownTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  countdownLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },

  countdownNumber: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
});

export default styles;
