

// import React, { useEffect } from "react";
// import {
//   Platform,
//   BackHandler,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   useWindowDimensions,
// } from "react-native";
// import { Feather, Entypo } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { generateItineraryPDF } from "../../utils/generatePDF";

// const isWeb = Platform.OS === "web";
// const savedCount = 5;

// const sampleItinerary = {
//   title: "Skardu Adventure",
//   overview: "An epic trip through the valleys of Skardu",
//   budget: "Mid-Range",
//   style: "Adventure",
//   days: [
//     { place: "Skardu City", time: "9AM", activities: "Visit Kharpocho Fort" },
//     { place: "Shigar Valley", time: "11AM", activities: "Explore Shigar Fort" },
//   ],
//   images: ["https://example.com/skardu1.jpg", "https://example.com/skardu2.jpg"],
// };

// const RAW_CARDS = [
//   { title: "Create Itinerary", subtitle: "Start a new travel plan", iconKey: "plus", color: "#fafafa" },
//   !isWeb && { title: "Save as PDF", subtitle: "Download your itinerary", iconKey: "download", color: "#fafafa" },
//   { title: "Manage My Itineraries", subtitle: "Access your itineraries", iconKey: "folder", color: "#fafafa", badge: savedCount },
//   { title: "Itinerary Feedback", subtitle: "Skardu Adventure stats", iconKey: "message", color: "#fafafa", feedbackStats: { views: 120, rating: 4.8, comments: 4 } },
// ].filter(Boolean);

// export default function CrowdsourceItinerariesScreen() {
//   const navigation = useNavigation();
//   const { width } = useWindowDimensions();

//   // Responsive layout:
//   // phones: 2 columns; narrow desktop/tablet: 3; wide desktop: 4
//   const isPhone = width < 600;
//   const isNarrowDesktop = width >= 600 && width < 1100;
//   const columns = isPhone ? 2 : isNarrowDesktop ? 3 : 4;

//   // choose widths that leave a little gutter; works nicely with space-between
//   const CARD_WIDTH =
//     columns === 2 ? "48%" : columns === 3 ? "31.5%" : "23.5%";

//   // compact sizing (small, consistent tiles)
//   const CARD_PADDING = isPhone ? 8 : 10;
//   const ICON_SIZE = 12;
//   const TITLE_SIZE = 12;
//   const CARD_MIN_H = 100;

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
//       navigation.navigate("TravelerDashboard");
//       return true;
//     });
//     return () => backHandler.remove();
//   }, []);

//   const renderIcon = (key) => {
//     switch (key) {
//       case "plus":     return <Feather name="plus-circle" size={ICON_SIZE} color="#333" />;
//       case "download": return <Feather name="download" size={ICON_SIZE} color="#333" />;
//       case "folder":   return <Feather name="folder" size={ICON_SIZE} color="#333" />;
//       case "cycle":    return <Entypo  name="cycle"        size={ICON_SIZE} color="#333" />;
//       case "message":  return <Feather name="message-circle" size={ICON_SIZE} color="#333" />;
//       default:         return null;
//     }
//   };

//   const handleCardPress = async (title) => {
//     if (title === "Create Itinerary") {
//       navigation.navigate("CreateItinerary");
//     } else if (title === "Edit Itinerary") {
//       navigation.navigate("EditItinerary", {
//         itineraryData: {
//           title: "Hunza Trip",
//           overview: "A scenic 3-day journey through Hunza...",
//           budget: "Mid-Range",
//           style: "Adventure",
//           visibility: "public",
//           days: [{ place: "Karimabad", time: "10AM", activities: "Sightseeing" }],
//           images: [],
//         },
//       });
//     } else if (title === "Update Itinerary") {
//       navigation.navigate("UpdateItineraryScreen", { itineraryId: "skardu123", mode: "update" });
//     } else if (title === "Save as PDF") {
//       await generateItineraryPDF(sampleItinerary, navigation);
//     } else if (title === "Share Itinerary") {
//       navigation.navigate("ShareItinerary");
//     } else if (title === "Manage My Itineraries") {
//       navigation.navigate("ManageItineraries");
//     } else if (title === "Optimize Your Itinerary") {
//       navigation.navigate("OptimizeItinerary");
//     } else if (title === "Itinerary Feedback") {
//       navigation.navigate("UpdateItineraryScreen", { itineraryId: "skardu123", mode: "update" });
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView contentContainerStyle={styles.container}>
//         {RAW_CARDS.map((item, idx) => (
//           <TouchableOpacity
//             key={idx}
//             activeOpacity={0.9}
//             onPress={() => handleCardPress(item.title)}
//             style={[
//               styles.card,
//               {
//                 backgroundColor: item.color,
//                 width: CARD_WIDTH,
//                 padding: CARD_PADDING,
//                 minHeight: CARD_MIN_H,
//               },
//             ]}
//           >
//             <View style={styles.iconRow}>
//               {renderIcon(item.iconKey)}
//             </View>

//             <Text style={[styles.title, { fontSize: TITLE_SIZE }]} numberOfLines={2}>
//               {item.title}
//             </Text>

//             {/* show subtitle and stats only on non-phones */}
//             {!isPhone && item.subtitle && (
//               <Text style={styles.subtitle} numberOfLines={2}>
//                 {item.subtitle}
//               </Text>
//             )}

