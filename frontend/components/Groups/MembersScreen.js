// // screens/Groups/MembersScreen.js
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   FlatList,
//   Platform,
//   useWindowDimensions,
//   Alert,
//   ActivityIndicator,
//   TouchableOpacity,        // <-- use this instead of Pressable for web
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRoute } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import getBaseURL from "../../config/env";
// import InviteUserPicker from "../../components/Groups/InviteUserPicker";

// const API = getBaseURL();

// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#5B6B7B",
//   page: "#F7F9FC",
//   card: "#FFFFFF",
//   border: "#E6EDF7",
//   soft: "#F1F5FE",
//   accent: "#0c2444ff",
//   pillBg: "#ECF3FF",
//   pillBorder: "#DCE7FF",
// };

// const formatDate = (iso) => {
//   try {
//     const d = new Date(iso);
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   } catch {
//     return iso;
//   }
// };

// const RoleBadge = ({ role }) => {
//   const txt = role === "admin" ? "Admin" : "Member";
//   const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
//   const br = role === "admin" ? "#BFD9FF" : COLORS.border;
//   const col = role === "admin" ? "#0B74C8" : COLORS.sub;
//   return (
//     <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
//       <Ionicons
//         name={role === "admin" ? "shield-checkmark-outline" : "person-outline"}
//         size={14}
//         color={col}
//       />
//       <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
//     </View>
//   );
// };

// const Kebab = ({ onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.85}
//     style={styles.kebab}
//     accessibilityRole="button"
//     accessibilityLabel="Open actions"
//   >
//     <Ionicons name="ellipsis-vertical" size={16} color={COLORS.sub} />
//   </TouchableOpacity>
// );

// export default function MembersScreen() {
//   const { width } = useWindowDimensions();
//   const isPhone = width < 600;

//   const route = useRoute();
//   const groupId = route?.params?.groupId || 0;

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
//       setAuth({ token: token || null, userId: uid ? Number(uid) : null });
//     })();
//   }, []);
//   const authHeaders = useMemo(
//     () => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
//     [auth.token]
//   );

//   const [loading, setLoading] = useState(true);
//   const [errText, setErrText] = useState(null);

//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState("all"); // all | admins | members
//   const [members, setMembers] = useState([]);
//   const [invites, setInvites] = useState([]);

//   const me = useMemo(() => {
//     const myRow = members.find((m) => Number(m.userId) === Number(auth.userId));
//     return { userId: auth.userId, role: myRow?.role || "member" };
//   }, [members, auth.userId]);

//   const loadMembers = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       setLoading(true);
//       setErrText(null);
//       const res = await fetch(`${API}/groups/${groupId}/members`, {
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       const list = (data || []).map((r) => ({
//         userId: Number(r.userId),
//         name:
//           [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") ||
//           r.email ||
//           "—",
//         email: r.email || "",
//         role: r.role || "member",
//         joinedAt: r.joinedAt || new Date().toISOString(),
//       }));
//       setMembers(list);
//     } catch (e) {
//       setErrText(e?.message || "Failed to load members");
//     } finally {
//       setLoading(false);
//     }
//   }, [groupId, authHeaders]);

//   useEffect(() => {
//     if (!groupId) {
//       setLoading(false);
//       setErrText("No group selected. Open Members from a specific group or pass { groupId }.");
//       return;
//     }
//     loadMembers();
//   }, [groupId, loadMembers]);

//   const memberIds = useMemo(() => members.map((m) => Number(m.userId)), [members]);
//   const pendingIds = useMemo(
//     () =>
//       invites
//         .map((i) => Number(i.inviteeId || i.invitee_id || 0))
//         .filter((x) => x > 0),
//     [invites]
//   );

//   const counts = useMemo(() => {
//     const total = members.length;
//     const admins = members.filter((m) => m.role === "admin").length;
//     const pend = invites.filter((i) => i.status === "pending").length;
//     return { total, admins, members: total - admins, pending: pend };
//   }, [members, invites]);

//   const filtered = useMemo(() => {
//     let arr = members;
//     if (filter === "admins") arr = arr.filter((m) => m.role === "admin");
//     if (filter === "members") arr = arr.filter((m) => m.role === "member");
//     if (query.trim()) {
//       const q = query.trim().toLowerCase();
//       arr = arr.filter(
//         (m) =>
//           m.name.toLowerCase().includes(q) ||
//           (m.email || "").toLowerCase().includes(q)
//       );
//     }
//     return arr;
//   }, [members, query, filter]);

//   // Invite picker modal
//   const [inviteOpen, setInviteOpen] = useState(false);
//   const inviteSomeone = () => setInviteOpen(true);

//   const onInvited = (userId) => {
//     setInvites((old) => [
//       ...old,
//       {
//         id: Date.now(),
//         inviteeId: Number(userId),
//         inviteeEmail: "(pending)",
//         inviterId: me.userId,
//         status: "pending",
//         createdAt: new Date().toISOString(),
//       },
//     ]);
//   };

//   const cancelInvite = async (inviteId) => {
//     try {
//       if (String(inviteId).length < 16) {
//         await fetch(`${API}/groups/invites/${inviteId}/cancel`, {
//           method: "POST",
//           headers: { ...authHeaders },
//         });
//       }
//     } catch {}
//     finally {
//       setInvites((old) => old.filter((i) => i.id !== inviteId));
//     }
//   };

//   // Admin actions (local-only for now)
//   const makeAdmin = (userId) => {
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "admin" } : m))
//     );
//   };
//   const removeAdmin = (userId) => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "At least one admin must remain.");
//       return;
//     }
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "member" } : m))
//     );
//   };
//   const removeMember = (userId) => {
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin") {
//       const adminCount = members.filter((m) => m.role === "admin").length;
//       if (adminCount <= 1) {
//         Alert.alert("Action blocked", "You cannot remove the last admin.");
//         return;
//       }
//     }
//     setMembers((old) => old.filter((m) => m.userId !== userId));
//   };
//   const leaveGroup = () => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const meRow = members.find((m) => m.userId === me.userId);
//     if (meRow?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "Transfer admin or add another admin before leaving.");
//       return;
//     }
//     setMembers((old) => old.filter((m) => m.userId !== me.userId));
//   };

//   const renderMember = ({ item }) => (
//     <View style={styles.rowCard}>
//       <View style={styles.rowLeft}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarTxt}>
//             {(item.name || "?")
//               .split(" ")
//               .map((w) => w[0])
//               .join("")
//               .slice(0, 2)
//               .toUpperCase()}
//           </Text>
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <View style={styles.nameWrap}>
//             <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//               {item.name}
//             </Text>
//             <RoleBadge role={item.role} />
//           </View>
//           {!!item.email && (
//             <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
//               {item.email}
//             </Text>
//           )}
//           <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
//         </View>
//       </View>

//       <View style={styles.actionsWrap}>
//         {me.role === "admin" && me.userId !== item.userId && (
//           <>
//             {item.role === "member" ? (
//               <TouchableOpacity
//                 onPress={() => makeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallPrimary}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Make ${item.name} admin`}
//               >
//                 <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
//                 <Text style={styles.smallPrimaryTxt}>Make admin</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={() => removeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallGhost}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Remove admin from ${item.name}`}
//               >
//                 <Ionicons name="shield-outline" size={16} color={COLORS.text} />
//                 <Text style={styles.smallGhostTxt}>Remove admin</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => removeMember(item.userId)}
//               activeOpacity={0.9}
//               style={styles.smallDanger}
//               accessibilityRole="button"
//               accessibilityLabel={`Remove ${item.name} from group`}
//             >
//               <Ionicons name="person-remove-outline" size={16} color="#fff" />
//               <Text style={styles.smallDangerTxt}>Remove</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {me.userId === item.userId && (
//           <TouchableOpacity
//             onPress={leaveGroup}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel="Leave group"
//           >
//             <Ionicons name="exit-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Leave</Text>
//           </TouchableOpacity>
//         )}

//         <Kebab onPress={() => Alert.alert("Actions", "More actions here…")} />
//       </View>
//     </View>
//   );

//   const renderInvite = ({ item }) => (
//     <View style={[styles.rowCard, { paddingVertical: 12 }]}>
//       <View style={styles.rowLeft}>
//         <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
//           <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//             {item.inviteeEmail || "Invitee"}
//           </Text>
//           <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
//         </View>
//       </View>
//       {me.role === "admin" && (
//         <View style={styles.actionsWrap}>
//           <TouchableOpacity
//             onPress={() => cancelInvite(item.id)}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel={`Cancel invite for ${item.inviteeEmail}`}
//           >
//             <Ionicons name="close-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={{ paddingVertical: 12, flex: 1 }}>
//       <View style={styles.statsRow}>
//         <StatPill icon="people-outline" label="Members" value={counts.total} />
//         <StatPill icon="shield-checkmark-outline" label="Admins" value={counts.admins} />
//         <StatPill icon="mail-unread-outline" label="Pending" value={counts.pending} />
//       </View>

//       <View style={[styles.toolbar, { flexDirection: isPhone ? "column" : "row" }]}>
//         <View style={[styles.searchWrap, isPhone && { width: "100%" }]}>
//           <Ionicons name="search-outline" size={16} color={COLORS.sub} />
//           <TextInput
//             value={query}
//             onChangeText={setQuery}
//             placeholder="Search by name or email"
//             placeholderTextColor="#9AA7B5"
//             style={styles.searchInput}
//           />
//           {query.length > 0 && (
//             <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
//               <Ionicons name="close-circle" size={16} color="#9AA7B5" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={[styles.filtersRow, isPhone && { marginTop: 8 }]}>
//           <FilterPill label="All" active={filter === "all"} onPress={() => setFilter("all")} />
//           <FilterPill label="Admins" active={filter === "admins"} onPress={() => setFilter("admins")} />
//           <FilterPill label="Members" active={filter === "members"} onPress={() => setFilter("members")} />
//         </View>

//         {me.role === "admin" && (
//           <TouchableOpacity
//             onPress={() => setInviteOpen(true)}
//             activeOpacity={0.9}
//             style={styles.inviteBtn}
//             accessibilityRole="button"
//             accessibilityLabel="Invite members"
//           >
//             <Ionicons name="person-add-outline" size={18} color="#fff" />
//             <Text style={styles.inviteTxt}>Invite</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {errText ? (
//         <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF3F2", borderColor: "#FEE4E2", borderWidth: 1, borderRadius: 10 }}>
//           <Text style={{ color: "#B42318", fontWeight: "700" }}>{errText}</Text>
//         </View>
//       ) : null}

//       {loading ? (
//         <View style={{ paddingVertical: 24, alignItems: "center" }}>
//           <ActivityIndicator />
//           <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
//         </View>
//       ) : (
//         <>
//           {invites.length > 0 && (
//             <View style={{ marginTop: 10 }}>
//               <SectionLabel>Pending Invites</SectionLabel>
//               <FlatList
//                 data={invites}
//                 keyExtractor={(x) => String(x.id)}
//                 renderItem={renderInvite}
//                 ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//                 contentContainerStyle={{ paddingTop: 8 }}
//               />
//             </View>
//           )}

//           <View style={{ marginTop: 14, flex: 1 }}>
//             <SectionLabel>Members</SectionLabel>
//             <FlatList
//               data={filtered}
//               keyExtractor={(x) => String(x.userId)}
//               renderItem={renderMember}
//               ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//               contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
//             />
//           </View>
//         </>
//       )}

//       <InviteUserPicker
//         visible={inviteOpen}
//         onClose={() => setInviteOpen(false)}
//         groupId={groupId}
//         alreadyMemberIds={memberIds}
//         pendingInviteeIds={pendingIds}
//         onInvited={onInvited}
//       />
//     </View>
//   );
// }

// /* ---- small atoms ---- */
// const SectionLabel = ({ children }) => (
//   <View style={styles.sectionPill}>
//     <Text style={styles.sectionPillTxt}>{children}</Text>
//   </View>
// );

// const StatPill = ({ icon, label, value }) => (
//   <View style={styles.statPill}>
//     <Ionicons name={icon} size={16} color={COLORS.text} />
//     <Text style={styles.statPillLabel}>{label}</Text>
//     <Text style={styles.statPillValue}>{value}</Text>
//   </View>
// );

// // NEW: FilterPill we forgot earlier
// function FilterPill({ label, active, onPress }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[
//         styles.filterPill,
//         active && { backgroundColor: "#E0F4FF", borderColor: "#0077b6" },
//       ]}
//       accessibilityRole="button"
//       accessibilityLabel={`Filter ${label}`}
//     >
//       <Text style={[styles.filterTxt, active && { color: "#0B74C8" }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   roleBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   roleBadgeTxt: { fontSize: 12, fontWeight: "800" },
//   kebab: {
//     padding: 6,
//     borderRadius: 10,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginLeft: 6,
//   },

//   statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
//   statPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   statPillLabel: { color: COLORS.sub, fontWeight: "700" },
//   statPillValue: { color: COLORS.text, fontWeight: "900" },

//   toolbar: { marginTop: 10, alignItems: "center", gap: 10 },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     minWidth: 260,
//     flex: 1,
//   },
//   searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

//   filtersRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   filterPill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#F9F9F9",
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 999,
//   },
//   filterTxt: { fontWeight: "700", color: COLORS.text },

//   inviteBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 14,
//   },
//   inviteTxt: { color: "#fff", fontWeight: "800" },

//   sectionPill: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.pillBg,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.pillBorder,
//   },
//   sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   rowCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 1 },
//     }),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

//   avatar: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: COLORS.soft,
//     borderWidth: 1, borderColor: COLORS.border,
//     alignItems: "center", justifyContent: "center",
//   },
//   avatarTxt: { color: COLORS.text, fontWeight: "900" },

