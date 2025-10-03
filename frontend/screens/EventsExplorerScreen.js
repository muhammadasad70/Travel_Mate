// import React, { useMemo, useState } from "react";
// import { View, StyleSheet, Platform, FlatList, ActivityIndicator, useWindowDimensions } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import EventsHeader from "../components/Events/EventsHeader";
// import EventsFilterModal from "../components/Events/EventsFilterModal";
// import EventCard from "../components/Events/EventCard";
// import EventDetailsSheet from "../components/Events/EventDetailsSheet";

// /** Replace this with your fetched list later */
// const SAMPLE_EVENTS = [
//   {
//     id: "eb_1",
//     source: "eventbrite",
//     title: "Hunza Autumn Festival",
//     category: "Festival",
//     start: new Date(Date.now() + 86400000 * 2).toISOString(),
//     end: new Date(Date.now() + 86400000 * 2 + 3 * 3600000).toISOString(),
//     tz: "Asia/Karachi",
//     venue_name: "Karimabad Main Ground",
//     venue_address: "Karimabad, Hunza",
//     city: "Hunza Valley",
//     lat: 36.318, lng: 74.652,
//     image: "https://images.unsplash.com/photo-1604933834215-9805b17f6f84?q=80&w=1400&auto=format&fit=crop",
//     price: "Free",
//     url: "https://eventbrite.com/",
//   },
//   {
//     id: "tm_2",
//     source: "ticketmaster",
//     title: "Islamabad Food Carnival",
//     category: "Food",
//     start: new Date(Date.now() + 86400000 * 5).toISOString(),
//     end: null, tz: "Asia/Karachi",
//     venue_name: "F-9 Park",
//     venue_address: "Jinnah Ave, Islamabad",
//     city: "Islamabad",
//     lat: 33.7, lng: 73.02,
//     image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
//     price: "Rs 500+",
//     url: "https://ticketmaster.com/",
//   },
//   {
//     id: "eb_3",
//     source: "eventbrite",
//     title: "Swat Trek & Nature Walk",
//     category: "Outdoor",
//     start: new Date(Date.now() + 86400000 * 9).toISOString(),
//     end: null, tz: "Asia/Karachi",
//     venue_name: "Malam Jabba Base",
//     venue_address: "Swat Valley",
//     city: "Swat Valley",
//     image: "https://images.unsplash.com/photo-1600508773685-cab1ca79cd3e?q=80&w=1400&auto=format&fit=crop",
//     price: "Free",
//     url: "https://eventbrite.com/",
//   },
// ];

// const COLORS = {
//   page: "#F6FAFD",
//   border: "#EAF0F6",
// };

// export default function EventsExplorerScreen({ eventsProp, onAddToItinerary }) {
//   const events = useMemo(() => (Array.isArray(eventsProp) ? eventsProp : SAMPLE_EVENTS), [eventsProp]);

//   const { width } = useWindowDimensions();
//   const isPhone = width < 520;
//   const numColumns = isPhone ? 1 : 2;

//   // header/filter state
//   const [search, setSearch] = useState("");
//   const [filtersOpen, setFiltersOpen] = useState(false);
//   const [loc, setLoc] = useState("All");
//   const [category, setCategory] = useState("All");
//   const [dateWindow, setDateWindow] = useState("60d"); // week | 30d | 60d

//   // details sheet
//   const [selected, setSelected] = useState(null);

//   // derive filter lists
//   const locations = useMemo(() => {
//     const set = new Set(["All"]);
//     events.forEach((e) => e.city && set.add(e.city));
//     return Array.from(set);
//   }, [events]);
//   const categories = useMemo(() => {
//     const set = new Set(["All", "Music", "Festival", "Food", "Sports", "Outdoor", "Tech", "Arts"]);
//     events.forEach((e) => e.category && set.add(e.category));
//     return Array.from(set);
//   }, [events]);

//   // filter logic
//   const filtered = useMemo(() => {
//     const now = new Date();
//     const end = new Date();
//     if (dateWindow === "week") end.setDate(now.getDate() + 7);
//     else if (dateWindow === "30d") end.setDate(now.getDate() + 30);
//     else end.setDate(now.getDate() + 60);

//     const ql = search.trim().toLowerCase();

