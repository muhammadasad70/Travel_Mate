// // screens/CrowdsourceItineraries/EditItineraryScreen.js
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Image,
//   ActivityIndicator,
//   BackHandler,
//   Modal,
//   Alert,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { useNavigation, useRoute } from "@react-navigation/native";
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

// const IS_WEB = Platform.OS === "web";

// /* ========= Cities → Destinations ========= */
// const PLACES_BY_CITY = {
//   Abbottabad: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
//   Galiyat: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
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
//   "Hunza Valley": ["Altit Fort", "Attabad Lake", "Baltit Fort", "Hussaini Suspension Bridge", "Khunjerab Pass", "Passu Cones & Glacier", "Borith Lake"],
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
//   "Naran & Kaghan": ["Ansoo Lake", "Babusar Top", "Dudipatsar Lake", "Kaghan", "Lulusar Lake", "Naran", "Saif-ul-Malook Lake"],
//   "Neelum Valley": ["Arang Kel", "Kel", "Keran", "Sharda"],
//   Rawalakot: ["Banjosa Lake", "Rawalakot Valley", "Toli Pir"],
//   Skardu: ["Manthokha Waterfall", "Katpana Tso (Katpana Desert & Lake)", "Satpara Tso Lake", "Shangrila Resort / Lower Kachura Lake", "Skardu Valley"],
//   "Swat Valley": ["Bahrain", "Gabral Valley", "Kalam Valley", "Madyan", "Mahodand Lake", "Malam Jabba (ski resort)", "Ushu Forest"],
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

// /* ===== helpers ===== */
// const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
// const toDate = (s) => {
//   const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
//   return new Date(y, m - 1, d);
// };
// const showMsg = (title, msg) => {
//   if (IS_WEB) {
//     alert(`${title ? title + ": " : ""}${msg}`);
//   } else {
//     Alert.alert(title || "Notice", msg);
//   }
// };

// /* ===== DateField ===== */
// const DateField = ({ label, value, onChange, error }) => {
//   if (IS_WEB) {
//     return (
//       <View style={{ flex: 1 }}>
//         <Text style={styles.smallLabel}>{label}</Text>
//         {/* eslint-disable-next-line react/no-unknown-property */}
//         <input
//           type="date"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ ...styles.webDateInput, borderColor: error ? "#dc2626" : BORDER }}
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

// export default function EditItineraryScreen({ onBack }) {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();
//   const scrollRef = useRef(null);

//   // 🔹 EXACT same back logic as Create screen
//   const goBack = () => {
//     if (typeof onBack === "function") onBack();
//     else if (navigation?.canGoBack()) navigation.goBack();
//   };

//   // Android HW back (same as Create)
//   useEffect(() => {
//     const sub = BackHandler.addEventListener("hardwareBackPress", () => {
//       goBack();
//       return true;
//     });
//     return () => sub.remove();
//   }, []);

//   // prefill from params
//   const initial = route.params?.itinerary || {};
//   const itineraryId = route.params?.id ?? initial?.id ?? initial?._id;

//   const [cover, setCover] = useState(initial?.cover_url ? { uri: initial.cover_url } : null);
//   const [title, setTitle] = useState(initial?.title || "");
//   const [desc, setDesc] = useState(initial?.description || "");
//   const [city, setCity] = useState(initial?.city || "");
//   const [budget, setBudget] = useState(initial?.budget || "");
//   const [stylePref, setStylePref] = useState(initial?.style || "");
//   const [startDateText, setStartDateText] = useState(
//     initial?.start_date ? String(initial.start_date).slice(0, 10) : ""
//   );
//   const [endDateText, setEndDateText] = useState(
//     initial?.end_date ? String(initial.end_date).slice(0, 10) : ""
//   );
//   const [days, setDays] = useState(() => {
//     const src = Array.isArray(initial?.days) ? initial.days : [];
//     if (!src.length) return [{ place: "", startTime: "", endTime: "", activities: "" }];
//     return src.map((d, i) => ({
//       place: d.place || "",
//       startTime: d.start_time || "",
//       endTime: d.end_time || "",
//       activities: d.activities || "",
//       day_number: d.day_number || i + 1,
//     }));
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

//   const addDay = () => setDays((p) => [...p, { place: "", startTime: "", endTime: "", activities: "" }]);
//   const removeDay = (idx) => setDays((p) => p.filter((_, i) => i !== idx));
//   const updateDay = (idx, patch) =>
//     setDays((p) => {
//       const next = [...p];
//       next[idx] = { ...next[idx], ...patch };
//       return next;
//     });

//   const pickCover = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       showMsg("Permission needed", "Please allow photo library access.");
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
//     // In edit, cover optional; keep validation same as create if you want strictness:
//     if (!cover && !initial?.cover_url) e.cover = "Please add a cover picture";
//     if (title.trim().length < 3) e.title = "Min 3 characters";
//     if (desc.trim().length < 10) e.desc = "Min 10 characters";
//     if (!city) e.city = "Select a city";
//     if (!budget) e.budget = "Select a budget";
//     if (!stylePref) e.stylePref = "Select a travel style";
//     if (!startDateText.trim()) e.startDateText = "Pick a start date";
//     if (!endDateText.trim()) e.endDateText = "Pick an end date";

//     if (startDateText && endDateText && looksISODate(startDateText) && looksISODate(endDateText)) {
//       const sd = toDate(startDateText);
//       const ed = toDate(endDateText);
//       if (ed < sd) e.endDateText = "End date must be after start date";
//     }

//     if (days.length === 0) e.days = "Add at least one day";
//     days.forEach((d, i) => {
//       if (!d.place) e[`day${i}.place`] = "Choose a place";
//       else if (!cityPlaces.includes(d.place)) e[`day${i}.place`] = `Must be in ${city}`;
//       if ((d.activities || "").trim().length < 5) e[`day${i}.activities`] = "Add a short note";
//     });

//     setErrors(e);
//     return e;
//   };

//   const canSubmit =
//     (cover || initial?.cover_url) &&
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
//       showMsg("Fix form", "Please fix the highlighted fields.");
//       return;
//     }
//     if (!itineraryId) {
//       showMsg("Error", "Missing itinerary ID.");
//       return;
//     }

//     const token = await getAuthToken();
//     if (!token) {
//       showMsg("Not logged in", "Please log in again to update your itinerary.");
//       return;
//     }

//     const payload = {
//       title,
//       description: desc,
//       city,
//       budget,
//       style: stylePref,
//       start_date: startDateText,
//       end_date: endDateText,
//       cover_url: cover?.uri || initial?.cover_url || "",
//       days: days.map((d, idx) => ({
//         day_number: d.day_number || idx + 1,
//         place: d.place,
//         start_time: d.startTime || "",
//         end_time: d.endTime || "",
//         activities: d.activities || "",
//       })),
//     };

//     try {
//       setSubmitting(true);

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 20000);

//       const url = `${API_BASE}/itineraries/${itineraryId}`;
//       let res;
//       try {
//         res = await fetch(url, {
//           method: "PUT", // or "PATCH" if your backend expects it
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

//       const raw = await res.text();
//       let j = null;
//       try {
//         j = raw ? JSON.parse(raw) : null;
//       } catch {}

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", j?.error || "Please complete your profile to continue.");
//         return;
//       }
//       if (!res.ok) {
//         const friendly = {
//           400: "Invalid data. Please review the fields.",
//           403: "You don't have permission to do that.",
//           404: "Itinerary not found.",
//           413: "Image too large. Try a smaller cover image.",
//           415: "Unsupported data type.",
//           500: "Server error. Please try again.",
//           502: "Bad gateway.",
//           503: "Server unavailable.",
//           504: "Server timed out.",
//         };
//         const msg = j?.error || friendly[res.status] || `Failed to update itinerary (HTTP ${res.status})`;
//         showMsg("Error", msg);
//         return;
//       }

//       setShowSuccess(true);
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted
//         ? "Request timed out. Check your connection or API base URL."
//         : "Unable to reach the server. Check your connection or API base URL.";
//       console.log("Update itinerary network error:", err);
//       showMsg("Network Error", msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const onCloseSuccess = () => {
//     setShowSuccess(false);
//     // EXACTLY like Create: just goBack()
//     goBack();
//   };

//   return (
//     <SafeAreaView style={[styles.safe, { paddingTop: IS_WEB ? 0 : insets.top }]}>
//       {/* Header — same as Create */}
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={goBack} style={styles.backPill} accessibilityLabel="Back to Itineraries">
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backPillText}>Back to Itineraries</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         ref={scrollRef}
//         style={styles.wrap}
//         contentContainerStyle={{ paddingBottom: IS_WEB ? 36 : 120 + insets.bottom }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.h1}>Edit Itinerary</Text>

//         {/* ------- Card: Basics ------- */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Basics</Text>

//           {/* Cover */}
//           <Text style={styles.label}>Cover Image</Text>
//           <View style={[styles.coverBox, errors.cover && styles.errBorder]}>
//             {cover?.uri ? (
//               <Image source={{ uri: cover.uri }} style={styles.coverImg} />
//             ) : initial?.cover_url ? (
//               <Image source={{ uri: initial.cover_url }} style={styles.coverImg} />
//             ) : (
//               <Text style={{ color: SUBTEXT }}>Tap “Pick Cover” to add a photo</Text>
//             )}
//             <TouchableOpacity style={styles.coverBtn} onPress={pickCover} accessibilityLabel="Pick cover image">
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

//           {/* Dates */}
//           <View style={styles.dateRow}>
//             <DateField label="Start Date" value={startDateText} onChange={setStartDateText} error={errors.startDateText} />
//             <DateField label="End Date" value={endDateText} onChange={setEndDateText} error={errors.endDateText} />
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

//                 <Text style={styles.smallLabel}>Place (in {city || "…"})</Text>
//                 <View style={[styles.pickerBox, errPlace && styles.errBorder, placeDisabled && { opacity: 0.6 }]} pointerEvents={placeDisabled ? "none" : "auto"}>
//                   <Picker style={styles.picker} selectedValue={d.place} onValueChange={(v) => updateDay(idx, { place: v })}>
//                     <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
//                     {cityPlaces.map((p) => (
//                       <Picker.Item key={p} label={p} value={p} />
//                     ))}
//                   </Picker>
//                 </View>
//                 {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

//                 <Text style={styles.smallLabel}>Start Time (optional)</Text>
//                 <TextInput style={styles.input} placeholder="e.g., 9am or 09:00" value={d.startTime} onChangeText={(t) => updateDay(idx, { startTime: t })} />
//                 <Text style={styles.smallLabel}>End Time (optional)</Text>
//                 <TextInput style={styles.input} placeholder="e.g., evening or 17:00" value={d.endTime} onChangeText={(t) => updateDay(idx, { endTime: t })} />

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

//         {/* Submit (WEB ONLY) */}
//         {IS_WEB && (
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </ScrollView>

//       {/* Floating footer submit (NATIVE ONLY) */}
//       {!IS_WEB && (
//         <View style={[styles.footer, { paddingBottom: 12 + insets.bottom }]}>
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Success modal */}
//       <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={onCloseSuccess}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <View style={styles.modalIconCircle}>
//               <Ionicons name="checkmark" size={36} color="#fff" />
//             </View>
//             <Text style={styles.modalTitle}>Itinerary Updated</Text>
//             <Text style={styles.modalText}>Your changes were saved successfully.</Text>
//             <TouchableOpacity style={styles.modalBtn} onPress={onCloseSuccess}>
//               <Text style={styles.modalBtnText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ========= Styles ========= */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#f7f9fc" },

//   headerBar: { paddingHorizontal: 12, paddingBottom: 8, backgroundColor: "#f7f9fc" },
//   backPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     alignSelf: "flex-start",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: BORDER,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   backPillText: { fontWeight: "800", color: "#0f172a" },

//   wrap: { flex: 1, backgroundColor: "#f7f9fc", padding: 14 },
//   h1: { fontSize: 22, fontWeight: "800", color: PRIMARY, marginBottom: 10 },

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
//   cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

//   label: { fontWeight: "700", color: "#0f172a", marginBottom: 6, marginTop: 6 },
//   smallLabel: { fontWeight: "600", color: "#0f172a", marginBottom: 6, marginTop: 6 },

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
//     ...(IS_WEB ? { outlineStyle: "none" } : null),
//   },

//   dateRow: { flexDirection: "row", gap: 10, marginTop: 8 },

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

//   dayCard: {
//     borderWidth: 1,
//     borderColor: "#e9eef7",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
//   dayTitle: { fontWeight: "800", color: "#0f172a" },

