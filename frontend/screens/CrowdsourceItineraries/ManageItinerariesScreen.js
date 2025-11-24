
// // screens/CrowdsourceItineraries/ManageItinerariesScreen.js
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   RefreshControl,
//   TouchableOpacity,
//   Platform,
//   ActionSheetIOS,
//   Alert,
//   useWindowDimensions,
//   Share,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import getBaseURL from "../../config/env";
// import ItineraryCard from "./ItineraryCard";

// const API_BASE = getBaseURL().replace(/\/+$/, "");
// const BORDER = "#E6EDF7";
// const PRIMARY = "#003366";
// const SUBTEXT = "#6B7280";

// // Layout settings
// const GUTTER = 14;
// const H_PADDING = 14;
// const CARD_MIN_WIDTH = 320;

// const TOKEN_KEYS = ["token", "auth_token", "jwt", "access_token", "AUTH_TOKEN", "userToken"];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };

// // Build a shareable URL for the itinerary (adjust this route to your app)
// const getShareUrl = (it) => {
//   const id = it?.id || it?._id;
//   if (!id) return "";
//   if (Platform.OS === "web" && typeof window !== "undefined") {
//     return `${window.location.origin}/itinerary/${id}`;
//   }
//   return `https://travelmate.example.com/itinerary/${id}`;
// };

// export default function ManageItinerariesScreen() {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   const columns =
//     Platform.OS === "web"
//       ? Math.max(1, Math.min(4, Math.floor((width - H_PADDING * 2 + GUTTER) / (CARD_MIN_WIDTH + GUTTER))))
//       : 1;

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = await getAuthToken();
//       if (!token) {
//         Alert.alert("Not logged in", "Please log in to view your itineraries.");
//         setItems([]);
//         return;
//       }
//       const res = await fetch(`${API_BASE}/itineraries`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const raw = await res.text();
//       let data = [];
//       try {
//         data = raw ? JSON.parse(raw) : [];
//       } catch {
//         data = [];
//       }
//       if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
//       setItems(Array.isArray(data) ? data : data?.items || []);
//     } catch (e) {
//       console.log("Fetch itineraries error:", e);
//       Alert.alert("Error", "Unable to load your itineraries.");
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, [fetchData])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchData();
//     setRefreshing(false);
//   };

//   // Always pass both id and the full object for instant render + refetch on detail screen
//   const onView = (it) => {
//     const id = it?.id ?? it?._id;
//     navigation.navigate("ItineraryDetails", { id, itinerary: it });
//   };

//   const onEdit = (it) => navigation.navigate("EditItinerary", { edit: true, itinerary: it });

//   // Optimistic delete with rollback on failure
//   const doDelete = async (it) => {
//     const id = it?.id ?? it?._id;
//     if (!id || deletingId) return; // guard
//     const token = await getAuthToken();
//     if (!token) {
//       Alert.alert("Not logged in", "Please log in again.");
//       return;
//     }

//     setDeletingId(id);
//     const prev = items;
//     setItems((cur) => cur.filter((x) => (x.id ?? x._id) !== id));

//     try {
//       const res = await fetch(`${API_BASE}/itineraries/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 204) {
//         // success
//         return;
//       }

//       const raw = await res.text();
//       let j = null;
//       try { j = raw ? JSON.parse(raw) : null; } catch {}
//       setItems(prev); // rollback

//       const msgMap = {
//         401: "Your session expired. Please log in again.",
//         404: "Itinerary not found (maybe already deleted).",
//         428: "Please complete your profile to continue.",
//       };
//       const msg = j?.error || msgMap[res.status] || `Failed (HTTP ${res.status})`;
//       Alert.alert("Delete failed", msg);
//     } catch (err) {
//       console.log("Delete error:", err);
//       setItems(prev); // rollback
//       Alert.alert("Network Error", "Could not reach server. Try again.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // WEB-SAFE confirm: use window.confirm on web, ActionSheet on iOS, Alert on Android
//   const confirmDelete = (it) => {
//     if (Platform.OS === "web") {
//       const ok = typeof window !== "undefined" ? window.confirm("Delete itinerary? This action cannot be undone.") : false;
//       if (ok) doDelete(it);
//       return;
//     }
//     if (Platform.OS === "ios") {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           title: "Delete itinerary?",
//           message: "This action cannot be undone.",
//           options: ["Cancel", "Delete"],
//           destructiveButtonIndex: 1,
//           cancelButtonIndex: 0,
//           userInterfaceStyle: "light",
//         },
//         (idx) => {
//           if (idx === 1) doDelete(it);
//         }
//       );
//       return;
//     }
//     // Android
//     Alert.alert("Delete itinerary?", "This action cannot be undone.", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => doDelete(it) },
//     ]);
//   };

