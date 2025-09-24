
// import React, { useMemo, useRef, useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   Image,
//   ActivityIndicator,
//   BackHandler,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from "expo-image-picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// /* ========= Backend Config ========= */
// import getBaseURL from "../../config/env";
// const API_BASE = getBaseURL().replace(/\/+$/, "");

// const TOKEN_KEYS = ["token", "auth_token", "jwt", "access_token", "AUTH_TOKEN", "userToken"];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };

// /* ========= Inline Cities → Destinations JSON (your data) ========= */
// const PLACES_BY_CITY = {
//   Abbottabad: [
//     "Abbottabad City",
//     "Ayubia National Park",
//     "Miranjani Top",
//     "Mushkpuri Top",
//     "Nathia Gali",
//     "Thandiani",
//   ],
//   Galiyat: [
//     "Abbottabad City",
//     "Ayubia National Park",
//     "Miranjani Top",
//     "Mushkpuri Top",
//     "Nathia Gali",
//     "Thandiani",
//   ],
//   Bagh: ["Ganga Choti", "Lasdana"],
//   Badin: ["Zero Point (Indo-Pak Border)"],
//   Chitral: [
//     "Chitral Valley",
//     "Garam Chashma (Hot Springs)",
//     "Kalash Valley (Bumburet, Rumbur, Birir)",
//     "Shandur Pass (Roof of the World)",
//     "Tirich Mir Peak (Hindu Kush)",
//   ],
//   Dir: ["Jahaz Banda Meadows", "Katora Lake", "Kumrat Valley", "Thall (gateway to Kumrat)"],
//   Kumrat: ["Jahaz Banda Meadows", "Katora Lake", "Kumrat Valley", "Thall (gateway to Kumrat)"],
//   Gilgit: [
//     "Bagrot Valley",
//     "Bireno Suspension Bridge",
//     "Chinese Cemetery (Danyore Valley)",
//     "Firoza Lake",
//     "Junction of Three Mountain Ranges",
//     "Kargah Valley / Kargah Buddha site",
//     "Kutwal Lake",
//     "Naltar Valley",
//     "SatRangi Lake",
//     "Taj Mughal Minar (Mughali Shikar)",
//   ],
//   Haveli: ["Khai Gala", "Neza Gali"],
//   "Hunza Valley": [
//     "Altit Fort",
//     "Attabad Lake",
//     "Baltit Fort",
//     "Hussaini Suspension Bridge",
//     "Khunjerab Pass",
//     "Passu Cones & Glacier",
//     "Borith Lake",
//   ],
//   Islamabad: [
//     "Centaurus Mall & Blue Area",
//     "Daman-e-Koh",
//     "Faisal Mosque",
//     "Fatima Jinnah Park (F-9 Park)",
//     "Golra Sharif Railway Museum",
//     "Japan Park",
//     "Lake View Park",
//     "Lok Virsa Museum",
//     "Margalla Hills National Park",
//     "Pakistan Monument & Museum",
//     "Pakistan Natural History Museum",
//     "Pir Sohawa & Monal",
//     "Rawal Lake & Viewpoint",
//     "Rawalpindi/Islamabad Metro Bus Route",
//     "Rose & Jasmine Garden",
//     "Saidpur Village",
//     "Shakarparian Hills & Pakistan Monument Park",
//     "Trail 3, Trail 5, Trail 6 (Margalla)",
//   ],
//   Karachi: [
//     "Churna Island",
//     "Clifton Beach",
//     "Empress Market",
//     "French Beach",
//     "Frere Hall",
//     "Hawksbay Beach",
//     "Karachi Safari Park",
//     "Karachi Zoo",
//     "Mohatta Palace",
//     "National Museum of Pakistan",
//     "PAF Museum Karachi",
//     "Pakistan Maritime Museum",
//     "Quaid-e-Azam Mausoleum (Mazar-e-Quaid)",
//     "Sandspit Beach",
//     "Turtle Beach",
//   ],
//   Kotli: ["Kotli Waterfalls", "Teenda"],
//   Lahore: [
//     "Alhamra Arts Council",
//     "Anarkali Bazaar",
//     "Badshahi Mosque",
//     "Data Darbar",
//     "Emporium Mall",
//     "Food Street (Gawalmandi / Fort Road)",
//     "Fortress Stadium & Market",
//     "Gaddafi Stadium",
//     "Hazuri Bagh",
//     "Iqbal Park",
//     "Lahore Fort (Shahi Qila)",
//     "Lahore Museum",
//     "Lahore Safari Park",
//     "Lahore Zoo",
//     "Minar-e-Pakistan",
//     "Packages Mall",
//     "Race Course Park (Jilani Park)",
//     "Shalimar Gardens",
//     "Sheesh Mahal",
//     "Wazir Khan Mosque",
//   ],
//   Multan: [
//     "Chaman Zar Askari Lake & Park",
//     "Chenab River Bank Picnic Points",
//     "Eidgah Mosque",
//     "Ghanta Ghar (Clock Tower)",
//     "Hussain Agahi Bazaar",
//     "Multan Arts Council",
//     "Multan Cricket Stadium",
//     "Multan Fort (Qasim Bagh Fort)",
//     "Old City Gates",
//     "Shah Gardez Tomb",
//     "Shah Yousaf Gardez Tomb",
//     "Shrine of Bahauddin Zakariya",
//     "Shrine of Shah Rukn-e-Alam",
//     "Shrine of Shah Shams Tabrez",
//     "Tomb of Mai Maharban",
//   ],
//   Muzaffarabad: ["Pir Chinasi", "Shaheed Gali", "Subri Lake"],
//   "Nagar Valley": ["Nagar Valley"],
//   Nagarparkar: ["Jain Temples Nagarparkar", "Karoonjhar Mountains"],
//   "Naran & Kaghan": [
//     "Ansoo Lake",
//     "Babusar Top",
//     "Dudipatsar Lake",
//     "Kaghan",
//     "Lulusar Lake",
//     "Naran",
//     "Saif-ul-Malook Lake",
//   ],
//   "Neelum Valley": ["Arang Kel", "Kel", "Keran", "Sharda"],
//   Rawalakot: ["Banjosa Lake", "Rawalakot Valley", "Toli Pir"],
//   Skardu: [
//     "Manthokha Waterfall",
//     "Katpana Tso (Katpana Desert & Lake)",
//     "Satpara Tso Lake",
//     "Shangrila Resort / Lower Kachura Lake",
//     "Skardu Valley",
//   ],
//   "Swat Valley": [
//     "Bahrain",
//     "Gabral Valley",
//     "Kalam Valley",
//     "Madyan",
//     "Mahodand Lake",
//     "Malam Jabba (ski resort)",
//     "Ushu Forest",
//   ],
//   Murree: [
//     "Mall Road, Murree",
//     "Pindi Point",
//     "Kashmir Point",
//     "Patriata (New Murree)",
//     "Murree Wildlife Park (Bansara Gali)",
//     "Bhurban",
//     "Nathia Gali",
//     "Mushkpuri Top",
//     "Ayubia National Park",
//     "Ghora Gali",
//     "Upper Topa",
//     "Lower Topa",
//     "Dagri Forest",
//     "Kohala Point / Kohala Bridge",
//     "Holy Trinity Church (Mall Road)",
//   ],
// };

