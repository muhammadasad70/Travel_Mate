// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
//   Share as RNShare,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';

// const API_BASE = getBaseURL().replace(/\/+$/, '');

// const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };

// export default function SavedAIItinerariesScreen() {
//   const navigation = useNavigation();
//   const [itineraries, setItineraries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [deleting, setDeleting] = useState(null);

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchSavedItineraries();
//     }, [])
//   );

//   const fetchSavedItineraries = async () => {
//     try {
//       const token = await getAuthToken();
//       console.log('📡 Fetching saved itineraries...');
      
//       const response = await fetch(`${API_BASE}/recommendations/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log('📥 Fetch response status:', response.status);

//       if (response.ok) {
//         const data = await response.json();
//         console.log('📦 Received data:', data);
//         console.log('📦 Number of itineraries:', data.itineraries?.length);
        
//         if (data.itineraries && data.itineraries.length > 0) {
//           console.log('📦 First itinerary:', data.itineraries[0]);
//           console.log('📦 First itinerary ID:', data.itineraries[0].id);
//           console.log('📦 ID type:', typeof data.itineraries[0].id);
//         }
        
//         setItineraries(data.itineraries || []);
//       } else {
//         const text = await response.text();
//         console.error('❌ Fetch failed:', text);
//       }
//     } catch (err) {
//       console.error('❌ Fetch exception:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchSavedItineraries();
//   };

//   // ✅ Updated share handler - Descriptive text, NO broken links
//   const handleShare = async (itin) => {
//     try {
//       const message = `🤖 AI-recommended travel experience!

// 🌍 ${itin.title}
// 📍 ${itin.city}

// ${itin.description}

// 💰 Budget: ${itin.budget}
// ✈️ Style: ${itin.style}
// ⏱️ Duration: ${itin.duration}

// ✨ Highlights:
// ${itin.highlights.slice(0, 5).map((h, i) => `${i + 1}. ${h}`).join('\n')}

// Find more on TravelMate! 🎯`;

//       if (Platform.OS === 'web') {
//         if (navigator.share) {
//           await navigator.share({ title: itin.title, text: message });
//         } else if (navigator.clipboard) {
//           await navigator.clipboard.writeText(message);
//           Alert.alert('Copied!', 'Itinerary copied to clipboard. Paste it anywhere!');
//         } else {
//           // Ultimate fallback for old browsers
//           alert(message);
//         }
//       } else {
//         await RNShare.share({ title: itin.title, message: message });
//       }
//       console.log('✅ AI Recommendation shared:', itin.title);
//     } catch (error) {
//       if (error.message !== 'User cancelled' && error.name !== 'AbortError') {
//         console.error('Share error:', error);
//         Alert.alert('Error', 'Failed to share itinerary');
//       }
//     }
//   };

//   const handleDelete = (itin) => {
//     console.log('🔴 handleDelete called for:', itin.id);
    
//     if (Platform.OS === 'web') {
//       if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
//         deleteItinerary(itin);
//       }
//     } else {
//       Alert.alert(
//         'Delete Itinerary',
//         'Are you sure you want to delete this itinerary? This action cannot be undone.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           {
//             text: 'Delete',
//             style: 'destructive',
//             onPress: () => deleteItinerary(itin),
//           },
//         ]
//       );
//     }
//   };

//   const deleteItinerary = async (itin) => {
//     const itinId = itin.id;
    
//     console.log('🗑️  DELETE ATTEMPT:');
//     console.log('   Full object:', itin);
//     console.log('   ID:', itinId);
//     console.log('   ID Type:', typeof itinId);

//     if (!itinId || itinId === undefined || itinId === null) {
//       console.error('❌ INVALID ID:', itinId);
//       Alert.alert('Error', 'Invalid itinerary ID');
//       return;
//     }

//     setDeleting(itinId);

//     try {
//       const token = await getAuthToken();
//       const url = `${API_BASE}/recommendations/saved/${itinId}`;

//       console.log('📡 DELETE URL:', url);

//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('📥 Response Status:', response.status);

//       const text = await response.text();
//       console.log('📥 Response Body:', text);

//       if (response.ok) {
//         console.log('✅ Delete successful');
//         setItineraries(prev => prev.filter(item => item.id !== itinId));
//         Alert.alert('Success', 'Itinerary deleted successfully');
//       } else {
//         console.error('❌ Delete failed');
//         try {
//           const data = JSON.parse(text);
//           Alert.alert('Error', data.error || 'Failed to delete itinerary');
//         } catch {
//           Alert.alert('Error', text || 'Failed to delete itinerary');
//         }
//       }
//     } catch (err) {
//       console.error('❌ Delete exception:', err);
//       Alert.alert('Error', 'Network error: ' + err.message);
//     } finally {
//       setDeleting(null);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#8b5cf6" />
//         <Text style={styles.loadingText}>Loading your itineraries...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1f2937" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Saved AI Itineraries</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {itineraries.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="bookmark-outline" size={80} color="#d1d5db" />
//           <Text style={styles.emptyTitle}>No Saved Itineraries Yet</Text>
//           <Text style={styles.emptyText}>
//             Generate AI recommendations and save your favorite plans
//           </Text>
//           <TouchableOpacity
//             style={styles.emptyButton}
//             onPress={() => navigation.navigate('AIRecommendationsFormScreen')}
//           >
//             <Ionicons name="bulb-outline" size={20} color="#fff" />
//             <Text style={styles.emptyButtonText}>Generate Itineraries</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <ScrollView
//           style={styles.scroll}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8b5cf6']} />
//           }
//         >
//           {itineraries.map((itin) => {
//             const isDeleting = deleting === itin.id;
            
