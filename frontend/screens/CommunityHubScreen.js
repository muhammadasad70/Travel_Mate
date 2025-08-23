// screens/CommunityHubScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CommunityScreen from './CommunityScreen';
import GroupScreen from './GroupScreen';

const CommunityHubScreen = ({ inPage }) => {
  // ❌ do NOT use: useState<'community' | 'groups'>('community')
  const [tab, setTab] = useState('community'); // ✅

  return (
    <View style={[styles.container, inPage && { paddingTop: 30 }]}>
      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[styles.toggleBtn, tab === 'community' && styles.toggleActive]}
          onPress={() => setTab('community')}
        >
          <Text style={tab === 'community' ? styles.toggleTextActive : styles.toggleText}>
            Community
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, tab === 'groups' && styles.toggleActive]}
          onPress={() => setTab('groups')}
        >
          <Text style={tab === 'groups' ? styles.toggleTextActive : styles.toggleText}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'community' ? <CommunityScreen inPage /> : <GroupScreen inPage />}
      </View>
    </View>
  );
};

export default CommunityHubScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  toggleWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    width: 320,
    marginBottom: 12,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  toggleActive: { backgroundColor: '#003366' },
  toggleText: { fontWeight: '700', color: '#334155' },
  toggleTextActive: { fontWeight: '800', color: '#fff' },
});
