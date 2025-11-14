

// // screens/CulturalExchange/CulturalServiceCard.js
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const Badge = ({ text }) => (
//   <View style={styles.badge}>
//     <Text style={styles.badgeTxt}>{text}</Text>
//   </View>
// );

// const Stat = ({ icon, text }) => (
//   <View style={styles.stat}>
//     <Ionicons name={icon} size={14} color="#0f172a" />
//     <Text style={styles.statTxt}>{text}</Text>
//   </View>
// );

// const ActionButton = ({ icon, label, onPress, danger }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     disabled={!onPress}
//     style={[
//       styles.actionBtn,
//       danger && styles.actionDanger,
//       !onPress && styles.actionDisabled,
//     ]}
//     activeOpacity={onPress ? 0.85 : 1}
//   >
//     <Ionicons name={icon} size={14} color={danger ? '#fff' : onPress ? '#0f172a' : '#94a3b8'} />
//     <Text style={[styles.actionTxt, danger && { color: '#fff' }, !onPress && { color: '#94a3b8' }]}>
//       {label}
//     </Text>
//   </TouchableOpacity>
// );

// export default function CulturalServiceCard({
//   title,
//   city,
//   durationHours,
//   pricePerPerson,
//   groupSize,
//   rating,
//   badges = [],
//   onView,
//   onEdit,
//   onShare,
//   onDelete,
// }) {
//   const showVendorRow = Boolean(onEdit) || Boolean(onDelete) || Boolean(onShare) || Boolean(onView);
//   return (
//     <View style={styles.card}>
//       <Text style={styles.h1}>Cultural Experience</Text>

//       <View style={styles.badgesRow}>
//         {badges.map((b, i) => (
//           <Badge key={`${b}-${i}`} text={b} />
//         ))}
//       </View>

//       <Text style={styles.title}>{title}</Text>

//       <View style={styles.meta}>
//         {city ? <Stat icon="location-outline" text={city} /> : null}
//       </View>

//       <View style={styles.statsRow}>
//         {durationHours != null ? <Stat icon="time-outline" text={`${durationHours || 0} hour(s)`} /> : null}
//         {groupSize != null ? <Stat icon="people-outline" text={`Up to ${groupSize}`} /> : null}
//         {pricePerPerson != null ? (
//           <View style={[styles.stat, styles.price]}>
//             <Ionicons name="pricetag-outline" size={14} color="#065F46" />
//             <Text style={[styles.statTxt, styles.priceTxt]}>Rs {pricePerPerson} / person</Text>
//           </View>
//         ) : null}
//         {rating != null ? <Stat icon="star-outline" text={`${rating.toFixed?.(1) ?? rating}`} /> : null}
//       </View>

//       <View style={styles.actionsRow}>
//         {onView ? <ActionButton icon="eye-outline" label="View" onPress={onView} /> : null}
//         {onEdit ? <ActionButton icon="create-outline" label="Edit" onPress={onEdit} /> : null}
//         {onShare ? <ActionButton icon="share-social-outline" label="Share" onPress={onShare} /> : null}
//         {onDelete ? <ActionButton icon="trash-outline" label="Delete" onPress={onDelete} danger /> : null}
//         {!showVendorRow ? <View style={{ height: 2 }} /> : null}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E6EDF7',
//     borderRadius: 16,
//     padding: 12,
//     ...(Platform.OS === 'web'
//       ? { boxShadow: '0 4px 12px rgba(15,23,42,.04)' }
//       : { elevation: 1 }),
//   },
//   h1: { fontWeight: '800', color: '#0f172a', marginBottom: 6 },
//   badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
//   badge: {
//     backgroundColor: '#F1F5F9',
//     borderColor: '#E5E7EB',
//     borderWidth: 1,
//     borderRadius: 999,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//   },
//   badgeTxt: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
//   title: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 6 },
//   meta: { flexDirection: 'row', gap: 10, marginTop: 6 },
//   statsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 8 },
//   stat: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
//   statTxt: { fontSize: 12, color: '#0f172a', fontWeight: '700' },
//   price: { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' },
//   priceTxt: { color: '#065F46' },
//   actionsRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
//   actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#EEF2FF' },
//   actionDanger: { backgroundColor: '#EF4444' },
//   actionTxt: { fontWeight: '800', color: '#0f172a' },
//   actionDisabled: { opacity: 0.5 },
// });


// screens/CulturalExchange/CulturalServiceCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/* ---------- internal fallback for opening maps ---------- */
const openMapFallback = (meetingPoint, city) => {
  const query = encodeURIComponent([meetingPoint || '', city || ''].filter(Boolean).join(', '));
  if (!query) return;
  const url = Platform.select({
    ios:     `http://maps.apple.com/?q=${query}`,
    android: `geo:0,0?q=${query}`,
    default: `https://www.google.com/maps/search/?api=1&query=${query}`,
  });
  Linking.openURL(url);
};

const Badge = ({ text }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeTxt}>{text}</Text>
  </View>
);