//   row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
//   chip: { borderWidth: 1, borderColor: BORDER, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff" },
//   chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
//   chipText: { fontWeight: "700", color: PRIMARY },
//   chipTextActive: { color: "#fff", fontWeight: "800" },

//   addBtn: { borderWidth: 1, borderColor: PRIMARY, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
//   addBtnText: { color: PRIMARY, fontWeight: "800" },

//   // Footer submit (native only)
//   footer: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 0,
//     backgroundColor: "transparent",
//   },
//   submit: {
//     backgroundColor: "#0ea5e9",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//   },
//   submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   errText: { color: "#dc2626", marginBottom: 8 },
//   errBorder: { borderColor: "#dc2626" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   modalCard: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     alignItems: "center",
//   },
//   modalIconCircle: {
//     width: 64,
//     height: 64,
//     borderRadius: 999,
//     backgroundColor: "#16a34a",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 6, textAlign: "center" },
//   modalText: { color: "#374151", textAlign: "center", marginBottom: 16 },
//   modalBtn: { backgroundColor: "#0f172a", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
//   modalBtnText: { color: "#fff", fontWeight: "800" },
// });

// screens/CrowdsourceItineraries/EditItineraryScreen.js
// /


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Image,
//   ActivityIndicator,
//   BackHandler,
//   Modal,
//   Alert,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { useNavigation, useRoute } from "@react-navigation/native";
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

// const IS_WEB = Platform.OS === "web";

// /* ========= Cities → Destinations ========= */
// const PLACES_BY_CITY = {
//   Abbottabad: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
//   Galiyat: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
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
//   "Hunza Valley": ["Altit Fort", "Attabad Lake", "Baltit Fort", "Hussaini Suspension Bridge", "Khunjerab Pass", "Passu Cones & Glacier", "Borith Lake"],
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
//   "Naran & Kaghan": ["Ansoo Lake", "Babusar Top", "Dudipatsar Lake", "Kaghan", "Lulusar Lake", "Naran", "Saif-ul-Malook Lake"],
//   "Neelum Valley": ["Arang Kel", "Kel", "Keran", "Sharda"],
//   Rawalakot: ["Banjosa Lake", "Rawalakot Valley", "Toli Pir"],
//   Skardu: ["Manthokha Waterfall", "Katpana Tso (Katpana Desert & Lake)", "Satpara Tso Lake", "Shangrila Resort / Lower Kachura Lake", "Skardu Valley"],
//   "Swat Valley": ["Bahrain", "Gabral Valley", "Kalam Valley", "Madyan", "Mahodand Lake", "Malam Jabba (ski resort)", "Ushu Forest"],
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

// /* ===== helpers ===== */
// const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
// const toDate = (s) => {
//   const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
//   return new Date(y, m - 1, d);
// };
// // Format a JS Date as YYYY-MM-DD in the user's local timezone (no UTC shift)
// const fmtLocalYMD = (d) => {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// const showMsg = (title, msg) => {
//   if (IS_WEB) {
//     alert(`${title ? title + ": " : ""}${msg}`);
//   } else {
//     Alert.alert(title || "Notice", msg);
//   }
// };

// /* ===== DateField ===== */
// const DateField = ({ label, value, onChange, error }) => {
//   if (IS_WEB) {
//     return (
//       <View style={{ flex: 1 }}>
//         <Text style={styles.smallLabel}>{label}</Text>
//         {/* eslint-disable-next-line react/no-unknown-property */}
//         <input
//           type="date"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ ...styles.webDateInput, borderColor: error ? "#dc2626" : BORDER }}
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
//               onChange(fmtLocalYMD(d));
//             }
//           }}
//         />
//       )}
//     </View>
//   );
// };

// export default function EditItineraryScreen({ onBack }) {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();
//   const scrollRef = useRef(null);

//   // 🔹 EXACT same back logic as Create screen
//   const goBack = () => {
//     if (typeof onBack === "function") onBack();
//     else if (navigation?.canGoBack()) navigation.goBack();
//   };

//   // Android HW back (same as Create)
//   useEffect(() => {
//     const sub = BackHandler.addEventListener("hardwareBackPress", () => {
//       goBack();
//       return true;
//     });
//     return () => sub.remove();
//   }, []);

//   // prefill from params
//   const initial = route.params?.itinerary || {};
//   const itineraryId = route.params?.id ?? initial?.id ?? initial?._id;

//   const [cover, setCover] = useState(initial?.cover_url ? { uri: initial.cover_url } : null);
//   const [title, setTitle] = useState(initial?.title || "");
//   const [desc, setDesc] = useState(initial?.description || "");
//   const [city, setCity] = useState(initial?.city || "");
//   const [budget, setBudget] = useState(initial?.budget || "");
//   const [stylePref, setStylePref] = useState(initial?.style || "");
//   const [startDateText, setStartDateText] = useState(
//     initial?.start_date ? String(initial.start_date).slice(0, 10) : ""
//   );
//   const [endDateText, setEndDateText] = useState(
//     initial?.end_date ? String(initial.end_date).slice(0, 10) : ""
//   );
//   const [days, setDays] = useState(() => {
//     const src = Array.isArray(initial?.days) ? initial.days : [];
//     if (!src.length) return [{ place: "", startTime: "", endTime: "", activities: "" }];
//     return src.map((d, i) => ({
//       place: d.place || "",
//       startTime: d.start_time || "",
//       endTime: d.end_time || "",
//       activities: d.activities || "",
//       day_number: d.day_number || i + 1,
//     }));
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

//   const addDay = () => setDays((p) => [...p, { place: "", startTime: "", endTime: "", activities: "" }]);
//   const removeDay = (idx) => setDays((p) => p.filter((_, i) => i !== idx));
//   const updateDay = (idx, patch) =>
//     setDays((p) => {
//       const next = [...p];
//       next[idx] = { ...next[idx], ...patch };
//       return next;
//     });

//   const pickCover = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       showMsg("Permission needed", "Please allow photo library access.");
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
//     // In edit, cover optional; keep validation same as create if you want strictness:
//     if (!cover && !initial?.cover_url) e.cover = "Please add a cover picture";
//     if (title.trim().length < 3) e.title = "Min 3 characters";
//     if (desc.trim().length < 10) e.desc = "Min 10 characters";
//     if (!city) e.city = "Select a city";
//     if (!budget) e.budget = "Select a budget";
//     if (!stylePref) e.stylePref = "Select a travel style";
//     if (!startDateText.trim()) e.startDateText = "Pick a start date";
//     if (!endDateText.trim()) e.endDateText = "Pick an end date";

//     if (startDateText && endDateText && looksISODate(startDateText) && looksISODate(endDateText)) {
//       const sd = toDate(startDateText);
//       const ed = toDate(endDateText);
//       if (ed < sd) e.endDateText = "End date must be after start date";
//     }

//     if (days.length === 0) e.days = "Add at least one day";
//     days.forEach((d, i) => {
//       if (!d.place) e[`day${i}.place`] = "Choose a place";
//       else if (!cityPlaces.includes(d.place)) e[`day${i}.place`] = `Must be in ${city}`;
//       if ((d.activities || "").trim().length < 5) e[`day${i}.activities`] = "Add a short note";
//     });

//     setErrors(e);
//     return e;
//   };

//   const canSubmit =
//     (cover || initial?.cover_url) &&
//     title.trim().length >= 3 &&
//     desc.trim().length >= 10 &&
//     city &&
//     budget &&
//     stylePref &&
//     startDateText.trim() &&
//     endDateText.trim() &&
//     days.length > 0 &&
//     days.every((d) => d.place && (d.activities || "").trim().length >= 5);

//   // ======= NEW: helper to upload cover to /asset/:user_id and return Cloudinary URL =======
//   const getUserIdForUpload = async () => {
//     // Try common keys where user info might be stored
//     const candidateKeys = ["user_id", "userId", "id", "USER_ID", "currentUser", "user", "profile"];
//     for (const k of candidateKeys) {
//       const val = await AsyncStorage.getItem(k);
//       if (!val) continue;
//       // Sometimes it's a plain id string, sometimes a JSON object
//       try {
//         const maybeObj = JSON.parse(val);
//         if (maybeObj && typeof maybeObj === "object") {
//           if (typeof maybeObj.user_id === "number" || typeof maybeObj.user_id === "string") return String(maybeObj.user_id);
//           if (typeof maybeObj.id === "number" || typeof maybeObj.id === "string") return String(maybeObj.id);
//           if (typeof maybeObj.userId === "number" || typeof maybeObj.userId === "string") return String(maybeObj.userId);
//         } else if (String(val).trim()) {
//           return String(val).trim();
//         }
//       } catch {
//         if (String(val).trim()) return String(val).trim();
//       }
//     }
//     return null;
//   };

//   const uploadCoverIfNeeded = async (token) => {
//     // If no local image picked or it's already an http(s) URL, just keep existing
//     if (!cover?.uri || /^https?:\/\//i.test(cover.uri)) {
//       return initial?.cover_url || "";
//     }

//     // We have a local asset (e.g., file://...). Upload it.
//     const userId = await getUserIdForUpload();
//     if (!userId) {
//       showMsg("Not logged in", "Cannot find your user ID. Please log in again.");
//       return null;
//     }

//     const endpoint = `${API_BASE}/asset/${encodeURIComponent(userId)}`;

//     // Build multipart form data
//     const form = new FormData();
//     // Best-effort filename and mimetype
//     const name =
//       cover.fileName ||
//       cover.filename ||
//       `cover_${Date.now()}.jpg`;
//     const type =
//       cover.mimeType ||
//       cover.type ||
//       "image/jpeg";

//     form.append("asset", {
//       uri: cover.uri,
//       name,
//       type,
//     });

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 25000);

//     try {
//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // NOTE: Do NOT set Content-Type here; let fetch set proper multipart boundary
//         },
//         body: form,
//         signal: controller.signal,
//       });

//       const text = await res.text();
//       let json = null;
//       try {
//         json = text ? JSON.parse(text) : null;
//       } catch {
//         // ignore parse error; will fall back to generic msg
//       }

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return null;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", json?.error || "Please complete your profile to continue.");
//         return null;
//       }
//       if (!res.ok) {
//         const msg =
//           (json && (json.error || json.message)) ||
//           `Failed to upload image (HTTP ${res.status})`;
//         showMsg("Upload Error", msg);
//         return null;
//       }

//       // Expecting { message, id, url }
//       const uploadedUrl = json?.url;
//       if (!uploadedUrl) {
//         showMsg("Upload Error", "Upload succeeded but no URL returned.");
//         return null;
//       }
//       return uploadedUrl;
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted
//         ? "Image upload timed out. Please try again."
//         : "Unable to upload the image. Check your connection.";
//       showMsg("Upload Error", msg);
//       return null;
//     } finally {
//       clearTimeout(timeoutId);
//     }
//   };
//   // ======= END new helper =======

//   const submit = async () => {
//     const e = validate();
//     if (Object.keys(e).length) {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//       showMsg("Fix form", "Please fix the highlighted fields.");
//       return;
//     }
//     if (!itineraryId) {
//       showMsg("Error", "Missing itinerary ID.");
//       return;
//     }

//     const token = await getAuthToken();
//     if (!token) {
//       showMsg("Not logged in", "Please log in again to update your itinerary.");
//       return;
//     }

//     // NOTE (image upload):
//     // If cover.uri is a local file:// URI, you should upload to your assets endpoint first
//     // and use the returned URL as cover_url. For now, we pass the URI directly only if it's already a URL.
//     const coverUrlPre =
//       cover?.uri && /^https?:\/\//i.test(cover.uri) ? cover.uri : (initial?.cover_url || "");

//     // ======= NEW: actually upload local cover and use returned Cloudinary URL =======
//     let finalCoverUrl = coverUrlPre;
//     if (cover?.uri && !/^https?:\/\//i.test(cover.uri)) {
//       const uploaded = await uploadCoverIfNeeded(token);
//       if (!uploaded) {
//         // upload failed or aborted; stop submit
//         return;
//       }
//       finalCoverUrl = uploaded;
//     }
//     // ======= END new upload logic =======

//     const payload = {
//       title,
//       description: desc,
//       city,
//       budget,
//       style: stylePref,
//       start_date: startDateText,
//       end_date: endDateText,
//       cover_url: finalCoverUrl,
//       days: days.map((d, idx) => ({
//         day_number: d.day_number || idx + 1,
//         place: d.place,
//         start_time: d.startTime || "",
//         end_time: d.endTime || "",
//         activities: d.activities || "",
//       })),
//     };

//     try {
//       setSubmitting(true);

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 20000);

