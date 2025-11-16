// // // // // // // // // screens/vendor/CulturalRequests.js
// // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // // import getBaseURL from '../../config/env';
// // // // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // // // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // // // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // // // // // export default function CulturalRequests() {
// // // // // // // //   const [items, setItems] = useState(null);

// // // // // // // //   const load = async () => {
// // // // // // // //     try {
// // // // // // // //       const token = await getAuthToken();
// // // // // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// // // // // // // //       const json = await res.json();
// // // // // // // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // // // // // // //       setItems(json || []);
// // // // // // // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// // // // // // // //   };
// // // // // // // //   useEffect(()=>{ load(); }, []);

// // // // // // // //   const act = async (id, action) => {
// // // // // // // //     try {
// // // // // // // //       const token = await getAuthToken();
// // // // // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// // // // // // // //         method:'PATCH',
// // // // // // // //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// // // // // // // //         body: JSON.stringify({ action }),
// // // // // // // //       });
// // // // // // // //       if(!res.ok){ const t=await res.text(); throw new Error(t||'Failed'); }
// // // // // // // //       load();
// // // // // // // //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// // // // // // // //   };

// // // // // // // //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // // // // // // //   const renderItem = ({ item }) => (
// // // // // // // //     <View style={styles.card}>
// // // // // // // //       <Text style={styles.title}>Request for Service #{item.service_id}</Text>
// // // // // // // //       <Text style={styles.sub}>Participants: {item.participants}{item.chosen_date ? ` • ${item.chosen_date}`:''}</Text>
// // // // // // // //       <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
// // // // // // // //         <TouchableOpacity style={[styles.btn,{ backgroundColor:'#22C55E' }]} onPress={()=>act(item.id,'confirm')}>
// // // // // // // //           <Ionicons name="checkmark" size={16} color="#fff"/><Text style={styles.btnText}>Confirm</Text>
// // // // // // // //         </TouchableOpacity>
// // // // // // // //         <TouchableOpacity style={[styles.btn,{ backgroundColor:'#EF4444' }]} onPress={()=>act(item.id,'decline')}>
// // // // // // // //           <Ionicons name="close" size={16} color="#fff"/><Text style={styles.btnText}>Decline</Text>
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //     </View>
// // // // // // // //   );

// // // // // // // //   return (
// // // // // // // //     <View style={{ flex:1, padding:12 }}>
// // // // // // // //       <Text style={styles.h1}>Incoming Requests</Text>
// // // // // // // //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // }
// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // // // // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // // // // // // //   title:{ fontWeight:'800', color:'#0f172a' },
// // // // // // // //   sub:{ color:'#6B7280', marginTop:4 },
// // // // // // // //   btn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// // // // // // // //   btnText:{ color:'#fff', fontWeight:'800' },
// // // // // // // // });



// // // // // // // // screens/vendor/CulturalRequests.js
// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // import getBaseURL from '../../config/env';
// // // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // // // // export default function CulturalRequests() {
// // // // // // //   const [items, setItems] = useState(null);

// // // // // // //   const load = async () => {
// // // // // // //     try {
// // // // // // //       const token = await getAuthToken();
// // // // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// // // // // // //       const json = await res.json();
// // // // // // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // // // // // //       setItems(json || []);
// // // // // // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// // // // // // //   };
// // // // // // //   useEffect(()=>{ load(); }, []);

// // // // // // //   const act = async (id, action) => {
// // // // // // //     try {
// // // // // // //       const token = await getAuthToken();
// // // // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// // // // // // //         method:'PATCH',
// // // // // // //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// // // // // // //         body: JSON.stringify({ action }),
// // // // // // //       });
// // // // // // //       if(!res.ok){ const t=await res.text(); throw new Error(t||'Failed'); }
// // // // // // //       load();
// // // // // // //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// // // // // // //   };

// // // // // // //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // // // // // //   const renderItem = ({ item }) => (
// // // // // // //     <View style={styles.card}>
// // // // // // //       <Text style={styles.title}>Request for Service #{item.service_id}</Text>
// // // // // // //       <Text style={styles.sub}>Participants: {item.participants}{item.chosen_date ? ` • ${item.chosen_date}`:''}</Text>
// // // // // // //       <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
// // // // // // //         <TouchableOpacity style={[styles.btn,{ backgroundColor:'#22C55E' }]} onPress={()=>act(item.id,'confirm')}>
// // // // // // //           <Ionicons name="checkmark" size={16} color="#fff"/><Text style={styles.btnText}>Confirm</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //         <TouchableOpacity style={[styles.btn,{ backgroundColor:'#EF4444' }]} onPress={()=>act(item.id,'decline')}>
// // // // // // //           <Ionicons name="close" size={16} color="#fff"/><Text style={styles.btnText}>Decline</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <View style={{ flex:1, padding:12 }}>
// // // // // // //       <Text style={styles.h1}>Incoming Requests</Text>
// // // // // // //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // }
// // // // // // // const styles = StyleSheet.create({
// // // // // // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // // // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // // // // // //   title:{ fontWeight:'800', color:'#0f172a' },
// // // // // // //   sub:{ color:'#6B7280', marginTop:4 },
// // // // // // //   btn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// // // // // // //   btnText:{ color:'#fff', fontWeight:'800' },
// // // // // // // });


// // // // // // import React, { useEffect, useState, useCallback } from 'react';
// // // // // // import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
// // // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // import getBaseURL from '../../config/env';

// // // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // // // export default function CulturalRequests() {
// // // // // //   const [items, setItems] = useState(null);
// // // // // //   const [refreshing, setRefreshing] = useState(false);

// // // // // //   const load = useCallback(async () => {
// // // // // //     try {
// // // // // //       const token = await getAuthToken();
// // // // // //       if (!token) { Alert.alert('Login required', 'Please sign in again.'); setItems([]); return; }
// // // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// // // // // //       if (res.status === 401) { Alert.alert('Session expired','Please sign in again.'); setItems([]); return; }
// // // // // //       const json = await res.json().catch(()=>[]);
// // // // // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // // // // //       setItems(json || []);
// // // // // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); } finally { setRefreshing(false); }
// // // // // //   }, []);

// // // // // //   useEffect(()=>{ load(); }, [load]);

// // // // // //   const act = async (id, action) => {
// // // // // //     try {
// // // // // //       const token = await getAuthToken();
// // // // // //       if (!token) { Alert.alert('Login required', 'Please sign in again.'); return; }
// // // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// // // // // //         method:'PATCH',
// // // // // //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// // // // // //         body: JSON.stringify({ action }),
// // // // // //       });
// // // // // //       if (res.status === 401) { Alert.alert('Session expired','Please sign in again.'); return; }
// // // // // //       if(!res.ok){
// // // // // //         const t=await res.text().catch(()=>null);
// // // // // //         throw new Error(t || 'Failed');
// // // // // //       }
// // // // // //       // quick feedback
// // // // // //       Alert.alert('Updated', action === 'confirm' ? 'Request confirmed.' : 'Request declined.');
// // // // // //       load();
// // // // // //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// // // // // //   };

// // // // // //   const onRefresh = () => { setRefreshing(true); load(); };

// // // // // //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // // // // //   const renderItem = ({ item }) => (
// // // // // //     <View style={styles.card}>
// // // // // //       <Text style={styles.title}>Request for Service #{item.service_id}</Text>
// // // // // //       <Text style={styles.sub}>
// // // // // //         Participants: {item.participants}
// // // // // //         {item.chosen_date ? ` • ${item.chosen_date}`:''}
// // // // // //       </Text>
// // // // // //       {!!item.message && <Text style={[styles.sub, { marginTop: 4 }]} numberOfLines={3}>“{item.message}”</Text>}
// // // // // //       <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
// // // // // //         <TouchableOpacity style={[styles.btn,{ backgroundColor:'#22C55E' }]} onPress={()=>act(item.id,'confirm')}>
// // // // // //           <Ionicons name="checkmark" size={16} color="#fff"/><Text style={styles.btnText}>Confirm</Text>
// // // // // //         </TouchableOpacity>
// // // // // //         <TouchableOpacity style={[styles.btn,{ backgroundColor:'#EF4444' }]} onPress={()=>act(item.id,'decline')}>
// // // // // //           <Ionicons name="close" size={16} color="#fff"/><Text style={styles.btnText}>Decline</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );

// // // // // //   return (
// // // // // //     <View style={{ flex:1, padding:12 }}>
// // // // // //       <Text style={styles.h1}>Incoming Requests</Text>
// // // // // //       <FlatList
// // // // // //         data={items}
// // // // // //         renderItem={renderItem}
// // // // // //         keyExtractor={it=>String(it.id)}
// // // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // // //         contentContainerStyle={{ paddingBottom: 24 }}
// // // // // //         ListEmptyComponent={<Text style={{ color:'#64748B', marginTop: 12 }}>No pending requests.</Text>}
// // // // // //       />
// // // // // //     </View>
// // // // // //   );
// // // // // // }
// // // // // // const styles = StyleSheet.create({
// // // // // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // // // // //   title:{ fontWeight:'800', color:'#0f172a' },
// // // // // //   sub:{ color:'#6B7280', marginTop:4 },
// // // // // //   btn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// // // // // //   btnText:{ color:'#fff', fontWeight:'800' },
// // // // // // });



// // // // // // screens/vendor/CulturalRequests.js
// // // // // import React, { useEffect, useState, useCallback } from 'react';
// // // // // import {
// // // // //   View, Text, FlatList, StyleSheet, TouchableOpacity,
// // // // //   Alert, ActivityIndicator, RefreshControl, Platform
// // // // // } from 'react-native';
// // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import getBaseURL from '../../config/env';

// // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // // const BORDER  = '#E6EDF7';
// // // // // const SHADE   = '#F7FAFF';
// // // // // const PRIMARY = '#0F3A6B';
// // // // // const SUB     = '#64748B';
// // // // // const OK      = '#22C55E';
// // // // // const DANGER  = '#EF4444';

// // // // // export default function CulturalRequests() {
// // // // //   const [items, setItems] = useState(null);
// // // // //   const [refreshing, setRefreshing] = useState(false);

// // // // //   const load = useCallback(async () => {
// // // // //     try {
// // // // //       const token = await getAuthToken();
// // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// // // // //       const json = await res.json().catch(()=>null);
// // // // //       if(!res.ok) throw new Error(json?.error || 'Failed to load requests');
// // // // //       setItems(Array.isArray(json) ? json : []);
// // // // //     } catch(e){
// // // // //       Alert.alert('Error', e.message || 'Could not load');
// // // // //       setItems([]);
// // // // //     } finally { setRefreshing(false); }
// // // // //   }, []);

// // // // //   useEffect(()=>{ load(); }, [load]);

// // // // //   const onRefresh = () => { setRefreshing(true); load(); };

