

// // // screens/LoginScreen.js
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View, Text, TextInput, TouchableOpacity, StyleSheet,
// //   ScrollView, Alert, Dimensions, Platform
// // } from 'react-native';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { Ionicons, FontAwesome } from '@expo/vector-icons';
// // import api from '../api';

// // const { width } = Dimensions.get('window');
// // const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// // export default function LoginScreen() {
// //   const navigation = useNavigation();
// //   const route = useRoute();

// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [showPwd, setShowPwd] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   // 👇 NEW: robust role source (params OR storage), normalized
// //   const [loginRole, setLoginRole] = useState('traveler');

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const fromParam = (route.params?.selectedRole || '').toString().toLowerCase().trim();
// //         const fromStorage = ((await AsyncStorage.getItem('login_role')) || '').toLowerCase().trim();
// //         const role = fromParam || fromStorage || 'traveler';
// //         setLoginRole(role);
// //       } catch (e) {
// //         setLoginRole('traveler');
// //       }
// //     })();
// //   }, [route.params]);

// //   const showMsg = (title, msg) => {
// //     if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
// //     else Alert.alert(title || 'Notice', msg);
// //   };

// //   const handleLogin = async () => {
// //     if (!EMAIL_RE.test(email.trim())) {
// //       showMsg('Invalid Email', 'Please enter a valid email address.');
// //       return;
// //     }
// //     if (!password) {
// //       showMsg('Error', 'Please enter your password.');
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       // ✅ Use the resolved loginRole
// //       const res = await api.post('/auth/login', {
// //         email: email.trim(),
// //         password,
// //         role: loginRole,            // <— IMPORTANT
// //       });

// //       const { token, role, name, user_id, completed } = res.data || {};

// //       await AsyncStorage.multiSet([
// //         ['token', token || ''],
// //         ['isLoggedIn', 'true'],
// //         ['role', (role || loginRole || 'traveler')],
// //         ['userId', String(user_id ?? '')],
// //         // optional: persist the role used
// //         ['login_role', (role || loginRole || 'traveler')],
// //       ]);

// //       const displayName = name || email.split('@')[0];

// //       if (!completed) {
// //         showMsg('Almost done ✍️', 'Please complete your profile to continue.');
// //         navigation.reset({
// //           index: 0,
// //           routes: [{
// //             name: 'ProfileCompletion',
// //             params: { selectedRole: (role || loginRole || 'traveler') }
// //           }],
// //         });
// //         return;
// //       }

// //       showMsg('✅ Success', `Welcome back, ${displayName}!`);

// //       // Vendor vs Traveler routing
// //       const finalRole = (role || loginRole || 'traveler');
// //       if (finalRole === 'vendor') {
// //         navigation.reset({
// //           index: 0,
// //           routes: [{
// //             name: 'VendorTypeSelection',
// //             params: { name: displayName, email: email.trim() }
// //           }],
// //         });
// //       } else {
// //         navigation.reset({ index: 0, routes: [{ name: 'TravelerDashboard' }] });
// //       }
// //     } catch (err) {
// //       const msg =
// //         err?.response?.data?.error ||
// //         err?.userMessage ||
// //         err?.message ||
// //         'Login failed. Please try again.';
// //       showMsg('❌ Login failed', msg);
// //       console.log('Login error details:', err?.response?.data || err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <View style={styles.card}>
// //         <Text style={styles.headerTitle}>
// //           <Text style={styles.boldText}>Welcome Back 👋</Text>
// //         </Text>

// //         <Text style={styles.subtitleText}>
// //           Log in to <Text style={styles.brandText}>TravelMate</Text> and continue your journey 🌍
// //         </Text>

// //         <TextInput
// //           style={styles.input}
// //           placeholder="Email"
// //           placeholderTextColor="#777"
// //           value={email}
// //           onChangeText={setEmail}
// //           keyboardType="email-address"
// //           autoCapitalize="none"
// //         />

// //         <View style={styles.passwordRow}>
// //           <TextInput
// //             style={[styles.input, styles.passwordInput]}
// //             placeholder="Password"
// //             placeholderTextColor="#777"
// //             secureTextEntry={!showPwd}
// //             value={password}
// //             onChangeText={setPassword}
// //           />
// //           <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd(s => !s)}>
// //             <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={20} />
// //           </TouchableOpacity>
// //         </View>

