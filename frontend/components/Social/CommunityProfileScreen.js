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

// const API_BASE_URL = getBaseURL();

// /* =========================================================
//    Community Profile (Instagram-like)
//    ========================================================= */
// export default function CommunityProfileScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   const [profile, setProfile] = useState(null); // { id, first_name, last_name, username, image_url, bio, ... }
//   const [posts, setPosts] = useState([]);       // /users/:id/posts
//   const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });

//   const [followersOpen, setFollowersOpen] = useState(false);
//   const [followersLoading, setFollowersLoading] = useState(false);
//   const [followers, setFollowers] = useState([]);

//   // Which profile are we viewing? Default to "me"
//   const viewingIdFromRoute = route?.params?.userId ? Number(route.params.userId) : null;

//   // 1) Load auth
//   useEffect(() => {
//     (async () => {
//       try {
//         const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
//         setAuth({
//           token: token || null,
//           userId: userIdRaw ? Number(userIdRaw) : null,
//         });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   // 2) Build headers
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

//   // 3) Fetch profile + posts + counts
//   const loadAll = useCallback(async () => {
//     if (!sessionReady || !viewingId) return;
//     setLoading(true);
//     setErr(null);

//     try {
//       // profile
//       const pRes = await fetch(`${API_BASE_URL}/users/${viewingId}/profile`, { headers: authHeaders });
//       if (!pRes.ok) throw new Error(`Profile HTTP ${pRes.status}`);
//       const pData = await pRes.json();
//       setProfile(pData || null);

//       // posts
//       const poRes = await fetch(`${API_BASE_URL}/users/${viewingId}/posts`, { headers: authHeaders });
//       if (!poRes.ok) throw new Error(`Posts HTTP ${poRes.status}`);
//       const poData = await poRes.json();
//       const rows = Array.isArray(poData) ? poData : poData?.posts || [];
//       setPosts(rows);
//       const postCount = rows.length;

//       // counts
//       const [follCountRes, wingCountRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/social/followers/${viewingId}/count`, { headers: authHeaders }),
//         fetch(`${API_BASE_URL}/social/following/${viewingId}/count`, { headers: authHeaders }),
//       ]);
//       if (!follCountRes.ok) throw new Error(`Followers Count HTTP ${follCountRes.status}`);
//       if (!wingCountRes.ok) throw new Error(`Following Count HTTP ${wingCountRes.status}`);
//       const follCountData = await follCountRes.json();
//       const wingCountData = await wingCountRes.json();

//       setCounts({
//         posts: postCount,
//         followers: Number(follCountData?.count ?? 0),
//         following: Number(wingCountData?.count ?? 0),
//       });
//     } catch (e) {
//       setErr(e?.message || "Failed to load profile");
//       setProfile(null);
//       setPosts([]);
//       setCounts({ posts: 0, followers: 0, following: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL, sessionReady, viewingId, authHeaders]);

//   useEffect(() => { loadAll(); }, [loadAll]);

//   // 4) Followers modal
//   const openFollowers = async () => {
//     setFollowersOpen(true);
//     setFollowersLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/social/followers/${viewingId}`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`Followers HTTP ${res.status}`);
//       const data = await res.json();
//       const list = Array.isArray(data) ? data : data?.followers || [];
//       setFollowers(list);
//     } catch (e) {
//       setFollowers([]);
//     } finally {
//       setFollowersLoading(false);
//     }
//   };

//   // 5) Save (bookmark) a post
//   const savePost = async (post) => {
//     if (!auth?.userId) {
//       Alert.alert("Sign in required", "Please sign in to save posts.");
//       return;
//     }
//     try {
//       const res = await fetch(`${API_BASE_URL}/saves`, {
//         method: "POST",
//         headers: { ...authHeaders, "Content-Type": "application/json" },
//         // If your controller expects other keys (e.g., item_id/item_type) adjust below:
//         body: JSON.stringify({ user_id: Number(auth.userId), post_id: Number(post.id) }),
//       });
//       if (!res.ok) throw new Error(`Save HTTP ${res.status}`);
//       Alert.alert("Saved", "This post has been saved to your favorites.");
//     } catch (e) {
//       Alert.alert("Save failed", e?.message || "Could not save this post.");
//     }
//   };

//   const isMe = Number(viewingId) === Number(auth.userId);

//   /* ---------------- UI ---------------- */
//   return (
//     <SafeAreaView style={styles.page}>
//       {/* Top bar */}
//       <View style={styles.topbar}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.9}>
//           <Ionicons name="arrow-back" size={18} color={COLORS.text} />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity>
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
//           numColumns={3}
//           columnWrapperStyle={styles.gridRow}
//           ListHeaderComponent={
//             <ProfileHeader
//               profile={profile}
//               counts={counts}
//               isMe={isMe}
//               onFollowersPress={openFollowers}
//               onRefresh={loadAll}
//             />
//           }
//           renderItem={({ item }) => (
//             <PostTile post={item} onSave={() => savePost(item)} />
//           )}
//           ListEmptyComponent={<View style={styles.emptyWrap}><Text style={styles.meta}>No posts yet.</Text></View>}
//           contentContainerStyle={{
//             paddingBottom: 20,
//             paddingHorizontal: 12,
//             paddingTop: Platform.OS === "web" ? 16 : 8,
//             ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
//           }}
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
//                 const name =
//                   [item?.first_name || item?.FirstName, item?.last_name || item?.LastName]
//                     .filter(Boolean)
//                     .join(" ") || item?.username || `User #${item?.id}`;
//                 return (
//                   <View style={styles.followerRow}>
//                     <Image
//                       source={{ uri: item?.image_url || "https://placehold.co/72x72?text=U" }}
//                       style={styles.followerAvatar}
//                     />
//                     <View style={{ flex: 1, minWidth: 0 }}>
//                       <Text style={styles.followerName} numberOfLines={1}>{name}</Text>
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

