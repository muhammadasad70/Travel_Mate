// // screens/Groups/GroupsHomeScreen.js
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Pressable,
//   ActivityIndicator,
//   RefreshControl,
//   useWindowDimensions,
//   Platform,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import api from "../../api";

// /* ===== Theme ===== */
// const COLORS = {
//   text: "#0F3A6B",
//   textSoft: "#3e5168ff",
//   page: "#F7F9FC",
//   card: "#FFFFFF",
//   sub: "#6B7280",
//   border: "#E6EDF7",
//   pillBg: "#ECF3FF",
//   pillBorder: "#DCE7FF",
//   soft: "#F1F5FE",
//   accent: "#003366",
// };

// const fmtActivity = (s) => s || "No activity yet";

// export default function GroupsHomeScreen() {
//   const nav = useNavigation();
//   const { width } = useWindowDimensions();

//   // Breakpoints -> columns
//   const isPhone = width < 480;
//   const isTablet = width >= 480 && width < 900;
//   const columns = isPhone ? 1 : isTablet ? 2 : 3;

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [groups, setGroups] = useState([]);
//   const [invites, setInvites] = useState([]);
//   const [error, setError] = useState("");

//   const load = useCallback(async () => {
//     try {
//       setError("");
//       setLoading(true);
//       const [g, i] = await Promise.all([
//         api.get("/groups/mine").catch(() => ({ data: [] })),
//         api.get("/groups/invites").catch(() => ({ data: [] })),
//       ]);
//       setGroups(Array.isArray(g.data) ? g.data : []);
//       setInvites(Array.isArray(i.data) ? i.data : []);
//     } catch (e) {
//       setError("Failed to load groups. Check connection.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);
//   useFocusEffect(useCallback(() => { load(); }, [load]));

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await load();
//     setRefreshing(false);
//   }, [load]);

//   const acceptInvite = async (inviteId) => {
//     try {
//       await api.post(`/groups/invites/${inviteId}/accept`);
//       await load();
//     } catch { setError("Could not accept invite."); }
//   };
//   const declineInvite = async (inviteId) => {
//     try {
//       await api.post(`/groups/invites/${inviteId}/decline`);
//       await load();
//     } catch { setError("Could not decline invite."); }
//   };

//   /* ---------- UI Pieces ---------- */
//   const HeaderBar = useMemo(() => (
//     <View style={styles.appbar}>
//       <Pressable
//         onPress={() => nav.goBack()}
//         hitSlop={10}
//         style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
//         accessibilityRole="button"
//         accessibilityLabel="Go back"
//       >
//         <Ionicons name="arrow-back" size={22} color={COLORS.textSoft} />
//       </Pressable>
//       <Text style={styles.appbarTitle} numberOfLines={1}>Groups</Text>
//       <View style={{ width: 22 }} />
//     </View>
//   ), [nav]);

//   const Hero = (
//     <View style={styles.hero}>
//       <View style={styles.heroIcon}>
//         <Ionicons name="people-outline" size={20} color={COLORS.text} />
//       </View>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.heroTitle}>Your Groups</Text>
//         <Text style={styles.heroSubtitle}>Plan together, vote & chat in real-time.</Text>
//       </View>
//     </View>
//   );

//   const QuickActions = (
//     <View style={styles.actionsRow}>
//       <Pressable
//         onPress={() => nav.navigate("CreateGroupModal")}
//         android_ripple={{ color: "rgba(255,255,255,0.15)" }}
//         style={({ pressed }) => [styles.actionPrimary, pressed && { transform: [{ scale: 0.99 }] }]}
//       >
//         <Ionicons name="add" size={18} color="#FFF" />
//         <Text style={styles.actionPrimaryTxt}>Create Group</Text>
//       </Pressable>
//     </View>
//   );

//   const SectionLabel = ({ children }) => (
//     <View style={styles.sectionPill}>
//       <Text style={styles.sectionPillTxt}>{children}</Text>
//     </View>
//   );

