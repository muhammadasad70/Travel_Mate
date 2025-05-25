// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Platform,
//   Dimensions,
// } from 'react-native';

// const screenWidth = Dimensions.get('window').width;
// const isMobile = screenWidth < 768;

// const DashboardMain = ({ role = 'Viewer' }) => {
//   const [selectedTab, setSelectedTab] = useState('Itineraries');

//   const tabs = ['Itineraries', 'Events', 'Services', 'Destinations', 'Restaurants'];

//   const sampleData = {
//     Itineraries: [
//       { id: 1, title: 'Day 1: Visit the National Park' },
//       { id: 2, title: 'Day 2: Hike to the Waterfall' },
//       { id: 3, title: 'Day 3: Explore the Canyon' },
//     ],
//     Events: [
//       { id: 1, title: 'Hunza Cultural Festival' },
//     ],
//     Services: [
//       { id: 1, title: 'Local Guide Service' },
//     ],
//     Destinations: [
//       { id: 1, title: 'Fairy Meadows Hike' },
//     ],
//     Restaurants: [
//       { id: 1, title: 'Hunza Traditional Kitchen' },
//     ],
//   };

//   const canEdit = role === 'Admin' || role === 'Editor';

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         horizontal
//         contentContainerStyle={styles.tabRow}
//         showsHorizontalScrollIndicator={false}
//       >
//         {tabs.map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setSelectedTab(tab)}
//             style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
//           >
//             <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <ScrollView contentContainerStyle={styles.mainBoard}>
//         {sampleData[selectedTab]?.map((item) => (
//           <View key={item.id} style={styles.card}>
//             <Text style={styles.cardTitle}>{item.title}</Text>
//             <View style={styles.actions}>
//               <TouchableOpacity style={styles.button}><Text>👍 Vote</Text></TouchableOpacity>
//               <TouchableOpacity style={styles.button}><Text>💬 Comment</Text></TouchableOpacity>
//               {canEdit && (
//                 <TouchableOpacity style={styles.button}><Text>✏️ Edit</Text></TouchableOpacity>
//               )}
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: isMobile ? 10 : 20,
//     paddingTop: 10,
//     backgroundColor: '#fff',
//   },
//   tabRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//     marginBottom: 12,
//   },
//   tabButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     backgroundColor: '#e2e6ea',
//     borderRadius: 20,
//     minWidth: 100,
//     alignItems: 'center',
//   },
//   activeTab: {
//     backgroundColor: '#007bff',
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   mainBoard: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   card: {
//     backgroundColor: '#f8f9fa',
//     padding: 14,
//     borderRadius: 8,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 1 },
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   actions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   button: {
//     backgroundColor: '#e9ecef',
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//   },
// });

// export default DashboardMain;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';

const DashboardMain = ({ role = 'Viewer' }) => {
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || width < 768;

  const [selectedTab, setSelectedTab] = useState('Itineraries');

  const tabs = ['Itineraries', 'Events', 'Services', 'Destinations', 'Restaurants'];

  const sampleData = {
    Itineraries: [
      { id: 1, title: 'Day 1: Visit the National Park' },
      { id: 2, title: 'Day 2: Hike to the Waterfall' },
      { id: 3, title: 'Day 3: Explore the Canyon' },
    ],
    Events: [{ id: 1, title: 'Hunza Cultural Festival' }],
    Services: [{ id: 1, title: 'Local Guide Service' }],
    Destinations: [{ id: 1, title: 'Fairy Meadows Hike' }],
    Restaurants: [{ id: 1, title: 'Hunza Traditional Kitchen' }],
  };

  const canEdit = role === 'Admin' || role === 'Editor';

  return (
    <View style={[styles.container, { paddingHorizontal: isMobile ? 10 : 20 }]}>
      <ScrollView
        horizontal
        contentContainerStyle={[styles.tabRow, isMobile && { paddingHorizontal: 0 }]}
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTab,
            ]}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.activeTabText,
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.mainBoard}>
        {sampleData[selectedTab]?.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.button}><Text>👍 Vote</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button}><Text>💬 Comment</Text></TouchableOpacity>
              {canEdit && (
                <TouchableOpacity style={styles.button}><Text>✏️ Edit</Text></TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: '#e2e6ea',
    borderRadius: 3, // ✅ Normal button feel
    alignItems: 'center',
  },  
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  mainBoard: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    backgroundColor: '#e9ecef',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
});

export default DashboardMain;
