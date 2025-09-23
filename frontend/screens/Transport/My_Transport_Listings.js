import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 900;

const My_Transport_Listings = ({ onAddService }) => {
  const navigation = useNavigation();
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransports, setShowTransports] = useState(false);

  const fetchTransports = useCallback(async () => {
    try {
      setLoading(true);
      const storedTransports = await AsyncStorage.getItem('my_transports');
      if (storedTransports) {
        setTransports(JSON.parse(storedTransports));
      }
    } catch (error) {
      console.error('Error fetching transports:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransports();
  }, [fetchTransports]);

  const handleEdit = (transport) => {
    if (onAddService) {
      onAddService(transport); // Pass the transport data to the callback
    } else {
      navigation.navigate('Add_New_Transport', { transport, transportId: transport.id });
    }
  };

  const handleDelete = async (transportId) => {
    try {
      const updatedTransports = transports.filter(t => t.id !== transportId);
      setTransports(updatedTransports);
      await AsyncStorage.setItem('my_transports', JSON.stringify(updatedTransports));
    } catch (error) {
      console.error('Error deleting transport:', error);
      Alert.alert('Error', 'Failed to delete transport service');
    }
  };

  const confirmDelete = (transportId) => {
    Alert.alert(
      'Delete Transport Service',
      'Are you sure you want to delete this transport service?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(transportId) },
      ]
    );
  };

  // Check if we're in dashboard mode
  const isInDashboard = !!onAddService;

  return (
    <SafeAreaView style={styles.wrapper}>
      {!isInDashboard && <VendorHeader />}
      <ScrollView contentContainerStyle={[styles.container, isInDashboard && { paddingTop: 0 }]}>
        {/* Add New Transport Card Button */}
        <TouchableOpacity 
          style={styles.addTransportCard}
          onPress={() => onAddService ? onAddService() : navigation.navigate('Add_New_Transport')}
        >
          <View style={styles.addTransportCardContent}>
            <Ionicons name="add-circle" size={24} color="#0ea5e9" />
            <Text style={styles.addTransportCardText}>Add New Transport</Text>
          </View>
        </TouchableOpacity>

        {/* View Transports Card Button */}
        <TouchableOpacity 
          style={styles.viewTransportsCard}
          onPress={() => setShowTransports(!showTransports)}
        >
          <View style={styles.viewTransportsCardContent}>
            <Ionicons name="list" size={24} color="#10b981" />
            <Text style={styles.viewTransportsCardText}>View Transports</Text>
          </View>
        </TouchableOpacity>

        {showTransports && (
          <>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading transport services...</Text>
              </View>
            ) : transports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Transport Services Yet</Text>
                <Text style={styles.emptyText}>
                  Start by adding your first transport service using the "Add New Transport" button above.
                </Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => onAddService ? onAddService() : navigation.navigate('Add_New_Transport')}
                >
                  <Text style={styles.addButtonText}>Add New Transport</Text>
                </TouchableOpacity>
              </View>
            ) : (
              transports.map((transport) => {
                return (
                  <View key={transport.id} style={styles.transportBox}>
                    <View style={styles.transportRow}>
                      <View style={styles.transportContent}>
                        <Text style={styles.transportTitle}>{transport.vehicleName}</Text>
                        <Text style={styles.description}>Type: {transport.transportType}</Text>
                        <Text style={styles.description}>Capacity: {transport.capacity} passengers</Text>
                        <Text style={styles.description}>Route: {transport.fromCity} → {transport.toCity}</Text>
                        <Text style={styles.description}>Price per KM: PKR {transport.pricePerKm}</Text>
                        <Text style={styles.description}>Price per Hour: PKR {transport.pricePerHour}</Text>
                        <Text style={styles.description}>Contact: {transport.contactNumber}</Text>
                        <View style={styles.actionsRow}>
                          <TouchableOpacity 
                            onPress={() => handleEdit(transport)} 
                            style={[styles.actionButton, styles.editButton]}
                          >
                            <Text style={styles.actionButtonText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => confirmDelete(transport.id)} 
                            style={[styles.actionButton, styles.deleteButton]}
                          >
                            <Text style={styles.actionButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.iconCol}>
                        <View style={[styles.transportIcon, styles.iconPlaceholder]}>
                          <Ionicons name="car" size={40} color="#6b7280" />
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            )}

            {transports.length > 0 && (
              <Text style={styles.tip}>Add more transport services using the "Add New Transport" button above.</Text>
            )}
          </>
        )}
      </ScrollView>
      {!isInDashboard && <VendorBottomNavBar />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Adjust for fixed header on web
  },
  // Card button styles
  addTransportCard: {
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
  addTransportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTransportCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  viewTransportsCard: {
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
  viewTransportsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTransportsCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  transportBox: {
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
  transportRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transportContent: {
    flex: 1,
    marginRight: 16,
  },
  transportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#dbeafe',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconCol: {
    alignItems: 'center',
  },
  transportIcon: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  tip: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default My_Transport_Listings;

