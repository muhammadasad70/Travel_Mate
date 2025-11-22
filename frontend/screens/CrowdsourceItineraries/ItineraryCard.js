
// // // // screens/CrowdsourceItineraries/ItineraryCard.js
// // // import React, { useEffect, useState } from "react";
// // // import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Pressable, Alert } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";

// // // /* 🔹 NEW: offline helpers */
// // // import { downloadItinerary, listOfflineItineraries } from "../../hooks/useOfflineItineraries";

// // // const BORDER = "#E6EDF7";
// // // const PRIMARY = "#003366";
// // // const SUBTEXT = "#6B7280";

// // // function formatRange(start, end) {
// // //   if (!start || !end) return "Dates TBD";
// // //   try {
// // //     const s = new Date(start);
// // //     const e = new Date(end);
// // //     const sameYear = s.getFullYear() === e.getFullYear();
// // //     const fmt = new Intl.DateTimeFormat("en-US", {
// // //       month: "short",
// // //       day: "numeric",
// // //       ...(sameYear ? {} : { year: "numeric" }),
// // //     });
// // //     const fmtEnd = new Intl.DateTimeFormat("en-US", {
// // //       month: "short",
// // //       day: "numeric",
// // //       year: "numeric",
// // //     });
// // //     return `${fmt.format(s)} – ${fmtEnd.format(e)}`;
// // //   } catch {
// // //     return "Dates TBD";
// // //   }
// // // }

// // // export default function ItineraryCard({ item, onPress }) {
// // //   const {
// // //     id, _id,
// // //     title,
// // //     city,
// // //     start_date,
// // //     end_date,
// // //     budget,
// // //     style,
// // //     cover_url,
// // //     days = [],
// // //   } = item || {};

// // //   const itineraryId = id || _id;

// // //   // image fallback
// // //   const [imgError, setImgError] = useState(false);
// // //   const showImage = !!cover_url && !imgError;

// // //   // 🔹 is this itinerary already saved offline?
// // //   const [isOffline, setIsOffline] = useState(false);
// // //   useEffect(() => {
// // //     (async () => {
// // //       const list = await listOfflineItineraries();
// // //       setIsOffline(!!list.find(x => String(x.id) === String(itineraryId)));
// // //     })();
// // //   }, [itineraryId]);

// // //   const onDownload = async () => {
// // //     try {
// // //       const normalized = {
// // //         ...item,id: item?.id ?? item?._id ?? item?.itinerary_id ?? item?.itineraryId ?? item?.ItineraryId, };
// // //       if (!normalized.id) {
// // //         throw new Error("Missing itinerary id/_id on card item");
// // //       }

// // //       await downloadItinerary({
// // //         itinerary: { ...item, id: item.id ?? item._id },
// // //         itinerary: normalized,
// // //         coverUrl: cover_url || null,
// // //         staticMapUrl: null,
// // //       });
// // //       setIsOffline(true);
// // //       Alert.alert("Saved for offline", "Open from Profile → Offline.");
// // //     } catch (e) {
// // //       Alert.alert("Download failed", String(e?.message || e));
// // //     }
// // //   };

// // //   return (
// // //     <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
// // //       <View style={styles.coverWrap}>
// // //         {showImage ? (
// // //           <Image
// // //             source={{ uri: cover_url }}
// // //             style={styles.cover}
// // //             onError={() => setImgError(true)}
// // //             accessible
// // //             accessibilityLabel="Itinerary cover image"
// // //           />
// // //         ) : (
// // //           <View style={styles.coverEmpty} />
// // //         )}

// // //         {/* badges on the cover */}
// // //         <View style={styles.badgeRow}>
// // //           {style ? (
// // //             <View style={[styles.badge, styles.badgeDark]}>
// // //               <Ionicons name="sparkles-outline" size={12} color="#fff" />
// // //               <Text style={[styles.badgeText, { color: "#fff" }]}>{style}</Text>
// // //             </View>
// // //           ) : null}
// // //           {budget ? (
// // //             <View style={[styles.badge, styles.badgeLight]}>
// // //               <Ionicons name="pricetag-outline" size={12} color={PRIMARY} />
// // //               <Text style={[styles.badgeText, { color: PRIMARY }]}>{budget}</Text>
// // //             </View>
// // //           ) : null}
// // //         </View>

