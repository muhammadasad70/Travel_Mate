
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   FlatList,
//   ActivityIndicator,
//   useWindowDimensions,
//   TouchableOpacity,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// import EventsHeader from "../components/Events/EventsHeader";
// import EventsFilterModal from "../components/Events/EventsFilterModal";
// import EventCard from "../components/Events/EventCard";
// import EventDetailsSheet from "../components/Events/EventDetailsSheet";

// import getBaseURL from "../config/env";
// const API_BASE = getBaseURL().replace(/\/+$/, "");

// const COLORS = {
//   page: "#F6FAFD",
//   border: "#EAF0F6",
//   text: "#0F3A6B",
// };

// export default function EventsExplorerScreen({ onAddToItinerary }) {
//   const { width } = useWindowDimensions();
//   const insets = useSafeAreaInsets();
//   const isPhone = width < 520;
//   const numColumns = isPhone ? 1 : 2;

//   const bottomBarH = 64;
//   const padBottom =
//     bottomBarH + (Platform.OS === "ios" ? insets.bottom : Math.max(insets.bottom, 8));

//   // header/filter state
//   const [search, setSearch] = useState("");
//   const [filtersOpen, setFiltersOpen] = useState(false);
//   const [loc, setLoc] = useState("All");
//   const [category, setCategory] = useState("All");
//   const [dateWindow, setDateWindow] = useState("60d"); // week | 30d | 60d

//   // data/pagination
//   const [events, setEvents] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // details sheet
//   const [selected, setSelected] = useState(null);

//   // derive lists from loaded events (for quick filter pickers)
//   const locations = useMemo(() => {
//     const s = new Set(["All"]);
//     events.forEach((e) => e.city && s.add(e.city));
//     return Array.from(s);
//   }, [events]);

//   const categories = useMemo(() => {
//     const s = new Set(["All"]);
//     events.forEach((e) => e.category && s.add(e.category));
//     return Array.from(s);
//   }, [events]);

//   // helper: compute date range for header pills
//   const computeDateRange = () => {
//     if (dateWindow === "all") return {}; 
//     const df = new Date();
//     const dt = new Date();
//     if (dateWindow === "week") dt.setDate(df.getDate() + 7);
//     else if (dateWindow === "30d") dt.setDate(df.getDate() + 30);
//     else dt.setDate(df.getDate() + 60);
//     const fmt = (d) => d.toISOString().slice(0, 10);
//     return { date_from: fmt(df), date_to: fmt(dt) };
//   };

//   const buildQuery = (nextOffset = 0) => {
//     const p = new URLSearchParams();
//     const dr = computeDateRange();
//     p.set("limit", String(dateWindow === "all" ? 200 : 60));
//     p.set("limit", String(60));
//     p.set("offset", String(nextOffset));
//     if (dr.date_from) p.set("date_from", dr.date_from);
//     if (dr.date_to)   p.set("date_to",   dr.date_to);
//     if (search.trim()) p.set("q", search.trim());
//     if (loc !== "All") p.set("city", loc);
//     if (category !== "All") p.set("category", category);
//     return p.toString();
//   };

//   const fetchPage = async (nextOffset = 0, mode = "append") => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       const qs = buildQuery(nextOffset);
//       const res = await fetch(`${API_BASE}/events?${qs}`);
//       const json = await res.json();
//       const items = Array.isArray(json?.items) ? json.items : [];
//       setHasMore(!!json?.has_more);
//       setOffset(json?.next_offset ?? nextOffset + items.length);
//       setEvents((prev) => (mode === "replace" ? items : [...prev, ...items]));
//     } catch (e) {
//       console.warn("events fetch error", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // initial + when filters change -> replace
//   useEffect(() => {
//     setOffset(0);
//     setHasMore(true);
//     fetchPage(0, "replace");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, loc, category, dateWindow]);

//   const onEndReached = () => {
//     if (!loading && hasMore) fetchPage(offset, "append");
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchPage(0, "replace");
//     setRefreshing(false);
//   };

//   // Because your API already filters, the rendered dataset is the server result:
//   const filtered = events;

//   const renderItem = ({ item }) => (
//     <EventCard
//       item={item}
//       onPress={() => setSelected(item)}
//       onAddToItinerary={() => onAddToItinerary?.(item)}
//     />
//   );

