// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// // ⬇️ Replace this with your real config import
// // e.g. import { API_BASE_URL } from '../../config';
// const API_BASE_URL = process.env.EXPO_PUBLIC_API || 'http://localhost:8080';

// // ⬇️ Replace this with your real auth helper (context/secure store/etc.)
// function getAuthToken() {
//   // return AuthStore.getToken() || null;
//   return null;
// }

// const MIN_SEARCH_LENGTH = 2;
// const DEBOUNCE_MS = 350;

// export default function UserSearch({ currentUserId, onClose }) {
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errText, setErrText] = useState(null);
//   const [results, setResults] = useState([]);
//   const [followingMap, setFollowingMap] = useState({}); // { [userId]: true }

//   const timerRef = useRef(null);

//   const headers = useMemo(() => {
//     const h = { 'Content-Type': 'application/json' };
//     const token = getAuthToken();
//     if (token) h.Authorization = `Bearer ${token}`;
//     return h;
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     const trimmed = (query || '').trim();

//     if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) {
//       setResults([]);
//       setErrText(null);
//       return;
//     }

//     timerRef.current = setTimeout(() => {
//       (async () => {
//         try {
//           setLoading(true);
//           setErrText(null);

//           const res = await fetch(
//             `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmed)}`,
//             { method: 'GET', headers }
//           );
//           if (!res.ok) {
//             const t = await res.text().catch(() => '');
//             throw new Error(t || `HTTP ${res.status}`);
//           }
//           const data = await res.json();
//           const normalized = (data.users || []).map((u) => ({
//             id: u.id,
//             email: u.email,
//             first_name: u.first_name || '',
//             last_name: u.last_name || '',
//             image_url: u.image_url,
//           }));
//           setResults(normalized);
//         } catch (e) {
//           setErrText(e?.message || 'Search failed');
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }, DEBOUNCE_MS);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [query, headers]);

//   const onFollowToggle = async (userId) => {
//     if (!currentUserId || userId === currentUserId) return;

//     const isFollowing = !!followingMap[userId];

//     try {
//       if (!isFollowing) {
//         // Follow → POST /social/followers
//         const body = {
//           follower_id: currentUserId,
//           following_id: userId,
//           status: 'pending', // or let backend default
//         };
//         const res = await fetch(`${API_BASE_URL}/social/followers`, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify(body),
//         });
//         if (!res.ok) {
//           const t = await res.text().catch(() => '');
//           throw new Error(t || `HTTP ${res.status}`);
//         }
//         setFollowingMap((prev) => ({ ...prev, [userId]: true }));
//       } else {
//         // Unfollow → DELETE /social/followers/:follower/:following
//         const res = await fetch(
//           `${API_BASE_URL}/social/followers/${currentUserId}/${userId}`,
//           { method: 'DELETE', headers }
//         );
//         if (!res.ok) {
//           const t = await res.text().catch(() => '');
//           throw new Error(t || `HTTP ${res.status}`);
//         }
//         setFollowingMap((prev) => {
//           const copy = { ...prev };
//           delete copy[userId];
//           return copy;
//         });
//       }
//     } catch (e) {
//       setErrText(e?.message || 'Operation failed');
//     }
//   };

//   const renderItem = ({ item }) => {
//     const fullName = [item.first_name, item.last_name].filter(Boolean).join(' ');
//     const isFollowing = !!followingMap[item.id];

//     return (
//       <View style={styles.resultRow}>
//         <Image
//           source={{ uri: item.image_url || 'https://placehold.co/100x100?text=U' }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.primaryText} numberOfLines={1}>
//             {fullName || item.email}
//           </Text>
//           <Text style={styles.secondaryText} numberOfLines={1}>
//             {item.email}
//           </Text>
//         </View>

//         <TouchableOpacity
//           onPress={() => onFollowToggle(item.id)}
//           activeOpacity={0.9}
//           style={[styles.chip, isFollowing ? styles.chipFollowing : styles.chipFollow]}
//         >
//           <Text style={[styles.chipText, isFollowing ? styles.chipTextFollowing : styles.chipTextFollow]}>
//             {isFollowing ? 'Following' : 'Follow'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <Text style={styles.h1}>Search Users</Text>
//         {onClose ? (
//           <TouchableOpacity onPress={onClose} style={styles.close} activeOpacity={0.8}>
//             <Ionicons name="close" size={18} color={COLORS.text} />
//           </TouchableOpacity>
//         ) : null}
//       </View>

//       <Text style={styles.lead}>Find travelers and vendors to follow.</Text>