// function ProfileHeader({ profile, counts, isMe, onFollowersPress, onRefresh }) {
//   const name =
//     [profile?.first_name || profile?.FirstName, profile?.last_name || profile?.LastName]
//       .filter(Boolean)
//       .join(" ") || profile?.username || `User #${profile?.id}`;

//   return (
//     <>
//       <View style={styles.headerCard}>
//         <Image
//           source={{ uri: profile?.image_url || "https://placehold.co/120x120?text=U" }}
//           style={styles.avatarLg}
//         />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text numberOfLines={1} style={styles.name}>{name}</Text>
//           {!!profile?.username && <Text style={styles.username}>@{profile.username}</Text>}
//           {!!profile?.bio && <Text style={styles.bio} numberOfLines={3}>{profile.bio}</Text>}
//         </View>
//       </View>

//       <View style={styles.metricsRow}>
//         <Metric label="Posts" value={counts.posts} />
//         <TouchableOpacity onPress={onFollowersPress} activeOpacity={0.85}>
//           <Metric label="Followers" value={counts.followers} pressable />
//         </TouchableOpacity>
//         <Metric label="Following" value={counts.following} />
//       </View>

//       <View style={styles.actionsRow}>
//         <TouchableOpacity onPress={onRefresh} style={styles.actionBtn} activeOpacity={0.9}>
//           <Ionicons name="refresh" size={16} color={COLORS.text} />
//           <Text style={styles.actionBtnText}>Refresh</Text>
//         </TouchableOpacity>
//         {isMe ? (
//           <View style={styles.actionBtnDisabled}>
//             <Ionicons name="person-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.actionBtnText}>This is you</Text>
//           </View>
//         ) : null}
//       </View>

//       <View style={styles.gridHeader}>
//         <Ionicons name="grid-outline" size={16} color={COLORS.subtext} />
//         <Text style={styles.gridHeaderText}>Posts</Text>
//       </View>
//     </>
//   );
// }

// function Metric({ label, value, pressable }) {
//   return (
//     <View style={[styles.metric, pressable && { backgroundColor: "#EEF3F9" }]}>
//       <Text style={styles.metricValue}>{Number(value) || 0}</Text>
//       <Text style={styles.metricLabel}>{label}</Text>
//     </View>
//   );
// }

// function PostTile({ post, onSave }) {
//   // Simple thumb that matches the platform look
//   return (
//     <View style={styles.tile}>
//       <View style={styles.thumb}>
//         <Ionicons name="map-outline" size={22} color={COLORS.text} />
//       </View>

//       <View style={styles.tileFooter}>
//         <Text numberOfLines={1} style={styles.tileCaption}>
//           {post?.caption || "Itinerary"}
//         </Text>
//         <TouchableOpacity onPress={onSave} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
//           <Ionicons name="bookmark-outline" size={18} color={COLORS.text} />
//         </TouchableOpacity>
//       </View>
//     </View>
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

//   headerCard: {
//     flexDirection: "row",
//     gap: 12,
//     padding: 12,
//     marginHorizontal: 12,
//     marginTop: 6,
//     marginBottom: 8,
//     borderRadius: 16,
//     backgroundColor: COLORS.card,
//     borderColor: COLORS.border,
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   avatarLg: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#EAF0F6" },
//   name: { fontSize: 18, fontWeight: "800", color: COLORS.text },
//   username: { color: COLORS.subtext, marginTop: 2, fontWeight: "700" },
//   bio: { color: "#0F172A", marginTop: 6 },

//   metricsRow: {
//     marginHorizontal: 12,
//     flexDirection: "row",
//     gap: 10,
//     marginBottom: 8,
//   },
//   metric: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 10,
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//   },
//   metricValue: { fontWeight: "800", color: COLORS.text, fontSize: 16 },
//   metricLabel: { color: COLORS.subtext, fontWeight: "700", marginTop: 2 },

//   actionsRow: {
//     marginHorizontal: 12,
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 8,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//   },
//   actionBtnDisabled: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#F3F6FA",
//   },
//   actionBtnText: { color: COLORS.text, fontWeight: "800" },

//   gridHeader: {
//     marginTop: 8,
//     marginBottom: 6,
//     marginHorizontal: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   gridHeaderText: { color: COLORS.subtext, fontWeight: "800" },

//   gridRow: { gap: 6, paddingHorizontal: 0 },

//   tile: {
//     flex: 1,
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     margin: 3,
//     overflow: "hidden",
//   },
//   thumb: {
//     height: 92,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F1F5FB",
//   },
//   tileFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   tileCaption: { flex: 1, color: "#0F172A", fontWeight: "700" },

//   emptyWrap: { padding: 24, alignItems: "center" },

//   // followers sheet
//   sheetBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.25)",
//   },
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
//   followerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EAF0F6", marginRight: 10 },
//   followerName: { fontWeight: "700", color: "#0F172A" },
//   followerSub: { color: COLORS.subtext, fontSize: 12 },
//   sep: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 64 },
// });


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

// const API_BASE_URL = getBaseURL();

// /* --------------------------- helpers --------------------------- */
// const first = (v) => (Array.isArray(v) ? v[0] : v);
// const pick = (o, keys) => {
//   for (const k of keys) {
//     if (o && o[k] != null && o[k] !== "") return o[k];
//   }
//   return undefined;
// };
// const toInt = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

