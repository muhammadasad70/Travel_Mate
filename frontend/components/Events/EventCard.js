
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

// export default function EventCard({ item = {}, onPress }) {
//   // tolerate alternative API keys just in case
//   const image = item.image || item.image_url;
//   const start = item.start || item.start_time;

//   // if image fails to load, show the fallback block instead of a white void
//   const [imgOk, setImgOk] = React.useState(!!image);

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
//       {image && imgOk ? (
//         <Image
//           source={{ uri: image }}
//           style={styles.cover}
//           resizeMode="cover"
//           onError={() => setImgOk(false)}
//         />
//       ) : (
//         <View style={[styles.cover, styles.coverFallback]}>
//           <Ionicons name="calendar" size={32} color={COLORS.sub} />
//         </View>
//       )}

//       <View style={{ padding: 12 }}>
//         <Text numberOfLines={2} style={styles.title}>
//           {item.title || "Untitled event"}
//         </Text>

//         {!!subtitle && (
//           <Text numberOfLines={1} style={styles.metaTxt}>
//             {subtitle}
//           </Text>
//         )}

//         {!!item.venue_name && (
//           <Text numberOfLines={1} style={styles.venueTxt}>
//             📍 {item.venue_name}
//           </Text>
//         )}

//         {!!item.price && (
//           <Text numberOfLines={1} style={[styles.metaTxt, { fontWeight: "800", marginTop: 4 }]}>
//             💰 {item.price}
//           </Text>
//         )}

//         <View style={styles.inlineRow}>
//           {item.category && (
//             <View style={styles.badge}>
//               <Text style={styles.badgeTxt}>{item.category}</Text>
//             </View>
//           )}
          
//           <View style={styles.viewDetailsBtn}>
//             <Text style={styles.viewDetailsTxt}>View Details</Text>
//             <Ionicons name="chevron-forward" size={14} color={COLORS.accent} />
//           </View>
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
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cover: { width: "100%", height: 160 },
//   coverFallback: { 
//     backgroundColor: COLORS.soft, 
//     alignItems: "center", 
//     justifyContent: "center" 
//   },

//   title: { 
//     fontWeight: "800", 
//     color: COLORS.text,
//     fontSize: 15,
//     lineHeight: 20,
//   },
//   metaTxt: { 
//     color: COLORS.sub, 
//     fontSize: 12, 
//     marginTop: 4 
//   },
//   venueTxt: {
//     color: COLORS.sub,
//     fontSize: 12,
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   inlineRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 999,
//     backgroundColor: "#F3F6FA",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   badgeTxt: { 
//     color: "#0F3A6B", 
//     fontWeight: "700", 
//     fontSize: 11 
//   },

//   viewDetailsBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   viewDetailsTxt: {
//     color: COLORS.accent,
//     fontWeight: "700",
//     fontSize: 12,
//   },
// });




import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
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

export default function EventCard({ 
  item = {}, 
  onPress,
  // ✅ Offline props
  isSavedOffline,
  isDownloading,
  onDownloadOffline,
  onRemoveOffline,
}) {
  const image = item.image || item.image_url;
  const start = item.start || item.start_time;
  const [imgOk, setImgOk] = React.useState(!!image);

  const dateText = fmtDate(start);
  const cityText = item.city ? `  •  ${item.city}` : "";
  const subtitle = (dateText || "") + (dateText ? cityText : (item.city ? item.city : ""));

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.93}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={item.title || "Event"}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        {image && imgOk ? (
          <View>
            <Image
              source={{ uri: image }}
              style={styles.cover}
              resizeMode="cover"
              onError={() => setImgOk(false)}
            />
            {isSavedOffline && (
              <View style={styles.offlineBadge}>
                <Ionicons name="cloud-done" size={12} color="#fff" />
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.cover, styles.coverFallback]}>
            <Ionicons name="calendar" size={32} color={COLORS.sub} />
          </View>
        )}

        <View style={{ padding: 12 }}>
          <Text numberOfLines={2} style={styles.title}>
            {item.title || "Untitled event"}
          </Text>

          {!!subtitle && (
            <Text numberOfLines={1} style={styles.metaTxt}>
              {subtitle}
            </Text>
          )}

          {!!item.venue_name && (
            <Text numberOfLines={1} style={styles.venueTxt}>
              📍 {item.venue_name}
            </Text>
          )}

          {!!item.price && (
            <Text numberOfLines={1} style={[styles.metaTxt, { fontWeight: "800", marginTop: 4 }]}>
              💰 {item.price}
            </Text>
          )}

          <View style={styles.inlineRow}>
            {item.category && (
              <View style={styles.badge}>
                <Text style={styles.badgeTxt}>{item.category}</Text>
              </View>
            )}
            
            <View style={styles.viewDetailsBtn}>
              <Text style={styles.viewDetailsTxt}>View Details</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.accent} />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* ✅ Offline action bar */}
      {onDownloadOffline && (
        <View style={styles.actionBar}>
          {!isSavedOffline ? (
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={onDownloadOffline}
              disabled={isDownloading}
              activeOpacity={0.9}
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="cloud-download-outline" size={16} color="#fff" />
                  <Text style={styles.downloadText}>Download</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.savedBtn} 
              onPress={onRemoveOffline}
              activeOpacity={0.9}
            >
              <Ionicons name="cloud-done" size={16} color="#10B981" />
              <Text style={styles.savedText}>Offline</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cover: { width: "100%", height: 160 },
  coverFallback: { 
    backgroundColor: COLORS.soft, 
    alignItems: "center", 
    justifyContent: "center" 
  },

  title: { 
    fontWeight: "800", 
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
  },
  metaTxt: { 
    color: COLORS.sub, 
    fontSize: 12, 
    marginTop: 4 
  },
  venueTxt: {
    color: COLORS.sub,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },

  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F6FA",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeTxt: { 
    color: "#0F3A6B", 
    fontWeight: "700", 
    fontSize: 11 
  },

  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewDetailsTxt: {
    color: COLORS.accent,
    fontWeight: "700",
    fontSize: 12,
  },
  
  // ✅ Offline styles
  offlineBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  actionBar: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 10,
  },
  downloadText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  savedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingVertical: 10,
  },
  savedText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
});