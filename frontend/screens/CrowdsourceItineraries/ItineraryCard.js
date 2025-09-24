ItineraryCard.js
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BORDER = "#E6EDF7";
const PRIMARY = "#003366";
const SUBTEXT = "#6B7280";

function formatRange(start, end) {
  if (!start || !end) return "Dates TBD";
  try {
    const s = new Date(start);
    const e = new Date(end);
    const sameYear = s.getFullYear() === e.getFullYear();
    const fmt = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...(sameYear ? {} : { year: "numeric" }),
    });
    const fmtEnd = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${fmt.format(s)} – ${fmtEnd.format(e)}`;
  } catch {
    return "Dates TBD";
  }
}

export default function ItineraryCard({ item, onPress }) {
  const {
    title,
    city,
    start_date,
    end_date,
    budget,
    style,
    cover_url,
    days = [],
  } = item || {};

  // if we try to load an image and it errors, show the empty state
  const [imgError, setImgError] = useState(false);
  const showImage = !!cover_url && !imgError;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.coverWrap}>

        {showImage ? (
          <Image
            source={{ uri: cover_url }}
            style={styles.cover}
            onError={() => setImgError(true)}
            accessible
            accessibilityLabel="Itinerary cover image"
          />
        ) : (
          // Empty space reserved for future cover image from URL
          <View style={styles.coverEmpty} />
        )}

        <View style={styles.badgeRow}>
          {style ? (
            <View style={[styles.badge, styles.badgeDark]}>
              <Ionicons name="sparkles-outline" size={12} color="#fff" />
              <Text style={[styles.badgeText, { color: "#fff" }]}>{style}</Text>
            </View>
          ) : null}
          {budget ? (
            <View style={[styles.badge, styles.badgeLight]}>
              <Ionicons name="pricetag-outline" size={12} color={PRIMARY} />
              <Text style={[styles.badgeText, { color: PRIMARY }]}>{budget}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title || "Untitled Itinerary"}
        </Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color={SUBTEXT} />
          <Text style={styles.sub} numberOfLines={1}>
            {city || "—"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={14} color={SUBTEXT} />
          <Text style={styles.sub}>{formatRange(start_date, end_date)}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Ionicons name="time-outline" size={14} color={PRIMARY} />
            <Text style={styles.metaText}>
              {Array.isArray(days) && days.length ? `${days.length} day(s)` : "No days yet"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER,
    ...Platform.select({
      web: { boxShadow: "0 6px 16px rgba(0,0,0,0.06)" },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      },
    }),
  },

  /* Cover area */
  coverWrap: { width: "100%", height: 160, backgroundColor: "#eef2f7" },
  cover: { width: "100%", height: "100%", resizeMode: "cover" },
  // Empty space for when there is no image yet
  coverEmpty: { flex: 1, backgroundColor: "#f8fafc" },

  /* Badges on cover */
  badgeRow: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeDark: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  badgeLight: { backgroundColor: "#fff", borderColor: BORDER },
  badgeText: { fontSize: 12, fontWeight: "700" },

  /* Body */
  body: { padding: 12, gap: 6 },
  title: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  sub: { color: SUBTEXT, fontSize: 13 },

  /* Meta */
  metaRow: { marginTop: 6, flexDirection: "row", gap: 8 },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  metaText: { color: PRIMARY, fontWeight: "700", fontSize: 12 },
});