//       {/* Search input */}
//       <View style={styles.searchWrap}>
//         <Ionicons
//           name={Platform.OS === 'ios' ? 'search' : 'search-outline'}
//           size={18}
//           color={COLORS.subtext}
//           style={{ marginRight: 8 }}
//         />
//         <TextInput
//           placeholder="Search by name or email…"
//           placeholderTextColor="#8CA0B3"
//           autoCapitalize="none"
//           autoCorrect={false}
//           value={query}
//           onChangeText={setQuery}
//           style={styles.input}
//         />
//       </View>

//       {/* Hints / errors */}
//       {query.length > 0 && query.trim().length < MIN_SEARCH_LENGTH ? (
//         <Text style={styles.hint}>Type at least { MIN_SEARCH_LENGTH } characters to search</Text>
//       ) : null}

//       {errText ? (
//         <View style={styles.errBox}>
//           <Ionicons name="alert-circle" size={16} color="#B42318" style={{ marginRight: 6 }} />
//           <Text style={styles.errText}>{errText}</Text>
//         </View>
//       ) : null}

//       {/* Results Card */}
//       <View style={styles.card}>
//         {loading ? (
//           <View style={styles.loading}>
//             <ActivityIndicator />
//             <Text style={styles.loadingText}>Searching…</Text>
//           </View>
//         ) : results.length === 0 && query.trim().length >= MIN_SEARCH_LENGTH ? (
//           <View style={styles.empty}>
//             <Text style={styles.emptyText}>No results for “{query.trim()}”</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={results}
//             keyExtractor={(u) => String(u.id)}
//             renderItem={renderItem}
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//             keyboardShouldPersistTaps="handled"
//             contentContainerStyle={{ paddingVertical: 6 }}
//           />
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// /* ---- theme & styles to match your RN design ---- */
// const COLORS = {
//   bg: '#F7F9FC',
//   card: '#FFFFFF',
//   text: '#003366',
//   subtext: '#64748B',
//   primary: '#0F70F0',
//   border: '#E9EDF2',
// };

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: COLORS.bg },
//   container: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 18, maxWidth: 900, alignSelf: 'center' },

//   headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   h1: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },

//   close: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: '#FFFFFF',
//   },

//   lead: { marginTop: 6, fontSize: 14, color: '#333', marginBottom: 12 },

//   searchWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === 'ios' ? 10 : 8,
//     marginBottom: 8,
//   },
//   input: { flex: 1, color: COLORS.text, fontSize: 16 },

//   hint: { color: COLORS.subtext, marginBottom: 8 },

//   errBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FEF3F2',
//     borderWidth: 1,
//     borderColor: '#FEE4E2',
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     marginBottom: 8,
//   },
//   errText: { color: '#B42318', fontWeight: '600' },

//   card: {
//     backgroundColor: COLORS.card,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 6,
//   },

//   loading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
//   loadingText: { color: COLORS.subtext, fontWeight: '600', marginTop: 6 },

//   empty: { alignItems: 'center', paddingVertical: 24 },
//   emptyText: { color: COLORS.subtext, fontWeight: '600' },

//   resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 },
//   avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 10, backgroundColor: '#EAF0F6' },
//   primaryText: { color: '#0F172A', fontWeight: '700' },
//   secondaryText: { color: '#5B6B7B' },

//   separator: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 62 },

//   chip: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 999,
//     borderWidth: 1,
//   },
//   chipFollow: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   chipFollowing: { backgroundColor: '#EEF3F9', borderColor: COLORS.border },
//   chipText: { fontWeight: '800' },
//   chipTextFollow: { color: '#FFFFFF' },
//   chipTextFollowing: { color: '#0F172A' },
// });


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API || "http://localhost:8080";

// function getAuthToken() {
//   return null; // hook into your real secure store later
// }

// const MIN_SEARCH_LENGTH = 2;
// const DEBOUNCE_MS = 350;

// export default function UserSearch({ currentUserId, onClose }) {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errText, setErrText] = useState(null);
//   const [results, setResults] = useState([]);
//   const [followingMap, setFollowingMap] = useState({});
//   const timerRef = useRef(null);

//   const headers = useMemo(() => {
//     const h = { "Content-Type": "application/json" };
//     const token = getAuthToken();
//     if (token) h.Authorization = `Bearer ${token}`;
//     return h;
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     const trimmed = (query || "").trim();

//     if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) {
//       setResults([]);
//       setErrText(null);
//       return;
//     }

//     timerRef.current = setTimeout(() => {
//       (async () => {
//         try {
//           setLoading(true);
//           setErrText(null);
//           const res = await fetch(
//             `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmed)}`,
//             { method: "GET", headers }
//           );
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           const data = await res.json();
//           setResults(
//             (data.users || []).map((u) => ({
//               id: u.id,
//               email: u.email,
//               first_name: u.first_name || "",
//               last_name: u.last_name || "",
//               image_url: u.image_url,
//             }))
//           );
//         } catch (e) {
//           setErrText(e?.message || "Search failed");
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }, DEBOUNCE_MS);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [query, headers]);