// const CITY_OPTIONS = Object.keys(PLACES_BY_CITY).sort();
// const BUDGET_OPTIONS = ["Budget-friendly", "Mid-range", "Luxury"];
// const STYLE_OPTIONS = ["Adventure", "Cultural", "Comfort"];

// const PRIMARY = "#003366";
// const BORDER = "#E6EDF7";
// const SUBTEXT = "#6B7280";

// /* ===== tiny helpers for optional date check ===== */
// const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
// const toDate = (s) => {
//   const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
//   return new Date(y, m - 1, d);
// };

// /* ===== Cross-platform DateField: opens calendar on web & native ===== */
// const DateField = ({ label, value, onChange, error }) => {
//   if (Platform.OS === "web") {
//     return (
//       <View style={{ flex: 1 }}>
//         <Text style={styles.smallLabel}>{label}</Text>
//         {/* eslint-disable-next-line react/no-unknown-property */}
//         <input
//           type="date"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           style={{
//             ...styles.webDateInput,
//             borderColor: error ? "#dc2626" : BORDER,
//           }}
//         />
//         {error ? <Text style={styles.errText}>{error}</Text> : null}
//       </View>
//     );
//   }
//   const [show, setShow] = useState(false);
//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={styles.smallLabel}>{label}</Text>
//       <TouchableOpacity
//         style={[styles.dateBtn, error && styles.errBorder]}
//         onPress={() => setShow(true)}
//         activeOpacity={0.8}
//       >
//         <Ionicons name="calendar-outline" size={18} color="#0f172a" />
//         <Text style={{ marginLeft: 8 }}>{value || "YYYY-MM-DD"}</Text>
//       </TouchableOpacity>
//       {error ? <Text style={styles.errText}>{error}</Text> : null}
//       {show && (
//         <DateTimePicker
//           value={value ? new Date(value) : new Date()}
//           mode="date"
//           display="calendar"
//           onChange={(event, d) => {
//             setShow(false);
//             if (event?.type === "dismissed") return;
//             if (d) {
//               const iso = d.toISOString().split("T")[0];
//               onChange(iso);
//             }
//           }}
//         />
//       )}
//     </View>
//   );
// };

// export default function CreateItineraryScreen({ onBack }) {
//   const navigation = useNavigation();
//   const goBack = () => {
//     if (typeof onBack === "function") onBack();
//     else if (navigation?.canGoBack()) navigation.goBack();
//   };

//   // Handle Android hardware back
//   useEffect(() => {
//     const sub = BackHandler.addEventListener("hardwareBackPress", () => {
//       goBack();
//       return true;
//     });
//     return () => sub.remove();
//   }, []);

//   const scrollRef = useRef(null);

//   const [cover, setCover] = useState(null); // { uri }
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//   const [city, setCity] = useState("");
//   const [budget, setBudget] = useState("");
//   const [stylePref, setStylePref] = useState("");

//   // Dates stored as ISO strings e.g. "2025-09-23"
//   const [startDateText, setStartDateText] = useState("");
//   const [endDateText, setEndDateText] = useState("");

//   // Days — times are optional free text
//   const [days, setDays] = useState([{ place: "", startTime: "", endTime: "", activities: "" }]);

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

//   const addDay = () =>
//     setDays((prev) => [...prev, { place: "", startTime: "", endTime: "", activities: "" }]);
//   const removeDay = (idx) => setDays((prev) => prev.filter((_, i) => i !== idx));
//   const updateDay = (idx, patch) =>
//     setDays((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], ...patch };
//       return next;
//     });

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

//   const validate = () => {
//     const e = {};
//     if (!cover) e.cover = "Please add a cover picture";
//     if (title.trim().length < 3) e.title = "Min 3 characters";
//     if (desc.trim().length < 10) e.desc = "Min 10 characters";
//     if (!city) e.city = "Select a city";
//     if (!budget) e.budget = "Select a budget";
//     if (!stylePref) e.stylePref = "Select a travel style";
//     if (!startDateText.trim()) e.startDateText = "Pick a start date";
//     if (!endDateText.trim()) e.endDateText = "Pick an end date";