// //         <TouchableOpacity
// //           style={[styles.loginButton, loading && { opacity: 0.7 }]}
// //           onPress={handleLogin}
// //           disabled={loading}
// //         >
// //           <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
// //         </TouchableOpacity>

// //         {/* Divider */}
// //         <View style={styles.dividerContainer}>
// //           <View style={styles.divider} />
// //           <Text style={styles.dividerText}>or</Text>
// //           <View style={styles.divider} />
// //         </View>

// //         {/* Social Icons (placeholders) */}
// //         <View style={styles.iconRow}>
// //           <TouchableOpacity style={styles.iconButton}>
// //             <FontAwesome name="google" size={22} color="#EA4335" />
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.iconButton}>
// //             <FontAwesome name="facebook" size={22} color="#3b5998" />
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.iconButton}>
// //             <FontAwesome name="apple" size={22} color="#000" />
// //           </TouchableOpacity>
// //         </View>

// //         {/* Links */}
// //         <View style={styles.bottomLinks}>
// //           <Text style={styles.registerLink}>
// //             Don’t have an account?{' '}
// //             <Text
// //               style={styles.register}
// //               onPress={() => navigation.navigate('Register', { selectedRole: loginRole })}
// //             >
// //               Create Account
// //             </Text>
// //           </Text>

// //           <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
// //             <Text style={styles.forgotText}>Forgot Password?</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: width < 360 ? 15 : 20, backgroundColor: '#f5f8fa' },
// //   card: {
// //     width: '95%', maxWidth: 420, backgroundColor: '#ffffffee', padding: width < 360 ? 20 : 30,
// //     borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 },
// //     shadowRadius: 8, elevation: 6, alignItems: 'center',
// //   },
// //   headerTitle: { fontSize: width < 360 ? 20 : 22, textAlign: 'center', marginBottom: 10 },
// //   boldText: { fontSize: width < 360 ? 18 : 20, fontWeight: '700', color: '#003554' },
// //   subtitleText: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 },
// //   brandText: { color: '#0077b6', fontWeight: '700' },
// //   input: { width: '100%', backgroundColor: '#f0f0f0', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
// //   passwordRow: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
// //   passwordInput: { flex: 1, marginBottom: 0 },
// //   eyeBtn: { marginLeft: 8, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
// //   loginButton: { backgroundColor: '#0077b6', width: '100%', paddingVertical: 14, borderRadius: 12, marginTop: 10, marginBottom: 15 },
// //   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
// //   registerLink: { fontSize: 14, color: '#555' },
// //   register: { fontWeight: '600', color: '#0077b6' },
// //   forgotText: { color: '#0077b6', marginTop: 10, textAlign: 'center', fontSize: 14 },
// //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, width: '100%' },
// //   divider: { flex: 1, height: 1, backgroundColor: '#ccc' },
// //   dividerText: { marginHorizontal: 8, color: '#888', fontSize: 14 },
// //   iconRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
// //   iconButton: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 2 },
// //   bottomLinks: { marginTop: 16, alignItems: 'center', gap: 6 },
// // });



// // screens/LoginScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet,
//   ScrollView, Alert, Dimensions, Platform
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons, FontAwesome } from '@expo/vector-icons';
// import * as WebBrowser from 'expo-web-browser';
// import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
// WebBrowser.maybeCompleteAuthSession();
// import api from '../api';

// WebBrowser.maybeCompleteAuthSession();

// const { width } = Dimensions.get('window');
// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// // Google discovery
// const G_DISCOVERY = {
//   authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
//   tokenEndpoint: 'https://oauth2.googleapis.com/token',
// };
// // Facebook endpoint
// const FB_AUTH = 'https://www.facebook.com/v18.0/dialog/oauth';

// export default function LoginScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPwd, setShowPwd] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // role source (params OR storage), normalized
//   const [loginRole, setLoginRole] = useState('traveler');

//   useEffect(() => {
//     (async () => {
//       try {
//         const fromParam = (route.params?.selectedRole || '').toString().toLowerCase().trim();
//         const fromStorage = ((await AsyncStorage.getItem('login_role')) || '').toLowerCase().trim();
//         const role = fromParam || fromStorage || 'traveler';
//         setLoginRole(role);
//       } catch {
//         setLoginRole('traveler');
//       }
//     })();
//   }, [route.params]);

