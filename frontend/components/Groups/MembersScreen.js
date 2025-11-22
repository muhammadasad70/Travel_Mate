// // screens/Groups/MembersScreen.js


// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED: the group ID whose members to manage
//  */

// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED: the group ID whose members to manage
//  */

// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED: the group ID whose members to manage
//  */

// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED: the group ID whose members to manage
//  */



import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  View, Text, StyleSheet, TextInput, FlatList, Platform,
  Alert, ActivityIndicator, TouchableOpacity, Image, SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getBaseURL from "../../config/env";

const API = getBaseURL();

/* ===== Logging ===== */
const NS = "Members";
const log  = (...a) => __DEV__ && console.log(`[${NS}]`, ...a);
const warn = (...a) => __DEV__ && console.warn(`[${NS}]`, ...a);

/* ===== Theme ===== */
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
  primary: "#0F70F0",
};

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  } catch { return iso; }
};

const RoleBadge = ({ role }) => {
  const txt = role === "admin" ? "Admin" : "Member";
  const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
  const br = role === "admin" ? "#BFD9FF" : COLORS.border;
  const col = role === "admin" ? "#0B74C8" : COLORS.sub;
  return (
    <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
      <Ionicons name={role === "admin" ? "shield-checkmark-outline" : "person-outline"} size={14} color={col} />
      <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
    </View>
  );
};

/**
 * MembersScreen
 * @param {object} props
 * @param {number} props.groupId - REQUIRED
 */
