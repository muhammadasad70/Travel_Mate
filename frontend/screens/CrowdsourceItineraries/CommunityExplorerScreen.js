
// import React, { useCallback, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Image,
//   ScrollView,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import getBaseURL from "../../config/env";

// const API_BASE = getBaseURL().replace(/\/+$/, "");
// const BORDER = "#E6EDF7";
// const PRIMARY = "#0c2444ff";
// const SUBTEXT = "#64748B";
// const CARD_W = 280;

// /* -------- helpers -------- */
// const getToken = async () => {
//   const KEYS = ["token","auth_token","jwt","access_token","AUTH_TOKEN","userToken"];
//   for (const k of KEYS) { const v = await AsyncStorage.getItem(k); if (v) return v; }
//   return null;
// };
// const cityOf = (it) => (it?.city || it?.location?.city || it?.meta?.city || it?.destination || "");
// const daysOf = (it) => {
//   if (Array.isArray(it?.days)) return it.days.length;
//   if (typeof it?.days === "number") return it.days;
//   const dd = it?.duration_days ?? it?.duration;
//   if (Array.isArray(dd)) return dd.length;
//   if (typeof dd === "number") return dd;
//   if (Array.isArray(it?.daysPlan)) return it.daysPlan.length;
//   return undefined;
// };
// const tagsOf = (it) => {
//   const raw = it?.tags || it?.meta?.tags || [];
//   return Array.isArray(raw)
//     ? raw.map((t)=> typeof t==="string" ? t.toLowerCase() : String(t?.name ?? t?.label ?? t?.tag ?? "").toLowerCase()).filter(Boolean)
//     : [];
// };
// const coverOf = (it) => it?.cover || it?.cover_url || it?.image || it?.image_url || it?.photo || it?.hero || null;

// /* -------- card -------- */
// function MiniCard({ item, onView, onAdd }) {
//   const pills = tagsOf(item);
//   const c = cityOf(item);
//   const d = daysOf(item);
//   const img = coverOf(item);
//   const [ok, setOk] = useState(!!img);

//   return (
//     <View style={styles.card}>
//       {img && ok ? (
//         <Image source={{ uri: img }} style={styles.cover} resizeMode="cover" onError={() => setOk(false)} />
//       ) : (
//         <View style={[styles.cover, { backgroundColor: "#E9EEF6", alignItems: "center", justifyContent: "center" }]}>
//           <Ionicons name="image-outline" size={22} color={SUBTEXT} />
//         </View>
//       )}

//       {/* top-left tags */}
//       <View style={styles.topPills}>
//         {(pills.length ? pills.slice(0, 1) : ["comfort"]).map((t, i) => (
//           <View key={i} style={styles.pillSoft}>
//             <Ionicons name="sparkles-outline" size={12} color={PRIMARY} />
//             <Text style={styles.pillSoftTxt}>{t}</Text>
//           </View>
//         ))}
//       </View>

//       <View style={{ padding: 10 }}>
//         <Text numberOfLines={2} style={styles.title}>{item?.title || "Untitled trip"}</Text>

//         <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
//           <View style={styles.metaPill}>
//             <Ionicons name="location-outline" size={12} color={PRIMARY} />
//             <Text style={styles.metaTxt}>{c || "—"}</Text>
//           </View>
//           {!!d && (
//             <View style={styles.metaPill}>
//               <Ionicons name="time-outline" size={12} color={PRIMARY} />
//               <Text style={styles.metaTxt}>{d} day(s)</Text>
//             </View>
//           )}
//         </View>

//         {/* compact actions */}
//         <View style={styles.actionsRow}>
//           <TouchableOpacity style={styles.ghostBtn} onPress={onView}>
//             <Ionicons name="eye-outline" size={14} color={PRIMARY} />
//             <Text style={styles.ghostTxt}>View</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
//             <Ionicons name="add" size={14} color="#fff" />
//             <Text style={styles.primaryTxt}>Add</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// function SectionRow({ title, items, onOpenAll, onViewItem, onAddItem }) {
//   if (!items?.length) return null;
//   return (
//     <View style={{ marginBottom: 18 }}>
//       <View style={styles.rowHeader}>
//         <Text style={styles.rowTitle}>{title}</Text>
//         {!!onOpenAll && (
//           <TouchableOpacity onPress={onOpenAll} style={styles.linkBtn} activeOpacity={0.9}>
//             <Text style={styles.linkTxt}>View all</Text>
//             <Ionicons name="chevron-forward" size={14} color={PRIMARY} />
//           </TouchableOpacity>
//         )}
//       </View>

