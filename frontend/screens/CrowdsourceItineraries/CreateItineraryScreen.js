
// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   Platform,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Picker } from "@react-native-picker/picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Ionicons } from "@expo/vector-icons";

// /* ========= SCOPE LIMIT: Cities & Places ========= */
// const CITY_OPTIONS = ["Lahore", "Islamabad", "Hunza", "Skardu"];
// const PLACES_BY_CITY = {
//   Lahore: [
//     "Badshahi Mosque",
//     "Lahore Fort",
//     "Shalimar Gardens",
//     "Food Street",
//     "MM Alam Road",
//   ],
//   Islamabad: [
//     "Faisal Mosque",
//     "Daman-e-Koh",
//     "Pakistan Monument",
//     "Saidpur Village",
//     "Trail 5",
//   ],
//   Hunza: ["Altit Fort", "Baltit Fort", "Eagle’s Nest", "Attabad Lake"],
//   Skardu: ["Shangrila Resort", "Upper Kachura Lake", "Deosai Plains"],
// };
// const BUDGET_OPTIONS = ["Budget-friendly", "Mid-range", "Luxury"];
// const STYLE_OPTIONS = ["Adventure", "Cultural", "Comfort"];

// /* ========= Helpers ========= */
// const fmt = (d) =>
//   d
//     ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//         d.getDate()
//       ).padStart(2, "0")}`
//     : "";
// const isFutureOrToday = (d) => {
//   const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
//   const b = new Date();
//   const today = new Date(b.getFullYear(), b.getMonth(), b.getDate());
//   return a >= today;
// };
// const timeRe = /^([01]\d|2[0-3]):([0-5]\d)\s?-\s?([01]\d|2[0-3]):([0-5]\d)$/; // "09:00 - 17:00"

// /* ========= Reusable UI bits ========= */
// const Chip = ({ label, active, onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.9}
//     style={[
//       styles.chip,
//       active ? styles.chipActive : styles.chipIdle,
//       { paddingVertical: 8, paddingHorizontal: 14 },
//     ]}
//   >
//     <Text style={[styles.chipText, active && { color: "#0b1a2b" }]}>{label}</Text>
//   </TouchableOpacity>
// );

// const SectionCard = ({ title, children, right }) => (
//   <View style={styles.card}>
//     <View style={styles.cardHeader}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       {right}
//     </View>
//     {children}
//   </View>
// );

// const FieldLabel = ({ children }) => (
//   <Text style={{ fontWeight: "700", color: "#0f172a", marginBottom: 6 }}>{children}</Text>
// );

// const ErrorText = ({ msg }) =>
//   !msg ? null : <Text style={{ color: "#dc2626", marginTop: 6 }}>{msg}</Text>;

// /* ========= Main Screen ========= */
// export default function CreateItineraryScreen() {
//   /* form state */
//   const [cover, setCover] = useState(null);
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//   const [city, setCity] = useState("");
//   const [budget, setBudget] = useState("");
//   const [style, setStyle] = useState("");

//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [showStart, setShowStart] = useState(false);
//   const [showEnd, setShowEnd] = useState(false);

//   const [days, setDays] = useState([]);
//   const [errors, setErrors] = useState({});

//   const cityPlaces = useMemo(() => PLACES_BY_CITY[city] || [], [city]);

//   /* pick cover */
//   const pickCover = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission needed", "Please allow photo library access.");
//       return;
//     }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.85,
//     });
//     if (!res.canceled) setCover(res.assets?.[0] || null);
//   };

//   /* day ops */
//   const addDay = () => {
//     if (!city) {
//       Alert.alert("Select city first", "Pick a city to see its places.");
//       return;
//     }
//     setDays((d) => [
//       ...d,
//       { place: "", time: "", activities: "", _id: Math.random().toString(36) },
//     ]);
//   };
//   const updateDay = (idx, patch) =>
//     setDays((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], ...patch };
//       return next;
//     });
//   const removeDay = (idx) => setDays((prev) => prev.filter((_, i) => i !== idx));

//   /* validation */
//   const validate = () => {
//     const e = {};
//     if (!cover) e.cover = "Cover is required";
//     if (title.trim().length < 3) e.title = "Min 3 characters";
//     if (desc.trim().length < 10) e.desc = "Min 10 characters";
//     if (!city) e.city = "Select a city";
//     if (!budget) e.budget = "Pick a budget";
//     if (!style) e.style = "Pick a style";
//     if (!startDate) e.start = "Select start date";
//     if (!endDate) e.end = "Select end date";
//     if (startDate && !isFutureOrToday(startDate)) e.start = "Start cannot be in past";
//     if (startDate && endDate && endDate < startDate) e.end = "End must be after start";

