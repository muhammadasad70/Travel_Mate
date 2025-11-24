
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   ActivityIndicator,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   Pressable,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import getBaseURL from "../../config/env";
// import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";

// const API_BASE_URL = getBaseURL();

// /* --------------------------- helpers --------------------------- */
// const pick = (o, keys) => {
//   for (const k of keys) {
//     if (o && o[k] != null && o[k] !== "") return o[k];
//   }
//   return undefined;
// };
// const toInt = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

// function normalizeUser(data) {
//   const u = data?.user || data || {};
//   return {
//     id: toInt(pick(u, ["id", "Id"])),
//     first_name: pick(u, ["first_name", "FirstName"]) || "",
//     last_name: pick(u, ["last_name", "LastName"]) || "",
//     email: pick(u, ["email", "Email"]) || "",
//     username: pick(u, ["username", "Username"]) || "",
//     image_url: pick(u, ["image_url", "ImageURL", "avatar_url"]) || "",
//     bio: pick(u, ["bio", "Bio"]) || "",
//   };
// }

// function fullName(u) {
//   const name = [u?.first_name, u?.last_name].filter(Boolean).join(" ").trim();
//   if (name) return name;
//   if (u?.username) return u.username;
//   if (u?.email) return u.email.split("@")[0];
//   return u?.id ? `User #${u.id}` : "User";
// }

// /** Avatar with single-letter fallback (black bg / white text) */
// function LetterAvatar({ size = 82, name = "" }) {
//   const letter = (name?.trim()?.[0] || "U").toUpperCase();
//   return (
//     <View
//       style={{
//         width: size,
//         height: size,
//         borderRadius: size / 2,
//         backgroundColor: "#000",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Text style={{ color: "#fff", fontWeight: "800", fontSize: Math.floor(size * 0.44) }}>
//         {letter}
//       </Text>
//     </View>
//   );
// }
// function Avatar({ uri, name, size = 82 }) {
//   if (!uri) return <LetterAvatar size={size} name={name} />;
//   return (
//     <Image
//       source={{ uri }}
//       style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#EAF0F6" }}
//     />
//   );
// }

// /* =========================================================
//    Community Profile (Instagram-like header + inline posts)
//    ========================================================= */
// export default function CommunityProfileScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   const [profile, setProfile] = useState(null); // normalized user
//   const [posts, setPosts] = useState([]); // [{id,user_id,content_id,caption,created_at}]
//   const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });

//   // followers modal
//   const [followersOpen, setFollowersOpen] = useState(false);
//   const [followersLoading, setFollowersLoading] = useState(false);
//   const [followers, setFollowers] = useState([]);

//   // itinerary cache for inline cards
//   const [itCache, setItCache] = useState({}); // { [content_id]: itinerary }
//   const [itBusy, setItBusy] = useState({});   // { [content_id]: true }

//   // deleting state per post
//   const [deleting, setDeleting] = useState({}); // { [postId]: true }

//   const viewingIdFromRoute = toInt(route?.params?.userId);

//   // auth
//   useEffect(() => {
//     (async () => {
//       try {
//         const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
//         setAuth({ token: token || null, userId: userIdRaw ? Number(userIdRaw) : null });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   // headers
//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   const viewingId = useMemo(() => {
//     if (Number.isFinite(viewingIdFromRoute)) return viewingIdFromRoute;
//     if (Number.isFinite(auth.userId)) return auth.userId;
//     return null;
//   }, [auth.userId, viewingIdFromRoute]);

//   // load profile + posts + counts, and prefetch itineraries
//   const loadAll = useCallback(async () => {
//     if (!sessionReady || !viewingId) return;
//     setLoading(true);
//     setErr(null);

//     try {
//       // profile
//       const pRes = await fetch(`${API_BASE_URL}/users/${viewingId}/profile`, { headers: authHeaders });
//       if (!pRes.ok) throw new Error(`Profile HTTP ${pRes.status}`);
//       const pData = await pRes.json();
//       setProfile(normalizeUser(pData));

//       // posts (user’s posts)
//       const poRes = await fetch(`${API_BASE_URL}/users/${viewingId}/posts`, { headers: authHeaders });
//       if (!poRes.ok) throw new Error(`Posts HTTP ${poRes.status}`);
//       const poData = await poRes.json();
//       const rows = (Array.isArray(poData) ? poData : poData?.posts || []).map((p) => ({
//         id: Number(p.id),
//         user_id: Number(p.user_id),
//         content_id: Number(p.content_id),
//         caption: p.caption || "",
//         created_at: p.created_at,
//       }));
//       setPosts(rows);

//       // counts
//       const [follCountRes, wingCountRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/social/followers/${viewingId}/count`, { headers: authHeaders }),
//         fetch(`${API_BASE_URL}/social/following/${viewingId}/count`, { headers: authHeaders }),
//       ]);
//       if (!follCountRes.ok) throw new Error(`Followers Count HTTP ${follCountRes.status}`);
//       if (!wingCountRes.ok) throw new Error(`Following Count HTTP ${wingCountRes.status}`);

//       const fJson = await follCountRes.json();
//       const wJson = await wingCountRes.json();

//       setCounts({
//         posts: rows.length,
//         followers: Number(fJson?.count ?? fJson?.followers_count ?? 0),
//         following: Number(wJson?.count ?? wJson?.following_count ?? 0),
//       });

//       // prefetch itineraries for posts (once)
//       const needed = rows
//         .map((r) => r.content_id)
//         .filter((cid) => cid && !itCache[cid] && !itBusy[cid]);

//       if (needed.length) {
//         const nextBusy = { ...itBusy };
//         needed.forEach((cid) => (nextBusy[cid] = true));
//         setItBusy(nextBusy);

//         const fetched = await Promise.all(
//           needed.map(async (cid) => {
//             try {
//               const res = await fetch(`${API_BASE_URL}/users/${cid}/posts`, { headers: authHeaders });
//               if (!res.ok) return [cid, null];
//               const data = await res.json();
//               return [cid, Array.isArray(data) ? data[0] : data];
//             } catch {
//               return [cid, null];
//             }
//           })
//         );

//         const add = { ...itCache };
//         fetched.forEach(([cid, it]) => (add[cid] = it || null));
//         setItCache(add);

//         const cleared = { ...nextBusy };
//         needed.forEach((cid) => delete cleared[cid]);
//         setItBusy(cleared);
//       }
//     } catch (e) {
//       setErr(e?.message || "Failed to load profile");
//       setProfile(null);
//       setPosts([]);
//       setCounts({ posts: 0, followers: 0, following: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionReady, viewingId, authHeaders, itCache, itBusy]);

