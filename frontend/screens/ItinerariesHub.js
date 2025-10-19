
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   ScrollView,
//   useWindowDimensions,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import CrowdsourceItineraries from "./CrowdsourceItineraries/CrowdsourceItinerariesScreen";

// const TABS = [
//   { key: "custom",    label: "Custom",          icon: Platform.OS === "ios" ? "create-outline"   : "pencil" },
//   { key: "community", label: "Community-Based", icon: "people-outline" },
//   { key: "ai",        label: "AI-Suggested",    icon: Platform.OS === "ios" ? "sparkles-outline" : "bulb-outline" },
// ];

// export default function ItinerariesHub({ mode = "hub", onOpenCreate, onBackToHub }) {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { width } = useWindowDimensions();
//   const isCompact = width < 420;

//   const initialTab = (route?.params?.tab || "custom").toLowerCase();
//   const [active, setActive] = useState(
//     ["custom", "community", "ai"].includes(initialTab) ? initialTab : "custom"
//   );

//   useEffect(() => {
//     navigation.setParams?.({ tab: active });
//   }, [active, navigation]);

//   return (
//     <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
//       <Text style={styles.h1} accessibilityRole="header">Itineraries Hub</Text>
//       <Text style={styles.lead}>
//         Plan your trip your way — create custom plans, browse the community, or let AI suggest one.
//       </Text>

//       {mode === "create" ? (
//         <View style={styles.panel}>
//           {/* Back to Hub button (inside dashboard, not using history) */}
//           <Pressable
//             onPress={onBackToHub}
//             style={[styles.tab, { alignSelf: "flex-start", marginBottom: 12 }]}
//             accessibilityLabel="Back to Itineraries"
//           >
//             <Ionicons name="arrow-back" size={16} color={COLORS.text} style={{ marginRight: 6 }} />
//             <Text style={styles.tabText}>Back to Itineraries</Text>
//           </Pressable>

//           {/* Render the create form here */}
//           <CrowdsourceItineraries embedded onBack={onBackToHub} />
//         </View>
//       ) : (
//         <>
//           {/* Tabs */}
//           <View
//             style={[styles.tabs, isCompact && { justifyContent: "space-between" }]}
//             {...(Platform.OS === "web" ? { accessibilityRole: "tablist" } : {})}
//           >
//             {TABS.map(({ key, label, icon }) => {
//               const selected = active === key;
//               return (
//                 <Pressable
//                   key={key}
//                   onPress={() => setActive(key)}
//                   accessibilityState={{ selected }}
//                   accessibilityRole={Platform.OS === "web" ? "tab" : "button"}
//                   style={({ hovered, pressed }) => [
//                     styles.tab,
//                     selected && styles.tabActive,
//                     hovered && Platform.OS === "web" && !selected ? { backgroundColor: "#F2F6FB" } : null,
//                     pressed && { opacity: 0.92 },
//                   ]}
//                 >
//                   <Ionicons
//                     name={icon}
//                     size={16}
//                     color={selected ? "#FFFFFF" : COLORS.text}
//                     style={{ marginRight: 6 }}
//                   />
//                   <Text style={[styles.tabText, selected && styles.tabTextActive]}>{label}</Text>
//                 </Pressable>
//               );
//             })}
//           </View>

//           {/* Content */}
//           <View
//             style={styles.panel}
//             {...(Platform.OS === "web" ? { accessibilityRole: "region" } : {})}
//             accessibilityLabel={`${labelFor(active)} content`}
//           >
//             {active === "custom" && (
//               <>
//                 <Text style={styles.panelTitle}>Custom planner</Text>
//                 <Text style={styles.panelText}>
//                   Start a fresh itinerary tailored to your dates, budget and style.
//                 </Text>
//                 <Pressable
//                   onPress={onOpenCreate}
//                   style={styles.btnGhost}
//                   accessibilityLabel="Open Create Itinerary"
//                 >
//                   <Text style={styles.btnGhostText}>Create Itinerary</Text>
//                 </Pressable>
//               </>
//             )}

//             {active === "community" && (
//               <CommunityPanel onOpenItem={(id)=>navigation.navigate("ItineraryDetails",{ id })} />
//             )}

//             {active === "ai" && (
//               <AIPanel onAcceptSuggestion={(id)=>navigation.navigate("ItineraryPreview",{ id })} />
//             )}
//           </View>
//         </>
//       )}
//     </ScrollView>
//   );
// }

// /* ---- panels (stubs) ---- */
// function CommunityPanel({ onOpenItem }) {
//   return (
//     <View>
//       <Text style={styles.panelTitle}>Explore community itineraries</Text>
//       <Text style={styles.panelText}>
//         Filter by location, duration, budget & popularity. Read reviews before you pick.
//       </Text>
//       <Pressable onPress={() => onOpenItem?.("demo-id")} style={styles.btnGhost}>
//         <Text style={styles.btnGhostText}>Open Explorer</Text>
//       </Pressable>
//     </View>
//   );
// }

