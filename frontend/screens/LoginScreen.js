

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Dimensions,
//   Platform
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../api';
// import { FontAwesome, Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { selectedRole } = route.params || {};

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       if (Platform.OS === 'web') {
//         alert('❗ Error: Please enter both email and password.');
//       } else {
//         Alert.alert('❗ Error', 'Please enter both email and password.');
//       }
//       return;
//     }

//     try {
//       console.log("📤 Sending login request with:", { email, password, role: selectedRole });

//       const res = await api.post('/login', {
//         email,
//         password,
//         role: selectedRole || 'traveler',
//       });

//       const { token, role, name } = res.data;

//       await AsyncStorage.setItem('token', token);

//       if (Platform.OS === 'web') {
//         alert(`✅ Welcome back, ${name || 'User'}!`);
//       } else {
//         Alert.alert('✅ Success', `Welcome back, ${name || 'User'}!`);
//       }

//       if (role === 'vendor') {
//         navigation.navigate('VendorTypeSelectionScreen', { name, email });
//       } else {
//         navigation.navigate('TravelerDashboard', { name });
//       }

//     } catch (err) {
//       const errorMessage = err.response?.data?.error || err.message || 'Unexpected error';
//       console.log("❌ Login failed:", errorMessage);

//       if (Platform.OS === 'web') {
//         alert('❌ Login failed: ' + errorMessage);
//       } else {
//         Alert.alert('❌ Login failed', errorMessage);
//       }
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {Platform.OS === 'web' && (
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backArrow}
//         >
//           <Ionicons name="arrow-back" size={24} color="#0077b6" />
//         </TouchableOpacity>
//       )}

//       <View style={styles.card}>
//         <Text style={styles.headerTitle}>
//           <Text style={styles.boldText}></Text>
//         </Text>

//         <Text style={styles.subtitleText}>
//           Log in to <Text style={styles.brandText}>TravelMate</Text> and continue your journey 🌍
//         </Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#777"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#777"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>

//         <View style={styles.dividerContainer}>
//           <View style={styles.divider} />
//           <Text style={styles.dividerText}>or</Text>
//           <View style={styles.divider} />
//         </View>

//         <View style={styles.iconRow}>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="google" size={22} color="#EA4335" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="facebook" size={22} color="#3b5998" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="apple" size={22} color="#000" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.bottomLinks}>
//           <Text style={styles.registerLink}>
//             Don’t have an account?{' '}
//             <Text
//               style={styles.register}
//               onPress={() => navigation.navigate('Register', { selectedRole })}
//             >
//               Create Account
//             </Text>
//           </Text>

//           <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
//             <Text style={styles.forgotText}>Forgot Password?</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: width < 360 ? 15 : 20,
//     backgroundColor: '#f5f8fa'
//   },
//   backArrow: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     zIndex: 999,
//   },
//   card: {
//     width: '95%',
//     maxWidth: 420,
//     backgroundColor: '#ffffffee',
//     padding: width < 360 ? 20 : 30,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 6,
//     alignItems: 'center'
//   },
//   headerTitle: {
//     fontSize: width < 360 ? 20 : 22,
//     textAlign: 'center',
//     marginBottom: 10
//   },
//   boldText: {
//     fontSize: width < 360 ? 18 : 20,
//     fontWeight: '700',
//     color: '#003554'
//   },
//   subtitleText: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20
//   },
//   brandText: {
//     color: '#0077b6',
//     fontWeight: '700'
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
//   loginButton: {
//     backgroundColor: '#0077b6',
//     width: '100%',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 10,
//     marginBottom: 15
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center'
//   },
//   registerLink: {
//     fontSize: 14,
//     color: '#555'
//   },
//   register: {
//     fontWeight: '600',
//     color: '#0077b6'
//   },
//   forgotText: {
//     color: '#0077b6',
//     marginTop: 10,
//     textAlign: 'center',
//     fontSize: 14
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 16,
//     width: '100%',
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ccc',
//   },
//   dividerText: {
//     marginHorizontal: 8,
//     color: '#888',
//     fontSize: 14,
//   },
//   iconRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 20,
//   },
//   iconButton: {
//     backgroundColor: '#fff',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//   },
//   bottomLinks: {
//     marginTop: 16,
//     alignItems: 'center',
//     gap: 6,
//   },
// });

// export default LoginScreen;



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Dimensions,
//   Platform
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../api';
// import { FontAwesome, Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { selectedRole } = route.params || {};

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       const msg = 'Please enter both email and password.';
//       Platform.OS === 'web'
//         ? alert(`❗ Error: ${msg}`)
//         : Alert.alert('❗ Error', msg);
//       return;
//     }

//     try {
//       console.log("📤 Sending login request with:", { email, password, role: selectedRole });

//       const res = await api.post('/login', {
//         email,
//         password,
//         role: selectedRole || 'traveler',
//       });

//       const { token, role, name } = res.data;
//       await AsyncStorage.setItem('token', token);

//       Platform.OS === 'web'
//         ? alert(`✅ Welcome back, ${name || 'User'}!`)
//         : Alert.alert('✅ Success', `Welcome back, ${name || 'User'}!`);

//       if (role === 'vendor') {
//         navigation.navigate('VendorTypeSelectionScreen', { name, email });
//       } else {
//         navigation.navigate('TravelerDashboard', { name });
//       }

//     } catch (err) {
//       const errorMessage = err.response?.data?.error || err.message || 'Unexpected error';
//       console.log("❌ Login failed:", errorMessage);

//       Platform.OS === 'web'
//         ? alert('❌ Login failed: ' + errorMessage)
//         : Alert.alert('❌ Login failed', errorMessage);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {Platform.OS === 'web' && (
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
//           <Ionicons name="arrow-back" size={24} color="#0077b6" />
//         </TouchableOpacity>
//       )}

//       <View style={styles.card}>
//         {/* Role Badge */}
//         {selectedRole && (
//           <View
//             style={[
//               styles.roleBadge,
//               selectedRole === 'vendor' ? styles.vendorBadge : styles.travelerBadge,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.roleText,
//                 selectedRole === 'vendor' ? styles.vendorText : styles.travelerText,
//               ]}
//             >
//               {selectedRole === 'vendor' ? '🧑‍💼 Hello Vendor' : '✈️ Hello Traveler'}
//             </Text>
//           </View>
//         )}

//         <Text style={styles.subtitleText}>
//           Welcome to the  <Text style={styles.brandText}>TravelMate</Text>🌍
//         </Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#777"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#777"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>

//         {/* Divider */}
//         <View style={styles.dividerContainer}>
//           <View style={styles.divider} />
//           <Text style={styles.dividerText}>or continue with</Text>
//           <View style={styles.divider} />
//         </View>

//         {/* Social login */}
//         <View style={styles.iconRow}>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="google" size={22} color="#EA4335" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="facebook" size={22} color="#3b5998" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="apple" size={22} color="#000" />
//           </TouchableOpacity>
//         </View>

//         {/* Bottom links */}
//         <View style={styles.bottomLinks}>
//           <Text style={styles.registerLink}>
//             Don’t have an account?{' '}
//             <Text
//               style={styles.register}
//               onPress={() => navigation.navigate('Register', { selectedRole })}
//             >
//               Create Account
//             </Text>
//           </Text>

//           <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
//             <Text style={styles.forgotText}>Forgot Password?</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: width < 360 ? 15 : 20,
//     backgroundColor: '#f5f8fa'
//   },
//   backArrow: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     zIndex: 999,
//   },
//   card: {
//     width: '95%',
//     maxWidth: 420,
//     backgroundColor: '#ffffffee',
//     padding: width < 360 ? 20 : 30,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 6,
//     alignItems: 'center'
//   },
//   roleBadge: {
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//     marginBottom: 10,
//     alignSelf: 'center',
//   },
//   travelerBadge: {
//     backgroundColor: '#d4f4dd',
//   },
//   vendorBadge: {
//     backgroundColor: '#e0f0ff',
//   },
//   roleText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   travelerText: {
//     color: '#218838',
//   },
//   vendorText: {
//     color: '#0077b6',
//   },
//   subtitleText: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20
//   },
//   brandText: {
//     color: '#0077b6',
//     fontWeight: '700'
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
//   loginButton: {
//     backgroundColor: '#0077b6',
//     width: '100%',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 10,
//     marginBottom: 15
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center'
//   },
//   registerLink: {
//     fontSize: 14,
//     color: '#555'
//   },
//   register: {
//     fontWeight: '600',
//     color: '#0077b6'
//   },
//   forgotText: {
//     color: '#0077b6',
//     marginTop: 10,
//     textAlign: 'center',
//     fontSize: 14
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 16,
//     width: '100%',
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ccc',
//   },
//   dividerText: {
//     marginHorizontal: 8,
//     color: '#888',
//     fontSize: 14,
//   },
//   iconRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 20,
//   },
//   iconButton: {
//     backgroundColor: '#fff',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//   },
//   bottomLinks: {
//     marginTop: 16,
//     alignItems: 'center',
//     gap: 6,
//   },
// });

// export default LoginScreen;



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../api';
// import { FontAwesome, Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { selectedRole } = route.params || {};

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       const msg = 'Please enter both email and password.';
//       Platform.OS === 'web'
//         ? alert(`❗ Error: ${msg}`)
//         : Alert.alert('❗ Error', msg);
//       return;
//     }

//     try {
//       console.log("📤 Sending login request with:", { email, password, role: selectedRole });

//       const res = await api.post('/login', {
//         email,
//         password,
//         role: selectedRole || 'traveler',
//       });

//       const { token, role } = res.data;

//       if (!token) {
//         throw new Error('Token is missing in response. Cannot proceed.');
//       }

//       await AsyncStorage.setItem('token', token);

//       Platform.OS === 'web'
//         ? alert('✅ Welcome back!')
//         : Alert.alert('✅ Success', 'Welcome back!');

//       if (role === 'vendor') {
//         navigation.navigate('VendorTypeSelectionScreen', { email });
//       } else {
//         navigation.navigate('TravelerDashboard');
//       }

//     } catch (err) {
//       const errorMessage = err.response?.data?.error || err.message || 'Unexpected error';
//       console.log("❌ Login failed:", errorMessage);

//       Platform.OS === 'web'
//         ? alert('❌ Login failed: ' + errorMessage)
//         : Alert.alert('❌ Login failed', errorMessage);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {Platform.OS === 'web' && (
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
//           <Ionicons name="arrow-back" size={24} color="#0077b6" />
//         </TouchableOpacity>
//       )}

//       <View style={styles.card}>
//         {selectedRole && (
//           <View
//             style={[
//               styles.roleBadge,
//               selectedRole === 'vendor' ? styles.vendorBadge : styles.travelerBadge,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.roleText,
//                 selectedRole === 'vendor' ? styles.vendorText : styles.travelerText,
//               ]}
//             >
//               {selectedRole === 'vendor' ? '🧑‍💼 Hello Vendor' : '✈️ Hello Traveler'}
//             </Text>
//           </View>
//         )}

//         <Text style={styles.subtitleText}>
//           Welcome to <Text style={styles.brandText}>TravelMate</Text> 🌍
//         </Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#777"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#777"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Login</Text>
//         </TouchableOpacity>

//         <View style={styles.dividerContainer}>
//           <View style={styles.divider} />
//           <Text style={styles.dividerText}>or continue with</Text>
//           <View style={styles.divider} />
//         </View>

//         <View style={styles.iconRow}>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="google" size={22} color="#EA4335" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="facebook" size={22} color="#3b5998" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <FontAwesome name="apple" size={22} color="#000" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.bottomLinks}>
//           <Text style={styles.registerLink}>
//             Don’t have an account?{' '}
//             <Text
//               style={styles.register}
//               onPress={() => navigation.navigate('Register', { selectedRole })}
//             >
//               Create Account
//             </Text>
//           </Text>

//           <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
//             <Text style={styles.forgotText}>Forgot Password?</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: width < 360 ? 15 : 20,
//     backgroundColor: '#f5f8fa',
//   },
//   backArrow: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     zIndex: 999,
//   },
//   card: {
//     width: '95%',
//     maxWidth: 420,
//     backgroundColor: '#ffffffee',
//     padding: width < 360 ? 20 : 30,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 6,
//     alignItems: 'center',
//   },
//   roleBadge: {
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//     marginBottom: 10,
//     alignSelf: 'center',
//   },
//   travelerBadge: {
//     backgroundColor: '#d4f4dd',
//   },
//   vendorBadge: {
//     backgroundColor: '#e0f0ff',
//   },
//   roleText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   travelerText: {
//     color: '#218838',
//   },
//   vendorText: {
//     color: '#0077b6',
//   },
//   subtitleText: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   brandText: {
//     color: '#0077b6',
//     fontWeight: '700',
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   loginButton: {
//     backgroundColor: '#0077b6',
//     width: '100%',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   registerLink: {
//     fontSize: 14,
//     color: '#555',
//   },
//   register: {
//     fontWeight: '600',
//     color: '#0077b6',
//   },
//   forgotText: {
//     color: '#0077b6',
//     marginTop: 10,
//     textAlign: 'center',
//     fontSize: 14,
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 16,
//     width: '100%',
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ccc',
//   },
//   dividerText: {
//     marginHorizontal: 8,
//     color: '#888',
//     fontSize: 14,
//   },
//   iconRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 20,
//   },
//   iconButton: {
//     backgroundColor: '#fff',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//   },
//   bottomLinks: {
//     marginTop: 16,
//     alignItems: 'center',
//     gap: 6,
//   },
// });

// export default LoginScreen;



import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedRole } = route.params || {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const res = await api.post('/login', {
        email,
        password,
        role: selectedRole || 'traveler',
      });

      const { token, role, name } = res.data;

      await AsyncStorage.setItem('token', token);

      Alert.alert('✅ Success', `Welcome back, ${name}!`);

      if (role === 'vendor') {
        navigation.navigate('VendorTypeSelectionScreen', { name, email });
      } else {
        navigation.navigate('TravelerDashboard', { name });
      }
    } catch (err) {
      Alert.alert('❌ Login failed', err.response?.data?.error || err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>
          <Text style={styles.boldText}>Welcome Back 👋</Text>
        </Text>

        <Text style={styles.subtitleText}>
          Log in to <Text style={styles.brandText}>TravelMate</Text> and continue your journey 🌍
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Icons */}
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="google" size={22} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="facebook" size={22} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="apple" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Account Links */}
        <View style={styles.bottomLinks}>
          <Text style={styles.registerLink}>
            Don’t have an account?{' '}
            <Text
              style={styles.register}
              onPress={() => navigation.navigate('Register', { selectedRole })}
            >
              Create Account
            </Text>
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width < 360 ? 15 : 20,
    backgroundColor: '#f5f8fa'
  },
  card: {
    width: '95%',
    maxWidth: 420,
    backgroundColor: '#ffffffee',
    padding: width < 360 ? 20 : 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: width < 360 ? 20 : 22,
    textAlign: 'center',
    marginBottom: 10
  },
  boldText: {
    fontSize: width < 360 ? 18 : 20,
    fontWeight: '700',
    color: '#003554'
  },
  subtitleText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20
  },
  brandText: {
    color: '#0077b6',
    fontWeight: '700'
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
  loginButton: {
    backgroundColor: '#0077b6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 15
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  registerLink: {
    fontSize: 14,
    color: '#555'
  },
  register: {
    fontWeight: '600',
    color: '#0077b6'
  },
  forgotText: {
    color: '#0077b6',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 14,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  bottomLinks: {
    marginTop: 16,
    alignItems: 'center',
    gap: 6,
  },
});

export default LoginScreen;