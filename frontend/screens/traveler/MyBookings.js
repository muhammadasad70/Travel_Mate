
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   RefreshControl,
//   Platform,
//   Animated,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import getBaseURL from "../../config/env";

// const API = getBaseURL();

// export default function MyBookings() {
//   const navigation = useNavigation();
//   const [bookings, setBookings] = useState(null);
//   const [tab, setTab] = useState("all");
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchBookings = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await fetch(`${API}/cultural/bookings`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setBookings(data);
//     } catch (e) {
//       console.error(e);
//       setBookings([]);
//     } finally {
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const filtered = useMemo(() => {
//     if (!bookings) return [];
//     if (tab === "all") return bookings;
//     return bookings.filter((b) => b.status === tab);
//   }, [tab, bookings]);

//   const counts = useMemo(() => ({
//     all: bookings?.length || 0,
//     pending: bookings?.filter((b) => b.status === "pending").length || 0,
//     confirmed: bookings?.filter((b) => b.status === "confirmed").length || 0,
//   }), [bookings]);

//   const renderItem = ({ item, index }) => {
//     const fadeAnim = new Animated.Value(0);
//     Animated.timing(fadeAnim, { toValue: 1, duration: 500 + index * 150, useNativeDriver: true }).start();

//     return (
//       <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleRow}>
//             <Ionicons name="briefcase-outline" size={18} color="#0F3A6B" />
//             <Text style={styles.cardTitle}>Service #{item.service_id}</Text>
//           </View>
//           <View style={[
//               styles.statusTag,
//               item.status === "confirmed" && styles.statusConfirmed,
//               item.status === "pending" && styles.statusPending,
//             ]}
//           >
//             <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
//           </View>
//         </View>

//         <View style={styles.infoRow}>
//           <Ionicons name="people-outline" size={15} color="#64748B" />
//           <Text style={styles.infoText}>Participants: {item.participants}</Text>
//         </View>

//         {item.price_snapshot && (
//           <View style={styles.priceBox}>
//             <Ionicons name="pricetag-outline" size={16} color="#047857" />
//             <Text style={styles.price}>Rs {item.price_snapshot}</Text>
//           </View>
//         )}
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Gradient Header */}
//       <LinearGradient
//         colors={["#E0EAFC", "#CFDEF3"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.headerGradient}
//       >
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={18} color="#0F3A6B" />
//           <Text style={styles.backTxt}>Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.heading}>My Bookings</Text>
//         <Text style={styles.subHeading}>
//           {counts.all} total • {counts.pending} pending • {counts.confirmed} confirmed
//         </Text>

//         <View style={styles.tabs}>
//           <TouchableOpacity
//             onPress={() => setTab("all")}
//             style={[styles.tab, tab === "all" && styles.tabActive]}
//           >
//             <Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>
//               All ({counts.all})
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setTab("pending")}
//             style={[styles.tab, tab === "pending" && styles.tabActive]}
//           >
//             <Text style={[styles.tabText, tab === "pending" && styles.tabTextActive]}>
//               Pending ({counts.pending})
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setTab("confirmed")}
//             style={[styles.tab, tab === "confirmed" && styles.tabActive]}
//           >
//             <Text style={[styles.tabText, tab === "confirmed" && styles.tabTextActive]}>
//               Confirmed ({counts.confirmed})
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       {!bookings ? (
//         <ActivityIndicator style={{ marginTop: 40 }} />
//       ) : (
//         <FlatList
//           data={filtered}
//           keyExtractor={(it) => it.id.toString()}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContainer}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBookings} />}
//           ListEmptyComponent={
//             <View style={styles.empty}>
//               <Ionicons name="calendar-outline" size={36} color="#64748B" />
//               <Text style={styles.emptyText}>No bookings yet</Text>
//               <TouchableOpacity
//                 style={styles.exploreBtn}
//                 onPress={() => navigation.navigate("TravelerDashboard")}
//               >
//                 <Ionicons name="compass-outline" size={16} color="#fff" />
//                 <Text style={styles.exploreTxt}>Explore Services</Text>
//               </TouchableOpacity>
//             </View>
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F8FAFC" },
//   headerGradient: { paddingTop: 80, paddingHorizontal: 18, paddingBottom: 28 },
//   heading: { fontSize: 22, fontWeight: "800", color: "#032246ff", marginBottom: 4 },
//   subHeading: { color: "#475569", fontWeight: "600" },
//   backBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingVertical: 7,
//     borderRadius: 999,
//     alignSelf: "flex-start",
//     marginBottom: 10,  
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 3,
//     transform: [{ translateY: -10 }],
//   },
//   backTxt: { fontWeight: "700", color: "#0F3A6B" },

//   tabs: { flexDirection: "row", gap: 8, marginTop: 12 },
//   tab: {
//     backgroundColor: "#E2E8F0",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 999,
//   },
//   tabActive: { backgroundColor: "#0F3A6B" },
//   tabText: { fontWeight: "700", color: "#334155" },
//   tabTextActive: { color: "#fff" },

//   listContainer: { padding: 16, paddingBottom: 100, gap: 12 },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   cardTitle: { fontWeight: "800", color: "#0F3A6B" },
//   infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
//   infoText: { color: "#475569", fontWeight: "600" },
//   priceBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#ECFDF5",
//     borderColor: "#A7F3D0",
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     alignSelf: "flex-start",
//     marginTop: 8,
//   },
//   price: { color: "#047857", fontWeight: "800" },
//   statusTag: {
//     borderWidth: 1,
//     borderRadius: 999,
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderColor: "#CBD5E1",
//     backgroundColor: "#F1F5F9",
//   },
//   statusConfirmed: { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" },
//   statusPending: { backgroundColor: "#FEF9C3", borderColor: "#FACC15" },
//   statusText: { fontWeight: "800", fontSize: 11, color: "#334155" },

//   empty: { alignItems: "center", justifyContent: "center", marginTop: 60, gap: 10 },
//   emptyText: { fontSize: 16, fontWeight: "700", color: "#475569" },
//   exploreBtn: {
//     backgroundColor: "#0F3A6B",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 6,
//   },
//   exploreTxt: { color: "#fff", fontWeight: "700" },
// });
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import getBaseURL from "../../config/env";

const API = getBaseURL();

export default function MyBookings() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState(null);
  const [tab, setTab] = useState("all"); // "all" | "pending" | "confirmed"
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API}/cultural/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setBookings([]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filtered = useMemo(() => {
    if (!bookings) return [];
    if (tab === "all") return bookings;
    return bookings.filter((b) => (b?.status || "").toLowerCase() === tab);
  }, [tab, bookings]);

  const counts = useMemo(() => ({
    all: bookings?.length || 0,
    pending: bookings?.filter((b) => b.status === "pending").length || 0,
    confirmed: bookings?.filter((b) => b.status === "confirmed").length || 0,
  }), [bookings]);

  // ---------- helpers (safe with/without enriched backend) ----------
  const getTitle = (b) => (b?.service?.title ? b.service.title : `Service #${b?.service_id}`);
  const getCity = (b) => (b?.service?.city || null);
  const getDuration = (b) => (b?.service?.duration_hours ? `${b.service.duration_hours}h` : null);

  const getPriceText = (b) => {
    const svc = b?.service || {};
    const model = (svc.pricing_model || b?.pricing_model || "").toLowerCase();
    const ppp = svc.price_per_person ?? null;
    const ppg = svc.price_per_group ?? null;

    if (model === "per_person" && ppp) return `Rs ${ppp} / person`;
    if (model === "per_group" && ppg) return `Rs ${ppg} / group`;
    if (typeof b?.price_snapshot === "number") return `Rs ${b.price_snapshot}`;
    return null;
  };

  const renderItem = ({ item, index }) => {
    const fadeAnim = new Animated.Value(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500 + index * 150,
      useNativeDriver: true,
    }).start();

    const title = getTitle(item);
    const city = getCity(item);
    const dur = getDuration(item);
    const priceText = getPriceText(item);

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="briefcase-outline" size={18} color="#0F3A6B" />
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          <View
            style={[
              styles.statusTag,
              item.status === "confirmed" && styles.statusConfirmed,
              item.status === "pending" && styles.statusPending,
            ]}
          >
            <Text style={styles.statusText}>{String(item.status).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.metaRowWrap}>
          {city && (
            <View className="meta" style={styles.metaPill}>
              <Ionicons name="location-outline" size={14} color="#475569" />
              <Text style={styles.metaText}>{city}</Text>
            </View>
          )}
          {dur && (
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={14} color="#475569" />
              <Text style={styles.metaText}>{dur}</Text>
            </View>
          )}
          <View style={styles.metaPill}>
            <Ionicons name="people-outline" size={14} color="#475569" />
            <Text style={styles.metaText}>Participants: {item.participants}</Text>
          </View>
        </View>

        {priceText && (
          <View style={styles.priceBox}>
            <Ionicons name="pricetag-outline" size={16} color="#047857" />
            <Text style={styles.price}>{priceText}</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#E0EAFC", "#CFDEF3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#0F3A6B" />
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>My Bookings</Text>
        <Text style={styles.subHeading}>
          {counts.all} total • {counts.pending} pending • {counts.confirmed} confirmed
        </Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setTab("all")}
            style={[styles.tab, tab === "all" && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>
              All ({counts.all})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("pending")}
            style={[styles.tab, tab === "pending" && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === "pending" && styles.tabTextActive]}>
              Pending ({counts.pending})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("confirmed")}
            style={[styles.tab, tab === "confirmed" && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === "confirmed" && styles.tabTextActive]}>
              Confirmed ({counts.confirmed})
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {!bookings ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(it) => String(it.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchBookings} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={36} color="#64748B" />
              <Text style={styles.emptyText}>No bookings yet</Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate("TravelerDashboard")}
              >
                <Ionicons name="compass-outline" size={16} color="#fff" />
                <Text style={styles.exploreTxt}>Explore Services</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerGradient: { paddingTop: 80, paddingHorizontal: 18, paddingBottom: 28 },
  heading: { fontSize: 22, fontWeight: "800", color: "#032246ff", marginBottom: 4 },
  subHeading: { color: "#475569", fontWeight: "600" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    transform: [{ translateY: -10 }],
  },
  backTxt: { fontWeight: "700", color: "#0F3A6B" },

  tabs: { flexDirection: "row", gap: 8, marginTop: 12 },
  tab: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabActive: { backgroundColor: "#0F3A6B" },
  tabText: { fontWeight: "700", color: "#334155" },
  tabTextActive: { color: "#fff" },

  listContainer: { padding: 16, paddingBottom: 100, gap: 12 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTitle: { fontWeight: "800", color: "#0F3A6B" },

  metaRowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  metaText: { color: "#475569", fontWeight: "600", fontSize: 12 },

  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  price: { color: "#047857", fontWeight: "800" },

  statusTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderColor: "#CBD5E1",
    backgroundColor: "#F1F5F9",
  },
  statusConfirmed: { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" },
  statusPending: { backgroundColor: "#FEF9C3", borderColor: "#FACC15" },
  statusText: { fontWeight: "800", fontSize: 11, color: "#334155" },

  empty: { alignItems: "center", justifyContent: "center", marginTop: 60, gap: 10 },
  emptyText: { fontSize: 16, fontWeight: "700", color: "#475569" },
  exploreBtn: {
    backgroundColor: "#0F3A6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  exploreTxt: { color: "#fff", fontWeight: "700" },
});
