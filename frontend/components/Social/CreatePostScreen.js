// // screens/social/CreatePostScreen.js
// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   TextInput,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// // import ItineraryPicker from './partials/ItineraryPicker';

// const TABS = [
//   { key: 'itinerary', label: 'Itinerary', icon: 'map-outline' },
//   { key: 'event',     label: 'Event',     icon: 'sparkles-outline' },
//   { key: 'service',   label: 'Service',   icon: 'briefcase-outline' },
//   { key: 'skill',     label: 'Skill',     icon: 'school-outline' },
// ];

// export default function CreatePostScreen({ onSubmit }) {
//   const [active, setActive] = useState('itinerary');
//   const [selectedItinerary, setSelectedItinerary] = useState(null);

//   const cta = useMemo(() => {
//     switch (active) {
//       case 'event':     return 'Publish Event';
//       case 'service':   return 'List Service';
//       case 'skill':     return 'Share Skill';
//       default:          return 'Post Itinerary';
//     }
//   }, [active]);

//   const isPrimaryDisabled = active === 'itinerary' && !selectedItinerary;

//   return (
//     <ScrollView
//       style={styles.root}
//       contentContainerStyle={styles.container}
//       keyboardShouldPersistTaps="handled"
//     >
//       {/* Heading */}
//       <Text style={styles.title}>What do you want to post?</Text>
//       <Text style={styles.subtitle}>
//         Choose a type below — the content renders inline on this screen.
//       </Text>

//       {/* Tabs */}
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
//                 color={selected ? '#0F3A6B' : '#5B6B7B'}
//               />
//               <Text style={[styles.tabPillText, selected && styles.tabPillTextActive]}>
//                 {t.label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       {/* Inline area */}
//       <View style={styles.card}>
//         {/* {active === 'itinerary' && (
//           <ItineraryPicker
//             value={selectedItinerary}
//             onChange={setSelectedItinerary}
//           />
//         )} */}

//         {active === 'event' && <EventForm />}
//         {active === 'service' && <ServiceForm />}
//         {active === 'skill' && <SkillForm />}
//       </View>

//       {/* Submit */}
//       <TouchableOpacity
//         style={[styles.primaryBtn, isPrimaryDisabled && { opacity: 0.6 }]}
//         activeOpacity={isPrimaryDisabled ? 1 : 0.9}
//         onPress={() => {
//           if (isPrimaryDisabled) return;
//           if (active === 'itinerary') {
//             onSubmit?.({ type: 'itinerary', itineraryId: selectedItinerary?.id });
//           } else {
//             onSubmit?.({ type: active });
//           }
//         }}
//       >
//         <Text style={styles.primaryBtnText}>{cta}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// /* ---------- Simple stubs for other tabs (keep inline behavior) ---------- */

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

// const TwoCol = ({ left, right }) => (
//   <View style={styles.twoCol}>
//     <View style={{ flex: 1, marginRight: 8 }}>{left}</View>
//     <View style={{ flex: 1, marginLeft: 8 }}>{right}</View>
//   </View>
// );

// const EventForm = () => (
//   <>
//     <Text style={styles.formTitle}>Create Event</Text>
//     <Field label="Event Name" placeholder="e.g., Trekking Meetup" />
//     <TwoCol
//       left={<Field label="Date" placeholder="YYYY-MM-DD" />}
//       right={<Field label="Time" placeholder="HH:MM" />}
//     />
//     <Field label="Location" placeholder="City / venue / coordinates" />
//     <Field label="Details" placeholder="Tell people what to expect" multiline />
//   </>
// );

// const ServiceForm = () => (
//   <>
//     <Text style={styles.formTitle}>List a Service</Text>
//     <Field label="Service Title" placeholder="e.g., Jeep Rental - Skardu" />
//     <TwoCol
//       left={<Field label="Price" placeholder="e.g., 6000 PKR/day" />}
//       right={<Field label="Contact" placeholder="+92 ..." />}
//     />
//     <Field label="Description" placeholder="What’s included, terms, etc." multiline />
//   </>
// );

// const SkillForm = () => (
//   <>
//     <Text style={styles.formTitle}>Share a Skill</Text>
//     <Field label="Skill Title" placeholder="e.g., Local Cooking Class" />
//     <TwoCol
//       left={<Field label="Duration" placeholder="e.g., 2 hours" />}
//       right={<Field label="Available Slots" placeholder="e.g., 6" />}
//     />
//     <Field label="About" placeholder="Describe what you’ll teach" multiline />
//   </>
// );

// /* ----------------------- styles ----------------------- */

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#F6FAFD' },
//   container: {
//     paddingTop: Platform.OS === 'web' ? 92 : 16,
//     paddingBottom: 120,
//     paddingHorizontal: 16,
//   },

//   title: { fontSize: 22, fontWeight: '800', color: '#0F3A6B' },
//   subtitle: { marginTop: 4, color: '#5B6B7B', fontWeight: '600' },

//   tabsRow: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//   tabPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     backgroundColor: '#F3F6FA',
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     ...(Platform.OS === 'web' && { cursor: 'pointer' }),
//   },
//   tabPillActive: { backgroundColor: '#E7F3FF', borderColor: '#77B6FF' },
//   tabPillText: { fontWeight: '700', color: '#5B6B7B' },
//   tabPillTextActive: { color: '#0F3A6B' },