//   nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
//   name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
//   email: { color: COLORS.sub, flexShrink: 1 },

//   joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

//   actionsWrap: { flexDirection: "row", alignItems: "center", gap: 6 },

//   smallPrimary: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallPrimaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

//   smallGhost: {
//     backgroundColor: "#F3F6FA",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallGhostTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   smallDanger: {
//     backgroundColor: "#EF4444",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallDangerTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
// });


// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View, Text, StyleSheet, TextInput, FlatList, Platform,
//   useWindowDimensions, Alert, ActivityIndicator, TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRoute } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import getBaseURL from "../../config/env";
// import UserSearch from "../../components/Social/UserSearch"; // Invite-enabled

// const API = getBaseURL();

// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#5B6B7B",
//   page: "#F7F9FC",
//   card: "#FFFFFF",
//   border: "#E6EDF7",
//   soft: "#F1F5FE",
//   accent: "#0c2444ff",
//   pillBg: "#ECF3FF",
//   pillBorder: "#DCE7FF",
// };

// const formatDate = (iso) => {
//   try {
//     const d = new Date(iso);
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   } catch {
//     return iso;
//   }
// };

// const RoleBadge = ({ role }) => {
//   const txt = role === "admin" ? "Admin" : "Member";
//   const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
//   const br = role === "admin" ? "#BFD9FF" : COLORS.border;
//   const col = role === "admin" ? "#0B74C8" : COLORS.sub;
//   return (
//     <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
//       <Ionicons
//         name={role === "admin" ? "shield-checkmark-outline" : "person-outline"}
//         size={14}
//         color={col}
//       />
//       <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
//     </View>
//   );
// };

// const Kebab = ({ onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.85}
//     style={styles.kebab}
//     accessibilityRole="button"
//     accessibilityLabel="Open actions"
//   >
//     <Ionicons name="ellipsis-vertical" size={16} color={COLORS.sub} />
//   </TouchableOpacity>
// );

// export default function MembersScreen() {
//   const { width } = useWindowDimensions();
//   const isPhone = width < 600;

//   const route = useRoute();
//   const groupId = route?.params?.groupId || 0;

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
//       setAuth({ token: token || null, userId: uid ? Number(uid) : null });
//     })();
//   }, []);
//   const authHeaders = useMemo(
//     () => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
//     [auth.token]
//   );

//   const [loading, setLoading] = useState(true);
//   const [errText, setErrText] = useState(null);

//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState("all"); // all | admins | members
//   const [members, setMembers] = useState([]);
//   const [invites, setInvites] = useState([]);

//   const me = useMemo(() => {
//     const myRow = members.find((m) => Number(m.userId) === Number(auth.userId));
//     return { userId: auth.userId, role: myRow?.role || "member" };
//   }, [members, auth.userId]);

//   const loadMembers = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       setLoading(true);
//       setErrText(null);
//       const res = await fetch(`${API}/groups/${groupId}/members`, {
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       // backend returns { members: [...] }
//       const list = (data?.members || []).map((r) => ({
//         userId: Number(r.userId ?? r.user_id ?? r.userid ?? 0),
//         name:
//           [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") ||
//           r.email ||
//           "—",
//         email: r.email || "",
//         role: r.role || "member",
//         joinedAt: r.joinedAt || r.joined_at || new Date().toISOString(),
//       }));
//       setMembers(list);
//     } catch (e) {
//       setErrText(e?.message || "Failed to load members");
//     } finally {
//       setLoading(false);
//     }
//   }, [groupId, authHeaders]);

//   const loadInvites = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       const res = await fetch(`${API}/groups/${groupId}/invites`, {
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       // backend returns { invites: [...] }
//       const rows = (data?.invites || []).map((i) => ({
//         id: Number(i.id),
//         inviteeId: i.invitee_id ?? i.inviteeId ?? null,
//         inviteeEmail: i.invitee_email ?? i.inviteeEmail ?? "",
//         status: i.status,
//         createdAt: i.created_at ?? i.createdAt,
//       }));
//       setInvites(rows);
//     } catch (e) {
//       // keep silent; show UI without invites if failure occurs
//     }
//   }, [groupId, authHeaders]);

//   useEffect(() => {
//     if (!groupId) {
//       setLoading(false);
//       setErrText("No group selected. Open Members from a specific group or pass { groupId }.");
//       return;
//     }
//     loadMembers();
//     loadInvites();
//   }, [groupId, loadMembers, loadInvites]);

//   const memberIds = useMemo(() => members.map((m) => Number(m.userId)), [members]);
//   const pendingIds = useMemo(
//     () =>
//       invites
//         .map((i) => Number(i.inviteeId || 0))
//         .filter((x) => x > 0),
//     [invites]
//   );

//   const counts = useMemo(() => {
//     const total = members.length;
//     const admins = members.filter((m) => m.role === "admin").length;
//     const pend = invites.filter((i) => i.status === "pending").length;
//     return { total, admins, members: total - admins, pending: pend };
//   }, [members, invites]);

//   const filtered = useMemo(() => {
//     let arr = members;
//     if (filter === "admins") arr = arr.filter((m) => m.role === "admin");
//     if (filter === "members") arr = arr.filter((m) => m.role === "member");
//     if (query.trim()) {
//       const q = query.trim().toLowerCase();
//       arr = arr.filter(
//         (m) =>
//           m.name.toLowerCase().includes(q) ||
//           (m.email || "").toLowerCase().includes(q)
//       );
//     }
//     return arr;
//   }, [members, query, filter]);

//   // Invite modal visible flag
//   const [inviteOpen, setInviteOpen] = useState(false);

//   const onInvited = async (userId /*, inviteId */) => {
//     // After inviting from search, refresh invites list from backend
//     await loadInvites();
//     // and give user feedback
//     if (Platform.OS === "web") {
//       alert("Invite sent.");
//     } else {
//       Alert.alert("Invite", "Invite sent.");
//     }
//   };

//   const cancelInvite = async (inviteId) => {
//     try {
//       const res = await fetch(`${API}/groups/invites/${inviteId}/cancel`, {
//         method: "POST",
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     } catch (e) {
//       // optionally surface error
//     } finally {
//       // Always refresh list for truth from server
//       await loadInvites();
//     }
//   };

//   // Admin actions (local demo only; server endpoints can be added later)
//   const makeAdmin = (userId) => {
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "admin" } : m))
//     );
//   };
//   const removeAdmin = (userId) => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "At least one admin must remain.");
//       return;
//     }
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "member" } : m))
//     );
//   };
//   const removeMember = (userId) => {
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin") {
//       const adminCount = members.filter((m) => m.role === "admin").length;
//       if (adminCount <= 1) {
//         Alert.alert("Action blocked", "You cannot remove the last admin.");
//         return;
//       }
//     }
//     setMembers((old) => old.filter((m) => m.userId !== userId));
//   };
//   const leaveGroup = () => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const meRow = members.find((m) => m.userId === me.userId);
//     if (meRow?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "Transfer admin or add another admin before leaving.");
//       return;
//     }
//     setMembers((old) => old.filter((m) => m.userId !== me.userId));
//   };

//   const renderMember = ({ item }) => (
//     <View style={styles.rowCard}>
//       <View style={styles.rowLeft}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarTxt}>
//             {(item.name || "?")
//               .split(" ")
//               .map((w) => w[0])
//               .join("")
//               .slice(0, 2)
//               .toUpperCase()}
//           </Text>
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <View style={styles.nameWrap}>
//             <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//               {item.name}
//             </Text>
//             <RoleBadge role={item.role} />
//           </View>
//           {!!item.email && (
//             <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
//               {item.email}
//             </Text>
//           )}
//           <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
//         </View>
//       </View>

//       <View style={styles.actionsWrap}>
//         {me.role === "admin" && me.userId !== item.userId && (
//           <>
//             {item.role === "member" ? (
//               <TouchableOpacity
//                 onPress={() => makeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallPrimary}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Make ${item.name} admin`}
//               >
//                 <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
//                 <Text style={styles.smallPrimaryTxt}>Make admin</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={() => removeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallGhost}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Remove admin from ${item.name}`}
//               >
//                 <Ionicons name="shield-outline" size={16} color={COLORS.text} />
//                 <Text style={styles.smallGhostTxt}>Remove admin</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => removeMember(item.userId)}
//               activeOpacity={0.9}
//               style={styles.smallDanger}
//               accessibilityRole="button"
//               accessibilityLabel={`Remove ${item.name} from group`}
//             >
//               <Ionicons name="person-remove-outline" size={16} color="#fff" />
//               <Text style={styles.smallDangerTxt}>Remove</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {me.userId === item.userId && (
//           <TouchableOpacity
//             onPress={leaveGroup}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel="Leave group"
//           >
//             <Ionicons name="exit-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Leave</Text>
//           </TouchableOpacity>
//         )}

//         <Kebab onPress={() => Alert.alert("Actions", "More actions here…")} />
//       </View>
//     </View>
//   );

//   const renderInvite = ({ item }) => (
//     <View style={[styles.rowCard, { paddingVertical: 12 }]}>
//       <View style={styles.rowLeft}>
//         <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
//           <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//             {item.inviteeEmail || `User #${item.inviteeId}`}
//           </Text>
//           <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
//         </View>
//       </View>
//       {me.role === "admin" && (
//         <View style={styles.actionsWrap}>
//           <TouchableOpacity
//             onPress={() => cancelInvite(item.id)}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel={`Cancel invite for ${item.inviteeEmail || item.inviteeId}`}
//           >
//             <Ionicons name="close-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={{ paddingVertical: 12, flex: 1 }}>
//       <View style={styles.statsRow}>
//         <StatPill icon="people-outline" label="Members" value={counts.total} />
//         <StatPill icon="shield-checkmark-outline" label="Admins" value={counts.admins} />
//         <StatPill icon="mail-unread-outline" label="Pending" value={counts.pending} />
//       </View>

//       <View style={[styles.toolbar, { flexDirection: isPhone ? "column" : "row" }]}>
//         <View style={[styles.searchWrap, isPhone && { width: "100%" }]}>
//           <Ionicons name="search-outline" size={16} color={COLORS.sub} />
//           <TextInput
//             value={query}
//             onChangeText={setQuery}
//             placeholder="Search by name or email"
//             placeholderTextColor="#9AA7B5"
//             style={styles.searchInput}
//           />
//           {query.length > 0 && (
//             <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
//               <Ionicons name="close-circle" size={16} color="#9AA7B5" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={[styles.filtersRow, isPhone && { marginTop: 8 }]}>
//           <FilterPill label="All" active={filter === "all"} onPress={() => setFilter("all")} />
//           <FilterPill label="Admins" active={filter === "admins"} onPress={() => setFilter("admins")} />
//           <FilterPill label="Members" active={filter === "members"} onPress={() => setFilter("members")} />
//         </View>

//         {me.role === "admin" && (
//           <TouchableOpacity
//             onPress={() => setInviteOpen(true)}
//             activeOpacity={0.9}
//             style={styles.inviteBtn}
//             accessibilityRole="button"
//             accessibilityLabel="Invite members"
//           >
//             <Ionicons name="person-add-outline" size={18} color="#fff" />
//             <Text style={styles.inviteTxt}>Invite</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {errText ? (
//         <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF3F2", borderColor: "#FEE4E2", borderWidth: 1, borderRadius: 10 }}>
//           <Text style={{ color: "#B42318", fontWeight: "700" }}>{errText}</Text>
//         </View>
//       ) : null}

//       {loading ? (
//         <View style={{ paddingVertical: 24, alignItems: "center" }}>
//           <ActivityIndicator />
//           <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
//         </View>
//       ) : (
//         <>
//           {invites.length > 0 && (
//             <View style={{ marginTop: 10 }}>
//               <SectionLabel>Pending Invites</SectionLabel>
//               <FlatList
//                 data={invites}
//                 keyExtractor={(x) => String(x.id)}
//                 renderItem={renderInvite}
//                 ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//                 contentContainerStyle={{ paddingTop: 8 }}
//               />
//             </View>
//           )}

//           <View style={{ marginTop: 14, flex: 1 }}>
//             <SectionLabel>Members</SectionLabel>
//             <FlatList
//               data={filtered}
//               keyExtractor={(x) => String(x.userId)}
//               renderItem={renderMember}
//               ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//               contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
//             />
//           </View>
//         </>
//       )}

//       {/* Invite Drawer / Modal */}
//       {inviteOpen && (
//         <View style={{ marginTop: 16, flex: 1 }}>
//           <SectionLabel>Invite someone</SectionLabel>
//           <View style={{ height: 440 }}>
//             <UserSearch
//               groupId={groupId}
//               alreadyMemberIds={memberIds}
//               pendingInviteeIds={pendingIds}
//               onInvited={onInvited}
//             />
//           </View>
//           <View style={{ marginTop: 8, alignSelf: "flex-end" }}>
//             <TouchableOpacity onPress={() => setInviteOpen(false)} style={styles.smallGhost}>
//               <Ionicons name="close" size={16} color={COLORS.text} />
//               <Text style={styles.smallGhostTxt}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ---- small atoms ---- */
// const SectionLabel = ({ children }) => (
//   <View style={styles.sectionPill}>
//     <Text style={styles.sectionPillTxt}>{children}</Text>
//   </View>
// );

// const StatPill = ({ icon, label, value }) => (
//   <View style={styles.statPill}>
//     <Ionicons name={icon} size={16} color={COLORS.text} />
//     <Text style={styles.statPillLabel}>{label}</Text>
//     <Text style={styles.statPillValue}>{value}</Text>
//   </View>
// );

