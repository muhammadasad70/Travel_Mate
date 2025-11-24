
// //above code is working perfect but this below is also for sharing the events on social media 
// import React from "react";
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Modal, 
//   Pressable, 
//   TouchableOpacity, 
//   Image, 
//   Linking, 
//   Platform, 
//   Alert,
//   Share
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as Calendar from 'expo-calendar';

// const COLORS = {
//   text: "#0F3A6B",
//   sub: "#6B7280",
//   border: "#EAF0F6",
//   soft: "#F7FAFD",
//   accent: "#0c2444ff",
// };

// const fmtDate = (iso) => {
//   if (!iso) return "";
//   try {
//     const d = new Date(iso);
//     return d.toLocaleString(undefined, {
//       weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
//     });
//   } catch { return ""; }
// };

// function toICS(e) {
//   const dt = (s) => {
//     try {
//       return new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
//     } catch {
//       return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
//     }
//   };
  
//   const startTime = e.start || e.start_time;
//   const endTime = e.end || e.end_time;
  
//   const description = e.description ? String(e.description).replace(/\n/g, "\\n") : "";
//   const venueAddress = e.venue_address || e.venue_addr || "";
//   const location = [e.venue_name, venueAddress].filter(Boolean).join(", ");
  
//   const lines = [
//     "BEGIN:VCALENDAR",
//     "VERSION:2.0",
//     "PRODID:-//TravelMate//Events//EN",
//     "CALSCALE:GREGORIAN",
//     "BEGIN:VEVENT",
//     `UID:${e.id || Date.now()}@travelmate`,
//   ];
  
//   if (startTime) lines.push(`DTSTART:${dt(startTime)}`);
//   if (endTime) lines.push(`DTEND:${dt(endTime)}`);
//   if (e.title) lines.push(`SUMMARY:${String(e.title)}`);
//   if (description) lines.push(`DESCRIPTION:${description}`);
//   if (location) lines.push(`LOCATION:${location}`);
//   if (e.url) lines.push(`URL:${String(e.url)}`);
  
//   lines.push("STATUS:CONFIRMED");
//   lines.push("END:VEVENT");
//   lines.push("END:VCALENDAR");
  
//   return lines.join("\r\n");
// }

// export default function EventDetailsSheet({ event, onClose }) {
//   const visible = !!event;
//   const hero = event?.image || event?.image_url;
//   const [heroOk, setHeroOk] = React.useState(!!hero);

//   const handleAddToCalendar = async () => {
//     if (!event) return;

//     try {
//       if (Platform.OS === 'web') {
//         // WEB: Download ICS file
//         const ics = toICS(event);
//         const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         const safeTitle = (event.title || 'event').replace(/[^a-z0-9]/gi, '_').substring(0, 50);
//         link.download = `${safeTitle}_event.ics`;
//         link.click();
//         URL.revokeObjectURL(url);
//         Alert.alert('Success', 'Calendar file downloaded!');
//       } else {
//         // MOBILE: Add directly to device calendar
        
//         console.log('📅 Starting calendar permission request...');
        
//         const { status } = await Calendar.requestCalendarPermissionsAsync();
        
//         console.log('📅 Permission status:', status);
        
//         if (status !== 'granted') {
//           Alert.alert(
//             'Permission Required',
//             'Calendar access is needed to add events. Please enable it in your device settings.',
//             [{ text: 'OK' }]
//           );
//           return;
//         }

//         console.log('📅 Getting calendars...');
        
//         const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        
//         console.log('📅 Available calendars:', calendars.length);
//         calendars.forEach(cal => {
//           console.log(`  - ${cal.title} (${cal.id}): allowsModifications=${cal.allowsModifications}, source=${cal.source.name}`);
//         });
        
//         let targetCalendar = calendars.find(cal => 
//           cal.allowsModifications && 
//           (cal.isPrimary || cal.source.name.toLowerCase().includes('local'))
//         );
        
