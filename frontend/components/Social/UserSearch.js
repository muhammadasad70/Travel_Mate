
// components/Social/UserSearch.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import getBaseURL from "../../config/env"; // ✅ use your existing env.js

const API_BASE_URL = getBaseURL();

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_MS = 350;

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errText, setErrText] = useState(null);
  const [results, setResults] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [rowBusy, setRowBusy] = useState({});
  const [auth, setAuth] = useState({ token: null, userId: null });

  const timerRef = useRef(null);

  // Load token + userId from AsyncStorage
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

  // Build headers; don't set Content-Type for GET without body
  const authHeaders = useMemo(() => {
    const h = {};
    if (auth.token) h.Authorization = `Bearer ${auth.token}`;
    return h;
  }, [auth.token]);

  // Debounced search
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const trimmed = (query || "").trim();

    if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) {
      setResults([]);
      setErrText(null);
      return;
    }

    timerRef.current = setTimeout(() => {
      (async () => {
        try {
          setLoading(true);
          setErrText(null);
          const res = await fetch(
            `${API_BASE_URL}/search/users?q=${encodeURIComponent(trimmed)}`,
            { method: "GET", headers: authHeaders }
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const list = (data.users || []).map((u) => ({
            id: Number(u.id),
            email: u.email,
            first_name: u.first_name || "",
            last_name: u.last_name || "",
            image_url: u.image_url,
          }));
          setResults(list);
        } catch (e) {
          setErrText(e?.message || "Search failed");
          setResults([]);
        } finally {
          setLoading(false);
        }
      })();
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, authHeaders]);

  const onFollowToggle = async (userId) => {
    if (!auth.userId) {
      setErrText("Please log in to follow users.");
      return;
    }
    if (userId === auth.userId) return;

    const isFollowing = !!followingMap[userId];
    if (rowBusy[userId]) return;

    try {
      setRowBusy((p) => ({ ...p, [userId]: true }));

      if (!isFollowing) {
        const body = {
          follower_id: auth.userId,
          following_id: userId,
          status: "pending",
        };
        const res = await fetch(`${API_BASE_URL}/social/followers`, {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setFollowingMap((p) => ({ ...p, [userId]: true }));
      } else {
        const res = await fetch(
          `${API_BASE_URL}/social/followers/${auth.userId}/${userId}`,
          { method: "DELETE", headers: authHeaders }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setFollowingMap((p) => {
          const c = { ...p };
          delete c[userId];
          return c;
        });
      }
    } catch (e) {
      setErrText(e?.message || "Operation failed");
    } finally {
      setRowBusy((p) => {
        const c = { ...p };
        delete c[userId];
        return c;
      });
    }
  };

  const renderItem = ({ item }) => {
    const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");
    const isFollowing = !!followingMap[item.id];
    const busy = !!rowBusy[item.id];

    return (
      <View style={styles.userRow}>
        <Image
          source={{ uri: item.image_url || "https://placehold.co/100x100?text=U" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName || item.email}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {item.email}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onFollowToggle(item.id)}
          disabled={busy}
          style={[
            styles.followBtn,
            isFollowing ? styles.btnFollowing : styles.btnFollow,
            busy && { opacity: 0.6 },
          ]}
        >
          {busy ? (
            <ActivityIndicator size="small" color={isFollowing ? "#0F172A" : "#FFFFFF"} />
          ) : (
            <Text
              style={[
                styles.followText,
                isFollowing ? styles.textFollowing : styles.textFollow,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const showPanel =
    loading ||
    results.length > 0 ||
    ((query || "").trim().length >= MIN_SEARCH_LENGTH && !loading);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Search Users</Text>
        <Text style={styles.subtitle}>Find travelers and vendors to follow.</Text>

        <View style={styles.searchBar}>
          <Ionicons
            name={Platform.OS === "ios" ? "search" : "search-outline"}
            size={20}
            color={COLORS.subtext}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search by name or email…"
            placeholderTextColor="#8CA0B3"
            autoCapitalize="none"
            autoCorrect={false}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>

        {errText ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#B42318" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errText}</Text>
          </View>
        ) : null}

        {showPanel && (
          <View style={styles.panel}>
            {loading ? (
              <View style={styles.centerBlock}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Searching…</Text>
              </View>
            ) : results.length === 0 ? (
              <View style={styles.centerBlock}>
                <Text style={styles.emptyText}>No results for “{(query || "").trim()}”</Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(u) => String(u.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingVertical: 6 }}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---- theme ---- */
const COLORS = {
  page: "#F6FAFD",
  card: "#FFFFFF",
  text: "#0F3A6B",
  subtext: "#64748B",
  primary: "#0F70F0",
  border: "#E9EDF2",
};

/* ---- styles ---- */
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

  title: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  subtitle: { marginTop: 6, fontSize: 14, color: COLORS.subtext, marginBottom: 12 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    marginBottom: 10,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  errorText: { color: "#B42318", fontWeight: "600" },

  panel: {
    flex: 1,
    width: "100%",
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

  userRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 6 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: "#EAF0F6" },
  name: { color: "#0F172A", fontWeight: "700", fontSize: 15 },
  email: { color: COLORS.subtext, fontSize: 13 },

  separator: { height: 1, backgroundColor: COLORS.border, marginLeft: 66 },

  followBtn: { borderRadius: 999, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 16 },
  btnFollow: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  btnFollowing: { backgroundColor: "#EEF3F9", borderColor: COLORS.border },
  followText: { fontWeight: "800" },
  textFollow: { color: "#FFFFFF" },
  textFollowing: { color: "#0F172A" },
});
