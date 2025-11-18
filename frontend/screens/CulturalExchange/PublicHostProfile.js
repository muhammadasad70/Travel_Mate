// // screens/CulturalExchange/PublicHostProfile.js
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, ActivityIndicator,
//   TouchableOpacity, Alert, Platform, Image
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import getBaseURL from '../../config/env';

// const API_BASE = getBaseURL().replace(/\/+$/, '');

// export default function PublicHostProfile() {
//   const navigation = useNavigation();
//   const { params } = useRoute();
//   const vendorId = params?.vendorId;

//   const [loading, setLoading] = useState(true);
//   const [host, setHost] = useState(null);

//   useEffect(() => {
//     if (!vendorId) {
//       Alert.alert('Error', 'No vendor ID provided');
//       navigation.goBack();
//       return;
//     }

//     (async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_BASE}/users/${vendorId}/profile`);
//         const json = await res.json();
//         if (!res.ok) throw new Error(json?.error || 'Failed to load profile');
//         setHost(json);
//       } catch (e) {
//         Alert.alert('Error', e.message || 'Could not load host profile');
//         navigation.goBack();
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [vendorId]);

//   const getInitials = () => {
//     if (!host?.user) return 'H';
//     const first = (host.user.first_name || host.user.name || 'H').charAt(0).toUpperCase();
//     const last = (host.user.last_name || '').charAt(0).toUpperCase();
//     return first + last;
//   };

//   const getDisplayName = () => {
//     if (!host?.user) return 'Host';
//     if (host.user.name) return host.user.name;
//     const first = host.user.first_name || 'Host';
//     const lastInitial = host.user.last_name ? ` ${host.user.last_name.charAt(0)}.` : '';
//     return first + lastInitial;
//   };

//   const getMemberSince = () => {
//     if (!host?.user?.created_at) return 'Member';
//     const year = new Date(host.user.created_at).getFullYear();
//     return `Member since ${year}`;
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backTxt}>Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Host Profile</Text>
//         <View style={{ width: 72 }} />
//       </View>

//       <ScrollView contentContainerStyle={styles.wrap}>
//         {loading ? (
//           <View style={styles.loading}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading…</Text>
//           </View>
//         ) : !host ? (
//           <View style={styles.loading}>
//             <Text>Profile not found</Text>
//           </View>
//         ) : (
//           <>
//             <View style={styles.profileCard}>
//               {host.user?.avatar_url ? (
//                 <Image source={{ uri: host.user.avatar_url }} style={styles.avatarLarge} />
//               ) : (
//                 <View style={styles.avatarLargeFallback}>
//                   <Text style={styles.initialsLarge}>{getInitials()}</Text>
//                 </View>
//               )}
              
//               <View style={styles.nameContainer}>
//                 <View style={styles.nameRow}>
//                   <Text style={styles.nameText}>{getDisplayName()}</Text>
//                   {host.user?.is_verified && (
//                     <Ionicons name="checkmark-circle" size={22} color="#10B981" />
//                   )}
//                 </View>
//                 {host.user?.is_verified && (
//                   <Text style={styles.verifiedBadge}>Verified TravelMate Host</Text>
//                 )}
//               </View>

//               <View style={styles.statsRow}>
//                 <View style={styles.statItem}>
//                   <Ionicons name="calendar-outline" size={18} color="#6B7280" />
//                   <Text style={styles.statText}>{getMemberSince()}</Text>
//                 </View>
//                 {host.stats?.posts > 0 && (
//                   <View style={styles.statItem}>
//                     <Ionicons name="newspaper-outline" size={18} color="#6B7280" />
//                     <Text style={styles.statText}>{host.stats.posts} posts</Text>
//                   </View>
//                 )}
//               </View>
//             </View>

//             <View style={styles.infoCard}>
//               <Text style={styles.cardTitle}>About</Text>
//               {host.user?.country && (
//                 <View style={styles.infoRow}>
//                   <Ionicons name="location-outline" size={16} color="#475569" />
//                   <Text style={styles.infoText}>{host.user.country}</Text>
//                 </View>
//               )}
//               <View style={styles.infoRow}>
//                 <Ionicons name="person-outline" size={16} color="#475569" />
//                 <Text style={styles.infoText}>Role: {host.user?.role || 'Vendor'}</Text>
//               </View>
//             </View>

//             <View style={styles.noteCard}>
//               <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
//               <Text style={styles.noteText}>
//                 Contact details will be available after booking confirmation
//               </Text>
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     paddingHorizontal: 12,
//     paddingTop: 8,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E2E8F0',
//     backgroundColor: '#f7f9fc',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#F1F5F9',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 999,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   backTxt: { fontWeight: '800', color: '#0f172a' },
//   headerTitle: { fontWeight: '800', color: '#0f172a' },
//   wrap: { padding: 14, paddingBottom: 28 },
//   loading: { alignItems: 'center', padding: 24 },
  
//   profileCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#E6EDF7',
//     padding: 16,
//     alignItems: 'center',
//     gap: 12,
//   },
//   avatarLarge: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#E5E7EB',
//   },
//   avatarLargeFallback: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#0ea5e9',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   initialsLarge: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#fff',
//   },
//   nameContainer: {
//     alignItems: 'center',
//     gap: 4,
//   },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   nameText: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#0f172a',
//   },
//   verifiedBadge: {
//     fontSize: 13,
//     color: '#10B981',
//     fontWeight: '700',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     gap: 16,
//     marginTop: 8,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   statText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
  