// function AIPanel({ onAcceptSuggestion }) {
//   return (
//     <View>
//       <Text style={styles.panelTitle}>AI-Suggested itineraries</Text>
//       <Text style={styles.panelText}>
//         Personalized picks based on your preferences and history.
//       </Text>
//       <Pressable onPress={() => onAcceptSuggestion?.("ai-1")} style={styles.btnGhost}>
//         <Text style={styles.btnGhostText}>Get Suggestions</Text>
//       </Pressable>
//     </View>
//   );
// }

// /* ---- helpers & styles ---- */
// function labelFor(key) {
//   if (key === "custom") return "Custom";
//   if (key === "community") return "Community-Based";
//   return "AI-Suggested";
// }

// const COLORS = {
//   bg: "#F7F9FC",
//   card: "#FFFFFF",
//   text: "#0F172A",
//   subtext: "#64748B",
//   primary: "#102e41ff",
//   border: "#E9EDF2",
// };

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: COLORS.bg },
//   container: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 18, maxWidth: 1200, alignSelf: "center" },

//   h1: { fontSize: 28, fontWeight: "700", color: COLORS.text, letterSpacing: 0.2 },
//   lead: { marginTop: 6, fontSize: 15, color: COLORS.subtext, lineHeight: 22, marginBottom: 10 },

//   tabs: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
//   tab: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   tabText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
//   tabTextActive: { color: "#FFFFFF" },

//   panel: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border },
//   panelTitle: { fontSize: 18, fontWeight: "800", marginBottom: 6, color: COLORS.text },
//   panelText: { fontSize: 14, color: "#475569", marginBottom: 14 },

//   btnGhost: { backgroundColor: "#EEF3F9", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignSelf: "flex-start" },
//   btnGhostText: { color: COLORS.text, fontWeight: "700" },
// });





// components/ItinerariesHub.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  bg: "#F7F9FC",
  card: "#FFFFFF",
  text: "#011d39ff",
  subtext: "#64748B",
  primary: "#012649ff",
  border: "#E9EDF2",
  pillBg: "#EEF3F9",
};

export default function ItinerariesHub() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isNarrow = width < 720;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.h1} accessibilityRole="header">Itineraries Hub</Text>
      <Text style={styles.lead}>
        Plan your trip your way — build your own itinerary or get smart recommendations.
      </Text>

      {/* Two primary cards */}
      <View style={[styles.grid, isNarrow && { flexDirection: "column" }]}>
        <ActionCard
          title="Build your own"
          subtitle="Start from scratch. Set dates, city, budget and add your day-by-day plan."
          icon={Platform.OS === "ios" ? "create-outline" : "pencil"}
          cta="Start building"
          onPress={() => navigation.navigate("CrowdsourceItineraries")}
        />

        <ActionCard
          title="Recommended for you"
          subtitle="Personalized picks based on your interests, history and what’s trending."
          icon={Platform.OS === "ios" ? "sparkles-outline" : "bulb-outline"}
          cta="Open recommendations"
          onPress={() => navigation.navigate("CommunityExplorer", { mode: "for_you" })}
        />
      </View>
    </ScrollView>
  );
}

/* ---- small components ---- */
function ActionCard({ title, subtitle, icon, cta, onPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color="#fff" />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <Text style={styles.cardSub}>{subtitle}</Text>

      <Pressable onPress={onPress} style={styles.primaryBtn} accessibilityRole="button">
        <Text style={styles.primaryBtnText}>{cta}</Text>
        <Ionicons
          name={Platform.OS === "ios" ? "chevron-forward" : "arrow-forward"}
          size={16}
          color="#fff"
          style={{ marginLeft: 6 }}
        />
      </Pressable>
    </View>
  );
}

function QuickPill({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.pill} accessibilityRole="button">
      <Text style={styles.pillText}>{label}</Text>
    </Pressable>
  );
}

/* ---- styles ---- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 18,
    maxWidth: 1100,
    alignSelf: "center",
  },

  h1: { fontSize: 28, fontWeight: "800", color: COLORS.text, letterSpacing: 0.2 },
  lead: { marginTop: 6, fontSize: 15, color: COLORS.subtext, lineHeight: 22, marginBottom: 16 },

  grid: { flexDirection: "row", gap: 16 },

  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 10 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  cardSub: { color: COLORS.subtext, marginBottom: 12 },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },

  quickRow: { flexDirection: "row", gap: 8, marginTop: 16, flexWrap: "wrap" },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.pillBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillText: { color: COLORS.text, fontWeight: "700", fontSize: 12 },
});
