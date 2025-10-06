// screens/Groups/MembersScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Platform,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  TouchableOpacity,        // <-- use this instead of Pressable for web
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getBaseURL from "../../config/env";
import InviteUserPicker from "../../components/Groups/InviteUserPicker";

const API = getBaseURL();

const COLORS = {
  text: "#0F3A6B",
  sub: "#5B6B7B",
  page: "#F7F9FC",
  card: "#FFFFFF",
  border: "#E6EDF7",
  soft: "#F1F5FE",
  accent: "#0c2444ff",
  pillBg: "#ECF3FF",
  pillBorder: "#DCE7FF",
};

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return iso;
  }
};

const RoleBadge = ({ role }) => {
  const txt = role === "admin" ? "Admin" : "Member";
  const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
  const br = role === "admin" ? "#BFD9FF" : COLORS.border;
  const col = role === "admin" ? "#0B74C8" : COLORS.sub;
  return (
    <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
      <Ionicons
        name={role === "admin" ? "shield-checkmark-outline" : "person-outline"}
        size={14}
        color={col}
      />
      <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
    </View>
  );
};

const Kebab = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={styles.kebab}
    accessibilityRole="button"
    accessibilityLabel="Open actions"
  >
    <Ionicons name="ellipsis-vertical" size={16} color={COLORS.sub} />
  </TouchableOpacity>
);

