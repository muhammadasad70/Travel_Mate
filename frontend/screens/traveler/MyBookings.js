
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator,
//   RefreshControl, Animated, Alert, Linking
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import getBaseURL from "../../config/env";

// const API = getBaseURL().replace(/\/+$/, "");
// const TOKEN_KEYS = ["token", "auth_token", "jwt", "access_token", "AUTH_TOKEN", "userToken"];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };

// const money = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

// const safeString = (val) => {
//   if (val == null) return '';
//   if (typeof val === 'string') return val;
//   if (val.String !== undefined) return val.String || '';
//   return String(val);
// };

// const safeNumber = (val) => {
//   if (val == null) return null;
//   if (typeof val === 'number') return val;
//   if (val.Float64 !== undefined && val.Valid) return val.Float64;
//   return null;
// };

// export default function MyBookings() {
//   const navigation = useNavigation();
//   const [bookings, setBookings] = useState(null);
//   const [tab, setTab] = useState("all");
//   const [refreshing, setRefreshing] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const fetchBookings = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = await getAuthToken();
//       if (!token) {
//         Alert.alert("Login required", "Please sign in again.");
//         setBookings([]);
//         return;
//       }
//       const res = await fetch(`${API}/cultural/bookings`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.status === 401) {
//         Alert.alert("Session expired", "Please sign in again.");
//         setBookings([]);
//         return;
//       }
//       const data = await res.json().catch(() => []);
//       console.log('Bookings data:', data);
//       setBookings(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error('Fetch error:', e);
//       setBookings([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => { fetchBookings(); }, [fetchBookings]);
//   const onRefresh = () => { setRefreshing(true); fetchBookings(); };

//   const filtered = useMemo(() => {
//     if (!bookings) return [];
//     if (tab === "all") return bookings;
//     return bookings.filter((b) => {
//       const status = safeString(b?.status).toLowerCase();
//       return status === tab;
//     });
//   }, [tab, bookings]);

//   const counts = useMemo(() => ({
//     all: bookings?.length || 0,
//     pending: bookings?.filter((b) => safeString(b?.status).toLowerCase() === "pending")?.length || 0,
//     confirmed: bookings?.filter((b) => safeString(b?.status).toLowerCase() === "confirmed")?.length || 0,
//   }), [bookings]);

//   const getTitle = (b) => {
//     const title = b?.service?.title;
//     if (typeof title === 'string') return title;
//     if (title?.String) return title.String;
//     return `Service #${b?.service_id || b?.ServiceID || ''}`;
//   };

//   const getCity = (b) => {
//     const city = b?.service?.city;
//     if (typeof city === 'string') return city;
//     if (city?.String) return city.String;
//     return null;
//   };

//   const getDuration = (b) => {
//     const dur = safeNumber(b?.service?.duration_hours);
//     return dur != null ? `${dur}h` : null;
//   };

//   const getPriceText = (b) => {
//     const svc = b?.service || {};
//     const model = safeString(svc.pricing_model || b?.pricing_model).toLowerCase();
//     const ppp = safeNumber(svc.price_per_person);
//     const ppg = safeNumber(svc.price_per_group);
//     const snap = safeNumber(b?.price_snapshot);

//     if (model === "per_person" && ppp) return `${money(ppp)} / person`;
//     if (model === "per_group" && ppg) return `${money(ppg)} / group`;
//     if (snap != null) return money(snap);
//     return null;
//   };

//   const callVendor = (phone, countryCode) => {
//     const fullNumber = `${countryCode || ''}${phone || ''}`.replace(/\s/g, '');
//     if (fullNumber) {
//       Linking.openURL(`tel:${fullNumber}`);
//     }
//   };

//   const emailVendor = (email) => {
//     if (email) {
//       Linking.openURL(`mailto:${email}`);
//     }
//   };

//   // Open chat with vendor
//   const openChat = async (booking) => {
//     try {
//       const token = await getAuthToken();
//       if (!token) return;

