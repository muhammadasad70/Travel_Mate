
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
// import { Ionicons } from "@expo/vector-icons";

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

// export default function EventsExplorerScreen() {
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
//   const [dateWindow, setDateWindow] = useState("2026");
//   const [useLive, setUseLive] = useState(false);

//   // data/pagination
//   const [events, setEvents] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // details sheet
//   const [selected, setSelected] = useState(null);

//   // derive lists from loaded events
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

//   // Updated date range computation
//   const computeDateRange = () => {
//     if (dateWindow === "all") return {};
    
//     const df = new Date();
//     const dt = new Date();
    
//     if (dateWindow === "upcoming") {
//       // Next 6 months from now
//       dt.setMonth(df.getMonth() + 6);
//     } else if (dateWindow === "2026") {
//       // All of 2026
//       return {
//         date_from: "2026-01-01",
//         date_to: "2026-12-31",
//       };
//     } else {
//       // Default: next year
//       dt.setFullYear(df.getFullYear() + 1);
//     }
    
//     const fmt = (d) => d.toISOString().slice(0, 10);
//     return { date_from: fmt(df), date_to: fmt(dt) };
//   };

//   const buildQuery = (nextOffset = 0) => {
//     const p = new URLSearchParams();
//     const dr = computeDateRange();

//     // pagination only for stored events
//     if (!useLive) {
//       p.set("limit", String(dateWindow === "all" ? 200 : 60));
//       p.set("offset", String(nextOffset));
//     }

//     if (dr.date_from) p.set("date_from", dr.date_from);
//     if (dr.date_to)   p.set("date_to",   dr.date_to);

//     if (search.trim()) p.set("q", search.trim());
//     if (loc !== "All") p.set("city", loc);
//     if (!useLive && category !== "All") p.set("category", category);

//     return p.toString();
//   };

//   const fetchPage = async (nextOffset = 0, mode = "append") => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       const qs = buildQuery(nextOffset);
//       const path = useLive ? "/events/live" : "/events";
//       const url = qs ? `${API_BASE}${path}?${qs}` : `${API_BASE}${path}`;

//       const res = await fetch(url);
//       const json = await res.json();
//       const items = Array.isArray(json?.items) ? json.items : [];

//       setEvents((prev) => (mode === "replace" ? items : [...prev, ...items]));
//       setHasMore(!useLive && !!json?.has_more);
//       setOffset(!useLive ? (json?.next_offset ?? nextOffset + items.length) : 0);
//     } catch (e) {
//       console.warn("events fetch error", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // reload on filters/toggle
//   useEffect(() => {
//     setOffset(0);
//     setHasMore(true);
//     fetchPage(0, "replace");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, loc, category, dateWindow, useLive]);

//   const onEndReached = () => {
//     if (!useLive && !loading && hasMore) fetchPage(offset, "append");
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchPage(0, "replace");
//     setRefreshing(false);
//   };

//   const filtered = events;

//   const renderItem = ({ item }) => (
//     <EventCard
//       item={item}
//       onPress={() => setSelected(item)}
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
//         useLive={useLive}
//         setUseLive={setUseLive}
//       />

//       {/* Debug counters */}
//       {__DEV__ ? (
//         <View style={{ paddingHorizontal: 16, paddingBottom: 6 }}>
//           <Text style={{ color: "#64748b", fontSize: 12 }}>
//             mode:{useLive ? "live" : "stored"} • events:{events?.length ?? 0} • filtered:{filtered?.length ?? 0}
//           </Text>
//         </View>
//       ) : null}

//       <FlatList
//         style={{ flex: 1 }}
//         data={filtered}
//         key={numColumns}
//         keyExtractor={(e, index) => {
//           // ✅ FIXED: Create unique key combining multiple fields
//           const baseKey = e.id || e.external_id || e.title || 'event';
//           const sourceKey = e.source || 'unknown';
//           const timeKey = (e.start || e.start_time || '').substring(0, 10);
//           return `${sourceKey}-${baseKey}-${timeKey}-${index}`;
//         }}
//         renderItem={renderItem}
//         numColumns={numColumns}
//         columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
//         ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//         ListEmptyComponent={
//           <View style={{ padding: 24, alignItems: "center" }}>
//             <Ionicons name="calendar-outline" size={64} color="#cbd5e1" style={{ marginBottom: 16 }} />
            
//             <Text style={{ 
//               color: "#475569", 
//               fontWeight: "700", 
//               fontSize: 16,
//               marginBottom: 8,
//               textAlign: "center",
//             }}>
//               {useLive ? "No live events found" : "No events match your filters"}
//             </Text>
            
//             <Text style={{ 
//               color: "#94a3b8", 
//               fontSize: 14,
//               marginBottom: 20,
//               textAlign: "center",
//               paddingHorizontal: 20,
//             }}>
//               {useLive 
//                 ? "Try switching to 'Curated' events or selecting a different city"
//                 : "Try selecting 'All' locations or '2026' date range"
//               }
//             </Text>
            
