

// // // // screens/CulturalExchange/CulturalServicesExplorerScreen.js
// // // import React, { useCallback, useEffect, useMemo, useState } from 'react';
// // // import {
// // //   View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
// // //   RefreshControl, Platform, Alert,
// // // } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { useNavigation } from '@react-navigation/native';
// // // import getBaseURL from '../../config/env';
// // // import CulturalServiceCard from './CulturalServiceCard';

// // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // const getAuthToken = async () => {
// // //   for (const k of TOKEN_KEYS) { const v = await AsyncStorage.getItem(k); if (v) return v; }
// // //   return null;
// // // };

// // // const Chip = ({ text, selected, onPress }) => (
// // //   <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSel]} activeOpacity={0.85}>
// // //     <Text style={[styles.chipTxt, selected && styles.chipTxtSel]}>{text}</Text>
// // //   </TouchableOpacity>
// // // );

// // // const TYPES = [
// // //   { label: 'All', value: '' },
// // //   { label: 'Workshop', value: 'workshop' },
// // //   { label: 'Walk', value: 'walk' },
// // //   { label: 'Home', value: 'home_experience' },
// // //   { label: 'Exchange', value: 'skill_exchange' },
// // // ];

// // // export default function CulturalServicesExplorerScreen() {
// // //   const navigation = useNavigation();

// // //   const [q, setQ] = useState('');
// // //   const [city, setCity] = useState('');
// // //   const [type, setType] = useState('');
// // //   const [items, setItems] = useState([]);
// // //   const [refreshing, setRefreshing] = useState(false);

// // //   const query = useMemo(() => {
// // //     const params = new URLSearchParams();
// // //     if (q.trim()) params.set('q', q.trim());
// // //     if (city.trim()) params.set('city', city.trim());
// // //     if (type) params.set('type', type);
// // //     return params.toString();
// // //   }, [q, city, type]);

// // //   const fetchList = useCallback(async () => {
// // //     try {
// // //       setRefreshing(true);
// // //       const url = `${API_BASE}/public/cultural/services${query ? `?${query}` : ''}`;

// // //       const token = await getAuthToken().catch(() => null);
// // //       const res = await fetch(url, {
// // //         headers: token ? { Authorization: `Bearer ${token}` } : undefined,
// // //       });
// // //       const json = await res.json();
// // //       if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);

// // //       const mapped = (json || []).map(x => ({
// // //         id: x.id,
// // //         title: x.title,
// // //         city: x.city,
// // //         durationHours: x.duration_hours || 0,
// // //         pricePerPerson: x.price_per_person || x.price_per_group || 0,
// // //         groupSize: x.group_size_max || null,
// // //         rating: x.rating ?? undefined,
// // //         badges: [x.experience_type, x.category].filter(Boolean),
// // //         raw: x,
// // //       }));
// // //       setItems(mapped);
// // //     } catch (e) {
// // //       Alert.alert('Error', e.message || 'Could not load services.');
// // //     } finally {
// // //       setRefreshing(false);
// // //     }
// // //   }, [query]);

// // //   useEffect(() => { fetchList(); }, [fetchList]);

// // //   const onRefresh = () => fetchList();

// // //   const onBook = (svc) => {
// // //     navigation.navigate('ServiceBookingRequest', { id: svc.id });
// // //   };

// // //   const onView = (svc) => {
// // //     navigation.navigate('CulturalServiceDetail', { id: svc.id });
// // //   };

