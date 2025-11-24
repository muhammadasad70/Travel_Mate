

// // components/Social/CreatePostScreen.js
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   TextInput,
//   ScrollView,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import getBaseURL from "../../config/env";

// const API_BASE_URL = getBaseURL();

// const TABS = [
//   { key: "itinerary", label: "Itinerary", icon: "map-outline" },
//   { key: "event", label: "Event", icon: "sparkles-outline" },
//   { key: "service", label: "Service", icon: "briefcase-outline" },
//   { key: "skill", label: "Skill", icon: "school-outline" },
// ];

// /* ==================== LIGHTWEIGHT ITINERARY PREVIEW CARD ==================== */
// function ItineraryPreviewCard({ itinerary }) {
//   const numDays = itinerary?.days?.length || 0;
  
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//   };

//   return (
//     <View style={previewStyles.card}>
//       {/* Cover Image */}
//       {itinerary.cover_url ? (
//         <Image 
//           source={{ uri: itinerary.cover_url }} 
//           style={previewStyles.coverImage}
//           resizeMode="cover"
//         />
//       ) : (
//         <View style={previewStyles.coverPlaceholder}>
//           <Ionicons name="image-outline" size={40} color="#9CA3AF" />
//         </View>
//       )}

//       {/* Content */}
//       <View style={previewStyles.content}>
//         {/* Title & City */}
//         <View style={previewStyles.titleRow}>
//           <Text style={previewStyles.title} numberOfLines={2}>
//             {itinerary.title}
//           </Text>
//         </View>

//         <View style={previewStyles.cityRow}>
//           <Ionicons name="location" size={14} color={COLORS.primary} />
//           <Text style={previewStyles.cityText}>{itinerary.city}</Text>
//         </View>

//         {/* Dates */}
//         {(itinerary.start_date || itinerary.end_date) && (
//           <View style={previewStyles.dateRow}>
//             <Ionicons name="calendar-outline" size={14} color={COLORS.subtext} />
//             <Text style={previewStyles.dateText}>
//               {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
//             </Text>
//             {numDays > 0 && (
//               <Text style={previewStyles.daysCount}>
//                 • {numDays} day{numDays !== 1 ? 's' : ''}
//               </Text>
//             )}
//           </View>
//         )}

//         {/* Budget & Style */}
//         <View style={previewStyles.tagsRow}>
//           {itinerary.budget && (
//             <View style={previewStyles.tagBudget}>
//               <Ionicons name="cash-outline" size={12} color="#059669" />
//               <Text style={previewStyles.tagTextBudget}>{itinerary.budget}</Text>
//             </View>
//           )}
//           {itinerary.style && (
//             <View style={previewStyles.tagStyle}>
//               <Ionicons name="star-outline" size={12} color="#DC2626" />
//               <Text style={previewStyles.tagTextStyle}>{itinerary.style}</Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const previewStyles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 1,
//   },
//   coverImage: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#F3F4F6",
//   },
//   coverPlaceholder: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   content: {
//     padding: 12,
//   },
//   titleRow: {
//     marginBottom: 6,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#0F172A",
//     lineHeight: 22,
//   },
//   cityRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     marginBottom: 8,
//   },
//   cityText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#0F70F0",
//   },
//   dateRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 8,
//   },
//   dateText: {
//     fontSize: 12,
//     color: "#64748B",
//     fontWeight: "600",
//   },
//   daysCount: {
//     fontSize: 12,
//     color: "#0F172A",
//     fontWeight: "700",
//   },
//   tagsRow: {
//     flexDirection: "row",
//     gap: 6,
//     flexWrap: "wrap",
//   },
//   tagBudget: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//   },
//   tagTextBudget: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#059669",
//   },
//   tagStyle: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: "#FEF2F2",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#FECACA",
//   },
//   tagTextStyle: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#DC2626",
//   },
// });

// /* ==================== MAIN SCREEN ==================== */
// export default function CreatePostScreen() {
//   const [active, setActive] = useState("itinerary");