//   const showMsg = (title, msg) => {
//     if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
//     else Alert.alert(title || 'Notice', msg);
//   };

//   // -------- Email/Password login (unchanged) --------
//   const handleLogin = async () => {
//     if (!EMAIL_RE.test(email.trim())) {
//       showMsg('Invalid Email', 'Please enter a valid email address.');
//       return;
//     }
//     if (!password) {
//       showMsg('Error', 'Please enter your password.');
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.post('/auth/login', {
//         email: email.trim(),
//         password,
//         role: loginRole,
//       });

//       const { token, role, name, user_id, completed } = res.data || {};

//       await AsyncStorage.multiSet([
//         ['token', token || ''],
//         ['isLoggedIn', 'true'],
//         ['role', (role || loginRole || 'traveler')],
//         ['userId', String(user_id ?? '')],
//         ['login_role', (role || loginRole || 'traveler')],
//       ]);

//       const displayName = name || email.split('@')[0];

//       if (!completed) {
//         showMsg('Almost done ✍️', 'Please complete your profile to continue.');
//         navigation.reset({
//           index: 0,
//           routes: [{
//             name: 'ProfileCompletion',
//             params: { selectedRole: (role || loginRole || 'traveler') }
//           }],
//         });
//         return;
//       }

//       showMsg('✅ Success', `Welcome back, ${displayName}!`);
//       const finalRole = (role || loginRole || 'traveler');
//       if (finalRole === 'vendor') {
//         navigation.reset({
//           index: 0,
//           routes: [{
//             name: 'VendorTypeSelection',
//             params: { name: displayName, email: email.trim() }
//           }],
//         });
//       } else {
//         navigation.reset({ index: 0, routes: [{ name: 'TravelerDashboard' }] });
//       }
//     } catch (err) {
//       const msg =
//         err?.response?.data?.error ||
//         err?.userMessage ||
//         err?.message ||
//         'Login failed. Please try again.';
//       showMsg('❌ Login failed', msg);
//       console.log('Login error details:', err?.response?.data || err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   //                 Social Login (NEW)
//   // =========================================================

//   // Use Expo proxy during dev (simplest). For production web, set your own redirect.
//   const redirectUri = makeRedirectUri({ useProxy: true });

//   // --- Google (ID Token) ---
//   const [googleReq, googleRes, googlePrompt] = useAuthRequest(
//     {
//       clientId: Platform.select({
//         ios:     '<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com',
//         android: '<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com',
//         web:     '<YOUR_WEB_CLIENT_ID>.apps.googleusercontent.com',
//       }),
//       redirectUri,
//       responseType: ResponseType.IdToken,
//       scopes: ['openid', 'email', 'profile'],
//     },
//     G_DISCOVERY
//   );

//   // --- Facebook (Access Token) ---
//   const [fbReq, fbRes, fbPrompt] = useAuthRequest(
//     {
//       clientId: '<YOUR_FACEBOOK_APP_ID>',
//       redirectUri,
//       responseType: ResponseType.Token,
//       scopes: ['public_profile', 'email'],
//     },
//     { authorizationEndpoint: FB_AUTH }
//   );

//   useEffect(() => {
//     (async () => {
//       // Google response
//       if (googleRes?.type === 'success' && googleRes.params?.id_token) {
//         const idToken = googleRes.params.id_token;
//         try {
//           setLoading(true);
//           const res = await api.post('/auth/social', {
//             provider: 'google',
//             idToken,
//             role: loginRole, // optional hint to backend
//           });
//           await handlePostAuth(res.data);
//         } catch (e) {
//           showMsg('Google Sign-in failed', e?.response?.data?.error || e?.message || 'Try again.');
//         } finally {
//           setLoading(false);
//         }
//       }
//       // Facebook response
//       if (fbRes?.type === 'success' && fbRes.params?.access_token) {
//         const accessToken = fbRes.params.access_token;
//         try {
//           setLoading(true);
//           const res = await api.post('/auth/social', {
//             provider: 'facebook',
//             accessToken,
//             role: loginRole,
//           });
//           await handlePostAuth(res.data);
//         } catch (e) {
//           showMsg('Facebook Sign-in failed', e?.response?.data?.error || e?.message || 'Try again.');
//         } finally {
//           setLoading(false);
//         }
//       }
//     })();
//   }, [googleRes, fbRes]);

//   const handlePostAuth = async (data) => {
//     const { token, role, user_id, completed } = data || {};
//     await AsyncStorage.multiSet([
//       ['token', token || ''],
//       ['isLoggedIn', 'true'],
//       ['role', (role || loginRole || 'traveler')],
//       ['userId', String(user_id ?? '')],
//       ['login_role', (role || loginRole || 'traveler')],
//     ]);

//     if (!completed) {
//       showMsg('Almost done ✍️', 'Please complete your profile to continue.');
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'ProfileCompletion', params: { selectedRole: (role || loginRole || 'traveler') } }],
//       });
//       return;
//     }

