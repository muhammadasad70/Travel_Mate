
// // screens/ItineraryDetailScreen.js
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
//   Platform, ActivityIndicator, Alert, Pressable
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// /* 🔹 NEW: offline hook */
// import { downloadItinerary } from "../../hooks/useOfflineItineraries";

// /* same base/url style as your other screens */
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

// const BORDER = "#E6EDF7";
// const PRIMARY = "#003366";
// const SUBTEXT = "#6B7280";
// const EMPHASIS = "#0f172a";
// const SOFT_BG = "#F7F9FC";

// function formatRange(start, end) {
//   if (!start || !end) return "Dates TBD";
//   try {
//     const s = new Date(start);
//     const e = new Date(end);
//     const sameYear = s.getFullYear() === e.getFullYear();
//     const fmtS = new Intl.DateTimeFormat("en-US", {
//       month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" })
//     });
//     const fmtE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
//     return `${fmtS.format(s)} – ${fmtE.format(e)}`;
//   } catch { return "Dates TBD"; }
// }

// export default function ItineraryDetailScreen() {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const route = useRoute();

//   // you can pass either {id} or the whole {itinerary}; we’ll refetch by id if we can
//   const passed = route.params?.itinerary || {};
//   const id = route.params?.id || passed?.id || passed?._id;

//   const [data, setData] = useState(passed || null);
//   const [loading, setLoading] = useState(!passed?.days?.length);
//   const [imgError, setImgError] = useState(false);

//   useEffect(() => {
//     navigation.setOptions?.({ title: "Itinerary" });
//   }, [navigation]);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (!id) return; // fallback to passed data
//       try {
//         setLoading(true);
//         const token = await getAuthToken();
//         const res = await fetch(`${API_BASE}/itineraries/${id}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//         });
//         const raw = await res.text();
//         let j = null; try { j = raw ? JSON.parse(raw) : null; } catch {}
//         if (!cancelled) {
//           if (res.ok && j) setData(j);
//           else if (!passed) Alert.alert("Error", j?.error || "Unable to load itinerary.");
//         }
//       } catch (e) {
//         if (!cancelled && !passed) Alert.alert("Network", "Failed to load itinerary.");
//       } finally { !cancelled && setLoading(false); }
//     })();
//     return () => { cancelled = true; };
//   }, [id]);

//   if (!data && loading) {
//     return (
//       <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
//         <View style={styles.centerFill}><ActivityIndicator /></View>
//       </SafeAreaView>
//     );
//   }
//   if (!data) {
//     return (
//       <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
//         <View style={styles.centerFill}><Text>Itinerary not found.</Text></View>
//       </SafeAreaView>
//     );
//   }

//   const { title, cover_url, city, style, budget, start_date, end_date, description, days = [] } = data;

//   /* 🔹 Download current itinerary for offline (cover/map are optional) */
//   const handleDownloadOffline = async () => {
//     try {
//       const normalized = { ...data, id: data.id ?? data._id };
//       await downloadItinerary({
//         itinerary: data,
//         coverUrl: cover_url || null,
//         staticMapUrl: null, // OK to keep null for now
//       });
//       Alert.alert(
//         "Saved for offline",
//         Platform.OS === "web"
//           ? "Stored in browser storage for demo."
//           : "Find it in Profile → Offline."
//       );
//     } catch (e) {
//       Alert.alert("Download failed", "Please try again.");
//     }
//   };

//   return (
//     <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "web" ? 0 : insets.top }]}>
//       <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}>
//         {/* Back */}
//         <TouchableOpacity style={styles.backPill} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={18} color={EMPHASIS} />
//           <Text style={styles.backPillText}>Back</Text>
//         </TouchableOpacity>

