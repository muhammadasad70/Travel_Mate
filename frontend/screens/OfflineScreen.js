
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';

// import {
//   getOfflineItineraries,
//   getOfflineBookings,
//   getOfflineEvents,
//   getStorageStats,
//   clearAllOfflineData,
//   removeOfflineItinerary,
//   removeOfflineBooking,
//   removeOfflineEvent,
// } from '../utils/offlineStorage';
// import { useNetworkStatus } from '../utils/networkStatus';
// import EmergencyCitySelector from '../components/EmergencyCitySelector';
// // ✅ Import EventDetailsSheet
// import EventDetailsSheet from '../components/Events/EventDetailsSheet';

// const COLORS = {
//   primary: '#0c2444ff',
//   background: '#F6FAFD',
//   card: '#FFFFFF',
//   text: '#0F3A6B',
//   subtext: '#6B7280',
//   border: '#EAF0F6',
//   success: '#10B981',
//   error: '#EF4444',
// };

// export default function OfflineScreen() {
//   const navigation = useNavigation();
//   const { isOnline } = useNetworkStatus();
  
//   const [itineraries, setItineraries] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [detectedCities, setDetectedCities] = useState([]);
//   const [showCitySelector, setShowCitySelector] = useState(false);
  
//   // ✅ State for event details modal
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   useFocusEffect(
//     React.useCallback(() => {
//       loadOfflineData();
//     }, [])
//   );

//   const extractCitiesFromItineraries = (itinerariesList) => {
//     const citiesSet = new Set();
    
//     itinerariesList.forEach(itinerary => {
//       if (itinerary.destination) {
//         citiesSet.add(itinerary.destination);
//       }
//       if (itinerary.city) {
//         citiesSet.add(itinerary.city);
//       }
//       if (itinerary.location) {
//         citiesSet.add(itinerary.location);
//       }
      
//       if (itinerary.days && Array.isArray(itinerary.days)) {
//         itinerary.days.forEach(day => {
//           if (day.city) citiesSet.add(day.city);
//           if (day.location) citiesSet.add(day.location);
          
//           if (day.activities && Array.isArray(day.activities)) {
//             day.activities.forEach(activity => {
//               if (activity.city) citiesSet.add(activity.city);
//               if (activity.location) citiesSet.add(activity.location);
//             });
//           }
//         });
//       }
      
//       if (itinerary.destinations && Array.isArray(itinerary.destinations)) {
//         itinerary.destinations.forEach(dest => {
//           if (typeof dest === 'string') {
//             citiesSet.add(dest);
//           } else if (dest.city) {
//             citiesSet.add(dest.city);
//           } else if (dest.name) {
//             citiesSet.add(dest.name);
//           }
//         });
//       }
//     });
    
//     return Array.from(citiesSet).filter(city => city && city.trim() !== '');
//   };

//   const loadOfflineData = async () => {
//     const [itins, books, evts, statistics] = await Promise.all([
//       getOfflineItineraries(),
//       getOfflineBookings(),
//       getOfflineEvents(),
//       getStorageStats(),
//     ]);
    
//     setItineraries(itins);
//     setBookings(books);
//     setEvents(evts);
//     setStats(statistics);
    
//     if (itins.length > 0) {
//       const cities = extractCitiesFromItineraries(itins);
//       setDetectedCities(cities);
//       console.log('📍 Detected cities from itineraries:', cities);
//     } else {
//       setDetectedCities([]);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadOfflineData();
//     setRefreshing(false);
//   };

//   const handleClearAll = () => {
//     Alert.alert(
//       'Clear All Offline Data',
//       'This will remove all saved itineraries, bookings, and events. Continue?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear All',
//           style: 'destructive',
//           onPress: async () => {
//             const success = await clearAllOfflineData();
//             if (success) {
//               loadOfflineData();
//               Alert.alert('Success', 'All offline data cleared');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleDeleteItem = (type, id, title) => {
//     Alert.alert(
//       'Remove Offline Access',
//       `Remove "${title}" from offline storage?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: async () => {
//             let success = false;
//             if (type === 'itinerary') success = await removeOfflineItinerary(id);
//             if (type === 'booking') success = await removeOfflineBooking(id);
//             if (type === 'event') success = await removeOfflineEvent(id);
            
//             if (success) loadOfflineData();
//           },
//         },
//       ]
//     );
//   };

//   const handleEmergencyPress = () => {
//     const cities = detectedCities.length > 0 ? detectedCities : ['Islamabad'];
    
//     if (cities.length === 1) {
//       navigation.navigate('EmergencyInfo', { 
//         city: cities[0],
//         detectedFromItinerary: detectedCities.length > 0 
//       });
//     } else {
//       setShowCitySelector(true);
//     }
//   };

//   const handleCitySelect = (city) => {
//     navigation.navigate('EmergencyInfo', { 
//       city,
//       detectedFromItinerary: detectedCities.includes(city),
//       showCitySelector: city === 'Islamabad' && !detectedCities.includes('Islamabad')
//     });
//   };

//   const totalItems = itineraries.length + bookings.length + events.length;

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Offline Access</Text>
        
//         {!isOnline ? (
//           <View style={styles.offlineBadge}>
//             <Ionicons name="cloud-offline" size={14} color="#fff" />
//             <Text style={styles.offlineBadgeText}>Offline</Text>
//           </View>
//         ) : (
//           <View style={{ width: 40 }} />
//         )}
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {stats && (
//           <View style={styles.statsCard}>
//             <View style={styles.statsHeader}>
//               <Ionicons name="folder-outline" size={24} color={COLORS.primary} />
//               <Text style={styles.statsTitle}>Storage Usage</Text>
//             </View>
//             <View style={styles.statsGrid}>
//               <StatItem label="Itineraries" value={stats.itineraries.count} size={`${stats.itineraries.size} KB`} />
//               <StatItem label="Bookings" value={stats.bookings.count} size={`${stats.bookings.size} KB`} />
//               <StatItem label="Events" value={stats.events.count} size={`${stats.events.size} KB`} />
//             </View>
//             <View style={styles.statsTotal}>
//               <Text style={styles.totalLabel}>Total Storage</Text>
//               <Text style={styles.totalValue}>{stats.total.size} KB • {stats.total.count} items</Text>
//             </View>
//           </View>
//         )}

//         <TouchableOpacity
//           style={styles.emergencyButton}
//           onPress={handleEmergencyPress}
//           activeOpacity={0.9}
//         >
//           <View style={styles.emergencyIcon}>
//             <Ionicons name="medical" size={28} color="#fff" />
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.emergencyTitle}>Emergency Information</Text>
//             <Text style={styles.emergencySubtitle}>
//               {detectedCities.length > 0 
//                 ? `${detectedCities.length} destination${detectedCities.length > 1 ? 's' : ''} • Police • Hospitals • Embassies`
//                 : 'Police • Hospitals • Embassies'
//               }
//             </Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color="#fff" />
//         </TouchableOpacity>

//         {totalItems === 0 && (
//           <View style={styles.emptyState}>
//             <Ionicons name="cloud-download-outline" size={64} color={COLORS.subtext} />
//             <Text style={styles.emptyTitle}>No Offline Content</Text>
//             <Text style={styles.emptyText}>
//               Save itineraries, bookings, and events for offline access
//             </Text>
//           </View>
//         )}

//         {totalItems > 0 && (
//           <>
//             <SectionHeader
//               title="Saved Itineraries"
//               count={itineraries.length}
//               icon="map-outline"
//             />
//             {itineraries.length === 0 ? (
//               <EmptyState message="No itineraries saved offline" />
//             ) : (
//               itineraries.map((item) => {
//                 const destination = item.destination || item.city || 'Unknown Destination';
//                 const daysCount = Array.isArray(item.days) ? item.days.length : (item.days || 0);
//                 const savedTime = formatDate(item.savedAt);
                
//                 return (
//                   <OfflineCard
//                     key={item.id}
//                     title={item.title || destination}
//                     subtitle={`${destination} • ${daysCount} day${daysCount !== 1 ? 's' : ''} • Saved ${savedTime}`}
//                     icon="map"
//                     color="#3B82F6"
//                     onPress={() => navigation.navigate('ItineraryDetails', { itinerary: item })}
//                     onDelete={() => handleDeleteItem('itinerary', item.id, item.title || 'itinerary')}
//                   />
//                 );
//               })
//             )}

//             <SectionHeader
//               title="Saved Bookings"
//               count={bookings.length}
//               icon="receipt-outline"
//             />
//             {bookings.length === 0 ? (
//               <EmptyState message="No bookings saved offline" />
//             ) : (
//               bookings.map((item) => (
//                 <OfflineCard
//                   key={item.id}
//                   title={item.service_name || item.hotel_name || 'Booking'}
//                   subtitle={`Booking #${item.id} • Saved ${formatDate(item.savedAt)}`}
//                   icon="ticket"
//                   color="#10B981"
//                   onPress={() => {}}
//                   onDelete={() => handleDeleteItem('booking', item.id, item.service_name || 'booking')}
//                 />
//               ))
//             )}

//             <SectionHeader
//               title="Saved Events"
//               count={events.length}
//               icon="calendar-outline"
//             />
//             {events.length === 0 ? (
//               <EmptyState message="No events saved offline" />
//             ) : (
//               events.map((item) => (
//                 <OfflineCard
//                   key={item.id}
//                   title={item.title}
//                   subtitle={`${item.city || 'Event'} • Saved ${formatDate(item.savedAt)}`}
//                   icon="calendar"
//                   color="#F59E0B"
//                   // ✅ FIXED: Open event details modal
//                   onPress={() => setSelectedEvent(item)}
//                   onDelete={() => handleDeleteItem('event', item.id, item.title)}
//                 />
//               ))
//             )}

//             <TouchableOpacity
//               style={styles.clearButton}
//               onPress={handleClearAll}
//               activeOpacity={0.9}
//             >
//               <Ionicons name="trash-outline" size={20} color={COLORS.error} />
//               <Text style={styles.clearButtonText}>Clear All Offline Data</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         <View style={{ height: 40 }} />
//       </ScrollView>

//       {showCitySelector && (
//         <EmergencyCitySelector
//           visible={showCitySelector}
//           cities={detectedCities}
//           onSelectCity={handleCitySelect}
//           onClose={() => setShowCitySelector(false)}
//         />
//       )}

//       {/* ✅ Event Details Modal */}
//       <EventDetailsSheet
//         event={selectedEvent}
//         onClose={() => setSelectedEvent(null)}
//         // Don't pass offline props since event is already offline
//       />
//     </SafeAreaView>
//   );
// }

// function SectionHeader({ title, count, icon }) {
//   return (
//     <View style={styles.sectionHeader}>
//       <Ionicons name={icon} size={20} color={COLORS.primary} />
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <View style={styles.countBadge}>
//         <Text style={styles.countText}>{count}</Text>
//       </View>
//     </View>
//   );
// }

// function StatItem({ label, value, size }) {
//   return (
//     <View style={styles.statItem}>
//       <Text style={styles.statValue}>{value}</Text>
//       <Text style={styles.statLabel}>{label}</Text>
//       <Text style={styles.statSize}>{size}</Text>
//     </View>
//   );
// }

// function EmptyState({ message }) {
//   return (
//     <View style={styles.emptyStateSmall}>
//       <Ionicons name="cloud-offline-outline" size={32} color={COLORS.subtext} />
//       <Text style={styles.emptyTextSmall}>{message}</Text>
//     </View>
//   );
// }

// function OfflineCard({ title, subtitle, icon, color, onPress, onDelete }) {
//   return (
//     <View style={styles.card}>
//       <TouchableOpacity
//         style={styles.cardContent}
//         onPress={onPress}
//         activeOpacity={0.9}
//       >
//         <View style={[styles.cardIcon, { backgroundColor: color + '20' }]}>
//           <Ionicons name={icon} size={24} color={color} />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
//           <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitle}</Text>
//         </View>
//         <Ionicons name="chevron-forward" size={20} color={COLORS.subtext} />
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={onDelete}
//         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//       >
//         <Ionicons name="close-circle" size={24} color={COLORS.error} />
//       </TouchableOpacity>
//     </View>
//   );
// }

// function formatDate(isoString) {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   const now = new Date();
//   const diffMs = now - date;
//   const diffMins = Math.floor(diffMs / 60000);
//   const diffHours = Math.floor(diffMs / 3600000);
//   const diffDays = Math.floor(diffMs / 86400000);

//   if (diffMins < 1) return 'just now';
//   if (diffMins < 60) return `${diffMins}m ago`;
//   if (diffHours < 24) return `${diffHours}h ago`;
//   if (diffDays < 7) return `${diffDays}d ago`;
  
//   return date.toLocaleDateString();
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: COLORS.card,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 8,
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 24,
//     fontWeight: '800',
//     color: COLORS.text,
//   },
//   offlineBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: COLORS.error,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   offlineBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   statsCard: {
//     backgroundColor: COLORS.card,
//     margin: 16,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   statsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: 16,
//   },
//   statsTitle: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: COLORS.text,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: COLORS.primary,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: COLORS.subtext,
//     marginTop: 4,
//   },
//   statSize: {
//     fontSize: 10,
//     color: COLORS.subtext,
//     marginTop: 2,
//   },
//   statsTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//   },
//   totalLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.text,
//   },
//   totalValue: {
//     fontSize: 14,
//     fontWeight: '800',
//     color: COLORS.primary,
//   },
//   emergencyButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.error,
//     marginHorizontal: 16,
//     marginBottom: 24,
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: COLORS.error,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   emergencyIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 16,
//   },
//   emergencyTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#fff',
//   },
//   emergencySubtitle: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.9)',
//     marginTop: 4,
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: 60,
//     marginTop: 40,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: COLORS.text,
//     marginTop: 16,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: COLORS.subtext,
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 8,
//     marginTop: 16,
//   },
//   sectionTitle: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '800',
//     color: COLORS.text,
//   },
//   countBadge: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   countText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.card,
//     marginHorizontal: 16,
//     marginBottom: 8,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   cardContent: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   cardIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: COLORS.text,
//     marginBottom: 4,
//   },
//   cardSubtitle: {
//     fontSize: 13,
//     color: COLORS.subtext,
//   },
//   deleteButton: {
//     padding: 16,
//   },
//   emptyStateSmall: {
//     alignItems: 'center',
//     padding: 30,
//     marginHorizontal: 16,
//     backgroundColor: COLORS.card,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderStyle: 'dashed',
//   },
//   emptyTextSmall: {
//     fontSize: 13,
//     color: COLORS.subtext,
//     marginTop: 8,
//   },
//   clearButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     backgroundColor: COLORS.card,
//     marginHorizontal: 16,
//     marginTop: 24,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: COLORS.error,
//   },
//   clearButtonText: {
//     fontSize: 14,
//     fontWeight: '800',
//     color: COLORS.error,
//   },
// });




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import {
  getOfflineItineraries,
  getOfflineBookings,
  getOfflineEvents,
  getStorageStats,
  clearAllOfflineData,
  removeOfflineItinerary,
  removeOfflineBooking,
  removeOfflineEvent,
} from '../utils/offlineStorage';
import { useNetworkStatus } from '../utils/networkStatus';
import EmergencyCitySelector from '../components/EmergencyCitySelector';
// ✅ Import EventDetailsSheet
import EventDetailsSheet from '../components/Events/EventDetailsSheet';

const COLORS = {
  primary: '#0c2444ff',
  background: '#F6FAFD',
  card: '#FFFFFF',
  text: '#0F3A6B',
  subtext: '#6B7280',
  border: '#EAF0F6',
  success: '#10B981',
  error: '#EF4444',
};

export default function OfflineScreen() {
  const navigation = useNavigation();
  const { isOnline } = useNetworkStatus();
  
  const [itineraries, setItineraries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [detectedCities, setDetectedCities] = useState([]);
  const [showCitySelector, setShowCitySelector] = useState(false);
  
  // ✅ State for event details modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadOfflineData();
    }, [])
  );

  const extractCitiesFromItineraries = (itinerariesList) => {
    const citiesSet = new Set();
    
    itinerariesList.forEach(itinerary => {
      if (itinerary.destination) {
        citiesSet.add(itinerary.destination);
      }
      if (itinerary.city) {
        citiesSet.add(itinerary.city);
      }
      if (itinerary.location) {
        citiesSet.add(itinerary.location);
      }
      
      if (itinerary.days && Array.isArray(itinerary.days)) {
        itinerary.days.forEach(day => {
          if (day.city) citiesSet.add(day.city);
          if (day.location) citiesSet.add(day.location);
          
          if (day.activities && Array.isArray(day.activities)) {
            day.activities.forEach(activity => {
              if (activity.city) citiesSet.add(activity.city);
              if (activity.location) citiesSet.add(activity.location);
            });
          }
        });
      }
      
      if (itinerary.destinations && Array.isArray(itinerary.destinations)) {
        itinerary.destinations.forEach(dest => {
          if (typeof dest === 'string') {
            citiesSet.add(dest);
          } else if (dest.city) {
            citiesSet.add(dest.city);
          } else if (dest.name) {
            citiesSet.add(dest.name);
          }
        });
      }
    });
    
    return Array.from(citiesSet).filter(city => city && city.trim() !== '');
  };

  const loadOfflineData = async () => {
    const [itins, books, evts, statistics] = await Promise.all([
      getOfflineItineraries(),
      getOfflineBookings(),
      getOfflineEvents(),
      getStorageStats(),
    ]);
    
    setItineraries(itins);
    setBookings(books);
    setEvents(evts);
    setStats(statistics);
    
    if (itins.length > 0) {
      const cities = extractCitiesFromItineraries(itins);
      setDetectedCities(cities);
      console.log('📍 Detected cities from itineraries:', cities);
    } else {
      setDetectedCities([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOfflineData();
    setRefreshing(false);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Offline Data',
      'This will remove all saved itineraries, bookings, and events. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await clearAllOfflineData();
            if (success) {
              loadOfflineData();
              Alert.alert('Success', 'All offline data cleared');
            }
          },
        },
      ]
    );
  };

  const handleDeleteItem = (type, id, title) => {
    Alert.alert(
      'Remove Offline Access',
      `Remove "${title}" from offline storage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            let success = false;
            if (type === 'itinerary') success = await removeOfflineItinerary(id);
            if (type === 'booking') success = await removeOfflineBooking(id);
            if (type === 'event') success = await removeOfflineEvent(id);
            
            if (success) loadOfflineData();
          },
        },
      ]
    );
  };

  // ✅ NEW: Show booking details when clicked
  const showBookingDetails = (booking) => {
    const title = booking.service_name || 'Booking Details';
    
    const detailsArray = [
      booking.city ? `📍 Location: ${booking.city}` : null,
      booking.chosen_date ? `📅 Date: ${booking.chosen_date}` : null,
      booking.participants ? `👥 Participants: ${booking.participants}` : null,
      booking.duration_hours ? `⏰ Duration: ${booking.duration_hours}` : null,
      booking.price_snapshot ? `💰 Price: Rs ${Number(booking.price_snapshot).toLocaleString()}` : null,
      booking.pricing_model ? `💳 Pricing Model: ${booking.pricing_model.replace(/_/g, ' ')}` : null,
      booking.status ? `\n✓ Status: ${booking.status.toUpperCase()}` : null,
      booking.vendor_name ? `\n👤 Host: ${booking.vendor_name}` : null,
      booking.vendor_email ? `📧 ${booking.vendor_email}` : null,
      booking.vendor_phone ? `📞 ${booking.vendor_country_code || ''}${booking.vendor_phone}` : null,
      booking.message ? `\n💬 Message:\n${booking.message}` : null,
      booking.savedAt ? `\n🕒 Saved: ${new Date(booking.savedAt).toLocaleString()}` : null,
    ].filter(Boolean);
    
    const details = detailsArray.join('\n');
    
    Alert.alert(
      title,
      details,
      [
        { text: 'OK', style: 'default' }
      ],
      { cancelable: true }
    );
  };

  const handleEmergencyPress = () => {
    const cities = detectedCities.length > 0 ? detectedCities : ['Islamabad'];
    
    if (cities.length === 1) {
      navigation.navigate('EmergencyInfo', { 
        city: cities[0],
        detectedFromItinerary: detectedCities.length > 0 
      });
    } else {
      setShowCitySelector(true);
    }
  };

  const handleCitySelect = (city) => {
    navigation.navigate('EmergencyInfo', { 
      city,
      detectedFromItinerary: detectedCities.includes(city),
      showCitySelector: city === 'Islamabad' && !detectedCities.includes('Islamabad')
    });
  };

  const totalItems = itineraries.length + bookings.length + events.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Offline Access</Text>
        
        {!isOnline ? (
          <View style={styles.offlineBadge}>
            <Ionicons name="cloud-offline" size={14} color="#fff" />
            <Text style={styles.offlineBadgeText}>Offline</Text>
          </View>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {stats && (
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Ionicons name="folder-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statsTitle}>Storage Usage</Text>
            </View>
            <View style={styles.statsGrid}>
              <StatItem label="Itineraries" value={stats.itineraries.count} size={`${stats.itineraries.size} KB`} />
              <StatItem label="Bookings" value={stats.bookings.count} size={`${stats.bookings.size} KB`} />
              <StatItem label="Events" value={stats.events.count} size={`${stats.events.size} KB`} />
            </View>
            <View style={styles.statsTotal}>
              <Text style={styles.totalLabel}>Total Storage</Text>
              <Text style={styles.totalValue}>{stats.total.size} KB • {stats.total.count} items</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyPress}
          activeOpacity={0.9}
        >
          <View style={styles.emergencyIcon}>
            <Ionicons name="medical" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>Emergency Information</Text>
            <Text style={styles.emergencySubtitle}>
              {detectedCities.length > 0 
                ? `${detectedCities.length} destination${detectedCities.length > 1 ? 's' : ''} • Police • Hospitals • Embassies`
                : 'Police • Hospitals • Embassies'
              }
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {totalItems === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-download-outline" size={64} color={COLORS.subtext} />
            <Text style={styles.emptyTitle}>No Offline Content</Text>
            <Text style={styles.emptyText}>
              Save itineraries, bookings, and events for offline access
            </Text>
          </View>
        )}

        {totalItems > 0 && (
          <>
            <SectionHeader
              title="Saved Itineraries"
              count={itineraries.length}
              icon="map-outline"
            />
            {itineraries.length === 0 ? (
              <EmptyState message="No itineraries saved offline" />
            ) : (
              itineraries.map((item) => {
                const destination = item.destination || item.city || 'Unknown Destination';
                const daysCount = Array.isArray(item.days) ? item.days.length : (item.days || 0);
                const savedTime = formatDate(item.savedAt);
                
                return (
                  <OfflineCard
                    key={item.id}
                    title={item.title || destination}
                    subtitle={`${destination} • ${daysCount} day${daysCount !== 1 ? 's' : ''} • Saved ${savedTime}`}
                    icon="map"
                    color="#3B82F6"
                    onPress={() => navigation.navigate('ItineraryDetails', { itinerary: item })}
                    onDelete={() => handleDeleteItem('itinerary', item.id, item.title || 'itinerary')}
                  />
                );
              })
            )}

            <SectionHeader
              title="Saved Bookings"
              count={bookings.length}
              icon="receipt-outline"
            />
            {bookings.length === 0 ? (
              <EmptyState message="No bookings saved offline" />
            ) : (
              bookings.map((item) => (
                <OfflineCard
                  key={item.id}
                  title={item.service_name || item.hotel_name || 'Booking'}
                  subtitle={`Booking #${item.id} • Saved ${formatDate(item.savedAt)}`}
                  icon="ticket"
                  color="#10B981"
                  onPress={() => showBookingDetails(item)} // ✅ FIXED: Now shows details!
                  onDelete={() => handleDeleteItem('booking', item.id, item.service_name || 'booking')}
                />
              ))
            )}

            <SectionHeader
              title="Saved Events"
              count={events.length}
              icon="calendar-outline"
            />
            {events.length === 0 ? (
              <EmptyState message="No events saved offline" />
            ) : (
              events.map((item) => (
                <OfflineCard
                  key={item.id}
                  title={item.title}
                  subtitle={`${item.city || 'Event'} • Saved ${formatDate(item.savedAt)}`}
                  icon="calendar"
                  color="#F59E0B"
                  // ✅ FIXED: Open event details modal
                  onPress={() => setSelectedEvent(item)}
                  onDelete={() => handleDeleteItem('event', item.id, item.title)}
                />
              ))
            )}

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
              activeOpacity={0.9}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              <Text style={styles.clearButtonText}>Clear All Offline Data</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {showCitySelector && (
        <EmergencyCitySelector
          visible={showCitySelector}
          cities={detectedCities}
          onSelectCity={handleCitySelect}
          onClose={() => setShowCitySelector(false)}
        />
      )}

      {/* ✅ Event Details Modal */}
      <EventDetailsSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        // Don't pass offline props since event is already offline
      />
    </SafeAreaView>
  );
}

function SectionHeader({ title, count, icon }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  );
}

function StatItem({ label, value, size }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSize}>{size}</Text>
    </View>
  );
}

function EmptyState({ message }) {
  return (
    <View style={styles.emptyStateSmall}>
      <Ionicons name="cloud-offline-outline" size={32} color={COLORS.subtext} />
      <Text style={styles.emptyTextSmall}>{message}</Text>
    </View>
  );
}

function OfflineCard({ title, subtitle, icon, color, onPress, onDelete }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={[styles.cardIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.subtext} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close-circle" size={24} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
}

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  offlineBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: COLORS.card,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 4,
  },
  statSize: {
    fontSize: 10,
    color: COLORS.subtext,
    marginTop: 2,
  },
  statsTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  emergencySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.subtext,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    marginTop: 16,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  deleteButton: {
    padding: 16,
  },
  emptyStateSmall: {
    alignItems: 'center',
    padding: 30,
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyTextSmall: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.error,
  },
});