//   useEffect(() => { loadAll(); }, [loadAll]);

//   // followers list
//   const openFollowers = async () => {
//     setFollowersOpen(true);
//     setFollowersLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/social/followers/${viewingId}`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`Followers HTTP ${res.status}`);
//       const data = await res.json();
//       const list = Array.isArray(data) ? data : data?.followers || [];
//       setFollowers(list.map(normalizeUser));
//     } catch {
//       setFollowers([]);
//     } finally {
//       setFollowersLoading(false);
//     }
//   };

//   const isMe = Number(viewingId) === Number(auth.userId);
//   const displayName = fullName(profile || {});

//   /* ---------------- Delete post ---------------- */
//   const doDeletePost = useCallback(
//     async (postId) => {
//       if (!postId) return;

//       // mark deleting
//       setDeleting((d) => ({ ...d, [postId]: true }));
//       try {
//         const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
//           method: "DELETE",
//           headers: {
//             ...(authHeaders || {}),
//             "Content-Type": "application/json",
//           },
//         });

//         if (!res.ok && res.status !== 204) {
//           const msg = `Delete failed (HTTP ${res.status})`;
//           throw new Error(msg);
//         }

//         // refresh from server to stay consistent
//         await loadAll();
//       } catch (e) {
//         const msg = e?.message || "Failed to delete post";
//         if (Platform.OS === "web") {
//           // eslint-disable-next-line no-alert
//           window.alert(msg);
//         } else {
//           Alert.alert("Error", msg);
//         }
//       } finally {
//         setDeleting((d) => {
//           const c = { ...d };
//           delete c[postId];
//           return c;
//         });
//       }
//     },
//     [authHeaders, loadAll]
//   );

//   const confirmDelete = useCallback(
//     (postId) => {
//       if (Platform.OS === "web") {
//         // eslint-disable-next-line no-alert
//         const yes = window.confirm("Delete this post?");
//         if (yes) doDeletePost(postId);
//         return;
//       }
//       Alert.alert(
//         "Delete Post",
//         "Are you sure you want to delete this post?",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Delete", style: "destructive", onPress: () => doDeletePost(postId) },
//         ],
//         { cancelable: true }
//       );
//     },
//     [doDeletePost]
//   );

//   /* ---------------- UI ---------------- */
//   return (
//     <SafeAreaView style={styles.page}>
//       {/* Top bar */}
//       <View style={styles.topbar}>
//         {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.9}>
//           <Ionicons name="arrow-back" size={18} color={COLORS.text} />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity> */}
//         <Text style={styles.brand}>Community</Text>
//         <View style={{ width: 64 }} />
//       </View>

//       {/* Content */}
//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Loading profile…</Text>
//         </View>
//       ) : err ? (
//         <View style={styles.errorBox}>
//           <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
//           <Text style={styles.errorText}>{err}</Text>
//           <TouchableOpacity onPress={loadAll} style={{ marginLeft: "auto" }}>
//             <Text style={styles.link}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : !profile ? (
//         <View style={styles.center}>
//           <Text style={styles.meta}>Profile not found.</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={posts}
//           keyExtractor={(p) => String(p.id)}
//           ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//           ListHeaderComponent={
//             <ProfileHeader
//               profile={profile}
//               name={displayName}
//               counts={counts}
//               isMe={isMe}
//               onFollowersPress={openFollowers}
//               onRefresh={loadAll}
//             />
//           }
//           renderItem={({ item }) => {
//             const it = itCache[item.content_id];
//             const isDeleting = !!deleting[item.id];

//             return (
//               <View style={styles.postCard}>
//                 {/* delete row */}
//                 <View style={styles.actionRow}>
//                   <TouchableOpacity
//                     style={[styles.actionBtn, styles.actionBtnDanger, isDeleting && { opacity: 0.6 }]}
//                     onPress={() => confirmDelete(item.id)}
//                     disabled={isDeleting}
//                     accessibilityLabel="Delete post"
//                     accessibilityState={{ disabled: isDeleting }}
//                     activeOpacity={0.8}
//                   >
//                     {isDeleting ? (
//                       <ActivityIndicator size="small" />
//                     ) : (
//                       <Ionicons name="trash-outline" size={16} color="#B91C1C" />
//                     )}
//                     <Text style={[styles.actionText, styles.actionTextDanger]}>
//                       {isDeleting ? "Deleting…" : "Delete"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {!!item.caption && <Text style={styles.caption}>{item.caption}</Text>}

//                 {it ? (
//                   <ItineraryCard
//                     item={{
//                       title: it.title,
//                       city: it.city || it.destination,
//                       start_date: it.start_date,
//                       end_date: it.end_date,
//                       budget: it.budget,
//                       style: it.style,
//                       cover_url: it.cover_url,
//                       days: it.days || [],
//                     }}
//                     onPress={undefined}
//                   />
//                 ) : (
//                   <View style={styles.loadingBox}>
//                     <ActivityIndicator />
//                   </View>
//                 )}
//               </View>
//             );
//           }}
//           ListEmptyComponent={<View style={styles.emptyWrap}><Text style={styles.meta}>No posts yet.</Text></View>}
//           contentContainerStyle={{
//             paddingBottom: 24,
//             paddingHorizontal: 12,
//             paddingTop: Platform.OS === "web" ? 16 : 8,
//             ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
//           }}
//           scrollEnabled={false}
//           nestedScrollEnabled
//         />
//       )}

//       {/* Followers modal */}
//       <Modal visible={followersOpen} animationType="slide" transparent onRequestClose={() => setFollowersOpen(false)}>
//         <Pressable style={styles.sheetBackdrop} onPress={() => setFollowersOpen(false)} />
//         <View style={styles.sheet}>
//           <View style={styles.sheetHeader}>
//             <Text style={styles.sheetTitle}>Followers</Text>
//             <TouchableOpacity onPress={() => setFollowersOpen(false)}>
//               <Ionicons name="close" size={20} color={COLORS.text} />
//             </TouchableOpacity>
//           </View>

//           {followersLoading ? (
//             <View style={styles.center}>
//               <ActivityIndicator />
//             </View>
//           ) : followers.length === 0 ? (
//             <View style={styles.center}>
//               <Text style={styles.meta}>No followers yet.</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={followers}
//               keyExtractor={(u, i) => String(u?.id ?? i)}
//               ItemSeparatorComponent={() => <View style={styles.sep} />}
//               renderItem={({ item }) => {
//                 const nm = fullName(item);
//                 return (
//                   <View style={styles.followerRow}>
//                     <Avatar uri={item?.image_url} name={nm} size={40} />
//                     <View style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
//                       <Text style={styles.followerName} numberOfLines={1}>{nm}</Text>
//                       {!!item?.username && <Text style={styles.followerSub} numberOfLines={1}>@{item.username}</Text>}
//                     </View>
//                   </View>
//                 );
//               }}
//             />
//           )}
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* --------------------------- Subcomponents --------------------------- */