// /** Extract a uniform user object from any backend shape */
// function normalizeUser(data) {
//   const u = data?.user || data || {};
//   const id = toInt(pick(u, ["id", "Id"]));
//   const firstName = pick(u, ["first_name", "FirstName"]) || "";
//   const lastName = pick(u, ["last_name", "LastName"]) || "";
//   const email = pick(u, ["email", "Email"]) || "";
//   const username = pick(u, ["username", "Username"]) || "";
//   const image_url = pick(u, ["image_url", "ImageURL", "avatar_url"]) || "";
//   const bio = pick(u, ["bio", "Bio"]) || "";

//   return {
//     id,
//     first_name: firstName,
//     last_name: lastName,
//     email,
//     username,
//     image_url,
//     bio,
//   };
// }

// function fullName(u) {
//   const name = [u?.first_name, u?.last_name].filter(Boolean).join(" ").trim();
//   if (name) return name;
//   if (u?.username) return u.username;
//   if (u?.email) return u.email.split("@")[0];
//   return u?.id ? `User #${u.id}` : "User";
// }

// /** Simple avatar: image or single letter with black bg / white text */
// function LetterAvatar({ size = 76, name = "" }) {
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

// function Avatar({ uri, name, size = 76 }) {
//   if (!uri) return <LetterAvatar size={size} name={name} />;
//   return (
//     <Image
//       source={{ uri }}
//       style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#EAF0F6" }}
//     />
//   );
// }

// /* =========================================================
//    Community Profile (Instagram-like)
//    ========================================================= */
// export default function CommunityProfileScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   const [profile, setProfile] = useState(null); // normalized user
//   const [posts, setPosts] = useState([]);       // /users/:id/posts (or itineraries bound to posts)
//   const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });

//   const [followersOpen, setFollowersOpen] = useState(false);
//   const [followersLoading, setFollowersLoading] = useState(false);
//   const [followers, setFollowers] = useState([]);

//   // Which profile are we viewing? Default to "me"
//   const viewingIdFromRoute = toInt(route?.params?.userId);

//   // 1) Load auth
//   useEffect(() => {
//     (async () => {
//       try {
//         const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
//         setAuth({
//           token: token || null,
//           userId: userIdRaw ? Number(userIdRaw) : null,
//         });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   // 2) Build headers
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

//   // 3) Fetch profile + posts + counts
// //   const loadAll = useCallback(async () => {
// //     if (!sessionReady || !viewingId) return;
// //     setLoading(true);
// //     setErr(null);

// //     try {
// //       // profile
// //       const pRes = await fetch(`${API_BASE_URL}/users/${viewingId}/profile`, { headers: authHeaders });
// //       if (!pRes.ok) throw new Error(`Profile HTTP ${pRes.status}`);
// //       const pData = await pRes.json();
// //       const norm = normalizeUser(pData);
// //       setProfile(norm);

// //       // posts (your route)
// //       const poRes = await fetch(`${API_BASE_URL}/users/${viewingId}/posts`, { headers: authHeaders });
// //       if (!poRes.ok) throw new Error(`Posts HTTP ${poRes.status}`);
// //       const poData = await poRes.json();
// //       const rows = Array.isArray(poData) ? poData : poData?.posts || [];
// //       setPosts(rows);
// //       const postCount = rows.length;

// //       // counts
// //       const [follCountRes, wingCountRes] = await Promise.all([
// //         fetch(`${API_BASE_URL}/social/followers/${viewingId}/count`, { headers: authHeaders }),
// //         fetch(`${API_BASE_URL}/social/following/${viewingId}/count`, { headers: authHeaders }),
// //       ]);
// //       if (!follCountRes.ok) throw new Error(`Followers Count HTTP ${follCountRes.status}`);
// //       if (!wingCountRes.ok) throw new Error(`Following Count HTTP ${wingCountRes.status}`);
// //       const follCountData = await follCountRes.json();
// //       const wingCountData = await wingCountRes.json();

// //       setCounts({
// //         posts: postCount,
// //         followers: Number(follCountData?.count ?? 0),
// //         following: Number(wingCountData?.count ?? 0),
// //       });
// //     } catch (e) {
// //       setErr(e?.message || "Failed to load profile");
// //       setProfile(null);
// //       setPosts([]);
// //       setCounts({ posts: 0, followers: 0, following: 0 });
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [API_BASE_URL, sessionReady, viewingId, authHeaders]);

// const loadAll = useCallback(async () => {
//   console.log("[CommunityProfile] loadAll:start", { sessionReady, viewingId });
//   if (!sessionReady || !viewingId) {
//     console.log("[CommunityProfile] loadAll:skip", { sessionReady, viewingId });
//     return;
//   }

//   setLoading(true);
//   setErr(null);

//   try {
//     // profile
//     const pRes = await fetch(`${API_BASE_URL}/users/${viewingId}/profile`, { headers: authHeaders });
//     console.log("[CommunityProfile] profile:status", pRes.status);
//     if (!pRes.ok) throw new Error(`Profile HTTP ${pRes.status}`);
//     const pData = await pRes.json();
//     console.log("[CommunityProfile] profile:data", pData);
//     const norm = normalizeUser(pData);
//     console.log("[CommunityProfile] profile:normalized", norm);
//     setProfile(norm);

//     // posts (your route)
//     const poRes = await fetch(`${API_BASE_URL}/users/${viewingId}/posts`, { headers: authHeaders });
//     console.log("[CommunityProfile] posts:status", poRes.status);
//     if (!poRes.ok) throw new Error(`Posts HTTP ${poRes.status}`);
//     const poData = await poRes.json();
//     console.log("[CommunityProfile] posts:data", poData);
//     const rows = Array.isArray(poData) ? poData : poData?.posts || [];
//     console.log("[CommunityProfile] posts:count", rows.length);
//     setPosts(rows);
//     const postCount = rows.length;

