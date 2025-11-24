

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
//   ScrollView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import getBaseURL from "../../config/env";

// const API_BASE_URL = getBaseURL();

// /* ===================== HELPER FUNCTIONS ===================== */
// function formatDate(dateString) {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", { 
//     month: "short", 
//     day: "numeric",
//     year: "numeric" 
//   });
// }

// function calculateDays(startDate, endDate) {
//   if (!startDate || !endDate) return 0;
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   const diffTime = Math.abs(end - start);
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays || 1;
// }

// function timeAgo(dateString) {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffMs = now - date;
//   const diffMins = Math.floor(diffMs / 60000);
//   const diffHours = Math.floor(diffMs / 3600000);
//   const diffDays = Math.floor(diffMs / 86400000);

//   if (diffMins < 1) return "just now";
//   if (diffMins < 60) return `${diffMins}m ago`;
//   if (diffHours < 24) return `${diffHours}h ago`;
//   if (diffDays < 7) return `${diffDays}d ago`;
//   return formatDate(dateString);
// }

// /* ===================== HOME FEED ===================== */
// export default function HomeFeed() {
//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [posts, setPosts] = useState([]);

//   // Load token/user once
//   useEffect(() => {
//     (async () => {
//       try {
//         const [token, uid] = await AsyncStorage.multiGet(["token", "userId"]);
//         const t = token?.[1] || null;
//         const u = uid?.[1] ? Number(uid[1]) : null;
//         setAuth({ token: t, userId: u });
//       } finally {
//         setSessionReady(true);
//       }
//     })();
//   }, []);