//     if (days.length === 0) e.days = "Add at least one day";
//     days.forEach((d, i) => {
//       if (!d.place) e[`d${i}.place`] = "Choose a place";
//       else if (!cityPlaces.includes(d.place))
//         e[`d${i}.place`] = `Must be in ${city}`;
//       if (!timeRe.test(d.time)) e[`d${i}.time`] = `Use HH:MM - HH:MM`;
//       if ((d.activities || "").trim().length < 5)
//         e[`d${i}.activities`] = "Add a short summary";
//     });

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const canSubmit = () => {
//     // light check for button state
//     return (
//       cover &&
//       title.trim().length >= 3 &&
//       desc.trim().length >= 10 &&
//       city &&
//       budget &&
//       style &&
//       startDate &&
//       endDate &&
//       endDate >= startDate &&
//       days.length > 0 &&
//       days.every(
//         (d) =>
//           d.place &&
//           cityPlaces.includes(d.place) &&
//           timeRe.test(d.time) &&
//           (d.activities || "").trim().length >= 5
//       )
//     );
//   };

//   const submit = () => {
//     if (!validate()) return;
//     const payload = {
//       title,
//       description: desc,
//       city,
//       budget,
//       style,
//       startDate: fmt(startDate),
//       endDate: fmt(endDate),
//       cover,
//       days,
//     };
//     console.log("Submitting Itinerary:", payload);
//     Alert.alert("Success", "Itinerary submitted!");
//     // TODO: POST to your backend
//   };

//   /* Date Inputs (web vs native) */
//   const DateRow = ({ label, value, setValue, show, setShow }) => (
//     <View style={{ marginBottom: 14 }}>
//       <FieldLabel>{label}</FieldLabel>
//       {Platform.OS === "web" ? (
//         <View style={styles.dateWebWrap}>
//           {/* eslint-disable-next-line react/no-unknown-property */}
//           <input
//             type="date"
//             value={value ? fmt(value) : ""}
//             onChange={(e) => {
//               const v = e.target.value;
//               if (!v) return setValue(null);
//               const [y, m, d] = v.split("-").map((n) => parseInt(n, 10));
//               setValue(new Date(y, m - 1, d));
//             }}
//             style={styles.dateWebInput}
//           />
//         </View>
//       ) : (
//         <>
//           <TouchableOpacity style={styles.dateNative} onPress={() => setShow(true)}>
//             <Ionicons name="calendar-outline" size={18} color="#0f172a" />
//             <Text style={styles.dateNativeText}>{value ? fmt(value) : "YYYY-MM-DD"}</Text>
//           </TouchableOpacity>
//           {show && (
//             <DateTimePicker
//               value={value || new Date()}
//               mode="date"
//               display="calendar"
//               onChange={(_, d) => {
//                 setShow(false);
//                 if (d) setValue(d);
//               }}
//             />
//           )}
//         </>
//       )}
//     </View>
//   );

//   return (
//     <>
//       <ScrollView
//         style={{ flex: 1, backgroundColor: "#f5f7fb" }}
//         contentContainerStyle={styles.container}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* -------- Cover + Basics -------- */}
//         <SectionCard
//           title="Create Itinerary"
//           right={
//             <View style={styles.badge}>
//               <Ionicons name="shield-checkmark-outline" size={14} color="#0f172a" />
//               <Text style={styles.badgeText}>Community-ready</Text>
//             </View>
//           }
//         >
//           {/* Cover */}
//           <View style={styles.coverBox}>
//             {cover ? (
//               <Image source={{ uri: cover.uri }} style={styles.coverImage} />
//             ) : (
//               <View style={{ alignItems: "center" }}>
//                 <Ionicons name="image-outline" size={28} color="#7b8aa3" />
//                 <Text style={styles.coverHint}>Tap “Pick Cover” to add a photo</Text>
//               </View>
//             )}
//             <TouchableOpacity style={styles.coverBtn} onPress={pickCover}>
//               <Ionicons name="images-outline" size={16} color="#fff" />
//               <Text style={styles.coverBtnText}>Pick Cover</Text>
//             </TouchableOpacity>
//           </View>
//           <ErrorText msg={errors.cover} />

//           {/* Title + Description */}
//           <TextInput
//             style={styles.input}
//             placeholder="Great title (e.g., ‘2 Days in Old Lahore’)"
//             placeholderTextColor="#8a97aa"
//             value={title}
//             onChangeText={setTitle}
//           />
//           <ErrorText msg={errors.title} />

//           <TextInput
//             style={[styles.input, styles.multiline]}
//             placeholder="Short overview — what’s special about this trip?"
//             placeholderTextColor="#8a97aa"
//             value={desc}
//             onChangeText={setDesc}
//             multiline
//           />
//           <ErrorText msg={errors.desc} />

//           {/* City (full width, pretty select) */}
//           <FieldLabel>Select City</FieldLabel>
//           <View style={styles.selectRow}>
//             <Picker
//               selectedValue={city}
//               onValueChange={(v) => {
//                 setCity(v);
//                 setDays([]);
//               }}
//               style={styles.picker}
//               dropdownIconColor="#0f172a"
//             >
//               <Picker.Item label="Select City" value="" />
//               {CITY_OPTIONS.map((c) => (
//                 <Picker.Item key={c} label={c} value={c} />
//               ))}
//             </Picker>
//           </View>
//           <ErrorText msg={errors.city} />

//           {/* Budget & Style as Chips */}
//           <FieldLabel>Budget</FieldLabel>
//           <View style={styles.chipRow}>
//             {BUDGET_OPTIONS.map((b) => (
//               <Chip key={b} label={b} active={budget === b} onPress={() => setBudget(b)} />
//             ))}
//           </View>
//           <ErrorText msg={errors.budget} />

//           <FieldLabel>Travel Style</FieldLabel>
//           <View style={styles.chipRow}>
//             {STYLE_OPTIONS.map((s) => (
//               <Chip key={s} label={s} active={style === s} onPress={() => setStyle(s)} />
//             ))}
//           </View>
//           <ErrorText msg={errors.style} />

//           {/* Dates */}
//           <View style={{ flexDirection: Platform.OS === "web" ? "row" : "column", gap: 12 }}>
//             <View style={{ flex: 1 }}>
//               <DateRow
//                 label="Start Date"
//                 value={startDate}
//                 setValue={setStartDate}
//                 show={showStart}
//                 setShow={setShowStart}
//               />
//               <ErrorText msg={errors.start} />
//             </View>
//             <View style={{ flex: 1 }}>
//               <DateRow
//                 label="End Date"
//                 value={endDate}
//                 setValue={setEndDate}
//                 show={showEnd}
//                 setShow={setShowEnd}
//               />
//               <ErrorText msg={errors.end} />
//             </View>
//           </View>
//         </SectionCard>

//         {/* -------- Days Builder -------- */}
//         <SectionCard
//           title="Itinerary Days"
//           right={
//             <TouchableOpacity style={styles.addPill} onPress={addDay}>
//               <Ionicons name="add-circle-outline" size={16} color="#0f6cd6" />
//               <Text style={styles.addPillText}>Add Day</Text>
//             </TouchableOpacity>
//           }
//         >
//           <ErrorText msg={errors.days} />

//           {days.map((d, idx) => {
//             const pPlace = `d${idx}.place`;
//             const pTime = `d${idx}.time`;
//             const pAct = `d${idx}.activities`;
//             return (
//               <View key={d._id} style={styles.dayCard}>
//                 <View style={styles.dayHeader}>
//                   <Text style={styles.dayTitle}>Day {idx + 1}</Text>
//                   <TouchableOpacity onPress={() => removeDay(idx)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
//                     <Ionicons name="trash-outline" size={18} color="#dc2626" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Place (restricted by city) */}
//                 <FieldLabel>Place (in {city || "…"})</FieldLabel>
//                 <View style={styles.selectRow}>
//                   <Picker
//                     selectedValue={d.place}
//                     onValueChange={(v) => updateDay(idx, { place: v })}
//                     style={styles.picker}
//                   >
//                     <Picker.Item
//                       label={city ? "Select a place" : "Select city first"}
//                       value=""
//                     />
//                     {cityPlaces.map((p) => (
//                       <Picker.Item key={p} label={p} value={p} />
//                     ))}
//                   </Picker>
//                 </View>
//                 <ErrorText msg={errors[pPlace]} />

//                 {/* Time */}
//                 <FieldLabel>Time (HH:MM - HH:MM)</FieldLabel>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="09:00 - 17:00"
//                   placeholderTextColor="#8a97aa"
//                   value={d.time}
//                   onChangeText={(v) => updateDay(idx, { time: v })}
//                 />
//                 <ErrorText msg={errors[pTime]} />

//                 {/* Activities */}
//                 <FieldLabel>Activities / Notes</FieldLabel>
//                 <TextInput
//                   style={[styles.input, styles.multiline]}
//                   placeholder="Short plan for the day…"
//                   placeholderTextColor="#8a97aa"
//                   value={d.activities}
//                   onChangeText={(v) => updateDay(idx, { activities: v })}
//                   multiline
//                 />
//                 <ErrorText msg={errors[pAct]} />
//               </View>
//             );
//           })}

//           {days.length === 0 && (
//             <View style={styles.emptyState}>
//               <Ionicons name="map-outline" size={26} color="#7b8aa3" />
//               <Text style={styles.emptyText}>No days added yet</Text>
//               <TouchableOpacity style={styles.addPrimary} onPress={addDay}>
//                 <Text style={styles.addPrimaryText}>Add your first day</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </SectionCard>

//         <View style={{ height: 96 }} />
//       </ScrollView>

//       {/* Sticky submit (mobile-first) */}
//       <View style={styles.stickyBar}>
//         <TouchableOpacity
//           style={[styles.submitBtn, !canSubmit() && { opacity: 0.5 }]}
//           onPress={submit}
//           disabled={!canSubmit()}
//         >
//           <Ionicons name="airplane-outline" size={18} color="#fff" />
//           <Text style={styles.submitText}>Submit Itinerary</Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// }

// /* ========= Styles ========= */
// const styles = StyleSheet.create({
//   container: {
//     padding: 12,
//     alignItems: "center",
//   },

//   /* Cards */
//   card: {
//     width: "100%",
//     maxWidth: 940,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: "#e7eef7",
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 6 },
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