//     // counts
//     const [follCountRes, wingCountRes] = await Promise.all([
//       fetch(`${API_BASE_URL}/social/followers/${viewingId}/count`, { headers: authHeaders }),
//       fetch(`${API_BASE_URL}/social/following/${viewingId}/count`, { headers: authHeaders }),
//     ]);
//     console.log("[CommunityProfile] followersCount:status", follCountRes.status);
//     console.log("[CommunityProfile] followingCount:status", wingCountRes.status);
//     if (!follCountRes.ok) throw new Error(`Followers Count HTTP ${follCountRes.status}`);
//     if (!wingCountRes.ok) throw new Error(`Following Count HTTP ${wingCountRes.status}`);
//     const follCountData = await follCountRes.json();
//     const wingCountData = await wingCountRes.json();
//     console.log("[CommunityProfile] followersCount:data", follCountData);
//     console.log("[CommunityProfile] followingCount:data", wingCountData);

//     setCounts({
//       posts: postCount,
//       followers: Number(follCountData?.count ?? 0),
//       following: Number(wingCountData?.count ?? 0),
//     });
//   } catch (e) {
//     console.error("[CommunityProfile] loadAll:error", e);
//     setErr(e?.message || "Failed to load profile");
//     setProfile(null);
//     setPosts([]);
//     setCounts({ posts: 0, followers: 0, following: 0 });
//   } finally {
//     setLoading(false);
//     console.log("[CommunityProfile] loadAll:done");
//   }
// }, [API_BASE_URL, sessionReady, viewingId, authHeaders]);


//   useEffect(() => { loadAll(); }, [loadAll]);

//   // 4) Followers modal
//   const openFollowers = async () => {
//     setFollowersOpen(true);
//     setFollowersLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/social/followers/${viewingId}`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`Followers HTTP ${res.status}`);
//       const data = await res.json();
//       // tolerate either array of users or {followers:[...]}
//       const list = Array.isArray(data) ? data : data?.followers || [];
//       setFollowers(list.map(normalizeUser));
//     } catch {
//       setFollowers([]);
//     } finally {
//       setFollowersLoading(false);
//     }
//   };

//   // 5) Save (bookmark) a post
//   const savePost = async (post) => {
//     if (!auth?.userId) {
//       Alert.alert("Sign in required", "Please sign in to save posts.");
//       return;
//     }
//     try {
//       const res = await fetch(`${API_BASE_URL}/saves`, {
//         method: "POST",
//         headers: { ...authHeaders, "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: Number(auth.userId), post_id: Number(post.id) }),
//       });
//       if (!res.ok) throw new Error(`Save HTTP ${res.status}`);
//       Alert.alert("Saved", "This post has been saved.");
//     } catch (e) {
//       Alert.alert("Save failed", e?.message || "Could not save this post.");
//     }
//   };

//   const isMe = Number(viewingId) === Number(auth.userId);

//   /* ---------------- UI ---------------- */
//   return (
//     <SafeAreaView style={styles.page}>
//       {/* Top bar */}
//       <View style={styles.topbar}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.9}>
//           <Ionicons name="arrow-back" size={18} color={COLORS.text} />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity>
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
//           numColumns={3}
//           columnWrapperStyle={styles.gridRow}
//           ListHeaderComponent={
//             <ProfileHeader
//               profile={profile}
//               counts={counts}
//               isMe={isMe}
//               onFollowersPress={openFollowers}
//               onRefresh={loadAll}
//             />
//           }
//           renderItem={({ item }) => (
//             <PostTile post={item} onSave={() => savePost(item)} />
//           )}
//           ListEmptyComponent={<View style={styles.emptyWrap}><Text style={styles.meta}>No posts yet.</Text></View>}
//           contentContainerStyle={{
//             paddingBottom: 20,
//             paddingHorizontal: 12,
//             paddingTop: Platform.OS === "web" ? 16 : 8,
//             ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
//           }}
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
//                 const name = fullName(item);
//                 return (
//                   <View style={styles.followerRow}>
//                     <Avatar uri={item?.image_url} name={name} size={40} />
//                     <View style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
//                       <Text style={styles.followerName} numberOfLines={1}>{name}</Text>
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

// function ProfileHeader({ profile, counts, isMe, onFollowersPress, onRefresh }) {
//   const name = fullName(profile);

//   return (
//     <>
//       <View style={styles.headerCard}>
//         <Avatar uri={profile?.image_url} name={name} size={76} />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text numberOfLines={1} style={styles.name}>{name}</Text>
//           {!!profile?.username && <Text style={styles.username}>@{profile.username}</Text>}
//           {!!profile?.bio && <Text style={styles.bio} numberOfLines={3}>{profile.bio}</Text>}
//         </View>
//       </View>

//       <View style={styles.metricsRow}>
//         <Metric label="Posts" value={counts.posts} />
//         <TouchableOpacity onPress={onFollowersPress} activeOpacity={0.85}>
//           <Metric label="Followers" value={counts.followers} pressable />
//         </TouchableOpacity>
//         <Metric label="Following" value={counts.following} />
//       </View>

//       <View style={styles.actionsRow}>
//         <TouchableOpacity onPress={onRefresh} style={styles.actionBtn} activeOpacity={0.9}>
//           <Ionicons name="refresh" size={16} color={COLORS.text} />
//           <Text style={styles.actionBtnText}>Refresh</Text>
//         </TouchableOpacity>
//         {isMe ? (
//           <View style={styles.actionBtnDisabled}>
//             <Ionicons name="person-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.actionBtnText}>This is you</Text>
//           </View>
//         ) : null}
//       </View>

//       <View style={styles.gridHeader}>
//         <Ionicons name="grid-outline" size={16} color={COLORS.subtext} />
//         <Text style={styles.gridHeaderText}>Posts</Text>
//       </View>
//     </>
//   );
// }