//             {!isPhone && item.feedbackStats && (
//               <View style={styles.statsRow}>
//                 {/* <Text style={styles.pill}>👁 {item.feedbackStats.views}</Text>
//                 <Text style={styles.pill}>⭐ {item.feedbackStats.rating}</Text>
//                 <Text style={styles.pill}>💬 {item.feedbackStats.comments}</Text> */}
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     padding: 12,
//     paddingTop: 12,
//   },

//   card: {
//     marginBottom: 12,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     borderColor: "#102e41",
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },

//   iconRow: { flexDirection: "row", alignItems: "center" },

//   badge: {
//     backgroundColor: "#fce4ec",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//     marginLeft: 6,
//   },
//   badgeText: { fontSize: 11, fontWeight: "600", color: "#c2185b" },

//   title: {
//     marginTop: 8,
//     fontWeight: "800",
//     textAlign: "center",
//     color: "#222",
//     lineHeight: 18,
//   },

//   subtitle: {
//     marginTop: 4,
//     fontSize: 12,
//     textAlign: "center",
//     color: "#555",
//   },

//   statsRow: {
//     flexDirection: "row",
//     marginTop: 6,
//     gap: 6,
//   },
//   pill: {
//     fontSize: 11,
//     color: "#1f2937",
//     backgroundColor: "#eef2ff",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 999,
//     overflow: "hidden",
//   },
// });




// screens/CrowdsourceItineraries/CrowdsourceItinerariesScreen.jsx
import React, { useEffect } from "react";
import {
  Platform,
  BackHandler,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { generateItineraryPDF } from "../../utils/generatePDF";

const COLORS = {
  bg: "#F7F9FC",
  card: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  primary: "#102e41",
  border: "#E6EDF7",
  soft: "#EEF3F9",
  danger: "#B91C1C",
};

const isWeb = Platform.OS === "web";
const savedCount = 5;

const sampleItinerary = {
  title: "Skardu Adventure",
  overview: "An epic trip through the valleys of Skardu",
  budget: "Mid-Range",
  style: "Adventure",
  days: [
    { place: "Skardu City", time: "9AM", activities: "Visit Kharpocho Fort" },
    { place: "Shigar Valley", time: "11AM", activities: "Explore Shigar Fort" },
  ],
  images: ["https://example.com/skardu1.jpg", "https://example.com/skardu2.jpg"],
};

const RAW_CARDS = [
  { title: "Create Itinerary",       subtitle: "Start a new travel plan",  icon: "add-circle-outline" },
  !isWeb && { title: "Save as PDF",  subtitle: "Download your itinerary",  icon: "download-outline"   },
  { title: "Manage My Itineraries",  subtitle: "Access your itineraries",  icon: "folder-open-outline", badge: savedCount },
  { title: "Itinerary Feedback",     subtitle: "Skardu Adventure stats",   icon: "chatbubble-ellipses-outline" },
].filter(Boolean);

export default function CrowdsourceItinerariesScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // Columns: phone=1/2, tablet=3, wide=4
  const isPhone = width < 560;
  const isTwo   = width >= 560 && width < 900;
  const isThree = width >= 900 && width < 1200;
  const columns = isPhone ? 1 : isTwo ? 2 : isThree ? 3 : 4;

  // Card width for CSS-like wrapping
  const cardWidth =
    columns === 1 ? "100%" :
    columns === 2 ? "48%"  :
    columns === 3 ? "31.5%" : "23.5%";

  // Android hardware back → go to dashboard
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("TravelerDashboard");
      }
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("TravelerDashboard");
  };

  const handleCardPress = async (title) => {
    switch (title) {
      case "Create Itinerary":
        navigation.navigate("CreateItinerary");
        break;
      case "Manage My Itineraries":
        navigation.navigate("ManageItineraries");
        break;
      case "Save as PDF":
        await generateItineraryPDF(sampleItinerary, navigation);
        break;
      case "Itinerary Feedback":
        navigation.navigate("UpdateItineraryScreen", { itineraryId: "skardu123", mode: "update" });
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} style={({ pressed }) => [styles.backPill, pressed && { opacity: 0.9 }]} accessibilityRole="button">
          <Ionicons name="arrow-back" size={18} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Trip Planner</Text>
          <Text style={styles.lead}>Create, manage, export, and analyze your itineraries.</Text>
        </View>
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={[styles.grid, { paddingBottom: 24 }]}>
        {RAW_CARDS.map((item, idx) => (
          <Pressable
            key={idx}
            onPress={() => handleCardPress(item.title)}
            style={({ hovered, pressed }) => [
              styles.card,
              { width: cardWidth },
              hovered && isWeb ? { transform: [{ translateY: -2 }], shadowOpacity: 0.12 } : null,
              pressed ? { opacity: 0.92 } : null,
            ]}
          >
            <View style={styles.cardTop}>
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={20} color="#fff" />
              </View>
              {item.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : <View style={{ width: 24 }} />}
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub} numberOfLines={2}>{item.subtitle}</Text>

            <View style={styles.ctaRow}>
              <Text style={styles.ctaText}>Open</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backText: { marginLeft: 6, fontWeight: "800", color: COLORS.text },

  h1: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  lead: { color: COLORS.subtext, marginTop: 2 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: COLORS.soft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeText: { fontSize: 12, fontWeight: "800", color: COLORS.text },

  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  cardSub: { marginTop: 4, color: COLORS.subtext },

  ctaRow: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    borderRadius: 12,
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ctaText: { color: COLORS.primary, fontWeight: "800" },
});