//       const url = `${API_BASE}/itineraries/${itineraryId}`;
//       let res;
//       try {
//         res = await fetch(url, {
//           method: "PUT", // or "PATCH" if you switch to partial updates
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

//       const raw = await res.text();
//       let j = null;
//       try {
//         j = raw ? JSON.parse(raw) : null;
//       } catch {}

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", j?.error || "Please complete your profile to continue.");
//         return;
//       }
//       if (!res.ok) {
//         const friendly = {
//           400: "Invalid data. Please review the fields.",
//           403: "You don't have permission to do that.",
//           404: "Itinerary not found.",
//           413: "Image too large. Try a smaller cover image.",
//           415: "Unsupported data type.",
//           500: "Server error. Please try again.",
//           502: "Bad gateway.",
//           503: "Server unavailable.",
//           504: "Server timed out.",
//         };
//         const msg = j?.error || friendly[res.status] || `Failed to update itinerary (HTTP ${res.status})`;
//         showMsg("Error", msg);
//         return;
//       }

//       setShowSuccess(true);
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted
//         ? "Request timed out. Check your connection or API base URL."
//         : "Unable to reach the server. Check your connection or API base URL.";
//       console.log("Update itinerary network error:", err);
//       showMsg("Network Error", msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const onCloseSuccess = () => {
//     setShowSuccess(false);
//     // EXACTLY like Create: just goBack()
//     goBack();
//   };

//   return (
//     <SafeAreaView style={[styles.safe, { paddingTop: IS_WEB ? 0 : insets.top }]}>
//       {/* Header — same as Create */}
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={goBack} style={styles.backPill} accessibilityLabel="Back to Itineraries">
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backPillText}>Back to Itineraries</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         ref={scrollRef}
//         style={styles.wrap}
//         contentContainerStyle={{ paddingBottom: IS_WEB ? 36 : 120 + insets.bottom }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.h1}>Edit Itinerary</Text>

//         {/* ------- Card: Basics ------- */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Basics</Text>

//           {/* Cover */}
//           <Text style={styles.label}>Cover Image</Text>
//           <View style={[styles.coverBox, errors.cover && styles.errBorder]}>
//             {cover?.uri ? (
//               <Image source={{ uri: cover.uri }} style={styles.coverImg} />
//             ) : initial?.cover_url ? (
//               <Image source={{ uri: initial.cover_url }} style={styles.coverImg} />
//             ) : (
//               <Text style={{ color: SUBTEXT }}>Tap “Pick Cover” to add a photo</Text>
//             )}
//             <TouchableOpacity style={styles.coverBtn} onPress={pickCover} accessibilityLabel="Pick cover image">
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

//           {/* Dates */}
//           <View style={styles.dateRow}>
//             <DateField label="Start Date" value={startDateText} onChange={setStartDateText} error={errors.startDateText} />
//             <DateField label="End Date" value={endDateText} onChange={setEndDateText} error={errors.endDateText} />
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

//                 <Text style={styles.smallLabel}>Place (in {city || "…"})</Text>
//                 <View
//                   style={[styles.pickerBox, errPlace && styles.errBorder, placeDisabled && { opacity: 0.6 }]}
//                   pointerEvents={placeDisabled ? "none" : "auto"}
//                 >
//                   <Picker style={styles.picker} selectedValue={d.place} onValueChange={(v) => updateDay(idx, { place: v })}>
//                     <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
//                     {cityPlaces.map((p) => (
//                       <Picker.Item key={p} label={p} value={p} />
//                     ))}
//                   </Picker>
//                 </View>
//                 {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

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

//         {/* Submit (WEB ONLY) */}
//         {IS_WEB && (
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </ScrollView>

//       {/* Floating footer submit (NATIVE ONLY) */}
//       {!IS_WEB && (
//         <View style={[styles.footer, { paddingBottom: 12 + insets.bottom }]}>
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Success modal */}
//       <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={onCloseSuccess}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <View className="modalIconCircle" style={styles.modalIconCircle}>
//               <Ionicons name="checkmark" size={36} color="#fff" />
//             </View>
//             <Text style={styles.modalTitle}>Itinerary Updated</Text>
//             <Text style={styles.modalText}>Your changes were saved successfully.</Text>
//             <TouchableOpacity style={styles.modalBtn} onPress={onCloseSuccess}>
//               <Text style={styles.modalBtnText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ========= Styles ========= */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#f7f9fc" },

//   headerBar: { paddingHorizontal: 12, paddingBottom: 8, backgroundColor: "#f7f9fc" },
//   backPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     alignSelf: "flex-start",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   backPillText: { fontWeight: "800", color: "#0f172a" },

//   wrap: { flex: 1, backgroundColor: "#f7f9fc", padding: 14 },
//   h1: { fontSize: 22, fontWeight: "800", color: "#003366", marginBottom: 10 },

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
//   cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

//   label: { fontWeight: "700", color: "#0f172a", marginBottom: 6, marginTop: 6 },
//   smallLabel: { fontWeight: "600", color: "#0f172a", marginBottom: 6, marginTop: 6 },

//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   multiline: { minHeight: 84, textAlignVertical: "top" },

//   pickerBox: {
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
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
//     ...(IS_WEB ? { outlineStyle: "none" } : null),
//   },

//   dateRow: { flexDirection: "row", gap: 10, marginTop: 8 },

//   webDateInput: {
//     width: "100%",
//     height: 48,
//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     paddingLeft: 12,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     outline: "none",
//     marginBottom: 6,
//   },

//   dateBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     padding: 12,
//     backgroundColor: "#fff",
//     marginBottom: 6,
//   },

//   coverBox: {
//     height: 180,
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
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
//     backgroundColor: "#003366",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   coverBtnText: { color: "#fff", fontWeight: "800" },

//   dayCard: {
//     borderWidth: 1,
//     borderColor: "#e9eef7",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
//   dayTitle: { fontWeight: "800", color: "#0f172a" },

//   row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
//   chip: { borderWidth: 1, borderColor: "#E6EDF7", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff" },
//   chipActive: { backgroundColor: "#003366", borderColor: "#003366" },
//   chipText: { fontWeight: "700", color: "#003366" },
//   chipTextActive: { color: "#fff", fontWeight: "800" },

//   addBtn: { borderWidth: 1, borderColor: "#003366", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
//   addBtnText: { color: "#003366", fontWeight: "800" },

//   // Footer submit (native only)
//   footer: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 0,
//     backgroundColor: "transparent",
//   },
//   submit: {
//     backgroundColor: "#0ea5e9",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//   },
//   submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   errText: { color: "#dc2626", marginBottom: 8 },
//   errBorder: { borderColor: "#dc2626" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   modalCard: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     alignItems: "center",
//   },
//   modalIconCircle: {
//     width: 64,
//     height: 64,
//     borderRadius: 999,
//     backgroundColor: "#16a34a",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 6, textAlign: "center" },
//   modalText: { color: "#374151", textAlign: "center", marginBottom: 16 },
//   modalBtn: { backgroundColor: "#0f172a", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
//   modalBtnText: { color: "#fff", fontWeight: "800" },
// });


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Image,
//   ActivityIndicator,
//   BackHandler,
//   Modal,
//   Alert,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { useNavigation, useRoute } from "@react-navigation/native";
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

// const IS_WEB = Platform.OS === "web";

// /* ========= Cities → Destinations ========= */
// const PLACES_BY_CITY = {
//   Abbottabad: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
//   Galiyat: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
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
//   "Hunza Valley": ["Altit Fort", "Attabad Lake", "Baltit Fort", "Hussaini Suspension Bridge", "Khunjerab Pass", "Passu Cones & Glacier", "Borith Lake"],
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
//   "Naran & Kaghan": ["Ansoo Lake", "Babusar Top", "Dudipatsar Lake", "Kaghan", "Lulusar Lake", "Naran", "Saif-ul-Malook Lake"],
//   "Neelum Valley": ["Arang Kel", "Kel", "Keran", "Sharda"],
//   Rawalakot: ["Banjosa Lake", "Rawalakot Valley", "Toli Pir"],
//   Skardu: ["Manthokha Waterfall", "Katpana Tso (Katpana Desert & Lake)", "Satpara Tso Lake", "Shangrila Resort / Lower Kachura Lake", "Skardu Valley"],
//   "Swat Valley": ["Bahrain", "Gabral Valley", "Kalam Valley", "Madyan", "Mahodand Lake", "Malam Jabba (ski resort)", "Ushu Forest"],
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

// /* ===== helpers ===== */
// const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
// const toDate = (s) => {
//   const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
//   return new Date(y, m - 1, d);
// };
// // Format a JS Date as YYYY-MM-DD in the user's local timezone (no UTC shift)
// const fmtLocalYMD = (d) => {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// const showMsg = (title, msg) => {
//   if (IS_WEB) {
//     alert(`${title ? title + ": " : ""}${msg}`);
//   } else {
//     Alert.alert(title || "Notice", msg);
//   }
// };

// /* ===== DateField ===== */
// const DateField = ({ label, value, onChange, error }) => {
//   if (IS_WEB) {
//     return (
//       <View style={{ flex: 1 }}>
//         <Text style={styles.smallLabel}>{label}</Text>
//         {/* eslint-disable-next-line react/no-unknown-property */}
//         <input
//           type="date"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ ...styles.webDateInput, borderColor: error ? "#dc2626" : BORDER }}
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
//               onChange(fmtLocalYMD(d));
//             }
//           }}
//         />
//       )}
//     </View>
//   );
// };

// export default function EditItineraryScreen({ onBack }) {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();
//   const scrollRef = useRef(null);

//   // 🔹 EXACT same back logic as Create screen
//   const goBack = () => {
//     if (typeof onBack === "function") onBack();
//     else if (navigation?.canGoBack()) navigation.goBack();
//   };

//   // Android HW back (same as Create)
//   useEffect(() => {
//     const sub = BackHandler.addEventListener("hardwareBackPress", () => {
//       goBack();
//       return true;
//     });
//     return () => sub.remove();
//   }, []);

//   // prefill from params
//   const initial = route.params?.itinerary || {};
//   const itineraryId = route.params?.id ?? initial?.id ?? initial?._id;

//   const [cover, setCover] = useState(initial?.cover_url ? { uri: initial.cover_url } : null);
//   const [title, setTitle] = useState(initial?.title || "");
//   const [desc, setDesc] = useState(initial?.description || "");
//   const [city, setCity] = useState(initial?.city || "");
//   const [budget, setBudget] = useState(initial?.budget || "");
//   const [stylePref, setStylePref] = useState(initial?.style || "");
//   const [startDateText, setStartDateText] = useState(
//     initial?.start_date ? String(initial.start_date).slice(0, 10) : ""
//   );
//   const [endDateText, setEndDateText] = useState(
//     initial?.end_date ? String(initial.end_date).slice(0, 10) : ""
//   );
//   const [days, setDays] = useState(() => {
//     const src = Array.isArray(initial?.days) ? initial.days : [];
//     if (!src.length) return [{ place: "", startTime: "", endTime: "", activities: "" }];
//     return src.map((d, i) => ({
//       place: d.place || "",
//       startTime: d.start_time || "",
//       endTime: d.end_time || "",
//       activities: d.activities || "",
//       day_number: d.day_number || i + 1,
//     }));
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

//   const addDay = () => setDays((p) => [...p, { place: "", startTime: "", endTime: "", activities: "" }]);
//   const removeDay = (idx) => setDays((p) => p.filter((_, i) => i !== idx));
//   const updateDay = (idx, patch) =>
//     setDays((p) => {
//       const next = [...p];
//       next[idx] = { ...next[idx], ...patch };
//       return next;
//     });

//   const pickCover = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       showMsg("Permission needed", "Please allow photo library access.");
//       return;
//     }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaType.Images, // ✅ updated (no deprecation)
//       quality: 0.85,
//     });
//     if (!res.canceled) setCover(res.assets?.[0] || null);
//   };

//   const validate = () => {
//     const e = {};
//     // In edit, cover optional; keep validation same as create if you want strictness:
//     if (!cover && !initial?.cover_url) e.cover = "Please add a cover picture";
//     if (title.trim().length < 3) e.title = "Min 3 characters";
//     if (desc.trim().length < 10) e.desc = "Min 10 characters";
//     if (!city) e.city = "Select a city";
//     if (!budget) e.budget = "Select a budget";
//     if (!stylePref) e.stylePref = "Select a travel style";
//     if (!startDateText.trim()) e.startDateText = "Pick a start date";
//     if (!endDateText.trim()) e.endDateText = "Pick an end date";

