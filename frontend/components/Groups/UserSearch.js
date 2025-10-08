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
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import getBaseURL from "../../config/env"; // existing env.js

// const API_BASE_URL = getBaseURL();

// const MIN_SEARCH_LENGTH = 2;
// const DEBOUNCE_MS = 350;

// /**
//  * Props:
//  *  - groupId (number)                 // required to invite
//  *  - alreadyMemberIds: number[]       // disable rows for existing members
//  *  - pendingInviteeIds: number[]      // disable rows already invited
//  *  - onInvited?: (userId:number, inviteId?:number) => void
//  */
// export default function UserSearch({
//   groupId,
//   alreadyMemberIds = [],
//   pendingInviteeIds = [],
//   onInvited,
// }) {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errText, setErrText] = useState(null);
//   const [results, setResults] = useState([]);
//   const [rowBusy, setRowBusy] = useState({});
//   const [auth, setAuth] = useState({ token: null, userId: null });

//   const timerRef = useRef(null);

//   // Load token + userId from AsyncStorage
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet([
//         "token",
//         "userId",
//       ]);
//       setAuth({
//         token: token || null,
//         userId: userIdRaw ? Number(userIdRaw) : null,
//       });
//     })();
//   }, []);

//   // Build headers; don't set Content-Type for GET without body
//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   // Debounced search (uses /search/users unchanged)
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
//             { method: "GET", headers: authHeaders }
//           );
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           const data = await res.json();
//           const list = (data.users || []).map((u) => ({
//             id: Number(u.id),
//             email: u.email,
//             first_name: u.first_name || "",
//             last_name: u.last_name || "",
//             image_url: u.image_url,
//           }));
//           setResults(list);
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
//   }, [query, authHeaders]);

//   const isDisabled = (userId) => {
//     if (!groupId) return true;
//     if (alreadyMemberIds.includes(Number(userId))) return true;
//     if (pendingInviteeIds.includes(Number(userId))) return true;
//     return !!rowBusy[userId];
//   };

//   const onInvite = async (userId) => {
//     if (!groupId) {
//       Alert.alert("Missing group", "No group selected to invite into.");
//       return;
//     }
//     try {
//       setRowBusy((p) => ({ ...p, [userId]: true }));
//       // Use group API for invites; search API stays the same
//       // POST /groups/:group_id/invites?invitee_id=123
//       const res = await fetch(
//         `${API_BASE_URL}/groups/${groupId}/invites?invitee_id=${encodeURIComponent(userId)}`,
//         { method: "POST", headers: { ...authHeaders } }
//       );
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json(); // { invite_id, status, ... } if your backend returns it
//       onInvited?.(userId, Number(data?.invite_id));
//       Alert.alert("Invited", "User has been invited.");
//     } catch (e) {
//       Alert.alert("Error", e?.message || "Failed to invite user.");
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
//     const disabled = isDisabled(item.id);
//     const alreadyMember = alreadyMemberIds.includes(item.id);
//     const isPending = pendingInviteeIds.includes(item.id);

//     let btnText = "Invite";
//     if (alreadyMember) btnText = "Member";
//     else if (isPending) btnText = "Invited";

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
//           onPress={() => onInvite(item.id)}
//           disabled={disabled}
//           style={[
//             styles.inviteBtn,
//             (alreadyMember || isPending) && styles.inviteBtnMuted,
//             disabled && { opacity: 0.6 },
//           ]}
//         >
//           <Text
//             style={[
//               styles.inviteText,
//               (alreadyMember || isPending) && styles.inviteTextMuted,
//             ]}
//           >
//             {btnText}
//           </Text>
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
//         <Text style={styles.title}>Invite Users</Text>
//         <Text style={styles.subtitle}>Search by name or email to invite.</Text>

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

//   inviteBtn: {
//     borderRadius: 999,
//     borderWidth: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   inviteBtnMuted: {
//     backgroundColor: "#EEF3F9",
//     borderColor: COLORS.border,
//   },
//   inviteText: { color: "#FFFFFF", fontWeight: "800" },
//   inviteTextMuted: { color: "#0F172A" },
// });


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View, Text, StyleSheet, TextInput, FlatList, Image,
//   ActivityIndicator, TouchableOpacity, Platform, SafeAreaView, Alert
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import getBaseURL from "../../config/env";

// const API_BASE_URL = getBaseURL();

// const MIN_SEARCH_LENGTH = 2;
// const DEBOUNCE_MS = 350;

// /**
//  * Props:
//  *  - groupId (number)
//  *  - alreadyMemberIds: number[]
//  *  - pendingInviteeIds: number[]
//  *  - onInvited?: (userId:number, inviteId?:number) => void
//  */
// export default function UserSearch({
//   groupId,
//   alreadyMemberIds = [],
//   pendingInviteeIds = [],
//   onInvited,
// }) {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errText, setErrText] = useState(null);
//   const [results, setResults] = useState([]);
//   const [rowBusy, setRowBusy] = useState({});
//   const [auth, setAuth] = useState({ token: null, userId: null });

//   const timerRef = useRef(null);

//   // Load token + userId from AsyncStorage
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet([
//         "token",
//         "userId",
//       ]);
//       setAuth({
//         token: token || null,
//         userId: userIdRaw ? Number(userIdRaw) : null,
//       });
//     })();
//   }, []);

//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (token) h.Authorization = `Bearer ${token}`;
//     return h;
//   }, [token]);

//   // Debounced search (UNCHANGED API)
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
//             { method: "GET", headers: authHeaders }
//           );
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           const data = await res.json();
//           const list = (data.users || []).map((u) => ({
//             id: Number(u.id),
//             email: u.email,
//             first_name: u.first_name || "",
//             last_name: u.last_name || "",
//             image_url: u.image_url,
//           }));
//           setResults(list);
//         } catch (e) {
//           setErrText(e?.message || "Search failed");
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }, DEBOUNCE_MS);

//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [query, authHeaders]);

//   const isDisabled = (userId) => {
//     if (!groupId) return true;
//     if (alreadyMemberIds.includes(Number(userId))) return true;
//     if (pendingInviteeIds.includes(Number(userId))) return true;
//     return !!rowBusy[userId];
//   };

//   const onInvite = async (userId) => {
//     if (!groupId) {
//       Alert.alert("Missing group", "No group selected to invite into.");
//       return;
//     }
//     try {
//       setRowBusy((p) => ({ ...p, [userId]: true }));
//       // Use api client so auth is included for group endpoint
//       const res = await api.post(`/groups/${groupId}/invites`, null, {
//         params: { invitee_id: userId },
//       });
//       const data = res.data || {};
//       onInvited?.(userId, Number(data?.invite_id));
//       Alert.alert("Invited", "User has been invited.");
//     } catch (e) {
//       Alert.alert("Error", e?.message || "Failed to invite user.");
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
//     const disabled = isDisabled(item.id);
//     const alreadyMember = alreadyMemberIds.includes(item.id);
//     const isPending = pendingInviteeIds.includes(item.id);

//     let btnText = "Invite";
//     if (alreadyMember) btnText = "Member";
//     else if (isPending) btnText = "Invited";

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
//           onPress={() => onInvite(item.id)}
//           disabled={disabled}
//           style={[
//             styles.inviteBtn,
//             (alreadyMember || isPending) && styles.inviteBtnMuted,
//             disabled && { opacity: 0.6 },
//           ]}
//         >
//           <Text
//             style={[
//               styles.inviteText,
//               (alreadyMember || isPending) && styles.inviteTextMuted,
//             ]}
//           >
//             {btnText}
//           </Text>
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
//         <Text style={styles.title}>Invite Users</Text>
//         <Text style={styles.subtitle}>Search by name or email to invite into this group.</Text>

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

//   inviteBtn: {
//     borderRadius: 999,
//     borderWidth: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   inviteBtnMuted: {
//     backgroundColor: "#EEF3F9",
//     borderColor: COLORS.border,
//   },
//   inviteText: { color: "#FFFFFF", fontWeight: "800" },
//   inviteTextMuted: { color: "#0F172A" },
// });
// components/Groups/UserSearch.js
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View, Text, StyleSheet, TextInput, FlatList, Image,
//   ActivityIndicator, TouchableOpacity, Platform, SafeAreaView, Alert
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import getBaseURL from "../../config/env";
// import api from "../../api"; // <-- IMPORTANT: use your configured API client for group endpoints

// const API_BASE_URL = getBaseURL();

// const MIN_SEARCH_LENGTH = 2;
// const DEBOUNCE_MS = 350;

// /**
//  * Props:
//  *  - groupId (number)
//  *  - alreadyMemberIds: number[]
//  *  - pendingInviteeIds: number[]
//  *  - onInvited?: (userId:number, inviteId?:number) => void
//  */
// export default function UserSearch({
//   groupId,
//   alreadyMemberIds = [],
//   pendingInviteeIds = [],
//   onInvited,
// }) {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errText, setErrText] = useState(null);
//   const [results, setResults] = useState([]);
//   const [rowBusy, setRowBusy] = useState({});
//   const [auth, setAuth] = useState({ token: null, userId: null });

//   const timerRef = useRef(null);

//   /* -------- load token + userId -------- */
//   useEffect(() => {
//     (async () => {
//       try {
//         const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
//         const next = { token: token || null, userId: userIdRaw ? Number(userIdRaw) : null };
//         console.log("[UserSearch] boot auth =", next);
//         setAuth(next);
//       } catch (e) {
//         console.log("[UserSearch] boot auth error:", e);
//         setAuth({ token: null, userId: null });
//       }
//     })();
//   }, []);

//   /* -------- build headers for SEARCH only -------- */
//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     console.log("[UserSearch] authHeaders (for search):", h);
//     return h;
//   }, [auth.token]);

//   /* -------- debounced search (uses fetch) -------- */
//   useEffect(() => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     const trimmed = (query || "").trim();
//     console.log("[UserSearch] query changed ->", trimmed);

//     if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) {
//       console.log("[UserSearch] query too short, clearing results");
//       setResults([]);
//       setErrText(null);
//       return;
//     }

//     timerRef.current = setTimeout(() => {
//       (async () => {
//         try {
//           setLoading(true);
//           setErrText(null);
//           const url = `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmed)}`;
//           console.log("[UserSearch] SEARCH GET:", url, "headers:", authHeaders);
//           const res = await fetch(url, { method: "GET", headers: authHeaders });
//           console.log("[UserSearch] SEARCH status:", res.status);
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           const data = await res.json();
//           console.log("[UserSearch] SEARCH payload keys:", Object.keys(data || {}));
//           const list = (data.users || []).map((u) => ({
//             id: Number(u.id),
//             email: u.email,
//             first_name: u.first_name || "",
//             last_name: u.last_name || "",
//             image_url: u.image_url,
//           }));
//           console.log("[UserSearch] SEARCH mapped length:", list.length);
//           setResults(list);
//         } catch (e) {
//           console.log("[UserSearch] SEARCH error:", e?.message || e);
//           setErrText(e?.message || "Search failed");
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }, DEBOUNCE_MS);