//   // session
//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [sessionReady, setSessionReady] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [[, token], [, userId]] = await AsyncStorage.multiGet([
//           "token",
//           "userId",
//         ]);
//         setAuth({ token: token || null, userId: userId ? Number(userId) : null });
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

//   const jsonHeaders = useMemo(() => {
//     const h = { "Content-Type": "application/json" };
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   return (
//     <ScrollView
//       style={styles.root}
//       contentContainerStyle={styles.container}
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.title}>Create a Post</Text>
//       <Text style={styles.subtitle}>
//         Share your travel plans with the community
//       </Text>

//       <View style={styles.tabsRow}>
//         {TABS.map((t) => {
//           const selected = active === t.key;
//           return (
//             <TouchableOpacity
//               key={t.key}
//               style={[styles.tabPill, selected && styles.tabPillActive]}
//               onPress={() => setActive(t.key)}
//               activeOpacity={0.9}
//             >
//               <Ionicons
//                 name={t.icon}
//                 size={18}
//                 color={selected ? COLORS.text : COLORS.subtext}
//               />
//               <Text
//                 style={[
//                   styles.tabPillText,
//                   selected && styles.tabPillTextActive,
//                 ]}
//               >
//                 {t.label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       <View style={styles.card}>
//         {active === "itinerary" ? (
//           <ItineraryPoster
//             headersGet={authHeaders}
//             headersPost={jsonHeaders}
//             auth={auth}
//             sessionReady={sessionReady}
//           />
//         ) : active === "event" ? (
//           <EventForm />
//         ) : active === "service" ? (
//           <ServiceForm />
//         ) : (
//           <SkillForm />
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// /* ==================== ITINERARY POSTER ==================== */
// function ItineraryPoster({ headersGet, headersPost, auth, sessionReady }) {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [items, setItems] = useState([]);
//   const [captions, setCaptions] = useState({}); // { [itineraryId]: caption }
//   const [busy, setBusy] = useState({}); // { [itineraryId]: true }
//   const [successMsg, setSuccessMsg] = useState(""); // ✅ Success feedback

//   const load = async () => {
//     if (!sessionReady) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/itineraries`, {
//         method: "GET",
//         headers: headersGet,
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       const rows = Array.isArray(data) ? data : data?.itineraries || [];
//       setItems(rows);
//     } catch (e) {
//       setErr(e?.message || "Failed to load itineraries");
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (sessionReady) load();
//   }, [sessionReady]);

//   useEffect(() => {
//     if (sessionReady && auth.token) load();
//   }, [auth.token, sessionReady]);

//   const onChangeCaption = (id, text) => {
//     setCaptions((p) => ({ ...p, [id]: text }));
//     setSuccessMsg(""); // Clear success message when typing
//   };

//   const postItinerary = async (itineraryId) => {
//     if (busy[itineraryId]) return;
//     if (!auth?.userId) {
//       setErr("You must be logged in to post.");
//       return;
//     }
    
//     setErr(null);
//     setSuccessMsg("");
    
//     try {
//       setBusy((p) => ({ ...p, [itineraryId]: true }));
//       const caption = (captions[itineraryId] || "").trim();

//       const res = await fetch(`${API_BASE_URL}/posts`, {
//         method: "POST",
//         headers: headersPost,
//         body: JSON.stringify({
//           user_id: Number(auth.userId),
//           content_id: Number(itineraryId),
//           visibility: "public",
//           caption: caption || null,
//         }),
//       });
      
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || `HTTP ${res.status}`);
//       }
      
//       // ✅ Success!
//       setCaptions((p) => ({ ...p, [itineraryId]: "" }));
//       setSuccessMsg("✅ Post created successfully!");
      
//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccessMsg(""), 3000);
      
//     } catch (e) {
//       setErr(e?.message || "Failed to create post");
//     } finally {
//       setBusy((p) => {
//         const c = { ...p };
//         delete c[itineraryId];
//         return c;
//       });
//     }
//   };

//   if (!sessionReady) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={COLORS.primary} />
//         <Text style={styles.meta}>Authorizing…</Text>
//       </View>
//     );
//   }

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={COLORS.primary} />
//         <Text style={styles.meta}>Loading your itineraries…</Text>
//       </View>
//     );
//   }