//   const onFollowToggle = async (userId) => {
//     if (!currentUserId || userId === currentUserId) return;
//     const isFollowing = !!followingMap[userId];

//     try {
//       if (!isFollowing) {
//         await fetch(`${API_BASE_URL}/social/followers`, {
//           method: "POST",
//           headers,
//           body: JSON.stringify({
//             follower_id: currentUserId,
//             following_id: userId,
//             status: "pending",
//           }),
//         });
//         setFollowingMap((p) => ({ ...p, [userId]: true }));
//       } else {
//         await fetch(
//           `${API_BASE_URL}/social/followers/${currentUserId}/${userId}`,
//           { method: "DELETE", headers }
//         );
//         setFollowingMap((p) => {
//           const c = { ...p };
//           delete c[userId];
//           return c;
//         });
//       }
//     } catch (e) {
//       setErrText(e?.message || "Operation failed");
//     }
//   };

//   const renderItem = ({ item }) => {
//     const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");
//     const isFollowing = !!followingMap[item.id];

//     return (
//       <View style={styles.userCard}>
//         <Image
//           source={{
//             uri: item.image_url || "https://placehold.co/100x100?text=U",
//           }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1 }}>
//           <Text style={styles.name}>{fullName || item.email}</Text>
//           <Text style={styles.email}>{item.email}</Text>
//         </View>
//         <TouchableOpacity
//           onPress={() => onFollowToggle(item.id)}
//           style={[
//             styles.followBtn,
//             isFollowing ? styles.btnFollowing : styles.btnFollow,
//           ]}
//         >
//           <Text
//             style={[
//               styles.followText,
//               isFollowing ? styles.textFollowing : styles.textFollow,
//             ]}
//           >
//             {isFollowing ? "Following" : "Follow"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.h1}>Search Users</Text>
//       </View>
//       <Text style={styles.lead}>Find travelers and vendors to follow.</Text>

//       {/* Search box */}
//       <View style={styles.searchBox}>
//         <Ionicons
//           name={Platform.OS === "ios" ? "search" : "search-outline"}
//           size={18}
//           color="#64748B"
//           style={{ marginRight: 6 }}
//         />
//         <TextInput
//           placeholder="Search by name or email…"
//           placeholderTextColor="#94A3B8"
//           style={styles.input}
//           value={query}
//           onChangeText={setQuery}
//         />
//       </View>

//       {/* Feedback */}
//       {query.length > 0 && query.trim().length < MIN_SEARCH_LENGTH && (
//         <Text style={styles.hint}>
//           Type at least {MIN_SEARCH_LENGTH} characters
//         </Text>
//       )}
//       {errText && <Text style={styles.error}>{errText}</Text>}

//       {/* Results */}
//       <View style={styles.resultsCard}>
//         {loading ? (
//           <ActivityIndicator style={{ marginVertical: 20 }} />
//         ) : results.length === 0 && query.length >= MIN_SEARCH_LENGTH ? (
//           <Text style={styles.empty}>No results for “{query.trim()}”</Text>
//         ) : (
//           <FlatList
//             data={results}
//             keyExtractor={(u) => String(u.id)}
//             renderItem={renderItem}
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//           />
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const COLORS = {
//   bg: "#F7F9FC",
//   card: "#FFFFFF",
//   text: "#003366",
//   subtext: "#64748B",
//   primary: "#0F70F0",
//   border: "#E5EAF0",
// };

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: COLORS.bg },
//   container: { padding: 20, maxWidth: 800, alignSelf: "center" },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   h1: { fontSize: 22, fontWeight: "800", color: COLORS.text },
//   closeBtn: {
//     padding: 6,
//     borderRadius: 999,
//     backgroundColor: "#E2E8F0",
//   },

//   lead: {
//     marginVertical: 10,
//     fontSize: 14,
//     color: COLORS.subtext,
//   },

//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 12,
//   },
//   input: { flex: 1, fontSize: 16, color: COLORS.text },

//   hint: { color: COLORS.subtext, marginBottom: 8 },
//   error: {
//     color: "#B91C1C",
//     marginBottom: 10,
//     backgroundColor: "#FEE2E2",
//     padding: 6,
//     borderRadius: 6,
//   },

//   resultsCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 10,
//   },

//   userCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     marginRight: 12,
//     backgroundColor: "#E2E8F0",
//   },
//   name: { fontWeight: "700", color: COLORS.text },
//   email: { color: COLORS.subtext, fontSize: 13 },