// // FilterPill
// function FilterPill({ label, active, onPress }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[
//         styles.filterPill,
//         active && { backgroundColor: "#E0F4FF", borderColor: "#0077b6" },
//       ]}
//       accessibilityRole="button"
//       accessibilityLabel={`Filter ${label}`}
//     >
//       <Text style={[styles.filterTxt, active && { color: "#0B74C8" }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   roleBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   roleBadgeTxt: { fontSize: 12, fontWeight: "800" },
//   kebab: {
//     padding: 6,
//     borderRadius: 10,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginLeft: 6,
//   },

//   statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
//   statPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   statPillLabel: { color: COLORS.sub, fontWeight: "700" },
//   statPillValue: { color: COLORS.text, fontWeight: "900" },

//   toolbar: { marginTop: 10, alignItems: "center", gap: 10 },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     minWidth: 260,
//     flex: 1,
//   },
//   searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

//   filtersRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   filterPill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#F9F9F9",
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 999,
//   },
//   filterTxt: { fontWeight: "700", color: COLORS.text },

//   inviteBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 14,
//   },
//   inviteTxt: { color: "#fff", fontWeight: "800" },

//   sectionPill: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.pillBg,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.pillBorder,
//   },
//   sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   rowCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 1 },
//     }),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

//   avatar: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: COLORS.soft,
//     borderWidth: 1, borderColor: COLORS.border,
//     alignItems: "center", justifyContent: "center",
//   },
//   avatarTxt: { color: COLORS.text, fontWeight: "900" },

//   nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
//   name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
//   email: { color: COLORS.sub, flexShrink: 1 },

//   joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

//   actionsWrap: { flexDirection: "row", alignItems: "center", gap: 6 },

//   smallPrimary: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallPrimaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

//   smallGhost: {
//     backgroundColor: "#F3F6FA",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallGhostTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   smallDanger: {
//     backgroundColor: "#EF4444",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallDangerTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
// });


// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View, Text, StyleSheet, TextInput, FlatList, Platform,
//   useWindowDimensions, Alert, ActivityIndicator, TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import getBaseURL from "../../config/env";
// import UserSearch from "../../components/Social/UserSearch"; // Invite-enabled

// const API = getBaseURL();

// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#5B6B7B",
//   page: "#F7F9FC",
//   card: "#FFFFFF",
//   border: "#E6EDF7",
//   soft: "#F1F5FE",
//   accent: "#0c2444ff",
//   pillBg: "#ECF3FF",
//   pillBorder: "#DCE7FF",
// };

// const formatDate = (iso) => {
//   try {
//     const d = new Date(iso);
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   } catch {
//     return iso;
//   }
// };

// const RoleBadge = ({ role }) => {
//   const txt = role === "admin" ? "Admin" : "Member";
//   const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
//   const br = role === "admin" ? "#BFD9FF" : COLORS.border;
//   const col = role === "admin" ? "#0B74C8" : COLORS.sub;
//   return (
//     <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
//       <Ionicons
//         name={role === "admin" ? "shield-checkmark-outline" : "person-outline"}
//         size={14}
//         color={col}
//       />
//       <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
//     </View>
//   );
// };

// const Kebab = ({ onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.85}
//     style={styles.kebab}
//     accessibilityRole="button"
//     accessibilityLabel="Open actions"
//   >
//     <Ionicons name="ellipsis-vertical" size={16} color={COLORS.sub} />
//   </TouchableOpacity>
// );

// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED: the group ID whose members to manage
//  */
// export default function MembersScreen({ groupId }) {
//   const { width } = useWindowDimensions();
//   const isPhone = width < 600;

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
//       setAuth({ token: token || null, userId: uid ? Number(uid) : null });
//     })();
//   }, []);
//   const authHeaders = useMemo(
//     () => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
//     [auth.token]
//   );

//   const [loading, setLoading] = useState(true);
//   const [errText, setErrText] = useState(null);

//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState("all"); // all | admins | members
//   const [members, setMembers] = useState([]);
//   const [invites, setInvites] = useState([]);

//   const me = useMemo(() => {
//     const myRow = members.find((m) => Number(m.userId) === Number(auth.userId));
//     return { userId: auth.userId, role: myRow?.role || "member" };
//   }, [members, auth.userId]);

//   const loadMembers = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       setLoading(true);
//       setErrText(null);
//       const res = await fetch(`${API}/groups/${groupId}/members`, {
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       // backend returns { members: [...] }
//       const list = (data?.members || []).map((r) => ({
//         userId: Number(r.userId ?? r.user_id ?? r.userid ?? 0),
//         name:
//           [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") ||
//           r.email ||
//           "—",
//         email: r.email || "",
//         role: r.role || "member",
//         joinedAt: r.joinedAt || r.joined_at || new Date().toISOString(),
//       }));
//       setMembers(list);
//     } catch (e) {
//       setErrText(e?.message || "Failed to load members");
//     } finally {
//       setLoading(false);
//     }
//   }, [groupId, authHeaders]);

//   const loadInvites = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       const res = await fetch(`${API}/groups/${groupId}/invites`, {
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       // backend returns { invites: [...] }
//       const rows = (data?.invites || []).map((i) => ({
//         id: Number(i.id),
//         inviteeId: i.invitee_id ?? i.inviteeId ?? null,
//         inviteeEmail: i.invitee_email ?? i.inviteeEmail ?? "",
//         status: i.status,
//         createdAt: i.created_at ?? i.createdAt,
//       }));
//       setInvites(rows);
//     } catch (e) {
//       // keep silent; show UI without invites if failure occurs
//     }
//   }, [groupId, authHeaders]);

//   useEffect(() => {
//     if (!groupId) {
//       setLoading(false);
//       setErrText("No group selected. Pass a valid { groupId } to MembersScreen.");
//       return;
//     }
//     loadMembers();
//     loadInvites();
//   }, [groupId, loadMembers, loadInvites]);

//   const memberIds = useMemo(() => members.map((m) => Number(m.userId)), [members]);
//   const pendingIds = useMemo(
//     () =>
//       invites
//         .map((i) => Number(i.inviteeId || 0))
//         .filter((x) => x > 0),
//     [invites]
//   );

//   const counts = useMemo(() => {
//     const total = members.length;
//     const admins = members.filter((m) => m.role === "admin").length;
//     const pend = invites.filter((i) => i.status === "pending").length;
//     return { total, admins, members: total - admins, pending: pend };
//   }, [members, invites]);

//   const filtered = useMemo(() => {
//     let arr = members;
//     if (filter === "admins") arr = arr.filter((m) => m.role === "admin");
//     if (filter === "members") arr = arr.filter((m) => m.role === "member");
//     if (query.trim()) {
//       const q = query.trim().toLowerCase();
//       arr = arr.filter(
//         (m) =>
//           m.name.toLowerCase().includes(q) ||
//           (m.email || "").toLowerCase().includes(q)
//       );
//     }
//     return arr;
//   }, [members, query, filter]);

//   // Invite modal visible flag
//   const [inviteOpen, setInviteOpen] = useState(false);

//   const onInvited = async () => {
//     await loadInvites();
//     if (Platform.OS === "web") {
//       alert("Invite sent.");
//     } else {
//       Alert.alert("Invite", "Invite sent.");
//     }
//   };

//   const cancelInvite = async (inviteId) => {
//     try {
//       const res = await fetch(`${API}/groups/invites/${inviteId}/cancel`, {
//         method: "POST",
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     } catch (e) {
//       // optionally surface error
//     } finally {
//       await loadInvites();
//     }
//   };

//   // Admin actions (local demo only; server endpoints can be added later)
//   const makeAdmin = (userId) => {
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "admin" } : m))
//     );
//   };
//   const removeAdmin = (userId) => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "At least one admin must remain.");
//       return;
//     }
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "member" } : m))
//     );
//   };
//   const removeMember = (userId) => {
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin") {
//       const adminCount = members.filter((m) => m.role === "admin").length;
//       if (adminCount <= 1) {
//         Alert.alert("Action blocked", "You cannot remove the last admin.");
//         return;
//       }
//     }
//     setMembers((old) => old.filter((m) => m.userId !== userId));
//   };
//   const leaveGroup = () => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const meRow = members.find((m) => m.userId === me.userId);
//     if (meRow?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "Transfer admin or add another admin before leaving.");
//       return;
//     }
//     setMembers((old) => old.filter((m) => m.userId !== me.userId));
//   };

//   const renderMember = ({ item }) => (
//     <View style={styles.rowCard}>
//       <View style={styles.rowLeft}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarTxt}>
//             {(item.name || "?")
//               .split(" ")
//               .map((w) => w[0])
//               .join("")
//               .slice(0, 2)
//               .toUpperCase()}
//           </Text>
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <View style={styles.nameWrap}>
//             <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//               {item.name}
//             </Text>
//             <RoleBadge role={item.role} />
//           </View>
//           {!!item.email && (
//             <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
//               {item.email}
//             </Text>
//           )}
//           <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
//         </View>
//       </View>

//       <View style={styles.actionsWrap}>
//         {me.role === "admin" && me.userId !== item.userId && (
//           <>
//             {item.role === "member" ? (
//               <TouchableOpacity
//                 onPress={() => makeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallPrimary}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Make ${item.name} admin`}
//               >
//                 <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
//                 <Text style={styles.smallPrimaryTxt}>Make admin</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={() => removeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallGhost}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Remove admin from ${item.name}`}
//               >
//                 <Ionicons name="shield-outline" size={16} color={COLORS.text} />
//                 <Text style={styles.smallGhostTxt}>Remove admin</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => removeMember(item.userId)}
//               activeOpacity={0.9}
//               style={styles.smallDanger}
//               accessibilityRole="button"
//               accessibilityLabel={`Remove ${item.name} from group`}
//             >
//               <Ionicons name="person-remove-outline" size={16} color="#fff" />
//               <Text style={styles.smallDangerTxt}>Remove</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {me.userId === item.userId && (
//           <TouchableOpacity
//             onPress={leaveGroup}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel="Leave group"
//           >
//             <Ionicons name="exit-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Leave</Text>
//           </TouchableOpacity>
//         )}

//         <Kebab onPress={() => Alert.alert("Actions", "More actions here…")} />
//       </View>
//     </View>
//   );

//   const renderInvite = ({ item }) => (
//     <View style={[styles.rowCard, { paddingVertical: 12 }]}>
//       <View style={styles.rowLeft}>
//         <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
//           <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//             {item.inviteeEmail || `User #${item.inviteeId}`}
//           </Text>
//           <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
//         </View>
//       </View>
//       {me.role === "admin" && (
//         <View style={styles.actionsWrap}>
//           <TouchableOpacity
//             onPress={() => cancelInvite(item.id)}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel={`Cancel invite for ${item.inviteeEmail || item.inviteeId}`}
//           >
//             <Ionicons name="close-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={{ paddingVertical: 12, flex: 1 }}>
//       <View style={styles.statsRow}>
//         <StatPill icon="people-outline" label="Members" value={counts.total} />
//         <StatPill icon="shield-checkmark-outline" label="Admins" value={counts.admins} />
//         <StatPill icon="mail-unread-outline" label="Pending" value={counts.pending} />
//       </View>

//       <View style={[styles.toolbar, { flexDirection: isPhone ? "column" : "row" }]}>
//         <View style={[styles.searchWrap, isPhone && { width: "100%" }]}>
//           <Ionicons name="search-outline" size={16} color={COLORS.sub} />
//           <TextInput
//             value={query}
//             onChangeText={setQuery}
//             placeholder="Search by name or email"
//             placeholderTextColor="#9AA7B5"
//             style={styles.searchInput}
//           />
//           {query.length > 0 && (
//             <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
//               <Ionicons name="close-circle" size={16} color="#9AA7B5" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={[styles.filtersRow, isPhone && { marginTop: 8 }]}>
//           <FilterPill label="All" active={filter === "all"} onPress={() => setFilter("all")} />
//           <FilterPill label="Admins" active={filter === "admins"} onPress={() => setFilter("admins")} />
//           <FilterPill label="Members" active={filter === "members"} onPress={() => setFilter("members")} />
//         </View>

//         {me.role === "admin" && (
//           <TouchableOpacity
//             onPress={() => setInviteOpen(true)}
//             activeOpacity={0.9}
//             style={styles.inviteBtn}
//             accessibilityRole="button"
//             accessibilityLabel="Invite members"
//           >
//             <Ionicons name="person-add-outline" size={18} color="#fff" />
//             <Text style={styles.inviteTxt}>Invite</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {errText ? (
//         <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF3F2", borderColor: "#FEE4E2", borderWidth: 1, borderRadius: 10 }}>
//           <Text style={{ color: "#B42318", fontWeight: "700" }}>{errText}</Text>
//         </View>
//       ) : null}

//       {loading ? (
//         <View style={{ paddingVertical: 24, alignItems: "center" }}>
//           <ActivityIndicator />
//           <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
//         </View>
//       ) : (
//         <>
//           {invites.length > 0 && (
//             <View style={{ marginTop: 10 }}>
//               <SectionLabel>Pending Invites</SectionLabel>
//               <FlatList
//                 data={invites}
//                 keyExtractor={(x) => String(x.id)}
//                 renderItem={renderInvite}
//                 ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//                 contentContainerStyle={{ paddingTop: 8 }}
//               />
//             </View>
//           )}

//           <View style={{ marginTop: 14, flex: 1 }}>
//             <SectionLabel>Members</SectionLabel>
//             <FlatList
//               data={filtered}
//               keyExtractor={(x) => String(x.userId)}
//               renderItem={renderMember}
//               ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//               contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
//             />
//           </View>
//         </>
//       )}