//   card: {
//     marginTop: 14,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: '#EAF0F6',
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,
//   },

//   formTitle: { fontSize: 16, fontWeight: '800', color: '#0F3A6B', marginBottom: 8 },

//   field: { marginBottom: 10 },
//   label: { fontWeight: '700', color: '#0F3A6B', marginBottom: 6, fontSize: 12 },
//   input: {
//     backgroundColor: '#F9FBFE',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === 'ios' ? 12 : 10,
//     color: '#0F172A',
//   },
//   inputMultiline: { minHeight: 90, textAlignVertical: 'top' },

//   twoCol: { flexDirection: 'row', marginBottom: 10 },

//   primaryBtn: {
//     marginTop: 16,
//     height: 48,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#0F3A6B',
//     shadowColor: '#0F3A6B',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   primaryBtnText: { color: '#fff', fontWeight: '800' },
// });


// components/Social/CreatePostScreen.js
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
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API || "http://localhost:8080";

// const TABS = [
//   { key: "itinerary", label: "Itinerary", icon: "map-outline" },
//   { key: "event", label: "Event", icon: "sparkles-outline" },
//   { key: "service", label: "Service", icon: "briefcase-outline" },
//   { key: "skill", label: "Skill", icon: "school-outline" },
// ];

// export default function CreatePostScreen() {
//   const [active, setActive] = useState("itinerary");