// function Metric({ label, value, pressable }) {
//   return (
//     <View style={[styles.metric, pressable && { backgroundColor: "#EEF3F9" }]}>
//       <Text style={styles.metricValue}>{Number(value) || 0}</Text>
//       <Text style={styles.metricLabel}>{label}</Text>
//     </View>
//   );
// }

// function PostTile({ post, onSave }) {
//   // Generic map icon tile; customize if your /users/:id/posts returns cover_url
//   const caption =
//     post?.caption ||
//     post?.title ||
//     (post?.content?.title ?? "") ||
//     "Itinerary";
//     // inside PostTile
//     const cover = post?.cover_url;


//   return (
//     <View style={styles.tile}>
//       <View style={styles.thumb}>
//         <Ionicons name="map-outline" size={22} color={COLORS.text} />
//       </View>
        
//       <View style={styles.tileFooter}>
//         <Text numberOfLines={1} style={styles.tileCaption}>
//           {caption}
//         </Text>
//         <TouchableOpacity onPress={onSave} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
//           <Ionicons name="bookmark-outline" size={18} color={COLORS.text} />
//         </TouchableOpacity>
//       </View>
//     </View>
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

//   headerCard: {
//     flexDirection: "row",
//     gap: 12,
//     padding: 12,
//     marginHorizontal: 12,
//     marginTop: 6,
//     marginBottom: 8,
//     borderRadius: 16,
//     backgroundColor: COLORS.card,
//     borderColor: COLORS.border,
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   name: { fontSize: 18, fontWeight: "800", color: COLORS.text },
//   username: { color: COLORS.subtext, marginTop: 2, fontWeight: "700" },
//   bio: { color: "#0F172A", marginTop: 6 },

//   metricsRow: {
//     marginHorizontal: 12,
//     flexDirection: "row",
//     gap: 10,
//     marginBottom: 8,
//   },
//   metric: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 10,
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//   },
//   metricValue: { fontWeight: "800", color: COLORS.text, fontSize: 16 },
//   metricLabel: { color: COLORS.subtext, fontWeight: "700", marginTop: 2 },

//   actionsRow: {
//     marginHorizontal: 12,
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 8,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//   },
//   actionBtnDisabled: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#F3F6FA",
//   },
//   actionBtnText: { color: COLORS.text, fontWeight: "800" },

//   gridHeader: {
//     marginTop: 8,
//     marginBottom: 6,
//     marginHorizontal: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   gridHeaderText: { color: COLORS.subtext, fontWeight: "800" },

//   gridRow: { gap: 6, paddingHorizontal: 0 },

//   tile: {
//     flex: 1,
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     margin: 3,
//     overflow: "hidden",
//   },
//   thumb: {
//     height: 92,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F1F5FB",
//   },
//   tileFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   tileCaption: { flex: 1, color: "#0F172A", fontWeight: "700" },

//   emptyWrap: { padding: 24, alignItems: "center" },

//   // followers sheet
//   sheetBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.25)",
//   },
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
// });


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

// /** Extract a uniform user object from any backend shape */
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

// /** Avatar: image or single letter with black bg / white text */
// function LetterAvatar({ size = 76, name = "" }) {
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
// function Avatar({ uri, name, size = 76 }) {
//   if (!uri) return <LetterAvatar size={size} name={name} />;
//   return (
//     <Image
//       source={{ uri }}
//       style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#EAF0F6" }}
//     />
//   );
// }

// /* =========================================================
//    Community Profile (Instagram-like)
//    ========================================================= */
// export default function CommunityProfileScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   const [profile, setProfile] = useState(null); // normalized user
//   const [posts, setPosts] = useState([]);       // /users/:id/posts (post objects with content_id)
//   const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });

//   // tile preview modal
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewBusy, setPreviewBusy] = useState(false);
//   const [previewData, setPreviewData] = useState(null); // itinerary for selected post

//   // Followers sheet
//   const [followersOpen, setFollowersOpen] = useState(false);
//   const [followersLoading, setFollowersLoading] = useState(false);
//   const [followers, setFollowers] = useState([]);

//   // Which profile are we viewing? Default to "me"
//   const viewingIdFromRoute = toInt(route?.params?.userId);

//   // 1) Load auth
//   useEffect(() => {
//     (async () => {
//       try {
//         const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet(["token", "userId"]);
//         setAuth({
//           token: token || null,
//           userId: userIdRaw ? Number(userIdRaw) : null,
//         });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   // 2) Build headers
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

//   // 3) Fetch profile + posts + counts
//   const loadAll = useCallback(async () => {
//     if (!sessionReady || !viewingId) return;
//     setLoading(true);
//     setErr(null);

//     try {
//       // profile
//       const pRes = await fetch(`${API_BASE_URL}/users/${viewingId}/profile`, { headers: authHeaders });
//       if (!pRes.ok) throw new Error(`Profile HTTP ${pRes.status}`);
//       const pData = await pRes.json();
//       const norm = normalizeUser(pData);
//       setProfile(norm);

//       // posts (your route — may contain sparse user fields; we rely on profile for name/avatar)
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
//       const postCount = rows.length;

//       // counts (tolerate {count} OR {followers_count}/{following_count})
//       const [follCountRes, wingCountRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/social/followers/${viewingId}/count`, { headers: authHeaders }),
//         fetch(`${API_BASE_URL}/social/following/${viewingId}/count`, { headers: authHeaders }),
//       ]);
//       if (!follCountRes.ok) throw new Error(`Followers Count HTTP ${follCountRes.status}`);
//       if (!wingCountRes.ok) throw new Error(`Following Count HTTP ${wingCountRes.status}`);

