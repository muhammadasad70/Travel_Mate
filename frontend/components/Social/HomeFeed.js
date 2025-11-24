

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Image,
//   Alert,
//   Share,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";
// import getBaseURL from "../../config/env"; // ✅ use your existing env.js

// const API_BASE_URL = getBaseURL();

// /* ----------------------- Home Feed ----------------------- */
// export default function HomeFeed() {
//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [posts, setPosts] = useState([]);

//   // load token/user once
//   useEffect(() => {
//     (async () => {
//       try {
//         const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet([
//           "token",
//           "userId",
//         ]);
//         const userId = Number(userIdRaw);
//         setAuth({
//           token: token || null,
//           userId: Number.isFinite(userId) ? userId : null,
//         });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   // headers: keep GETs clean; add content-type only for writes
//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   const load = async () => {
//     if (!sessionReady) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       // normalize ids/counts to numbers
//       const rows = (Array.isArray(data) ? data : data?.posts || []).map((p) => ({
//         ...p,
//         id: Number(p.id),
//         user_id: Number(p.user_id),
//         likes_count: Number(p.likes_count) || 0,
//         liked: !!p.liked,
//       }));
//       setPosts(rows);
//     } catch (e) {
//       setErr(e?.message || "Failed to load posts");
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sessionReady, authHeaders]);

//   const ensureAuthed = () => {
//     if (!auth.token || !auth.userId) {
//       Alert.alert("Sign in required", "Please sign in to like and comment.");
//       return false;
//     }
//     return true;
//   };

//   const normalizeId = (x) => Number(x);

//   const toggleLike = async (post) => {
//     if (!ensureAuthed()) return;

//     const targetId = normalizeId(post.id);
//     const liked = !!post.liked;

//     // optimistic update
//     setPosts((ps) =>
//       ps.map((p) =>
//         normalizeId(p.id) === targetId
//           ? {
//               ...p,
//               liked: !liked,
//               likes_count: (Number(p.likes_count) || 0) + (liked ? -1 : 1),
//             }
//           : p
//       )
//     );

