// // screens/Traveler/MyBookings.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';
// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// const Pill = ({c, t}) => <View style={[styles.pill,{backgroundColor:c.bg,borderColor:c.border}]}><Text style={[styles.pillText,{color:c.text}]}>{t}</Text></View>;
// const COLORS = {
//   pending:{ bg:'#FEF3C7', border:'#FCD34D', text:'#92400E' },
//   confirmed:{ bg:'#DCFCE7', border:'#86EFAC', text:'#065F46' },
//   declined:{ bg:'#FEE2E2', border:'#FCA5A5', text:'#991B1B' },
//   cancelled:{ bg:'#E5E7EB', border:'#CBD5E1', text:'#334155' },
// };

// export default function MyBookings() {
//   const [items, setItems] = useState(null);

//   const load = async () => {
//     try {
//       const token = await getAuthToken(); if(!token){ Alert.alert('Login required'); return; }
//       const res = await fetch(`${API_BASE}/cultural/bookings`, { headers:{ Authorization:`Bearer ${token}` }});
//       const json = await res.json();
//       if(!res.ok) throw new Error(json?.error || 'Failed');
//       setItems(json || []);
//     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
//   };

//   useEffect(()=>{ load(); }, []);

//   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

//   const renderItem = ({ item }) => {
//     const c = COLORS[item.status] || COLORS.pending;
//     return (
//       <View style={styles.card}>
//         <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
//           <Text style={styles.title}>Service #{item.service_id}</Text>
//           <Pill c={c} t={item.status.toUpperCase()} />
//         </View>
//         <Text style={styles.sub}>Participants: {item.participants}{item.chosen_date ? ` • Date ${item.chosen_date}`:''}</Text>
//         {item.price_snapshot != null && <Text style={styles.money}>Rs {Math.round(item.price_snapshot)}</Text>}
//       </View>
//     );
//   };

//   const sections = {
//     pending: items.filter(x=>x.status==='pending'),
//     confirmed: items.filter(x=>x.status==='confirmed'),
//   };

//   return (
//     <View style={{ flex:1, padding:12 }}>
//       <Text style={styles.h1}>My Bookings</Text>
//       <Text style={styles.sec}>Pending</Text>
//       <FlatList data={sections.pending} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
//       <Text style={styles.sec}>Confirmed</Text>
//       <FlatList data={sections.confirmed} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
//   sec:{ marginTop:12, fontWeight:'800', color:'#0f172a' },
//   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
//   title:{ fontWeight:'800', color:'#0f172a' },
//   sub:{ color:'#6B7280', marginTop:4 },
//   money:{ color:'#065F46', fontWeight:'800', marginTop:4 },
//   pill:{ borderWidth:1, borderRadius:999, paddingHorizontal:10, paddingVertical:4 },
//   pillText:{ fontWeight:'800', fontSize:12 },
// });



// // screens/Traveler/MyBookings.js
// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   RefreshControl,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import getBaseURL from '../../config/env';

// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
// const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// const STATUS_COLORS = {
//   pending:   { bg:'#FEF3C7', border:'#FCD34D', text:'#92400E' },
//   confirmed: { bg:'#DCFCE7', border:'#86EFAC', text:'#065F46' },
//   declined:  { bg:'#FEE2E2', border:'#FCA5A5', text:'#991B1B' },
//   cancelled: { bg:'#E5E7EB', border:'#CBD5E1', text:'#334155' },
// };

// const Pill = ({ c, t }) => (
//   <View style={[styles.pill, { backgroundColor: c.bg, borderColor: c.border }]}>
//     <Text style={[styles.pillText, { color: c.text }]}>{t}</Text>
//   </View>
// );

// const FilterChip = ({ label, active, onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     style={[styles.chip, active && styles.chipActive]}
//     activeOpacity={0.85}
//   >
//     <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
//   </TouchableOpacity>
// );

// export default function MyBookings() {
//   const navigation = useNavigation();

//   const [items, setItems] = useState(null);           // null = loading; [] = loaded
//   const [refreshing, setRefreshing] = useState(false);
//   const [tab, setTab] = useState('all');              // all | pending | confirmed

//   const load = useCallback(async () => {
//     try {
//       if (!refreshing) setItems(null);
//       const token = await getAuthToken(); if (!token) { Alert.alert('Login required'); return; }
//       const res = await fetch(`${API_BASE}/cultural/bookings`, { headers: { Authorization: `Bearer ${token}` }});
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.error || 'Failed');
//       setItems(json || []);
//     } catch (e) {
//       Alert.alert('Error', e.message || 'Could not load bookings');
//       setItems([]); // fail gracefully
//     } finally {
//       setRefreshing(false);
//     }
//   }, [refreshing]);

//   useEffect(() => { load(); }, [load]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     load();
//   };

//   const filtered = useMemo(() => {
//     if (!Array.isArray(items)) return [];
//     if (tab === 'all') return items;
//     return items.filter(b => b.status === tab);
//   }, [items, tab]);

