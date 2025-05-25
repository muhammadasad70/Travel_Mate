import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Add_New_Services = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ Show back arrow only on web */}
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Feather name="arrow-left" size={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.heading}>🆕 Add New Accommodation Service</Text>

        <TextInput placeholder="🏨 Service Title" style={styles.input} />
        <TextInput placeholder="💰 Price per Night" style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="📍 Location" style={styles.input} />
        <TextInput placeholder="📝 Description" multiline numberOfLines={4} style={[styles.input, styles.textArea]} />
        <TextInput placeholder="🛏️ Amenities (comma separated)" style={styles.input} />
        <TextInput placeholder="📸 Image URL (optional)" style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={() => alert('Service submitted (dummy)!')}>
          <Text style={styles.buttonText}>Submit Service</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: isMobile ? 20 : 40,
    backgroundColor: '#F9FAFB',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    alignItems: 'stretch', // ✅ Ensure items expand full width
    justifyContent: 'flex-start', // ✅ Prevent vertical centering
  },
  backArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 44,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Add_New_Services;
