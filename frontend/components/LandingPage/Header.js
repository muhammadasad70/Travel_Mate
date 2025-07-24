
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const Header = () => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();
//   const [selectedItem, setSelectedItem] = useState('home');

//   const handleItemPress = (key) => {
//     setSelectedItem(key);

//     if (Platform.OS === 'web') {
//       const targetIdMap = {
//         home: 'top',
//         contact: 'footer-section',
//       };
//       const targetId = targetIdMap[key];
//       if (targetId) {
//         const el = document.getElementById(targetId);
//         if (el) el.scrollIntoView({ behavior: 'smooth' });
//       }
//     }

//     if (key === 'signin') {
//       navigation.navigate('RoleSelection');
//     }

//     if (key === 'vendor') {
//       navigation.navigate('RoleSelection');
//     }
//   };

//   const menuItems = [
//     { label: '🏠 Home', key: 'home' },
//     { label: '📞 Contact', key: 'contact' },
//     { label: '💼 Become a Vendor', key: 'vendor' },
//     { label: '🔐 Sign In', key: 'signin' },
//   ];

//   return (
//     <View style={styles.headerWrapper}>
//       <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
//         <View style={styles.brand}>
//           <Text style={styles.logo}>✈️</Text>
//           <View>
//             <Text style={styles.appTitle}>TravelMate</Text>
//             <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
//           </View>
//         </View>

//         {!isMobile && (
//           <View style={styles.navRow}>
//             {menuItems.map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 style={[
//                   styles.navButton,
//                   selectedItem === item.key && styles.activeButton,
//                 ]}
//                 onPress={() => handleItemPress(item.key)}
//               >
//                 <Text style={styles.navButtonText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerWrapper: {
//     backgroundColor: '#ffffff',
//     paddingTop: 28,
//     paddingBottom: 6,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     ...(Platform.OS === 'web' && {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       zIndex: 999,
//       width: '100%',
//     }),
//   },
//   headerInner: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   brand: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logo: {
//     fontSize: 38,
//     marginRight: 12,
//   },
//   appTitle: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: '#003366',
//     lineHeight: 32,
//   },
//   tagline: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 2,
//     fontWeight: '500',
//   },
//   navRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   navButton: {
//     backgroundColor: '#f5f5f5',
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   activeButton: {
//     backgroundColor: '#e0f4ff',
//     borderColor: '#0077b6',
//   },
//   navButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#003366',
//   },
// });

// export default Header;


import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../../RoleContext'; // adjust path as needed

const Header = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState('home');
  const { setRole } = useRole(); // ✅ using role context

  const handleItemPress = (key) => {
    setSelectedItem(key);

    if (Platform.OS === 'web') {
      const targetIdMap = {
        home: 'top',
        contact: 'footer-section',
      };
      const targetId = targetIdMap[key];
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (key === 'signin') {
      navigation.navigate('RoleSelection');
    }

    if (key === 'vendor') {
      setRole('vendor'); // ✅ set role
      navigation.navigate('Login', { selectedRole: 'vendor' }); // ✅ go to login
    }
  };

  const menuItems = [
    { label: '🏠 Home', key: 'home' },
    { label: '📞 Contact', key: 'contact' },
    { label: '💼 Become a Vendor', key: 'vendor' },
    { label: '🔐 Sign In', key: 'signin' },
  ];

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
        <View style={styles.brand}>
          <Text style={styles.logo}>✈️</Text>
          <View>
            <Text style={styles.appTitle}>TravelMate</Text>
            <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
          </View>
        </View>

        {!isMobile && (
          <View style={styles.navRow}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.navButton,
                  selectedItem === item.key && styles.activeButton,
                ]}
                onPress={() => handleItemPress(item.key)}
              >
                <Text style={styles.navButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#ffffff',
    paddingTop: 28,
    paddingBottom: 6,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      width: '100%',
    }),
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 38,
    marginRight: 12,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#003366',
    lineHeight: 32,
  },
  tagline: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
    fontWeight: '500',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#e0f4ff',
    borderColor: '#0077b6',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
  },
});

export default Header;