//   // session
//   const [auth, setAuth] = useState({ token: null, userId: null });
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, userId]] = await AsyncStorage.multiGet([
//         "token",
//         "userId",
//       ]);
//       setAuth({ token: token || null, userId: userId ? Number(userId) : null });
//     })();
//   }, []);

//   const headers = useMemo(() => {
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
//       {/* Heading */}
//       <Text style={styles.title}>What do you want to post?</Text>
//       <Text style={styles.subtitle}>
//         Pick a type — content renders inline on this screen.
//       </Text>

//       {/* Tabs */}
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

//       {/* Inline area */}
//       <View style={styles.card}>
//         {active === "itinerary" ? (
//           <ItineraryPoster headers={headers} />
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

// /* ----------------- Itinerary fetch + post ----------------- */
// function ItineraryPoster({ headers }) {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [items, setItems] = useState([]);
//   const [captions, setCaptions] = useState({}); // { [itineraryId]: caption }
//   const [busy, setBusy] = useState({}); // { [itineraryId]: true }

//   const load = async () => {
//     setLoading(true);
//     setErr(null);
//     try {
//       // Your backend exposes both /itineraries and /itineraries/
//       const res = await fetch(`${API_BASE_URL}/itineraries`, { headers });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       // Normalize to an array
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
//     load();
//   }, []);

//   const onChangeCaption = (id, text) =>
//     setCaptions((p) => ({ ...p, [id]: text }));

//   const postItinerary = async (itineraryId) => {
//     if (busy[itineraryId]) return;
//     try {
//       setBusy((p) => ({ ...p, [itineraryId]: true }));
//       const caption = (captions[itineraryId] || "").trim();

//       const res = await fetch(`${API_BASE_URL}/posts`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({
//           itinerary_id: itineraryId,
//           caption: caption || null,
//         }),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       // optionally clear caption
//       setCaptions((p) => ({ ...p, [itineraryId]: "" }));
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

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//         <Text style={styles.meta}>Loading your itineraries…</Text>
//       </View>
//     );
//   }
//   if (err) {
//     return (
//       <View style={styles.errorBox}>
//         <Ionicons
//           name="alert-circle"
//           size={18}
//           color="#B42318"
//           style={{ marginRight: 6 }}
//         />
//         <Text style={styles.errorText}>{err}</Text>
//         <TouchableOpacity onPress={load} style={{ marginLeft: "auto" }}>
//           <Text style={styles.link}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
//   if (!items.length) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.meta}>No itineraries yet.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ gap: 12 }}>
//       {items.map((it) => {
//         const caption = captions[it.id] ?? "";
//         return (
//           <View key={it.id} style={styles.itCard}>
//             <View style={{ flex: 1, minWidth: 0 }}>
//               <Text numberOfLines={1} style={styles.itTitle}>
//                 {it.title || `Itinerary #${it.id}`}
//               </Text>
//               {!!it.destination && (
//                 <Text numberOfLines={1} style={styles.itMeta}>
//                   {it.destination}
//                 </Text>
//               )}
//               {!!it.start_date && (
//                 <Text numberOfLines={1} style={styles.itMeta}>
//                   {it.start_date} — {it.end_date || "?"}
//                 </Text>
//               )}
//             </View>

//             <View style={{ height: 8 }} />

//             <TextInput
//               value={caption}
//               onChangeText={(t) => onChangeCaption(it.id, t)}
//               placeholder="Add a caption (optional)…"
//               placeholderTextColor="#94A3B8"
//               style={styles.captionInput}
//               multiline
//             />

//             <TouchableOpacity
//               onPress={() => postItinerary(it.id)}
//               activeOpacity={0.9}
//               disabled={!!busy[it.id]}
//               style={[styles.primaryBtn, !!busy[it.id] && { opacity: 0.7 }]}
//             >
//               <Text style={styles.primaryBtnText}>
//                 {busy[it.id] ? "Posting…" : "Post Itinerary"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         );
//       })}
//     </View>
//   );
// }

// /* ---------- Simple stubs for other tabs (kept minimal) ---------- */
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

// const TwoCol = ({ left, right }) => (
//   <View style={styles.twoCol}>
//     <View style={{ flex: 1, marginRight: 8 }}>{left}</View>
//     <View style={{ flex: 1, marginLeft: 8 }}>{right}</View>
//   </View>
// );

// const EventForm = () => (
//   <>
//     <Text style={styles.formTitle}>Create Event</Text>
//     <Field label="Event Name" placeholder="e.g., Trekking Meetup" />
//     <TwoCol
//       left={<Field label="Date" placeholder="YYYY-MM-DD" />}
//       right={<Field label="Time" placeholder="HH:MM" />}
//     />
//     <Field label="Location" placeholder="City / venue / coordinates" />
//     <Field label="Details" placeholder="Tell people what to expect" multiline />
//   </>
// );

// const ServiceForm = () => (
//   <>
//     <Text style={styles.formTitle}>List a Service</Text>
//     <Field label="Service Title" placeholder="e.g., Jeep Rental - Skardu" />
//     <TwoCol
//       left={<Field label="Price" placeholder="e.g., 6000 PKR/day" />}
//       right={<Field label="Contact" placeholder="+92 ..." />}
//     />
//     <Field
//       label="Description"
//       placeholder="What’s included, terms, etc."
//       multiline
//     />
//   </>
// );

// const SkillForm = () => (
//   <>
//     <Text style={styles.formTitle}>Share a Skill</Text>
//     <Field label="Skill Title" placeholder="e.g., Local Cooking Class" />
//     <TwoCol
//       left={<Field label="Duration" placeholder="e.g., 2 hours" />}
//       right={<Field label="Available Slots" placeholder="e.g., 6" />}
//     />
//     <Field label="About" placeholder="Describe what you’ll teach" multiline />
//   </>
// );

// /* ----------------------- styles ----------------------- */
// const COLORS = {
//   bg: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#5B6B7B",
//   primary: "#0F70F0",
//   border: "#EAF0F6",
// };

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: COLORS.bg },
//   container: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingBottom: 120,
//     paddingHorizontal: 16,
//     ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center" } : {}),
//   },

//   title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
//   subtitle: { marginTop: 4, color: COLORS.subtext, fontWeight: "600" },

//   tabsRow: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 8 },
//   tabPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     backgroundColor: "#F3F6FA",
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     ...(Platform.OS === "web" && { cursor: "pointer" }),
//   },
//   tabPillActive: { backgroundColor: "#E7F3FF", borderColor: "#77B6FF" },
//   tabPillText: { fontWeight: "700", color: COLORS.subtext },
//   tabPillTextActive: { color: COLORS.text },

//   card: {
//     marginTop: 14,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,
//   },

//   // itinerary cards
//   itCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 12,
//   },
//   itTitle: { fontWeight: "800", color: "#0F172A" },
//   itMeta: { color: "#64748B", fontSize: 12, marginTop: 2 },

//   captionInput: {
//     marginTop: 8,
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: "#0F172A",
//     minHeight: 60,
//     textAlignVertical: "top",
//   },

//   formTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.text,
//     marginBottom: 8,
//   },

//   field: { marginBottom: 10 },
//   label: {
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 6,
//     fontSize: 12,
//   },
//   input: {
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === "ios" ? 12 : 10,
//     color: "#0F172A",
//   },
//   inputMultiline: { minHeight: 90, textAlignVertical: "top" },
//   twoCol: { flexDirection: "row", marginBottom: 10 },

//   primaryBtn: {
//     marginTop: 10,
//     height: 44,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryBtnText: { color: "#fff", fontWeight: "800" },

//   // states
//   center: { alignItems: "center", justifyContent: "center", padding: 18 },
//   meta: { color: "#64748B", fontWeight: "600" },
//   errorBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },
// });


// screens/social/CreatePostScreen.js
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
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API || "http://localhost:8080";

// const TABS = [
//   { key: "itinerary", label: "Itinerary", icon: "map-outline" },
//   { key: "event", label: "Event", icon: "sparkles-outline" },
//   { key: "service", label: "Service", icon: "briefcase-outline" },
//   { key: "skill", label: "Skill", icon: "school-outline" },
// ];

// export default function CreatePostScreen() {
//   const [active, setActive] = useState("itinerary");
//   const [auth, setAuth] = useState({ token: null, userId: null });

//   useEffect(() => {
//     (async () => {
//       const [[, token], [, userId]] = await AsyncStorage.multiGet([
//         "token",
//         "userId",
//       ]);
//       setAuth({ token: token || null, userId: userId ? Number(userId) : null });
//     })();
//   }, []);

//   const headers = useMemo(() => {
//     const h = { "Content-Type": "application/json" };
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth.token]);