//             <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setSearch("");
//                   setLoc("All");
//                   setCategory("All");
//                   setDateWindow("2026");
//                 }}
//                 style={{
//                   backgroundColor: "#0F70F0",
//                   paddingHorizontal: 20,
//                   paddingVertical: 10,
//                   borderRadius: 10,
//                   flexDirection: "row",
//                   alignItems: "center",
//                   gap: 6,
//                 }}
//                 activeOpacity={0.9}
//               >
//                 <Ionicons name="refresh" size={16} color="#fff" />
//                 <Text style={{ color: "#fff", fontWeight: "800" }}>Reset Filters</Text>
//               </TouchableOpacity>
              
//               {useLive && (
//                 <TouchableOpacity
//                   onPress={() => setUseLive(false)}
//                   style={{
//                     backgroundColor: "#fff",
//                     paddingHorizontal: 20,
//                     paddingVertical: 10,
//                     borderRadius: 10,
//                     borderWidth: 1,
//                     borderColor: "#0F70F0",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 6,
//                   }}
//                   activeOpacity={0.9}
//                 >
//                   <Ionicons name="list" size={16} color="#0F70F0" />
//                   <Text style={{ color: "#0F70F0", fontWeight: "800" }}>View Curated</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         }
//         ListFooterComponent={
//           !useLive && loading && hasMore ? (
//             <View style={{ paddingVertical: 16 }}>
//               <ActivityIndicator color="#0F70F0" />
//             </View>
//           ) : null
//         }
//         contentContainerStyle={{
//           paddingHorizontal: 16,
//           paddingTop: Platform.OS === "web" ? 6 : 4,
//           paddingBottom: padBottom,
//           ...(Platform.OS === "web" ? { maxWidth: 1100, alignSelf: "center", width: "100%" } : {}),
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
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import EventsHeader from "../components/Events/EventsHeader";
import EventsFilterModal from "../components/Events/EventsFilterModal";
import EventCard from "../components/Events/EventCard";
import EventDetailsSheet from "../components/Events/EventDetailsSheet";

// ✅ Import offline storage functions
import { 
  saveEventOffline, 
  isEventSavedOffline,
  removeOfflineEvent 
} from "../utils/offlineStorage";

import getBaseURL from "../config/env";
const API_BASE = getBaseURL().replace(/\/+$/, "");

const COLORS = {
  page: "#F6FAFD",
  border: "#EAF0F6",
  text: "#0F3A6B",
};

