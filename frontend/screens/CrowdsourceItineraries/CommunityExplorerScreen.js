// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const COLORS = {
//   bg: '#F7F9FC',
//   card: '#FFFFFF',
//   text: '#1f2937',
//   subtext: '#6b7280',
//   purple: '#8b5cf6',
//   orange: '#f59e0b',
//   border: '#e5e7eb',
//   purpleLight: '#ede9fe',
//   orangeLight: '#fef3c7',
// };

// export default function CommunityExplorerScreen() {
//   const navigation = useNavigation();
//   const { width } = useWindowDimensions();
//   const isNarrow = width < 720;

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>AI Recommendations</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <ScrollView 
//         style={styles.scrollView} 
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Subtitle */}
//         <Text style={styles.subtitle}>
//           Create personalized itineraries or explore your saved AI recommendations
//         </Text>

//         {/* Two Cards Grid */}
//         <View style={[styles.grid, isNarrow && { flexDirection: 'column' }]}>
//           {/* Create New AI Itinerary Card */}
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => navigation.navigate('AIRecommendationsFormScreen')}
//             activeOpacity={0.7}
//           >
//             <View style={styles.cardHeader}>
//               <View style={[styles.iconWrap, { backgroundColor: COLORS.purple }]}>
//                 <Ionicons name="bulb-outline" size={24} color="#fff" />
//               </View>
//               <Text style={styles.cardTitle}>Create AI Itinerary</Text>
//             </View>

//             <Text style={styles.cardDescription}>
//               Get personalized travel recommendations based on your preferences, budget, and travel style
//             </Text>

//             <View style={styles.cardFooter}>
//               <View style={styles.cardFooterLeft}>
//                 <Ionicons name="add-circle-outline" size={18} color={COLORS.purple} />
//                 <Text style={[styles.cardFooterText, { color: COLORS.purple }]}>Generate Now</Text>
//               </View>
//               <Ionicons name="arrow-forward" size={18} color={COLORS.purple} />
//             </View>
//           </TouchableOpacity>

//           {/* Saved AI Itineraries Card */}
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => navigation.navigate('SavedAIItinerariesScreen')}
//             activeOpacity={0.7}
//           >
//             <View style={styles.cardHeader}>
//               <View style={[styles.iconWrap, { backgroundColor: COLORS.orange }]}>
//                 <Ionicons name="bookmarks-outline" size={24} color="#fff" />
//               </View>
//               <Text style={styles.cardTitle}>Saved AI Itineraries</Text>
//             </View>

//             <Text style={styles.cardDescription}>
//               View your collection of AI-generated travel plans and explore saved recommendations
//             </Text>

//             <View style={styles.cardFooter}>
//               <View style={styles.cardFooterLeft}>
//                 <Ionicons name="folder-open-outline" size={18} color={COLORS.orange} />
//                 <Text style={[styles.cardFooterText, { color: COLORS.orange }]}>View Collection</Text>
//               </View>
//               <Ionicons name="arrow-forward" size={18} color={COLORS.orange} />
//             </View>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.bg,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: COLORS.text,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 40,
//     maxWidth: 1100,
//     alignSelf: 'center',
//     width: '100%',
//   },
//   subtitle: {
//     fontSize: 15,
//     color: COLORS.subtext,
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   grid: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     gap: 12,
//   },
//   iconWrap: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: COLORS.text,
//     flex: 1,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: COLORS.subtext,
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//   },
//   cardFooterLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   cardFooterText: {
//     fontSize: 15,
//     fontWeight: '700',
//   },
// });


import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  bg: '#F7F9FC',
  card: '#FFFFFF',
  text: '#1f2937',
  subtext: '#6b7280',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  border: '#e5e7eb',
  purpleLight: '#ede9fe',
  orangeLight: '#fef3c7',
};

export default function CommunityExplorerScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isNarrow = width < 720;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Recommendations</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Create personalized itineraries or explore your saved AI recommendations
          </Text>

          {/* Two Cards Grid */}
          <View style={[styles.grid, isNarrow && { flexDirection: 'column' }]}>
            {/* Create New AI Itinerary Card */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('AIRecommendationsFormScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: COLORS.purple }]}>
                  <Ionicons name="bulb-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>Create AI Itinerary</Text>
              </View>

              <Text style={styles.cardDescription}>
                Get personalized travel recommendations based on your preferences, budget, and travel style
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.cardFooterLeft}>
                  <Ionicons name="add-circle-outline" size={18} color={COLORS.purple} />
                  <Text style={[styles.cardFooterText, { color: COLORS.purple }]}>Generate Now</Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color={COLORS.purple} />
              </View>
            </TouchableOpacity>

            {/* Saved AI Itineraries Card */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SavedAIItinerariesScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: COLORS.orange }]}>
                  <Ionicons name="bookmarks-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>Saved AI Itineraries</Text>
              </View>

              <Text style={styles.cardDescription}>
                View your collection of AI-generated travel plans and explore saved recommendations
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.cardFooterLeft}>
                  <Ionicons name="folder-open-outline" size={18} color={COLORS.orange} />
                  <Text style={[styles.cardFooterText, { color: COLORS.orange }]}>View Collection</Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color={COLORS.orange} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60, // To avoid mixing with bottom navigation bar
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.subtext,
    lineHeight: 22,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.subtext,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cardFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardFooterText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
