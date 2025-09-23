// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import api from '../api';

const { width } = Dimensions.get('window');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedRole } = route.params || {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const showMsg = (title, msg) => {
    if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
    else Alert.alert(title || 'Notice', msg);
  };
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
      role: selectedRole || 'traveler',
    });

    const { token, role, name, user_id, completed } = res.data || {};

    // Save session (we KEEP token so /user/profile can be called next)
    await AsyncStorage.multiSet([
      ['token', token || ''],
      ['isLoggedIn', 'true'],
      ['role', role || 'traveler'],
      ['userId', String(user_id ?? '')],
    ]);

    const displayName = name || email.split('@')[0];

    // If profile NOT complete -> force ProfileCompletion
    if (!completed) {
      showMsg('Almost done ✍️', 'Please complete your profile to continue.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'ProfileCompletion', params: { selectedRole: role || selectedRole || 'traveler' } }],
      });
      return;
    }

    // Otherwise proceed to dashboard
    showMsg('✅ Success', `Welcome back, ${displayName}!`);
    if ((role || selectedRole) === 'vendor') {
      navigation.reset({ 
        index: 0, 
        routes: [{ 
          name: 'VendorTypeSelection', 
          params: { name: displayName, email: email.trim() } 
        }] 
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
          autoCapitalize="none"
        />

        {/* Password with toggle */}
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

        {/* Social Icons (placeholders) */}
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

        {/* Links */}
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
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width < 360 ? 15 : 20,
    backgroundColor: '#f5f8fa',
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: width < 360 ? 20 : 22,
    textAlign: 'center',
    marginBottom: 10,
  },
  boldText: {
    fontSize: width < 360 ? 18 : 20,
    fontWeight: '700',
    color: '#003554',
  },
  subtitleText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  brandText: {
    color: '#0077b6',
    fontWeight: '700',
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordRow: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  passwordInput: { flex: 1, marginBottom: 0 },
  eyeBtn: { marginLeft: 8, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
  loginButton: {
    backgroundColor: '#0077b6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerLink: {
    fontSize: 14,
    color: '#555',
  },
  register: {
    fontWeight: '600',
    color: '#0077b6',
  },
  forgotText: {
    color: '#0077b6',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  divider: { flex: 1, height: 1, backgroundColor: '#ccc' },
  dividerText: { marginHorizontal: 8, color: '#888', fontSize: 14 },
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
  bottomLinks: { marginTop: 16, alignItems: 'center', gap: 6 },
});
