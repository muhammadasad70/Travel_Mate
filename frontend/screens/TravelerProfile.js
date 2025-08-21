
// import React, { useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// /* ==== Design tokens (Airbnb-ish) ==== */
// const PRIMARY   = '#003366';
// const SUBTEXT   = '#6B7280';
// const PAGE_BG   = '#F7F7F7';   // soft off-white
// const CARD_BG   = '#FFFFFF';   // pure white
// const BORDER    = '#ECEFF3';   // very light border
// const PILL_BG   = '#F0F6FF';
// const SUCCESS   = '#10B981';

// /* Centered column width similar to Airbnb */
// const MAX_W = 720;

// const TravelerProfile = ({ inPage = false }) => {
//   const navigation = useNavigation();

//   /* 2x2 tiles */
//   const quickTiles = useMemo(
//     () => [
//       { key: 'community',   label: 'Community',   icon: 'people-circle-outline',  route: 'CommunityScreen' },
//       { key: 'connections', label: 'Connections', icon: 'people-outline',         route: 'ConnectionsScreen' },
//       { key: 'history',     label: 'History',     icon: 'time-outline',           route: 'TripsScreen' },
//       { key: 'saved',       label: 'Saved',       icon: 'heart-outline',          route: 'SavedScreen' },
//     ],
//     []
//   );

//   const settings = useMemo(
//     () => [
//       { key: 'account',  label: 'Account',         icon: 'settings-outline',    route: 'ManageTravelerProfile' },
//       { key: 'messages', label: 'Messages',        icon: 'chatbubble-outline',  route: 'MessagesScreen' },
//       { key: 'help',     label: 'Help & Support',  icon: 'help-circle-outline', route: 'HelpScreen' },
//       { key: 'logout',   label: 'Logout',          icon: 'log-out-outline',     route: 'Landing Page' },
//     ],
//     []
//   );

//   const go = (route) => route && navigation.navigate(route);
//   const onVendorPress = () => navigation.navigate('Login', { selectedRole: 'vendor' });

//   const Content = (
//     <View style={styles.content}>
//       {/* Title */}
//       <Text style={styles.pageTitle}>Profile</Text>

//       {/* Profile card (no edit) */}
//       <View style={styles.profileCard}>
//         <View style={styles.avatarWrap}>
//           <Text style={styles.avatarText}>M</Text>
//           <View style={styles.verified}>
//             <Ionicons name="checkmark" size={12} color="#fff" />
//           </View>
//         </View>

//         <View style={{ flex: 1 }}>
//           <Text style={styles.name}>Muhammad</Text>
//           <Text style={styles.role}>Traveler</Text>

//           <View style={styles.pillsRow}>
//             <View style={styles.pill}>
//               <Ionicons name="star-outline" size={14} color={PRIMARY} />
//               <Text style={styles.pillText}>4.8 rating</Text>
//             </View>
//             <View style={styles.pill}>
//               <Ionicons name="map-outline" size={14} color={PRIMARY} />
//               <Text style={styles.pillText}>12 trips</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* 2x2 tiles */}
//       <View style={styles.tilesWrap}>
//         {quickTiles.map((t) => (
//           <TouchableOpacity
//             key={t.key}
//             onPress={() => go(t.route)}
//             style={styles.tile}
//             activeOpacity={0.9}
//           >
//             <View style={styles.tileIconCircle}>
//               <Ionicons name={t.icon} size={22} color={PRIMARY} />
//             </View>
//             <Text style={styles.tileLabel}>{t.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Vendor CTA */}
//       <View style={styles.vendorCard}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.vendorTitle}>Become a Vendor</Text>
//           <Text style={styles.vendorDesc}>
//             Earn by offering tours, local expertise, or services.
//           </Text>
//         </View>
//         <TouchableOpacity onPress={onVendorPress} style={styles.vendorBtn} activeOpacity={0.9}>
//           <Ionicons name="briefcase-outline" size={18} color="#fff" />
//           <Text style={styles.vendorBtnText}>Start</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Settings list — clean rows (no per-row shadows, no extra separators) */}
//       <View style={styles.sectionCard}>
//         {settings.map((s) => (
//           <TouchableOpacity
//             key={s.key}
//             style={styles.settingRow}
//             activeOpacity={0.8}
//             onPress={() => go(s.route)}
//           >
//             <View style={styles.settingLeft}>
//               <View style={styles.settingIconWrap}>
//                 <Ionicons name={s.icon} size={18} color={PRIMARY} />
//               </View>
//               <Text style={styles.settingLabel}>{s.label}</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={18} color={SUBTEXT} />
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={{ height: 28 }} />
//     </View>
//   );