//     if (
//       startDateText.trim() &&
//       endDateText.trim() &&
//       looksISODate(startDateText) &&
//       looksISODate(endDateText)
//     ) {
//       const sd = toDate(startDateText);
//       const ed = toDate(endDateText);
//       if (ed < sd) e.endDateText = "End date must be after start date";
//     }

//     if (days.length === 0) e.days = "Add at least one day";
//     days.forEach((d, i) => {
//       if (!d.place) e[`day${i}.place`] = "Choose a place";
//       else if (!cityPlaces.includes(d.place)) e[`day${i}.place`] = `Must be in ${city}`;
//       if ((d.activities || "").trim().length < 5) e[`day${i}.activities`] = "Add a short note";
//       // time fields optional
//     });

//     setErrors(e);
//     return e;
//   };

//   const canSubmit = () =>
//     cover &&
//     title.trim().length >= 3 &&
//     desc.trim().length >= 10 &&
//     city &&
//     budget &&
//     stylePref &&
//     startDateText.trim() &&
//     endDateText.trim() &&
//     days.length > 0 &&
//     days.every((d) => d.place && (d.activities || "").trim().length >= 5);

//   const submit = async () => {
//     const e = validate();
//     if (Object.keys(e).length) {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//       Alert.alert("Please fix the highlighted fields.");
//       return;
//     }

//     const token = await getAuthToken();
//     if (!token) {
//       Alert.alert("Not logged in", "Please log in again to submit an itinerary.");
//       return;
//     }

//     // Transform to backend field names
//     const payload = {
//       title,
//       description: desc,
//       city,
//       budget,
//       style: stylePref,
//       start_date: startDateText,
//       end_date: endDateText,
//       cover_url: cover?.uri || "", // send URI (backend can store as-is or upload feature later)
//       days: days.map((d, idx) => ({
//         day_number: idx + 1,
//         place: d.place,
//         start_time: d.startTime || "", // optional
//         end_time: d.endTime || "", // optional
//         activities: d.activities || "",
//       })),
//     };

//     try {
//       setSubmitting(true);

//       // 1) 20s timeout so you don't hang forever on mobile networks
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 20000);

//       // 2) Normalize base URL + path (avoid double slashes; trailing slash not required)
//       const base = API_BASE; // already trimmed above
//       const url = `${base}/itineraries`; // backend accepts with/without trailing slash

//       // 3) Do the request
//       let res;
//       try {
//         res = await fetch(url, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//           signal: controller.signal,
//         });
//       } finally {
//         clearTimeout(timeoutId);
//       }

//       // 4) Read body safely (JSON or empty/error text)
//       const raw = await res.text();
//       let j = null;
//       try {
//         j = raw ? JSON.parse(raw) : null;
//       } catch {
//         /* ignore parse errors */
//       }

//       // 5) Handle common statuses
//       if (res.status === 401) {
//         Alert.alert("Session expired", "Please log in again.");
//         return;
//       }
//       if (res.status === 428) {
//         Alert.alert(
//           "Complete Profile",
//           j?.error || "Please complete your profile to continue."
//         );
//         return;
//       }
//       if (!res.ok) {
//         // Friendlier messages for typical problems
//         const friendly = {
//           400: "Invalid data. Please review the fields.",
//           403: "You don't have permission to do that.",
//           404: "Endpoint not found. Check API path (/itineraries).",
//           413: "Image too large. Try a smaller cover image.",
//           415: "Unsupported data type.",
//           500: "Server error. Please try again.",
//           502: "Bad gateway.",
//           503: "Server unavailable.",
//           504: "Server timed out.",
//         };
//         const msg =
//           j?.error || friendly[res.status] || `Failed to save itinerary (HTTP ${res.status})`;
//         Alert.alert("Error", msg);
//         return;
//       }

//       // 6) Success
//       Alert.alert("Success", "Itinerary saved successfully!");

//       // Reset form after success
//       setTitle("");
//       setDesc("");
//       setCity("");
//       setBudget("");
//       setStylePref("");
//       setStartDateText("");
//       setEndDateText("");
//       setCover(null);
//       setDays([{ place: "", startTime: "", endTime: "", activities: "" }]);

//       // Go back to Hub view if embedded
//       goBack();
//     } catch (err) {
//       // Network issues, wrong base URL, CORS on web, or our manual timeout
//       const aborted = err?.name === "AbortError";
//       const msg = aborted
//         ? "Request timed out. Check your connection or API base URL."
//         : "Unable to reach the server. Check your connection or API base URL.";
//       console.log("Create itinerary network error:", err);
//       Alert.alert("Network Error", msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       {/* Back pill (works in embedded mode and stack mode) */}
//       <TouchableOpacity
//         onPress={goBack}
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           gap: 8,
//           margin: 12,
//           paddingVertical: 10,
//           paddingHorizontal: 12,
//           backgroundColor: "#fff",
//           borderRadius: 10,
//           borderWidth: 1,
//           borderColor: BORDER,
//           alignSelf: "flex-start",
//         }}
//         accessibilityLabel="Back to Itineraries"
//       >
//         <Ionicons name="arrow-back" size={18} color="#0f172a" />
//         <Text style={{ fontWeight: "800", color: "#0f172a" }}>Back to Itineraries</Text>
//       </TouchableOpacity>

//       <ScrollView
//         ref={scrollRef}
//         style={styles.wrap}
//         contentContainerStyle={{ paddingBottom: 36 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.h1}>Create Itinerary</Text>

//         {/* ------- Card: Basics ------- */}
//         <View className="card" style={styles.card}>
//           <Text style={styles.sectionTitle}>Basics</Text>