//   const renderInvite = ({ item }) => (
//     <View key={item.id} style={[styles.cardRow, { marginBottom: 10 }]}>
//       <View style={{ flex: 1 }}>
//         <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//           <View style={styles.bubbleIcon}><Ionicons name="mail-unread-outline" size={16} color={COLORS.text} /></View>
//           <Text style={styles.cardTitle}>{item.groupName || "Group"}</Text>
//         </View>
//         <Text style={styles.meta}>{fmtActivity(item.lastActivity)}</Text>
//       </View>
//       <View style={styles.rowBtns}>
//         <Pressable onPress={() => acceptInvite(item.id)} style={styles.smallPrimary}>
//           <Text style={styles.smallPrimaryTxt}>Accept</Text>
//         </Pressable>
//         <Pressable onPress={() => declineInvite(item.id)} style={styles.smallGhost}>
//           <Text style={styles.smallGhostTxt}>Decline</Text>
//         </Pressable>
//       </View>
//     </View>
//   );

//   const renderGroup = ({ item }) => (
//     <Pressable
//       onPress={() => nav.navigate("GroupDashboard", { groupId: item.id })}
//       android_ripple={{ color: "rgba(15,112,240,0.08)" }}
//       style={({ pressed }) => [styles.groupCard, pressed && { transform: [{ scale: 0.997 }] }]}
//     >
//       <View style={styles.groupTop}>
//         <View style={styles.bubbleIconLg}>
//           <Ionicons name="people-outline" size={18} color={COLORS.text} />
//         </View>
//         <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
//       </View>
//       <Text style={styles.groupName} numberOfLines={2}>{item.name}</Text>
//       <Text style={styles.meta}>
//         {item.membersCount ?? 0} member{(item.membersCount ?? 0) === 1 ? "" : "s"}
//       </Text>
//       <Text style={[styles.meta, { marginTop: 2 }]}>{fmtActivity(item.lastActivity)}</Text>
//     </Pressable>
//   );

//   /* ---------- Loading ---------- */
//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         {HeaderBar}
//         <View style={styles.topPad}>{Hero}{QuickActions}</View>
//         <View style={styles.center}>
//           <ActivityIndicator />
//           {!!error && <Text style={styles.error}>{error}</Text>}
//         </View>
//         {isPhone && (
//           <Pressable
//             onPress={() => nav.navigate("CreateGroupModal")}
//             style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.98 }] }]}
//           >
//             <Ionicons name="add" size={22} color="#fff" />
//           </Pressable>
//         )}
//       </SafeAreaView>
//     );
//   }

//   /* ---------- Content ---------- */
//   return (
//     <SafeAreaView style={styles.container}>
//       {HeaderBar}

//       <FlatList
//         key={columns}                 // <— remount when columns change (prevents numColumns warning)
//         data={groups}
//         keyExtractor={(x) => String(x.id)}
//         renderItem={renderGroup}
//         numColumns={columns}          // <— true grid across breakpoints
//         columnWrapperStyle={
//           columns > 1
//             ? { columnGap: 12, paddingHorizontal: 16, maxWidth: 1200, alignSelf: "center", width: "100%" }
//             : null
//         }
//         ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         contentContainerStyle={{
//           paddingBottom: isPhone ? 90 : 40,
//           paddingHorizontal: columns === 1 ? 16 : 0,
//           maxWidth: 1200,
//           alignSelf: "center",
//           width: "100%",
//         }}
//         ListHeaderComponent={
//           <View style={styles.topPad}>
//             {Hero}
//             {QuickActions}

//             {!!error && <Text style={[styles.error, { paddingHorizontal: 16, marginTop: 8 }]}>{error}</Text>}

