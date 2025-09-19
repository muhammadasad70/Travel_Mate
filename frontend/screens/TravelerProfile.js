

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

/* Centered column width similar to Airbnb */
const MAX_W = 720;

const TravelerProfile = ({ inPage = false }) => {
  const navigation = useNavigation();

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

  const Content = (
    <View style={styles.content}>
      {/* Page heading */}
      <Text style={styles.pageTitle}>About Me</Text>

      {/* Profile Card (CLICKABLE) */}
      <TouchableOpacity
        style={styles.profileCard}
        activeOpacity={0.85}
        onPress={() => go('TravelerProfileDetailsScreen')}
        accessibilityRole="button"
        accessibilityLabel="Open profile details and edit"
      >
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>M</Text>
          <View style={styles.verified}>
            <Ionicons name="checkmark" size={12} color="#fff" />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Muhammad</Text>
          <Text style={styles.role}>Traveler</Text>

          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Ionicons name="star-outline" size={14} color={PRIMARY} />
              <Text style={styles.pillText}>4.8 rating</Text>
            </View>
            <View style={styles.pill}>
              <Ionicons name="map-outline" size={14} color={PRIMARY} />
              <Text style={styles.pillText}>12 trips</Text>
            </View>
          </View>
        </View>

        {/* tiny edit chevron on the right for affordance */}
        <Ionicons name="chevron-forward" size={18} color={SUBTEXT} />
      </TouchableOpacity>

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

  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 2,
  },

  profileCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  avatarWrap: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#111827',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 6, position: 'relative',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 28 },
  verified: {
    position: 'absolute', right: -2, bottom: -2,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: SUCCESS,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: CARD_BG,
  },
  name: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  role: { fontSize: 13, color: SUBTEXT, marginBottom: 8 },

  pillsRow: { flexDirection: 'row', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PILL_BG,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  pillText: { color: PRIMARY, fontWeight: '700', fontSize: 12 },

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