// function ProfileHeader({ profile, name, counts, isMe, onFollowersPress, onRefresh }) {
//   return (
//     <>
//       {/* Instagram-like top: avatar + counters + name + edit button */}
//       <View style={styles.headerRow}>
//         <Avatar uri={profile?.image_url} name={name} size={82} />

//         <View style={styles.counterWrap}>
//           <Text style={styles.counterValue}>{counts.posts}</Text>
//           <Text style={styles.counterLabel}>Posts</Text>
//         </View>
//         <TouchableOpacity onPress={onFollowersPress} activeOpacity={0.85} style={styles.counterWrap}>
//           <Text style={styles.counterValue}>{counts.followers}</Text>
//           <Text style={styles.counterLabel}>Followers</Text>
//         </TouchableOpacity>
//         <View style={styles.counterWrap}>
//           <Text style={styles.counterValue}>{counts.following}</Text>
//           <Text style={styles.counterLabel}>Following</Text>
//         </View>
//       </View>

//       <Text style={styles.name} numberOfLines={1}>{name}</Text>

//       <TouchableOpacity onPress={onRefresh} style={styles.editBtn} activeOpacity={0.9}>
//         <Text style={styles.editBtnText}>{isMe ? "Edit Profile" : "Refresh"}</Text>
//       </TouchableOpacity>

//       <View style={styles.postsHeader}>
//         <Ionicons name="grid-outline" size={16} color={COLORS.subtext} />
//         <Text style={styles.postsHeaderText}>Posts</Text>
//       </View>
//     </>
//   );
// }

// /* --------------------------- Styles --------------------------- */

// const COLORS = {
//   page: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#64748B",
//   primary: "#0F70F0",
//   border: "#EAF0F6",
// };

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: COLORS.page },

//   topbar: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingTop: Platform.OS === "android" ? 8 : 6,
//     paddingBottom: 10,
//     ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
//   },
//   backBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: "#EEF3F9",
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   backText: { color: COLORS.text, fontWeight: "800" },
//   brand: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "800",
//     color: COLORS.text,
//   },

//   center: { alignItems: "center", justifyContent: "center", padding: 20 },
//   meta: { color: COLORS.subtext, fontWeight: "600" },

//   errorBox: {
//     marginHorizontal: 16,
//     marginTop: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     ...(Platform.OS === "web" ? { maxWidth: 860, alignSelf: "center", width: "100%" } : {}),
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },

//   /* instagram-like header */
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 18,
//     paddingHorizontal: 16,
//     paddingTop: 8,
//   },
//   counterWrap: { alignItems: "center", justifyContent: "center", flex: 1 },
//   counterValue: { fontWeight: "800", color: COLORS.text, fontSize: 18 },
//   counterLabel: { color: COLORS.subtext, fontWeight: "700" },
//   name: {
//     marginTop: 8,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.text,
//   },
//   editBtn: {
//     marginTop: 8,
//     marginHorizontal: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 10,
//   },
//   editBtnText: { color: "#0F3A6B", fontWeight: "800" },

//   postsHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   postsHeaderText: { color: COLORS.subtext, fontWeight: "800" },

//   /* post list (inline ItineraryCard per post) */
//   postCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 12,
//   },
//   caption: { marginBottom: 8, color: "#0F172A", fontWeight: "600" },
//   loadingBox: {
//     height: 120,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F1F5FB",
//     borderRadius: 12,
//   },

//   emptyWrap: { padding: 24, alignItems: "center" },

//   // followers modal
//   sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
//   sheet: {
//     position: "absolute",
//     left: 0, right: 0, bottom: 0,
//     maxHeight: "70%",
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingBottom: 8,
//   },
//   sheetHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 14,
//     paddingTop: 10,
//     paddingBottom: 6,
//     borderBottomWidth: 1,
//     borderColor: COLORS.border,
//   },
//   sheetTitle: { flex: 1, textAlign: "center", fontWeight: "800", color: COLORS.text },
//   followerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//   },
//   followerName: { fontWeight: "700", color: "#0F172A" },
//   followerSub: { color: COLORS.subtext, fontSize: 12 },
//   sep: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 64 },

//   /* actions */
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 10,
//     borderWidth: 1,
//   },
//   actionBtnDanger: {
//     borderColor: "#FEE2E2",
//     backgroundColor: "#FEF2F2",
//   },
//   actionText: { fontWeight: "700" },
//   actionTextDanger: { color: "#B91C1C" },
// });









// import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   ActivityIndicator,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   Pressable,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import getBaseURL from "../../config/env";
// import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";

// const API_BASE_URL = getBaseURL();

// /* --------------------------- helpers --------------------------- */
// const pick = (o, keys) => {
//   for (const k of keys) {
//     if (o && o[k] != null && o[k] !== "") return o[k];
//   }
//   return undefined;
// };
// const toInt = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

// function normalizeUser(data) {
//   const u = data?.user || data || {};
//   return {
//     id: toInt(pick(u, ["id", "Id"])),
//     first_name: pick(u, ["first_name", "FirstName"]) || "",
//     last_name: pick(u, ["last_name", "LastName"]) || "",
//     email: pick(u, ["email", "Email"]) || "",
//     username: pick(u, ["username", "Username"]) || "",
//     image_url: pick(u, ["image_url", "ImageURL", "avatar_url"]) || "",
//     bio: pick(u, ["bio", "Bio"]) || "",
//   };
// }

// function fullName(u) {
//   const name = [u?.first_name, u?.last_name].filter(Boolean).join(" ").trim();
//   if (name) return name;
//   if (u?.username) return u.username;
//   if (u?.email) return u.email.split("@")[0];
//   return u?.id ? `User #${u.id}` : "User";
// }

// /** Avatar with single-letter fallback (black bg / white text) */
// function LetterAvatar({ size = 82, name = "" }) {
//   const letter = (name?.trim()?.[0] || "U").toUpperCase();
//   return (
//     <View
//       style={{
//         width: size,
//         height: size,
//         borderRadius: size / 2,
//         backgroundColor: "#000",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Text style={{ color: "#fff", fontWeight: "800", fontSize: Math.floor(size * 0.44) }}>
//         {letter}
//       </Text>
//     </View>
//   );
// }
// function Avatar({ uri, name, size = 82 }) {
//   if (!uri) return <LetterAvatar size={size} name={name} />;
//   return (
//     <Image
//       source={{ uri }}
//       style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#EAF0F6" }}
//     />
//   );
// }