//   const onShare = async (it) => {
//     const url = getShareUrl(it);
//     const title = it?.title || "My itinerary";
//     const message = `${title}${url ? ` — ${url}` : ""}`;

//     try {
//       if (Platform.OS === "web" && typeof navigator !== "undefined") {
//         if (navigator.share) {
//           await navigator.share({ title, text: title, url });
//         } else if (navigator.clipboard && url) {
//           await navigator.clipboard.writeText(url);
//           alert("Link copied to clipboard!");
//         } else {
//           alert(message);
//         }
//       } else {
//         await Share.share(url ? { title, message, url } : { title, message });
//       }
//     } catch (err) {
//       console.log("Share error:", err);
//       Alert.alert("Unable to share right now.");
//     }
//   };

//   const renderItem = ({ item }) => {
//     const id = item.id ?? item._id;
//     const isDeleting = deletingId === id;

//     return (
//       <View
//         style={[
//           styles.cardWrap,
//           columns > 1 && { width: `${100 / columns}%` },
//         ]}
//       >
//         <ItineraryCard item={item} onPress={() => onView(item)} />
//         <View style={styles.cardActions}>
//           <TouchableOpacity style={styles.actionBtn} onPress={() => onView(item)}>
//             <Ionicons name="eye-outline" size={16} color={PRIMARY} />
//             <Text style={styles.actionText}>View</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(item)}>
//             <Ionicons name="create-outline" size={16} color={PRIMARY} />
//             <Text style={styles.actionText}>Edit</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionBtn} onPress={() => onShare(item)}>
//             <Ionicons name="share-social-outline" size={16} color={PRIMARY} />
//             <Text style={styles.actionText}>Share</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.actionBtn, styles.actionBtnDanger, isDeleting && { opacity: 0.6 }]}
//             onPress={() => confirmDelete(item)}
//             disabled={isDeleting}
//             accessibilityLabel="Delete itinerary"
//             accessibilityState={{ disabled: isDeleting }}
//           >
//             <Ionicons
//               name={isDeleting ? "hourglass-outline" : "trash-outline"}
//               size={16}
//               color="#B91C1C"
//             />
//             <Text style={[styles.actionText, styles.actionTextDanger]}>
//               {isDeleting ? "Deleting…" : "Delete"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.safe, { paddingBottom: insets.bottom }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backPill} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backText}>Back to Hub</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>My Itineraries</Text>
//       </View>

//       <FlatList
//         data={items}
//         key={columns}
//         renderItem={renderItem}
//         keyExtractor={(it, i) => String(it?.id ?? it?._id ?? i)}
//         numColumns={columns}
//         contentContainerStyle={[
//           styles.listContent,
//           {
//             paddingBottom: 24 + insets.bottom,
//             paddingHorizontal: H_PADDING - GUTTER / 2,
//             rowGap: GUTTER,
//           },
//           items.length === 0 && { flexGrow: 1, justifyContent: "center" },
//         ]}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         ListEmptyComponent={
//           !loading && (
//             <View style={styles.empty}>
//               <Ionicons name="folder-open-outline" size={36} color={SUBTEXT} />
//               <Text style={styles.emptyTitle}>No itineraries yet</Text>
//               <Text style={styles.emptySub}>Create your first trip to see it here.</Text>
//               <TouchableOpacity
//                 style={styles.primaryBtn}
//                 onPress={() => navigation.navigate("CreateItinerary")}
//               >
//                 <Ionicons name="add" size={18} color="#fff" />
//                 <Text style={styles.primaryBtnText}>Create Itinerary</Text>
//               </TouchableOpacity>
//             </View>
//           )
//         }
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#f7f9fc" },

