// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { FontAwesome5 } from '@expo/vector-icons';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// const screenWidth = Dimensions.get('window').width;
// const isMobile = screenWidth < 768;

// const cards = [
//   {
//     title: 'Crowdsource Itineraries',
//     icon: <FontAwesome5 name="route" size={32} color="#333" />,
//     color: '#d9f0ff',
//   },
//   {
//     title: 'Recommendations',
//     icon: <MaterialCommunityIcons name="lightbulb-on-outline" size={32} color="#333" />,
//     color: '#fff3cd',
//   },
//   {
//     title: 'Vendor Services',
//     icon: <Feather name="briefcase" size={32} color="#333" />,
//     color: '#e9fbe5',
//   },
//   {
//     title: 'Community',
//     icon: <MaterialCommunityIcons name="account-group" size={32} color="#333" />,
//     color: '#d9f7f2',
//   },
//   {
//     title: 'Group',
//     icon: <FontAwesome5 name="layer-group" size={32} color="#333" />,
//     color: '#eee8ff',
//   },
//   {
//     title: 'And Others',
//     icon: <Feather name="grid" size={32} color="#333" />,
//     color: '#ffe2e2',
//   },
// ];

// const DashboardMain = ({ onCardPress }) => {
//   return (
//     <View style={styles.container}>
//       {cards.map((card, index) => (
//         <TouchableOpacity
//           key={index}
//           style={[styles.card, { backgroundColor: card.color }]}
//           onPress={() => onCardPress?.(card.title)}
//           activeOpacity={0.85}
//         >
//           <View style={styles.icon}>{card.icon}</View>
//           <Text style={styles.cardText}>{card.title}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: isMobile ? 'center' : 'flex-start',
//     gap: 16,
//   },
//   card: {
//     width: isMobile ? '90%' : '30%',
//     minHeight: 120,
//     borderRadius: 16,
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: Platform.OS === 'android' ? 5 : 0,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     transition: 'all 0.3s ease-in-out',
//   },
//   icon: {
//     marginBottom: 12,
//   },
//   cardText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#212529',
//     textAlign: 'center',
//   },
// });

// export default DashboardMain;

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const cards = [
  {
    title: 'Crowdsource Itineraries',
    icon: <FontAwesome5 name="route" size={32} color="#333" />,
    color: '#d9f0ff',
  },
  {
    title: 'Recommendations',
    icon: <MaterialCommunityIcons name="lightbulb-on-outline" size={32} color="#333" />,
    color: '#fff3cd',
  },
  {
    title: 'Vendor Services',
    icon: <Feather name="briefcase" size={32} color="#333" />,
    color: '#e9fbe5',
  },
  {
    title: 'Events Discovery & Integration',
    icon: <Entypo name="ticket" size={32} color="#333" />,
    color: '#d9f7f2',
  },
  {
    title: 'Group',
    icon: <FontAwesome5 name="layer-group" size={32} color="#333" />,
    color: '#eee8ff',
  },
  {
    title: 'Real-Time Alerts',
    icon: <Feather name="bell" size={32} color="#333" />,
    color: '#ffe2e2',
  },
];

const DashboardMain = ({ onCardPress }) => {
  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: card.color }]}
          onPress={() => onCardPress?.(card.title)}
          activeOpacity={0.85}
        >
          <View style={styles.icon}>{card.icon}</View>
          <Text style={styles.cardText}>{card.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'center' : 'flex-start',
    gap: 16,
  },
  card: {
    width: isMobile ? '90%' : '30%',
    minHeight: 120,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: Platform.OS === 'android' ? 5 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    maxWidth: 120,
    flexWrap: 'wrap',
  },
});

export default DashboardMain;