//     showMsg('✅ Success', 'Welcome to TravelMate!');
//     const finalRole = (role || loginRole || 'traveler');
//     if (finalRole === 'vendor') {
//       navigation.reset({ index: 0, routes: [{ name: 'VendorTypeSelection' }] });
//     } else {
//       navigation.reset({ index: 0, routes: [{ name: 'TravelerDashboard' }] });
//     }
//   };

//   // =========================================================

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.headerTitle}>
//           <Text style={styles.boldText}>Welcome Back 👋</Text>
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
//           autoCapitalize="none"
//         />

//         <View style={styles.passwordRow}>
//           <TextInput
//             style={[styles.input, styles.passwordInput]}
//             placeholder="Password"
//             placeholderTextColor="#777"
//             secureTextEntry={!showPwd}
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd(s => !s)}>
//             <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={20} />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[styles.loginButton, loading && { opacity: 0.7 }]}
//           onPress={handleLogin}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//         </TouchableOpacity>

//         {/* Divider */}
//         <View style={styles.dividerContainer}>
//           <View className="divider-left" style={styles.divider} />
//           <Text style={styles.dividerText}>or</Text>
//           <View className="divider-right" style={styles.divider} />
//         </View>

//         {/* Social Icons (wired) */}
//         <View style={styles.iconRow}>
//           <TouchableOpacity
//             style={styles.iconButton}
//             disabled={!googleReq || loading}
//             onPress={() => googlePrompt({ useProxy: true })}
//             accessibilityLabel="Continue with Google"
//           >
//             <FontAwesome name="google" size={22} color="#EA4335" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.iconButton}
//             disabled={!fbReq || loading}
//             onPress={() => fbPrompt({ useProxy: true })}
//             accessibilityLabel="Continue with Facebook"
//           >
//             <FontAwesome name="facebook" size={22} color="#3b5998" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.iconButton} disabled accessibilityLabel="Apple Sign-in (coming soon)">
//             {/* <FontAwesome name="apple" size={22} color="#000" /> */}
//           </TouchableOpacity>
//         </View>

//         {/* Links */}
//         <View style={styles.bottomLinks}>
//           <Text style={styles.registerLink}>
//             Don’t have an account?{' '}
//             <Text
//               style={styles.register}
//               onPress={() => navigation.navigate('Register', { selectedRole: loginRole })}
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
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: width < 360 ? 15 : 20, backgroundColor: '#f5f8fa' },
//   card: {
//     width: '95%', maxWidth: 420, backgroundColor: '#ffffffee', padding: width < 360 ? 20 : 30,
//     borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8, elevation: 6, alignItems: 'center',
//   },
//   headerTitle: { fontSize: width < 360 ? 20 : 22, textAlign: 'center', marginBottom: 10 },
//   boldText: { fontSize: width < 360 ? 18 : 20, fontWeight: '700', color: '#003554' },
//   subtitleText: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 },
//   brandText: { color: '#0077b6', fontWeight: '700' },
//   input: { width: '100%', backgroundColor: '#f0f0f0', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
//   passwordRow: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
//   passwordInput: { flex: 1, marginBottom: 0 },
//   eyeBtn: { marginLeft: 8, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
//   loginButton: { backgroundColor: '#0077b6', width: '100%', paddingVertical: 14, borderRadius: 12, marginTop: 10, marginBottom: 15 },
//   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
//   registerLink: { fontSize: 14, color: '#555' },
//   register: { fontWeight: '600', color: '#0077b6' },
//   forgotText: { color: '#0077b6', marginTop: 10, textAlign: 'center', fontSize: 14 },
//   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, width: '100%' },
//   divider: { flex: 1, height: 1, backgroundColor: '#ccc' },
//   dividerText: { marginHorizontal: 8, color: '#888', fontSize: 14 },
//   iconRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
//   iconButton: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 2 },
//   bottomLinks: { marginTop: 16, alignItems: 'center', gap: 6 },
// });