//       {/* Invite Drawer / Modal */}
//       {inviteOpen && (
//         <View style={{ marginTop: 16, flex: 1 }}>
//           <SectionLabel>Invite someone</SectionLabel>
//           <View style={{ height: 440 }}>
//             <UserSearch
//               groupId={groupId}
//               alreadyMemberIds={memberIds}
//               pendingInviteeIds={pendingIds}
//               onInvited={onInvited}
//             />
//           </View>
//           <View style={{ marginTop: 8, alignSelf: "flex-end" }}>
//             <TouchableOpacity onPress={() => setInviteOpen(false)} style={styles.smallGhost}>
//               <Ionicons name="close" size={16} color={COLORS.text} />
//               <Text style={styles.smallGhostTxt}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ---- small atoms ---- */
// const SectionLabel = ({ children }) => (
//   <View style={styles.sectionPill}>
//     <Text style={styles.sectionPillTxt}>{children}</Text>
//   </View>
// );

// const StatPill = ({ icon, label, value }) => (
//   <View style={styles.statPill}>
//     <Ionicons name={icon} size={16} color={COLORS.text} />
//     <Text style={styles.statPillLabel}>{label}</Text>
//     <Text style={styles.statPillValue}>{value}</Text>
//   </View>
// );

// // FilterPill
// function FilterPill({ label, active, onPress }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[
//         styles.filterPill,
//         active && { backgroundColor: "#E0F4FF", borderColor: "#0077b6" },
//       ]}
//       accessibilityRole="button"
//       accessibilityLabel={`Filter ${label}`}
//     >
//       <Text style={[styles.filterTxt, active && { color: "#0B74C8" }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   roleBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   roleBadgeTxt: { fontSize: 12, fontWeight: "800" },
//   kebab: {
//     padding: 6,
//     borderRadius: 10,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginLeft: 6,
//   },

//   statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
//   statPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   statPillLabel: { color: COLORS.sub, fontWeight: "700" },
//   statPillValue: { color: COLORS.text, fontWeight: "900" },

//   toolbar: { marginTop: 10, alignItems: "center", gap: 10 },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     minWidth: 260,
//     flex: 1,
//   },
//   searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

//   filtersRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   filterPill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#F9F9F9",
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 999,
//   },
//   filterTxt: { fontWeight: "700", color: COLORS.text },

//   inviteBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 14,
//   },
//   inviteTxt: { color: "#fff", fontWeight: "800" },

//   sectionPill: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.pillBg,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.pillBorder,
//   },
//   sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   rowCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 1 },
//     }),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

//   avatar: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: COLORS.soft,
//     borderWidth: 1, borderColor: COLORS.border,
//     alignItems: "center", justifyContent: "center",
//   },
//   avatarTxt: { color: COLORS.text, fontWeight: "900" },

//   nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
//   name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
//   email: { color: COLORS.sub, flexShrink: 1 },

//   joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

//   actionsWrap: { flexDirection: "row", alignItems: "center", gap: 6 },

//   smallPrimary: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallPrimaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

//   smallGhost: {
//     backgroundColor: "#F3F6FA",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallGhostTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   smallDanger: {
//     backgroundColor: "#EF4444",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallDangerTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
// });
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View, Text, StyleSheet, TextInput, FlatList, Platform,
//   useWindowDimensions, Alert, ActivityIndicator, TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import getBaseURL from "../../config/env";
// import UserSearch from "./UserSearch"; // Invite-enabled

// const API = getBaseURL();

// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#5B6B7B",
//   page: "#F7F9FC",
//   card: "#FFFFFF",
//   border: "#E6EDF7",
//   soft: "#F1F5FE",
//   accent: "#0c2444ff",
//   pillBg: "#ECF3FF",
//   pillBorder: "#DCE7FF",
// };

// const formatDate = (iso) => {
//   try {
//     const d = new Date(iso);
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   } catch {
//     return iso;
//   }
// };

// const RoleBadge = ({ role }) => {
//   const txt = role === "admin" ? "Admin" : "Member";
//   const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
//   const br = role === "admin" ? "#BFD9FF" : COLORS.border;
//   const col = role === "admin" ? "#0B74C8" : COLORS.sub;
//   return (
//     <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
//       <Ionicons
//         name={role === "admin" ? "shield-checkmark-outline" : "person-outline"}
//         size={14}
//         color={col}
//       />
//       <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
//     </View>
//   );
// };

// const Kebab = ({ onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.85}
//     style={styles.kebab}
//     accessibilityRole="button"
//     accessibilityLabel="Open actions"
//   >
//     <Ionicons name="ellipsis-vertical" size={16} color={COLORS.sub} />
//   </TouchableOpacity>
// );

// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED: the group ID whose members to manage
//  */
// export default function MembersScreen({ groupId }) {
//   const { width } = useWindowDimensions();
//   const isPhone = width < 600;

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
//       setAuth({ token: token || null, userId: uid ? Number(uid) : null });
//     })();
//   }, []);
//   const authHeaders = useMemo(
//     () => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
//     [auth.token]
//   );

//   const [loading, setLoading] = useState(true);
//   const [errText, setErrText] = useState(null);

//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState("all"); // all | admins | members
//   const [members, setMembers] = useState([]);
//   const [invites, setInvites] = useState([]);

//   const me = useMemo(() => {
//     const myRow = members.find((m) => Number(m.userId) === Number(auth.userId));
//     return { userId: auth.userId, role: myRow?.role || "member" };
//   }, [members, auth.userId]);

//   const loadMembers = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       setLoading(true);
//       setErrText(null);
//       const res = await fetch(`${API}/groups/${groupId}/members`, {
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       // backend returns { members: [...] }
//       const list = (data?.members || []).map((r) => ({
//         userId: Number(r.userId ?? r.user_id ?? r.userid ?? 0),
//         name:
//           [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") ||
//           r.email ||
//           "—",
//         email: r.email || "",
//         role: r.role || "member",
//         joinedAt: r.joinedAt || r.joined_at || new Date().toISOString(),
//       }));
//       setMembers(list);
//     } catch (e) {
//       setErrText(e?.message || "Failed to load members");
//     } finally {
//       setLoading(false);
//     }
//   }, [groupId, authHeaders]);

//   const loadInvites = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       const res = await fetch(`${API}/groups/${groupId}/invites`, {
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       // backend returns { invites: [...] }
//       const rows = (data?.invites || []).map((i) => ({
//         id: Number(i.id),
//         inviteeId: i.invitee_id ?? i.inviteeId ?? null,
//         inviteeEmail: i.invitee_email ?? i.inviteeEmail ?? "",
//         status: i.status,
//         createdAt: i.created_at ?? i.createdAt,
//       }));
//       setInvites(rows);
//     } catch (e) {
//       // keep silent; show UI without invites if failure occurs
//     }
//   }, [groupId, authHeaders]);

//   useEffect(() => {
//     if (!groupId) {
//       setLoading(false);
//       setErrText("No group selected. Pass a valid { groupId } to MembersScreen.");
//       return;
//     }
//     // re-run when authHeaders change so tokened requests go out
//     loadMembers();
//     loadInvites();
//   }, [groupId, loadMembers, loadInvites, authHeaders]);

//   const memberIds = useMemo(() => members.map((m) => Number(m.userId)), [members]);
//   const pendingIds = useMemo(
//     () =>
//       invites
//         .map((i) => Number(i.inviteeId || 0))
//         .filter((x) => x > 0),
//     [invites]
//   );

//   const counts = useMemo(() => {
//     const total = members.length;
//     const admins = members.filter((m) => m.role === "admin").length;
//     const pend = invites.filter((i) => i.status === "pending").length;
//     return { total, admins, members: total - admins, pending: pend };
//   }, [members, invites]);

//   const filtered = useMemo(() => {
//     let arr = members;
//     if (filter === "admins") arr = arr.filter((m) => m.role === "admin");
//     if (filter === "members") arr = arr.filter((m) => m.role === "member");
//     if (query.trim()) {
//       const q = query.trim().toLowerCase();
//       arr = arr.filter(
//         (m) =>
//           m.name.toLowerCase().includes(q) ||
//           (m.email || "").toLowerCase().includes(q)
//       );
//     }
//     return arr;
//   }, [members, query, filter]);

//   // Invite modal visible flag
//   const [inviteOpen, setInviteOpen] = useState(false);

//   const onInvited = async () => {
//     await loadInvites();
//     if (Platform.OS === "web") {
//       alert("Invite sent.");
//     } else {
//       Alert.alert("Invite", "Invite sent.");
//     }
//   };

//   const cancelInvite = async (inviteId) => {
//     try {
//       const res = await fetch(`${API}/groups/invites/${inviteId}/cancel`, {
//         method: "POST",
//         headers: { ...authHeaders },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     } catch (e) {
//       // optionally surface error
//     } finally {
//       await loadInvites();
//     }
//   };

//   // Admin actions (local demo only)
//   const makeAdmin = (userId) => {
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "admin" } : m))
//     );
//   };
//   const removeAdmin = (userId) => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "At least one admin must remain.");
//       return;
//     }
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "member" } : m))
//     );
//   };
//   const removeMember = (userId) => {
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin") {
//       const adminCount = members.filter((m) => m.role === "admin").length;
//       if (adminCount <= 1) {
//         Alert.alert("Action blocked", "You cannot remove the last admin.");
//         return;
//       }
//     }
//     setMembers((old) => old.filter((m) => m.userId !== userId));
//   };
//   const leaveGroup = () => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const meRow = members.find((m) => m.userId === me.userId);
//     if (meRow?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "Transfer admin or add another admin before leaving.");
//       return;
//     }
//     setMembers((old) => old.filter((m) => m.userId !== me.userId));
//   };

//   const renderMember = ({ item }) => (
//     <View style={styles.rowCard}>
//       <View style={styles.rowLeft}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarTxt}>
//             {(item.name || "?")
//               .split(" ")
//               .map((w) => w[0])
//               .join("")
//               .slice(0, 2)
//               .toUpperCase()}
//           </Text>
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <View style={styles.nameWrap}>
//             <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//               {item.name}
//             </Text>
//             <RoleBadge role={item.role} />
//           </View>
//           {!!item.email && (
//             <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
//               {item.email}
//             </Text>
//           )}
//           <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
//         </View>
//       </View>

//       <View style={styles.actionsWrap}>
//         {me.role === "admin" && me.userId !== item.userId && (
//           <>
//             {item.role === "member" ? (
//               <TouchableOpacity
//                 onPress={() => makeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallPrimary}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Make ${item.name} admin`}
//               >
//                 <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
//                 <Text style={styles.smallPrimaryTxt}>Make admin</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={() => removeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallGhost}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Remove admin from ${item.name}`}
//               >
//                 <Ionicons name="shield-outline" size={16} color={COLORS.text} />
//                 <Text style={styles.smallGhostTxt}>Remove admin</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => removeMember(item.userId)}
//               activeOpacity={0.9}
//               style={styles.smallDanger}
//               accessibilityRole="button"
//               accessibilityLabel={`Remove ${item.name} from group`}
//             >
//               <Ionicons name="person-remove-outline" size={16} color="#fff" />
//               <Text style={styles.smallDangerTxt}>Remove</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {me.userId === item.userId && (
//           <TouchableOpacity
//             onPress={leaveGroup}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel="Leave group"
//           >
//             <Ionicons name="exit-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Leave</Text>
//           </TouchableOpacity>
//         )}

//         <Kebab onPress={() => Alert.alert("Actions", "More actions here…")} />
//       </View>
//     </View>
//   );

//   const renderInvite = ({ item }) => (
//     <View style={[styles.rowCard, { paddingVertical: 12 }]}>
//       <View style={styles.rowLeft}>
//         <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
//           <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//             {item.inviteeEmail || `User #${item.inviteeId}`}
//           </Text>
//           <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
//         </View>
//       </View>
//       {me.role === "admin" && (
//         <View style={styles.actionsWrap}>
//           <TouchableOpacity
//             onPress={() => cancelInvite(item.id)}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel={`Cancel invite for ${item.inviteeEmail || item.inviteeId}`}
//           >
//             <Ionicons name="close-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={{ paddingVertical: 12, flex: 1 }}>
//       <View style={styles.statsRow}>
//         <StatPill icon="people-outline" label="Members" value={counts.total} />
//         <StatPill icon="shield-checkmark-outline" label="Admins" value={counts.admins} />
//         <StatPill icon="mail-unread-outline" label="Pending" value={counts.pending} />
//       </View>

//       <View style={[styles.toolbar, { flexDirection: isPhone ? "column" : "row" }]}>
//         <View style={[styles.searchWrap, isPhone && { width: "100%" }]}>
//           <Ionicons name="search-outline" size={16} color={COLORS.sub} />
//           <TextInput
//             value={query}
//             onChangeText={setQuery}
//             placeholder="Search by name or email"
//             placeholderTextColor="#9AA7B5"
//             style={styles.searchInput}
//           />
//           {query.length > 0 && (
//             <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
//               <Ionicons name="close-circle" size={16} color="#9AA7B5" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={[styles.filtersRow, isPhone && { marginTop: 8 }]}>
//           <FilterPill label="All" active={filter === "all"} onPress={() => setFilter("all")} />
//           <FilterPill label="Admins" active={filter === "admins"} onPress={() => setFilter("admins")} />
//           <FilterPill label="Members" active={filter === "members"} onPress={() => setFilter("members")} />
//         </View>

