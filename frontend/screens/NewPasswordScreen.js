import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, Dimensions
} from 'react-native';
import api from '../api';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const NewPasswordScreen = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!token || !newPassword) {
      Alert.alert('Error', 'Please enter both token and new password');
      return;
    }

    try {
      const res = await api.post('/auth/reset-password', {
        token,
        new_password: newPassword
      });

      Alert.alert('✅ Success', res.data.message || 'Password reset successful');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('❌ Failed', err.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>Paste the token from your email below and set a new password.</Text>

        <TextInput
          style={styles.input}
          placeholder="Reset Token"
          value={token}
          onChangeText={setToken}
        />

        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
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
  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#ffffffee',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003554',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
  },
  button: {
    backgroundColor: '#0077b6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default NewPasswordScreen;
