// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Platform,
//   FlatList,
//   SafeAreaView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API || "http://localhost:8080";

// export default function Notifications() {
//   const [auth, setAuth] = useState({ token: null, userId: null });
//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState({}); // { [requestId]: true }
//   const [error, setError] = useState(null);
//   const [requests, setRequests] = useState([]); // pending follow requests

//   // load token + userId saved by LoginScreen
//   useEffect(() => {
//     (async () => {
//       const [token, userId] = await AsyncStorage.multiGet(["token", "userId"]);
//       setAuth({
//         token: token?.[1] || null,
//         userId: userId?.[1] ? Number(userId[1]) : null,
//       });
//     })();
//   }, []);

//   const headers = useMemo(() => {
//     const h = { "Content-Type": "application/json" };
//     if (auth.token) h.Authorization = `Bearer ${auth.token}`;
//     return h;
//   }, [auth]);

//   const fetchPending = useCallback(async () => {
//     if (!auth.userId) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/social/follow-requests/pending/${auth.userId}`,
//         { method: "GET", headers }
//       );
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();

//       // API shape from your controller:
//       // { pending_requests: [{ id, follower_id, following_id, status, follower:{ username, full_name, image_url, bio } }], count: N }
//       setRequests(Array.isArray(data.pending_requests) ? data.pending_requests : []);
//     } catch (e) {
//       setError(e?.message || "Failed to load requests");
//       setRequests([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [auth.userId, headers]);

//   useEffect(() => {
//     if (auth.userId) fetchPending();
//   }, [auth.userId, fetchPending]);

//   const approve = async (req) => {
//     if (busy[req.id]) return;
//     try {
//       setBusy((p) => ({ ...p, [req.id]: true }));
//       const res = await fetch(`${API_BASE_URL}/social/follow-requests/approve`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({
//           follower_id: req.follower_id,
//           following_id: req.following_id,
//         }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       // Optimistically remove
//       setRequests((list) => list.filter((r) => r.id !== req.id));
//     } catch (e) {
//       setError(e?.message || "Failed to approve request");
//     } finally {
//       setBusy((p) => {
//         const c = { ...p };
//         delete c[req.id];
//         return c;
//       });
//     }
//   };

//   const reject = async (req) => {
//     if (busy[req.id]) return;
//     try {
//       setBusy((p) => ({ ...p, [req.id]: true }));
//       const res = await fetch(`${API_BASE_URL}/social/follow-requests/reject`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({
//           follower_id: req.follower_id,
//           following_id: req.following_id,
//         }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       setRequests((list) => list.filter((r) => r.id !== req.id));
//     } catch (e) {
//       setError(e?.message || "Failed to reject request");
//     } finally {
//       setBusy((p) => {
//         const c = { ...p };
//         delete c[req.id];
//         return c;
//       });
//     }
//   };

//   const renderItem = ({ item }) => {
//     const avatar = item?.follower?.image_url || "https://placehold.co/64x64?text=U";
//     const fullName = item?.follower?.full_name || "Unknown User";
//     const username = item?.follower?.username ? `@${item.follower.username}` : "";
//     const isBusy = !!busy[item.id];

//     return (
//       <View style={styles.cardRow}>
//         <Image source={{ uri: avatar }} style={styles.avatar} />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1}>{fullName}</Text>
//           <Text style={styles.meta} numberOfLines={1}>
//             {username} wants to follow you
//           </Text>
//         </View>

//         <View style={styles.actions}>
//           <TouchableOpacity
//             onPress={() => approve(item)}
//             disabled={isBusy}
//             style={[styles.btn, styles.btnPrimary, isBusy && { opacity: 0.7 }]}
//             activeOpacity={0.9}
//           >
//             {isBusy ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.btnPrimaryText}>Accept</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => reject(item)}
//             disabled={isBusy}
//             style={[styles.btn, styles.btnGhost, isBusy && { opacity: 0.7 }]}
//             activeOpacity={0.9}
//           >
//             <Text style={styles.btnGhostText}>Decline</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const showPanel = loading || error || requests.length > 0;

//   return (
//     <SafeAreaView style={styles.page}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Notifications</Text>
//         <Text style={styles.subtitle}>Mentions, likes, and follow requests.</Text>

