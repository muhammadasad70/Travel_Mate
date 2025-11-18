
// // screens/vendor/CulturalBooked.js
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
        
//         <View style={styles.contactCard}>
//           <Text style={styles.contactTitle}>Guest Contact</Text>
//           <View style={styles.contactRow}>
//             <Ionicons name="person-outline" size={16} color="#0f172a" style={{ marginRight: 8 }}/>
//             <Text style={styles.contactText}>{travelerName || 'Traveler'}</Text>
//           </View>
//           {travelerEmail && (
//             <TouchableOpacity style={styles.contactRow} onPress={() => emailTraveler(travelerEmail)}>
//               <Ionicons name="mail-outline" size={16} color="#0ea5e9" style={{ marginRight: 8 }}/>
//               <Text style={[styles.contactText, { color: '#0ea5e9' }]}>{travelerEmail}</Text>
//             </TouchableOpacity>
//           )}
//           {travelerPhone && (
//             <TouchableOpacity style={styles.contactRow} onPress={() => callTraveler(travelerPhone, travelerCountryCode)}>
//               <Ionicons name="call-outline" size={16} color="#10B981" style={{ marginRight: 8 }}/>
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
//   },
//   contactTitle: {
//     fontWeight: '800',
//     color: '#065F46',
//     marginBottom: 6,
//   },
//   contactRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
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



// screens/vendor/CulturalBooked.js
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

  // Open chat with traveler
  const openChat = async (booking) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/booking-chat/bookings/${booking.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const conversation = await response.json();
        navigation.navigate('BookingChat', {
          conversationId: conversation.id,
          bookingId: booking.id,
          serviceTitle: booking?.service?.title || `Service #${booking.service_id}`,
          otherPersonName: safeString(booking?.traveler?.name) || 'Traveler',
          userRole: 'vendor',
        });
      }
    } catch (error) {
      console.error('Error opening chat:', error);
      Alert.alert('Error', 'Could not open chat');
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
        
        {/* Chat Button */}
        <TouchableOpacity style={styles.chatButton} onPress={() => openChat(item)}>
          <Ionicons name="chatbubbles" size={18} color="#6366F1" />
          <Text style={styles.chatButtonText}>Chat with Traveler</Text>
        </TouchableOpacity>
        
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
  
  // Chat Button
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  chatButtonText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  
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
