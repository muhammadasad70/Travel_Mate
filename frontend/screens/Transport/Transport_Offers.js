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
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Transport_Offers = ({ onBackToServices }) => {
  const navigation = useNavigation();

  // Dummy offers data
  const [offers] = useState([
    {
      id: '1',
      customerName: 'Sarah Ahmed',
      customerPhone: '+92 302 5551234',
      customerEmail: 'sarah.ahmed@email.com',
      requestType: 'Airport Transfer',
      fromLocation: 'Jinnah International Airport, Karachi',
      toLocation: 'DHA Phase 2, Karachi',
      requestedDate: '2024-01-25',
      requestedTime: '11:30 PM',
      passengerCount: 2,
      luggageCount: 3,
      budget: '2500',
      specialRequirements: 'Late night pickup, need child car seat, English speaking driver',
      status: 'pending',
      submittedDate: '2024-01-20',
      urgency: 'high',
      estimatedDistance: '25 km',
      estimatedDuration: '45 minutes',
    },
    {
      id: '2',
      customerName: 'Muhammad Hassan',
      customerPhone: '+92 303 7778889',
      customerEmail: 'm.hassan@email.com',
      requestType: 'Intercity Travel',
      fromLocation: 'Lahore Railway Station',
      toLocation: 'Faisalabad City Center',
      requestedDate: '2024-01-28',
      requestedTime: '08:00 AM',
      passengerCount: 4,
      luggageCount: 2,
      budget: '8000',
      specialRequirements: 'Comfortable vehicle for elderly passengers, stop for breakfast',
      status: 'pending',
      submittedDate: '2024-01-21',
      urgency: 'medium',
      estimatedDistance: '120 km',
      estimatedDuration: '2.5 hours',
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'declined':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'declined':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'Airport Transfer':
        return 'airplane';
      case 'Intercity Travel':
        return 'car';
      case 'City Tour':
        return 'location';
      case 'Event Transport':
        return 'calendar';
      default:
        return 'car';
    }
  };

  const handleOfferAction = (offerId, action) => {
    console.log(`${action} offer:`, offerId);
    // Here you would implement the actual offer action logic
  };

  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;

  return (
    <SafeAreaView style={styles.container}>
      {!isInDashboard && <VendorHeader />}
      
      <ScrollView style={[styles.scrollView, isInDashboard && { paddingTop: 0 }]}>
        <View style={[styles.content, isInDashboard && { paddingTop: 0 }]}>
          <View style={[styles.titleWithIcon, isInDashboard && { marginTop: 0 }]}>
            <Ionicons name="document-text-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
            <Text style={styles.title}>Transport Requests</Text>
          </View>

          <Text style={styles.subtitle}>Review and respond to customer transport requests</Text>

          {offers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No Requests Yet</Text>
              <Text style={styles.emptyText}>
                Customer transport requests will appear here when they submit their requirements.
              </Text>
            </View>
          ) : (
            offers.map((offer) => (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.offerHeader}>
                  <View style={styles.offerInfo}>
                    <Text style={styles.customerName}>{offer.customerName}</Text>
                    <Text style={styles.requestId}>Request #{offer.id}</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(offer.urgency) + '20' }]}>
                      <Text style={[styles.urgencyText, { color: getUrgencyColor(offer.urgency) }]}>
                        {offer.urgency.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(offer.status) + '20' }]}>
                      <Ionicons 
                        name={getStatusIcon(offer.status)} 
                        size={16} 
                        color={getStatusColor(offer.status)} 
                      />
                      <Text style={[styles.statusText, { color: getStatusColor(offer.status) }]}>
                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.requestTypeContainer}>
                  <Ionicons name={getRequestTypeIcon(offer.requestType)} size={20} color="#0ea5e9" />
                  <Text style={styles.requestType}>{offer.requestType}</Text>
                </View>

                <View style={styles.offerDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#6b7280" />
                    <View style={styles.locationContainer}>
                      <Text style={styles.detailLabel}>From:</Text>
                      <Text style={styles.detailText}>{offer.fromLocation}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#6b7280" />
                    <View style={styles.locationContainer}>
                      <Text style={styles.detailLabel}>To:</Text>
                      <Text style={styles.detailText}>{offer.toLocation}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{offer.requestedDate} at {offer.requestedTime}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="people" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{offer.passengerCount} passengers, {offer.luggageCount} luggage</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="cash" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>Budget: PKR {offer.budget}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="call" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{offer.customerPhone}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>Est. {offer.estimatedDistance} ({offer.estimatedDuration})</Text>
                  </View>
                </View>

                {offer.specialRequirements && (
                  <View style={styles.specialRequirements}>
                    <Text style={styles.specialRequirementsLabel}>Special Requirements:</Text>
                    <Text style={styles.specialRequirementsText}>{offer.specialRequirements}</Text>
                  </View>
                )}

                <View style={styles.offerActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleOfferAction(offer.id, 'accept')}
                  >
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.declineButton]}
                    onPress={() => handleOfferAction(offer.id, 'decline')}
                  >
                    <Ionicons name="close" size={16} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Decline</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.contactButton]}
                    onPress={() => handleOfferAction(offer.id, 'contact')}
                  >
                    <Ionicons name="call" size={16} color="#0ea5e9" />
                    <Text style={[styles.actionButtonText, { color: '#0ea5e9' }]}>Contact</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.submittedInfo}>
                  <Text style={styles.submittedText}>Submitted: {offer.submittedDate}</Text>
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
  offerCard: {
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
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  offerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  requestId: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
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
  requestTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  requestType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  offerDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  locationContainer: {
    flex: 1,
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  specialRequirements: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  specialRequirementsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  specialRequirementsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  offerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
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
  acceptButton: {
    backgroundColor: '#10b981',
  },
  declineButton: {
    backgroundColor: '#ef4444',
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
  submittedInfo: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  submittedText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
});

export default Transport_Offers;