//     try {
//       // send via query + JSON body; cover handlers that bind differently
//       const url = `${API_BASE_URL}/posts/${targetId}/like?user_id=${auth.userId}`;
//       const method = liked ? "DELETE" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: { ...authHeaders, "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: auth.userId,
//           UserID: auth.userId,
//           post_id: targetId,
//           PostID: targetId,
//         }),
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     } catch {
//       // revert
//       setPosts((ps) =>
//         ps.map((p) =>
//           normalizeId(p.id) === targetId
//             ? {
//                 ...p,
//                 liked,
//                 likes_count: (Number(p.likes_count) || 0) + (liked ? 1 : -1),
//               }
//             : p
//         )
//       );
//     }
//   };
//   const renderItem = ({ item }) => (
//     <PostCard
//       post={item}
//       onLike={() => toggleLike(item)}
//       headers={authHeaders}
//       me={auth.userId}
//       authed={!!auth.token && !!auth.userId}
//     />
//   );

//   return (
//     <View style={styles.page}>
//       <View style={styles.header}>
//         <Text style={styles.h1}>Home</Text>
//         <TouchableOpacity onPress={load} style={styles.refreshBtn}>
//           <Ionicons name="refresh" size={16} color={COLORS.text} />
//           <Text style={styles.refreshText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>

//       {!sessionReady ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Authorizing…</Text>
//         </View>
//       ) : loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Loading feed…</Text>
//         </View>
//       ) : err ? (
//         <View style={styles.errorBox}>
//           <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
//           <Text style={styles.errorText}>{err}</Text>
//           <TouchableOpacity onPress={load} style={{ marginLeft: "auto" }}>
//             <Text style={styles.link}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : posts.length === 0 ? (
//         <View style={styles.center}>
//           <Text style={styles.meta}>No posts yet. Be the first!</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={posts}
//           keyExtractor={(p) => String(p.id)}
//           renderItem={renderItem}
//           ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//           contentContainerStyle={{
//             paddingHorizontal: 16,
//             paddingBottom: 120,
//             paddingTop: Platform.OS === "web" ? 92 : 16,
//             ...(Platform.OS === "web"
//               ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//               : {}),
//           }}
//           scrollEnabled={false}
//           nestedScrollEnabled

//         />
//       )}
//     </View>
//   );
// }

// /* ----------------------- Post card with itinerary + comments + actions ----------------------- */
// function PostCard({ post, onLike, headers, me, authed }) {
//   const navigation = useNavigation();

//   const [showComments, setShowComments] = useState(false);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");

//   const [itLoading, setItLoading] = useState(!!post?.content_id);
//   const [itData, setItData] = useState(null);

//   const isOwner =
//     Number(me) &&
//     (Number(post.user_id) === Number(me) ||
//       Number(post?.user?.id) === Number(me));

//   useEffect(() => {
//     let cancelled = false;

//     const parseItinerary = (data) => (Array.isArray(data) ? data[0] : data) || null;

//     const fetchItinerary = async () => {
//       if (!post?.content_id) return;
//       setItLoading(true);
//       try {
//         // Try multiple endpoints so non-owners still get a public view.
//         const candidates = [
//           `${API_BASE_URL}/itineraries/${post.content_id}`,                 // owner/full
//           `${API_BASE_URL}/posts/${post.id}/itinerary`,                     // post-scoped public
//           `${API_BASE_URL}/public/itineraries/${post.content_id}`,          // explicit public
//           `${API_BASE_URL}/itineraries/${post.content_id}?public=1`,        // query flag
//         ];

//         let found = null;
//         for (const url of candidates) {
//           try {
//             const r = await fetch(url, { headers });
//             if (r.ok) {
//               const d = await r.json();
//               found = parseItinerary(d);
//               // If the API returns a minimal public shape, still accept it
//               if (found) break;
//             }
//           } catch {
//             // try next candidate
//           }
//         }

//         // As a last resort, synthesize a minimal preview from the post fields
//         if (!found) {
//           found = {
//             title: post.caption || "Untitled Itinerary",
//             city: post.city || post.destination || undefined,
//             start_date: post.start_date || undefined,
//             end_date: post.end_date || undefined,
//             style: post.style || undefined,
//             budget: post.budget || undefined,
//             days: [],
//           };
//         }

//         if (!cancelled) setItData(found);
//       } catch {
//         if (!cancelled) setItData(null);
//       } finally {
//         if (!cancelled) setItLoading(false);
//       }
//     };

//     fetchItinerary();
//     return () => {
//       cancelled = true;
//     };
//   }, [post?.content_id, post?.id, headers]);

//   const loadComments = async () => {
//     setLoadingComments(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`, { headers });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const raw = await res.json();
//       const list = Array.isArray(raw) ? raw : raw?.comments || [];
//       setComments(list); // your SQL orders DESC; we render as-is
//     } catch {
//       setComments([]);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const sendComment = async () => {
//     const body = (commentText || "").trim();
//     if (!body) return;
//     if (!authed) {
//       Alert.alert("Sign in required", "Please sign in to comment.");
//       return;
//     }

//     // optimistic
//     const temp = {
//       id: `tmp-${Date.now()}`,
//       post_id: post.id,
//       user_id: me,
//       text: body,
//       created_at: new Date().toISOString(),
//     };
//     setComments((c) => [temp, ...c]);
//     setCommentText("");

//     try {
//       const res = await fetch(`${API_BASE_URL}/comments`, {
//         method: "POST",
//         headers: { ...headers, "Content-Type": "application/json" },
//         body: JSON.stringify({ post_id: post.id, user_id: me, text: body }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const saved = await res.json();
//       setComments((c) => c.map((x) => (x.id === temp.id ? saved : x)));
//     } catch {
//       setComments((c) => c.filter((x) => x.id !== temp.id));
//     }
//   };

//   const toggleComments = () => {
//     const next = !showComments;
//     setShowComments(next);
//     if (next && comments.length === 0) {
//       loadComments();
//     }
//   };

//   const authorName =
//     (post?.user &&
//       ((post.user.first_name || post.user.FirstName || "") +
//         " " +
//         (post.user.last_name || post.user.LastName || "")))?.trim() ||
//     `User #${post.user_id ?? "?"}`;

//   /* ---------- itinerary actions (View, Edit, Share, Delete / or View, Share) ---------- */
//   const onView = () => {
//     if (!post?.content_id) return;
//     navigation.navigate("ItineraryDetails", { id: post.content_id });
//   };

//   const onEdit = () => {
//     if (!isOwner || !post?.content_id) return;
//     navigation.navigate("EditItinerary", { id: post.content_id });
//   };

//   const onShare = async () => {
//     const title = itData?.title || post?.caption || "Itinerary";
//     const shareUrl = `${API_BASE_URL.replace(/\/+$/, "")}/itineraries/${post.content_id}`;
//     try {
//       await Share.share({
//         message: `${title}\n\nCheck this itinerary on TravelMate:\n${shareUrl}`,
//         title,
//       });
//     } catch {}
//   };

//   // Name for a comment from embedded user object (Go: User with FirstName/LastName)
//   const commentAuthor = (c) => {
//     const u = c.user || c.User;
//     const first = u?.first_name ?? u?.FirstName ?? "";
//     const last = u?.last_name ?? u?.LastName ?? "";
//     const name = `${first} ${last}`.trim();
//     return name || `User #${c.user_id}`;
//   };

//   return (
//     <View style={styles.card}>
//       {/* header */}
//       <View style={styles.cardHeader}>
//         <Image
//           source={{ uri: post.author_image || "https://placehold.co/64x64?text=U" }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text numberOfLines={1} style={styles.author}>
//             {authorName}
//           </Text>
//           <Text numberOfLines={1} style={styles.time}>
//             {post.created_at ? new Date(post.created_at).toLocaleString() : ""}
//           </Text>
//         </View>
//       </View>

//       {/* caption */}
//       {!!post.caption && <Text style={styles.caption}>{post.caption}</Text>}

//       {/* itinerary preview */}
//       {post?.content_id ? (
//         itLoading ? (
//           <View style={[styles.center, { paddingVertical: 10 }]}>
//             <ActivityIndicator />
//           </View>
//         ) : itData ? (
//           <View style={{ marginTop: 10 }}>
//             <ItineraryCard
//               item={{
//                 title: itData.title || "Untitled Itinerary",
//                 city: itData.city || itData.destination || "-",
//                 start_date: itData.start_date,
//                 end_date: itData.end_date,
//                 budget: itData.budget,
//                 style: itData.style,
//                 cover_url: itData.cover_url,
//                 days: Array.isArray(itData.days) ? itData.days : [],
//               }}
//               onPress={undefined}
//             />
//           </View>
//         ) : null
//       ) : null}

//       {/* itinerary actions row */}
//       {post?.content_id && (
//         <View style={styles.itinActions}>
//           <ActionPill icon="eye-outline" label="View" onPress={onView} />
//           <ActionPill icon="share-social-outline" label="Share" onPress={onShare} />
//         </View>
//       )}

//       {/* post actions (like + comments) */}
//       <View style={styles.actions}>
//         <TouchableOpacity onPress={onLike} style={styles.actionBtn} activeOpacity={0.85}>
//           <Ionicons
//             name={post.liked ? "heart" : "heart-outline"}
//             size={18}
//             color={post.liked ? "#DC2626" : COLORS.text}
//           />
//           <Text style={styles.actionText}>{post.likes_count || 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={toggleComments} style={styles.actionBtn} activeOpacity={0.85}>
//           <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.text} />
//           <Text style={styles.actionText}>Comments</Text>
//         </TouchableOpacity>
//       </View>

//       {/* comments */}
//       {showComments && (
//         <View style={styles.commentsBox}>
//           {loadingComments ? (
//             <View style={styles.center}>
//               <ActivityIndicator />
//             </View>
//           ) : comments.length === 0 ? (
//             <Text style={styles.meta}>Be the first to comment.</Text>
//           ) : (
//             comments.map((c) => (
//               <View key={String(c.id)} style={styles.commentRow}>
//                 <Image
//                   source={{ uri: c.user_image || "https://placehold.co/40x40?text=U" }}
//                   style={styles.cAvatar}
//                 />
//                 <View style={{ flex: 1, minWidth: 0 }}>
//                   <Text style={styles.cAuthor}>{commentAuthor(c)}</Text>
//                   <Text style={styles.cText}>{c.text}</Text>
//                   <Text style={styles.cTime}>
//                     {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
//                   </Text>
//                 </View>
//               </View>
//             ))
//           )}

//           <View style={styles.commentComposer}>
//             <TextInput
//               value={commentText}
//               onChangeText={setCommentText}
//               placeholder="Write a comment…"
//               placeholderTextColor="#94A3B8"
//               style={styles.commentInput}
//             />
//             <TouchableOpacity
//               onPress={sendComment}
//               disabled={!commentText.trim()}
//               activeOpacity={0.9}
//               style={[
//                 styles.commentSend,
//                 !commentText.trim() && { opacity: 0.6 },
//               ]}
//             >
//               <Ionicons name="send" size={16} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ----------------------- Small pill button ----------------------- */
// function ActionPill({ icon, label, onPress, destructive }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[
//         styles.pill,
//         destructive && { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },
//       ]}
//     >
//       <Ionicons
//         name={icon}
//         size={14}
//         color={destructive ? "#991B1B" : COLORS.text}
//         style={{ marginRight: 6 }}
//       />
//       <Text style={[styles.pillText, destructive && { color: "#991B1B" }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* ----------------------- styles ----------------------- */
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

//   header: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     ...(Platform.OS === "web" ? { maxWidth: 860, alignSelf: "center", width: "100%" } : {}),
//   },
//   h1: { fontSize: 22, fontWeight: "800", color: COLORS.text, flex: 1 },
//   refreshBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//   },
//   refreshText: { color: COLORS.text, fontWeight: "700", fontSize: 12 },

//   card: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//   },

//   cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
//   avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#DDE7F2" },
//   author: { fontWeight: "800", color: "#0F172A" },
//   time: { color: COLORS.subtext, fontSize: 12 },

//   caption: { marginTop: 10, color: "#0F172A" },

//   /* itinerary actions */
//   itinActions: {
//     marginTop: 10,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   pill: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   pillText: { fontSize: 12, fontWeight: "800", color: COLORS.text },

//   /* post actions */
//   actions: {
//     marginTop: 12,
//     flexDirection: "row",
//     gap: 16,
//     alignItems: "center",
//   },
//   actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
//   actionText: { color: COLORS.text, fontWeight: "700" },

//   /* comments */
//   commentsBox: {
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderColor: COLORS.border,
//     paddingTop: 10,
//     gap: 10,
//   },
//   commentRow: { flexDirection: "row", gap: 10 },
//   cAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#E2E8F0" },
//   cAuthor: { fontWeight: "700", color: "#0F172A" },
//   cText: { color: "#0F172A" },
//   cTime: { color: COLORS.subtext, fontSize: 11, marginTop: 2 },

//   commentComposer: { flexDirection: "row", gap: 8, alignItems: "center" },
//   commentInput: {
//     flex: 1,
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: "#0F172A",
//   },
//   commentSend: {
//     width: 42,
//     height: 42,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//   },

//   // states
//   center: { alignItems: "center", justifyContent: "center", padding: 18 },
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
// });


// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Image,
//   Alert,
//   Share,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";
// import getBaseURL from "../../config/env";

// const API_BASE_URL = getBaseURL();

// /* ----------------------- Home Feed ----------------------- */
// export default function HomeFeed() {
//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [posts, setPosts] = useState([]);

//   // load token/user once (safe even if keys missing)
//   useEffect(() => {
//     (async () => {
//       try {
//         const entries = await AsyncStorage.multiGet(["token", "userId"]);
//         const tokenEntry = entries.find((pair) => pair[0] === "token");
//         const userIdEntry = entries.find((pair) => pair[0] === "userId");

//         const token = tokenEntry ? tokenEntry[1] : null;
//         const userIdRaw = userIdEntry ? userIdEntry[1] : null;
//         const userIdNum = Number(userIdRaw);

//         setAuth({
//           token: token || null,
//           userId: Number.isFinite(userIdNum) ? userIdNum : null,
//         });
//       } catch (e) {
//         // if storage fails, still let the app render
//         setAuth({ token: null, userId: null });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   // headers: keep GETs clean; add content-type only for writes
//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   const normalizeId = (x) => {
//     const n = Number(x);
//     return Number.isFinite(n) ? n : null;
//   };

//   const load = useCallback(async () => {
//     if (!sessionReady) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();

//       const raw = Array.isArray(data) ? data : data?.posts || [];
//       const rows = raw.map((p) => ({
//         ...p,
//         id: normalizeId(p.id),
//         user_id: normalizeId(p.user_id),
//         likes_count: Number(p.likes_count) || 0,
//         liked: !!p.liked,
//       })).filter((p) => p.id != null);

//       setPosts(rows);
//     } catch (e) {
//       setErr(e?.message || "Failed to load posts");
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionReady, authHeaders]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const ensureAuthed = () => {
//     if (!auth.token || !auth.userId) {
//       Alert.alert("Sign in required", "Please sign in to like and comment.");
//       return false;
//     }
//     return true;
//   };

//   const toggleLike = async (post) => {
//     if (!ensureAuthed()) return;

//     const targetId = normalizeId(post.id);
//     if (targetId == null) return;

//     const liked = !!post.liked;

//     // optimistic update
//     setPosts((ps) =>
//       ps.map((p) =>
//         normalizeId(p.id) === targetId
//           ? {
//               ...p,
//               liked: !liked,
//               likes_count: (Number(p.likes_count) || 0) + (liked ? -1 : 1),
//             }
//           : p
//       )
//     );

//     try {
//       const url = `${API_BASE_URL}/posts/${targetId}/like?user_id=${auth.userId}`;
//       const method = liked ? "DELETE" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: { ...authHeaders, "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: auth.userId,
//           UserID: auth.userId,
//           post_id: targetId,
//           PostID: targetId,
//         }),
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     } catch {
//       // revert
//       setPosts((ps) =>
//         ps.map((p) =>
//           normalizeId(p.id) === targetId
//             ? {
//                 ...p,
//                 liked,
//                 likes_count: (Number(p.likes_count) || 0) + (liked ? 1 : -1),
//               }
//             : p
//         )
//       );
//     }
//   };

//   const renderItem = ({ item }) => (
//     <PostCard
//       post={item}
//       onLike={() => toggleLike(item)}
//       headers={authHeaders}
//       me={auth.userId}
//       authed={!!auth.token && !!auth.userId}
//     />
//   );

//   return (
//     <View style={styles.page}>
//       <View style={styles.header}>
//         <Text style={styles.h1}>Home</Text>
//         <TouchableOpacity onPress={load} style={styles.refreshBtn}>
//           <Ionicons name="refresh" size={16} color={COLORS.text} />
//           <Text style={styles.refreshText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>

//       {!sessionReady ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Authorizing…</Text>
//         </View>
//       ) : loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Loading feed…</Text>
//         </View>
//       ) : err ? (
//         <View style={styles.errorBox}>
//           <Ionicons
//             name="alert-circle"
//             size={18}
//             color="#B42318"
//             style={{ marginRight: 6 }}
//           />
//           <Text style={styles.errorText}>{err}</Text>
//           <TouchableOpacity onPress={load} style={{ marginLeft: "auto" }}>
//             <Text style={styles.link}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : posts.length === 0 ? (
//         <View style={styles.center}>
//           <Text style={styles.meta}>No posts yet. Be the first!</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={posts}
//           keyExtractor={(p) => String(p.id)}
//           renderItem={renderItem}
//           ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//           contentContainerStyle={{
//             paddingHorizontal: 16,
//             paddingBottom: 120,
//             paddingTop: Platform.OS === "web" ? 92 : 16,
//             ...(Platform.OS === "web"
//               ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//               : {}),
//           }}
//           // if HomeFeed lives inside another ScrollView, keep this false
//           scrollEnabled={false}
//           nestedScrollEnabled={true}
//         />
//       )}
//     </View>
//   );
// }

// /* ----------------------- Post card with itinerary + comments + actions ----------------------- */
// function PostCard({ post, onLike, headers, me, authed }) {
//   const navigation = useNavigation();

//   const [showComments, setShowComments] = useState(false);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");

//   const [itLoading, setItLoading] = useState(!!post?.content_id);
//   const [itData, setItData] = useState(null);

//   const isOwner =
//     Number(me) &&
//     (Number(post.user_id) === Number(me) ||
//       Number(post?.user?.id) === Number(me));

//   useEffect(() => {
//     let cancelled = false;

//     const parseItinerary = (data) =>
//       (Array.isArray(data) ? data[0] : data) || null;

//     const fetchItinerary = async () => {
//       if (!post?.content_id) return;
//       setItLoading(true);
//       try {
//         const candidates = [
//           `${API_BASE_URL}/itineraries/${post.content_id}`,
//           `${API_BASE_URL}/posts/${post.id}/itinerary`,
//           `${API_BASE_URL}/public/itineraries/${post.content_id}`,
//           `${API_BASE_URL}/itineraries/${post.content_id}?public=1`,
//         ];

//         let found = null;
//         for (const url of candidates) {
//           try {
//             const r = await fetch(url, { headers });
//             if (r.ok) {
//               const d = await r.json();
//               found = parseItinerary(d);
//               if (found) break;
//             }
//           } catch {
//             // try next candidate
//           }
//         }

//         if (!found) {
//           // fallback minimal preview
//           found = {
//             title: post.caption || "Untitled Itinerary",
//             city: post.city || post.destination || undefined,
//             start_date: post.start_date || undefined,
//             end_date: post.end_date || undefined,
//             style: post.style || undefined,
//             budget: post.budget || undefined,
//             days: [],
//           };
//         }

//         if (!cancelled) setItData(found);
//       } catch {
//         if (!cancelled) setItData(null);
//       } finally {
//         if (!cancelled) setItLoading(false);
//       }
//     };

//     fetchItinerary();
//     return () => {
//       cancelled = true;
//     };
//   }, [post?.content_id, post?.id, headers]);

//   const loadComments = async () => {
//     setLoadingComments(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`, {
//         headers,
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const raw = await res.json();
//       const list = Array.isArray(raw) ? raw : raw?.comments || [];
//       setComments(list);
//     } catch {
//       setComments([]);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const sendComment = async () => {
//     const body = (commentText || "").trim();
//     if (!body) return;
//     if (!authed) {
//       Alert.alert("Sign in required", "Please sign in to comment.");
//       return;
//     }

//     // optimistic
//     const temp = {
//       id: `tmp-${Date.now()}`,
//       post_id: post.id,
//       user_id: me,
//       text: body,
//       created_at: new Date().toISOString(),
//     };
//     setComments((c) => [temp, ...c]);
//     setCommentText("");

//     try {
//       const res = await fetch(`${API_BASE_URL}/comments`, {
//         method: "POST",
//         headers: { ...headers, "Content-Type": "application/json" },
//         body: JSON.stringify({ post_id: post.id, user_id: me, text: body }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const saved = await res.json();
//       setComments((c) => c.map((x) => (x.id === temp.id ? saved : x)));
//     } catch {
//       setComments((c) => c.filter((x) => x.id !== temp.id));
//     }
//   };

//   const toggleComments = () => {
//     const next = !showComments;
//     setShowComments(next);
//     if (next && comments.length === 0) {
//       loadComments();
//     }
//   };

//   const authorName =
//     (post?.user &&
//       (
//         (post.user.first_name || post.user.FirstName || "") +
//         " " +
//         (post.user.last_name || post.user.LastName || "")
//       ).trim()) ||
//     `User #${post.user_id ?? "?"}`;

//   /* ---------- itinerary actions (View, Share) ---------- */
//   const onView = () => {
//     if (!post?.content_id) return;
//     // make sure this matches your navigator route name
//     navigation.navigate("ItineraryDetails", { id: post.content_id });
//   };

//   const onShare = async () => {
//     if (!post?.content_id) return;
//     const title = itData?.title || post?.caption || "Itinerary";
//     const shareUrl = `${API_BASE_URL.replace(/\/+$/, "")}/itineraries/${
//       post.content_id
//     }`;
//     try {
//       await Share.share({
//         message: `${title}\n\nCheck this itinerary on TravelMate:\n${shareUrl}`,
//         title,
//       });
//     } catch {
//       // ignore share errors
//     }
//   };

//   const commentAuthor = (c) => {
//     const u = c.user || c.User;
//     const first = u?.first_name ?? u?.FirstName ?? "";
//     const last = u?.last_name ?? u?.LastName ?? "";
//     const name = `${first} ${last}`.trim();
//     return name || `User #${c.user_id}`;
//   };

//   return (
//     <View style={styles.card}>
//       {/* header */}
//       <View style={styles.cardHeader}>
//         <Image
//           source={{
//             uri:
//               post.author_image ||
//               "https://placehold.co/64x64?text=U",
//           }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text numberOfLines={1} style={styles.author}>
//             {authorName}
//           </Text>
//           <Text numberOfLines={1} style={styles.time}>
//             {post.created_at
//               ? new Date(post.created_at).toLocaleString()
//               : ""}
//           </Text>
//         </View>
//       </View>

//       {/* caption */}
//       {!!post.caption && <Text style={styles.caption}>{post.caption}</Text>}

//       {/* itinerary preview */}
//       {post?.content_id ? (
//         itLoading ? (
//           <View style={[styles.center, { paddingVertical: 10 }]}>
//             <ActivityIndicator />
//           </View>
//         ) : itData ? (
//           <View style={{ marginTop: 10 }}>
//             <ItineraryCard
//               item={{
//                 title: itData.title || "Untitled Itinerary",
//                 city: itData.city || itData.destination || "-",
//                 start_date: itData.start_date,
//                 end_date: itData.end_date,
//                 budget: itData.budget,
//                 style: itData.style,
//                 cover_url: itData.cover_url,
//                 days: Array.isArray(itData.days) ? itData.days : [],
//               }}
//               onPress={undefined}
//             />
//           </View>
//         ) : null
//       ) : null}

//       {/* itinerary actions row */}
//       {post?.content_id && (
//         <View style={styles.itinActions}>
//           <ActionPill icon="eye-outline" label="View" onPress={onView} />
//           <ActionPill
//             icon="share-social-outline"
//             label="Share"
//             onPress={onShare}
//           />
//         </View>
//       )}

//       {/* post actions (like + comments) */}
//       <View style={styles.actions}>
//         <TouchableOpacity
//           onPress={onLike}
//           style={styles.actionBtn}
//           activeOpacity={0.85}
//         >
//           <Ionicons
//             name={post.liked ? "heart" : "heart-outline"}
//             size={18}
//             color={post.liked ? "#DC2626" : COLORS.text}
//           />
//           <Text style={styles.actionText}>{post.likes_count || 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={toggleComments}
//           style={styles.actionBtn}
//           activeOpacity={0.85}
//         >
//           <Ionicons
//             name="chatbubble-ellipses-outline"
//             size={18}
//             color={COLORS.text}
//           />
//           <Text style={styles.actionText}>Comments</Text>
//         </TouchableOpacity>
//       </View>

//       {/* comments */}
//       {showComments && (
//         <View style={styles.commentsBox}>
//           {loadingComments ? (
//             <View style={styles.center}>
//               <ActivityIndicator />
//             </View>
//           ) : comments.length === 0 ? (
//             <Text style={styles.meta}>Be the first to comment.</Text>
//           ) : (
//             comments.map((c) => (
//               <View key={String(c.id)} style={styles.commentRow}>
//                 <Image
//                   source={{
//                     uri:
//                       c.user_image ||
//                       "https://placehold.co/40x40?text=U",
//                   }}
//                   style={styles.cAvatar}
//                 />
//                 <View style={{ flex: 1, minWidth: 0 }}>
//                   <Text style={styles.cAuthor}>{commentAuthor(c)}</Text>
//                   <Text style={styles.cText}>{c.text}</Text>
//                   <Text style={styles.cTime}>
//                     {c.created_at
//                       ? new Date(c.created_at).toLocaleString()
//                       : ""}
//                   </Text>
//                 </View>
//               </View>
//             ))
//           )}

//           <View style={styles.commentComposer}>
//             <TextInput
//               value={commentText}
//               onChangeText={setCommentText}
//               placeholder="Write a comment…"
//               placeholderTextColor="#94A3B8"
//               style={styles.commentInput}
//             />
//             <TouchableOpacity
//               onPress={sendComment}
//               disabled={!commentText.trim()}
//               activeOpacity={0.9}
//               style={[
//                 styles.commentSend,
//                 !commentText.trim() && { opacity: 0.6 },
//               ]}
//             >
//               <Ionicons name="send" size={16} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ----------------------- Small pill button ----------------------- */
// function ActionPill({ icon, label, onPress, destructive }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[
//         styles.pill,
//         destructive && {
//           backgroundColor: "#FEE2E2",
//           borderColor: "#FECACA",
//         },
//       ]}
//     >
//       <Ionicons
//         name={icon}
//         size={14}
//         color={destructive ? "#991B1B" : COLORS.text}
//         style={{ marginRight: 6 }}
//       />
//       <Text
//         style={[
//           styles.pillText,
//           destructive && { color: "#991B1B" },
//         ]}
//       >
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// /* ----------------------- styles ----------------------- */
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

//   header: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     ...(Platform.OS === "web"
//       ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//       : {}),
//   },
//   h1: { fontSize: 22, fontWeight: "800", color: COLORS.text, flex: 1 },
//   refreshBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//   },
//   refreshText: { color: COLORS.text, fontWeight: "700", fontSize: 12 },

//   card: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//   },

//   cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
//   avatar: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "#DDE7F2",
//   },
//   author: { fontWeight: "800", color: "#0F172A" },
//   time: { color: COLORS.subtext, fontSize: 12 },

//   caption: { marginTop: 10, color: "#0F172A" },

//   /* itinerary actions */
//   itinActions: {
//     marginTop: 10,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   pill: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   pillText: { fontSize: 12, fontWeight: "800", color: COLORS.text },

//   /* post actions */
//   actions: {
//     marginTop: 12,
//     flexDirection: "row",
//     gap: 16,
//     alignItems: "center",
//   },
//   actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
//   actionText: { color: COLORS.text, fontWeight: "700" },

//   /* comments */
//   commentsBox: {
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderColor: COLORS.border,
//     paddingTop: 10,
//     gap: 10,
//   },
//   commentRow: { flexDirection: "row", gap: 10 },
//   cAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#E2E8F0",
//   },
//   cAuthor: { fontWeight: "700", color: "#0F172A" },
//   cText: { color: "#0F172A" },
//   cTime: { color: COLORS.subtext, fontSize: 11, marginTop: 2 },

//   commentComposer: {
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "center",
//   },
//   commentInput: {
//     flex: 1,
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: "#0F172A",
//   },
//   commentSend: {
//     width: 42,
//     height: 42,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//   },

//   // states
//   center: { alignItems: "center", justifyContent: "center", padding: 18 },
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
//     ...(Platform.OS === "web"
//       ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//       : {}),
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },
// });


// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Image,
//   Alert,
//   Share,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";
// import getBaseURL from "../../config/env";

// const API_BASE_URL = getBaseURL();

// /* ----------------------- Home Feed ----------------------- */
// export default function HomeFeed() {
//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [posts, setPosts] = useState([]);

//   // load token/user once (safe even if keys missing)
//   useEffect(() => {
//     (async () => {
//       try {
//         const entries = await AsyncStorage.multiGet(["token", "userId"]);
//         const tokenEntry = entries.find((pair) => pair[0] === "token");
//         const userIdEntry = entries.find((pair) => pair[0] === "userId");

//         const token = tokenEntry ? tokenEntry[1] : null;
//         const userIdRaw = userIdEntry ? userIdEntry[1] : null;
//         const userIdNum = Number(userIdRaw);

//         setAuth({
//           token: token || null,
//           userId: Number.isFinite(userIdNum) ? userIdNum : null,
//         });
//       } catch (e) {
//         // if storage fails, still let the app render
//         setAuth({ token: null, userId: null });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   // headers: keep GETs clean; add content-type only for writes
//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   const normalizeId = (x) => {
//     const n = Number(x);
//     return Number.isFinite(n) ? n : null;
//   };

//   const load = useCallback(async () => {
//     if (!sessionReady) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();