//   followBtn: {
//     borderRadius: 20,
//     borderWidth: 1,
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//   },
//   btnFollow: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   btnFollowing: { backgroundColor: "#F1F5F9", borderColor: COLORS.border },
//   followText: { fontWeight: "700" },
//   textFollow: { color: "#fff" },
//   textFollowing: { color: COLORS.text },

//   empty: { textAlign: "center", marginVertical: 20, color: COLORS.subtext },
//   separator: { height: 1, backgroundColor: COLORS.border, marginLeft: 56 },
// });


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Platform,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API || "http://localhost:8080";

// function getAuthToken() {
//   return null; // hook into your secure store later
// }

// const MIN_SEARCH_LENGTH = 2;
// const DEBOUNCE_MS = 350;

// export default function UserSearch({ currentUserId }) {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errText, setErrText] = useState(null);
//   const [results, setResults] = useState([]);
//   const [followingMap, setFollowingMap] = useState({});
//   const [rowBusy, setRowBusy] = useState({}); // { [userId]: true }
//   const timerRef = useRef(null);

//   const headers = useMemo(() => {
//     const h = { "Content-Type": "application/json" };
//     const token = getAuthToken();
//     if (token) h.Authorization = `Bearer ${token}`;
//     return h;
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     const trimmed = (query || "").trim();

//     if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) {
//       setResults([]);
//       setErrText(null);
//       return;
//     }

//     timerRef.current = setTimeout(() => {
//       (async () => {
//         try {
//           setLoading(true);
//           setErrText(null);
//           const res = await fetch(
//             `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmed)}`,
//             { method: "GET", headers }
//           );
//           if (!res.ok) {
//             const t = await res.text().catch(() => "");
//             throw new Error(t || `HTTP ${res.status}`);
//           }
//           const data = await res.json();
//           setResults(
//             (data.users || []).map((u) => ({
//               id: u.id,
//               email: u.email,
//               first_name: u.first_name || "",
//               last_name: u.last_name || "",
//               image_url: u.image_url,
//             }))
//           );
//         } catch (e) {
//           setErrText(e?.message || "Search failed");
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }, DEBOUNCE_MS);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [query, headers]);

//   const onFollowToggle = async (userId) => {
//     if (!currentUserId) {
//       setErrText("Please log in to follow users.");
//       return;
//     }
//     if (userId === currentUserId) return;

//     const isFollowing = !!followingMap[userId];
//     if (rowBusy[userId]) return;

//     try {
//       setRowBusy((p) => ({ ...p, [userId]: true }));

//       if (!isFollowing) {
//         const body = {
//           follower_id: currentUserId,
//           following_id: userId,
//           status: "pending", // backend defaults to pending too; explicit for clarity
//         };
//         const res = await fetch(`${API_BASE_URL}/social/followers`, {
//           method: "POST",
//           headers,
//           body: JSON.stringify(body),
//         });
//         if (!res.ok) {
//           const t = await res.text().catch(() => "");
//           throw new Error(t || `HTTP ${res.status}`);
//         }
//         setFollowingMap((p) => ({ ...p, [userId]: true }));
//       } else {
//         const res = await fetch(
//           `${API_BASE_URL}/social/followers/${currentUserId}/${userId}`,
//           { method: "DELETE", headers }
//         );
//         if (!res.ok) {
//           const t = await res.text().catch(() => "");
//           throw new Error(t || `HTTP ${res.status}`);
//         }
//         setFollowingMap((p) => {
//           const c = { ...p };
//           delete c[userId];
//           return c;
//         });
//       }
//     } catch (e) {
//       setErrText(e?.message || "Operation failed");
//     } finally {
//       setRowBusy((p) => {
//         const c = { ...p };
//         delete c[userId];
//         return c;
//       });
//     }
//   };

//   const renderItem = ({ item }) => {
//     const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");
//     const isFollowing = !!followingMap[item.id];
//     const busy = !!rowBusy[item.id];

//     return (
//       <View style={styles.userRow}>
//         <Image
//           source={{ uri: item.image_url || "https://placehold.co/100x100?text=U" }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1}>
//             {fullName || item.email}
//           </Text>
//           <Text style={styles.email} numberOfLines={1}>
//             {item.email}
//           </Text>
//         </View>

