// // screens/CulturalExchange/CulturalServiceDetail.js
// import React, { useEffect, useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   Share,
//   StatusBar,
//   Linking,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// /* ========= Backend Config ========= */
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';
// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };
// /* ================================== */

// const BORDER  = '#E6EDF7';
// const PRIMARY = '#003366';
// const SUBTEXT = '#6B7280';

// // If you have a public marketing website, set it here.
// // Example: const WEB_BASE = 'https://travelmate.app';
// const WEB_BASE = null;

// /** Build a URL you can share publicly */
// const buildShareUrl = (id) => {
//   if (WEB_BASE) return `${WEB_BASE}/cultural/services/${id}`;
//   // fallback to a deep link to your app, and a plain API URL for web
//   const deep = `travelmate://cultural/services/${id}`;
//   const web  = `${API_BASE}/cultural/services/${id}`;
//   return Platform.select({ ios: deep, android: deep, web: web });
// };

// export default function CulturalServiceDetail() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();
//   const { id } = route.params || {};

//   const [svc, setSvc] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Android status bar styling so the header area looks clean
//   useEffect(() => {
//     if (Platform.OS === 'android') {
//       StatusBar.setBackgroundColor('#f7f9fc');
//       StatusBar.setBarStyle('dark-content');
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const token = await getAuthToken();
//         if (!token) { Alert.alert('Login required', 'Please sign in again.'); return; }
//         const res = await fetch(`${API_BASE}/cultural/services/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const json = await res.json();
//         if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);
//         if (mounted) setSvc(json);
//       } catch (e) {
//         Alert.alert('Error', e.message || 'Could not load service.');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [id]);

//   const priceText = useMemo(() => {
//     if (!svc) return '';
//     const asMoney = (n) =>
//       typeof n === 'number'
//         ? `Rs ${n.toLocaleString()}`
//         : `Rs ${Number(n || 0).toLocaleString()}`;

//     switch (svc.pricing_model) {
//       case 'per_person':
//         return `${asMoney(svc.price_per_person)} / person`;
//       case 'per_group':
//         return `${asMoney(svc.price_per_group)} / group (up to ${svc.group_included_size})`;
//       case 'free':
//         return `Free`;
//       case 'exchange':
//         return `Exchange: ${svc.host_offers} • Traveler can offer: ${(svc.traveler_can_offer||[]).join(', ')}`;
//       default:
//         return '';
//     }
//   }, [svc]);

//   const scheduleText = useMemo(() => {
//     if (!svc) return '';
//     const dur = svc.duration_hours ? `${svc.duration_hours}h` : '';
//     switch (svc.schedule_type) {
//       case 'fixed_dates':
//         return `Fixed dates: ${(svc.fixed_dates||[]).join(', ')}`;
//       case 'repeat_weekly':
//         return `Weekly: ${(svc.days_of_week||[]).join(', ')} at ${svc.start_time}${dur ? ` • ${dur}` : ''}`;
//       case 'on_request':
//         return `On request: Lead time ${svc.lead_time_days} day(s)${dur ? ` • ${dur}` : ''}`;
//       default:
//         return '';
//     }
//   }, [svc]);

//   /* ----- Share helpers ----- */
//   const onShareNative = async () => {
//     try {
//       const url = buildShareUrl(id);
//       await Share.share({
//         message: `${svc?.title ?? 'Cultural Service'}\n${url}`,
//       });
//     } catch {}
//   };

//   const onShareWhatsApp = async () => {
//     try {
//       const url = buildShareUrl(id);
//       const text = encodeURIComponent(`${svc?.title ?? ''}\n${url}`);
//       // WhatsApp deep link
//       const wa = `whatsapp://send?text=${text}`;
//       const canOpen = await Linking.canOpenURL(wa);
//       if (canOpen) return Linking.openURL(wa);
//       // fallback to WA web
//       return Linking.openURL(`https://wa.me/?text=${text}`);
//     } catch {}
//   };

//   const onShareTwitter = async () => {
//     try {
//       const url = buildShareUrl(id);
//       const text = encodeURIComponent(svc?.title ?? '');
//       const link = encodeURIComponent(url);
//       // Twitter/X web intent works everywhere (will open app if present)
//       return Linking.openURL(`https://twitter.com/intent/tweet?text=${text}&url=${link}`);
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safe}>
//         <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
//           <ActivityIndicator />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (!svc) {
//     return (
//       <SafeAreaView style={styles.safe}>
//         <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
//           <Text>Not found</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
//       {/* Header sits below the safe area automatically */}
//       <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 12 : 12 }]}>
//         <TouchableOpacity style={styles.backPill} onPress={() => navigation.goBack()} hitSlop={8}>
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.title} numberOfLines={1}>Service Details</Text>