const Stat = ({ icon, text }) => (
  <View style={styles.stat}>
    <Ionicons name={icon} size={14} color="#0f172a" />
    <Text style={styles.statTxt}>{text}</Text>
  </View>
);

const ActionButton = ({ icon, label, onPress, danger }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    style={[
      styles.actionBtn,
      danger && styles.actionDanger,
      !onPress && styles.actionDisabled,
    ]}
    activeOpacity={onPress ? 0.85 : 1}
  >
    <Ionicons name={icon} size={14} color={danger ? '#fff' : onPress ? '#0f172a' : '#94a3b8'} />
    <Text style={[styles.actionTxt, danger && { color: '#fff' }, !onPress && { color: '#94a3b8' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function CulturalServiceCard({
  title,
  city,
  durationHours,
  pricePerPerson,
  groupSize,
  rating,
  badges = [],

  // 🔹 new prop so card can open the map even without a custom handler
  meetingPoint,

  // actions
  onView,
  onEdit,
  onShare,
  onDelete,
  // 🔹 new optional action: if not provided, we fall back to meetingPoint+city
  onMap,
}) {
  const showVendorRow =
    Boolean(onEdit) || Boolean(onDelete) || Boolean(onShare) || Boolean(onView) || Boolean(onMap) || Boolean(meetingPoint) || Boolean(city);

  const handleMap = () => {
    if (typeof onMap === 'function') return onMap();
    if (meetingPoint || city) return openMapFallback(meetingPoint, city);
    return undefined;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.h1}>Cultural Experience</Text>

      <View style={styles.badgesRow}>
        {badges.map((b, i) => (
          <Badge key={`${b}-${i}`} text={b} />
        ))}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.meta}>
        {city ? <Stat icon="location-outline" text={city} /> : null}
      </View>

      <View style={styles.statsRow}>
        {durationHours != null ? <Stat icon="time-outline" text={`${durationHours || 0} hour(s)`} /> : null}
        {groupSize != null ? <Stat icon="people-outline" text={`Up to ${groupSize}`} /> : null}
        {pricePerPerson != null ? (
          <View style={[styles.stat, styles.price]}>
            <Ionicons name="pricetag-outline" size={14} color="#065F46" />
            <Text style={[styles.statTxt, styles.priceTxt]}>Rs {pricePerPerson} / person</Text>
          </View>
        ) : null}
        {rating != null ? <Stat icon="star-outline" text={`${rating.toFixed?.(1) ?? rating}`} /> : null}
      </View>

      <View style={styles.actionsRow}>
        {/* 🔹 Map button appears if you provided onMap OR we can fallback using meetingPoint/city */}
        {(onMap || meetingPoint || city) ? (
          <ActionButton icon="navigate-outline" label="Map" onPress={handleMap} />
        ) : null}

        {onView ? <ActionButton icon="eye-outline" label="View" onPress={onView} /> : null}
        {onEdit ? <ActionButton icon="create-outline" label="Edit" onPress={onEdit} /> : null}
        {onShare ? <ActionButton icon="share-social-outline" label="Share" onPress={onShare} /> : null}
        {onDelete ? <ActionButton icon="trash-outline" label="Delete" onPress={onDelete} danger /> : null}
        {!showVendorRow ? <View style={{ height: 2 }} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6EDF7',
    borderRadius: 16,
    padding: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 12px rgba(15,23,42,.04)' }
      : { elevation: 1 }),
  },
  h1: { fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeTxt: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  title: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 6 },
  meta: { flexDirection: 'row', gap: 10, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 8 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  statTxt: { fontSize: 12, color: '#0f172a', fontWeight: '700' },
  price: { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' },
  priceTxt: { color: '#065F46' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#EEF2FF' },
  actionDanger: { backgroundColor: '#EF4444' },
  actionTxt: { fontWeight: '800', color: '#0f172a' },
  actionDisabled: { opacity: 0.5 },
});
