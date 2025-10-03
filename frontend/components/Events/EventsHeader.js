import React from "react";
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  text: "#0F3A6B",
  sub: "#6B7280",
  border: "#EAF0F6",
  accent: "#0F70F0",
};

export default function EventsHeader({ search, onChangeSearch, onOpenFilters, dateWindow, setDateWindow }) {
  return (
    <View style={styles.header}>
      <Text style={styles.h1}>Events</Text>

      <View style={styles.searchRow}>
        <Ionicons name={Platform.OS === "ios" ? "search" : "search-outline"} size={18} color={COLORS.sub} />
        <TextInput
          value={search}
          onChangeText={onChangeSearch}
          placeholder="Search events, cities, categories…"
          placeholderTextColor="#8CA0B3"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={onOpenFilters} style={styles.filterBtn} activeOpacity={0.9}>
          <Ionicons name="options-outline" size={18} color="#fff" />
          <Text style={styles.filterTxt}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickRow}>
        <QuickPill label="This Week" active={dateWindow === "week"} onPress={() => setDateWindow("week")} />
        <QuickPill label="30 Days" active={dateWindow === "30d"} onPress={() => setDateWindow("30d")} />
        <QuickPill label="60 Days" active={dateWindow === "60d"} onPress={() => setDateWindow("60d")} />
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
    paddingTop: Platform.OS === "web" ? 92 : 16,
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