// /* =========================================================
//    Community Profile (Instagram-like header + inline posts)
//    ========================================================= */
// export default function CommunityProfileScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   const [profile, setProfile] = useState(null); // normalized user
//   const [posts, setPosts] = useState([]); // [{id,user_id,content_id,caption,created_at}]
//   const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });

//   // followers modal
//   const [followersOpen, setFollowersOpen] = useState(false);
//   const [followersLoading, setFollowersLoading] = useState(false);
//   const [followers, setFollowers] = useState([]);

//   // itinerary cache for inline cards
//   const [itCache, setItCache] = useState({}); // { [content_id]: itinerary }
  
//   // ✅ FIX: Use refs to track what's being fetched (doesn't trigger re-renders)
//   const itBusyRef = useRef({});   // { [content_id]: true }
//   const fetchedRef = useRef({});  // { [content_id]: true } - tracks what's already fetched

//   // deleting state per post
//   const [deleting, setDeleting] = useState({}); // { [postId]: true }

//   const viewingIdFromRoute = toInt(route?.params?.userId);

//   // auth
//   useEffect(() => {
//     (async () => {
//       try {
//         const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
//         setAuth({ token: token || null, userId: userIdRaw ? Number(userIdRaw) : null });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   // headers
//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   const viewingId = useMemo(() => {
//     if (Number.isFinite(viewingIdFromRoute)) return viewingIdFromRoute;
//     if (Number.isFinite(auth.userId)) return auth.userId;
//     return null;
//   }, [auth.userId, viewingIdFromRoute]);

//   // ✅ FIX: Removed itCache and itBusy from dependencies
//   const loadAll = useCallback(async () => {
//     if (!sessionReady || !viewingId) return;
//     setLoading(true);
//     setErr(null);

//     try {
//       // profile
//       const pRes = await fetch(`${API_BASE_URL}/users/${viewingId}/profile`, { headers: authHeaders });
//       if (!pRes.ok) throw new Error(`Profile HTTP ${pRes.status}`);
//       const pData = await pRes.json();
//       console.log(pData)
//       setProfile(normalizeUser(pData));

//       // posts (user's posts)
//       const poRes = await fetch(`${API_BASE_URL}/users/${viewingId}/posts`, { headers: authHeaders });
//       if (!poRes.ok) throw new Error(`Posts HTTP ${poRes.status}`);
//       const poData = await poRes.json();
      
//       console.log(poData)
//       setPosts(poData);

//       // counts
//       const [follCountRes, wingCountRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/social/followers/${viewingId}/count`, { headers: authHeaders }),
//         fetch(`${API_BASE_URL}/social/following/${viewingId}/count`, { headers: authHeaders }),
//       ]);
//       if (!follCountRes.ok) throw new Error(`Followers Count HTTP ${follCountRes.status}`);
//       if (!wingCountRes.ok) throw new Error(`Following Count HTTP ${wingCountRes.status}`);

//       const fJson = await follCountRes.json();
//       const wJson = await wingCountRes.json();

//       setCounts({
//         posts: rows.length,
//         followers: Number(fJson?.count ?? fJson?.followers_count ?? 0),
//         following: Number(wJson?.count ?? wJson?.following_count ?? 0),
//       });

//       // ✅ FIX: prefetch itineraries using refs (doesn't trigger re-renders)
//       const needed = rows
//         .map((r) => r.content_id)
//         .filter((cid) => cid && !fetchedRef.current[cid] && !itBusyRef.current[cid]);

//       if (needed.length) {
//         // Mark as busy
//         needed.forEach((cid) => {
//           itBusyRef.current[cid] = true;
//         });

//         const fetched = await Promise.all(
//           needed.map(async (cid) => {
//             try {
//               const res = await fetch(`${API_BASE_URL}/users/${cid}/posts`, { headers: authHeaders });
//               if (!res.ok) return [cid, null];
//               const data = await res.json();
//               return [cid, Array.isArray(data) ? data[0] : data];
//             } catch {
//               return [cid, null];
//             }
//           })
//         );

//         // ✅ Use functional update to avoid dependency
//         setItCache((prevCache) => {
//           const add = { ...prevCache };
//           fetched.forEach(([cid, it]) => {
//             add[cid] = it || null;
//             fetchedRef.current[cid] = true;  // Mark as fetched
//           });
//           return add;
//         });

//         // Clear busy flags
//         needed.forEach((cid) => {
//           delete itBusyRef.current[cid];
//         });
//       }
//     } catch (e) {
//       setErr(e?.message || "Failed to load profile");
//       setProfile(null);
//       setPosts([]);
//       setCounts({ posts: 0, followers: 0, following: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionReady, viewingId, authHeaders]);  // ✅ Only these dependencies now!

//   useEffect(() => { 
//     loadAll(); 
//   }, [loadAll]);

//   // followers list
//   const openFollowers = async () => {
//     setFollowersOpen(true);
//     setFollowersLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/social/followers/${viewingId}`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`Followers HTTP ${res.status}`);
//       const data = await res.json();
//       const list = Array.isArray(data) ? data : data?.followers || [];
//       setFollowers(list.map(normalizeUser));
//     } catch {
//       setFollowers([]);
//     } finally {
//       setFollowersLoading(false);
//     }
//   };

//   const isMe = Number(viewingId) === Number(auth.userId);
//   const displayName = fullName(profile || {});

//   /* ---------------- Delete post ---------------- */
//   const doDeletePost = useCallback(
//     async (postId) => {
//       if (!postId) return;

//       // mark deleting
//       setDeleting((d) => ({ ...d, [postId]: true }));
//       try {
//         const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
//           method: "DELETE",
//           headers: {
//             ...(authHeaders || {}),
//             "Content-Type": "application/json",
//           },
//         });

//         if (!res.ok && res.status !== 204) {
//           const msg = `Delete failed (HTTP ${res.status})`;
//           throw new Error(msg);
//         }

//         // ✅ Clear the fetched cache for this post's itinerary
//         setPosts((prevPosts) => {
//           const deletedPost = prevPosts.find(p => p.id === postId);
//           if (deletedPost?.content_id) {
//             delete fetchedRef.current[deletedPost.content_id];
//           }
//           return prevPosts;
//         });

//         // refresh from server to stay consistent
//         await loadAll();
//       } catch (e) {
//         const msg = e?.message || "Failed to delete post";
//         if (Platform.OS === "web") {
//           // eslint-disable-next-line no-alert
//           window.alert(msg);
//         } else {
//           Alert.alert("Error", msg);
//         }
//       } finally {
//         setDeleting((d) => {
//           const c = { ...d };
//           delete c[postId];
//           return c;
//         });
//       }
//     },
//     [authHeaders, loadAll]
//   );

