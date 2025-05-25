import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const My_Services = () => {
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

        {/* Heading */}
        <Text style={styles.title}>🏨 My Accommodation Services</Text>

        {/* Services List */}
        <Text style={styles.serviceItem}>• Deluxe Room with Lake View</Text>
        <Text style={styles.serviceItem}>• Family Suite with Complimentary Breakfast</Text>
        <Text style={styles.serviceItem}>• Standard Room (Single/Double)</Text>

        {/* Note */}
        <Text style={styles.note}>
          📝 Note: You can edit or remove your services from the dashboard.
        </Text>
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
    color: '#1F2937',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  serviceItem: {
    fontSize: 16,
    marginBottom: 10,
    color: '#374151',
  },
  note: {
    marginTop: 30,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
  },
});

export default My_Services;