//   return (
//     <ScrollView style={styles.root} contentContainerStyle={styles.container}>
//       <Text style={styles.title}>What do you want to post?</Text>
//       <Text style={styles.subtitle}>
//         Pick a type — content renders inline on this screen.
//       </Text>

//       <View style={styles.tabsRow}>
//         {TABS.map((t) => {
//           const selected = active === t.key;
//           return (
//             <TouchableOpacity
//               key={t.key}
//               style={[styles.tabPill, selected && styles.tabPillActive]}
//               onPress={() => setActive(t.key)}
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
//           <ItineraryPoster headers={headers} auth={auth} />
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

// /* ----------------- Itinerary fetch + post ----------------- */
// function ItineraryPoster({ headers, auth }) {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [items, setItems] = useState([]);
//   const [captions, setCaptions] = useState({});
//   const [busy, setBusy] = useState({});

//   const load = async () => {
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/itineraries`, { headers });
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
//     load();
//   }, []);

//   const postItinerary = async (itineraryId) => {
//     if (busy[itineraryId] || !auth.userId) return;
//     try {
//       setBusy((p) => ({ ...p, [itineraryId]: true }));
//       const caption = (captions[itineraryId] || "").trim();

//       // ✅ Backend expects user_id + content_id
//       const res = await fetch(`${API_BASE_URL}/posts`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({
//           user_id: auth.userId,
//           content_id: itineraryId,
//           visibility: "public", // or friends/private if you want
//           caption: caption || null,
//         }),
//       });

//       if (!res.ok) throw new Error(await res.text());
//       setCaptions((p) => ({ ...p, [itineraryId]: "" }));
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

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//         <Text style={styles.meta}>Loading your itineraries…</Text>
//       </View>
//     );
//   }
//   if (err) {
//     return (
//       <View style={styles.errorBox}>
//         <Ionicons name="alert-circle" size={18} color="#B42318" />
//         <Text style={styles.errorText}>{err}</Text>
//         <TouchableOpacity onPress={load} style={{ marginLeft: "auto" }}>
//           <Text style={styles.link}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
//   if (!items.length) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.meta}>No itineraries yet.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ gap: 12 }}>
//       {items.map((it) => {
//         const caption = captions[it.id] ?? "";
//         return (
//           <View key={it.id} style={styles.itCard}>
//             <Text style={styles.itTitle}>{it.title || `Itinerary #${it.id}`}</Text>
//             {!!it.destination && <Text style={styles.itMeta}>{it.destination}</Text>}
//             {!!it.start_date && (
//               <Text style={styles.itMeta}>
//                 {it.start_date} — {it.end_date || "?"}
//               </Text>
//             )}

//             <TextInput
//               value={caption}
//               onChangeText={(t) => setCaptions((p) => ({ ...p, [it.id]: t }))}
//               placeholder="Add a caption (optional)…"
//               placeholderTextColor="#94A3B8"
//               style={styles.captionInput}
//               multiline
//             />

//             <TouchableOpacity
//               onPress={() => postItinerary(it.id)}
//               disabled={!!busy[it.id]}
//               style={[styles.primaryBtn, !!busy[it.id] && { opacity: 0.7 }]}
//             >
//               <Text style={styles.primaryBtnText}>
//                 {busy[it.id] ? "Posting…" : "Post Itinerary"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         );
//       })}
//     </View>
//   );
// }

// /* ---------- Other stubs (unchanged) ---------- */
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
//     <Field label="Location" placeholder="City / venue" />
//   </>
// );
// const ServiceForm = () => (
//   <>
//     <Text style={styles.formTitle}>List a Service</Text>
//     <Field label="Service Title" placeholder="e.g., Jeep Rental - Skardu" />
//     <Field label="Price" placeholder="e.g., 6000 PKR/day" />
//   </>
// );
// const SkillForm = () => (
//   <>
//     <Text style={styles.formTitle}>Share a Skill</Text>
//     <Field label="Skill Title" placeholder="e.g., Local Cooking Class" />
//   </>
// );

// /* ----------------------- styles ----------------------- */
// const COLORS = {
//   bg: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#5B6B7B",
//   primary: "#0F70F0",
//   border: "#EAF0F6",
// };

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: COLORS.bg },
//   container: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingBottom: 120,
//     paddingHorizontal: 16,
//     ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center" } : {}),
//   },
//   title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
//   subtitle: { marginTop: 4, color: COLORS.subtext, fontWeight: "600" },
//   tabsRow: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 8 },
//   tabPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     backgroundColor: "#F3F6FA",
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   tabPillActive: { backgroundColor: "#E7F3FF", borderColor: "#77B6FF" },
//   tabPillText: { fontWeight: "700", color: COLORS.subtext },
//   tabPillTextActive: { color: COLORS.text },
//   card: {
//     marginTop: 14,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   itCard: { borderWidth: 1, borderColor: COLORS.border, padding: 12, borderRadius: 14 },
//   itTitle: { fontWeight: "800", color: "#0F172A" },
//   itMeta: { color: "#64748B", fontSize: 12 },
//   captionInput: {
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     padding: 10,
//     backgroundColor: "#F9FBFE",
//     minHeight: 60,
//   },
//   primaryBtn: {
//     marginTop: 8,
//     paddingVertical: 10,
//     borderRadius: 12,
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryBtnText: { color: "#fff", fontWeight: "800" },
//   center: { alignItems: "center", justifyContent: "center", padding: 18 },
//   meta: { color: "#64748B", fontWeight: "600" },
//   errorBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 12,
//     padding: 10,
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },
// });


