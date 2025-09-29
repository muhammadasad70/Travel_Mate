// screens/Groups/GroupsHomeScreen.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api";

/* ===== Theme tokens ===== */
const PRIMARY = "#0F3A6B";
const PRIMARY_DARK = "#3e5168ff";
const ACCENT = "#003366";
const CARD_BG = "#FFFFFF";
const PAGE_BG = "#F7F9FC";
const SUBTEXT = "#6B7280";
const BORDER = "#E6EDF7";
const SOFT = "#F1F5FE";

/* util */
const fmtActivity = (s) => s || "No activity yet";

export default function GroupsHomeScreen() {
  const nav = useNavigation();
  const { width } = useWindowDimensions();
  const isPhone = width < 480;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [groups, setGroups] = useState([]);
  const [invites, setInvites] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const [g, i] = await Promise.all([
        api.get("/groups/mine").catch(() => ({ data: [] })),
        api.get("/groups/invites").catch(() => ({ data: [] })),
      ]);
      setGroups(Array.isArray(g.data) ? g.data : []);
      setInvites(Array.isArray(i.data) ? i.data : []);
    } catch (e) {
      setError("Failed to load groups. Check connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const acceptInvite = async (inviteId) => {
    try {
      await api.post(`/groups/invites/${inviteId}/accept`);
      await load();
    } catch { setError("Could not accept invite."); }
  };

  const declineInvite = async (inviteId) => {
    try {
      await api.post(`/groups/invites/${inviteId}/decline`);
      await load();
    } catch { setError("Could not decline invite."); }
  };

  const HeaderBar = useMemo(() => (
    <View style={styles.appbar}>
      <Pressable
        onPress={() => nav.goBack()}
        hitSlop={10}
        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={22} color={PRIMARY_DARK} />
      </Pressable>
      <Text style={styles.appbarTitle} numberOfLines={1}>Groups</Text>
      <View style={{ width: 22 }} />
    </View>
  ), [nav]);

  const Hero = (
    <View style={styles.hero}>
      <View style={styles.heroIcon}>
        <Ionicons name="people-outline" size={20} color={PRIMARY} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.heroTitle}>Your Groups</Text>
        <Text style={styles.heroSubtitle}>Plan together, vote & chat in real-time.</Text>
      </View>
    </View>
  );

  const QuickActions = (
    <View style={[styles.actionsRow, isPhone && { gap: 10 }]}>
      <Pressable
        onPress={() => nav.navigate("CreateGroupModal")}
        style={({ pressed }) => [styles.actionPrimary, pressed && { opacity: 0.95 }]}
      >
        <Ionicons name="add" size={18} color="#FFF" />
        <Text style={styles.actionPrimaryTxt}>Create Group</Text>
      </Pressable>
    </View>
  );

  const SectionLabel = ({ children }) => (
    <View style={styles.sectionPill}>
      <Text style={styles.sectionPillTxt}>{children}</Text>
    </View>
  );

  const renderInvite = ({ item }) => (
    <View key={item.id} style={[styles.cardRow, { marginHorizontal: 16, marginBottom: 10 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.groupName || "Group"}</Text>
        <Text style={styles.meta}>{fmtActivity(item.lastActivity)}</Text>
      </View>
      <View style={styles.rowBtns}>
        <Pressable onPress={() => acceptInvite(item.id)} style={styles.smallPrimary}>
          <Text style={styles.smallPrimaryTxt}>Accept</Text>
        </Pressable>
        <Pressable onPress={() => declineInvite(item.id)} style={styles.smallGhost}>
          <Text style={styles.smallGhostTxt}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderGroup = ({ item }) => (
    <Pressable
      onPress={() => nav.navigate("GroupDashboard", { groupId: item.id })}
      style={({ pressed }) => [styles.groupCard, pressed && { opacity: 0.92 }, { marginHorizontal: 16 }]}
    >
      <View style={styles.groupTop}>
        <Text style={styles.groupName}>{item.name}</Text>
      </View>
      <Text style={styles.meta}>
        {item.membersCount ?? 0} member{(item.membersCount ?? 0) === 1 ? "" : "s"} • {fmtActivity(item.lastActivity)}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {HeaderBar}
        <View style={styles.topPad}>{Hero}{QuickActions}</View>
        <View style={styles.center}>
          <ActivityIndicator />
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {HeaderBar}

      {/* Single scrollable list */}
      <FlatList
        data={groups}
        keyExtractor={(x) => String(x.id)}
        renderItem={renderGroup}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListHeaderComponent={
          <>
            <View style={styles.topPad}>
              {Hero}
              {QuickActions}
            </View>

            {!!error && <Text style={[styles.error, { paddingHorizontal: 16 }]}>{error}</Text>}

            {/* Invites (inline, scrolls with the list) */}
            {invites.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <SectionLabel>Invites</SectionLabel>
                <View>
                  {invites.map((inv) => renderInvite({ item: inv }))}
                </View>
              </View>
            )}

            {/* "My Groups" section label before groups list */}
            <View style={{ marginTop: 14 }}>
              <SectionLabel>My Groups</SectionLabel>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={22} color={PRIMARY} />
            </View>
            <Text style={styles.emptyText}>You haven’t joined any groups yet.</Text>
            <View style={styles.emptyActions}>
              <Pressable onPress={() => nav.navigate("CreateGroupModal")} style={styles.actionPrimary}>
                <Ionicons name="add" size={18} color="#FFF" />
                <Text style={styles.actionPrimaryTxt}>Create Group</Text>
              </Pressable>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ===================== styles ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },

  /* app bar */
  appbar: {
    height: 48, paddingHorizontal: 10, backgroundColor: CARD_BG,
    borderBottomWidth: 1, borderBottomColor: BORDER,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  backBtn: { padding: 6 },
  appbarTitle: { fontSize: 18, fontWeight: "800", color: PRIMARY_DARK },

  /* hero + actions */
  topPad: { paddingHorizontal: 16, paddingTop: 10 },
  hero: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: SOFT, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: BORDER,
  },
  heroIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#E7F0FF", alignItems: "center", justifyContent: "center",
  },
  heroTitle: { fontSize: 16, fontWeight: "800", color: PRIMARY_DARK },
  heroSubtitle: { color: SUBTEXT, marginTop: 2, fontSize: 12 },

  actionsRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 12 },
  actionPrimary: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: ACCENT, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 14, elevation: 2,
  },
  actionPrimaryTxt: { color: "#FFF", fontWeight: "800" },

  /* section pill */
  sectionPill: {
    alignSelf: "flex-start", marginLeft: 16, marginBottom: 8,
    backgroundColor: "#ECF3FF", paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1, borderColor: "#DCE7FF",
  },
  sectionPillTxt: { color: PRIMARY_DARK, fontWeight: "800", fontSize: 12 },

  /* list cards */
  cardRow: {
    backgroundColor: CARD_BG, borderRadius: 14, borderWidth: 1, borderColor: BORDER,
    padding: 14, flexDirection: "row", alignItems: "center", gap: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: PRIMARY_DARK },
  meta: { color: SUBTEXT, marginTop: 4, fontSize: 12 },
  rowBtns: { flexDirection: "row", gap: 8 },

  smallPrimary: {
    backgroundColor: ACCENT, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
  },
  smallPrimaryTxt: { color: "#FFF", fontWeight: "800", fontSize: 12 },

  smallGhost: {
    backgroundColor: "#F3F6FA", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: BORDER,
  },
  smallGhostTxt: { fontWeight: "800", fontSize: 12, color: PRIMARY_DARK },

  groupCard: {
    backgroundColor: CARD_BG, borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 14,
  },
  groupTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  groupName: { fontSize: 16, fontWeight: "800", color: PRIMARY_DARK },

  /* empty state */
  emptyCard: {
    marginHorizontal: 16, backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, padding: 18, alignItems: "center",
  },
  emptyIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: SOFT,
    alignItems: "center", justifyContent: "center", marginBottom: 10,
    borderWidth: 1, borderColor: BORDER,
  },
  emptyText: { color: SUBTEXT, marginBottom: 12, textAlign: "center" },
  emptyActions: { flexDirection: "row", gap: 10 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "#B91C1C" },
});
