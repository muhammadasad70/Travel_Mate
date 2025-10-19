

// // import React from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';

// // const BORDER  = '#E6EDF7';
// // const PRIMARY = '#003366';
// // const SUBTEXT = '#6B7280';

// // export default function CulturalServiceCard({
// //   title,
// //   city,
// //   durationHours,
// //   pricePerPerson,
// //   groupSize,
// //   rating,
// //   badges = [],
// //   onView, onEdit, onShare, onDelete
// // }) {
// //   return (
// //     <View style={styles.card}>
// //       {/* header band (no image) */}
// //       <View style={styles.band}>
// //         <View style={styles.bandLeft}>
// //           <Ionicons name="people-outline" size={18} color={PRIMARY} />
// //           <Text style={styles.bandText}>Cultural Experience</Text>
// //         </View>
// //         {typeof rating === 'number' && (
// //           <View style={styles.ratingPill}>
// //             <Ionicons name="star" size={12} color="#F59E0B" />
// //             <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
// //           </View>
// //         )}
// //       </View>

// //       {/* badges */}
// //       {badges?.length > 0 && (
// //         <View style={styles.badgesRow}>
// //           {badges.map((b, i) => (
// //             <View key={i} style={styles.badge}>
// //               <Ionicons name="pricetag-outline" size={12} color={PRIMARY} />
// //               <Text style={styles.badgeText}> {b}</Text>
// //             </View>
// //           ))}
// //         </View>
// //       )}

// //       {/* body */}
// //       <View style={styles.body}>
// //         <Text style={styles.title} numberOfLines={1}>
// //           {title || 'Untitled Service'}
// //         </Text>

// //         <View style={styles.row}>
// //           <Ionicons name="location-outline" size={14} color={SUBTEXT} />
// //           <Text style={styles.sub} numberOfLines={1}>{city || '—'}</Text>
// //         </View>

// //         <View style={styles.metaRow}>
// //           <View style={styles.metaPill}>
// //             <Ionicons name="time-outline" size={12} color={PRIMARY} />
// //             <Text style={styles.metaText}>{Number(durationHours || 1)} hour(s)</Text>
// //           </View>
// //           {groupSize ? (
// //             <View style={styles.metaPill}>
// //               <Ionicons name="people-circle-outline" size={12} color={PRIMARY} />
// //               <Text style={styles.metaText}>Up to {groupSize}</Text>
// //             </View>
// //           ) : null}
// //           <View style={[styles.metaPill, styles.pricePill]}>
// //             <Ionicons name="cash-outline" size={12} color="#065F46" />
// //             <Text style={[styles.metaText, { color: '#065F46' }]}>
// //               Rs {Number(pricePerPerson || 0)} / person
// //             </Text>
// //           </View>
// //         </View>
// //       </View>

// //       {/* actions */}
// //       <View style={styles.actionsRow}>
// //         <Action icon="eye-outline" label="View" onPress={onView} />
// //         <Action icon="create-outline" label="Edit" onPress={onEdit} />
// //         <Action icon="share-social-outline" label="Share" onPress={onShare} />
// //         <Action icon="trash-outline" label="Delete" onPress={onDelete} danger />
// //       </View>
// //     </View>
// //   );
// // }

// // function Action({ icon, label, danger, onPress }) {
// //   return (
// //     <TouchableOpacity onPress={onPress} style={[styles.actionBtn, danger && styles.actionDanger]}>
// //       <Ionicons name={icon} size={14} color={danger ? '#B91C1C' : PRIMARY} />
// //       <Text style={[styles.actionText, danger && { color: '#B91C1C' }]}>{label}</Text>
// //     </TouchableOpacity>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   card: {
// //     overflow: 'hidden',
// //     borderRadius: 14,
// //     backgroundColor: '#fff',
// //     borderWidth: 1,
// //     borderColor: BORDER,
// //     ...Platform.select({
// //       web:  { boxShadow: '0 6px 16px rgba(0,0,0,0.06)' },
// //       default: {
// //         shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12,
// //         shadowOffset: { width: 0, height: 6 }, elevation: 3,
// //       },
// //     }),
// //   },
// //   band: {
// //     paddingHorizontal: 10, paddingVertical: 8,
// //     borderBottomWidth: 1, borderBottomColor: BORDER,
// //     backgroundColor: '#F8FAFC', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
// //   },
// //   bandLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
// //   bandText: { color: PRIMARY, fontWeight: '800' },
// //   ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
// //   ratingText: { fontSize: 12, fontWeight: '800', color: '#92400E' },

// //   badgesRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingTop: 10, flexWrap: 'wrap' },
// //   badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
// //   badgeText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

// //   body: { padding: 12, gap: 6 },
// //   title: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
// //   row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
// //   sub: { color: SUBTEXT, fontSize: 13 },

// //   metaRow: { marginTop: 6, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
// //   metaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
// //   metaText: { color: PRIMARY, fontWeight: '700', fontSize: 12 },
// //   pricePill: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#D1FAE5' },

// //   actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', padding: 8, borderTopWidth: 1, borderTopColor: BORDER, gap: 8, flexWrap: 'wrap' },
// //   actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#F1F5F9', borderRadius: 999 },
// //   actionDanger: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
// //   actionText: { color: PRIMARY, fontWeight: '700', fontSize: 12 },
// // });



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

//       {/* Actions row renders ONLY the buttons you provided handlers for */}
//       <View style={styles.actionsRow}>
//         {onView ? <ActionButton icon="eye-outline" label="View" onPress={onView} /> : null}
//         {onEdit ? <ActionButton icon="create-outline" label="Edit" onPress={onEdit} /> : null}
//         {onShare ? <ActionButton icon="share-social-outline" label="Share" onPress={onShare} /> : null}
//         {onDelete ? <ActionButton icon="trash-outline" label="Delete" onPress={onDelete} danger /> : null}

//         {/* If this card is used publicly and no vendor actions are given,
//            keep the row’s spacing compact; otherwise it will collapse gracefully. */}
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
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  onView,
  onEdit,
  onShare,
  onDelete,
}) {
  const showVendorRow = Boolean(onEdit) || Boolean(onDelete) || Boolean(onShare) || Boolean(onView);

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

      {/* Actions row renders ONLY the buttons you provided handlers for */}
      <View style={styles.actionsRow}>
        {onView ? <ActionButton icon="eye-outline" label="View" onPress={onView} /> : null}
        {onEdit ? <ActionButton icon="create-outline" label="Edit" onPress={onEdit} /> : null}
        {onShare ? <ActionButton icon="share-social-outline" label="Share" onPress={onShare} /> : null}
        {onDelete ? <ActionButton icon="trash-outline" label="Delete" onPress={onDelete} danger /> : null}

        {/* If this card is used publicly and no vendor actions are given,
           keep the row’s spacing compact; otherwise it will collapse gracefully. */}
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