//         {/* Panel */}
//         {showPanel ? (
//           <View style={styles.panel}>
//             {loading ? (
//               <View style={styles.centerBlock}>
//                 <ActivityIndicator />
//                 <Text style={styles.loadingText}>Loading…</Text>
//               </View>
//             ) : error ? (
//               <View style={[styles.banner, styles.bannerError]}>
//                 <Ionicons name="alert-circle" size={18} color="#B42318" style={{ marginRight: 6 }} />
//                 <Text style={styles.bannerErrorText}>{error}</Text>
//                 <TouchableOpacity onPress={fetchPending} style={{ marginLeft: "auto" }}>
//                   <Text style={styles.link}>Retry</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : requests.length === 0 ? (
//               <View style={styles.centerBlock}>
//                 <Text style={styles.emptyText}>No new follow requests</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={requests}
//                 keyExtractor={(r) => String(r.id)}
//                 renderItem={renderItem}
//                 ItemSeparatorComponent={() => <View style={styles.separator} />}
//                 contentContainerStyle={{ paddingVertical: 6 }}
//                 refreshing={loading}
//                 onRefresh={fetchPending}
//               />
//             )}
//           </View>
//         ) : null}
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---- theme / styles (matches TravelMate look) ---- */
// const COLORS = {
//   page: "#F6FAFD",
//   card: "#FFFFFF",
//   text: "#0F3A6B",
//   subtext: "#64748B",
//   primary: "#0F70F0",
//   border: "#E9EDF2",
// };

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: COLORS.page },
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 18,
//     paddingBottom: 28,
//     width: "100%",
//     ...(Platform.OS === "web" ? { maxWidth: 1200, alignSelf: "center" } : {}),
//   },

//   title: { fontSize: 24, fontWeight: "800", color: COLORS.text, letterSpacing: 0.2 },
//   subtitle: { marginTop: 6, fontSize: 14, color: COLORS.subtext, marginBottom: 12 },

//   panel: {
//     flex: 1,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     minHeight: 420,
//     ...(Platform.OS === "web"
//       ? { boxSizing: "border-box", boxShadow: "0 8px 24px rgba(15,58,107,0.06)" }
//       : { elevation: 2 }),
//   },

//   centerBlock: { alignItems: "center", justifyContent: "center", paddingVertical: 28 },
//   loadingText: { marginTop: 6, color: COLORS.subtext, fontWeight: "600" },
//   emptyText: { color: COLORS.subtext, fontWeight: "600" },

//   banner: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginBottom: 8,
//   },
//   bannerError: { backgroundColor: "#FEF3F2", borderWidth: 1, borderColor: "#FEE4E2" },
//   bannerErrorText: { color: "#B42318", fontWeight: "600" },
//   link: { color: COLORS.primary, fontWeight: "700" },

//   cardRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 6 },
//   avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: "#EAF0F6" },
//   name: { color: "#0F172A", fontWeight: "700", fontSize: 15 },
//   meta: { color: COLORS.subtext, fontSize: 13 },

//   actions: { flexDirection: "row", gap: 8, marginLeft: 10 },
//   btn: {
//     borderRadius: 999,
//     borderWidth: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//   },
//   btnPrimary: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   btnPrimaryText: { color: "#FFFFFF", fontWeight: "800" },
//   btnGhost: { backgroundColor: "#EEF3F9", borderColor: COLORS.border },
//   btnGhostText: { color: "#0F172A", fontWeight: "800" },

//   separator: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 66 },
// });


// components/Social/Notifications.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  FlatList,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import getBaseURL from "../../config/env"; // ✅ use your existing env.js

const API_BASE_URL = getBaseURL();