// screens/social/CreatePostScreen.js
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
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API || "http://localhost:8080";

// const TABS = [
//   { key: "itinerary", label: "Itinerary", icon: "map-outline" },
//   { key: "event", label: "Event", icon: "sparkles-outline" },
//   { key: "service", label: "Service", icon: "briefcase-outline" },
//   { key: "skill", label: "Skill", icon: "school-outline" },
// ];

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
//         setSessionReady(true); // <-- signal we’ve finished reading storage
//       }
//     })();
//   }, []);

//   const headers = useMemo(() => {
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
//       <Text style={styles.title}>What do you want to post?</Text>
//       <Text style={styles.subtitle}>
//         Pick a type — content renders inline on this screen.
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
//           <ItineraryPoster headers={headers} auth={auth} sessionReady={sessionReady} />
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

// /* ----------------- Itinerary fetch + post ----------------- */
// function ItineraryPoster({ headers, auth, sessionReady }) {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [items, setItems] = useState([]);
//   const [captions, setCaptions] = useState({}); // { [itineraryId]: caption }
//   const [busy, setBusy] = useState({}); // { [itineraryId]: true }

//   const load = async () => {
//     // If the route is protected, don’t call until session is ready & we have a token
//     if (!sessionReady) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/itineraries`, { method: "GET", headers });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       const rows = Array.isArray(data) ? data : data?.itineraries || [];
//       setItems(rows);
//       console.log(rows)
//     } catch (e) {
//       setErr(e?.message || "Failed to load itineraries");
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // First load: wait for session, then fetch.
//   useEffect(() => {
//     if (sessionReady) load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sessionReady]);

//   // If the token changes (e.g., user logs in again), refetch.
//   useEffect(() => {
//     if (sessionReady && auth.token) load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [auth.token]);

//   const onChangeCaption = (id, text) =>
//     setCaptions((p) => ({ ...p, [id]: text }));

//   const postItinerary = async (itineraryId) => {
//     if (busy[itineraryId]) return;
//     if (!auth?.userId) {
//       setErr("You must be logged in to post.");
//       return;
//     }
//     try {
//       setBusy((p) => ({ ...p, [itineraryId]: true }));
//       const caption = (captions[itineraryId] || "").trim();

//       // Backend requires user_id + content_id (caption optional for now)
//       const res = await fetch(`${API_BASE_URL}/posts`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({
//           user_id: Number(auth.userId),
//           content_id: Number(itineraryId),
//           visibility: "public",
//           caption: caption || null,
//         }),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       setCaptions((p) => ({ ...p, [itineraryId]: "" }));
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

//   // UI states
//   if (!sessionReady) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//         <Text style={styles.meta}>Authorizing…</Text>
//       </View>
//     );
//   }
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
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
//       <View style={styles.center}>
//         <Text style={styles.meta}>No itineraries yet.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ gap: 12 }}>
//       {items.map((it) => {
//         const caption = captions[it.id] ?? "";
//         return (
//           <View key={it.id} style={styles.itCard}>
//             <View style={{ flex: 1, minWidth: 0 }}>
//               <Text numberOfLines={1} style={styles.itTitle}>
//                 {it.title || `Itinerary #${it.id}`}
//               </Text>
//               {!!it.destination && (
//                 <Text numberOfLines={1} style={styles.itMeta}>
//                   {it.destination}
//                 </Text>
//               )}
//               {!!it.start_date && (
//                 <Text numberOfLines={1} style={styles.itMeta}>
//                   {it.start_date} — {it.end_date || "?"}
//                 </Text>
//               )}
//             </View>

//             <View style={{ height: 8 }} />

//             <TextInput
//               value={caption}
//               onChangeText={(t) => onChangeCaption(it.id, t)}
//               placeholder="Add a caption (optional)…"
//               placeholderTextColor="#94A3B8"
//               style={styles.captionInput}
//               multiline
//             />

//             <TouchableOpacity
//               onPress={() => postItinerary(it.id)}
//               activeOpacity={0.9}
//               disabled={!!busy[it.id]}
//               style={[styles.primaryBtn, !!busy[it.id] && { opacity: 0.7 }]}
//             >
//               <Text style={styles.primaryBtnText}>
//                 {busy[it.id] ? "Posting…" : "Post Itinerary"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         );
//       })}
//     </View>
//   );
// }

// /* ---------- Simple stubs for other tabs ---------- */
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
//   </>
// );

// const ServiceForm = () => (
//   <>
//     <Text style={styles.formTitle}>List a Service</Text>
//     <Field label="Service Title" placeholder="e.g., Jeep Rental - Skardu" />
//     <Field label="Price" placeholder="e.g., 6000 PKR/day" />
//     <Field label="Contact" placeholder="+92 ..." />
//     <Field label="Description" placeholder="What’s included, terms, etc." multiline />
//   </>
// );