//   /* Badge */
//   badge: {
//     backgroundColor: "#eef6ff",
//     borderRadius: 999,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   badgeText: { color: "#0f172a", fontWeight: "700", fontSize: 12 },

//   /* Cover */
//   coverBox: {
//     height: 190,
//     borderRadius: 14,
//     backgroundColor: "#f0f4fa",
//     overflow: "hidden",
//     marginBottom: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//   },
//   coverImage: { width: "100%", height: "100%", resizeMode: "cover" },
//   coverHint: { marginTop: 6, color: "#7b8aa3", fontWeight: "600" },
//   coverBtn: {
//     position: "absolute",
//     right: 10,
//     bottom: 10,
//     backgroundColor: "#0f172a",
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   coverBtnText: { color: "#fff", fontWeight: "800" },

//   /* Inputs */
//   input: {
//     backgroundColor: "#f6f8fc",
//     borderWidth: 1,
//     borderColor: "#e6edf7",
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     fontSize: 16,
//     color: "#0f172a",
//     marginTop: 6,
//     marginBottom: 10,
//   },
//   multiline: { minHeight: 88, textAlignVertical: "top" },

//   /* Select (Picker) row */
//   selectRow: {
//     borderWidth: 1,
//     borderColor: "#e6edf7",
//     borderRadius: 12,
//     backgroundColor: "#f6f8fc",
//     overflow: "hidden",
//     minHeight: Platform.OS === "web" ? 48 : 44,
//     justifyContent: "center",
//     marginBottom: 10,
//   },
//   picker: {
//     height: Platform.OS === "web" ? 48 : 44,
//     fontSize: 16,
//     color: "#0f172a",
//     paddingHorizontal: 10,
//     ...(Platform.OS === "web" ? { outlineStyle: "none" } : null),
//   },

