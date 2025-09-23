import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
// import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const dummyRequests = [
  { 
    id: 'BR001', 
    name: 'Ali Raza', 
    email: 'ali.raza@gmail.com',
    phone: '+92-300-1234567',
    dates: '2025-06-10 to 2025-06-15', 
    service: 'Luxury Hotel Suite',
    status: 'Pending' 
  },
  { 
    id: 'BR002', 
    name: 'Zara Khan', 
    email: 'zara.khan@yahoo.com',
    phone: '+92-301-9876543',
    dates: '2025-07-01 to 2025-07-05', 
    service: 'Traditional Guesthouse',
    status: 'Pending' 
  },
];

const Booking_Requests = ({ onBackToServices }) => {
  const navigation = useNavigation();

  const handleApprove = (id) => alert(`✅ Approved: ${id}`);
  const handleReject = (id) => alert(`❌ Rejected: ${id}`);

  // If onBackToServices is provided, we're in dashboard mode (no header/bottom nav)
  const isInDashboard = !!onBackToServices;
  
  if (isInDashboard) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <FlatList
        data={dummyRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: isMobile ? 16 : 40, paddingBottom: 20, paddingTop: 0, paddingVertical: 0 }}
        ListHeaderComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 0, paddingTop: 0 }}>
            <Ionicons name="clipboard-outline" size={24} color="#111" style={{ marginRight: 8 }} />
            <Text style={styles.title}>Booking Requests</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.guestName}>{item.name}</Text>
            <Text style={styles.dates}>Email: {item.email}</Text>
            <Text style={styles.dates}>Phone: {item.phone}</Text>
            <Text style={styles.dates}>Service: {item.service}</Text>
            <Text style={styles.dates}>Dates: {item.dates}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>

            {item.status === 'Pending' && (
              <View style={styles.actions}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item.id)}>
                  <Text style={styles.actionText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      </View>
    );
  }

  // Standalone mode with header and bottom nav
  return (
    <SafeAreaView style={styles.wrapper}>
    //  <VendorHeader />
      <FlatList
        data={dummyRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.titleWithIcon}>
              <Ionicons name="clipboard-outline" size={24} color="#111" style={{ marginRight: 8 }} />
              <Text style={styles.title}>Booking Requests</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.guestName}>{item.name}</Text>
            <Text style={styles.dates}>Email: {item.email}</Text>
            <Text style={styles.dates}>Phone: {item.phone}</Text>
            <Text style={styles.dates}>Service: {item.service}</Text>
            <Text style={styles.dates}>Dates: {item.dates}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>

            {item.status === 'Pending' && (
              <View style={styles.actions}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item.id)}>
                  <Text style={styles.actionText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  list: {
    paddingHorizontal: isMobile ? 16 : 40,
    paddingVertical: 20,
    paddingBottom: 120, // Increased to account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 20, // Add top padding for fixed header on web
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  guestName: { fontSize: 16, fontWeight: '600' },
  dates: { fontSize: 13, color: '#4B5563', marginTop: 4 },
  status: { fontSize: 13, color: '#2563EB', marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: 10, gap: 12, justifyContent: 'flex-start' },
  approveBtn: { backgroundColor: '#22C55E', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 80 },
  rejectBtn: { backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 80 },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 14, textAlign: 'center' },
});

export default Booking_Requests;
