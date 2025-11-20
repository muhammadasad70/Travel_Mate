

// // // // // // // // // // // // components/SocialAuthButtons.js
// // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// // // // // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // // // // // import * as Google from 'expo-auth-session/providers/google';
// // // // // // // // // // // import * as WebBrowser from 'expo-web-browser';
// // // // // // // // // // // import getBaseURL from '../config/env';

// // // // // // // // // // // WebBrowser.maybeCompleteAuthSession();

// // // // // // // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // // // // // // // // // export default function SocialAuthButtons({ onSuccess }) {
// // // // // // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // // // // // //   // ✅ Google Configuration with explicit redirect URI
// // // // // // // // // // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest(
// // // // // // // // // // //     {
// // // // // // // // // // //       expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // // // // // //       iosClientId: '560815749280-i18fpk4hpbjhfbdbsp2a5u9t7sm6u70g.apps.googleusercontent.com',    
// // // // // // // // // // //       androidClientId: '560815749280-3ijn7laf17cgp1su2cp9ecq52fgc4lke.apps.googleusercontent.com',
// // // // // // // // // // //       webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // // // // // //     },
// // // // // // // // // // //     {
// // // // // // // // // // //       useProxy: true,
// // // // // // // // // // //     }
// // // // // // // // // // //   );

// // // // // // // // // // //   // Handle Google Response
// // // // // // // // // // //   React.useEffect(() => {
// // // // // // // // // // //     if (googleResponse?.type === 'success') {
// // // // // // // // // // //       const { authentication } = googleResponse;
// // // // // // // // // // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // // // // // // // // // //     } else if (googleResponse?.type === 'error') {
// // // // // // // // // // //       console.error('Google OAuth error:', googleResponse.error);
// // // // // // // // // // //       Alert.alert('Error', 'Google Sign-In was cancelled or failed');
// // // // // // // // // // //     }
// // // // // // // // // // //   }, [googleResponse]);

// // // // // // // // // // //   // Google Authentication
// // // // // // // // // // //   // Google Authentication
// // // // // // // // // // // const handleGoogleAuth = async (token) => {
// // // // // // // // // // //   try {
// // // // // // // // // // //     setLoading(true);
// // // // // // // // // // //     console.log('Sending token to backend:', token ? 'Token received' : 'No token');
    
// // // // // // // // // // //     // Send both id_token and access_token
// // // // // // // // // // //     const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // // // // // // // // // //       method: 'POST',
// // // // // // // // // // //       headers: { 'Content-Type': 'application/json' },
// // // // // // // // // // //       body: JSON.stringify({ 
// // // // // // // // // // //         id_token: token,
// // // // // // // // // // //         access_token: token  // Send as both in case
// // // // // // // // // // //       }),
// // // // // // // // // // //     });

// // // // // // // // // // //     console.log('Backend response status:', response.status);

// // // // // // // // // // //     if (response.ok) {
// // // // // // // // // // //       const data = await response.json();
// // // // // // // // // // //       console.log('Login successful:', data.user?.email);
// // // // // // // // // // //       await AsyncStorage.setItem('token', data.token);
// // // // // // // // // // //       await AsyncStorage.setItem('user_id', String(data.user.id || data.user.Id));
// // // // // // // // // // //       onSuccess?.(data);
// // // // // // // // // // //     } else {
// // // // // // // // // // //       const errorData = await response.json();
// // // // // // // // // // //       console.error('Backend error:', errorData);
// // // // // // // // // // //       Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // // // // // // // // // //     }
// // // // // // // // // // //   } catch (error) {
// // // // // // // // // // //     console.error('Google Auth Error:', error);
// // // // // // // // // // //     Alert.alert('Error', 'Google authentication failed');
// // // // // // // // // // //   } finally {
// // // // // // // // // // //     setLoading(false);
// // // // // // // // // // //   }
// // // // // // // // // // // };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // //       <View style={styles.dividerContainer}>
// // // // // // // // // // //         <View style={styles.dividerLine} />
// // // // // // // // // // //         <Text style={styles.orText}>Or continue with</Text>
// // // // // // // // // // //         <View style={styles.dividerLine} />
// // // // // // // // // // //       </View>

// // // // // // // // // // //       <View style={styles.socialButtons}>
// // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // //           style={styles.socialButton}
// // // // // // // // // // //           onPress={() => googlePromptAsync()}
// // // // // // // // // // //           disabled={loading || !googleRequest}
// // // // // // // // // // //         >
// // // // // // // // // // //           <Ionicons name="logo-google" size={24} color="#DB4437" />
// // // // // // // // // // //         </TouchableOpacity>

// // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // // // // // // // // // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login will be set up next!')}
// // // // // // // // // // //         >
// // // // // // // // // // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //       </View>
// // // // // // // // // // //     </View>
// // // // // // // // // // //   );
// // // // // // // // // // // }

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: { marginTop: 20, width: '100%' },
// // // // // // // // // // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // // // // // // // // // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // // // // // // // // // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // // // // // // // // // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // // // // // // // // // //   socialButton: {
// // // // // // // // // // //     width: 56, height: 56, borderRadius: 28,
// // // // // // // // // // //     justifyContent: 'center', alignItems: 'center',
// // // // // // // // // // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // // // // // // // // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // // // // // // // // // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // // // // // // // // // //   },
// // // // // // // // // // // });



// // // // // // // // // // // components/SocialAuthButtons.js
// // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// // // // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // // // // import * as Google from 'expo-auth-session/providers/google';
// // // // // // // // // // import * as WebBrowser from 'expo-web-browser';
// // // // // // // // // // import getBaseURL from '../config/env';

// // // // // // // // // // WebBrowser.maybeCompleteAuthSession();

// // // // // // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // // // // // // // // export default function SocialAuthButtons({ onSuccess }) {
// // // // // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // // // // //   // ✅ Force web-based OAuth for all platforms
// // // // // // // // // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest(
// // // // // // // // // //     {
// // // // // // // // // //       expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // // // // //       iosClientId: '560815749280-i18fpk4hpbjhfbdbsp2a5u9t7sm6u70g.apps.googleusercontent.com',    
// // // // // // // // // //       androidClientId: '560815749280-3ijn7laf17cgp1su2cp9ecq52fgc4lke.apps.googleusercontent.com',
// // // // // // // // // //       webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // // // // //     },
// // // // // // // // // //     {
// // // // // // // // // //       useProxy: true, // ✅ This forces web-based auth
// // // // // // // // // //       projectNameForProxy: '@anonymous/travelmate',
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   React.useEffect(() => {
// // // // // // // // // //     if (googleResponse?.type === 'success') {
// // // // // // // // // //       const { authentication } = googleResponse;
// // // // // // // // // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // // // // // // // // //     } else if (googleResponse?.type === 'error') {
// // // // // // // // // //       console.error('Google OAuth error:', googleResponse.error);
// // // // // // // // // //       Alert.alert('Sign-In Error', 'Failed to sign in with Google. Please try again.');
// // // // // // // // // //     }
// // // // // // // // // //   }, [googleResponse]);

// // // // // // // // // //   const handleGoogleAuth = async (token) => {
// // // // // // // // // //     try {
// // // // // // // // // //       setLoading(true);
// // // // // // // // // //       console.log('Sending token to backend');
      
// // // // // // // // // //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // // // // // // // // //         method: 'POST',
// // // // // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // // // // //         body: JSON.stringify({ 
// // // // // // // // // //           id_token: token,
// // // // // // // // // //           access_token: token
// // // // // // // // // //         }),
// // // // // // // // // //       });

// // // // // // // // // //       console.log('Backend response status:', response.status);

// // // // // // // // // //       if (response.ok) {
// // // // // // // // // //         const data = await response.json();
// // // // // // // // // //         console.log('Login successful:', data.user?.email);
// // // // // // // // // //         await AsyncStorage.setItem('token', data.token);
// // // // // // // // // //         await AsyncStorage.setItem('user_id', String(data.user.id || data.user.Id));
// // // // // // // // // //         onSuccess?.(data);
// // // // // // // // // //       } else {
// // // // // // // // // //         const errorData = await response.json();
// // // // // // // // // //         console.error('Backend error:', errorData);
// // // // // // // // // //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // // // // // // // // //       }
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error('Google Auth Error:', error);
// // // // // // // // // //       Alert.alert('Error', 'Google authentication failed');
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // //       <View style={styles.dividerContainer}>
// // // // // // // // // //         <View style={styles.dividerLine} />
// // // // // // // // // //         <Text style={styles.orText}>Or continue with</Text>
// // // // // // // // // //         <View style={styles.dividerLine} />
// // // // // // // // // //       </View>

// // // // // // // // // //       <View style={styles.socialButtons}>
// // // // // // // // // //         <TouchableOpacity
// // // // // // // // // //           style={styles.socialButton}
// // // // // // // // // //           onPress={() => {
// // // // // // // // // //             if (!googleRequest) {
// // // // // // // // // //               Alert.alert('Please wait', 'Google Sign-In is loading...');
// // // // // // // // // //               return;
// // // // // // // // // //             }
// // // // // // // // // //             googlePromptAsync();
// // // // // // // // // //           }}
// // // // // // // // // //           disabled={loading || !googleRequest}
// // // // // // // // // //         >
// // // // // // // // // //           <Ionicons name="logo-google" size={24} color="#DB4437" />
// // // // // // // // // //         </TouchableOpacity>

// // // // // // // // // //         <TouchableOpacity
// // // // // // // // // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // // // // // // // // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login will be set up next!')}
// // // // // // // // // //         >
// // // // // // // // // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // //       </View>
// // // // // // // // // //     </View>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   container: { marginTop: 20, width: '100%' },
// // // // // // // // // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // // // // // // // // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // // // // // // // // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // // // // // // // // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // // // // // // // // //   socialButton: {
// // // // // // // // // //     width: 56, height: 56, borderRadius: 28,
// // // // // // // // // //     justifyContent: 'center', alignItems: 'center',
// // // // // // // // // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // // // // // // // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // // // // // // // // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // // // // // // // // //   },
// // // // // // // // // // });




// // // // // // // // // // components/SocialAuthButtons.js
// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// // // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // // // import * as Google from 'expo-auth-session/providers/google';
// // // // // // // // // import * as WebBrowser from 'expo-web-browser';
// // // // // // // // // import getBaseURL from '../config/env';

// // // // // // // // // WebBrowser.maybeCompleteAuthSession();

// // // // // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // // // // // // // export default function SocialAuthButtons({ onSuccess }) {
// // // // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // // // //   // Configure for Expo proxy
// // // // // // // // //   const redirectUri = Platform.select({
// // // // // // // // //     web: 'http://localhost:8081',
// // // // // // // // //     default: 'https://auth.expo.io/@anonymous/travelmate', // Explicit redirect for mobile
// // // // // // // // //   });

// // // // // // // // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest(
// // // // // // // // //     {
// // // // // // // // //       expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // // // //       iosClientId: '560815749280-i18fpk4hpbjhfbdbsp2a5u9t7sm6u70g.apps.googleusercontent.com',    
// // // // // // // // //       androidClientId: '560815749280-3ijn7laf17cgp1su2cp9ecq52fgc4lke.apps.googleusercontent.com',
// // // // // // // // //       webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // // // //       redirectUri: redirectUri,
// // // // // // // // //     }
// // // // // // // // //   );

// // // // // // // // //   React.useEffect(() => {
// // // // // // // // //     console.log('Google Response:', googleResponse);
    
// // // // // // // // //     if (googleResponse?.type === 'success') {
// // // // // // // // //       const { authentication } = googleResponse;
// // // // // // // // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // // // // // // // //     } else if (googleResponse?.type === 'error') {
// // // // // // // // //       console.error('Google OAuth error:', googleResponse.error);
// // // // // // // // //       Alert.alert('Sign-In Error', `Failed to sign in: ${googleResponse.error?.message || 'Unknown error'}`);
// // // // // // // // //     } else if (googleResponse?.type === 'cancel') {
// // // // // // // // //       console.log('User cancelled Google Sign-In');
// // // // // // // // //     }
// // // // // // // // //   }, [googleResponse]);

// // // // // // // // //   const handleGoogleAuth = async (token) => {
// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
// // // // // // // // //       console.log('Sending token to backend');
      
// // // // // // // // //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // // // // // // // //         method: 'POST',
// // // // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // // // //         body: JSON.stringify({ 
// // // // // // // // //           id_token: token,
// // // // // // // // //           access_token: token
// // // // // // // // //         }),
// // // // // // // // //       });

// // // // // // // // //       console.log('Backend response status:', response.status);

// // // // // // // // //       if (response.ok) {
// // // // // // // // //         const data = await response.json();
// // // // // // // // //         console.log('Login successful:', data.user?.email);
// // // // // // // // //         await AsyncStorage.setItem('token', data.token);
// // // // // // // // //         await AsyncStorage.setItem('user_id', String(data.user.id || data.user.Id));
// // // // // // // // //         onSuccess?.(data);
// // // // // // // // //       } else {
// // // // // // // // //         const errorData = await response.json();
// // // // // // // // //         console.error('Backend error:', errorData);
// // // // // // // // //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // // // // // // // //       }
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Google Auth Error:', error);
// // // // // // // // //       Alert.alert('Error', 'Google authentication failed');
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <View style={styles.container}>
// // // // // // // // //       <View style={styles.dividerContainer}>
// // // // // // // // //         <View style={styles.dividerLine} />
// // // // // // // // //         <Text style={styles.orText}>Or continue with</Text>
// // // // // // // // //         <View style={styles.dividerLine} />
// // // // // // // // //       </View>

// // // // // // // // //       <View style={styles.socialButtons}>
// // // // // // // // //         <TouchableOpacity
// // // // // // // // //           style={styles.socialButton}
// // // // // // // // //           onPress={() => {
// // // // // // // // //             if (!googleRequest) {
// // // // // // // // //               Alert.alert('Please wait', 'Google Sign-In is loading...');
// // // // // // // // //               return;
// // // // // // // // //             }
// // // // // // // // //             console.log('Opening Google Sign-In...');
// // // // // // // // //             googlePromptAsync();
// // // // // // // // //           }}
// // // // // // // // //           disabled={loading || !googleRequest}
// // // // // // // // //         >
// // // // // // // // //           <Ionicons name="logo-google" size={24} color="#DB4437" />
// // // // // // // // //         </TouchableOpacity>

// // // // // // // // //         <TouchableOpacity
// // // // // // // // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // // // // // // // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login will be set up next!')}
// // // // // // // // //         >
// // // // // // // // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //       </View>
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: { marginTop: 20, width: '100%' },
// // // // // // // // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // // // // // // // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // // // // // // // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // // // // // // // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // // // // // // // //   socialButton: {
// // // // // // // // //     width: 56, height: 56, borderRadius: 28,
// // // // // // // // //     justifyContent: 'center', alignItems: 'center',
// // // // // // // // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // // // // // // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // // // // // // // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // // // // // // // //   },
// // // // // // // // // });


// // // // // // // // // components/SocialAuthButtons.js
// // // // // // // // import React, { useState } from 'react';
// // // // // // // // import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // // import * as Google from 'expo-auth-session/providers/google';
// // // // // // // // import * as WebBrowser from 'expo-web-browser';
// // // // // // // // import getBaseURL from '../config/env';

// // // // // // // // WebBrowser.maybeCompleteAuthSession();

// // // // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // // // // // // export default function SocialAuthButtons({ onSuccess }) {
// // // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // // //   // ✅ Use ONLY the Expo Client ID - this is the key!
// // // // // // // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
// // // // // // // //     expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // // //     // Don't specify iosClientId or androidClientId - let Expo handle it
// // // // // // // //   });

// // // // // // // //   React.useEffect(() => {
// // // // // // // //     console.log('Google Response:', googleResponse);
    
// // // // // // // //     if (googleResponse?.type === 'success') {
// // // // // // // //       const { authentication } = googleResponse;
// // // // // // // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // // // // // // //     } else if (googleResponse?.type === 'error') {
// // // // // // // //       console.error('Google OAuth error:', googleResponse.error);
// // // // // // // //       Alert.alert('Sign-In Error', `${googleResponse.error?.message || 'Please try again'}`);
// // // // // // // //     }
// // // // // // // //   }, [googleResponse]);

// // // // // // // //   const handleGoogleAuth = async (token) => {
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       console.log('Sending token to backend');
      
// // // // // // // //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // // // // // // //         method: 'POST',
// // // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // // //         body: JSON.stringify({ 
// // // // // // // //           id_token: token,
// // // // // // // //           access_token: token
// // // // // // // //         }),
// // // // // // // //       });

// // // // // // // //       if (response.ok) {
// // // // // // // //         const data = await response.json();
// // // // // // // //         console.log('✅ Login successful');
// // // // // // // //         await AsyncStorage.setItem('token', data.token);
// // // // // // // //         await AsyncStorage.setItem('user_id', String(data.user.id || data.user.Id));
// // // // // // // //         onSuccess?.(data);
// // // // // // // //       } else {
// // // // // // // //         const errorData = await response.json();
// // // // // // // //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Google Auth Error:', error);
// // // // // // // //       Alert.alert('Error', 'Authentication failed. Please try again.');
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <View style={styles.container}>
// // // // // // // //       <View style={styles.dividerContainer}>
// // // // // // // //         <View style={styles.dividerLine} />
// // // // // // // //         <Text style={styles.orText}>Or continue with</Text>
// // // // // // // //         <View style={styles.dividerLine} />
// // // // // // // //       </View>

// // // // // // // //       <View style={styles.socialButtons}>
// // // // // // // //         <TouchableOpacity
// // // // // // // //           style={styles.socialButton}
// // // // // // // //           onPress={() => {
// // // // // // // //             if (!googleRequest) {
// // // // // // // //               Alert.alert('Loading', 'Please wait...');
// // // // // // // //               return;
// // // // // // // //             }
// // // // // // // //             console.log('Opening Google Sign-In...');
// // // // // // // //             googlePromptAsync();
// // // // // // // //           }}
// // // // // // // //           disabled={loading || !googleRequest}
// // // // // // // //         >
// // // // // // // //           <Ionicons name="logo-google" size={24} color="#DB4437" />
// // // // // // // //         </TouchableOpacity>

// // // // // // // //         <TouchableOpacity
// // // // // // // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // // // // // // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login coming soon!')}
// // // // // // // //         >
// // // // // // // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: { marginTop: 20, width: '100%' },
// // // // // // // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // // // // // // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // // // // // // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // // // // // // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // // // // // // //   socialButton: {
// // // // // // // //     width: 56, height: 56, borderRadius: 28,
// // // // // // // //     justifyContent: 'center', alignItems: 'center',
// // // // // // // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // // // // // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // // // // // // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // // // // // // //   },
// // // // // // // // });



// // // // // // // // components/SocialAuthButtons.js
// // // // // // // import React, { useState } from 'react';
// // // // // // // import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // import * as Google from 'expo-auth-session/providers/google';
// // // // // // // import * as WebBrowser from 'expo-web-browser';
// // // // // // // import getBaseURL from '../config/env';

// // // // // // // WebBrowser.maybeCompleteAuthSession();

// // // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // // // // // export default function SocialAuthButtons({ onSuccess }) {
// // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // //   // ✅ Platform-specific configuration
// // // // // // //   const googleConfig = Platform.select({
// // // // // // //     web: {
// // // // // // //       // Web requires webClientId
// // // // // // //       webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // //     },
// // // // // // //     default: {
// // // // // // //       // Mobile uses only expoClientId for Expo Go
// // // // // // //       expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // // //     }
// // // // // // //   });

// // // // // // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest(googleConfig);

// // // // // // //   React.useEffect(() => {
// // // // // // //     console.log('Google Response:', googleResponse);
    
// // // // // // //     if (googleResponse?.type === 'success') {
// // // // // // //       const { authentication } = googleResponse;
// // // // // // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // // // // // //     } else if (googleResponse?.type === 'error') {
// // // // // // //       console.error('Google OAuth error:', googleResponse.error);
// // // // // // //       Alert.alert('Sign-In Error', `${googleResponse.error?.message || 'Please try again'}`);
// // // // // // //     }
// // // // // // //   }, [googleResponse]);

// // // // // // //   const handleGoogleAuth = async (token) => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       console.log('Sending token to backend');
      
// // // // // // //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // // // // // //         method: 'POST',
// // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // //         body: JSON.stringify({ 
// // // // // // //           id_token: token,
// // // // // // //           access_token: token
// // // // // // //         }),
// // // // // // //       });

// // // // // // //       if (response.ok) {
// // // // // // //         const data = await response.json();
// // // // // // //         console.log('✅ Login successful');
// // // // // // //         await AsyncStorage.setItem('token', data.token);
// // // // // // //         await AsyncStorage.setItem('user_id', String(data.user.id || data.user.Id));
// // // // // // //         onSuccess?.(data);
// // // // // // //       } else {
// // // // // // //         const errorData = await response.json();
// // // // // // //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // // // // // //       }
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Google Auth Error:', error);
// // // // // // //       Alert.alert('Error', 'Authentication failed. Please try again.');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <View style={styles.container}>
// // // // // // //       <View style={styles.dividerContainer}>
// // // // // // //         <View style={styles.dividerLine} />
// // // // // // //         <Text style={styles.orText}>Or continue with</Text>
// // // // // // //         <View style={styles.dividerLine} />
// // // // // // //       </View>

// // // // // // //       <View style={styles.socialButtons}>
// // // // // // //         <TouchableOpacity
// // // // // // //           style={styles.socialButton}
// // // // // // //           onPress={() => {
// // // // // // //             if (!googleRequest) {
// // // // // // //               Alert.alert('Loading', 'Please wait...');
// // // // // // //               return;
// // // // // // //             }
// // // // // // //             console.log('Opening Google Sign-In...');
// // // // // // //             googlePromptAsync();
// // // // // // //           }}
// // // // // // //           disabled={loading || !googleRequest}
// // // // // // //         >
// // // // // // //           <Ionicons name="logo-google" size={24} color="#DB4437" />
// // // // // // //         </TouchableOpacity>

// // // // // // //         <TouchableOpacity
// // // // // // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // // // // // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login coming soon!')}
// // // // // // //         >
// // // // // // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // }

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: { marginTop: 20, width: '100%' },
// // // // // // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // // // // // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // // // // // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // // // // // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // // // // // //   socialButton: {
// // // // // // //     width: 56, height: 56, borderRadius: 28,
// // // // // // //     justifyContent: 'center', alignItems: 'center',
// // // // // // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // // // // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // // // // // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // // // // // //   },
// // // // // // // });




// // // // // // // components/SocialAuthButtons.js
// // // // // // import React, { useState } from 'react';
// // // // // // import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // import * as Google from 'expo-auth-session/providers/google';
// // // // // // import * as WebBrowser from 'expo-web-browser';
// // // // // // import getBaseURL from '../config/env';

// // // // // // WebBrowser.maybeCompleteAuthSession();

// // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // // // // export default function SocialAuthButtons({ onSuccess }) {
// // // // // //   const [loading, setLoading] = useState(false);

// // // // // //   // ✅ Provide ALL client IDs - expo-auth-session needs them all
// // // // // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
// // // // // //     expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // //     iosClientId: '560815749280-i18fpk4hpbjhfbdbsp2a5u9t7sm6u70g.apps.googleusercontent.com',
// // // // // //     androidClientId: '560815749280-3ijn7laf17cgp1su2cp9ecq52fgc4lke.apps.googleusercontent.com',
// // // // // //     webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // // //   });

// // // // // //   React.useEffect(() => {
// // // // // //     console.log('Google Response:', googleResponse);
    
// // // // // //     if (googleResponse?.type === 'success') {
// // // // // //       const { authentication } = googleResponse;
// // // // // //       console.log('✅ Google authentication successful');
// // // // // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // // // // //     } else if (googleResponse?.type === 'error') {
// // // // // //       console.error('❌ Google OAuth error:', googleResponse.error);
// // // // // //       Alert.alert('Sign-In Error', `${googleResponse.error?.message || 'Please try again'}`);
// // // // // //     } else if (googleResponse?.type === 'cancel') {
// // // // // //       console.log('ℹ️ User cancelled sign-in');
// // // // // //     }
// // // // // //   }, [googleResponse]);

// // // // // //   const handleGoogleAuth = async (token) => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       console.log('📤 Sending token to backend...');
      
// // // // // //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // // // // //         method: 'POST',
// // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // //         body: JSON.stringify({ 
// // // // // //           id_token: token,
// // // // // //           access_token: token
// // // // // //         }),
// // // // // //       });

// // // // // //       console.log('📥 Backend response:', response.status);

// // // // // //       if (response.ok) {
// // // // // //         const data = await response.json();
// // // // // //         console.log('✅ Login successful:', data.user?.email);
        
// // // // // //         await AsyncStorage.multiSet([
// // // // // //           ['token', data.token],
// // // // // //           ['user_id', String(data.user.id || data.user.Id)],
// // // // // //           ['role', data.user.role || 'traveler'],
// // // // // //           ['isLoggedIn', 'true'],
// // // // // //         ]);
        
// // // // // //         onSuccess?.(data);
// // // // // //       } else {
// // // // // //         const errorData = await response.json();
// // // // // //         console.error('❌ Backend error:', errorData);
// // // // // //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.error('❌ Google Auth Error:', error);
// // // // // //       Alert.alert('Error', 'Authentication failed. Please check your connection.');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <View style={styles.container}>
// // // // // //       <View style={styles.dividerContainer}>
// // // // // //         <View style={styles.dividerLine} />
// // // // // //         <Text style={styles.orText}>Or continue with</Text>
// // // // // //         <View style={styles.dividerLine} />
// // // // // //       </View>

// // // // // //       <View style={styles.socialButtons}>
// // // // // //         <TouchableOpacity
// // // // // //           style={[styles.socialButton, (loading || !googleRequest) && styles.disabled]}
// // // // // //           onPress={() => {
// // // // // //             if (!googleRequest) {
// // // // // //               Alert.alert('Loading', 'Google Sign-In is initializing...');
// // // // // //               return;
// // // // // //             }
// // // // // //             console.log('🔵 Opening Google Sign-In...');
// // // // // //             googlePromptAsync();
// // // // // //           }}
// // // // // //           disabled={loading || !googleRequest}
// // // // // //         >
// // // // // //           {loading ? (
// // // // // //             <Text style={{ fontSize: 16 }}>⏳</Text>
// // // // // //           ) : (
// // // // // //             <Ionicons name="logo-google" size={24} color="#DB4437" />
// // // // // //           )}
// // // // // //         </TouchableOpacity>

// // // // // //         <TouchableOpacity
// // // // // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // // // // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login coming soon!')}
// // // // // //         >
// // // // // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       {Platform.OS !== 'web' && (
// // // // // //         <Text style={styles.note}>
// // // // // //           Sign-in will open in your browser
// // // // // //         </Text>
// // // // // //       )}
// // // // // //     </View>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { marginTop: 20, width: '100%' },
// // // // // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // // // // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // // // // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // // // // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // // // // //   socialButton: {
// // // // // //     width: 56, height: 56, borderRadius: 28,
// // // // // //     justifyContent: 'center', alignItems: 'center',
// // // // // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // // // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // // // // //   },
// // // // // //   disabled: {
// // // // // //     opacity: 0.5,
// // // // // //   },
// // // // // //   note: {
// // // // // //     fontSize: 11,
// // // // // //     color: '#9CA3AF',
// // // // // //     textAlign: 'center',
// // // // // //     marginTop: 12,
// // // // // //   },
// // // // // // });




// // // // // // components/SocialAuthButtons.js
// // // // // import React, { useState } from 'react';
// // // // // import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import * as Google from 'expo-auth-session/providers/google';
// // // // // import * as WebBrowser from 'expo-web-browser';
// // // // // import { makeRedirectUri } from 'expo-auth-session';
// // // // // import getBaseURL from '../config/env';

// // // // // WebBrowser.maybeCompleteAuthSession();

// // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // // // export default function SocialAuthButtons({ onSuccess }) {
// // // // //   const [loading, setLoading] = useState(false);

// // // // //   // ✅ Create redirect URI that uses Expo proxy
// // // // //   const redirectUri = makeRedirectUri({
// // // // //     scheme: 'travelmate',
// // // // //     useProxy: true,
// // // // //   });

// // // // //   console.log('📍 Redirect URI:', redirectUri);

// // // // //   // ✅ Configuration with explicit redirect URI
// // // // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
// // // // //     expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // //     iosClientId: '560815749280-i18fpk4hpbjhfbdbsp2a5u9t7sm6u70g.apps.googleusercontent.com',
// // // // //     androidClientId: '560815749280-3ijn7laf17cgp1su2cp9ecq52fgc4lke.apps.googleusercontent.com',
// // // // //     webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // // //     redirectUri: redirectUri,
// // // // //   });

// // // // //   React.useEffect(() => {
// // // // //     console.log('Google Response:', googleResponse);
    
// // // // //     if (googleResponse?.type === 'success') {
// // // // //       const { authentication } = googleResponse;
// // // // //       console.log('✅ Google authentication successful');
// // // // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // // // //     } else if (googleResponse?.type === 'error') {
// // // // //       console.error('❌ Google OAuth error:', googleResponse.error);
// // // // //       const errorMsg = googleResponse.error?.message || 'Authentication failed';
// // // // //       Alert.alert('Sign-In Error', errorMsg);
// // // // //     } else if (googleResponse?.type === 'cancel') {
// // // // //       console.log('ℹ️ User cancelled sign-in');
// // // // //     }
// // // // //   }, [googleResponse]);

// // // // //   const handleGoogleAuth = async (token) => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       console.log('📤 Sending token to backend...');
      
// // // // //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // // // //         method: 'POST',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify({ 
// // // // //           id_token: token,
// // // // //           access_token: token
// // // // //         }),
// // // // //       });

// // // // //       console.log('📥 Backend response:', response.status);

// // // // //       if (response.ok) {
// // // // //         const data = await response.json();
// // // // //         console.log('✅ Login successful:', data.user?.email);
        
// // // // //         await AsyncStorage.multiSet([
// // // // //           ['token', data.token],
// // // // //           ['user_id', String(data.user.id || data.user.Id)],
// // // // //           ['role', data.user.role || 'traveler'],
// // // // //           ['isLoggedIn', 'true'],
// // // // //         ]);
        
// // // // //         Alert.alert('Success!', 'Signed in successfully', [
// // // // //           { text: 'OK', onPress: () => onSuccess?.(data) }
// // // // //         ]);
// // // // //       } else {
// // // // //         const errorData = await response.json();
// // // // //         console.error('❌ Backend error:', errorData);
// // // // //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Google Auth Error:', error);
// // // // //       Alert.alert('Error', 'Authentication failed. Please check your connection.');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <View style={styles.dividerContainer}>
// // // // //         <View style={styles.dividerLine} />
// // // // //         <Text style={styles.orText}>Or continue with</Text>
// // // // //         <View style={styles.dividerLine} />
// // // // //       </View>

// // // // //       <View style={styles.socialButtons}>
// // // // //         <TouchableOpacity
// // // // //           style={[styles.socialButton, (loading || !googleRequest) && styles.disabled]}
// // // // //           onPress={() => {
// // // // //             if (!googleRequest) {
// // // // //               Alert.alert('Loading', 'Google Sign-In is initializing...');
// // // // //               return;
// // // // //             }
// // // // //             console.log('🔵 Opening Google Sign-In...');
// // // // //             googlePromptAsync();
// // // // //           }}
// // // // //           disabled={loading || !googleRequest}
// // // // //         >
// // // // //           {loading ? (
// // // // //             <Text style={{ fontSize: 16 }}>⏳</Text>
// // // // //           ) : (
// // // // //             <Ionicons name="logo-google" size={24} color="#DB4437" />
// // // // //           )}
// // // // //         </TouchableOpacity>

// // // // //         <TouchableOpacity
// // // // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // // // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login coming soon!')}
// // // // //         >
// // // // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       {Platform.OS !== 'web' && (
// // // // //         <Text style={styles.note}>
// // // // //           Sign-in will open in your browser
// // // // //         </Text>
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: { marginTop: 20, width: '100%' },
// // // // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // // // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // // // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // // // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // // // //   socialButton: {
// // // // //     width: 56, height: 56, borderRadius: 28,
// // // // //     justifyContent: 'center', alignItems: 'center',
// // // // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // // // //   },
// // // // //   disabled: {
// // // // //     opacity: 0.5,
// // // // //   },
// // // // //   note: {
// // // // //     fontSize: 11,
// // // // //     color: '#9CA3AF',
// // // // //     textAlign: 'center',
// // // // //     marginTop: 12,
// // // // //   },
// // // // // });



// // // // // components/SocialAuthButtons.js
// // // // import React, { useState } from 'react';
// // // // import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import * as Google from 'expo-auth-session/providers/google';
// // // // import * as WebBrowser from 'expo-web-browser';
// // // // import getBaseURL from '../config/env';

// // // // WebBrowser.maybeCompleteAuthSession();

// // // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // // export default function SocialAuthButtons({ onSuccess }) {
// // // //   const [loading, setLoading] = useState(false);

// // // //   // ✅ Platform-specific redirect URI
// // // //   const redirectUri = Platform.select({
// // // //     web: 'http://localhost:8081',
// // // //     default: 'https://auth.expo.io/@anonymous/travelmate', // Explicit Expo proxy for mobile
// // // //   });

// // // //   console.log('📍 Platform:', Platform.OS);
// // // //   console.log('📍 Redirect URI:', redirectUri);

// // // //   // ✅ Use the platform-specific redirect URI
// // // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
// // // //     expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // //     iosClientId: '560815749280-i18fpk4hpbjhfbdbsp2a5u9t7sm6u70g.apps.googleusercontent.com',
// // // //     androidClientId: '560815749280-3ijn7laf17cgp1su2cp9ecq52fgc4lke.apps.googleusercontent.com',
// // // //     webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // // //     redirectUri: redirectUri,
// // // //   });

// // // //   React.useEffect(() => {
// // // //     console.log('Google Response:', googleResponse);
    
// // // //     if (googleResponse?.type === 'success') {
// // // //       const { authentication } = googleResponse;
// // // //       console.log('✅ Google authentication successful');
// // // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // // //     } else if (googleResponse?.type === 'error') {
// // // //       console.error('❌ Google OAuth error:', googleResponse.error);
// // // //       const errorMsg = googleResponse.error?.message || 'Authentication failed';
// // // //       Alert.alert('Sign-In Error', errorMsg);
// // // //     } else if (googleResponse?.type === 'cancel') {
// // // //       console.log('ℹ️ User cancelled sign-in');
// // // //     }
// // // //   }, [googleResponse]);

// // // //   const handleGoogleAuth = async (token) => {
// // // //     try {
// // // //       setLoading(true);
// // // //       console.log('📤 Sending token to backend...');
      
// // // //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // // //         method: 'POST',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify({ 
// // // //           id_token: token,
// // // //           access_token: token
// // // //         }),
// // // //       });

// // // //       console.log('📥 Backend response:', response.status);

// // // //       if (response.ok) {
// // // //         const data = await response.json();
// // // //         console.log('✅ Login successful:', data.user?.email);
        
// // // //         await AsyncStorage.multiSet([
// // // //           ['token', data.token],
// // // //           ['user_id', String(data.user.id || data.user.Id)],
// // // //           ['role', data.user.role || 'traveler'],
// // // //           ['isLoggedIn', 'true'],
// // // //         ]);
        
// // // //         Alert.alert('Success!', 'Signed in successfully', [
// // // //           { text: 'OK', onPress: () => onSuccess?.(data) }
// // // //         ]);
// // // //       } else {
// // // //         const errorData = await response.json();
// // // //         console.error('❌ Backend error:', errorData);
// // // //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Google Auth Error:', error);
// // // //       Alert.alert('Error', 'Authentication failed. Please check your connection.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <View style={styles.dividerContainer}>
// // // //         <View style={styles.dividerLine} />
// // // //         <Text style={styles.orText}>Or continue with</Text>
// // // //         <View style={styles.dividerLine} />
// // // //       </View>

// // // //       <View style={styles.socialButtons}>
// // // //         <TouchableOpacity
// // // //           style={[styles.socialButton, (loading || !googleRequest) && styles.disabled]}
// // // //           onPress={() => {
// // // //             if (!googleRequest) {
// // // //               Alert.alert('Loading', 'Google Sign-In is initializing...');
// // // //               return;
// // // //             }
// // // //             console.log('🔵 Opening Google Sign-In...');
// // // //             googlePromptAsync();
// // // //           }}
// // // //           disabled={loading || !googleRequest}
// // // //         >
// // // //           {loading ? (
// // // //             <Text style={{ fontSize: 16 }}>⏳</Text>
// // // //           ) : (
// // // //             <Ionicons name="logo-google" size={24} color="#DB4437" />
// // // //           )}
// // // //         </TouchableOpacity>

// // // //         <TouchableOpacity
// // // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login coming soon!')}
// // // //         >
// // // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {Platform.OS !== 'web' && (
// // // //         <Text style={styles.note}>
// // // //           Sign-in will open in your browser
// // // //         </Text>
// // // //       )}
// // // //     </View>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   container: { marginTop: 20, width: '100%' },
// // // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // // //   socialButton: {
// // // //     width: 56, height: 56, borderRadius: 28,
// // // //     justifyContent: 'center', alignItems: 'center',
// // // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // // //   },
// // // //   disabled: {
// // // //     opacity: 0.5,
// // // //   },
// // // //   note: {
// // // //     fontSize: 11,
// // // //     color: '#9CA3AF',
// // // //     textAlign: 'center',
// // // //     marginTop: 12,
// // // //   },
// // // // });




// // // // components/SocialAuthButtons.js
// // // import React, { useState } from 'react';
// // // import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import * as Google from 'expo-auth-session/providers/google';
// // // import * as WebBrowser from 'expo-web-browser';
// // // import getBaseURL from '../config/env';

// // // WebBrowser.maybeCompleteAuthSession();

// // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // export default function SocialAuthButtons({ onSuccess }) {
// // //   const [loading, setLoading] = useState(false);

// // //   // ✅ Platform-specific redirect URI
// // //   const redirectUri = Platform.select({
// // //     web: 'http://localhost:8081',
// // //     default: 'https://auth.expo.io/@anonymous/travelmate',
// // //   });

// // //   console.log('📍 Platform:', Platform.OS);
// // //   console.log('📍 Redirect URI:', redirectUri);

// // //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
// // //     expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // //     iosClientId: '560815749280-i18fpk4hpbjhfbdbsp2a5u9t7sm6u70g.apps.googleusercontent.com',
// // //     androidClientId: '560815749280-3ijn7laf17cgp1su2cp9ecq52fgc4lke.apps.googleusercontent.com',
// // //     webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// // //     redirectUri: redirectUri,
// // //   });

// // //   React.useEffect(() => {
// // //     console.log('Google Response:', googleResponse);
    
// // //     if (googleResponse?.type === 'success') {
// // //       const { authentication } = googleResponse;
// // //       console.log('✅ Google authentication successful');
// // //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// // //     } else if (googleResponse?.type === 'error') {
// // //       console.error('❌ Google OAuth error:', googleResponse.error);
// // //       Alert.alert('Sign-In Error', `${googleResponse.error?.message || 'Please try again'}`);
// // //     } else if (googleResponse?.type === 'cancel') {
// // //       console.log('ℹ️ User cancelled sign-in');
// // //     }
// // //   }, [googleResponse]);

// // //   const handleGoogleAuth = async (token) => {
// // //     try {
// // //       setLoading(true);
// // //       console.log('📤 Sending token to backend...');
      
// // //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({ 
// // //           id_token: token,
// // //           access_token: token
// // //         }),
// // //       });

// // //       console.log('📥 Backend response:', response.status);

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         console.log('✅ Login successful:', data.user?.email);
// // //         console.log('📦 User data:', JSON.stringify(data, null, 2));
        
// // //         // Save to AsyncStorage
// // //         await AsyncStorage.multiSet([
// // //           ['token', data.token || ''],
// // //           ['user_id', String(data.user?.id || data.user?.Id || '')],
// // //           ['role', data.user?.role || 'traveler'],
// // //           ['isLoggedIn', 'true'],
// // //         ]);
        
// // //         console.log('💾 Saved to AsyncStorage');
        
// // //         // Call onSuccess callback
// // //         if (onSuccess) {
// // //           console.log('🎯 Calling onSuccess callback...');
// // //           onSuccess(data);
// // //         } else {
// // //           console.warn('⚠️ No onSuccess callback provided');
// // //         }
// // //       } else {
// // //         const errorData = await response.json();
// // //         console.error('❌ Backend error:', errorData);
// // //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Google Auth Error:', error);
// // //       Alert.alert('Error', 'Authentication failed. Please check your connection.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <View style={styles.dividerContainer}>
// // //         <View style={styles.dividerLine} />
// // //         <Text style={styles.orText}>Or continue with</Text>
// // //         <View style={styles.dividerLine} />
// // //       </View>

// // //       <View style={styles.socialButtons}>
// // //         <TouchableOpacity
// // //           style={[styles.socialButton, (loading || !googleRequest) && styles.disabled]}
// // //           onPress={() => {
// // //             if (!googleRequest) {
// // //               Alert.alert('Loading', 'Please wait...');
// // //               return;
// // //             }
// // //             console.log('🔵 Opening Google Sign-In...');
// // //             googlePromptAsync();
// // //           }}
// // //           disabled={loading || !googleRequest}
// // //         >
// // //           {loading ? (
// // //             <Text style={{ fontSize: 16 }}>⏳</Text>
// // //           ) : (
// // //             <Ionicons name="logo-google" size={24} color="#DB4437" />
// // //           )}
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           style={[styles.socialButton, { opacity: 0.5 }]}
// // //           onPress={() => Alert.alert('Coming Soon', 'Facebook login coming soon!')}
// // //         >
// // //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       {Platform.OS !== 'web' && (
// // //         <Text style={styles.note}>
// // //           Sign-in will open in your browser
// // //         </Text>
// // //       )}
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { marginTop: 20, width: '100%' },
// // //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// // //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// // //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// // //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// // //   socialButton: {
// // //     width: 56, height: 56, borderRadius: 28,
// // //     justifyContent: 'center', alignItems: 'center',
// // //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// // //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// // //   },
// // //   disabled: {
// // //     opacity: 0.5,
// // //   },
// // //   note: {
// // //     fontSize: 11,
// // //     color: '#9CA3AF',
// // //     textAlign: 'center',
// // //     marginTop: 12,
// // //   },
// // // });

// // // components/SocialAuthButtons.js
// // import React, { useState } from 'react';
// // import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import * as Google from 'expo-auth-session/providers/google';
// // import * as WebBrowser from 'expo-web-browser';
// // import { makeRedirectUri } from 'expo-auth-session';
// // import getBaseURL from '../config/env';

// // WebBrowser.maybeCompleteAuthSession();

// // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // export default function SocialAuthButtons({ onSuccess }) {
// //   const [loading, setLoading] = useState(false);

// //   // ✅ Use makeRedirectUri with useProxy to force Expo proxy
// //   const redirectUri = makeRedirectUri({
// //     scheme: 'travelmate',
// //     path: undefined,
// //     useProxy: Platform.OS !== 'web', // Use proxy for mobile, not for web
// //   });

// //   console.log('📍 Platform:', Platform.OS);
// //   console.log('📍 Redirect URI:', redirectUri);

// //   // ✅ Provide all client IDs
// //   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest(
// //     {
// //       expoClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// //       iosClientId: '560815749280-i18fpk4hpbjhfbdbsp2a5u9t7sm6u70g.apps.googleusercontent.com',
// //       androidClientId: '560815749280-3ijn7laf17cgp1su2cp9ecq52fgc4lke.apps.googleusercontent.com',
// //       webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
// //       redirectUri: redirectUri,
// //     },
// //     {
// //       useProxy: Platform.OS !== 'web', // ✅ Force proxy for mobile
// //     }
// //   );

// //   React.useEffect(() => {
// //     console.log('Google Response:', googleResponse);
    
// //     if (googleResponse?.type === 'success') {
// //       const { authentication } = googleResponse;
// //       console.log('✅ Google authentication successful');
// //       handleGoogleAuth(authentication.idToken || authentication.accessToken);
// //     } else if (googleResponse?.type === 'error') {
// //       console.error('❌ Google OAuth error:', googleResponse.error);
// //       Alert.alert('Sign-In Error', `${googleResponse.error?.message || 'Please try again'}`);
// //     } else if (googleResponse?.type === 'cancel') {
// //       console.log('ℹ️ User cancelled sign-in');
// //     }
// //   }, [googleResponse]);

// //   const handleGoogleAuth = async (token) => {
// //     try {
// //       setLoading(true);
// //       console.log('📤 Sending token to backend...');
      
// //       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ 
// //           id_token: token,
// //           access_token: token
// //         }),
// //       });

// //       console.log('📥 Backend response:', response.status);

// //       if (response.ok) {
// //         const data = await response.json();
// //         console.log('✅ Login successful:', data.user?.email);
        
// //         await AsyncStorage.multiSet([
// //           ['token', data.token || ''],
// //           ['user_id', String(data.user?.id || data.user?.Id || '')],
// //           ['role', data.user?.role || 'traveler'],
// //           ['isLoggedIn', 'true'],
// //         ]);
        
// //         console.log('💾 Saved to AsyncStorage');
        
// //         if (onSuccess) {
// //           console.log('🎯 Calling onSuccess callback...');
// //           onSuccess(data);
// //         }
// //       } else {
// //         const errorData = await response.json();
// //         console.error('❌ Backend error:', errorData);
// //         Alert.alert('Error', errorData.error || 'Google Sign-In failed');
// //       }
// //     } catch (error) {
// //       console.error('❌ Google Auth Error:', error);
// //       Alert.alert('Error', 'Authentication failed. Please check your connection.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.dividerContainer}>
// //         <View style={styles.dividerLine} />
// //         <Text style={styles.orText}>Or continue with</Text>
// //         <View style={styles.dividerLine} />
// //       </View>

// //       <View style={styles.socialButtons}>
// //         <TouchableOpacity
// //           style={[styles.socialButton, (loading || !googleRequest) && styles.disabled]}
// //           onPress={() => {
// //             if (!googleRequest) {
// //               Alert.alert('Loading', 'Please wait...');
// //               return;
// //             }
// //             console.log('🔵 Opening Google Sign-In...');
// //             googlePromptAsync();
// //           }}
// //           disabled={loading || !googleRequest}
// //         >
// //           {loading ? (
// //             <Text style={{ fontSize: 16 }}>⏳</Text>
// //           ) : (
// //             <Ionicons name="logo-google" size={24} color="#DB4437" />
// //           )}
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={[styles.socialButton, { opacity: 0.5 }]}
// //           onPress={() => Alert.alert('Coming Soon', 'Facebook login coming soon!')}
// //         >
// //           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
// //         </TouchableOpacity>
// //       </View>

// //       {Platform.OS !== 'web' && (
// //         <Text style={styles.note}>
// //           Sign-in will open in your browser
// //         </Text>
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { marginTop: 20, width: '100%' },
// //   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
// //   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
// //   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
// //   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
// //   socialButton: {
// //     width: 56, height: 56, borderRadius: 28,
// //     justifyContent: 'center', alignItems: 'center',
// //     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
// //     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
// //   },
// //   disabled: {
// //     opacity: 0.5,
// //   },
// //   note: {
// //     fontSize: 11,
// //     color: '#9CA3AF',
// //     textAlign: 'center',
// //     marginTop: 12,
// //   },
// // });


// // components/SocialAuthButtons.js
// import React, { useState } from 'react';
// import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import getBaseURL from '../config/env';

// WebBrowser.maybeCompleteAuthSession();

// const API_BASE = getBaseURL().replace(/\/+$/, '');

// export default function SocialAuthButtons({ onSuccess }) {
//   const [loading, setLoading] = useState(false);

//   // Only enable Google Sign-In on web
//   const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
//     webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
//   });

//   React.useEffect(() => {
//     if (googleResponse?.type === 'success') {
//       const { authentication } = googleResponse;
//       handleGoogleAuth(authentication.idToken || authentication.accessToken);
//     } else if (googleResponse?.type === 'error') {
//       Alert.alert('Sign-In Error', 'Please try again');
//     }
//   }, [googleResponse]);

//   const handleGoogleAuth = async (token) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE}/auth/google/mobile`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id_token: token, access_token: token }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         await AsyncStorage.multiSet([
//           ['token', data.token || ''],
//           ['user_id', String(data.user?.id || data.user?.Id || '')],
//           ['role', data.user?.role || 'traveler'],
//           ['isLoggedIn', 'true'],
//         ]);
//         onSuccess?.(data);
//       } else {
//         Alert.alert('Error', 'Sign-in failed');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Authentication failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show different UI on mobile
//   if (Platform.OS !== 'web') {
//     return (
//       <View style={styles.container}>
//         <View style={styles.dividerContainer}>
//           <View style={styles.dividerLine} />
//           <Text style={styles.orText}>Social Login</Text>
//           <View style={styles.dividerLine} />
//         </View>
//         <Text style={styles.mobileMessage}>
//           Google Sign-In is available on the web version.{'\n'}
//           Please use email/password to sign in on mobile.
//         </Text>
//       </View>
//     );
//   }

//   // Web version with working Google Sign-In
//   return (
//     <View style={styles.container}>
//       <View style={styles.dividerContainer}>
//         <View style={styles.dividerLine} />
//         <Text style={styles.orText}>Or continue with</Text>
//         <View style={styles.dividerLine} />
//       </View>

//       <View style={styles.socialButtons}>
//         <TouchableOpacity
//           style={[styles.socialButton, (loading || !googleRequest) && styles.disabled]}
//           onPress={() => googlePromptAsync()}
//           disabled={loading || !googleRequest}
//         >
//           <Ionicons name="logo-google" size={24} color="#DB4437" />
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.socialButton, { opacity: 0.5 }]}>
//           <Ionicons name="logo-facebook" size={24} color="#4267B2" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { marginTop: 20, width: '100%' },
//   dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
//   dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
//   orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
//   socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
//   socialButton: {
//     width: 56, height: 56, borderRadius: 28,
//     justifyContent: 'center', alignItems: 'center',
//     backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
//   },
//   disabled: { opacity: 0.5 },
//   mobileMessage: {
//     fontSize: 13,
//     color: '#6B7280',
//     textAlign: 'center',
//     paddingHorizontal: 20,
//     lineHeight: 20,
//   },
// });