//       const response = await fetch(`${API}/booking-chat/bookings/${booking.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const conversation = await response.json();
//         navigation.navigate('BookingChat', {
//           conversationId: conversation.id,
//           bookingId: booking.id,
//           serviceTitle: getTitle(booking),
//           otherPersonName: safeString(booking?.vendor?.name || booking?.vendor?.Name) || 'Vendor',
//           userRole: 'traveler',
//         });
//       }
//     } catch (error) {
//       console.error('Error opening chat:', error);
//       Alert.alert('Error', 'Could not open chat');
//     }
//   };

//   const StatusTag = ({ status }) => {
//     const statusStr = safeString(status).toLowerCase();
//     return (
//       <View style={[
//         styles.statusTag,
//         statusStr === "confirmed" && styles.statusConfirmed,
//         statusStr === "pending" && styles.statusPending,
//         statusStr === "declined" && styles.statusDeclined,
//       ]}>
//         <Text style={styles.statusText}>{safeString(status).toUpperCase()}</Text>
//       </View>
//     );
//   };

//   const Item = ({ item, index }) => {
//     const fade = useRef(new Animated.Value(0)).current;
//     useEffect(() => {
//       Animated.timing(fade, { toValue: 1, duration: 300 + index * 70, useNativeDriver: true }).start();
//     }, [fade, index]);

//     const title = getTitle(item);
//     const city = getCity(item);
//     const dur = getDuration(item);
//     const priceText = getPriceText(item);
//     const isConfirmed = safeString(item?.status).toLowerCase() === "confirmed";

//     const vendorName = safeString(item?.vendor?.name || item?.vendor?.Name);
//     const vendorEmail = safeString(item?.vendor?.email || item?.vendor?.Email);
//     const vendorPhone = safeString(item?.vendor?.phone || item?.vendor?.Phone);
//     const vendorCountryCode = safeString(item?.vendor?.country_code || item?.vendor?.CountryCode);
//     const chosenDate = safeString(item?.chosen_date || item?.ChosenDate);

//     return (
//       <Animated.View style={[styles.card, { opacity: fade }]}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleRow}>
//             <Ionicons name="briefcase-outline" size={18} color="#0F3A6B" />
//             <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
//           </View>
//           <StatusTag status={item?.status} />
//         </View>

//         <View style={styles.metaRowWrap}>
//           {city && (
//             <View style={styles.metaPill}>
//               <Ionicons name="location-outline" size={14} color="#475569" />
//               <Text style={styles.metaText}>{city}</Text>
//             </View>
//           )}
//           {dur && (
//             <View style={styles.metaPill}>
//               <Ionicons name="time-outline" size={14} color="#475569" />
//               <Text style={styles.metaText}>{dur}</Text>
//             </View>
//           )}
//           <View style={styles.metaPill}>
//             <Ionicons name="people-outline" size={14} color="#475569" />
//             <Text style={styles.metaText}>Participants: {item?.participants || 1}</Text>
//           </View>
//           {chosenDate && (
//             <View style={styles.metaPill}>
//               <Ionicons name="calendar-outline" size={14} color="#475569" />
//               <Text style={styles.metaText}>{chosenDate}</Text>
//             </View>
//           )}
//         </View>

//         {priceText && (
//           <View style={styles.priceBox}>
//             <Ionicons name="pricetag-outline" size={16} color="#047857" />
//             <Text style={styles.price}>{priceText}</Text>
//           </View>
//         )}

//         {!!item?.message && (
//           <View style={styles.msgBox}>
//             <Ionicons name="chatbubble-ellipses-outline" size={14} color="#334155" />
//             <Text style={styles.msg}>{safeString(item.message)}</Text>
//           </View>
//         )}

//         {/* Chat Button - Show for confirmed bookings */}
//         {isConfirmed && (
//           <TouchableOpacity style={styles.chatButton} onPress={() => openChat(item)}>
//             <Ionicons name="chatbubbles" size={18} color="#6366F1" />
//             <Text style={styles.chatButtonText}>Chat with Vendor</Text>
//           </TouchableOpacity>
//         )}