//     if (startDateText && endDateText && looksISODate(startDateText) && looksISODate(endDateText)) {
//       const sd = toDate(startDateText);
//       const ed = toDate(endDateText);
//       if (ed < sd) e.endDateText = "End date must be after start date";
//     }

//     if (days.length === 0) e.days = "Add at least one day";
//     days.forEach((d, i) => {
//       if (!d.place) e[`day${i}.place`] = "Choose a place";
//       else if (!cityPlaces.includes(d.place)) e[`day${i}.place`] = `Must be in ${city}`;
//       if ((d.activities || "").trim().length < 5) e[`day${i}.activities`] = "Add a short note";
//     });

//     setErrors(e);
//     return e;
//   };

//   const canSubmit =
//     (cover || initial?.cover_url) &&
//     title.trim().length >= 3 &&
//     desc.trim().length >= 10 &&
//     city &&
//     budget &&
//     stylePref &&
//     startDateText.trim() &&
//     endDateText.trim() &&
//     days.length > 0 &&
//     days.every((d) => d.place && (d.activities || "").trim().length >= 5);

//   // ======= helper to fetch user id from storage =======
//   const getUserIdForUpload = async () => {
//     const candidateKeys = ["user_id", "userId", "id", "USER_ID", "currentUser", "user", "profile"];
//     for (const k of candidateKeys) {
//       const val = await AsyncStorage.getItem(k);
//       if (!val) continue;
//       try {
//         const maybeObj = JSON.parse(val);
//         if (maybeObj && typeof maybeObj === "object") {
//           if (maybeObj.user_id != null) return String(maybeObj.user_id);
//           if (maybeObj.id != null) return String(maybeObj.id);
//           if (maybeObj.userId != null) return String(maybeObj.userId);
//         } else if (String(val).trim()) {
//           return String(val).trim();
//         }
//       } catch {
//         if (String(val).trim()) return String(val).trim();
//       }
//     }
//     return null;
//   };

//   // ======= robust multipart upload (native + web) =======
//   const uploadCoverIfNeeded = async (token) => {
//     if (!cover?.uri || /^https?:\/\//i.test(cover.uri)) {
//       return initial?.cover_url || "";
//     }

//     const userId = await getUserIdForUpload();
//     if (!userId) {
//       showMsg("Not logged in", "Cannot find your user ID. Please log in again.");
//       return null;
//     }

//     const endpoint = `${API_BASE}/asset/${encodeURIComponent(userId)}`;
//     const form = new FormData();

//     try {
//       if (IS_WEB) {
//         // On web, turn the URI into a Blob/File so FormData sends actual file bytes.
//         const resp = await fetch(cover.uri);
//         const blob = await resp.blob();
//         const filename =
//           cover.fileName ||
//           cover.filename ||
//           `cover_${Date.now()}.${(blob.type || "image/jpeg").includes("png") ? "png" : "jpg"}`;
//         const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
//         form.append("asset", file);
//       } else {
//         // iOS/Android: RN fetch supports { uri, name, type }
//         const name =
//           cover.fileName ||
//           cover.filename ||
//           `cover_${Date.now()}.jpg`;
//         const type =
//           cover.mimeType ||
//           cover.type ||
//           "image/jpeg";
//         form.append("asset", {
//           uri: cover.uri,
//           name,
//           type,
//         });
//       }

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 25000);

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // DO NOT set Content-Type; let fetch set the multipart boundary
//         },
//         body: form,
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       const text = await res.text();
//       let json = null;
//       try {
//         json = text ? JSON.parse(text) : null;
//       } catch {}

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return null;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", json?.error || "Please complete your profile to continue.");
//         return null;
//       }
//       if (!res.ok) {
//         const msg = (json && (json.error || json.message)) || `Failed to upload image (HTTP ${res.status})`;
//         showMsg("Upload Error", msg);
//         return null;
//       }

//       const uploadedUrl = json?.url;
//       if (!uploadedUrl) {
//         showMsg("Upload Error", "Upload succeeded but no URL returned.");
//         return null;
//       }
//       return uploadedUrl;
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted ? "Image upload timed out. Please try again." : "Unable to upload the image. Check your connection.";
//       showMsg("Upload Error", msg);
//       return null;
//     }
//   };

//   const submit = async () => {
//     const e = validate();
//     if (Object.keys(e).length) {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//       showMsg("Fix form", "Please fix the highlighted fields.");
//       return;
//     }
//     if (!itineraryId) {
//       showMsg("Error", "Missing itinerary ID.");
//       return;
//     }

//     const token = await getAuthToken();
//     if (!token) {
//       showMsg("Not logged in", "Please log in again to update your itinerary.");
//       return;
//     }

//     // If local file, upload first to get Cloudinary URL
//     const coverUrlPre =
//       cover?.uri && /^https?:\/\//i.test(cover.uri) ? cover.uri : (initial?.cover_url || "");

//     let finalCoverUrl = coverUrlPre;
//     if (cover?.uri && !/^https?:\/\//i.test(cover.uri)) {
//       const uploaded = await uploadCoverIfNeeded(token);
//       if (!uploaded) return; // stop on failure
//       finalCoverUrl = uploaded;
//     }

//     const payload = {
//       title,
//       description: desc,
//       city,
//       budget,
//       style: stylePref,
//       start_date: startDateText,
//       end_date: endDateText,
//       cover_url: finalCoverUrl,
//       days: days.map((d, idx) => ({
//         day_number: d.day_number || idx + 1,
//         place: d.place,
//         start_time: d.startTime || "",
//         end_time: d.endTime || "",
//         activities: d.activities || "",
//       })),
//     };

//     try {
//       setSubmitting(true);

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 20000);

//       const url = `${API_BASE}/itineraries/${itineraryId}`;
//       let res;
//       try {
//         res = await fetch(url, {
//           method: "PUT", // or "PATCH"
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

//       const raw = await res.text();
//       let j = null;
//       try {
//         j = raw ? JSON.parse(raw) : null;
//       } catch {}

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", j?.error || "Please complete your profile to continue.");
//         return;
//       }
//       if (!res.ok) {
//         const friendly = {
//           400: "Invalid data. Please review the fields.",
//           403: "You don't have permission to do that.",
//           404: "Itinerary not found.",
//           413: "Image too large. Try a smaller cover image.",
//           415: "Unsupported data type.",
//           500: "Server error. Please try again.",
//           502: "Bad gateway.",
//           503: "Server unavailable.",
//           504: "Server timed out.",
//         };
//         const msg = j?.error || friendly[res.status] || `Failed to update itinerary (HTTP ${res.status})`;
//         showMsg("Error", msg);
//         return;
//       }

//       setShowSuccess(true);
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted
//         ? "Request timed out. Check your connection or API base URL."
//         : "Unable to reach the server. Check your connection or API base URL.";
//       console.log("Update itinerary network error:", err);
//       showMsg("Network Error", msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const onCloseSuccess = () => {
//     setShowSuccess(false);
//     // EXACTLY like Create: just goBack()
//     goBack();
//   };

//   return (
//     <SafeAreaView style={[styles.safe, { paddingTop: IS_WEB ? 0 : insets.top }]}>
//       {/* Header — same as Create */}
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={goBack} style={styles.backPill} accessibilityLabel="Back to Itineraries">
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backPillText}>Back to Itineraries</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         ref={scrollRef}
//         style={styles.wrap}
//         contentContainerStyle={{ paddingBottom: IS_WEB ? 36 : 120 + insets.bottom }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.h1}>Edit Itinerary</Text>

//         {/* ------- Card: Basics ------- */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Basics</Text>

//           {/* Cover */}
//           <Text style={styles.label}>Cover Image</Text>
//           <View style={[styles.coverBox, errors.cover && styles.errBorder]}>
//             {cover?.uri ? (
//               <Image source={{ uri: cover.uri }} style={styles.coverImg} />
//             ) : initial?.cover_url ? (
//               <Image source={{ uri: initial.cover_url }} style={styles.coverImg} />
//             ) : (
//               <Text style={{ color: SUBTEXT }}>Tap “Pick Cover” to add a photo</Text>
//             )}
//             <TouchableOpacity style={styles.coverBtn} onPress={pickCover} accessibilityLabel="Pick cover image">
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

//           {/* Dates */}
//           <View style={styles.dateRow}>
//             <DateField label="Start Date" value={startDateText} onChange={setStartDateText} error={errors.startDateText} />
//             <DateField label="End Date" value={endDateText} onChange={setEndDateText} error={errors.endDateText} />
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

//                 <Text style={styles.smallLabel}>Place (in {city || "…"})</Text>
//                 <View
//                   style={[styles.pickerBox, errPlace && styles.errBorder, placeDisabled && { opacity: 0.6 }]}
//                   pointerEvents={placeDisabled ? "none" : "auto"}
//                 >
//                   <Picker style={styles.picker} selectedValue={d.place} onValueChange={(v) => updateDay(idx, { place: v })}>
//                     <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
//                     {cityPlaces.map((p) => (
//                       <Picker.Item key={p} label={p} value={p} />
//                     ))}
//                   </Picker>
//                 </View>
//                 {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

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

//         {/* Submit (WEB ONLY) */}
//         {IS_WEB && (
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </ScrollView>

//       {/* Floating footer submit (NATIVE ONLY) */}
//       {!IS_WEB && (
//         <View style={[styles.footer, { paddingBottom: 12 + insets.bottom }]}>
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Success modal */}
//       <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={onCloseSuccess}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <View className="modalIconCircle" style={styles.modalIconCircle}>
//               <Ionicons name="checkmark" size={36} color="#fff" />
//             </View>
//             <Text style={styles.modalTitle}>Itinerary Updated</Text>
//             <Text style={styles.modalText}>Your changes were saved successfully.</Text>
//             <TouchableOpacity style={styles.modalBtn} onPress={onCloseSuccess}>
//               <Text style={styles.modalBtnText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ========= Styles ========= */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#f7f9fc" },

//   headerBar: { paddingHorizontal: 12, paddingBottom: 8, backgroundColor: "#f7f9fc" },
//   backPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     alignSelf: "flex-start",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   backPillText: { fontWeight: "800", color: "#0f172a" },

//   wrap: { flex: 1, backgroundColor: "#f7f9fc", padding: 14 },
//   h1: { fontSize: 22, fontWeight: "800", color: "#003366", marginBottom: 10 },

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
//   cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

//   label: { fontWeight: "700", color: "#0f172a", marginBottom: 6, marginTop: 6 },
//   smallLabel: { fontWeight: "600", color: "#0f172a", marginBottom: 6, marginTop: 6 },

//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   multiline: { minHeight: 84, textAlignVertical: "top" },

//   pickerBox: {
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
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
//     ...(IS_WEB ? { outlineStyle: "none" } : null),
//   },

//   dateRow: { flexDirection: "row", gap: 10, marginTop: 8 },

//   webDateInput: {
//     width: "100%",
//     height: 48,
//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     paddingLeft: 12,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     outline: "none",
//     marginBottom: 6,
//   },

//   dateBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     padding: 12,
//     backgroundColor: "#fff",
//     marginBottom: 6,
//   },

//   coverBox: {
//     height: 180,
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
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
//     backgroundColor: "#003366",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   coverBtnText: { color: "#fff", fontWeight: "800" },

//   dayCard: {
//     borderWidth: 1,
//     borderColor: "#e9eef7",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
//   dayTitle: { fontWeight: "800", color: "#0f172a" },

//   row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
//   chip: { borderWidth: 1, borderColor: "#E6EDF7", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff" },
//   chipActive: { backgroundColor: "#003366", borderColor: "#003366" },
//   chipText: { fontWeight: "700", color: "#003366" },
//   chipTextActive: { color: "#fff", fontWeight: "800" },

//   addBtn: { borderWidth: 1, borderColor: "#003366", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
//   addBtnText: { color: "#003366", fontWeight: "800" },

//   // Footer submit (native only)
//   footer: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 0,
//     backgroundColor: "transparent",
//   },
//   submit: {
//     backgroundColor: "#0ea5e9",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//   },
//   submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   errText: { color: "#dc2626", marginBottom: 8 },
//   errBorder: { borderColor: "#dc2626" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   modalCard: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     alignItems: "center",
//   },
//   modalIconCircle: {
//     width: 64,
//     height: 64,
//     borderRadius: 999,
//     backgroundColor: "#16a34a",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 6, textAlign: "center" },
//   modalText: { color: "#374151", textAlign: "center", marginBottom: 16 },
//   modalBtn: { backgroundColor: "#0f172a", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
//   modalBtnText: { color: "#fff", fontWeight: "800" },
// });


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Image,
//   ActivityIndicator,
//   BackHandler,
//   Modal,
//   Alert,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { useNavigation, useRoute } from "@react-navigation/native";
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