// // //   const renderItem = ({ item }) => (
// // //     <View style={styles.cardWrap}>
// // //       <CulturalServiceCard
// // //         title={item.title}
// // //         city={item.city}
// // //         durationHours={item.durationHours}
// // //         pricePerPerson={item.pricePerPerson}
// // //         groupSize={item.groupSize}
// // //         rating={item.rating}
// // //         badges={item.badges}
// // //         onView={() => onView(item)}
// // //         // vendor-only actions are intentionally omitted here
// // //       />
// // //       <TouchableOpacity style={styles.bookBtn} onPress={() => onBook(item)}>
// // //         <Ionicons name="calendar-outline" size={16} color="#fff" />
// // //         <Text style={styles.bookTxt}>Book</Text>
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   return (
// // //     <View style={styles.root}>
// // //       {/* Filters */}
// // //       <View style={styles.filters}>
// // //         <View style={styles.row}>
// // //           <View style={styles.inputWrap}>
// // //             <Ionicons name="search" size={16} color="#64748B" />
// // //             <TextInput
// // //               value={q}
// // //               onChangeText={setQ}
// // //               placeholder="Search title or tags"
// // //               style={styles.input}
// // //               onSubmitEditing={fetchList}
// // //               returnKeyType="search"
// // //             />
// // //           </View>
// // //           <View style={styles.inputWrap}>
// // //             <Ionicons name="location-outline" size={16} color="#64748B" />
// // //             <TextInput
// // //               value={city}
// // //               onChangeText={setCity}
// // //               placeholder="City"
// // //               style={styles.input}
// // //               onSubmitEditing={fetchList}
// // //               returnKeyType="search"
// // //             />
// // //           </View>
// // //           {/* Quick link to My Bookings */}
// // //           <TouchableOpacity style={styles.myBookingsBtn} onPress={() => navigation.navigate('MyBookings')}>
// // //             <Ionicons name="calendar" size={16} color="#fff" />
// // //             <Text style={styles.applyTxt}>My Bookings</Text>
// // //           </TouchableOpacity>
// // //         </View>

// // //         <View style={styles.chipsRow}>
// // //           {TYPES.map(t => (
// // //             <Chip
// // //               key={t.value || 'all'}
// // //               text={t.label}
// // //               selected={type === t.value}
// // //               onPress={() => setType(prev => (prev === t.value ? '' : t.value))}
// // //             />
// // //           ))}
// // //           <TouchableOpacity style={styles.applyBtn} onPress={fetchList}>
// // //             <Ionicons name="funnel-outline" size={16} color="#fff" />
// // //             <Text style={styles.applyTxt}>Apply</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>

// // //       {/* List */}
// // //       <FlatList
// // //         data={items}
// // //         keyExtractor={(it, i) => String(it?.id ?? i)}
// // //         renderItem={renderItem}
// // //         contentContainerStyle={styles.listContent}
// // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // //         ListEmptyComponent={
// // //           <View style={{ alignItems:'center', padding: 24 }}>
// // //             <Text>No services found.</Text>
// // //           </View>
// // //         }
// // //       />
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   root: { flex: 1, backgroundColor: '#f7f9fc' },
// // //   filters: { paddingHorizontal: 12, paddingTop: 12, gap: 8 },
// // //   row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'stretch' },
// // //   inputWrap: {
// // //     flexDirection: 'row', alignItems: 'center', gap: 6,
// // //     flexGrow: 1, minWidth: 180, backgroundColor: '#fff',
// // //     borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 8,
// // //     ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(15,23,42,.04)' } : { elevation: 1 }),
// // //   },
// // //   input: { flex: 1, paddingVertical: 2 },
// // //   chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
// // //   chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E5E7EB' },
// // //   chipSel: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
// // //   chipTxt: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
// // //   chipTxtSel: { color: '#075985' },
// // //   applyBtn: { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#0ea5e9', paddingVertical:8, paddingHorizontal:12, borderRadius:10 },
// // //   myBookingsBtn: { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#6366f1', paddingVertical:8, paddingHorizontal:12, borderRadius:10 },
// // //   applyTxt: { color:'#fff', fontWeight:'800' },

// // //   listContent: { padding: 12, paddingBottom: 24, gap: 12 },
// // //   cardWrap: { gap: 8 },
// // //   bookBtn: { alignSelf:'flex-end', flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#0ea5e9', paddingVertical:10, paddingHorizontal:12, borderRadius:10 },
// // //   bookTxt: { color:'#fff', fontWeight:'800' },
// // // });

// // import React, { useCallback, useEffect, useMemo, useState } from 'react';
// // import {
// //   View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
// //   RefreshControl, Platform, Alert,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useNavigation } from '@react-navigation/native';
// // import getBaseURL from '../../config/env';
// // import CulturalServiceCard from './CulturalServiceCard';

// // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // const getAuthToken = async () => { for (const k of TOKEN_KEYS) { const v = await AsyncStorage.getItem(k); if (v) return v; } return null; };

// // const Chip = ({ text, selected, onPress }) => (
// //   <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSel]} activeOpacity={0.85}>
// //     <Text style={[styles.chipTxt, selected && styles.chipTxtSel]}>{text}</Text>
// //   </TouchableOpacity>
// // );

// // const TYPES = [
// //   { label: 'All', value: '' },
// //   { label: 'Workshop', value: 'workshop' },
// //   { label: 'Walk', value: 'walk' },
// //   { label: 'Home', value: 'home_experience' },
// //   { label: 'Exchange', value: 'skill_exchange' },
// // ];

// // export default function CulturalServicesExplorerScreen() {
// //   const navigation = useNavigation();

// //   const [q, setQ] = useState('');
// //   const [city, setCity] = useState('');
// //   const [type, setType] = useState('');
// //   const [items, setItems] = useState([]);
// //   const [refreshing, setRefreshing] = useState(false);

// //   const query = useMemo(() => {
// //     const params = new URLSearchParams();
// //     if (q.trim()) params.set('q', q.trim());
// //     if (city.trim()) params.set('city', city.trim());
// //     if (type) params.set('type', type);
// //     return params.toString();
// //   }, [q, city, type]);

// //   const fetchList = useCallback(async () => {
// //     try {
// //       setRefreshing(true);
// //       const url = `${API_BASE}/public/cultural/services${query ? `?${query}` : ''}`;
// //       const token = await getAuthToken().catch(() => null);  // optional
// //       const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
// //       const json = await res.json();
// //       if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);

// //       const mapped = (json || []).map(x => ({
// //         id: x.id,
// //         title: x.title,
// //         city: x.city,
// //         durationHours: x.duration_hours || 0,
// //         pricePerPerson: x.price_per_person || x.price_per_group || 0,
// //         groupSize: x.group_size_max || null,
// //         rating: x.rating ?? undefined,
// //         badges: [x.experience_type, x.category].filter(Boolean),
// //         raw: x,
// //       }));
// //       setItems(mapped);
// //     } catch (e) {
// //       Alert.alert('Error', e.message || 'Could not load services.');
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   }, [query]);