//   // In-page mode: avoid nested ScrollView because TravelerDashboard already scrolls
//   if (inPage) {
//     return (
//       <View style={[styles.page, { paddingTop: 0 }]}>
//         <View style={[styles.scroll, { paddingTop: 0 }]}>{Content}</View>
//       </View>
//     );
//   }

//   // Standalone screen mode (if opened directly somewhere else)
//   return (
//     <View style={styles.page}>
//       <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>
//     </View>
//   );
// };

// /* =================== Styles =================== */
// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     backgroundColor: PAGE_BG, // Airbnb-like backdrop
//     ...(Platform.OS === 'web' && { paddingTop: 12 }),
//   },
//   scroll: {
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingTop: 12,
//   },
//   content: {
//     width: '100%',
//     maxWidth: MAX_W,
//     alignSelf: 'center',
//   },

//   /* Title */
//   pageTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#0F172A',
//     marginBottom: 10,
//     letterSpacing: 0.2,
//   },

//   /* Profile header card — white, no heavy shadow */
//   profileCard: {
//     backgroundColor: CARD_BG,
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     // No shadows; subtle border for definition
//     borderWidth: 1,
//     borderColor: BORDER,
//   },
//   avatarWrap: {
//     width: 68, height: 68, borderRadius: 34,
//     backgroundColor: '#111827',
//     alignItems: 'center', justifyContent: 'center',
//     marginRight: 6, position: 'relative',
//   },
//   avatarText: { color: '#fff', fontWeight: '800', fontSize: 28 },
//   verified: {
//     position: 'absolute', right: -2, bottom: -2,
//     width: 20, height: 20, borderRadius: 10,
//     backgroundColor: SUCCESS,
//     alignItems: 'center', justifyContent: 'center',
//     borderWidth: 2, borderColor: CARD_BG,
//   },
//   name: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
//   role: { fontSize: 13, color: SUBTEXT, marginBottom: 8 },

//   pillsRow: { flexDirection: 'row', gap: 8 },
//   pill: {
//     flexDirection: 'row', alignItems: 'center', gap: 6,
//     backgroundColor: PILL_BG, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999,
//   },
//   pillText: { color: PRIMARY, fontWeight: '700', fontSize: 12 },

//   /* 2x2 tiles (white cards, no icon shadows) */
//   tilesWrap: {
//     marginTop: 14,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     rowGap: 12,
//   },
//   tile: {
//     width: '48%',
//     aspectRatio: 2.15,
//     backgroundColor: CARD_BG,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//     borderWidth: 1,
//     borderColor: BORDER,
//     // no shadows at all
//     shadowColor: 'transparent',
//     shadowOpacity: 0,
//     shadowRadius: 0,
//     elevation: 0,
//   },
//   tileIconCircle: {
//     backgroundColor: '#F3F4F6',
//     borderColor: BORDER,
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 28,
//     marginBottom: 8,
//     // absolutely no inner shadow
//     shadowColor: 'transparent',
//     shadowOpacity: 0,
//     shadowRadius: 0,
//     elevation: 0,
//   },
//   tileLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#0F172A',
//     textAlign: 'center',
//   },

//   /* Vendor CTA — white card, subtle border */
//   vendorCard: {
//     marginTop: 16,
//     backgroundColor: CARD_BG,
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     borderWidth: 1,
//     borderColor: BORDER,
//   },
//   vendorTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
//   vendorDesc: { fontSize: 13, color: SUBTEXT },
//   vendorBtn: {
//     backgroundColor: PRIMARY,
//     borderRadius: 999,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   vendorBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

//   /* Settings list — single white block with rounded corners */
//   sectionCard: {
//     marginTop: 16,
//     backgroundColor: CARD_BG,
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: BORDER,
//   },
//   settingRow: {
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: CARD_BG,
//   },
//   settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   settingIconWrap: {
//     width: 30, height: 30, borderRadius: 15,
//     backgroundColor: '#F3F4F6',
//     borderWidth: 1, borderColor: BORDER,
//     alignItems: 'center', justifyContent: 'center',
//     // no shadow
//     shadowColor: 'transparent',
//     shadowOpacity: 0,
//     shadowRadius: 0,
//     elevation: 0,
//   },
//   settingLabel: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
// });

// export default TravelerProfile;




// import React, { useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ScrollView,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// /* ==== Import your JPGs (adjust ../ to ../../ if needed) ==== */
// import communityImg   from '../assets/community.jpg';
// import connectionsImg from '../assets/community.jpg';
// import historyImg     from '../assets/community.jpg';
// import savedImg       from '../assets/community.jpg';