//   const counts = useMemo(() => ({
//     all: Array.isArray(items) ? items.length : 0,
//     pending: Array.isArray(items) ? items.filter(x=>x.status==='pending').length : 0,
//     confirmed: Array.isArray(items) ? items.filter(x=>x.status==='confirmed').length : 0,
//   }), [items]);

//   const renderItem = ({ item }) => {
//     const c = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
//     return (
//       <View style={styles.card}>
//         <View style={styles.cardTop}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//             <View style={styles.iconBadge}>
//               <Ionicons name="calendar-outline" size={16} color="#2563EB" />
//             </View>
//             <Text style={styles.title}>Service #{item.service_id}</Text>
//           </View>
//           <Pill c={c} t={item.status.toUpperCase()} />
//         </View>

//         <View style={styles.row}>
//           <Ionicons name="people-outline" size={14} color="#64748B" />
//           <Text style={styles.sub}>Participants: {item.participants}</Text>
//         </View>

//         {item.chosen_date ? (
//           <View style={styles.row}>
//             <Ionicons name="time-outline" size={14} color="#64748B" />
//             <Text style={styles.sub}>Date: {item.chosen_date}</Text>
//           </View>
//         ) : null}

//         {item.price_snapshot != null ? (
//           <View style={[styles.priceRow]}>
//             <Ionicons name="pricetag-outline" size={14} color="#065F46" />
//             <Text style={styles.money}>Rs {Math.round(item.price_snapshot)}</Text>
//           </View>
//         ) : null}
//       </View>
//     );
//   };

//   const Header = () => (
//     <View style={styles.header}>
//       <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//         <Ionicons name="arrow-back" size={18} color="#0f172a" />
//         <Text style={styles.backTxt}>Back</Text>
//       </TouchableOpacity>

//       <View style={{ gap: 2 }}>
//         <Text style={styles.h1}>My Bookings</Text>
//         <Text style={styles.hSub}>
//           {counts.all} total • {counts.pending} pending • {counts.confirmed} confirmed
//         </Text>
//       </View>
//     </View>
//   );

//   const Filters = () => (
//     <View style={styles.filters}>
//       <FilterChip label={`All (${counts.all})`} active={tab==='all'} onPress={() => setTab('all')} />
//       <FilterChip label={`Pending (${counts.pending})`} active={tab==='pending'} onPress={() => setTab('pending')} />
//       <FilterChip label={`Confirmed (${counts.confirmed})`} active={tab==='confirmed'} onPress={() => setTab('confirmed')} />
//     </View>
//   );

//   if (items === null && !refreshing) {
//     return (
//       <View style={styles.screen}>
//         <Header />
//         <Filters />
//         <ActivityIndicator style={{ marginTop: 24 }} />
//       </View>
//     );
//   }

//   const Empty = () => (
//     <View style={styles.emptyWrap}>
//       <View style={styles.emptyIcon}>
//         <Ionicons name="calendar-clear-outline" size={22} color="#64748B" />
//       </View>
//       <Text style={styles.emptyTitle}>No {tab === 'all' ? '' : `${tab} `}bookings yet</Text>
//       <Text style={styles.emptySub}>Discover cultural experiences and request a booking to get started.</Text>
//       <TouchableOpacity
//         style={styles.cta}
//         onPress={() => navigation.navigate('TravelerDashboard', { tabKey: 'services' })}
//       >
//         <Ionicons name="sparkles-outline" size={16} color="#fff" />
//         <Text style={styles.ctaTxt}>Explore Services</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.screen}>
//       <Header />
//       <Filters />

//       <FlatList
//         data={filtered}
//         keyExtractor={it => String(it.id)}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24, gap: 10, flexGrow: 1 }}
//         ListEmptyComponent={<Empty />}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#F5F7FB',
//     paddingTop: Platform.OS === 'web' ? 90 : 0, // room for any fixed headers on web
//   },

//   /* Header */
//   header: {
//     paddingHorizontal: 12,
//     paddingTop: 12,
//     paddingBottom: 4,
//     gap: 8,
//   },
//   backBtn: {
//     alignSelf: 'flex-start',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     backgroundColor: '#E2E8F0',
//     borderRadius: 999,
//   },
//   backTxt: { fontWeight: '800', color: '#0f172a', fontSize: 12 },
//   h1: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
//   hSub: { color: '#64748B', fontWeight: '600' },

//   /* Filters */
//   filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, marginTop: 8, marginBottom: 6, flexWrap: 'wrap' },
//   chip: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     backgroundColor: '#F1F5F9',
//   },
//   chipActive: { backgroundColor: '#E0E7FF', borderColor: '#A5B4FC' },
//   chipText: { fontWeight: '800', color: '#0f172a', fontSize: 12 },
//   chipTextActive: { color: '#3730A3' },