// //   useEffect(() => { fetchList(); }, [fetchList]);

// //   const onRefresh = () => fetchList();

// //   const onBook = (svc) => navigation.navigate('ServiceBookingRequest', { id: svc.id });
// //   const onView = (svc) => navigation.navigate('CulturalServiceDetail', { id: svc.id, public: true });
// //   const goMyBookings = () => navigation.navigate('MyBookings');

// //   const renderItem = ({ item }) => (
// //     <View style={styles.cardWrap}>
// //       <CulturalServiceCard
// //         title={item.title}
// //         city={item.city}
// //         durationHours={item.durationHours}
// //         pricePerPerson={item.pricePerPerson}
// //         groupSize={item.groupSize}
// //         rating={item.rating}
// //         badges={item.badges}
// //         onView={() => onView(item)}
// //         onEdit={undefined}
// //         onShare={() => Alert.alert('Share', 'Wire to your share logic')}
// //         onDelete={undefined}
// //       />
// //       <TouchableOpacity style={styles.bookBtn} onPress={() => onBook(item)}>
// //         <Ionicons name="calendar-outline" size={16} color="#fff" />
// //         <Text style={styles.bookTxt}>Book</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.root}>
// //       {/* Header actions row with "My Bookings" on the right */}
// //       <View style={styles.actionsRow}>
// //         <View style={{ flex: 1 }} />
// //         <TouchableOpacity style={styles.myBtn} onPress={goMyBookings}>
// //           <Ionicons name="receipt-outline" size={16} color="#fff" />
// //           <Text style={styles.myBtnText}>My Bookings</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Filters */}
// //       <View style={styles.filters}>
// //         <View style={styles.row}>
// //           <View style={styles.inputWrap}>
// //             <Ionicons name="search" size={16} color="#64748B" />
// //             <TextInput
// //               value={q}
// //               onChangeText={setQ}
// //               placeholder="Search title or tags"
// //               style={styles.input}
// //               onSubmitEditing={fetchList}
// //               returnKeyType="search"
// //             />
// //           </View>
// //           <View style={styles.inputWrap}>
// //             <Ionicons name="location-outline" size={16} color="#64748B" />
// //             <TextInput
// //               value={city}
// //               onChangeText={setCity}
// //               placeholder="City"
// //               style={styles.input}
// //               onSubmitEditing={fetchList}
// //               returnKeyType="search"
// //             />
// //           </View>
// //         </View>