//   header: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER,
//     backgroundColor: "#f7f9fc",
//   },
//   backPill: {
//     alignSelf: "flex-start",
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 8,
//   },
//   backText: { fontWeight: "800", color: "#0f172a" },
//   title: { fontSize: 20, fontWeight: "800", color: PRIMARY, marginLeft: 2 },

//   listContent: {},

//   cardWrap: {
//     flexGrow: 1,
//     paddingHorizontal: GUTTER / 2,
//   },
//   cardActions: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderLeftWidth: 1,
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: BORDER,
//     borderBottomLeftRadius: 14,
//     borderBottomRightRadius: 14,
//     padding: 8,
//     justifyContent: "flex-end",
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     backgroundColor: "#F1F5F9",
//     borderRadius: 999,
//   },
//   actionBtnDanger: {
//     backgroundColor: "#FEF2F2",
//     borderWidth: 1,
//     borderColor: "#FECACA",
//   },
//   actionText: { color: PRIMARY, fontWeight: "700", fontSize: 12 },
//   actionTextDanger: { color: "#B91C1C" },

//   empty: { alignItems: "center", gap: 8 },
//   emptyTitle: { fontWeight: "800", color: "#0f172a", marginTop: 6 },
//   emptySub: { color: SUBTEXT },
//   primaryBtn: {
//     marginTop: 8,
//     backgroundColor: PRIMARY,
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   primaryBtnText: { color: "#fff", fontWeight: "800" },
// });


// // screens/CrowdsourceItineraries/ManageItinerariesScreen.js
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   RefreshControl,
//   TouchableOpacity,
//   Platform,
//   ActionSheetIOS,
//   Alert,
//   useWindowDimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import getBaseURL from "../../config/env";
// import ItineraryCard from "./ItineraryCard";

// const API_BASE = getBaseURL().replace(/\/+$/, "");
// const BORDER = "#E6EDF7";
// const PRIMARY = "#003366";
// const SUBTEXT = "#6B7280";

// // Layout settings
// const GUTTER = 14;
// const H_PADDING = 14;
// const CARD_MIN_WIDTH = 320;

// const TOKEN_KEYS = ["token", "auth_token", "jwt", "access_token", "AUTH_TOKEN", "userToken"];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };

// export default function ManageItinerariesScreen() {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   const columns =
//     Platform.OS === "web"
//       ? Math.max(1, Math.min(4, Math.floor((width - H_PADDING * 2 + GUTTER) / (CARD_MIN_WIDTH + GUTTER))))
//       : 1;

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = await getAuthToken();
//       if (!token) {
//         Alert.alert("Not logged in", "Please log in to view your itineraries.");
//         setItems([]);
//         return;
//       }
//       const res = await fetch(`${API_BASE}/itineraries`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const raw = await res.text();
//       let data = [];
//       try {
//         data = raw ? JSON.parse(raw) : [];
//       } catch {
//         data = [];
//       }
//       if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
//       setItems(Array.isArray(data) ? data : data?.items || []);
//     } catch (e) {
//       console.log("Fetch itineraries error:", e);
//       Alert.alert("Error", "Unable to load your itineraries.");
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, [fetchData])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchData();
//     setRefreshing(false);
//   };

//   // Always pass both id and the full object for instant render + refetch on detail screen
//   const onView = (it) => {
//     const id = it?.id ?? it?._id;
//     navigation.navigate("ItineraryDetails", { id, itinerary: it });
//   };

//   const onEdit = (it) => navigation.navigate("EditItinerary", { edit: true, itinerary: it });

//   // Optimistic delete with rollback on failure
//   const doDelete = async (it) => {
//     const id = it?.id ?? it?._id;
//     if (!id || deletingId) return; // guard
//     const token = await getAuthToken();
//     if (!token) {
//       Alert.alert("Not logged in", "Please log in again.");
//       return;
//     }

//     setDeletingId(id);
//     const prev = items;
//     setItems((cur) => cur.filter((x) => (x.id ?? x._id) !== id));

//     try {
//       const res = await fetch(`${API_BASE}/itineraries/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 204) {
//         // success
//         return;
//       }