// // // // //   const act = async (id, action) => {
// // // // //     try {
// // // // //       const token = await getAuthToken();
// // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// // // // //         method:'PATCH',
// // // // //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// // // // //         body: JSON.stringify({ action }),
// // // // //       });
// // // // //       if(!res.ok){ const t=await res.text(); throw new Error(t||'Failed'); }
// // // // //       load();
// // // // //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// // // // //   };

// // // // //   const renderItem = ({ item }) => {
// // // // //     const svc    = item.service || {};
// // // // //     const user   = item.traveler || item.user || {};
// // // // //     const title  = svc.title || `Service #${item.service_id}`;
// // // // //     const city   = svc.city || null;
// // // // //     const when   = item.chosen_date || null;
// // // // //     const people = item.participants ?? null;

// // // // //     return (
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.headerRow}>
// // // // //           <View style={styles.titleRow}>
// // // // //             <Ionicons name="time-outline" size={18} color={PRIMARY} />
// // // // //             <Text style={styles.titleTxt}>{title}</Text>
// // // // //           </View>
// // // // //           <View style={[styles.status, { backgroundColor:'#FEF9C3', borderColor:'#FACC15' }]}>
// // // // //             <Text style={[styles.statusTxt, { color:'#92400E'}]}>PENDING</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         <View style={styles.metaRow}>
// // // // //           {city ? (
// // // // //             <View style={styles.pill}>
// // // // //               <Ionicons name="location-outline" size={14} color={SUB} />
// // // // //               <Text style={styles.pillTxt}>{city}</Text>
// // // // //             </View>
// // // // //           ) : null}
// // // // //           {when ? (
// // // // //             <View style={styles.pill}>
// // // // //               <Ionicons name="calendar-outline" size={14} color={SUB} />
// // // // //               <Text style={styles.pillTxt}>{when}</Text>
// // // // //             </View>
// // // // //           ) : null}
// // // // //           {people != null ? (
// // // // //             <View style={styles.pill}>
// // // // //               <Ionicons name="people-outline" size={14} color={SUB} />
// // // // //               <Text style={styles.pillTxt}>Participants: {people}</Text>
// // // // //             </View>
// // // // //           ) : null}
// // // // //           {user?.name || user?.full_name ? (
// // // // //             <View style={styles.pill}>
// // // // //               <Ionicons name="person-circle-outline" size={14} color={SUB} />
// // // // //               <Text style={styles.pillTxt}>{user.name || user.full_name}</Text>
// // // // //             </View>
// // // // //           ) : null}
// // // // //         </View>

// // // // //         <View style={styles.actionsRow}>
// // // // //           <TouchableOpacity style={[styles.btn, { backgroundColor: OK }]} onPress={()=>act(item.id,'confirm')}>
// // // // //             <Ionicons name="checkmark" size={16} color="#fff"/><Text style={styles.btnTxt}>Confirm</Text>
// // // // //           </TouchableOpacity>
// // // // //           <TouchableOpacity style={[styles.btn, { backgroundColor: DANGER }]} onPress={()=>act(item.id,'decline')}>
// // // // //             <Ionicons name="close" size={16} color="#fff"/><Text style={styles.btnTxt}>Decline</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // // // //   return (
// // // // //     <View style={{ flex:1, backgroundColor: SHADE, padding:12 }}>
// // // // //       <Text style={styles.screenH1}>Requests</Text>
// // // // //       <Text style={styles.h2}>Incoming Requests</Text>

// // // // //       <FlatList
// // // // //         data={items}
// // // // //         keyExtractor={(it)=>String(it.id)}
// // // // //         renderItem={renderItem}
// // // // //         contentContainerStyle={{ paddingVertical: 6, gap: 10 }}
// // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // //         ListEmptyComponent={
// // // // //           <View style={{ alignItems:'center', marginTop:24 }}>
// // // // //             <Ionicons name="mail-unread-outline" size={36} color={SUB} />
// // // // //             <Text style={{ color:SUB, marginTop:8, fontWeight:'700' }}>No pending requests</Text>
// // // // //           </View>
// // // // //         }
// // // // //       />
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   screenH1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // // //   h2:{ fontWeight:'800', color:'#0f172a', marginBottom:6 },
// // // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:BORDER, borderRadius:14, padding:12, ...(Platform.OS==='web' ? { boxShadow:'0 4px 12px rgba(15,23,42,.04)'} : { elevation:1 }) },
// // // // //   headerRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
// // // // //   titleRow:{ flexDirection:'row', alignItems:'center', gap:6 },
// // // // //   titleTxt:{ fontWeight:'800', color:'#0f172a' },
// // // // //   status:{ borderWidth:1, borderRadius:999, paddingHorizontal:10, paddingVertical:3 },
// // // // //   statusTxt:{ fontWeight:'900', fontSize:10 },
// // // // //   metaRow:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:10 },
// // // // //   pill:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#F1F5F9', borderWidth:1, borderColor:'#E2E8F0', paddingHorizontal:10, paddingVertical:5, borderRadius:999 },
// // // // //   pillTxt:{ color:SUB, fontWeight:'700', fontSize:12 },
// // // // //   actionsRow:{ flexDirection:'row', gap:8, marginTop:10 },
// // // // //   btn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// // // // //   btnTxt:{ color:'#fff', fontWeight:'800' },
// // // // // });