// const SkillForm = () => (
//   <>
//     <Text style={styles.formTitle}>Share a Skill</Text>
//     <Field label="Skill Title" placeholder="e.g., Local Cooking Class" />
//     <Field label="Duration" placeholder="e.g., 2 hours" />
//     <Field label="Available Slots" placeholder="e.g., 6" />
//     <Field label="About" placeholder="Describe what you’ll teach" multiline />
//   </>
// );

// /* ----------------------- styles ----------------------- */
// const COLORS = {
//   bg: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#5B6B7B",
//   primary: "#0F70F0",
//   border: "#EAF0F6",
// };

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: COLORS.bg },
//   container: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingBottom: 120,
//     paddingHorizontal: 16,
//     ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center" } : {}),
//   },

//   title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
//   subtitle: { marginTop: 4, color: COLORS.subtext, fontWeight: "600" },

//   tabsRow: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 8 },
//   tabPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     backgroundColor: "#F3F6FA",
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     ...(Platform.OS === "web" && { cursor: "pointer" }),
//   },
//   tabPillActive: { backgroundColor: "#E7F3FF", borderColor: "#77B6FF" },
//   tabPillText: { fontWeight: "700", color: COLORS.subtext },
//   tabPillTextActive: { color: COLORS.text },

//   card: {
//     marginTop: 14,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,
//   },

//   // itinerary cards
//   itCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 12,
//   },
//   itTitle: { fontWeight: "800", color: "#0F172A" },
//   itMeta: { color: "#64748B", fontSize: 12, marginTop: 2 },

//   captionInput: {
//     marginTop: 8,
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: "#0F172A",
//     minHeight: 60,
//     textAlignVertical: "top",
//   },

//   formTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.text,
//     marginBottom: 8,
//   },

//   field: { marginBottom: 10 },
//   label: {
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 6,
//     fontSize: 12,
//   },
//   input: {
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === "ios" ? 12 : 10,
//     color: "#0F172A",
//   },
//   inputMultiline: { minHeight: 90, textAlignVertical: "top" },

//   primaryBtn: {
//     marginTop: 10,
//     height: 44,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryBtnText: { color: "#fff", fontWeight: "800" },

//   // states
//   center: { alignItems: "center", justifyContent: "center", padding: 18 },
//   meta: { color: "#64748B", fontWeight: "600" },
//   errorBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },
// });


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
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API || "http://localhost:8080";

// const TABS = [
//   { key: "itinerary", label: "Itinerary", icon: "map-outline" },
//   { key: "event", label: "Event", icon: "sparkles-outline" },
//   { key: "service", label: "Service", icon: "briefcase-outline" },
//   { key: "skill", label: "Skill", icon: "school-outline" },
// ];

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

//   const headers = useMemo(() => {
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
//       <Text style={styles.title}>What do you want to post?</Text>
//       <Text style={styles.subtitle}>
//         Pick a type — content renders inline on this screen.
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
//           <ItineraryPoster headers={headers} auth={auth} sessionReady={sessionReady} />
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

// /* ----------------- Itinerary fetch + post ----------------- */
// function ItineraryPoster({ headers, auth, sessionReady }) {
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [items, setItems] = useState([]);
//   const [captions, setCaptions] = useState({}); // { [itineraryId]: caption }
//   const [busy, setBusy] = useState({}); // { [itineraryId]: true }

//   const load = async () => {
//     if (!sessionReady) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/itineraries`, { method: "GET", headers });
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

//   useEffect(() => { if (sessionReady) load(); }, [sessionReady]);
//   useEffect(() => { if (sessionReady && auth.token) load(); }, [auth.token]);

//   const onChangeCaption = (id, text) =>
//     setCaptions((p) => ({ ...p, [id]: text }));

//   const postItinerary = async (itineraryId) => {
//     if (busy[itineraryId]) return;
//     if (!auth?.userId) {
//       setErr("You must be logged in to post.");
//       return;
//     }
//     try {
//       setBusy((p) => ({ ...p, [itineraryId]: true }));
//       const caption = (captions[itineraryId] || "").trim();

//       const res = await fetch(`${API_BASE_URL}/posts`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({
//           user_id: Number(auth.userId),
//           content_id: Number(itineraryId),
//           visibility: "public",
//           caption: caption || null,
//         }),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       setCaptions((p) => ({ ...p, [itineraryId]: "" }));
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
//         <ActivityIndicator />
//         <Text style={styles.meta}>Authorizing…</Text>
//       </View>
//     );
//   }
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
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
//       <View style={styles.center}>
//         <Text style={styles.meta}>No itineraries yet.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ gap: 16 }}>
//       {items.map((it) => {
//         const caption = captions[it.id] ?? "";

//         // Use your card for the visual, keep actions below it.
//         return (
//           <View key={it.id} style={styles.itWrapper}>
//             <ItineraryCard item={{
//               title: it.title,
//               city: it.city || it.destination,        // tolerate either field name
//               start_date: it.start_date,
//               end_date: it.end_date,
//               budget: it.budget,
//               style: it.style,
//               cover_url: it.cover_url,
//               days: it.days || [],
//             }} />