//         {/* Cover */}
//         <View style={styles.coverBox}>
//           {cover_url && !imgError ? (
//             <Image source={{ uri: cover_url }} style={styles.coverImg} onError={() => setImgError(true)} />
//           ) : (
//             <View style={[styles.coverImg, { backgroundColor: "#eef2f7" }]} />
//           )}
//           <View style={styles.badges}>
//             {style ? (
//               <View style={[styles.badge, styles.badgeDark]}>
//                 <Ionicons name="sparkles-outline" size={12} color="#fff" />
//                 <Text style={[styles.badgeText, { color: "#fff" }]}>{style}</Text>
//               </View>
//             ) : null}
//             {budget ? (
//               <View style={[styles.badge, styles.badgeLight]}>
//                 <Ionicons name="pricetag-outline" size={12} color={PRIMARY} />
//                 <Text style={[styles.badgeText, { color: PRIMARY }]}>{budget}</Text>
//               </View>
//             ) : null}
//           </View>
//         </View>

//         {/* Title & meta */}
//         <Text style={styles.h1}>{title || "Untitled Itinerary"}</Text>

//         <View style={styles.metaRow}>
//           <View style={styles.metaItem}>
//             <Ionicons name="location-outline" size={16} color={SUBTEXT} />
//             <Text style={styles.metaText}>{city || "—"}</Text>
//           </View>
//           <View style={styles.metaItem}>
//             <Ionicons name="calendar-outline" size={16} color={SUBTEXT} />
//             <Text style={styles.metaText}>{formatRange(start_date, end_date)}</Text>
//           </View>
//           <View style={styles.metaItem}>
//             <Ionicons name="time-outline" size={16} color={SUBTEXT} />
//             <Text style={styles.metaText}>{Array.isArray(days) ? `${days.length} day(s)` : "—"}</Text>
//           </View>
//         </View>

//         {/* 🔹 Download for Offline button */}
//         <View style={{ paddingHorizontal: 4, marginTop: 4 }}>
//           <Pressable
//             onPress={handleDownloadOffline}
//             style={{
//               backgroundColor: PRIMARY,
//               paddingVertical: 12,
//               paddingHorizontal: 14,
//               borderRadius: 12,
//               alignSelf: "flex-start",
//               flexDirection: "row",
//               alignItems: "center",
//               gap: 8,
//             }}
//           >
//             <Ionicons name="cloud-download-outline" size={18} color="#fff" />
//             <Text style={{ color: "#fff", fontWeight: "800" }}>Download for Offline</Text>
//           </Pressable>
//         </View>

//         {/* Description */}
//         {description ? (
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Overview</Text>
//             <Text style={styles.desc}>{description}</Text>
//           </View>
//         ) : null}

//         {/* All days */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Daily Plan</Text>
//           {(!days || days.length === 0) && <Text style={styles.empty}>No days added yet.</Text>}

//           {days
//             .slice()
//             .sort((a,b) => (a.day_number||0)-(b.day_number||0))
//             .map((d, idx) => {
//               const place = d.place || d.Place || "—";
//               const st = d.start_time || d.StartTime || "";
//               const et = d.end_time || d.EndTime || "";
//               const act = d.activities || d.Activities || "";

//               return (
//                 <View key={`${idx}-${place}`} style={styles.dayCard}>
//                   <View style={styles.dayHeader}>
//                     <Text style={styles.dayTitle}>Day {d.day_number || idx + 1}</Text>
//                     <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
//                       {st ? (<View style={styles.timeChip}><Ionicons name="time-outline" size={12} color={PRIMARY} /><Text style={styles.timeChipText}>{st}</Text></View>) : null}
//                       {et ? (<View style={styles.timeChip}><Ionicons name="time-outline" size={12} color={PRIMARY} /><Text style={styles.timeChipText}>{et}</Text></View>) : null}
//                     </View>
//                   </View>

//                   <View style={styles.row}>
//                     <Ionicons name="location-outline" size={16} color={PRIMARY} />
//                     <Text style={styles.place}>{place}</Text>
//                   </View>

