
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import Avatar from '../components/avatar';

/* ==== Import your JPGs (adjust ../ to ../../ if needed) ==== */
import communityImg   from '../assets/community_2.jpg';
import connectionsImg from '../assets/connection.avif';
import historyImg     from '../assets/history.jpg';
import savedImg       from '../assets/saved_2.jpg';

/* ==== Design tokens (Airbnb-ish) ==== */
const PRIMARY = '#003366';
const SUBTEXT = '#6B7280';
const PAGE_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';
const BORDER  = '#ECEFF3';
const PILL_BG = '#F0F6FF';
const SUCCESS = '#10B981';
const DANGER  = '#EF4444';

/* Centered column width similar to Airbnb */
const MAX_W = 720;

function getInitials(first = '', last = '') {
  const a = (first || '').trim();
  const b = (last || '').trim();
  const i1 = a ? a[0] : '';
  const i2 = b ? b[0] : '';
  return (i1 + i2 || 'U').toUpperCase();
}

/* ---------- date helpers: handle "YYYY-MM-DD HH:mm:ss+0500" & ISO ---------- */
function normalizeDateInput(d) {
  if (!d) return null;
  if (d instanceof Date) return d;
  if (typeof d === 'number') {
    const ms = d < 1e12 ? d * 1000 : d;
    const dt = new Date(ms);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const s = String(d).trim();
  const withT = s.replace(/^(\d{4}-\d{2}-\d{2})\s+/, '$1T');
  const isoTZ = withT.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  const dt = new Date(isoTZ);
  return isNaN(dt.getTime()) ? null : dt;
}
function formatDatePretty(dLike) {
  const dt = normalizeDateInput(dLike);
  if (!dt) return null;
  try {
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return null;
  }
}

const TravelerProfile = ({ inPage = false }) => {
  const navigation = useNavigation();

  /* ---------- data ---------- */
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState(null);
  const [error, setError]     = useState('');

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

  const quickTiles = useMemo(
    () => [
      { key: 'community',   label: 'Community',   image: communityImg,   route: 'CommunityScreen',   fallbackIcon: 'people-circle-outline' },
      { key: 'connections', label: 'Connections', image: connectionsImg, route: 'ConnectionsScreen', fallbackIcon: 'people-outline' },
      { key: 'history',     label: 'History',     image: historyImg,     route: 'TripsScreen',       fallbackIcon: 'time-outline' },
      { key: 'saved',       label: 'Saved',       image: savedImg,       route: 'SavedScreen',       fallbackIcon: 'heart-outline' },
    ],
    []
  );

  const settings = useMemo(
    () => [
      { key: 'account',  label: 'Account',         icon: 'settings-outline',    route: 'ManageTravelerProfile' },
      { key: 'messages', label: 'Messages',        icon: 'chatbubble-outline',  route: 'MessagesScreen' },
      { key: 'help',     label: 'Help & Support',  icon: 'help-circle-outline', route: 'HelpScreen' },
      { key: 'logout',   label: 'Logout',          icon: 'log-out-outline',     route: 'Landing Page' },
    ],
    []
  );

  const go = (route) => route && navigation.navigate(route);
  const onVendorPress = () => navigation.navigate('Login', { selectedRole: 'vendor' });

  /* ---------- derived from user ---------- */
  const firstName   = user?.first_name ?? user?.firstName;
  const lastName    = user?.last_name ?? user?.lastName;
  const initials    = getInitials(firstName, lastName);
  const fullName    = [firstName, lastName].filter(Boolean).join(' ') || '—';
  const role        = (user?.role || 'traveler').toLowerCase();
  const roleLabel   = role === 'vendor' ? 'Vendor' : 'Traveler';
  const isComplete  = !!user?.is_profile_complete;

  // NEW: member since (created_at or createdAt)
  const memberSinceStr = formatDatePretty(user?.created_at ?? user?.createdAt);

  /* ---------- UI ---------- */
  const HeaderCard = (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => go('TravelerProfileDetailsScreen')}
      accessibilityRole="button"
      accessibilityLabel="Open profile details"
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Avatar
          size={64}
          uri={user?.avatar_url ?? user?.avatarUrl}
          initials={initials}
          email={user?.email}
          ring
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{fullName}</Text>
          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.chipNeutral]}>
              <Text style={styles.chipText}>{roleLabel}</Text>
            </View>
            <View style={[styles.chip, isComplete ? styles.chipNeutral : styles.chipDanger]}>
              <Text style={[styles.chipText, !isComplete && styles.chipTextLight]}>
                {isComplete ? 'Profile Complete' : 'Profile Incomplete'}
              </Text>
            </View>
            {memberSinceStr && (
              <View style={[styles.chip, styles.chipNeutral, styles.chipWithIcon]}>
                <Ionicons name="calendar-outline" size={14} color="#0F172A" />
                <Text style={styles.chipText}>Member since {memberSinceStr}</Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={SUBTEXT} />
      </View>
    </TouchableOpacity>
  );

  const Content = (
    <View style={styles.content}>
      {/* Page heading */}
      <Text style={styles.pageTitle}>About Me</Text>

      {/* Header card */}
      {loading ? (
        <View style={[styles.card, styles.center]}>
          <ActivityIndicator size="small" />
          <Text style={{ marginTop: 8, color: SUBTEXT }}>Loading…</Text>
        </View>
      ) : error ? (
        <View style={[styles.card, styles.bannerDanger]}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      ) : (
        HeaderCard
      )}

      {/* ===== Section: Tiles ===== */}
      <Text style={styles.sectionHeading}>Community & Activity</Text>
      <View style={styles.tilesWrap}>
        {quickTiles.map((t) => (
          <TileCard key={t.key} item={t} onPress={() => go(t.route)} />
        ))}
      </View>

      {/* ===== Section: Vendor ===== */}
      <Text style={styles.sectionHeading}>Become a Vendor</Text>
      <View style={styles.vendorCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.vendorTitle}>Grow with TravelMate</Text>
          <Text style={styles.vendorDesc}>
            Earn by offering tours, local expertise, or services.
          </Text>
        </View>
        <TouchableOpacity onPress={onVendorPress} style={styles.vendorBtn} activeOpacity={0.9}>
          <Ionicons name="briefcase-outline" size={18} color="#fff" />
          <Text style={styles.vendorBtnText}>Start</Text>
        </TouchableOpacity>
      </View>

      {/* ===== Section: Settings ===== */}
      <Text style={styles.sectionHeading}>Account & Support</Text>
      <View style={styles.sectionCard}>
        {settings.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={styles.settingRow}
            activeOpacity={0.8}
            onPress={() => go(s.route)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={s.icon} size={18} color={PRIMARY} />
              <Text style={styles.settingLabel}>{s.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={SUBTEXT} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 28 }} />
    </View>
  );

  if (inPage) {
    return (
      <View style={[styles.page, { paddingTop: 0 }]}>
        <View style={[styles.scroll, { paddingTop: 0 }]}>{Content}</View>
      </View>
    );
  }
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>
    </View>
  );
};