// //         <View style={styles.chipsRow}>
// //           {TYPES.map(t => (
// //             <Chip
// //               key={t.value || 'all'}
// //               text={t.label}
// //               selected={type === t.value}
// //               onPress={() => setType(prev => (prev === t.value ? '' : t.value))}
// //             />
// //           ))}
// //           <TouchableOpacity style={styles.applyBtn} onPress={fetchList}>
// //             <Ionicons name="funnel-outline" size={16} color="#fff" />
// //             <Text style={styles.applyTxt}>Apply</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>

// //       {/* List */}
// //       <FlatList
// //         data={items}
// //         keyExtractor={(it, i) => String(it?.id ?? i)}
// //         renderItem={renderItem}
// //         contentContainerStyle={styles.listContent}
// //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// //         ListEmptyComponent={
// //           <View style={{ alignItems:'center', padding: 24 }}>
// //             <Text>No services found.</Text>
// //           </View>
// //         }
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: '#f7f9fc' },

// //   /* New header row */
// //   actionsRow: {
// //     paddingHorizontal: 12,
// //     paddingTop: 10,
// //     paddingBottom: 6,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   myBtn: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //     backgroundColor: '#6D28D9', // violet-700
// //     paddingVertical: 10,
// //     paddingHorizontal: 14,
// //     borderRadius: 12,
// //     ...(Platform.OS === 'web' ? { boxShadow: '0 6px 14px rgba(109,40,217,.25)' } : { elevation: 2 }),
// //   },
// //   myBtnText: { color: '#fff', fontWeight: '800' },

// //   filters: { paddingHorizontal: 12, paddingTop: 6, gap: 8 },
// //   row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
// //   inputWrap: {
// //     flexDirection: 'row', alignItems: 'center', gap: 6,
// //     flexGrow: 1, minWidth: 180, backgroundColor: '#fff',
// //     borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 8,
// //     ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(15,23,42,.04)' } : { elevation: 1 }),
// //   },
// //   input: { flex: 1, paddingVertical: 2 },
// //   chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
// //   chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E5E7EB' },
// //   chipSel: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
// //   chipTxt: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
// //   chipTxtSel: { color: '#075985' },
// //   applyBtn: { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#0ea5e9', paddingVertical:8, paddingHorizontal:12, borderRadius:10 },
// //   applyTxt: { color:'#fff', fontWeight:'800' },

// //   listContent: { padding: 12, paddingBottom: 24, gap: 12 },
// //   cardWrap: { gap: 8 },
// //   bookBtn: { alignSelf:'flex-end', flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#0ea5e9', paddingVertical:10, paddingHorizontal:12, borderRadius:10 },
// //   bookTxt: { color:'#fff', fontWeight:'800' },
// // });





