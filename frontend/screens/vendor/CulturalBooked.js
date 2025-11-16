// // // // // // screens/vendor/CulturalBooked.js
// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import getBaseURL from '../../config/env';
// // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // // export default function CulturalBooked() {
// // // // //   const [items, setItems] = useState(null);
// // // // //   const load = async () => {
// // // // //     try {
// // // // //       const token = await getAuthToken();
// // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/booked`, { headers:{ Authorization:`Bearer ${token}` }});
// // // // //       const json = await res.json();
// // // // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // // // //       setItems(json||[]);
// // // // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// // // // //   };
// // // // //   useEffect(()=>{ load(); }, []);
// // // // //   if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;
// // // // //   const renderItem = ({ item }) => (
// // // // //     <View style={styles.card}>
// // // // //       <Text style={styles.title}>Confirmed: Service #{item.service_id}</Text>
// // // // //       <Text style={styles.sub}>Participants: {item.participants}{item.chosen_date ? ` • ${item.chosen_date}`:''}</Text>
// // // // //     </View>
// // // // //   );
// // // // //   return (
// // // // //     <View style={{ flex:1, padding:12 }}>
// // // // //       <Text style={styles.h1}>Booked</Text>
// // // // //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// // // // //     </View>
// // // // //   );
// // // // // }
// // // // // const styles = StyleSheet.create({
// // // // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // // // //   title:{ fontWeight:'800', color:'#0f172a' },
// // // // //   sub:{ color:'#6B7280', marginTop:4 },
// // // // // });


// // // // // screens/vendor/CulturalBooked.js
// // // // import React, { useEffect, useState } from 'react';
// // // // import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import getBaseURL from '../../config/env';
// // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // export default function CulturalBooked() {
// // // //   const [items, setItems] = useState(null);
// // // //   const load = async () => {
// // // //     try {
// // // //       const token = await getAuthToken();
// // // //       const res = await fetch(`${API_BASE}/vendor/cultural/booked`, { headers:{ Authorization:`Bearer ${token}` }});
// // // //       const json = await res.json();
// // // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // // //       setItems(json||[]);
// // // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// // // //   };
// // // //   useEffect(()=>{ load(); }, []);
// // // //   if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;
// // // //   const renderItem = ({ item }) => (
// // // //     <View style={styles.card}>
// // // //       <Text style={styles.title}>Confirmed: Service #{item.service_id}</Text>
// // // //       <Text style={styles.sub}>Participants: {item.participants}{item.chosen_date ? ` • ${item.chosen_date}`:''}</Text>
// // // //     </View>
// // // //   );
// // // //   return (
// // // //     <View style={{ flex:1, padding:12 }}>
// // // //       <Text style={styles.h1}>Booked</Text>
// // // //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// // // //     </View>
// // // //   );
// // // // }
// // // // const styles = StyleSheet.create({
// // // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // // //   title:{ fontWeight:'800', color:'#0f172a' },
// // // //   sub:{ color:'#6B7280', marginTop:4 },
// // // // });


// // // import React, { useEffect, useState, useCallback } from 'react';
// // // import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import getBaseURL from '../../config/env';

// // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // export default function CulturalBooked() {
// // //   const [items, setItems] = useState(null);
// // //   const [refreshing, setRefreshing] = useState(false);

// // //   const load = useCallback(async () => {
// // //     try {
// // //       const token = await getAuthToken();
// // //       if (!token) { Alert.alert('Login required', 'Please sign in again.'); setItems([]); return; }
// // //       const res = await fetch(`${API_BASE}/vendor/cultural/booked`, { headers:{ Authorization:`Bearer ${token}` }});
// // //       if (res.status === 401) { Alert.alert('Session expired','Please sign in again.'); setItems([]); return; }
// // //       const json = await res.json().catch(()=>[]);
// // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // //       setItems(json||[]);
// // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); } finally { setRefreshing(false); }
// // //   }, []);

// // //   useEffect(()=>{ load(); }, [load]);

// // //   const onRefresh = () => { setRefreshing(true); load(); };