// // //         {/* 🔹 small download button (bottom-right) */}
// // //         <Pressable
// // //           onPress={onDownload}
// // //           hitSlop={8}
// // //           style={styles.downloadFab}
// // //           accessibilityLabel={isOffline ? "Re-download offline" : "Download for offline"}
// // //         >
// // //           <Ionicons name={isOffline ? "cloud-done-outline" : "cloud-download-outline"} size={18} color="#fff" />
// // //         </Pressable>
// // //       </View>

// // //       <View style={styles.body}>
// // //         <Text style={styles.title} numberOfLines={1}>
// // //           {title || "Untitled Itinerary"}
// // //         </Text>

// // //         <View style={styles.row}>
// // //           <Ionicons name="location-outline" size={14} color={SUBTEXT} />
// // //           <Text style={styles.sub} numberOfLines={1}>
// // //             {city || "—"}
// // //           </Text>
// // //         </View>

// // //         <View style={styles.row}>
// // //           <Ionicons name="calendar-outline" size={14} color={SUBTEXT} />
// // //           <Text style={styles.sub}>{formatRange(start_date, end_date)}</Text>
// // //         </View>

// // //         <View style={styles.metaRow}>
// // //           <View style={styles.metaPill}>
// // //             <Ionicons name="time-outline" size={14} color={PRIMARY} />
// // //             <Text style={styles.metaText}>
// // //               {Array.isArray(days) && days.length ? `${days.length} day(s)` : "No days yet"}
// // //             </Text>
// // //           </View>

// // //           {/* 🔹 Available offline pill */}
// // //           {isOffline && (
// // //             <View style={[styles.metaPill, { backgroundColor:"#ECFDF5", borderWidth:1, borderColor:"#D1FAE5" }]}>
// // //               <Ionicons name="checkmark-circle-outline" size={14} color="#065F46" />
// // //               <Text style={[styles.metaText, { color:"#065F46" }]}>Available offline</Text>
// // //             </View>
// // //           )}
// // //         </View>
// // //       </View>
// // //     </TouchableOpacity>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   card: {
// // //     overflow: "hidden",
// // //     borderRadius: 14,
// // //     backgroundColor: "#fff",
// // //     borderWidth: 1,
// // //     borderColor: BORDER,
// // //     ...Platform.select({
// // //       web: { boxShadow: "0 6px 16px rgba(0,0,0,0.06)" },
// // //       default: {
// // //         shadowColor: "#000",
// // //         shadowOpacity: 0.08,
// // //         shadowRadius: 12,
// // //         shadowOffset: { width: 0, height: 6 },
// // //         elevation: 3,
// // //       },
// // //     }),
// // //   },

// // //   /* Cover area */
// // //   coverWrap: { width: "100%", height: 160, backgroundColor: "#eef2f7" },
// // //   cover: { width: "100%", height: "100%", resizeMode: "cover" },
// // //   coverEmpty: { flex: 1, backgroundColor: "#f8fafc" },

// // //   /* badges on cover */
// // //   badgeRow: {
// // //     position: "absolute",
// // //     left: 10,
// // //     bottom: 10,
// // //     flexDirection: "row",
// // //     gap: 6,
// // //   },
// // //   badge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //     paddingVertical: 4,
// // //     paddingHorizontal: 8,
// // //     borderRadius: 999,
// // //     borderWidth: 1,
// // //   },
// // //   badgeDark: { backgroundColor: PRIMARY, borderColor: PRIMARY },
// // //   badgeLight: { backgroundColor: "#fff", borderColor: BORDER },
// // //   badgeText: { fontSize: 12, fontWeight: "700" },