//   infoCard: {
//     marginTop: 12,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E6EDF7',
//     borderRadius: 14,
//     padding: 12,
//     gap: 8,
//   },
//   cardTitle: {
//     fontWeight: '800',
//     color: '#0f172a',
//     marginBottom: 4,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#0f172a',
//     fontWeight: '600',
//   },
  
//   noteCard: {
//     marginTop: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     backgroundColor: '#EEF2FF',
//     borderColor: '#C7D2FE',
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 12,
//   },
//   noteText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#4338CA',
//     fontWeight: '600',
//   },
// });



// screens/CulturalExchange/PublicHostProfile.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Alert, Platform, Image, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import getBaseURL from '../../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');

export default function PublicHostProfile() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const vendorId = params?.vendorId;
  const isConfirmed = params?.isConfirmed || false;
  
  // Contact details passed from confirmed booking
  const vendorEmail = params?.vendorEmail;
  const vendorPhone = params?.vendorPhone;
  const vendorCountryCode = params?.vendorCountryCode;
  const vendorName = params?.vendorName;

  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState(null);

  useEffect(() => {
    if (!vendorId) {
      Alert.alert('Error', 'No vendor ID provided');
      navigation.goBack();
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/users/${vendorId}/profile`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load profile');
        setHost(json);
      } catch (e) {
        Alert.alert('Error', e.message || 'Could not load host profile');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId]);

  const getInitials = () => {
    if (!host?.user) return 'H';
    const first = (host.user.first_name || host.user.name || 'H').charAt(0).toUpperCase();
    const last = (host.user.last_name || '').charAt(0).toUpperCase();
    return first + last;
  };

  const getDisplayName = () => {
    if (vendorName) return vendorName; // Use passed name from booking
    if (!host?.user) return 'Host';
    if (host.user.name) return host.user.name;
    const first = host.user.first_name || 'Host';
    const lastInitial = host.user.last_name ? ` ${host.user.last_name.charAt(0)}.` : '';
    return first + lastInitial;
  };

  const getMemberSince = () => {
    if (!host?.user?.created_at) return 'Member';
    const year = new Date(host.user.created_at).getFullYear();
    return `Member since ${year}`;
  };

  const callVendor = () => {
    const fullNumber = `${vendorCountryCode || ''}${vendorPhone || ''}`.replace(/\s/g, '');
    if (fullNumber) {
      Linking.openURL(`tel:${fullNumber}`);
    }
  };

  const emailVendor = () => {
    if (vendorEmail) {
      Linking.openURL(`mailto:${vendorEmail}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Host Profile</Text>
        <View style={{ width: 72 }} />
      </View>

      <ScrollView contentContainerStyle={styles.wrap}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading…</Text>
          </View>
        ) : !host ? (
          <View style={styles.loading}>
            <Text>Profile not found</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileCard}>
              {host.user?.avatar_url ? (
                <Image source={{ uri: host.user.avatar_url }} style={styles.avatarLarge} />
              ) : (
                <View style={styles.avatarLargeFallback}>
                  <Text style={styles.initialsLarge}>{getInitials()}</Text>
                </View>
              )}
              
              <View style={styles.nameContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>{getDisplayName()}</Text>
                  {host.user?.is_verified && (
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  )}
                </View>
                {host.user?.is_verified && (
                  <Text style={styles.verifiedBadge}>Verified TravelMate Host</Text>
                )}
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                  <Text style={styles.statText}>{getMemberSince()}</Text>
                </View>
                {host.stats?.posts > 0 && (
                  <View style={styles.statItem}>
                    <Ionicons name="newspaper-outline" size={18} color="#6B7280" />
                    <Text style={styles.statText}>{host.stats.posts} posts</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>About</Text>
              {host.user?.country && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color="#475569" />
                  <Text style={styles.infoText}>{host.user.country}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#475569" />
                <Text style={styles.infoText}>Role: {host.user?.role || 'Vendor'}</Text>
              </View>
            </View>

            {/* Show contact details if confirmed booking */}
            {isConfirmed ? (
              <View style={styles.contactCard}>
                <Text style={styles.contactCardTitle}>Contact Details</Text>
                <Text style={styles.contactSubtitle}>Booking confirmed - you can now contact the host</Text>
                
                {vendorEmail && (
                  <TouchableOpacity style={styles.contactRow} onPress={emailVendor}>
                    <Ionicons name="mail-outline" size={18} color="#0ea5e9" />
                    <Text style={[styles.contactText, { color: '#0ea5e9' }]}>{vendorEmail}</Text>
                  </TouchableOpacity>
                )}
                
                {vendorPhone && (
                  <TouchableOpacity style={styles.contactRow} onPress={callVendor}>
                    <Ionicons name="call-outline" size={18} color="#10B981" />
                    <Text style={[styles.contactText, { color: '#10B981' }]}>
                      {vendorCountryCode}{vendorPhone}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.noteCard}>
                <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
                <Text style={styles.noteText}>
                  Contact details will be available after booking confirmation
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#f7f9fc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backTxt: { fontWeight: '800', color: '#0f172a' },
  headerTitle: { fontWeight: '800', color: '#0f172a' },
  wrap: { padding: 14, paddingBottom: 28 },
  loading: { alignItems: 'center', padding: 24 },
  
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EDF7',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  avatarLargeFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsLarge: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  nameContainer: {
    alignItems: 'center',
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  verifiedBadge: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  
  infoCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6EDF7',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  cardTitle: {
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  
  contactCard: {
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  contactCardTitle: {
    fontWeight: '800',
    color: '#065F46',
    fontSize: 16,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  contactText: {
    fontSize: 15,
    fontWeight: '600',
  },
  
  noteCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#4338CA',
    fontWeight: '600',
  },
});