//     return events.filter((e) => {
//       const t = (e.title || "").toLowerCase();
//       const c = (e.category || "").toLowerCase();
//       const city = (e.city || "").toLowerCase();
//       const inText = !ql || t.includes(ql) || c.includes(ql) || city.includes(ql);
//       const inLoc = loc === "All" || e.city === loc;
//       const inCat = category === "All" || e.category === category;
//       const dt = e.start ? new Date(e.start) : null;
//       const inRange = !dt || (dt >= now && dt <= end);
//       return inText && inLoc && inCat && inRange;
//     });
//   }, [events, search, loc, category, dateWindow]);

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

//       {/* Content (no nested ScrollViews) */}
//       {false ? (
//         <ActivityIndicator style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={filtered}
//           key={numColumns} // remount on layout change
//           keyExtractor={(e) => String(e.id)}
//           renderItem={renderItem}
//           numColumns={numColumns}
//           columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
//           ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//           contentContainerStyle={{
//             paddingHorizontal: 16,
//             paddingBottom: 120,
//             paddingTop: Platform.OS === "web" ? 12 : 8,
//             ...(Platform.OS === "web" ? { maxWidth: 1100, alignSelf: "center", width: "100%" } : {}),
//             rowGap: 12,
//           }}
//         />
//       )}

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



// import React, { useMemo, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Platform,
//   FlatList,
//   ActivityIndicator,
//   useWindowDimensions,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import EventsHeader from "../components/Events/EventsHeader";
// import EventsFilterModal from "../components/Events/EventsFilterModal";
// import EventCard from "../components/Events/EventCard";
// import EventDetailsSheet from "../components/Events/EventDetailsSheet";

// /** Replace this with your fetched list later */
// const SAMPLE_EVENTS = [
//   {
//     id: "eb_1",
//     source: "eventbrite",
//     title: "Hunza Autumn Festival",
//     category: "Festival",
//     start: new Date(Date.now() + 86400000 * 2).toISOString(),
//     end: new Date(Date.now() + 86400000 * 2 + 3 * 3600000).toISOString(),
//     tz: "Asia/Karachi",
//     venue_name: "Karimabad Main Ground",
//     venue_address: "Karimabad, Hunza",
//     city: "Hunza Valley",
//     lat: 36.318, lng: 74.652,
//     image: "https://images.unsplash.com/photo-1604933834215-9805b17f6f84?q=80&w=1400&auto=format&fit=crop",
//     price: "Free",
//     url: "https://eventbrite.com/",
//   },
//   {
//     id: "tm_2",
//     source: "ticketmaster",
//     title: "Islamabad Food Carnival",
//     category: "Food",
//     start: new Date(Date.now() + 86400000 * 5).toISOString(),
//     end: null, tz: "Asia/Karachi",
//     venue_name: "F-9 Park",
//     venue_address: "Jinnah Ave, Islamabad",
//     city: "Islamabad",
//     lat: 33.7, lng: 73.02,
//     image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
//     price: "Rs 500+",
//     url: "https://ticketmaster.com/",
//   },
//   {
//     id: "eb_3",
//     source: "eventbrite",
//     title: "Swat Trek & Nature Walk",
//     category: "Outdoor",
//     start: new Date(Date.now() + 86400000 * 9).toISOString(),
//     end: null, tz: "Asia/Karachi",
//     venue_name: "Malam Jabba Base",
//     venue_address: "Swat Valley",
//     city: "Swat Valley",
//     image: "https://images.unsplash.com/photo-1600508773685-cab1ca79cd3e?q=80&w=1400&auto=format&fit=crop",
//     price: "Free",
//     url: "https://eventbrite.com/",
//   },
// ];

// const COLORS = {
//   page: "#F6FAFD",
//   border: "#EAF0F6",
// };

// export default function EventsExplorerScreen({ eventsProp, onAddToItinerary }) {
//   const events = useMemo(() => (Array.isArray(eventsProp) ? eventsProp : SAMPLE_EVENTS), [eventsProp]);

//   const { width } = useWindowDimensions();
//   const insets = useSafeAreaInsets();

//   const isPhone = width < 520;
//   const numColumns = isPhone ? 1 : 2;

//   // height of your bottom nav bar on mobile
//   const bottomBarH = 64;
//   const padBottom =
//     bottomBarH +
//     (Platform.OS === "ios" ? insets.bottom : Math.max(insets.bottom, 8));

