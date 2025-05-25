// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   useWindowDimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const Header = () => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();

//   const handleSignInPress = () => {
//     setMenuVisible(false); // Close modal if open
//     navigation.navigate('RoleSelection');
//   };

//   const menuItems = [
//     { label: 'Home', onPress: () => {} },
//     { label: 'About', onPress: () => {} },
//     { label: 'Contact', onPress: () => {} },
//     { label: 'Sign In', onPress: handleSignInPress },
//     { label: 'EN ⌄', onPress: () => {} },
//   ];

//   return (
//     <View style={styles.headerWrapper}>
//       <View style={[styles.header, { width: width < 768 ? '100%' : '85%' }]}>
//         {/* Left Section: Logo and Title */}
//         <View style={styles.titleSection}>
//           <Text style={styles.logo}>✈️</Text>
//           <View>
//             <Text style={styles.appTitle}>TravelMate</Text>
//             <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
//           </View>
//         </View>

//         {/* Right Section */}
//         {isMobile ? (
//           <>
//             <TouchableOpacity onPress={() => setMenuVisible(true)}>
//               <Text style={styles.menuIcon}>☰</Text>
//             </TouchableOpacity>

//             {/* Modal menu */}
//             <Modal
//               visible={menuVisible}
//               animationType="slide"
//               transparent
//               onRequestClose={() => setMenuVisible(false)}
//             >
//               <View style={styles.modalOverlay}>
//                 <View style={styles.modalMenu}>
//                   <TouchableOpacity onPress={() => setMenuVisible(false)}>
//                     <Text style={styles.closeBtn}>✕ Close</Text>
//                   </TouchableOpacity>
//                   {menuItems.map((item, idx) => (
//                     <TouchableOpacity key={idx} style={styles.menuItem} onPress={item.onPress}>
//                       <Text style={styles.menuText}>{item.label}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </Modal>
//           </>
//         ) : (
//           <View style={styles.navLinks}>
//             {menuItems.map((item, idx) => (
//               <TouchableOpacity key={idx} onPress={item.onPress}>
//                 <Text style={styles.navText}>{item.label}</Text>
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
//     backgroundColor: '#fff',
//     paddingTop: 40,
//     paddingBottom: 24,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   titleSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logo: {
//     fontSize: 40,
//     marginRight: 14,
//   },
//   appTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#003366',
//   },
//   tagline: {
//     fontSize: 18,
//     color: '#333',
//     fontWeight: '500',
//     marginTop: 2,
//   },
//   navLinks: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   navText: {
//     fontSize: 16,
//     color: '#003366',
//     marginLeft: 20,
//     fontWeight: '600',
//   },
//   menuIcon: {
//     fontSize: 28,
//     color: '#003366',
//     fontWeight: 'bold',
//     padding: 10,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: '#00000099',
//     justifyContent: 'flex-end',
//   },
//   modalMenu: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   closeBtn: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     textAlign: 'right',
//     marginBottom: 20,
//   },
//   menuItem: {
//     paddingVertical: 12,
//   },
//   menuText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#003366',
//   },
// });

// export default Header;


// Header.js



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   useWindowDimensions,
// } from 'react-native';

// const Header = ({ onNavigate }) => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;

//   const menuItems = [
//     { label: 'Home', key: 'home' },
//     { label: 'About', key: 'about' },
//     { label: 'Contact', key: 'contact' },
//     { label: 'Sign In', key: 'signin' },
//     { label: 'EN ⌄', key: 'lang' },
//   ];

//   const handleItemPress = (key) => {
//     setMenuVisible(false);
//     onNavigate?.(key);
//   };

//   return (
//     <View style={styles.headerWrapper}>
//       <View style={[styles.header, { width: width < 768 ? '100%' : '85%' }]}>
//         {/* Logo and title */}
//         <View style={styles.titleSection}>
//           <Text style={styles.logo}>✈️</Text>
//           <View>
//             <Text style={styles.appTitle}>TravelMate</Text>
//             <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
//           </View>
//         </View>