//       const raw = Array.isArray(data) ? data : data?.posts || [];
//       const rows = raw.map((p) => ({
//         ...p,
//         id: normalizeId(p.id),
//         user_id: normalizeId(p.user_id),
//         likes_count: Number(p.likes_count) || 0,
//         liked: !!p.liked,
//       })).filter((p) => p.id != null);
//       console.log("🧾 Normalized posts:", rows);
//       setPosts(rows);
//     } catch (e) {
//       setErr(e?.message || "Failed to load posts");
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionReady, authHeaders]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const ensureAuthed = () => {
//     if (!auth.token || !auth.userId) {
//       Alert.alert("Sign in required", "Please sign in to like and comment.");
//       return false;
//     }
//     return true;
//   };

//   const toggleLike = async (post) => {
//     if (!ensureAuthed()) return;

//     const targetId = normalizeId(post.id);
//     if (targetId == null) return;

//     const liked = !!post.liked;

//     // optimistic update
//     setPosts((ps) =>
//       ps.map((p) =>
//         normalizeId(p.id) === targetId
//           ? {
//               ...p,
//               liked: !liked,
//               likes_count: (Number(p.likes_count) || 0) + (liked ? -1 : 1),
//             }
//           : p
//       )
//     );

//     try {
//       const url = `${API_BASE_URL}/posts/${targetId}/like?user_id=${auth.userId}`;
//       const method = liked ? "DELETE" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: { ...authHeaders, "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: auth.userId,
//           UserID: auth.userId,
//           post_id: targetId,
//           PostID: targetId,
//         }),
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     } catch {
//       // revert
//       setPosts((ps) =>
//         ps.map((p) =>
//           normalizeId(p.id) === targetId
//             ? {
//                 ...p,
//                 liked,
//                 likes_count: (Number(p.likes_count) || 0) + (liked ? 1 : -1),
//               }
//             : p
//         )
//       );
//     }
//   };

//   const renderItem = ({ item }) => (
//     <PostCard
//       post={item}
//       onLike={() => toggleLike(item)}
//       headers={authHeaders}
//       me={auth.userId}
//       authed={!!auth.token && !!auth.userId}
//     />
//   );

//   return (
//     <View style={styles.page}>
//       <View style={styles.header}>
//         <Text style={styles.h1}>Home</Text>
//         <TouchableOpacity onPress={load} style={styles.refreshBtn}>
//           <Ionicons name="refresh" size={16} color={COLORS.text} />
//           <Text style={styles.refreshText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>

//       {!sessionReady ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Authorizing…</Text>
//         </View>
//       ) : loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator />
//           <Text style={styles.meta}>Loading feed…</Text>
//         </View>
//       ) : err ? (
//         <View style={styles.errorBox}>
//           <Ionicons
//             name="alert-circle"
//             size={18}
//             color="#B42318"
//             style={{ marginRight: 6 }}
//           />
//           <Text style={styles.errorText}>{err}</Text>
//           <TouchableOpacity onPress={load} style={{ marginLeft: "auto" }}>
//             <Text style={styles.link}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : posts.length === 0 ? (
//         <View style={styles.center}>
//           <Text style={styles.meta}>No posts yet. Be the first!</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={posts}
//           keyExtractor={(p) => String(p.id)}
//           renderItem={renderItem}
//           ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//           contentContainerStyle={{
//             paddingHorizontal: 16,
//             paddingBottom: 120,
//             paddingTop: Platform.OS === "web" ? 92 : 16,
//             ...(Platform.OS === "web"
//               ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//               : {}),
//           }}
//           // if HomeFeed lives inside another ScrollView, keep this false
//           scrollEnabled={false}
//           nestedScrollEnabled={true}
//         />
//       )}
//     </View>
//   );
// }

// /* ----------------------- Post card with itinerary + comments + actions ----------------------- */
// function PostCard({ post, onLike, headers, me, authed }) {
//   const navigation = useNavigation();

//   const [showComments, setShowComments] = useState(false);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");

//   const [itLoading, setItLoading] = useState(!!post?.content_id);
//   const [itData, setItData] = useState(null);

//   const isOwner =
//     Number(me) &&
//     (Number(post.user_id) === Number(me) ||
//       Number(post?.user?.id) === Number(me));

//   useEffect(() => {
//     let cancelled = false;

//     const parseItinerary = (data) =>
//       (Array.isArray(data) ? data[0] : data) || null;

//     const fetchItinerary = async () => {
//       if (!post?.content_id) return;
//       setItLoading(true);
//       try {
//         const candidates = [
//           `${API_BASE_URL}/itineraries/${post.content_id}`,
//           `${API_BASE_URL}/posts/${post.id}/itinerary`,
//           `${API_BASE_URL}/public/itineraries/${post.content_id}`,
//           `${API_BASE_URL}/itineraries/${post.content_id}?public=1`,
//         ];

//         let found = null;
//         for (const url of candidates) {
//           try {
//             const r = await fetch(url, { headers });
//             if (r.ok) {
//               const d = await r.json();
//               found = parseItinerary(d);
//               if (found) break;
//             }
//           } catch {
//             // try next candidate
//           }
//         }

//         if (!found) {
//           // fallback minimal preview
//           found = {
//             title: post.caption || "Untitled Itinerary",
//             city: post.city || post.destination || undefined,
//             start_date: post.start_date || undefined,
//             end_date: post.end_date || undefined,
//             style: post.style || undefined,
//             budget: post.budget || undefined,
//             days: [],
//           };
//         }

//         if (!cancelled) setItData(found);
//       } catch {
//         if (!cancelled) setItData(null);
//       } finally {
//         if (!cancelled) setItLoading(false);
//       }
//     };

//     fetchItinerary();
//     return () => {
//       cancelled = true;
//     };
//   }, [post?.content_id, post?.id, headers]);

//   const loadComments = async () => {
//     setLoadingComments(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`, {
//         headers,
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const raw = await res.json();
//       const list = Array.isArray(raw) ? raw : raw?.comments || [];
//       setComments(list);
//     } catch {
//       setComments([]);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const sendComment = async () => {
//     const body = (commentText || "").trim();
//     if (!body) return;
//     if (!authed) {
//       Alert.alert("Sign in required", "Please sign in to comment.");
//       return;
//     }

//     // optimistic
//     const temp = {
//       id: `tmp-${Date.now()}`,
//       post_id: post.id,
//       user_id: me,
//       text: body,
//       created_at: new Date().toISOString(),
//     };
//     setComments((c) => [temp, ...c]);
//     setCommentText("");

//     try {
//       const res = await fetch(`${API_BASE_URL}/comments`, {
//         method: "POST",
//         headers: { ...headers, "Content-Type": "application/json" },
//         body: JSON.stringify({ post_id: post.id, user_id: me, text: body }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const saved = await res.json();
//       setComments((c) => c.map((x) => (x.id === temp.id ? saved : x)));
//     } catch {
//       setComments((c) => c.filter((x) => x.id !== temp.id));
//     }
//   };

//   const toggleComments = () => {
//     const next = !showComments;
//     setShowComments(next);
//     if (next && comments.length === 0) {
//       loadComments();
//     }
//   };

//   const authorName =
//     (post?.user &&
//       (
//         (post.user.first_name || post.user.FirstName || "") +
//         " " +
//         (post.user.last_name || post.user.LastName || "")
//       ).trim()) ||
//     `User #${post.user_id ?? "?"}`;

//   /* ---------- itinerary actions (View, Share) ---------- */
//   const onView = () => {
//     if (!post?.content_id) return;
//     // make sure this matches your navigator route name
//     navigation.navigate("ItineraryDetails", { id: post.content_id });
//   };

//   const onShare = async () => {
//     if (!post?.content_id) return;
//     const title = itData?.title || post?.caption || "Itinerary";
//     const shareUrl = `${API_BASE_URL.replace(/\/+$/, "")}/itineraries/${
//       post.content_id
//     }`;
//     try {
//       await Share.share({
//         message: `${title}\n\nCheck this itinerary on TravelMate:\n${shareUrl}`,
//         title,
//       });
//     } catch {
//       // ignore share errors
//     }
//   };

//   const commentAuthor = (c) => {
//     const u = c.user || c.User;
//     const first = u?.first_name ?? u?.FirstName ?? "";
//     const last = u?.last_name ?? u?.LastName ?? "";
//     const name = `${first} ${last}`.trim();
//     return name || `User #${c.user_id}`;
//   };

//   return (
//     <View style={styles.card}>
//       {/* header */}
//       <View style={styles.cardHeader}>
//         <Image
//           source={{
//             uri:
//               post.author_image ||
//               "https://placehold.co/64x64?text=U",
//           }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text numberOfLines={1} style={styles.author}>
//             {authorName}
//           </Text>
//           <Text numberOfLines={1} style={styles.time}>
//             {post.created_at
//               ? new Date(post.created_at).toLocaleString()
//               : ""}
//           </Text>
//         </View>
//       </View>

//       {/* caption */}
//       {!!post.caption && <Text style={styles.caption}>{post.caption}</Text>}

//       {/* itinerary preview */}
//       {post?.content_id ? (
//         itLoading ? (
//           <View style={[styles.center, { paddingVertical: 10 }]}>
//             <ActivityIndicator />
//           </View>
//         ) : itData ? (
//           <View style={{ marginTop: 10 }}>
//             <ItineraryCard
//               item={{
//                 title: itData.title || "Untitled Itinerary",
//                 city: itData.city || itData.destination || "-",
//                 start_date: itData.start_date,
//                 end_date: itData.end_date,
//                 budget: itData.budget,
//                 style: itData.style,
//                 cover_url: itData.cover_url,
//                 days: Array.isArray(itData.days) ? itData.days : [],
//               }}
//               onPress={undefined}
//             />
//           </View>
//         ) : null
//       ) : null}

//       {/* itinerary actions row */}
//       {post?.content_id && (
//         <View style={styles.itinActions}>
//           <ActionPill icon="eye-outline" label="View" onPress={onView} />
//           <ActionPill
//             icon="share-social-outline"
//             label="Share"
//             onPress={onShare}
//           />
//         </View>
//       )}

//       {/* post actions (like + comments) */}
//       <View style={styles.actions}>
//         <TouchableOpacity
//           onPress={onLike}
//           style={styles.actionBtn}
//           activeOpacity={0.85}
//         >
//           <Ionicons
//             name={post.liked ? "heart" : "heart-outline"}
//             size={18}
//             color={post.liked ? "#DC2626" : COLORS.text}
//           />
//           <Text style={styles.actionText}>{post.likes_count || 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={toggleComments}
//           style={styles.actionBtn}
//           activeOpacity={0.85}
//         >
//           <Ionicons
//             name="chatbubble-ellipses-outline"
//             size={18}
//             color={COLORS.text}
//           />
//           <Text style={styles.actionText}>Comments</Text>
//         </TouchableOpacity>
//       </View>

//       {/* comments */}
//       {showComments && (
//         <View style={styles.commentsBox}>
//           {loadingComments ? (
//             <View style={styles.center}>
//               <ActivityIndicator />
//             </View>
//           ) : comments.length === 0 ? (
//             <Text style={styles.meta}>Be the first to comment.</Text>
//           ) : (
//             comments.map((c) => (
//               <View key={String(c.id)} style={styles.commentRow}>
//                 <Image
//                   source={{
//                     uri:
//                       c.user_image ||
//                       "https://placehold.co/40x40?text=U",
//                   }}
//                   style={styles.cAvatar}
//                 />
//                 <View style={{ flex: 1, minWidth: 0 }}>
//                   <Text style={styles.cAuthor}>{commentAuthor(c)}</Text>
//                   <Text style={styles.cText}>{c.text}</Text>
//                   <Text style={styles.cTime}>
//                     {c.created_at
//                       ? new Date(c.created_at).toLocaleString()
//                       : ""}
//                   </Text>
//                 </View>
//               </View>
//             ))
//           )}

//           <View style={styles.commentComposer}>
//             <TextInput
//               value={commentText}
//               onChangeText={setCommentText}
//               placeholder="Write a comment…"
//               placeholderTextColor="#94A3B8"
//               style={styles.commentInput}
//             />
//             <TouchableOpacity
//               onPress={sendComment}
//               disabled={!commentText.trim()}
//               activeOpacity={0.9}
//               style={[
//                 styles.commentSend,
//                 !commentText.trim() && { opacity: 0.6 },
//               ]}
//             >
//               <Ionicons name="send" size={16} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ----------------------- Small pill button ----------------------- */
// function ActionPill({ icon, label, onPress, destructive }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[
//         styles.pill,
//         destructive && {
//           backgroundColor: "#FEE2E2",
//           borderColor: "#FECACA",
//         },
//       ]}
//     >
//       <Ionicons
//         name={icon}
//         size={14}
//         color={destructive ? "#991B1B" : COLORS.text}
//         style={{ marginRight: 6 }}
//       />
//       <Text
//         style={[
//           styles.pillText,
//           destructive && { color: "#991B1B" },
//         ]}
//       >
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// /* ----------------------- styles ----------------------- */
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

//   header: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     ...(Platform.OS === "web"
//       ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//       : {}),
//   },
//   h1: { fontSize: 22, fontWeight: "800", color: COLORS.text, flex: 1 },
//   refreshBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//   },
//   refreshText: { color: COLORS.text, fontWeight: "700", fontSize: 12 },

//   card: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//   },

//   cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
//   avatar: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "#DDE7F2",
//   },
//   author: { fontWeight: "800", color: "#0F172A" },
//   time: { color: COLORS.subtext, fontSize: 12 },

//   caption: { marginTop: 10, color: "#0F172A" },

//   /* itinerary actions */
//   itinActions: {
//     marginTop: 10,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   pill: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   pillText: { fontSize: 12, fontWeight: "800", color: COLORS.text },

//   /* post actions */
//   actions: {
//     marginTop: 12,
//     flexDirection: "row",
//     gap: 16,
//     alignItems: "center",
//   },
//   actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
//   actionText: { color: COLORS.text, fontWeight: "700" },

//   /* comments */
//   commentsBox: {
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderColor: COLORS.border,
//     paddingTop: 10,
//     gap: 10,
//   },
//   commentRow: { flexDirection: "row", gap: 10 },
//   cAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#E2E8F0",
//   },
//   cAuthor: { fontWeight: "700", color: "#0F172A" },
//   cText: { color: "#0F172A" },
//   cTime: { color: COLORS.subtext, fontSize: 11, marginTop: 2 },

//   commentComposer: {
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "center",
//   },
//   commentInput: {
//     flex: 1,
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: "#0F172A",
//   },
//   commentSend: {
//     width: 42,
//     height: 42,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//   },

//   // states
//   center: { alignItems: "center", justifyContent: "center", padding: 18 },
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
//     ...(Platform.OS === "web"
//       ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//       : {}),
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },
// });