//         {/* Show vendor contact ONLY if confirmed */}
//         {isConfirmed && (
//           <View style={styles.contactCard}>
//             <Text style={styles.contactTitle}>Host Contact</Text>
//             <View style={styles.contactRow}>
//               <Ionicons name="person-outline" size={16} color="#0f172a" />
//               <Text style={styles.contactText}>{vendorName || 'Host'}</Text>
//             </View>
//             {vendorEmail && (
//               <TouchableOpacity style={styles.contactRow} onPress={() => emailVendor(vendorEmail)}>
//                 <Ionicons name="mail-outline" size={16} color="#0ea5e9" />
//                 <Text style={[styles.contactText, { color: '#0ea5e9' }]}>{vendorEmail}</Text>
//               </TouchableOpacity>
//             )}
//             {vendorPhone && (
//               <TouchableOpacity style={styles.contactRow} onPress={() => callVendor(vendorPhone, vendorCountryCode)}>
//                 <Ionicons name="call-outline" size={16} color="#10B981" />
//                 <Text style={[styles.contactText, { color: '#10B981' }]}>
//                   {vendorCountryCode}{vendorPhone}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity 
//               style={styles.viewProfileBtn}
//               onPress={() => navigation.navigate('PublicHostProfile', { 
//                 vendorId: item?.vendor_id || item?.VendorID,
//                 isConfirmed: true,
//                 vendorEmail: vendorEmail,
//                 vendorPhone: vendorPhone,
//                 vendorCountryCode: vendorCountryCode,
//                 vendorName: vendorName
//               })}
//             >
//               <Text style={styles.viewProfileText}>View full profile</Text>
//               <Ionicons name="chevron-forward" size={16} color="#6366F1" />
//             </TouchableOpacity>
//           </View>
//         )}
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={["#E0EAFC", "#CFDEF3"]}
//         start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
//         style={styles.headerGradient}
//       >
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={18} color="#0F3A6B" />
//           <Text style={styles.backTxt}>Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.heading}>My Bookings</Text>

//         <View style={styles.tabs}>
//           <TouchableOpacity onPress={() => setTab("all")} style={[styles.tab, tab === "all" && styles.tabActive]}>
//             <Text style={[styles.tabTxt, tab === "all" && styles.tabTxtActive]}>All ({counts.all})</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setTab("pending")} style={[styles.tab, tab === "pending" && styles.tabActive]}>
//             <Text style={[styles.tabTxt, tab === "pending" && styles.tabTxtActive]}>Pending ({counts.pending})</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setTab("confirmed")} style={[styles.tab, tab === "confirmed" && styles.tabActive]}>
//             <Text style={[styles.tabTxt, tab === "confirmed" && styles.tabTxtActive]}>Confirmed ({counts.confirmed})</Text>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       {loading ? (
//         <View style={{ padding: 24, alignItems: "center" }}>
//           <ActivityIndicator />
//           <Text style={{ marginTop: 8, color: "#6B7280" }}>Loading…</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filtered}
//           keyExtractor={(it, i) => String(it?.id || it?.ID || i)}
//           renderItem={({ item, index }) => <Item item={item} index={index} />}
//           contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
//           ListEmptyComponent={
//             <View style={{ padding: 24, alignItems: "center" }}>
//               <Ionicons name="folder-open-outline" size={36} color="#6B7280" />
//               <Text style={{ marginTop: 8, color: "#0f172a", fontWeight: "800" }}>No bookings</Text>
//               <Text style={{ color: "#6B7280" }}>You haven't booked any experiences yet.</Text>
//             </View>
//           }
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f7f9fc" },
//   headerGradient: { paddingTop: 12, paddingBottom: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
//   backBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start" },
//   backTxt: { fontWeight: "800", color: "#0F3A6B" },
//   heading: { marginTop: 8, fontSize: 20, fontWeight: "800", color: "#0f172a" },
//   tabs: { marginTop: 10, flexDirection: "row", gap: 8 },
//   tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "#E5E7EB" },
//   tabActive: { backgroundColor: "#0ea5e9" },
//   tabTxt: { fontWeight: "800", color: "#0f172a" },
//   tabTxtActive: { color: "#fff" },

//   card: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E6EDF7", borderRadius: 14, padding: 12, marginBottom: 12 },
//   cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
//   cardTitle: { fontWeight: "800", color: "#0f172a", flexShrink: 1 },

//   metaRowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
//   metaPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F8FAFC", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB" },
//   metaText: { fontSize: 12, color: "#0f172a", fontWeight: "700" },