//             return (
//               <View key={itin.id} style={styles.card}>
//                 <View style={styles.cardHeader}>
//                   <View style={styles.cityBadge}>
//                     <Ionicons name="location" size={12} color="#fff" />
//                     <Text style={styles.cityText}>{itin.city}</Text>
//                   </View>
//                   <View style={styles.savedBadge}>
//                     <Ionicons name="bookmark" size={14} color="#f59e0b" />
//                     <Text style={styles.savedText}>Saved</Text>
//                   </View>
//                 </View>

//                 <Text style={styles.cardTitle}>{itin.title}</Text>
//                 <Text style={styles.cardDescription}>{itin.description}</Text>

//                 <View style={styles.metaRow}>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="cash-outline" size={14} color="#6b7280" />
//                     <Text style={styles.metaText}>{itin.budget}</Text>
//                   </View>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="compass-outline" size={14} color="#6b7280" />
//                     <Text style={styles.metaText}>{itin.style}</Text>
//                   </View>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="time-outline" size={14} color="#6b7280" />
//                     <Text style={styles.metaText}>{itin.duration}</Text>
//                   </View>
//                 </View>

//                 <View style={styles.highlightsContainer}>
//                   <Text style={styles.highlightsTitle}>Highlights:</Text>
//                   {itin.highlights.slice(0, 4).map((highlight, i) => (
//                     <View key={i} style={styles.highlightItem}>
//                       <Text style={styles.highlightDot}>•</Text>
//                       <Text style={styles.highlightText}>{highlight}</Text>
//                     </View>
//                   ))}
//                 </View>

//                 {/* ✅ Action Buttons - Descriptive sharing, no broken links */}
//                 <View style={styles.actionButtons}>
//                   <TouchableOpacity
//                     style={styles.actionBtn}
//                     onPress={() => handleShare(itin)}
//                   >
//                     <Ionicons name="share-social-outline" size={16} color="#8b5cf6" />
//                     <Text style={styles.actionBtnText}>Share</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[styles.actionBtn, isDeleting && { opacity: 0.5 }]}
//                     onPress={() => {
//                       console.log('🔴 DELETE BUTTON CLICKED for ID:', itin.id);
//                       handleDelete(itin);
//                     }}
//                     disabled={isDeleting}
//                   >
//                     {isDeleting ? (
//                       <ActivityIndicator size="small" color="#dc2626" />
//                     ) : (
//                       <>
//                         <Ionicons name="trash-outline" size={16} color="#dc2626" />
//                         <Text style={[styles.actionBtnText, { color: '#dc2626' }]}>Delete</Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             );
//           })}
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F9FC',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F7F9FC',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#1f2937',
//   },
//   scroll: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: '#1f2937',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#6b7280',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   emptyButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#8b5cf6',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },
//   emptyButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   cityBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#8b5cf6',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   cityText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   savedBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fef3c7',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     gap: 4,
//   },
//   savedText: {
//     color: '#f59e0b',
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#1f2937',
//     marginBottom: 8,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: '#6b7280',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   metaRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 12,
//     color: '#4b5563',
//     fontWeight: '600',
//   },
//   highlightsContainer: {
//     marginTop: 8,
//     marginBottom: 12,
//   },
//   highlightsTitle: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#1f2937',
//     marginBottom: 6,
//   },
//   highlightItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 4,
//   },
//   highlightDot: {
//     color: '#8b5cf6',
//     marginRight: 6,
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   highlightText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#4b5563',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 8,
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f3f4f6',
//   },
//   actionBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 4,
//     flex: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },
//   actionBtnText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#8b5cf6',
//   },
// });


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Share as RNShare,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');

const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

