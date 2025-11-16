// screens/CulturalExchange/PublicTravelerProfile.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Alert, Image, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import getBaseURL from '../../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');

export default function PublicTravelerProfile() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const travelerId = params?.travelerId;
  const isConfirmed = params?.isConfirmed || false;
  
  // Contact details passed from confirmed booking
  const travelerEmail = params?.travelerEmail;
  const travelerPhone = params?.travelerPhone;
  const travelerCountryCode = params?.travelerCountryCode;
  const travelerName = params?.travelerName;

  const [loading, setLoading] = useState(true);
  const [traveler, setTraveler] = useState(null);

  useEffect(() => {
    if (!travelerId) {
      Alert.alert('Error', 'No traveler ID provided');
      navigation.goBack();
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/users/${travelerId}/profile`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load profile');
        setTraveler(json);
      } catch (e) {
        Alert.alert('Error', e.message || 'Could not load traveler profile');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [travelerId]);

  const getInitials = () => {
    if (!traveler?.user) return 'T';
    const first = (traveler.user.first_name || traveler.user.name || 'T').charAt(0).toUpperCase();
    const last = (traveler.user.last_name || '').charAt(0).toUpperCase();
    return first + last;
  };

  const getDisplayName = () => {
    if (travelerName) return travelerName;
    if (!traveler?.user) return 'Traveler';
    if (traveler.user.name) return traveler.user.name;
    const first = traveler.user.first_name || 'Traveler';
    const lastInitial = traveler.user.last_name ? ` ${traveler.user.last_name.charAt(0)}.` : '';
    return first + lastInitial;
  };

  const getMemberSince = () => {
    if (!traveler?.user?.created_at) return 'Member';
    const year = new Date(traveler.user.created_at).getFullYear();
    return `Member since ${year}`;
  };

  const callTraveler = () => {
    const fullNumber = `${travelerCountryCode || ''}${travelerPhone || ''}`.replace(/\s/g, '');
    if (fullNumber) {
      Linking.openURL(`tel:${fullNumber}`);
    }
  };

  const emailTraveler = () => {
    if (travelerEmail) {
      Linking.openURL(`mailto:${travelerEmail}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Traveler Profile</Text>
        <View style={{ width: 72 }} />
      </View>

      <ScrollView contentContainerStyle={styles.wrap}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading…</Text>
          </View>
        ) : !traveler ? (
          <View style={styles.loading}>
            <Text>Profile not found</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileCard}>
              {traveler.user?.avatar_url ? (
                <Image source={{ uri: traveler.user.avatar_url }} style={styles.avatarLarge} />
              ) : (
                <View style={styles.avatarLargeFallback}>
                  <Text style={styles.initialsLarge}>{getInitials()}</Text>
                </View>
              )}
              
              <View style={styles.nameContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>{getDisplayName()}</Text>
                  {traveler.user?.is_verified && (
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  )}
                </View>
                <Text style={styles.roleBadge}>TravelMate Traveler</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                  <Text style={styles.statText}>{getMemberSince()}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>About</Text>
              {traveler.user?.country && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color="#475569" />
                  <Text style={styles.infoText}>{traveler.user.country}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#475569" />
                <Text style={styles.infoText}>Role: {traveler.user?.role || 'Traveler'}</Text>
              </View>
            </View>

            {/* Show contact details if confirmed booking */}
            {isConfirmed ? (
              <View style={styles.contactCard}>
                <Text style={styles.contactCardTitle}>Contact Details</Text>
                <Text style={styles.contactSubtitle}>Booking confirmed - you can now contact the traveler</Text>
                
                {travelerEmail && (
                  <TouchableOpacity style={styles.contactRow} onPress={emailTraveler}>
                    <Ionicons name="mail-outline" size={18} color="#0ea5e9" />
                    <Text style={[styles.contactText, { color: '#0ea5e9' }]}>{travelerEmail}</Text>
                  </TouchableOpacity>
                )}
                
                {travelerPhone && (
                  <TouchableOpacity style={styles.contactRow} onPress={callTraveler}>
                    <Ionicons name="call-outline" size={18} color="#10B981" />
                    <Text style={[styles.contactText, { color: '#10B981' }]}>
                      {travelerCountryCode}{travelerPhone}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.noteCard}>
                <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
                <Text style={styles.noteText}>
                  Contact details will be available after you confirm the booking
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#f7f9fc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backTxt: { fontWeight: '800', color: '#0f172a' },
  headerTitle: { fontWeight: '800', color: '#0f172a' },
  wrap: { padding: 14, paddingBottom: 28 },
  loading: { alignItems: 'center', padding: 24 },
  
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EDF7',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  avatarLargeFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsLarge: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  nameContainer: {
    alignItems: 'center',
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  roleBadge: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  
  infoCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6EDF7',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  cardTitle: {
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  
  contactCard: {
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  contactCardTitle: {
    fontWeight: '800',
    color: '#065F46',
    fontSize: 16,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  contactText: {
    fontSize: 15,
    fontWeight: '600',
  },
  
  noteCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#4338CA',
    fontWeight: '600',
  },
});