// // //   if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // //   const renderItem = ({ item }) => (
// // //     <View style={styles.card}>
// // //       <Text style={styles.title}>Confirmed: Service #{item.service_id}</Text>
// // //       <Text style={styles.sub}>
// // //         Participants: {item.participants}
// // //         {item.chosen_date ? ` • ${item.chosen_date}`:''}
// // //       </Text>
// // //     </View>
// // //   );

// // //   return (
// // //     <View style={{ flex:1, padding:12 }}>
// // //       <Text style={styles.h1}>Booked</Text>
// // //       <FlatList
// // //         data={items}
// // //         renderItem={renderItem}
// // //         keyExtractor={it=>String(it.id)}
// // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // //         contentContainerStyle={{ paddingBottom: 24 }}
// // //         ListEmptyComponent={<Text style={{ color:'#64748B', marginTop: 12 }}>No confirmed bookings yet.</Text>}
// // //       />
// // //     </View>
// // //   );
// // // }
// // // const styles = StyleSheet.create({
// // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // //   title:{ fontWeight:'800', color:'#0f172a' },
// // //   sub:{ color:'#6B7280', marginTop:4 },
// // // });








// // // // screens/vendor/CulturalBooked.js
// // // import React, { useEffect, useState, useCallback, useMemo } from 'react';
// // // import {
// // //   View, Text, FlatList, StyleSheet,
// // //   ActivityIndicator, Alert, RefreshControl, TouchableOpacity, Platform
// // // } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import getBaseURL from '../../config/env';

// // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // const BORDER  = '#E6EDF7';
// // // const SHADE   = '#F7FAFF';
// // // const PRIMARY = '#0F3A6B';
// // // const SUB     = '#64748B';
// // // const OK      = '#16A34A';

// // // export default function CulturalBooked() {
// // //   const [items, setItems] = useState(null);
// // //   const [refreshing, setRefreshing] = useState(false);

// // //   const load = useCallback(async () => {
// // //     try {
// // //       const token = await getAuthToken();
// // //       const res = await fetch(`${API_BASE}/vendor/cultural/booked`, {
// // //         headers:{ Authorization:`Bearer ${token}` }
// // //       });
// // //       const json = await res.json().catch(()=>null);
// // //       if(!res.ok) throw new Error(json?.error || 'Failed to load');
// // //       // Ensure array
// // //       setItems(Array.isArray(json) ? json : []);
// // //     } catch(e){
// // //       Alert.alert('Error', e.message || 'Could not load booked items');
// // //       setItems([]);
// // //     } finally {
// // //       setRefreshing(false);
// // //     }
// // //   }, []);

// // //   useEffect(()=>{ load(); }, [load]);

// // //   const onRefresh = () => { setRefreshing(true); load(); };

// // //   const keyExtractor = (it)=> String(it.id);

// // //   const renderItem = ({ item }) => {
// // //     // ----- Safe helpers (work with or without backend joins) -----
// // //     const svc      = item.service || {};
// // //     const user     = item.traveler || item.user || {}; // name/email if available
// // //     const title    = svc.title || `Service #${item.service_id}`;
// // //     const city     = svc.city || null;
// // //     const when     = item.chosen_date || null;
// // //     const people   = item.participants ?? null;
// // //     const priceTxt =
// // //       typeof item.price_snapshot === 'number'
// // //         ? `Rs ${item.price_snapshot.toLocaleString()}`
// // //         : (svc.pricing_model === 'per_person' && svc.price_per_person
// // //             ? `Rs ${svc.price_per_person} / person`
// // //             : (svc.pricing_model === 'per_group' && svc.price_per_group
// // //                 ? `Rs ${svc.price_per_group} / group`
// // //                 : null));

// // //     return (
// // //       <View style={styles.card}>
// // //         <View style={styles.headerRow}>
// // //           <View style={styles.titleRow}>
// // //             <Ionicons name="checkmark-circle" size={18} color={OK} />
// // //             <Text style={styles.titleTxt}>{title}</Text>
// // //           </View>
// // //           <View style={[styles.status, { backgroundColor:'#DCFCE7', borderColor:'#86EFAC' }]}>
// // //             <Text style={[styles.statusTxt, { color:'#14532D'}]}>CONFIRMED</Text>
// // //           </View>
// // //         </View>