//         <TouchableOpacity
//           onPress={() => onFollowToggle(item.id)}
//           activeOpacity={0.9}
//           disabled={busy}
//           style={[
//             styles.followBtn,
//             isFollowing ? styles.btnFollowing : styles.btnFollow,
//             busy && { opacity: 0.6 },
//           ]}
//         >
//           {busy ? (
//             <ActivityIndicator size="small" color={isFollowing ? "#0F172A" : "#FFFFFF"} />
//           ) : (
//             <Text
//               style={[
//                 styles.followText,
//                 isFollowing ? styles.textFollowing : styles.textFollow,
//               ]}
//             >
//               {isFollowing ? "Following" : "Follow"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const showEmpty =
//     !loading && results.length === 0 && (query || "").trim().length >= MIN_SEARCH_LENGTH;

//   return (
//     <SafeAreaView style={styles.page}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.headerRow}>
//           <Text style={styles.title}>Search Users</Text>
//         </View>
//         <Text style={styles.subtitle}>Find travelers and vendors to follow.</Text>

//         {/* Search field */}
//         <View style={styles.searchBar}>
//           <Ionicons
//             name={Platform.OS === "ios" ? "search" : "search-outline"}
//             size={20}
//             color={COLORS.subtext}
//             style={{ marginRight: 8 }}
//           />
//           <TextInput
//             placeholder="Search by name or email…"
//             placeholderTextColor="#8CA0B3"
//             autoCapitalize="none"
//             autoCorrect={false}
//             value={query}
//             onChangeText={setQuery}
//             style={styles.input}
//           />
//         </View>

//         {/* Hints / errors */}
//         {query.length > 0 && query.trim().length < MIN_SEARCH_LENGTH ? (
//           <Text style={styles.hint}>Type at least {MIN_SEARCH_LENGTH} characters</Text>
//         ) : null}

//         {errText ? (
//           <View style={styles.errorBox}>
//             <Ionicons name="alert-circle" size={16} color="#B42318" style={{ marginRight: 6 }} />
//             <Text style={styles.errorText}>{errText}</Text>
//           </View>
//         ) : null}

//         {/* Results panel (fills width, proper height) */}
//         <View style={styles.panel}>
//           {loading ? (
//             <View style={styles.centerBlock}>
//               <ActivityIndicator />
//               <Text style={styles.loadingText}>Searching…</Text>
//             </View>
//           ) : showEmpty ? (
//             <View style={styles.centerBlock}>
//               <Text style={styles.emptyText}>No results for “{(query || "").trim()}”</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={results}
//               keyExtractor={(u) => String(u.id)}
//               renderItem={renderItem}
//               ItemSeparatorComponent={() => <View style={styles.separator} />}
//               keyboardShouldPersistTaps="handled"
//               contentContainerStyle={{ paddingVertical: 6 }}
//             />
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---- theme ---- */
// const COLORS = {
//   page: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#64748B",
//   primary: "#0F70F0",
//   border: "#E9EDF2",
// };

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: COLORS.page },
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 18,
//     paddingBottom: 28,
//     width: "100%",
//     // Make it feel like a real site on web (wide content)
//     ...(Platform.OS === "web" ? { maxWidth: 1200, alignSelf: "center" } : {}),
//   },

//   headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
//   title: { fontSize: 24, fontWeight: "800", color: COLORS.text, letterSpacing: 0.2 },
//   subtitle: { marginTop: 6, fontSize: 14, color: COLORS.subtext, marginBottom: 12 },

//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === "ios" ? 10 : 8,
//     marginBottom: 10,
//   },
//   input: { flex: 1, color: COLORS.text, fontSize: 16 },

//   hint: { color: COLORS.subtext, marginBottom: 8 },

//   errorBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     marginBottom: 8,
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },

//   // Big, professional results panel
//   panel: {
//     flex: 1,
//     width: "100%",
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     minHeight: 420,
//     ...(Platform.OS === "web"
//       ? { boxSizing: "border-box", boxShadow: "0 8px 24px rgba(15,58,107,0.06)" }
//       : { elevation: 2 }),
//   },

//   centerBlock: { alignItems: "center", justifyContent: "center", paddingVertical: 28 },
//   loadingText: { marginTop: 6, color: COLORS.subtext, fontWeight: "600" },
//   emptyText: { color: COLORS.subtext, fontWeight: "600" },

//   userRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 6 },
//   avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: "#EAF0F6" },
//   name: { color: "#0F172A", fontWeight: "700", fontSize: 15 },
//   email: { color: COLORS.subtext, fontSize: 13 },

//   separator: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 66 },

//   followBtn: { borderRadius: 999, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 16 },
//   btnFollow: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   btnFollowing: { backgroundColor: "#EEF3F9", borderColor: COLORS.border },
//   followText: { fontWeight: "800" },
//   textFollow: { color: "#FFFFFF" },
//   textFollowing: { color: "#0F172A" },
// });


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Platform,
//   SafeAreaView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API || "http://localhost:8080";

