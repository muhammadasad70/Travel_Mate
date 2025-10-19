
// components/ServicesHub.jsx
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
  text: "#0F172A",
  subtext: "#64748B",
  primary: "#102e41ff",
  border: "#E9EDF2",
  pillBg: "#EEF3F9",
};

export default function ServicesHub() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isNarrow = width < 720;

  const openBrowse = (params) => {
    const state = navigation.getState?.();
    const names = state?.routeNames || state?.routes?.map(r => r.name) || [];
    if (names.includes("CulturalServicesExplorerScreen")) {
      navigation.navigate("CulturalServicesExplorerScreen", params);
      return;
    }
    navigation.navigate("ServicesBrowse", params);
  };

  const openBookings = () => navigation.navigate("MyBookings");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.h1} accessibilityRole="header">Services Hub</Text>
      <Text style={styles.lead}>
        Plan travel services — browse the catalog or manage your bookings.
      </Text>

      {/* Two primary cards */}
      <View style={[styles.grid, isNarrow && { flexDirection: "column" }]}>
        <ActionCard
          title="Discover services"
          subtitle="Browse experiences, guides, transport and more."
          icon="search-outline"
          cta="Explore"
          onPress={() => openBrowse()}
        />

        <ActionCard
          title="My bookings & requests"
          subtitle="Upcoming bookings, pending approvals, and history."
          icon="calendar-outline"
          cta="View bookings"
          onPress={openBookings}
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
    padding: 16, // same as ItinerariesHub
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
});