// // screens/CulturalExchange/CulturalServicesExplorerScreen.js
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import {
//   View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
//   RefreshControl, Platform, Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import getBaseURL from '../../config/env';
// import CulturalServiceCard from './CulturalServiceCard';

// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// const getAuthToken = async () => { for (const k of TOKEN_KEYS) { const v = await AsyncStorage.getItem(k); if (v) return v; } return null; };

// const Chip = ({ text, selected, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSel]} activeOpacity={0.85}>
//     <Text style={[styles.chipTxt, selected && styles.chipTxtSel]}>{text}</Text>
//   </TouchableOpacity>
// );

// const TYPES = [
//   { label: 'All', value: '' },
//   { label: 'Workshop', value: 'workshop' },
//   { label: 'Walk', value: 'walk' },
//   { label: 'Home', value: 'home_experience' },
//   { label: 'Exchange', value: 'skill_exchange' },
// ];

// export default function CulturalServicesExplorerScreen() {
//   const navigation = useNavigation();

//   const [q, setQ] = useState('');
//   const [city, setCity] = useState('');
//   const [type, setType] = useState('');
//   const [items, setItems] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const query = useMemo(() => {
//     const params = new URLSearchParams();
//     if (q.trim()) params.set('q', q.trim());
//     if (city.trim()) params.set('city', city.trim());
//     if (type) params.set('type', type);
//     return params.toString();
//   }, [q, city, type]);

//   const fetchList = useCallback(async () => {
//     try {
//       setRefreshing(true);
//       const url = `${API_BASE}/public/cultural/services${query ? `?${query}` : ''}`;
//       const token = await getAuthToken().catch(() => null);
//       const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);

//       const mapped = (json || []).map(x => ({
//         id: x.id,
//         title: x.title,
//         city: x.city,
//         durationHours: x.duration_hours || 0,
//         pricePerPerson: x.price_per_person || x.price_per_group || 0,
//         groupSize: x.group_size_max || null,
//         rating: x.rating ?? undefined,
//         badges: [x.experience_type, x.category].filter(Boolean),
//         raw: x,
//       }));
//       setItems(mapped);
//     } catch (e) {
//       Alert.alert('Error', e.message || 'Could not load services.');
//     } finally {
//       setRefreshing(false);
//     }
//   }, [query]);

//   useEffect(() => { fetchList(); }, [fetchList]);

//   const onRefresh = () => fetchList();

//   const onBook = (svc) => navigation.navigate('ServiceBookingRequest', { id: svc.id });
//   const onView = (svc) => navigation.navigate('CulturalServiceDetail', { id: svc.id, public: true });
//   const goMyBookings = () => navigation.navigate('MyBookings');

//   // ✅ Back: prefer stack goBack (returns to ServicesHub instance with its state)
//   const backToHub = () => {
//     if (navigation.canGoBack?.()) navigation.goBack();
//     else navigation.navigate('ServicesHub'); // rare fallback
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.cardWrap}>
//       <CulturalServiceCard
//         title={item.title}
//         city={item.city}
//         durationHours={item.durationHours}
//         pricePerPerson={item.pricePerPerson}
//         groupSize={item.groupSize}
//         rating={item.rating}
//         badges={item.badges}
//         onView={() => onView(item)}
//         onEdit={undefined}
//         onShare={() => Alert.alert('Share', 'Wire to your share logic')}
//         onDelete={undefined}
//       />
//       <TouchableOpacity style={styles.bookBtn} onPress={() => onBook(item)}>
//         <Ionicons name="calendar-outline" size={16} color="#fff" />
//         <Text style={styles.bookTxt}>Book</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.root}>
//       {/* Top bar */}
//       <View style={styles.actionsRow}>
//         <TouchableOpacity style={styles.backPill} onPress={backToHub}>
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backTxt}>Back</Text>
//         </TouchableOpacity>
//         <View style={{ flex: 1 }} />
//         {/* Optional quick entry to bookings:
//         <TouchableOpacity style={styles.myBtn} onPress={goMyBookings}>
//           <Ionicons name="receipt-outline" size={16} color="#fff" />
//           <Text style={styles.myBtnText}>My Bookings</Text>
//         </TouchableOpacity> */}
//       </View>

//       {/* Filters */}
//       <View style={styles.filters}>
//         <View style={styles.row}>
//           <View style={styles.inputWrap}>
//             <Ionicons name="search" size={16} color="#64748B" />
//             <TextInput
//               value={q}
//               onChangeText={setQ}
//               placeholder="Search title or tags"
//               style={styles.input}
//               onSubmitEditing={fetchList}
//               returnKeyType="search"
//             />
//           </View>
//           <View style={styles.inputWrap}>
//             <Ionicons name="location-outline" size={16} color="#64748B" />
//             <TextInput
//               value={city}
//               onChangeText={setCity}
//               placeholder="City"
//               style={styles.input}
//               onSubmitEditing={fetchList}
//               returnKeyType="search"
//             />
//           </View>
//         </View>

