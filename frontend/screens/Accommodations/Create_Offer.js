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
import { Feather, Ionicons } from '@expo/vector-icons';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Create_Offer = ({ onBackToServices }) => {
  const navigation = useNavigation();

  // If onBackToServices is provided, we're in dashboard mode (no header/bottom nav)
  const isInDashboard = !!onBackToServices;
  
  if (isInDashboard) {
    return (
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: 0 }]}>

        <View style={styles.headingContainer}>
          <Ionicons name="gift-outline" size={24} color="#22C55E" />
          <Text style={styles.heading}>Create Accommodation Offer</Text>
        </View>

        <TextInput placeholder="Offer Title" style={styles.input} />
        <TextInput
          placeholder="Description"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
        />
        <TextInput placeholder="Discount (%)" style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Valid From (YYYY-MM-DD)" style={styles.input} />
        <TextInput placeholder="Valid Until (YYYY-MM-DD)" style={styles.input} />
        <TextInput placeholder="Applicable Locations (optional)" style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={() => alert('Offer submitted (dummy)!')}>
          <Text style={styles.buttonText}>Submit Offer</Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Standalone mode with header and bottom nav
  return (
    <SafeAreaView style={styles.wrapper}>
      <VendorHeader />
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.headingContainer}>
          <Ionicons name="gift-outline" size={24} color="#22C55E" />
          <Text style={styles.heading}>Create Accommodation Offer</Text>
        </View>

        <TextInput placeholder="Offer Title" style={styles.input} />
        <TextInput
          placeholder="Description"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
        />
        <TextInput placeholder="Discount (%)" style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Valid From (YYYY-MM-DD)" style={styles.input} />
        <TextInput placeholder="Valid Until (YYYY-MM-DD)" style={styles.input} />
        <TextInput placeholder="Applicable Locations (optional)" style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={() => alert('Offer submitted (dummy)!')}>
          <Text style={styles.buttonText}>Submit Offer</Text>
        </TouchableOpacity>
      </ScrollView>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    paddingHorizontal: isMobile ? 16 : 40,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    width: '100%',
    flexGrow: 1,
    paddingTop: Platform.OS === 'web' ? 120 : 20, // Add top padding for fixed header on web
    paddingBottom: 100, // Add bottom padding for bottom navigation bar
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#111827',
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
    marginTop: 20,
    backgroundColor: '#0077b6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Create_Offer;
