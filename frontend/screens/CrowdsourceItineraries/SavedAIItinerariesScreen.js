

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
//   SafeAreaView,
//   StatusBar,
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
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#8b5cf6" />
//           <Text style={styles.loadingText}>Loading your itineraries...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
//             <Ionicons name="arrow-back" size={24} color="#1f2937" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Saved AI Itineraries</Text>
//           <View style={styles.headerButton} />
//         </View>

//         {itineraries.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Ionicons name="bookmark-outline" size={80} color="#d1d5db" />
//             <Text style={styles.emptyTitle}>No Saved Itineraries Yet</Text>
//             <Text style={styles.emptyText}>
//               Generate AI recommendations and save your favorite plans
//             </Text>
//             <TouchableOpacity
//               style={styles.emptyButton}
//               onPress={() => navigation.navigate('AIRecommendationsFormScreen')}
//             >
//               <Ionicons name="bulb-outline" size={20} color="#fff" />
//               <Text style={styles.emptyButtonText}>Generate Itineraries</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <ScrollView
//             style={styles.scroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             refreshControl={
//               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8b5cf6']} />
//             }
//           >
//             {itineraries.map((itin) => {
//               const isDeleting = deleting === itin.id;
              
//               return (
//                 <View key={itin.id} style={styles.card}>
//                   <View style={styles.cardHeader}>
//                     <View style={styles.cityBadge}>
//                       <Ionicons name="location" size={12} color="#fff" />
//                       <Text style={styles.cityText}>{itin.city}</Text>
//                     </View>
//                     <View style={styles.savedBadge}>
//                       <Ionicons name="bookmark" size={14} color="#f59e0b" />
//                       <Text style={styles.savedText}>Saved</Text>
//                     </View>
//                   </View>

//                   <Text style={styles.cardTitle}>{itin.title}</Text>
//                   <Text style={styles.cardDescription}>{itin.description}</Text>

//                   <View style={styles.metaRow}>
//                     <View style={styles.metaItem}>
//                       <Ionicons name="cash-outline" size={14} color="#6b7280" />
//                       <Text style={styles.metaText}>{itin.budget}</Text>
//                     </View>
//                     <View style={styles.metaItem}>
//                       <Ionicons name="compass-outline" size={14} color="#6b7280" />
//                       <Text style={styles.metaText}>{itin.style}</Text>
//                     </View>
//                     <View style={styles.metaItem}>
//                       <Ionicons name="time-outline" size={14} color="#6b7280" />
//                       <Text style={styles.metaText}>{itin.duration}</Text>
//                     </View>
//                   </View>

//                   <View style={styles.highlightsContainer}>
//                     <Text style={styles.highlightsTitle}>Highlights:</Text>
//                     {itin.highlights.slice(0, 4).map((highlight, i) => (
//                       <View key={i} style={styles.highlightItem}>
//                         <Text style={styles.highlightDot}>•</Text>
//                         <Text style={styles.highlightText}>{highlight}</Text>
//                       </View>
//                     ))}
//                   </View>

//                   <View style={styles.actionButtons}>
//                     <TouchableOpacity
//                       style={styles.actionBtn}
//                       onPress={() => handleShare(itin)}
//                     >
//                       <Ionicons name="share-social-outline" size={16} color="#8b5cf6" />
//                       <Text style={styles.actionBtnText}>Share</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={[styles.actionBtn, isDeleting && { opacity: 0.5 }]}
//                       onPress={() => {
//                         console.log('🔴 DELETE BUTTON CLICKED for ID:', itin.id);
//                         handleDelete(itin);
//                       }}
//                       disabled={isDeleting}
//                     >
//                       {isDeleting ? (
//                         <ActivityIndicator size="small" color="#dc2626" />
//                       ) : (
//                         <>
//                           <Ionicons name="trash-outline" size={16} color="#dc2626" />
//                           <Text style={[styles.actionBtnText, { color: '#dc2626' }]}>Delete</Text>
//                         </>
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               );
//             })}
//           </ScrollView>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
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
//   headerButton: {
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#1f2937',
//   },
//   scroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 40,
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

// ✅ Import offline storage functions
import { 
  saveItineraryOffline, 
  isItinerarySavedOffline,
  removeOfflineItinerary 
} from '../../utils/offlineStorage';

const API_BASE = getBaseURL().replace(/\/+$/, '');

const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