export default function MembersScreen({ groupId }) {
  /* ---------- Auth ---------- */
  const [auth, setAuth] = useState({ token: null, userId: null });
  useEffect(() => {
    (async () => {
      const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
      const next = { token: token || null, userId: uid ? Number(uid) : null };
      log("auth loaded:", { hasToken: !!next.token, userId: next.userId });
      setAuth(next);
    })();
  }, []);
  const authHeaders = useMemo(() => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}), [auth.token]);

  /* ---------- Group members & invites ---------- */
  const [loading, setLoading] = useState(true);
  const [errText, setErrText] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);

  const me = useMemo(() => {
    const mine = members.find((m) => Number(m.userId) === Number(auth.userId));
    return { userId: auth.userId, role: mine?.role || "member" };
  }, [members, auth.userId]);

  const loadMembers = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      setErrText(null);
      const url = `${API}/groups/${groupId}/members`;
      log("GET", url);
      const res = await fetch(url, { headers: { ...authHeaders } });
      log("members status:", res.status);
      if (!res.ok) {
        if (res.status === 401) setErrText("Unauthorized: missing/invalid token.");
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      // Handle both { members: [...] } and direct array response
      const membersArray = Array.isArray(data) ? data : (data?.members || []);
      log("Members data:", { data, membersArray, count: membersArray.length });
      const list = membersArray.map((r) => {
        const userId = Number(r.userId ?? r.user_id ?? r.userid ?? r.id ?? 0);
        const firstName = r.first_name || r.firstName || "";
        const lastName = r.last_name || r.lastName || "";
        const name = [firstName, lastName].filter(Boolean).join(" ") || r.name || r.email || "—";
        const email = r.email || "";
        const role = r.role || "member";
        const joinedAt = r.joinedAt || r.joined_at || r.joinedAt || new Date().toISOString();
        
        return {
          userId,
          name,
          email,
          role,
          joinedAt,
        };
      });
      log("Processed members list:", list);
      setMembers(list);
    } catch (e) {
      warn("members error:", e?.message || e);
      setErrText(e?.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [groupId, authHeaders]);

  const loadInvites = useCallback(async () => {
    if (!groupId) return;
    try {
      const url = `${API}/groups/${groupId}/invites`;
      log("GET", url);
      const res = await fetch(url, { headers: { ...authHeaders } });
      log("invites status:", res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rows = (data?.invites || [])
        .filter((i) => i.status === "pending") // Only show pending invites
        .map((i) => ({
          id: Number(i.id),
          inviteeId: i.invitee_id ?? i.inviteeId ?? null,
          inviteeName: i.invitee_name ?? i.inviteeName ?? "",
          inviteeEmail: i.invitee_email ?? i.inviteeEmail ?? "",
          status: i.status,
          createdAt: i.created_at ?? i.createdAt,
        }));
      setInvites(rows);
    } catch (e) {
      warn("invites load error:", e?.message || e);
      setInvites([]);
    }
  }, [groupId, authHeaders]);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      setErrText("No group selected. Pass a valid { groupId } to MembersScreen.");
      return;
    }

    // ✅ Wait for auth to be loaded before making API calls
    if (!auth.token) {
      log("Waiting for auth token...");
      setLoading(true);
      return;
    }

    log("Auth ready, loading members and invites");
    loadMembers();
    loadInvites();
    
    // Auto-refresh every 10 seconds to catch accepted invites
    const interval = setInterval(() => {
      if (auth.token) { // Only refresh if we have auth
        loadMembers();
        loadInvites();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [groupId, auth.token, loadMembers, loadInvites]); // ✅ Add auth.token as dependency

  const memberIds  = useMemo(() => members.map((m) => Number(m.userId)), [members]);
  const pendingIds = useMemo(() => invites.map((i) => Number(i.inviteeId || 0)).filter((x) => x > 0), [invites]);
  const [removingUserId, setRemovingUserId] = useState(null);

  /* ---------- SERVER-SIDE USER SEARCH ---------- */
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchErr, setSearchErr] = useState(null);
  const debounceRef = useRef(null);
  const MIN = 2, DEBOUNCE = 350;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = (searchQ || "").trim();

    if (q.length < MIN) {
      setSearchResults([]);
      setSearchErr(null);
      return;
    }

    // ✅ Wait for auth token before searching
    if (!auth.token) {
      log("Waiting for auth token before search...");
      return;
    }

    debounceRef.current = setTimeout(() => {
      (async () => {
        try {
          setSearchLoading(true);
          setSearchErr(null);
          // Use advanced search with role filter to only get travelers
          const url = `${API}/search/users/advanced?q=${encodeURIComponent(q)}&role=traveler`;
          log("SEARCH GET", url);
          const res = await fetch(url, { headers: { ...authHeaders } });
          log("search status:", res.status);
          if (!res.ok) {
            if (res.status === 401) setSearchErr("Unauthorized: missing/invalid token.");
            throw new Error(`HTTP ${res.status}`);
          }
          const data = await res.json();
          const list = (data?.users || [])
            .filter((u) => Number(u.id) !== Number(auth.userId)) // Exclude current user
            .map((u) => ({
              id: Number(u.id),
              email: u.email,
              first_name: u.first_name || "",
              last_name: u.last_name || "",
              image_url: u.image_url,
            }));
          setSearchResults(list);
        } catch (e) {
          warn("search error:", e?.message || e);
          setSearchErr(e?.message || "Search failed");
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      })();
    }, DEBOUNCE);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQ, auth.token, authHeaders, auth.userId]); // ✅ Add auth.token as dependency

  /* ---------- INVITE (JSON body: invitee_id only, inviter comes from JWT) ---------- */
  const inviteUser = async (userId) => {
    if (!groupId) { Alert.alert("Missing group", "No group selected."); return; }
    if (!auth.userId) { Alert.alert("Unauthorized", "No user session."); return; }

    // ✅ Check if current user is an admin - show popup if not
    log("[inviteUser] Current user role check:", { 
      userId: auth.userId, 
      me: me, 
      meRole: me?.role, 
      isAdmin: me?.role === "admin",
      membersCount: members.length,
      allMembers: members
    });
    
    // Find current user's role from members list (more reliable than me object)
    const currentUserMember = members.find((m) => Number(m.userId) === Number(auth.userId));
    const currentUserRole = currentUserMember?.role || me?.role || "member";
    
    log("[inviteUser] Resolved role:", { 
      currentUserMember, 
      currentUserRole, 
      meRole: me?.role 
    });
    
    // Check role - handle both undefined and non-admin cases
    if (currentUserRole !== "admin") {
      log("[inviteUser] Non-admin user attempted to invite, showing popup. Role:", currentUserRole);
      
      // Use platform-specific alert
      if (Platform.OS === "web") {
        window.alert("Permission Required\n\nOnly admins can invite members to the group.");
      } else {
        Alert.alert(
          "Permission Required",
          "Only admins can invite members to the group.",
          [{ text: "OK" }]
        );
      }
      return;
    }
    
    log("[inviteUser] User is admin, proceeding with invite");

    // Check if user is already a member
    if (memberIds.includes(Number(userId))) {
      Alert.alert("Already a Member", "This user is already a member of the group.");
      return;
    }

    // Check if user already has a pending invite
    if (pendingIds.includes(Number(userId))) {
      Alert.alert("Already Invited", "An invite has already been sent to this user.");
      return;
    }

    try {
      const url = `${API}/groups/${groupId}/invites`;
      const body = { invitee_id: Number(userId) };
      log("INVITE POST", url, "body:", body);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      log("invite status:", res.status);
      if (!res.ok) {
        let errorMessage = "Failed to invite user";
        try {
          const j = await safeJson(res);
          errorMessage = j?.error || errorMessage;
          log("Invite error response:", j);
        } catch (parseError) {
          warn("Failed to parse error response:", parseError);
        }

        if (res.status === 400) {
          Alert.alert("Bad Request", errorMessage);
          return;
        }
        if (res.status === 401) {
          Alert.alert("Unauthorized", "Missing/invalid token. Please log in again.");
          return;
        }
        if (res.status === 403) {
          Alert.alert("Permission Denied", "You must be an admin to invite members.");
          return;
        }
        if (res.status === 409) {
          // Handle conflict - user already member or already invited
          const friendlyMessage = errorMessage.includes("already a member")
            ? "This user is already a member of the group."
            : errorMessage.includes("already exists") || errorMessage.includes("duplicate")
            ? "An invite has already been sent to this user."
            : errorMessage;
          Alert.alert("Cannot Invite", friendlyMessage);
          // Reload invites and members to update UI
          await Promise.all([loadInvites(), loadMembers()]);
          return;
        }
        Alert.alert("Error", errorMessage || `HTTP ${res.status}`);
        return;
      }

      // Reload both invites and members to update UI immediately
      await Promise.all([loadInvites(), loadMembers()]);
      
      // Clear search to show updated state, or keep search but results will refresh
      // The pendingIds will update automatically via useMemo
      
      if (Platform.OS === "web") {
        // Don't show alert on web, just update UI
      } else {
        Alert.alert("Success", "User has been invited.");
      }
    } catch (e) {
      warn("invite error:", e?.message || e);
      Alert.alert("Error", e?.message || "Failed to invite user.");
    }
  };

  /* ---------- Remove Member (admin-only) ---------- */
  const handleRemoveMember = async (userIdToRemove, memberName) => {
    log("handleRemoveMember called", { userIdToRemove, memberName, groupId, authUserId: auth.userId });
    
    if (!groupId || !auth.userId) {
      log("Missing group or user info");
      Alert.alert("Error", "Missing group or user information.");
      return;
    }

    // Check if current user is admin
    const currentUserMember = members.find((m) => Number(m.userId) === Number(auth.userId));
    log("Current user member:", currentUserMember);
    
    if (!currentUserMember || currentUserMember.role !== "admin") {
      log("Not admin, cannot remove");
      Alert.alert("Permission Denied", "Only admins can remove members.");
      return;
    }

    // Prevent removing yourself
    if (Number(userIdToRemove) === Number(auth.userId)) {
      log("Trying to remove self");
      Alert.alert("Cannot Remove", "You cannot remove yourself from the group.");
      return;
    }

    log("Showing confirmation dialog");
    
    // Define the remove function
    const performRemove = async () => {
      log("✅ Remove confirmed - Starting DELETE API call");
      
      try {
        setRemovingUserId(userIdToRemove);
        
        // STEP 1: Call DELETE API to remove member from backend
        const url = `${API}/groups/${groupId}/members/${userIdToRemove}`;
        log("🔴 DELETE API CALL:", url);
        log("Request details:", { 
          method: "DELETE", 
          groupId, 
          userIdToRemove, 
          hasAuth: !!authHeaders.Authorization 
        });
        
        const res = await fetch(url, {
          method: "DELETE",
          headers: { 
            ...authHeaders,
            "Content-Type": "application/json",
          },
        });

        log("📥 DELETE Response received - Status:", res.status, "OK:", res.ok);

        if (!res.ok) {
          let errorMsg = `HTTP ${res.status}`;
          try {
            const data = await safeJson(res);
            errorMsg = data?.error || errorMsg;
            log("❌ DELETE Error response:", data);
          } catch (parseError) {
            warn("Failed to parse error response:", parseError);
          }
          
          log("❌ Remove member failed:", errorMsg);
          if (res.status === 403) {
            Alert.alert("Permission Denied", "Only admins can remove members.");
          } else if (res.status === 400) {
            Alert.alert("Cannot Remove", errorMsg);
          } else if (res.status === 404) {
            Alert.alert("Not Found", "User is not a member of this group.");
          } else {
            Alert.alert("Error", errorMsg);
          }
          setRemovingUserId(null);
          return;
        }

        // Parse success response
        let result = null;
        try {
          const text = await res.text();
          if (text) {
            result = JSON.parse(text);
            log("✅ DELETE Success response:", result);
          } else {
            log("✅ DELETE Success (empty response body)");
          }
        } catch (parseError) {
          warn("Failed to parse success response:", parseError);
          // Continue anyway - deletion might have succeeded
        }

        // STEP 2: Optimistically update UI immediately
        log("🔄 Updating UI - Removing member from state");
        setMembers((prevMembers) => {
          const filtered = prevMembers.filter((m) => Number(m.userId) !== Number(userIdToRemove));
          log("📊 Members count - Before:", prevMembers.length, "After:", filtered.length);
          return filtered;
        });

        // STEP 3: Reload members list from backend to ensure consistency
        log("🔄 Reloading members list from backend...");
        try {
          await loadMembers();
          log("✅ Members list reloaded successfully");
        } catch (reloadError) {
          warn("⚠️ Failed to reload members after removal:", reloadError);
          // State already updated optimistically, so continue
        }
        
        if (Platform.OS === "web") {
          log("✅ Member removed successfully (web)");
        } else {
          Alert.alert("Success", "Member removed successfully.");
        }
      } catch (e) {
        warn("❌ Remove member exception:", e?.message || e);
        Alert.alert("Error", e?.message || "Failed to remove member.");
      } finally {
        setRemovingUserId(null);
      }
    };

    // Use window.confirm on web, Alert.alert on mobile
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to remove ${memberName || "this member"} from the group?`
      );
      if (confirmed) {
        log("✅ User confirmed removal (web)");
        performRemove();
      } else {
        log("❌ User cancelled removal (web)");
      }
    } else {
      Alert.alert(
        "Remove Member",
        `Are you sure you want to remove ${memberName || "this member"} from the group?`,
        [
          { 
            text: "Cancel", 
            style: "cancel",
            onPress: () => {
              log("Remove cancelled by user");
            }
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: performRemove,
          },
        ],
        { cancelable: true }
      );
    }
  };

  /* ---------- UI ---------- */
  const counts = useMemo(() => {
    const total  = members.length;
    const admins = members.filter((m) => m.role === "admin").length;
    const pend   = invites.filter((i) => i.status === "pending").length;
    return { total, admins, pending: pend };
  }, [members, invites]);

  const renderSearchItem = ({ item }) => {
    const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");
    const already   = memberIds.includes(item.id);
    const pending   = pendingIds.includes(item.id);
    const disabled  = !groupId || already || pending;

    let btnText = "Invite";
    if (already) btnText = "Member";
    else if (pending) btnText = "Invited";

    return (
      <View style={styles.userRow}>
        <Image source={{ uri: item.image_url || "https://placehold.co/80x80?text=U" }} style={styles.avatarImg} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name} numberOfLines={1}>{fullName || item.email}</Text>
          <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => inviteUser(item.id)}
          disabled={disabled}
          style={[
            styles.inviteChip,
            (already || pending) && styles.inviteChipMuted,
            disabled && { opacity: 0.6 },
          ]}
        >
          <Text style={[styles.inviteChipTxt, (already || pending) && styles.inviteChipTxtMuted]}>
            {btnText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTxt}>
          {(item.name || "?").split(" ").map((w) => w[0]).join("").slice(0,2).toUpperCase()}
        </Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.nameWrap}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <RoleBadge role={item.role} />
        </View>
        {!!item.email && <Text style={styles.email} numberOfLines={1}>{item.email}</Text>}
        <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.page, paddingVertical: 12 }}>
      {/* Server-side search */}
      <SectionLabel>Search users to invite</SectionLabel>
      <View style={[styles.searchWrap, { marginTop: 8 }]}>
        <Ionicons name="search-outline" size={16} color={COLORS.sub} />
        <TextInput
          value={searchQ}
          onChangeText={setSearchQ}
          placeholder="Search by name or email…"
          placeholderTextColor="#9AA7B5"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQ.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQ("")}>
            <Ionicons name="close-circle" size={16} color="#9AA7B5" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.panel}>
        {searchLoading ? (
          <View style={styles.centerBlock}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Searching…</Text>
          </View>
        ) : searchErr ? (
          <View style={styles.centerBlock}>
            <Text style={{ color: "#B42318", fontWeight: "700" }}>{searchErr}</Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.centerBlock}>
            <Text style={styles.emptyText}>
              {searchQ.trim().length >= MIN ? `No results for “${searchQ.trim()}”` : "Type at least 2 characters"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(u) => String(u.id)}
            renderItem={renderSearchItem}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.border, marginLeft: 66 }} />}
            contentContainerStyle={{ paddingVertical: 6 }}
          />
        )}
      </View>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <SectionLabel>Pending Invitations</SectionLabel>
          <FlatList
            data={invites}
            keyExtractor={(x) => String(x.id)}
            renderItem={({ item }) => (
              <View style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
                  <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.inviteeName || item.inviteeEmail || `User #${item.inviteeId}`}
                  </Text>
                  {item.inviteeEmail && item.inviteeName && (
                    <Text style={styles.email} numberOfLines={1}>{item.inviteeEmail}</Text>
                  )}
                  <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingTop: 8 }}
          />
        </View>
      )}

      {/* Members - Current Group Members */}
      <View style={{ marginTop: 14 }}>
        <SectionLabel>Members</SectionLabel>
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
          </View>
        ) : errText ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <Text style={{ color: "#B42318", fontWeight: "600" }}>{errText}</Text>
          </View>
        ) : members.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <Text style={{ color: COLORS.sub, fontWeight: "600" }}>No members yet</Text>
          </View>
        ) : (
          <View style={{ marginTop: 8 }}>
            {members.map((item, index) => (
              <View key={String(item.userId)}>
                {index > 0 && <View style={{ height: 10 }} />}
                <View style={[styles.memberRow, { flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarTxt}>
                      {(item.name || "?").split(" ").map((w) => w[0]).join("").slice(0,2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.nameWrap}>
                      <Text style={styles.name} numberOfLines={1}>{item.name || item.email || "Unknown"}</Text>
                      <RoleBadge role={item.role} />
                    </View>
                    {item.email && (
                      <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
                    )}
                    <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
                  </View>
                  {/* Remove button - only show for admins, and not for themselves */}
                  {me.role === "admin" && Number(item.userId) !== Number(auth.userId) && (
                    <TouchableOpacity
                      onPress={() => {
                        log("Remove button clicked for user:", item.userId, item.name || item.email);
                        handleRemoveMember(item.userId, item.name || item.email);
                      }}
                      disabled={removingUserId === item.userId}
                      style={{ 
                        padding: 8, 
                        marginLeft: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: 36,
                        minHeight: 36,
                      }}
                      activeOpacity={0.7}
                    >
                      {removingUserId === item.userId ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                      ) : (
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

/* util to safely read JSON errors */
async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

/* ---- small atoms ---- */
const SectionLabel = ({ children }) => (
  <View style={styles.sectionPill}>
    <Text style={styles.sectionPillTxt}>{children}</Text>
  </View>
);

/* ---- styles ---- */
const styles = StyleSheet.create({
  roleBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
  },
  roleBadgeTxt: { fontSize: 12, fontWeight: "800" },

  sectionPill: {
    alignSelf: "flex-start", backgroundColor: COLORS.pillBg,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.pillBorder,
  },
  sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#fff", borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minWidth: 260,
  },
  searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

  panel: {
    marginTop: 8, backgroundColor: COLORS.card, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border,
    ...(Platform.OS === "web"
      ? { boxSizing: "border-box", boxShadow: "0 8px 24px rgba(15,58,107,0.06)" }
      : { elevation: 1 }),
  },

  centerBlock: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  loadingText: { marginTop: 6, color: COLORS.sub, fontWeight: "600" },
  emptyText: { color: COLORS.sub, fontWeight: "600" },

  userRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10 },
  avatarImg: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: "#EAF0F6" },

  inviteChip: {
    borderRadius: 999, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 16,
    backgroundColor: COLORS.primary, borderColor: COLORS.primary,
  },
  inviteChipMuted: { backgroundColor: "#EEF3F9", borderColor: COLORS.border },
  inviteChipTxt: { color: "#FFFFFF", fontWeight: "800" },
  inviteChipTxtMuted: { color: "#0F172A" },

  memberRow: {
    backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 14,
    ...Platform.select({ ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }, android: { elevation: 1 } }),
    flexDirection: "row", alignItems: "center", gap: 12,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.soft,
    borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center",
  },
  avatarTxt: { color: COLORS.text, fontWeight: "900" },
  nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
  name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
  email: { color: COLORS.sub, flexShrink: 1 },
  joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },
});