//   if (err) {
//     return (
//       <View style={styles.errorBox}>
//         <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
//         <Text style={styles.errorText}>{err}</Text>
//         <TouchableOpacity onPress={load} style={{ marginLeft: "auto" }}>
//           <Text style={styles.link}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!items.length) {
//     return (
//       <View style={styles.emptyState}>
//         <Ionicons name="map-outline" size={64} color="#9CA3AF" />
//         <Text style={styles.emptyTitle}>No itineraries yet</Text>
//         <Text style={styles.meta}>Create an itinerary first to share it!</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ gap: 20 }}>
//       {/* Success Message */}
//       {!!successMsg && (
//         <View style={styles.successBox}>
//           <Ionicons name="checkmark-circle" size={18} color="#059669" style={{ marginRight: 6 }} />
//           <Text style={styles.successText}>{successMsg}</Text>
//         </View>
//       )}

//       {items.map((it) => {
//         const caption = captions[it.id] ?? "";
//         const isPosting = !!busy[it.id];

//         return (
//           <View key={it.id} style={styles.itWrapper}>
//             {/* ✅ Lightweight Preview Card */}
//             <ItineraryPreviewCard itinerary={it} />

//             {/* Caption Input */}
//             <TextInput
//               value={caption}
//               onChangeText={(t) => onChangeCaption(it.id, t)}
//               placeholder="Add a caption (optional)…"
//               placeholderTextColor="#94A3B8"
//               style={styles.captionInput}
//               multiline
//               maxLength={500}
//             />

//             {/* Character Count */}
//             {caption.length > 0 && (
//               <Text style={styles.charCount}>
//                 {caption.length}/500
//               </Text>
//             )}

//             {/* Post Button */}
//             <TouchableOpacity
//               onPress={() => postItinerary(it.id)}
//               activeOpacity={0.9}
//               disabled={isPosting}
//               style={[styles.primaryBtn, isPosting && { opacity: 0.7 }]}
//             >
//               {isPosting ? (
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                   <ActivityIndicator size="small" color="#fff" />
//                   <Text style={styles.primaryBtnText}>Posting…</Text>
//                 </View>
//               ) : (
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                   <Ionicons name="send" size={16} color="#fff" />
//                   <Text style={styles.primaryBtnText}>Post to Community</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>
//         );
//       })}
//     </View>
//   );
// }

// /* ==================== STUB FORMS ==================== */
// const Field = ({ label, placeholder, multiline }) => (
//   <View style={styles.field}>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput
//       style={[styles.input, multiline && styles.inputMultiline]}
//       placeholder={placeholder}
//       placeholderTextColor="#9AA3AF"
//       multiline={multiline}
//     />
//   </View>
// );

// const EventForm = () => (
//   <>
//     <Text style={styles.formTitle}>Create Event</Text>
//     <Field label="Event Name" placeholder="e.g., Trekking Meetup" />
//     <Field label="Date" placeholder="YYYY-MM-DD" />
//     <Field label="Location" placeholder="City / venue / coordinates" />
//     <Field label="Details" placeholder="Tell people what to expect" multiline />
    
//     <TouchableOpacity style={styles.primaryBtn}>
//       <Ionicons name="send" size={16} color="#fff" />
//       <Text style={styles.primaryBtnText}>Post Event</Text>
//     </TouchableOpacity>
//   </>
// );

// const ServiceForm = () => (
//   <>
//     <Text style={styles.formTitle}>List a Service</Text>
//     <Field label="Service Title" placeholder="e.g., Jeep Rental - Skardu" />
//     <Field label="Price" placeholder="e.g., 6000 PKR/day" />
//     <Field label="Contact" placeholder="+92 ..." />
//     <Field label="Description" placeholder="What's included, terms, etc." multiline />
    
//     <TouchableOpacity style={styles.primaryBtn}>
//       <Ionicons name="send" size={16} color="#fff" />
//       <Text style={styles.primaryBtnText}>Post Service</Text>
//     </TouchableOpacity>
//   </>
// );