//         <View style={styles.chipsRow}>
//           {TYPES.map(t => (
//             <Chip
//               key={t.value || 'all'}
//               text={t.label}
//               selected={type === t.value}
//               onPress={() => setType(prev => (prev === t.value ? '' : t.value))}
//             />
//           ))}
//           <TouchableOpacity style={styles.applyBtn} onPress={fetchList}>
//             <Ionicons name="funnel-outline" size={16} color="#fff" />
//             <Text style={styles.applyTxt}>Apply</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* List */}
//       <FlatList
//         data={items}
//         keyExtractor={(it, i) => String(it?.id ?? i)}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         ListEmptyComponent={
//           <View style={{ alignItems:'center', padding: 24 }}>
//             <Text>No services found.</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#f7f9fc' },

//   actionsRow: {
//     paddingHorizontal: 12,
//     paddingTop: 10,
//     paddingBottom: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#fff',
//     borderColor: '#E5E7EB',
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(15,23,42,.05)' } : { elevation: 1 }),
//   },
//   backTxt: { fontWeight: '800', color: '#0f172a' },

//   myBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#6D28D9',
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     ...(Platform.OS === 'web' ? { boxShadow: '0 6px 14px rgba(109,40,217,.25)' } : { elevation: 2 }),
//   },
//   myBtnText: { color: '#fff', fontWeight: '800' },

//   filters: { paddingHorizontal: 12, paddingTop: 6, gap: 8 },
//   row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
//   inputWrap: {
//     flexDirection: 'row', alignItems: 'center', gap: 6,
//     flexGrow: 1, minWidth: 180, backgroundColor: '#fff',
//     borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 8,
//     ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(15,23,42,.04)' } : { elevation: 1 }),
//   },
//   input: { flex: 1, paddingVertical: 2 },
//   chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
//   chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E5E7EB' },
//   chipSel: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
//   chipTxt: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
//   chipTxtSel: { color: '#075985' },
//   applyBtn: { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#0ea5e9', paddingVertical:8, paddingHorizontal:12, borderRadius:10 },
//   applyTxt: { color:'#fff', fontWeight:'800' },

//   listContent: { padding: 12, paddingBottom: 24, gap: 12 },
//   cardWrap: { gap: 8 },
//   bookBtn: { alignSelf:'flex-end', flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#0ea5e9', paddingVertical:10, paddingHorizontal:12, borderRadius:10 },
//   bookTxt: { color:'#fff', fontWeight:'800' },
// });



// screens/CulturalExchange/CulturalServicesExplorerScreen.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
  RefreshControl, Platform, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import getBaseURL from '../../config/env';
import CulturalServiceCard from './CulturalServiceCard';

const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => { for (const k of TOKEN_KEYS) { const v = await AsyncStorage.getItem(k); if (v) return v; } return null; };

const Chip = ({ text, selected, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSel]} activeOpacity={0.85}>
    <Text style={[styles.chipTxt, selected && styles.chipTxtSel]}>{text}</Text>
  </TouchableOpacity>
);