// // //   /* small floating download button */
// // //   downloadFab: {
// // //     position: "absolute",
// // //     right: 10,
// // //     bottom: 10,
// // //     backgroundColor: PRIMARY,
// // //     borderRadius: 999,
// // //     padding: 8,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255,255,255,0.6)",
// // //   },

// // //   /* Body */
// // //   body: { padding: 12, gap: 6 },
// // //   title: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
// // //   row: { flexDirection: "row", alignItems: "center", gap: 6 },
// // //   sub: { color: SUBTEXT, fontSize: 13 },

// // //   /* Meta */
// // //   metaRow: { marginTop: 6, flexDirection: "row", gap: 8, flexWrap: "wrap" },
// // //   metaPill: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //     backgroundColor: "#F1F5F9",
// // //     borderRadius: 999,
// // //     paddingVertical: 4,
// // //     paddingHorizontal: 10,
// // //   },
// // //   metaText: { color: PRIMARY, fontWeight: "700", fontSize: 12 },
// // // });



// // // screens/CrowdsourceItineraries/ItineraryCard.js
// // import React, { useEffect, useState } from "react";
// // import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Pressable, Alert } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // /* Offline helpers */
// // import { downloadItinerary, listOfflineItineraries } from "../../hooks/useOfflineItineraries";

// // /* ✅ Share functionality */
// // import ShareButton from '../../components/ShareButton';
// // import { getShareImage, getShareMessage, getShareUrl, isOfflineContent } from '../../utils/shareImageHelper';

// // const BORDER = "#E6EDF7";
// // const PRIMARY = "#003366";
// // const SUBTEXT = "#6B7280";

// // function formatRange(start, end) {
// //   if (!start || !end) return "Dates TBD";
// //   try {
// //     const s = new Date(start);
// //     const e = new Date(end);
// //     const sameYear = s.getFullYear() === e.getFullYear();
// //     const fmt = new Intl.DateTimeFormat("en-US", {
// //       month: "short",
// //       day: "numeric",
// //       ...(sameYear ? {} : { year: "numeric" }),
// //     });
// //     const fmtEnd = new Intl.DateTimeFormat("en-US", {
// //       month: "short",
// //       day: "numeric",
// //       year: "numeric",
// //     });
// //     return `${fmt.format(s)} – ${fmtEnd.format(e)}`;
// //   } catch {
// //     return "Dates TBD";
// //   }
// // }

// // export default function ItineraryCard({ item, onPress }) {
// //   const {
// //     id, _id,
// //     title,
// //     city,
// //     start_date,
// //     end_date,
// //     budget,
// //     style,
// //     cover_url,
// //     days = [],
// //   } = item || {};

// //   const itineraryId = id || _id;

// //   // Image fallback
// //   const [imgError, setImgError] = useState(false);
// //   const showImage = !!cover_url && !imgError;

// //   // Is this itinerary already saved offline?
// //   const [isOffline, setIsOffline] = useState(false);
// //   useEffect(() => {
// //     (async () => {
// //       const list = await listOfflineItineraries();
// //       setIsOffline(!!list.find(x => String(x.id) === String(itineraryId)));
// //     })();
// //   }, [itineraryId]);

// //   // ✅ Check if this is offline content (no share button for offline)
// //   const isOfflineItem = isOfflineContent(item) || isOffline;

// //   const onDownload = async () => {
// //     try {
// //       const normalized = {
// //         ...item,
// //         id: item?.id ?? item?._id ?? item?.itinerary_id ?? item?.itineraryId ?? item?.ItineraryId,
// //       };
// //       if (!normalized.id) {
// //         throw new Error("Missing itinerary id/_id on card item");
// //       }

// //       await downloadItinerary({
// //         itinerary: normalized,
// //         coverUrl: cover_url || null,
// //         staticMapUrl: null,
// //       });
// //       setIsOffline(true);
// //       Alert.alert("Saved for offline", "Open from Profile → Offline.");
// //     } catch (e) {
// //       Alert.alert("Download failed", String(e?.message || e));
// //     }
// //   };