//       const raw = await res.text();
//       let j = null;
//       try { j = raw ? JSON.parse(raw) : null; } catch {}
//       setItems(prev); // rollback

//       const msgMap = {
//         401: "Your session expired. Please log in again.",
//         404: "Itinerary not found (maybe already deleted).",
//         428: "Please complete your profile to continue.",
//       };
//       const msg = j?.error || msgMap[res.status] || `Failed (HTTP ${res.status})`;
//       Alert.alert("Delete failed", msg);
//     } catch (err) {
//       console.log("Delete error:", err);
//       setItems(prev); // rollback
//       Alert.alert("Network Error", "Could not reach server. Try again.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // WEB-SAFE confirm: use window.confirm on web, ActionSheet on iOS, Alert on Android
//   const confirmDelete = (it) => {
//     if (Platform.OS === "web") {
//       const ok = typeof window !== "undefined" ? window.confirm("Delete itinerary? This action cannot be undone.") : false;
//       if (ok) doDelete(it);
//       return;
//     }
//     if (Platform.OS === "ios") {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           title: "Delete itinerary?",
//           message: "This action cannot be undone.",
//           options: ["Cancel", "Delete"],
//           destructiveButtonIndex: 1,
//           cancelButtonIndex: 0,
//           userInterfaceStyle: "light",
//         },
//         (idx) => {
//           if (idx === 1) doDelete(it);
//         }
//       );
//       return;
//     }
//     // Android
//     Alert.alert("Delete itinerary?", "This action cannot be undone.", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => doDelete(it) },
//     ]);
//   };

//   const renderItem = ({ item }) => {
//     const id = item.id ?? item._id;
//     const isDeleting = deletingId === id;

//     return (
//       <View
//         style={[
//           styles.cardWrap,
//           columns > 1 && { width: `${100 / columns}%` },
//         ]}
//       >
//         {/* ✅ ItineraryCard handles all actions including detailed share */}
//         <ItineraryCard 
//           item={item}  // ✅ Full item with activities, days, times, etc.
//           onPress={() => onView(item)}
//           onView={() => onView(item)}
//           onEdit={() => onEdit(item)}
//           onDelete={() => confirmDelete(item)}
//         />
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.safe, { paddingBottom: insets.bottom }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backPill} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backText}>Back to Hub</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>My Itineraries</Text>
//       </View>

//       <FlatList
//         data={items}
//         key={columns}
//         renderItem={renderItem}
//         keyExtractor={(it, i) => String(it?.id ?? it?._id ?? i)}
//         numColumns={columns}
//         contentContainerStyle={[
//           styles.listContent,
//           {
//             paddingBottom: 24 + insets.bottom,
//             paddingHorizontal: H_PADDING - GUTTER / 2,
//             rowGap: GUTTER,
//           },
//           items.length === 0 && { flexGrow: 1, justifyContent: "center" },
//         ]}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         ListEmptyComponent={
//           !loading && (
//             <View style={styles.empty}>
//               <Ionicons name="folder-open-outline" size={36} color={SUBTEXT} />
//               <Text style={styles.emptyTitle}>No itineraries yet</Text>
//               <Text style={styles.emptySub}>Create your first trip to see it here.</Text>
//               <TouchableOpacity
//                 style={styles.primaryBtn}
//                 onPress={() => navigation.navigate("CreateItinerary")}
//               >
//                 <Ionicons name="add" size={18} color="#fff" />
//                 <Text style={styles.primaryBtnText}>Create Itinerary</Text>
//               </TouchableOpacity>
//             </View>
//           )
//         }
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#f7f9fc" },

//   header: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER,
//     backgroundColor: "#f7f9fc",
//   },
//   backPill: {
//     alignSelf: "flex-start",
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 8,
//   },
//   backText: { fontWeight: "800", color: "#0f172a" },
//   title: { fontSize: 20, fontWeight: "800", color: PRIMARY, marginLeft: 2 },

//   listContent: {},

//   cardWrap: {
//     flexGrow: 1,
//     paddingHorizontal: GUTTER / 2,
//   },

//   empty: { alignItems: "center", gap: 8 },
//   emptyTitle: { fontWeight: "800", color: "#0f172a", marginTop: 6 },
//   emptySub: { color: SUBTEXT },
//   primaryBtn: {
//     marginTop: 8,
//     backgroundColor: PRIMARY,
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   primaryBtnText: { color: "#fff", fontWeight: "800" },
// });