//         <TouchableOpacity style={styles.primaryBtn} onPress={onShareNative} hitSlop={10}>
//           <Ionicons name="share-social-outline" size={18} color="#fff" />
//           <Text style={styles.primaryBtnText}>Share</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Quick share row */}
//       <View style={styles.quickShareRow}>
//         <Text style={styles.quickShareLabel}>Quick share</Text>
//         <View style={styles.quickShareBtns}>
//           <TouchableOpacity
//             style={[styles.quickBtn, styles.quickBtnWhatsApp]}
//             onPress={onShareWhatsApp}
//             hitSlop={10}
//           >
//             <Ionicons name="logo-whatsapp" size={18} color="#fff" />
//             <Text style={styles.quickBtnText}>WhatsApp</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.quickBtn, styles.quickBtnTwitter]}
//             onPress={onShareTwitter}
//             hitSlop={10}
//           >
//             <Ionicons name="logo-twitter" size={18} color="#fff" />
//             <Text style={styles.quickBtnText}>X</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.wrap}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.card}>
//           <Text style={styles.h1}>{svc.title}</Text>
//           <Text style={styles.sub}>{svc.city}</Text>

//           <View style={styles.row}>
//             <Ionicons name="pricetag-outline" size={16} color={PRIMARY} />
//             <Text style={styles.rowText}>{svc.experience_type} • {svc.category || 'General'}</Text>
//           </View>

//           <View style={styles.row}>
//             <Ionicons name="time-outline" size={16} color={PRIMARY} />
//             <Text style={styles.rowText}>{scheduleText}</Text>
//           </View>

//           <View style={styles.row}>
//             <Ionicons name="cash-outline" size={16} color="#065F46" />
//             <Text style={[styles.rowText, { color:'#065F46' }]}>{priceText}</Text>
//           </View>

//           {!!svc.group_size_max && (
//             <View style={styles.row}>
//               <Ionicons name="people-circle-outline" size={16} color={PRIMARY} />
//               <Text style={styles.rowText}>Max group size: {svc.group_size_max}</Text>
//             </View>
//           )}

//           {!!svc.languages?.length && (
//             <View style={styles.row}>
//               <Ionicons name="chatbubbles-outline" size={16} color={PRIMARY} />
//               <Text style={styles.rowText}>Languages: {svc.languages.join(', ')}</Text>
//             </View>
//           )}

//           {!!svc.meeting_point_label && (
//             <View style={styles.row}>
//               <Ionicons name="location-outline" size={16} color={PRIMARY} />
//               <Text style={styles.rowText}>Meeting: {svc.meeting_point_label}</Text>
//             </View>
//           )}

//           {!!svc.description && (
//             <>
//               <Text style={styles.sectionTitle}>Description</Text>
//               <Text style={styles.paragraph}>{svc.description}</Text>
//             </>
//           )}

//           {(svc.includes?.length || svc.excludes?.length) ? (
//             <>
//               <Text style={styles.sectionTitle}>What’s included / not</Text>
//               {!!svc.includes?.length && <Text style={styles.paragraph}>Includes: {svc.includes.join(', ')}</Text>}
//               {!!svc.excludes?.length && <Text style={styles.paragraph}>Excludes: {svc.excludes.join(', ')}</Text>}
//             </>
//           ) : null}

//           {!!svc.material_requirements?.length && (
//             <>
//               <Text style={styles.sectionTitle}>Material / Attire</Text>
//               <Text style={styles.paragraph}>{svc.material_requirements.join(', ')}</Text>
//             </>
//           )}

//           {!!svc.accessibility_notes && (
//             <>
//               <Text style={styles.sectionTitle}>Accessibility</Text>
//               <Text style={styles.paragraph}>{svc.accessibility_notes}</Text>
//             </>
//           )}

//           <View style={styles.row}>
//             <Ionicons name="shield-checkmark-outline" size={16} color={PRIMARY} />
//             <Text style={styles.rowText}>Cancellation: {svc.cancellation_policy}</Text>
//           </View>

//           {!!svc.age_restriction && (
//             <View style={styles.row}>
//               <Ionicons name="warning-outline" size={16} color={PRIMARY} />
//               <Text style={styles.rowText}>Age: {svc.age_restriction}</Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#f7f9fc' },

//   header: {
//     paddingHorizontal: 30,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER,
//     backgroundColor: '#f7f9fc',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   backPill: {
//     flexDirection: 'row',
//     gap: 6,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   backText: { fontWeight: '800', color: '#0f172a' },
//   title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: PRIMARY },
//   primaryBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: PRIMARY,
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },
//   primaryBtnText: { color: '#fff', fontWeight: '800' },