//   // header/filter state
//   const [search, setSearch] = useState("");
//   const [filtersOpen, setFiltersOpen] = useState(false);
//   const [loc, setLoc] = useState("All");
//   const [category, setCategory] = useState("All");
//   const [dateWindow, setDateWindow] = useState("60d"); // week | 30d | 60d

//   // details sheet
//   const [selected, setSelected] = useState(null);

//   // derive filter lists
//   const locations = useMemo(() => {
//     const set = new Set(["All"]);
//     events.forEach((e) => e.city && set.add(e.city));
//     return Array.from(set);
//   }, [events]);

//   const categories = useMemo(() => {
//     const set = new Set(["All", "Music", "Festival", "Food", "Sports", "Outdoor", "Tech", "Arts"]);
//     events.forEach((e) => e.category && set.add(e.category));
//     return Array.from(set);
//   }, [events]);

//   // filter logic
//   const filtered = useMemo(() => {
//     const now = new Date();
//     const end = new Date();
//     if (dateWindow === "week") end.setDate(now.getDate() + 7);
//     else if (dateWindow === "30d") end.setDate(now.getDate() + 30);
//     else end.setDate(now.getDate() + 60);

//     const ql = search.trim().toLowerCase();

//     return events.filter((e) => {
//       const t = (e.title || "").toLowerCase();
//       const c = (e.category || "").toLowerCase();
//       const city = (e.city || "").toLowerCase();
//       const inText = !ql || t.includes(ql) || c.includes(ql) || city.includes(ql);
//       const inLoc = loc === "All" || e.city === loc;
//       const inCat = category === "All" || e.category === category;
//       const dt = e.start ? new Date(e.start) : null;
//       const inRange = !dt || (dt >= now && dt <= end);
//       return inText && inLoc && inCat && inRange;
//     });
//   }, [events, search, loc, category, dateWindow]);

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

//       {/* Content (no nested ScrollViews) */}
//       {false ? (
//         <ActivityIndicator style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={filtered}
//           key={numColumns} // remount on layout change
//           keyExtractor={(e) => String(e.id)}
//           renderItem={renderItem}
//           numColumns={numColumns}
//           columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
//           ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//           contentContainerStyle={{
//             paddingHorizontal: 16,
//             paddingTop: Platform.OS === "web" ? 12 : 8,
//             paddingBottom: padBottom, // <-- keeps last cards above the bottom bar
//             ...(Platform.OS === "web" ? { maxWidth: 1100, alignSelf: "center", width: "100%" } : {}),
//             rowGap: 12,
//           }}
//           // If you prefer a visible spacer instead of padding, uncomment:
//           // ListFooterComponent={<View style={{ height: padBottom }} />}
//         />
//       )}

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




import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import EventsHeader from "../components/Events/EventsHeader";
import EventsFilterModal from "../components/Events/EventsFilterModal";
import EventCard from "../components/Events/EventCard";
import EventDetailsSheet from "../components/Events/EventDetailsSheet";

/** Replace this with your fetched list later */
const SAMPLE_EVENTS = [
  {
    id: "eb_1",
    source: "eventbrite",
    title: "Hunza Autumn Festival",
    category: "Festival",
    start: new Date(Date.now() + 86400000 * 2).toISOString(),
    end: new Date(Date.now() + 86400000 * 2 + 3 * 3600000).toISOString(),
    tz: "Asia/Karachi",
    venue_name: "Karimabad Main Ground",
    venue_address: "Karimabad, Hunza",
    city: "Hunza Valley",
    lat: 36.318, lng: 74.652,
    image: "https://images.unsplash.com/photo-1604933834215-9805b17f6f84?q=80&w=1400&auto=format&fit=crop",
    price: "Free",
    url: "https://eventbrite.com/",
  },
  {
    id: "tm_2",
    source: "ticketmaster",
    title: "Islamabad Food Carnival",
    category: "Food",
    start: new Date(Date.now() + 86400000 * 5).toISOString(),
    end: null, tz: "Asia/Karachi",
    venue_name: "F-9 Park",
    venue_address: "Jinnah Ave, Islamabad",
    city: "Islamabad",
    lat: 33.7, lng: 73.02,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop",
    price: "Rs 500+",
    url: "https://ticketmaster.com/",
  },
  {
    id: "eb_3",
    source: "eventbrite",
    title: "Swat Trek & Nature Walk",
    category: "Outdoor",
    start: new Date(Date.now() + 86400000 * 9).toISOString(),
    end: null, tz: "Asia/Karachi",
    venue_name: "Malam Jabba Base",
    venue_address: "Swat Valley",
    city: "Swat Valley",
    image: "https://images.unsplash.com/photo-1600508773685-cab1ca79cd3e?q=80&w=1400&auto=format&fit=crop",
    price: "Free",
    url: "https://eventbrite.com/",
  },
];

