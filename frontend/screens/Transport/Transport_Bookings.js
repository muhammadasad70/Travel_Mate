import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Transport_Bookings = ({ onBackToServices }) => {
  const navigation = useNavigation();

  // Dummy booking data
  const [bookings] = useState([
    {
      id: '1',
      customerName: 'Ahmed Ali',
      customerPhone: '+92 300 1234567',
      customerEmail: 'ahmed.ali@email.com',
      transportType: 'Car',
      vehicleName: 'Toyota Corolla',
      fromCity: 'Karachi',
      toCity: 'Lahore',
      bookingDate: '2024-01-15',
      travelDate: '2024-01-20',
      travelTime: '09:00 AM',
      duration: '12 hours',
      distance: '1200 km',
      pricePerKm: '15',
      totalPrice: '18000',
      status: 'confirmed',
      specialRequests: 'Please ensure AC is working properly',
      pickupAddress: 'Gulshan-e-Iqbal, Karachi',
      dropoffAddress: 'DHA Phase 5, Lahore',
    },
    {
      id: '2',
      customerName: 'Fatima Khan',
      customerPhone: '+92 301 9876543',
      customerEmail: 'fatima.khan@email.com',
      transportType: 'Bus',
      vehicleName: 'Hino Bus',
      fromCity: 'Islamabad',
      toCity: 'Peshawar',
      bookingDate: '2024-01-16',
      travelDate: '2024-01-22',
      travelTime: '02:00 PM',
      duration: '3 hours',
      distance: '180 km',
      pricePerKm: '25',
      totalPrice: '4500',
      status: 'pending',
      specialRequests: 'Group of 8 people, need extra luggage space',
      pickupAddress: 'Blue Area, Islamabad',
      dropoffAddress: 'University Town, Peshawar',
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const handleBookingAction = (bookingId, action) => {
    console.log(`${action} booking:`, bookingId);
    // Here you would implement the actual booking action logic
  };

  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;

  return (
    <SafeAreaView style={styles.container}>
      {!isInDashboard && <VendorHeader />}
      
      <ScrollView style={[styles.scrollView, isInDashboard && { paddingTop: 0 }]}>
        <View style={[styles.content, isInDashboard && { paddingTop: 0 }]}>
          <View style={[styles.titleWithIcon, isInDashboard && { marginTop: 0 }]}>
            <Ionicons name="car-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
            <Text style={styles.title}>Transport Bookings</Text>
          </View>

          <Text style={styles.subtitle}>Manage your transport service bookings</Text>

          {bookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No Bookings Yet</Text>
              <Text style={styles.emptyText}>
                Your transport service bookings will appear here when customers make reservations.
              </Text>
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.customerName}>{booking.customerName}</Text>
                    <Text style={styles.bookingId}>Booking #{booking.id}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                    <Ionicons 
                      name={getStatusIcon(booking.status)} 
                      size={16} 
                      color={getStatusColor(booking.status)} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="car" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{booking.transportType} - {booking.vehicleName}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{booking.fromCity} → {booking.toCity}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{booking.travelDate} at {booking.travelTime}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>Duration: {booking.duration} ({booking.distance})</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="cash" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>Total: PKR {booking.totalPrice}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="call" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{booking.customerPhone}</Text>
                  </View>
                </View>

                {booking.specialRequests && (
                  <View style={styles.specialRequests}>
                    <Text style={styles.specialRequestsLabel}>Special Requests:</Text>
                    <Text style={styles.specialRequestsText}>{booking.specialRequests}</Text>
                  </View>
                )}

                <View style={styles.bookingActions}>
                  {booking.status === 'pending' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.confirmButton]}
                        onPress={() => handleBookingAction(booking.id, 'confirm')}
                      >
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                        <Text style={styles.actionButtonText}>Confirm</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => handleBookingAction(booking.id, 'cancel')}
                      >
                        <Ionicons name="close" size={16} color="#ffffff" />
                        <Text style={styles.actionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => handleBookingAction(booking.id, 'complete')}
                    >
                      <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                      <Text style={styles.actionButtonText}>Mark Complete</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.contactButton]}
                    onPress={() => handleBookingAction(booking.id, 'contact')}
                  >
                    <Ionicons name="call" size={16} color="#0ea5e9" />
                    <Text style={[styles.actionButtonText, { color: '#0ea5e9' }]}>Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {!isInDashboard && <VendorBottomNavBar />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Adjust for fixed header on web
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  specialRequests: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  specialRequestsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  bookingActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#10b981',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  completeButton: {
    backgroundColor: '#3b82f6',
  },
  contactButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 4,
  },
});

export default Transport_Bookings;