// /* ==== Design tokens (Airbnb-ish) ==== */
// const PRIMARY = '#003366';
// const SUBTEXT = '#6B7280';
// const PAGE_BG = '#F7F7F7';
// const CARD_BG = '#FFFFFF';
// const BORDER  = '#ECEFF3';
// const PILL_BG = '#F0F6FF';
// const SUCCESS = '#10B981';

// /* Centered column width similar to Airbnb */
// const MAX_W = 720;

// const TravelerProfile = ({ inPage = false }) => {
//   const navigation = useNavigation();

//   const quickTiles = useMemo(
//     () => [
//       { key: 'community',   label: 'Community',   image: communityImg,   route: 'CommunityScreen',   fallbackIcon: 'people-circle-outline' },
//       { key: 'connections', label: 'Connections', image: connectionsImg, route: 'ConnectionsScreen', fallbackIcon: 'people-outline' },
//       { key: 'history',     label: 'History',     image: historyImg,     route: 'TripsScreen',       fallbackIcon: 'time-outline' },
//       { key: 'saved',       label: 'Saved',       image: savedImg,       route: 'SavedScreen',       fallbackIcon: 'heart-outline' },
//     ],
//     []
//   );

//   const settings = useMemo(
//     () => [
//       { key: 'account',  label: 'Account',         icon: 'settings-outline',    route: 'ManageTravelerProfile' },
//       { key: 'messages', label: 'Messages',        icon: 'chatbubble-outline',  route: 'MessagesScreen' },
//       { key: 'help',     label: 'Help & Support',  icon: 'help-circle-outline', route: 'HelpScreen' },
//       { key: 'logout',   label: 'Logout',          icon: 'log-out-outline',     route: 'Landing Page' },
//     ],
//     []
//   );

//   const go = (route) => route && navigation.navigate(route);
//   const onVendorPress = () => navigation.navigate('Login', { selectedRole: 'vendor' });

//   const Content = (
//     <View style={styles.content}>
//       <Text style={styles.pageTitle}>Profile</Text>

//       {/* Profile Card */}
//       <View style={styles.profileCard}>
//         <View style={styles.avatarWrap}>
//           <Text style={styles.avatarText}>M</Text>
//           <View style={styles.verified}>
//             <Ionicons name="checkmark" size={12} color="#fff" />
//           </View>
//         </View>

//         <View style={{ flex: 1 }}>
//           <Text style={styles.name}>Muhammad</Text>
//           <Text style={styles.role}>Traveler</Text>

//           <View style={styles.pillsRow}>
//             <View style={styles.pill}>
//               <Ionicons name="star-outline" size={14} color={PRIMARY} />
//               <Text style={styles.pillText}>4.8 rating</Text>
//             </View>
//             <View style={styles.pill}>
//               <Ionicons name="map-outline" size={14} color={PRIMARY} />
//               <Text style={styles.pillText}>12 trips</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Quick Tiles (Airbnb‑like image cards) */}
//       <View style={styles.tilesWrap}>
//         {quickTiles.map((t) => (
//           <TileCard key={t.key} item={t} onPress={() => go(t.route)} />
//         ))}
//       </View>

//       {/* Vendor CTA */}
//       <View style={styles.vendorCard}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.vendorTitle}>Become a Vendor</Text>
//           <Text style={styles.vendorDesc}>
//             Earn by offering tours, local expertise, or services.
//           </Text>
//         </View>
//         <TouchableOpacity onPress={onVendorPress} style={styles.vendorBtn} activeOpacity={0.9}>
//           <Ionicons name="briefcase-outline" size={18} color="#fff" />
//           <Text style={styles.vendorBtnText}>Start</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Settings */}
//       <View style={styles.sectionCard}>
//         {settings.map((s) => (
//           <TouchableOpacity
//             key={s.key}
//             style={styles.settingRow}
//             activeOpacity={0.8}
//             onPress={() => go(s.route)}
//           >
//             <View style={styles.settingLeft}>
//               <Ionicons name={s.icon} size={18} color={PRIMARY} />
//               <Text style={styles.settingLabel}>{s.label}</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={18} color={SUBTEXT} />
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={{ height: 28 }} />
//     </View>
//   );

//   if (inPage) {
//     return (
//       <View style={[styles.page, { paddingTop: 0 }]}>
//         <View style={[styles.scroll, { paddingTop: 0 }]}>{Content}</View>
//       </View>
//     );
//   }
//   return (
//     <View style={styles.page}>
//       <ScrollView contentContainerStyle={styles.scroll}>{Content}</ScrollView>
//     </View>
//   );
// };