//   const confirmDelete = useCallback(
//     (postId) => {
//       if (Platform.OS === "web") {
//         // eslint-disable-next-line no-alert
//         const yes = window.confirm("Delete this post?");
//         if (yes) doDeletePost(postId);
//         return;
//       }
//       Alert.alert(
//         "Delete Post",
//         "Are you sure you want to delete this post?",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Delete", style: "destructive", onPress: () => doDeletePost(postId) },
//         ],
//         { cancelable: true }
//       );
//     },
//     [doDeletePost]
//   );

//   /* ---------------- UI ---------------- */
//   return (
//     <SafeAreaView style={styles.page}>
//       {/* Top bar */}
//       <View style={styles.topbar}>
//         {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.9}>
//           <Ionicons name="arrow-back" size={18} color={COLORS.text} />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity> */}
//         <Text style={styles.brand}>Community</Text>
//         <View style={{ width: 64 }} />
//       </View>

//       {/* Content */}
//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Loading profile…</Text>
//         </View>
//       ) : err ? (
//         <View style={styles.errorBox}>
//           <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
//           <Text style={styles.errorText}>{err}</Text>
//           <TouchableOpacity onPress={loadAll} style={{ marginLeft: "auto" }}>
//             <Text style={styles.link}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : !profile ? (
//         <View style={styles.center}>
//           <Text style={styles.meta}>Profile not found.</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={posts}
//           keyExtractor={(p) => String(p.id)}
//           ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//           ListHeaderComponent={
//             <ProfileHeader
//               profile={profile}
//               name={displayName}
//               counts={counts}
//               isMe={isMe}
//               onFollowersPress={openFollowers}
//               onRefresh={loadAll}
//             />
//           }
//           renderItem={({ item }) => {
//             const it = itCache[item.content_id];
//             const isDeleting = !!deleting[item.id];

//             return (
//               <View style={styles.postCard}>
//                 {/* delete row */}
//                 <View style={styles.actionRow}>
//                   <TouchableOpacity
//                     style={[styles.actionBtn, styles.actionBtnDanger, isDeleting && { opacity: 0.6 }]}
//                     onPress={() => confirmDelete(item.id)}
//                     disabled={isDeleting}
//                     accessibilityLabel="Delete post"
//                     accessibilityState={{ disabled: isDeleting }}
//                     activeOpacity={0.8}
//                   >
//                     {isDeleting ? (
//                       <ActivityIndicator size="small" />
//                     ) : (
//                       <Ionicons name="trash-outline" size={16} color="#B91C1C" />
//                     )}
//                     <Text style={[styles.actionText, styles.actionTextDanger]}>
//                       {isDeleting ? "Deleting…" : "Delete"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {!!item.caption && <Text style={styles.caption}>{item.caption}</Text>}

//                 {it ? (
//                   <ItineraryCard
//                     item={{
//                       title: it.title,
//                       city: it.city || it.destination,
//                       start_date: it.start_date,
//                       end_date: it.end_date,
//                       budget: it.budget,
//                       style: it.style,
//                       cover_url: it.cover_url,
//                       days: it.days || [],
//                     }}
//                     onPress={undefined}
//                   />
//                 ) : (
//                   <View style={styles.loadingBox}>
//                     <ActivityIndicator />
//                   </View>
//                 )}
//               </View>
//             );
//           }}
//           ListEmptyComponent={<View style={styles.emptyWrap}><Text style={styles.meta}>No posts yet.</Text></View>}
//           contentContainerStyle={{
//             paddingBottom: 24,
//             paddingHorizontal: 12,
//             paddingTop: Platform.OS === "web" ? 16 : 8,
//             ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
//           }}
//           scrollEnabled={false}
//           nestedScrollEnabled
//         />
//       )}

//       {/* Followers modal */}
//       <Modal visible={followersOpen} animationType="slide" transparent onRequestClose={() => setFollowersOpen(false)}>
//         <Pressable style={styles.sheetBackdrop} onPress={() => setFollowersOpen(false)} />
//         <View style={styles.sheet}>
//           <View style={styles.sheetHeader}>
//             <Text style={styles.sheetTitle}>Followers</Text>
//             <TouchableOpacity onPress={() => setFollowersOpen(false)}>
//               <Ionicons name="close" size={20} color={COLORS.text} />
//             </TouchableOpacity>
//           </View>

//           {followersLoading ? (
//             <View style={styles.center}>
//               <ActivityIndicator />
//             </View>
//           ) : followers.length === 0 ? (
//             <View style={styles.center}>
//               <Text style={styles.meta}>No followers yet.</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={followers}
//               keyExtractor={(u, i) => String(u?.id ?? i)}
//               ItemSeparatorComponent={() => <View style={styles.sep} />}
//               renderItem={({ item }) => {
//                 const nm = fullName(item);
//                 return (
//                   <View style={styles.followerRow}>
//                     <Avatar uri={item?.image_url} name={nm} size={40} />
//                     <View style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
//                       <Text style={styles.followerName} numberOfLines={1}>{nm}</Text>
//                       {!!item?.username && <Text style={styles.followerSub} numberOfLines={1}>@{item.username}</Text>}
//                     </View>
//                   </View>
//                 );
//               }}
//             />
//           )}
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* --------------------------- Subcomponents --------------------------- */

// function ProfileHeader({ profile, name, counts, isMe, onFollowersPress, onRefresh }) {
//   return (
//     <>
//       {/* Instagram-like top: avatar + counters + name + edit button */}
//       <View style={styles.headerRow}>
//         <Avatar uri={profile?.image_url} name={name} size={82} />

//         <View style={styles.counterWrap}>
//           <Text style={styles.counterValue}>{counts.posts}</Text>
//           <Text style={styles.counterLabel}>Posts</Text>
//         </View>
//         <TouchableOpacity onPress={onFollowersPress} activeOpacity={0.85} style={styles.counterWrap}>
//           <Text style={styles.counterValue}>{counts.followers}</Text>
//           <Text style={styles.counterLabel}>Followers</Text>
//         </TouchableOpacity>
//         <View style={styles.counterWrap}>
//           <Text style={styles.counterValue}>{counts.following}</Text>
//           <Text style={styles.counterLabel}>Following</Text>
//         </View>
//       </View>

//       <Text style={styles.name} numberOfLines={1}>{name}</Text>

//       <TouchableOpacity onPress={onRefresh} style={styles.editBtn} activeOpacity={0.9}>
//         <Text style={styles.editBtnText}>{isMe ? "Edit Profile" : "Refresh"}</Text>
//       </TouchableOpacity>

