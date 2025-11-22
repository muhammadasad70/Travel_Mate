

// // screens/vendor/VendorHome.js
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';

// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const { width } = Dimensions.get('window');

// export default function VendorHome({ dispatchTab, navigation }) {
//   const [loading, setLoading] = useState(true);
//   const [vendorName, setVendorName] = useState('');
//   const [stats, setStats] = useState({ pending: 0, confirmed: 0, services: 0, monthly: 0 });
//   const [upcomingBookings, setUpcomingBookings] = useState([]);
//   const [hasServices, setHasServices] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return setLoading(false);

//       const [profileRes, reqRes, bookRes, svcRes] = await Promise.all([
//         fetch(`${API_BASE}/vendor/profile`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${API_BASE}/vendor/cultural/requests`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${API_BASE}/vendor/cultural/booked`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${API_BASE}/cultural/services`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       const profile = await profileRes.json();
//       const requests = await reqRes.json();
//       const bookings = await bookRes.json();
//       const services = await svcRes.json();

//       const now = new Date();
//       const monthBookings = bookings.filter(b => {
//         const date = new Date(b.chosen_date?.String || b.chosen_date);
//         return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
//       });

//       setVendorName(profile?.name || profile?.business_name || '');
//       setStats({
//         pending: requests?.length || 0,
//         confirmed: bookings?.length || 0,
//         services: Array.isArray(services) ? services.length : 0,
//         monthly: monthBookings.length || 0,
//       });
//       setHasServices(Array.isArray(services) && services.length > 0);
//       setUpcomingBookings(bookings.slice(0, 3));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTravelerName = (t) => {
//     const name = t?.name?.String || t?.name || 'Traveler';
//     const parts = name.split(' ');
//     return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
//   };

//   if (loading)
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#6366F1" />
//       </View>
//     );

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* ✅ Vendor Snapshot Panel */}
//       <View style={styles.snapshotCard}>
//         <View style={styles.snapshotHeader}>
//           <View style={styles.avatarBig}>
//             <Text style={styles.avatarLetter}>{vendorName ? vendorName[0] : 'M'}</Text>
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.snapshotName}>{vendorName || 'Vendor'}</Text>
//             <Text style={styles.snapshotSubtitle}>Trusted Cultural Experience Provider</Text>
//           </View>
//           <TouchableOpacity
//             onPress={() => dispatchTab('profile')}
//             style={styles.editBtn}
//           >
//             <Ionicons name="create-outline" size={16} color="#6366F1" />
//             <Text style={styles.editBtnText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.snapshotStats}>
//           <SnapshotStat icon="briefcase-outline" label="Services" value={stats.services} color="#8B5CF6" />
//           <SnapshotStat icon="calendar-outline" label="Bookings" value={stats.confirmed} color="#10B981" />
//           <SnapshotStat icon="star-outline" label="Rating" value="4.9" color="#F59E0B" />
//           <SnapshotStat icon="time-outline" label="Response Rate" value="96%" color="#3B82F6" />
//         </View>
//       </View>

//       {/* ✅ Business Insights Bar */}
//       <Text style={styles.sectionTitle}>Business Insights</Text>
//       <View style={styles.grid2}>
//         <InsightCard icon="trending-up-outline" color="#10B981" title="This Month" value={`${stats.monthly} Bookings`} />
//         <InsightCard icon="chatbox-ellipses-outline" color="#3B82F6" title="Pending Requests" value={`${stats.pending}`} />
//         <InsightCard icon="people-outline" color="#8B5CF6" title="Happy Travelers" value="97%" />
//         <InsightCard icon="alarm-outline" color="#F59E0B" title="Avg Response" value="2.1 hrs" />
//       </View>