export default function SavedAIItinerariesScreen() {
  const navigation = useNavigation();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedItineraries();
    }, [])
  );

  const fetchSavedItineraries = async () => {
    try {
      const token = await getAuthToken();
      console.log('📡 Fetching saved itineraries...');
      
      const response = await fetch(`${API_BASE}/recommendations/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📥 Fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Received data:', data);
        console.log('📦 Number of itineraries:', data.itineraries?.length);
        
        if (data.itineraries && data.itineraries.length > 0) {
          console.log('📦 First itinerary:', data.itineraries[0]);
          console.log('📦 First itinerary ID:', data.itineraries[0].id);
          console.log('📦 ID type:', typeof data.itineraries[0].id);
        }
        
        setItineraries(data.itineraries || []);
      } else {
        const text = await response.text();
        console.error('❌ Fetch failed:', text);
      }
    } catch (err) {
      console.error('❌ Fetch exception:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSavedItineraries();
  };

  const handleShare = async (itin) => {
    try {
      const message = `🤖 AI-recommended travel experience!

🌍 ${itin.title}
📍 ${itin.city}

${itin.description}

💰 Budget: ${itin.budget}
✈️ Style: ${itin.style}
⏱️ Duration: ${itin.duration}

✨ Highlights:
${itin.highlights.slice(0, 5).map((h, i) => `${i + 1}. ${h}`).join('\n')}

Find more on TravelMate! 🎯`;

      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({ title: itin.title, text: message });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(message);
          Alert.alert('Copied!', 'Itinerary copied to clipboard. Paste it anywhere!');
        } else {
          alert(message);
        }
      } else {
        await RNShare.share({ title: itin.title, message: message });
      }
      console.log('✅ AI Recommendation shared:', itin.title);
    } catch (error) {
      if (error.message !== 'User cancelled' && error.name !== 'AbortError') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Failed to share itinerary');
      }
    }
  };

  const handleDelete = (itin) => {
    console.log('🔴 handleDelete called for:', itin.id);
    
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
        deleteItinerary(itin);
      }
    } else {
      Alert.alert(
        'Delete Itinerary',
        'Are you sure you want to delete this itinerary? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteItinerary(itin),
          },
        ]
      );
    }
  };

  const deleteItinerary = async (itin) => {
    const itinId = itin.id;
    
    console.log('🗑️  DELETE ATTEMPT:');
    console.log('   Full object:', itin);
    console.log('   ID:', itinId);
    console.log('   ID Type:', typeof itinId);

    if (!itinId || itinId === undefined || itinId === null) {
      console.error('❌ INVALID ID:', itinId);
      Alert.alert('Error', 'Invalid itinerary ID');
      return;
    }

    setDeleting(itinId);

    try {
      const token = await getAuthToken();
      const url = `${API_BASE}/recommendations/saved/${itinId}`;

      console.log('📡 DELETE URL:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response Status:', response.status);

      const text = await response.text();
      console.log('📥 Response Body:', text);

      if (response.ok) {
        console.log('✅ Delete successful');
        setItineraries(prev => prev.filter(item => item.id !== itinId));
        Alert.alert('Success', 'Itinerary deleted successfully');
      } else {
        console.error('❌ Delete failed');
        try {
          const data = JSON.parse(text);
          Alert.alert('Error', data.error || 'Failed to delete itinerary');
        } catch {
          Alert.alert('Error', text || 'Failed to delete itinerary');
        }
      }
    } catch (err) {
      console.error('❌ Delete exception:', err);
      Alert.alert('Error', 'Network error: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Loading your itineraries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved AI Itineraries</Text>
          <View style={styles.headerButton} />
        </View>

        {itineraries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={80} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Saved Itineraries Yet</Text>
            <Text style={styles.emptyText}>
              Generate AI recommendations and save your favorite plans
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AIRecommendationsFormScreen')}
            >
              <Ionicons name="bulb-outline" size={20} color="#fff" />
              <Text style={styles.emptyButtonText}>Generate Itineraries</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8b5cf6']} />
            }
          >
            {itineraries.map((itin) => {
              const isDeleting = deleting === itin.id;
              
              return (
                <View key={itin.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cityBadge}>
                      <Ionicons name="location" size={12} color="#fff" />
                      <Text style={styles.cityText}>{itin.city}</Text>
                    </View>
                    <View style={styles.savedBadge}>
                      <Ionicons name="bookmark" size={14} color="#f59e0b" />
                      <Text style={styles.savedText}>Saved</Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{itin.title}</Text>
                  <Text style={styles.cardDescription}>{itin.description}</Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="cash-outline" size={14} color="#6b7280" />
                      <Text style={styles.metaText}>{itin.budget}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="compass-outline" size={14} color="#6b7280" />
                      <Text style={styles.metaText}>{itin.style}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text style={styles.metaText}>{itin.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.highlightsContainer}>
                    <Text style={styles.highlightsTitle}>Highlights:</Text>
                    {itin.highlights.slice(0, 4).map((highlight, i) => (
                      <View key={i} style={styles.highlightItem}>
                        <Text style={styles.highlightDot}>•</Text>
                        <Text style={styles.highlightText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleShare(itin)}
                    >
                      <Ionicons name="share-social-outline" size={16} color="#8b5cf6" />
                      <Text style={styles.actionBtnText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, isDeleting && { opacity: 0.5 }]}
                      onPress={() => {
                        console.log('🔴 DELETE BUTTON CLICKED for ID:', itin.id);
                        handleDelete(itin);
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#dc2626" />
                      ) : (
                        <>
                          <Ionicons name="trash-outline" size={16} color="#dc2626" />
                          <Text style={[styles.actionBtnText, { color: '#dc2626' }]}>Delete</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  cityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  savedText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '600',
  },
  highlightsContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  highlightsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  highlightDot: {
    color: '#8b5cf6',
    marginRight: 6,
    fontSize: 14,
    fontWeight: '700',
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: '#4b5563',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8b5cf6',
  },
});