//   quickShareRow: {
//     paddingHorizontal: 12,
//     paddingTop: 10,
//     paddingBottom: 6,
//     gap: 8,
//   },
//   quickShareLabel: { fontWeight: '800', color: '#0f172a' },
//   quickShareBtns: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   quickBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 999,
//   },
//   quickBtnWhatsApp: { backgroundColor: '#22C55E' },
//   quickBtnTwitter: { backgroundColor: '#1D9BF0' },
//   quickBtnText: { color: '#fff', fontWeight: '800' },

//   wrap: { padding: 12, paddingBottom: 32 },

//   card: {
//     backgroundColor:'#fff',
//     borderWidth:1,
//     borderColor:BORDER,
//     borderRadius:16,
//     padding:12,
//     ...Platform.select({
//       web:{ boxShadow:'0 6px 16px rgba(0,0,0,0.06)' },
//       default:{ elevation:1 }
//     }),
//   },
//   h1: { fontSize:18, fontWeight:'800', color:'#0f172a', lineHeight:22 },
//   sub: { color:SUBTEXT, marginBottom:8 },
//   row: { flexDirection:'row', alignItems:'center', gap:8, marginTop:6, flexWrap:'wrap' },
//   rowText: { color:PRIMARY, fontWeight:'700', lineHeight:20 },

//   sectionTitle: { marginTop:12, fontWeight:'800', color:'#0f172a' },
//   paragraph: { marginTop:4, color:'#0f172a', lineHeight:20 },
// });
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

const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) { const v = await AsyncStorage.getItem(k); if (v) return v; }
  return null;
};

const BORDER  = '#E6EDF7';
const PRIMARY = '#003366';
const SUBTEXT = '#6B7280';

// ---- helpers ---------------------------------------------------------

// turn unknown -> string[]
const arrify = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string') {
    // split CSV-ish and trim
    return v.split(/[;,]/g).map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const safeString = (v, d='') => (v == null ? d : String(v));
const safeNumber = (v, d=0) => (v == null || isNaN(Number(v)) ? d : Number(v));

const buildShareUrl = (id) => {
  // If you have a marketing site, drop it in here
  // return `https://your-site.com/cultural/services/${id}`;
  const deep = `travelmate://cultural/services/${id}`;
  const web  = `${API_BASE}/public/cultural/services?id=${id}`;
  return Platform.select({ ios: deep, android: deep, web: web });
};

// ---------------------------------------------------------------------