//         {me.role === "admin" && (
//           <TouchableOpacity
//             onPress={() => setInviteOpen(true)}
//             activeOpacity={0.9}
//             style={styles.inviteBtn}
//             accessibilityRole="button"
//             accessibilityLabel="Invite members"
//           >
//             <Ionicons name="person-add-outline" size={18} color="#fff" />
//             <Text style={styles.inviteTxt}>Invite</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {errText ? (
//         <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF3F2", borderColor: "#FEE4E2", borderWidth: 1, borderRadius: 10 }}>
//           <Text style={{ color: "#B42318", fontWeight: "700" }}>{errText}</Text>
//         </View>
//       ) : null}

//       {loading ? (
//         <View style={{ paddingVertical: 24, alignItems: "center" }}>
//           <ActivityIndicator />
//           <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
//         </View>
//       ) : (
//         <>
//           {invites.length > 0 && (
//             <View style={{ marginTop: 10 }}>
//               <SectionLabel>Pending Invites</SectionLabel>
//               <FlatList
//                 data={invites}
//                 keyExtractor={(x) => String(x.id)}
//                 renderItem={renderInvite}
//                 ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//                 contentContainerStyle={{ paddingTop: 8 }}
//               />
//             </View>
//           )}

//           <View style={{ marginTop: 14, flex: 1 }}>
//             <SectionLabel>Members</SectionLabel>
//             <FlatList
//               data={filtered}
//               keyExtractor={(x) => String(x.userId)}
//               renderItem={renderMember}
//               ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//               contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
//             />
//           </View>
//         </>
//       )}

//       {/* Invite Drawer / Modal */}
//       {inviteOpen && (
//         <View style={{ marginTop: 16, flex: 1 }}>
//           <SectionLabel>Invite someone</SectionLabel>
//           <View style={{ height: 440 }}>
//             <UserSearch
//               groupId={groupId}
//               alreadyMemberIds={memberIds}
//               pendingInviteeIds={pendingIds}
//               onInvited={onInvited}
//             />
//           </View>
//           <View style={{ marginTop: 8, alignSelf: "flex-end" }}>
//             <TouchableOpacity onPress={() => setInviteOpen(false)} style={styles.smallGhost}>
//               <Ionicons name="close" size={16} color={COLORS.text} />
//               <Text style={styles.smallGhostTxt}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ---- small atoms ---- */
// const SectionLabel = ({ children }) => (
//   <View style={styles.sectionPill}>
//     <Text style={styles.sectionPillTxt}>{children}</Text>
//   </View>
// );

// const StatPill = ({ icon, label, value }) => (
//   <View style={styles.statPill}>
//     <Ionicons name={icon} size={16} color={COLORS.text} />
//     <Text style={styles.statPillLabel}>{label}</Text>
//     <Text style={styles.statPillValue}>{value}</Text>
//   </View>
// );

// // FilterPill
// function FilterPill({ label, active, onPress }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[
//         styles.filterPill,
//         active && { backgroundColor: "#E0F4FF", borderColor: "#0077b6" },
//       ]}
//       accessibilityRole="button"
//       accessibilityLabel={`Filter ${label}`}
//     >
//       <Text style={[styles.filterTxt, active && { color: "#0B74C8" }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   roleBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   roleBadgeTxt: { fontSize: 12, fontWeight: "800" },
//   kebab: {
//     padding: 6,
//     borderRadius: 10,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginLeft: 6,
//   },

//   statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
//   statPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   statPillLabel: { color: COLORS.sub, fontWeight: "700" },
//   statPillValue: { color: COLORS.text, fontWeight: "900" },

//   toolbar: { marginTop: 10, alignItems: "center", gap: 10 },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     minWidth: 260,
//     flex: 1,
//   },
//   searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

//   filtersRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   filterPill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#F9F9F9",
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 999,
//   },
//   filterTxt: { fontWeight: "700", color: COLORS.text },

//   inviteBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 14,
//   },
//   inviteTxt: { color: "#fff", fontWeight: "800" },

//   sectionPill: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.pillBg,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.pillBorder,
//   },
//   sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   rowCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 1 },
//     }),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

//   avatar: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: COLORS.soft,
//     borderWidth: 1, borderColor: COLORS.border,
//     alignItems: "center", justifyContent: "center",
//   },
//   avatarTxt: { color: COLORS.text, fontWeight: "900" },

//   nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
//   name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
//   email: { color: COLORS.sub, flexShrink: 1 },

//   joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

//   actionsWrap: { flexDirection: "row", alignItems: "center", gap: 6 },

//   smallPrimary: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallPrimaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

//   smallGhost: {
//     backgroundColor: "#F3F6FA",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallGhostTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   smallDanger: {
//     backgroundColor: "#EF4444",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallDangerTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
// });


// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View, Text, StyleSheet, TextInput, FlatList, Platform,
//   useWindowDimensions, Alert, ActivityIndicator, TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import getBaseURL from "../../config/env";
// import api from "../../api"; // <-- use your configured client
// import UserSearch from "./UserSearch"; // Invite-enabled

// const API = getBaseURL();

// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#5B6B7B",
//   page: "#F7F9FC",
//   card: "#FFFFFF",
//   border: "#E6EDF7",
//   soft: "#F1F5FE",
//   accent: "#0c2444ff",
//   pillBg: "#ECF3FF",
//   pillBorder: "#DCE7FF",
// };

// const formatDate = (iso) => {
//   try {
//     const d = new Date(iso);
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   } catch {
//     return iso;
//   }
// };

// const RoleBadge = ({ role }) => {
//   const txt = role === "admin" ? "Admin" : "Member";
//   const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
//   const br = role === "admin" ? "#BFD9FF" : COLORS.border;
//   const col = role === "admin" ? "#0B74C8" : COLORS.sub;
//   return (
//     <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
//       <Ionicons
//         name={role === "admin" ? "shield-checkmark-outline" : "person-outline"}
//         size={14}
//         color={col}
//       />
//       <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
//     </View>
//   );
// };

// const Kebab = ({ onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.85}
//     style={styles.kebab}
//     accessibilityRole="button"
//     accessibilityLabel="Open actions"
//   >
//     <Ionicons name="ellipsis-vertical" size={16} color={COLORS.sub} />
//   </TouchableOpacity>
// );

// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED: the group ID whose members to manage
//  */
// export default function MembersScreen({ groupId }) {
//   const { width } = useWindowDimensions();
//   const isPhone = width < 600;

//   // only need userId locally; auth headers come from api client config
//   const [auth, setAuth] = useState({ userId: null });
//   useEffect(() => {
//     (async () => {
//       const uid = await AsyncStorage.getItem("userId");
//       setAuth({ userId: uid ? Number(uid) : null });
//     })();
//   }, []);

//   const [loading, setLoading] = useState(true);
//   const [errText, setErrText] = useState(null);

//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState("all"); // all | admins | members
//   const [members, setMembers] = useState([]);
//   const [invites, setInvites] = useState([]);

//   const me = useMemo(() => {
//     const myRow = members.find((m) => Number(m.userId) === Number(auth.userId));
//     return { userId: auth.userId, role: myRow?.role || "member" };
//   }, [members, auth.userId]);

//   const loadMembers = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       setLoading(true);
//       setErrText(null);
//       const res = await api.get(`/groups/${groupId}/members`);
//       const data = res.data || {};
//       const list = (data?.members || []).map((r) => ({
//         userId: Number(r.userId ?? r.user_id ?? r.userid ?? 0),
//         name:
//           [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") ||
//           r.email ||
//           "—",
//         email: r.email || "",
//         role: r.role || "member",
//         joinedAt: r.joinedAt || r.joined_at || new Date().toISOString(),
//       }));
//       setMembers(list);
//     } catch (e) {
//       setErrText(e?.message || "Failed to load members");
//     } finally {
//       setLoading(false);
//     }
//   }, [groupId]);

//   const loadInvites = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       const res = await api.get(`/groups/${groupId}/invites`);
//       const data = res.data || {};
//       const rows = (data?.invites || []).map((i) => ({
//         id: Number(i.id),
//         inviteeId: i.invitee_id ?? i.inviteeId ?? null,
//         inviteeEmail: i.invitee_email ?? i.inviteeEmail ?? "",
//         status: i.status,
//         createdAt: i.created_at ?? i.createdAt,
//       }));
//       setInvites(rows);
//     } catch {
//       // ignore; non-admins may get 403
//     }
//   }, [groupId]);

//   useEffect(() => {
//     if (!groupId) {
//       setLoading(false);
//       setErrText("No group selected. Pass a valid { groupId } to MembersScreen.");
//       return;
//     }
//     loadMembers();
//     loadInvites();
//   }, [groupId, loadMembers, loadInvites]);

//   const memberIds = useMemo(() => members.map((m) => Number(m.userId)), [members]);
//   const pendingIds = useMemo(
//     () =>
//       invites
//         .map((i) => Number(i.inviteeId || 0))
//         .filter((x) => x > 0),
//     [invites]
//   );

//   const counts = useMemo(() => {
//     const total = members.length;
//     const admins = members.filter((m) => m.role === "admin").length;
//     const pend = invites.filter((i) => i.status === "pending").length;
//     return { total, admins, members: total - admins, pending: pend };
//   }, [members, invites]);

//   const filtered = useMemo(() => {
//     let arr = members;
//     if (filter === "admins") arr = arr.filter((m) => m.role === "admin");
//     if (filter === "members") arr = arr.filter((m) => m.role === "member");
//     if (query.trim()) {
//       const q = query.trim().toLowerCase();
//       arr = arr.filter(
//         (m) =>
//           m.name.toLowerCase().includes(q) ||
//           (m.email || "").toLowerCase().includes(q)
//       );
//     }
//     return arr;
//   }, [members, query, filter]);

//   // Invite modal visible flag
//   const [inviteOpen, setInviteOpen] = useState(false);

//   const onInvited = async () => {
//     await loadInvites();
//     if (Platform.OS === "web") {
//       alert("Invite sent.");
//     } else {
//       Alert.alert("Invite", "Invite sent.");
//     }
//   };

//   const cancelInvite = async (inviteId) => {
//     try {
//       await api.post(`/groups/invites/${inviteId}/cancel`);
//     } catch {
//       // optionally surface error
//     } finally {
//       await loadInvites();
//     }
//   };

//   // Admin actions (local demo only; server endpoints can be added later)
//   const makeAdmin = (userId) => {
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "admin" } : m))
//     );
//   };
//   const removeAdmin = (userId) => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "At least one admin must remain.");
//       return;
//     }
//     setMembers((old) =>
//       old.map((m) => (m.userId === userId ? { ...m, role: "member" } : m))
//     );
//   };
//   const removeMember = (userId) => {
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin") {
//       const adminCount = members.filter((m) => m.role === "admin").length;
//       if (adminCount <= 1) {
//         Alert.alert("Action blocked", "You cannot remove the last admin.");
//         return;
//       }
//     }
//     setMembers((old) => old.filter((m) => m.userId !== userId));
//   };
//   const leaveGroup = () => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const meRow = members.find((m) => m.userId === me.userId);
//     if (meRow?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "Transfer admin or add another admin before leaving.");
//       return;
//     }
//     setMembers((old) => old.filter((m) => m.userId !== me.userId));
//   };

//   const renderMember = ({ item }) => (
//     <View style={styles.rowCard}>
//       <View style={styles.rowLeft}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarTxt}>
//             {(item.name || "?")
//               .split(" ")
//               .map((w) => w[0])
//               .join("")
//               .slice(0, 2)
//               .toUpperCase()}
//           </Text>
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <View style={styles.nameWrap}>
//             <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//               {item.name}
//             </Text>
//             <RoleBadge role={item.role} />
//           </View>
//           {!!item.email && (
//             <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
//               {item.email}
//             </Text>
//           )}
//           <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
//         </View>
//       </View>

//       <View style={styles.actionsWrap}>
//         {me.role === "admin" && me.userId !== item.userId && (
//           <>
//             {item.role === "member" ? (
//               <TouchableOpacity
//                 onPress={() => makeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallPrimary}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Make ${item.name} admin`}
//               >
//                 <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
//                 <Text style={styles.smallPrimaryTxt}>Make admin</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={() => removeAdmin(item.userId)}
//                 activeOpacity={0.9}
//                 style={styles.smallGhost}
//                 accessibilityRole="button"
//                 accessibilityLabel={`Remove admin from ${item.name}`}
//               >
//                 <Ionicons name="shield-outline" size={16} color={COLORS.text} />
//                 <Text style={styles.smallGhostTxt}>Remove admin</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => removeMember(item.userId)}
//               activeOpacity={0.9}
//               style={styles.smallDanger}
//               accessibilityRole="button"
//               accessibilityLabel={`Remove ${item.name} from group`}
//             >
//               <Ionicons name="person-remove-outline" size={16} color="#fff" />
//               <Text style={styles.smallDangerTxt}>Remove</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {me.userId === item.userId && (
//           <TouchableOpacity
//             onPress={leaveGroup}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel="Leave group"
//           >
//             <Ionicons name="exit-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Leave</Text>
//           </TouchableOpacity>
//         )}

//         <Kebab onPress={() => Alert.alert("Actions", "More actions here…")} />
//       </View>
//     </View>
//   );

