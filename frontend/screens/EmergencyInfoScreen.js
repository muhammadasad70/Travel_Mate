import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

import { useNetworkStatus } from '../utils/networkStatus';
import { 
  saveEmergencyDataOffline, 
  getOfflineEmergencyForCity 
} from '../utils/offlineStorage';
import getBaseURL from '../config/env';  // ✅ ADD THIS

const COLORS = {
  primary: '#0c2444ff',
  background: '#F6FAFD',
  card: '#FFFFFF',
  text: '#0F3A6B',
  subtext: '#6B7280',
  border: '#EAF0F6',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

const API_BASE = getBaseURL();

export default function EmergencyInfoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  
  const city = route.params?.city || 'Islamabad';
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [usingCache, setUsingCache] = useState(false);

  useEffect(() => {
    loadEmergencyData();
  }, [city]);

  const loadEmergencyData = async () => {
    try {
      if (isOnline) {
        // Try to fetch from API
        const response = await fetch(`${API_BASE}/emergency/contacts?city=${encodeURIComponent(city)}`);
        
        if (response.ok) {
          const data = await response.json();
          setEmergencyData(data);
          setUsingCache(false);
          
          // Cache the data for offline use
          await saveEmergencyDataOffline(city, data);
        } else {
          throw new Error('API request failed');
        }
      } else {
        // Load from cache
        const cached = await getOfflineEmergencyForCity(city);
        if (cached) {
          setEmergencyData(cached);
          setUsingCache(true);
        } else {
          Alert.alert('Offline', 'No cached emergency data available for this city. Please connect to the internet.');
        }
      }
    } catch (error) {
      console.error('Load emergency data failed:', error);
      
      // Fallback to cache
      const cached = await getOfflineEmergencyForCity(city);
      if (cached) {
        setEmergencyData(cached);
        setUsingCache(true);
      } else {
        Alert.alert('Error', 'Could not load emergency information');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (isOnline) {
      setRefreshing(true);
      loadEmergencyData();
    } else {
      Alert.alert('Offline', 'Cannot refresh while offline');
    }
  };

  const handleCall = (phone, name) => {
    Alert.alert(
      'Call Emergency Service',
      `Call ${name} at ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phone}`).catch(() => {
              Alert.alert('Error', 'Could not initiate call');
            });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading emergency contacts...</Text>
      </View>
    );
  }

  if (!emergencyData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Info</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.subtext} />
          <Text style={styles.emptyText}>No emergency data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { national, city: cityData, embassies, tips, fallback_used, fallback_city, fallback_info } = emergencyData;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Emergency Info</Text>
          <Text style={styles.headerSubtitle}>{city}</Text>
        </View>
        {!isOnline && (
          <View style={styles.offlineBadge}>
            <Ionicons name="cloud-offline" size={16} color="#fff" />
          </View>
        )}
        {isOnline && <View style={{ width: 24 }} />}
      </View>

      {/* Cache Warning */}
      {usingCache && (
        <View style={styles.cacheWarning}>
          <Ionicons name="information-circle" size={20} color={COLORS.warning} />
          <Text style={styles.cacheWarningText}>Using cached data - may not be current</Text>
        </View>
      )}

      {/* Fallback Info */}
      {fallback_used && (
        <View style={styles.fallbackBanner}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.fallbackTitle}>Using nearby city data</Text>
            <Text style={styles.fallbackText}>
              Showing {fallback_city} contacts ({fallback_info})
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* National Emergency Numbers */}
        <SectionHeader title="National Emergency Numbers" icon="shield-checkmark" />
        <View style={styles.nationalGrid}>
          {national?.map((contact, index) => (
            <NationalEmergencyCard
              key={index}
              contact={contact}
              onCall={handleCall}
            />
          ))}
        </View>

        {/* City-Specific Contacts */}
        {cityData && (
          <>
            {cityData.contacts.police && cityData.contacts.police.length > 0 && (
              <>
                <SectionHeader title="Police & Security" icon="shield-outline" />
                {cityData.contacts.police.map((contact, index) => (
                  <ContactCard
                    key={index}
                    contact={contact}
                    onCall={handleCall}
                  />
                ))}
              </>
            )}

            {cityData.contacts.hospital && cityData.contacts.hospital.length > 0 && (
              <>
                <SectionHeader title="Hospitals & Medical" icon="medical-outline" />
                {cityData.contacts.hospital.map((contact, index) => (
                  <ContactCard
                    key={index}
                    contact={contact}
                    onCall={handleCall}
                  />
                ))}
              </>
            )}

            {cityData.contacts.fire && cityData.contacts.fire.length > 0 && (
              <>
                <SectionHeader title="Fire & Rescue" icon="flame-outline" />
                {cityData.contacts.fire.map((contact, index) => (
                  <ContactCard
                    key={index}
                    contact={contact}
                    onCall={handleCall}
                  />
                ))}
              </>
            )}

            {cityData.contacts.tourism && cityData.contacts.tourism.length > 0 && (
              <>
                <SectionHeader title="Tourism Help" icon="information-circle-outline" />
                {cityData.contacts.tourism.map((contact, index) => (
                  <ContactCard
                    key={index}
                    contact={contact}
                    onCall={handleCall}
                  />
                ))}
              </>
            )}
          </>
        )}

        {/* Embassies */}
        {embassies && embassies.length > 0 && (
          <>
            <SectionHeader title="Embassies in Islamabad" icon="flag-outline" />
            {embassies.map((embassy, index) => (
              <ContactCard
                key={index}
                contact={embassy}
                onCall={handleCall}
              />
            ))}
          </>
        )}

        {/* Safety Tips */}
        {tips && tips.length > 0 && (
          <>
            <SectionHeader title="Safety Tips" icon="bulb-outline" />
            <View style={styles.tipsContainer}>
              {tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function NationalEmergencyCard({ contact, onCall }) {
  const getIconForCategory = (category) => {
    switch (category) {
      case 'police': return 'shield';
      case 'ambulance': return 'medical';
      case 'rescue': return 'medkit';
      case 'fire': return 'flame';
      default: return 'call';
    }
  };

  const getColorForCategory = (category) => {
    switch (category) {
      case 'police': return '#3B82F6';
      case 'ambulance': return '#10B981';
      case 'rescue': return '#F59E0B';
      case 'fire': return '#EF4444';
      default: return COLORS.primary;
    }
  };

  const color = getColorForCategory(contact.category);
  const icon = getIconForCategory(contact.category);

  return (
    <TouchableOpacity
      style={[styles.nationalCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
      onPress={() => onCall(contact.phone, contact.name)}
      activeOpacity={0.9}
    >
      <View style={[styles.nationalIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.nationalName} numberOfLines={1}>{contact.name}</Text>
        <Text style={styles.nationalPhone}>{contact.phone}</Text>
      </View>
      <View style={[styles.callButton, { backgroundColor: color }]}>
        <Ionicons name="call" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

function ContactCard({ contact, onCall }) {
  return (
    <View style={styles.contactCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <View style={styles.contactDetails}>
          <Ionicons name="call-outline" size={14} color={COLORS.subtext} />
          <Text style={styles.contactPhone}>{contact.phone}</Text>
          {contact.is_24_7 && (
            <View style={styles.badge247}>
              <Text style={styles.badge247Text}>24/7</Text>
            </View>
          )}
        </View>
        {contact.address && (
          <View style={styles.contactDetails}>
            <Ionicons name="location-outline" size={14} color={COLORS.subtext} />
            <Text style={styles.contactAddress} numberOfLines={1}>{contact.address}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.contactCallButton}
        onPress={() => onCall(contact.phone, contact.name)}
      >
        <Ionicons name="call" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.subtext,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 2,
  },
  offlineBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cacheWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  cacheWarningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  fallbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    padding: 16,
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  fallbackText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  nationalGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  nationalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nationalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nationalName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  nationalPhone: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  contactDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  contactPhone: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: '600',
  },
  contactAddress: {
    flex: 1,
    fontSize: 12,
    color: COLORS.subtext,
  },
  badge247: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  badge247Text: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  contactCallButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsContainer: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.subtext,
    marginTop: 16,
  },
});