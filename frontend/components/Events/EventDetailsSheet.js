// import React from "react";
// import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity, Image, Linking } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#6B7280",
//   border: "#EAF0F6",
//   soft: "#F7FAFD",
//   accent: "#0c2444ff",
// };

// const fmtDate = (iso) => {
//   if (!iso) return "";
//   try {
//     const d = new Date(iso);
//     return d.toLocaleString(undefined, {
//       weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
//     });
//   } catch { return ""; }
// };

// function toICS(e) {
//   const dt = (s) =>
//     new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
//   return [
//     "BEGIN:VCALENDAR",
//     "VERSION:2.0",
//     "PRODID:-//TravelMate//Events//EN",
//     "BEGIN:VEVENT",
//     `UID:${(e.id || Date.now())}@travelmate`,
//     e.start ? `DTSTART:${dt(e.start)}` : null,
//     e.end ? `DTEND:${dt(e.end)}` : null,
//     e.title ? `SUMMARY:${e.title}` : null,
//     e.venue_name || e.venue_address
//       ? `LOCATION:${[e.venue_name, e.venue_address].filter(Boolean).join(", ")}`
//       : null,
//     e.url ? `URL:${e.url}` : null,
//     "END:VEVENT",
//     "END:VCALENDAR",
//   ].filter(Boolean).join("\r\n");
// }

// export default function EventDetailsSheet({ event, onClose, onAddToItinerary }) {
//   const visible = !!event;
//   return (
//     <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//       <Pressable style={styles.sheetBackdrop} onPress={onClose} />
//       <View style={[styles.sheet, { maxHeight: "82%" }]}>
//         {!!event && (
//           <>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>Event Details</Text>
//               <TouchableOpacity onPress={onClose}><Ionicons name="close" size={20} color={COLORS.text} /></TouchableOpacity>
//             </View>

//             { (event.image || event.image_url) ? (
//               <Image source={{ uri: event.image || event.image_url }} style={styles.heroImg} />
//             ) : (
//               <View style={[styles.heroImg, { backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center" }]}>
//                 <Ionicons name="image-outline" size={28} color={COLORS.sub} />
//               </View>
//             )}

//             <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
//               <Text style={styles.title}>{event.title}</Text>
//               <Text style={styles.metaTxt}>
//                 {fmtDate(event.start || event.start_time)}
//                 {event.city ? `  •  ${event.city}` : ""}
//               </Text>
//               {!!event.venue_name && (
//                 <Text style={styles.metaTxt}>{event.venue_name}{event.venue_address ? `, ${event.venue_address}` : ""}</Text>
//               )}
//               {!!event.price && <Text style={[styles.metaTxt, { fontWeight: "800" }]}>{event.price}</Text>}
//             </View>

//             <View style={styles.actionsRow}>
//               <PrimaryBtn
//                 icon="calendar-outline"
//                 label="Add to Calendar"
//                 onPress={async () => {
//                   try {
//                     const ics = toICS(event);
//                     // Web-friendly: Blob + object URL; on native you'll likely swap for a Share module later
//                     const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
//                     const url = URL.createObjectURL(blob);
//                     await Linking.openURL(url);
//                   } catch {}
//                 }}
//               />
//               <GhostBtn icon="open-outline" label="Open Link" onPress={() => event.url && Linking.openURL(event.url)} />
//             </View>

//             <View style={styles.actionsRow}>
//               <PrimaryBtn icon="add-circle-outline" label="Add to Itinerary" onPress={onAddToItinerary} />
//             </View>
//           </>
//         )}
//       </View>
//     </Modal>
//   );
// }

// function PrimaryBtn({ icon, label, onPress }) {
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.primaryBtn} activeOpacity={0.9}>
//       <Ionicons name={icon} size={18} color="#fff" />
//       <Text style={styles.primaryBtnTxt}>{label}</Text>
//     </TouchableOpacity>
//   );
// }
// function GhostBtn({ icon, label, onPress }) {
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.ghostBtn} activeOpacity={0.9}>
//       <Ionicons name={icon} size={18} color={COLORS.text} />
//       <Text style={styles.ghostBtnTxt}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
//   sheet: {
//     position: "absolute",
//     left: 0, right: 0, bottom: 0,
//     maxHeight: "75%",
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingBottom: 10,
//   },
//   sheetHeader: {
//     flexDirection: "row", alignItems: "center",
//     paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8,
//     borderBottomWidth: 1, borderColor: COLORS.border,
//   },
//   sheetTitle: { flex: 1, textAlign: "center", fontWeight: "800", color: COLORS.text },

//   heroImg: { width: "100%", height: 180 },