//             {invites.length > 0 && (
//               <View style={{ marginTop: 12 }}>
//                 <SectionLabel>Invites</SectionLabel>
//                 <View style={{ gap: 10, paddingHorizontal: 16, maxWidth: 1200, alignSelf: "center", width: "100%" }}>
//                   {invites.map((inv) => renderInvite({ item: inv }))}
//                 </View>
//               </View>
//             )}

//             <View style={{ marginTop: 14, paddingHorizontal: 16, maxWidth: 1200, alignSelf: "center", width: "100%" }}>
//               <SectionLabel>My Groups</SectionLabel>
//             </View>
//           </View>
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyCard}>
//             <View style={styles.emptyIcon}>
//               <Ionicons name="people-outline" size={22} color={COLORS.text} />
//             </View>
//             <Text style={styles.emptyText}>You haven’t joined any groups yet.</Text>
//             <View style={styles.emptyActions}>
//               <Pressable onPress={() => nav.navigate("CreateGroupModal")} style={styles.actionPrimary}>
//                 <Ionicons name="add" size={18} color="#FFF" />
//                 <Text style={styles.actionPrimaryTxt}>Create Group</Text>
//               </Pressable>
//             </View>
//           </View>
//         }
//       />

//       {isPhone && (
//         <Pressable
//           onPress={() => nav.navigate("CreateGroupModal")}
//           style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.98 }] }]}
//         >
//           <Ionicons name="add" size={22} color="#fff" />
//         </Pressable>
//       )}
//     </SafeAreaView>
//   );
// }

// /* ===================== styles ===================== */
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.page },

//   appbar: {
//     height: 48,
//     paddingHorizontal: 10,
//     backgroundColor: COLORS.card,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   backBtn: { padding: 6 },
//   appbarTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textSoft },

//   topPad: { paddingTop: 10 },
//   hero: {
//     marginHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: COLORS.soft,
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     maxWidth: 1200,
//     alignSelf: "center",
//   },
//   heroIcon: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: "#E7F0FF", alignItems: "center", justifyContent: "center",
//   },
//   heroTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textSoft },
//   heroSubtitle: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

//   actionsRow: {
//     marginTop: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     paddingHorizontal: 16,
//     maxWidth: 1200,
//     alignSelf: "center",
//   },
//   actionPrimary: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 14,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 2 },
//     }),
//   },
//   actionPrimaryTxt: { color: "#FFF", fontWeight: "800" },

//   sectionPill: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.pillBg,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.pillBorder,
//   },
//   sectionPillTxt: { color: COLORS.textSoft, fontWeight: "800", fontSize: 12 },

//   cardRow: {
//     backgroundColor: COLORS.card,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 1 },
//     }),
//   },
//   bubbleIcon: {
//     width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.soft,
//     alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border,
//   },
//   bubbleIconLg: {
//     width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.soft,
//     alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border,
//   },
//   rowBtns: { flexDirection: "row", gap: 8 },
//   cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textSoft },
//   meta: { color: COLORS.sub, marginTop: 4, fontSize: 12 },

//   smallPrimary: {
//     backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
//   },
//   smallPrimaryTxt: { color: "#FFF", fontWeight: "800", fontSize: 12 },
//   smallGhost: {
//     backgroundColor: "#F3F6FA", borderRadius: 10,
//     paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.border,
//   },
//   smallGhostTxt: { fontWeight: "800", fontSize: 12, color: COLORS.textSoft },

//   groupCard: {
//     flex: 1,                     // let the grid cell fill column width
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     padding: 14,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 1 },
//     }),
//   },
//   groupTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
//   groupName: { fontSize: 16, fontWeight: "800", color: COLORS.textSoft },

//   emptyCard: {
//     marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 16,
//     borderWidth: 1, borderColor: COLORS.border, padding: 18, alignItems: "center",
//     maxWidth: 1200, alignSelf: "center", width: "100%",
//   },
//   emptyIcon: {
//     width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.soft,
//     alignItems: "center", justifyContent: "center", marginBottom: 10,
//     borderWidth: 1, borderColor: COLORS.border,
//   },
//   emptyText: { color: COLORS.sub, marginBottom: 12, textAlign: "center" },
//   emptyActions: { flexDirection: "row", gap: 10 },