//           {/* Cover */}
//           <Text style={styles.label}>Cover Image</Text>
//           <View style={[styles.coverBox, errors.cover && styles.errBorder]}>
//             {cover?.uri ? (
//               <Image source={{ uri: cover.uri }} style={styles.coverImg} />
//             ) : (
//               <Text style={{ color: SUBTEXT }}>Tap “Pick Cover” to add a photo</Text>
//             )}
//             <TouchableOpacity
//               style={styles.coverBtn}
//               onPress={pickCover}
//               accessibilityLabel="Pick cover image"
//             >
//               <Ionicons name="images-outline" size={16} color="#fff" />
//               <Text style={styles.coverBtnText}>Pick Cover</Text>
//             </TouchableOpacity>
//           </View>
//           {errors.cover && <Text style={styles.errText}>{errors.cover}</Text>}

//           {/* Title */}
//           <Text style={styles.label}>Title</Text>
//           <TextInput
//             style={[styles.input, errors.title && styles.errBorder]}
//             placeholder="e.g., 3 Days in Hunza"
//             value={title}
//             onChangeText={setTitle}
//           />
//           {errors.title && <Text style={styles.errText}>{errors.title}</Text>}

//           {/* Description */}
//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={[styles.input, styles.multiline, errors.desc && styles.errBorder]}
//             placeholder="Short overview of your trip…"
//             value={desc}
//             onChangeText={setDesc}
//             multiline
//           />
//           {errors.desc && <Text style={styles.errText}>{errors.desc}</Text>}

//           {/* City */}
//           <Text style={styles.label}>City</Text>
//           <View style={[styles.pickerBox, errors.city && styles.errBorder]}>
//             <Picker
//               style={styles.picker}
//               selectedValue={city}
//               onValueChange={(v) => {
//                 setCity(v);
//                 setDays((prev) => prev.map((d) => ({ ...d, place: "" })));
//               }}
//             >
//               <Picker.Item label="Select City" value="" />
//               {CITY_OPTIONS.map((c) => (
//                 <Picker.Item key={c} label={c} value={c} />
//               ))}
//             </Picker>
//           </View>
//           {errors.city && <Text style={styles.errText}>{errors.city}</Text>}

//           {/* Budget */}
//           <Text style={styles.label}>Budget</Text>
//           <View style={styles.row}>
//             {BUDGET_OPTIONS.map((b) => (
//               <TouchableOpacity
//                 key={b}
//                 style={[styles.chip, budget === b && styles.chipActive]}
//                 onPress={() => setBudget(b)}
//                 accessibilityLabel={`Budget ${b}`}
//               >
//                 <Text style={[styles.chipText, budget === b && styles.chipTextActive]}>{b}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {errors.budget && <Text style={styles.errText}>{errors.budget}</Text>}

//           {/* Style */}
//           <Text style={styles.label}>Travel Style</Text>
//           <View style={styles.row}>
//             {STYLE_OPTIONS.map((s) => (
//               <TouchableOpacity
//                 key={s}
//                 style={[styles.chip, stylePref === s && styles.chipActive]}
//                 onPress={() => setStylePref(s)}
//                 accessibilityLabel={`Travel style ${s}`}
//               >
//                 <Text style={[styles.chipText, stylePref === s && styles.chipTextActive]}>{s}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {errors.stylePref && <Text style={styles.errText}>{errors.stylePref}</Text>}

//           {/* Dates (calendar-enabled) */}
//           <View style={styles.dateRow}>
//             <DateField
//               label="Start Date"
//               value={startDateText}
//               onChange={setStartDateText}
//               error={errors.startDateText}
//             />
//             <DateField
//               label="End Date"
//               value={endDateText}
//               onChange={setEndDateText}
//               error={errors.endDateText}
//             />
//           </View>
//         </View>

//         {/* ------- Card: Days ------- */}
//         <View style={styles.card}>
//           <View style={styles.cardHead}>
//             <Text style={styles.sectionTitle}>Days</Text>
//             <TouchableOpacity style={styles.addBtn} onPress={addDay} accessibilityLabel="Add day">
//               <Text style={styles.addBtnText}>+ Add another day</Text>
//             </TouchableOpacity>
//           </View>
//           {errors.days && <Text style={[styles.errText, { marginBottom: 8 }]}>{errors.days}</Text>}

//           {days.map((d, idx) => {
//             const errPlace = errors[`day${idx}.place`];
//             const errAct = errors[`day${idx}.activities`];
//             const placeDisabled = !city;
//             return (
//               <View key={idx} style={styles.dayCard}>
//                 <View style={styles.dayHead}>
//                   <Text style={styles.dayTitle}>Day {idx + 1}</Text>
//                   {days.length > 1 && (
//                     <TouchableOpacity onPress={() => removeDay(idx)} accessibilityLabel="Remove day">
//                       <Ionicons name="trash-outline" size={18} color="#dc2626" />
//                     </TouchableOpacity>
//                   )}
//                 </View>

//                 {/* Place */}
//                 <Text style={styles.smallLabel}>Place (in {city || "…"})</Text>
//                 <View
//                   style={[
//                     styles.pickerBox,
//                     errPlace && styles.errBorder,
//                     placeDisabled && { opacity: 0.6 },
//                   ]}
//                   pointerEvents={placeDisabled ? "none" : "auto"}
//                 >
//                   <Picker
//                     style={styles.picker}
//                     selectedValue={d.place}
//                     onValueChange={(v) => updateDay(idx, { place: v })}
//                   >
//                     <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
//                     {cityPlaces.map((p) => (
//                       <Picker.Item key={p} label={p} value={p} />
//                     ))}
//                   </Picker>
//                 </View>
//                 {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