//       <FlatList
//         horizontal
//         data={items}
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(x, i) => String(x?.id ?? x?._id ?? i)}
//         contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
//         renderItem={({ item }) => (
//           <MiniCard
//             item={item}
//             onView={() => onViewItem(item)}
//             onAdd={() => onAddItem(item)}
//           />
//         )}
//       />
//     </View>
//   );
// }

// /* -------- screen -------- */
// export default function AISuggestionsScreen() {
//   const nav = useNavigation();
//   const insets = useSafeAreaInsets();

//   const [all, setAll] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = await getToken();
//       if (!token) { setAll([]); return; }
//       const res = await fetch(`${API_BASE}/itineraries?limit=50&offset=0`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const raw = await res.text();
//       let data = [];
//       try { data = raw ? JSON.parse(raw) : []; } catch {}
//       setAll(Array.isArray(data) ? data : data?.items || []);
//     } catch {
//       setAll([]);
//     } finally { setLoading(false); }
//   }, []);

//   useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

//   const trending = useMemo(() => {
//     const arr = [...all];
//     arr.sort((a,b)=> (new Date(b?.created_at||0)) - (new Date(a?.created_at||0)));
//     return arr.slice(0, 10);
//   }, [all]);

//   const quickWeekend = useMemo(() => all.filter(x => {
//     const d = Number(daysOf(x) || 0); return d>0 && d<=3;
//   }).slice(0,10), [all]);

//   const forYou = useMemo(() => {
//     const likedTags = new Set();
//     quickWeekend.forEach(x => tagsOf(x).forEach(t=>likedTags.add(t)));
//     const scored = all.map(x => {
//       let s = 0;
//       tagsOf(x).forEach(t => { if (likedTags.has(t)) s += 1; });
//       if (daysOf(x) && daysOf(x) <= 5) s += 0.2;
//       return { x, s };
//     });
//     scored.sort((a,b)=>b.s-a.s);
//     return scored.map(o=>o.x).slice(0,10);
//   }, [all, quickWeekend]);

//   const openCard = (it) => {
//     const id = it?.id ?? it?._id;
//     nav.navigate("ItineraryDetails", { id, itinerary: it });
//   };

//   const addCopy = async (it) => {
//     try {
//       const id = it?.id ?? it?._id;
//       const token = await getToken();
//       if (!token) { Alert.alert("Please log in"); return; }

//       const r = await fetch(`${API_BASE}/itineraries/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       const raw = await r.text(); let src = null; try { src = raw ? JSON.parse(raw) : null; } catch {}
//       if (!r.ok || !src) throw new Error("Failed to fetch source");

//       const payload = { ...src, id: undefined, _id: undefined, itinerary_id: undefined, parent_id: id, source: "user", privacy: "private" };

//       const c = await fetch(`${API_BASE}/itineraries`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });
//       const rawC = await c.text(); let created = null; try { created = rawC ? JSON.parse(rawC) : null; } catch {}
//       if (!c.ok) throw new Error(created?.error || `Failed (HTTP ${c.status})`);

//       Alert.alert("Added", "Copied to your itineraries.");
//       const newId = created?.id ?? created?._id;
//       if (newId) nav.navigate("ItineraryDetails", { id: newId, itinerary: created });
//     } catch (e) {
//       Alert.alert("Error", e?.message || "Could not add itinerary.");
//     }
//   };

//   const goCommunity = (params) => nav.navigate("CommunityExplorer", params || {});

