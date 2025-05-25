import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Create_Offer = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ Back arrow only on web */}
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Feather name="arrow-left" size={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.heading}>🎁 Create Accommodation Offer</Text>

        <TextInput placeholder="🏷️ Offer Title" style={styles.input} />
        <TextInput
          placeholder="💬 Description"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
        />
        <TextInput placeholder="🔢 Discount (%)" style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="📆 Valid From (YYYY-MM-DD)" style={styles.input} />
        <TextInput placeholder="📆 Valid Until (YYYY-MM-DD)" style={styles.input} />
        <TextInput placeholder="📍 Applicable Locations (optional)" style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={() => alert('Offer submitted (dummy)!')}>
          <Text style={styles.buttonText}>Submit Offer</Text>
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
    padding: isMobile ? 16 : 32,
    backgroundColor: '#F9FAFB',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    flexGrow: 1,
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
    color: '#111827',
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
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#22C55E',
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

export default Create_Offer;