//   const renderInvite = ({ item }) => (
//     <View style={[styles.rowCard, { paddingVertical: 12 }]}>
//       <View style={styles.rowLeft}>
//         <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
//           <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//             {item.inviteeEmail || `User #${item.inviteeId}`}
//           </Text>
//           <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
//         </View>
//       </View>
//       {me.role === "admin" && (
//         <View style={styles.actionsWrap}>
//           <TouchableOpacity
//             onPress={() => cancelInvite(item.id)}
//             activeOpacity={0.9}
//             style={styles.smallGhost}
//             accessibilityRole="button"
//             accessibilityLabel={`Cancel invite for ${item.inviteeEmail || item.inviteeId}`}
//           >
//             <Ionicons name="close-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={{ paddingVertical: 12, flex: 1 }}>
//       <View style={styles.statsRow}>
//         <StatPill icon="people-outline" label="Members" value={counts.total} />
//         <StatPill icon="shield-checkmark-outline" label="Admins" value={counts.admins} />
//         <StatPill icon="mail-unread-outline" label="Pending" value={counts.pending} />
//       </View>

//       <View style={[styles.toolbar, { flexDirection: isPhone ? "column" : "row" }]}>
//         <View style={[styles.searchWrap, isPhone && { width: "100%" }]}>
//           <Ionicons name="search-outline" size={16} color={COLORS.sub} />
//           <TextInput
//             value={query}
//             onChangeText={setQuery}
//             placeholder="Search by name or email"
//             placeholderTextColor="#9AA7B5"
//             style={styles.searchInput}
//           />
//           {query.length > 0 && (
//             <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
//               <Ionicons name="close-circle" size={16} color="#9AA7B5" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={[styles.filtersRow, isPhone && { marginTop: 8 }]}>
//           <FilterPill label="All" active={filter === "all"} onPress={() => setFilter("all")} />
//           <FilterPill label="Admins" active={filter === "admins"} onPress={() => setFilter("admins")} />
//           <FilterPill label="Members" active={filter === "members"} onPress={() => setFilter("members")} />
//         </View>

//         {me.role === "admin" && (
//           <TouchableOpacity
//             onPress={() => setInviteOpen(true)}
//             activeOpacity={0.9}
//             style={styles.inviteBtn}
//             accessibilityRole="button"
//             accessibilityLabel="Invite members"
//           >
//             <Ionicons name="person-add-outline" size={18} color="#fff" />
//             <Text style={styles.inviteTxt}>Invite</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {errText ? (
//         <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF3F2", borderColor: "#FEE4E2", borderWidth: 1, borderRadius: 10 }}>
//           <Text style={{ color: "#B42318", fontWeight: "700" }}>{errText}</Text>
//         </View>
//       ) : null}

//       {loading ? (
//         <View style={{ paddingVertical: 24, alignItems: "center" }}>
//           <ActivityIndicator />
//           <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
//         </View>
//       ) : (
//         <>
//           {invites.length > 0 && (
//             <View style={{ marginTop: 10 }}>
//               <SectionLabel>Pending Invites</SectionLabel>
//               <FlatList
//                 data={invites}
//                 keyExtractor={(x) => String(x.id)}
//                 renderItem={renderInvite}
//                 ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//                 contentContainerStyle={{ paddingTop: 8 }}
//               />
//             </View>
//           )}

//           <View style={{ marginTop: 14, flex: 1 }}>
//             <SectionLabel>Members</SectionLabel>
//             <FlatList
//               data={filtered}
//               keyExtractor={(x) => String(x.userId)}
//               renderItem={renderMember}
//               ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//               contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
//             />
//           </View>
//         </>
//       )}

//       {/* Invite Drawer / Modal */}
//       {inviteOpen && (
//         <View style={{ marginTop: 16, flex: 1 }}>
//           <SectionLabel>Invite someone</SectionLabel>
//           <View style={{ height: 440 }}>
//             <UserSearch
//               groupId={groupId}
//               alreadyMemberIds={memberIds}
//               pendingInviteeIds={pendingIds}
//               onInvited={onInvited}
//             />
//           </View>
//           <View style={{ marginTop: 8, alignSelf: "flex-end" }}>
//             <TouchableOpacity onPress={() => setInviteOpen(false)} style={styles.smallGhost}>
//               <Ionicons name="close" size={16} color={COLORS.text} />
//               <Text style={styles.smallGhostTxt}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ---- small atoms ---- */
// const SectionLabel = ({ children }) => (
//   <View style={styles.sectionPill}>
//     <Text style={styles.sectionPillTxt}>{children}</Text>
//   </View>
// );

// const StatPill = ({ icon, label, value }) => (
//   <View style={styles.statPill}>
//     <Ionicons name={icon} size={16} color={COLORS.text} />
//     <Text style={styles.statPillLabel}>{label}</Text>
//     <Text style={styles.statPillValue}>{value}</Text>
//   </View>
// );

// // FilterPill
// function FilterPill({ label, active, onPress }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[
//         styles.filterPill,
//         active && { backgroundColor: "#E0F4FF", borderColor: "#0077b6" },
//       ]}
//       accessibilityRole="button"
//       accessibilityLabel={`Filter ${label}`}
//     >
//       <Text style={[styles.filterTxt, active && { color: "#0B74C8" }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   roleBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   roleBadgeTxt: { fontSize: 12, fontWeight: "800" },
//   kebab: {
//     padding: 6,
//     borderRadius: 10,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginLeft: 6,
//   },

//   statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
//   statPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   statPillLabel: { color: COLORS.sub, fontWeight: "700" },
//   statPillValue: { color: COLORS.text, fontWeight: "900" },

//   toolbar: { marginTop: 10, alignItems: "center", gap: 10 },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     minWidth: 260,
//     flex: 1,
//   },
//   searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

//   filtersRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   filterPill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#F9F9F9",
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 999,
//   },
//   filterTxt: { fontWeight: "700", color: COLORS.text },

//   inviteBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 14,
//   },
//   inviteTxt: { color: "#fff", fontWeight: "800" },

//   sectionPill: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.pillBg,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.pillBorder,
//   },
//   sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   rowCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 1 },
//     }),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

//   avatar: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: COLORS.soft,
//     borderWidth: 1, borderColor: COLORS.border,
//     alignItems: "center", justifyContent: "center",
//   },
//   avatarTxt: { color: COLORS.text, fontWeight: "900" },

//   nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
//   name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
//   email: { color: COLORS.sub, flexShrink: 1 },

//   joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

//   actionsWrap: { flexDirection: "row", alignItems: "center", gap: 6 },

//   smallPrimary: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallPrimaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

//   smallGhost: {
//     backgroundColor: "#F3F6FA",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallGhostTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   smallDanger: {
//     backgroundColor: "#EF4444",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallDangerTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
// });


// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import {
//   View, Text, StyleSheet, TextInput, FlatList, Platform,
//   useWindowDimensions, Alert, ActivityIndicator, TouchableOpacity,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import getBaseURL from "../../config/env";
// import UserSearch from "./UserSearch"; // ✅ group version

// const API = getBaseURL();

// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#5B6B7B",
//   page: "#F7F9FC",
//   card: "#FFFFFF",
//   border: "#E6EDF7",
//   soft: "#F1F5FE",
//   accent: "#0c2444ff",
//   pillBg: "#ECF3FF",
//   pillBorder: "#DCE7FF",
// };