// // //         <View style={styles.metaRow}>
// // //           {city ? (
// // //             <View style={styles.pill}>
// // //               <Ionicons name="location-outline" size={14} color={SUB} />
// // //               <Text style={styles.pillTxt}>{city}</Text>
// // //             </View>
// // //           ) : null}
// // //           {when ? (
// // //             <View style={styles.pill}>
// // //               <Ionicons name="calendar-outline" size={14} color={SUB} />
// // //               <Text style={styles.pillTxt}>{when}</Text>
// // //             </View>
// // //           ) : null}
// // //           {people != null ? (
// // //             <View style={styles.pill}>
// // //               <Ionicons name="people-outline" size={14} color={SUB} />
// // //               <Text style={styles.pillTxt}>Participants: {people}</Text>
// // //             </View>
// // //           ) : null}
// // //           {user?.name || user?.full_name ? (
// // //             <View style={styles.pill}>
// // //               <Ionicons name="person-circle-outline" size={14} color={SUB} />
// // //               <Text style={styles.pillTxt}>{user.name || user.full_name}</Text>
// // //             </View>
// // //           ) : null}
// // //         </View>

// // //         {priceTxt ? (
// // //           <View style={styles.priceRow}>
// // //             <Ionicons name="pricetag-outline" size={16} color="#065F46" />
// // //             <Text style={styles.priceTxt}>{priceTxt}</Text>
// // //           </View>
// // //         ) : null}
// // //       </View>
// // //     );
// // //   };

// // //   if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // //   return (
// // //     <View style={{ flex:1, backgroundColor: SHADE, padding: 12 }}>
// // //       <Text style={styles.screenH1}>Bookings</Text>
// // //       <Text style={styles.h2}>Booked</Text>

