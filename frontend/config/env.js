
// config/env.js
import { Platform } from "react-native";

// Change this one word when you switch where you test Android from:
const ANDROID_TARGET = "device"; // "device" | "emulator"

const getBaseURL = () => {
  if (Platform.OS === "web" || Platform.OS === "ios") {
    // Web + iOS Simulator can hit your laptop on localhost
    return "http://localhost:8080";
  }
  if (Platform.OS === "android") {
    // Android emulator needs the 10.0.2.2 magic host
    if (ANDROID_TARGET === "emulator") return "http://10.0.2.2:8080";
    // Physical Android phone on the same Wi-Fi needs your laptop's LAN IP
    return "http://192.168.110.128:8080"; // <-- your machine IP
  }

  // Fallback (rare platforms)
  return "http://192.168.110.128:8080";
};

export default getBaseURL;
