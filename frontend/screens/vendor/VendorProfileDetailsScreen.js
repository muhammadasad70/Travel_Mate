import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
import Avatar from '../../components/avatar';

/* ---------- helpers ---------- */
function getInitials(first = '', last = '') {
  const a = (first || '').trim();
  const b = (last || '').trim();
  const i1 = a ? a[0] : '';
  const i2 = b ? b[0] : '';
  return (i1 + i2 || 'U').toUpperCase();
}

function formatPhone(code, phone) {
  if (!code && !phone) return '—';
  const cc = (code || '').replace(/^\+?/, '+');
  return [cc || '', phone || ''].filter(Boolean).join(' ');
}

function normalizeDateInput(d) {
  if (!d) return null;
  if (d instanceof Date) return d;
  if (typeof d === 'number') return new Date(d);
  const s = String(d).trim();
  const withT = s.replace(/^(\d{4}-\d{2}-\d{2})\s+/, '$1T');
  const isoTZ = withT.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  const dt = new Date(isoTZ);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatDatePretty(dLike) {
  const dt = normalizeDateInput(dLike);
  if (!dt) return '—';
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ---------- component ---------- */
export default function ProfileDetailScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // disable native header since we're using custom layout
    });
  }, [navigation]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Not logged in');
        const res = await api.get('/user/profile/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setUser(res?.data || null);
        setError('');
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleEdit = () => {
    navigation.navigate('ManageTravelerProfile');
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              const token = await AsyncStorage.getItem('token');
              await api.delete('/user/delete', {
                headers: { Authorization: `Bearer ${token}` },
              });
              await AsyncStorage.clear();
              navigation.reset({ index: 0, routes: [{ name: 'LandingScreen' }] });
            } catch (e) {
              Alert.alert('Error', e?.response?.data?.error || 'Failed to delete account');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Loading profile…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.page} contentContainerStyle={styles.contentContainer}>
          <View style={[styles.container, styles.maxWidth]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('VendorDashboard')}
              style={styles.backPill}
            >
              <Text style={styles.backPillText}>‹ Back</Text>
            </TouchableOpacity>

            <View style={[styles.banner, styles.bannerDanger]}>
              <Text style={styles.bannerText}>{error || 'Failed to load profile.'}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const firstName = user.first_name ?? user.firstName;
  const lastName = user.last_name ?? user.lastName;
  const countryCode = user.country_code ?? user.countryCode;
  const role = (user.role || 'vendor').toLowerCase();
  const roleLabel = role === 'vendor' ? 'Vendor' : 'Traveler';
  const name = [firstName, lastName].filter(Boolean).join(' ') || '—';
  const initials = getInitials(firstName, lastName);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'web' && { paddingBottom: 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, styles.maxWidth]}>
          
          {/* Back Button */}
          <View style={styles.backBtnWrapper}>
            <TouchableOpacity
              onPress={() => navigation.navigate('VendorDashboard')}
              style={styles.backPill}
            >
              <Text style={styles.backPillText}>‹ Back</Text>
            </TouchableOpacity>
          </View>

          {/* header card */}
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Avatar
                size={64}
                uri={user.avatar_url ?? user.avatarUrl}
                initials={initials}
                email={user.email}
                ring
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.chipsRow}>
                  <View style={[styles.chip, styles.chipNeutral]}>
                    <Text style={styles.chipText}>{roleLabel}</Text>
                  </View>
                  <View
                    style={[
                      styles.chip,
                      user.is_profile_complete ? styles.chipSuccess : styles.chipDanger,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        user.is_profile_complete ? styles.chipTextDark : styles.chipTextLight,
                      ]}
                    >
                      {user.is_profile_complete ? 'Profile Complete' : 'Profile Incomplete'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* contact */}
          <Section title="Contact">
            <Field label="Email" value={user.email || '—'} />
            <Divider />
            <Field label="Phone" value={formatPhone(countryCode, user.phone)} />
          </Section>

          {/* personal */}
          <Section title="Personal">
            <Field label="First name" value={firstName || '—'} />
            <Divider />
            <Field label="Last name" value={lastName || '—'} />
          </Section>

          {/* location */}
          <Section title="Location">
            <Field label="Country" value={user.country || '—'} />
          </Section>

          {/* role */}
          <Section title="Role">
            <Field label="Current role" value={roleLabel} />
            <Divider />
            <Field label="Member since" value={formatDatePretty(user.created_at ?? user.createdAt)} />
          </Section>

          {/* footer actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleEdit}>
              <Text style={[styles.btnText, styles.btnTextLight]}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnDanger]}
              onPress={handleDelete}
              disabled={deleting}
            >
              <Text style={[styles.btnText, styles.btnTextLight]}>
                {deleting ? 'Deleting…' : 'Delete Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- UI bits ---------- */
function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}
function Field({ label, value }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    </View>
  );
}
function Divider() {
  return <View style={styles.divider} />;
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 25 : 0,
  },
  page: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { flexGrow: 1, padding: 16 },
  container: { width: '100%' },
  maxWidth: { maxWidth: 920, alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { marginTop: 8, color: '#6b7280' },

  backBtnWrapper: {
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  backPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backPillText: { fontWeight: '600', color: '#0f172a', fontSize: 16 },

  banner: { padding: 12, borderRadius: 10, marginBottom: 16 },
  bannerDanger: { backgroundColor: '#DC2626' },
  bannerText: { color: 'white', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  chip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  chipNeutral: { backgroundColor: '#e5e7eb' },
  chipSuccess: { backgroundColor: '#e5e7eb' },
  chipDanger: { backgroundColor: '#ef4444' },
  chipText: { fontWeight: '600', fontSize: 12 },
  chipTextDark: { color: '#000' },
  chipTextLight: { color: '#fff' },
  section: { marginTop: 18 },
  sectionTitle: { marginBottom: 8, fontSize: 14, fontWeight: '700', color: '#111827' },
  fieldRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: { color: '#6b7280', fontSize: 13, width: '40%' },
  fieldValue: { color: '#111827', fontWeight: '600', fontSize: 14, width: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#f1f5f9' },
  actionsRow: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: '#0f172a' },
  btnDanger: { backgroundColor: '#DC2626' },
  btnText: { fontWeight: '700' },
  btnTextLight: { color: '#fff' },
});