// // // // // // screens/vendor/CulturalRequests.js
// // // // // import React, { useEffect, useState, useCallback } from 'react';
// // // // // import {
// // // // //   View, Text, FlatList, StyleSheet, TouchableOpacity,
// // // // //   Alert, ActivityIndicator, RefreshControl, Platform
// // // // // } from 'react-native';
// // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import getBaseURL from '../../config/env';

// // // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // // const BORDER  = '#E6EDF7';
// // // // // const SHADE   = '#F7FAFF';
// // // // // const PRIMARY = '#0F3A6B';
// // // // // const SUB     = '#64748B';
// // // // // const OK      = '#22C55E';
// // // // // const DANGER  = '#EF4444';

// // // // // export default function CulturalRequests() {
// // // // //   const [items, setItems] = useState(null);
// // // // //   const [refreshing, setRefreshing] = useState(false);

// // // // //   const load = useCallback(async () => {
// // // // //     try {
// // // // //       const token = await getAuthToken();
// // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// // // // //       const json = await res.json().catch(()=>null);
// // // // //       if(!res.ok) throw new Error(json?.error || 'Failed to load requests');
// // // // //       setItems(Array.isArray(json) ? json : []);
// // // // //     } catch(e){
// // // // //       Alert.alert('Error', e.message || 'Could not load');
// // // // //       setItems([]);
// // // // //     } finally { setRefreshing(false); }
// // // // //   }, []);

// // // // //   useEffect(()=>{ load(); }, [load]);

// // // // //   const onRefresh = () => { setRefreshing(true); load(); };

// // // // //   const act = async (id, action) => {
// // // // //     try {
// // // // //       const token = await getAuthToken();
// // // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// // // // //         method:'PATCH',
// // // // //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// // // // //         body: JSON.stringify({ action }),
// // // // //       });
// // // // //       if(!res.ok){ const t=await res.text(); throw new Error(t||'Failed'); }
// // // // //       load();
// // // // //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// // // // //   };

// // // // //   const renderItem = ({ item }) => {
// // // // //     const svc    = item.service || {};
// // // // //     const user   = item.traveler || item.user || {};
// // // // //     const title  = svc.title || `Service #${item.service_id}`;
// // // // //     const city   = svc.city || null;
// // // // //     const when   = item.chosen_date || null;
// // // // //     const people = item.participants ?? null;

// // // // //     return (
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.headerRow}>
// // // // //           <View style={styles.titleRow}>
// // // // //             <Ionicons name="time-outline" size={18} color={PRIMARY} />
// // // // //             <Text style={styles.titleTxt}>{title}</Text>
// // // // //           </View>
// // // // //           <View style={[styles.status, { backgroundColor:'#FEF9C3', borderColor:'#FACC15' }]}>
// // // // //             <Text style={[styles.statusTxt, { color:'#92400E'}]}>PENDING</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         <View style={styles.metaRow}>
// // // // //           {city ? (
// // // // //             <View style={styles.pill}>
// // // // //               <Ionicons name="location-outline" size={14} color={SUB} />
// // // // //               <Text style={styles.pillTxt}>{city}</Text>
// // // // //             </View>
// // // // //           ) : null}
// // // // //           {when ? (
// // // // //             <View style={styles.pill}>
// // // // //               <Ionicons name="calendar-outline" size={14} color={SUB} />
// // // // //               <Text style={styles.pillTxt}>{when}</Text>
// // // // //             </View>
// // // // //           ) : null}
// // // // //           {people != null ? (
// // // // //             <View style={styles.pill}>
// // // // //               <Ionicons name="people-outline" size={14} color={SUB} />
// // // // //               <Text style={styles.pillTxt}>Participants: {people}</Text>
// // // // //             </View>
// // // // //           ) : null}
// // // // //           {user?.name || user?.full_name ? (
// // // // //             <View style={styles.pill}>
// // // // //               <Ionicons name="person-circle-outline" size={14} color={SUB} />
// // // // //               <Text style={styles.pillTxt}>{user.name || user.full_name}</Text>
// // // // //             </View>
// // // // //           ) : null}
// // // // //         </View>

// // // // //         <View style={styles.actionsRow}>
// // // // //           <TouchableOpacity style={[styles.btn, { backgroundColor: OK }]} onPress={()=>act(item.id,'confirm')}>
// // // // //             <Ionicons name="checkmark" size={16} color="#fff"/><Text style={styles.btnTxt}>Confirm</Text>
// // // // //           </TouchableOpacity>
// // // // //           <TouchableOpacity style={[styles.btn, { backgroundColor: DANGER }]} onPress={()=>act(item.id,'decline')}>
// // // // //             <Ionicons name="close" size={16} color="#fff"/><Text style={styles.btnTxt}>Decline</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // // // //   return (
// // // // //     <View style={{ flex:1, backgroundColor: SHADE, padding:12 }}>
// // // // //       <Text style={styles.screenH1}>Requests</Text>
// // // // //       <Text style={styles.h2}>Incoming Requests</Text>