const COLORS = {
  page: "#F6FAFD",
  border: "#EAF0F6",
  text: "#0F3A6B",
};

export default function EventsExplorerScreen({ eventsProp, onAddToItinerary }) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const events = useMemo(
    () => (Array.isArray(eventsProp) ? eventsProp : SAMPLE_EVENTS),
    [eventsProp]
  );

  const isPhone = width < 520;
  const numColumns = isPhone ? 1 : 2;

  // height of your bottom nav bar on mobile
  const bottomBarH = 64;
  const padBottom =
    bottomBarH +
    (Platform.OS === "ios" ? insets.bottom : Math.max(insets.bottom, 8));

  // header/filter state
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loc, setLoc] = useState("All");
  const [category, setCategory] = useState("All");
  const [dateWindow, setDateWindow] = useState("60d"); // week | 30d | 60d

  // details sheet
  const [selected, setSelected] = useState(null);

  // derive filter lists
  const locations = useMemo(() => {
    const set = new Set(["All"]);
    events.forEach((e) => e.city && set.add(e.city));
    return Array.from(set);
  }, [events]);

  const categories = useMemo(() => {
    const set = new Set([
      "All",
      "Music",
      "Festival",
      "Food",
      "Sports",
      "Outdoor",
      "Tech",
      "Arts",
    ]);
    events.forEach((e) => e.category && set.add(e.category));
    return Array.from(set);
  }, [events]);

  // filter logic
  const filtered = useMemo(() => {
    const now = new Date();
    const end = new Date();
    if (dateWindow === "week") end.setDate(now.getDate() + 7);
    else if (dateWindow === "30d") end.setDate(now.getDate() + 30);
    else end.setDate(now.getDate() + 60);

    const ql = search.trim().toLowerCase();

    return events.filter((e) => {
      const t = (e.title || "").toLowerCase();
      const c = (e.category || "").toLowerCase();
      const city = (e.city || "").toLowerCase();
      const inText = !ql || t.includes(ql) || c.includes(ql) || city.includes(ql);
      const inLoc = loc === "All" || e.city === loc;
      const inCat = category === "All" || e.category === category;
      const dt = e.start ? new Date(e.start) : null;
      const inRange = !dt || (dt >= now && dt <= end);
      return inText && inLoc && inCat && inRange;
    });
  }, [events, search, loc, category, dateWindow]);

  const renderItem = ({ item }) => (
    <EventCard
      item={item}
      onPress={() => setSelected(item)}
      onAddToItinerary={() => onAddToItinerary?.(item)}
    />
  );

  return (
    <SafeAreaView style={styles.page}>
      {/* Back to TravelerDashboard */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate("TravelerDashboard", { tabKey: `explore-${Date.now()}` });
          }}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.text} />
          <Text style={{ color: COLORS.text, fontWeight: "800", marginLeft: 4 }}>Back</Text>
        </TouchableOpacity>
      </View>

      <EventsHeader
        search={search}
        onChangeSearch={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        dateWindow={dateWindow}
        setDateWindow={setDateWindow}
      />

      {/* Content (no nested ScrollViews) */}
      {false ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filtered}
          key={numColumns} // remount on layout change
          keyExtractor={(e) => String(e.id)}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? { gap: 12 } : null}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: Platform.OS === "web" ? 12 : 8,
            paddingBottom: padBottom, // keep last cards above bottom bar
            ...(Platform.OS === "web"
              ? { maxWidth: 1100, alignSelf: "center", width: "100%" }
              : {}),
            rowGap: 12,
          }}
        />
      )}

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
  topRow: {
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 2,
  },
  backBtn: {
    width: 90,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F3F6FA",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
  },
});