// ✅ Helper function to parse AI highlights into day structure for display
const parseHighlightsForDisplay = (highlights) => {
  if (!highlights || !Array.isArray(highlights)) return [];
  
  return highlights.map((highlight, index) => {
    // Extract day number
    const dayMatch = highlight.match(/Day (\d+)/i);
    const dayNumber = dayMatch ? parseInt(dayMatch[1]) : index + 1;
    
    // Extract content after colon and weather info
    const contentMatch = highlight.match(/Day \d+[^:]*:\s*(.+)/i);
    let content = contentMatch ? contentMatch[1] : highlight;
    
    // Split on " - " to get place
    const parts = content.split(' - ');
    let place = 'Activity';
    
    if (parts.length >= 2) {
      place = parts.slice(1).join(' - ').split('(')[0].trim();
    } else {
      place = content.split('(')[0].trim();
    }
    
    return {
      dayNumber,
      place: place || `Day ${dayNumber} Activity`,
      fullDescription: highlight,
    };
  });
};

export default function SavedAIItinerariesScreen() {
  const navigation = useNavigation();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(null);
  
  // ✅ Track offline status for each itinerary
  const [offlineStatus, setOfflineStatus] = useState({});
  const [downloading, setDownloading] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedItineraries();
    }, [])
  );

  // ✅ Check offline status for all itineraries
  const checkOfflineStatus = async (itinerariesList) => {
    const statusMap = {};
    for (const itin of itinerariesList) {
      const isSaved = await isItinerarySavedOffline(itin.id);
      statusMap[itin.id] = isSaved;
    }
    setOfflineStatus(statusMap);
  };

  const fetchSavedItineraries = async () => {
    try {
      const token = await getAuthToken();
      
      const response = await fetch(`${API_BASE}/recommendations/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const itins = data.itineraries || [];
        setItineraries(itins);
        
        // ✅ Check offline status for all itineraries
        await checkOfflineStatus(itins);
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

  // ✅ Handle download for offline
  const handleDownloadOffline = async (itin) => {
    setDownloading(itin.id);
    
    try {
      // ✅ Convert highlights to days structure for offline compatibility
      const convertHighlightsToDays = (highlights) => {
        if (!highlights || !Array.isArray(highlights)) return [];
        
        return highlights.map((highlight, index) => {
          // Extract day number and content
          const dayMatch = highlight.match(/Day (\d+)/i);
          const dayNumber = dayMatch ? parseInt(dayMatch[1]) : index + 1;
          
          // Try to extract the main content after the colon and weather info
          // Format: "Day 1 (Clear, 7-17°C): Outdoor activity - Hiking in Kumrat Valley (Perfect weather)"
          const contentMatch = highlight.match(/Day \d+[^:]*:\s*(.+)/i);
          let content = contentMatch ? contentMatch[1] : highlight;
          
          // Split on " - " to get the actual place/activity
          const parts = content.split(' - ');
          
          // The place is usually after the first " - "
          let place = 'Day Activity';
          let activities = highlight;
          
          if (parts.length >= 2) {
            // "Hiking in Kumrat Valley (Perfect weather)" is the place
            place = parts.slice(1).join(' - ').split('(')[0].trim();
            activities = content;
          } else {
            // If no " - ", just use the content
            place = content.split('(')[0].trim();
          }
          
          return {
            id: index + 1,
            day_number: dayNumber,
            place: place || `Day ${dayNumber} Activity`,
            place_source: 'ai_generated',
            activities: highlight, // Keep full highlight with weather info
            start_time: '09:00',
            end_time: '17:00',
          };
        });
      };
      
      // Normalize the AI itinerary to match regular itinerary structure
      const normalizedItinerary = {
        id: itin.id,
        user_id: 1,
        title: itin.title,
        description: itin.description,
        city: itin.city,
        destination: itin.city,
        budget: itin.budget,
        style: itin.style,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + (2 * 24 * 60 * 60 * 1000)).toISOString(), // 2 days from now
        created_at: new Date().toISOString(),
        days: convertHighlightsToDays(itin.highlights), // ✅ Convert highlights to days
        isAIGenerated: true, // ✅ Mark as AI-generated
        originalHighlights: itin.highlights, // ✅ Keep original highlights
        savedAt: new Date().toISOString(),
      };
      
      console.log('💾 Saving AI itinerary offline:', normalizedItinerary);
      console.log('📅 Converted days:', normalizedItinerary.days);
      
      const success = await saveItineraryOffline(normalizedItinerary);
      
      if (success) {
        setOfflineStatus(prev => ({ ...prev, [itin.id]: true }));
        Alert.alert(
          '✓ Downloaded for Offline',
          `"${itin.title}" is now available offline.\n\nAccess it from: Profile → Offline`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Could not save itinerary offline');
      }
    } catch (error) {
      console.error('Download offline error:', error);
      Alert.alert('Error', 'Failed to download for offline access');
    } finally {
      setDownloading(null);
    }
  };

  // ✅ Handle remove from offline
  const handleRemoveOffline = async (itin) => {
    Alert.alert(
      'Remove Offline Access',
      'Remove this itinerary from offline storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removeOfflineItinerary(itin.id);
            if (success) {
              setOfflineStatus(prev => ({ ...prev, [itin.id]: false }));
              Alert.alert('Removed', 'Itinerary removed from offline storage');
            }
          },
        },
      ]
    );
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
    
    if (!itinId || itinId === undefined || itinId === null) {
      Alert.alert('Error', 'Invalid itinerary ID');
      return;
    }

    setDeleting(itinId);

    try {
      const token = await getAuthToken();
      const url = `${API_BASE}/recommendations/saved/${itinId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // ✅ Also remove from offline storage if saved
        if (offlineStatus[itinId]) {
          await removeOfflineItinerary(itinId);
        }
        
        setItineraries(prev => prev.filter(item => item.id !== itinId));
        Alert.alert('Success', 'Itinerary deleted successfully');
      } else {
        const text = await response.text();
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
              const isDownloading = downloading === itin.id;
              const isSavedOffline = offlineStatus[itin.id];
              
              // ✅ Parse highlights into day structure
              const parsedDays = parseHighlightsForDisplay(itin.highlights);
              
              return (
                <View key={itin.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cityBadge}>
                      <Ionicons name="location" size={12} color="#fff" />
                      <Text style={styles.cityText}>{itin.city}</Text>
                    </View>
                    <View style={styles.badgesRow}>
                      {/* ✅ Offline Badge */}
                      {isSavedOffline && (
                        <View style={styles.offlineBadge}>
                          <Ionicons name="cloud-done" size={12} color="#10B981" />
                          <Text style={styles.offlineText}>Offline</Text>
                        </View>
                      )}
                      <View style={styles.savedBadge}>
                        <Ionicons name="bookmark" size={14} color="#f59e0b" />
                        <Text style={styles.savedText}>Saved</Text>
                      </View>
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

                  {/* ✅ Updated: Day-by-day structure instead of bullet highlights */}
                  <View style={styles.daysContainer}>
                    <Text style={styles.daysTitle}>Day-by-Day Plan:</Text>
                    {parsedDays.map((day, i) => (
                      <View key={i} style={styles.dayItem}>
                        <View style={styles.dayHeader}>
                          <View style={styles.dayNumberBadge}>
                            <Text style={styles.dayNumberText}>Day {day.dayNumber}</Text>
                          </View>
                          <Text style={styles.dayPlace} numberOfLines={2}>
                            {day.place}
                          </Text>
                        </View>
                        <Text style={styles.dayDescription}>{day.fullDescription}</Text>
                      </View>
                    ))}
                  </View>

                  {/* ✅ Updated Action Buttons with Download for Offline */}
                  <View style={styles.actionButtons}>
                    {/* Download/Remove Offline Button */}
                    {!isSavedOffline ? (
                      <TouchableOpacity
                        style={[styles.actionBtn, isDownloading && { opacity: 0.5 }]}
                        onPress={() => handleDownloadOffline(itin)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <ActivityIndicator size="small" color="#10B981" />
                        ) : (
                          <>
                            <Ionicons name="cloud-download-outline" size={16} color="#10B981" />
                            <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Download</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleRemoveOffline(itin)}
                      >
                        <Ionicons name="cloud-done" size={16} color="#10B981" />
                        <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Offline</Text>
                      </TouchableOpacity>
                    )}

                    {/* Share Button */}
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleShare(itin)}
                    >
                      <Ionicons name="share-social-outline" size={16} color="#8b5cf6" />
                      <Text style={styles.actionBtnText}>Share</Text>
                    </TouchableOpacity>

                    {/* Delete Button */}
                    <TouchableOpacity
                      style={[styles.actionBtn, isDeleting && { opacity: 0.5 }]}
                      onPress={() => handleDelete(itin)}
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
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
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
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  offlineText: {
    color: '#10B981',
    fontSize: 11,
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
  daysContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  daysTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  dayItem: {
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  dayNumberBadge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dayNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  dayPlace: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  dayDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
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