// screens/CrowdsourceItineraries/ManageItinerariesScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import getBaseURL from "../../config/env";
import ItineraryCard from "./ItineraryCard";

const API_BASE = getBaseURL().replace(/\/+$/, "");
const BORDER = "#E6EDF7";
const PRIMARY = "#003366";
const SUBTEXT = "#6B7280";

// Layout settings
const GUTTER = 14;
const H_PADDING = 14;
const CARD_MIN_WIDTH = 320;

const TOKEN_KEYS = ["token", "auth_token", "jwt", "access_token", "AUTH_TOKEN", "userToken"];

// ✅ ENHANCED: Better token debugging
const getAuthToken = async () => {
  console.log("🔑 Attempting to retrieve auth token...");
  
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) {
      console.log(`✅ Token found with key: ${k}`);
      console.log(`Token preview: ${v.substring(0, 20)}...`);
      return v;
    }
  }
  
  console.log("❌ No token found in any storage key");
  return null;
};

export default function ManageItinerariesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const columns =
    Platform.OS === "web"
      ? Math.max(1, Math.min(4, Math.floor((width - H_PADDING * 2 + GUTTER) / (CARD_MIN_WIDTH + GUTTER))))
      : 1;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ ENHANCED: Better error handling and debugging
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check token first
      const token = await getAuthToken();
      if (!token) {
        console.log("❌ No authentication token found");
        Alert.alert("Not logged in", "Please log in to view your itineraries.");
        setItems([]);
        return;
      }

      console.log("📡 Making request to:", `${API_BASE}/itineraries`);
      console.log("🔐 Using Authorization header");

      const res = await fetch(`${API_BASE}/itineraries`, {
        method: "GET", // ✅ Explicitly set method
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ Add content-type
        },
      });

      console.log("📥 Response status:", res.status);
      console.log("📥 Response headers:", JSON.stringify(res.headers));

      // ✅ ENHANCED: Better response handling
      const raw = await res.text();
      console.log("📄 Raw response:", raw.substring(0, 200));

      let data = [];
      try {
        data = raw ? JSON.parse(raw) : [];
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.log("Raw response that failed to parse:", raw);
        data = [];
      }

      // ✅ ENHANCED: Specific error handling for different status codes
      if (res.status === 401) {
        console.log("❌ 401 Unauthorized - Token might be invalid or expired");
        Alert.alert(
          "Session Expired", 
          "Your session has expired. Please log in again.",
          [
            {
              text: "Log In",
              onPress: () => {
                // Clear all tokens
                TOKEN_KEYS.forEach(k => AsyncStorage.removeItem(k));
                // Navigate to login (adjust navigation path as needed)
                navigation.navigate("Login");
              }
            }
          ]
        );
        setItems([]);
        return;
      }

      if (res.status === 403) {
        console.log("❌ 403 Forbidden - User doesn't have permission");
        Alert.alert("Access Denied", "You don't have permission to view itineraries.");
        setItems([]);
        return;
      }

      if (res.status === 428) {
        console.log("❌ 428 Precondition Required - Profile incomplete");
        Alert.alert(
          "Complete Your Profile",
          "Please complete your profile to access itineraries.",
          [
            {
              text: "Go to Profile",
              onPress: () => navigation.navigate("Profile")
            }
          ]
        );
        setItems([]);
        return;
      }

      if (!res.ok) {
        const errorMsg = data?.error || data?.message || `HTTP ${res.status}`;
        console.error(`❌ Request failed: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      console.log("✅ Data received:", Array.isArray(data) ? `${data.length} items` : "object");
      
      // ✅ Handle both array and object responses
      const finalItems = Array.isArray(data) ? data : (data?.items || data?.itineraries || []);
      console.log("✅ Final items count:", finalItems.length);
      
      setItems(finalItems);

    } catch (e) {
      console.error("❌ Fetch itineraries error:", e);
      console.error("Error stack:", e.stack);
      
      Alert.alert(
        "Error", 
        `Unable to load your itineraries.\n\nError: ${e.message}`,
        [
          { text: "Retry", onPress: () => fetchData() },
          { text: "Cancel", style: "cancel" }
        ]
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const onView = (it) => {
    const id = it?.id ?? it?._id;
    navigation.navigate("ItineraryDetails", { id, itinerary: it });
  };

  const onEdit = (it) => navigation.navigate("EditItinerary", { edit: true, itinerary: it });

  // ✅ ENHANCED: Better delete error handling
  const doDelete = async (it) => {
    const id = it?.id ?? it?._id;
    if (!id || deletingId) return;
    
    const token = await getAuthToken();
    if (!token) {
      Alert.alert("Not logged in", "Please log in again.");
      return;
    }

    setDeletingId(id);
    const prev = items;
    setItems((cur) => cur.filter((x) => (x.id ?? x._id) !== id));

    try {
      console.log("🗑️ Deleting itinerary:", id);
      
      const res = await fetch(`${API_BASE}/itineraries/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📥 Delete response status:", res.status);

      if (res.status === 204 || res.status === 200) {
        console.log("✅ Delete successful");
        Alert.alert("Success", "Itinerary deleted successfully");
        return;
      }

      const raw = await res.text();
      let j = null;
      try { j = raw ? JSON.parse(raw) : null; } catch {}
      
      setItems(prev); // rollback

      const msgMap = {
        401: "Your session expired. Please log in again.",
        403: "You don't have permission to delete this itinerary.",
        404: "Itinerary not found (maybe already deleted).",
        428: "Please complete your profile to continue.",
      };
      
      const msg = j?.error || j?.message || msgMap[res.status] || `Failed (HTTP ${res.status})`;
      console.error("❌ Delete failed:", msg);
      Alert.alert("Delete failed", msg);
      
    } catch (err) {
      console.error("❌ Delete error:", err);
      setItems(prev); // rollback
      Alert.alert("Network Error", "Could not reach server. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (it) => {
    if (Platform.OS === "web") {
      const ok = typeof window !== "undefined" ? window.confirm("Delete itinerary? This action cannot be undone.") : false;
      if (ok) doDelete(it);
      return;
    }
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Delete itinerary?",
          message: "This action cannot be undone.",
          options: ["Cancel", "Delete"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          userInterfaceStyle: "light",
        },
        (idx) => {
          if (idx === 1) doDelete(it);
        }
      );
      return;
    }
    Alert.alert("Delete itinerary?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => doDelete(it) },
    ]);
  };

  const renderItem = ({ item }) => {
    const id = item.id ?? item._id;
    const isDeleting = deletingId === id;

    return (
      <View
        style={[
          styles.cardWrap,
          columns > 1 && { width: `${100 / columns}%` },
        ]}
      >
        <ItineraryCard 
          item={item}
          onPress={() => onView(item)}
          onView={() => onView(item)}
          onEdit={() => onEdit(item)}
          onDelete={() => confirmDelete(item)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backPill} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backText}>Back to Hub</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Itineraries</Text>
      </View>

      <FlatList
        data={items}
        key={columns}
        renderItem={renderItem}
        keyExtractor={(it, i) => String(it?.id ?? it?._id ?? i)}
        numColumns={columns}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: 24 + insets.bottom,
            paddingHorizontal: H_PADDING - GUTTER / 2,
            rowGap: GUTTER,
          },
          items.length === 0 && { flexGrow: 1, justifyContent: "center" },
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="folder-open-outline" size={36} color={SUBTEXT} />
              <Text style={styles.emptyTitle}>No itineraries yet</Text>
              <Text style={styles.emptySub}>Create your first trip to see it here.</Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate("CreateItinerary")}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>Create Itinerary</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f9fc" },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "#f7f9fc",
  },
  backPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  backText: { fontWeight: "800", color: "#0f172a" },
  title: { fontSize: 20, fontWeight: "800", color: PRIMARY, marginLeft: 2 },
  listContent: {},
  cardWrap: {
    flexGrow: 1,
    paddingHorizontal: GUTTER / 2,
  },
  empty: { alignItems: "center", gap: 8 },
  emptyTitle: { fontWeight: "800", color: "#0f172a", marginTop: 6 },
  emptySub: { color: SUBTEXT },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },
});