// const IS_WEB = Platform.OS === "web";

// /* ========= Cities → Destinations ========= */
// const PLACES_BY_CITY = {
//   Abbottabad: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
//   Galiyat: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
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
//   "Hunza Valley": ["Altit Fort", "Attabad Lake", "Baltit Fort", "Hussaini Suspension Bridge", "Khunjerab Pass", "Passu Cones & Glacier", "Borith Lake"],
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
//   "Naran & Kaghan": ["Ansoo Lake", "Babusar Top", "Dudipatsar Lake", "Kaghan", "Lulusar Lake", "Naran", "Saif-ul-Malook Lake"],
//   "Neelum Valley": ["Arang Kel", "Kel", "Keran", "Sharda"],
//   Rawalakot: ["Banjosa Lake", "Rawalakot Valley", "Toli Pir"],
//   Skardu: ["Manthokha Waterfall", "Katpana Tso (Katpana Desert & Lake)", "Satpara Tso Lake", "Shangrila Resort / Lower Kachura Lake", "Skardu Valley"],
//   "Swat Valley": ["Bahrain", "Gabral Valley", "Kalam Valley", "Madyan", "Mahodand Lake", "Malam Jabba (ski resort)", "Ushu Forest"],
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

// /* ===== helpers ===== */
// const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
// const toDate = (s) => {
//   const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
//   return new Date(y, m - 1, d);
// };
// // Format a JS Date as YYYY-MM-DD in the user's local timezone (no UTC shift)
// const fmtLocalYMD = (d) => {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// const IS_NATIVE = !IS_WEB;
// const showMsg = (title, msg) => {
//   if (IS_WEB) alert(`${title ? title + ": " : ""}${msg}`);
//   else Alert.alert(title || "Notice", msg);
// };

// /* ===== DateField ===== */
// const DateField = ({ label, value, onChange, error }) => {
//   if (IS_WEB) {
//     return (
//       <View style={{ flex: 1 }}>
//         <Text style={styles.smallLabel}>{label}</Text>
//         {/* eslint-disable-next-line react/no-unknown-property */}
//         <input
//           type="date"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ ...styles.webDateInput, borderColor: error ? "#dc2626" : BORDER }}
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
//             if (d) onChange(fmtLocalYMD(d));
//           }}
//         />
//       )}
//     </View>
//   );
// };

// export default function EditItineraryScreen({ onBack }) {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();
//   const scrollRef = useRef(null);

//   // Back logic
//   const goBack = () => {
//     if (typeof onBack === "function") onBack();
//     else if (navigation?.canGoBack()) navigation.goBack();
//   };

//   useEffect(() => {
//     const sub = BackHandler.addEventListener("hardwareBackPress", () => {
//       goBack();
//       return true;
//     });
//     return () => sub.remove();
//   }, []);

//   // prefill
//   const initial = route.params?.itinerary || {};
//   const itineraryId = route.params?.id ?? initial?.id ?? initial?._id;

//   const [cover, setCover] = useState(initial?.cover_url ? { uri: initial.cover_url } : null);
//   const [title, setTitle] = useState(initial?.title || "");
//   const [desc, setDesc] = useState(initial?.description || "");
//   const [city, setCity] = useState(initial?.city || "");
//   const [budget, setBudget] = useState(initial?.budget || "");
//   const [stylePref, setStylePref] = useState(initial?.style || "");
//   const [startDateText, setStartDateText] = useState(
//     initial?.start_date ? String(initial.start_date).slice(0, 10) : ""
//   );
//   const [endDateText, setEndDateText] = useState(
//     initial?.end_date ? String(initial.end_date).slice(0, 10) : ""
//   );
//   const [days, setDays] = useState(() => {
//     const src = Array.isArray(initial?.days) ? initial.days : [];
//     if (!src.length) return [{ place: "", startTime: "", endTime: "", activities: "" }];
//     return src.map((d, i) => ({
//       place: d.place || "",
//       startTime: d.start_time || "",
//       endTime: d.end_time || "",
//       activities: d.activities || "",
//       day_number: d.day_number || i + 1,
//     }));
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

//   const addDay = () => setDays((p) => [...p, { place: "", startTime: "", endTime: "", activities: "" }]);
//   const removeDay = (idx) => setDays((p) => p.filter((_, i) => i !== idx));
//   const updateDay = (idx, patch) =>
//     setDays((p) => {
//       const next = [...p];
//       next[idx] = { ...next[idx], ...patch };
//       return next;
//     });

//   /* ========= SIMPLE pickCover (no explicit permission call) =========
//      - On iOS/Android, the system picker will prompt for permission if needed.
//      - On Web, it opens the file dialog directly. */
//   const pickCover = async () => {
//     try {
//       const res = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaType.Images, // ✅ no deprecation
//         allowsMultipleSelection: false,
//         quality: 0.85,
//       });
//       if (!res.canceled) setCover(res.assets?.[0] || null);
//     } catch (e) {
//       showMsg("Image Picker", "Could not open photo library.");
//     }
//   };

//   const validate = () => {
//     const e = {};
//     if (!cover && !initial?.cover_url) e.cover = "Please add a cover picture";
//     if (title.trim().length < 3) e.title = "Min 3 characters";
//     if (desc.trim().length < 10) e.desc = "Min 10 characters";
//     if (!city) e.city = "Select a city";
//     if (!budget) e.budget = "Select a budget";
//     if (!stylePref) e.stylePref = "Select a travel style";
//     if (!startDateText.trim()) e.startDateText = "Pick a start date";
//     if (!endDateText.trim()) e.endDateText = "Pick an end date";

//     if (startDateText && endDateText && looksISODate(startDateText) && looksISODate(endDateText)) {
//       const sd = toDate(startDateText);
//       const ed = toDate(endDateText);
//       if (ed < sd) e.endDateText = "End date must be after start date";
//     }

//     if (days.length === 0) e.days = "Add at least one day";
//     days.forEach((d, i) => {
//       if (!d.place) e[`day${i}.place`] = "Choose a place";
//       else if (!cityPlaces.includes(d.place)) e[`day${i}.place`] = `Must be in ${city}`;
//       if ((d.activities || "").trim().length < 5) e[`day${i}.activities`] = "Add a short note";
//     });

//     setErrors(e);
//     return e;
//   };

//   const canSubmit =
//     (cover || initial?.cover_url) &&
//     title.trim().length >= 3 &&
//     desc.trim().length >= 10 &&
//     city &&
//     budget &&
//     stylePref &&
//     startDateText.trim() &&
//     endDateText.trim() &&
//     days.length > 0 &&
//     days.every((d) => d.place && (d.activities || "").trim().length >= 5);

//   // ======= helper to fetch user id from storage =======
//   const getUserIdForUpload = async () => {
//     const candidateKeys = ["user_id", "userId", "id", "USER_ID", "currentUser", "user", "profile"];
//     for (const k of candidateKeys) {
//       const val = await AsyncStorage.getItem(k);
//       if (!val) continue;
//       try {
//         const maybeObj = JSON.parse(val);
//         if (maybeObj && typeof maybeObj === "object") {
//           if (maybeObj.user_id != null) return String(maybeObj.user_id);
//           if (maybeObj.id != null) return String(maybeObj.id);
//           if (maybeObj.userId != null) return String(maybeObj.userId);
//         } else if (String(val).trim()) {
//           return String(val).trim();
//         }
//       } catch {
//         if (String(val).trim()) return String(val).trim();
//       }
//     }
//     return null;
//   };

//   // ======= robust multipart upload (native + web) =======
//   const uploadCoverIfNeeded = async (token) => {
//     if (!cover?.uri || /^https?:\/\//i.test(cover.uri)) {
//       return initial?.cover_url || "";
//     }

//     const userId = await getUserIdForUpload();
//     if (!userId) {
//       showMsg("Not logged in", "Cannot find your user ID. Please log in again.");
//       return null;
//     }

//     const endpoint = `${API_BASE}/asset/${encodeURIComponent(userId)}`;
//     const form = new FormData();