//         if (!targetCalendar) {
//           targetCalendar = calendars.find(cal => cal.allowsModifications);
//         }
        
//         if (!targetCalendar) {
//           console.error('📅 No writable calendar found!');
//           Alert.alert(
//             'Error',
//             'No calendar available for adding events. Please check your device calendar settings.',
//             [{ text: 'OK' }]
//           );
//           return;
//         }

//         console.log('📅 Using calendar:', targetCalendar.title, targetCalendar.id);

//         const startTime = event.start || event.start_time;
//         const endTime = event.end || event.end_time;
        
//         if (!startTime) {
//           throw new Error('Event has no start time');
//         }
        
//         const startDate = new Date(startTime);
//         const endDate = endTime 
//           ? new Date(endTime) 
//           : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        
//         console.log('📅 Event dates:', {
//           start: startDate.toISOString(),
//           end: endDate.toISOString()
//         });
        
//         const venueAddress = event.venue_address || event.venue_addr || "";
//         const location = [event.venue_name, venueAddress].filter(Boolean).join(", ");
        
//         const notes = [
//           event.description,
//           event.category ? `Category: ${event.category}` : null,
//           event.price ? `Price: ${event.price}` : null,
//           event.url ? `More info: ${event.url}` : null
//         ].filter(Boolean).join('\n\n');
        
//         console.log('📅 Creating event with details:', {
//           title: event.title,
//           location: location,
//           startDate: startDate.toISOString(),
//           endDate: endDate.toISOString(),
//           calendar: targetCalendar.title
//         });
        
//         const eventId = await Calendar.createEventAsync(targetCalendar.id, {
//           title: event.title || 'Event',
//           startDate: startDate,
//           endDate: endDate,
//           location: location || undefined,
//           notes: notes || undefined,
//           timeZone: 'Asia/Karachi',
//           alarms: [{ relativeOffset: -60 }],
//           allDay: false,
//         });

//         console.log('📅 Event created successfully! ID:', eventId);
        