// // // // //       <FlatList
// // // // //         data={items}
// // // // //         keyExtractor={(it)=>String(it.id)}
// // // // //         renderItem={renderItem}
// // // // //         contentContainerStyle={{ paddingVertical: 6, gap: 10 }}
// // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // //         ListEmptyComponent={
// // // // //           <View style={{ alignItems:'center', marginTop:24 }}>
// // // // //             <Ionicons name="mail-unread-outline" size={36} color={SUB} />
// // // // //             <Text style={{ color:SUB, marginTop:8, fontWeight:'700' }}>No pending requests</Text>
// // // // //           </View>
// // // // //         }
// // // // //       />
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   screenH1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // // //   h2:{ fontWeight:'800', color:'#0f172a', marginBottom:6 },
// // // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:BORDER, borderRadius:14, padding:12, ...(Platform.OS==='web' ? { boxShadow:'0 4px 12px rgba(15,23,42,.04)'} : { elevation:1 }) },
// // // // //   headerRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
// // // // //   titleRow:{ flexDirection:'row', alignItems:'center', gap:6 },
// // // // //   titleTxt:{ fontWeight:'800', color:'#0f172a' },
// // // // //   status:{ borderWidth:1, borderRadius:999, paddingHorizontal:10, paddingVertical:3 },
// // // // //   statusTxt:{ fontWeight:'900', fontSize:10 },
// // // // //   metaRow:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:10 },
// // // // //   pill:{ flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#F1F5F9', borderWidth:1, borderColor:'#E2E8F0', paddingHorizontal:10, paddingVertical:5, borderRadius:999 },
// // // // //   pillTxt:{ color:SUB, fontWeight:'700', fontSize:12 },
// // // // //   actionsRow:{ flexDirection:'row', gap:8, marginTop:10 },
// // // // //   btn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// // // // //   btnTxt:{ color:'#fff', fontWeight:'800' },
// // // // // });

// // // // import React, { useEffect, useState } from 'react';
// // // // import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import getBaseURL from '../../config/env';

// // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // export default function CulturalRequests() {
// // // //   const [items, setItems] = useState(null);

// // // //   const load = async () => {
// // // //     try {
// // // //       const token = await getAuthToken();
// // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// // // //       const json = await res.json();
// // // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // // //       setItems(json || []);
// // // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// // // //   };
// // // //   useEffect(()=>{ load(); }, []);

// // // //   const act = async (id, action) => {
// // // //     try {
// // // //       const token = await getAuthToken();
// // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// // // //         method:'PATCH',
// // // //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// // // //         body: JSON.stringify({ action }),
// // // //       });
// // // //       if(!res.ok){ const t=await res.text(); throw new Error(t||'Failed'); }
// // // //       load();
// // // //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// // // //   };

// // // //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // // //   const renderItem = ({ item }) => {
// // // //     const title = item?.service?.title || `Service #${item.service_id}`;
// // // //     const city  = item?.service?.city?.String || item?.service?.city || null;
// // // //     const date  = item?.chosen_date?.String || item?.chosen_date || '';
// // // //     const traveler = item?.traveler?.name?.String || item?.traveler?.name || 'Traveler';

// // // //     return (
// // // //       <View style={styles.card}>
// // // //         <Text style={styles.title}>{title}</Text>
// // // //         <Text style={styles.sub}>
// // // //           {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
// // // //         </Text>
// // // //         <Text style={styles.traveler}>From: {traveler}</Text>

// // // //         <View style={{ flexDirection:'row', gap:8, marginTop:10 }}>
// // // //           <TouchableOpacity style={[styles.btn,{ backgroundColor:'#22C55E' }]} onPress={()=>act(item.id,'confirm')}>
// // // //             <Ionicons name="checkmark" size={16} color="#fff"/><Text style={styles.btnText}>Confirm</Text>
// // // //           </TouchableOpacity>
// // // //           <TouchableOpacity style={[styles.btn,{ backgroundColor:'#EF4444' }]} onPress={()=>act(item.id,'decline')}>
// // // //             <Ionicons name="close" size={16} color="#fff"/><Text style={styles.btnText}>Decline</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       </View>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <View style={{ flex:1, padding:12 }}>
// // // //       <Text style={styles.h1}>Incoming Requests</Text>
// // // //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// // // //     </View>
// // // //   );
// // // // }
// // // // const styles = StyleSheet.create({
// // // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // // //   title:{ fontWeight:'800', color:'#0f172a' },
// // // //   sub:{ color:'#6B7280', marginTop:4 },
// // // //   traveler:{ color:'#0f172a', marginTop:4, fontWeight:'700' },
// // // //   btn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// // // //   btnText:{ color:'#fff', fontWeight:'800' },
// // // // });


// // // // import React, { useEffect, useState } from 'react';
// // // // import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import { useNavigation } from '@react-navigation/native';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import getBaseURL from '../../config/env';
// // // // import TravelerPreviewCard from './TravelerPreviewCard';

// // // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // // export default function CulturalRequests() {
// // // //   const navigation = useNavigation();
// // // //   const [items, setItems] = useState(null);

// // // //   const load = async () => {
// // // //     try {
// // // //       const token = await getAuthToken();
// // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// // // //       const json = await res.json();
// // // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // // //       setItems(json || []);
// // // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// // // //   };
// // // //   useEffect(()=>{ load(); }, []);

// // // //   const act = async (id, action) => {
// // // //     try {
// // // //       const token = await getAuthToken();
// // // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// // // //         method:'PATCH',
// // // //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// // // //         body: JSON.stringify({ action }),
// // // //       });
// // // //       if(!res.ok){ const t=await res.text(); throw new Error(t||'Failed'); }
// // // //       load();
// // // //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// // // //   };

// // // //   const viewTravelerProfile = (travelerId) => {
// // // //     navigation.navigate('PublicTravelerProfile', { travelerId });
// // // //   };