//     try {
//       if (IS_WEB) {
//         const resp = await fetch(cover.uri);
//         const blob = await resp.blob();
//         const filename =
//           cover.fileName ||
//           cover.filename ||
//           `cover_${Date.now()}.${(blob.type || "image/jpeg").includes("png") ? "png" : "jpg"}`;
//         const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
//         form.append("asset", file);
//       } else {
//         const name = cover.fileName || cover.filename || `cover_${Date.now()}.jpg`;
//         const type = cover.mimeType || cover.type || "image/jpeg";
//         form.append("asset", { uri: cover.uri, name, type });
//       }

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 25000);

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`, // let fetch set multipart boundary
//         },
//         body: form,
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       const text = await res.text();
//       let json = null;
//       try {
//         json = text ? JSON.parse(text) : null;
//       } catch {}

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return null;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", json?.error || "Please complete your profile to continue.");
//         return null;
//       }
//       if (!res.ok) {
//         const msg = (json && (json.error || json.message)) || `Failed to upload image (HTTP ${res.status})`;
//         showMsg("Upload Error", msg);
//         return null;
//       }

//       const uploadedUrl = json?.url;
//       if (!uploadedUrl) {
//         showMsg("Upload Error", "Upload succeeded but no URL returned.");
//         return null;
//       }
//       return uploadedUrl;
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted ? "Image upload timed out. Please try again." : "Unable to upload the image. Check your connection.";
//       showMsg("Upload Error", msg);
//       return null;
//     }
//   };

//   const submit = async () => {
//     const e = validate();
//     if (Object.keys(e).length) {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//       showMsg("Fix form", "Please fix the highlighted fields.");
//       return;
//     }
//     if (!itineraryId) {
//       showMsg("Error", "Missing itinerary ID.");
//       return;
//     }

//     const token = await getAuthToken();
//     if (!token) {
//       showMsg("Not logged in", "Please log in again to update your itinerary.");
//       return;
//     }

//     const coverUrlPre =
//       cover?.uri && /^https?:\/\//i.test(cover.uri) ? cover.uri : (initial?.cover_url || "");

//     let finalCoverUrl = coverUrlPre;
//     if (cover?.uri && !/^https?:\/\//i.test(cover.uri)) {
//       const uploaded = await uploadCoverIfNeeded(token);
//       if (!uploaded) return;
//       finalCoverUrl = uploaded;
//     }

//     const payload = {
//       title,
//       description: desc,
//       city,
//       budget,
//       style: stylePref,
//       start_date: startDateText,
//       end_date: endDateText,
//       cover_url: finalCoverUrl,
//       days: days.map((d, idx) => ({
//         day_number: d.day_number || idx + 1,
//         place: d.place,
//         start_time: d.startTime || "",
//         end_time: d.endTime || "",
//         activities: d.activities || "",
//       })),
//     };

//     try {
//       setSubmitting(true);

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 20000);

//       const url = `${API_BASE}/itineraries/${itineraryId}`;
//       let res;
//       try {
//         res = await fetch(url, {
//           method: "PUT",
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

//       const raw = await res.text();
//       let j = null;
//       try {
//         j = raw ? JSON.parse(raw) : null;
//       } catch {}

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", j?.error || "Please complete your profile to continue.");
//         return;
//       }
//       if (!res.ok) {
//         const friendly = {
//           400: "Invalid data. Please review the fields.",
//           403: "You don't have permission to do that.",
//           404: "Itinerary not found.",
//           413: "Image too large. Try a smaller cover image.",
//           415: "Unsupported data type.",
//           500: "Server error. Please try again.",
//           502: "Bad gateway.",
//           503: "Server unavailable.",
//           504: "Server timed out.",
//         };
//         const msg = j?.error || friendly[res.status] || `Failed to update itinerary (HTTP ${res.status})`;
//         showMsg("Error", msg);
//         return;
//       }

//       setShowSuccess(true);
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted
//         ? "Request timed out. Check your connection or API base URL."
//         : "Unable to reach the server. Check your connection or API base URL.";
//       console.log("Update itinerary network error:", err);
//       showMsg("Network Error", msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const onCloseSuccess = () => {
//     setShowSuccess(false);
//     goBack();
//   };

//   return (
//     <SafeAreaView style={[styles.safe, { paddingTop: IS_WEB ? 0 : useSafeAreaInsets().top }]}>
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={goBack} style={styles.backPill} accessibilityLabel="Back to Itineraries">
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backPillText}>Back to Itineraries</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         ref={scrollRef}
//         style={styles.wrap}
//         contentContainerStyle={{ paddingBottom: IS_WEB ? 36 : 120 + useSafeAreaInsets().bottom }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.h1}>Edit Itinerary</Text>

//         {/* ------- Card: Basics ------- */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Basics</Text>

//           {/* Cover */}
//           <Text style={styles.label}>Cover Image</Text>
//           <View style={[styles.coverBox, errors.cover && styles.errBorder]}>
//             {cover?.uri ? (
//               <Image source={{ uri: cover.uri }} style={styles.coverImg} />
//             ) : initial?.cover_url ? (
//               <Image source={{ uri: initial.cover_url }} style={styles.coverImg} />
//             ) : (
//               <Text style={{ color: SUBTEXT }}>Tap “Pick Cover” to add a photo</Text>
//             )}
//             <TouchableOpacity style={styles.coverBtn} onPress={pickCover} accessibilityLabel="Pick cover image">
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

//           {/* Dates */}
//           <View style={styles.dateRow}>
//             <DateField label="Start Date" value={startDateText} onChange={setStartDateText} error={errors.startDateText} />
//             <DateField label="End Date" value={endDateText} onChange={setEndDateText} error={errors.endDateText} />
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

//                 <Text style={styles.smallLabel}>Place (in {city || "…"})</Text>
//                 <View
//                   style={[styles.pickerBox, errPlace && styles.errBorder, placeDisabled && { opacity: 0.6 }]}
//                   pointerEvents={placeDisabled ? "none" : "auto"}
//                 >
//                   <Picker style={styles.picker} selectedValue={d.place} onValueChange={(v) => updateDay(idx, { place: v })}>
//                     <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
//                     {cityPlaces.map((p) => (
//                       <Picker.Item key={p} label={p} value={p} />
//                     ))}
//                   </Picker>
//                 </View>
//                 {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

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

//         {/* Submit (WEB ONLY) */}
//         {IS_WEB && (
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </ScrollView>

//       {/* Floating footer submit (NATIVE ONLY) */}
//       {IS_NATIVE && (
//         <View style={[styles.footer, { paddingBottom: 12 + useSafeAreaInsets().bottom }]}>
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Success modal */}
//       <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={onCloseSuccess}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <View className="modalIconCircle" style={styles.modalIconCircle}>
//               <Ionicons name="checkmark" size={36} color="#fff" />
//             </View>
//             <Text style={styles.modalTitle}>Itinerary Updated</Text>
//             <Text style={styles.modalText}>Your changes were saved successfully.</Text>
//             <TouchableOpacity style={styles.modalBtn} onPress={onCloseSuccess}>
//               <Text style={styles.modalBtnText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ========= Styles ========= */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#f7f9fc" },

//   headerBar: { paddingHorizontal: 12, paddingBottom: 8, backgroundColor: "#f7f9fc" },
//   backPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     alignSelf: "flex-start",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   backPillText: { fontWeight: "800", color: "#0f172a" },

//   wrap: { flex: 1, backgroundColor: "#f7f9fc", padding: 14 },
//   h1: { fontSize: 22, fontWeight: "800", color: "#003366", marginBottom: 10 },

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
//   cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

//   label: { fontWeight: "700", color: "#0f172a", marginBottom: 6, marginTop: 6 },
//   smallLabel: { fontWeight: "600", color: "#0f172a", marginBottom: 6, marginTop: 6 },

//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   multiline: { minHeight: 84, textAlignVertical: "top" },

//   pickerBox: {
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
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
//     ...(IS_WEB ? { outlineStyle: "none" } : null),
//   },

//   dateRow: { flexDirection: "row", gap: 10, marginTop: 8 },

//   webDateInput: {
//     width: "100%",
//     height: 48,
//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     paddingLeft: 12,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     outline: "none",
//     marginBottom: 6,
//   },

//   dateBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     padding: 12,
//     backgroundColor: "#fff",
//     marginBottom: 6,
//   },

//   coverBox: {
//     height: 180,
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
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
//     backgroundColor: "#003366",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   coverBtnText: { color: "#fff", fontWeight: "800" },

//   dayCard: {
//     borderWidth: 1,
//     borderColor: "#e9eef7",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
//   dayTitle: { fontWeight: "800", color: "#0f172a" },

//   row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
//   chip: { borderWidth: 1, borderColor: "#E6EDF7", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff" },
//   chipActive: { backgroundColor: "#003366", borderColor: "#003366" },
//   chipText: { fontWeight: "700", color: "#003366" },
//   chipTextActive: { color: "#fff", fontWeight: "800" },

//   addBtn: { borderWidth: 1, borderColor: "#003366", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
//   addBtnText: { color: "#003366", fontWeight: "800" },

//   // Footer submit (native only)
//   footer: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 0,
//     backgroundColor: "transparent",
//   },
//   submit: {
//     backgroundColor: "#0ea5e9",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//   },
//   submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   errText: { color: "#dc2626", marginBottom: 8 },
//   errBorder: { borderColor: "#dc2626" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   modalCard: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     alignItems: "center",
//   },
//   modalIconCircle: {
//     width: 64,
//     height: 64,
//     borderRadius: 999,
//     backgroundColor: "#16a34a",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 6, textAlign: "center" },
//   modalText: { color: "#374151", textAlign: "center", marginBottom: 16 },
//   modalBtn: { backgroundColor: "#0f172a", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
//   modalBtnText: { color: "#fff", fontWeight: "800" },
// });


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   Image,
//   ActivityIndicator,
//   BackHandler,
//   Modal,
//   Alert,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { useNavigation, useRoute } from "@react-navigation/native";
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

// const IS_WEB = Platform.OS === "web";
// const IS_NATIVE = !IS_WEB;

// /* ========= Cities → Destinations ========= */
// const PLACES_BY_CITY = {
//   Abbottabad: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
//   Galiyat: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
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
//   "Hunza Valley": ["Altit Fort", "Attabad Lake", "Baltit Fort", "Hussaini Suspension Bridge", "Khunjerab Pass", "Passu Cones & Glacier", "Borith Lake"],
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
//   "Naran & Kaghan": ["Ansoo Lake", "Babusar Top", "Dudipatsar Lake", "Kaghan", "Lulusar Lake", "Naran", "Saif-ul-Malook Lake"],
//   "Neelum Valley": ["Arang Kel", "Kel", "Keran", "Sharda"],
//   Rawalakot: ["Banjosa Lake", "Rawalakot Valley", "Toli Pir"],
//   Skardu: ["Manthokha Waterfall", "Katpana Tso (Katpana Desert & Lake)", "Satpara Tso Lake", "Shangrila Resort / Lower Kachura Lake", "Skardu Valley"],
//   "Swat Valley": ["Bahrain", "Gabral Valley", "Kalam Valley", "Madyan", "Mahodand Lake", "Malam Jabba (ski resort)", "Ushu Forest"],
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

// const BORDER = "#E6EDF7";
// const SUBTEXT = "#6B7280";

// /* ===== helpers ===== */
// const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
// const toDate = (s) => {
//   const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
//   return new Date(y, m - 1, d);
// };
// // Format a JS Date as YYYY-MM-DD in the user's local timezone (no UTC shift)
// const fmtLocalYMD = (d) => {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// const showMsg = (title, msg) => {
//   if (IS_WEB) alert(`${title ? title + ": " : ""}${msg}`);
//   else Alert.alert(title || "Notice", msg);
// };

// /* ===== DateField ===== */
// const DateField = ({ label, value, onChange, error }) => {
//   if (IS_WEB) {
//     return (
//       <View style={{ flex: 1 }}>
//         <Text style={styles.smallLabel}>{label}</Text>
//         {/* eslint-disable-next-line react/no-unknown-property */}
//         <input
//           type="date"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ ...styles.webDateInput, borderColor: error ? "#dc2626" : BORDER }}
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
//             if (d) onChange(fmtLocalYMD(d));
//           }}
//         />
//       )}
//     </View>
//   );
// };

// export default function EditItineraryScreen({ onBack }) {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();
//   const scrollRef = useRef(null);

//   // Web-only hidden file input
//   const webInputRef = useRef(null);
//   const [webFile, setWebFile] = useState(null); // holds the real File on web

//   // Back logic
//   const goBack = () => {
//     if (typeof onBack === "function") onBack();
//     else if (navigation?.canGoBack()) navigation.goBack();
//   };

//   useEffect(() => {
//     const sub = BackHandler.addEventListener("hardwareBackPress", () => {
//       goBack();
//       return true;
//     });
//     return () => sub.remove();
//   }, []);

//   // prefill
//   const initial = route.params?.itinerary || {};
//   const itineraryId = route.params?.id ?? initial?.id ?? initial?._id;

//   const [cover, setCover] = useState(initial?.cover_url ? { uri: initial.cover_url } : null);
//   const [title, setTitle] = useState(initial?.title || "");
//   const [desc, setDesc] = useState(initial?.description || "");
//   const [city, setCity] = useState(initial?.city || "");
//   const [budget, setBudget] = useState(initial?.budget || "");
//   const [stylePref, setStylePref] = useState(initial?.style || "");
//   const [startDateText, setStartDateText] = useState(
//     initial?.start_date ? String(initial.start_date).slice(0, 10) : ""
//   );
//   const [endDateText, setEndDateText] = useState(
//     initial?.end_date ? String(initial.end_date).slice(0, 10) : ""
//   );
//   const [days, setDays] = useState(() => {
//     const src = Array.isArray(initial?.days) ? initial.days : [];
//     if (!src.length) return [{ place: "", startTime: "", endTime: "", activities: "" }];
//     return src.map((d, i) => ({
//       place: d.place || "",
//       startTime: d.start_time || "",
//       endTime: d.end_time || "",
//       activities: d.activities || "",
//       day_number: d.day_number || i + 1,
//     }));
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

//   const addDay = () => setDays((p) => [...p, { place: "", startTime: "", endTime: "", activities: "" }]);
//   const removeDay = (idx) => setDays((p) => p.filter((_, i) => i !== idx));
//   const updateDay = (idx, patch) =>
//     setDays((p) => {
//       const next = [...p];
//       next[idx] = { ...next[idx], ...patch };
//       return next;
//     });

//   /* ========= pickCover =========
//      - Web: open a plain <input type="file"> (no permissions)
//      - Mobile: use expo-image-picker (OS will handle permission prompt) */
//   const pickCover = async () => {
//   const res = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ['images'],
//     quality: 0.85,
//   });
//   if (!res.canceled) setCover(res.assets?.[0] || null);
// };

//   const validate = () => {
//     const e = {};
//     if (!cover && !initial?.cover_url) e.cover = "Please add a cover picture";
//     if (title.trim().length < 3) e.title = "Min 3 characters";
//     if (desc.trim().length < 10) e.desc = "Min 10 characters";
//     if (!city) e.city = "Select a city";
//     if (!budget) e.budget = "Select a budget";
//     if (!stylePref) e.stylePref = "Select a travel style";
//     if (!startDateText.trim()) e.startDateText = "Pick a start date";
//     if (!endDateText.trim()) e.endDateText = "Pick an end date";

//     if (startDateText && endDateText && looksISODate(startDateText) && looksISODate(endDateText)) {
//       const sd = toDate(startDateText);
//       const ed = toDate(endDateText);
//       if (ed < sd) e.endDateText = "End date must be after start date";
//     }

//     if (days.length === 0) e.days = "Add at least one day";
//     days.forEach((d, i) => {
//       if (!d.place) e[`day${i}.place`] = "Choose a place";
//       else if (!cityPlaces.includes(d.place)) e[`day${i}.place`] = `Must be in ${city}`;
//       if ((d.activities || "").trim().length < 5) e[`day${i}.activities`] = "Add a short note";
//     });

//     setErrors(e);
//     return e;
//   };

//   const canSubmit =
//     (cover || initial?.cover_url) &&
//     title.trim().length >= 3 &&
//     desc.trim().length >= 10 &&
//     city &&
//     budget &&
//     stylePref &&
//     startDateText.trim() &&
//     endDateText.trim() &&
//     days.length > 0 &&
//     days.every((d) => d.place && (d.activities || "").trim().length >= 5);

//   // ======= helper to fetch user id from storage =======
//   const getUserIdForUpload = async () => {
//     const candidateKeys = ["user_id", "userId", "id", "USER_ID", "currentUser", "user", "profile"];
//     for (const k of candidateKeys) {
//       const val = await AsyncStorage.getItem(k);
//       if (!val) continue;
//       try {
//         const maybeObj = JSON.parse(val);
//         if (maybeObj && typeof maybeObj === "object") {
//           if (maybeObj.user_id != null) return String(maybeObj.user_id);
//           if (maybeObj.id != null) return String(maybeObj.id);
//           if (maybeObj.userId != null) return String(maybeObj.userId);
//         } else if (String(val).trim()) {
//           return String(val).trim();
//         }
//       } catch {
//         if (String(val).trim()) return String(val).trim();
//       }
//     }
//     return null;
//   };

//   // ======= robust multipart upload (native + web) =======
//   const uploadCoverIfNeeded = async (token) => {
//     if (!cover?.uri || /^https?:\/\//i.test(cover.uri)) {
//       return initial?.cover_url || "";
//     }

//     const userId = await getUserIdForUpload();
//     if (!userId) {
//       showMsg("Not logged in", "Cannot find your user ID. Please log in again.");
//       return null;
//     }

//     const endpoint = `${API_BASE}/asset/${encodeURIComponent(userId)}`;
//     const form = new FormData();

//     try {
//       if (IS_WEB) {
//         if (webFile) {
//           form.append("asset", webFile); // ✅ send the actual File chosen in browser
//         } else {
//           // Fallback: convert preview URL to blob (e.g., if webFile wasn't set for some reason)
//           const resp = await fetch(cover.uri);
//           const blob = await resp.blob();
//           const fname = `cover_${Date.now()}.${(blob.type || "image/jpeg").includes("png") ? "png" : "jpg"}`;
//           form.append("asset", new File([blob], fname, { type: blob.type || "image/jpeg" }));
//         }
//       } else {
//         const name = cover.fileName || cover.filename || `cover_${Date.now()}.jpg`;
//         const type = cover.mimeType || cover.type || "image/jpeg";
//         form.append("asset", { uri: cover.uri, name, type });
//       }

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 25000);

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`, // let fetch set multipart boundary
//         },
//         body: form,
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       const text = await res.text();
//       let json = null;
//       try {
//         json = text ? JSON.parse(text) : null;
//       } catch {}

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return null;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", json?.error || "Please complete your profile to continue.");
//         return null;
//       }
//       if (!res.ok) {
//         const msg = (json && (json.error || json.message)) || `Failed to upload image (HTTP ${res.status})`;
//         showMsg("Upload Error", msg);
//         return null;
//       }

