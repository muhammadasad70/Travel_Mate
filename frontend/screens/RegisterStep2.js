

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const { width } = Dimensions.get('window');

const RegisterStep2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedRole } = route.params || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async () => {
    if (!firstName || !lastName || !phone || !country || !countryCode) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }

      // Debug log to confirm data
      console.log('Submitting to backend:', {
        first_name: firstName,
        last_name: lastName,
        country_code: countryCode,
        phone,
        country
      });

      const res = await api.put(
        '/user/profile',
        {
          first_name: firstName,
          last_name: lastName,
          country_code: countryCode,
          phone,
          country
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert('✅ Success', 'Profile updated successfully!');
      navigation.navigate(
        selectedRole === 'vendor' ? 'VendorDashboard' : 'TravelerDashboard'
      );
    } catch (err) {
      console.error('Update Failed:', err.response?.data || err.message);
      Alert.alert('❌ Failed', err.response?.data?.error || 'Something went wrong');
    }
  };

  const countries = [    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Italy', 'Spain', 'India', 'Pakistan',
    'China', 'Japan', 'South Korea', 'Brazil', 'Mexico',
    'Russia', 'Netherlands', 'United Arab Emirates', 'Turkey', 'South Africa',
    'Singapore', 'Malaysia', 'Indonesia', 'Bangladesh', 'New Zealand',
    'Sweden', 'Switzerland', 'Saudi Arabia', 'Egypt', 'Nigeria' ];
  const countryCodes = [ { label: '+1 (US/Canada)', value: '+1' },
    { label: '+44 (UK)', value: '+44' },
    { label: '+61 (Australia)', value: '+61' },
    { label: '+49 (Germany)', value: '+49' },
    { label: '+33 (France)', value: '+33' },
    { label: '+39 (Italy)', value: '+39' },
    { label: '+34 (Spain)', value: '+34' },
    { label: '+91 (India)', value: '+91' },
    { label: '+92 (Pakistan)', value: '+92' },
    { label: '+86 (China)', value: '+86' },
    { label: '+81 (Japan)', value: '+81' },
    { label: '+82 (South Korea)', value: '+82' },
    { label: '+55 (Brazil)', value: '+55' },
    { label: '+52 (Mexico)', value: '+52' },
    { label: '+7 (Russia)', value: '+7' },
    { label: '+31 (Netherlands)', value: '+31' },
    { label: '+971 (UAE)', value: '+971' },
    { label: '+90 (Turkey)', value: '+90' },
    { label: '+27 (South Africa)', value: '+27' },
    { label: '+65 (Singapore)', value: '+65' },
    { label: '+60 (Malaysia)', value: '+60' },
    { label: '+62 (Indonesia)', value: '+62' },
    { label: '+880 (Bangladesh)', value: '+880' },
    { label: '+64 (New Zealand)', value: '+64' },
    { label: '+46 (Sweden)', value: '+46' },
    { label: '+41 (Switzerland)', value: '+41' },
    { label: '+966 (Saudi Arabia)', value: '+966' },
    { label: '+20 (Egypt)', value: '+20' },
    { label: '+234 (Nigeria)', value: '+234' } ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>
          <Text style={styles.boldText}>Complete your profile to continue</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#777"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#777"
          value={lastName}
          onChangeText={setLastName}
        />

        <View style={styles.phoneRow}>
          <View style={styles.countryCodeWrapper}>
            <Picker
              selectedValue={countryCode}
              onValueChange={setCountryCode}
              style={styles.countryCodePicker}
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
            placeholderTextColor="#777"
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

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Account</Text>
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
    padding: width < 360 ? 15 : 20,
    backgroundColor: '#f5f8fa'
  },
  card: {
    width: width * 0.95,
    maxWidth: 480,
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
    fontSize: width < 380 ? 20 : 22,
    textAlign: 'center',
    marginBottom: 20
  },
  boldText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003554'
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
  pickerWrapper: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden'
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#000'
  },
  phoneRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
    gap: 10
  },
  countryCodeWrapper: {
    flex: 1.2,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden'
  },
  countryCodePicker: {
    width: '100%',
    height: 50,
    color: '#000'
  },
  phoneInput: {
    flex: 2,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16
  },
  registerButton: {
    backgroundColor: '#0077b6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default RegisterStep2;