//             <TextInput
//               value={caption}
//               onChangeText={(t) => onChangeCaption(it.id, t)}
//               placeholder="Add a caption (optional)…"
//               placeholderTextColor="#94A3B8"
//               style={styles.captionInput}
//               multiline
//             />

//             <TouchableOpacity
//               onPress={() => postItinerary(it.id)}
//               activeOpacity={0.9}
//               disabled={!!busy[it.id]}
//               style={[styles.primaryBtn, !!busy[it.id] && { opacity: 0.7 }]}
//             >
//               <Text style={styles.primaryBtnText}>
//                 {busy[it.id] ? "Posting…" : "Post Itinerary"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         );
//       })}
//     </View>
//   );
// }

// /* ---------- Stubs kept minimal for other tabs ---------- */
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
//   </>
// );

// const ServiceForm = () => (
//   <>
//     <Text style={styles.formTitle}>List a Service</Text>
//     <Field label="Service Title" placeholder="e.g., Jeep Rental - Skardu" />
//     <Field label="Price" placeholder="e.g., 6000 PKR/day" />
//     <Field label="Contact" placeholder="+92 ..." />
//     <Field label="Description" placeholder="What’s included, terms, etc." multiline />
//   </>
// );

// const SkillForm = () => (
//   <>
//     <Text style={styles.formTitle}>Share a Skill</Text>
//     <Field label="Skill Title" placeholder="e.g., Local Cooking Class" />
//     <Field label="Duration" placeholder="e.g., 2 hours" />
//     <Field label="Available Slots" placeholder="e.g., 6" />
//     <Field label="About" placeholder="Describe what you’ll teach" multiline />
//   </>
// );

// /* ----------------------- styles ----------------------- */
// const COLORS = {
//   bg: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#5B6B7B",
//   primary: "#0F70F0",
//   border: "#EAF0F6",
// };

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: COLORS.bg },
//   container: {
//     paddingTop: Platform.OS === "web" ? 92 : 16,
//     paddingBottom: 120,
//     paddingHorizontal: 16,
//     ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center" } : {}),
//   },

//   title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
//   subtitle: { marginTop: 4, color: COLORS.subtext, fontWeight: "600" },

//   tabsRow: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 8 },
//   tabPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     backgroundColor: "#F3F6FA",
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     ...(Platform.OS === "web" && { cursor: "pointer" }),
//   },
//   tabPillActive: { backgroundColor: "#E7F3FF", borderColor: "#77B6FF" },
//   tabPillText: { fontWeight: "700", color: COLORS.subtext },
//   tabPillTextActive: { color: COLORS.text },

//   card: {
//     marginTop: 14,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 2,
//   },

//   itWrapper: { gap: 10 }, // card + caption + button stack
//   captionInput: {
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: "#0F172A",
//     minHeight: 60,
//     textAlignVertical: "top",
//   },

//   formTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.text,
//     marginBottom: 8,
//   },

//   field: { marginBottom: 10 },
//   label: {
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 6,
//     fontSize: 12,
//   },
//   input: {
//     backgroundColor: "#F9FBFE",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === "ios" ? 12 : 10,
//     color: "#0F172A",
//   },
//   inputMultiline: { minHeight: 90, textAlignVertical: "top" },

//   primaryBtn: {
//     height: 44,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//   },
//   primaryBtnText: { color: "#fff", fontWeight: "800" },

//   center: { alignItems: "center", justifyContent: "center", padding: 18 },
//   meta: { color: "#64748B", fontWeight: "600" },
//   errorBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF3F2",
//     borderWidth: 1,
//     borderColor: "#FEE4E2",
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },
//   errorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ItineraryCard from "../../screens/CrowdsourceItineraries/ItineraryCard";
import getBaseURL from "../../config/env"; // ✅ use your existing env.js

const API_BASE_URL = getBaseURL();

const TABS = [
  { key: "itinerary", label: "Itinerary", icon: "map-outline" },
  { key: "event", label: "Event", icon: "sparkles-outline" },
  { key: "service", label: "Service", icon: "briefcase-outline" },
  { key: "skill", label: "Skill", icon: "school-outline" },
];