//       {/* ✅ Upcoming Bookings */}
//       {upcomingBookings.length > 0 && (
//         <View style={styles.section}>
//           <View style={styles.rowBetween}>
//             <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
//             <TouchableOpacity onPress={() => dispatchTab('booking')}>
//               <Text style={styles.link}>View All →</Text>
//             </TouchableOpacity>
//           </View>
//           {upcomingBookings.map((b) => (
//             <View key={b.id} style={styles.bookingCard}>
//               <View style={styles.bookingHeader}>
//                 <View style={styles.row}>
//                   <View style={styles.avatar}>
//                     <Text style={styles.avatarText}>{getTravelerName(b.traveler)[0]}</Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.bookingTitle} numberOfLines={1}>{b.service?.title || 'Service'}</Text>
//                     <Text style={styles.bookingGuest}>
//                       {getTravelerName(b.traveler)} • {b.participants || 1} guest{b.participants > 1 ? 's' : ''}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.badge}>
//                   <Ionicons name="checkmark-circle" size={14} color="#10B981" />
//                   <Text style={styles.badgeText}>Confirmed</Text>
//                 </View>
//               </View>
//               {b.chosen_date?.String && (
//                 <View style={styles.dateRow}>
//                   <Ionicons name="calendar-outline" size={16} color="#6B7280" />
//                   <Text style={styles.dateText}>{b.chosen_date.String}</Text>
//                 </View>
//               )}
//             </View>
//           ))}
//         </View>
//       )}

//       {/* ✅ Quick Tools (Updated — Chat instead of Analysis) */}
//       <Text style={styles.sectionTitle}>Quick Tools</Text>
//       <View style={styles.grid2}>
//         <QuickTool icon="add-circle-outline" label="Add Service" color="#3B82F6" onPress={() => dispatchTab('services')} />
//         <QuickTool icon="mail-outline" label="Requests" color="#F59E0B" onPress={() => dispatchTab('request')} />
//         <QuickTool icon="chatbubbles-outline" label="Chat" color="#10B981" onPress={() => dispatchTab('chat')} />
//         <QuickTool icon="notifications-outline" label="Notifications" color="#EC4899" onPress={() => dispatchTab('notification')} />
//       </View>

//       {/* ✅ Help */}
//       <View style={styles.helpCard}>
//         <Ionicons name="help-circle-outline" size={32} color="#6366F1" />
//         <Text style={styles.helpTitle}>Need Help?</Text>
//         <Text style={styles.helpSubtitle}>Our support team is here to help you succeed</Text>
//         <TouchableOpacity style={styles.helpBtn} onPress={() => navigation.navigate('AboutTravelMatePage')}>
//           <Text style={styles.helpBtnText}>Contact Support</Text>
//           <Ionicons name="arrow-forward" size={14} color="#6366F1" />
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// /* ---------- Sub Components ---------- */
// const SnapshotStat = ({ icon, label, value, color }) => (
//   <View style={styles.snapshotStat}>
//     <Ionicons name={icon} size={18} color={color} style={{ marginRight: 6 }} />
//     <Text style={styles.snapshotStatValue}>{value}</Text>
//     <Text style={styles.snapshotStatLabel}>{label}</Text>
//   </View>
// );

// const InsightCard = ({ icon, color, title, value }) => (
//   <View style={styles.insightCard}>
//     <Ionicons name={icon} size={22} color={color} />
//     <Text style={styles.insightTitle}>{title}</Text>
//     <Text style={styles.insightValue}>{value}</Text>
//   </View>
// );

// const QuickTool = ({ icon, label, color, onPress }) => (
//   <TouchableOpacity style={styles.cardSmall} onPress={onPress} activeOpacity={0.8}>
//     <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
//       <Ionicons name={icon} size={22} color={color} />
//     </View>
//     <Text style={styles.cardLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// /* ---------- Styles ---------- */
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC', padding: 12 },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//   snapshotCard: {
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 18,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   snapshotHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   avatarBig: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#052d46ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   avatarLetter: { fontSize: 24, fontWeight: '800', color: '#fff' },
//   snapshotName: { fontSize: 18, fontWeight: '800', color: '#111827' },
//   snapshotSubtitle: { fontSize: 13, color: '#6B7280' },
//   editBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#EEF2FF',
//     borderRadius: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//   },
//   editBtnText: { color: '#052d46ff', fontWeight: '700', fontSize: 12, marginLeft: 4 },
//   snapshotStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//   },
//   snapshotStat: { alignItems: 'center', width: '23%' },
//   snapshotStatValue: { fontSize: 16, fontWeight: '800', color: '#111827' },
//   snapshotStatLabel: { fontSize: 12, color: '#6B7280' },

//   sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 10 },
//   grid2: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },

//   insightCard: {
//     width: width < 600 ? '48%' : '23%',
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     marginBottom: 12,
//   },
//   insightTitle: { fontSize: 12, color: '#6B7280', marginTop: 6 },
//   insightValue: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 2 },

//   cardSmall: {
//     width: width < 600 ? '48%' : '23%',
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   iconCircle: {
//     width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8,
//   },
//   cardLabel: { fontSize: 13, fontWeight: '600', color: '#111827' },

//   bookingCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ECFDF5',
//     borderRadius: 8,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//   },
//   badgeText: { color: '#10B981', fontSize: 11, fontWeight: '700', marginLeft: 4 },
//   row: { flexDirection: 'row', alignItems: 'center', flex: 1 },
//   avatar: {
//     width: 42, height: 42, borderRadius: 21,
//     backgroundColor: '#052d46ff', justifyContent: 'center', alignItems: 'center', marginRight: 10,
//   },
//   avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
//   bookingTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
//   bookingGuest: { fontSize: 12, color: '#6B7280' },
//   dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
//   dateText: { fontSize: 12, color: '#6B7280', marginLeft: 6 },

//   helpCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 24,
//     alignItems: 'center',
//     marginBottom: 40,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   helpTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 10 },
//   helpSubtitle: { color: '#082631ff', fontSize: 13, marginBottom: 16, textAlign: 'center' },
//   helpBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//   },
//   helpBtnText: { fontSize: 13, fontWeight: '700', color: '#092534ff', marginRight: 6 },
// });



// screens/vendor/VendorHome.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');
const { width } = Dimensions.get('window');

export default function VendorHome({ dispatchTab, navigation }) {
  const [loading, setLoading] = useState(true);
  const [vendorName, setVendorName] = useState('');
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, services: 0, monthly: 0 });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [hasServices, setHasServices] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return setLoading(false);

      const [profileRes, reqRes, bookRes, svcRes] = await Promise.all([
        fetch(`${API_BASE}/vendor/profile/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/vendor/cultural/requests`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/vendor/cultural/booked`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/cultural/services`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const profile = await profileRes.json();
      const requests = await reqRes.json();
      const bookings = await bookRes.json();
      const services = await svcRes.json();

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthBookings = bookings.filter(b => {
        const dateStr = b.chosen_date?.String || b.chosen_date;
        if (!dateStr) return false;

        try {
          const bookingDate = new Date(dateStr);
          return bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear;
        } catch {
          return false;
        }
      });

      setVendorName(profile?.name || profile?.business_name || '');
      setStats({
        pending: requests?.length || 0,
        confirmed: bookings?.length || 0,
        services: Array.isArray(services) ? services.length : 0,
        monthly: monthBookings.length || 0,
      });
      setHasServices(Array.isArray(services) && services.length > 0);
      setUpcomingBookings(bookings.slice(0, 3));
    } catch (err) {
      console.error('Error fetching vendor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTravelerName = (t) => {
    const name = t?.name?.String || t?.name || 'Traveler';
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ✅ Vendor Snapshot Panel */}
      <View style={styles.snapshotCard}>
        <View style={styles.snapshotHeader}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarLetter}>{vendorName ? vendorName[0] : 'M'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.snapshotName}>{vendorName || 'Vendor'}</Text>
            <Text style={styles.snapshotSubtitle}>Trusted Cultural Experience Provider</Text>
          </View>
          <TouchableOpacity
            onPress={() => dispatchTab('profile')}
            style={styles.editBtn}
          >
            <Ionicons name="create-outline" size={16} color="#6366F1" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.snapshotStats}>
          <SnapshotStat icon="briefcase-outline" label="Services" value={stats.services} color="#8B5CF6" />
          <SnapshotStat icon="calendar-outline" label="Bookings" value={stats.confirmed} color="#10B981" />
          <SnapshotStat icon="star-outline" label="Rating" value="4.9" color="#F59E0B" />
          <SnapshotStat icon="time-outline" label="Response Rate" value="96%" color="#3B82F6" />
        </View>
      </View>

      {/* ✅ Business Insights Bar */}
      <Text style={styles.sectionTitle}>Business Insights</Text>
      <View style={styles.grid2}>
        <InsightCard icon="trending-up-outline" color="#10B981" title="This Month" value={`${stats.monthly} Bookings`} />
        <InsightCard icon="chatbox-ellipses-outline" color="#3B82F6" title="Pending Requests" value={`${stats.pending}`} />
        <InsightCard icon="people-outline" color="#8B5CF6" title="Happy Travelers" value="97%" />
        <InsightCard icon="alarm-outline" color="#F59E0B" title="Avg Response" value="2.1 hrs" />
      </View>

      {/* ✅ Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            <TouchableOpacity onPress={() => dispatchTab('booking')}>
              <Text style={styles.link}>View All →</Text>
            </TouchableOpacity>
          </View>
          {upcomingBookings.map((b) => (
            <View key={b.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getTravelerName(b.traveler)[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bookingTitle} numberOfLines={1}>{b.service?.title || 'Service'}</Text>
                    <Text style={styles.bookingGuest}>
                      {getTravelerName(b.traveler)} • {b.participants || 1} guest{b.participants > 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.badge}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  <Text style={styles.badgeText}>Confirmed</Text>
                </View>
              </View>
              {b.chosen_date?.String && (
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.dateText}>{b.chosen_date.String}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ✅ Quick Tools */}
      <Text style={styles.sectionTitle}>Quick Tools</Text>
      <View style={styles.grid2}>
        <QuickTool icon="add-circle-outline" label="Add Service" color="#3B82F6" onPress={() => dispatchTab('services')} />
        <QuickTool icon="mail-outline" label="Requests" color="#F59E0B" onPress={() => dispatchTab('request')} />
        <QuickTool icon="chatbubbles-outline" label="Chat" color="#10B981" onPress={() => dispatchTab('chat')} />
        <QuickTool icon="notifications-outline" label="Notifications" color="#EC4899" onPress={() => dispatchTab('notification')} />
      </View>

      {/* ✅ Help */}
      <View style={styles.helpCard}>
        <Ionicons name="help-circle-outline" size={32} color="#6366F1" />
        <Text style={styles.helpTitle}>Need Help?</Text>
        <Text style={styles.helpSubtitle}>Our support team is here to help you succeed</Text>
        <TouchableOpacity style={styles.helpBtn} onPress={() => navigation.navigate('AboutTravelMatePage')}>
          <Text style={styles.helpBtnText}>Contact Support</Text>
          <Ionicons name="arrow-forward" size={14} color="#6366F1" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ---------- Sub Components ---------- */
const SnapshotStat = ({ icon, label, value, color }) => (
  <View style={styles.snapshotStat}>
    <Ionicons name={icon} size={18} color={color} style={{ marginRight: 6 }} />
    <Text style={styles.snapshotStatValue}>{value}</Text>
    <Text style={styles.snapshotStatLabel}>{label}</Text>
  </View>
);

const InsightCard = ({ icon, color, title, value }) => (
  <View style={styles.insightCard}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={styles.insightTitle}>{title}</Text>
    <Text style={styles.insightValue}>{value}</Text>
  </View>
);

const QuickTool = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.cardSmall} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 12 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  snapshotCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  snapshotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarBig: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#052d46ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLetter: { fontSize: 24, fontWeight: '800', color: '#fff' },
  snapshotName: { fontSize: 18, fontWeight: '800', color: '#111827' },
  snapshotSubtitle: { fontSize: 13, color: '#6B7280' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  editBtnText: { color: '#052d46ff', fontWeight: '700', fontSize: 12, marginLeft: 4 },
  snapshotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  snapshotStat: { alignItems: 'center', width: '23%' },
  snapshotStatValue: { fontSize: 16, fontWeight: '800', color: '#111827' },
  snapshotStatLabel: { fontSize: 12, color: '#6B7280' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 10 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },

  insightCard: {
    width: width < 600 ? '48%' : '23%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  insightTitle: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  insightValue: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 2 },

  cardSmall: {
    width: width < 600 ? '48%' : '23%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#111827' },

  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: { color: '#10B981', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#052d46ff', justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bookingTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  bookingGuest: { fontSize: 12, color: '#6B7280' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  dateText: { fontSize: 12, color: '#6B7280', marginLeft: 6 },

  helpCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  helpTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 10 },
  helpSubtitle: { color: '#082631ff', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  helpBtnText: { fontSize: 13, fontWeight: '700', color: '#092534ff', marginRight: 6 },
});