// // // //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // // //   const renderItem = ({ item }) => {
// // // //     const title = item?.service?.title || `Service #${item.service_id}`;
// // // //     const city  = item?.service?.city?.String || item?.service?.city || null;
// // // //     const date  = item?.chosen_date?.String || item?.chosen_date || '';

// // // //     return (
// // // //       <View style={styles.card}>
// // // //         <Text style={styles.title}>{title}</Text>
// // // //         <Text style={styles.sub}>
// // // //           {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
// // // //         </Text>

// // // //         {/* Traveler Preview Card */}
// // // //         {item.traveler && (
// // // //           <TravelerPreviewCard
// // // //             traveler={item.traveler}
// // // //             onViewProfile={() => viewTravelerProfile(item.traveler.id || item.traveler.ID)}
// // // //           />
// // // //         )}

// // // //         <View style={{ flexDirection:'row', gap:8, marginTop:10 }}>
// // // //           <TouchableOpacity style={[styles.btn,{ backgroundColor:'#22C55E' }]} onPress={()=>act(item.id,'confirm')}>
// // // //             <Ionicons name="checkmark" size={16} color="#fff"/><Text style={styles.btnText}>Confirm</Text>
// // // //           </TouchableOpacity>
// // // //           <TouchableOpacity style={[styles.btn,{ backgroundColor:'#EF4444' }]} onPress={()=>act(item.id,'decline')}>
// // // //             <Ionicons name="close" size={16} color="#fff"/><Text style={styles.btnText}>Decline</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       </View>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <View style={{ flex:1, padding:12 }}>
// // // //       <Text style={styles.h1}>Incoming Requests</Text>
// // // //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// // // //     </View>
// // // //   );
// // // // }
// // // // const styles = StyleSheet.create({
// // // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // // //   title:{ fontWeight:'800', color:'#0f172a' },
// // // //   sub:{ color:'#6B7280', marginTop:4 },
// // // //   btn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// // // //   btnText:{ color:'#fff', fontWeight:'800' },
// // // // });



// // // import React, { useEffect, useState } from 'react';
// // // import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { useNavigation } from '@react-navigation/native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import getBaseURL from '../../config/env';
// // // import TravelerPreviewCard from './TravelerPreviewCard';

// // // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // // export default function CulturalRequests() {
// // //   const navigation = useNavigation();
// // //   const [items, setItems] = useState(null);

// // //   const load = async () => {
// // //     try {
// // //       const token = await getAuthToken();
// // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// // //       const json = await res.json();
// // //       if(!res.ok) throw new Error(json?.error || 'Failed');
// // //       setItems(json || []);
// // //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// // //   };
// // //   useEffect(()=>{ load(); }, []);

// // //   const act = async (id, action) => {
// // //     try {
// // //       const token = await getAuthToken();
// // //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// // //         method:'PATCH',
// // //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// // //         body: JSON.stringify({ action }),
// // //       });
// // //       if(!res.ok){ const t=await res.text(); throw new Error(t||'Failed'); }
// // //       load();
// // //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// // //   };

// // //   const viewTravelerProfile = (item) => {
// // //     const travelerId = item?.traveler?.id || item?.traveler?.ID || item?.user_id;
// // //     navigation.navigate('PublicTravelerProfile', { 
// // //       travelerId,
// // //       isConfirmed: false // Not confirmed yet - just a request
// // //     });
// // //   };

// // //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// // //   const renderItem = ({ item }) => {
// // //     const title = item?.service?.title || `Service #${item.service_id}`;
// // //     const city  = item?.service?.city?.String || item?.service?.city || null;
// // //     const date  = item?.chosen_date?.String || item?.chosen_date || '';

// // //     return (
// // //       <View style={styles.card}>
// // //         <Text style={styles.title}>{title}</Text>
// // //         <Text style={styles.sub}>
// // //           {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
// // //         </Text>

// // //         {/* Traveler Preview Card */}
// // //         {item.traveler && (
// // //           <TravelerPreviewCard
// // //             traveler={item.traveler}
// // //             onViewProfile={() => viewTravelerProfile(item)}
// // //           />
// // //         )}

// // //         <View style={{ flexDirection:'row', gap:8, marginTop:10 }}>
// // //           <TouchableOpacity style={[styles.btn,{ backgroundColor:'#22C55E' }]} onPress={()=>act(item.id,'confirm')}>
// // //             <Ionicons name="checkmark" size={16} color="#fff"/><Text style={styles.btnText}>Confirm</Text>
// // //           </TouchableOpacity>
// // //           <TouchableOpacity style={[styles.btn,{ backgroundColor:'#EF4444' }]} onPress={()=>act(item.id,'decline')}>
// // //             <Ionicons name="close" size={16} color="#fff"/><Text style={styles.btnText}>Decline</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <View style={{ flex:1, padding:12 }}>
// // //       <Text style={styles.h1}>Incoming Requests</Text>
// // //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// // //     </View>
// // //   );
// // // }
// // // const styles = StyleSheet.create({
// // //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// // //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// // //   title:{ fontWeight:'800', color:'#0f172a' },
// // //   sub:{ color:'#6B7280', marginTop:4 },
// // //   btn:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// // //   btnText:{ color:'#fff', fontWeight:'800' },
// // // });
// // import React, { useEffect, useState } from 'react';
// // import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useNavigation } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import getBaseURL from '../../config/env';
// // import TravelerPreviewCard from './TravelerPreviewCard';

// // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// // export default function CulturalRequests() {
// //   const navigation = useNavigation();
// //   const [items, setItems] = useState(null);

