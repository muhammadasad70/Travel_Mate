import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Manage_Requests = ({ onBackToServices }) => {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([
    {
      id: 1,
      traveler: 'Alice Khan',
      listing: 'Learn Urdu Calligraphy',
      date: 'May 25, 2025',
      slots: 3,
    },
  ]);

  const handleAccept = (id) => {
    Alert.alert('Request Accepted', 'The traveler has been notified and a slot has been reserved.');
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleDelete = (id) => {
    Alert.alert('Request Declined', 'The traveler has been notified that their request was declined.');
    setRequests(requests.filter(req => req.id !== id));
  };

  // If onBackToServices is provided, we're in dashboard mode (no header/bottom nav)
  const isInDashboard = !!onBackToServices;
  
  if (isInDashboard) {
    return (
      <View style={[styles.container, { paddingTop: 0 }]}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="clipboard-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Manage Participation Requests</Text>
        </View>

        <ScrollView>
          {requests.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          ) : (
            requests.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.label}>Traveler:</Text>
                <Text style={styles.value}>{item.traveler}</Text>
                <Text style={styles.label}>Listing:</Text>
                <Text style={styles.value}>{item.listing}</Text>
                <Text style={styles.label}>Requested Date:</Text>
                <Text style={styles.value}>{item.date}</Text>
                <Text style={styles.label}>Slots Requested:</Text>
                <Text style={styles.value}>{item.slots}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleAccept(item.id)}>
                    <Text style={styles.actionText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineBtn} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // Standalone mode with header and bottom nav
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <VendorHeader />
      <View style={styles.container}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="clipboard-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Manage Participation Requests</Text>
        </View>

        <ScrollView>
          {requests.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          ) : (
            requests.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.label}>Traveler:</Text>
                <Text style={styles.value}>{item.traveler}</Text>
                <Text style={styles.label}>Listing:</Text>
                <Text style={styles.value}>{item.listing}</Text>
                <Text style={styles.label}>Requested Date:</Text>
                <Text style={styles.value}>{item.date}</Text>
                <Text style={styles.label}>Slots Requested:</Text>
                <Text style={styles.value}>{item.slots}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleAccept(item.id)}>
                    <Text style={styles.actionText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineBtn} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
        )}
      </ScrollView>
      </View>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 120 : 20, // Add top padding for fixed header on web
    paddingHorizontal: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    backgroundColor: '#F9FAFB',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
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
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
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
    justifyContent: 'flex-start',
    marginTop: 12,
    gap: 12,
  },
  approveBtn: {
    backgroundColor: '#34D399',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  declineBtn: {
    backgroundColor: '#F87171',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Manage_Requests;
