

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BottomNavBar = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();

  if (!isMobile) return null;

  const navItems = [
    { label: 'Profile', icon: 'person-circle-outline', key: 'profile' },
    { label: 'Planner', icon: 'calendar-outline', key: 'tripplanner' },
    { label: 'Events', icon: 'sparkles-outline', key: 'events' },
    { label: 'Services', icon: 'briefcase-outline', key: 'services' },
    { label: 'Community', icon: 'people-outline', key: 'community' },
    { label: 'Groups', icon: 'chatbubbles-outline', key: 'groups' },
  ];

  const handlePress = (key) => {
    switch (key) {
      case 'profile':
        navigation.navigate('TravelerProfile');
        break;
      case 'tripplanner':
        navigation.navigate('CrowdsourceItineraries');
        break;
      case 'events':
        navigation.navigate('EventIntegration');
        break;
      case 'services':
        navigation.navigate('TravelerServicesScreen');
        break;
      case 'community':
        navigation.navigate('CommunityScreen');
        break;
      case 'groups':
        navigation.navigate('GroupScreen');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeContainer}>
      <View style={styles.container}>
        {navItems.map((item) => (
          <TouchableOpacity key={item.key} onPress={() => handlePress(item.key)} style={styles.navItem}>
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon} size={22} color="#fff" />
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: 'transparent',
  },
  container: {
    width: '100%',
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
    zIndex: 999,
    backgroundColor: '#801010ff', // fallback if gradient not applied
    background: 'linear-gradient(to right, #ff758c, #ff7eb3, #667eea)', // not supported directly in RN
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconWrapper: {
    backgroundColor: '#78bac0ff',
    padding: 10,
    borderRadius: 30,
    marginBottom: 4,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#010101ff',
  },
});

export default BottomNavBar;


// import React from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const BottomNavBar = () => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();

//   if (!isMobile) return null;

//   const navItems = [
//     { label: 'Profile', icon: 'person-circle-outline', key: 'profile' },
//     { label: 'Planner', icon: 'calendar-outline', key: 'tripplanner' },
//     { label: 'Events', icon: 'sparkles-outline', key: 'events' },
//     { label: 'Services', icon: 'briefcase-outline', key: 'services' },
//     { label: 'Community', icon: 'people-outline', key: 'community' },
//     { label: 'Groups', icon: 'chatbubbles-outline', key: 'groups' },
//   ];

//   const handlePress = (key) => {
//     switch (key) {
//       case 'profile':
//         navigation.navigate('TravelerProfile');
//         break;
//       case 'tripplanner':
//         navigation.navigate('CrowdsourceItineraries');
//         break;
//       case 'events':
//         navigation.navigate('EventIntegration');
//         break;
//       case 'services':
//         navigation.navigate('TravelerServicesScreen');
//         break;
//       case 'community':
//         navigation.navigate('CommunityScreen');
//         break;
//       case 'groups':
//         navigation.navigate('GroupScreen');
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeContainer}>
//       <View style={styles.container}>
//         {navItems.map((item) => (
//           <TouchableOpacity key={item.key} onPress={() => handlePress(item.key)} style={styles.navItem}>
//             <View style={styles.iconWrapper}>
//               <Ionicons name={item.icon} size={22} color="#fff" />
//             </View>
//             <Text style={styles.label}>{item.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeContainer: {
//     backgroundColor: 'transparent',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   container: {
//     width: '100%',
//     height: 75,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingBottom: Platform.OS === 'android' ? 10 : 15,
//     backgroundColor: '#ffffff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.12,
//     shadowRadius: 6,
//     elevation: 10,
//   },
//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 8,
//   },
//   iconWrapper: {
//     backgroundColor: '#78bac0ff',
//     padding: 10,
//     borderRadius: 30,
//     marginBottom: 4,
//     shadowColor: '#fff',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   label: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#010101ff',
//   },
// });

// export default BottomNavBar;