// // //       <FlatList
// // //         data={items}
// // //         keyExtractor={keyExtractor}
// // //         renderItem={renderItem}
// // //         contentContainerStyle={{ paddingVertical: 6, gap: 10 }}
// // //         refreshControl={
// // //           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
// // //         }
// // //         ListEmptyComponent={
// // //           <View style={{ alignItems:'center', marginTop:24 }}>
// // //             <Ionicons name="calendar-outline" size={36} color={SUB} />
// // //             <Text style={{ color:SUB, marginTop:8, fontWeight:'700' }}>No confirmed bookings yet</Text>
// // //           </View>
// // //         }
// // //       />
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   screenH1: { fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // //   h2: { fontWeight:'800', color:'#0f172a', marginBottom:6 },
// // //   card:{
// // //     backgroundColor:'#fff',
// // //     borderWidth:1,
// // //     borderColor:BORDER,
// // //     borderRadius:14,
// // //     padding:12,
// // //     ...(Platform.OS==='web' ? { boxShadow:'0 4px 12px rgba(15,23,42,.04)' } : { elevation:1 })
// // //   },
// // //   headerRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
// // //   titleRow:{ flexDirection:'row', alignItems:'center', gap:6 },
// // //   titleTxt:{ fontWeight:'800', color:'#0f172a' },
// // //   status:{ borderWidth:1, borderRadius:999, paddingHorizontal:10, paddingVertical:3 },
// // //   statusTxt:{ fontWeight:'900', fontSize:10 },
// // //   metaRow:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:10 },
// // //   pill:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#F1F5F9', borderWidth:1, borderColor:'#E2E8F0', paddingHorizontal:10, paddingVertical:5, borderRadius:999 },
// // //   pillTxt:{ color:SUB, fontWeight:'700', fontSize:12 },
// // //   priceRow:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#ECFDF5', borderColor:'#A7F3D0', borderWidth:1, borderRadius:10, paddingHorizontal:10, paddingVertical:5, alignSelf:'flex-start', marginTop:10 },
// // //   priceTxt:{ color:'#065F46', fontWeight:'800' },
// // // });





// // import React, { useEffect, useState } from 'react';
// // import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import getBaseURL from '../../config/env';

// // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // export default function CulturalBooked() {
// //   const [items, setItems] = useState(null);
// //   const load = async () => {
// //     try {
// //       const token = await getAuthToken();
// //       const res = await fetch(`${API_BASE}/vendor/cultural/booked`, { headers:{ Authorization:`Bearer ${token}` }});
// //       const json = await res.json();
// //       if(!res.ok) throw new Error(json?.error || 'Failed');
// //       setItems(json||[]);
// //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// //   };
// //   useEffect(()=>{ load(); }, []);

// //   if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// //   const renderItem = ({ item }) => {
// //     const title = item?.service?.title || `Service #${item.service_id}`;
// //     const city  = item?.service?.city?.String || item?.service?.city || null;
// //     const date  = item?.chosen_date?.String || item?.chosen_date || '';
// //     const traveler = item?.traveler?.name?.String || item?.traveler?.name || 'Traveler';

// //     return (
// //       <View style={styles.card}>
// //         <Text style={styles.title}>Confirmed — {title}</Text>
// //         <Text style={styles.sub}>
// //           {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
// //         </Text>
// //         <Text style={styles.traveler}>Guest: {traveler}</Text>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={{ flex:1, padding:12 }}>
// //       <Text style={styles.h1}>Booked</Text>
// //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// //     </View>
// //   );
// // }
// // const styles = StyleSheet.create({
// //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// //   title:{ fontWeight:'800', color:'#0f172a' },
// //   sub:{ color:'#6B7280', marginTop:4 },
// //   traveler:{ color:'#0f172a', marginTop:4, fontWeight:'700' },
// // });


// // import React, { useEffect, useState } from 'react';
// // import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useNavigation } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import getBaseURL from '../../config/env';

// // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // export default function CulturalBooked() {
// //   const navigation = useNavigation();
// //   const [items, setItems] = useState(null);

// //   const load = async () => {
// //     try {
// //       const token = await getAuthToken();
// //       const res = await fetch(`${API_BASE}/vendor/cultural/booked`, { headers:{ Authorization:`Bearer ${token}` }});
// //       const json = await res.json();
// //       if(!res.ok) throw new Error(json?.error || 'Failed');
// //       setItems(json||[]);
// //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// //   };
// //   useEffect(()=>{ load(); }, []);

// //   if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// //   const renderItem = ({ item }) => {
// //     const title = item?.service?.title || `Service #${item.service_id}`;
// //     const city  = item?.service?.city?.String || item?.service?.city || null;
// //     const date  = item?.chosen_date?.String || item?.chosen_date || '';
// //     const travelerName = item?.traveler?.name?.String || item?.traveler?.name || 'Traveler';
// //     const travelerEmail = item?.traveler?.email?.String || item?.traveler?.email || null;

// //     return (
// //       <View style={styles.card}>
// //         <Text style={styles.title}>Confirmed — {title}</Text>
// //         <Text style={styles.sub}>
// //           {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
// //         </Text>
        
// //         {/* Contact Info (only visible after confirmation) */}
// //         <View style={styles.contactCard}>
// //           <Text style={styles.contactTitle}>Guest Contact</Text>
// //           <View style={styles.contactRow}>
// //             <Ionicons name="person-outline" size={16} color="#0f172a" />
// //             <Text style={styles.contactText}>{travelerName}</Text>
// //           </View>
// //           {travelerEmail && (
// //             <View style={styles.contactRow}>
// //               <Ionicons name="mail-outline" size={16} color="#0f172a" />
// //               <Text style={styles.contactText}>{travelerEmail}</Text>
// //             </View>
// //           )}
// //           <TouchableOpacity 
// //             style={styles.viewProfileBtn}
// //             onPress={() => navigation.navigate('PublicTravelerProfile', { 
// //               travelerId: item.traveler?.id || item.traveler?.ID 
// //             })}
// //           >
// //             <Text style={styles.viewProfileText}>View full profile</Text>
// //             <Ionicons name="chevron-forward" size={16} color="#6366F1" />
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={{ flex:1, padding:12 }}>
// //       <Text style={styles.h1}>Booked</Text>
// //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// //   title:{ fontWeight:'800', color:'#0f172a' },
// //   sub:{ color:'#6B7280', marginTop:4 },
// //   contactCard: {
// //     marginTop: 10,
// //     backgroundColor: '#F8FAFC',
// //     borderRadius: 10,
// //     padding: 10,
// //     borderWidth: 1,
// //     borderColor: '#E2E8F0',
// //     gap: 6,
// //   },
// //   contactTitle: {
// //     fontWeight: '800',
// //     color: '#0f172a',
// //     marginBottom: 4,
// //   },
// //   contactRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   contactText: {
// //     fontSize: 14,
// //     color: '#0f172a',
// //     fontWeight: '600',
// //   },
// //   viewProfileBtn: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginTop: 6,
// //     paddingVertical: 6,
// //     paddingHorizontal: 8,
// //     backgroundColor: '#EEF2FF',
// //     borderRadius: 6,
// //   },
// //   viewProfileText: {
// //     fontSize: 13,
// //     fontWeight: '800',
// //     color: '#6366F1',
// //   },
// // });




// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';

// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// const safeString = (val) => {
//   if (val == null) return '';
//   if (typeof val === 'string') return val;
//   if (val.String !== undefined) return val.String || '';
//   return String(val);
// };

// export default function CulturalBooked() {
//   const navigation = useNavigation();
//   const [items, setItems] = useState(null);
  
//   const load = async () => {
//     try {
//       const token = await getAuthToken();
//       const res = await fetch(`${API_BASE}/vendor/cultural/booked`, { headers:{ Authorization:`Bearer ${token}` }});
//       const json = await res.json();
//       if(!res.ok) throw new Error(json?.error || 'Failed');
//       setItems(json||[]);
//     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
//   };
  
//   useEffect(()=>{ load(); }, []);

//   const callTraveler = (phone, countryCode) => {
//     const fullNumber = `${countryCode || ''}${phone || ''}`.replace(/\s/g, '');
//     if (fullNumber) {
//       Linking.openURL(`tel:${fullNumber}`);
//     }
//   };

//   const emailTraveler = (email) => {
//     if (email) {
//       Linking.openURL(`mailto:${email}`);
//     }
//   };

//   if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;

//   const renderItem = ({ item }) => {
//     const title = item?.service?.title || `Service #${item.service_id}`;
//     const city  = item?.service?.city?.String || item?.service?.city || null;
//     const date  = item?.chosen_date?.String || item?.chosen_date || '';
//     const travelerName = safeString(item?.traveler?.name);
//     const travelerEmail = safeString(item?.traveler?.email);
//     const travelerPhone = safeString(item?.traveler?.phone);
//     const travelerCountryCode = safeString(item?.traveler?.country_code);
//     const travelerId = item?.traveler?.id || item?.traveler?.ID || item?.user_id;

//     return (
//       <View style={styles.card}>
//         <Text style={styles.title}>Confirmed — {title}</Text>
//         <Text style={styles.sub}>
//           {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
//         </Text>
        
//         {/* Contact Info (only visible after confirmation) */}
//         <View style={styles.contactCard}>
//           <Text style={styles.contactTitle}>Guest Contact</Text>
//           <View style={styles.contactRow}>
//             <Ionicons name="person-outline" size={16} color="#0f172a" />
//             <Text style={styles.contactText}>{travelerName || 'Traveler'}</Text>
//           </View>
//           {travelerEmail && (
//             <TouchableOpacity style={styles.contactRow} onPress={() => emailTraveler(travelerEmail)}>
//               <Ionicons name="mail-outline" size={16} color="#0ea5e9" />
//               <Text style={[styles.contactText, { color: '#0ea5e9' }]}>{travelerEmail}</Text>
//             </TouchableOpacity>
//           )}
//           {travelerPhone && (
//             <TouchableOpacity style={styles.contactRow} onPress={() => callTraveler(travelerPhone, travelerCountryCode)}>
//               <Ionicons name="call-outline" size={16} color="#10B981" />
//               <Text style={[styles.contactText, { color: '#10B981' }]}>
//                 {travelerCountryCode}{travelerPhone}
//               </Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity 
//             style={styles.viewProfileBtn}
//             onPress={() => navigation.navigate('PublicTravelerProfile', { 
//               travelerId,
//               isConfirmed: true,
//               travelerEmail,
//               travelerPhone,
//               travelerCountryCode,
//               travelerName
//             })}
//           >
//             <Text style={styles.viewProfileText}>View full profile</Text>
//             <Ionicons name="chevron-forward" size={16} color="#6366F1" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={{ flex:1, padding:12 }}>
//       <Text style={styles.h1}>Booked</Text>
//       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
//   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
//   title:{ fontWeight:'800', color:'#0f172a' },
//   sub:{ color:'#6B7280', marginTop:4 },
//   contactCard: {
//     marginTop: 10,
//     backgroundColor: '#F0FDF4',
//     borderRadius: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//     gap: 6,
//   },
//   contactTitle: {
//     fontWeight: '800',
//     color: '#065F46',
//     marginBottom: 4,
//   },
//   contactRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   contactText: {
//     fontSize: 14,
//     color: '#0f172a',
//     fontWeight: '600',
//   },
//   viewProfileBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//     backgroundColor: '#EEF2FF',
//     borderRadius: 6,
//   },
//   viewProfileText: {
//     fontSize: 13,
//     fontWeight: '800',
//     color: '#6366F1',
//   },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

const safeString = (val) => {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (val.String !== undefined) return val.String || '';
  return String(val);
};

export default function CulturalBooked() {
  const navigation = useNavigation();
  const [items, setItems] = useState(null);
  
  const load = async () => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/vendor/cultural/booked`, { headers:{ Authorization:`Bearer ${token}` }});
      const json = await res.json();
      if(!res.ok) throw new Error(json?.error || 'Failed');
      setItems(json||[]);
    } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
  };
  
  useEffect(()=>{ load(); }, []);

  const callTraveler = (phone, countryCode) => {
    const fullNumber = `${countryCode || ''}${phone || ''}`.replace(/\s/g, '');
    if (fullNumber) {
      Linking.openURL(`tel:${fullNumber}`);
    }
  };

  const emailTraveler = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;

  const renderItem = ({ item }) => {
    const title = item?.service?.title || `Service #${item.service_id}`;
    const city  = item?.service?.city?.String || item?.service?.city || null;
    const date  = item?.chosen_date?.String || item?.chosen_date || '';
    const travelerName = safeString(item?.traveler?.name);
    const travelerEmail = safeString(item?.traveler?.email);
    const travelerPhone = safeString(item?.traveler?.phone);
    const travelerCountryCode = safeString(item?.traveler?.country_code);
    const travelerId = item?.traveler?.id || item?.traveler?.ID || item?.user_id;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>Confirmed — {title}</Text>
        <Text style={styles.sub}>
          {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
        </Text>
        
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Guest Contact</Text>
          <View style={styles.contactRow}>
            <Ionicons name="person-outline" size={16} color="#0f172a" style={{ marginRight: 8 }}/>
            <Text style={styles.contactText}>{travelerName || 'Traveler'}</Text>
          </View>
          {travelerEmail && (
            <TouchableOpacity style={styles.contactRow} onPress={() => emailTraveler(travelerEmail)}>
              <Ionicons name="mail-outline" size={16} color="#0ea5e9" style={{ marginRight: 8 }}/>
              <Text style={[styles.contactText, { color: '#0ea5e9' }]}>{travelerEmail}</Text>
            </TouchableOpacity>
          )}
          {travelerPhone && (
            <TouchableOpacity style={styles.contactRow} onPress={() => callTraveler(travelerPhone, travelerCountryCode)}>
              <Ionicons name="call-outline" size={16} color="#10B981" style={{ marginRight: 8 }}/>
              <Text style={[styles.contactText, { color: '#10B981' }]}>
                {travelerCountryCode}{travelerPhone}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.viewProfileBtn}
            onPress={() => navigation.navigate('PublicTravelerProfile', { 
              travelerId,
              isConfirmed: true,
              travelerEmail,
              travelerPhone,
              travelerCountryCode,
              travelerName
            })}
          >
            <Text style={styles.viewProfileText}>View full profile</Text>
            <Ionicons name="chevron-forward" size={16} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex:1, padding:12 }}>
      <Text style={styles.h1}>Booked</Text>
      <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
  card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
  title:{ fontWeight:'800', color:'#0f172a' },
  sub:{ color:'#6B7280', marginTop:4 },
  contactCard: {
    marginTop: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  contactTitle: {
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366F1',
  },
});