//       <View style={styles.postsHeader}>
//         <Ionicons name="grid-outline" size={16} color={COLORS.subtext} />
//         <Text style={styles.postsHeaderText}>Posts</Text>
//       </View>
//     </>
//   );
// }

// /* --------------------------- Styles --------------------------- */

// const COLORS = {
//   page: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#64748B",
//   primary: "#0F70F0",
//   border: "#EAF0F6",
// };

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: COLORS.page },

//   topbar: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingTop: Platform.OS === "android" ? 8 : 6,
//     paddingBottom: 10,
//     ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
//   },
//   backBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: "#EEF3F9",
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   backText: { color: COLORS.text, fontWeight: "800" },
//   brand: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "800",
//     color: COLORS.text,
//   },

//   center: { alignItems: "center", justifyContent: "center", padding: 20 },
//   meta: { color: COLORS.subtext, fontWeight: "600" },

//   errorBox: {
//     marginHorizontal: 16,
//     marginTop: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     ...(Platform.OS === "web" ? { maxWidth: 860, alignSelf: "center", width: "100%" } : {}),
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },

//   /* instagram-like header */
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 18,
//     paddingHorizontal: 16,
//     paddingTop: 8,
//   },
//   counterWrap: { alignItems: "center", justifyContent: "center", flex: 1 },
//   counterValue: { fontWeight: "800", color: COLORS.text, fontSize: 18 },
//   counterLabel: { color: COLORS.subtext, fontWeight: "700" },
//   name: {
//     marginTop: 8,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.text,
//   },
//   editBtn: {
//     marginTop: 8,
//     marginHorizontal: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 10,
//   },
//   editBtnText: { color: "#0F3A6B", fontWeight: "800" },

//   postsHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   postsHeaderText: { color: COLORS.subtext, fontWeight: "800" },

//   /* post list (inline ItineraryCard per post) */
//   postCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 12,
//   },
//   caption: { marginBottom: 8, color: "#0F172A", fontWeight: "600" },
//   loadingBox: {
//     height: 120,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F1F5FB",
//     borderRadius: 12,
//   },

//   emptyWrap: { padding: 24, alignItems: "center" },

//   // followers modal
//   sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
//   sheet: {
//     position: "absolute",
//     left: 0, right: 0, bottom: 0,
//     maxHeight: "70%",
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingBottom: 8,
//   },
//   sheetHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 14,
//     paddingTop: 10,
//     paddingBottom: 6,
//     borderBottomWidth: 1,
//     borderColor: COLORS.border,
//   },
//   sheetTitle: { flex: 1, textAlign: "center", fontWeight: "800", color: COLORS.text },
//   followerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//   },
//   followerName: { fontWeight: "700", color: "#0F172A" },
//   followerSub: { color: COLORS.subtext, fontSize: 12 },
//   sep: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 64 },

//   /* actions */
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 10,
//     borderWidth: 1,
//   },
//   actionBtnDanger: {
//     borderColor: "#FEE2E2",
//     backgroundColor: "#FEF2F2",
//   },
//   actionText: { fontWeight: "700" },
//   actionTextDanger: { color: "#B91C1C" },
// });











import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import getBaseURL from "../../config/env";

const API_BASE_URL = getBaseURL();

/* --------------------------- COLORS --------------------------- */
const COLORS = {
  page: "#F6FAFD",
  card: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#64748B",
  primary: "#0F70F0",
  border: "#EAF0F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

/* --------------------------- helpers --------------------------- */
const pick = (o, keys) => {
  for (const k of keys) {
    if (o && o[k] != null && o[k] !== "") return o[k];
  }
  return undefined;
};
const toInt = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

function normalizeUser(data) {
  const u = data?.user || data || {};
  return {
    id: toInt(pick(u, ["id", "Id"])),
    first_name: pick(u, ["first_name", "FirstName"]) || "",
    last_name: pick(u, ["last_name", "LastName"]) || "",
    email: pick(u, ["email", "Email"]) || "",
    username: pick(u, ["username", "Username"]) || "",
    image_url: pick(u, ["image_url", "ImageURL", "avatar_url"]) || "",
    bio: pick(u, ["bio", "Bio"]) || "",
  };
}

function fullName(u) {
  const name = [u?.first_name, u?.last_name].filter(Boolean).join(" ").trim();
  if (name) return name;
  if (u?.username) return u.username;
  if (u?.email) return u.email.split("@")[0];
  return u?.id ? `User #${u.id}` : "User";
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
}

/* --------------------------- Avatar Components --------------------------- */
function LetterAvatar({ size = 82, name = "" }) {
  const letter = (name?.trim()?.[0] || "U").toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "800", fontSize: Math.floor(size * 0.44) }}>
        {letter}
      </Text>
    </View>
  );
}

function Avatar({ uri, name, size = 82 }) {
  if (!uri) return <LetterAvatar size={size} name={name} />;
  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#EAF0F6" }}
    />
  );
}