//   return (
//     <SafeAreaView style={styles.page}>
//       <EventsHeader
//         search={search}
//         onChangeSearch={setSearch}
//         onOpenFilters={() => setFiltersOpen(true)}
//         dateWindow={dateWindow}
//         setDateWindow={setDateWindow}
//       />

//       {/* Debug counters (remove later) */}
//       {__DEV__ ? (
//         <View style={{ paddingHorizontal: 16, paddingBottom: 6 }}>
//           <Text style={{ color: "#64748b", fontSize: 12 }}>
//             events:{events?.length ?? 0} • filtered:{filtered?.length ?? 0}
//           </Text>
//         </View>
//       ) : null}

//       <FlatList
//         style={{ flex: 1 }}
//         data={filtered}
//         key={numColumns} // re-render when columns change
//         keyExtractor={(e) => String(e.id)}
//         renderItem={renderItem}
//         numColumns={numColumns}
//         columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
//         ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//         ListEmptyComponent={
//           <View style={{ padding: 16, alignItems: "center" }}>
//             <Text style={{ color: "#475569", fontWeight: "700", marginBottom: 6 }}>
//               No events match your filters
//             </Text>
//             <TouchableOpacity
//               onPress={() => {
//                 setSearch("");
//                 setLoc("All");
//                 setCategory("All");
//                 setDateWindow("60d");
//               }}
//               style={{
//                 backgroundColor: "#0F70F0",
//                 paddingHorizontal: 12,
//                 paddingVertical: 8,
//                 borderRadius: 10,
//               }}
//               activeOpacity={0.9}
//             >
//               <Text style={{ color: "#fff", fontWeight: "800" }}>Reset Filters</Text>
//             </TouchableOpacity>
//           </View>
//         }
//         ListFooterComponent={
//           loading && hasMore ? (
//             <View style={{ paddingVertical: 16 }}>
//               <ActivityIndicator />
//             </View>
//           ) : null
//         }
//         contentContainerStyle={{
//           paddingHorizontal: 16,
//           paddingTop: Platform.OS === "web" ? 6 : 4,
//           paddingBottom: padBottom, // keep above bottom bar
//           ...(Platform.OS === "web"
//             ? { maxWidth: 1100, alignSelf: "center", width: "100%" }
//             : {}),
//           rowGap: 12,
//           minHeight: 200,
//         }}
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//         onEndReached={onEndReached}
//         onEndReachedThreshold={0.2}
//       />

//       <EventsFilterModal
//         visible={filtersOpen}
//         onClose={() => setFiltersOpen(false)}
//         locations={locations}
//         categories={categories}
//         selectedLoc={loc}
//         setSelectedLoc={setLoc}
//         selectedCat={category}
//         setSelectedCat={setCategory}
//       />

//       <EventDetailsSheet
//         event={selected}
//         onClose={() => setSelected(null)}
//         onAddToItinerary={() => selected && onAddToItinerary?.(selected)}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: COLORS.page },
// });


import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import EventsHeader from "../components/Events/EventsHeader";
import EventsFilterModal from "../components/Events/EventsFilterModal";
import EventCard from "../components/Events/EventCard";
import EventDetailsSheet from "../components/Events/EventDetailsSheet";

import getBaseURL from "../config/env";
const API_BASE = getBaseURL().replace(/\/+$/, "");

const COLORS = {
  page: "#F6FAFD",
  border: "#EAF0F6",
  text: "#0F3A6B",
};

