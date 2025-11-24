
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

        {/* <TouchableOpacity style={[styles.socialButton, { opacity: 0.5 }]}>
          <Ionicons name="logo-facebook" size={24} color="#4267B2" />
        </TouchableOpacity> */}
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