export default function CreatePostScreen() {
  const [active, setActive] = useState("itinerary");

  // session
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

  // headers
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
      <Text style={styles.title}>What do you want to post?</Text>
      <Text style={styles.subtitle}>
        Pick a type — content renders inline on this screen.
      </Text>

      <View style={styles.tabsRow}>
        {TABS.map((t) => {
          const selected = active === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabPill, selected && styles.tabPillActive]}
              onPress={() => setActive(t.key)}
              activeOpacity={0.9}
            >
              <Ionicons
                name={t.icon}
                size={18}
                color={selected ? COLORS.text : COLORS.subtext}
              />
              <Text
                style={[
                  styles.tabPillText,
                  selected && styles.tabPillTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.card}>
        {active === "itinerary" ? (
          <ItineraryPoster
            headersGet={authHeaders}
            headersPost={jsonHeaders}
            auth={auth}
            sessionReady={sessionReady}
          />
        ) : active === "event" ? (
          <EventForm />
        ) : active === "service" ? (
          <ServiceForm />
        ) : (
          <SkillForm />
        )}
      </View>
    </ScrollView>
  );
}

/* ----------------- Itinerary fetch + post ----------------- */
function ItineraryPoster({ headersGet, headersPost, auth, sessionReady }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [items, setItems] = useState([]);
  const [captions, setCaptions] = useState({}); // { [itineraryId]: caption }
  const [busy, setBusy] = useState({}); // { [itineraryId]: true }

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

  const onChangeCaption = (id, text) =>
    setCaptions((p) => ({ ...p, [id]: text }));

  const postItinerary = async (itineraryId) => {
    if (busy[itineraryId]) return;
    if (!auth?.userId) {
      setErr("You must be logged in to post.");
      return;
    }
    try {
      setBusy((p) => ({ ...p, [itineraryId]: true }));
      const caption = (captions[itineraryId] || "").trim();

      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: headersPost, // ✅ only JSON on POST
        body: JSON.stringify({
          user_id: Number(auth.userId),
          content_id: Number(itineraryId),
          visibility: "public",
          caption: caption || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCaptions((p) => ({ ...p, [itineraryId]: "" }));
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
        <ActivityIndicator />
        <Text style={styles.meta}>Authorizing…</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
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
      <View style={styles.center}>
        <Text style={styles.meta}>No itineraries yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      {items.map((it) => {
        const caption = captions[it.id] ?? "";

        return (
          <View key={it.id} style={styles.itWrapper}>
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
            />

            <TextInput
              value={caption}
              onChangeText={(t) => onChangeCaption(it.id, t)}
              placeholder="Add a caption (optional)…"
              placeholderTextColor="#94A3B8"
              style={styles.captionInput}
              multiline
            />

            <TouchableOpacity
              onPress={() => postItinerary(it.id)}
              activeOpacity={0.9}
              disabled={!!busy[it.id]}
              style={[styles.primaryBtn, !!busy[it.id] && { opacity: 0.7 }]}
            >
              <Text style={styles.primaryBtnText}>
                {busy[it.id] ? "Posting…" : "Post Itinerary"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

/* ---------- Stubs kept minimal for other tabs ---------- */
const Field = ({ label, placeholder, multiline }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      placeholder={placeholder}
      placeholderTextColor="#9AA3AF"
      multiline={multiline}
    />
  </View>
);

const EventForm = () => (
  <>
    <Text style={styles.formTitle}>Create Event</Text>
    <Field label="Event Name" placeholder="e.g., Trekking Meetup" />
    <Field label="Date" placeholder="YYYY-MM-DD" />
    <Field label="Location" placeholder="City / venue / coordinates" />
    <Field label="Details" placeholder="Tell people what to expect" multiline />
  </>
);

const ServiceForm = () => (
  <>
    <Text style={styles.formTitle}>List a Service</Text>
    <Field label="Service Title" placeholder="e.g., Jeep Rental - Skardu" />
    <Field label="Price" placeholder="e.g., 6000 PKR/day" />
    <Field label="Contact" placeholder="+92 ..." />
    <Field label="Description" placeholder="What’s included, terms, etc." multiline />
  </>
);

const SkillForm = () => (
  <>
    <Text style={styles.formTitle}>Share a Skill</Text>
    <Field label="Skill Title" placeholder="e.g., Local Cooking Class" />
    <Field label="Duration" placeholder="e.g., 2 hours" />
    <Field label="Available Slots" placeholder="e.g., 6" />
    <Field label="About" placeholder="Describe what you’ll teach" multiline />
  </>
);

/* ----------------------- styles ----------------------- */
const COLORS = {
  bg: "#F6FAFD",
  card: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#5B6B7B",
  primary: "#0F70F0",
  border: "#EAF0F6",
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    paddingTop: Platform.OS === "web" ? 92 : 16,
    paddingBottom: 120,
    paddingHorizontal: 16,
    ...(Platform.OS === "web" ? { maxWidth: 1000, alignSelf: "center" } : {}),
  },

  title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  subtitle: { marginTop: 4, color: COLORS.subtext, fontWeight: "600" },

  tabsRow: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tabPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#F3F6FA",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...(Platform.OS === "web" && { cursor: "pointer" }),
  },
  tabPillActive: { backgroundColor: "#E7F3FF", borderColor: "#77B6FF" },
  tabPillText: { fontWeight: "700", color: COLORS.subtext },
  tabPillTextActive: { color: COLORS.text },

  card: {
    marginTop: 14,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  itWrapper: { gap: 10 }, // card + caption + button stack
  captionInput: {
    backgroundColor: "#F9FBFE",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#0F172A",
    minHeight: 60,
    textAlignVertical: "top",
  },

  formTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  field: { marginBottom: 10 },
  label: {
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
    fontSize: 12,
  },
  input: {
    backgroundColor: "#F9FBFE",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    color: "#0F172A",
  },
  inputMultiline: { minHeight: 90, textAlignVertical: "top" },

  primaryBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },

  center: { alignItems: "center", justifyContent: "center", padding: 18 },
  meta: { color: "#64748B", fontWeight: "600" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  errorText: { color: "#B42318", fontWeight: "600" },
  link: { color: COLORS.primary, fontWeight: "700" },
});