// const formatDate = (iso) => {
//   try {
//     const d = new Date(iso);
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   } catch {
//     return iso;
//   }
// };

// const RoleBadge = ({ role }) => {
//   const txt = role === "admin" ? "Admin" : "Member";
//   const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
//   const br = role === "admin" ? "#BFD9FF" : COLORS.border;
//   const col = role === "admin" ? "#0B74C8" : COLORS.sub;
//   return (
//     <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
//       <Ionicons
//         name={role === "admin" ? "shield-checkmark-outline" : "person-outline"}
//         size={14}
//         color={col}
//       />
//       <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
//     </View>
//   );
// };

// const Kebab = ({ onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.85}
//     style={styles.kebab}
//     accessibilityRole="button"
//     accessibilityLabel="Open actions"
//   >
//     <Ionicons name="ellipsis-vertical" size={16} color={COLORS.sub} />
//   </TouchableOpacity>
// );

// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED: the group ID whose members to manage
//  */
// export default function MembersScreen({ groupId }) {
//   const { width } = useWindowDimensions();
//   const isPhone = width < 600;

//   const [auth, setAuth] = useState({ token: null, userId: null });
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
//       const next = { token: token || null, userId: uid ? Number(uid) : null };
//       console.log("[Members] boot auth:", { hasToken: !!next.token, uid: next.userId });
//       setAuth(next);
//     })();
//   }, []);

//   // ✅ use auth.token (not an undefined `token`)
//   const authHeaders = useMemo(
//     () => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
//     [auth.token]
//   );

//   const [loading, setLoading] = useState(true);
//   const [errText, setErrText] = useState(null);

//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [members, setMembers] = useState([]);
//   const [invites, setInvites] = useState([]);

//   const me = useMemo(() => {
//     const myRow = members.find((m) => Number(m.userId) === Number(auth.userId));
//     return { userId: auth.userId, role: myRow?.role || "member" };
//   }, [members, auth.userId]);

//   const loadMembers = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       setLoading(true);
//       setErrText(null);
//       const url = `${API}/groups/${groupId}/members`;
//       console.log("[Members] GET", url, "headers:", authHeaders);
//       const res = await fetch(url, { headers: { ...authHeaders } });
//       console.log("[Members] members status:", res.status);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       const list = (data?.members || []).map((r) => ({
//         userId: Number(r.userId ?? r.user_id ?? r.userid ?? 0),
//         name:
//           [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") ||
//           r.email ||
//           "—",
//         email: r.email || "",
//         role: r.role || "member",
//         joinedAt: r.joinedAt || r.joined_at || new Date().toISOString(),
//       }));
//       console.log("[Members] mapped members:", list.length);
//       setMembers(list);
//     } catch (e) {
//       console.log("[Members] members error:", e?.message || e);
//       setErrText(e?.message || "Failed to load members");
//     } finally {
//       setLoading(false);
//     }
//   }, [groupId, authHeaders]);

//   const loadInvites = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       const url = `${API}/groups/${groupId}/invites`;
//       console.log("[Members] GET", url, "headers:", authHeaders);
//       const res = await fetch(url, { headers: { ...authHeaders } });
//       console.log("[Members] invites status:", res.status);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       const rows = (data?.invites || []).map((i) => ({
//         id: Number(i.id),
//         inviteeId: i.invitee_id ?? i.inviteeId ?? null,
//         inviteeEmail: i.invitee_email ?? i.inviteeEmail ?? "",
//         status: i.status,
//         createdAt: i.created_at ?? i.createdAt,
//       }));
//       console.log("[Members] mapped invites:", rows.length);
//       setInvites(rows);
//     } catch (e) {
//       // Common if you’re not admin → backend may 403
//       console.log("[Members] invites load error:", e?.message || e);
//       setInvites([]);
//     }
//   }, [groupId, authHeaders]);

//   useEffect(() => {
//     if (!groupId) {
//       setLoading(false);
//       setErrText("No group selected. Pass a valid { groupId } to MembersScreen.");
//       return;
//     }
//     loadMembers();
//     loadInvites();
//   }, [groupId, loadMembers, loadInvites]);

//   const memberIds = useMemo(() => members.map((m) => Number(m.userId)), [members]);
//   const pendingIds = useMemo(
//     () => invites.map((i) => Number(i.inviteeId || 0)).filter((x) => x > 0),
//     [invites]
//   );

//   const counts = useMemo(() => {
//     const total = members.length;
//     const admins = members.filter((m) => m.role === "admin").length;
//     const pend = invites.filter((i) => i.status === "pending").length;
//     return { total, admins, members: total - admins, pending: pend };
//   }, [members, invites]);

//   const filtered = useMemo(() => {
//     let arr = members;
//     if (filter === "admins") arr = arr.filter((m) => m.role === "admin");
//     if (filter === "members") arr = arr.filter((m) => m.role === "member");
//     if (query.trim()) {
//       const q = query.trim().toLowerCase();
//       arr = arr.filter(
//         (m) =>
//           m.name.toLowerCase().includes(q) ||
//           (m.email || "").toLowerCase().includes(q)
//       );
//     }
//     return arr;
//   }, [members, query, filter]);

//   const [inviteOpen, setInviteOpen] = useState(false);

//   const onInvited = async () => {
//     await loadInvites();
//     if (Platform.OS === "web") alert("Invite sent.");
//     else Alert.alert("Invite", "Invite sent.");
//   };

//   const cancelInvite = async (inviteId) => {
//     try {
//       const url = `${API}/groups/invites/${inviteId}/cancel`;
//       console.log("[Members] POST", url);
//       const res = await fetch(url, { method: "POST", headers: { ...authHeaders } });
//       console.log("[Members] cancel status:", res.status);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     } catch (e) {
//       console.log("[Members] cancel error:", e?.message || e);
//     } finally {
//       await loadInvites();
//     }
//   };

//   // Local-only admin actions
//   const makeAdmin = (userId) => {
//     setMembers((old) => old.map((m) => (m.userId === userId ? { ...m, role: "admin" } : m)));
//   };
//   const removeAdmin = (userId) => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "At least one admin must remain.");
//       return;
//     }
//     setMembers((old) => old.map((m) => (m.userId === userId ? { ...m, role: "member" } : m)));
//   };
//   const removeMember = (userId) => {
//     const target = members.find((m) => m.userId === userId);
//     if (target?.role === "admin") {
//       const adminCount = members.filter((m) => m.role === "admin").length;
//       if (adminCount <= 1) {
//         Alert.alert("Action blocked", "You cannot remove the last admin.");
//         return;
//       }
//     }
//     setMembers((old) => old.filter((m) => m.userId !== userId));
//   };
//   const leaveGroup = () => {
//     const adminCount = members.filter((m) => m.role === "admin").length;
//     const meRow = members.find((m) => m.userId === me.userId);
//     if (meRow?.role === "admin" && adminCount <= 1) {
//       Alert.alert("Action blocked", "Transfer admin or add another admin before leaving.");
//       return;
//     }
//     setMembers((old) => old.filter((m) => m.userId !== me.userId));
//   };

//   const renderMember = ({ item }) => (
//     <View style={styles.rowCard}>
//       <View style={styles.rowLeft}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarTxt}>
//             {(item.name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
//           </Text>
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <View style={styles.nameWrap}>
//             <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
//             <RoleBadge role={item.role} />
//           </View>
//           {!!item.email && (
//             <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">{item.email}</Text>
//           )}
//           <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
//         </View>
//       </View>

//       <View style={styles.actionsWrap}>
//         {me.role === "admin" && me.userId !== item.userId && (
//           <>
//             {item.role === "member" ? (
//               <TouchableOpacity onPress={() => makeAdmin(item.userId)} activeOpacity={0.9} style={styles.smallPrimary}>
//                 <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
//                 <Text style={styles.smallPrimaryTxt}>Make admin</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={() => removeAdmin(item.userId)} activeOpacity={0.9} style={styles.smallGhost}>
//                 <Ionicons name="shield-outline" size={16} color={COLORS.text} />
//                 <Text style={styles.smallGhostTxt}>Remove admin</Text>
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity onPress={() => removeMember(item.userId)} activeOpacity={0.9} style={styles.smallDanger}>
//               <Ionicons name="person-remove-outline" size={16} color="#fff" />
//               <Text style={styles.smallDangerTxt}>Remove</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {me.userId === item.userId && (
//           <TouchableOpacity onPress={leaveGroup} activeOpacity={0.9} style={styles.smallGhost}>
//             <Ionicons name="exit-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Leave</Text>
//           </TouchableOpacity>
//         )}

//         <Kebab onPress={() => Alert.alert("Actions", "More actions here…")} />
//       </View>
//     </View>
//   );

//   const renderInvite = ({ item }) => (
//     <View style={[styles.rowCard, { paddingVertical: 12 }]}>
//       <View style={styles.rowLeft}>
//         <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
//           <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
//             {item.inviteeEmail || `User #${item.inviteeId}`}
//           </Text>
//           <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
//         </View>
//       </View>
//       {me.role === "admin" && (
//         <View style={styles.actionsWrap}>
//           <TouchableOpacity onPress={() => cancelInvite(item.id)} activeOpacity={0.9} style={styles.smallGhost}>
//             <Ionicons name="close-circle-outline" size={16} color={COLORS.text} />
//             <Text style={styles.smallGhostTxt}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={{ paddingVertical: 12, flex: 1 }}>
//       <View style={styles.statsRow}>
//         <StatPill icon="people-outline" label="Members" value={counts.total} />
//         <StatPill icon="shield-checkmark-outline" label="Admins" value={counts.admins} />
//         <StatPill icon="mail-unread-outline" label="Pending" value={counts.pending} />
//       </View>

//       <View style={[styles.toolbar, { flexDirection: isPhone ? "column" : "row" }]}>
//         <View style={[styles.searchWrap, isPhone && { width: "100%" }]}>
//           <Ionicons name="search-outline" size={16} color={COLORS.sub} />
//           <TextInput
//             value={query}
//             onChangeText={setQuery}
//             placeholder="Search by name or email"
//             placeholderTextColor="#9AA7B5"
//             style={styles.searchInput}
//           />
//           {query.length > 0 && (
//             <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
//               <Ionicons name="close-circle" size={16} color="#9AA7B5" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={[styles.filtersRow, isPhone && { marginTop: 8 }]}>
//           <FilterPill label="All" active={filter === "all"} onPress={() => setFilter("all")} />
//           <FilterPill label="Admins" active={filter === "admins"} onPress={() => setFilter("admins")} />
//           <FilterPill label="Members" active={filter === "members"} onPress={() => setFilter("members")} />
//         </View>

//         {me.role === "admin" && (
//           <TouchableOpacity onPress={() => setInviteOpen(true)} activeOpacity={0.9} style={styles.inviteBtn}>
//             <Ionicons name="person-add-outline" size={18} color="#fff" />
//             <Text style={styles.inviteTxt}>Invite</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {errText ? (
//         <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FEF3F2", borderColor: "#FEE4E2", borderWidth: 1, borderRadius: 10 }}>
//           <Text style={{ color: "#B42318", fontWeight: "700" }}>{errText}</Text>
//         </View>
//       ) : null}

//       {loading ? (
//         <View style={{ paddingVertical: 24, alignItems: "center" }}>
//           <ActivityIndicator />
//           <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
//         </View>
//       ) : (
//         <>
//           {invites.length > 0 && (
//             <View style={{ marginTop: 10 }}>
//               <SectionLabel>Pending Invites</SectionLabel>
//               <FlatList
//                 data={invites}
//                 keyExtractor={(x) => String(x.id)}
//                 renderItem={renderInvite}
//                 ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//                 contentContainerStyle={{ paddingTop: 8 }}
//               />
//             </View>
//           )}

//           <View style={{ marginTop: 14, flex: 1 }}>
//             <SectionLabel>Members</SectionLabel>
//             <FlatList
//               data={filtered}
//               keyExtractor={(x) => String(x.userId)}
//               renderItem={renderMember}
//               ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//               contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
//             />
//           </View>
//         </>
//       )}

//       {inviteOpen && (
//         <View style={{ marginTop: 16, flex: 1 }}>
//           <SectionLabel>Invite someone</SectionLabel>
//           <View style={{ height: 440 }}>
//             <UserSearch
//               groupId={groupId}
//               alreadyMemberIds={memberIds}
//               pendingInviteeIds={pendingIds}
//               onInvited={onInvited}
//             />
//           </View>
//           <View style={{ marginTop: 8, alignSelf: "flex-end" }}>
//             <TouchableOpacity onPress={() => setInviteOpen(false)} style={styles.smallGhost}>
//               <Ionicons name="close" size={16} color={COLORS.text} />
//               <Text style={styles.smallGhostTxt}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// /* ---- small atoms ---- */
// const SectionLabel = ({ children }) => (
//   <View style={styles.sectionPill}>
//     <Text style={styles.sectionPillTxt}>{children}</Text>
//   </View>
// );

// const StatPill = ({ icon, label, value }) => (
//   <View style={styles.statPill}>
//     <Ionicons name={icon} size={16} color={COLORS.text} />
//     <Text style={styles.statPillLabel}>{label}</Text>
//     <Text style={styles.statPillValue}>{value}</Text>
//   </View>
// );

// function FilterPill({ label, active, onPress }) {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.9}
//       style={[styles.filterPill, active && { backgroundColor: "#E0F4FF", borderColor: "#0077b6" }]}
//       accessibilityRole="button"
//       accessibilityLabel={`Filter ${label}`}
//     >
//       <Text style={[styles.filterTxt, active && { color: "#0B74C8" }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   roleBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     borderWidth: 1,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   roleBadgeTxt: { fontSize: 12, fontWeight: "800" },
//   kebab: {
//     padding: 6,
//     borderRadius: 10,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginLeft: 6,
//   },

//   statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
//   statPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 999,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   statPillLabel: { color: COLORS.sub, fontWeight: "700" },
//   statPillValue: { color: COLORS.text, fontWeight: "900" },

//   toolbar: { marginTop: 10, alignItems: "center", gap: 10 },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     minWidth: 260,
//     flex: 1,
//   },
//   searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

//   filtersRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   filterPill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#F9F9F9",
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 999,
//   },
//   filterTxt: { fontWeight: "700", color: COLORS.text },

//   inviteBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 14,
//   },
//   inviteTxt: { color: "#fff", fontWeight: "800" },

//   sectionPill: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.pillBg,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.pillBorder,
//   },
//   sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   rowCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 1 },
//     }),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

//   avatar: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: COLORS.soft,
//     borderWidth: 1, borderColor: COLORS.border,
//     alignItems: "center", justifyContent: "center",
//   },
//   avatarTxt: { color: COLORS.text, fontWeight: "900" },

//   nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
//   name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
//   email: { color: COLORS.sub, flexShrink: 1 },

//   joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

//   actionsWrap: { flexDirection: "row", alignItems: "center", gap: 6 },

//   smallPrimary: {
//     backgroundColor: COLORS.accent,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallPrimaryTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

//   smallGhost: {
//     backgroundColor: "#F3F6FA",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallGhostTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   smallDanger: {
//     backgroundColor: "#EF4444",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   smallDangerTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
// });

// components/Groups/MembersScreen.js
// import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
// import {
//   View, Text, StyleSheet, TextInput, FlatList, Platform,
//   Alert, ActivityIndicator, TouchableOpacity, Image, SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import getBaseURL from "../../config/env";

// const API = getBaseURL();

// /* ===== Logging ===== */
// const NS = "Members";
// const log  = (...a) => __DEV__ && console.log(`[${NS}]`, ...a);
// const warn = (...a) => __DEV__ && console.warn(`[${NS}]`, ...a);

// /* ===== Theme ===== */
// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#5B6B7B",
//   page: "#F7F9FC",
//   card: "#FFFFFF",
//   border: "#E6EDF7",
//   soft: "#F1F5FE",
//   accent: "#0c2444ff",
//   pillBg: "#ECF3FF",
//   pillBorder: "#DCE7FF",
//   primary: "#0F70F0",
// };

// const formatDate = (iso) => {
//   try {
//     const d = new Date(iso);
//     return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
//   } catch { return iso; }
// };

// const RoleBadge = ({ role }) => {
//   const txt = role === "admin" ? "Admin" : "Member";
//   const bg = role === "admin" ? "#E7F0FF" : "#F3F6FA";
//   const br = role === "admin" ? "#BFD9FF" : COLORS.border;
//   const col = role === "admin" ? "#0B74C8" : COLORS.sub;
//   return (
//     <View style={[styles.roleBadge, { backgroundColor: bg, borderColor: br }]}>
//       <Ionicons name={role === "admin" ? "shield-checkmark-outline" : "person-outline"} size={14} color={col} />
//       <Text style={[styles.roleBadgeTxt, { color: col }]}>{txt}</Text>
//     </View>
//   );
// };

// /**
//  * MembersScreen
//  * @param {object} props
//  * @param {number} props.groupId - REQUIRED
//  */
// export default function MembersScreen({ groupId }) {
//   /* ---------- Auth ---------- */
//   const [auth, setAuth] = useState({ token: null, userId: null });
//   useEffect(() => {
//     (async () => {
//       const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
//       const next = { token: token || null, userId: uid ? Number(uid) : null };
//       log("auth loaded:", { hasToken: !!next.token, userId: next.userId });
//       setAuth(next);
//     })();
//   }, []);
//   const authHeaders = useMemo(() => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}), [auth.token]);

//   /* ---------- Group members & invites ---------- */
//   const [loading, setLoading] = useState(true);
//   const [errText, setErrText] = useState(null);
//   const [members, setMembers] = useState([]);
//   const [invites, setInvites] = useState([]);

//   const me = useMemo(() => {
//     const mine = members.find((m) => Number(m.userId) === Number(auth.userId));
//     return { userId: auth.userId, role: mine?.role || "member" };
//   }, [members, auth.userId]);

//   const loadMembers = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       setLoading(true);
//       setErrText(null);
//       const url = `${API}/groups/${groupId}/members`;
//       log("GET", url);
//       const res = await fetch(url, { headers: { ...authHeaders } });
//       log("members status:", res.status);
//       if (!res.ok) {
//         if (res.status === 401) setErrText("Unauthorized: missing/invalid token.");
//         throw new Error(`HTTP ${res.status}`);
//       }
//       const data = await res.json();
//       const list = (data?.members || []).map((r) => ({
//         userId: Number(r.userId ?? r.user_id ?? r.userid ?? 0),
//         name: [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") || r.email || "—",
//         email: r.email || "",
//         role: r.role || "member",
//         joinedAt: r.joinedAt || r.joined_at || new Date().toISOString(),
//       }));
//       setMembers(list);
//     } catch (e) {
//       warn("members error:", e?.message || e);
//       setErrText(e?.message || "Failed to load members");
//     } finally {
//       setLoading(false);
//     }
//   }, [groupId, authHeaders]);

//   const loadInvites = useCallback(async () => {
//     if (!groupId) return;
//     try {
//       const url = `${API}/groups/${groupId}/invites`;
//       log("GET", url);
//       const res = await fetch(url, { headers: { ...authHeaders } });
//       log("invites status:", res.status);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       const rows = (data?.invites || []).map((i) => ({
//         id: Number(i.id),
//         inviteeId: i.invitee_id ?? i.inviteeId ?? null,
//         inviteeEmail: i.invitee_email ?? i.inviteeEmail ?? "",
//         status: i.status,
//         createdAt: i.created_at ?? i.createdAt,
//       }));
//       setInvites(rows);
//     } catch (e) {
//       warn("invites load error:", e?.message || e);
//       setInvites([]);
//     }
//   }, [groupId, authHeaders]);

//   useEffect(() => {
//     if (!groupId) {
//       setLoading(false);
//       setErrText("No group selected. Pass a valid { groupId } to MembersScreen.");
//       return;
//     }
//     loadMembers();
//     loadInvites();
//   }, [groupId, loadMembers, loadInvites]);

//   const memberIds  = useMemo(() => members.map((m) => Number(m.userId)), [members]);
//   const pendingIds = useMemo(() => invites.map((i) => Number(i.inviteeId || 0)).filter((x) => x > 0), [invites]);

//   /* ---------- SERVER-SIDE USER SEARCH (not local filter) ---------- */
//   const [searchQ, setSearchQ] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchErr, setSearchErr] = useState(null);
//   const debounceRef = useRef(null);
//   const MIN = 2, DEBOUNCE = 350;

//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     const q = (searchQ || "").trim();

//     if (q.length < MIN) {
//       setSearchResults([]);
//       setSearchErr(null);
//       return;
//     }

//     debounceRef.current = setTimeout(() => {
//       (async () => {
//         try {
//           setSearchLoading(true);
//           setSearchErr(null);
//           const url = `${API}/search/users?q=${encodeURIComponent(q)}`;
//           log("SEARCH GET", url);
//           const res = await fetch(url, { headers: { ...authHeaders } });
//           log("search status:", res.status);
//           if (!res.ok) {
//             if (res.status === 401) setSearchErr("Unauthorized: missing/invalid token.");
//             throw new Error(`HTTP ${res.status}`);
//           }
//           const data = await res.json();
//           const list = (data?.users || []).map((u) => ({
//             id: Number(u.id),
//             email: u.email,
//             first_name: u.first_name || "",
//             last_name: u.last_name || "",
//             image_url: u.image_url,
//           }));
//           setSearchResults(list);
//         } catch (e) {
//           warn("search error:", e?.message || e);
//           setSearchErr(e?.message || "Search failed");
//           setSearchResults([]);
//         } finally {
//           setSearchLoading(false);
//         }
//       })();
//     }, DEBOUNCE);

//     return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
//   }, [searchQ, authHeaders]);

//   // EXACT endpoint: POST /groups/:group_id/invites?invitee_id=USER_ID
//   const inviteUser = async (userId) => {
//     if (!groupId) { Alert.alert("Missing group", "No group selected."); return; }
//     try {
//       const url = `${API}/groups/${groupId}/invites?invitee_id=${encodeURIComponent(userId)}`;
//       log("INVITE POST", url);
//       const res = await fetch(url, { method: "POST", headers: { ...authHeaders } });
//       log("invite status:", res.status);
//       if (!res.ok) {
//         if (res.status === 401) return Alert.alert("Unauthorized", "Missing/invalid token.");
//         if (res.status === 403) return Alert.alert("Forbidden", "You may need admin rights to invite.");
//         throw new Error(`HTTP ${res.status}`);
//       }
//       await loadInvites();
//       Alert.alert("Invited", "User has been invited.");
//     } catch (e) {
//       warn("invite error:", e?.message || e);
//       Alert.alert("Error", e?.message || "Failed to invite user.");
//     }
//   };

//   /* ---------- UI ---------- */
//   const counts = useMemo(() => {
//     const total  = members.length;
//     const admins = members.filter((m) => m.role === "admin").length;
//     const pend   = invites.filter((i) => i.status === "pending").length;
//     return { total, admins, pending: pend };
//   }, [members, invites]);

//   const renderSearchItem = ({ item }) => {
//     const fullName = [item.first_name, item.last_name].filter(Boolean).join(" ");
//     const already   = memberIds.includes(item.id);
//     const pending   = pendingIds.includes(item.id);
//     const disabled  = !groupId || already || pending;

//     let btnText = "Invite";
//     if (already) btnText = "Member";
//     else if (pending) btnText = "Invited";

//     return (
//       <View style={styles.userRow}>
//         <Image source={{ uri: item.image_url || "https://placehold.co/80x80?text=U" }} style={styles.avatarImg} />
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.name} numberOfLines={1}>{fullName || item.email}</Text>
//           <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
//         </View>
//         <TouchableOpacity
//           onPress={() => inviteUser(item.id)}
//           disabled={disabled}
//           style={[
//             styles.inviteChip,
//             (already || pending) && styles.inviteChipMuted,
//             disabled && { opacity: 0.6 },
//           ]}
//         >
//           <Text style={[styles.inviteChipTxt, (already || pending) && styles.inviteChipTxtMuted]}>
//             {btnText}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const renderMember = ({ item }) => (
//     <View style={styles.memberRow}>
//       <View style={styles.avatar}>
//         <Text style={styles.avatarTxt}>
//           {(item.name || "?").split(" ").map((w) => w[0]).join("").slice(0,2).toUpperCase()}
//         </Text>
//       </View>
//       <View style={{ flex: 1, minWidth: 0 }}>
//         <View style={styles.nameWrap}>
//           <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
//           <RoleBadge role={item.role} />
//         </View>
//         {!!item.email && <Text style={styles.email} numberOfLines={1}>{item.email}</Text>}
//         <Text style={styles.joined}>Joined: {formatDate(item.joinedAt)}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.page, paddingVertical: 12 }}>
//       {/* Server-side search */}
//       <SectionLabel>Search users to invite</SectionLabel>
//       <View style={[styles.searchWrap, { marginTop: 8 }]}>
//         <Ionicons name="search-outline" size={16} color={COLORS.sub} />
//         <TextInput
//           value={searchQ}
//           onChangeText={setSearchQ}
//           placeholder="Search by name or email…"
//           placeholderTextColor="#9AA7B5"
//           style={styles.searchInput}
//           autoCapitalize="none"
//           autoCorrect={false}
//         />
//         {searchQ.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQ("")}>
//             <Ionicons name="close-circle" size={16} color="#9AA7B5" />
//           </TouchableOpacity>
//         )}
//       </View>

