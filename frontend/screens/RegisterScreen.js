
// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform, Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const { width } = Dimensions.get('window');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PASS_RE  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export default function RegisterScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedRole = route.params?.selectedRole || 'traveler';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]   = useState(false);

  const showMsg = (title, msg) => {
    if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
    else Alert.alert(title || 'Notice', msg);
  };

  const handleRegister = async () => {
    if (loading) return;
    const cleanEmail = email.trim();

    if (!EMAIL_RE.test(cleanEmail)) { showMsg('Invalid Email', 'Please enter a valid email.'); return; }
    if (!PASS_RE.test(password)) {
      showMsg('Weak Password','Min 8 chars incl. upper, lower, number, and special char.');
      return;
    }
    if (password !== confirm) { showMsg('Error', 'Passwords do not match.'); return; }

    try {
      setLoading(true);

      // Expect backend to return token so we can call PUT /user/profile next
      const { data } = await api.post('/auth/signup', {
        email: cleanEmail, password, confirm, role: selectedRole,
      });

      const token   = data?.token || '';
      const role    = data?.role  || selectedRole;
      const userId  = data?.user_id ? String(data.user_id) : '';

      // Save only what's needed for profile completion
      await AsyncStorage.multiSet([
        ['token', token],
        ['role', role],
        ['userId', userId],
      ]);

      showMsg('Success', 'Account created! Let’s complete your profile.');

      // Go straight to ProfileCompletion (no back to Register)
      navigation.reset({
        index: 0,
        routes: [{ name: 'ProfileCompletion', params: { selectedRole: role } }],
      });
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.userMessage ||
        err?.message || 'Signup failed. Try again.';
      showMsg('Signup failed', message);
      console.log('Signup error details:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.brand}>TravelMate</Text>
        <Text style={styles.title}>Register as {selectedRole}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <View className="row" style={styles.passwordRow}>
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

        {/* Confirm */}
        <View className="row" style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Confirm Password"
            placeholderTextColor="#777"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(s => !s)}>
            <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating…' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login', { selectedRole })}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.login}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flexGrow:1, justifyContent:'center', alignItems:'center', paddingVertical:30, backgroundColor:'#f0f4f8' },
  backArrow:{ position:'absolute', top:20, left:20, zIndex:999 },
  card:{ width:'95%', maxWidth:450, backgroundColor:'#fff', padding: width<360?20:30, borderRadius:20, shadowColor:'#000', shadowOpacity:0.1, shadowOffset:{width:0,height:2}, shadowRadius:6, elevation:4, alignItems:'center' },
  brand:{ fontSize:28, fontWeight:'bold', color:'#003366', marginBottom:5 },
  title:{ fontSize:18, color:'#333', marginBottom:20 },
  input:{ width:'100%', backgroundColor:'#f5f5f5', borderRadius:10, paddingVertical:12, paddingHorizontal:15, fontSize:16, marginBottom:15, borderWidth:1, borderColor:'#ccc' },
  passwordRow:{ width:'100%', flexDirection:'row', alignItems:'center', marginBottom:15 },
  passwordInput:{ flex:1, marginBottom:0 },
  eyeBtn:{ marginLeft:8, padding:10, backgroundColor:'#f0f0f0', borderRadius:10 },
  button:{ backgroundColor:'#0077b6', paddingVertical:14, borderRadius:10, width:'100%', marginTop:10 },
  buttonText:{ color:'#fff', fontWeight:'bold', fontSize:16, textAlign:'center' },
  loginLink:{ marginTop:20, fontSize:14, color:'#555' },
  login:{ fontWeight:'600', color:'#0077b6' },
});