//   /* Chips */
//   chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 10 },
//   chip: {
//     borderRadius: 999,
//     borderWidth: 1,
//   },
//   chipIdle: { backgroundColor: "#fff", borderColor: "#e6edf7" },
//   chipActive: { backgroundColor: "#bfe0ff", borderColor: "#9fd0ff" },
//   chipText: { fontWeight: "700", color: "#1e293b" },

//   /* Date */
//   dateWebWrap: {
//     borderWidth: 1,
//     borderColor: "#e6edf7",
//     borderRadius: 12,
//     backgroundColor: "#f6f8fc",
//     overflow: "hidden",
//     minHeight: 48,
//     justifyContent: "center",
//     paddingHorizontal: 10,
//   },
//   // eslint-disable-next-line react-native/no-color-literals
//   dateWebInput: {
//     height: 46,
//     width: "100%",
//     fontSize: 16,
//     color: "#0f172a",
//     border: "none",
//     background: "transparent",
//     outline: "none",
//   },
//   dateNative: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#f6f8fc",
//     borderWidth: 1,
//     borderColor: "#e6edf7",
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//   },
//   dateNativeText: { fontSize: 16, color: "#0f172a" },

//   /* Day cards */
//   dayCard: {
//     borderWidth: 1,
//     borderColor: "#e9eef7",
//     backgroundColor: "#fbfdff",
//     borderRadius: 14,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dayHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   dayTitle: { fontWeight: "800", color: "#0f172a" },