//   priceBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#ECFDF5", borderColor: "#D1FAE5", borderWidth: 1, padding: 8, borderRadius: 8, marginTop: 10 },
//   price: { color: "#065F46", fontWeight: "800" },

//   msgBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#EEF2FF", borderColor: "#E0E7FF", borderWidth: 1, padding: 8, borderRadius: 8, marginTop: 10 },
//   msg: { color: "#0f172a", flex: 1 },

//   // Chat Button
//   chatButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#EFF6FF',
//     borderWidth: 1,
//     borderColor: '#BFDBFE',
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginTop: 10,
//   },
//   chatButtonText: {
//     color: '#6366F1',
//     fontWeight: '700',
//     fontSize: 14,
//     marginLeft: 8,
//   },

//   contactCard: {
//     marginTop: 10,
//     backgroundColor: "#F0FDF4",
//     borderRadius: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#BBF7D0",
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

//   statusTag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "#E5E7EB" },
//   statusPending: { backgroundColor: "#FEF3C7" },
//   statusConfirmed: { backgroundColor: "#BBF7D0" },
//   statusDeclined: { backgroundColor: "#FECACA" },
//   statusText: { fontWeight: "900", color: "#0f172a", fontSize: 12 },
// });


import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator,
  RefreshControl, Animated, Alert, Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ added
import getBaseURL from "../../config/env";

const API = getBaseURL().replace(/\/+$/, "");
const TOKEN_KEYS = ["token", "auth_token", "jwt", "access_token", "AUTH_TOKEN", "userToken"];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

const money = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

const safeString = (val) => {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (val.String !== undefined) return val.String || '';
  return String(val);
};

const safeNumber = (val) => {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  if (val.Float64 !== undefined && val.Valid) return val.Float64;
  return null;
};

