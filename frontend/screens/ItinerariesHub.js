import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import CrowdsourceItineraries from "./CrowdsourceItineraries/CrowdsourceItinerariesScreen";

const TABS = [
  { key: "custom",    label: "Custom",          icon: Platform.OS === "ios" ? "create-outline"   : "pencil" },
  { key: "community", label: "Community-Based", icon: "people-outline" },
  { key: "ai",        label: "AI-Suggested",    icon: Platform.OS === "ios" ? "sparkles-outline" : "bulb-outline" },
];

export default function ItinerariesHub() {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();

  const isCompact = width < 420;

  const initialTab = (route?.params?.tab || "custom").toLowerCase();
  const [active, setActive] = useState(
    ["custom", "community", "ai"].includes(initialTab) ? initialTab : "custom"
  );

  useEffect(() => {
    navigation.setParams?.({ tab: active });
  }, [active]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.h1} accessibilityRole="header">Itineraries Hub</Text>
      <Text style={styles.lead}>
        Plan your trip your way — create custom plans, browse the community, or let AI suggest one.
      </Text>

      {/* Tabs */}
      <View
        style={[styles.tabs, isCompact && { justifyContent: "space-between" }]}
        {...(Platform.OS === "web" ? { accessibilityRole: "tablist" } : {})}
      >
        {TABS.map(({ key, label, icon }) => {
          const selected = active === key;
          return (
            <Pressable
              key={key}
              onPress={() => setActive(key)}
              accessibilityState={{ selected }}
              accessibilityRole={Platform.OS === "web" ? "tab" : "button"}
              style={({ hovered, pressed }) => [
                styles.tab,
                selected && styles.tabActive,
                hovered && Platform.OS === "web" && !selected ? { backgroundColor: "#F2F6FB" } : null,
                pressed && { opacity: 0.92 },
              ]}
            >
              <Ionicons
                name={icon}
                size={16}
                color={selected ? "#FFFFFF" : COLORS.text}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.tabText, selected && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      <View
        style={styles.panel}
        {...(Platform.OS === "web" ? { accessibilityRole: "region" } : {})}
        accessibilityLabel={`${labelFor(active)} content`}
      >
        {active === "custom" && (
          <CrowdsourceItineraries embedded onDone={(id)=>{/* navigation.navigate('ItineraryDetails',{id}) */}} />
        )}

        {active === "community" && (
          <CommunityPanel onOpenItem={(id)=>navigation.navigate("ItineraryDetails",{ id })} />
        )}

        {active === "ai" && (
          <AIPanel onAcceptSuggestion={(id)=>navigation.navigate("ItineraryPreview",{ id })} />
        )}
      </View>
    </ScrollView>
  );
}

/* ---- panels (stubs) ---- */
function CommunityPanel({ onOpenItem }) {
  return (
    <View>
      <Text style={styles.panelTitle}>Explore community itineraries</Text>
      <Text style={styles.panelText}>
        Filter by location, duration, budget & popularity. Read reviews before you pick.
      </Text>
      <Pressable onPress={() => onOpenItem?.("demo-id")} style={styles.btnGhost}>
        <Text style={styles.btnGhostText}>Open Explorer</Text>
      </Pressable>
    </View>
  );
}

function AIPanel({ onAcceptSuggestion }) {
  return (
    <View>
      <Text style={styles.panelTitle}>AI-Suggested itineraries</Text>
      <Text style={styles.panelText}>
        Personalized picks based on your preferences and history.
      </Text>
      <Pressable onPress={() => onAcceptSuggestion?.("ai-1")} style={styles.btnGhost}>
        <Text style={styles.btnGhostText}>Get Suggestions</Text>
      </Pressable>
    </View>
  );
}

/* ---- helpers & styles ---- */
function labelFor(key) {
  if (key === "custom") return "Custom";
  if (key === "community") return "Community-Based";
  return "AI-Suggested";
}

const COLORS = {
  bg: "#F7F9FC",
  card: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  primary: "#102e41ff",
  border: "#E9EDF2",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 18, maxWidth: 1200, alignSelf: "center" },

  h1: { fontSize: 28, fontWeight: "700", color: COLORS.text, letterSpacing: 0.2 },
  lead: { marginTop: 6, fontSize: 15, color: COLORS.subtext, lineHeight: 22, marginBottom: 10 },

  tabs: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  tabTextActive: { color: "#FFFFFF" },

  panel: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border },
  panelTitle: { fontSize: 18, fontWeight: "800", marginBottom: 6, color: COLORS.text },
  panelText: { fontSize: 14, color: "#475569", marginBottom: 14 },

  btnGhost: { backgroundColor: "#EEF3F9", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignSelf: "flex-start" },
  btnGhostText: { color: COLORS.text, fontWeight: "700" },
});