// const SkillForm = () => (
//   <>
//     <Text style={styles.formTitle}>Share a Skill</Text>
//     <Field label="Skill Title" placeholder="e.g., Local Cooking Class" />
//     <Field label="Duration" placeholder="e.g., 2 hours" />
//     <Field label="Available Slots" placeholder="e.g., 6" />
//     <Field label="About" placeholder="Describe what you'll teach" multiline />
    
//     <TouchableOpacity style={styles.primaryBtn}>
//       <Ionicons name="send" size={16} color="#fff" />
//       <Text style={styles.primaryBtnText}>Post Skill</Text>
//     </TouchableOpacity>
//   </>
// );

// /* ==================== STYLES ==================== */
// const COLORS = {
//   bg: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#5B6B7B",
//   primary: "#0F70F0",
//   border: "#EAF0F6",
//   success: "#059669",
//   error: "#B42318",
// };

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: COLORS.bg },
//   container: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingBottom: 120,
//     paddingHorizontal: 16,
//     ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
//   },

//   title: { fontSize: 24, fontWeight: "800", color: COLORS.text },
//   subtitle: { marginTop: 4, color: COLORS.subtext, fontWeight: "600", fontSize: 14 },

//   tabsRow: { marginTop: 20, flexDirection: "row", flexWrap: "wrap", gap: 8 },
//   tabPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: "#F3F6FA",
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     ...(Platform.OS === "web" && { cursor: "pointer" }),
//   },
//   tabPillActive: { 
//     backgroundColor: "#E7F3FF", 
//     borderColor: "#77B6FF",
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   tabPillText: { fontWeight: "700", color: COLORS.subtext, fontSize: 14 },
//   tabPillTextActive: { color: COLORS.text },

//   card: {
//     marginTop: 20,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,
//   },

//   itWrapper: { 
//     gap: 12,
//     padding: 16,
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   captionInput: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     color: "#0F172A",
//     minHeight: 80,
//     textAlignVertical: "top",
//     fontSize: 14,
//     fontWeight: "500",
//   },

//   charCount: {
//     textAlign: "right",
//     fontSize: 12,
//     color: "#94A3B8",
//     fontWeight: "600",
//     marginTop: -6,
//   },

//   formTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: COLORS.text,
//     marginBottom: 16,
//   },

//   field: { marginBottom: 14 },
//   label: {
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 6,
//     fontSize: 13,
//   },
//   input: {
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: Platform.OS === "ios" ? 12 : 10,
//     color: "#0F172A",
//     fontSize: 14,
//   },
//   inputMultiline: { minHeight: 100, textAlignVertical: "top" },

//   primaryBtn: {
//     height: 48,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//     flexDirection: "row",
//     gap: 8,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   primaryBtnText: { 
//     color: "#fff", 
//     fontWeight: "800",
//     fontSize: 15,
//   },

//   center: { 
//     alignItems: "center", 
//     justifyContent: "center", 
//     padding: 32,
//   },
//   meta: { 
//     color: "#64748B", 
//     fontWeight: "600",
//     marginTop: 8,
//   },

//   emptyState: {
//     alignItems: "center",
//     padding: 40,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: COLORS.text,
//     marginTop: 16,
//     marginBottom: 8,
//   },

//   errorBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//   },
//   errorText: { 
//     color: COLORS.error, 
//     fontWeight: "600",
//     flex: 1,
//   },
  
//   successBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ECFDF5",
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//   },
//   successText: { 
//     color: COLORS.success, 
//     fontWeight: "700",
//     flex: 1,
//   },

//   link: { 
//     color: COLORS.primary, 
//     fontWeight: "700",
//     fontSize: 14,
//   },
// });


// components/Social/CreatePostScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import getBaseURL from "../../config/env";

const API_BASE_URL = getBaseURL();