export default function MyBookings() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState(null);
  const [tab, setTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        Alert.alert("Login required", "Please sign in again.");
        setBookings([]);
        return;
      }
      const res = await fetch(`${API}/cultural/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        Alert.alert("Session expired", "Please sign in again.");
        setBookings([]);
        return;
      }
      const data = await res.json().catch(() => []);
      console.log('Bookings data:', data);
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Fetch error:', e);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  const filtered = useMemo(() => {
    if (!bookings) return [];
    if (tab === "all") return bookings;
    return bookings.filter((b) => {
      const status = safeString(b?.status).toLowerCase();
      return status === tab;
    });
  }, [tab, bookings]);

  const counts = useMemo(() => ({
    all: bookings?.length || 0,
    pending: bookings?.filter((b) => safeString(b?.status).toLowerCase() === "pending")?.length || 0,
    confirmed: bookings?.filter((b) => safeString(b?.status).toLowerCase() === "confirmed")?.length || 0,
  }), [bookings]);

  const getTitle = (b) => {
    const title = b?.service?.title;
    if (typeof title === 'string') return title;
    if (title?.String) return title.String;
    return `Service #${b?.service_id || b?.ServiceID || ''}`;
  };

  const getCity = (b) => {
    const city = b?.service?.city;
    if (typeof city === 'string') return city;
    if (city?.String) return city.String;
    return null;
  };

  const getDuration = (b) => {
    const dur = safeNumber(b?.service?.duration_hours);
    return dur != null ? `${dur}h` : null;
  };

  const getPriceText = (b) => {
    const svc = b?.service || {};
    const model = safeString(svc.pricing_model || b?.pricing_model).toLowerCase();
    const ppp = safeNumber(svc.price_per_person);
    const ppg = safeNumber(svc.price_per_group);
    const snap = safeNumber(b?.price_snapshot);

    if (model === "per_person" && ppp) return `${money(ppp)} / person`;
    if (model === "per_group" && ppg) return `${money(ppg)} / group`;
    if (snap != null) return money(snap);
    return null;
  };

  const callVendor = (phone, countryCode) => {
    const fullNumber = `${countryCode || ''}${phone || ''}`.replace(/\s/g, '');
    if (fullNumber) Linking.openURL(`tel:${fullNumber}`);
  };

  const emailVendor = (email) => {
    if (email) Linking.openURL(`mailto:${email}`);
  };

  const openChat = async (booking) => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      const response = await fetch(`${API}/booking-chat/bookings/${booking.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const conversation = await response.json();
        navigation.navigate('BookingChat', {
          conversationId: conversation.id,
          bookingId: booking.id,
          serviceTitle: getTitle(booking),
          otherPersonName: safeString(booking?.vendor?.name || booking?.vendor?.Name) || 'Vendor',
          userRole: 'traveler',
        });
      }
    } catch (error) {
      console.error('Error opening chat:', error);
      Alert.alert('Error', 'Could not open chat');
    }
  };

  const StatusTag = ({ status }) => {
    const statusStr = safeString(status).toLowerCase();
    return (
      <View style={[
        styles.statusTag,
        statusStr === "confirmed" && styles.statusConfirmed,
        statusStr === "pending" && styles.statusPending,
        statusStr === "declined" && styles.statusDeclined,
      ]}>
        <Text style={styles.statusText}>{safeString(status).toUpperCase()}</Text>
      </View>
    );
  };

  const Item = ({ item, index }) => {
    const fade = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(fade, { toValue: 1, duration: 300 + index * 70, useNativeDriver: true }).start();
    }, [fade, index]);

    const title = getTitle(item);
    const city = getCity(item);
    const dur = getDuration(item);
    const priceText = getPriceText(item);
    const isConfirmed = safeString(item?.status).toLowerCase() === "confirmed";

    const vendorName = safeString(item?.vendor?.name || item?.vendor?.Name);
    const vendorEmail = safeString(item?.vendor?.email || item?.vendor?.Email);
    const vendorPhone = safeString(item?.vendor?.phone || item?.vendor?.Phone);
    const vendorCountryCode = safeString(item?.vendor?.country_code || item?.vendor?.CountryCode);
    const chosenDate = safeString(item?.chosen_date || item?.ChosenDate);

    return (
      <Animated.View style={[styles.card, { opacity: fade }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="briefcase-outline" size={18} color="#0F3A6B" />
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
          </View>
          <StatusTag status={item?.status} />
        </View>

        <View style={styles.metaRowWrap}>
          {city && (
            <View style={styles.metaPill}>
              <Ionicons name="location-outline" size={14} color="#475569" />
              <Text style={styles.metaText}>{city}</Text>
            </View>
          )}
          {dur && (
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={14} color="#475569" />
              <Text style={styles.metaText}>{dur}</Text>
            </View>
          )}
          <View style={styles.metaPill}>
            <Ionicons name="people-outline" size={14} color="#475569" />
            <Text style={styles.metaText}>Participants: {item?.participants || 1}</Text>
          </View>
          {chosenDate && (
            <View style={styles.metaPill}>
              <Ionicons name="calendar-outline" size={14} color="#475569" />
              <Text style={styles.metaText}>{chosenDate}</Text>
            </View>
          )}
        </View>

        {priceText && (
          <View style={styles.priceBox}>
            <Ionicons name="pricetag-outline" size={16} color="#047857" />
            <Text style={styles.price}>{priceText}</Text>
          </View>
        )}

        {!!item?.message && (
          <View style={styles.msgBox}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color="#334155" />
            <Text style={styles.msg}>{safeString(item.message)}</Text>
          </View>
        )}

        {isConfirmed && (
          <TouchableOpacity style={styles.chatButton} onPress={() => openChat(item)}>
            <Ionicons name="chatbubbles" size={18} color="#6366F1" />
            <Text style={styles.chatButtonText}>Chat with Vendor</Text>
          </TouchableOpacity>
        )}

        {isConfirmed && (
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Host Contact</Text>
            <View style={styles.contactRow}>
              <Ionicons name="person-outline" size={16} color="#0f172a" />
              <Text style={styles.contactText}>{vendorName || 'Host'}</Text>
            </View>
            {vendorEmail && (
              <TouchableOpacity style={styles.contactRow} onPress={() => emailVendor(vendorEmail)}>
                <Ionicons name="mail-outline" size={16} color="#0ea5e9" />
                <Text style={[styles.contactText, { color: '#0ea5e9' }]}>{vendorEmail}</Text>
              </TouchableOpacity>
            )}
            {vendorPhone && (
              <TouchableOpacity style={styles.contactRow} onPress={() => callVendor(vendorPhone, vendorCountryCode)}>
                <Ionicons name="call-outline" size={16} color="#10B981" />
                <Text style={[styles.contactText, { color: '#10B981' }]}>
                  {vendorCountryCode}{vendorPhone}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.viewProfileBtn}
              onPress={() => navigation.navigate('PublicHostProfile', { 
                vendorId: item?.vendor_id || item?.VendorID,
                isConfirmed: true,
                vendorEmail,
                vendorPhone,
                vendorCountryCode,
                vendorName
              })}
            >
              <Text style={styles.viewProfileText}>View full profile</Text>
              <Ionicons name="chevron-forward" size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => setTab("all")} style={[styles.tab, tab === "all" && styles.tabActive]}>
              <Text style={[styles.tabTxt, tab === "all" && styles.tabTxtActive]}>All ({counts.all})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab("pending")} style={[styles.tab, tab === "pending" && styles.tabActive]}>
              <Text style={[styles.tabTxt, tab === "pending" && styles.tabTxtActive]}>Pending ({counts.pending})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab("confirmed")} style={[styles.tab, tab === "confirmed" && styles.tabActive]}>
              <Text style={[styles.tabTxt, tab === "confirmed" && styles.tabTxtActive]}>Confirmed ({counts.confirmed})</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {loading ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: "#6B7280" }}>Loading…</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(it, i) => String(it?.id || it?.ID || i)}
            renderItem={({ item, index }) => <Item item={item} index={index} />}
            contentContainerStyle={{ padding: 12, paddingBottom: 90 }} // ✅ space for bottom nav
            ListEmptyComponent={
              <View style={{ padding: 24, alignItems: "center" }}>
                <Ionicons name="folder-open-outline" size={36} color="#6B7280" />
                <Text style={{ marginTop: 8, color: "#0f172a", fontWeight: "800" }}>No bookings</Text>
                <Text style={{ color: "#6B7280" }}>You haven't booked any experiences yet.</Text>
              </View>
            }
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f9fc" },
  container: { flex: 1, backgroundColor: "#f7f9fc" },
  headerGradient: { paddingTop: 12, paddingBottom: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start" },
  backTxt: { fontWeight: "800", color: "#0F3A6B" },
  heading: { marginTop: 8, fontSize: 20, fontWeight: "800", color: "#0f172a" },
  tabs: { marginTop: 10, flexDirection: "row", gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "#E5E7EB" },
  tabActive: { backgroundColor: "#0ea5e9" },
  tabTxt: { fontWeight: "800", color: "#0f172a" },
  tabTxtActive: { color: "#fff" },
  card: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E6EDF7", borderRadius: 14, padding: 12, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  cardTitle: { fontWeight: "800", color: "#0f172a", flexShrink: 1 },
  metaRowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  metaPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F8FAFC", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB" },
  metaText: { fontSize: 12, color: "#0f172a", fontWeight: "700" },
  priceBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#ECFDF5", borderColor: "#D1FAE5", borderWidth: 1, padding: 8, borderRadius: 8, marginTop: 10 },
  price: { color: "#065F46", fontWeight: "800" },
  msgBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#EEF2FF", borderColor: "#E0E7FF", borderWidth: 1, padding: 8, borderRadius: 8, marginTop: 10 },
  msg: { color: "#0f172a", flex: 1 },
  chatButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginTop: 10 },
  chatButtonText: { color: '#6366F1', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  contactCard: { marginTop: 10, backgroundColor: "#F0FDF4", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#BBF7D0", gap: 6 },
  contactTitle: { fontWeight: '800', color: '#065F46', marginBottom: 4 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contactText: { fontSize: 14, color: '#0f172a', fontWeight: '600' },
  viewProfileBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#EEF2FF', borderRadius: 6 },
  viewProfileText: { fontSize: 13, fontWeight: '800', color: '#6366F1' },
  statusTag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "#E5E7EB" },
  statusPending: { backgroundColor: "#FEF3C7" },
  statusConfirmed: { backgroundColor: "#BBF7D0" },
  statusDeclined: { backgroundColor: "#FECACA" },
  statusText: { fontWeight: "900", color: "#0f172a", fontSize: 12 },
});
