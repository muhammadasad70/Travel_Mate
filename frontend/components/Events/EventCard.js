// import React from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const COLORS = {
//   card: "#FFFFFF",
//   border: "#EAF0F6",
//   soft: "#F1F5FE",
//   text: "#0F172A",
//   sub: "#6B7280",
//   accent: "#0c2444ff",
// };

// const fmtDate = (iso) => {
//   if (!iso) return "";
//   try {
//     const d = new Date(iso);
//     return d.toLocaleString(undefined, {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch { return ""; }
// };

// export default function EventCard({ item, onPress, onAddToItinerary }) {
//   return (
//     <TouchableOpacity onPress={onPress} activeOpacity={0.93} style={styles.card}>
//       {item.image ? (
//         <Image source={{ uri: item.image }} style={styles.cover} />
//       ) : (
//         <View style={[styles.cover, { backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center" }]}>
//           <Ionicons name="image-outline" size={26} color={COLORS.sub} />
//         </View>
//       )}

//       <View style={{ padding: 10 }}>
//         <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
//         <Text numberOfLines={1} style={styles.metaTxt}>
//           {fmtDate(item.start)}{item.city ? `  •  ${item.city}` : ""}
//         </Text>
//         {!!item.price && <Text style={[styles.metaTxt, { fontWeight: "800" }]} numberOfLines={1}>{item.price}</Text>}

//         <View style={styles.inlineRow}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeTxt}>{item.category || "General"}</Text>
//           </View>
//           <TouchableOpacity onPress={onAddToItinerary} style={styles.smallAdd} activeOpacity={0.9}>
//             <Ionicons name="add" size={14} color="#fff" />
//             <Text style={styles.smallAddTxt}>Itinerary</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     flex: 1,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     overflow: "hidden",
//   },
//   cover: { width: "100%", height: 150 },

//   title: { fontWeight: "800", color: COLORS.text },
//   metaTxt: { color: COLORS.sub, fontSize: 12, marginTop: 4 },

//   inlineRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
//   badge: {
//     paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
//     backgroundColor: "#F3F6FA", borderWidth: 1, borderColor: COLORS.border,
//   },
//   badgeTxt: { color: "#0F3A6B", fontWeight: "700", fontSize: 11 },

//   smallAdd: {
//     flexDirection: "row", alignItems: "center", gap: 6,
//     backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
//   },
//   smallAddTxt: { color: "#fff", fontWeight: "800", fontSize: 11 },
// });


// import React from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const COLORS = {
//   card: "#FFFFFF",
//   border: "#EAF0F6",
//   soft: "#F1F5FE",
//   text: "#0F172A",
//   sub: "#6B7280",
//   accent: "#0c2444ff",
// };

// const fmtDate = (iso) => {
//   if (!iso) return "";
//   try {
//     const d = new Date(iso);
//     return d.toLocaleString(undefined, {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return "";
//   }
// };

// export default function EventCard({ item = {}, onPress, onAddToItinerary }) {
//   // tolerate alternative API keys just in case
//   const image = item.image || item.image_url;
//   const start = item.start || item.start_time;

//   const dateText = fmtDate(start);
//   const cityText = item.city ? `  •  ${item.city}` : "";
//   const subtitle = (dateText || "") + (dateText ? cityText : (item.city ? item.city : ""));

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.93}
//       style={styles.card}
//       accessibilityRole="button"
//       accessibilityLabel={item.title || "Event"}
//       hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
//     >
//       {image ? (
//         <Image source={{ uri: image }} style={styles.cover} />
//       ) : (
//         <View style={[styles.cover, styles.coverFallback]}>
//           <Ionicons name="image-outline" size={26} color={COLORS.sub} />
//         </View>
//       )}

//       <View style={{ padding: 10 }}>
//         <Text numberOfLines={2} style={styles.title}>{item.title || "Untitled event"}</Text>

//         {!!subtitle && (
//           <Text numberOfLines={1} style={styles.metaTxt}>{subtitle}</Text>
//         )}

//         {!!item.price && (
//           <Text numberOfLines={1} style={[styles.metaTxt, { fontWeight: "800" }]}>
//             {item.price}
//           </Text>
//         )}

//         <View style={styles.inlineRow}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeTxt}>{item.category || "General"}</Text>
//           </View>

//           <TouchableOpacity
//             onPress={() => onAddToItinerary && onAddToItinerary(item)}
//             style={styles.smallAdd}
//             activeOpacity={0.9}
//             accessibilityRole="button"
//             accessibilityLabel="Add to itinerary"
//             hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
//           >
//             <Ionicons name="add" size={14} color="#fff" />
//             <Text style={styles.smallAddTxt}>Itinerary</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     flex: 1,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     overflow: "hidden",
//   },
//   cover: { width: "100%", height: 150 },
//   coverFallback: { backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center" },

//   title: { fontWeight: "800", color: COLORS.text },
//   metaTxt: { color: COLORS.sub, fontSize: 12, marginTop: 4 },

//   inlineRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   badgeTxt: { color: "#0F3A6B", fontWeight: "700", fontSize: 11 },

//   smallAdd: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: COLORS.accent,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 10,
//   },
//   smallAddTxt: { color: "#fff", fontWeight: "800", fontSize: 11 },
// });


import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  card: "#FFFFFF",
  border: "#EAF0F6",
  soft: "#F1F5FE",
  text: "#0F172A",
  sub: "#6B7280",
  accent: "#0c2444ff",
};

const fmtDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export default function EventCard({ item = {}, onPress, onAddToItinerary }) {
  // tolerate alternative API keys just in case
  const image = item.image || item.image_url;
  const start = item.start || item.start_time;

  // if image fails to load, show the fallback block instead of a white void
  const [imgOk, setImgOk] = React.useState(!!image);

  const dateText = fmtDate(start);
  const cityText = item.city ? `  •  ${item.city}` : "";
  const subtitle = (dateText || "") + (dateText ? cityText : (item.city ? item.city : ""));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.93}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={item.title || "Event"}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {image && imgOk ? (
        <Image
          source={{ uri: image }}
          style={styles.cover}
          resizeMode="cover"
          onError={() => setImgOk(false)}
        />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Ionicons name="image-outline" size={26} color={COLORS.sub} />
        </View>
      )}

      <View style={{ padding: 10 }}>
        <Text numberOfLines={2} style={styles.title}>{item.title || "Untitled event"}</Text>

        {!!subtitle && (
          <Text numberOfLines={1} style={styles.metaTxt}>{subtitle}</Text>
        )}

        {!!item.price && (
          <Text numberOfLines={1} style={[styles.metaTxt, { fontWeight: "800" }]}>
            {item.price}
          </Text>
        )}

        <View style={styles.inlineRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{item.category || "General"}</Text>
          </View>

          <TouchableOpacity
            onPress={() => onAddToItinerary && onAddToItinerary(item)}
            style={styles.smallAdd}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Add to itinerary"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="add" size={14} color="#fff" />
            <Text style={styles.smallAddTxt}>Itinerary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  cover: { width: "100%", height: 150 },
  coverFallback: { backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center" },

  title: { fontWeight: "800", color: COLORS.text },
  metaTxt: { color: COLORS.sub, fontSize: 12, marginTop: 4 },

  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F6FA",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeTxt: { color: "#0F3A6B", fontWeight: "700", fontSize: 11 },

  smallAdd: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  smallAddTxt: { color: "#fff", fontWeight: "800", fontSize: 11 },
});