/* ==================== LIGHTWEIGHT ITINERARY PREVIEW CARD ==================== */
function ItineraryPreviewCard({ itinerary }) {
  const numDays = itinerary?.days?.length || 0;
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <View style={previewStyles.card}>
      {/* Cover Image */}
      {itinerary.cover_url ? (
        <Image 
          source={{ uri: itinerary.cover_url }} 
          style={previewStyles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={previewStyles.coverPlaceholder}>
          <Ionicons name="image-outline" size={40} color="#9CA3AF" />
        </View>
      )}

      {/* Content */}
      <View style={previewStyles.content}>
        {/* Title & City */}
        <View style={previewStyles.titleRow}>
          <Text style={previewStyles.title} numberOfLines={2}>
            {itinerary.title}
          </Text>
        </View>

        <View style={previewStyles.cityRow}>
          <Ionicons name="location" size={14} color={COLORS.primary} />
          <Text style={previewStyles.cityText}>{itinerary.city}</Text>
        </View>

        {/* Dates */}
        {(itinerary.start_date || itinerary.end_date) && (
          <View style={previewStyles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.subtext} />
            <Text style={previewStyles.dateText}>
              {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
            </Text>
            {numDays > 0 && (
              <Text style={previewStyles.daysCount}>
                • {numDays} day{numDays !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        )}

        {/* Budget & Style */}
        <View style={previewStyles.tagsRow}>
          {itinerary.budget && (
            <View style={previewStyles.tagBudget}>
              <Ionicons name="cash-outline" size={12} color="#059669" />
              <Text style={previewStyles.tagTextBudget}>{itinerary.budget}</Text>
            </View>
          )}
          {itinerary.style && (
            <View style={previewStyles.tagStyle}>
              <Ionicons name="star-outline" size={12} color="#DC2626" />
              <Text style={previewStyles.tagTextStyle}>{itinerary.style}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const previewStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  coverImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#F3F4F6",
  },
  coverPlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 12,
  },
  titleRow: {
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 22,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  cityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F70F0",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  daysCount: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "700",
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  tagBudget: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  tagTextBudget: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  tagStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  tagTextStyle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DC2626",
  },
});

/* ==================== MAIN SCREEN ==================== */
export default function CreatePostScreen() {
  const [auth, setAuth] = useState({ token: null, userId: null });
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [[, token], [, userId]] = await AsyncStorage.multiGet([
          "token",
          "userId",
        ]);
        setAuth({ token: token || null, userId: userId ? Number(userId) : null });
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

  const jsonHeaders = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (auth.token) h.Authorization = `Bearer ${auth.token}`;
    return h;
  }, [auth.token]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="add-circle" size={32} color={COLORS.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Create a Post</Text>
          <Text style={styles.subtitle}>
            Share your travel itineraries with the community
          </Text>
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.card}>
        <ItineraryPoster
          headersGet={authHeaders}
          headersPost={jsonHeaders}
          auth={auth}
          sessionReady={sessionReady}
        />
      </View>
    </ScrollView>
  );
}

/* ==================== ITINERARY POSTER ==================== */
function ItineraryPoster({ headersGet, headersPost, auth, sessionReady }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [items, setItems] = useState([]);
  const [captions, setCaptions] = useState({});
  const [busy, setBusy] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const load = async () => {
    if (!sessionReady) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_BASE_URL}/itineraries`, {
        method: "GET",
        headers: headersGet,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data?.itineraries || [];
      setItems(rows);
    } catch (e) {
      setErr(e?.message || "Failed to load itineraries");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionReady) load();
  }, [sessionReady]);

  useEffect(() => {
    if (sessionReady && auth.token) load();
  }, [auth.token, sessionReady]);

  const onChangeCaption = (id, text) => {
    setCaptions((p) => ({ ...p, [id]: text }));
    setSuccessMsg("");
  };

  const postItinerary = async (itineraryId) => {
    if (busy[itineraryId]) return;
    if (!auth?.userId) {
      setErr("You must be logged in to post.");
      return;
    }
    
    setErr(null);
    setSuccessMsg("");
    
    try {
      setBusy((p) => ({ ...p, [itineraryId]: true }));
      const caption = (captions[itineraryId] || "").trim();

      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: headersPost,
        body: JSON.stringify({
          user_id: Number(auth.userId),
          content_id: Number(itineraryId),
          visibility: "public",
          caption: caption || null,
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP ${res.status}`);
      }
      
      setCaptions((p) => ({ ...p, [itineraryId]: "" }));
      setSuccessMsg("✅ Post created successfully!");
      
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (e) {
      setErr(e?.message || "Failed to create post");
    } finally {
      setBusy((p) => {
        const c = { ...p };
        delete c[itineraryId];
        return c;
      });
    }
  };

  if (!sessionReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.meta}>Authorizing…</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.meta}>Loading your itineraries…</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={styles.errorBox}>
        <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
        <Text style={styles.errorText}>{err}</Text>
        <TouchableOpacity onPress={load} style={{ marginLeft: "auto" }}>
          <Text style={styles.link}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons name="map-outline" size={64} color="#9CA3AF" />
        </View>
        <Text style={styles.emptyTitle}>No itineraries yet</Text>
        <Text style={styles.emptyText}>
          Create an itinerary first to share it with the community!
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 20 }}>
      {/* Success Message */}
      {!!successMsg && (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={20} color="#059669" style={{ marginRight: 8 }} />
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      )}

      {/* Itineraries List */}
      {items.map((it, index) => {
        const caption = captions[it.id] ?? "";
        const isPosting = !!busy[it.id];

        return (
          <View key={it.id} style={styles.itWrapper}>
            {/* Itinerary Number Badge */}
            <View style={styles.itineraryBadge}>
              <Text style={styles.itineraryBadgeText}>Itinerary {index + 1}</Text>
            </View>

            {/* Preview Card */}
            <ItineraryPreviewCard itinerary={it} />

            {/* Caption Input */}
            <View style={styles.captionSection}>
              <Text style={styles.captionLabel}>
                <Ionicons name="chatbubble-outline" size={14} color={COLORS.text} /> Caption
              </Text>
              <TextInput
                value={caption}
                onChangeText={(t) => onChangeCaption(it.id, t)}
                placeholder="Share your thoughts about this trip..."
                placeholderTextColor="#94A3B8"
                style={styles.captionInput}
                multiline
                maxLength={500}
              />
              {caption.length > 0 && (
                <Text style={styles.charCount}>
                  {caption.length}/500
                </Text>
              )}
            </View>

            {/* Post Button */}
            <TouchableOpacity
              onPress={() => postItinerary(it.id)}
              activeOpacity={0.9}
              disabled={isPosting}
              style={[styles.primaryBtn, isPosting && { opacity: 0.7 }]}
            >
              {isPosting ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.primaryBtnText}>Posting…</Text>
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="send" size={18} color="#fff" />
                  <Text style={styles.primaryBtnText}>Post to Community</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

/* ==================== STYLES ==================== */
const COLORS = {
  bg: "#F6FAFD",
  card: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#5B6B7B",
  primary: "#0F70F0",
  border: "#EAF0F6",
  success: "#059669",
  error: "#B42318",
};

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: COLORS.bg,
  },
  container: {
    paddingTop: Platform.OS === "web" ? 92 : 16,
    paddingBottom: 120,
    paddingHorizontal: 16,
    ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center", width: "100%" } : {}),
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E7F3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: { 
    fontSize: 26, 
    fontWeight: "800", 
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: { 
    color: COLORS.subtext, 
    fontWeight: "600", 
    fontSize: 14,
    lineHeight: 20,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Itinerary Wrapper
  itWrapper: { 
    gap: 16,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  itineraryBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  itineraryBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Caption Section
  captionSection: {
    gap: 8,
  },
  captionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  captionInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0F172A",
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },

  // Primary Button
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { 
    color: "#fff", 
    fontWeight: "800",
    fontSize: 16,
  },

  // States
  center: { 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 60,
  },
  meta: { 
    color: "#64748B", 
    fontWeight: "600",
    marginTop: 12,
    fontSize: 14,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  errorText: { 
    color: COLORS.error, 
    fontWeight: "600",
    flex: 1,
    fontSize: 14,
  },
  
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  successText: { 
    color: COLORS.success, 
    fontWeight: "700",
    flex: 1,
    fontSize: 14,
  },

  link: { 
    color: COLORS.primary, 
    fontWeight: "700",
    fontSize: 14,
  },
});