// const MIN_SEARCH_LENGTH = 2;
// const DEBOUNCE_MS = 350;

// export default function UserSearch() {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errText, setErrText] = useState(null);
//   const [results, setResults] = useState([]);
//   const [followingMap, setFollowingMap] = useState({});
//   const [rowBusy, setRowBusy] = useState({});
//   const [auth, setAuth] = useState({ token: null, userId: null });

//   const timerRef = useRef(null);

//   // load token + userId from AsyncStorage
//   useEffect(() => {
//     (async () => {
//       const [token, userId] = await AsyncStorage.multiGet(["token", "userId"]);
//       setAuth({
//         token: token?.[1] || null,
//         userId: userId?.[1] ? Number(userId[1]) : null,
//       });
//     })();
//   }, []);

//   const headers = useMemo(() => {
//     const h = { "Content-Type": "application/json" };
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth]);

//   // Debounced search
//   useEffect(() => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     const trimmed = (query || "").trim();

//     if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) {
//       setResults([]);
//       setErrText(null);
//       return;
//     }

//     timerRef.current = setTimeout(() => {
//       (async () => {
//         try {
//           setLoading(true);
//           setErrText(null);
//           const res = await fetch(
//             `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmed)}`,
//             { method: "GET", headers }
//           );
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           const data = await res.json();
//           setResults(
//             (data.users || []).map((u) => ({
//               id: u.id,
//               email: u.email,
//               first_name: u.first_name || "",
//               last_name: u.last_name || "",
//               image_url: u.image_url,
//             }))
//           );
//         } catch (e) {
//           setErrText(e?.message || "Search failed");
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }, DEBOUNCE_MS);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [query, headers]);

//   const onFollowToggle = async (userId) => {
//     if (!auth.userId) {
//       setErrText("Please log in to follow users.");
//       return;
//     }
//     if (userId === auth.userId) return;

//     const isFollowing = !!followingMap[userId];
//     if (rowBusy[userId]) return;

//     try {
//       setRowBusy((p) => ({ ...p, [userId]: true }));

//       if (!isFollowing) {
//         const body = {
//           follower_id: auth.userId,
//           following_id: userId,
//           status: "pending",
//         };
//         const res = await fetch(`${API_BASE_URL}/social/followers`, {
//           method: "POST",
//           headers,
//           body: JSON.stringify(body),
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         setFollowingMap((p) => ({ ...p, [userId]: true }));
//       } else {
//         const res = await fetch(
//           `${API_BASE_URL}/social/followers/${auth.userId}/${userId}`,
//           { method: "DELETE", headers }
//         );
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         setFollowingMap((p) => {
//           const c = { ...p };
//           delete c[userId];
//           return c;
//         });
//       }
//     } catch (e) {
//       setErrText(e?.message || "Operation failed");
//     } finally {
//       setRowBusy((p) => {
//         const c = { ...p };
//         delete c[userId];
//         return c;
//       });
//     }
//   };

//   const renderItem = ({ item }) => {
//     const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");
//     const isFollowing = !!followingMap[item.id];
//     const busy = !!rowBusy[item.id];

//     return (
//       <View style={styles.userRow}>
//         <Image
//           source={{ uri: item.image_url || "https://placehold.co/100x100?text=U" }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1}>
//             {fullName || item.email}
//           </Text>
//           <Text style={styles.email} numberOfLines={1}>
//             {item.email}
//           </Text>
//         </View>

//         <TouchableOpacity
//           onPress={() => onFollowToggle(item.id)}
//           disabled={busy}
//           style={[
//             styles.followBtn,
//             isFollowing ? styles.btnFollowing : styles.btnFollow,
//             busy && { opacity: 0.6 },
//           ]}
//         >
//           {busy ? (
//             <ActivityIndicator size="small" color={isFollowing ? "#0F172A" : "#FFFFFF"} />
//           ) : (
//             <Text
//               style={[
//                 styles.followText,
//                 isFollowing ? styles.textFollowing : styles.textFollow,
//               ]}
//             >
//               {isFollowing ? "Following" : "Follow"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const showPanel =
//     loading ||
//     results.length > 0 ||
//     ((query || "").trim().length >= MIN_SEARCH_LENGTH && !loading);

//   return (
//     <SafeAreaView style={styles.page}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Search Users</Text>
//         <Text style={styles.subtitle}>Find travelers and vendors to follow.</Text>

//         <View style={styles.searchBar}>
//           <Ionicons
//             name={Platform.OS === "ios" ? "search" : "search-outline"}
//             size={20}
//             color={COLORS.subtext}
//             style={{ marginRight: 8 }}
//           />
//           <TextInput
//             placeholder="Search by name or email…"
//             placeholderTextColor="#8CA0B3"
//             autoCapitalize="none"
//             autoCorrect={false}
//             value={query}
//             onChangeText={setQuery}
//             style={styles.input}
//           />
//         </View>

//         {errText ? (
//           <View style={styles.errorBox}>
//             <Ionicons name="alert-circle" size={16} color="#B42318" style={{ marginRight: 6 }} />
//             <Text style={styles.errorText}>{errText}</Text>
//           </View>
//         ) : null}

//         {showPanel && (
//           <View style={styles.panel}>
//             {loading ? (
//               <View style={styles.centerBlock}>
//                 <ActivityIndicator />
//                 <Text style={styles.loadingText}>Searching…</Text>
//               </View>
//             ) : results.length === 0 ? (
//               <View style={styles.centerBlock}>
//                 <Text style={styles.emptyText}>No results for “{(query || "").trim()}”</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={results}
//                 keyExtractor={(u) => String(u.id)}
//                 renderItem={renderItem}
//                 ItemSeparatorComponent={() => <View style={styles.separator} />}
//                 keyboardShouldPersistTaps="handled"
//                 contentContainerStyle={{ paddingVertical: 6 }}
//               />
//             )}
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---- theme ---- */
// const COLORS = {
//   page: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#64748B",
//   primary: "#0F70F0",
//   border: "#E9EDF2",
// };

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: COLORS.page },
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 18,
//     paddingBottom: 28,
//     width: "100%",
//     ...(Platform.OS === "web" ? { maxWidth: 1200, alignSelf: "center" } : {}),
//   },

//   title: { fontSize: 24, fontWeight: "800", color: COLORS.text },
//   subtitle: { marginTop: 6, fontSize: 14, color: COLORS.subtext, marginBottom: 12 },

//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === "ios" ? 10 : 8,
//     marginBottom: 10,
//   },
//   input: { flex: 1, color: COLORS.text, fontSize: 16 },

//   errorBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     marginBottom: 8,
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },

