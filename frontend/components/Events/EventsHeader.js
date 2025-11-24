

// components/Events/EventsHeader.js
import React from "react";
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  text: "#0F3A6B",
  sub: "#6B7280",
  border: "#EAF0F6",
  accent: "#0c2444ff",
};

export default function EventsHeader({
  search,
  onChangeSearch,
  onOpenFilters,
  dateWindow,
  setDateWindow,
  useLive,
  setUseLive,
  tight = true,
}) {
  const topPad = Platform.OS === "web" ? (tight ? 64 : 92) : (tight ? 8 : 16);

  return (
    <View style={[styles.header, { paddingTop: topPad }]}>
      <Text style={styles.h1}>Discover Events</Text>

      <View style={styles.searchRow}>
        <Ionicons name={Platform.OS === "ios" ? "search" : "search-outline"} size={18} color={COLORS.sub} />
        <TextInput
          value={search}
          onChangeText={onChangeSearch}
          placeholder="Search events..."
          placeholderTextColor="#8CA0B3"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={onOpenFilters} style={styles.filterBtn} activeOpacity={0.9}>
          <Ionicons name="options-outline" size={18} color="#fff" />
          <Text style={styles.filterTxt}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickRow}>
        {/* Source toggle */}
        <QuickPill 
          label="Curated" 
          active={!useLive} 
          onPress={() => setUseLive(false)} 
        />
        <QuickPill 
          label="Live API" 
          active={useLive} 
          onPress={() => setUseLive(true)} 
        />
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Date filters - adjusted for 2026 events */}
        <QuickPill 
          label="Upcoming" 
          active={dateWindow === "upcoming"} 
          onPress={() => setDateWindow("upcoming")} 
        />
        <QuickPill 
          label="2026" 
          active={dateWindow === "2026"} 
          onPress={() => setDateWindow("2026")} 
        />
        <QuickPill 
          label="All Time" 
          active={dateWindow === "all"} 
          onPress={() => setDateWindow("all")} 
        />
      </View>
    </View>
  );
}

function QuickPill({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.quickPill, active && styles.quickPillActive]} activeOpacity={0.9}>
      <Text style={[styles.quickPillTxt, active && styles.quickPillTxtActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 92,
    paddingBottom: 8,
    ...(Platform.OS === "web" ? { maxWidth: 1100, alignSelf: "center", width: "100%" } : {}),
  },
  h1: { fontSize: 22, fontWeight: "800", color: COLORS.text, marginBottom: 10 },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
  },
  searchInput: { flex: 1, color: COLORS.text },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  filterTxt: { color: "#fff", fontWeight: "800" },

  quickRow: { 
    marginTop: 8, 
    flexDirection: "row", 
    gap: 8,
    flexWrap: "wrap",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  quickPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DCE7FF",
    backgroundColor: "#ECF3FF",
  },
  quickPillActive: { backgroundColor: "#E0F2FF", borderColor: "#9AD0FF" },
  quickPillTxt: { color: COLORS.text, fontWeight: "700", fontSize: 12 },
  quickPillTxtActive: { color: COLORS.accent },
});