//                   {act ? (
//                     <>
//                       <Text style={styles.smallLabel}>Activities / Notes</Text>
//                       <Text style={styles.activities}>{act}</Text>
//                     </>
//                   ) : null}
//                 </View>
//               );
//             })}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: SOFT_BG },
//   wrap: { flex: 1, padding: 14 },

//   backPill: {
//     alignSelf: "flex-start",
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: BORDER,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginBottom: 10,
//   },
//   backPillText: { fontWeight: "800", color: EMPHASIS },

//   coverBox: { height: 200, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: BORDER, backgroundColor: "#fff" },
//   coverImg: { width: "100%", height: "100%", resizeMode: "cover" },
//   badges: { position: "absolute", left: 10, bottom: 10, flexDirection: "row", gap: 6 },
//   badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
//   badgeDark: { backgroundColor: PRIMARY, borderColor: PRIMARY },
//   badgeLight: { backgroundColor: "#fff", borderColor: BORDER },
//   badgeText: { fontSize: 12, fontWeight: "700" },

//   h1: { fontSize: Platform.select({ web: 22, default: 20 }), fontWeight: "800", color: EMPHASIS, marginTop: 10, marginBottom: 6 },

//   metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 10 },
//   metaItem: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10 },
//   metaText: { color: EMPHASIS, fontWeight: "600" },

//   card: {
//     backgroundColor: "#fff", borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 14, marginTop: 10
//   },
//   sectionTitle: { fontSize: Platform.select({ web: 16, default: 15 }), fontWeight: "800", color: EMPHASIS, marginBottom: 8 },

//   desc: { color: "#334155", lineHeight: 20 },

//   empty: { color: SUBTEXT },

//   dayCard: { borderWidth: 1, borderColor: "#e9eef7", borderRadius: 12, padding: 12, marginBottom: 10 },
//   dayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
//   dayTitle: { fontWeight: "800", color: EMPHASIS },

//   row: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
//   place: { color: EMPHASIS, fontWeight: "700" },

//   smallLabel: { fontWeight: "700", color: EMPHASIS, marginTop: 6, marginBottom: 4, fontSize: 13 },
//   activities: { color: "#374151", lineHeight: 20 },

//   timeChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EFF6FF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1, borderColor: "#DBEAFE" },
//   timeChipText: { color: PRIMARY, fontWeight: "700", fontSize: 12 },

//   centerFill: { flex: 1, alignItems: "center", justifyContent: "center" },
// });



// screens/ItineraryDetailScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
  Platform, ActivityIndicator, Alert, Pressable
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Offline hook */
import { downloadItinerary } from "../../hooks/useOfflineItineraries";

/* ✅ Share functionality */
import ShareButton from '../../components/ShareButton';
import { getShareImage, getShareMessage, getShareUrl, isOfflineContent } from '../../utils/shareImageHelper';

/* Base URL */
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

const BORDER = "#E6EDF7";
const PRIMARY = "#003366";
const SUBTEXT = "#6B7280";
const EMPHASIS = "#0f172a";
const SOFT_BG = "#F7F9FC";