//     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   }, [query, authHeaders]);

//   /* -------- helpers -------- */
//   const isDisabled = (userId) => {
//     const disabled =
//       !groupId ||
//       alreadyMemberIds.includes(Number(userId)) ||
//       pendingInviteeIds.includes(Number(userId)) ||
//       !!rowBusy[userId];
//     if (disabled) {
//       console.log("[UserSearch] row disabled", {
//         userId,
//         reason: {
//           noGroup: !groupId,
//           alreadyMember: alreadyMemberIds.includes(Number(userId)),
//           pending: pendingInviteeIds.includes(Number(userId)),
//           rowBusy: !!rowBusy[userId],
//         },
//       });
//     }
//     return disabled;
//   };

//   const onInvite = async (userId) => {
//     if (!groupId) {
//       Alert.alert("Missing group", "No group selected to invite into.");
//       return;
//     }
//     try {
//       setRowBusy((p) => ({ ...p, [userId]: true }));
//       console.log("[UserSearch] INVITE -> POST /groups/%s/invites invitee_id=%s", groupId, userId);
//       const res = await api.post(`/groups/${groupId}/invites`, null, {
//         params: { invitee_id: userId },
//       });
//       console.log("[UserSearch] INVITE status:", res?.status, "data:", res?.data);
//       const data = res?.data || {};
//       onInvited?.(userId, Number(data?.invite_id));
//       Alert.alert("Invited", "User has been invited.");
//     } catch (e) {
//       console.log("[UserSearch] INVITE error:", e?.message || e);
//       Alert.alert("Error", e?.message || "Failed to invite user.");
//     } finally {
//       setRowBusy((p) => {
//         const c = { ...p };
//         delete c[userId];
//         return c;
//       });
//     }
//   };

