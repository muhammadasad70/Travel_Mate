import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

const VendorVerificationForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    cnic: '',
    phone: '',
    address: '',
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    // TODO: Replace this with actual backend submission
    const { fullName, cnic, phone, address } = formData;
    if (!fullName || !cnic || !phone || !address) {
      Alert.alert('❌ Error', 'All fields are required for verification.');
      return;
    }

    Alert.alert('✅ Submitted', 'Your verification request has been sent.');
    navigation.replace('VendorDashboardScreen', {
      name: fullName,
      selectedTypes: [], // Replace with real data if needed
      verified: false,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📝 Vendor Verification</Text>
      <Text style={styles.subText}>Please provide the following details to complete your verification:</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(val) => handleChange('fullName', val)}
      />

      <TextInput
        style={styles.input}
        placeholder="CNIC Number"
        value={formData.cnic}
        keyboardType="numeric"
        onChangeText={(val) => handleChange('cnic', val)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phone}
        keyboardType="phone-pad"
        onChangeText={(val) => handleChange('phone', val)}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        multiline
        numberOfLines={3}
        onChangeText={(val) => handleChange('address', val)}
      />

      <TouchableOpacity style={styles.imageUpload}>
        <Text style={styles.imageText}>📸 Upload CNIC Image (Placeholder)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.btnText}>🚀 Submit for Verification</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#003554',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  imageUpload: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 24,
  },
  imageText: {
    color: '#0077b6',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#0077b6',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default VendorVerificationForm;
