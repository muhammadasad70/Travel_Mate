// // screens/vendor/cultural/ManageCulturalServices.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// // import api from '../../../api';

// const fake = [
//   { id: 1, title: 'Intro to Balochi Embroidery', city: 'Quetta', pricePerPerson: 2500, rating: 4.9 },
//   { id: 2, title: 'Peshawari Chapli Kebab Workshop', city: 'Peshawar', pricePerPerson: 1800, rating: 4.7 },
// ];

// export default function ManageCulturalServices({ onBack, onAdd }) {
//   const [rows, setRows] = useState(fake);

//   useEffect(() => {
//     // load from API later
//     // api.get('/vendor/cultural/listings').then(res => setRows(res.data.items));
//   }, []);

//   const del = (id) => {
//     Alert.alert('Delete', 'Are you sure?', [
//       { text: 'Cancel' },
//       { text: 'Delete', style: 'destructive', onPress: () => setRows(r => r.filter(x => x.id !== id)) },
//     ]);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.wrap}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={onBack} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={18} />
//         </TouchableOpacity>
//         <Text style={styles.h1}>My Services</Text>
//         <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
//           <Ionicons name="add-circle" size={18} color="#fff" />
//           <Text style={styles.addText}>Add Service</Text>
//         </TouchableOpacity>
//       </View>