//                 {/* Optional time fields (free text) */}
//                 <Text style={styles.smallLabel}>Start Time (optional)</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g., 9am or 09:00"
//                   value={d.startTime}
//                   onChangeText={(t) => updateDay(idx, { startTime: t })}
//                 />
//                 <Text style={styles.smallLabel}>End Time (optional)</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g., evening or 17:00"
//                   value={d.endTime}
//                   onChangeText={(t) => updateDay(idx, { endTime: t })}
//                 />

//                 {/* Activities */}
//                 <Text style={styles.smallLabel}>Activities / Notes</Text>
//                 <TextInput
//                   style={[styles.input, styles.multiline, errAct && styles.errBorder]}
//                   placeholder="Short plan for the day…"
//                   value={d.activities}
//                   onChangeText={(v) => updateDay(idx, { activities: v })}
//                   multiline
//                 />
//                 {errAct && <Text style={styles.errText}>{errAct}</Text>}
//               </View>
//             );
//           })}
//         </View>

//         {/* Submit */}
//         <TouchableOpacity
//           style={[styles.submit, (!canSubmit() || submitting) && { opacity: 0.6 }]}
//           onPress={submit}
//           disabled={!canSubmit() || submitting}
//           accessibilityLabel="Submit itinerary"
//         >
//           {submitting ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <>
//               <Ionicons name="airplane-outline" size={18} color="#fff" />
//               <Text style={styles.submitText}>Submit Itinerary</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </>
//   );
// }

// /* ========= Styles ========= */
// const styles = StyleSheet.create({
//   wrap: { flex: 1, backgroundColor: "#f7f9fc", padding: 14 },
//   h1: { fontSize: 22, fontWeight: "800", color: PRIMARY, marginBottom: 10 },

//   /* Cards */
//   card: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#eef2f7",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 2,
//   },
//   cardHead: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

//   /* Labels */
//   label: { fontWeight: "700", color: "#0f172a", marginBottom: 6, marginTop: 6 },
//   smallLabel: { fontWeight: "600", color: "#0f172a", marginBottom: 6, marginTop: 6 },

//   /* Inputs */
//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: BORDER,
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   multiline: { minHeight: 84, textAlignVertical: "top" },

//   /* Pickers */
//   pickerBox: {
//     borderWidth: 1,
//     borderColor: BORDER,
//     borderRadius: 10,
//     marginBottom: 10,
//     backgroundColor: "#fff",
//     height: 48,
//     justifyContent: "center",
//     overflow: "hidden",
//   },
//   picker: {
//     height: 48,
//     width: "100%",
//     fontSize: 16,
//     color: "#0f172a",
//     paddingHorizontal: 10,
//     ...(Platform.OS === "web" ? { outlineStyle: "none" } : null),
//   },

//   /* Date row */
//   dateRow: { flexDirection: "row", gap: 10, marginTop: 8 },

//   // Web date input (styled to match RN inputs)
//   webDateInput: {
//     width: "100%",
//     height: 48,
//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: BORDER,
//     borderRadius: 10,
//     paddingLeft: 12,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     outline: "none",
//     marginBottom: 6,
//   },

//   // Native date button
//   dateBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: BORDER,
//     borderRadius: 10,
//     padding: 12,
//     backgroundColor: "#fff",
//     marginBottom: 6,
//   },

//   /* Cover */
//   coverBox: {
//     height: 180,
//     borderWidth: 1,
//     borderColor: BORDER,
//     borderRadius: 12,
//     backgroundColor: "#fff",
//     marginBottom: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//     position: "relative",
//   },
//   coverImg: { width: "100%", height: "100%", resizeMode: "cover" },
//   coverBtn: {
//     position: "absolute",
//     right: 10,
//     bottom: 10,
//     backgroundColor: PRIMARY,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   coverBtnText: { color: "#fff", fontWeight: "800" },

//   /* Day cards */
//   dayCard: {
//     borderWidth: 1,
//     borderColor: "#e9eef7",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dayHead: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   dayTitle: { fontWeight: "800", color: "#0f172a" },

//   /* Chips */
//   row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
//   chip: {
//     borderWidth: 1,
//     borderColor: BORDER,
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     backgroundColor: "#fff",
//   },
//   chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
//   chipText: { fontWeight: "700", color: PRIMARY },
//   chipTextActive: { color: "#fff", fontWeight: "800" },

//   /* Buttons */
//   addBtn: {
//     borderWidth: 1,
//     borderColor: PRIMARY,
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     backgroundColor: "#fff",
//   },
//   addBtnText: { color: PRIMARY, fontWeight: "800" },

//   submit: {
//     backgroundColor: "#16a34a",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//   },
//   submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   /* Errors */
//   errText: { color: "#dc2626", marginBottom: 8 },
//   errBorder: { borderColor: "#dc2626" },
// });


// screens/CreateItineraryScreen.js

// screens/CreateItineraryScreen.js
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  BackHandler,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ========= Backend Config ========= */
import getBaseURL from "../../config/env";
const API_BASE = getBaseURL().replace(/\/+$/, "");

const TOKEN_KEYS = ["token", "auth_token", "jwt", "access_token", "AUTH_TOKEN", "userToken"];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

const IS_WEB = Platform.OS === "web";