// /* ---- TileCard (separate for clarity) ---- */
// const TileCard = ({ item, onPress }) => (
//   <TouchableOpacity style={styles.tileCard} onPress={onPress} activeOpacity={0.9}>
//     <View style={styles.tileImageBox}>
//       {item.image ? (
//         <Image source={item.image} style={styles.tileImage} />
//       ) : (
//         <Ionicons name={item.fallbackIcon} size={28} color={PRIMARY} />
//       )}
//     </View>
//     <Text style={styles.tileTitle}>{item.label}</Text>
//   </TouchableOpacity>
// );

// /* =================== Styles =================== */
// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     backgroundColor: PAGE_BG,
//     ...(Platform.OS === 'web' && { paddingTop: 12 }),
//   },
//   scroll: {
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingTop: 12,
//   },
//   content: { width: '100%', maxWidth: MAX_W, alignSelf: 'center' },

//   pageTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#0F172A',
//     marginBottom: 10,
//   },

//   profileCard: {
//     backgroundColor: CARD_BG,
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     borderWidth: 1,
//     borderColor: BORDER,
//   },
//   avatarWrap: {
//     width: 68, height: 68, borderRadius: 34,
//     backgroundColor: '#111827',
//     alignItems: 'center', justifyContent: 'center',
//     marginRight: 6, position: 'relative',
//   },
//   avatarText: { color: '#fff', fontWeight: '800', fontSize: 28 },
//   verified: {
//     position: 'absolute', right: -2, bottom: -2,
//     width: 20, height: 20, borderRadius: 10,
//     backgroundColor: SUCCESS,
//     alignItems: 'center', justifyContent: 'center',
//     borderWidth: 2, borderColor: CARD_BG,
//   },
//   name: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
//   role: { fontSize: 13, color: SUBTEXT, marginBottom: 8 },

//   pillsRow: { flexDirection: 'row', gap: 8 },
//   pill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: PILL_BG,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 999,
//   },
//   pillText: { color: PRIMARY, fontWeight: '700', fontSize: 12 },

//   /* ---- Tiles ---- */
//   tilesWrap: {
//     marginTop: 14,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     rowGap: 14,
//   },

//   // Airbnb‑like card: no visible border, soft shadow
//   tileCard: {
//     width: '48%',
//     backgroundColor: CARD_BG,
//     borderRadius: 16,
//     padding: 14,
//     alignItems: 'center',
//     borderWidth: 0,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },

//   // Square image with rounded corners; image covers the box
//   tileImageBox: {
//     width: 88,
//     height: 88,
//     borderRadius: 14,
//     overflow: 'hidden',
//     backgroundColor: '#f2f4f7',
//     marginBottom: 15,
//   },
//   tileImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   tileTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#0F172A',
//   },

//   /* ---- Vendor CTA ---- */
//   vendorCard: {
//     marginTop: 16,
//     backgroundColor: CARD_BG,
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     borderWidth: 1,
//     borderColor: BORDER,
//   },
//   vendorTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
//   vendorDesc: { fontSize: 13, color: SUBTEXT },
//   vendorBtn: {
//     backgroundColor: PRIMARY,
//     borderRadius: 999,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   vendorBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

//   /* ---- Settings ---- */
//   sectionCard: {
//     marginTop: 16,
//     backgroundColor: CARD_BG,
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: BORDER,
//   },
//   settingRow: {
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: CARD_BG,
//   },
//   settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   settingLabel: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
// });

// export default TravelerProfile;



///Already working screen 





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
import connectionsImg from '../assets/connection .avif';
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
      <Text style={styles.pageTitle}>Profile</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
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
      </View>

      {/* Quick Tiles (Airbnb‑like: image fills the card top, label below) */}
      <View style={styles.tilesWrap}>
        {quickTiles.map((t) => (
          <TileCard key={t.key} item={t} onPress={() => go(t.route)} />
        ))}
      </View>

      {/* Vendor CTA */}
      <View style={styles.vendorCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.vendorTitle}>Become a Vendor</Text>
          <Text style={styles.vendorDesc}>
            Earn by offering tours, local expertise, or services.
          </Text>
        </View>
        <TouchableOpacity onPress={onVendorPress} style={styles.vendorBtn} activeOpacity={0.9}>
          <Ionicons name="briefcase-outline" size={18} color="#fff" />
          <Text style={styles.vendorBtnText}>Start</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
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
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },

  // Card uses overflow hidden to clip the image corners
  tileCard: {
    width: '48%',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    overflow: 'hidden',
    // subtle shadow (like Airbnb)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  // Image fills the top of the card
  tileImage: {
    width: '100%',
    height: 70,          // tweak 100–130 for taste
    resizeMode: 'cover',
  },
  tileImageFallbackCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f4f7',
  },

  // Label area
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
    marginTop: 16,
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
    marginTop: 16,
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