//   emptyState: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 18,
//     gap: 8,
//   },
//   emptyText: { color: "#7b8aa3", fontWeight: "600" },
//   addPrimary: {
//     marginTop: 4,
//     backgroundColor: "#0f6cd6",
//     borderRadius: 999,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//   },
//   addPrimaryText: { color: "#fff", fontWeight: "800" },

//   addPill: {
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 999,
//     backgroundColor: "#eef6ff",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   addPillText: { color: "#0f6cd6", fontWeight: "800" },

//   /* Sticky submit */
//   stickyBar: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "#ffffffee",
//     borderTopWidth: 1,
//     borderTopColor: "#e8eef7",
//     padding: 10,
//     alignItems: "center",
//   },
//   submitBtn: {
//     backgroundColor: "#16a34a",
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     width: "100%",
//     maxWidth: 940,
//     justifyContent: "center",
//   },
//   submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },
// });

// CreateItineraryScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

/* ========= Inline Cities → Destinations JSON (your data) ========= */
const PLACES_BY_CITY = {
  "Abbottabad": [
    "Abbottabad City",
    "Ayubia National Park",
    "Miranjani Top",
    "Mushkpuri Top",
    "Nathia Gali",
    "Thandiani"
  ],
  "Galiyat": [
    "Abbottabad City",
    "Ayubia National Park",
    "Miranjani Top",
    "Mushkpuri Top",
    "Nathia Gali",
    "Thandiani"
  ],
  "Bagh": ["Ganga Choti", "Lasdana"],
  "Badin": ["Zero Point (Indo-Pak Border)"],
  "Chitral": [
    "Chitral Valley",
    "Garam Chashma (Hot Springs)",
    "Kalash Valley (Bumburet, Rumbur, Birir)",
    "Shandur Pass (Roof of the World)",
    "Tirich Mir Peak (Hindu Kush)"
  ],
  "Dir": [
    "Jahaz Banda Meadows",
    "Katora Lake",
    "Kumrat Valley",
    "Thall (gateway to Kumrat)"
  ],
  "Kumrat": [
    "Jahaz Banda Meadows",
    "Katora Lake",
    "Kumrat Valley",
    "Thall (gateway to Kumrat)"
  ],
  "Gilgit": [
    "Bagrot Valley",
    "Bireno Suspension Bridge",
    "Chinese Cemetery (Danyore Valley)",
    "Firoza Lake",
    "Junction of Three Mountain Ranges",
    "Kargah Valley / Kargah Buddha site",
    "Kutwal Lake",
    "Naltar Valley",
    "SatRangi Lake",
    "Taj Mughal Minar (Mughali Shikar)"
  ],
  "Haveli": ["Khai Gala", "Neza Gali"],
  "Hunza Valley": [
    "Altit Fort",
    "Attabad Lake",
    "Baltit Fort",
    "Hussaini Suspension Bridge",
    "Khunjerab Pass",
    "Passu Cones & Glacier",
    "Borith Lake"
  ],
  "Islamabad": [
    "Centaurus Mall & Blue Area",
    "Daman-e-Koh",
    "Faisal Mosque",
    "Fatima Jinnah Park (F-9 Park)",
    "Golra Sharif Railway Museum",
    "Japan Park",
    "Lake View Park",
    "Lok Virsa Museum",
    "Margalla Hills National Park",
    "Pakistan Monument & Museum",
    "Pakistan Natural History Museum",
    "Pir Sohawa & Monal",
    "Rawal Lake & Viewpoint",
    "Rawalpindi/Islamabad Metro Bus Route",
    "Rose & Jasmine Garden",
    "Saidpur Village",
    "Shakarparian Hills & Pakistan Monument Park",
    "Trail 3, Trail 5, Trail 6 (Margalla)"
  ],
  "Karachi": [
    "Churna Island",
    "Clifton Beach",
    "Empress Market",
    "French Beach",
    "Frere Hall",
    "Hawksbay Beach",
    "Karachi Safari Park",
    "Karachi Zoo",
    "Mohatta Palace",
    "National Museum of Pakistan",
    "PAF Museum Karachi",
    "Pakistan Maritime Museum",
    "Quaid-e-Azam Mausoleum (Mazar-e-Quaid)",
    "Sandspit Beach",
    "Turtle Beach"
  ],
  "Kotli": ["Kotli Waterfalls", "Teenda"],
  "Lahore": [
    "Alhamra Arts Council",
    "Anarkali Bazaar",
    "Badshahi Mosque",
    "Data Darbar",
    "Emporium Mall",
    "Food Street (Gawalmandi / Fort Road)",
    "Fortress Stadium & Market",
    "Gaddafi Stadium",
    "Hazuri Bagh",
    "Iqbal Park",
    "Lahore Fort (Shahi Qila)",
    "Lahore Museum",
    "Lahore Safari Park",
    "Lahore Zoo",
    "Minar-e-Pakistan",
    "Packages Mall",
    "Race Course Park (Jilani Park)",
    "Shalimar Gardens",
    "Sheesh Mahal",
    "Wazir Khan Mosque"
  ],
  "Multan": [
    "Chaman Zar Askari Lake & Park",
    "Chenab River Bank Picnic Points",
    "Eidgah Mosque",
    "Ghanta Ghar (Clock Tower)",
    "Hussain Agahi Bazaar",
    "Multan Arts Council",
    "Multan Cricket Stadium",
    "Multan Fort (Qasim Bagh Fort)",
    "Old City Gates",
    "Shah Gardez Tomb",
    "Shah Yousaf Gardez Tomb",
    "Shrine of Bahauddin Zakariya",
    "Shrine of Shah Rukn-e-Alam",
    "Shrine of Shah Shams Tabrez",
    "Tomb of Mai Maharban"
  ],
  "Muzaffarabad": ["Pir Chinasi", "Shaheed Gali", "Subri Lake"],
  "Nagar Valley": ["Nagar Valley"],
  "Nagarparkar": ["Jain Temples Nagarparkar", "Karoonjhar Mountains"],
  "Naran & Kaghan": [
    "Ansoo Lake",
    "Babusar Top",
    "Dudipatsar Lake",
    "Kaghan",
    "Lulusar Lake",
    "Naran",
    "Saif-ul-Malook Lake"
  ],
  "Neelum Valley": ["Arang Kel", "Kel", "Keran", "Sharda"],
  "Rawalakot": ["Banjosa Lake", "Rawalakot Valley", "Toli Pir"],
  "Skardu": [
    "Manthokha Waterfall",
    "Katpana Tso (Katpana Desert & Lake)",
    "Satpara Tso Lake",
    "Shangrila Resort / Lower Kachura Lake",
    "Skardu Valley"
  ],
  "Swat Valley": [
    "Bahrain",
    "Gabral Valley",
    "Kalam Valley",
    "Madyan",
    "Mahodand Lake",
    "Malam Jabba (ski resort)",
    "Ushu Forest"
  ],
  "Murree": [
    "Mall Road, Murree",
    "Pindi Point",
    "Kashmir Point",
    "Patriata (New Murree)",
    "Murree Wildlife Park (Bansara Gali)",
    "Bhurban",
    "Nathia Gali",
    "Mushkpuri Top",
    "Ayubia National Park",
    "Ghora Gali",
    "Upper Topa",
    "Lower Topa",
    "Dagri Forest",
    "Kohala Point / Kohala Bridge",
    "Holy Trinity Church (Mall Road)"
  ]
};

