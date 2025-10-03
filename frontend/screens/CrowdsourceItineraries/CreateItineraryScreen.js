

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
const IS_NATIVE = !IS_WEB;

/* ========= Inline Cities → Destinations JSON (your data) ========= */
const PLACES_BY_CITY = {
  Abbottabad: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
  Galiyat: ["Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"],
  Bagh: ["Ganga Choti", "Lasdana"],
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
const SOFT_BG = "#F7F9FC";
const EMPHASIS = "#0f172a";

/* ===== helpers ===== */
const looksISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const toDate = (s) => {
  const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
};
const showMsg = (title, msg) => {
  if (IS_WEB) alert(`${title ? title + ": " : ""}${msg}`);
  else Alert.alert(title || "Notice", msg);
};
const inListCI = (arr, v) => {
  if (!v) return false;
  const needle = String(v).trim().toLowerCase();
  return arr.some((x) => String(x).trim().toLowerCase() === needle);
};
const MIN_CUSTOM_LEN = 2;

/* ===== Cross-platform DateField (stacked) ===== */
const DateField = ({ label, value, onChange, error }) => {
  if (IS_WEB) {
    return (
      <View style={{ flex: 1, marginBottom: 10 }}>
        <Text style={styles.smallLabel}>{label}</Text>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div style={styles.iconInputWrap}>
          <Ionicons name="calendar-outline" size={16} color={EMPHASIS} style={{ marginLeft: 10 }} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={{
              ...styles.webDateInput,
              borderColor: error ? "#dc2626" : BORDER,
            }}
          />
        </div>
        {error ? <Text style={styles.errText}>{error}</Text> : null}
      </View>
    );
  }
  const [show, setShow] = useState(false);
  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <Text style={styles.smallLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.dateBtn, error && styles.errBorder]}
        onPress={() => setShow(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="calendar-outline" size={18} color={EMPHASIS} />
        <Text style={{ marginLeft: 8 }}>{value || "YYYY-MM-DD"}</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errText}>{error}</Text> : null}
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
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

/* ===== Cross-platform TimeField (clock picker) ===== */
const formatHHMM = (d) => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};
const TimeField = ({ label, value, onChange }) => {
  if (IS_WEB) {
    return (
      <View style={{ flex: 1, marginBottom: 10 }}>
        <Text style={styles.smallLabel}>{label}</Text>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div style={styles.iconInputWrap}>
          <Ionicons name="time-outline" size={16} color={EMPHASIS} style={{ marginLeft: 10 }} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <input
            type="time"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={styles.webTimeInput}
          />
        </div>
      </View>
    );
  }
  const [show, setShow] = useState(false);
  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <Text style={styles.smallLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShow(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="time-outline" size={18} color={EMPHASIS} />
        <Text style={{ marginLeft: 8 }}>{value || "HH:MM"}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "clock"}
          onChange={(event, d) => {
            setShow(false);
            if (event?.type === "dismissed") return;
            if (d) onChange(formatHHMM(d));
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

  // Web-only hidden file input (optional)
  const webInputRef = useRef(null);
  const [webFile, setWebFile] = useState(null);

  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [stylePref, setStylePref] = useState("");
  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");

  // Days now include `customPlace` + time strings (HH:MM)
  const [days, setDays] = useState([{ place: "", customPlace: "", startTime: "", endTime: "", activities: "" }]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cityPlaces = useMemo(() => (city ? PLACES_BY_CITY[city] || [] : []), [city]);

  const addDay = () =>
    setDays((p) => [...p, { place: "", customPlace: "", startTime: "", endTime: "", activities: "" }]);

  const removeDay = (idx) => setDays((p) => p.filter((_, i) => i !== idx));

  const updateDay = (idx, patch) =>
    setDays((p) => {
      const next = [...p];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });

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
    if (!cover?.uri || /^https?:\/\//i.test(cover.uri)) return "";

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
        headers: { Authorization: `Bearer ${token}` },
        body: form,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await res.text();
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch {}

      if (res.status === 401) { showMsg("Session expired", "Please log in again."); return null; }
      if (res.status === 428) { showMsg("Complete Profile", json?.error || "Please complete your profile to continue."); return null; }
      if (!res.ok) { showMsg("Upload Error", (json && (json.error || json.message)) || `Failed to upload image (HTTP ${res.status})`); return null; }

      const uploadedUrl = json?.url;
      if (!uploadedUrl) { showMsg("Upload Error", "Upload succeeded but no URL returned."); return null; }
      return uploadedUrl;
    } catch (err) {
      const aborted = err?.name === "AbortError";
      showMsg("Upload Error", aborted ? "Image upload timed out. Please try again." : "Unable to upload the image. Check your connection.");
      return null;
    }
  };

  // ======= pickCover =======
  const pickCover = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: false,
    });
    if (res.canceled) return;

    const a = res.assets?.[0];
    if (!a?.uri) { showMsg("Error", "Could not read the selected image."); return; }

    const filename =
      a.fileName || a.filename || `cover_${Date.now()}.${(a.type?.includes("png") || a.mimeType?.includes("png")) ? "png" : "jpg"}`;
    const mime = a.mimeType || (filename.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");

    setCover({ uri: a.uri, fileName: filename, filename, type: mime, mimeType: mime });

    if (IS_NATIVE) {
      try {
        const token = await getAuthToken();
        if (!token) return;
        const userId = await getUserIdForUpload();
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

        if (resUp.ok && json?.url) setCover({ uri: json.url });
      } catch {}
    }
  };

  // ======= validation =======
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
      const custom = (d.customPlace || "").trim();

      // cannot have curated and custom simultaneously
      if (custom && d.place) {
        e[`day${i}.place`] = "Pick from list OR type a custom place (not both)";
      }

      if (custom.length >= MIN_CUSTOM_LEN) {
        // custom ok
      } else {
        if (!d.place) e[`day${i}.place`] = "Choose a place or type a custom place";
        else if (!inListCI(cityPlaces, d.place))
          e[`day${i}.place`] = `Pick from list or type a custom place in ${city}`;
      }
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
    days.every((d) => {
      const custom = (d.customPlace || "").trim();
      const hasCustom = custom.length >= MIN_CUSTOM_LEN;
      const hasCurated = !!d.place;
      // mutual exclusivity
      if (hasCustom && hasCurated) return false;
      if (hasCustom) return (d.activities || "").trim().length >= 5;
      return hasCurated && inListCI(cityPlaces, d.place) && (d.activities || "").trim().length >= 5;
    });

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      showMsg("Fix form", "Please fix the highlighted fields.");
      return;
    }

    const token = await getAuthToken();
    if (!token) { showMsg("Not logged in", "Please log in again to submit an itinerary."); return; }

    let finalCoverUrl = cover?.uri && /^https?:\/\//i.test(cover.uri) ? cover.uri : "";
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
      days: days.map((d, idx) => {
        const custom = (d.customPlace || "").trim();
        const placeValue = custom.length >= MIN_CUSTOM_LEN ? custom : d.place;
        return {
          day_number: idx + 1,
          place: placeValue,
          start_time: d.startTime || "",
          end_time: d.endTime || "",
          activities: d.activities || "",
        };
      }),
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
      try { j = raw ? JSON.parse(raw) : null; } catch {}

      if (res.status === 401) { showMsg("Session expired", "Please log in again."); return; }
      if (res.status === 428) { showMsg("Complete Profile", j?.error || "Please complete your profile to continue."); return; }
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
        showMsg("Error", j?.error || friendly[res.status] || `Failed to save itinerary (HTTP ${res.status})`);
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      const aborted = err?.name === "AbortError";
      showMsg("Network Error", aborted ? "Request timed out. Check your connection or API base URL." : "Unable to reach the server. Check your connection or API base URL.");
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
    setDays([{ place: "", customPlace: "", startTime: "", endTime: "", activities: "" }]);
    goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: IS_WEB ? 0 : insets.top }]}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={goBack} style={styles.backPill} accessibilityLabel="Back to Itineraries">
          <Ionicons name="arrow-back" size={18} color={EMPHASIS} />
          <Text style={styles.backPillText}>Back to Itineraries</Text>
        </TouchableOpacity>
      </View>

      {/* Hidden file input for web (optional) */}
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
              <View style={{ alignItems: "center" }}>
                <Ionicons name="image-outline" size={20} color={SUBTEXT} />
                <Text style={{ color: SUBTEXT, marginTop: 6 }}>Tap “Pick Cover” to add a photo</Text>
              </View>
            )}
            <TouchableOpacity style={styles.coverBtn} onPress={pickCover} accessibilityLabel="Pick cover image">
              <Ionicons name="images-outline" size={16} color="#fff" />
              <Text style={styles.coverBtnText}>Pick Cover</Text>
            </TouchableOpacity>
          </View>
          {errors.cover && <Text style={styles.errText}>{errors.cover}</Text>}

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <View style={styles.iconInputWrap}>
            <Ionicons name="pricetag-outline" size={16} color={EMPHASIS} style={{ marginLeft: 10 }} />
            <TextInput
              style={[styles.input, styles.inputNoMargin, errors.title && styles.errBorder]}
              placeholder="e.g., 3 Days in Hunza"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          {errors.title && <Text style={styles.errText}>{errors.title}</Text>}

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <View style={styles.iconInputWrap}>
            <Ionicons name="document-text-outline" size={16} color={EMPHASIS} style={{ marginLeft: 10, alignSelf: "flex-start", marginTop: 12 }} />
            <TextInput
              style={[styles.input, styles.multiline, errors.desc && styles.errBorder]}
              placeholder="Short overview of your trip…"
              value={desc}
              onChangeText={setDesc}
              multiline
            />
          </View>
          {errors.desc && <Text style={styles.errText}>{errors.desc}</Text>}

          {/* City */}
          <Text style={styles.label}>City</Text>
          <View style={[styles.pickerBox, errors.city && styles.errBorder]}>
            <Picker
              mode={Platform.OS === "android" ? "dropdown" : undefined}
              style={styles.picker}
              selectedValue={city}
              onValueChange={(v) => {
                setCity(v);
                setDays((prev) => prev.map((d) => ({ ...d, place: "", customPlace: "" })));
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

          {/* Dates (STACKED) */}
          <DateField label="Start Date" value={startDateText} onChange={setStartDateText} error={errors.startDateText} />
          <DateField label="End Date" value={endDateText} onChange={setEndDateText} error={errors.endDateText} />
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
            const hasCustom = (d.customPlace || "").trim().length >= MIN_CUSTOM_LEN;

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

                {/* Dropdown (curated) */}
                <Text style={styles.smallLabel}>Places in {city || "…"} (popular)</Text>
                <View
                  style={[
                    styles.pickerBox,
                    errPlace && styles.errBorder,
                    placeDisabled && { opacity: 0.6 },
                    hasCustom && { opacity: 0.45 },
                  ]}
                  pointerEvents={placeDisabled || hasCustom ? "none" : "auto"}
                >
                  <Picker
                    style={styles.picker}
                    selectedValue={d.place}
                    onValueChange={(v) => updateDay(idx, { place: v, customPlace: "" })}
                  >
                    <Picker.Item label={city ? "Select Place" : "Select City first"} value="" />
                    {cityPlaces.map((p) => (
                      <Picker.Item key={p} label={p} value={p} />
                    ))}
                  </Picker>
                </View>
                {errPlace && <Text style={styles.errText}>{errPlace}</Text>}

                {/* Custom override input */}
                <Text style={[styles.smallLabel, { marginTop: 4 }]}>
                  Or type a custom place {city ? `in ${city}` : ""}
                </Text>
                <View style={[styles.iconInputWrap, d.place ? { opacity: 0.45 } : null]}>
                  <Ionicons name="create-outline" size={16} color={EMPHASIS} style={{ marginLeft: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder={
                      !city
                        ? "Select a city first"
                        : d.place
                        ? "Clear selected place to type custom"
                        : `e.g., Hidden café in ${city}`
                    }
                    value={d.customPlace}
                    editable={!!city && !d.place}
                    onChangeText={(t) => {
                      const trimmed = t.trim();
                      if (!trimmed.length) {
                        updateDay(idx, { customPlace: "", place: "" });
                        return;
                      }
                      if (inListCI(cityPlaces, trimmed)) {
                        // switch to curated; clear custom
                        updateDay(idx, { place: trimmed, customPlace: "" });
                      } else {
                        // custom text takes over; clear curated selection
                        updateDay(idx, { customPlace: t, place: "" });
                      }
                    }}
                  />
                </View>

                {/* Time pickers (clock UI) */}
                <View style={{ flexDirection: "column", gap: 6, marginTop: 2 }}>
                  <TimeField
                    label="Start Time (optional)"
                    value={d.startTime}
                    onChange={(t) => updateDay(idx, { startTime: t })}
                  />
                  <TimeField
                    label="End Time (optional)"
                    value={d.endTime}
                    onChange={(t) => updateDay(idx, { endTime: t })}
                  />
                </View>

                {/* Activities */}
                <Text style={styles.smallLabel}>Activities / Notes</Text>
                <View style={styles.iconInputWrap}>
                  <Ionicons name="list-circle-outline" size={18} color={EMPHASIS} style={{ marginLeft: 10, alignSelf: "flex-start", marginTop: 12 }} />
                  <TextInput
                    style={[styles.input, styles.multiline, errAct && styles.errBorder]}
                    placeholder="Short plan for the day…"
                    value={d.activities}
                    onChangeText={(v) => updateDay(idx, { activities: v })}
                    multiline
                  />
                </View>
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
  safe: { flex: 1, backgroundColor: SOFT_BG },

  headerBar: { paddingHorizontal: 12, paddingBottom: 8, backgroundColor: SOFT_BG },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
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
  backPillText: { fontWeight: "800", color: EMPHASIS },

  wrap: { flex: 1, backgroundColor: SOFT_BG, padding: 14 },
  h1: { fontSize: Platform.select({ ios: 22, android: 22, web: 24 }), fontWeight: "800", color: PRIMARY, marginBottom: 10 },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  sectionTitle: { fontSize: Platform.select({ ios: 16, android: 16, web: 18 }), fontWeight: "800", color: EMPHASIS },

  label: { fontWeight: "700", color: EMPHASIS, marginBottom: 6, marginTop: 6 },
  smallLabel: { fontWeight: "600", color: EMPHASIS, marginBottom: 6, marginTop: 6, fontSize: Platform.select({ ios: 14, android: 14, web: 15 }) },

  iconInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: Platform.select({ ios: 10, android: 10, web: 12 }),
    paddingHorizontal: 12,
    fontSize: Platform.select({ ios: 15, android: 15, web: 16 }),
    marginBottom: 10,
    borderWidth: 0,
  },
  inputNoMargin: { marginBottom: 0 },

  multiline: { minHeight: 84, textAlignVertical: "top" },

  pickerBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    height: Platform.select({ android: 52, ios: 48, web: 48 }),
    justifyContent: "center",
    ...(Platform.OS === "android" ? { overflow: "visible" } : { overflow: "hidden" }),
  },
  picker: {
    height: Platform.select({ android: 52, ios: 44, web: 48 }),
    width: "100%",
    fontSize: 16,
    color: EMPHASIS,
    paddingHorizontal: 10,
    ...(Platform.OS === "android" ? { paddingVertical: 0, marginVertical: 0 } : null),
    ...(IS_WEB ? { outlineStyle: "none" } : null),
  },

  // WEB date/time inputs
  webDateInput: {
    width: "100%",
    height: 48,
    borderWidth: 0,
    borderRadius: 12,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    outline: "none",
  },
  webTimeInput: {
    width: "100%",
    height: 48,
    borderWidth: 0,
    borderRadius: 12,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    outline: "none",
  },

  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 6,
  },

  coverBox: {
    height: 180,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
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
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  dayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  dayTitle: { fontWeight: "800", color: EMPHASIS },

  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderColor: BORDER, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff" },
  chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontWeight: "700", color: PRIMARY },
  chipTextActive: { color: "#fff", fontWeight: "800" },

  addBtn: { borderWidth: 1, borderColor: PRIMARY, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#fff" },
  addBtnText: { color: PRIMARY, fontWeight: "800" },

  // Footer submit (native only)
  footer: { position: "absolute", left: 16, right: 16, bottom: 0, backgroundColor: "transparent" },
  submit: {
    backgroundColor: "#16a34a",
    borderRadius: 14,
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
  modalTitle: { fontSize: 18, fontWeight: "800", color: EMPHASIS, marginBottom: 6, textAlign: "center" },
  modalText: { color: "#374151", textAlign: "center", marginBottom: 16 },
  modalBtn: { backgroundColor: EMPHASIS, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  modalBtnText: { color: "#fff", fontWeight: "800" },
});