//       <View style={styles.panel}>
//         {searchLoading ? (
//           <View style={styles.centerBlock}>
//             <ActivityIndicator />
//             <Text style={styles.loadingText}>Searching…</Text>
//           </View>
//         ) : searchErr ? (
//           <View style={styles.centerBlock}>
//             <Text style={{ color: "#B42318", fontWeight: "700" }}>{searchErr}</Text>
//           </View>
//         ) : searchResults.length === 0 ? (
//           <View style={styles.centerBlock}>
//             <Text style={styles.emptyText}>
//               {searchQ.trim().length >= MIN ? `No results for “${searchQ.trim()}”` : "Type at least 2 characters"}
//             </Text>
//           </View>
//         ) : (
//           <FlatList
//             data={searchResults}
//             keyExtractor={(u) => String(u.id)}
//             renderItem={renderSearchItem}
//             ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.border, marginLeft: 66 }} />}
//             contentContainerStyle={{ paddingVertical: 6 }}
//           />
//         )}
//       </View>

//       {/* Pending Invites */}
//       {invites.length > 0 && (
//         <View style={{ marginTop: 14 }}>
//           <SectionLabel>Pending invites</SectionLabel>
//           <FlatList
//             data={invites}
//             keyExtractor={(x) => String(x.id)}
//             renderItem={({ item }) => (
//               <View style={styles.memberRow}>
//                 <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
//                   <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
//                 </View>
//                 <View style={{ flex: 1, minWidth: 0 }}>
//                   <Text style={styles.name} numberOfLines={1}>{item.inviteeEmail || `User #${item.inviteeId}`}</Text>
//                   <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
//                 </View>
//               </View>
//             )}
//             ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//             contentContainerStyle={{ paddingTop: 8 }}
//           />
//         </View>
//       )}

//       {/* Members */}
//       <View style={{ marginTop: 14, flex: 1 }}>
//         <SectionLabel>Members</SectionLabel>
//         {loading ? (
//           <View style={{ paddingVertical: 24, alignItems: "center" }}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={members}
//             keyExtractor={(x) => String(x.userId)}
//             renderItem={renderMember}
//             ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//             contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---- small atoms ---- */
// const SectionLabel = ({ children }) => (
//   <View style={styles.sectionPill}>
//     <Text style={styles.sectionPillTxt}>{children}</Text>
//   </View>
// );

// /* ---- styles ---- */
// const styles = StyleSheet.create({
//   roleBadge: {
//     flexDirection: "row", alignItems: "center", gap: 6,
//     borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
//   },
//   roleBadgeTxt: { fontSize: 12, fontWeight: "800" },

//   sectionPill: {
//     alignSelf: "flex-start", backgroundColor: COLORS.pillBg,
//     paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
//     borderWidth: 1, borderColor: COLORS.pillBorder,
//   },
//   sectionPillTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

//   searchWrap: {
//     flexDirection: "row", alignItems: "center", gap: 8,
//     backgroundColor: "#fff", borderWidth: 1, borderColor: COLORS.border,
//     borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minWidth: 260,
//   },
//   searchInput: { flex: 1, color: COLORS.text, minWidth: 100 },

//   panel: {
//     marginTop: 8, backgroundColor: COLORS.card, borderRadius: 16,
//     borderWidth: 1, borderColor: COLORS.border,
//     ...(Platform.OS === "web"
//       ? { boxSizing: "border-box", boxShadow: "0 8px 24px rgba(15,58,107,0.06)" }
//       : { elevation: 1 }),
//   },

//   centerBlock: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
//   loadingText: { marginTop: 6, color: COLORS.sub, fontWeight: "600" },
//   emptyText: { color: COLORS.sub, fontWeight: "600" },

//   userRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10 },
//   avatarImg: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: "#EAF0F6" },

//   inviteChip: {
//     borderRadius: 999, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 16,
//     backgroundColor: COLORS.primary, borderColor: COLORS.primary,
//   },
//   inviteChipMuted: { backgroundColor: "#EEF3F9", borderColor: COLORS.border },
//   inviteChipTxt: { color: "#FFFFFF", fontWeight: "800" },
//   inviteChipTxtMuted: { color: "#0F172A" },

//   memberRow: {
//     backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border,
//     paddingHorizontal: 14, paddingVertical: 14,
//     ...Platform.select({ ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }, android: { elevation: 1 } }),
//     flexDirection: "row", alignItems: "center", gap: 12,
//   },
//   avatar: {
//     width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.soft,
//     borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center",
//   },
//   avatarTxt: { color: COLORS.text, fontWeight: "900" },
//   nameWrap: { flexDirection: "row", alignItems: "center", gap: 8, minWidth: 0, flex: 1, flexWrap: "wrap" },
//   name: { fontSize: 16, fontWeight: "800", color: COLORS.text, flexShrink: 1, maxWidth: "100%" },
//   email: { color: COLORS.sub, flexShrink: 1 },
//   joined: { color: COLORS.sub, marginTop: 2, fontSize: 12 },
// });


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
      const list = (data?.members || []).map((r) => ({
        userId: Number(r.userId ?? r.user_id ?? r.userid ?? 0),
        name: [r.first_name || "", r.last_name || ""].filter(Boolean).join(" ") || r.email || "—",
        email: r.email || "",
        role: r.role || "member",
        joinedAt: r.joinedAt || r.joined_at || new Date().toISOString(),
      }));
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
      const rows = (data?.invites || []).map((i) => ({
        id: Number(i.id),
        inviteeId: i.invitee_id ?? i.inviteeId ?? null,
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
    loadMembers();
    loadInvites();
  }, [groupId, loadMembers, loadInvites]);

  const memberIds  = useMemo(() => members.map((m) => Number(m.userId)), [members]);
  const pendingIds = useMemo(() => invites.map((i) => Number(i.inviteeId || 0)).filter((x) => x > 0), [invites]);

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

    debounceRef.current = setTimeout(() => {
      (async () => {
        try {
          setSearchLoading(true);
          setSearchErr(null);
          const url = `${API}/search/users?q=${encodeURIComponent(q)}`;
          log("SEARCH GET", url);
          const res = await fetch(url, { headers: { ...authHeaders } });
          log("search status:", res.status);
          if (!res.ok) {
            if (res.status === 401) setSearchErr("Unauthorized: missing/invalid token.");
            throw new Error(`HTTP ${res.status}`);
          }
          const data = await res.json();
          const list = (data?.users || []).map((u) => ({
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
  }, [searchQ, authHeaders]);

  /* ---------- INVITE (JSON body: inviter_id + invitee_id) ---------- */
  const inviteUser = async (userId) => {
    if (!groupId) { Alert.alert("Missing group", "No group selected."); return; }
    if (!auth.userId) { Alert.alert("Unauthorized", "No user session."); return; }

    try {
      const url = `${API}/groups/${groupId}/invites`;
      const body = { inviter_id: Number(auth.userId), invitee_id: Number(userId) };
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
        if (res.status === 400) {
          const j = await safeJson(res);
          return Alert.alert("Bad request", j?.error || "Invalid request.");
        }
        if (res.status === 401) return Alert.alert("Unauthorized", "Missing/invalid token.");
        if (res.status === 403) return Alert.alert("Forbidden", "You must be an admin to invite.");
        if (res.status === 409) {
          const j = await safeJson(res);
          return Alert.alert("Already invited / member", j?.error || "Conflict.");
        }
        throw new Error(`HTTP ${res.status}`);
      }

      await loadInvites();
      Alert.alert("Invited", "User has been invited.");
    } catch (e) {
      warn("invite error:", e?.message || e);
      Alert.alert("Error", e?.message || "Failed to invite user.");
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
          <SectionLabel>Pending invites</SectionLabel>
          <FlatList
            data={invites}
            keyExtractor={(x) => String(x.id)}
            renderItem={({ item }) => (
              <View style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: "#E7F0FF", borderColor: "#CFE2FF" }]}>
                  <Ionicons name="mail-unread-outline" size={16} color="#0B74C8" />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.name} numberOfLines={1}>{item.inviteeEmail || `User #${item.inviteeId}`}</Text>
                  <Text style={styles.joined}>Invited: {formatDate(item.createdAt)}</Text>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingTop: 8 }}
          />
        </View>
      )}

      {/* Members */}
      <View style={{ marginTop: 14, flex: 1 }}>
        <SectionLabel>Members</SectionLabel>
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 6, color: COLORS.sub, fontWeight: "600" }}>Loading members…</Text>
          </View>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(x) => String(x.userId)}
            renderItem={renderMember}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
          />
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