function formatRange(start, end) {
  if (!start || !end) return "Dates TBD";
  try {
    const s = new Date(start);
    const e = new Date(end);
    const sameYear = s.getFullYear() === e.getFullYear();
    const fmtS = new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" })
    });
    const fmtE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${fmtS.format(s)} – ${fmtE.format(e)}`;
  } catch { return "Dates TBD"; }
}

export default function ItineraryDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  // you can pass either {id} or the whole {itinerary}; we'll refetch by id if we can
  const passed = route.params?.itinerary || {};
  const id = route.params?.id || passed?.id || passed?._id;

  const [data, setData] = useState(passed || null);
  const [loading, setLoading] = useState(!passed?.days?.length);
  const [imgError, setImgError] = useState(false);

  // ✅ Check if this is offline content
  const isOfflineItem = isOfflineContent(passed) || isOfflineContent(data);

  useEffect(() => {
    navigation.setOptions?.({ title: "Itinerary" });
  }, [navigation]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return; // fallback to passed data
      try {
        setLoading(true);
        const token = await getAuthToken();
        const res = await fetch(`${API_BASE}/itineraries/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const raw = await res.text();
        let j = null; try { j = raw ? JSON.parse(raw) : null; } catch {}
        if (!cancelled) {
          if (res.ok && j) setData(j);
          else if (!passed) Alert.alert("Error", j?.error || "Unable to load itinerary.");
        }
      } catch (e) {
        if (!cancelled && !passed) Alert.alert("Network", "Failed to load itinerary.");
      } finally { !cancelled && setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (!data && loading) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={styles.centerFill}><ActivityIndicator /></View>
      </SafeAreaView>
    );
  }
  if (!data) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={styles.centerFill}><Text>Itinerary not found.</Text></View>
      </SafeAreaView>
    );
  }

  const { title, cover_url, city, style, budget, start_date, end_date, description, days = [] } = data;

  /* Download current itinerary for offline (cover/map are optional) */
  const handleDownloadOffline = async () => {
    try {
      const normalized = { ...data, id: data.id ?? data._id };
      await downloadItinerary({
        itinerary: normalized,
        coverUrl: cover_url || null,
        staticMapUrl: null, // OK to keep null for now
      });
      Alert.alert(
        "Saved for offline",
        Platform.OS === "web"
          ? "Stored in browser storage for demo."
          : "Find it in Profile → Offline."
      );
    } catch (e) {
      Alert.alert("Download failed", "Please try again.");
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "web" ? 0 : insets.top }]}>
      <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}>
        {/* Back */}
        <TouchableOpacity style={styles.backPill} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={EMPHASIS} />
          <Text style={styles.backPillText}>Back</Text>
        </TouchableOpacity>

        {/* Cover */}
        <View style={styles.coverBox}>
          {cover_url && !imgError ? (
            <Image source={{ uri: cover_url }} style={styles.coverImg} onError={() => setImgError(true)} />
          ) : (
            <View style={[styles.coverImg, { backgroundColor: "#eef2f7" }]} />
          )}
          <View style={styles.badges}>
            {style ? (
              <View style={[styles.badge, styles.badgeDark]}>
                <Ionicons name="sparkles-outline" size={12} color="#fff" />
                <Text style={[styles.badgeText, { color: "#fff" }]}>{style}</Text>
              </View>
            ) : null}
            {budget ? (
              <View style={[styles.badge, styles.badgeLight]}>
                <Ionicons name="pricetag-outline" size={12} color={PRIMARY} />
                <Text style={[styles.badgeText, { color: PRIMARY }]}>{budget}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Title & meta */}
        <Text style={styles.h1}>{title || "Untitled Itinerary"}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color={SUBTEXT} />
            <Text style={styles.metaText}>{city || "—"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={SUBTEXT} />
            <Text style={styles.metaText}>{formatRange(start_date, end_date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={SUBTEXT} />
            <Text style={styles.metaText}>{Array.isArray(days) ? `${days.length} day(s)` : "—"}</Text>
          </View>
        </View>

        {/* ✅ Action buttons - Only show for online content */}
        {!isOfflineItem && (
          <View style={styles.actionRow}>
            {/* Download for Offline button */}
            <Pressable onPress={handleDownloadOffline} style={styles.actionButton}>
              <Ionicons name="cloud-download-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Download</Text>
            </Pressable>

            {/* ✅ Share button */}
            <ShareButton
              title={`Travel Itinerary: ${title || 'My Trip'}`}
              message={getShareMessage(data, 'itinerary')}
              url={getShareUrl(data, 'itinerary')}
              imageUrl={getShareImage(data, 'itinerary')}
              style={styles.shareButtonStyle}
              onShareComplete={() => {
                console.log('✅ Itinerary shared:', title);
              }}
            />
          </View>
        )}

        {/* ✅ Offline indicator */}
        {isOfflineItem && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-done-outline" size={20} color="#065F46" />
            <Text style={styles.offlineBannerText}>Available Offline</Text>
          </View>
        )}

        {/* Description */}
        {description ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.desc}>{description}</Text>
          </View>
        ) : null}

        {/* All days */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Daily Plan</Text>
          {(!days || days.length === 0) && <Text style={styles.empty}>No days added yet.</Text>}

          {days
            .slice()
            .sort((a,b) => (a.day_number||0)-(b.day_number||0))
            .map((d, idx) => {
              const place = d.place || d.Place || "—";
              const st = d.start_time || d.StartTime || "";
              const et = d.end_time || d.EndTime || "";
              const act = d.activities || d.Activities || "";

              return (
                <View key={`${idx}-${place}`} style={styles.dayCard}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayTitle}>Day {d.day_number || idx + 1}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      {st ? (<View style={styles.timeChip}><Ionicons name="time-outline" size={12} color={PRIMARY} /><Text style={styles.timeChipText}>{st}</Text></View>) : null}
                      {et ? (<View style={styles.timeChip}><Ionicons name="time-outline" size={12} color={PRIMARY} /><Text style={styles.timeChipText}>{et}</Text></View>) : null}
                    </View>
                  </View>

                  <View style={styles.row}>
                    <Ionicons name="location-outline" size={16} color={PRIMARY} />
                    <Text style={styles.place}>{place}</Text>
                  </View>

                  {act ? (
                    <>
                      <Text style={styles.smallLabel}>Activities / Notes</Text>
                      <Text style={styles.activities}>{act}</Text>
                    </>
                  ) : null}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SOFT_BG },
  wrap: { flex: 1, padding: 14 },

  backPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  backPillText: { fontWeight: "800", color: EMPHASIS },

  coverBox: { height: 200, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: BORDER, backgroundColor: "#fff" },
  coverImg: { width: "100%", height: "100%", resizeMode: "cover" },
  badges: { position: "absolute", left: 10, bottom: 10, flexDirection: "row", gap: 6 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
  badgeDark: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  badgeLight: { backgroundColor: "#fff", borderColor: BORDER },
  badgeText: { fontSize: 12, fontWeight: "700" },

  h1: { fontSize: Platform.select({ web: 22, default: 20 }), fontWeight: "800", color: EMPHASIS, marginTop: 10, marginBottom: 6 },

  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10 },
  metaText: { color: EMPHASIS, fontWeight: "600" },

  /* ✅ Action buttons row */
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  shareButtonStyle: {
    flex: 1,
  },

  /* ✅ Offline banner */
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 4,
    marginHorizontal: 4,
  },
  offlineBannerText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fff", borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 14, marginTop: 10
  },
  sectionTitle: { fontSize: Platform.select({ web: 16, default: 15 }), fontWeight: "800", color: EMPHASIS, marginBottom: 8 },

  desc: { color: "#334155", lineHeight: 20 },

  empty: { color: SUBTEXT },

  dayCard: { borderWidth: 1, borderColor: "#e9eef7", borderRadius: 12, padding: 12, marginBottom: 10 },
  dayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  dayTitle: { fontWeight: "800", color: EMPHASIS },

  row: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  place: { color: EMPHASIS, fontWeight: "700" },

  smallLabel: { fontWeight: "700", color: EMPHASIS, marginTop: 6, marginBottom: 4, fontSize: 13 },
  activities: { color: "#374151", lineHeight: 20 },

  timeChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EFF6FF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1, borderColor: "#DBEAFE" },
  timeChipText: { color: PRIMARY, fontWeight: "700", fontSize: 12 },

  centerFill: { flex: 1, alignItems: "center", justifyContent: "center" },
});