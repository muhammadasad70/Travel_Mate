

// // screens/CulturalExchange/ManageCulturalServices.js
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, FlatList, RefreshControl,
//   TouchableOpacity, Platform, ActionSheetIOS, Alert, useWindowDimensions,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import CulturalServiceCard from './CulturalServiceCard';

// const BORDER  = '#E6EDF7';
// const PRIMARY = '#003366';
// const SUBTEXT = '#6B7280';

// // layout (same pattern as itineraries)
// const GUTTER = 14;
// const H_PADDING = 14;
// const CARD_MIN_WIDTH = 320;

// // stub
// const fake = [
//   { id: 1, title: 'Intro to Balochi Embroidery', city: 'Quetta', durationHours: 2,   pricePerPerson: 2500, groupSize: 8,  rating: 4.9, badges: ['Cultural','Hands-on'] },
//   { id: 2, title: 'Peshawari Chapli Kebab Workshop', city: 'Peshawar', durationHours: 1.5, pricePerPerson: 1800, groupSize: 10, rating: 4.7, badges: ['Cooking','Budget-friendly'] },
// ];

// export default function ManageCulturalServices({ onBack, onAdd }) {
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();

//   const columns =
//     Platform.OS === 'web'
//       ? Math.max(1, Math.min(4, Math.floor((width - H_PADDING * 2 + GUTTER) / (CARD_MIN_WIDTH + GUTTER))))
//       : 1;

//   const [items, setItems] = useState(fake);
//   const [refreshing, setRefreshing] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     // later: fetch('/vendor/cultural/listings')...
//   }, []);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     // await fetch...
//     setRefreshing(false);
//   };

//   const confirmDelete = (svc) => {
//     if (Platform.OS === 'web') {
//       if (window.confirm('Delete this service?')) doDelete(svc);
//       return;
//     }
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           title: 'Delete service?',
//           message: 'This action cannot be undone.',
//           options: ['Cancel', 'Delete'],
//           destructiveButtonIndex: 1,
//           cancelButtonIndex: 0,
//         },
//         (idx) => { if (idx === 1) doDelete(svc); }
//       );
//       return;
//     }
//     Alert.alert('Delete service?', 'This action cannot be undone.', [
//       { text: 'Cancel', style: 'cancel' },
//       { text: 'Delete', style: 'destructive', onPress: () => doDelete(svc) },
//     ]);
//   };

//   const doDelete = async (svc) => {
//     const id = svc?.id;
//     if (!id || deletingId) return;
//     setDeletingId(id);
//     const prev = items;
//     setItems(cur => cur.filter(x => x.id !== id));
//     try {
//       // await fetch(DELETE /vendor/cultural/listings/:id)
//     } catch (e) {
//       setItems(prev); // rollback
//       Alert.alert('Network error', 'Could not delete right now.');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const renderItem = ({ item }) => {
//     const isDeleting = deletingId === item.id;
//     return (
//       <View style={[styles.cardWrap, columns > 1 && { width: `${100 / columns}%` }]}>
//         <CulturalServiceCard
//           title={item.title}
//           city={item.city}
//           durationHours={item.durationHours}
//           pricePerPerson={item.pricePerPerson}
//           groupSize={item.groupSize}
//           rating={item.rating}
//           badges={item.badges}
//           onView={() => Alert.alert('View', item.title)}
//           onEdit={() => Alert.alert('Edit', item.title)}
//           onShare={() => Alert.alert('Share', item.title)}
//           onDelete={() => (isDeleting ? null : confirmDelete(item))}
//         />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.safe}>
//       {/* header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backPill} onPress={onBack}>
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backText}>Back to Hub</Text>
//         </TouchableOpacity>

//         <Text style={styles.title}>My Services</Text>

//         {/* Optional top-right Add button
//         <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
//           <Ionicons name="add" size={18} color="#fff" />
//           <Text style={styles.primaryBtnText}>Add Service</Text>
//         </TouchableOpacity>
//         */}
//       </View>