//       const fJson = await follCountRes.json();
//       const wJson = await wingCountRes.json();

//       const followersCount = Number(
//         fJson?.count ?? fJson?.followers_count ?? 0
//       );
//       const followingCount = Number(
//         wJson?.count ?? wJson?.following_count ?? 0
//       );

//       setCounts({
//         posts: postCount,
//         followers: followersCount,
//         following: followingCount,
//       });
//     } catch (e) {
//       setErr(e?.message || "Failed to load profile");
//       setProfile(null);
//       setPosts([]);
//       setCounts({ posts: 0, followers: 0, following: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL, sessionReady, viewingId, authHeaders]);

//   useEffect(() => { loadAll(); }, [loadAll]);

//   // Followers modal
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

//   // Save (bookmark) a post
//   const savePost = async (post) => {
//     if (!auth?.userId) {
//       Alert.alert("Sign in required", "Please sign in to save posts.");
//       return;
//     }
//     try {
//       const res = await fetch(`${API_BASE_URL}/saves`, {
//         method: "POST",
//         headers: { ...authHeaders, "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: Number(auth.userId), post_id: Number(post.id) }),
//       });
//       if (!res.ok) throw new Error(`Save HTTP ${res.status}`);
//       Alert.alert("Saved", "This post has been saved.");
//     } catch (e) {
//       Alert.alert("Save failed", e?.message || "Could not save this post.");
//     }
//   };

//   // Open a grid tile => fetch its itinerary once and show ItineraryCard in modal
//   const openPreview = async (post) => {
//     if (!post?.content_id) return;
//     setPreviewOpen(true);
//     setPreviewBusy(true);
//     setPreviewData(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/itineraries/${post.content_id}`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`Itinerary HTTP ${res.status}`);
//       const data = await res.json();
//       const it = Array.isArray(data) ? data[0] : data;
//       setPreviewData(it || null);
//     } catch {
//       setPreviewData(null);
//     } finally {
//       setPreviewBusy(false);
//     }
//   };

//   const isMe = Number(viewingId) === Number(auth.userId);
//   const nameForHeader = fullName(profile || {});

//   /* ---------------- UI ---------------- */
//   return (
//     <SafeAreaView style={styles.page}>
//       {/* Top bar */}
//       <View style={styles.topbar}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.9}>
//           <Ionicons name="arrow-back" size={18} color={COLORS.text} />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity>
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
//           numColumns={3}
//           columnWrapperStyle={styles.gridRow}
//           ListHeaderComponent={
//             <ProfileHeader
//               profile={profile}
//               name={nameForHeader}
//               counts={counts}
//               isMe={isMe}
//               onFollowersPress={openFollowers}
//               onRefresh={loadAll}
//             />
//           }
//           renderItem={({ item }) => (
//             <PostTile post={item} onOpen={() => openPreview(item)} onSave={() => savePost(item)} />
//           )}
//           ListEmptyComponent={<View style={styles.emptyWrap}><Text style={styles.meta}>No posts yet.</Text></View>}
//           contentContainerStyle={{
//             paddingBottom: 24,
//             paddingHorizontal: 12,
//             paddingTop: Platform.OS === "web" ? 16 : 8,
//             ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
//           }}
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

//       {/* Post preview modal with ItineraryCard */}
//       <Modal visible={previewOpen} animationType="fade" transparent onRequestClose={() => setPreviewOpen(false)}>
//         <Pressable style={styles.previewBackdrop} onPress={() => setPreviewOpen(false)} />
//         <View style={styles.previewSheet}>
//           <View style={styles.previewHeader}>
//             <Text style={styles.previewTitle}>Post</Text>
//             <TouchableOpacity onPress={() => setPreviewOpen(false)}>
//               <Ionicons name="close" size={20} color={COLORS.text} />
//             </TouchableOpacity>
//           </View>

//           {previewBusy ? (
//             <View style={styles.center}><ActivityIndicator /></View>
//           ) : !previewData ? (
//             <View style={styles.center}><Text style={styles.meta}>No details available.</Text></View>
//           ) : (
//             <ItineraryCard
//               item={{
//                 title: previewData.title,
//                 city: previewData.city || previewData.destination,
//                 start_date: previewData.start_date,
//                 end_date: previewData.end_date,
//                 budget: previewData.budget,
//                 style: previewData.style,
//                 cover_url: previewData.cover_url,
//                 days: previewData.days || [],
//               }}
//               onPress={undefined}
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
//       <View style={styles.headerCard}>
//         <Avatar uri={profile?.image_url} name={name} size={76} />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text numberOfLines={1} style={styles.name}>{name}</Text>
//           {!!profile?.username && <Text style={styles.username}>@{profile.username}</Text>}
//           {!!profile?.bio && <Text style={styles.bio} numberOfLines={3}>{profile.bio}</Text>}
//         </View>
//       </View>

//       <View style={styles.metricsRow}>
//         <Metric label="Posts" value={counts.posts} />
//         <TouchableOpacity onPress={onFollowersPress} activeOpacity={0.85}>
//           <Metric label="Followers" value={counts.followers} pressable />
//         </TouchableOpacity>
//         <Metric label="Following" value={counts.following} />
//       </View>

//       <View style={styles.actionsRow}>
//         <TouchableOpacity onPress={onRefresh} style={styles.actionBtn} activeOpacity={0.9}>
//           <Ionicons name="refresh" size={16} color={COLORS.text} />
//           <Text style={styles.actionBtnText}>Refresh</Text>
//         </TouchableOpacity>
//         {isMe ? (
//           <View style={styles.actionBtnDisabled}>
//             <Ionicons name="person-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.actionBtnText}>This is you</Text>
//           </View>
//         ) : null}
//       </View>

