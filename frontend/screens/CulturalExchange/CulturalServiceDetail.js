// screens/CulturalExchange/CulturalServiceDetail.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Alert, Platform, Share, StatusBar, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';
import VendorPreviewCard from './VendorPreviewCard';

const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) { const v = await AsyncStorage.getItem(k); if (v) return v; }
  return null;
};

const BORDER  = '#E6EDF7';
const PRIMARY = '#003366';
const SUBTEXT = '#6B7280';

const arrify = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string') {
    return v.split(/[;,]/g).map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const safeString = (v, d='') => (v == null ? d : String(v));
const safeNumber = (v, d=0) => (v == null || isNaN(Number(v)) ? d : Number(v));

const buildShareUrl = (id) => {
  const deep = `travelmate://cultural/services/${id}`;
  const web  = `${API_BASE}/public/cultural/services?id=${id}`;
  return Platform.select({ ios: deep, android: deep, web: web });
};

export default function CulturalServiceDetail() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const id = params?.id;
  const isPublic = !!params?.public;

  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('TravelerDashboard');
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#f7f9fc');
      StatusBar.setBarStyle('dark-content');
    }
  }, []);

  // Fetch the service with vendor preview
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        let url, init = {};
        if (isPublic) {
          const qs = new URLSearchParams({ id: String(id) }).toString();
          url = `${API_BASE}/public/cultural/services?${qs}`;
        } else {
          const token = await getAuthToken();
          if (!token) { Alert.alert('Login required', 'Please sign in again.'); return; }
          url = `${API_BASE}/cultural/services/${id}`;
          init.headers = { Authorization: `Bearer ${token}` };
        }

        const res = await fetch(url, init);
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);

        const raw = Array.isArray(json) ? json[0] : json;
        if (!raw) throw new Error('not found');

        const normalized = {
          ...raw,
          title: safeString(raw.title),
          city: safeString(raw.city),
          experience_type: safeString(raw.experience_type),
          category: safeString(raw.category),
          schedule_type: safeString(raw.schedule_type),
          fixed_dates: arrify(raw.fixed_dates),
          days_of_week: arrify(raw.days_of_week),
          start_time: safeString(raw.start_time),
          duration_hours: safeNumber(raw.duration_hours),
          pricing_model: safeString(raw.pricing_model),
          price_per_person: safeNumber(raw.price_per_person, raw.price_per_group ?? 0),
          price_per_group: safeNumber(raw.price_per_group),
          group_included_size: safeNumber(raw.group_included_size),
          group_size_max: safeNumber(raw.group_size_max),
          languages: arrify(raw.languages),
          includes: arrify(raw.includes),
          excludes: arrify(raw.excludes),
          material_requirements: arrify(raw.material_requirements),
          accessibility_notes: safeString(raw.accessibility_notes),
          meeting_point_label: safeString(raw.meeting_point_label),
          cancellation_policy: safeString(raw.cancellation_policy),
          age_restriction: safeString(raw.age_restriction),
          lead_time_days: safeNumber(raw.lead_time_days),
          user_id: raw.user_id,
          id: raw.id,
          vendor: raw.vendor || null,
        };

        if (!mounted) return;
        setSvc(normalized);

      } catch (e) {
        if (mounted) {
          setSvc(null);
          Alert.alert('Error', e.message || 'Could not load service.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id, isPublic]);

  const priceText = useMemo(() => {
    if (!svc) return '';
    const money = (n) => `Rs ${Number(n || 0).toLocaleString()}`;
    switch (svc.pricing_model) {
      case 'per_person': return `${money(svc.price_per_person)} / person`;
      case 'per_group' : return `${money(svc.price_per_group)} / group${svc.group_included_size ? ` (up to ${svc.group_included_size})` : ''}`;
      case 'free'      : return `Free`;
      case 'exchange'  : return `Exchange`;
      default          : return '';
    }
  }, [svc]);

  const scheduleText = useMemo(() => {
    if (!svc) return '';
    const dur = svc.duration_hours ? `${svc.duration_hours}h` : '';
    switch (svc.schedule_type) {
      case 'fixed_dates'  : return `Fixed dates: ${svc.fixed_dates.join(', ')}${dur ? ` · ${dur}` : ''}`;
      case 'repeat_weekly': return `Weekly: ${svc.days_of_week.join(', ')}${svc.start_time ? ` at ${svc.start_time}` : ''}${dur ? ` · ${dur}` : ''}`;
      case 'on_request'   : return `On request${svc.lead_time_days ? ` · ${svc.lead_time_days}d lead` : ''}${dur ? ` · ${dur}` : ''}`;
      default             : return '';
    }
  }, [svc]);

  const onShare = async () => {
    try {
      await Share.share({ message: `${svc.title} - ${buildShareUrl(svc.id)}` });
    } catch {}
  };

  const openMap = () => {
    if (!svc?.meeting_point_label) return;
    const q = encodeURIComponent(`${svc.meeting_point_label}, ${svc.city}`);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${q}`,
      android: `geo:0,0?q=${q}`,
      default: `https://www.google.com/maps/search/?api=1&query=${q}`
    });
    Linking.openURL(url);
  };

  const onViewVendorProfile = () => {
  if (svc?.vendor?.id) {
    navigation.navigate('PublicHostProfile', { vendorId: svc.vendor.id });
  } else {
    Alert.alert('Coming soon', 'Public vendor profile page');
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Service Details</Text>
        <View style={{ width: 72 }} />
      </View>

      <ScrollView contentContainerStyle={styles.wrap}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: SUBTEXT }}>Loading…</Text>
          </View>
        ) : !svc ? (
          <View style={styles.loading}>
            <Text>Not found</Text>
          </View>
        ) : (
          <>
            <Text style={styles.h1}>{svc.title}</Text>

            {/* Vendor Preview Card */}
            <VendorPreviewCard
              vendor={svc.vendor}
              languages={svc.languages || []}
              onViewProfile={onViewVendorProfile}
            />

            <View style={styles.row}>
              <Ionicons name="location-outline" size={16} color={SUBTEXT} />
              <Text style={styles.sub}>{svc.city}</Text>
            </View>

            {!!svc.meeting_point_label && (
              <TouchableOpacity onPress={openMap} style={styles.row}>
                <Ionicons name="navigate-outline" size={16} color={PRIMARY} />
                <Text style={[styles.sub, { color: PRIMARY, textDecorationLine: 'underline' }]}>
                  {svc.meeting_point_label}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>About</Text>
              {!!svc.category && <Text style={styles.line}>Category: {svc.category}</Text>}
              <Text style={styles.line}>Type: {svc.experience_type}</Text>
              {!!priceText && <Text style={styles.line}>Price: {priceText}</Text>}
              {!!scheduleText && <Text style={styles.line}>{scheduleText}</Text>}
              {!!svc.group_size_max && <Text style={styles.line}>Max group size: {svc.group_size_max}</Text>}
              {!!svc.age_restriction && <Text style={styles.line}>Age: {svc.age_restriction}</Text>}
              {!!svc.cancellation_policy && <Text style={styles.line}>Cancellation: {svc.cancellation_policy}</Text>}
            </View>

            {!!svc.description && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Description</Text>
                <Text style={styles.body}>{svc.description}</Text>
              </View>
            )}

            {(svc.includes?.length || svc.excludes?.length) ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>What's included / not</Text>
                {!!svc.includes?.length && <Text style={styles.body}>Includes: {svc.includes.join(', ')}</Text>}
                {!!svc.excludes?.length && <Text style={styles.body}>Excludes: {svc.excludes.join(', ')}</Text>}
              </View>
            ) : null}

            {!!svc.material_requirements?.length && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Requirements</Text>
                <Text style={styles.body}>{svc.material_requirements.join(', ')}</Text>
              </View>
            )}

            {!!svc.accessibility_notes && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Accessibility</Text>
                <Text style={styles.body}>{svc.accessibility_notes}</Text>
              </View>
            )}

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.btn} onPress={onShare}>
                <Ionicons name="share-social-outline" size={16} color="#fff" />
                <Text style={styles.btnTxt}>Share</Text>
              </TouchableOpacity>
            </View>
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
  h1: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  sub: { color: SUBTEXT, fontWeight: '700' },
  card: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 12,
  },
  cardTitle: { fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  line: { color: '#0f172a', marginBottom: 4 },
  body: { color: '#0f172a' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: PRIMARY, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  btnTxt: { color: '#fff', fontWeight: '800' },
});