// screens/LoginScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Dimensions, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
WebBrowser.maybeCompleteAuthSession();
import api from '../api';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// Google discovery
const G_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};
// Facebook endpoint
const FB_AUTH = 'https://www.facebook.com/v18.0/dialog/oauth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // role source (params OR storage), normalized
  const [loginRole, setLoginRole] = useState('traveler');

  useEffect(() => {
    (async () => {
      try {
        const fromParam = (route.params?.selectedRole || '').toString().toLowerCase().trim();
        const fromStorage = ((await AsyncStorage.getItem('login_role')) || '').toLowerCase().trim();
        const role = fromParam || fromStorage || 'traveler';
        setLoginRole(role);
      } catch {
        setLoginRole('traveler');
      }
    })();
  }, [route.params]);

  const showMsg = (title, msg) => {
    if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
    else Alert.alert(title || 'Notice', msg);
  };

  // -------- Email/Password login --------
  const handleLogin = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      showMsg('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!password) {
      showMsg('Error', 'Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/auth/login', {
        email: email.trim(),
        password,
        role: loginRole,
      });

      const { token, role, name, user_id, completed } = res.data || {};

      await AsyncStorage.multiSet([
        ['token', token || ''],
        ['isLoggedIn', 'true'],
        ['role', (role || loginRole || 'traveler')],
        ['userId', String(user_id ?? '')],
        ['login_role', (role || loginRole || 'traveler')],
      ]);

      const displayName = name || email.split('@')[0];

      if (!completed) {
        showMsg('Almost done ✍️', 'Please complete your profile to continue.');
        navigation.reset({
          index: 0,
          routes: [{
            name: 'ProfileCompletion',
            params: { selectedRole: (role || loginRole || 'traveler') }
          }],
        });
        return;
      }

      showMsg('✅ Success', `Welcome back, ${displayName}!`);
      const finalRole = (role || loginRole || 'traveler');
      if (finalRole === 'vendor') {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'VendorTypeSelection',
            params: { name: displayName, email: email.trim() }
          }],
        });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'TravelerDashboard' }] });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.userMessage ||
        err?.message ||
        'Login failed. Please try again.';
      showMsg('❌ Login failed', msg);
      console.log('Login error details:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  //                 Social Login
  // =========================================================
  const redirectUri = makeRedirectUri({ useProxy: true });

  // --- Google (ID Token) ---
  const [googleReq, googleRes, googlePrompt] = useAuthRequest(
    {
      clientId: Platform.select({
        ios:     '<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com',
        android: '<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com',
        web:     '<YOUR_WEB_CLIENT_ID>.apps.googleusercontent.com',
      }),
      redirectUri,
      responseType: ResponseType.IdToken,
      scopes: ['openid', 'email', 'profile'],
    },
    G_DISCOVERY
  );

  // --- Facebook (Access Token) ---
  const [fbReq, fbRes, fbPrompt] = useAuthRequest(
    {
      clientId: '<YOUR_FACEBOOK_APP_ID>',
      redirectUri,
      responseType: ResponseType.Token,
      scopes: ['public_profile', 'email'],
    },
    { authorizationEndpoint: FB_AUTH }
  );

  useEffect(() => {
    (async () => {
      if (googleRes?.type === 'success' && googleRes.params?.id_token) {
        const idToken = googleRes.params.id_token;
        try {
          setLoading(true);
          const res = await api.post('/auth/social', {
            provider: 'google',
            idToken,
            role: loginRole,
          });
          await handlePostAuth(res.data);
        } catch (e) {
          showMsg('Google Sign-in failed', e?.response?.data?.error || e?.message || 'Try again.');
        } finally {
          setLoading(false);
        }
      }
      if (fbRes?.type === 'success' && fbRes.params?.access_token) {
        const accessToken = fbRes.params.access_token;
        try {
          setLoading(true);
          const res = await api.post('/auth/social', {
            provider: 'facebook',
            accessToken,
            role: loginRole,
          });
          await handlePostAuth(res.data);
        } catch (e) {
          showMsg('Facebook Sign-in failed', e?.response?.data?.error || e?.message || 'Try again.');
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [googleRes, fbRes]);

  const handlePostAuth = async (data) => {
    const { token, role, user_id, completed } = data || {};
    await AsyncStorage.multiSet([
      ['token', token || ''],
      ['isLoggedIn', 'true'],
      ['role', (role || loginRole || 'traveler')],
      ['userId', String(user_id ?? '')],
      ['login_role', (role || loginRole || 'traveler')],
    ]);

    if (!completed) {
      showMsg('Almost done ✍️', 'Please complete your profile to continue.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'ProfileCompletion', params: { selectedRole: (role || loginRole || 'traveler') } }],
      });
      return;
    }

    showMsg('✅ Success', 'Welcome to TravelMate!');
    const finalRole = (role || loginRole || 'traveler');
    if (finalRole === 'vendor') {
      navigation.reset({ index: 0, routes: [{ name: 'VendorTypeSelection' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'TravelerDashboard' }] });
    }
  };

  // back handler
  const goBack = () => {
    if (navigation.canGoBack?.()) navigation.goBack();
    else navigation.navigate('RoleSelection'); // or 'Landing Page'
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back pill */}
      <View style={styles.backWrap}>
        <TouchableOpacity style={styles.backPill} onPress={goBack} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

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
          autoCapitalize="none"
        />

        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry={!showPwd}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd(s => !s)}>
            <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Icons */}
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconButton}
            disabled={!googleReq || loading}
            onPress={() => googlePrompt({ useProxy: true })}
            accessibilityLabel="Continue with Google"
          >
            <FontAwesome name="google" size={22} color="#EA4335" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            disabled={!fbReq || loading}
            onPress={() => fbPrompt({ useProxy: true })}
            accessibilityLabel="Continue with Facebook"
          >
            <FontAwesome name="facebook" size={22} color="#3b5998" />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.iconButton} disabled accessibilityLabel="Apple Sign-in (coming soon)">
            <FontAwesome name="apple" size={22} color="#000" />
          </TouchableOpacity> */}
        </View>

        {/* Links */}
        <View style={styles.bottomLinks}>
          <Text style={styles.registerLink}>
            Don’t have an account?{' '}
            <Text
              style={styles.register}
              onPress={() => navigation.navigate('Register', { selectedRole: loginRole })}
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
}