//   /* -------- row renderer -------- */
//   const renderItem = ({ item }) => {
//     const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");
//     const disabled = isDisabled(item.id);
//     const alreadyMember = alreadyMemberIds.includes(item.id);
//     const isPending = pendingInviteeIds.includes(item.id);

//     let btnText = "Invite";
//     if (alreadyMember) btnText = "Member";
//     else if (isPending) btnText = "Invited";

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
//           onPress={() => onInvite(item.id)}
//           disabled={disabled}
//           style={[
//             styles.inviteBtn,
//             (alreadyMember || isPending) && styles.inviteBtnMuted,
//             disabled && { opacity: 0.6 },
//           ]}
//         >
//           <Text
//             style={[
//               styles.inviteText,
//               (alreadyMember || isPending) && styles.inviteTextMuted,
//             ]}
//           >
//             {btnText}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const showPanel =
//     loading ||
//     results.length > 0 ||
//     ((query || "").trim().length >= MIN_SEARCH_LENGTH && !loading);

//   console.log("[UserSearch] render: groupId=%s results=%d loading=%s", groupId, results.length, loading);

//   return (
//     <SafeAreaView style={styles.page}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Invite Users</Text>
//         <Text style={styles.subtitle}>Search by name or email to invite into this group.</Text>

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

