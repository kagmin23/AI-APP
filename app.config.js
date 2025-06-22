import "dotenv/config";

export default {
  expo: {
    name: "ai-app",
    slug: "ai-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      apiMapKey: process.env.GOOGLE_MAPS_API_KEY || "",
      environment: process.env.NODE_ENV || "development",
    },
  },
};