//       const uploadedUrl = json?.url;
//       if (!uploadedUrl) {
//         showMsg("Upload Error", "Upload succeeded but no URL returned.");
//         return null;
//       }
//       return uploadedUrl;
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted ? "Image upload timed out. Please try again." : "Unable to upload the image. Check your connection.";
//       showMsg("Upload Error", msg);
//       return null;
//     }
//   };

//   const submit = async () => {
//     const e = validate();
//     if (Object.keys(e).length) {
//       scrollRef.current?.scrollTo({ y: 0, animated: true });
//       showMsg("Fix form", "Please fix the highlighted fields.");
//       return;
//     }
//     if (!itineraryId) {
//       showMsg("Error", "Missing itinerary ID.");
//       return;
//     }

//     const token = await getAuthToken();
//     if (!token) {
//       showMsg("Not logged in", "Please log in again to update your itinerary.");
//       return;
//     }

//     const coverUrlPre =
//       cover?.uri && /^https?:\/\//i.test(cover.uri) ? cover.uri : (initial?.cover_url || "");

//     let finalCoverUrl = coverUrlPre;
//     if (cover?.uri && !/^https?:\/\//i.test(cover.uri)) {
//       const uploaded = await uploadCoverIfNeeded(token);
//       if (!uploaded) return;
//       finalCoverUrl = uploaded;
//     }

//     const payload = {
//       title,
//       description: desc,
//       city,
//       budget,
//       style: stylePref,
//       start_date: startDateText,
//       end_date: endDateText,
//       cover_url: finalCoverUrl,
//       days: days.map((d, idx) => ({
//         day_number: d.day_number || idx + 1,
//         place: d.place,
//         start_time: d.startTime || "",
//         end_time: d.endTime || "",
//         activities: d.activities || "",
//       })),
//     };

//     try {
//       setSubmitting(true);

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 20000);

//       const url = `${API_BASE}/itineraries/${itineraryId}`;
//       let res;
//       try {
//         res = await fetch(url, {
//           method: "PUT",
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

//       const raw = await res.text();
//       let j = null;
//       try {
//         j = raw ? JSON.parse(raw) : null;
//       } catch {}

//       if (res.status === 401) {
//         showMsg("Session expired", "Please log in again.");
//         return;
//       }
//       if (res.status === 428) {
//         showMsg("Complete Profile", j?.error || "Please complete your profile to continue.");
//         return;
//       }
//       if (!res.ok) {
//         const friendly = {
//           400: "Invalid data. Please review the fields.",
//           403: "You don't have permission to do that.",
//           404: "Itinerary not found.",
//           413: "Image too large. Try a smaller cover image.",
//           415: "Unsupported data type.",
//           500: "Server error. Please try again.",
//           502: "Bad gateway.",
//           503: "Server unavailable.",
//           504: "Server timed out.",
//         };
//         const msg = j?.error || friendly[res.status] || `Failed to update itinerary (HTTP ${res.status})`;
//         showMsg("Error", msg);
//         return;
//       }

//       setShowSuccess(true);
//     } catch (err) {
//       const aborted = err?.name === "AbortError";
//       const msg = aborted
//         ? "Request timed out. Check your connection or API base URL."
//         : "Unable to reach the server. Check your connection or API base URL.";
//       console.log("Update itinerary network error:", err);
//       showMsg("Network Error", msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const onCloseSuccess = () => {
//     setShowSuccess(false);
//     goBack();
//   };

//   return (
//     <SafeAreaView style={[styles.safe, { paddingTop: IS_WEB ? 0 : insets.top }]}>
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={goBack} style={styles.backPill} accessibilityLabel="Back to Itineraries">
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backPillText}>Back to Itineraries</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Hidden file input for web (no permissions needed) */}
//       {IS_WEB && (
//         // @ts-ignore web-only
//         <input
//           ref={webInputRef}
//           type="file"
//           accept="image/*"
//           style={{ display: "none" }}
//           onChange={(e) => {
//             const f = e.target.files?.[0];
//             if (f) {
//               setWebFile(f);
//               const url = URL.createObjectURL(f);
//               setCover({ uri: url, name: f.name, type: f.type });
//             }
//           }}
//         />
//       )}

//       <ScrollView
//         ref={scrollRef}
//         style={styles.wrap}
//         contentContainerStyle={{ paddingBottom: IS_WEB ? 36 : 120 + insets.bottom }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.h1}>Edit Itinerary</Text>

//         {/* ------- Card: Basics ------- */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Basics</Text>

//           {/* Cover */}
//           <Text style={styles.label}>Cover Image</Text>
//           <View style={[styles.coverBox, errors.cover && styles.errBorder]}>
//             {cover?.uri ? (
//               <Image source={{ uri: cover.uri }} style={styles.coverImg} />
//             ) : initial?.cover_url ? (
//               <Image source={{ uri: initial.cover_url }} style={styles.coverImg} />
//             ) : (
//               <Text style={{ color: SUBTEXT }}>Tap “Pick Cover” to add a photo</Text>
//             )}
//             <TouchableOpacity style={styles.coverBtn} onPress={pickCover} accessibilityLabel="Pick cover image">
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

//           {/* Dates */}
//           <View style={styles.dateRow}>
//             <DateField label="Start Date" value={startDateText} onChange={setStartDateText} error={errors.startDateText} />
//             <DateField label="End Date" value={endDateText} onChange={setEndDateText} error={errors.endDateText} />
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

//                 <Text style={styles.smallLabel}>Place (in {city || "…"})</Text>
//                 <View
//                   style={[styles.pickerBox, errPlace && styles.errBorder, placeDisabled && { opacity: 0.6 }]}
//                   pointerEvents={placeDisabled ? "none" : "auto"}
//                 >
//                   <Picker style={styles.picker} selectedValue={d.place} onValueChange={(v) => updateDay(idx, { place: v })}>
//                     <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
//                     {cityPlaces.map((p) => (
//                       <Picker.Item key={p} label={p} value={p} />
//                     ))}
//                   </Picker>
//                 </View>
//                 {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

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

//         {/* Submit (WEB ONLY) */}
//         {IS_WEB && (
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </ScrollView>

//       {/* Floating footer submit (NATIVE ONLY) */}
//       {!IS_WEB && (
//         <View style={[styles.footer, { paddingBottom: 12 + insets.bottom }]}>
//           <TouchableOpacity
//             style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
//             onPress={submit}
//             disabled={!canSubmit || submitting}
//             accessibilityLabel="Update itinerary"
//           >
//             {submitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="save-outline" size={18} color="#fff" />
//                 <Text style={styles.submitText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Success modal */}
//       <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={onCloseSuccess}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <View className="modalIconCircle" style={styles.modalIconCircle}>
//               <Ionicons name="checkmark" size={36} color="#fff" />
//             </View>
//             <Text style={styles.modalTitle}>Itinerary Updated</Text>
//             <Text style={styles.modalText}>Your changes were saved successfully.</Text>
//             <TouchableOpacity style={styles.modalBtn} onPress={onCloseSuccess}>
//               <Text style={styles.modalBtnText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ========= Styles ========= */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#f7f9fc" },

//   headerBar: { paddingHorizontal: 12, paddingBottom: 8, backgroundColor: "#f7f9fc" },
//   backPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     alignSelf: "flex-start",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   backPillText: { fontWeight: "800", color: "#0f172a" },

//   wrap: { flex: 1, backgroundColor: "#f7f9fc", padding: 14 },
//   h1: { fontSize: 22, fontWeight: "800", color: "#003366", marginBottom: 10 },

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
//   cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
//   sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

//   label: { fontWeight: "700", color: "#0f172a", marginBottom: 6, marginTop: 6 },
//   smallLabel: { fontWeight: "600", color: "#0f172a", marginBottom: 6, marginTop: 6 },

//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   multiline: { minHeight: 84, textAlignVertical: "top" },

//   pickerBox: {
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
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
//     ...(IS_WEB ? { outlineStyle: "none" } : null),
//   },

//   dateRow: { flexDirection: "row", gap: 10, marginTop: 8 },

//   webDateInput: {
//     width: "100%",
//     height: 48,
//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     paddingLeft: 12,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     outline: "none",
//     marginBottom: 6,
//   },

//   dateBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
//     borderRadius: 10,
//     padding: 12,
//     backgroundColor: "#fff",
//     marginBottom: 6,
//   },

//   coverBox: {
//     height: 180,
//     borderWidth: 1,
//     borderColor: "#E6EDF7",
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
//     backgroundColor: "#003366",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   coverBtnText: { color: "#fff", fontWeight: "800" },

//   dayCard: {
//     borderWidth: 1,
//     borderColor: "#e9eef7",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
//   dayTitle: { fontWeight: "800", color: "#0f172a" },

//   row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
//   chip: { borderWidth: 1, borderColor: "#E6EDF7", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff" },
//   chipActive: { backgroundColor: "#003366", borderColor: "#003366" },
//   chipText: { fontWeight: "700", color: "#003366" },
//   chipTextActive: { color: "#fff", fontWeight: "800" },

//   addBtn: { borderWidth: 1, borderColor: "#003366", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
//   addBtnText: { color: "#003366", fontWeight: "800" },

//   // Footer submit (native only)
//   footer: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 0,
//     backgroundColor: "transparent",
//   },
//   submit: {
//     backgroundColor: "#0ea5e9",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//   },
//   submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   errText: { color: "#dc2626", marginBottom: 8 },
//   errBorder: { borderColor: "#dc2626" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   modalCard: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     alignItems: "center",
//   },
//   modalIconCircle: {
//     width: 64,
//     height: 64,
//     borderRadius: 999,
//     backgroundColor: "#16a34a",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 6, textAlign: "center" },
//   modalText: { color: "#374151", textAlign: "center", marginBottom: 16 },
//   modalBtn: { backgroundColor: "#0f172a", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
//   modalBtnText: { color: "#fff", fontWeight: "800" },
// });


import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
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
const IS_NATIVE = !IS_WEB;

/* ========= Cities → Destinations ========= */
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

const BORDER = "#E6EDF7";
const SUBTEXT = "#6B7280";

/* ===== helpers ===== */
const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const toDate = (s) => {
  const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
};
// Format a JS Date as YYYY-MM-DD in the user's local timezone (no UTC shift)
const fmtLocalYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const showMsg = (title, msg) => {
  if (IS_WEB) alert(`${title ? title + ": " : ""}${msg}`);
  else Alert.alert(title || "Notice", msg);
};

/* ===== DateField ===== */
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
            if (d) onChange(fmtLocalYMD(d));
          }}
        />
      )}
    </View>
  );
};