/* ========= Inline Cities → Destinations JSON (your data) ========= */
const PLACES_BY_CITY = {
  Abbottabad: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
  Galiyat: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
  Bagh: ["Ganga Choti", "Lasdana"],
  Badin: ["Zero Point (Indo-Pak Border)"],
  Chitral: [
    "Chitral Valley",
    "Garam Chashma (Hot Springs)",
    "Kalash Valley (Bumburet, Rumbur, Birir)",
    "Shandur Pass (Roof of the World)",
    "Tirich Mir Peak (Hindu Kush)",
  ],
  Dir: ["Jahaz Banda Meadows", "Katora Lake", "Kumrat Valley", "Thall (gateway to Kumrat)"],
  Kumrat: ["Jahaz Banda Meadows", "Katora Lake", "Kumrat Valley", "Thall (gateway to Kumrat)"],
  Gilgit: [
    "Bagrot Valley",
    "Bireno Suspension Bridge",
    "Chinese Cemetery (Danyore Valley)",
    "Firoza Lake",
    "Junction of Three Mountain Ranges",
    "Kargah Valley / Kargah Buddha site",
    "Kutwal Lake",
    "Naltar Valley",
    "SatRangi Lake",
    "Taj Mughal Minar (Mughali Shikar)",
  ],
  Haveli: ["Khai Gala", "Neza Gali"],
  "Hunza Valley": ["Altit Fort", "Attabad Lake", "Baltit Fort", "Hussaini Suspension Bridge", "Khunjerab Pass", "Passu Cones & Glacier", "Borith Lake"],
  Islamabad: [
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
    "Trail 3, Trail 5, Trail 6 (Margalla)",
  ],
  Karachi: [
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
    "Turtle Beach",
  ],
  Kotli: ["Kotli Waterfalls", "Teenda"],
  Lahore: [
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
    "Wazir Khan Mosque",
  ],
  Multan: [
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
    "Tomb of Mai Maharban",
  ],
  Muzaffarabad: ["Pir Chinasi", "Shaheed Gali", "Subri Lake"],
  "Nagar Valley": ["Nagar Valley"],
  Nagarparkar: ["Jain Temples Nagarparkar", "Karoonjhar Mountains"],
  "Naran & Kaghan": ["Ansoo Lake", "Babusar Top", "Dudipatsar Lake", "Kaghan", "Lulusar Lake", "Naran", "Saif-ul-Malook Lake"],
  "Neelum Valley": ["Arang Kel", "Kel", "Keran", "Sharda"],
  Rawalakot: ["Banjosa Lake", "Rawalakot Valley", "Toli Pir"],
  Skardu: ["Manthokha Waterfall", "Katpana Tso (Katpana Desert & Lake)", "Satpara Tso Lake", "Shangrila Resort / Lower Kachura Lake", "Skardu Valley"],
  "Swat Valley": ["Bahrain", "Gabral Valley", "Kalam Valley", "Madyan", "Mahodand Lake", "Malam Jabba (ski resort)", "Ushu Forest"],
  Murree: [
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
    "Holy Trinity Church (Mall Road)",
  ],
};

const CITY_OPTIONS = Object.keys(PLACES_BY_CITY).sort();
const BUDGET_OPTIONS = ["Budget-friendly", "Mid-range", "Luxury"];
const STYLE_OPTIONS = ["Adventure", "Cultural", "Comfort"];

const PRIMARY = "#003366";
const BORDER = "#E6EDF7";
const SUBTEXT = "#6B7280";

/* ===== tiny helpers ===== */
const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const toDate = (s) => {
  const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
};
const showMsg = (title, msg) => {
  if (IS_WEB) {
    alert(`${title ? title + ": " : ""}${msg}`);
  } else {
    Alert.alert(title || "Notice", msg);
  }
};

/* ===== Cross-platform DateField ===== */
const DateField = ({ label, value, onChange, error }) => {
  if (IS_WEB) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.smallLabel}>{label}</Text>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.webDateInput, borderColor: error ? "#dc2626" : BORDER }}
        />
        {error ? <Text style={styles.errText}>{error}</Text> : null}
      </View>
    );
  }
  const [show, setShow] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.smallLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.dateBtn, error && styles.errBorder]}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar-outline" size={18} color="#0f172a" />
        <Text style={{ marginLeft: 8 }}>{value || "YYYY-MM-DD"}</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errText}>{error}</Text> : null}
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="calendar"
          onChange={(event, d) => {
            setShow(false);
            if (event?.type === "dismissed") return;
            if (d) {
              const iso = d.toISOString().split("T")[0];
              onChange(iso);
            }
          }}
        />
      )}
    </View>
  );
};

