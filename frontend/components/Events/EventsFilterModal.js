

import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  text: "#0F3A6B",
  sub: "#6B7280",
  border: "#EAF0F6",
  pillBg: "#ECF3FF",
  pillBorder: "#DCE7FF",
};

// ✅ Updated: Only cities that have events in your database
const CITIES_WITH_EVENTS = [
  "All",
  "Islamabad",
  "Karachi", 
  "Lahore",
  "Hunza Valley",
  "Skardu",
  "Murree",
  "Swat Valley",
];

const CATEGORIES = [
  "All",
  "Sports",
  "Music",
  "Food",
  "Cultural",
  "Festival",
  "Fashion",
  "Holiday",
];

export default function EventsFilterModal({
  visible,
  onClose,
  selectedLoc,
  setSelectedLoc,
  selectedCat,
  setSelectedCat,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionSubtitle}>Cities with available events</Text>
            <View style={styles.chipsRow}>
              {CITIES_WITH_EVENTS.map((city) => (
                <Chip 
                  key={city} 
                  label={city} 
                  active={selectedLoc === city} 
                  onPress={() => setSelectedLoc(city)} 
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.chipsRow}>
              {CATEGORIES.map((cat) => (
                <Chip 
                  key={cat} 
                  label={cat} 
                  active={selectedCat === cat} 
                  onPress={() => setSelectedCat(cat)} 
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.resetBtn}
              onPress={() => {
                setSelectedLoc("All");
                setSelectedCat("All");
              }}
            >
              <Ionicons name="refresh-outline" size={18} color="#fff" />
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]} activeOpacity={0.9}>
      <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 10,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sheetTitle: { 
    flex: 1, 
    textAlign: "center", 
    fontWeight: "800", 
    fontSize: 16,
    color: COLORS.text 
  },

  section: { paddingHorizontal: 14, paddingTop: 16 },
  sectionTitle: { fontWeight: "800", color: COLORS.text, marginBottom: 4, fontSize: 14 },
  sectionSubtitle: { fontSize: 12, color: COLORS.sub, marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.pillBorder,
    backgroundColor: COLORS.pillBg,
  },
  chipActive: { backgroundColor: "#E0F2FF", borderColor: "#9AD0FF" },
  chipTxt: { color: COLORS.text, fontWeight: "700", fontSize: 12 },
  chipTxtActive: { color: "#0F70F0" },

  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0F70F0",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  resetBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
});