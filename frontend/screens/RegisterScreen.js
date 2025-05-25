
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api';

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedRole } = route.params;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !countryCode || !phone || !country) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const payload = {
        email,
        password,
        role: selectedRole,
        first_name: firstName,
        last_name: lastName,
        country_code: countryCode,
        phone,
        country
      };

      const res = await api.post('/auth/complete-registration', payload);
      Alert.alert('✅ Success', 'Account created');
      // navigation.navigate(selectedRole === 'vendor' ? 'VendorDashboard' : 'TravelerDashboard');
      navigation.navigate('Login', { selectedRole });

    } catch (err) {
      Alert.alert('❌ Failed', err.response?.data?.error || 'Signup failed');
    }
  };

  const countries = ['United States', 'Pakistan', 'India', 'UK', 'Canada', 'Australia', 'Germany'];
  const countryCodes = [
    { label: '+1 (US)', value: '+1' },
    { label: '+92 (Pakistan)', value: '+92' },
    { label: '+91 (India)', value: '+91' },
    { label: '+44 (UK)', value: '+44' },
    { label: '+61 (Australia)', value: '+61' },
    { label: '+49 (Germany)', value: '+49' }
  ];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>TravelMate</Text>
        <Text style={styles.title}>Register as {selectedRole}</Text>
  
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
  
        <View style={styles.phoneRow}>
          <View style={styles.countryCodeWrapper}>
            <Picker
              selectedValue={countryCode}
              onValueChange={setCountryCode}
              style={styles.picker}
              dropdownIconColor="#0077b6"
            >
              <Picker.Item label="+Code" value="" color="#777" />
              {countryCodes.map((code) => (
                <Picker.Item key={code.value} label={code.label} value={code.value} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone Number"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
  
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={country}
            onValueChange={setCountry}
            style={styles.picker}
            dropdownIconColor="#0077b6"
          >
            <Picker.Item label="Select Country" value="" color="#777" />
            {countries.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>
  
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => navigation.navigate('Login', { selectedRole })}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.login}>Login</Text>
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
    paddingVertical: 30,
    backgroundColor: '#f0f4f8'
  },
  card: {
    width: '95%',
    maxWidth: 450,
    backgroundColor: '#fff',
    padding: width < 360 ? 20 : 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center'
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15
  },
  phoneRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
    gap: 10
  },
  countryCodeWrapper: {
    flex: 1.2,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden'
  },
  phoneInput: {
    flex: 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16
  },
  pickerWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 20
  },
  picker: {
    height: 50,
    color: '#333'
  },
  button: {
    backgroundColor: '#0077b6',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  loginLink: {
    marginTop: 20,
    fontSize: 14,
    color: '#555'
  },
  login: {
    fontWeight: '600',
    color: '#0077b6'
  }
});
export default RegisterScreen;