export default function EventsExplorerScreen({ onAddToItinerary }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isPhone = width < 520;
  const numColumns = isPhone ? 1 : 2;

  const bottomBarH = 64;
  const padBottom =
    bottomBarH + (Platform.OS === "ios" ? insets.bottom : Math.max(insets.bottom, 8));

  // header/filter state
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loc, setLoc] = useState("All");
  const [category, setCategory] = useState("All");
  const [dateWindow, setDateWindow] = useState("60d"); // week | 30d | 60d | all
  const [useLive, setUseLive] = useState(false);       // NEW: toggle for /events/live

  // data/pagination
  const [events, setEvents] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // details sheet
  const [selected, setSelected] = useState(null);

  // derive lists from loaded events
  const locations = useMemo(() => {
    const s = new Set(["All"]);
    events.forEach((e) => e.city && s.add(e.city));
    return Array.from(s);
  }, [events]);

  const categories = useMemo(() => {
    const s = new Set(["All"]);
    events.forEach((e) => e.category && s.add(e.category));
    return Array.from(s);
  }, [events]);

  // date range
  const computeDateRange = () => {
    if (dateWindow === "all") return {};
    const df = new Date();
    const dt = new Date();
    if (dateWindow === "week") dt.setDate(df.getDate() + 7);
    else if (dateWindow === "30d") dt.setDate(df.getDate() + 30);
    else dt.setDate(df.getDate() + 60);
    const fmt = (d) => d.toISOString().slice(0, 10);
    return { date_from: fmt(df), date_to: fmt(dt) };
  };

  const buildQuery = (nextOffset = 0) => {
    const p = new URLSearchParams();
    const dr = computeDateRange();

    // pagination only for stored events
    if (!useLive) {
      p.set("limit", String(dateWindow === "all" ? 200 : 60));
      p.set("offset", String(nextOffset));
    }

    if (dr.date_from) p.set("date_from", dr.date_from);
    if (dr.date_to)   p.set("date_to",   dr.date_to);

    if (search.trim()) p.set("q", search.trim());
    if (loc !== "All") p.set("city", loc);
    // live doesn’t support category server-side; keep it only for stored events
    if (!useLive && category !== "All") p.set("category", category);

    return p.toString();
  };

  const fetchPage = async (nextOffset = 0, mode = "append") => {
    if (loading) return;
    setLoading(true);
    try {
      const qs = buildQuery(nextOffset);
      const path = useLive ? "/events/live" : "/events";
      const url = qs ? `${API_BASE}${path}?${qs}` : `${API_BASE}${path}`;

      const res = await fetch(url);
      const json = await res.json();
      const items = Array.isArray(json?.items) ? json.items : [];

      setEvents((prev) => (mode === "replace" ? items : [...prev, ...items]));
      setHasMore(!useLive && !!json?.has_more); // live: no pagination
      setOffset(!useLive ? (json?.next_offset ?? nextOffset + items.length) : 0);
    } catch (e) {
      console.warn("events fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  // reload on filters/toggle
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchPage(0, "replace");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, loc, category, dateWindow, useLive]);

  const onEndReached = () => {
    if (!useLive && !loading && hasMore) fetchPage(offset, "append");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPage(0, "replace");
    setRefreshing(false);
  };

  const filtered = events; // server-side filtering already

  const renderItem = ({ item }) => (
    <EventCard
      item={item}
      onPress={() => setSelected(item)}
      onAddToItinerary={() => onAddToItinerary?.(item)}
    />
  );

  return (
    <SafeAreaView style={styles.page}>
      <EventsHeader
        search={search}
        onChangeSearch={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        dateWindow={dateWindow}
        setDateWindow={setDateWindow}
        useLive={useLive}               // NEW
        setUseLive={setUseLive}         // NEW
      />

      {/* Debug counters */}
      {__DEV__ ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 6 }}>
          <Text style={{ color: "#64748b", fontSize: 12 }}>
            mode:{useLive ? "live" : "stored"} • events:{events?.length ?? 0} • filtered:{filtered?.length ?? 0}
          </Text>
        </View>
      ) : null}

      <FlatList
        style={{ flex: 1 }}
        data={filtered}
        key={numColumns}
        keyExtractor={(e) => String(e.id ?? `${e.source}-${e.external_id}-${e.start}`)}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={{ padding: 16, alignItems: "center" }}>
            <Text style={{ color: "#475569", fontWeight: "700", marginBottom: 6 }}>
              No events match your filters
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                setLoc("All");
                setCategory("All");
                setDateWindow("60d");
              }}
              style={{
                backgroundColor: "#0F70F0",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
              }}
              activeOpacity={0.9}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          !useLive && loading && hasMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "web" ? 6 : 4,
          paddingBottom: padBottom,
          ...(Platform.OS === "web" ? { maxWidth: 1100, alignSelf: "center", width: "100%" } : {}),
          rowGap: 12,
          minHeight: 200,
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
      />

      <EventsFilterModal
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        locations={locations}
        categories={categories}
        selectedLoc={loc}
        setSelectedLoc={setLoc}
        selectedCat={category}
        setSelectedCat={setCategory}
      />

      <EventDetailsSheet
        event={selected}
        onClose={() => setSelected(null)}
        onAddToItinerary={() => selected && onAddToItinerary?.(selected)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.page },
});