import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";
import getBaseURL from "../../config/env";

const API_BASE_URL = getBaseURL();

/* ----------------------- Home Feed ----------------------- */
export default function HomeFeed() {
  const [auth, setAuth] = useState({ token: null, userId: null });
  const [sessionReady, setSessionReady] = useState(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [posts, setPosts] = useState([]);

  // load token/user once
  useEffect(() => {
    (async () => {
      try {
        const [token, uid] = await AsyncStorage.multiGet(["token", "userId"]);
        const t = token?.[1] || null;
        const u = uid?.[1] ? Number(uid[1]) : null;
        setAuth({ token: t, userId: u });
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

  const load = useCallback(async () => {
    if (!sessionReady) return;
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`${API_BASE_URL}/posts`, { headers: authHeaders });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.posts || [];

      console.log("🔥 POSTS FROM BACKEND:", list);

      setPosts(list);
    } catch (e) {
      setErr(e.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [sessionReady, authHeaders]);

  useEffect(() => {
    load();
  }, [load]);

  const ensureAuthed = () => {
    if (!auth.token) {
      Alert.alert("Sign in required", "Please sign in to like and comment.");
      return false;
    }
    return true;
  };

  const toggleLike = async (post) => {
    if (!ensureAuthed()) return;

    const liked = !!post.liked;
    const postId = post.id;

    // optimistic update
    setPosts((ps) =>
      ps.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: !liked,
              likes_count: (p.likes_count || 0) + (liked ? -1 : 1),
            }
          : p
      )
    );

    try {
      const res = await fetch(
        `${API_BASE_URL}/posts/${postId}/like?user_id=${auth.userId}`,
        {
          method: liked ? "DELETE" : "POST",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: auth.userId,
            post_id: postId,
          }),
        }
      );
      if (!res.ok) throw new Error("like failed");
    } catch {
      // revert
      setPosts((ps) =>
        ps.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked,
                likes_count: (p.likes_count || 0) + (liked ? 1 : -1),
              }
            : p
        )
      );
    }
  };

  const renderItem = ({ item }) => (
    <PostCard
      post={item}
      onLike={() => toggleLike(item)}
      me={auth.userId}
      headers={authHeaders}
      authed={!!auth.token}
    />
  );

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.h1}>Home</Text>
        <TouchableOpacity onPress={load} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={16} color={COLORS.text} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {!sessionReady ? (
        <Loader label="Authorizing…" />
      ) : loading ? (
        <Loader label="Loading feed…" />
      ) : err ? (
        <ErrorBox err={err} onRetry={load} />
      ) : posts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.meta}>No posts yet. Be the first!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => String(p.id)}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 120,
            paddingTop: Platform.OS === "web" ? 92 : 16,
            ...(Platform.OS === "web"
              ? { maxWidth: 860, alignSelf: "center", width: "100%" }
              : {}),
          }}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