export default function EditItineraryScreen({ onBack }) {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  // Web-only hidden file input
  const webInputRef = useRef(null);
  const [webFile, setWebFile] = useState(null); // holds the real File on web

  // Back logic
  const goBack = () => {
    if (typeof onBack === "function") onBack();
    else if (navigation?.canGoBack()) navigation.goBack();
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, []);

  // prefill
  const initial = route.params?.itinerary || {};
  const itineraryId = route.params?.id ?? initial?.id ?? initial?._id;

  const [cover, setCover] = useState(initial?.cover_url ? { uri: initial.cover_url } : null);
  const [title, setTitle] = useState(initial?.title || "");
  const [desc, setDesc] = useState(initial?.description || "");
  const [city, setCity] = useState(initial?.city || "");
  const [budget, setBudget] = useState(initial?.budget || "");
  const [stylePref, setStylePref] = useState(initial?.style || "");
  const [startDateText, setStartDateText] = useState(
    initial?.start_date ? String(initial.start_date).slice(0, 10) : ""
  );
  const [endDateText, setEndDateText] = useState(
    initial?.end_date ? String(initial.end_date).slice(0, 10) : ""
  );
  const [days, setDays] = useState(() => {
    const src = Array.isArray(initial?.days) ? initial.days : [];
    if (!src.length) return [{ place: "", startTime: "", endTime: "", activities: "" }];
    return src.map((d, i) => ({
      place: d.place || "",
      startTime: d.start_time || "",
      endTime: d.end_time || "",
      activities: d.activities || "",
      day_number: d.day_number || i + 1,
    }));
  });

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

  /* ========= pickCover =========
     - Web: open a plain <input type="file"> (no permissions)
     - Mobile: use expo-image-picker (OS will handle permission prompt) */
  const pickCover = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (res.canceled) return;

    const a = res.assets?.[0];
    if (!a?.uri) {
      showMsg("Error", "Could not read the selected image.");
      return;
    }

    // normalize fields
    const filename =
      a.fileName || a.filename || `cover_${Date.now()}.${(a.type?.includes("png") || a.mimeType?.includes("png")) ? "png" : "jpg"}`;
    const mime =
      a.mimeType || (filename.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");

    // set local preview immediately
    setCover({
      uri: a.uri,
      fileName: filename,
      filename,
      type: mime,
      mimeType: mime,
    });

    // on native, trigger the asset upload API right away
    if (IS_NATIVE) {
      try {
        const token = await getAuthToken();
        if (!token) return;

        const userId = await (async () => {
          const keys = ["user_id", "userId", "id", "USER_ID", "currentUser", "user", "profile"];
          for (const k of keys) {
            const val = await AsyncStorage.getItem(k);
            if (!val) continue;
            try {
              const o = JSON.parse(val);
              if (o && typeof o === "object") {
                if (o.user_id != null) return String(o.user_id);
                if (o.id != null) return String(o.id);
                if (o.userId != null) return String(o.userId);
              } else if (String(val).trim()) {
                return String(val).trim();
              }
            } catch {
              if (String(val).trim()) return String(val).trim();
            }
          }
          return null;
        })();
        if (!userId) return;

        const form = new FormData();
        form.append("asset", { uri: a.uri, name: filename, type: mime });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const resUp = await fetch(`${API_BASE}/asset/${encodeURIComponent(userId)}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const txt = await resUp.text();
        let json = null;
        try { json = txt ? JSON.parse(txt) : null; } catch {}

        if (resUp.ok && json?.url) {
          // replace preview with remote URL so submit won't re-upload
          setCover({ uri: json.url });
        } else {
          // keep local preview; submit() will attempt upload again
          const msg = json?.error || `Failed to upload image (HTTP ${resUp.status})`;
          console.log("Mobile immediate upload error:", msg);
        }
      } catch (e) {
        console.log("Mobile immediate upload exception:", e);
      }
    }
  };

  const validate = () => {
    const e = {};
    if (!cover && !initial?.cover_url) e.cover = "Please add a cover picture";
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
    (cover || initial?.cover_url) &&
    title.trim().length >= 3 &&
    desc.trim().length >= 10 &&
    city &&
    budget &&
    stylePref &&
    startDateText.trim() &&
    endDateText.trim() &&
    days.length > 0 &&
    days.every((d) => d.place && (d.activities || "").trim().length >= 5);

  // ======= helper to fetch user id from storage =======
  const getUserIdForUpload = async () => {
    const candidateKeys = ["user_id", "userId", "id", "USER_ID", "currentUser", "user", "profile"];
    for (const k of candidateKeys) {
      const val = await AsyncStorage.getItem(k);
      if (!val) continue;
      try {
        const maybeObj = JSON.parse(val);
        if (maybeObj && typeof maybeObj === "object") {
          if (maybeObj.user_id != null) return String(maybeObj.user_id);
          if (maybeObj.id != null) return String(maybeObj.id);
          if (maybeObj.userId != null) return String(maybeObj.userId);
        } else if (String(val).trim()) {
          return String(val).trim();
        }
      } catch {
        if (String(val).trim()) return String(val).trim();
      }
    }
    return null;
  };

  // ======= robust multipart upload (native + web) =======
  const uploadCoverIfNeeded = async (token) => {
    if (!cover?.uri || /^https?:\/\//i.test(cover.uri)) {
      return initial?.cover_url || "";
    }

    const userId = await getUserIdForUpload();
    if (!userId) {
      showMsg("Not logged in", "Cannot find your user ID. Please log in again.");
      return null;
    }

    const endpoint = `${API_BASE}/asset/${encodeURIComponent(userId)}`;
    const form = new FormData();

    try {
      if (IS_WEB) {
        if (webFile) {
          form.append("asset", webFile);
        } else {
          const resp = await fetch(cover.uri);
          const blob = await resp.blob();
          const fname = `cover_${Date.now()}.${(blob.type || "image/jpeg").includes("png") ? "png" : "jpg"}`;
          form.append("asset", new File([blob], fname, { type: blob.type || "image/jpeg" }));
        }
      } else {
        const name = cover.fileName || cover.filename || `cover_${Date.now()}.jpg`;
        const type = cover.mimeType || cover.type || "image/jpeg";
        form.append("asset", { uri: cover.uri, name, type });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {}

      if (res.status === 401) {
        showMsg("Session expired", "Please log in again.");
        return null;
      }
      if (res.status === 428) {
        showMsg("Complete Profile", json?.error || "Please complete your profile to continue.");
        return null;
      }
      if (!res.ok) {
        const msg = (json && (json.error || json.message)) || `Failed to upload image (HTTP ${res.status})`;
        showMsg("Upload Error", msg);
        return null;
      }

      const uploadedUrl = json?.url;
      if (!uploadedUrl) {
        showMsg("Upload Error", "Upload succeeded but no URL returned.");
        return null;
      }
      return uploadedUrl;
    } catch (err) {
      const aborted = err?.name === "AbortError";
      const msg = aborted ? "Image upload timed out. Please try again." : "Unable to upload the image. Check your connection.";
      showMsg("Upload Error", msg);
      return null;
    }
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      showMsg("Fix form", "Please fix the highlighted fields.");
      return;
    }
    if (!itineraryId) {
      showMsg("Error", "Missing itinerary ID.");
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      showMsg("Not logged in", "Please log in again to update your itinerary.");
      return;
    }

    const coverUrlPre =
      cover?.uri && /^https?:\/\//i.test(cover.uri) ? cover.uri : (initial?.cover_url || "");

    let finalCoverUrl = coverUrlPre;
    if (cover?.uri && !/^https?:\/\//i.test(cover.uri)) {
      const uploaded = await uploadCoverIfNeeded(token);
      if (!uploaded) return;
      finalCoverUrl = uploaded;
    }

    const payload = {
      title,
      description: desc,
      city,
      budget,
      style: stylePref,
      start_date: startDateText,
      end_date: endDateText,
      cover_url: finalCoverUrl,
      days: days.map((d, idx) => ({
        day_number: d.day_number || idx + 1,
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

      const url = `${API_BASE}/itineraries/${itineraryId}`;
      let res;
      try {
        res = await fetch(url, {
          method: "PUT",
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
          404: "Itinerary not found.",
          413: "Image too large. Try a smaller cover image.",
          415: "Unsupported data type.",
          500: "Server error. Please try again.",
          502: "Bad gateway.",
          503: "Server unavailable.",
          504: "Server timed out.",
        };
        const msg = j?.error || friendly[res.status] || `Failed to update itinerary (HTTP ${res.status})`;
        showMsg("Error", msg);
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      const aborted = err?.name === "AbortError";
      const msg = aborted
        ? "Request timed out. Check your connection or API base URL."
        : "Unable to reach the server. Check your connection or API base URL.";
      console.log("Update itinerary network error:", err);
      showMsg("Network Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onCloseSuccess = () => {
    setShowSuccess(false);
    goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: IS_WEB ? 0 : insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={goBack} style={styles.backPill} accessibilityLabel="Back to Itineraries">
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backPillText}>Back to Itineraries</Text>
        </TouchableOpacity>
      </View>

      {/* Hidden file input for web (no permissions needed) */}
      {IS_WEB && (
        // @ts-ignore web-only
        <input
          ref={webInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setWebFile(f);
              const url = URL.createObjectURL(f);
              setCover({ uri: url, name: f.name, type: f.type });
            }
          }}
        />
      )}

      <ScrollView
        ref={scrollRef}
        style={styles.wrap}
        contentContainerStyle={{ paddingBottom: IS_WEB ? 36 : 120 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.h1}>Edit Itinerary</Text>

        {/* ------- Card: Basics ------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basics</Text>

          {/* Cover */}
          <Text style={styles.label}>Cover Image</Text>
          <View style={[styles.coverBox, errors.cover && styles.errBorder]}>
            {cover?.uri ? (
              <Image source={{ uri: cover.uri }} style={styles.coverImg} />
            ) : initial?.cover_url ? (
              <Image source={{ uri: initial.cover_url }} style={styles.coverImg} />
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
                <View
                  style={[styles.pickerBox, errPlace && styles.errBorder, placeDisabled && { opacity: 0.6 }]}
                  pointerEvents={placeDisabled ? "none" : "auto"}
                >
                  <Picker style={styles.picker} selectedValue={d.place} onValueChange={(v) => updateDay(idx, { place: v })}>
                    <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
                    {cityPlaces.map((p) => (
                      <Picker.Item key={p} label={p} value={p} />
                    ))}
                  </Picker>
                </View>
                {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

                <Text style={styles.smallLabel}>Start Time (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 9am or 09:00"
                  value={d.startTime}
                  onChangeText={(t) => updateDay(idx, { startTime: t })}
                />
                <Text style={styles.smallLabel}>End Time (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., evening or 17:00"
                  value={d.endTime}
                  onChangeText={(t) => updateDay(idx, { endTime: t })}
                />

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

        {/* Submit (WEB ONLY) */}
        {IS_WEB && (
          <TouchableOpacity
            style={[styles.submit, (!canSubmit || submitting) && { opacity: 0.6 }]}
            onPress={submit}
            disabled={!canSubmit || submitting}
            accessibilityLabel="Update itinerary"
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text style={styles.submitText}>Save Changes</Text>
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
            accessibilityLabel="Update itinerary"
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text style={styles.submitText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Success modal */}
      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={onCloseSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View className="modalIconCircle" style={styles.modalIconCircle}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Itinerary Updated</Text>
            <Text style={styles.modalText}>Your changes were saved successfully.</Text>
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
    borderColor: "#E6EDF7",
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
  h1: { fontSize: 22, fontWeight: "800", color: "#003366", marginBottom: 10 },

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
    borderColor: "#E6EDF7",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  multiline: { minHeight: 84, textAlignVertical: "top" },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#E6EDF7",
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
    borderColor: "#E6EDF7",
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
    borderColor: "#E6EDF7",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 6,
  },

  coverBox: {
    height: 180,
    borderWidth: 1,
    borderColor: "#E6EDF7",
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
    backgroundColor: "#003366",
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
  chip: { borderWidth: 1, borderColor: "#E6EDF7", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff" },
  chipActive: { backgroundColor: "#003366", borderColor: "#003366" },
  chipText: { fontWeight: "700", color: "#003366" },
  chipTextActive: { color: "#fff", fontWeight: "800" },

  addBtn: { borderWidth: 1, borderColor: "#003366", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
  addBtnText: { color: "#003366", fontWeight: "800" },

  // Footer submit (native only)
  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: "transparent",
  },
  submit: {
    backgroundColor: "#0ea5e9",
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
  modalBtn: { backgroundColor: "#0f172a", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  modalBtnText: { color: "#fff", fontWeight: "800" },
});