export default function MembersScreen() {
  const { width } = useWindowDimensions();
  const isPhone = width < 600;

  const route = useRoute();
  const groupId = route?.params?.groupId || 0;

  const [auth, setAuth] = useState({ token: null, userId: null });
  useEffect(() => {
    (async () => {
      const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
      setAuth({ token: token || null, userId: uid ? Number(uid) : null });
    })();
  }, []);
  const authHeaders = useMemo(
    () => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    [auth.token]
  );

  const [loading, setLoading] = useState(true);
  const [errText, setErrText] = useState(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | admins | members
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);

  const me = useMemo(() => {
    const myRow = members.find((m) => Number(m.userId) === Number(auth.userId));
    return { userId: auth.userId, role: myRow?.role || "member" };
  }, [members, auth.userId]);

  const loadMembers = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      setErrText(null);
      const res = await fetch(`${API}/groups/${groupId}/members`, {
        headers: { ...authHeaders },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = (data || []).map((r) => ({
        userId: Number(r.userId),
        name:
          [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") ||
          r.email ||
          "—",
        email: r.email || "",
        role: r.role || "member",
        joinedAt: r.joinedAt || new Date().toISOString(),
      }));
      setMembers(list);
    } catch (e) {
      setErrText(e?.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [groupId, authHeaders]);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      setErrText("No group selected. Open Members from a specific group or pass { groupId }.");
      return;
    }
    loadMembers();
  }, [groupId, loadMembers]);

  const memberIds = useMemo(() => members.map((m) => Number(m.userId)), [members]);
  const pendingIds = useMemo(
    () =>
      invites
        .map((i) => Number(i.inviteeId || i.invitee_id || 0))
        .filter((x) => x > 0),
    [invites]
  );

  const counts = useMemo(() => {
    const total = members.length;
    const admins = members.filter((m) => m.role === "admin").length;
    const pend = invites.filter((i) => i.status === "pending").length;
    return { total, admins, members: total - admins, pending: pend };
  }, [members, invites]);

  const filtered = useMemo(() => {
    let arr = members;
    if (filter === "admins") arr = arr.filter((m) => m.role === "admin");
    if (filter === "members") arr = arr.filter((m) => m.role === "member");
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      arr = arr.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [members, query, filter]);

  // Invite picker modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const inviteSomeone = () => setInviteOpen(true);

  const onInvited = (userId) => {
    setInvites((old) => [
      ...old,
      {
        id: Date.now(),
        inviteeId: Number(userId),
        inviteeEmail: "(pending)",
        inviterId: me.userId,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const cancelInvite = async (inviteId) => {
    try {
      if (String(inviteId).length < 16) {
        await fetch(`${API}/groups/invites/${inviteId}/cancel`, {
          method: "POST",
          headers: { ...authHeaders },
        });
      }
    } catch {}
    finally {
      setInvites((old) => old.filter((i) => i.id !== inviteId));
    }
  };

  // Admin actions (local-only for now)
  const makeAdmin = (userId) => {
    setMembers((old) =>
      old.map((m) => (m.userId === userId ? { ...m, role: "admin" } : m))
    );
  };
  const removeAdmin = (userId) => {
    const adminCount = members.filter((m) => m.role === "admin").length;
    const target = members.find((m) => m.userId === userId);
    if (target?.role === "admin" && adminCount <= 1) {
      Alert.alert("Action blocked", "At least one admin must remain.");
      return;
    }
    setMembers((old) =>
      old.map((m) => (m.userId === userId ? { ...m, role: "member" } : m))
    );
  };
  const removeMember = (userId) => {
    const target = members.find((m) => m.userId === userId);
    if (target?.role === "admin") {
      const adminCount = members.filter((m) => m.role === "admin").length;
      if (adminCount <= 1) {
        Alert.alert("Action blocked", "You cannot remove the last admin.");
        return;
      }
    }
    setMembers((old) => old.filter((m) => m.userId !== userId));
  };
  const leaveGroup = () => {
    const adminCount = members.filter((m) => m.role === "admin").length;
    const meRow = members.find((m) => m.userId === me.userId);
    if (meRow?.role === "admin" && adminCount <= 1) {
      Alert.alert("Action blocked", "Transfer admin or add another admin before leaving.");
      return;
    }
    setMembers((old) => old.filter((m) => m.userId !== me.userId));
  };

  const renderMember = ({ item }) => (
    <View style={styles.rowCard}>
      <View style={styles.rowLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>
            {(item.name || "?")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.nameWrap}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
            <RoleBadge role={item.role} />
          </View>
          {!!item.email && (
            <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
              {item.email}
            </Text>
          )}
          <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
        </View>
      </View>

      <View style={styles.actionsWrap}>
        {me.role === "admin" && me.userId !== item.userId && (
          <>
            {item.role === "member" ? (
              <TouchableOpacity
                onPress={() => makeAdmin(item.userId)}
                activeOpacity={0.9}
                style={styles.smallPrimary}
                accessibilityRole="button"
                accessibilityLabel={`Make ${item.name} admin`}
              >
                <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
                <Text style={styles.smallPrimaryTxt}>Make admin</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => removeAdmin(item.userId)}
                activeOpacity={0.9}
                style={styles.smallGhost}
                accessibilityRole="button"
                accessibilityLabel={`Remove admin from ${item.name}`}
              >
                <Ionicons name="shield-outline" size={16} color={COLORS.text} />
                <Text style={styles.smallGhostTxt}>Remove admin</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => removeMember(item.userId)}
              activeOpacity={0.9}
              style={styles.smallDanger}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name} from group`}
            >
              <Ionicons name="person-remove-outline" size={16} color="#fff" />
              <Text style={styles.smallDangerTxt}>Remove</Text>
            </TouchableOpacity>
          </>
        )}

        {me.userId === item.userId && (
          <TouchableOpacity
            onPress={leaveGroup}
            activeOpacity={0.9}
            style={styles.smallGhost}
            accessibilityRole="button"
            accessibilityLabel="Leave group"
          >
            <Ionicons name="exit-outline" size={16} color={COLORS.text} />
            <Text style={styles.smallGhostTxt}>Leave</Text>
          </TouchableOpacity>
        )}

        <Kebab onPress={() => Alert.alert("Actions", "More actions here…")} />
      </View>
    </View>
  );

  const renderInvite = ({ item }) => (
    <View style={[styles.rowCard, { paddingVertical: 12 }]}>
      <View style={styles.rowLeft}>
        <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
          <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {item.inviteeEmail || "Invitee"}
          </Text>
          <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
        </View>
      </View>
      {me.role === "admin" && (
        <View style={styles.actionsWrap}>
          <TouchableOpacity
            onPress={() => cancelInvite(item.id)}
            activeOpacity={0.9}
            style={styles.smallGhost}
            accessibilityRole="button"
            accessibilityLabel={`Cancel invite for ${item.inviteeEmail}`}
          >
            <Ionicons name="close-circle-outline" size={16} color={COLORS.text} />
            <Text style={styles.smallGhostTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ paddingVertical: 12, flex: 1 }}>
      <View style={styles.statsRow}>
        <StatPill icon="people-outline" label="Members" value={counts.total} />
        <StatPill icon="shield-checkmark-outline" label="Admins" value={counts.admins} />
        <StatPill icon="mail-unread-outline" label="Pending" value={counts.pending} />
      </View>

      <View style={[styles.toolbar, { flexDirection: isPhone ? "column" : "row" }]}>
        <View style={[styles.searchWrap, isPhone && { width: "100%" }]}>
          <Ionicons name="search-outline" size={16} color={COLORS.sub} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or email"
            placeholderTextColor="#9AA7B5"
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={16} color="#9AA7B5" />
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.filtersRow, isPhone && { marginTop: 8 }]}>
          <FilterPill label="All" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterPill label="Admins" active={filter === "admins"} onPress={() => setFilter("admins")} />
          <FilterPill label="Members" active={filter === "members"} onPress={() => setFilter("members")} />
        </View>

        {me.role === "admin" && (
          <TouchableOpacity
            onPress={() => setInviteOpen(true)}
            activeOpacity={0.9}
            style={styles.inviteBtn}
            accessibilityRole="button"
            accessibilityLabel="Invite members"
          >
            <Ionicons name="person-add-outline" size={18} color="#fff" />
            <Text style={styles.inviteTxt}>Invite</Text>
          </TouchableOpacity>
        )}
      </View>

      {errText ? (
        <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF3F2", borderColor: "#FEE4E2", borderWidth: 1, borderRadius: 10 }}>
          <Text style={{ color: "#B42318", fontWeight: "700" }}>{errText}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
        </View>
      ) : (
        <>
          {invites.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <SectionLabel>Pending Invites</SectionLabel>
              <FlatList
                data={invites}
                keyExtractor={(x) => String(x.id)}
                renderItem={renderInvite}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ paddingTop: 8 }}
              />
            </View>
          )}

          <View style={{ marginTop: 14, flex: 1 }}>
            <SectionLabel>Members</SectionLabel>
            <FlatList
              data={filtered}
              keyExtractor={(x) => String(x.userId)}
              renderItem={renderMember}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
            />
          </View>
        </>
      )}

      <InviteUserPicker
        visible={inviteOpen}
        onClose={() => setInviteOpen(false)}
        groupId={groupId}
        alreadyMemberIds={memberIds}
        pendingInviteeIds={pendingIds}
        onInvited={onInvited}
      />
    </View>
  );
}

/* ---- small atoms ---- */
const SectionLabel = ({ children }) => (
  <View style={styles.sectionPill}>
    <Text style={styles.sectionPillTxt}>{children}</Text>
  </View>
);

const StatPill = ({ icon, label, value }) => (
  <View style={styles.statPill}>
    <Ionicons name={icon} size={16} color={COLORS.text} />
    <Text style={styles.statPillLabel}>{label}</Text>
    <Text style={styles.statPillValue}>{value}</Text>
  </View>
);

// NEW: FilterPill we forgot earlier
function FilterPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.filterPill,
        active && { backgroundColor: "#E0F4FF", borderColor: "#0077b6" },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Filter ${label}`}
    >
      <Text style={[styles.filterTxt, active && { color: "#0B74C8" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---- styles ---- */
const styles = StyleSheet.create({
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleBadgeTxt: { fontSize: 12, fontWeight: "800" },
  kebab: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#F3F6FA",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginLeft: 6,
  },

  statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F6FA",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statPillLabel: { color: COLORS.sub, fontWeight: "700" },
  statPillValue: { color: COLORS.text, fontWeight: "900" },

  toolbar: { marginTop: 10, alignItems: "center", gap: 10 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 260,
    flex: 1,
  },
  searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

  filtersRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 999,
  },
  filterTxt: { fontWeight: "700", color: COLORS.text },

  inviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  inviteTxt: { color: "#fff", fontWeight: "800" },

  sectionPill: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.pillBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.pillBorder,
  },
  sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

  rowCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
    }),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.soft,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: "center", justifyContent: "center",
  },
  avatarTxt: { color: COLORS.text, fontWeight: "900" },

  nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
  name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
  email: { color: COLORS.sub, flexShrink: 1 },

  joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

  actionsWrap: { flexDirection: "row", alignItems: "center", gap: 6 },

  smallPrimary: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallPrimaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

  smallGhost: {
    backgroundColor: "#F3F6FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallGhostTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

  smallDanger: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallDangerTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
});