export default function Notifications() {
  const [auth, setAuth] = useState({ token: null, userId: null });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({}); // { [requestId]: true }
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]); // pending follow requests

  // load token + userId saved by LoginScreen
  useEffect(() => {
    (async () => {
      const [[, token], [, userIdRaw]] = await AsyncStorage.multiGet([
        "token",
        "userId",
      ]);
      setAuth({
        token: token || null,
        userId: userIdRaw ? Number(userIdRaw) : null,
      });
    })();
  }, []);

  // Build headers; don't set Content-Type unless sending a JSON body
  const authHeaders = useMemo(() => {
    const h = {};
    if (auth.token) h.Authorization = `Bearer ${auth.token}`;
    return h;
  }, [auth.token]);

  const fetchPending = useCallback(async () => {
    if (!auth.userId) {
      setRequests([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/social/follow-requests/pending/${auth.userId}`,
        { method: "GET", headers: authHeaders }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // { pending_requests: [{ id, follower_id, following_id, status, follower:{ username, full_name, image_url, bio } }], count: N }
      const list = Array.isArray(data.pending_requests)
        ? data.pending_requests
        : [];
      setRequests(list);
    } catch (e) {
      setError(e?.message || "Failed to load requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [auth.userId, authHeaders, API_BASE_URL]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const approve = async (req) => {
    if (busy[req.id]) return;
    try {
      setBusy((p) => ({ ...p, [req.id]: true }));
      const res = await fetch(`${API_BASE_URL}/social/follow-requests/approve`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: req.follower_id,
          following_id: req.following_id,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Optimistically remove
      setRequests((list) => list.filter((r) => r.id !== req.id));
    } catch (e) {
      setError(e?.message || "Failed to approve request");
    } finally {
      setBusy((p) => {
        const c = { ...p };
        delete c[req.id];
        return c;
      });
    }
  };

  const reject = async (req) => {
    if (busy[req.id]) return;
    try {
      setBusy((p) => ({ ...p, [req.id]: true }));
      const res = await fetch(`${API_BASE_URL}/social/follow-requests/reject`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: req.follower_id,
          following_id: req.following_id,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRequests((list) => list.filter((r) => r.id !== req.id));
    } catch (e) {
      setError(e?.message || "Failed to reject request");
    } finally {
      setBusy((p) => {
        const c = { ...p };
        delete c[req.id];
        return c;
      });
    }
  };

  const renderItem = ({ item }) => {
    const avatar =
      item?.follower?.image_url || "https://placehold.co/64x64?text=U";
    const fullName = item?.follower?.full_name || "Unknown User";
    const username = item?.follower?.username ? `@${item.follower.username}` : "";
    const isBusy = !!busy[item.id];

    return (
      <View style={styles.cardRow}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {username} wants to follow you
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => approve(item)}
            disabled={isBusy}
            style={[styles.btn, styles.btnPrimary, isBusy && { opacity: 0.7 }]}
            activeOpacity={0.9}
          >
            {isBusy ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnPrimaryText}>Accept</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => reject(item)}
            disabled={isBusy}
            style={[styles.btn, styles.btnGhost, isBusy && { opacity: 0.7 }]}
            activeOpacity={0.9}
          >
            <Text style={styles.btnGhostText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const showPanel = loading || error || requests.length > 0;

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Mentions, likes, and follow requests.</Text>

        {!auth.userId && (
          <View style={[styles.banner, styles.bannerInfo]}>
            <Ionicons
              name="information-circle"
              size={18}
              color="#0F70F0"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.bannerInfoText}>Sign in to see your notifications.</Text>
          </View>
        )}

        {/* Panel */}
        {showPanel ? (
          <View style={styles.panel}>
            {loading ? (
              <View style={styles.centerBlock}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Loading…</Text>
              </View>
            ) : error ? (
              <View style={[styles.banner, styles.bannerError]}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color="#B42318"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.bannerErrorText}>{error}</Text>
                <TouchableOpacity onPress={fetchPending} style={{ marginLeft: "auto" }}>
                  <Text style={styles.link}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : requests.length === 0 ? (
              <View style={styles.centerBlock}>
                <Text style={styles.emptyText}>No new follow requests</Text>
              </View>
            ) : (
              <FlatList
                data={requests}
                keyExtractor={(r) => String(r.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={{ paddingVertical: 6 }}
                refreshing={loading}
                onRefresh={fetchPending}
              />
            )}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

/* ---- theme / styles (matches TravelMate look) ---- */
const COLORS = {
  page: "#F6FAFD",
  card: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#64748B",
  primary: "#0F70F0",
  border: "#E9EDF2",
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.page },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    width: "100%",
    ...(Platform.OS === "web" ? { maxWidth: 1200, alignSelf: "center" } : {}),
  },

  title: { fontSize: 24, fontWeight: "800", color: COLORS.text, letterSpacing: 0.2 },
  subtitle: { marginTop: 6, fontSize: 14, color: COLORS.subtext, marginBottom: 12 },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  bannerInfo: { backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#DBEAFE" },
  bannerInfoText: { color: "#0F70F0", fontWeight: "600" },

  panel: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 420,
    ...(Platform.OS === "web"
      ? { boxSizing: "border-box", boxShadow: "0 8px 24px rgba(15,58,107,0.06)" }
      : { elevation: 2 }),
  },

  centerBlock: { alignItems: "center", justifyContent: "center", paddingVertical: 28 },
  loadingText: { marginTop: 6, color: COLORS.subtext, fontWeight: "600" },
  emptyText: { color: COLORS.subtext, fontWeight: "600" },

  bannerError: { backgroundColor: "#FEF3F2", borderWidth: 1, borderColor: "#FEE4E2" },
  bannerErrorText: { color: "#B42318", fontWeight: "600" },
  link: { color: COLORS.primary, fontWeight: "700" },

  cardRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 6 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: "#EAF0F6" },
  name: { color: "#0F172A", fontWeight: "700", fontSize: 15 },
  meta: { color: COLORS.subtext, fontSize: 13 },

  actions: { flexDirection: "row", gap: 8, marginLeft: 10 },
  btn: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  btnPrimary: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  btnPrimaryText: { color: "#FFFFFF", fontWeight: "800" },
  btnGhost: { backgroundColor: "#EEF3F9", borderColor: COLORS.border },
  btnGhostText: { color: "#0F172A", fontWeight: "800" },

  separator: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 66 },
});
