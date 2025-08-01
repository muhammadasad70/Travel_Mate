

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
//     { label: 'Be a Vendor', icon: 'storefront-outline', key: 'vendor' },
//     { label: 'About Us', icon: 'information-circle-outline', key: 'about' },
//     { label: 'Sign In', icon: 'person-circle-outline', key: 'signin' },
//   ];

//   const handlePress = (key) => {
//     if (Platform.OS === 'web') {
//       const targetIdMap = {
//         home: 'top',
//         contact: 'footer-section',
//         about: 'about-section',
//       };
//       const el = document.getElementById(targetIdMap[key]);
//       if (el) return el.scrollIntoView({ behavior: 'smooth' });
//     }

//     if (key === 'vendor') {
//       navigation.navigate('Login', { selectedRole: 'vendor' });
//     } else if (key === 'signin') {
//       navigation.navigate('RoleSelection');
//     } else if (key === 'about') {
//       navigation.navigate('AboutTravelMatePage');
//     }
//   };

//   return (
//     <SafeAreaView edges={['bottom']} style={styles.safeContainer}>
//       <View style={styles.container}>
//         {navItems.map((item) => (
//           <TouchableOpacity key={item.key} onPress={() => handlePress(item.key)} style={styles.navItem}>
//             <View style={styles.iconWrapper}>
//               <Ionicons name={item.icon} size={20} color="#0077b6" />
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
//     backgroundColor: '#ffffffee',
//   },
//   container: {
//     width: '100%',
//     height: 70,
//     backgroundColor: '#ffffffee',
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: -2 },
//     shadowRadius: 4,
//     elevation: 4,
//     paddingBottom: Platform.OS === 'android' ? 10 : 0,
//     zIndex: 999,
//   },
//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop:10,
//   },
//   iconWrapper: {
//     backgroundColor: '#e6f2ff',
//     padding: 10,
//     borderRadius: 30,
//     marginBottom: 4,
//   },
//   label: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#003366',
//   },
// });

// export default BottomNavBar;


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
    { label: 'Be a Vendor', icon: 'briefcase-outline', key: 'vendor' },
    { label: 'About Us', icon: 'information-circle-outline', key: 'about' },
    { label: 'Sign In', icon: 'log-in-outline', key: 'signin' },
  ];

  const handlePress = (key) => {
    if (Platform.OS === 'web') {
      const targetIdMap = {
        home: 'top',
        contact: 'footer-section',
        about: 'about-section',
      };
      const el = document.getElementById(targetIdMap[key]);
      if (el) return el.scrollIntoView({ behavior: 'smooth' });
    }

    if (key === 'vendor') {
      navigation.navigate('Login', { selectedRole: 'vendor' });
    } else if (key === 'signin') {
      navigation.navigate('RoleSelection');
    } else if (key === 'about') {
      navigation.navigate('AboutTravelMatePage');
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeContainer}>
      <View style={styles.container}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => handlePress(item.key)}
            style={styles.navItem}
            activeOpacity={0.8}
          >
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
