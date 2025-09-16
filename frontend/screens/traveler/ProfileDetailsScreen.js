// screens/traveler/ProfileDetailsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../api';

const PRIMARY = '#003366';
const SUBTEXT  = '#6B7280';
const PAGE_BG  = '#F7F7F7';
const CARD_BG  = '#FFFFFF';
const BORDER   = '#ECEFF3';
const PILL_BG  = '#F0F6FF';
const MAX_W    = 720;

export default function ProfileDetailsScreen() {
  const nav = useNavigation();
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState('');
  const [p, setP]             = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/profile/me');
        setP(data);
      } catch (e) {
        setErr('Failed to load profile.');
        console.log(e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBack = () => (nav.canGoBack() ? nav.goBack() : nav.navigate('TravelerProfile'));
  const handleEdit = () => nav.navigate('ManageTravelerProfile');

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: PAGE_BG }}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={{ marginTop:8, color:SUBTEXT }}>Loading…</Text>
      </View>
    );
  }
  if (!p) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: PAGE_BG }}>
        <Text style={{ color:SUBTEXT }}>{err || 'No profile data'}</Text>
        <TouchableOpacity onPress={handleBack} style={{ marginTop:10 }}>
          <Text style={{ color:PRIMARY, fontWeight:'700' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || '—';
  const phoneFmt = [p.countryCode, p.phone].filter(Boolean).join(' ') || '—';
  const roleTxt  = p.role === 'vendor' ? 'Vendor' : 'Traveler';

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleBack} style={styles.iconBtn} accessibilityLabel="Back">
              <Ionicons name="chevron-back" size={20} color={PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity onPress={handleEdit} style={styles.iconBtn} accessibilityLabel="Edit Profile">
              <Ionicons name="create-outline" size={18} color={PRIMARY} />
              <Text style={styles.editTxt}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Header Card (picture + name + role) */}
          <View style={styles.card}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
              {p.avatarUrl ? (
                <Image source={{ uri: p.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={{ color:'#fff', fontWeight:'800', fontSize:22 }}>
                    {(p.firstName || 'U')[0]}
                  </Text>
                </View>
              )}

              <View style={{ flex:1 }}>
                <Text style={styles.name}>{fullName}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{roleTxt}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact */}
          <Section title="Contact">
            <ReadOnlyRow label="Email" value={p.email || '—'} />
            <ReadOnlyRow label="Phone" value={phoneFmt} />
          </Section>

          {/* Location */}
          <Section title="Location">
            <ReadOnlyRow label="Country" value={p.country || '—'} />
            <ReadOnlyRow label="City"    value={p.city || '—'} />
          </Section>

          {/* Personal */}
          <Section title="Personal">
            <ReadOnlyRow label="First name" value={p.firstName || '—'} />
            <ReadOnlyRow label="Last name"  value={p.lastName || '—'} />
            <ReadOnlyRow label="Bio"        value={p.bio || '—'} multiline />
          </Section>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- small helpers ---------- */
function Section({ title, children }) {
  return (
    <View style={{ marginTop:14 }}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}
function ReadOnlyRow({ label, value, multiline }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.value, multiline && { lineHeight:20 }]} numberOfLines={multiline ? 0 : 1}>
        {value}
      </Text>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  page: { flex:1, backgroundColor: PAGE_BG, ...(Platform.OS === 'web' && { paddingTop:12 }) },
  scroll: { alignItems:'center', paddingHorizontal:12, paddingTop:12 },
  content: { width:'100%', maxWidth: MAX_W, alignSelf:'center' },

  topBar: {
    flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6,
  },
  iconBtn: {
    flexDirection:'row', alignItems:'center', gap:6,
    backgroundColor:'#fff', borderWidth:1, borderColor:BORDER,
    paddingHorizontal:10, paddingVertical:8, borderRadius:10,
  },
  editTxt: { color:PRIMARY, fontWeight:'700', fontSize:13 },

  title: { fontSize:22, fontWeight:'800', color:'#0F172A' },

  sectionHeading: { fontSize:16, fontWeight:'700', color:'#0F172A', marginBottom:8 },
  card: { backgroundColor:CARD_BG, borderRadius:16, padding:14, borderWidth:1, borderColor:BORDER },

  // header card bits
  avatar: { width:72, height:72, borderRadius:36, backgroundColor:'#111827' },
  avatarFallback: { alignItems:'center', justifyContent:'center' },
  name: { fontSize:18, fontWeight:'800', color:'#0F172A' },
  badge: {
    marginTop:6, alignSelf:'flex-start',
    backgroundColor:PILL_BG, borderWidth:1, borderColor:'#DBEAFE',
    borderRadius:999, paddingHorizontal:10, paddingVertical:4,
  },
  badgeText: { color:PRIMARY, fontWeight:'700', fontSize:12 },

  // rows
  row: { flexDirection:'row', alignItems:'flex-start', gap:12, paddingVertical:8 },
  rowLabel: { width:120, color:SUBTEXT, fontWeight:'600', fontSize:12, paddingTop:2 },
  value: { flex:1, color:'#0F172A', fontWeight:'600', fontSize:14 },
});