/* ----------------------- PostCard (uses backend itinerary directly!) ----------------------- */
function PostCard({ post, onLike, me, authed }) {
  const navigation = useNavigation();

  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const isOwner =
    Number(me) &&
    (Number(post.user_id) === Number(me) ||
      Number(post?.user?.id) === Number(me));

  const itinerary = post.itinerary; // 🟢 directly from backend

  const loadComments = async () => {
    setLoadingComments(true);

    try {
      const res = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`);
      const raw = await res.json();
      const list = Array.isArray(raw) ? raw : raw.comments || [];
      setComments(list);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const sendComment = async () => {
    if (!authed) {
      Alert.alert("Sign in required", "Please sign in to comment.");
      return;
    }

    const body = (commentText || "").trim();
    if (!body) return;

    const temp = {
      id: `tmp-${Date.now()}`,
      post_id: post.id,
      user_id: me,
      text: body,
      created_at: new Date().toISOString(),
    };

    setComments((c) => [temp, ...c]);
    setCommentText("");

    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id, user_id: me, text: body }),
      });
      const saved = await res.json();
      setComments((c) => c.map((x) => (x.id === temp.id ? saved : x)));
    } catch {
      setComments((c) => c.filter((x) => x.id !== temp.id));
    }
  };

  const onView = () => {
    if (!itinerary) return;
    navigation.navigate("ItineraryDetails", { id: itinerary.id });
  };

  const onShare = async () => {
    if (!itinerary) return;
    await Share.share({
      title: itinerary.title,
      message: `${itinerary.title}\n\nCheck this itinerary:\n${API_BASE_URL}/itineraries/${itinerary.id}`,
    });
  };

  const commentAuthor = (c) => {
    const u = c.user || c.User;
    const first = u?.first_name || "";
    const last = u?.last_name || "";
    return (first + " " + last).trim();
  };

  return (
    <View style={styles.card}>
      {/* header */}
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri:
              post.author_image ||
              "https://placehold.co/64x64?text=U",
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.author}>
            {post.user ? post.user.first_name + " " + post.user.last_name : ""}
          </Text>
          <Text style={styles.time}>
            {new Date(post.created_at).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* caption */}
      {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

      {/* itinerary preview — NO fetch needed */}
      {itinerary && (
        <View style={{ marginTop: 10 }}>
          <ItineraryCard
            item={{
              title: itinerary.title,
              city: itinerary.city,
              start_date: itinerary.start_date,
              end_date: itinerary.end_date,
              budget: itinerary.budget,
              style: itinerary.style,
              cover_url: itinerary.cover_url,
              days: itinerary.days || [],
            }}
          />
        </View>
      )}

      {/* itinerary action pills */}
      {itinerary && (
        <View style={styles.itinActions}>
          <ActionPill icon="eye-outline" label="View" onPress={onView} />
          <ActionPill
            icon="share-social-outline"
            label="Share"
            onPress={onShare}
          />
        </View>
      )}

      {/* post actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={18}
            color={post.liked ? "#DC2626" : COLORS.text}
          />
          <Text style={styles.actionText}>{post.likes_count || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const next = !showComments;
            setShowComments(next);
            if (next && comments.length === 0) loadComments();
          }}
          style={styles.actionBtn}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color={COLORS.text}
          />
          <Text style={styles.actionText}>Comments</Text>
        </TouchableOpacity>
      </View>

      {/* comments section */}
      {showComments && (
        <View style={styles.commentsBox}>
          {loadingComments ? (
            <ActivityIndicator />
          ) : comments.length === 0 ? (
            <Text style={styles.meta}>Be the first to comment.</Text>
          ) : (
            comments.map((c) => (
              <View key={String(c.id)} style={styles.commentRow}>
                <Image
                  style={styles.cAvatar}
                  source={{
                    uri:
                      c.user_image ||
                      "https://placehold.co/40x40?text=U",
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cAuthor}>{commentAuthor(c)}</Text>
                  <Text style={styles.cText}>{c.text}</Text>
                  <Text style={styles.cTime}>
                    {new Date(c.created_at).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          )}

          <View style={styles.commentComposer}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Write a comment…"
              style={styles.commentInput}
            />
            <TouchableOpacity
              disabled={!commentText.trim()}
              onPress={sendComment}
              style={[
                styles.commentSend,
                !commentText.trim() && { opacity: 0.6 },
              ]}
            >
              <Ionicons name="send" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

/* -------------------- Small UI components -------------------- */

function Loader({ label }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator />
      <Text style={styles.meta}>{label}</Text>
    </View>
  );
}

function ErrorBox({ err, onRetry }) {
  return (
    <View style={styles.errorBox}>
      <Ionicons name="alert-circle" size={18} color="#B42318" />
      <Text style={styles.errorText}>{err}</Text>
      <TouchableOpacity onPress={onRetry} style={{ marginLeft: "auto" }}>
        <Text style={styles.link}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

function ActionPill({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.pill}>
      <Ionicons name={icon} size={14} color={COLORS.text} />
      <Text style={styles.pillText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ----------------------- styles ----------------------- */
const COLORS = {
  page: "#F6FAFD",
  card: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#64748B",
  primary: "#0F70F0",
  border: "#EAF0F6",
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.page,
  },

  header: {
    paddingTop: Platform.OS === "web" ? 92 : 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    ...(Platform.OS === "web"
      ? { maxWidth: 860, alignSelf: "center", width: "100%" }
      : {}),
  },

  h1: { fontSize: 22, fontWeight: "800", color: COLORS.text, flex: 1 },

  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#EEF3F9",
  },

  refreshText: { color: COLORS.text, fontWeight: "700", fontSize: 12 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  author: { fontWeight: "800", color: "#0F172A" },
  time: { color: COLORS.subtext, fontSize: 12 },

  caption: { marginTop: 10, color: "#0F172A" },

  itinActions: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pillText: { fontSize: 12, fontWeight: "800", color: COLORS.text },

  actions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { color: COLORS.text, fontWeight: "700" },

  commentsBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 10,
    gap: 10,
  },

  commentRow: { flexDirection: "row", gap: 10 },
  cAvatar: { width: 32, height: 32, borderRadius: 16 },
  cAuthor: { fontWeight: "700", color: "#0F172A" },
  cText: { color: "#0F172A" },
  cTime: { color: COLORS.subtext, fontSize: 11 },

  commentComposer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F9FBFE",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  commentSend: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  center: { alignItems: "center", justifyContent: "center", padding: 18 },
  meta: { color: COLORS.subtext, fontWeight: "600" },

  errorBox: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...(Platform.OS === "web"
      ? { maxWidth: 860, alignSelf: "center", width: "100%" }
      : {}),
  },
  errorText: { color: "#B42318", fontWeight: "600" },
  link: { color: COLORS.primary, fontWeight: "700" },
});