//   title: { fontWeight: "800", color: "#0F172A" },
//   metaTxt: { color: COLORS.sub, fontSize: 12, marginTop: 4 },

//   actionsRow: { marginTop: 12, paddingHorizontal: 14, flexDirection: "row", gap: 10 },
//   primaryBtn: {
//     flex: 1, flexDirection: "row", alignItems: "center", gap: 8,
//     backgroundColor: COLORS.accent, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12,
//   },
//   primaryBtnTxt: { color: "#fff", fontWeight: "800" },
//   ghostBtn: {
//     flexDirection: "row", alignItems: "center", gap: 8,
//     borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#fff",
//     paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12,
//   },
//   ghostBtnTxt: { color: COLORS.text, fontWeight: "800" },
// });


import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  text: "#0F3A6B",
  sub: "#6B7280",
  border: "#EAF0F6",
  soft: "#F7FAFD",
  accent: "#0c2444ff",
};

const fmtDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return ""; }
};

function toICS(e) {
  const dt = (s) =>
    new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TravelMate//Events//EN",
    "BEGIN:VEVENT",
    `UID:${(e.id || Date.now())}@travelmate`,
    e.start ? `DTSTART:${dt(e.start)}` : null,
    e.end ? `DTEND:${dt(e.end)}` : null,
    e.title ? `SUMMARY:${e.title}` : null,
    e.venue_name || e.venue_address
      ? `LOCATION:${[e.venue_name, e.venue_address].filter(Boolean).join(", ")}`
      : null,
    e.url ? `URL:${e.url}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}

export default function EventDetailsSheet({ event, onClose, onAddToItinerary }) {
  const visible = !!event;

  // robust hero image handling
  const hero = event?.image || event?.image_url;
  const [heroOk, setHeroOk] = React.useState(!!hero);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={[styles.sheet, { maxHeight: "82%" }]}>
        {!!event && (
          <>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Event Details</Text>
              <TouchableOpacity onPress={onClose}><Ionicons name="close" size={20} color={COLORS.text} /></TouchableOpacity>
            </View>

            {hero && heroOk ? (
              <Image
                source={{ uri: hero }}
                style={styles.heroImg}
                resizeMode="cover"
                onError={() => setHeroOk(false)}
              />
            ) : (
              <View style={[styles.heroImg, { backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center" }]}>
                <Ionicons name="image-outline" size={28} color={COLORS.sub} />
              </View>
            )}

            <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.metaTxt}>
                {fmtDate(event.start || event.start_time)}
                {event.city ? `  •  ${event.city}` : ""}
              </Text>
              {!!event.venue_name && (
                <Text style={styles.metaTxt}>{event.venue_name}{event.venue_address ? `, ${event.venue_address}` : ""}</Text>
              )}
              {!!event.price && <Text style={[styles.metaTxt, { fontWeight: "800" }]}>{event.price}</Text>}
            </View>

            <View style={styles.actionsRow}>
              <PrimaryBtn
                icon="calendar-outline"
                label="Add to Calendar"
                onPress={async () => {
                  try {
                    const ics = toICS(event);
                    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    await Linking.openURL(url);
                  } catch {}
                }}
              />
              <GhostBtn icon="open-outline" label="Open Link" onPress={() => event.url && Linking.openURL(event.url)} />
            </View>

            <View style={styles.actionsRow}>
              <PrimaryBtn icon="add-circle-outline" label="Add to Itinerary" onPress={onAddToItinerary} />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

function PrimaryBtn({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.primaryBtn} activeOpacity={0.9}>
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.primaryBtnTxt}>{label}</Text>
    </TouchableOpacity>
  );
}
function GhostBtn({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.ghostBtn} activeOpacity={0.9}>
      <Ionicons name={icon} size={18} color={COLORS.text} />
      <Text style={styles.ghostBtnTxt}>{label}</Text>
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
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8,
    borderBottomWidth: 1, borderColor: COLORS.border,
  },
  sheetTitle: { flex: 1, textAlign: "center", fontWeight: "800", color: COLORS.text },

  heroImg: { width: "100%", height: 180 },

  title: { fontWeight: "800", color: "#0F172A" },
  metaTxt: { color: COLORS.sub, fontSize: 12, marginTop: 4 },

  actionsRow: { marginTop: 12, paddingHorizontal: 14, flexDirection: "row", gap: 10 },
  primaryBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: COLORS.accent, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12,
  },
  primaryBtnTxt: { color: "#fff", fontWeight: "800" },
  ghostBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#fff",
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12,
  },
  ghostBtnTxt: { color: COLORS.text, fontWeight: "800" },
});