//   const authHeaders = useMemo(() => {
//     const h = {};
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   const load = useCallback(async () => {
//     if (!sessionReady) return;
//     setLoading(true);
//     setErr(null);

//     try {
//       const res = await fetch(`${API_BASE_URL}/posts`, { headers: authHeaders });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const data = await res.json();
//       const list = Array.isArray(data) ? data : data.posts || [];

//       console.log("🔥 POSTS FROM BACKEND:", list);

//       setPosts(list);
//     } catch (e) {
//       setErr(e.message);
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionReady, authHeaders]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const ensureAuthed = () => {
//     if (!auth.token) {
//       Alert.alert("Sign in required", "Please sign in to like and comment.");
//       return false;
//     }
//     return true;
//   };

//   // 🔥 UPDATED toggleLike - No query params
//   const toggleLike = async (post) => {
//     if (!ensureAuthed()) return;

//     const liked = !!post.liked;
//     const postId = post.id;

//     // Optimistic update
//     setPosts((ps) =>
//       ps.map((p) =>
//         p.id === postId
//           ? {
//               ...p,
//               liked: !liked,
//               likes_count: (p.likes_count || 0) + (liked ? -1 : 1),
//             }
//           : p
//       )
//     );

//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/posts/${postId}/like`,
//         {
//           method: liked ? "DELETE" : "POST",
//           headers: authHeaders, // JWT handles user authentication
//         }
//       );
//       if (!res.ok) throw new Error("like failed");
//     } catch (err) {
//       console.error("Like error:", err);
//       // Revert on error
//       setPosts((ps) =>
//         ps.map((p) =>
//           p.id === postId
//             ? {
//                 ...p,
//                 liked,
//                 likes_count: (p.likes_count || 0) + (liked ? 1 : -1),
//               }
//             : p
//         )
//       );
//     }
//   };

//   // 🔥 NEW: Update comment count when comment is added
//   const handleCommentAdded = (postId) => {
//     setPosts((ps) =>
//       ps.map((p) =>
//         p.id === postId
//           ? { ...p, comments_count: (p.comments_count || 0) + 1 }
//           : p
//       )
//     );
//   };

//   const renderItem = ({ item }) => (
//     <PostCard
//       post={item}
//       onLike={() => toggleLike(item)}
//       onCommentAdded={handleCommentAdded}
//       me={auth.userId}
//       headers={authHeaders}
//       authed={!!auth.token}
//     />
//   );

//   return (
//     <View style={styles.page}>
//       <View style={styles.header}>
//         <Text style={styles.h1}>Community Feed</Text>
//         <TouchableOpacity onPress={load} style={styles.refreshBtn}>
//           <Ionicons name="refresh" size={16} color={COLORS.text} />
//           <Text style={styles.refreshText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>

//       {!sessionReady ? (
//         <Loader label="Authorizing…" />
//       ) : loading ? (
//         <Loader label="Loading feed…" />
//       ) : err ? (
//         <ErrorBox err={err} onRetry={load} />
//       ) : posts.length === 0 ? (
//         <View style={styles.center}>
//           <Ionicons name="images-outline" size={64} color={COLORS.subtext} />
//           <Text style={styles.emptyTitle}>No posts yet</Text>
//           <Text style={styles.meta}>Be the first to share your adventure!</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={posts}
//           keyExtractor={(p) => String(p.id)}
//           renderItem={renderItem}
//           ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
//           contentContainerStyle={{
//             paddingHorizontal: 16,
//             paddingBottom: 120,
//             paddingTop: 16,
//             ...(Platform.OS === "web"
//               ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//               : {}),
//           }}
//         />
//       )}
//     </View>
//   );
// }

// /* ===================== POST CARD WITH FULL ITINERARY ===================== */
// function PostCard({ post, onLike, me, authed, headers, onCommentAdded }) {
//   const [showComments, setShowComments] = useState(false);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");

//   const itinerary = post.itinerary;
//   const days = itinerary?.days || [];
//   const numDays = calculateDays(itinerary?.start_date, itinerary?.end_date);

//   const authorName = post.user 
//     ? `${post.user.first_name || ""} ${post.user.last_name || ""}`.trim() 
//     : "Unknown User";

//   // 🔥 Load comments when section is opened
//   useEffect(() => {
//     if (showComments && comments.length === 0) {
//       loadComments();
//     }
//   }, [showComments]);

//   const loadComments = async () => {
//     setLoadingComments(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`);
//       const raw = await res.json();
//       const list = Array.isArray(raw) ? raw : raw.comments || [];
//       setComments(list);
//     } catch (err) {
//       console.error("Load comments error:", err);
//       setComments([]);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   // 🔥 UPDATED sendComment - Include auth headers
//   const sendComment = async () => {
//     if (!authed) {
//       Alert.alert("Sign in required", "Please sign in to comment.");
//       return;
//     }

//     const body = (commentText || "").trim();
//     if (!body) return;

//     const temp = {
//       id: `tmp-${Date.now()}`,
//       post_id: post.id,
//       user_id: me,
//       text: body,
//       created_at: new Date().toISOString(),
//       user: {
//         id: me,
//         first_name: "You",
//         last_name: "",
//       }
//     };

//     setComments((c) => [temp, ...c]);
//     setCommentText("");

//     try {
//       const res = await fetch(`${API_BASE_URL}/comments`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           ...headers  // 🔥 INCLUDE AUTH HEADERS
//         },
//         body: JSON.stringify({ post_id: post.id, user_id: me, text: body }),
//       });
      
//       if (!res.ok) {
//         throw new Error(`Comment failed: ${res.status}`);
//       }
      
//       const saved = await res.json();
//       setComments((c) => c.map((x) => (x.id === temp.id ? saved : x)));
      
//       // 🔥 Notify parent to update comment count
//       if (onCommentAdded) {
//         onCommentAdded(post.id);
//       }
      
//     } catch (error) {
//       console.error("Comment error:", error);
//       setComments((c) => c.filter((x) => x.id !== temp.id));
//       Alert.alert("Error", "Failed to post comment. Please try again.");
//     }
//   };

//   const commentAuthor = (c) => {
//     const u = c.user || c.User;
//     const first = u?.first_name || "";
//     const last = u?.last_name || "";
//     return (first + " " + last).trim() || "User";
//   };

//   return (
//     <View style={styles.card}>
//       {/* ========== POST HEADER ========== */}
//       <View style={styles.cardHeader}>
//         <Image
//           source={{
//             uri: post.author_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName),
//           }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1 }}>
//           <Text style={styles.author}>{authorName}</Text>
//           <Text style={styles.time}>{timeAgo(post.created_at)}</Text>
//         </View>
//       </View>

//       {/* ========== CAPTION ========== */}
//       {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

//       {/* ========== FULL ITINERARY DETAILS ========== */}
//       {itinerary ? (
//         <View style={styles.itinerarySection}>
//           {/* Cover Image */}
//           {itinerary.cover_url ? (
//             <Image 
//               source={{ uri: itinerary.cover_url }} 
//               style={styles.coverImage}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={styles.coverPlaceholder}>
//               <Ionicons name="image-outline" size={48} color="#9CA3AF" />
//             </View>
//           )}

//           {/* Content */}
//           <View style={styles.itineraryContent}>
//             {/* Title & City */}
//             <Text style={styles.itineraryTitle}>{itinerary.title}</Text>

//             <View style={styles.cityRow}>
//               <Ionicons name="location" size={16} color={COLORS.primary} />
//               <Text style={styles.cityText}>{itinerary.city}</Text>
//             </View>

//             {/* Description */}
//             {itinerary.description && (
//               <Text style={styles.description}>{itinerary.description}</Text>
//             )}

//             {/* Date Range */}
//             <View style={styles.dateRow}>
//               <Ionicons name="calendar-outline" size={16} color={COLORS.subtext} />
//               <Text style={styles.dateText}>
//                 {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
//               </Text>
//               <Text style={styles.daysCount}>• {numDays} day{numDays !== 1 ? 's' : ''}</Text>
//             </View>

//             {/* Budget & Style Tags */}
//             <View style={styles.tagsRow}>
//               {itinerary.budget && (
//                 <View style={styles.tagBudget}>
//                   <Ionicons name="cash-outline" size={14} color="#059669" />
//                   <Text style={styles.tagTextBudget}>{itinerary.budget}</Text>
//                 </View>
//               )}
//               {itinerary.style && (
//                 <View style={styles.tagStyle}>
//                   <Ionicons name="star-outline" size={14} color="#DC2626" />
//                   <Text style={styles.tagTextStyle}>{itinerary.style}</Text>
//                 </View>
//               )}
//             </View>

//             {/* Activities/Days */}
//             {days.length > 0 && (
//               <View style={styles.activitiesSection}>
//                 <View style={styles.activitiesHeader}>
//                   <Ionicons name="list-outline" size={18} color={COLORS.text} />
//                   <Text style={styles.activitiesTitle}>
//                     Daily Activities ({days.length})
//                   </Text>
//                 </View>

//                 <ScrollView 
//                   horizontal 
//                   showsHorizontalScrollIndicator={false}
//                   style={styles.activitiesScroll}
//                 >
//                   {days.map((day, index) => (
//                     <View key={day.id || index} style={styles.dayCard}>
//                       <View style={styles.dayBadge}>
//                         <Text style={styles.dayBadgeText}>Day {day.day_number}</Text>
//                       </View>
//                       <Text style={styles.dayPlace} numberOfLines={2}>
//                         {day.place}
//                       </Text>
//                       {day.start_time && day.end_time && (
//                         <View style={styles.dayTimeRow}>
//                           <Ionicons name="time-outline" size={12} color={COLORS.subtext} />
//                           <Text style={styles.dayTime}>
//                             {day.start_time} - {day.end_time}
//                           </Text>
//                         </View>
//                       )}
//                       {day.activities && (
//                         <Text style={styles.dayActivities} numberOfLines={3}>
//                           {day.activities}
//                         </Text>
//                       )}
//                     </View>
//                   ))}
//                 </ScrollView>
//               </View>
//             )}
//           </View>
//         </View>
//       ) : (
//         <View style={styles.noItinerary}>
//           <Ionicons name="alert-circle-outline" size={32} color="#9CA3AF" />
//           <Text style={styles.noItineraryText}>Itinerary not available</Text>
//         </View>
//       )}

//       {/* ========== POST ACTIONS (LIKE & COMMENT) ========== */}
//       <View style={styles.actions}>
//         <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
//           <Ionicons
//             name={post.liked ? "heart" : "heart-outline"}
//             size={20}
//             color={post.liked ? "#DC2626" : COLORS.text}
//           />
//           <Text style={styles.actionText}>{post.likes_count || 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => setShowComments(!showComments)}
//           style={styles.actionBtn}
//         >
//           <Ionicons
//             name="chatbubble-ellipses-outline"
//             size={20}
//             color={COLORS.text}
//           />
//           <Text style={styles.actionText}>
//             {post.comments_count > 0 ? `${post.comments_count}` : 'Comment'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* ========== COMMENTS SECTION ========== */}
//       {showComments && (
//         <View style={styles.commentsBox}>
//           {loadingComments ? (
//             <ActivityIndicator color={COLORS.primary} />
//           ) : comments.length === 0 ? (
//             <Text style={styles.meta}>Be the first to comment.</Text>
//           ) : (
//             comments.map((c) => (
//               <View key={String(c.id)} style={styles.commentRow}>
//                 <Image
//                   style={styles.cAvatar}
//                   source={{
//                     uri: c.user_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(commentAuthor(c)),
//                   }}
//                 />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.cAuthor}>{commentAuthor(c)}</Text>
//                   <Text style={styles.cText}>{c.text}</Text>
//                   <Text style={styles.cTime}>{timeAgo(c.created_at)}</Text>
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
//               maxLength={500}
//             />
//             <TouchableOpacity
//               disabled={!commentText.trim()}
//               onPress={sendComment}
//               style={[
//                 styles.commentSend,
//                 !commentText.trim() && { opacity: 0.5 },
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

// /* ===================== SMALL UI COMPONENTS ===================== */
// function Loader({ label }) {
//   return (
//     <View style={styles.center}>
//       <ActivityIndicator color={COLORS.primary} />
//       <Text style={styles.meta}>{label}</Text>
//     </View>
//   );
// }

// function ErrorBox({ err, onRetry }) {
//   return (
//     <View style={styles.errorBox}>
//       <Ionicons name="alert-circle" size={18} color="#B42318" />
//       <Text style={styles.errorText}>{err}</Text>
//       <TouchableOpacity onPress={onRetry} style={{ marginLeft: "auto" }}>
//         <Text style={styles.link}>Retry</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// /* ===================== STYLES ===================== */
// const COLORS = {
//   page: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#64748B",
//   primary: "#0F70F0",
//   border: "#EAF0F6",
// };

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     backgroundColor: COLORS.page,
//   },

//   header: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     ...(Platform.OS === "web"
//       ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//       : {}),
//   },

//   h1: { fontSize: 24, fontWeight: "800", color: COLORS.text, flex: 1 },

//   refreshBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#EEF3F9",
//   },

//   refreshText: { color: COLORS.text, fontWeight: "700", fontSize: 13 },

//   // Post Card
//   card: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },

//   cardHeader: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     gap: 12,
//     marginBottom: 12,
//   },
//   avatar: { 
//     width: 44, 
//     height: 44, 
//     borderRadius: 22,
//     backgroundColor: "#E5E7EB",
//   },
//   author: { fontWeight: "800", color: "#0F172A", fontSize: 15 },
//   time: { color: COLORS.subtext, fontSize: 12, marginTop: 2 },

//   caption: { 
//     marginBottom: 12, 
//     color: "#0F172A",
//     fontSize: 14,
//     lineHeight: 20,
//   },

//   // Itinerary Section
//   itinerarySection: {
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   coverImage: {
//     width: "100%",
//     height: 200,
//     backgroundColor: "#F3F4F6",
//   },

//   coverPlaceholder: {
//     width: "100%",
//     height: 200,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   itineraryContent: {
//     padding: 16,
//   },

//   itineraryTitle: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: COLORS.text,
//     marginBottom: 8,
//     lineHeight: 26,
//   },

//   cityRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 12,
//   },
//   cityText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: COLORS.primary,
//   },

//   description: {
//     fontSize: 14,
//     color: COLORS.subtext,
//     lineHeight: 20,
//     marginBottom: 12,
//   },

//   dateRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 12,
//   },
//   dateText: {
//     fontSize: 13,
//     color: COLORS.subtext,
//     fontWeight: "600",
//   },
//   daysCount: {
//     fontSize: 13,
//     color: COLORS.text,
//     fontWeight: "700",
//   },

//   tagsRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 16,
//   },
//   tagBudget: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//   },
//   tagTextBudget: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#059669",
//   },
//   tagStyle: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#FEF2F2",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#FECACA",
//   },
//   tagTextStyle: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#DC2626",
//   },

//   // Activities
//   activitiesSection: {
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//   },
//   activitiesHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },
//   activitiesTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.text,
//   },
//   activitiesScroll: {
//     marginHorizontal: -16,
//     paddingHorizontal: 16,
//   },
//   dayCard: {
//     width: 220,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     padding: 14,
//     marginRight: 12,
//   },
//   dayBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 6,
//     marginBottom: 10,
//   },
//   dayBadgeText: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: "#fff",
//     textTransform: "uppercase",
//   },
//   dayPlace: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 8,
//     lineHeight: 20,
//   },
//   dayTimeRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     marginBottom: 8,
//   },
//   dayTime: {
//     fontSize: 12,
//     color: COLORS.subtext,
//     fontWeight: "600",
//   },
//   dayActivities: {
//     fontSize: 13,
//     color: COLORS.subtext,
//     lineHeight: 18,
//   },

//   noItinerary: {
//     padding: 40,
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   noItineraryText: {
//     marginTop: 8,
//     color: "#9CA3AF",
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   // Actions
//   actions: {
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//     flexDirection: "row",
//     gap: 24,
//     alignItems: "center",
//   },
//   actionBtn: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     gap: 8,
//   },
//   actionText: { 
//     color: COLORS.text, 
//     fontWeight: "700",
//     fontSize: 14,
//   },

//   // Comments
//   commentsBox: {
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderColor: COLORS.border,
//     gap: 12,
//   },

//   commentRow: { 
//     flexDirection: "row", 
//     gap: 10,
//     marginBottom: 12,
//   },
//   cAvatar: { 
//     width: 36, 
//     height: 36, 
//     borderRadius: 18,
//     backgroundColor: "#E5E7EB",
//   },
//   cAuthor: { 
//     fontWeight: "700", 
//     color: "#0F172A",
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   cText: { 
//     color: "#0F172A",
//     fontSize: 14,
//     lineHeight: 19,
//   },
//   cTime: { 
//     color: COLORS.subtext, 
//     fontSize: 12,
//     marginTop: 4,
//   },

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
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 14,
//   },
//   commentSend: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//   },

//   // Empty & Loading
//   center: { 
//     alignItems: "center", 
//     justifyContent: "center", 
//     padding: 48,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: COLORS.text,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   meta: { 
//     color: COLORS.subtext, 
//     fontWeight: "600",
//     fontSize: 14,
//   },

//   errorBox: {
//     marginHorizontal: 16,
//     marginTop: 16,
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     ...(Platform.OS === "web"
//       ? { maxWidth: 860, alignSelf: "center", width: "100%" }
//       : {}),
//   },
//   errorText: { 
//     color: "#B42318", 
//     fontWeight: "600",
//     flex: 1,
//   },
//   link: { 
//     color: COLORS.primary, 
//     fontWeight: "700",
//   },
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import getBaseURL from "../../config/env";

const API_BASE_URL = getBaseURL();

/* ===================== HELPER FUNCTIONS ===================== */
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric",
    year: "numeric" 
  });
}

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

/* ===================== HOME FEED ===================== */
export default function HomeFeed() {
  const [auth, setAuth] = useState({ token: null, userId: null });
  const [sessionReady, setSessionReady] = useState(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [posts, setPosts] = useState([]);

  // Load token/user once
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

    // Optimistic update
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
        `${API_BASE_URL}/posts/${postId}/like`,
        {
          method: liked ? "DELETE" : "POST",
          headers: authHeaders,
        }
      );
      if (!res.ok) throw new Error("like failed");
    } catch (err) {
      console.error("Like error:", err);
      // Revert on error
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

  const handleCommentAdded = (postId) => {
    setPosts((ps) =>
      ps.map((p) =>
        p.id === postId
          ? { ...p, comments_count: (p.comments_count || 0) + 1 }
          : p
      )
    );
  };

  const renderItem = ({ item }) => (
    <PostCard
      post={item}
      onLike={() => toggleLike(item)}
      onCommentAdded={handleCommentAdded}
      me={auth.userId}
      headers={authHeaders}
      authed={!!auth.token}
    />
  );

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.h1}>Community Feed</Text>
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
          <Ionicons name="images-outline" size={64} color={COLORS.subtext} />
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.meta}>Be the first to share your adventure!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => String(p.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 120,
            paddingTop: 16,
            ...(Platform.OS === "web"
              ? { maxWidth: 860, alignSelf: "center", width: "100%" }
              : {}),
          }}
        />
      )}
    </View>
  );
}

