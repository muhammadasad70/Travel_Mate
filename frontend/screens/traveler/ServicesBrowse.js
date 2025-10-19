// // // // screens/Traveler/ServicesBrowse.js
// // // import React, { useEffect, useMemo, useState } from 'react';
// // // import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import getBaseURL from '../../config/env';
// // // import CulturalServiceCard from '../CulturalExchange/CulturalServiceCard';
// // // import { useNavigation } from '@react-navigation/native';

// // // const API_BASE = getBaseURL().replace(/\/+$/, '');

// // // export default function ServicesBrowse() {
// // //   const nav = useNavigation();
// // //   const [q, setQ] = useState('');
// // //   const [city, setCity] = useState('');
// // //   const [type, setType] = useState('');
// // //   const [min, setMin] = useState('');
// // //   const [max, setMax] = useState('');
// // //   const [date, setDate] = useState('');
// // //   const [loading, setLoading] = useState(true);
// // //   const [items, setItems] = useState([]);

// // //   const load = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const p = new URLSearchParams();
// // //       if (q) p.append('q', q);
// // //       if (city) p.append('city', city);
// // //       if (type) p.append('type', type);
// // //       if (min) p.append('min_price', min);
// // //       if (max) p.append('max_price', max);
// // //       if (date) p.append('date', date);
// // //       const res = await fetch(`${API_BASE}/public/cultural/services?`+p.toString());
// // //       const json = await res.json();
// // //       if (!res.ok) throw new Error(json?.error || 'Failed');
// // //       setItems((json||[]).map(x => ({
// // //         id: x.id, title: x.title, city: x.city,
// // //         durationHours: x.duration_hours || 0,
// // //         pricePerPerson: x.price_per_person || x.price_per_group || 0,
// // //         groupSize: x.group_size_max || null,
// // //         badges: [x.experience_type, x.category].filter(Boolean),
// // //       })));
// // //     } catch (e) {
// // //       Alert.alert('Error', e.message || 'Could not load');
// // //     } finally { setLoading(false); }
// // //   };

// // //   useEffect(() => { load(); }, []);

// // //   const renderItem = ({ item }) => (
// // //     <View style={{ paddingVertical: 6 }}>
// // //       <CulturalServiceCard
// // //         title={item.title}
// // //         city={item.city}
// // //         durationHours={item.durationHours}
// // //         pricePerPerson={item.pricePerPerson}
// // //         groupSize={item.groupSize}
// // //         badges={item.badges}
// // //         onView={() => nav.navigate('CulturalServiceDetail', { id: item.id })}
// // //         onEdit={null} onShare={null} onDelete={null}
// // //       />
// // //       <TouchableOpacity
// // //         style={styles.bookBtn}
// // //         onPress={() => nav.navigate('ServiceBookingRequest', { id: item.id })}
// // //       >
// // //         <Ionicons name="calendar-outline" size={16} color="#fff" />
// // //         <Text style={styles.bookBtnText}>Request Booking</Text>
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   return (
// // //     <View style={{ flex:1, padding:12 }}>
// // //       {/* filters - keep minimal */}
// // //       <View style={styles.filters}>
// // //         <TextInput style={styles.inp} placeholder="Search" value={q} onChangeText={setQ} onSubmitEditing={load}/>
// // //         <TextInput style={styles.inp} placeholder="City" value={city} onChangeText={setCity} onSubmitEditing={load}/>
// // //         <TextInput style={styles.inp} placeholder="Type (workshop/walk/...)" value={type} onChangeText={setType} onSubmitEditing={load}/>
// // //         <TextInput style={styles.inp} placeholder="Min" keyboardType="numeric" value={min} onChangeText={setMin} onSubmitEditing={load}/>
// // //         <TextInput style={styles.inp} placeholder="Max" keyboardType="numeric" value={max} onChangeText={setMax} onSubmitEditing={load}/>
// // //         <TextInput style={styles.inp} placeholder="Date YYYY-MM-DD" value={date} onChangeText={setDate} onSubmitEditing={load}/>
// // //         <TouchableOpacity style={styles.filterBtn} onPress={load}><Text style={{ color:'#fff', fontWeight:'800' }}>Apply</Text></TouchableOpacity>
// // //       </View>

// // //       {loading ? <ActivityIndicator/> :
// // //         <FlatList data={items} keyExtractor={it=>String(it.id)} renderItem={renderItem} contentContainerStyle={{ paddingBottom:20 }}/>
// // //       }
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   filters:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:8 },
// // //   inp:{ backgroundColor:'#F8FAFC', borderWidth:1, borderColor:'#E2E8F0', borderRadius:10, padding:10, minWidth:120, flexGrow:1 },
// // //   filterBtn:{ backgroundColor:'#0ea5e9', paddingHorizontal:12, paddingVertical:10, borderRadius:10 },
// // //   bookBtn:{ marginTop:6, alignSelf:'flex-end', backgroundColor:'#0ea5e9', paddingHorizontal:12, paddingVertical:10, borderRadius:10, flexDirection:'row', alignItems:'center', gap:8 },
// // //   bookBtnText:{ color:'#fff', fontWeight:'800' }
// // // });


// // // screens/vendor/CulturalBooked.js
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
// //   const renderItem = ({ item }) => (
// //     <View style={styles.card}>
// //       <Text style={styles.title}>Confirmed: Service #{item.service_id}</Text>
// //       <Text style={styles.sub}>Participants: {item.participants}{item.chosen_date ? ` • ${item.chosen_date}`:''}</Text>
// //     </View>
// //   );
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
// // });




// // screens/vendor/CulturalBooked.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';
// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

// export default function CulturalBooked() {
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
//   if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.title}>Confirmed: Service #{item.service_id}</Text>
//       <Text style={styles.sub}>Participants: {item.participants}{item.chosen_date ? ` • ${item.chosen_date}`:''}</Text>
//     </View>
//   );
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
// });




// screens/vendor/CulturalBooked.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';
const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => { for (const k of TOKEN_KEYS){const v=await AsyncStorage.getItem(k); if(v) return v;} return null; };

export default function CulturalBooked() {
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
  if (items===null) return <ActivityIndicator style={{ marginTop:20 }}/>;
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Confirmed: Service #{item.service_id}</Text>
      <Text style={styles.sub}>Participants: {item.participants}{item.chosen_date ? ` • ${item.chosen_date}`:''}</Text>
    </View>
  );
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
});