//   panel: {
//     flex: 1,
//     width: "100%",
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     minHeight: 420,
//     ...(Platform.OS === "web"
//       ? { boxSizing: "border-box", boxShadow: "0 8px 24px rgba(15,58,107,0.06)" }
//       : { elevation: 2 }),
//   },

//   centerBlock: { alignItems: "center", justifyContent: "center", paddingVertical: 28 },
//   loadingText: { marginTop: 6, color: COLORS.subtext, fontWeight: "600" },
//   emptyText: { color: COLORS.subtext, fontWeight: "600" },

//   userRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 6 },
//   avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: "#EAF0F6" },
//   name: { color: "#0F172A", fontWeight: "700", fontSize: 15 },
//   email: { color: COLORS.subtext, fontSize: 13 },

//   separator: { height: 1, backgroundColor: COLORS.border, marginLeft: 66 },

//   followBtn: { borderRadius: 999, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 16 },
//   btnFollow: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   btnFollowing: { backgroundColor: "#EEF3F9", borderColor: COLORS.border },
//   followText: { fontWeight: "800" },
//   textFollow: { color: "#FFFFFF" },
//   textFollowing: { color: "#0F172A" },
// });


// components/Social/UserSearch.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import getBaseURL from "../../config/env"; // ✅ use your existing env.js