//         Alert.alert(
//           '✅ Success!',
//           `Event "${event.title}" has been added to your ${targetCalendar.title} calendar.`,
//           [
//             {
//               text: 'Open Calendar',
//               onPress: () => {
//                 Linking.openURL('content://com.android.calendar/time/').catch(() => {
//                   console.log('Could not open calendar app');
//                 });
//               }
//             },
//             { text: 'OK', style: 'cancel' }
//           ]
//         );
//       }
//     } catch (error) {
//       console.error('📅 Calendar error:', error);
//       console.error('📅 Error details:', {
//         message: error.message,
//         stack: error.stack
//       });
//       Alert.alert(
//         'Error',
//         `Could not add to calendar: ${error.message || 'Unknown error'}`,
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   const handleOpenLink = () => {
//     if (event?.url) {
//       Linking.openURL(event.url).catch((err) => {
//         console.error('Link error:', err);
//         Alert.alert('Error', 'Could not open link');
//       });
//     }
//   };

//   // ✅ NEW: Share event function
//   const handleShareEvent = async () => {
//     if (!event) return;

//     try {
//       const startDate = fmtDate(event.start || event.start_time);
//       const endDate = event.end || event.end_time ? fmtDate(event.end || event.end_time) : '';
//       const location = event.venue_name || event.city || '';
//       const venueAddress = event.venue_address || event.venue_addr || '';
//       const fullLocation = [location, venueAddress].filter(Boolean).join(', ');
//       const price = event.price ? `\n💰 ${event.price}` : '';
//       const category = event.category ? `\n🏷️ ${event.category}` : '';
//       const url = event.url ? `\n\n🔗 ${event.url}` : '';
      
//       const message = 
//         `📅 ${event.title}\n\n` +
//         `🕒 ${startDate}${endDate ? ` - ${endDate}` : ''}\n` +
//         `📍 ${fullLocation}${price}${category}${url}\n\n` +
//         `✨ Shared from TravelMate`;

//       const result = await Share.share({
//         message: message,
//         title: event.title || 'Event',
//       }, {
//         dialogTitle: 'Share Event',
//         subject: event.title,
//       });

//       if (result.action === Share.sharedAction) {
//         console.log('✅ Event shared successfully');
//       } else if (result.action === Share.dismissedAction) {
//         console.log('Share dismissed');
//       }
//     } catch (error) {
//       console.error('Share error:', error);
//       Alert.alert('Error', 'Could not share event');
//     }
//   };

//   const shouldShowLink = event?.url && event?.source !== "predicthq";

//   return (
//     <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//       <Pressable style={styles.sheetBackdrop} onPress={onClose} />
//       <View style={[styles.sheet, { maxHeight: "82%" }]}>
//         {!!event && (
//           <>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>Event Details</Text>
//               <TouchableOpacity onPress={onClose}>
//                 <Ionicons name="close" size={20} color={COLORS.text} />
//               </TouchableOpacity>
//             </View>

//             {hero && heroOk ? (
//               <Image
//                 source={{ uri: hero }}
//                 style={styles.heroImg}
//                 resizeMode="cover"
//                 onError={() => setHeroOk(false)}
//               />
//             ) : (
//               <View style={[styles.heroImg, { backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center" }]}>
//                 <Ionicons name="image-outline" size={28} color={COLORS.sub} />
//               </View>
//             )}

//             <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
//               <Text style={styles.title}>{event.title}</Text>
//               <Text style={styles.metaTxt}>
//                 {fmtDate(event.start || event.start_time)}
//                 {event.city ? `  •  ${event.city}` : ""}
//               </Text>
//               {!!event.venue_name && (
//                 <Text style={styles.metaTxt}>
//                   📍 {event.venue_name}{event.venue_address || event.venue_addr ? `, ${event.venue_address || event.venue_addr}` : ""}
//                 </Text>
//               )}
//               {!!event.price && (
//                 <Text style={[styles.metaTxt, { fontWeight: "800", marginTop: 4 }]}>
//                   💰 {event.price}
//                 </Text>
//               )}
//               {!!event.category && (
//                 <View style={styles.categoryBadge}>
//                   <Text style={styles.categoryText}>{event.category}</Text>
//                 </View>
//               )}
//             </View>

//             {/* ✅ UPDATED: Actions row with 3 buttons */}
//             <View style={styles.actionsRow}>
//               <ActionBtn
//                 icon="calendar-outline"
//                 label="Calendar"
//                 onPress={handleAddToCalendar}
//                 isPrimary
//               />
              
//               <ActionBtn 
//                 icon="share-social-outline" 
//                 label="Share" 
//                 onPress={handleShareEvent}
//               />
              
//               {shouldShowLink && (
//                 <ActionBtn 
//                   icon="open-outline" 
//                   label="Link" 
//                   onPress={handleOpenLink}
//                 />
//               )}
//             </View>
//           </>
//         )}
//       </View>
//     </Modal>
//   );
// }

// // ✅ UPDATED: Unified button component
// function ActionBtn({ icon, label, onPress, isPrimary = false }) {
//   return (
//     <TouchableOpacity 
//       onPress={onPress} 
//       style={[
//         styles.actionBtn, 
//         isPrimary ? styles.primaryBtn : styles.secondaryBtn
//       ]} 
//       activeOpacity={0.9}
//     >
//       <Ionicons 
//         name={icon} 
//         size={18} 
//         color={isPrimary ? "#fff" : COLORS.accent} 
//       />
//       <Text style={[
//         styles.actionBtnTxt,
//         isPrimary ? styles.primaryBtnTxt : styles.secondaryBtnTxt
//       ]}>
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
//   sheet: {
//     position: "absolute",
//     left: 0, right: 0, bottom: 0,
//     maxHeight: "75%",
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingBottom: 10,
//   },
//   sheetHeader: {
//     flexDirection: "row", 
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 14, 
//     paddingTop: 10, 
//     paddingBottom: 8,
//     borderBottomWidth: 1, 
//     borderColor: COLORS.border,
//   },
//   sheetTitle: { 
//     flex: 1, 
//     textAlign: "center", 
//     fontWeight: "800", 
//     fontSize: 16,
//     color: COLORS.text 
//   },

//   heroImg: { width: "100%", height: 180 },

//   title: { 
//     fontWeight: "800", 
//     color: "#0F172A", 
//     fontSize: 18,
//     marginBottom: 6,
//   },
//   metaTxt: { 
//     color: COLORS.sub, 
//     fontSize: 13, 
//     marginTop: 3,
//     lineHeight: 18,
//   },

//   categoryBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: "#E0F2FF",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   categoryText: {
//     color: COLORS.accent,
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   actionsRow: { 
//     marginTop: 16, 
//     paddingHorizontal: 14, 
//     flexDirection: "row", 
//     gap: 8,
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: "row", 
//     alignItems: "center", 
//     justifyContent: "center",
//     gap: 6,
//     paddingVertical: 12, 
//     paddingHorizontal: 10, 
//     borderRadius: 12,
//   },
//   primaryBtn: {
//     backgroundColor: COLORS.accent,
//   },
//   secondaryBtn: {
//     borderWidth: 1.5, 
//     borderColor: COLORS.accent, 
//     backgroundColor: "#fff",
//   },
//   actionBtnTxt: {
//     fontWeight: "800",
//     fontSize: 13,
//   },
//   primaryBtnTxt: { 
//     color: "#fff",
//   },
//   secondaryBtnTxt: { 
//     color: COLORS.accent,
//   },
// });




import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable, 
  TouchableOpacity, 
  Image, 
  Linking, 
  Platform, 
  Alert,
  Share,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Calendar from 'expo-calendar';

const COLORS = {
  text: "#0F3A6B",
  sub: "#6B7280",
  border: "#EAF0F6",
  soft: "#F7FAFD",
  accent: "#0c2444ff",
};

const fmtDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return ""; }
};