const CITY_OPTIONS = Object.keys(PLACES_BY_CITY).sort();
const BUDGET_OPTIONS = ["Budget-friendly", "Mid-range", "Luxury"];
const STYLE_OPTIONS = ["Adventure", "Cultural", "Comfort"];

const PRIMARY = "#003366";
const BORDER = "#E6EDF7";

/* ========== Helpers ========== */
const pad2 = (n) => String(n).padStart(2, "0");
const fmtDate = (d) =>
  d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : "";
const parseDateISO = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
};
const fmtTime = (h, m) => `${pad2(h)}:${pad2(m)}`;

/* ---- Cross-platform inputs ---- */
const DateField = ({ label, value, onChange }) => {
  // value is Date|null
  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.webDateWrap}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <input
            type="date"
            value={value ? fmtDate(value) : ""}
            onChange={(e) => onChange(parseDateISO(e.target.value))}
            style={styles.webDateInput}
          />
        </View>
      </View>
    );
  }
  const [show, setShow] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setShow(true)}>
        <Ionicons name="calendar-outline" size={18} color="#0f172a" />
        <Text style={{ marginLeft: 8 }}>{value ? fmtDate(value) : "YYYY-MM-DD"}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selected) => {
            // Android may fire 'dismissed'
            if (event?.type === "dismissed") return setShow(false);
            setShow(false);
            if (selected) onChange(selected);
          }}
        />
      )}
    </View>
  );
};