export default function CreateItineraryScreen({ onBack }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const goBack = () => {
    if (typeof onBack === "function") onBack();
    else if (navigation?.canGoBack()) navigation.goBack();
  };

  // Android HW back
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, []);

  const scrollRef = useRef(null);

  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [stylePref, setStylePref] = useState("");
  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");
  const [days, setDays] = useState([{ place: "", startTime: "", endTime: "", activities: "" }]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

  const addDay = () => setDays((p) => [...p, { place: "", startTime: "", endTime: "", activities: "" }]);
  const removeDay = (idx) => setDays((p) => p.filter((_, i) => i !== idx));
  const updateDay = (idx, patch) =>
    setDays((p) => {
      const next = [...p];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });

  const pickCover = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showMsg("Permission needed", "Please allow photo library access.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled) setCover(res.assets?.[0] || null);
  };

  const validate = () => {
    const e = {};
    if (!cover) e.cover = "Please add a cover picture";
    if (title.trim().length < 3) e.title = "Min 3 characters";
    if (desc.trim().length < 10) e.desc = "Min 10 characters";
    if (!city) e.city = "Select a city";
    if (!budget) e.budget = "Select a budget";
    if (!stylePref) e.stylePref = "Select a travel style";
    if (!startDateText.trim()) e.startDateText = "Pick a start date";
    if (!endDateText.trim()) e.endDateText = "Pick an end date";

    if (startDateText && endDateText && looksISODate(startDateText) && looksISODate(endDateText)) {
      const sd = toDate(startDateText);
      const ed = toDate(endDateText);
      if (ed < sd) e.endDateText = "End date must be after start date";
    }

    if (days.length === 0) e.days = "Add at least one day";
    days.forEach((d, i) => {
      if (!d.place) e[`day${i}.place`] = "Choose a place";
      else if (!cityPlaces.includes(d.place)) e[`day${i}.place`] = `Must be in ${city}`;
      if ((d.activities || "").trim().length < 5) e[`day${i}.activities`] = "Add a short note";
    });

    setErrors(e);
    return e;
  };

  const canSubmit =
    cover &&
    title.trim().length >= 3 &&
    desc.trim().length >= 10 &&
    city &&
    budget &&
    stylePref &&
    startDateText.trim() &&
    endDateText.trim() &&
    days.length > 0 &&
    days.every((d) => d.place && (d.activities || "").trim().length >= 5);

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      showMsg("Fix form", "Please fix the highlighted fields.");
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      showMsg("Not logged in", "Please log in again to submit an itinerary.");
      return;
    }

    const payload = {
      title,
      description: desc,
      city,
      budget,
      style: stylePref,
      start_date: startDateText,
      end_date: endDateText,
      cover_url: cover?.uri || "",
      days: days.map((d, idx) => ({
        day_number: idx + 1,
        place: d.place,
        start_time: d.startTime || "",
        end_time: d.endTime || "",
        activities: d.activities || "",
      })),
    };

    try {
      setSubmitting(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const url = `${API_BASE}/itineraries`;
      let res;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const raw = await res.text();
      let j = null;
      try {
        j = raw ? JSON.parse(raw) : null;
      } catch {}

      if (res.status === 401) {
        showMsg("Session expired", "Please log in again.");
        return;
      }
      if (res.status === 428) {
        showMsg("Complete Profile", j?.error || "Please complete your profile to continue.");
        return;
      }
      if (!res.ok) {
        const friendly = {
          400: "Invalid data. Please review the fields.",
          403: "You don't have permission to do that.",
          404: "Endpoint not found. Check API path (/itineraries).",
          413: "Image too large. Try a smaller cover image.",
          415: "Unsupported data type.",
          500: "Server error. Please try again.",
          502: "Bad gateway.",
          503: "Server unavailable.",
          504: "Server timed out.",
        };
        const msg = j?.error || friendly[res.status] || `Failed to save itinerary (HTTP ${res.status})`;
        showMsg("Error", msg);
        return;
      }

      // Success → modal (works on mobile & web)
      setShowSuccess(true);
    } catch (err) {
      const aborted = err?.name === "AbortError";
      const msg = aborted
        ? "Request timed out. Check your connection or API base URL."
        : "Unable to reach the server. Check your connection or API base URL.";
      console.log("Create itinerary network error:", err);
      showMsg("Network Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onCloseSuccess = () => {
    setShowSuccess(false);
    setTitle("");
    setDesc("");
    setCity("");
    setBudget("");
    setStylePref("");
    setStartDateText("");
    setEndDateText("");
    setCover(null);
    setDays([{ place: "", startTime: "", endTime: "", activities: "" }]);
    goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: IS_WEB ? 0 : insets.top }]}>
      {/* Header (safe-area helpful on mobile; harmless on web) */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={goBack} style={styles.backPill} accessibilityLabel="Back to Itineraries">
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backPillText}>Back to Itineraries</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.wrap}
        contentContainerStyle={{ paddingBottom: IS_WEB ? 36 : 120 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.h1}>Create Itinerary</Text>

        {/* ------- Card: Basics ------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basics</Text>

          {/* Cover */}
          <Text style={styles.label}>Cover Image</Text>
          <View style={[styles.coverBox, errors.cover && styles.errBorder]}>
            {cover?.uri ? (
              <Image source={{ uri: cover.uri }} style={styles.coverImg} />
            ) : (
              <Text style={{ color: SUBTEXT }}>Tap “Pick Cover” to add a photo</Text>
            )}
            <TouchableOpacity style={styles.coverBtn} onPress={pickCover} accessibilityLabel="Pick cover image">
              <Ionicons name="images-outline" size={16} color="#fff" />
              <Text style={styles.coverBtnText}>Pick Cover</Text>
            </TouchableOpacity>
          </View>
          {errors.cover && <Text style={styles.errText}>{errors.cover}</Text>}

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, errors.title && styles.errBorder]}
            placeholder="e.g., 3 Days in Hunza"
            value={title}
            onChangeText={setTitle}
          />
          {errors.title && <Text style={styles.errText}>{errors.title}</Text>}

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline, errors.desc && styles.errBorder]}
            placeholder="Short overview of your trip…"
            value={desc}
            onChangeText={setDesc}
            multiline
          />
          {errors.desc && <Text style={styles.errText}>{errors.desc}</Text>}

          {/* City */}
          <Text style={styles.label}>City</Text>
          <View style={[styles.pickerBox, errors.city && styles.errBorder]}>
            <Picker
              style={styles.picker}
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
          {errors.city && <Text style={styles.errText}>{errors.city}</Text>}

          {/* Budget */}
          <Text style={styles.label}>Budget</Text>
          <View style={styles.row}>
            {BUDGET_OPTIONS.map((b) => (
              <TouchableOpacity
                key={b}
                style={[styles.chip, budget === b && styles.chipActive]}
                onPress={() => setBudget(b)}
                accessibilityLabel={`Budget ${b}`}
              >
                <Text style={[styles.chipText, budget === b && styles.chipTextActive]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.budget && <Text style={styles.errText}>{errors.budget}</Text>}

          {/* Style */}
          <Text style={styles.label}>Travel Style</Text>
          <View style={styles.row}>
            {STYLE_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, stylePref === s && styles.chipActive]}
                onPress={() => setStylePref(s)}
                accessibilityLabel={`Travel style ${s}`}
              >
                <Text style={[styles.chipText, stylePref === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.stylePref && <Text style={styles.errText}>{errors.stylePref}</Text>}

          {/* Dates */}
          <View style={styles.dateRow}>
            <DateField label="Start Date" value={startDateText} onChange={setStartDateText} error={errors.startDateText} />
            <DateField label="End Date" value={endDateText} onChange={setEndDateText} error={errors.endDateText} />
          </View>
        </View>

        {/* ------- Card: Days ------- */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.sectionTitle}>Days</Text>
            <TouchableOpacity style={styles.addBtn} onPress={addDay} accessibilityLabel="Add day">
              <Text style={styles.addBtnText}>+ Add another day</Text>
            </TouchableOpacity>
          </View>
          {errors.days && <Text style={[styles.errText, { marginBottom: 8 }]}>{errors.days}</Text>}

          {days.map((d, idx) => {
            const errPlace = errors[`day${idx}.place`];
            const errAct = errors[`day${idx}.activities`];
            const placeDisabled = !city;
            return (
              <View key={idx} style={styles.dayCard}>
                <View style={styles.dayHead}>
                  <Text style={styles.dayTitle}>Day {idx + 1}</Text>
                  {days.length > 1 && (
                    <TouchableOpacity onPress={() => removeDay(idx)} accessibilityLabel="Remove day">
                      <Ionicons name="trash-outline" size={18} color="#dc2626" />
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.smallLabel}>Place (in {city || "…"})</Text>
                <View style={[styles.pickerBox, errPlace && styles.errBorder, placeDisabled && { opacity: 0.6 }]} pointerEvents={placeDisabled ? "none" : "auto"}>
                  <Picker style={styles.picker} selectedValue={d.place} onValueChange={(v) => updateDay(idx, { place: v })}>
                    <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
                    {cityPlaces.map((p) => (
                      <Picker.Item key={p} label={p} value={p} />
                    ))}
                  </Picker>
                </View>
                {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

                <Text style={styles.smallLabel}>Start Time (optional)</Text>
                <TextInput style={styles.input} placeholder="e.g., 9am or 09:00" value={d.startTime} onChangeText={(t) => updateDay(idx, { startTime: t })} />
                <Text style={styles.smallLabel}>End Time (optional)</Text>
                <TextInput style={styles.input} placeholder="e.g., evening or 17:00" value={d.endTime} onChangeText={(t) => updateDay(idx, { endTime: t })} />

                <Text style={styles.smallLabel}>Activities / Notes</Text>
                <TextInput
                  style={[styles.input, styles.multiline, errAct && styles.errBorder]}
                  placeholder="Short plan for the day…"
                  value={d.activities}
                  onChangeText={(v) => updateDay(idx, { activities: v })}
                  multiline
                />
                {errAct && <Text style={styles.errText}>{errAct}</Text>}
              </View>
            );
          })}
        </View>

        {/* Submit (WEB ONLY — inline, like before) */}
        {IS_WEB && (
          <TouchableOpacity
            style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
            onPress={submit}
            disabled={!canSubmit || submitting}
            accessibilityLabel="Submit itinerary"
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="airplane-outline" size={18} color="#fff" />
                <Text style={styles.submitText}>Submit Itinerary</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Floating footer submit (NATIVE ONLY) */}
      {!IS_WEB && (
        <View style={[styles.footer, { paddingBottom: 12 + insets.bottom }]}>
          <TouchableOpacity
            style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
            onPress={submit}
            disabled={!canSubmit || submitting}
            accessibilityLabel="Submit itinerary"
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="airplane-outline" size={18} color="#fff" />
                <Text style={styles.submitText}>Submit Itinerary</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Success modal */}
      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={onCloseSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Itinerary Created</Text>
            <Text style={styles.modalText}>Your itinerary was saved successfully.</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={onCloseSuccess}>
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ========= Styles ========= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f9fc" },

  headerBar: { paddingHorizontal: 12, paddingBottom: 8, backgroundColor: "#f7f9fc" },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backPillText: { fontWeight: "800", color: "#0f172a" },

  wrap: { flex: 1, backgroundColor: "#f7f9fc", padding: 14 },
  h1: { fontSize: 22, fontWeight: "800", color: PRIMARY, marginBottom: 10 },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

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
    backgroundColor: "#fff",
    height: 48,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    height: 48,
    width: "100%",
    fontSize: 16,
    color: "#0f172a",
    paddingHorizontal: 10,
    ...(IS_WEB ? { outlineStyle: "none" } : null),
  },

  dateRow: { flexDirection: "row", gap: 10, marginTop: 8 },

  webDateInput: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: BORDER,
    borderRadius: 10,
    paddingLeft: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    outline: "none",
    marginBottom: 6,
  },

  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 6,
  },

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

  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: BORDER, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff" },
  chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontWeight: "700", color: PRIMARY },
  chipTextActive: { color: "#fff", fontWeight: "800" },

  addBtn: { borderWidth: 1, borderColor: PRIMARY, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
  addBtnText: { color: PRIMARY, fontWeight: "800" },

  // Footer submit (native only)
  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: "transparent",
  },
  submit: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  errText: { color: "#dc2626", marginBottom: 8 },
  errBorder: { borderColor: "#dc2626" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 6, textAlign: "center" },
  modalText: { color: "#374151", textAlign: "center", marginBottom: 16 },
  modalBtn: {
    backgroundColor: "#0f172a",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  modalBtnText: { color: "#fff", fontWeight: "800" },
});