//         {/* Menu */}
//         {isMobile ? (
//           <>
//             <TouchableOpacity onPress={() => setMenuVisible(true)}>
//               <Text style={styles.menuIcon}>☰</Text>
//             </TouchableOpacity>

//             <Modal
//               visible={menuVisible}
//               animationType="slide"
//               transparent
//               onRequestClose={() => setMenuVisible(false)}
//             >
//               <View style={styles.modalOverlay}>
//                 <View style={styles.modalMenu}>
//                   <TouchableOpacity onPress={() => setMenuVisible(false)}>
//                     <Text style={styles.closeBtn}>✕ Close</Text>
//                   </TouchableOpacity>
//                   {menuItems.map((item, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       style={styles.menuItem}
//                       onPress={() => handleItemPress(item.key)}
//                     >
//                       <Text style={styles.menuText}>{item.label}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </Modal>
//           </>
//         ) : (
//           <View style={styles.navLinks}>
//             {menuItems.map((item, idx) => (
//               <TouchableOpacity key={idx} onPress={() => handleItemPress(item.key)}>
//                 <Text
//                   style={[styles.navText, item.key === 'home' ? styles.activeLink : null]}
//                 >
//                   {item.label}
//                 </Text>
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
//     backgroundColor: '#fff',
//     paddingTop: 40,
//     paddingBottom: 24,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   titleSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logo: {
//     fontSize: 40,
//     marginRight: 14,
//   },
//   appTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#003366',
//   },
//   tagline: {
//     fontSize: 18,
//     color: '#333',
//     fontWeight: '500',
//     marginTop: 2,
//   },
//   navLinks: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   navText: {
//     fontSize: 16,
//     color: '#003366',
//     marginLeft: 20,
//     fontWeight: '600',
//   },
//   activeLink: {
//     textDecorationLine: 'underline',
//     color: '#0077b6',
//   },
//   menuIcon: {
//     fontSize: 28,
//     color: '#003366',
//     fontWeight: 'bold',
//     padding: 10,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: '#00000099',
//     justifyContent: 'flex-end',
//   },
//   modalMenu: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   closeBtn: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     textAlign: 'right',
//     marginBottom: 20,
//   },
//   menuItem: {
//     paddingVertical: 12,
//   },
//   menuText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#003366',
//   },
// });

// export default Header;



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const Header = () => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();

//   const handleItemPress = (key) => {
//     setMenuVisible(false);

//     // ✅ Web-specific anchor scrolling
//     if (Platform.OS === 'web') {
//       let targetId = null;

//       if (key === 'home') targetId = 'top';
//       else if (key === 'about') targetId = 'about-section';
//       else if (key === 'contact') targetId = 'footer-section';

//       if (targetId) {
//         const el = document.getElementById(targetId);
//         if (el) el.scrollIntoView({ behavior: 'smooth' });
//       }
//     }

//     // ✅ Navigation for Sign In
//     if (key === 'signin') {
//       navigation.navigate('RoleSelection');
//     }
//   };

//   const menuItems = [
//     { label: 'Home', key: 'home' },
//     { label: 'About', key: 'about' },
//     { label: 'Contact', key: 'contact' },
//     { label: 'Sign In', key: 'signin' },
//     { label: 'EN ⌄', key: 'lang' },
//   ];

//   return (
//     <View style={styles.headerWrapper}>
//       <View style={[styles.header, { width: width < 768 ? '100%' : '85%' }]}>
//         {/* Logo and title */}
//         <View style={styles.titleSection}>
//           <Text style={styles.logo}>✈️</Text>
//           <View>
//             <Text style={styles.appTitle}>TravelMate</Text>
//             <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
//           </View>
//         </View>

//         {/* Menu */}
//         {isMobile ? (
//           <>
//             <TouchableOpacity onPress={() => setMenuVisible(true)}>
//               <Text style={styles.menuIcon}>☰</Text>
//             </TouchableOpacity>