export default function CulturalServiceDetail() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const id = params?.id;
  // when opened from traveler list we set public: true
  const isPublic = !!params?.public;

  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#f7f9fc');
      StatusBar.setBarStyle('dark-content');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        // ---- choose the correct endpoint
        let url, init = {};
        if (isPublic) {
          // PUBLIC: /public/cultural/services?id=6  (your server returns a single item or an array)
          const qs = new URLSearchParams({ id: String(id) }).toString();
          url = `${API_BASE}/public/cultural/services?${qs}`;
        } else {
          // PRIVATE: /cultural/services/:id  (requires auth)
          const token = await getAuthToken();
          if (!token) { Alert.alert('Login required', 'Please sign in again.'); return; }
          url = `${API_BASE}/cultural/services/${id}`;
          init.headers = { Authorization: `Bearer ${token}` };
        }

        const res = await fetch(url, init);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(json?.error || `Failed: ${res.status}`);
        }

        // public endpoint might return { ... } or [ { ... } ]
        const raw = Array.isArray(json) ? json[0] : json;
        if (!raw) throw new Error('not found');

        // normalize fields we render as arrays/strings/numbers
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
        };

        if (mounted) setSvc(normalized);
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
      case 'fixed_dates'  : return `Fixed dates: ${svc.fixed_dates.join(', ')}`;
      case 'repeat_weekly': return `Weekly: ${svc.days_of_week.join(', ')}${svc.start_time ? ` at ${svc.start_time}` : ''}${dur ? ` • ${dur}` : ''}`;
      case 'on_request'   : return `On request${svc.lead_time_days ? ` • Lead time ${svc.lead_time_days}d` : ''}${dur ? ` • ${dur}` : ''}`;
      default             : return '';
    }
  }, [svc]);

  const onShareNative = async () => {
    try { await Share.share({ message: `${svc?.title ?? 'Cultural Service'}\n${buildShareUrl(id)}` }); } catch {}
  };
  const onShareWhatsApp = async () => {
    try {
      const text = encodeURIComponent(`${svc?.title ?? ''}\n${buildShareUrl(id)}`);
      const wa = `whatsapp://send?text=${text}`;
      if (await Linking.canOpenURL(wa)) return Linking.openURL(wa);
      return Linking.openURL(`https://wa.me/?text=${text}`);
    } catch {}
  };
  const onShareTwitter = async () => {
    try {
      const text = encodeURIComponent(svc?.title ?? '');
      const link = encodeURIComponent(buildShareUrl(id));
      return Linking.openURL(`https://twitter.com/intent/tweet?text=${text}&url=${link}`);
    } catch {}
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (!svc) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <Text>Not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top','left','right']}>
      <View style={[styles.header, { paddingTop: 12 }]}>
        <TouchableOpacity style={styles.backPill} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>Service Details</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={onShareNative} hitSlop={10}>
          <Ionicons name="share-social-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickShareRow}>
        <Text style={styles.quickShareLabel}>Quick share</Text>
        <View style={styles.quickShareBtns}>
          <TouchableOpacity style={[styles.quickBtn, styles.quickBtnWhatsApp]} onPress={onShareWhatsApp}>
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.quickBtnText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtn, styles.quickBtnTwitter]} onPress={onShareTwitter}>
            <Ionicons name="logo-twitter" size={18} color="#fff" />
            <Text style={styles.quickBtnText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.h1}>{svc.title}</Text>
          <Text style={styles.sub}>{svc.city}</Text>

          <View style={styles.row}>
            <Ionicons name="pricetag-outline" size={16} color={PRIMARY} />
            <Text style={styles.rowText}>{svc.experience_type} • {svc.category || 'General'}</Text>
          </View>

          {!!scheduleText && (
            <View style={styles.row}>
              <Ionicons name="time-outline" size={16} color={PRIMARY} />
              <Text style={styles.rowText}>{scheduleText}</Text>
            </View>
          )}

          {!!priceText && (
            <View style={styles.row}>
              <Ionicons name="cash-outline" size={16} color="#065F46" />
              <Text style={[styles.rowText, { color:'#065F46' }]}>{priceText}</Text>
            </View>
          )}

          {!!svc.group_size_max && (
            <View style={styles.row}>
              <Ionicons name="people-circle-outline" size={16} color={PRIMARY} />
              <Text style={styles.rowText}>Max group size: {svc.group_size_max}</Text>
            </View>
          )}

          {!!svc.languages.length && (
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

          {!!safeString(svc.description) && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.paragraph}>{svc.description}</Text>
            </>
          )}

          {(svc.includes.length || svc.excludes.length) ? (
            <>
              <Text style={styles.sectionTitle}>What’s included / not</Text>
              {!!svc.includes.length && <Text style={styles.paragraph}>Includes: {svc.includes.join(', ')}</Text>}
              {!!svc.excludes.length && <Text style={styles.paragraph}>Excludes: {svc.excludes.join(', ')}</Text>}
            </>
          ) : null}

          {!!svc.material_requirements.length && (
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

          {!!svc.cancellation_policy && (
            <View style={styles.row}>
              <Ionicons name="shield-checkmark-outline" size={16} color={PRIMARY} />
              <Text style={styles.rowText}>Cancellation: {svc.cancellation_policy}</Text>
            </View>
          )}

          {!!svc.age_restriction && (
            <View style={styles.row}>
              <Ionicons name="warning-outline" size={16} color={PRIMARY} />
              <Text style={styles.rowText}>Age: {svc.age_restriction}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fc' },
  header: {
    paddingHorizontal: 30, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: BORDER,
    backgroundColor: '#f7f9fc', flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  backPill: {
    flexDirection: 'row', gap: 6, alignItems: 'center',
    backgroundColor: '#fff', borderColor: BORDER, borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  backText: { fontWeight: '800', color: '#0f172a' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: PRIMARY },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  quickShareRow: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6, gap: 8 },
  quickShareLabel: { fontWeight: '800', color: '#0f172a' },
  quickShareBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999 },
  quickBtnWhatsApp: { backgroundColor: '#22C55E' },
  quickBtnTwitter: { backgroundColor: '#1D9BF0' },
  quickBtnText: { color: '#fff', fontWeight: '800' },
  wrap: { padding: 12, paddingBottom: 32 },
  card: {
    backgroundColor:'#fff', borderWidth:1, borderColor:BORDER, borderRadius:16, padding:12,
    ...Platform.select({ web:{ boxShadow:'0 6px 16px rgba(0,0,0,0.06)' }, default:{ elevation:1 } }),
  },
  h1: { fontSize:18, fontWeight:'800', color:'#0f172a', lineHeight:22 },
  sub: { color:SUBTEXT, marginBottom:8 },
  row: { flexDirection:'row', alignItems:'center', gap:8, marginTop:6, flexWrap:'wrap' },
  rowText: { color:PRIMARY, fontWeight:'700', lineHeight:20 },
  sectionTitle: { marginTop:12, fontWeight:'800', color:'#0f172a' },
  paragraph: { marginTop:4, color:'#0f172a', lineHeight:20 },
});