//   return (
//     <SafeAreaView style={[styles.safe, { paddingBottom: insets.bottom }]}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 16 + insets.bottom }} showsVerticalScrollIndicator={false}>
//         {/* Back pill */}
//         <View style={styles.headerBar}>
//           <TouchableOpacity style={styles.backPill} onPress={() => nav.goBack()}>
//             <Ionicons name="arrow-back" size={18} color="#0f172a" />
//             <Text style={styles.backTxt}>Back</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Title */}
//         <View style={styles.header}>
//           <Text style={styles.h1}>For You</Text>
//           <Text style={styles.lead}>Smart picks based on your interests and what’s trending.</Text>
//         </View>

//         <SectionRow
//           title="Recommended for you"
//           items={forYou}
//           onOpenAll={() => goCommunity({})}
//           onViewItem={openCard}
//           onAddItem={addCopy}
//         />
//         <SectionRow
//           title="Trending nearby"
//           items={trending}
//           onOpenAll={() => goCommunity({})}
//           onViewItem={openCard}
//           onAddItem={addCopy}
//         />
//         <SectionRow
//           title="Quick weekend ideas"
//           items={quickWeekend}
//           onOpenAll={() => goCommunity({ days: "3" })}
//           onViewItem={openCard}
//           onAddItem={addCopy}
//         />

//         {!loading && !all.length && (
//           <View style={{ alignItems: "center", marginTop: 32 }}>
//             <Ionicons name="planet-outline" size={36} color={SUBTEXT} />
//             <Text style={{ color: SUBTEXT, marginTop: 6 }}>No data yet. Create or sync itineraries.</Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* -------- styles -------- */
// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#F7F9FC" },

//   headerBar: { paddingHorizontal: 12, paddingTop: 8 },
//   backPill: {
//     alignSelf: "flex-start",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   backTxt: { fontWeight: "800", color: "#0f172a" },

//   header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
//   h1: { fontSize: 24, fontWeight: "800", color: "#0F172A" },
//   lead: { color: SUBTEXT, marginTop: 4 },

//   rowHeader: {
//     paddingHorizontal: 12,
//     paddingTop: 6,
//     paddingBottom: 6,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   rowTitle: { fontWeight: "800", color: "#0F172A", fontSize: 18 },
//   linkBtn: { flexDirection: "row", alignItems: "center", gap: 4, padding: 6 },
//   linkTxt: { color: PRIMARY, fontWeight: "800" },

//   card: {
//     width: CARD_W,
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: BORDER,
//     overflow: "hidden",
//   },
//   cover: { height: 150, width: "100%" },

//   topPills: { position: "absolute", top: 8, left: 8, flexDirection: "row", gap: 6 },
//   pillSoft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#ECF3FF",
//     borderColor: "#DCE7FF",
//     borderWidth: 1,
//     borderRadius: 999,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   pillSoftTxt: { color: PRIMARY, fontWeight: "800", fontSize: 11 },

//   title: { fontWeight: "800", color: "#0F172A" },

//   metaPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#F1F5F9",
//     borderRadius: 999,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   metaTxt: { color: "#0F172A", fontWeight: "700", fontSize: 11 },

//   actionsRow: { flexDirection: "row", gap: 8, marginTop: 10 },
//   ghostBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#EEF3F9",
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//   },
//   ghostTxt: { color: PRIMARY, fontWeight: "800", fontSize: 12 },
//   primaryBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: PRIMARY,
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//   },
//   primaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
// });




import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import getBaseURL from "../../config/env";

const API_BASE = getBaseURL().replace(/\/+$/, "");
const BORDER = "#E6EDF7";
const PRIMARY = "#0c2444ff";
const SUBTEXT = "#64748B";
const CARD_W = 280;

/* -------- helpers -------- */
const getToken = async () => {
  const KEYS = ["token","auth_token","jwt","access_token","AUTH_TOKEN","userToken"];
  for (const k of KEYS) { const v = await AsyncStorage.getItem(k); if (v) return v; }
  return null;
};
const cityOf = (it) => (it?.city || it?.location?.city || it?.meta?.city || it?.destination || "");
const daysOf = (it) => {
  if (Array.isArray(it?.days)) return it.days.length;
  if (typeof it?.days === "number") return it.days;
  const dd = it?.duration_days ?? it?.duration;
  if (Array.isArray(dd)) return dd.length;
  if (typeof dd === "number") return dd;
  if (Array.isArray(it?.daysPlan)) return it.daysPlan.length;
  return undefined;
};
const tagsOf = (it) => {
  const raw = it?.tags || it?.meta?.tags || [];
  return Array.isArray(raw)
    ? raw.map((t)=> typeof t==="string" ? t.toLowerCase() : String(t?.name ?? t?.label ?? t?.tag ?? "").toLowerCase()).filter(Boolean)
    : [];
};
const coverOf = (it) => it?.cover || it?.cover_url || it?.image || it?.image_url || it?.photo || it?.hero || null;

