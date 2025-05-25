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
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const dummyRequests = [
  {
    id: 'BR001',
    name: 'John Doe',
    dates: '2025-06-10 to 2025-06-15',
    status: 'Pending',
  },
  {
    id: 'BR002',
    name: 'Fatima Khan',
    dates: '2025-07-01 to 2025-07-05',
    status: 'Approved',
  },
];

const Booking_Requests = () => {
  const navigation = useNavigation();

  const handleApprove = (id) => alert(`✅ Approved: ${id}`);
  const handleReject = (id) => alert(`❌ Rejected: ${id}`);

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#111" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Booking Requests</Text>
      </View>

      <FlatList
        data={dummyRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.guestName}>{item.name}</Text>
            <Text style={styles.dates}>Dates: {item.dates}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>

            {item.status === 'Pending' && (
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleApprove(item.id)}>
                  <Feather name="check-circle" size={20} color="#22C55E" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject(item.id)}>
                  <Feather name="x-circle" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isMobile ? 16 : 32,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  list: {
    paddingHorizontal: isMobile ? 16 : 40,
    paddingVertical: 20,
    paddingBottom: 100,
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
  guestName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dates: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
  status: {
    fontSize: 13,
    color: '#2563EB',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 16,
  },
});

export default Booking_Requests;