const API_BASE_URL = getBaseURL();

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_MS = 350;

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errText, setErrText] = useState(null);
  const [results, setResults] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [rowBusy, setRowBusy] = useState({});
  const [auth, setAuth] = useState({ token: null, userId: null });

  const timerRef = useRef(null);

  // Load token + userId from AsyncStorage
  useEffect(() => {
    (async () => {
      const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet([
        "token",
        "userId",
      ]);
      setAuth({
        token: token || null,
        userId: userIdRaw ? Number(userIdRaw) : null,
      });
    })();
  }, []);

  // Build headers; don't set Content-Type for GET without body
  const authHeaders = useMemo(() => {
    const h = {};
    if (auth.token) h.Authorization = `Bearer ${auth.token}`;
    return h;
  }, [auth.token]);

  // Debounced search
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const trimmed = (query || "").trim();

    if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) {
      setResults([]);
      setErrText(null);
      return;
    }

    timerRef.current = setTimeout(() => {
      (async () => {
        try {
          setLoading(true);
          setErrText(null);
          const res = await fetch(
            `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmed)}`,
            { method: "GET", headers: authHeaders }
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const list = (data.users || []).map((u) => ({
            id: Number(u.id),
            email: u.email,
            first_name: u.first_name || "",
            last_name: u.last_name || "",
            image_url: u.image_url,
          }));
          setResults(list);
        } catch (e) {
          setErrText(e?.message || "Search failed");
          setResults([]);
        } finally {
          setLoading(false);
        }
      })();
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, authHeaders]);

  const onFollowToggle = async (userId) => {
    if (!auth.userId) {
      setErrText("Please log in to follow users.");
      return;
    }
    if (userId === auth.userId) return;

    const isFollowing = !!followingMap[userId];
    if (rowBusy[userId]) return;

    try {
      setRowBusy((p) => ({ ...p, [userId]: true }));

      if (!isFollowing) {
        const body = {
          follower_id: auth.userId,
          following_id: userId,
          status: "pending",
        };
        const res = await fetch(`${API_BASE_URL}/social/followers`, {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setFollowingMap((p) => ({ ...p, [userId]: true }));
      } else {
        const res = await fetch(
          `${API_BASE_URL}/social/followers/${auth.userId}/${userId}`,
          { method: "DELETE", headers: authHeaders }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setFollowingMap((p) => {
          const c = { ...p };
          delete c[userId];
          return c;
        });
      }
    } catch (e) {
      setErrText(e?.message || "Operation failed");
    } finally {
      setRowBusy((p) => {
        const c = { ...p };
        delete c[userId];
        return c;
      });
    }
  };

  const renderItem = ({ item }) => {
    const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");
    const isFollowing = !!followingMap[item.id];
    const busy = !!rowBusy[item.id];

    return (
      <View style={styles.userRow}>
        <Image
          source={{ uri: item.image_url || "https://placehold.co/100x100?text=U" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName || item.email}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {item.email}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onFollowToggle(item.id)}
          disabled={busy}
          style={[
            styles.followBtn,
            isFollowing ? styles.btnFollowing : styles.btnFollow,
            busy && { opacity: 0.6 },
          ]}
        >
          {busy ? (
            <ActivityIndicator size="small" color={isFollowing ? "#0F172A" : "#FFFFFF"} />
          ) : (
            <Text
              style={[
                styles.followText,
                isFollowing ? styles.textFollowing : styles.textFollow,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const showPanel =
    loading ||
    results.length > 0 ||
    ((query || "").trim().length >= MIN_SEARCH_LENGTH && !loading);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Search Users</Text>
        <Text style={styles.subtitle}>Find travelers and vendors to follow.</Text>

        <View style={styles.searchBar}>
          <Ionicons
            name={Platform.OS === "ios" ? "search" : "search-outline"}
            size={20}
            color={COLORS.subtext}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search by name or email…"
            placeholderTextColor="#8CA0B3"
            autoCapitalize="none"
            autoCorrect={false}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>

        {errText ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#B42318" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errText}</Text>
          </View>
        ) : null}

        {showPanel && (
          <View style={styles.panel}>
            {loading ? (
              <View style={styles.centerBlock}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Searching…</Text>
              </View>
            ) : results.length === 0 ? (
              <View style={styles.centerBlock}>
                <Text style={styles.emptyText}>No results for “{(query || "").trim()}”</Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(u) => String(u.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingVertical: 6 }}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---- theme ---- */
const COLORS = {
  page: "#F6FAFD",
  card: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#64748B",
  primary: "#0F70F0",
  border: "#E9EDF2",
};

/* ---- styles ---- */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.page },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    width: "100%",
    ...(Platform.OS === "web" ? { maxWidth: 1200, alignSelf: "center" } : {}),
  },

  title: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  subtitle: { marginTop: 6, fontSize: 14, color: COLORS.subtext, marginBottom: 12 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    marginBottom: 10,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  errorText: { color: "#B42318", fontWeight: "600" },

  panel: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 420,
    ...(Platform.OS === "web"
      ? { boxSizing: "border-box", boxShadow: "0 8px 24px rgba(15,58,107,0.06)" }
      : { elevation: 2 }),
  },

  centerBlock: { alignItems: "center", justifyContent: "center", paddingVertical: 28 },
  loadingText: { marginTop: 6, color: COLORS.subtext, fontWeight: "600" },
  emptyText: { color: COLORS.subtext, fontWeight: "600" },

  userRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 6 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: "#EAF0F6" },
  name: { color: "#0F172A", fontWeight: "700", fontSize: 15 },
  email: { color: COLORS.subtext, fontSize: 13 },

  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: 66 },

  followBtn: { borderRadius: 999, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 16 },
  btnFollow: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  btnFollowing: { backgroundColor: "#EEF3F9", borderColor: COLORS.border },
  followText: { fontWeight: "800" },
  textFollow: { color: "#FFFFFF" },
  textFollowing: { color: "#0F172A" },
});