/* ========================== CUSTOM POST CARD ========================== */
function PostCard({ post, onDelete, isDeleting }) {
  const itinerary = post?.itinerary;
  const days = itinerary?.days || [];
  const numDays = calculateDays(itinerary?.start_date, itinerary?.end_date);

  if (!itinerary) {
    return (
      <View style={styles.postCard}>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnDanger, isDeleting && { opacity: 0.6 }]}
            onPress={onDelete}
            disabled={isDeleting}
            activeOpacity={0.8}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#B91C1C" />
            ) : (
              <Ionicons name="trash-outline" size={16} color="#B91C1C" />
            )}
            <Text style={[styles.actionText, styles.actionTextDanger]}>
              {isDeleting ? "Deleting…" : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyItinerary}>
          <Ionicons name="image-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>Itinerary not available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.postCard}>
      {/* Delete Button */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnDanger, isDeleting && { opacity: 0.6 }]}
          onPress={onDelete}
          disabled={isDeleting}
          activeOpacity={0.8}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#B91C1C" />
          ) : (
            <Ionicons name="trash-outline" size={16} color="#B91C1C" />
          )}
          <Text style={[styles.actionText, styles.actionTextDanger]}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cover Image */}
      {itinerary.cover_url ? (
        <Image 
          source={{ uri: itinerary.cover_url }} 
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Ionicons name="image-outline" size={48} color="#9CA3AF" />
        </View>
      )}

      {/* Content */}
      <View style={styles.postContent}>
        {/* Title & City */}
        <View style={styles.titleRow}>
          <Text style={styles.itineraryTitle} numberOfLines={2}>
            {itinerary.title}
          </Text>
          <View style={styles.cityBadge}>
            <Ionicons name="location" size={14} color={COLORS.primary} />
            <Text style={styles.cityText}>{itinerary.city}</Text>
          </View>
        </View>

        {/* Description */}
        {!!itinerary.description && (
          <Text style={styles.description} numberOfLines={2}>
            {itinerary.description}
          </Text>
        )}

        {/* Date Range */}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.subtext} />
          <Text style={styles.dateText}>
            {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
          </Text>
          <Text style={styles.daysCount}>• {numDays} day{numDays !== 1 ? 's' : ''}</Text>
        </View>

        {/* Budget & Style Tags */}
        <View style={styles.tagsRow}>
          <View style={[styles.tag, styles.tagBudget]}>
            <Ionicons name="cash-outline" size={14} color="#059669" />
            <Text style={styles.tagTextBudget}>{itinerary.budget}</Text>
          </View>
          <View style={[styles.tag, styles.tagStyle]}>
            <Ionicons name="star-outline" size={14} color="#DC2626" />
            <Text style={styles.tagTextStyle}>{itinerary.style}</Text>
          </View>
        </View>

        {/* Activities Preview */}
        {days.length > 0 && (
          <View style={styles.activitiesSection}>
            <View style={styles.activitiesHeader}>
              <Ionicons name="list-outline" size={16} color={COLORS.text} />
              <Text style={styles.activitiesTitle}>Activities ({days.length})</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.activitiesScroll}
            >
              {days.map((day, index) => (
                <View key={day.id || index} style={styles.dayCard}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>Day {day.day_number}</Text>
                  </View>
                  <Text style={styles.dayPlace} numberOfLines={1}>
                    {day.place}
                  </Text>
                  {day.start_time && day.end_time && (
                    <View style={styles.dayTimeRow}>
                      <Ionicons name="time-outline" size={12} color={COLORS.subtext} />
                      <Text style={styles.dayTime}>
                        {day.start_time} - {day.end_time}
                      </Text>
                    </View>
                  )}
                  {day.activities && (
                    <Text style={styles.dayActivities} numberOfLines={2}>
                      {day.activities}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Post Meta */}
        <View style={styles.postMeta}>
          <Ionicons name="eye-outline" size={14} color={COLORS.subtext} />
          <Text style={styles.metaText}>{post.visibility || 'public'}</Text>
          <Text style={styles.metaSeparator}>•</Text>
          <Text style={styles.metaText}>
            Posted {formatDate(post.created_at)}
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ========================== MAIN SCREEN ========================== */
export default function CommunityProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [auth, setAuth] = useState({ token: null, userId: null });
  const [sessionReady, setSessionReady] = useState(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });

  const [followersOpen, setFollowersOpen] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followers, setFollowers] = useState([]);

  const [deleting, setDeleting] = useState({});

  const viewingIdFromRoute = toInt(route?.params?.userId);

  // Auth setup
  useEffect(() => {
    (async () => {
      try {
        const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
        setAuth({ token: token || null, userId: userIdRaw ? Number(userIdRaw) : null });
      } finally {
        setSessionReady(true);
      }
    })();
  }, []);

  const authHeaders = useMemo(() => {
    const h = {};
    if (auth.token) h.Authorization = `Bearer ${auth.token}`;
    return h;
  }, [auth.token]);

  const viewingId = useMemo(() => {
    if (Number.isFinite(viewingIdFromRoute)) return viewingIdFromRoute;
    if (Number.isFinite(auth.userId)) return auth.userId;
    return null;
  }, [auth.userId, viewingIdFromRoute]);

  // Load all data
  const loadAll = useCallback(async () => {
    if (!sessionReady || !viewingId) return;
    setLoading(true);
    setErr(null);

    try {
      // Profile
      const pRes = await fetch(`${API_BASE_URL}/users/${viewingId}/profile`, { headers: authHeaders });
      if (!pRes.ok) throw new Error(`Profile HTTP ${pRes.status}`);
      const pData = await pRes.json();
      console.log('Profile:', pData);
      setProfile(normalizeUser(pData));

      // Posts (✅ Now includes full itinerary data!)
      const poRes = await fetch(`${API_BASE_URL}/users/${viewingId}/posts`, { headers: authHeaders });
      if (!poRes.ok) throw new Error(`Posts HTTP ${poRes.status}`);
      const poData = await poRes.json();
      
      console.log('Posts with itineraries:', poData);
      setPosts(Array.isArray(poData) ? poData : []);

      // Counts
      const [follCountRes, wingCountRes] = await Promise.all([
        fetch(`${API_BASE_URL}/social/followers/${viewingId}/count`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/social/following/${viewingId}/count`, { headers: authHeaders }),
      ]);
      if (!follCountRes.ok) throw new Error(`Followers Count HTTP ${follCountRes.status}`);
      if (!wingCountRes.ok) throw new Error(`Following Count HTTP ${wingCountRes.status}`);

      const fJson = await follCountRes.json();
      const wJson = await wingCountRes.json();

      setCounts({
        posts: Array.isArray(poData) ? poData.length : 0,
        followers: Number(fJson?.count ?? fJson?.followers_count ?? 0),
        following: Number(wJson?.count ?? wJson?.following_count ?? 0),
      });

    } catch (e) {
      console.error('Load error:', e);
      setErr(e?.message || "Failed to load profile");
      setProfile(null);
      setPosts([]);
      setCounts({ posts: 0, followers: 0, following: 0 });
    } finally {
      setLoading(false);
    }
  }, [sessionReady, viewingId, authHeaders]);

  useEffect(() => { 
    loadAll(); 
  }, [loadAll]);

  // Followers modal
  const openFollowers = async () => {
    setFollowersOpen(true);
    setFollowersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/social/followers/${viewingId}`, { headers: authHeaders });
      if (!res.ok) throw new Error(`Followers HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.followers || [];
      setFollowers(list.map(normalizeUser));
    } catch {
      setFollowers([]);
    } finally {
      setFollowersLoading(false);
    }
  };

  const isMe = Number(viewingId) === Number(auth.userId);
  const displayName = fullName(profile || {});

  // Delete post
  const doDeletePost = useCallback(
    async (postId) => {
      if (!postId) return;

      setDeleting((d) => ({ ...d, [postId]: true }));
      try {
        const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
          method: "DELETE",
          headers: {
            ...(authHeaders || {}),
            "Content-Type": "application/json",
          },
        });

        if (!res.ok && res.status !== 204) {
          throw new Error(`Delete failed (HTTP ${res.status})`);
        }

        await loadAll();
      } catch (e) {
        const msg = e?.message || "Failed to delete post";
        if (Platform.OS === "web") {
          window.alert(msg);
        } else {
          Alert.alert("Error", msg);
        }
      } finally {
        setDeleting((d) => {
          const c = { ...d };
          delete c[postId];
          return c;
        });
      }
    },
    [authHeaders, loadAll]
  );

  const confirmDelete = useCallback(
    (postId) => {
      if (Platform.OS === "web") {
        const yes = window.confirm("Delete this post?");
        if (yes) doDeletePost(postId);
        return;
      }
      Alert.alert(
        "Delete Post",
        "Are you sure you want to delete this post?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => doDeletePost(postId) },
        ],
        { cancelable: true }
      );
    },
    [doDeletePost]
  );

  /* ========================== UI ========================== */
  return (
    <SafeAreaView style={styles.page}>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Text style={styles.brand}>Community</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.meta}>Loading profile…</Text>
        </View>
      ) : err ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
          <Text style={styles.errorText}>{err}</Text>
          <TouchableOpacity onPress={loadAll} style={{ marginLeft: "auto" }}>
            <Text style={styles.link}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !profile ? (
        <View style={styles.center}>
          <Text style={styles.meta}>Profile not found.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => String(p.id)}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          ListHeaderComponent={
            <ProfileHeader
              profile={profile}
              name={displayName}
              counts={counts}
              isMe={isMe}
              onFollowersPress={openFollowers}
              onRefresh={loadAll}
            />
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onDelete={() => confirmDelete(item.id)}
              isDeleting={!!deleting[item.id]}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="images-outline" size={64} color={COLORS.subtext} />
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.meta}>Share your adventures with the community!</Text>
            </View>
          }
          contentContainerStyle={{
            paddingBottom: 24,
            paddingHorizontal: 12,
            paddingTop: Platform.OS === "web" ? 16 : 8,
            ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
          }}
        />
      )}

      {/* Followers modal */}
      <Modal visible={followersOpen} animationType="slide" transparent onRequestClose={() => setFollowersOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setFollowersOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Followers</Text>
            <TouchableOpacity onPress={() => setFollowersOpen(false)}>
              <Ionicons name="close" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {followersLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : followers.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.meta}>No followers yet.</Text>
            </View>
          ) : (
            <FlatList
              data={followers}
              keyExtractor={(u, i) => String(u?.id ?? i)}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              renderItem={({ item }) => {
                const nm = fullName(item);
                return (
                  <View style={styles.followerRow}>
                    <Avatar uri={item?.image_url} name={nm} size={40} />
                    <View style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                      <Text style={styles.followerName} numberOfLines={1}>{nm}</Text>
                      {!!item?.username && <Text style={styles.followerSub} numberOfLines={1}>@{item.username}</Text>}
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ========================== Profile Header ========================== */
function ProfileHeader({ profile, name, counts, isMe, onFollowersPress, onRefresh }) {
  return (
    <>
      <View style={styles.headerRow}>
        <Avatar uri={profile?.image_url} name={name} size={82} />

        <View style={styles.counterWrap}>
          <Text style={styles.counterValue}>{counts.posts}</Text>
          <Text style={styles.counterLabel}>Posts</Text>
        </View>
        <TouchableOpacity onPress={onFollowersPress} activeOpacity={0.85} style={styles.counterWrap}>
          <Text style={styles.counterValue}>{counts.followers}</Text>
          <Text style={styles.counterLabel}>Followers</Text>
        </TouchableOpacity>
        <View style={styles.counterWrap}>
          <Text style={styles.counterValue}>{counts.following}</Text>
          <Text style={styles.counterLabel}>Following</Text>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={1}>{name}</Text>

      <TouchableOpacity onPress={onRefresh} style={styles.editBtn} activeOpacity={0.9}>
        <Text style={styles.editBtnText}>{isMe ? "Edit Profile" : "Refresh"}</Text>
      </TouchableOpacity>

      <View style={styles.postsHeader}>
        <Ionicons name="grid-outline" size={16} color={COLORS.subtext} />
        <Text style={styles.postsHeaderText}>Posts</Text>
      </View>
    </>
  );
}

/* ========================== STYLES ========================== */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.page },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 8 : 6,
    paddingBottom: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  center: { alignItems: "center", justifyContent: "center", padding: 20 },
  meta: { color: COLORS.subtext, fontWeight: "600", fontSize: 14 },

  errorBox: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  errorText: { color: "#B42318", fontWeight: "600", flex: 1 },
  link: { color: COLORS.primary, fontWeight: "700" },

  // Profile header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  counterWrap: { alignItems: "center", justifyContent: "center", flex: 1 },
  counterValue: { fontWeight: "800", color: COLORS.text, fontSize: 20 },
  counterLabel: { color: COLORS.subtext, fontWeight: "600", fontSize: 12, marginTop: 2 },
  name: {
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  editBtn: {
    marginTop: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#EEF3F9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  editBtnText: { color: COLORS.text, fontWeight: "800", fontSize: 14 },

  postsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  postsHeaderText: { color: COLORS.subtext, fontWeight: "800", fontSize: 14 },

  // Post Card
  postCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  actionRow: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnDanger: {
    borderColor: "#FEE2E2",
    backgroundColor: "rgba(254, 242, 242, 0.95)",
  },
  actionText: { fontWeight: "700", fontSize: 13 },
  actionTextDanger: { color: "#B91C1C" },

  coverImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F1F5F9",
  },
  coverPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  postContent: {
    padding: 16,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  itineraryTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 26,
  },
  cityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cityText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },

  description: {
    fontSize: 14,
    color: COLORS.subtext,
    lineHeight: 20,
    marginBottom: 12,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  daysCount: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "700",
  },

  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagBudget: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  tagTextBudget: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  tagStyle: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  tagTextStyle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
  },

  activitiesSection: {
    marginTop: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  activitiesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  activitiesTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  activitiesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  dayCard: {
    width: 200,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginRight: 12,
  },
  dayBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
  },
  dayPlace: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  dayTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  dayTime: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  dayActivities: {
    fontSize: 12,
    color: COLORS.subtext,
    lineHeight: 16,
  },

  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  metaSeparator: {
    fontSize: 12,
    color: COLORS.border,
  },

  emptyItinerary: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  emptyText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyWrap: { 
    padding: 48,
    alignItems: "center" 
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },

  // Followers modal
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sheetTitle: { 
    flex: 1, 
    textAlign: "center", 
    fontWeight: "800", 
    fontSize: 18,
    color: COLORS.text 
  },
  followerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  followerName: { fontWeight: "700", color: COLORS.text, fontSize: 15 },
  followerSub: { color: COLORS.subtext, fontSize: 13, marginTop: 2 },
  sep: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 66 },
});