// //   const load = async () => {
// //     try {
// //       const token = await getAuthToken();
// //       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { headers:{ Authorization:`Bearer ${token}` }});
// //       const json = await res.json();
// //       if(!res.ok) throw new Error(json?.error || 'Failed');
// //       setItems(json || []);
// //     } catch(e){ Alert.alert('Error', e.message || 'Could not load'); }
// //   };
// //   useEffect(()=>{ load(); }, []);

// //   const act = async (id, action) => {
// //     try {
// //       const token = await getAuthToken();
// //       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
// //         method:'PATCH',
// //         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
// //         body: JSON.stringify({ action }),
// //       });
// //       if(!res.ok){ const t=await res.text(); throw new Error(t||'Failed'); }
// //       load();
// //     } catch(e){ Alert.alert('Error', e.message || 'Failed'); }
// //   };

// //   const viewTravelerProfile = (item) => {
// //     const travelerId = item?.traveler?.id || item?.traveler?.ID || item?.user_id;
// //     navigation.navigate('PublicTravelerProfile', { 
// //       travelerId,
// //       isConfirmed: false
// //     });
// //   };

// //   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

// //   const renderItem = ({ item }) => {
// //     const title = item?.service?.title || `Service #${item.service_id}`;
// //     const city  = item?.service?.city?.String || item?.service?.city || null;
// //     const date  = item?.chosen_date?.String || item?.chosen_date || '';

// //     return (
// //       <View style={styles.card}>
// //         <Text style={styles.title}>{title}</Text>
// //         <Text style={styles.sub}>
// //           {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
// //         </Text>

// //         {item.traveler && (
// //           <TravelerPreviewCard
// //             traveler={item.traveler}
// //             onViewProfile={() => viewTravelerProfile(item)}
// //           />
// //         )}

// //         <View style={styles.buttonRow}>
// //           <TouchableOpacity style={[styles.btn, styles.confirmBtn]} onPress={()=>act(item.id,'confirm')}>
// //             <Ionicons name="checkmark" size={16} color="#fff" style={{ marginRight: 6 }}/>
// //             <Text style={styles.btnText}>Confirm</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={[styles.btn, styles.declineBtn]} onPress={()=>act(item.id,'decline')}>
// //             <Ionicons name="close" size={16} color="#fff" style={{ marginRight: 6 }}/>
// //             <Text style={styles.btnText}>Decline</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={{ flex:1, padding:12 }}>
// //       <Text style={styles.h1}>Incoming Requests</Text>
// //       <FlatList data={items} renderItem={renderItem} keyExtractor={it=>String(it.id)} />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   h1:{ fontSize:18, fontWeight:'800', color:'#0f172a', marginBottom:8 },
// //   card:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#E6EDF7', borderRadius:14, padding:12, marginTop:8 },
// //   title:{ fontWeight:'800', color:'#0f172a' },
// //   sub:{ color:'#6B7280', marginTop:4 },
// //   buttonRow: { flexDirection:'row', marginTop:10 },
// //   btn:{ flexDirection:'row', alignItems:'center', paddingHorizontal:12, paddingVertical:8, borderRadius:10 },
// //   confirmBtn: { backgroundColor:'#22C55E', marginRight: 8 },
// //   declineBtn: { backgroundColor:'#EF4444' },
// //   btnText:{ color:'#fff', fontWeight:'800' },
// // });
// // screens/vendor/CulturalRequests.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';
// import TravelerPreviewCard from './TravelerPreviewCard';

// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// const getAuthToken = async () => { 
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k); 
//     if(v) return v;
//   } 
//   return null; 
// };

// export default function CulturalRequests() {
//   const navigation = useNavigation();
//   const [items, setItems] = useState(null);

//   const load = async () => {
//     try {
//       const token = await getAuthToken();
//       const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { 
//         headers:{ Authorization:`Bearer ${token}` }
//       });
//       const json = await res.json();
//       if(!res.ok) throw new Error(json?.error || 'Failed');
//       setItems(json || []);
//     } catch(e) { 
//       console.error('Load error:', e);
//       Alert.alert('Error', e.message || 'Could not load'); 
//     }
//   };
  
//   useEffect(() => { load(); }, []);

//   const act = async (id, action) => {
//     try {
//       const token = await getAuthToken();
//       const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
//         method:'PATCH',
//         headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
//         body: JSON.stringify({ action }),
//       });
//       if(!res.ok) { 
//         const t = await res.text(); 
//         throw new Error(t || 'Failed'); 
//       }
//       load();
//     } catch(e) { 
//       console.error('Action error:', e);
//       Alert.alert('Error', e.message || 'Failed'); 
//     }
//   };

//   const viewTravelerProfile = (item) => {
//     const travelerId = item?.traveler?.id || item?.traveler?.ID || item?.user_id;
//     navigation.navigate('PublicTravelerProfile', { 
//       travelerId,
//       isConfirmed: false
//     });
//   };

//   if (items === null) return <ActivityIndicator style={{ marginTop:20 }}/>;

//   const renderItem = ({ item }) => {
//     const title = item?.service?.title || `Service #${item.service_id}`;
//     const city  = item?.service?.city?.String || item?.service?.city || null;
//     const date  = item?.chosen_date?.String || item?.chosen_date || '';

    

//     return (
//       <View style={styles.card}>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.sub}>
//           {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
//         </Text>

//         {item.traveler && (
//           <TravelerPreviewCard
//             traveler={item.traveler}
//             onViewProfile={() => viewTravelerProfile(item)}
//           />
//         )}

