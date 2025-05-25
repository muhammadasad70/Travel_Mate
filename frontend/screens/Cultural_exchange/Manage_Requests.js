import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const dummyRequests = [
  {
    id: 1,
    traveler: 'Alice Khan',
    listing: 'Learn Urdu Calligraphy',
    date: 'May 25, 2025',
  },
  {
    id: 2,
    traveler: 'Zaid Malik',
    listing: 'Traditional Cooking Workshop',
    date: 'May 28, 2025',
  },
];

const Manage_Requests = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={styles.container}>
        {/* Web-only Back Arrow */}
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>Manage Participation Requests</Text>

        <ScrollView>
          {dummyRequests.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.label}>Traveler:</Text>
              <Text style={styles.value}>{item.traveler}</Text>
              <Text style={styles.label}>Listing:</Text>
              <Text style={styles.value}>{item.listing}</Text>
              <Text style={styles.label}>Requested Date:</Text>
              <Text style={styles.value}>{item.date}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.approveBtn}>
                  <Text style={styles.actionText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn}>
                  <Text style={styles.actionText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isMobile ? 40 : 60,
    paddingHorizontal: isMobile ? 16 : 24,
    backgroundColor: '#F9FAFB',
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    color: '#374151',
  },
  value: {
    fontSize: 14,
    marginBottom: 4,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  approveBtn: {
    backgroundColor: '#34D399',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  declineBtn: {
    backgroundColor: '#F87171',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Manage_Requests;