//             <Modal
//               visible={menuVisible}
//               animationType="slide"
//               transparent
//               onRequestClose={() => setMenuVisible(false)}
//             >
//               <View style={styles.modalOverlay}>
//                 <View style={styles.modalMenu}>
//                   <TouchableOpacity onPress={() => setMenuVisible(false)}>
//                     <Text style={styles.closeBtn}>✕ Close</Text>
//                   </TouchableOpacity>
//                   {menuItems.map((item, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       style={styles.menuItem}
//                       onPress={() => handleItemPress(item.key)}
//                     >
//                       <Text style={styles.menuText}>{item.label}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </Modal>
//           </>
//         ) : (
//           <View style={styles.navLinks}>
//             {menuItems.map((item, idx) => (
//               <TouchableOpacity key={idx} onPress={() => handleItemPress(item.key)}>
//                 <Text
//                   style={[styles.navText, item.key === 'home' ? styles.activeLink : null]}
//                 >
//                   {item.label}
//                 </Text>
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
//     backgroundColor: '#fff',
//     paddingTop: 40,
//     paddingBottom: 24,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   titleSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logo: {
//     fontSize: 40,
//     marginRight: 14,
//   },
//   appTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#003366',
//   },
//   tagline: {
//     fontSize: 18,
//     color: '#333',
//     fontWeight: '500',
//     marginTop: 2,
//   },
//   navLinks: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   navText: {
//     fontSize: 16,
//     color: '#003366',
//     marginLeft: 20,
//     fontWeight: '600',
//   },
//   activeLink: {
//     textDecorationLine: 'underline',
//     color: '#0077b6',
//   },
//   menuIcon: {
//     fontSize: 28,
//     color: '#003366',
//     fontWeight: 'bold',
//     padding: 10,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: '#00000099',
//     justifyContent: 'flex-end',
//   },
//   modalMenu: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   closeBtn: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     textAlign: 'right',
//     marginBottom: 20,
//   },
//   menuItem: {
//     paddingVertical: 12,
//   },
//   menuText: {
//     fontSize: 16,
//     fontWeight: '500',
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
  Modal,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();

  const handleItemPress = (key) => {
    setMenuVisible(false);

    if (Platform.OS === 'web') {
      let targetId = null;
      if (key === 'home') targetId = 'top';
      else if (key === 'about') targetId = 'about-section';
      else if (key === 'contact') targetId = 'footer-section';

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (key === 'signin') {
      navigation.navigate('RoleSelection');
    }
  };

  const menuItems = [
    { label: '🏡 Home', key: 'home' },
    { label: 'ℹ️ About', key: 'about' },
    { label: '📞 Contact', key: 'contact' },
    { label: '🔐 Sign In', key: 'signin' },
    { label: '🌐 EN ⌄', key: 'lang' },
  ];

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.header, { width: width < 768 ? '100%' : '85%' }]}>
        <View style={styles.titleSection}>
          <Text style={styles.logo}>✈️</Text>
          <View>
            <Text style={styles.appTitle}>TravelMate</Text>
            <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
          </View>
        </View>

        {isMobile ? (
          <>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>

            <Modal
              visible={menuVisible}
              animationType="slide"
              transparent
              onRequestClose={() => setMenuVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalMenu}>
                  <TouchableOpacity onPress={() => setMenuVisible(false)}>
                    <Text style={styles.closeBtn}>✕ Close</Text>
                  </TouchableOpacity>
                  {menuItems.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.menuItem}
                      onPress={() => handleItemPress(item.key)}
                    >
                      <Text style={styles.menuText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <View style={styles.navLinks}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleItemPress(item.key)}>
                <Text style={[styles.navText, item.key === 'home' ? styles.activeLink : null]}>
                  {item.label}
                </Text>
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
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    marginRight: 14,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
  },
  tagline: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    color: '#003366',
    marginLeft: 20,
    fontWeight: '600',
  },
  activeLink: {
    textDecorationLine: 'underline',
    color: '#0077b6',
  },
  menuIcon: {
    fontSize: 28,
    color: '#003366',
    fontWeight: 'bold',
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'flex-end',
  },
  modalMenu: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'right',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
  },
});

export default Header;