//       {rows.length === 0 ? (
//         <View style={styles.empty}>
//           <Text style={styles.emptyTitle}>No services yet</Text>
//           <Text style={styles.emptySub}>Create your first cultural experience to get started.</Text>
//           <TouchableOpacity style={styles.primary} onPress={onAdd}>
//             <Text style={styles.primaryText}>Add Service</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={{ gap: 10 }}>
//           {rows.map(item => (
//             <View key={item.id} style={styles.card}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.title}>{item.title}</Text>
//                 <Text style={styles.meta}>{item.city} · Rs {item.pricePerPerson} · ★ {item.rating}</Text>
//               </View>
//               <View style={styles.actions}>
//                 <Action icon="eye-outline"    label="View"   onPress={() => Alert.alert('View', item.title)} />
//                 <Action icon="create-outline" label="Edit"   onPress={() => Alert.alert('Edit', item.title)} />
//                 <Action icon="trash-outline"  label="Delete" onPress={() => del(item.id)} />
//               </View>
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const Action = ({ icon, label, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={styles.actionBtn}>
//     <Ionicons name={icon} size={16} />
//     <Text style={styles.actionText}>{label}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   wrap: { padding: 12, gap: 12 },
//   header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   backBtn: { padding: 6, borderRadius: 8, backgroundColor: '#F1F5F9' },
//   h1: { fontSize: 18, fontWeight: '800', color: '#0f172a', flex: 1 },
//   addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0ea5e9', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
//   addText: { color: '#fff', fontWeight: '800' },

//   empty: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, alignItems: 'center', gap: 6 },
//   emptyTitle: { fontWeight: '800', color: '#0f172a' },
//   emptySub: { color: '#475569' },
//   primary: { backgroundColor: '#0ea5e9', padding: 12, borderRadius: 10, marginTop: 6 },
//   primaryText: { color: '#fff', fontWeight: '800' },

//   card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
//   title: { fontWeight: '800', color: '#0f172a' },
//   meta: { color: '#475569', marginTop: 2, fontSize: 12 },
//   actions: { flexDirection: 'row', gap: 8 },
//   actionBtn: { backgroundColor: '#F1F5F9', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
//   actionText: { fontWeight: '700', color: '#0f172a' },
// });
// screens/CulturalExchange/ManageCulturalServices.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl,
  TouchableOpacity, Platform, ActionSheetIOS, Alert, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CulturalServiceCard from './CulturalServiceCard';

const BORDER  = '#E6EDF7';
const PRIMARY = '#003366';
const SUBTEXT = '#6B7280';

// layout (same pattern as itineraries)
const GUTTER = 14;
const H_PADDING = 14;
const CARD_MIN_WIDTH = 320;

// stub
const fake = [
  { id: 1, title: 'Intro to Balochi Embroidery', city: 'Quetta', durationHours: 2,   pricePerPerson: 2500, groupSize: 8,  rating: 4.9, badges: ['Cultural','Hands-on'] },
  { id: 2, title: 'Peshawari Chapli Kebab Workshop', city: 'Peshawar', durationHours: 1.5, pricePerPerson: 1800, groupSize: 10, rating: 4.7, badges: ['Cooking','Budget-friendly'] },
];

export default function ManageCulturalServices({ onBack, onAdd }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const columns =
    Platform.OS === 'web'
      ? Math.max(1, Math.min(4, Math.floor((width - H_PADDING * 2 + GUTTER) / (CARD_MIN_WIDTH + GUTTER))))
      : 1;

  const [items, setItems] = useState(fake);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    // later: fetch('/vendor/cultural/listings')...
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // await fetch...
    setRefreshing(false);
  };

  const confirmDelete = (svc) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this service?')) doDelete(svc);
      return;
    }
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Delete service?',
          message: 'This action cannot be undone.',
          options: ['Cancel', 'Delete'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (idx) => { if (idx === 1) doDelete(svc); }
      );
      return;
    }
    Alert.alert('Delete service?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => doDelete(svc) },
    ]);
  };

  const doDelete = async (svc) => {
    const id = svc?.id;
    if (!id || deletingId) return;
    setDeletingId(id);
    const prev = items;
    setItems(cur => cur.filter(x => x.id !== id));
    try {
      // await fetch(DELETE /vendor/cultural/listings/:id)
    } catch (e) {
      setItems(prev); // rollback
      Alert.alert('Network error', 'Could not delete right now.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderItem = ({ item }) => {
    const isDeleting = deletingId === item.id;
    return (
      <View style={[styles.cardWrap, columns > 1 && { width: `${100 / columns}%` }]}>
        <CulturalServiceCard
          title={item.title}
          city={item.city}
          durationHours={item.durationHours}
          pricePerPerson={item.pricePerPerson}
          groupSize={item.groupSize}
          rating={item.rating}
          badges={item.badges}
          onView={() => Alert.alert('View', item.title)}
          onEdit={() => Alert.alert('Edit', item.title)}
          onShare={() => Alert.alert('Share', item.title)}
          onDelete={() => (isDeleting ? null : confirmDelete(item))}
        />
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backPill} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backText}>Back to Hub</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Services</Text>

        {/* Optional top-right Add button
        <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Add Service</Text>
        </TouchableOpacity>
        */}
      </View>

      {/* list */}
      <FlatList
        data={items}
        key={columns}
        renderItem={renderItem}
        keyExtractor={(it, i) => String(it?.id ?? i)}
        numColumns={columns}
        nestedScrollEnabled
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 4 + insets.bottom, paddingHorizontal: H_PADDING - GUTTER / 2, rowGap: GUTTER },
          items.length === 0 && { flexGrow: 1, justifyContent: 'center' },
        ]}
        ListFooterComponent={<View style={{ height: 0 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={36} color={SUBTEXT} />
            <Text style={styles.emptyTitle}>No services yet</Text>
            <Text style={styles.emptySub}>Create your first cultural experience to get started.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Add Service</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fc' },

  header: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: '#f7f9fc',
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  backPill: {
    flexDirection: 'row', gap: 6, alignItems: 'center',
    backgroundColor: '#fff', borderColor: BORDER, borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  backText: { fontWeight: '800', color: '#0f172a' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: PRIMARY },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },

  listContent: {},
  cardWrap: { flexGrow: 1, paddingHorizontal: GUTTER / 2 },

  empty: { alignItems: 'center', gap: 8 },
  emptyTitle: { fontWeight: '800', color: '#0f172a', marginTop: 6 },
  emptySub: { color: SUBTEXT },
});
