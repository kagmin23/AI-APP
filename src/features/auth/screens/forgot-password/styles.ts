import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    paddingHorizontal: 20,
    paddingTop: 100,
  },

  header: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
  },
  brainContainer: {
    marginBottom: 10,
  },
  brainCore: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerCircuit: {
    width: 14,
    height: 14,
    backgroundColor: '#06b6d4',
    borderRadius: 8,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  synapse1: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#22d3ee',
    borderRadius: 1.5,
    top: 12,
    left: 18,
  },
  synapse2: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#22d3ee',
    borderRadius: 2,
    top: 15,
    right: 15,
  },
  synapse3: {
    position: 'absolute',
    width: 3.5,
    height: 3.5,
    backgroundColor: '#22d3ee',
    borderRadius: 1.75,
    bottom: 14,
    left: 22,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  formSection: {
    marginBottom: 20,
  },

  inputContainer: {
    marginBottom: 26,
  },

  inputLabel: {
    fontSize: 12,
    color: "#e2e8f0",
    fontWeight: "600",
    marginBottom: 6,
  },

  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1.5,
    borderRadius: 12,
    fontSize: 11,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#ffffff",
    fontWeight: "500",
  },

  loginButton: {
    backgroundColor: "#06b6d4",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#06b6d4",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  disabledButton: {
    backgroundColor: "rgba(6, 182, 212, 0.3)",
    shadowOpacity: 0,
    elevation: 0,
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  registerButtonText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "600",
  },

  footer: {
    alignItems: "center",
    paddingBottom: 30,
    marginTop: 10,
  },

  footerText: {
    color: "#475569",
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
   dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 5,

  },
  dividerText: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  
});

export default styles;