export default function EventsExplorerScreen() {
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
  const [dateWindow, setDateWindow] = useState("2026");
  const [useLive, setUseLive] = useState(false);

  // data/pagination
  const [events, setEvents] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // details sheet
  const [selected, setSelected] = useState(null);

  // ✅ Offline state
  const [offlineStatus, setOfflineStatus] = useState({});
  const [downloading, setDownloading] = useState(null);

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

  // ✅ Check offline status for all events
  const checkOfflineStatus = async (eventsList) => {
    const statusMap = {};
    for (const event of eventsList) {
      const eventId = event.id || event.external_id || `${event.title}-${event.start}`;
      const isSaved = await isEventSavedOffline(eventId);
      statusMap[eventId] = isSaved;
    }
    setOfflineStatus(statusMap);
  };

  // Updated date range computation
  const computeDateRange = () => {
    if (dateWindow === "all") return {};
    
    const df = new Date();
    const dt = new Date();
    
    if (dateWindow === "upcoming") {
      dt.setMonth(df.getMonth() + 6);
    } else if (dateWindow === "2026") {
      return {
        date_from: "2026-01-01",
        date_to: "2026-12-31",
      };
    } else {
      dt.setFullYear(df.getFullYear() + 1);
    }
    
    const fmt = (d) => d.toISOString().slice(0, 10);
    return { date_from: fmt(df), date_to: fmt(dt) };
  };

  const buildQuery = (nextOffset = 0) => {
    const p = new URLSearchParams();
    const dr = computeDateRange();

    if (!useLive) {
      p.set("limit", String(dateWindow === "all" ? 200 : 60));
      p.set("offset", String(nextOffset));
    }

    if (dr.date_from) p.set("date_from", dr.date_from);
    if (dr.date_to)   p.set("date_to",   dr.date_to);

    if (search.trim()) p.set("q", search.trim());
    if (loc !== "All") p.set("city", loc);
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
      setHasMore(!useLive && !!json?.has_more);
      setOffset(!useLive ? (json?.next_offset ?? nextOffset + items.length) : 0);
      
      // ✅ Check offline status
      const eventsToCheck = mode === "replace" ? items : [...events, ...items];
      await checkOfflineStatus(eventsToCheck);
    } catch (e) {
      console.warn("events fetch error", e);
    } finally {
      setLoading(false);
    }
  };

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

  // ✅ Handle download for offline
  const handleDownloadOffline = async (event) => {
    const eventId = event.id || event.external_id || `${event.title}-${event.start}`;
    setDownloading(eventId);
    
    try {
      const normalizedEvent = {
        id: eventId,
        title: event.title || event.name,
        description: event.description,
        city: event.city,
        venue_name: event.venue_name,
        venue_address: event.venue_address,
        date: event.date || event.start || event.start_time,
        category: event.category,
        image: event.image || event.image_url,
        price: event.price,
        url: event.url,
        source: event.source || 'curated',
        start: event.start || event.start_time,
        end: event.end || event.end_time,
        savedAt: new Date().toISOString(),
      };
      
      const success = await saveEventOffline(normalizedEvent);
      
      if (success) {
        setOfflineStatus(prev => ({ ...prev, [eventId]: true }));
        Alert.alert(
          '✓ Saved Offline',
          `"${event.title}" is now available offline.\n\nAccess it from: Profile → Offline`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Could not save event offline');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to save for offline access');
    } finally {
      setDownloading(null);
    }
  };

  // ✅ Handle remove from offline
  const handleRemoveOffline = async (event) => {
    const eventId = event.id || event.external_id || `${event.title}-${event.start}`;
    
    Alert.alert(
      'Remove Offline Access',
      'Remove this event from offline storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removeOfflineEvent(eventId);
            if (success) {
              setOfflineStatus(prev => ({ ...prev, [eventId]: false }));
              Alert.alert('Removed', 'Event removed from offline storage');
            }
          },
        },
      ]
    );
  };

  const filtered = events;

  const renderItem = ({ item }) => {
    const eventId = item.id || item.external_id || `${item.title}-${item.start}`;
    const isSavedOffline = offlineStatus[eventId];
    const isDownloading = downloading === eventId;

    return (
      <EventCard
        item={item}
        onPress={() => setSelected(item)}
        isSavedOffline={isSavedOffline}
        isDownloading={isDownloading}
        onDownloadOffline={() => handleDownloadOffline(item)}
        onRemoveOffline={() => handleRemoveOffline(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <EventsHeader
        search={search}
        onChangeSearch={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        dateWindow={dateWindow}
        setDateWindow={setDateWindow}
        useLive={useLive}
        setUseLive={setUseLive}
      />

      {__DEV__ ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 6 }}>
          <Text style={{ color: "#64748b", fontSize: 12 }}>
            mode:{useLive ? "live" : "stored"} • events:{events?.length ?? 0} • filtered:{filtered?.length ?? 0} • offline:{Object.values(offlineStatus).filter(Boolean).length}
          </Text>
        </View>
      ) : null}

      <FlatList
        style={{ flex: 1 }}
        data={filtered}
        key={numColumns}
        keyExtractor={(e, index) => {
          const baseKey = e.id || e.external_id || e.title || 'event';
          const sourceKey = e.source || 'unknown';
          const timeKey = (e.start || e.start_time || '').substring(0, 10);
          return `${sourceKey}-${baseKey}-${timeKey}-${index}`;
        }}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={64} color="#cbd5e1" style={{ marginBottom: 16 }} />
            
            <Text style={{ 
              color: "#475569", 
              fontWeight: "700", 
              fontSize: 16,
              marginBottom: 8,
              textAlign: "center",
            }}>
              {useLive ? "No live events found" : "No events match your filters"}
            </Text>
            
            <Text style={{ 
              color: "#94a3b8", 
              fontSize: 14,
              marginBottom: 20,
              textAlign: "center",
              paddingHorizontal: 20,
            }}>
              {useLive 
                ? "Try switching to 'Curated' events or selecting a different city"
                : "Try selecting 'All' locations or '2026' date range"
              }
            </Text>
            
            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  setSearch("");
                  setLoc("All");
                  setCategory("All");
                  setDateWindow("2026");
                }}
                style={{
                  backgroundColor: "#0F70F0",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
                activeOpacity={0.9}
              >
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={{ color: "#fff", fontWeight: "800" }}>Reset Filters</Text>
              </TouchableOpacity>
              
              {useLive && (
                <TouchableOpacity
                  onPress={() => setUseLive(false)}
                  style={{
                    backgroundColor: "#fff",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#0F70F0",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                  activeOpacity={0.9}
                >
                  <Ionicons name="list" size={16} color="#0F70F0" />
                  <Text style={{ color: "#0F70F0", fontWeight: "800" }}>View Curated</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        ListFooterComponent={
          !useLive && loading && hasMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color="#0F70F0" />
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
        isSavedOffline={selected ? offlineStatus[selected.id || selected.external_id || `${selected.title}-${selected.start}`] : false}
        isDownloading={selected ? downloading === (selected.id || selected.external_id || `${selected.title}-${selected.start}`) : false}
        onDownloadOffline={selected ? () => handleDownloadOffline(selected) : undefined}
        onRemoveOffline={selected ? () => handleRemoveOffline(selected) : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.page },
});