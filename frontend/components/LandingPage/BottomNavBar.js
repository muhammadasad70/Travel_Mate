
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

// const BottomNavBar = () => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();

//   if (!isMobile) return null;

//   const navItems = [
//     { label: 'Be a Vendor', icon: 'storefront-outline', key: 'vendor' },
//     { label: 'Sign In', icon: 'person-circle-outline', key: 'signin' },
//   ];

//   const handlePress = (key) => {
//     if (Platform.OS === 'web') {
//       const targetIdMap = {
//         home: 'top',
//         contact: 'footer-section',
//       };
//       const el = document.getElementById(targetIdMap[key]);
//       if (el) return el.scrollIntoView({ behavior: 'smooth' });
//     }

//     if (key === 'vendor') {
//       navigation.navigate('RoleSelection');
//     } else if (key === 'signin') {
//       navigation.navigate('RoleSelection');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {navItems.map((item) => (
//         <TouchableOpacity
//           key={item.key}
//           onPress={() => handlePress(item.key)}
//           style={styles.item}
//         >
//           <Ionicons name={item.icon} size={24} color="#003366" />
//           <Text style={styles.label}>{item.label}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 0,
//     height: 60,
//     width: '100%',
//     backgroundColor: '#fff',
//     borderTopColor: '#ddd',
//     borderTopWidth: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   item: {
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: 11,
//     color: '#003366',
//     marginTop: 2,
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

const BottomNavBar = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();

  if (!isMobile) return null;

  const navItems = [
    { label: 'Be a Vendor', icon: 'storefront-outline', key: 'vendor' },
    { label: 'Sign In', icon: 'person-circle-outline', key: 'signin' },
  ];

  const handlePress = (key) => {
    if (Platform.OS === 'web') {
      const targetIdMap = {
        home: 'top',
        contact: 'footer-section',
      };
      const el = document.getElementById(targetIdMap[key]);
      if (el) return el.scrollIntoView({ behavior: 'smooth' });
    }

    if (key === 'vendor') {
      // Set role to vendor and navigate to Login directly
      navigation.navigate('Login', { selectedRole: 'vendor' });
    } else if (key === 'signin') {
      // Navigate to role selection screen
      navigation.navigate('RoleSelection');
    }
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          onPress={() => handlePress(item.key)}
          style={styles.item}
        >
          <Ionicons name={item.icon} size={24} color="#003366" />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 999,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#003366',
    marginTop: 2,
  },
});

export default BottomNavBar;