//         <View style={styles.buttonRow}>
//           <TouchableOpacity 
//             style={[styles.btn, styles.confirmBtn]} 
//             onPress={() => act(item.id, 'confirm')}
//           >
//             <Ionicons name="checkmark" size={16} color="#fff" style={{ marginRight: 6 }}/>
//             <Text style={styles.btnText}>Confirm</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.btn, styles.declineBtn]} 
//             onPress={() => act(item.id, 'decline')}
//           >
//             <Ionicons name="close" size={16} color="#fff" style={{ marginRight: 6 }}/>
//             <Text style={styles.btnText}>Decline</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={{ flex:1, padding:12 }}>
//       <Text style={styles.h1}>Incoming Requests</Text>
//       <FlatList 
//         data={items} 
//         renderItem={renderItem} 
//         keyExtractor={it => String(it.id)} 
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   h1: { 
//     fontSize:18, 
//     fontWeight:'800', 
//     color:'#0f172a', 
//     marginBottom:8 
//   },
//   card: { 
//     backgroundColor:'#fff', 
//     borderWidth:1, 
//     borderColor:'#E6EDF7', 
//     borderRadius:14, 
//     padding:12, 
//     marginTop:8 
//   },
//   title: { 
//     fontWeight:'800', 
//     color:'#0f172a' 
//   },
//   sub: { 
//     color:'#6B7280', 
//     marginTop:4 
//   },
//   buttonRow: { 
//     flexDirection:'row', 
//     marginTop:10 
//   },
//   btn: { 
//     flexDirection:'row', 
//     alignItems:'center', 
//     paddingHorizontal:12, 
//     paddingVertical:8, 
//     borderRadius:10 
//   },
//   confirmBtn: { 
//     backgroundColor:'#22C55E', 
//     marginRight: 8 
//   },
//   declineBtn: { 
//     backgroundColor:'#EF4444' 
//   },
//   btnText: { 
//     color:'#fff', 
//     fontWeight:'800' 
//   },
// });
// screens/vendor/CulturalRequests.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';
import TravelerPreviewCard from './TravelerPreviewCard';

const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => { 
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k); 
    if(v) return v;
  } 
  return null; 
};

export default function CulturalRequests() {
  const navigation = useNavigation();
  const [items, setItems] = useState(null);

  const load = async () => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/vendor/cultural/requests`, { 
        headers:{ Authorization:`Bearer ${token}` }
      });
      const json = await res.json();
      if(!res.ok) throw new Error(json?.error || 'Failed');
      setItems(json || []);
    } catch(e) { 
      console.error('Load error:', e);
      Alert.alert('Error', e.message || 'Could not load'); 
    }
  };
  
  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/vendor/cultural/requests/${id}`, {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      if(!res.ok) { 
        const t = await res.text(); 
        throw new Error(t || 'Failed'); 
      }
      load();
    } catch(e) { 
      console.error('Action error:', e);
      Alert.alert('Error', e.message || 'Failed'); 
    }
  };

  const viewTravelerProfile = (item) => {
    const travelerId = item?.traveler?.id || item?.traveler?.ID || item?.user_id;
    navigation.navigate('PublicTravelerProfile', { 
      travelerId,
      isConfirmed: false
    });
  };

  if (items === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const title = item?.service?.title || `Service #${item.service_id}`;
    const city  = item?.service?.city?.String || item?.service?.city || null;
    const date  = item?.chosen_date?.String || item?.chosen_date || '';

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>
          {city ? city + ' • ' : ''}Participants: {item.participants}{date ? ` • ${date}`:''}
        </Text>

        {item.traveler && (
          <TravelerPreviewCard
            traveler={item.traveler}
            onViewProfile={() => viewTravelerProfile(item)}
          />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.btn, styles.confirmBtn]} 
            onPress={() => act(item.id, 'confirm')}
          >
            <Ionicons name="checkmark" size={16} color="#fff" style={{ marginRight: 6 }}/>
            <Text style={styles.btnText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, styles.declineBtn]} 
            onPress={() => act(item.id, 'decline')}
          >
            <Ionicons name="close" size={16} color="#fff" style={{ marginRight: 6 }}/>
            <Text style={styles.btnText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ✅ Empty State Component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="checkmark-done-circle" size={64} color="#10B981" />
      </View>
      <Text style={styles.emptyTitle}>All caught up!</Text>
      <Text style={styles.emptyText}>
        You have no pending booking requests at the moment.
      </Text>
      <Text style={styles.emptySubtext}>
        New requests will appear here when travelers book your services.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Incoming Requests</Text>
      <FlatList 
        data={items} 
        renderItem={renderItem} 
        keyExtractor={it => String(it.id)}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={items.length === 0 ? styles.emptyListContent : styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  h1: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#0f172a', 
    marginBottom: 8 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#E6EDF7', 
    borderRadius: 14, 
    padding: 12, 
    marginTop: 8 
  },
  title: { 
    fontWeight: '800', 
    color: '#0f172a' 
  },
  sub: { 
    color: '#6B7280', 
    marginTop: 4 
  },
  buttonRow: { 
    flexDirection: 'row', 
    marginTop: 10 
  },
  btn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 10 
  },
  confirmBtn: { 
    backgroundColor: '#22C55E', 
    marginRight: 8 
  },
  declineBtn: { 
    backgroundColor: '#EF4444' 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '800' 
  },
  
  // ✅ Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});