// components/SocialAuthButtons.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import getBaseURL from '../config/env';

WebBrowser.maybeCompleteAuthSession();

const API_BASE = getBaseURL().replace(/\/+$/, '');

export default function SocialAuthButtons({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  // ✅ Only initialize Google auth on web
  const shouldUseGoogle = Platform.OS === 'web';
  
  const [googleRequest, googleResponse, googlePromptAsync] = shouldUseGoogle 
    ? Google.useAuthRequest({
        webClientId: '560815749280-ikkv556qin2ok9qlpbpq1tkjjh6ta02q.apps.googleusercontent.com',
      })
    : [null, null, null];

  React.useEffect(() => {
    if (!shouldUseGoogle) return;
    
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      handleGoogleAuth(authentication.idToken || authentication.accessToken);
    } else if (googleResponse?.type === 'error') {
      Alert.alert('Sign-In Error', 'Please try again');
    }
  }, [googleResponse, shouldUseGoogle]);

  const handleGoogleAuth = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/google/mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: token, access_token: token }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.multiSet([
          ['token', data.token || ''],
          ['user_id', String(data.user?.id || data.user?.Id || '')],
          ['role', data.user?.role || 'traveler'],
          ['isLoggedIn', 'true'],
        ]);
        onSuccess?.(data);
      } else {
        Alert.alert('Error', 'Sign-in failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Mobile: Show message only
  if (!shouldUseGoogle) {
    return (
      <View style={styles.container}>
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>Social Login</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.mobileBox}>
          <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
          <Text style={styles.mobileMessage}>
            Google Sign-In is available on web.{'\n'}
            Use email/password on mobile.
          </Text>
        </View>
      </View>
    );
  }

  // Web: Full Google Sign-In
  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={[styles.socialButton, (loading || !googleRequest) && styles.disabled]}
          onPress={() => googlePromptAsync()}
          disabled={loading || !googleRequest}
        >
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, { opacity: 0.5 }]}>
          <Ionicons name="logo-facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, width: '100%' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  orText: { marginHorizontal: 12, color: '#6B7280', fontSize: 14, fontWeight: '500' },
  socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialButton: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  disabled: { opacity: 0.5 },
  mobileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  mobileMessage: {
    fontSize: 12,
    color: '#4338CA',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});