//   /* Card */
//   card: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E6EDF7',
//     borderRadius: 16,
//     padding: 12,
//     ...(Platform.OS === 'web'
//       ? { boxShadow: '0 6px 18px rgba(15,23,42,.06)' }
//       : { elevation: 2 }),
//   },
//   cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   iconBadge: {
//     backgroundColor: '#EEF2FF',
//     borderColor: '#E0E7FF',
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 6,
//   },
//   title: { fontWeight: '800', color: '#0f172a' },
//   row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
//   sub: { color: '#6B7280', fontWeight: '600' },
//   priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: '#ECFDF5', borderColor: '#D1FAE5', borderWidth: 1, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, alignSelf: 'flex-start' },
//   money: { color: '#065F46', fontWeight: '800' },

//   /* Status pill */
//   pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
//   pillText: { fontWeight: '800', fontSize: 11 },

//   /* Empty state */
//   emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 10 },
//   emptyIcon: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 999 },
//   emptyTitle: { fontWeight: '800', color: '#0f172a', fontSize: 16 },
//   emptySub: { color: '#6B7280', textAlign: 'center' },
//   cta: { marginTop: 6, backgroundColor: '#0ea5e9', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
//   ctaTxt: { color: '#fff', fontWeight: '800' },
// });





import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import getBaseURL from "../../config/env";

const API = getBaseURL();

export default function MyBookings() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState(null);
  const [tab, setTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API}/cultural/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      console.error(e);
      setBookings([]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    if (!bookings) return [];
    if (tab === "all") return bookings;
    return bookings.filter((b) => b.status === tab);
  }, [tab, bookings]);

  const counts = useMemo(() => ({
    all: bookings?.length || 0,
    pending: bookings?.filter((b) => b.status === "pending").length || 0,
    confirmed: bookings?.filter((b) => b.status === "confirmed").length || 0,
  }), [bookings]);

  const renderItem = ({ item, index }) => {
    const fadeAnim = new Animated.Value(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500 + index * 150, useNativeDriver: true }).start();

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="briefcase-outline" size={18} color="#0F3A6B" />
            <Text style={styles.cardTitle}>Service #{item.service_id}</Text>
          </View>
          <View style={[
              styles.statusTag,
              item.status === "confirmed" && styles.statusConfirmed,
              item.status === "pending" && styles.statusPending,
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={15} color="#64748B" />
          <Text style={styles.infoText}>Participants: {item.participants}</Text>
        </View>

        {item.price_snapshot && (
          <View style={styles.priceBox}>
            <Ionicons name="pricetag-outline" size={16} color="#047857" />
            <Text style={styles.price}>Rs {item.price_snapshot}</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#E0EAFC", "#CFDEF3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#0F3A6B" />
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>My Bookings</Text>
        <Text style={styles.subHeading}>
          {counts.all} total • {counts.pending} pending • {counts.confirmed} confirmed
        </Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setTab("all")}
            style={[styles.tab, tab === "all" && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>
              All ({counts.all})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("pending")}
            style={[styles.tab, tab === "pending" && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === "pending" && styles.tabTextActive]}>
              Pending ({counts.pending})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("confirmed")}
            style={[styles.tab, tab === "confirmed" && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === "confirmed" && styles.tabTextActive]}>
              Confirmed ({counts.confirmed})
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {!bookings ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBookings} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={36} color="#64748B" />
              <Text style={styles.emptyText}>No bookings yet</Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate("TravelerDashboard")}
              >
                <Ionicons name="compass-outline" size={16} color="#fff" />
                <Text style={styles.exploreTxt}>Explore Services</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerGradient: { paddingTop: 80, paddingHorizontal: 18, paddingBottom: 28 },
  heading: { fontSize: 22, fontWeight: "800", color: "#032246ff", marginBottom: 4 },
  subHeading: { color: "#475569", fontWeight: "600" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 10,  
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    transform: [{ translateY: -10 }],
  },
  backTxt: { fontWeight: "700", color: "#0F3A6B" },

  tabs: { flexDirection: "row", gap: 8, marginTop: 12 },
  tab: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabActive: { backgroundColor: "#0F3A6B" },
  tabText: { fontWeight: "700", color: "#334155" },
  tabTextActive: { color: "#fff" },

  listContainer: { padding: 16, paddingBottom: 100, gap: 12 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTitle: { fontWeight: "800", color: "#0F3A6B" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  infoText: { color: "#475569", fontWeight: "600" },
  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  price: { color: "#047857", fontWeight: "800" },
  statusTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderColor: "#CBD5E1",
    backgroundColor: "#F1F5F9",
  },
  statusConfirmed: { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" },
  statusPending: { backgroundColor: "#FEF9C3", borderColor: "#FACC15" },
  statusText: { fontWeight: "800", fontSize: 11, color: "#334155" },

  empty: { alignItems: "center", justifyContent: "center", marginTop: 60, gap: 10 },
  emptyText: { fontSize: 16, fontWeight: "700", color: "#475569" },
  exploreBtn: {
    backgroundColor: "#0F3A6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  exploreTxt: { color: "#fff", fontWeight: "700" },
});