function toICS(e) {
  const dt = (s) => {
    try {
      return new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
    } catch {
      return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");
    }
  };
  
  const startTime = e.start || e.start_time;
  const endTime = e.end || e.end_time;
  
  const description = e.description ? String(e.description).replace(/\n/g, "\\n") : "";
  const venueAddress = e.venue_address || e.venue_addr || "";
  const location = [e.venue_name, venueAddress].filter(Boolean).join(", ");
  
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TravelMate//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${e.id || Date.now()}@travelmate`,
  ];
  
  if (startTime) lines.push(`DTSTART:${dt(startTime)}`);
  if (endTime) lines.push(`DTEND:${dt(endTime)}`);
  if (e.title) lines.push(`SUMMARY:${String(e.title)}`);
  if (description) lines.push(`DESCRIPTION:${description}`);
  if (location) lines.push(`LOCATION:${location}`);
  if (e.url) lines.push(`URL:${String(e.url)}`);
  
  lines.push("STATUS:CONFIRMED");
  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");
  
  return lines.join("\r\n");
}

export default function EventDetailsSheet({ 
  event, 
  onClose,
  // ✅ Offline props
  isSavedOffline,
  isDownloading,
  onDownloadOffline,
  onRemoveOffline,
}) {
  const visible = !!event;
  const hero = event?.image || event?.image_url;
  const [heroOk, setHeroOk] = React.useState(!!hero);

  const handleAddToCalendar = async () => {
    if (!event) return;

    try {
      if (Platform.OS === 'web') {
        const ics = toICS(event);
        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const safeTitle = (event.title || 'event').replace(/[^a-z0-9]/gi, '_').substring(0, 50);
        link.download = `${safeTitle}_event.ics`;
        link.click();
        URL.revokeObjectURL(url);
        Alert.alert('Success', 'Calendar file downloaded!');
      } else {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Calendar access is needed to add events. Please enable it in your device settings.',
            [{ text: 'OK' }]
          );
          return;
        }

        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        
        let targetCalendar = calendars.find(cal => 
          cal.allowsModifications && 
          (cal.isPrimary || cal.source.name.toLowerCase().includes('local'))
        );
        
        if (!targetCalendar) {
          targetCalendar = calendars.find(cal => cal.allowsModifications);
        }
        
        if (!targetCalendar) {
          Alert.alert(
            'Error',
            'No calendar available for adding events. Please check your device calendar settings.',
            [{ text: 'OK' }]
          );
          return;
        }

        const startTime = event.start || event.start_time;
        const endTime = event.end || event.end_time;
        
        if (!startTime) {
          throw new Error('Event has no start time');
        }
        
        const startDate = new Date(startTime);
        const endDate = endTime 
          ? new Date(endTime) 
          : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        
        const venueAddress = event.venue_address || event.venue_addr || "";
        const location = [event.venue_name, venueAddress].filter(Boolean).join(", ");
        
        const notes = [
          event.description,
          event.category ? `Category: ${event.category}` : null,
          event.price ? `Price: ${event.price}` : null,
          event.url ? `More info: ${event.url}` : null
        ].filter(Boolean).join('\n\n');
        
        await Calendar.createEventAsync(targetCalendar.id, {
          title: event.title || 'Event',
          startDate: startDate,
          endDate: endDate,
          location: location || undefined,
          notes: notes || undefined,
          timeZone: 'Asia/Karachi',
          alarms: [{ relativeOffset: -60 }],
          allDay: false,
        });
        
        Alert.alert(
          '✅ Success!',
          `Event "${event.title}" has been added to your ${targetCalendar.title} calendar.`,
          [
            {
              text: 'Open Calendar',
              onPress: () => {
                Linking.openURL('content://com.android.calendar/time/').catch(() => {
                  console.log('Could not open calendar app');
                });
              }
            },
            { text: 'OK', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Calendar error:', error);
      Alert.alert(
        'Error',
        `Could not add to calendar: ${error.message || 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleOpenLink = () => {
    if (event?.url) {
      Linking.openURL(event.url).catch((err) => {
        console.error('Link error:', err);
        Alert.alert('Error', 'Could not open link');
      });
    }
  };

  const handleShareEvent = async () => {
    if (!event) return;

    try {
      const startDate = fmtDate(event.start || event.start_time);
      const endDate = event.end || event.end_time ? fmtDate(event.end || event.end_time) : '';
      const location = event.venue_name || event.city || '';
      const venueAddress = event.venue_address || event.venue_addr || '';
      const fullLocation = [location, venueAddress].filter(Boolean).join(', ');
      const price = event.price ? `\n💰 ${event.price}` : '';
      const category = event.category ? `\n🏷️ ${event.category}` : '';
      const url = event.url ? `\n\n🔗 ${event.url}` : '';
      
      const message = 
        `📅 ${event.title}\n\n` +
        `🕒 ${startDate}${endDate ? ` - ${endDate}` : ''}\n` +
        `📍 ${fullLocation}${price}${category}${url}\n\n` +
        `✨ Shared from TravelMate`;

      await Share.share({
        message: message,
        title: event.title || 'Event',
      }, {
        dialogTitle: 'Share Event',
        subject: event.title,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Could not share event');
    }
  };

  const shouldShowLink = event?.url && event?.source !== "predicthq";

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={[styles.sheet, { maxHeight: "82%" }]}>
        {!!event && (
          <>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Event Details</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {hero && heroOk ? (
              <View>
                <Image
                  source={{ uri: hero }}
                  style={styles.heroImg}
                  resizeMode="cover"
                  onError={() => setHeroOk(false)}
                />
                {isSavedOffline && (
                  <View style={styles.offlineBadge}>
                    <Ionicons name="cloud-done" size={12} color="#fff" />
                    <Text style={styles.offlineText}>Offline</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.heroImg, { backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center" }]}>
                <Ionicons name="image-outline" size={28} color={COLORS.sub} />
              </View>
            )}

            <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.metaTxt}>
                {fmtDate(event.start || event.start_time)}
                {event.city ? `  •  ${event.city}` : ""}
              </Text>
              {!!event.venue_name && (
                <Text style={styles.metaTxt}>
                  📍 {event.venue_name}{event.venue_address || event.venue_addr ? `, ${event.venue_address || event.venue_addr}` : ""}
                </Text>
              )}
              {!!event.price && (
                <Text style={[styles.metaTxt, { fontWeight: "800", marginTop: 4 }]}>
                  💰 {event.price}
                </Text>
              )}
              {!!event.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{event.category}</Text>
                </View>
              )}
            </View>

            {/* ✅ Actions row with offline button */}
            <View style={styles.actionsRow}>
              {onDownloadOffline && (
                !isSavedOffline ? (
                  <ActionBtn
                    icon="cloud-download-outline"
                    label="Download"
                    onPress={onDownloadOffline}
                    isPrimary
                    isLoading={isDownloading}
                  />
                ) : (
                  <ActionBtn
                    icon="cloud-done"
                    label="Offline"
                    onPress={onRemoveOffline}
                    isSuccess
                  />
                )
              )}
              
              <ActionBtn
                icon="calendar-outline"
                label="Calendar"
                onPress={handleAddToCalendar}
                isPrimary={!onDownloadOffline}
              />
              
              <ActionBtn 
                icon="share-social-outline" 
                label="Share" 
                onPress={handleShareEvent}
              />
              
              {shouldShowLink && (
                <ActionBtn 
                  icon="open-outline" 
                  label="Link" 
                  onPress={handleOpenLink}
                />
              )}
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

function ActionBtn({ icon, label, onPress, isPrimary = false, isSuccess = false, isLoading = false }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.actionBtn, 
        isPrimary ? styles.primaryBtn : isSuccess ? styles.successBtn : styles.secondaryBtn
      ]} 
      activeOpacity={0.9}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <>
          <Ionicons 
            name={icon} 
            size={18} 
            color={isPrimary || isSuccess ? "#fff" : COLORS.accent} 
          />
          <Text style={[
            styles.actionBtnTxt,
            isPrimary || isSuccess ? styles.primaryBtnTxt : styles.secondaryBtnTxt
          ]}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    maxHeight: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 10,
  },
  sheetHeader: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14, 
    paddingTop: 10, 
    paddingBottom: 8,
    borderBottomWidth: 1, 
    borderColor: COLORS.border,
  },
  sheetTitle: { 
    flex: 1, 
    textAlign: "center", 
    fontWeight: "800", 
    fontSize: 16,
    color: COLORS.text 
  },

  heroImg: { width: "100%", height: 180, position: 'relative' },
  
  offlineBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  title: { 
    fontWeight: "800", 
    color: "#0F172A", 
    fontSize: 18,
    marginBottom: 6,
  },
  metaTxt: { 
    color: COLORS.sub, 
    fontSize: 13, 
    marginTop: 3,
    lineHeight: 18,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  categoryText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "700",
  },

  actionsRow: { 
    marginTop: 16, 
    paddingHorizontal: 14, 
    flexDirection: "row", 
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flex: 1,
    minWidth: 80,
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12, 
    paddingHorizontal: 10, 
    borderRadius: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
  },
  successBtn: {
    backgroundColor: '#10B981',
  },
  secondaryBtn: {
    borderWidth: 1.5, 
    borderColor: COLORS.accent, 
    backgroundColor: "#fff",
  },
  actionBtnTxt: {
    fontWeight: "800",
    fontSize: 13,
  },
  primaryBtnTxt: { 
    color: "#fff",
  },
  secondaryBtnTxt: { 
    color: COLORS.accent,
  },
});