//   inviteBtn: {
//     borderRadius: 999,
//     borderWidth: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   inviteBtnMuted: {
//     backgroundColor: "#EEF3F9",
//     borderColor: COLORS.border,
//   },
//   inviteText: { color: "#FFFFFF", fontWeight: "800" },
//   inviteTextMuted: { color: "#0F172A" },
// });


import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, FlatList, Image,
  ActivityIndicator, TouchableOpacity, Platform, SafeAreaView, Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import getBaseURL from "../../config/env";

const API_BASE_URL = getBaseURL();

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_MS = 350;

/**
 * Props:
 *  - groupId (number)
 *  - alreadyMemberIds: number[]
 *  - pendingInviteeIds: number[]
 *  - onInvited?: (userId:number, inviteId?:number) => void
 */
export default function UserSearch({
  groupId,
  alreadyMemberIds = [],
  pendingInviteeIds = [],
  onInvited,
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errText, setErrText] = useState(null);
  const [results, setResults] = useState([]);
  const [rowBusy, setRowBusy] = useState({});
  const [auth, setAuth] = useState({ token: null, userId: null });

  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
      const next = { token: token || null, userId: userIdRaw ? Number(userIdRaw) : null };
      console.log("[UserSearch] boot auth =", { hasToken: !!next.token, uid: next.userId });
      setAuth(next);
    })();
  }, []);

  // ✅ use auth.token (not undefined `token`)
  const authHeaders = useMemo(() => {
    const h = {};
    if (auth.token) h.Authorization = `Bearer ${auth.token}`;
    return h;
  }, [auth.token]);

  // Debounced search using your SEARCH API
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
          const url = `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmed)}`;
          console.log("[UserSearch] GET", url, "headers:", authHeaders);
          const res = await fetch(url, { method: "GET", headers: { ...authHeaders } });
          console.log("[UserSearch] search status:", res.status);
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
          console.log("[UserSearch] search error:", e?.message || e);
          setErrText(e?.message || "Search failed");
          setResults([]);
        } finally {
          setLoading(false);
        }
      })();
    }, DEBOUNCE_MS);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, authHeaders]);

  const isDisabled = (userId) => {
    return (
      !groupId ||
      alreadyMemberIds.includes(Number(userId)) ||
      pendingInviteeIds.includes(Number(userId)) ||
      !!rowBusy[userId]
    );
  };

  // Invite via your groups endpoint: POST /groups/:group_id/invites?invitee_id=123
  const onInvite = async (userId) => {
    if (!groupId) {
      Alert.alert("Missing group", "No group selected to invite into.");
      return;
    }
    try {
      setRowBusy((p) => ({ ...p, [userId]: true }));
      const url = `${API_BASE_URL}/groups/${groupId}/invites?invitee_id=${encodeURIComponent(userId)}`;
      console.log("[UserSearch] POST", url, "headers:", authHeaders);
      const res = await fetch(url, { method: "POST", headers: { ...authHeaders } });
      console.log("[UserSearch] invite status:", res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({}));
      onInvited?.(userId, Number(data?.invite_id));
      Alert.alert("Invited", "User has been invited.");
    } catch (e) {
      console.log("[UserSearch] invite error:", e?.message || e);
      Alert.alert("Error", e?.message || "Failed to invite user.");
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
    const disabled = isDisabled(item.id);
    const alreadyMember = alreadyMemberIds.includes(item.id);
    const isPending = pendingInviteeIds.includes(item.id);

    let btnText = "Invite";
    if (alreadyMember) btnText = "Member";
    else if (isPending) btnText = "Invited";

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
          onPress={() => onInvite(item.id)}
          disabled={disabled}
          style={[
            styles.inviteBtn,
            (alreadyMember || isPending) && styles.inviteBtnMuted,
            disabled && { opacity: 0.6 },
          ]}
        >
          <Text
            style={[
              styles.inviteText,
              (alreadyMember || isPending) && styles.inviteTextMuted,
            ]}
          >
            {btnText}
          </Text>
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
        <Text style={styles.title}>Invite Users</Text>
        <Text style={styles.subtitle}>Search by name or email to invite into this group.</Text>

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

  inviteBtn: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  inviteBtnMuted: {
    backgroundColor: "#EEF3F9",
    borderColor: COLORS.border,
  },
  inviteText: { color: "#FFFFFF", fontWeight: "800" },
  inviteTextMuted: { color: "#0F172A" },
});
