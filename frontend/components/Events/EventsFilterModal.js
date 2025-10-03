import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  text: "#0F3A6B",
  sub: "#6B7280",
  border: "#EAF0F6",
  pillBg: "#ECF3FF",
  pillBorder: "#DCE7FF",
};

export default function EventsFilterModal({
  visible,
  onClose,
  locations,
  categories,
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.chipsRow}>
            {locations.map((x) => (
              <Chip key={x} label={x} active={selectedLoc === x} onPress={() => setSelectedLoc(x)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipsRow}>
            {categories.map((x) => (
              <Chip key={x} label={x} active={selectedCat === x} onPress={() => setSelectedCat(x)} />
            ))}
          </View>
        </View>

        <View style={{ height: 10 }} />
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
    maxHeight: "75%",
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
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sheetTitle: { flex: 1, textAlign: "center", fontWeight: "800", color: COLORS.text },

  section: { paddingHorizontal: 14, paddingTop: 12 },
  sectionTitle: { fontWeight: "800", color: COLORS.text, marginBottom: 8 },
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
});