//       <View style={styles.gridHeader}>
//         <Ionicons name="grid-outline" size={16} color={COLORS.subtext} />
//         <Text style={styles.gridHeaderText}>Posts</Text>
//       </View>
//     </>
//   );
// }

// function Metric({ label, value, pressable }) {
//   return (
//     <View style={[styles.metric, pressable && { backgroundColor: "#EEF3F9" }]}>
//       <Text style={styles.metricValue}>{Number(value) || 0}</Text>
//       <Text style={styles.metricLabel}>{label}</Text>
//     </View>
//   );
// }

// function PostTile({ post, onOpen, onSave }) {
//   // Caption only—cover/full itinerary is loaded on demand in preview
//   const caption = post?.caption || "Itinerary";
//   return (
//     <TouchableOpacity onPress={onOpen} activeOpacity={0.9} style={styles.tile}>
//       <View style={styles.thumb}>
//         <Ionicons name="map-outline" size={22} color={COLORS.text} />
//       </View>
//       <View style={styles.tileFooter}>
//         <Text numberOfLines={1} style={styles.tileCaption}>
//           {caption}
//         </Text>
//         <TouchableOpacity onPress={onSave} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
//           <Ionicons name="bookmark-outline" size={18} color={COLORS.text} />
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
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

//   headerCard: {
//     flexDirection: "row",
//     gap: 12,
//     padding: 12,
//     marginHorizontal: 12,
//     marginTop: 6,
//     marginBottom: 8,
//     borderRadius: 16,
//     backgroundColor: COLORS.card,
//     borderColor: COLORS.border,
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   name: { fontSize: 18, fontWeight: "800", color: COLORS.text },
//   username: { color: COLORS.subtext, marginTop: 2, fontWeight: "700" },
//   bio: { color: "#0F172A", marginTop: 6 },

//   metricsRow: {
//     marginHorizontal: 12,
//     flexDirection: "row",
//     gap: 10,
//     marginBottom: 8,
//   },
//   metric: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 10,
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//   },
//   metricValue: { fontWeight: "800", color: COLORS.text, fontSize: 16 },
//   metricLabel: { color: COLORS.subtext, fontWeight: "700", marginTop: 2 },

//   actionsRow: {
//     marginHorizontal: 12,
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 8,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//   },
//   actionBtnDisabled: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#F3F6FA",
//   },
//   actionBtnText: { color: "#0F3A6B", fontWeight: "800" },

//   gridHeader: {
//     marginTop: 8,
//     marginBottom: 6,
//     marginHorizontal: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   gridHeaderText: { color: COLORS.subtext, fontWeight: "800" },

//   gridRow: { gap: 6, paddingHorizontal: 0 },

//   tile: {
//     flex: 1,
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     margin: 3,
//     overflow: "hidden",
//   },
//   thumb: {
//     height: 110,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F1F5FB",
//   },
//   tileFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   tileCaption: { flex: 1, color: "#0F172A", fontWeight: "700" },

//   emptyWrap: { padding: 24, alignItems: "center" },

//   // followers sheet
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

//   // post preview modal
//   previewBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
//   previewSheet: {
//     position: "absolute",
//     left: 12, right: 12, bottom: 12,
//     top: Platform.OS === "web" ? "20%" : "18%",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 12,
//   },
//   previewHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   previewTitle: { flex: 1, textAlign: "center", fontWeight: "800", color: COLORS.text },
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import getBaseURL from "../../config/env";
import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";

const API_BASE_URL = getBaseURL();

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

/** Avatar with single-letter fallback (black bg / white text) */
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

/* =========================================================
   Community Profile (Instagram-like header + inline posts)
   ========================================================= */
