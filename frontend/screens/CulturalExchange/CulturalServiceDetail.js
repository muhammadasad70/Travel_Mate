import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

/* ========= Backend Config ========= */
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';
const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};
/* ================================== */

const BORDER  = '#E6EDF7';
const PRIMARY = '#003366';
const SUBTEXT = '#6B7280';

export default function CulturalServiceDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getAuthToken();
        if (!token) { Alert.alert('Login required', 'Please sign in again.'); return; }
        const res = await fetch(`${API_BASE}/cultural/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);
        if (mounted) setSvc(json);
      } catch (e) {
        Alert.alert('Error', e.message || 'Could not load service.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const shareIt = async () => {
    try {
      const url = `${API_BASE.replace(/https?:\/\//,'')}/cultural/services/${id}`; // adjust if you have a public URL
      await Share.share({ message: `${svc?.title}\n${url}` });
    } catch {}
  };

  const priceText = () => {
    if (!svc) return '';
    switch (svc.pricing_model) {
      case 'per_person': return `Rs ${svc.price_per_person} / person`;
      case 'per_group': return `Rs ${svc.price_per_group} / group (up to ${svc.group_included_size})`;
      case 'free': return `Free`;
      case 'exchange':
        return `Exchange: ${svc.host_offers} • Traveler can offer: ${(svc.traveler_can_offer||[]).join(', ')}`;
      default: return '';
    }
  };

  const scheduleText = () => {
    if (!svc) return '';
    switch (svc.schedule_type) {
      case 'fixed_dates': return `Fixed dates: ${(svc.fixed_dates||[]).join(', ')}`;
      case 'repeat_weekly': return `Weekly: ${(svc.days_of_week||[]).join(', ')} at ${svc.start_time} • ${svc.duration_hours}h`;
      case 'on_request': return `On request: Lead time ${svc.lead_time_days} day(s) • ${svc.duration_hours}h`;
      default: return '';
    }
  };

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!svc) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text>Not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backPill} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Service Details</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={shareIt}>
          <Ionicons name="share-social-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* body */}
      <View style={styles.card}>
        <Text style={styles.h1}>{svc.title}</Text>
        <Text style={styles.sub}>{svc.city}</Text>

        <View style={styles.row}>
          <Ionicons name="pricetag-outline" size={16} color={PRIMARY} />
          <Text style={styles.rowText}>{svc.experience_type} • {svc.category || 'General'}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="time-outline" size={16} color={PRIMARY} />
          <Text style={styles.rowText}>{scheduleText()}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="cash-outline" size={16} color="#065F46" />
          <Text style={[styles.rowText, { color:'#065F46' }]}>{priceText()}</Text>
        </View>

        {!!svc.group_size_max && (
          <View style={styles.row}>
            <Ionicons name="people-circle-outline" size={16} color={PRIMARY} />
            <Text style={styles.rowText}>Max group size: {svc.group_size_max}</Text>
          </View>
        )}

        {!!svc.languages?.length && (
          <View style={styles.row}>
            <Ionicons name="chatbubbles-outline" size={16} color={PRIMARY} />
            <Text style={styles.rowText}>Languages: {svc.languages.join(', ')}</Text>
          </View>
        )}

        {!!svc.meeting_point_label && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color={PRIMARY} />
            <Text style={styles.rowText}>Meeting: {svc.meeting_point_label}</Text>
          </View>
        )}

        {!!svc.description && (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.paragraph}>{svc.description}</Text>
          </>
        )}

        {(svc.includes?.length || svc.excludes?.length) ? (
          <>
            <Text style={styles.sectionTitle}>What’s included / not</Text>
            {!!svc.includes?.length && <Text style={styles.paragraph}>Includes: {svc.includes.join(', ')}</Text>}
            {!!svc.excludes?.length && <Text style={styles.paragraph}>Excludes: {svc.excludes.join(', ')}</Text>}
          </>
        ) : null}

        {!!svc.material_requirements?.length && (
          <>
            <Text style={styles.sectionTitle}>Material / Attire</Text>
            <Text style={styles.paragraph}>{svc.material_requirements.join(', ')}</Text>
          </>
        )}

        {!!svc.accessibility_notes && (
          <>
            <Text style={styles.sectionTitle}>Accessibility</Text>
            <Text style={styles.paragraph}>{svc.accessibility_notes}</Text>
          </>
        )}

        <View style={styles.row}>
          <Ionicons name="shield-checkmark-outline" size={16} color={PRIMARY} />
          <Text style={styles.rowText}>Cancellation: {svc.cancellation_policy}</Text>
        </View>

        {!!svc.age_restriction && (
          <View style={styles.row}>
            <Ionicons name="warning-outline" size={16} color={PRIMARY} />
            <Text style={styles.rowText}>Age: {svc.age_restriction}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, paddingBottom: 24 },
  header: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: '#f7f9fc',
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  backPill: {
    flexDirection: 'row', gap: 6, alignItems: 'center',
    backgroundColor: '#fff', borderColor: BORDER, borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  backText: { fontWeight: '800', color: '#0f172a' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: PRIMARY },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },

  card: {
    backgroundColor:'#fff', borderWidth:1, borderColor:BORDER, borderRadius:16, padding:12,
    ...Platform.select({ web:{ boxShadow:'0 6px 16px rgba(0,0,0,0.06)' }, default:{ elevation:1 } }),
  },
  h1: { fontSize:18, fontWeight:'800', color:'#0f172a' },
  sub: { color:SUBTEXT, marginBottom:8 },
  row: { flexDirection:'row', alignItems:'center', gap:8, marginTop:6 },
  rowText: { color:PRIMARY, fontWeight:'700' },

  sectionTitle: { marginTop:12, fontWeight:'800', color:'#0f172a' },
  paragraph: { marginTop:4, color:'#0f172a' },
});
