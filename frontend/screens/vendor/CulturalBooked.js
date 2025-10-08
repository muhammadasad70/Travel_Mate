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