// //   return (
// //     <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
// //       <View style={styles.coverWrap}>
// //         {showImage ? (
// //           <Image
// //             source={{ uri: cover_url }}
// //             style={styles.cover}
// //             onError={() => setImgError(true)}
// //             accessible
// //             accessibilityLabel="Itinerary cover image"
// //           />
// //         ) : (
// //           <View style={styles.coverEmpty} />
// //         )}

// //         {/* Badges on the cover */}
// //         <View style={styles.badgeRow}>
// //           {style ? (
// //             <View style={[styles.badge, styles.badgeDark]}>
// //               <Ionicons name="sparkles-outline" size={12} color="#fff" />
// //               <Text style={[styles.badgeText, { color: "#fff" }]}>{style}</Text>
// //             </View>
// //           ) : null}
// //           {budget ? (
// //             <View style={[styles.badge, styles.badgeLight]}>
// //               <Ionicons name="pricetag-outline" size={12} color={PRIMARY} />
// //               <Text style={[styles.badgeText, { color: PRIMARY }]}>{budget}</Text>
// //             </View>
// //           ) : null}
// //         </View>

// //         {/* ✅ Action buttons row (bottom-right) - Only show for online content */}
// //         {!isOfflineItem && (
// //           <View style={styles.actionButtons}>
// //             {/* Share button */}
// //             <ShareButton
// //               title={`Travel Itinerary: ${title || 'Trip'}`}
// //               message={getShareMessage(item, 'itinerary')}
// //               url={getShareUrl(item, 'itinerary')}
// //               imageUrl={getShareImage(item, 'itinerary')}
// //               compact={true}
// //               onShareComplete={() => console.log('Shared itinerary:', title)}
// //             />
            
// //             {/* Download button */}
// //             <Pressable
// //               onPress={onDownload}
// //               hitSlop={8}
// //               style={styles.downloadFab}
// //               accessibilityLabel={isOffline ? "Re-download offline" : "Download for offline"}
// //             >
// //               <Ionicons 
// //                 name={isOffline ? "cloud-done-outline" : "cloud-download-outline"} 
// //                 size={18} 
// //                 color="#fff" 
// //               />
// //             </Pressable>
// //           </View>
// //         )}

// //         {/* ✅ For offline items, only show offline indicator */}
// //         {isOfflineItem && isOffline && (
// //           <View style={styles.offlineIndicator}>
// //             <Ionicons name="cloud-done-outline" size={18} color="#fff" />
// //           </View>
// //         )}
// //       </View>

// //       <View style={styles.body}>
// //         <Text style={styles.title} numberOfLines={1}>
// //           {title || "Untitled Itinerary"}
// //         </Text>

// //         <View style={styles.row}>
// //           <Ionicons name="location-outline" size={14} color={SUBTEXT} />
// //           <Text style={styles.sub} numberOfLines={1}>
// //             {city || "—"}
// //           </Text>
// //         </View>

// //         <View style={styles.row}>
// //           <Ionicons name="calendar-outline" size={14} color={SUBTEXT} />
// //           <Text style={styles.sub}>{formatRange(start_date, end_date)}</Text>
// //         </View>

// //         <View style={styles.metaRow}>
// //           <View style={styles.metaPill}>
// //             <Ionicons name="time-outline" size={14} color={PRIMARY} />
// //             <Text style={styles.metaText}>
// //               {Array.isArray(days) && days.length ? `${days.length} day(s)` : "No days yet"}
// //             </Text>
// //           </View>

