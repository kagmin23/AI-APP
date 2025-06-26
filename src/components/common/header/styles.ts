import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Header styles
  container: {
    marginTop: 25,
    height: 40,
    backgroundColor: "#13293d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  iconWrapper: {
    // Thêm styles cho icon wrapper nếu cần
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalGradient: {
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  modalConfirmButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalConfirmGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

export default styles;