//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   error: { color: "#B91C1C", marginTop: 8 },

//   fab: {
//     position: "absolute",
//     right: 18,
//     bottom: 18,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.accent,
//     ...Platform.select({
//       ios: { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
//       android: { elevation: 4 },
//     }),
//   },
// });



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
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // <-- added insets import
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api";

/* ===== Theme ===== */
const COLORS = {
  text: "#0F3A6B",
  textSoft: "#3e5168ff",
  page: "#F7F9FC",
  card: "#FFFFFF",
  sub: "#6B7280",
  border: "#E6EDF7",
  pillBg: "#ECF3FF",
  pillBorder: "#DCE7FF",
  soft: "#F1F5FE",
  accent: "#0c2444ff",
};

const fmtActivity = (s) => s || "No activity yet";

export default function GroupsHomeScreen() {
  const nav = useNavigation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets(); // <-- get device safe-area insets

  // Breakpoints -> columns
  const isPhone = width < 480;
  const isTablet = width >= 480 && width < 900;
  const columns = isPhone ? 1 : isTablet ? 2 : 3;

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

  /* ---------- UI Pieces ---------- */
  const HeaderBar = useMemo(() => (
    <View style={styles.appbar}>
      <Pressable
        onPress={() => nav.goBack()}
        hitSlop={10}
        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.textSoft} />
      </Pressable>
      <Text style={styles.appbarTitle} numberOfLines={1}>Groups</Text>
      <View style={{ width: 22 }} />
    </View>
  ), [nav]);

  const Hero = (
    <View style={styles.hero}>
      <View style={styles.heroIcon}>
        <Ionicons name="people-outline" size={20} color={COLORS.text} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.heroTitle}>Your Groups</Text>
        <Text style={styles.heroSubtitle}>Plan together, vote & chat in real-time.</Text>
      </View>
    </View>
  );

  const QuickActions = (
    <View style={styles.actionsRow}>
      <Pressable
        onPress={() => nav.navigate("CreateGroupModal")}
        android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        style={({ pressed }) => [styles.actionPrimary, pressed && { transform: [{ scale: 0.99 }] }]}
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
    <View key={item.id} style={[styles.cardRow, { marginBottom: 10 }]}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={styles.bubbleIcon}><Ionicons name="mail-unread-outline" size={16} color={COLORS.text} /></View>
          <Text style={styles.cardTitle}>{item.groupName || "Group"}</Text>
        </View>
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
      android_ripple={{ color: "rgba(15,112,240,0.08)" }}
      style={({ pressed }) => [styles.groupCard, pressed && { transform: [{ scale: 0.997 }] }]}
    >
      <View style={styles.groupTop}>
        <View style={styles.bubbleIconLg}>
          <Ionicons name="people-outline" size={18} color={COLORS.text} />
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
      </View>
      <Text style={styles.groupName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.meta}>
        {item.membersCount ?? 0} member{(item.membersCount ?? 0) === 1 ? "" : "s"}
      </Text>
      <Text style={[styles.meta, { marginTop: 2 }]}>{fmtActivity(item.lastActivity)}</Text>
    </Pressable>
  );

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {HeaderBar}
        <View style={styles.topPad}>{Hero}{QuickActions}</View>
        <View style={styles.center}>
          <ActivityIndicator />
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
        {isPhone && (
          <Pressable
            onPress={() => nav.navigate("CreateGroupModal")}
            style={({ pressed }) => [
              styles.fab,
              { bottom: insets.bottom + 18 }, // <-- lifted above nav bar
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        )}
      </SafeAreaView>
    );
  }

  /* ---------- Content ---------- */
  return (
    <SafeAreaView style={styles.container}>
      {HeaderBar}

      <FlatList
        key={columns}
        data={groups}
        keyExtractor={(x) => String(x.id)}
        renderItem={renderGroup}
        numColumns={columns}
        columnWrapperStyle={
          columns > 1
            ? { columnGap: 12, paddingHorizontal: 16, maxWidth: 1200, alignSelf: "center", width: "100%" }
            : null
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{
          paddingBottom: isPhone ? 90 : 40,
          paddingHorizontal: columns === 1 ? 16 : 0,
          maxWidth: 1200,
          alignSelf: "center",
          width: "100%",
        }}
        ListHeaderComponent={
          <View style={styles.topPad}>
            {Hero}
            {QuickActions}

            {!!error && <Text style={[styles.error, { paddingHorizontal: 16, marginTop: 8 }]}>{error}</Text>}

            {invites.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <SectionLabel>Invites</SectionLabel>
                <View style={{ gap: 10, paddingHorizontal: 16, maxWidth: 1200, alignSelf: "center", width: "100%" }}>
                  {invites.map((inv) => renderInvite({ item: inv }))}
                </View>
              </View>
            )}

            <View style={{ marginTop: 14,marginBottom:12, paddingHorizontal: 16, maxWidth: 1200, alignSelf: "center", width: "100%" }}>
              <SectionLabel>My Groups</SectionLabel>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={22} color={COLORS.text} />
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

      {isPhone && (
        <Pressable
          onPress={() => nav.navigate("CreateGroupModal")}
          style={({ pressed }) => [
            styles.fab,
            { bottom: insets.bottom + 18 }, // <-- lifted above nav bar
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

/* ===================== styles ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.page },

  appbar: {
    height: 48,
    paddingHorizontal: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { padding: 6 },
  appbarTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textSoft },

  topPad: { paddingTop: 10 },
  hero: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.soft,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxWidth: 1200,
    alignSelf: "center",
  },
  heroIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#E7F0FF", alignItems: "center", justifyContent: "center",
  },
  heroTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textSoft },
  heroSubtitle: { color: COLORS.sub, marginTop: 2, fontSize: 12 },

  actionsRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    maxWidth: 1200,
    alignSelf: "center",
  },
  actionPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  actionPrimaryTxt: { color: "#FFF", fontWeight: "800" },

  sectionPill: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.pillBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.pillBorder,
  },
  sectionPillTxt: { color: COLORS.textSoft, fontWeight: "800", fontSize: 12 },

  cardRow: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
    }),
  },
  bubbleIcon: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.soft,
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border,
  },
  bubbleIconLg: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.soft,
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border,
  },
  rowBtns: { flexDirection: "row", gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textSoft },
  meta: { color: COLORS.sub, marginTop: 4, fontSize: 12 },

  smallPrimary: {
    backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
  },
  smallPrimaryTxt: { color: "#FFF", fontWeight: "800", fontSize: 12 },
  smallGhost: {
    backgroundColor: "#F3F6FA", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.border,
  },
  smallGhostTxt: { fontWeight: "800", fontSize: 12, color: COLORS.textSoft },

  groupCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
    }),
  },
  groupTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  groupName: { fontSize: 16, fontWeight: "800", color: COLORS.textSoft },

  emptyCard: {
    marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, padding: 18, alignItems: "center",
    maxWidth: 1200, alignSelf: "center", width: "100%",
  },
  emptyIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.soft,
    alignItems: "center", justifyContent: "center", marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  emptyText: { color: COLORS.sub, marginBottom: 12, textAlign: "center" },
  emptyActions: { flexDirection: "row", gap: 10 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "#B91C1C", marginTop: 8 },

  fab: {
    position: "absolute",
    right: 18,
    // bottom is set dynamically with safe-area insets where used
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accent,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 4 },
    }),
  },
});