const TYPES = [
  { label: 'All', value: '' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Walk', value: 'walk' },
  { label: 'Home', value: 'home_experience' },
  { label: 'Exchange', value: 'skill_exchange' },
];

export default function CulturalServicesExplorerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city.trim()) params.set('city', city.trim());
    if (type) params.set('type', type);
    return params.toString();
  }, [q, city, type]);

  const fetchList = useCallback(async () => {
    try {
      setRefreshing(true);
      const url = `${API_BASE}/public/cultural/services${query ? `?${query}` : ''}`;
      const token = await getAuthToken().catch(() => null);
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);

      const mapped = (json || []).map(x => ({
        id: x.id,
        title: x.title,
        city: x.city,
        durationHours: x.duration_hours || 0,
        pricePerPerson: x.price_per_person || x.price_per_group || 0,
        groupSize: x.group_size_max || null,
        rating: x.rating ?? undefined,
        badges: [x.experience_type, x.category].filter(Boolean),
        raw: x,
      }));
      setItems(mapped);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not load services.');
    } finally {
      setRefreshing(false);
    }
  }, [query]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const onRefresh = () => fetchList();

  const onBook = (svc) => navigation.navigate('ServiceBookingRequest', { id: svc.id });
  const onView = (svc) => navigation.navigate('CulturalServiceDetail', { id: svc.id, public: true });
  const goMyBookings = () => navigation.navigate('MyBookings');

  // Back: returns to ServicesHub instance with its state intact
  const backToHub = () => {
    if (navigation.canGoBack?.()) navigation.goBack();
    else navigation.navigate('ServicesHub');
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrap}>
      <CulturalServiceCard
        title={item.title}
        city={item.city}
        durationHours={item.durationHours}
        pricePerPerson={item.pricePerPerson}
        groupSize={item.groupSize}
        rating={item.rating}
        badges={item.badges}
        onView={() => onView(item)}
        onEdit={undefined}
        onShare={() => Alert.alert('Share', 'Wire to your share logic')}
        onDelete={undefined}
      />
      <TouchableOpacity style={[styles.bookBtn, { marginBottom: 4 }]} onPress={() => onBook(item)}>
        <Ionicons name="calendar-outline" size={16} color="#fff" />
        <Text style={styles.bookTxt}>Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Top bar inside the safe area */}
      <View style={[styles.actionsRow, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <TouchableOpacity style={styles.backPill} onPress={backToHub}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        {/* Optional bookings shortcut */}
        {/* <TouchableOpacity style={styles.myBtn} onPress={goMyBookings}>
          <Ionicons name="receipt-outline" size={16} color="#fff" />
          <Text style={styles.myBtnText}>My Bookings</Text>
        </TouchableOpacity> */}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.row}>
          <View style={styles.inputWrap}>
            <Ionicons name="search" size={16} color="#64748B" />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search title or tags"
              style={styles.input}
              onSubmitEditing={fetchList}
              returnKeyType="search"
            />
          </View>
          <View style={styles.inputWrap}>
            <Ionicons name="location-outline" size={16} color="#64748B" />
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              style={styles.input}
              onSubmitEditing={fetchList}
              returnKeyType="search"
            />
          </View>
        </View>

        <View style={styles.chipsRow}>
          {TYPES.map(t => (
            <Chip
              key={t.value || 'all'}
              text={t.label}
              selected={type === t.value}
              onPress={() => setType(prev => (prev === t.value ? '' : t.value))}
            />
          ))}
          <TouchableOpacity style={styles.applyBtn} onPress={fetchList}>
            <Ionicons name="funnel-outline" size={16} color="#fff" />
            <Text style={styles.applyTxt}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(it, i) => String(it?.id ?? i)}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 12,
          paddingBottom: 24 + insets.bottom + 64, // <- keep clear of the device bottom bar & your tab bar
          gap: 12,
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={{ alignItems:'center', padding: 24 }}>
            <Text>No services found.</Text>
          </View>
        }
        // Extra spacer for very short lists (older Androids sometimes ignore only content padding)
        ListFooterComponent={<View style={{ height: insets.bottom + 48 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f7f9fc' },

  actionsRow: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(15,23,42,.05)' } : { elevation: 1 }),
  },
  backTxt: { fontWeight: '800', color: '#0f172a' },

  myBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6D28D9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0 6px 14px rgba(109,40,217,.25)' } : { elevation: 2 }),
  },
  myBtnText: { color: '#fff', fontWeight: '800' },

  filters: { paddingHorizontal: 12, paddingTop: 6, gap: 8 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    flexGrow: 1, minWidth: 180, backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 8,
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(15,23,42,.04)' } : { elevation: 1 }),
  },
  input: { flex: 1, paddingVertical: 2 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E5E7EB' },
  chipSel: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
  chipTxt: { color: '#0f172a', fontWeight: '700', fontSize: 12 },
  chipTxtSel: { color: '#075985' },
  applyBtn: { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#0ea5e9', paddingVertical:8, paddingHorizontal:12, borderRadius:10 },
  applyTxt: { color:'#fff', fontWeight:'800' },

  cardWrap: { gap: 8 },
  bookBtn: {
    alignSelf:'flex-end',
    flexDirection:'row',
    alignItems:'center',
    gap:6,
    backgroundColor:'#0ea5e9',
    paddingVertical:10,
    paddingHorizontal:12,
    borderRadius:10,
  },
  bookTxt: { color:'#fff', fontWeight:'800' },
});