/* ---- TileCard (image fills) ---- */
const TileCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.tileCard} onPress={onPress} activeOpacity={0.9}>
    {item.image ? (
      <Image source={item.image} style={styles.tileImage} />
    ) : (
      <View style={[styles.tileImage, styles.tileImageFallbackCenter]}>
        <Ionicons name={item.fallbackIcon} size={28} color={PRIMARY} />
      </View>
    )}
    <Text style={styles.tileTitle}>{item.label}</Text>
  </TouchableOpacity>
);

/* =================== Styles =================== */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: PAGE_BG,
    ...(Platform.OS === 'web' && { paddingTop: 12 }),
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  content: { width: '100%', maxWidth: MAX_W, alignSelf: 'center' },

  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },

  /* ----- Shared card & header styles (match Profile Detail) ----- */
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },

  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  chip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  chipNeutral: { backgroundColor: '#E5E7EB' },
  chipDanger: { backgroundColor: DANGER },
  chipText: { fontWeight: '700', fontSize: 12, color: '#0F172A' },
  chipTextLight: { color: '#fff' },
  chipWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  bannerDanger: { backgroundColor: DANGER, borderColor: DANGER },
  bannerText: { color: '#fff', fontWeight: '700' },

  center: { alignItems: 'center', justifyContent: 'center' },

  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 2,
  },

  /* ---- Tiles ---- */
  tilesWrap: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  tileCard: {
    width: '48%',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tileImage: {
    width: '100%',
    height: 70,
    resizeMode: 'cover',
  },
  tileImageFallbackCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f4f7',
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: CARD_BG,
  },

  /* ---- Vendor CTA ---- */
  vendorCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  vendorTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  vendorDesc: { fontSize: 13, color: SUBTEXT },
  vendorBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vendorBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  /* ---- Settings ---- */
  sectionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  settingRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingLabel: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
});

export default TravelerProfile;
