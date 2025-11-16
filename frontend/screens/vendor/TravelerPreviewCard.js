// screens/Vendor/TravelerPreviewCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TravelerPreviewCard = ({ traveler, onViewProfile }) => {
  if (!traveler) return null;

  // Generate initials for avatar fallback
  const getInitials = () => {
    const name = traveler.name?.String || traveler.name || '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase() || 'T';
  };

  // Get display name (first name only for privacy)
  const getDisplayName = () => {
    const name = traveler.name?.String || traveler.name || 'Traveler';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
    }
    return parts[0] || 'Traveler';
  };

  const avatarUrl = traveler.avatar_url?.String || traveler.avatar_url;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.initials}>{getInitials()}</Text>
            </View>
          )}
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{getDisplayName()}</Text>
              <Ionicons name="person-circle" size={18} color="#6366F1" />
            </View>
            <Text style={styles.roleText}>TravelMate Traveler</Text>
          </View>
        </View>
      </View>

      {/* View Profile Button */}
      {onViewProfile && (
        <TouchableOpacity style={styles.viewProfileBtn} onPress={onViewProfile}>
          <Text style={styles.viewProfileText}>View traveler profile</Text>
          <Ionicons name="chevron-forward" size={16} color="#6366F1" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TravelerPreviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6EDF7',
    padding: 12,
    marginTop: 10,
    gap: 10,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  nameSection: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  roleText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366F1',
  },
});