//       {/* list */}
//       <FlatList
//         data={items}
//         key={columns}
//         renderItem={renderItem}
//         keyExtractor={(it, i) => String(it?.id ?? i)}
//         numColumns={columns}
//         nestedScrollEnabled
//         contentContainerStyle={[
//           styles.listContent,
//           { paddingBottom: 4 + insets.bottom, paddingHorizontal: H_PADDING - GUTTER / 2, rowGap: GUTTER },
//           items.length === 0 && { flexGrow: 1, justifyContent: 'center' },
//         ]}
//         ListFooterComponent={<View style={{ height: 0 }} />}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         ListEmptyComponent={
//           <View style={styles.empty}>
//             <Ionicons name="folder-open-outline" size={36} color={SUBTEXT} />
//             <Text style={styles.emptyTitle}>No services yet</Text>
//             <Text style={styles.emptySub}>Create your first cultural experience to get started.</Text>
//             <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
//               <Ionicons name="add" size={18} color="#fff" />
//               <Text style={styles.primaryBtnText}>Add Service</Text>
//             </TouchableOpacity>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#f7f9fc' },

//   header: {
//     paddingHorizontal: 12, paddingVertical: 10,
//     borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: '#f7f9fc',
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//   },
//   backPill: {
//     flexDirection: 'row', gap: 6, alignItems: 'center',
//     backgroundColor: '#fff', borderColor: BORDER, borderWidth: 1,
//     borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
//   },
//   backText: { fontWeight: '800', color: '#0f172a' },
//   title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: PRIMARY },
//   primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
//   primaryBtnText: { color: '#fff', fontWeight: '800' },

//   listContent: {},
//   cardWrap: { flexGrow: 1, paddingHorizontal: GUTTER / 2 },

//   empty: { alignItems: 'center', gap: 8 },
//   emptyTitle: { fontWeight: '800', color: '#0f172a', marginTop: 6 },
//   emptySub: { color: SUBTEXT },
// });


import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl,
  TouchableOpacity, Platform, ActionSheetIOS, Alert, useWindowDimensions, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CulturalServiceCard from './CulturalServiceCard';

/* ========= Backend Config ========= */
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';
const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};
/* ================================== */

const BORDER  = '#E6EDF7';
const PRIMARY = '#003366';
const SUBTEXT = '#6B7280';

// layout (same pattern as itineraries)
const GUTTER = 14;
const H_PADDING = 14;
const CARD_MIN_WIDTH = 320;

export default function ManageCulturalServices({ onBack, onAdd }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const columns =
    Platform.OS === 'web'
      ? Math.max(1, Math.min(4, Math.floor((width - H_PADDING * 2 + GUTTER) / (CARD_MIN_WIDTH + GUTTER))))
      : 1;

  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      setRefreshing(true);
      const token = await getAuthToken();
      if (!token) { Alert.alert('Login required', 'Please sign in again.'); setRefreshing(false); return; }
      const res = await fetch(`${API_BASE}/cultural/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Failed: ${res.status}`);
      // map API fields -> card props
      const mapped = (json || []).map(x => ({
        id: x.id,
        title: x.title,
        city: x.city,
        durationHours: x.duration_hours || 0,
        pricePerPerson: x.price_per_person || 0,
        groupSize: x.group_size_max || null,
        rating: undefined, // no rating yet
        badges: [x.experience_type, x.category].filter(Boolean),
        raw: x,
      }));
      setItems(mapped);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not load services.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchList(); }, [fetchList]);
  useFocusEffect(useCallback(() => { fetchList(); }, [fetchList]));

  const onRefresh = async () => { fetchList(); };

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
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/cultural/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json())?.error || `Delete failed (${res.status})`);
    } catch (e) {
      setItems(prev); // rollback
      Alert.alert('Network error', e.message || 'Could not delete right now.');
    } finally {
      setDeletingId(null);
    }
  };

  const onShareItem = async (item) => {
    try {
      const url = `${API_BASE.replace(/https?:\/\//,'')}/cultural/services/${item.id}`; // adjust if you have a public web URL
      await Share.share({ message: `${item.title}\n${url}` });
    } catch {}
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
          onView={() => navigation.navigate('CulturalServiceDetail', { id: item.id })}
          onEdit={() => navigation.navigate('AddCulturalService', { editId: item.id })}

          onShare={() => onShareItem(item)}
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

        {/* <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Add Service</Text>
        </TouchableOpacity> */}
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