// //           {/* Available offline pill */}
// //           {isOffline && (
// //             <View style={[styles.metaPill, { backgroundColor:"#ECFDF5", borderWidth:1, borderColor:"#D1FAE5" }]}>
// //               <Ionicons name="checkmark-circle-outline" size={14} color="#065F46" />
// //               <Text style={[styles.metaText, { color:"#065F46" }]}>Available offline</Text>
// //             </View>
// //           )}
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   card: {
// //     overflow: "hidden",
// //     borderRadius: 14,
// //     backgroundColor: "#fff",
// //     borderWidth: 1,
// //     borderColor: BORDER,
// //     ...Platform.select({
// //       web: { boxShadow: "0 6px 16px rgba(0,0,0,0.06)" },
// //       default: {
// //         shadowColor: "#000",
// //         shadowOpacity: 0.08,
// //         shadowRadius: 12,
// //         shadowOffset: { width: 0, height: 6 },
// //         elevation: 3,
// //       },
// //     }),
// //   },

// //   /* Cover area */
// //   coverWrap: { width: "100%", height: 160, backgroundColor: "#eef2f7", position: 'relative' },
// //   cover: { width: "100%", height: "100%", resizeMode: "cover" },
// //   coverEmpty: { flex: 1, backgroundColor: "#f8fafc" },

// //   /* Badges on cover */
// //   badgeRow: {
// //     position: "absolute",
// //     left: 10,
// //     bottom: 10,
// //     flexDirection: "row",
// //     gap: 6,
// //   },
// //   badge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     paddingVertical: 4,
// //     paddingHorizontal: 8,
// //     borderRadius: 999,
// //     borderWidth: 1,
// //   },
// //   badgeDark: { backgroundColor: PRIMARY, borderColor: PRIMARY },
// //   badgeLight: { backgroundColor: "#fff", borderColor: BORDER },
// //   badgeText: { fontSize: 12, fontWeight: "700" },

// //   /* ✅ Action buttons row (bottom-right) */
// //   actionButtons: {
// //     position: 'absolute',
// //     right: 10,
// //     bottom: 10,
// //     flexDirection: 'row',
// //     gap: 8,
// //     alignItems: 'center',
// //   },

// //   /* Download button */
// //   downloadFab: {
// //     backgroundColor: PRIMARY,
// //     borderRadius: 999,
// //     padding: 8,
// //     borderWidth: 1,
// //     borderColor: "rgba(255,255,255,0.6)",
// //   },

// //   /* ✅ Offline indicator (when no action buttons shown) */
// //   offlineIndicator: {
// //     position: 'absolute',
// //     right: 10,
// //     bottom: 10,
// //     backgroundColor: '#065F46',
// //     borderRadius: 999,
// //     padding: 8,
// //     borderWidth: 1,
// //     borderColor: "rgba(255,255,255,0.6)",
// //   },

// //   /* Body */
// //   body: { padding: 12, gap: 6 },
// //   title: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
// //   row: { flexDirection: "row", alignItems: "center", gap: 6 },
// //   sub: { color: SUBTEXT, fontSize: 13 },

// //   /* Meta */
// //   metaRow: { marginTop: 6, flexDirection: "row", gap: 8, flexWrap: "wrap" },
// //   metaPill: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     backgroundColor: "#F1F5F9",
// //     borderRadius: 999,
// //     paddingVertical: 4,
// //     paddingHorizontal: 10,
// //   },
// //   metaText: { color: PRIMARY, fontWeight: "700", fontSize: 12 },
// // });
// // 


// // screens/CrowdsourceItineraries/ItineraryCard.js
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Platform,
//   Alert,
//   Share as RNShare,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const BORDER = '#E6EDF7';
// const PRIMARY = '#003366';

// export default function ItineraryCard({ item, onPress, onView, onEdit, onDelete }) {
//   const [imageError, setImageError] = useState(false);

//   const getImageSource = () => {
//     if (!item?.images?.[0]) return null;
//     const img = item.images[0];
//     if (typeof img === 'string') return { uri: img };
//     if (img.url) return { uri: img.url };
//     if (img.uri) return { uri: img.uri };
//     return null;
//   };

//   const imageSource = getImageSource();

//   // ✅ Generate detailed day-by-day itinerary share message
//   const handleShare = async () => {
//     try {
//       // Build comprehensive share message
//       let message = `🗺️ Travel Itinerary: ${item.title || 'My Trip'}\n`;
//       message += `📍 Destination: ${item.destination || item.city || 'Amazing Places'}\n`;
      
//       if (item.description) {
//         message += `\n${item.description}\n`;
//       }

//       // Add trip details
//       message += `\n📅 Duration: ${item.duration || 'Multiple days'}`;
//       if (item.budget) message += `\n💰 Budget: ${item.budget}`;
//       if (item.accommodation_details) message += `\n🏨 Accommodation: ${item.accommodation_details}`;
//       if (item.transport_details) message += `\n🚗 Transport: ${item.transport_details}`;

//       // ✅ Add day-by-day schedule
//       if (item.activities && Array.isArray(item.activities) && item.activities.length > 0) {
//         message += `\n\n📋 Day-by-Day Itinerary:\n`;
//         message += `${'='.repeat(30)}\n`;

//         // Group activities by day
//         const activitiesByDay = {};
//         item.activities.forEach(activity => {
//           const day = activity.day || 1;
//           if (!activitiesByDay[day]) {
//             activitiesByDay[day] = [];
//           }
//           activitiesByDay[day].push(activity);
//         });

//         // Sort days and display
//         Object.keys(activitiesByDay)
//           .sort((a, b) => Number(a) - Number(b))
//           .forEach(day => {
//             message += `\n📆 Day ${day}:\n`;
            
//             // Sort activities by time within each day
//             const dayActivities = activitiesByDay[day].sort((a, b) => {
//               const timeA = a.time || '00:00';
//               const timeB = b.time || '00:00';
//               return timeA.localeCompare(timeB);
//             });

//             dayActivities.forEach(activity => {
//               const time = activity.time || 'All day';
//               const place = activity.location || activity.place || '';
//               const name = activity.activity || activity.name || activity.title || 'Activity';
              
//               message += `  🕐 ${time} - ${name}`;
//               if (place) message += ` (${place})`;
//               if (activity.description) message += `\n     ${activity.description}`;
//               message += `\n`;
//             });
//           });
//       }

//       // Add tags/highlights
//       if (item.tags && item.tags.length > 0) {
//         message += `\n🏷️ Tags: ${item.tags.join(', ')}`;
//       }

//       message += `\n\n✨ Plan your journey with TravelMate! 🌍✈️`;

//       // Share using native share sheet
//       if (Platform.OS === 'web') {
//         if (navigator.share) {
//           await navigator.share({
//             title: item.title || 'My Travel Itinerary',
//             text: message,
//           });
//         } else if (navigator.clipboard) {
//           await navigator.clipboard.writeText(message);
//           Alert.alert('Copied!', 'Itinerary copied to clipboard. Paste it anywhere!');
//         } else {
//           alert(message);
//         }
//       } else {
//         await RNShare.share({
//           title: item.title || 'My Travel Itinerary',
//           message: message,
//         });
//       }

//       console.log('✅ Itinerary shared with day-by-day details');
//     } catch (error) {
//       if (error.message !== 'User cancelled' && error.name !== 'AbortError') {
//         console.error('Share error:', error);
//         Alert.alert('Error', 'Could not share itinerary');
//       }
//     }
//   };

//   return (
//     <View style={styles.card}>
//       {/* Image */}
//       {imageSource && !imageError ? (
//         <Image
//           source={imageSource}
//           style={styles.image}
//           onError={() => setImageError(true)}
//           resizeMode="cover"
//         />
//       ) : (
//         <View style={styles.imagePlaceholder}>
//           <Ionicons name="image-outline" size={36} color="#CBD5E1" />
//         </View>
//       )}

//       {/* Content */}
//       <View style={styles.content}>
//         <Text style={styles.title} numberOfLines={2}>
//           {item.title || 'Untitled Itinerary'}
//         </Text>

//         {item.destination && (
//           <View style={styles.row}>
//             <Ionicons name="location-outline" size={14} color={PRIMARY} />
//             <Text style={styles.destination}>{item.destination}</Text>
//           </View>
//         )}

//         {item.duration && (
//           <View style={styles.row}>
//             <Ionicons name="calendar-outline" size={14} color="#6B7280" />
//             <Text style={styles.meta}>{item.duration}</Text>
//           </View>
//         )}

//         {item.budget && (
//           <View style={styles.row}>
//             <Ionicons name="cash-outline" size={14} color="#059669" />
//             <Text style={styles.meta}>{item.budget}</Text>
//           </View>
//         )}

//         {/* Action Buttons */}
//         <View style={styles.actions}>
//           {onView && (
//             <TouchableOpacity style={styles.actionBtn} onPress={onView}>
//               <Ionicons name="eye-outline" size={16} color={PRIMARY} />
//               <Text style={styles.actionText}>View</Text>
//             </TouchableOpacity>
//           )}

//           {onEdit && (
//             <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
//               <Ionicons name="create-outline" size={16} color={PRIMARY} />
//               <Text style={styles.actionText}>Edit</Text>
//             </TouchableOpacity>
//           )}

//           {/* ✅ Share button with day-by-day details */}
//           <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
//             <Ionicons name="share-social-outline" size={16} color={PRIMARY} />
//             <Text style={styles.actionText}>Share</Text>
//           </TouchableOpacity>

//           {onDelete && (
//             <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={onDelete}>
//               <Ionicons name="trash-outline" size={16} color="#B91C1C" />
//               <Text style={[styles.actionText, styles.actionTextDanger]}>Delete</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 14,
//     borderTopRightRadius: 14,
//     borderLeftWidth: 1,
//     borderRightWidth: 1,
//     borderTopWidth: 1,
//     borderColor: BORDER,
//     overflow: 'hidden',
//     ...(Platform.OS === 'web'
//       ? { boxShadow: '0 4px 12px rgba(15,23,42,.06)' }
//       : { elevation: 2 }),
//   },
//   image: {
//     width: '100%',
//     height: 180,
//     backgroundColor: '#F1F5F9',
//   },
//   imagePlaceholder: {
//     width: '100%',
//     height: 180,
//     backgroundColor: '#F1F5F9',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     padding: 12,
//     gap: 6,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: '#0f172a',
//     marginBottom: 4,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   destination: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: PRIMARY,
//   },
//   meta: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   actions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginTop: 8,
//   },
//   actionBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     backgroundColor: '#F1F5F9',
//     borderRadius: 999,
//   },
//   actionBtnDanger: {
//     backgroundColor: '#FEF2F2',
//     borderWidth: 1,
//     borderColor: '#FECACA',
//   },
//   actionText: {
//     color: PRIMARY,
//     fontWeight: '700',
//     fontSize: 12,
//   },
//   actionTextDanger: {
//     color: '#B91C1C',
//   },
// });
// // 


// screens/CrowdsourceItineraries/ItineraryCard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Share as RNShare,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BORDER = '#E6EDF7';
const PRIMARY = '#003366';

export default function ItineraryCard({ item, onPress, onView, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  // ✅ FIXED: Better image source handler
  const getImageSource = () => {
    // Try different possible image fields
    const possibleImages = [
      item?.cover_url,           // From detail screen
      item?.images?.[0],         // Array of images
      item?.image,               // Single image field
      item?.coverImage,          // Alternative field
      item?.thumbnail,           // Thumbnail field
    ];

    for (const img of possibleImages) {
      if (!img) continue;
      
      // If it's already a string URL
      if (typeof img === 'string' && img.length > 0) {
        return { uri: img };
      }
      
      // If it's an object with url
      if (img.url) return { uri: img.url };
      if (img.uri) return { uri: img.uri };
    }

    return null;
  };

  const imageSource = getImageSource();

  // ✅ Generate detailed day-by-day itinerary share message
  const handleShare = async () => {
    try {
      // Build comprehensive share message
      let message = `🗺️ Travel Itinerary: ${item.title || 'My Trip'}\n`;
      message += `📍 Destination: ${item.destination || item.city || 'Amazing Places'}\n`;
      
      if (item.description) {
        message += `\n${item.description}\n`;
      }

      // Add trip details
      message += `\n📅 Duration: ${item.duration || 'Multiple days'}`;
      if (item.budget) message += `\n💰 Budget: ${item.budget}`;
      if (item.accommodation_details) message += `\n🏨 Accommodation: ${item.accommodation_details}`;
      if (item.transport_details) message += `\n🚗 Transport: ${item.transport_details}`;

      // ✅ Add day-by-day schedule
      if (item.days && Array.isArray(item.days) && item.days.length > 0) {
        message += `\n\n📋 Day-by-Day Itinerary:\n`;
        message += `${'='.repeat(30)}\n`;

        item.days
          .slice()
          .sort((a, b) => (a.day_number || 0) - (b.day_number || 0))
          .forEach((day, idx) => {
            const dayNum = day.day_number || idx + 1;
            const place = day.place || day.Place || '';
            const startTime = day.start_time || day.StartTime || '';
            const endTime = day.end_time || day.EndTime || '';
            const activities = day.activities || day.Activities || '';

            message += `\n📆 Day ${dayNum}:\n`;
            
            if (place) {
              message += `  📍 ${place}\n`;
            }
            
            if (startTime || endTime) {
              const times = [startTime, endTime].filter(Boolean).join(' - ');
              message += `  🕐 ${times}\n`;
            }
            
            if (activities) {
              message += `  ${activities}\n`;
            }
          });
      }

      // Add tags/highlights
      if (item.tags && item.tags.length > 0) {
        message += `\n🏷️ Tags: ${item.tags.join(', ')}`;
      }

      message += `\n\n✨ Plan your journey with TravelMate! 🌍✈️`;

      // Share using native share sheet
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: item.title || 'My Travel Itinerary',
            text: message,
          });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(message);
          Alert.alert('Copied!', 'Itinerary copied to clipboard. Paste it anywhere!');
        } else {
          alert(message);
        }
      } else {
        await RNShare.share({
          title: item.title || 'My Travel Itinerary',
          message: message,
        });
      }

      console.log('✅ Itinerary shared with day-by-day details');
    } catch (error) {
      if (error.message !== 'User cancelled' && error.name !== 'AbortError') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Could not share itinerary');
      }
    }
  };

  // ✅ Debug: Log what we're getting
  console.log('Card item:', {
    id: item?.id,
    title: item?.title,
    cover_url: item?.cover_url,
    images: item?.images,
    imageSource: imageSource,
  });

  return (
    <View style={styles.card}>
      {/* Image */}
      {imageSource && !imageError ? (
        <Image
          source={imageSource}
          style={styles.image}
          onError={(e) => {
            console.log('Image load error:', e.nativeEvent);
            setImageError(true);
          }}
          onLoad={() => console.log('Image loaded successfully')}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={36} color="#CBD5E1" />
          {/* ✅ Debug text */}
          <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
            {imageError ? 'Failed to load' : 'No image'}
          </Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title || 'Untitled Itinerary'}
        </Text>

        {(item.destination || item.city) && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color={PRIMARY} />
            <Text style={styles.destination}>{item.destination || item.city}</Text>
          </View>
        )}

        {item.duration && (
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.meta}>{item.duration}</Text>
          </View>
        )}

        {item.budget && (
          <View style={styles.row}>
            <Ionicons name="cash-outline" size={14} color="#059669" />
            <Text style={styles.meta}>{item.budget}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {onView && (
            <TouchableOpacity style={styles.actionBtn} onPress={onView}>
              <Ionicons name="eye-outline" size={16} color={PRIMARY} />
              <Text style={styles.actionText}>View</Text>
            </TouchableOpacity>
          )}

          {onEdit && (
            <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
              <Ionicons name="create-outline" size={16} color={PRIMARY} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}

          {/* ✅ Share button with day-by-day details */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={16} color={PRIMARY} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          {onDelete && (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color="#B91C1C" />
              <Text style={[styles.actionText, styles.actionTextDanger]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 12px rgba(15,23,42,.06)' }
      : { elevation: 2 }),
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  destination: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
  },
  meta: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
  },
  actionBtnDanger: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionText: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 12,
  },
  actionTextDanger: {
    color: '#B91C1C',
  },
});