// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const RecommendationScreen = () => {
//   const [selectedType, setSelectedType] = useState('crowdsourced');
//   const [selectedTab, setSelectedTab] = useState('All');
//   const tabs = ['All', 'Itineraries', 'Events', 'Destinations', 'Services', 'Restaurants'];

//   const renderContent = () => {
//     switch (selectedTab) {
//       case 'Itineraries':
//         return <Text style={styles.contentText}>🧳 Itinerary Cards ({selectedType})</Text>;
//       case 'Events':
//         return <Text style={styles.contentText}>🎉 Event Cards ({selectedType})</Text>;
//       case 'Destinations':
//         return <Text style={styles.contentText}>📍 Destination Cards ({selectedType})</Text>;
//       case 'Services':
//         return <Text style={styles.contentText}>🛎️ Vendor Services ({selectedType})</Text>;
//       case 'Restaurants':
//         return <Text style={styles.contentText}>🍽️ Restaurant Suggestions ({selectedType})</Text>;
//       default:
//         return <Text style={styles.contentText}>✨ Mixed recommendations from all categories ({selectedType})</Text>;
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Recommendations For You</Text>

//       <View style={styles.toggleRow}>
//         <TouchableOpacity
//           style={[styles.card, selectedType === 'crowdsourced' && styles.cardActive]}
//           onPress={() => setSelectedType('crowdsourced')}
//           activeOpacity={0.8}
//         >
//           <View style={styles.cardContent}>
//             <View>
//               <Text style={styles.cardTitle}>Crowdsourced-Based</Text>
//               <Text style={styles.cardSubtitle}>🔥 Trending itineraries, events, and more</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={24} color="#888" />
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.card, selectedType === 'ai' && styles.cardActive]}
//           onPress={() => setSelectedType('ai')}
//           activeOpacity={0.8}
//         >
//           <View style={styles.cardContent}>
//             <View>
//               <Text style={styles.cardTitle}>AI-Based</Text>
//               <Text style={styles.cardSubtitle}>🤖 Personalized travel recommendations</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={24} color="#888" />
//           </View>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.tabRow}>
//         {tabs.map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={[styles.tab, selectedTab === tab && styles.activeTab]}
//             onPress={() => setSelectedTab(tab)}
//           >
//             <Text
//               style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
//             >
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View style={styles.contentArea}>{renderContent()}</View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 24,
//     backgroundColor: '#f2f2f2',
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     color: '#222',
//   },
//   toggleRow: {
//     gap: 12,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: 'transparent',
//   },
//   cardActive: {
//     borderColor: '#007bff',
//   },
//   cardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#000',
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 4,
//   },
//   tabRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 20,
//     gap: 10,
//   },
//   tab: {
//     backgroundColor: '#e0e0e0',
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//   },
//   activeTab: {
//     backgroundColor: '#007bff',
//   },
//   tabText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   activeTabText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   contentArea: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     elevation: 3,
//     marginTop: 16,
//   },
//   contentText: {
//     fontSize: 16,
//     color: '#444',
//   },
// });

// export default RecommendationScreen;
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const RecommendationScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState('crowdsourced');
  const [selectedTab, setSelectedTab] = useState('All');
  const tabs = ['All', 'Itineraries', 'Events', 'Destinations', 'Services', 'Restaurants'];

  const dummyData = {
    crowdsourced: [
      { type: 'Event', title: 'Hunza Music Festival' },
      { type: 'Event', title: 'Swat Cultural Fair' },
      { type: 'Itinerary', title: '5-Day Hunza Trip' },
      { type: 'Itinerary', title: 'Weekend in Skardu' },
      { type: 'Service', title: 'Hunza Guided Tour' },
      { type: 'Service', title: 'Skardu Hotel Stay' },
      { type: 'Destination', title: 'Hunza Valley' },
      { type: 'Destination', title: 'Skardu Mountains' },
      { type: 'Restaurant', title: 'Shinwari BBQ' },
      { type: 'Restaurant', title: 'Mountain Café' }
    ],
    ai: [
      { type: 'Event', title: 'AI Festival Matcher: Swat Edition' },
      { type: 'Itinerary', title: 'AI-Picked Hunza Family Plan' },
      { type: 'Service', title: 'Smart Skardu Tour Assistant' },
      { type: 'Destination', title: 'AI Destination Pick: Hunza Lake' },
      { type: 'Restaurant', title: 'AI Recommended BBQ Point' }
    ]
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'event':
        return <MaterialCommunityIcons name="calendar-star" size={18} color="#007bff" style={styles.icon} />;
      case 'itinerary':
        return <Ionicons name="map" size={18} color="#007bff" style={styles.icon} />;
      case 'service':
        return <FontAwesome5 name="hands-helping" size={18} color="#007bff" style={styles.icon} />;
      case 'destination':
        return <Ionicons name="location" size={18} color="#007bff" style={styles.icon} />;
      case 'restaurant':
        return <MaterialCommunityIcons name="silverware-fork-knife" size={18} color="#007bff" style={styles.icon} />;
      default:
        return null;
    }
  };

  const handleCardPress = (item) => {
    alert(`You clicked: ${item.title}`);
  };

  const renderContent = () => {
    const selectedData = dummyData[selectedType] || [];

    const filteredData =
      selectedTab === 'All'
        ? selectedData
        : selectedData.filter((item) => item.type.toLowerCase() === selectedTab.toLowerCase());

    return (
      <View>
        {filteredData.map((item, index) => (
          <TouchableOpacity key={index} style={styles.cardBox} onPress={() => handleCardPress(item)}>
            <View style={styles.cardRow}>
              {getIcon(item.type)}
              <View>
                <Text style={styles.cardLabel}>{item.type} • {selectedType === 'ai' ? 'AI' : 'Crowdsourced'}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!isMobile && (
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.navigate('TravelerDashboard')}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Recommendations For You</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.card, selectedType === 'crowdsourced' && styles.cardActive]}
          onPress={() => setSelectedType('crowdsourced')}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>Crowdsourced-Based</Text>
              <Text style={styles.cardSubtitle}>🔥 Trending itineraries, events, and more</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedType === 'ai' && styles.cardActive]}
          onPress={() => setSelectedType('ai')}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>AI-Based</Text>
              <Text style={styles.cardSubtitle}>🤖 Personalized travel recommendations</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </View>
        </TouchableOpacity>
      </View>

      {selectedType && (
        <View style={styles.activeModeBanner}>
          <Text style={styles.activeModeText}>
            {selectedType === 'ai'
              ? '🧠 You are viewing: AI-Based Recommendations'
              : '🌍 You are viewing: Crowdsourced-Based Recommendations'}
          </Text>
        </View>
      )}

      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentArea}>{renderContent()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
  },
  backArrow: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: isMobile ? 24 : 64,
    marginBottom: 24,
    color: '#222',
  },
  toggleRow: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: '#007bff',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  activeModeBanner: {
    marginTop: 16,
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#e0f0ff',
    borderRadius: 8,
  },
  activeModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 10,
  },
  tab: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    marginTop: 16,
  },
  contentText: {
    fontSize: 16,
    color: '#444',
  },
  cardBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
});

export default RecommendationScreen;