const BORDER = '#E9EDF2';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width < 360 ? 15 : 20,
    backgroundColor: '#f5f8fa'
  },

  // Back pill styles
  backWrap: {
    width: '95%',
    maxWidth: 420,
    alignSelf: 'center',
    marginBottom: 8,
  },
  backPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  backText: { fontWeight: '800', color: '#0f172a' },

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
    alignItems: 'center',
  },
  headerTitle: { fontSize: width < 360 ? 20 : 22, textAlign: 'center', marginBottom: 10 },
  boldText: { fontSize: width < 360 ? 18 : 20, fontWeight: '700', color: '#003554' },
  subtitleText: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 },
  brandText: { color: '#0077b6', fontWeight: '700' },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16
  },
  passwordRow: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  passwordInput: { flex: 1, marginBottom: 0 },
  eyeBtn: { marginLeft: 8, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
  loginButton: { backgroundColor: '#0077b6', width: '100%', paddingVertical: 14, borderRadius: 12, marginTop: 10, marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  registerLink: { fontSize: 14, color: '#555' },
  register: { fontWeight: '600', color: '#0077b6' },
  forgotText: { color: '#0077b6', marginTop: 10, textAlign: 'center', fontSize: 14 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, width: '100%' },
  divider: { flex: 1, height: 1, backgroundColor: '#ccc' },
  dividerText: { marginHorizontal: 8, color: '#888', fontSize: 14 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  iconButton: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  bottomLinks: { marginTop: 16, alignItems: 'center', gap: 6 },
});