const TimeField = ({ label, value, onChange }) => {
  // value is "HH:MM" string or ""
  if (Platform.OS === "web") {
    return (
      <View>
        <Text style={styles.smallLabel}>{label}</Text>
        <View style={styles.webDateWrap}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <input
            type="time"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={styles.webDateInput}
          />
        </View>
      </View>
    );
  }
  const [show, setShow] = useState(false);
  return (
    <View>
      <Text style={styles.smallLabel}>{label}</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setShow(true)}>
        <Ionicons name="time-outline" size={18} color="#0f172a" />
        <Text style={{ marginLeft: 8 }}>{value || "HH:MM"}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, picked) => {
            if (event?.type === "dismissed") return setShow(false);
            setShow(false);
            if (picked) onChange(fmtTime(picked.getHours(), picked.getMinutes()));
          }}
        />
      )}
    </View>
  );
};

/* ========== Screen ========== */
export default function CreateItineraryScreen() {
  const [cover, setCover] = useState(null); // { uri }
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [stylePref, setStylePref] = useState("");

  // Dates
  const [startDate, setStartDate] = useState(null); // Date|null
  const [endDate, setEndDate] = useState(null); // Date|null

  // Days — time fields are strings "HH:MM"
  const [days, setDays] = useState([
    { place: "", startTime: "", endTime: "", activities: "" },
  ]);

  const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

  const addDay = () =>
    setDays((prev) => [...prev, { place: "", startTime: "", endTime: "", activities: "" }]);

  const removeDay = (idx) => setDays((prev) => prev.filter((_, i) => i !== idx));

  const updateDay = (idx, patch) =>
    setDays((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });

  const pickCover = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled) setCover(res.assets?.[0] || null);
  };

  const validate = () => {
    if (!cover) return "Please add a cover picture";
    if (title.trim().length < 3) return "Title: min 3 characters";
    if (desc.trim().length < 10) return "Description: min 10 characters";
    if (!city) return "Please select a city";
    if (!budget) return "Please select a budget";
    if (!stylePref) return "Please select a travel style";
    if (!startDate) return "Please pick a start date";
    if (!endDate) return "Please pick an end date";

    // date order
    const sd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const ed = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const today = new Date(); const td = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (sd < td) return "Start date cannot be in the past";
    if (ed < sd) return "End date must be after start date";

    if (days.length === 0) return "Add at least one day";
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      if (!d.place) return `Day ${i + 1}: choose a place`;
      if (!cityPlaces.includes(d.place)) return `Day ${i + 1}: place must be in ${city}`;
      if (!/^\d{2}:\d{2}$/.test(d.startTime)) return `Day ${i + 1}: pick a start time`;
      if (!/^\d{2}:\d{2}$/.test(d.endTime)) return `Day ${i + 1}: pick an end time`;
      // compare HH:MM
      const [sh, sm] = d.startTime.split(":").map(Number);
      const [eh, em] = d.endTime.split(":").map(Number);
      if (eh < sh || (eh === sh && em <= sm))
        return `Day ${i + 1}: end time must be after start time`;
      if ((d.activities || "").trim().length < 5)
        return `Day ${i + 1}: add a short activities note`;
    }
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return Alert.alert("Fix and try again", err);
    const payload = {
      title,
      description: desc,
      city,
      budget,
      style: stylePref,
      startDate: fmtDate(startDate),
      endDate: fmtDate(endDate),
      cover,
      days,
    };
    console.log("SUBMIT:", payload);
    Alert.alert("Itinerary Submitted", "Your itinerary has been recorded.");
  };

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 36 }}>
      <Text style={styles.h1}>Create Itinerary</Text>

      {/* Cover */}
      <Text style={styles.label}>Cover Image</Text>
      <View style={styles.coverBox}>
        {cover?.uri ? (
          <Image source={{ uri: cover.uri }} style={styles.coverImg} />
        ) : (
          <Text style={{ color: "#6B7280" }}>Tap “Pick Cover” to add a photo</Text>
        )}
        <TouchableOpacity style={styles.coverBtn} onPress={pickCover}>
          <Ionicons name="images-outline" size={16} color="#fff" />
          <Text style={styles.coverBtnText}>Pick Cover</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 3 Days in Hunza"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Short overview of your trip…"
        value={desc}
        onChangeText={setDesc}
        multiline
      />

      {/* City */}
      <Text style={styles.label}>City</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={city}
          onValueChange={(v) => {
            setCity(v);
            setDays((prev) => prev.map((d) => ({ ...d, place: "" })));
          }}
        >
          <Picker.Item label="Select City" value="" />
          {CITY_OPTIONS.map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      </View>

      {/* Budget */}
      <Text style={styles.label}>Budget</Text>
      <View style={styles.row}>
        {BUDGET_OPTIONS.map((b) => (
          <TouchableOpacity
            key={b}
            style={[styles.chip, budget === b && styles.chipActive]}
            onPress={() => setBudget(b)}
          >
            <Text style={[styles.chipText, budget === b && styles.chipTextActive]}>{b}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Style */}
      <Text style={styles.label}>Travel Style</Text>
      <View style={styles.row}>
        {STYLE_OPTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, stylePref === s && styles.chipActive]}
            onPress={() => setStylePref(s)}
          >
            <Text style={[styles.chipText, stylePref === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dates (cross-platform) */}
      <View style={{ flexDirection: Platform.OS === "web" ? "row" : "column", gap: 10 }}>
        <DateField label="Start Date" value={startDate} onChange={setStartDate} />
        <DateField label="End Date" value={endDate} onChange={setEndDate} />
      </View>

      {/* Days */}
      <Text style={[styles.h2, { marginTop: 8 }]}>Days</Text>

      {days.map((d, idx) => (
        <View key={idx} style={styles.dayCard}>
          <View style={styles.dayHead}>
            <Text style={styles.dayTitle}>Day {idx + 1}</Text>
            {days.length > 1 && (
              <TouchableOpacity onPress={() => removeDay(idx)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Place */}
          <Text style={styles.smallLabel}>Place (in {city || "…"})</Text>
          <View style={styles.pickerBox}>
            <Picker
              enabled={!!city}
              selectedValue={d.place}
              onValueChange={(v) => updateDay(idx, { place: v })}
            >
              <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
              {cityPlaces.map((p) => (
                <Picker.Item key={p} label={p} value={p} />
              ))}
            </Picker>
          </View>

          {/* Start/End time (cross-platform) */}
          <TimeField
            label="Start Time"
            value={d.startTime}
            onChange={(t) => updateDay(idx, { startTime: t })}
          />
          <TimeField
            label="End Time"
            value={d.endTime}
            onChange={(t) => updateDay(idx, { endTime: t })}
          />

          {/* Activities */}
          <Text style={styles.smallLabel}>Activities / Notes</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Short plan for the day…"
            value={d.activities}
            onChangeText={(v) => updateDay(idx, { activities: v })}
            multiline
          />
        </View>
      ))}

      {/* Add another day */}
      <TouchableOpacity style={styles.addBtn} onPress={addDay}>
        <Text style={styles.addBtnText}>+ Add another day</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Submit Itinerary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ========= Styles ========= */
const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#f7f9fc", padding: 14 },
  h1: { fontSize: 22, fontWeight: "800", color: PRIMARY, marginBottom: 10 },
  h2: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 6 },

  label: { fontWeight: "700", color: "#0f172a", marginBottom: 6, marginTop: 6 },
  smallLabel: { fontWeight: "600", color: "#0f172a", marginBottom: 6, marginTop: 6 },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  multiline: { minHeight: 84, textAlignVertical: "top" },

  pickerBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontWeight: "700", color: PRIMARY },
  chipTextActive: { color: "#fff", fontWeight: "800" },

  /* Cover */
  coverBox: {
    height: 180,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  coverImg: { width: "100%", height: "100%", resizeMode: "cover" },
  coverBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  coverBtnText: { color: "#fff", fontWeight: "800" },

  /* Web date/time input wrapper so it looks like RN fields */
  webDateWrap: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 10,
  },
  // eslint-disable-next-line react-native/no-color-literals
  webDateInput: {
    width: "100%",
    height: 46,
    border: "none",
    outline: "none",
    paddingLeft: 12,
    fontSize: 16,
    background: "transparent",
    color: "#0f172a",
  },

  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  dayCard: {
    borderWidth: 1,
    borderColor: "#e9eef7",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  dayTitle: { fontWeight: "800", color: "#0f172a" },
  remove: { color: "#dc2626", fontWeight: "700" },

  addBtn: {
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  addBtnText: { color: PRIMARY, fontWeight: "800" },

  submit: {
    backgroundColor: "#16a34a",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  submitText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
