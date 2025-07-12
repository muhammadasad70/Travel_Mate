import { Platform } from 'react-native';

const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8080'; // web localhost
  }

  // ✅ Hardcoded IP — use your actual IP here
  return 'http://172.20.10.11:8080'; // IP from your ifconfig
};

export default getBaseURL;
