
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Dimensions
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import api from "../api";

// const { width } = Dimensions.get('window');

// const ResetPasswordScreen = () => {
//   const [email, setEmail] = useState('');
//   const navigation = useNavigation();

//   const handleResetRequest = async() => {
//     console.log(email)
//     if (!email) {
//       alert('Please enter your email');
//       return;
//     }
//     try {
//       const res = await api.post('/email-varification', {
//         email
//       });

//       Alert.alert('✅ Success', res.data.message);
//     } catch (err) {
//       Alert.alert('❌ Failed', err.response?.data?.error || 'Server error');
//     }
    
//     // 🔒 Simulate email reset link
//     alert('Reset link sent to your email. Please check your inbox.');
//     setEmail('');
//     navigation.navigate('ResetPasswordScreen2'); // ✅ Adjusted to your actual route
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.headerTitle}>Forgot Your Password?</Text>
//         <Text style={styles.subtitleText}>
//           Enter your registered email address and we’ll send you a link to reset your password.
//         </Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Enter your email"
//           placeholderTextColor="#777"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <TouchableOpacity style={styles.resetButton} onPress={handleResetRequest}>
//           <Text style={styles.buttonText}>Send Reset Link</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f8fa'
//   },
//   card: {
//     width: width < 420 ? '100%' : '90%',
//     maxWidth: 450,
//     backgroundColor: '#ffffffee',
//     padding: width < 400 ? 20 : 30,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 6,
//     alignItems: 'center'
//   },
//   headerTitle: {
//     fontSize: width < 380 ? 20 : 22,
//     fontWeight: '700',
//     color: '#003554',
//     marginBottom: 10,
//     textAlign: 'center'
//   },
//   subtitleText: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16
//   },
//   resetButton: {
//     backgroundColor: '#0077b6',
//     width: '100%',
//     paddingVertical: 14,
//     borderRadius: 12
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center'
//   }
// });

// export default ResetPasswordScreen;


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Dimensions,
//   Platform
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import api from "../api";

// const { width } = Dimensions.get('window');
// const isWeb = Platform.OS === 'web';

// const ResetPasswordScreen = () => {
//   const [email, setEmail] = useState('');
//   const navigation = useNavigation();

//   const handleResetRequest = async () => {
//     if (!email) {
//       Alert.alert('❗ Error', 'Please enter your email');
//       return;
//     }

//     try {
//       const res = await api.post('/email-varification', { email });
//       Alert.alert('✅ Success', res.data.message);
//       setEmail('');
//       navigation.navigate('ResetPasswordScreen2');
//     } catch (err) {
//       Alert.alert('❌ Failed', err.response?.data?.error || 'Server error');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {isWeb && (
//         <TouchableOpacity style={styles.backArrow} onPress={() => navigation.navigate('Login')}>
//           <Ionicons name="arrow-back" size={24} color="#007bff" />
//         </TouchableOpacity>
//       )}

//       <View style={styles.card}>
//         <Text style={styles.headerTitle}>Forgot Your Password?</Text>
//         <Text style={styles.subtitleText}>
//           Enter your registered email address and we’ll send you a link to reset your password.
//         </Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Enter your email"
//           placeholderTextColor="#777"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <TouchableOpacity style={styles.resetButton} onPress={handleResetRequest}>
//           <Text style={styles.buttonText}>Send Reset Link</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f8fa'
//   },
//   backArrow: {
//     position: 'absolute',
//     top: 30,
//     left: 30,
//     zIndex: 10,
//   },
//   card: {
//     width: width < 420 ? '100%' : '90%',
//     maxWidth: 450,
//     backgroundColor: '#ffffffee',
//     padding: width < 400 ? 20 : 30,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 6,
//     alignItems: 'center'
//   },
//   headerTitle: {
//     fontSize: width < 380 ? 20 : 22,
//     fontWeight: '700',
//     color: '#003554',
//     marginBottom: 10,
//     textAlign: 'center'
//   },
//   subtitleText: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16
//   },
//   resetButton: {
//     backgroundColor: '#0077b6',
//     width: '100%',
//     paddingVertical: 14,
//     borderRadius: 12
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center'
//   }
// });

// export default ResetPasswordScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from "../api";

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();

  const handleResetRequest = async () => {
    const trimmed = String(email || '').trim().toLowerCase();
    if (!trimmed) {
      Alert.alert('❗ Error', 'Please enter your email');
      return;
    }
    setSubmitting(true);
    try {
      // ✅ Call your backend route
      const res = await api.post('/auth/email-varification', { email: trimmed });
      Alert.alert('✅ Success', res?.data?.message || 'Verification code sent to your email.');
      setEmail('');
      // pass the email forward so screen 2 has it
      navigation.navigate('ResetPasswordScreen2', { email: trimmed });
    } catch (err) {
      const msg = err?.response?.data?.error || 'Server error';
      Alert.alert('❌ Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.headerTitle}>Forgot Your Password?</Text>
        <Text style={styles.subtitleText}>
          Enter your registered email address and we’ll send you a verification code.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.resetButton, submitting && { opacity: 0.6 }]}
          onPress={handleResetRequest}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Sending...' : 'Send Reset Code'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f8fa'
  },
  backArrow: {
    position: 'absolute',
    top: 30,
    left: 30,
    zIndex: 10,
  },
  card: {
    width: width < 420 ? '100%' : '90%',
    maxWidth: 450,
    backgroundColor: '#ffffffee',
    padding: width < 400 ? 20 : 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: width < 380 ? 20 : 22,
    fontWeight: '700',
    color: '#003554',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitleText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16
  },
  resetButton: {
    backgroundColor: '#0077b6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default ResetPasswordScreen;