/* -------- card -------- */
function MiniCard({ item, onView, onAdd }) {
  const pills = tagsOf(item);
  const c = cityOf(item);
  const d = daysOf(item);
  const img = coverOf(item);
  const [ok, setOk] = useState(!!img);

  return (
    <View style={styles.card}>
      {img && ok ? (
        <Image source={{ uri: img }} style={styles.cover} resizeMode="cover" onError={() => setOk(false)} />
      ) : (
        <View style={[styles.cover, { backgroundColor: "#E9EEF6", alignItems: "center", justifyContent: "center" }]}>
          <Ionicons name="image-outline" size={22} color={SUBTEXT} />
        </View>
      )}

      {/* top-left tags */}
      <View style={styles.topPills}>
        {(pills.length ? pills.slice(0, 1) : ["comfort"]).map((t, i) => (
          <View key={i} style={styles.pillSoft}>
            <Ionicons name="sparkles-outline" size={12} color={PRIMARY} />
            <Text style={styles.pillSoftTxt}>{t}</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 10 }}>
        <Text numberOfLines={2} style={styles.title}>{item?.title || "Untitled trip"}</Text>

        <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          <View style={styles.metaPill}>
            <Ionicons name="location-outline" size={12} color={PRIMARY} />
            <Text style={styles.metaTxt}>{c || "—"}</Text>
          </View>
          {!!d && (
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={12} color={PRIMARY} />
              <Text style={styles.metaTxt}>{d} day(s)</Text>
            </View>
          )}
        </View>

        {/* compact actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.ghostBtn} onPress={onView}>
            <Ionicons name="eye-outline" size={14} color={PRIMARY} />
            <Text style={styles.ghostTxt}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
            <Ionicons name="add" size={14} color="#fff" />
            <Text style={styles.primaryTxt}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function SectionRow({ title, items, onOpenAll, onViewItem, onAddItem }) {
  if (!items?.length) return null;
  return (
    <View style={{ marginBottom: 18 }}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!onOpenAll && (
          <TouchableOpacity onPress={onOpenAll} style={styles.linkBtn} activeOpacity={0.9}>
            <Text style={styles.linkTxt}>View all</Text>
            <Ionicons name="chevron-forward" size={14} color={PRIMARY} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        data={items}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(x, i) => String(x?.id ?? x?._id ?? i)}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
        renderItem={({ item }) => (
          <MiniCard
            item={item}
            onView={() => onViewItem(item)}
            onAdd={() => onAddItem(item)}
          />
        )}
      />
    </View>
  );
}

/* -------- screen -------- */
export default function AISuggestionsScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) { setAll([]); return; }
      const res = await fetch(`${API_BASE}/itineraries?limit=50&offset=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = await res.text();
      let data = [];
      try { data = raw ? JSON.parse(raw) : []; } catch {}
      setAll(Array.isArray(data) ? data : data?.items || []);
    } catch {
      setAll([]);
    } finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const trending = useMemo(() => {
    const arr = [...all];
    arr.sort((a,b)=> (new Date(b?.created_at||0)) - (new Date(a?.created_at||0)));
    return arr.slice(0, 10);
  }, [all]);

  const quickWeekend = useMemo(() => all.filter(x => {
    const d = Number(daysOf(x) || 0); return d>0 && d<=3;
  }).slice(0,10), [all]);

  const forYou = useMemo(() => {
    const likedTags = new Set();
    quickWeekend.forEach(x => tagsOf(x).forEach(t=>likedTags.add(t)));
    const scored = all.map(x => {
      let s = 0;
      tagsOf(x).forEach(t => { if (likedTags.has(t)) s += 1; });
      if (daysOf(x) && daysOf(x) <= 5) s += 0.2;
      return { x, s };
    });
    scored.sort((a,b)=>b.s-a.s);
    return scored.map(o=>o.x).slice(0,10);
  }, [all, quickWeekend]);

  const openCard = (it) => {
    const id = it?.id ?? it?._id;
    nav.navigate("ItineraryDetails", { id, itinerary: it });
  };

  const addCopy = async (it) => {
    try {
      const id = it?.id ?? it?._id;
      const token = await getToken();
      if (!token) { Alert.alert("Please log in"); return; }

      const r = await fetch(`${API_BASE}/itineraries/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const raw = await r.text(); let src = null; try { src = raw ? JSON.parse(raw) : null; } catch {}
      if (!r.ok || !src) throw new Error("Failed to fetch source");

      const payload = { ...src, id: undefined, _id: undefined, itinerary_id: undefined, parent_id: id, source: "user", privacy: "private" };

      const c = await fetch(`${API_BASE}/itineraries`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const rawC = await c.text(); let created = null; try { created = rawC ? JSON.parse(rawC) : null; } catch {}
      if (!c.ok) throw new Error(created?.error || `Failed (HTTP ${c.status})`);

      Alert.alert("Added", "Copied to your itineraries.");
      const newId = created?.id ?? created?._id;
      if (newId) nav.navigate("ItineraryDetails", { id: newId, itinerary: created });
    } catch (e) {
      Alert.alert("Error", e?.message || "Could not add itinerary.");
    }
  };

  const goCommunity = (params) => nav.navigate("CommunityExplorer", params || {});

  return (
    <SafeAreaView style={[styles.safe, { paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 + insets.bottom }} showsVerticalScrollIndicator={false}>

        {/* Header: inline back + title (one row) */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backPill} onPress={() => nav.goBack()}>
            <Ionicons name="arrow-back" size={18} color="#0f172a" />
            <Text style={styles.backTxt}>Back</Text>
          </TouchableOpacity>

          <View style={{ flexShrink: 1 }}>
            <Text style={styles.h1}>For You</Text>
            <Text style={styles.lead}>Smart picks based on your interests and what’s trending.</Text>
          </View>
        </View>

        <SectionRow
          title="Recommended for you"
          items={forYou}
          onOpenAll={() => goCommunity({})}
          onViewItem={openCard}
          onAddItem={addCopy}
        />
        <SectionRow
          title="Trending nearby"
          items={trending}
          onOpenAll={() => goCommunity({})}
          onViewItem={openCard}
          onAddItem={addCopy}
        />
        <SectionRow
          title="Quick weekend ideas"
          items={quickWeekend}
          onOpenAll={() => goCommunity({ days: "3" })}
          onViewItem={openCard}
          onAddItem={addCopy}
        />

        {!loading && !all.length && (
          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Ionicons name="planet-outline" size={36} color={SUBTEXT} />
            <Text style={{ color: SUBTEXT, marginTop: 6 }}>No data yet. Create or sync itineraries.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------- styles -------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F9FC" },

  /* unified header row */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backTxt: { fontWeight: "800", color: "#0f172a" },
  h1: { fontSize: 24, fontWeight: "800", color: "#0F172A" },
  lead: { color: SUBTEXT, marginTop: 2 },

  rowHeader: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowTitle: { fontWeight: "800", color: "#0F172A", fontSize: 18 },
  linkBtn: { flexDirection: "row", alignItems: "center", gap: 4, padding: 6 },
  linkTxt: { color: PRIMARY, fontWeight: "800" },

  card: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  cover: { height: 150, width: "100%" },

  topPills: { position: "absolute", top: 8, left: 8, flexDirection: "row", gap: 6 },
  pillSoft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECF3FF",
    borderColor: "#DCE7FF",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pillSoftTxt: { color: PRIMARY, fontWeight: "800", fontSize: 11 },

  title: { fontWeight: "800", color: "#0F172A" },

  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaTxt: { color: "#0F172A", fontWeight: "700", fontSize: 11 },

  actionsRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF3F9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  ghostTxt: { color: PRIMARY, fontWeight: "800", fontSize: 12 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  primaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
});