/* ===================== POST CARD WITH FULL ITINERARY ===================== */
function PostCard({ post, onLike, me, authed, headers, onCommentAdded }) {
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const itinerary = post.itinerary;
  const days = itinerary?.days || [];
  const numDays = calculateDays(itinerary?.start_date, itinerary?.end_date);

  const authorName = post.user 
    ? `${post.user.first_name || ""} ${post.user.last_name || ""}`.trim() 
    : "Unknown User";

  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments();
    }
  }, [showComments]);

  const loadComments = async () => {
    setLoadingComments(true);

    try {
      const res = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`);
      const raw = await res.json();
      const list = Array.isArray(raw) ? raw : raw.comments || [];
      setComments(list);
    } catch (err) {
      console.error("Load comments error:", err);
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
      user: {
        id: me,
        first_name: "You",
        last_name: "",
      }
    };

    setComments((c) => [temp, ...c]);
    setCommentText("");

    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify({ post_id: post.id, user_id: me, text: body }),
      });
      
      if (!res.ok) {
        throw new Error(`Comment failed: ${res.status}`);
      }
      
      const saved = await res.json();
      setComments((c) => c.map((x) => (x.id === temp.id ? saved : x)));
      
      if (onCommentAdded) {
        onCommentAdded(post.id);
      }
      
    } catch (error) {
      console.error("Comment error:", error);
      setComments((c) => c.filter((x) => x.id !== temp.id));
      Alert.alert("Error", "Failed to post comment. Please try again.");
    }
  };

  const commentAuthor = (c) => {
    const u = c.user || c.User;
    const first = u?.first_name || "";
    const last = u?.last_name || "";
    return (first + " " + last).trim() || "User";
  };

  // 🔥 FIX: Render function for day cards in horizontal FlatList
  const renderDayCard = ({ item: day, index }) => (
    <View style={styles.dayCard}>
      <View style={styles.dayBadge}>
        <Text style={styles.dayBadgeText}>Day {day.day_number}</Text>
      </View>
      <Text style={styles.dayPlace} numberOfLines={2}>
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
        <Text style={styles.dayActivities} numberOfLines={3}>
          {day.activities}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.card}>
      {/* ========== POST HEADER ========== */}
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: post.author_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName),
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.author}>{authorName}</Text>
          <Text style={styles.time}>{timeAgo(post.created_at)}</Text>
        </View>
      </View>

      {/* ========== CAPTION ========== */}
      {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

      {/* ========== FULL ITINERARY DETAILS ========== */}
      {itinerary ? (
        <View style={styles.itinerarySection}>
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
          <View style={styles.itineraryContent}>
            {/* Title & City */}
            <Text style={styles.itineraryTitle}>{itinerary.title}</Text>

            <View style={styles.cityRow}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.cityText}>{itinerary.city}</Text>
            </View>

            {/* Description */}
            {itinerary.description && (
              <Text style={styles.description}>{itinerary.description}</Text>
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
              {itinerary.budget && (
                <View style={styles.tagBudget}>
                  <Ionicons name="cash-outline" size={14} color="#059669" />
                  <Text style={styles.tagTextBudget}>{itinerary.budget}</Text>
                </View>
              )}
              {itinerary.style && (
                <View style={styles.tagStyle}>
                  <Ionicons name="star-outline" size={14} color="#DC2626" />
                  <Text style={styles.tagTextStyle}>{itinerary.style}</Text>
                </View>
              )}
            </View>

            {/* 🔥 FIXED: Activities/Days - Changed ScrollView to FlatList */}
            {days.length > 0 && (
              <View style={styles.activitiesSection}>
                <View style={styles.activitiesHeader}>
                  <Ionicons name="list-outline" size={18} color={COLORS.text} />
                  <Text style={styles.activitiesTitle}>
                    Daily Activities ({days.length})
                  </Text>
                </View>

                <FlatList
                  data={days}
                  renderItem={renderDayCard}
                  keyExtractor={(day, index) => day.id ? String(day.id) : `day-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.activitiesScrollContent}
                  style={styles.activitiesList}
                />
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.noItinerary}>
          <Ionicons name="alert-circle-outline" size={32} color="#9CA3AF" />
          <Text style={styles.noItineraryText}>Itinerary not available</Text>
        </View>
      )}

      {/* ========== POST ACTIONS (LIKE & COMMENT) ========== */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={20}
            color={post.liked ? "#DC2626" : COLORS.text}
          />
          <Text style={styles.actionText}>{post.likes_count || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowComments(!showComments)}
          style={styles.actionBtn}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={COLORS.text}
          />
          <Text style={styles.actionText}>
            {post.comments_count > 0 ? `${post.comments_count}` : 'Comment'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ========== COMMENTS SECTION ========== */}
      {showComments && (
        <View style={styles.commentsBox}>
          {loadingComments ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : comments.length === 0 ? (
            <Text style={styles.meta}>Be the first to comment.</Text>
          ) : (
            comments.map((c) => (
              <View key={String(c.id)} style={styles.commentRow}>
                <Image
                  style={styles.cAvatar}
                  source={{
                    uri: c.user_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(commentAuthor(c)),
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cAuthor}>{commentAuthor(c)}</Text>
                  <Text style={styles.cText}>{c.text}</Text>
                  <Text style={styles.cTime}>{timeAgo(c.created_at)}</Text>
                </View>
              </View>
            ))
          )}

          <View style={styles.commentComposer}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Write a comment…"
              placeholderTextColor="#94A3B8"
              style={styles.commentInput}
              maxLength={500}
            />
            <TouchableOpacity
              disabled={!commentText.trim()}
              onPress={sendComment}
              style={[
                styles.commentSend,
                !commentText.trim() && { opacity: 0.5 },
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

/* ===================== SMALL UI COMPONENTS ===================== */
function Loader({ label }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={COLORS.primary} />
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

/* ===================== STYLES ===================== */
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
    marginBottom: 16,
    ...(Platform.OS === "web"
      ? { maxWidth: 860, alignSelf: "center", width: "100%" }
      : {}),
  },

  h1: { fontSize: 24, fontWeight: "800", color: COLORS.text, flex: 1 },

  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#EEF3F9",
  },

  refreshText: { color: COLORS.text, fontWeight: "700", fontSize: 13 },

  // Post Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12,
    marginBottom: 12,
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
  },
  author: { fontWeight: "800", color: "#0F172A", fontSize: 15 },
  time: { color: COLORS.subtext, fontSize: 12, marginTop: 2 },

  caption: { 
    marginBottom: 12, 
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 20,
  },

  // Itinerary Section
  itinerarySection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  coverImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
  },

  coverPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  itineraryContent: {
    padding: 16,
  },

  itineraryTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 26,
  },

  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  cityText: {
    fontSize: 14,
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
  tagBudget: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  tagTextBudget: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  tagStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  tagTextStyle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
  },

  // 🔥 UPDATED: Activities styles for FlatList
  activitiesSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  activitiesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  activitiesTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  activitiesList: {
    marginHorizontal: -16,
  },
  activitiesScrollContent: {
    paddingHorizontal: 16,
  },
  dayCard: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginRight: 12,
  },
  dayBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 10,
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
  },
  dayPlace: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  dayTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  dayTime: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  dayActivities: {
    fontSize: 13,
    color: COLORS.subtext,
    lineHeight: 18,
  },

  noItinerary: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 12,
  },
  noItineraryText: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Actions
  actions: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    gap: 24,
    alignItems: "center",
  },
  actionBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8,
  },
  actionText: { 
    color: COLORS.text, 
    fontWeight: "700",
    fontSize: 14,
  },

  // Comments
  commentsBox: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },

  commentRow: { 
    flexDirection: "row", 
    gap: 10,
    marginBottom: 12,
  },
  cAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
  },
  cAuthor: { 
    fontWeight: "700", 
    color: "#0F172A",
    fontSize: 14,
    marginBottom: 2,
  },
  cText: { 
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 19,
  },
  cTime: { 
    color: COLORS.subtext, 
    fontSize: 12,
    marginTop: 4,
  },

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
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  commentSend: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  // Empty & Loading
  center: { 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  meta: { 
    color: COLORS.subtext, 
    fontWeight: "600",
    fontSize: 14,
  },

  errorBox: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    ...(Platform.OS === "web"
      ? { maxWidth: 860, alignSelf: "center", width: "100%" }
      : {}),
  },
  errorText: { 
    color: "#B42318", 
    fontWeight: "600",
    flex: 1,
  },
  link: { 
    color: COLORS.primary, 
    fontWeight: "700",
  },
});