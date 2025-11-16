// screens/CulturalExchange/VendorPreviewCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VendorPreviewCard = ({ vendor, languages = [], onViewProfile }) => {
  if (!vendor) return null;

  // Generate initials for avatar fallback
  const getInitials = () => {
    const first = (vendor.first_name || vendor.name || 'H').charAt(0).toUpperCase();
    const last = (vendor.last_name || '').charAt(0).toUpperCase();
    return first + last;
  };

  // Format member since date
  const getMemberSince = () => {
    if (!vendor.member_since) return 'New member';
    const year = new Date(vendor.member_since).getFullYear();
    return `Hosting since ${year}`;
  };

  // Build display name (first name + last initial for privacy)
  const getDisplayName = () => {
    if (vendor.name) return vendor.name; // Social login name
    const first = vendor.first_name || 'Host';
    const lastInitial = vendor.last_name ? ` ${vendor.last_name.charAt(0)}.` : '';
    return first + lastInitial;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          {vendor.avatar_url ? (
            <Image source={{ uri: vendor.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.initials}>{getInitials()}</Text>
            </View>
          )}
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{getDisplayName()}</Text>
              {vendor.is_verified && (
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              )}
            </View>
            {vendor.is_verified && (
              <Text style={styles.verifiedText}>Verified TravelMate host</Text>
            )}
          </View>
        </View>
      </View>

      {/* Location & Languages */}
      <View style={styles.metaRow}>
        {vendor.city && (
          <View style={styles.metaChip}>
            <Ionicons name="location-outline" size={14} color="#475569" />
            <Text style={styles.metaText}>{vendor.city}, Pakistan</Text>
          </View>
        )}
        {languages.length > 0 && (
          <View style={styles.metaChip}>
            <Ionicons name="language-outline" size={14} color="#475569" />
            <Text style={styles.metaText}>Speaks: {languages.join(', ')}</Text>
          </View>
        )}
      </View>

      {/* Member Info */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.statText}>{getMemberSince()}</Text>
        </View>
        {vendor.total_experiences > 0 && (
          <View style={styles.statItem}>
            <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
            <Text style={styles.statText}>
              {vendor.total_experiences} cultural experience{vendor.total_experiences > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* View Profile Button */}
      {onViewProfile && (
        <TouchableOpacity style={styles.viewProfileBtn} onPress={onViewProfile}>
          <Text style={styles.viewProfileText}>View host profile</Text>
          <Ionicons name="chevron-forward" size={16} color="#0ea5e9" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VendorPreviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EDF7',
    padding: 14,
    marginTop: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  nameSection: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  verifiedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metaText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0ea5e9',
  },
});