export default function CommunityProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [auth, setAuth] = useState({ token: null, userId: null });
  const [sessionReady, setSessionReady] = useState(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [profile, setProfile] = useState(null); // normalized user
  const [posts, setPosts] = useState([]); // [{id,user_id,content_id,caption,created_at}]
  const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });

  // followers modal
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followers, setFollowers] = useState([]);

  // itinerary cache for inline cards
  const [itCache, setItCache] = useState({}); // { [content_id]: itinerary }
  const [itBusy, setItBusy] = useState({});   // { [content_id]: true }

  const viewingIdFromRoute = toInt(route?.params?.userId);

  // auth
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

  // headers
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

  // load profile + posts + counts, and prefetch itineraries
  const loadAll = useCallback(async () => {
    if (!sessionReady || !viewingId) return;
    setLoading(true);
    setErr(null);

    try {
      // profile
      const pRes = await fetch(`${API_BASE_URL}/users/${viewingId}/profile`, { headers: authHeaders });
      if (!pRes.ok) throw new Error(`Profile HTTP ${pRes.status}`);
      const pData = await pRes.json();
      setProfile(normalizeUser(pData));

      // posts (user’s posts)
      const poRes = await fetch(`${API_BASE_URL}/users/${viewingId}/posts`, { headers: authHeaders });
      if (!poRes.ok) throw new Error(`Posts HTTP ${poRes.status}`);
      const poData = await poRes.json();
      const rows = (Array.isArray(poData) ? poData : poData?.posts || []).map((p) => ({
        id: Number(p.id),
        user_id: Number(p.user_id),
        content_id: Number(p.content_id),
        caption: p.caption || "",
        created_at: p.created_at,
      }));
      setPosts(rows);

      // counts
      const [follCountRes, wingCountRes] = await Promise.all([
        fetch(`${API_BASE_URL}/social/followers/${viewingId}/count`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/social/following/${viewingId}/count`, { headers: authHeaders }),
      ]);
      if (!follCountRes.ok) throw new Error(`Followers Count HTTP ${follCountRes.status}`);
      if (!wingCountRes.ok) throw new Error(`Following Count HTTP ${wingCountRes.status}`);

      const fJson = await follCountRes.json();
      const wJson = await wingCountRes.json();

      setCounts({
        posts: rows.length,
        followers: Number(fJson?.count ?? fJson?.followers_count ?? 0),
        following: Number(wJson?.count ?? wJson?.following_count ?? 0),
      });

      // prefetch itineraries for posts (once)
      const needed = rows
        .map((r) => r.content_id)
        .filter((cid) => cid && !itCache[cid] && !itBusy[cid]);

      if (needed.length) {
        const nextBusy = { ...itBusy };
        needed.forEach((cid) => (nextBusy[cid] = true));
        setItBusy(nextBusy);

        const fetched = await Promise.all(
          needed.map(async (cid) => {
            try {
              const res = await fetch(`${API_BASE_URL}/itineraries/${cid}`, { headers: authHeaders });
              if (!res.ok) return [cid, null];
              const data = await res.json();
              return [cid, Array.isArray(data) ? data[0] : data];
            } catch {
              return [cid, null];
            }
          })
        );

        const add = { ...itCache };
        fetched.forEach(([cid, it]) => (add[cid] = it || null));
        setItCache(add);

        const cleared = { ...nextBusy };
        needed.forEach((cid) => delete cleared[cid]);
        setItBusy(cleared);
      }
    } catch (e) {
      setErr(e?.message || "Failed to load profile");
      setProfile(null);
      setPosts([]);
      setCounts({ posts: 0, followers: 0, following: 0 });
    } finally {
      setLoading(false);
    }
  }, [sessionReady, viewingId, authHeaders, itCache, itBusy]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // followers list
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

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={styles.page}>
      {/* Top bar */}
      <View style={styles.topbar}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.9}>
          <Ionicons name="arrow-back" size={18} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity> */}
        <Text style={styles.brand}>Community</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
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
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
          renderItem={({ item }) => {
            const it = itCache[item.content_id];
            return (
              <View style={styles.postCard}>
                {/* <TouchableOpacity
                  // style={[styles.actionBtn, styles.actionBtnDanger, isDeleting && { opacity: 0.6 }]}
                  // onPress={() => confirmDelete(item)}
                  // disabled={isDeleting}
                  // accessibilityLabel="Delete itinerary"
                  // accessibilityState={{ disabled: isDeleting }}
                > */}
                  <Ionicons
                    // name={isDeleting ? "hourglass-outline" : "trash-outline"}
                    name="trash-outline"
                    size={16}
                    color="#B91C1C"
                  />
                  <Text style={[styles.actionText, styles.actionTextDanger]}>
                    delete
                    {/* {isDeleting ? "Deleting…" : "Delete"} */}
                  </Text>
                {/* </TouchableOpacity> */}
                {!!item.caption && <Text style={styles.caption}>{item.caption}</Text>}
                {it ? (
                  <ItineraryCard
                    item={{
                      title: it.title,
                      city: it.city || it.destination,
                      start_date: it.start_date,
                      end_date: it.end_date,
                      budget: it.budget,
                      style: it.style,
                      cover_url: it.cover_url,
                      days: it.days || [],
                    }}
                    onPress={undefined}
                  />
                ) : (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator />
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={<View style={styles.emptyWrap}><Text style={styles.meta}>No posts yet.</Text></View>}
          contentContainerStyle={{
            paddingBottom: 24,
            paddingHorizontal: 12,
            paddingTop: Platform.OS === "web" ? 16 : 8,
            ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
          }}
          scrollEnabled={false}
          nestedScrollEnabled
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
              <ActivityIndicator />
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

/* --------------------------- Subcomponents --------------------------- */

function ProfileHeader({ profile, name, counts, isMe, onFollowersPress, onRefresh }) {
  return (
    <>
      {/* Instagram-like top: avatar + counters + name + edit button */}
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

/* --------------------------- Styles --------------------------- */

const COLORS = {
  page: "#F6FAFD",
  card: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#64748B",
  primary: "#0F70F0",
  border: "#EAF0F6",
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.page },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 8 : 6,
    paddingBottom: 10,
    ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#EEF3F9",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backText: { color: COLORS.text, fontWeight: "800" },
  brand: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },

  center: { alignItems: "center", justifyContent: "center", padding: 20 },
  meta: { color: COLORS.subtext, fontWeight: "600" },

  errorBox: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...(Platform.OS === "web" ? { maxWidth: 860, alignSelf: "center", width: "100%" } : {}),
  },
  errorText: { color: "#B42318", fontWeight: "600" },
  link: { color: COLORS.primary, fontWeight: "700" },

  /* instagram-like header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  counterWrap: { alignItems: "center", justifyContent: "center", flex: 1 },
  counterValue: { fontWeight: "800", color: COLORS.text, fontSize: 18 },
  counterLabel: { color: COLORS.subtext, fontWeight: "700" },
  name: {
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  editBtn: {
    marginTop: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#EEF3F9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  editBtnText: { color: "#0F3A6B", fontWeight: "800" },

  postsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  postsHeaderText: { color: COLORS.subtext, fontWeight: "800" },

  /* post list (inline ItineraryCard per post) */
  postCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  caption: { marginBottom: 8, color: "#0F172A", fontWeight: "600" },
  loadingBox: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5FB",
    borderRadius: 12,
  },

  emptyWrap: { padding: 24, alignItems: "center" },

  // followers modal
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 8,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sheetTitle: { flex: 1, textAlign: "center", fontWeight: "800", color: COLORS.text },
  followerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  followerName: { fontWeight: "700", color: "#0F172A" },
  followerSub: { color: COLORS.subtext, fontSize: 12 },
  sep: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 64 },
});
