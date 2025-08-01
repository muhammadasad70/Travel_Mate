
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   useWindowDimensions,
//   Platform,
//   Animated,
//   Easing,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useRole } from '../../RoleContext';
// import { Ionicons } from '@expo/vector-icons';

// const Header = () => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();
//   const { setRole } = useRole();

//   const [selectedItem, setSelectedItem] = useState('explore');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const dropdownAnim = useState(new Animated.Value(0))[0];

//   const handleItemPress = (key) => {
//     setSelectedItem(key);
//     closeDropdown();

//     switch (key) {
//       case 'explore': navigation.navigate('TravelerDashboard'); break;
//       case 'tripplanner': navigation.navigate('CrowdsourceItineraries'); break;
//       case 'events': navigation.navigate('EventIntegration'); break;
//       case 'services': navigation.navigate('TravelerServicesScreen'); break;
//       case 'alerts': navigation.navigate('RealTimeAlerts'); break;
//       case 'profile': navigation.navigate('TravelerProfile'); break;
//       case 'groups': navigation.navigate('GroupScreen'); break;
//       case 'community': navigation.navigate('CommunityScreen'); break;
//       case 'settings': navigation.navigate('ManageTravelerProfile'); break;
//       case 'vendor': setRole('vendor'); navigation.navigate('VendorVerificationScreen'); break;
//       case 'logout': navigation.navigate('Landing Page'); break;
//       default: break;
//     }
//   };

//   const toggleDropdown = () => {
//     const toValue = dropdownVisible ? 0 : 1;
//     setDropdownVisible(!dropdownVisible);
//     Animated.timing(dropdownAnim, {
//       toValue,
//       duration: 200,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeDropdown = () => {
//     setDropdownVisible(false);
//     Animated.timing(dropdownAnim, {
//       toValue: 0,
//       duration: 150,
//       useNativeDriver: true,
//     }).start();
//   };

//   const dropdownItems = [
//     { label: '🧭 Explore', key: 'explore' },
//     { label: '📝 Trip Planner', key: 'tripplanner' },
//     { label: '🎉 Events', key: 'events' },
//     { label: '🛎 Services', key: 'services' },
//     { label: '👨‍👩‍👧 Groups', key: 'groups' },
//     { label: '👥 Community', key: 'community' },
//     { label: '⚙️ Settings', key: 'settings' },
//     { label: '💼 Become a Vendor', key: 'vendor' },
//     { label: '🚪 Logout', key: 'logout' },
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
//             {dropdownItems.slice(0, 4).map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 style={[styles.navButton, selectedItem === item.key && styles.activeButton]}
//                 onPress={() => handleItemPress(item.key)}
//               >
//                 <Text style={styles.navButtonText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         <View style={styles.rightSection}>
//           <TouchableOpacity onPress={() => handleItemPress('alerts')} style={styles.iconButton}>
//             <Ionicons name="notifications-outline" size={22} color="#003366" />
//           </TouchableOpacity>

//           {!isMobile && (
//             <TouchableOpacity onPress={() => handleItemPress('profile')} style={styles.profileButton}>
//               <Text style={styles.profileText}>M</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton}>
//             <Ionicons name="menu" size={26} color="#003366" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {dropdownVisible && (
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
//           <Animated.View
//             style={[
//               styles.dropdownMenu,
//               {
//                 opacity: dropdownAnim,
//                 transform: [
//                   {
//                     translateY: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] })
//                   }
//                 ],
//                 ...(isMobile ? styles.mobileDropdown : {})
//               }
//             ]}
//           >
//             {dropdownItems.map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 style={styles.dropdownItem}
//                 onPress={() => handleItemPress(item.key)}
//               >
//                 <Text style={styles.dropdownText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </Animated.View>
//         </TouchableOpacity>
//       )}
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
//       position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, width: '100%',
//       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
//     })
//   },
//   headerInner: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
//   },
//   brand: {
//     flexDirection: 'row', alignItems: 'center'
//   },
//   logo: { fontSize: 38, marginRight: 12 },
//   appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
//   tagline: { fontSize: 14, color: '#555', marginTop: 2, fontWeight: '500' },
//   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   navButton: {
//     backgroundColor: '#f9f9f9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24,
//     borderWidth: 1, borderColor: '#ddd', elevation: 2,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
//   },
//   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
//   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },
//   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   iconButton: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 20 },
//   profileButton: {
//     backgroundColor: '#222', width: 35, height: 35, borderRadius: 20,
//     justifyContent: 'center', alignItems: 'center',
//   },
//   profileText: { color: '#fff', fontWeight: 'bold' },
//   menuButton: { paddingHorizontal: 8, paddingVertical: 6 },
//   overlay: {
//     position: 'absolute', top: 0, bottom: -500, left: 0, right: 0,
//     backgroundColor: 'transparent', zIndex: 5
//   },
//   dropdownMenu: {
//     position: 'absolute', top: 78, right: 16, backgroundColor: '#fff',
//     padding: 10, borderRadius: 12, width: 240,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3, shadowRadius: 6, elevation: 6, zIndex: 10
//   },
//   mobileDropdown: {
//     right: 0, left: 0, borderRadius: 0, width: '100%'
//   },
//   dropdownItem: {
//     paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#eee'
//   },
//   dropdownText: { fontSize: 15, color: '#333' },
// });

// export default Header;





// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   useWindowDimensions,
//   Platform,
//   Animated,
//   Easing,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useRole } from '../../RoleContext';
// import { Ionicons } from '@expo/vector-icons';

// const Header = () => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();
//   const { setRole } = useRole();

//   const [selectedItem, setSelectedItem] = useState('explore');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const dropdownAnim = useState(new Animated.Value(0))[0];

//   const handleItemPress = (key) => {
//     setSelectedItem(key);
//     closeDropdown();

//     switch (key) {
//       case 'explore': navigation.navigate('TravelerDashboard'); break;
//       case 'tripplanner': navigation.navigate('CrowdsourceItineraries'); break;
//       case 'events': navigation.navigate('EventIntegration'); break;
//       case 'services': navigation.navigate('TravelerServicesScreen'); break;
//       case 'alerts': navigation.navigate('RealTimeAlerts'); break;
//       case 'profile': navigation.navigate('TravelerProfile'); break;
//       case 'groups': navigation.navigate('GroupScreen'); break;
//       case 'community': navigation.navigate('CommunityScreen'); break;
//       case 'settings': navigation.navigate('ManageTravelerProfile'); break;
//       case 'vendor': setRole('vendor'); navigation.navigate('VendorVerificationScreen'); break;
//       case 'logout': navigation.navigate('Landing Page'); break;
//       default: break;
//     }
//   };

//   const toggleDropdown = () => {
//     const toValue = dropdownVisible ? 0 : 1;
//     setDropdownVisible(!dropdownVisible);
//     Animated.timing(dropdownAnim, {
//       toValue,
//       duration: 200,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeDropdown = () => {
//     setDropdownVisible(false);
//     Animated.timing(dropdownAnim, {
//       toValue: 0,
//       duration: 150,
//       useNativeDriver: true,
//     }).start();
//   };

//   const webDropdownItems = [
//     { label: '🧭 Explore', key: 'explore' },
//     { label: '📝 Trip Planner', key: 'tripplanner' },
//     { label: '🎉 Events', key: 'events' },
//     { label: '🛎 Services', key: 'services' },
//     { label: '👨‍👩‍👧 Groups', key: 'groups' },
//     { label: '👥 Community', key: 'community' },
//     { label: '⚙️ Settings', key: 'settings' },
//     { label: '💼 Become a Vendor', key: 'vendor' },
//     { label: '🚪 Logout', key: 'logout' },
//   ];

//   const mobileDropdownItems = [
//     { label: '⚙️ Settings', key: 'settings' },
//     { label: '💼 Become a Vendor', key: 'vendor' },
//     { label: '🔔 Notifications', key: 'alerts' },
//     { label: '👨‍👩‍👧 Groups', key: 'groups' },
//   ];

//   const dropdownItems = isMobile ? mobileDropdownItems : webDropdownItems;

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
//             {webDropdownItems.slice(0, 4).map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 style={[styles.navButton, selectedItem === item.key && styles.activeButton]}
//                 onPress={() => handleItemPress(item.key)}
//               >
//                 <Text style={styles.navButtonText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         <View style={styles.rightSection}>
//           {!isMobile && (
//             <TouchableOpacity onPress={() => handleItemPress('alerts')} style={styles.iconButton}>
//               <Ionicons name="notifications-outline" size={22} color="#003366" />
//             </TouchableOpacity>
//           )}

//           {!isMobile && (
//             <TouchableOpacity onPress={() => handleItemPress('profile')} style={styles.profileButton}>
//               <Text style={styles.profileText}>M</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton}>
//             <Ionicons name="menu" size={26} color="#003366" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {dropdownVisible && (
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
//           <Animated.View
//             style={[
//               styles.dropdownMenu,
//               {
//                 opacity: dropdownAnim,
//                 transform: [
//                   {
//                     translateY: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] })
//                   }
//                 ],
//                 ...(isMobile ? styles.mobileDropdown : {})
//               }
//             ]}
//           >
//             {dropdownItems.map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 style={styles.dropdownItem}
//                 onPress={() => handleItemPress(item.key)}
//               >
//                 <Text style={styles.dropdownText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </Animated.View>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerWrapper: {
//     backgroundColor: '#ffffff', paddingTop: 28, paddingBottom: 6, paddingHorizontal: 24, alignItems: 'center',
//     ...(Platform.OS === 'web' && {
//       position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, width: '100%',
//       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
//     })
//   },
//   headerInner: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
//   },
//   brand: {
//     flexDirection: 'row', alignItems: 'center'
//   },
//   logo: { fontSize: 38, marginRight: 12 },
//   appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
//   tagline: { fontSize: 14, color: '#555', marginTop: 2, fontWeight: '500' },
//   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   navButton: {
//     backgroundColor: '#f9f9f9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24,
//     borderWidth: 1, borderColor: '#ddd', elevation: 2,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
//   },
//   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
//   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },
//   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   iconButton: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 20 },
//   profileButton: {
//     backgroundColor: '#222', width: 35, height: 35, borderRadius: 20,
//     justifyContent: 'center', alignItems: 'center',
//   },
//   profileText: { color: '#fff', fontWeight: 'bold' },
//   menuButton: { paddingHorizontal: 8, paddingVertical: 6 },
//   overlay: {
//     position: 'absolute', top: 0, bottom: -500, left: 0, right: 0,
//     backgroundColor: 'transparent', zIndex: 5
//   },
//   dropdownMenu: {
//     position: 'absolute', top: 78, right: 16, backgroundColor: '#fff',
//     padding: 10, borderRadius: 12, width: 240,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3, shadowRadius: 6, elevation: 6, zIndex: 10
//   },
//   mobileDropdown: {
//     right: 0, left: 0, borderRadius: 0, width: '100%'
//   },
//   dropdownItem: {
//     paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#eee'
//   },
//   dropdownText: { fontSize: 15, color: '#333' },
// });

// export default Header;




// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   useWindowDimensions,
//   Platform,
//   Animated,
//   Easing,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useRole } from '../../RoleContext';
// import { Ionicons } from '@expo/vector-icons';

// const Header = () => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();
//   const { setRole } = useRole();

//   const [selectedItem, setSelectedItem] = useState('explore');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const dropdownAnim = useState(new Animated.Value(0))[0];

//   const handleItemPress = (key) => {
//     setSelectedItem(key);
//     closeDropdown();

//     switch (key) {
//       case 'explore': navigation.navigate('TravelerDashboard'); break;
//       case 'tripplanner': navigation.navigate('CrowdsourceItineraries'); break;
//       case 'events': navigation.navigate('EventIntegration'); break;
//       case 'services': navigation.navigate('TravelerServicesScreen'); break;
//       case 'alerts': navigation.navigate('RealTimeAlerts'); break;
//       case 'profile': navigation.navigate('TravelerProfile'); break;
//       case 'groups': navigation.navigate('GroupScreen'); break;
//       case 'community': navigation.navigate('CommunityScreen'); break;
//       case 'settings': navigation.navigate('ManageTravelerProfile'); break;
//       case 'vendor': setRole('vendor'); navigation.navigate('VendorVerificationScreen'); break;
//       case 'logout': navigation.navigate('Landing Page'); break;
//       default: break;
//     }
//   };

//   const toggleDropdown = () => {
//     const toValue = dropdownVisible ? 0 : 1;
//     setDropdownVisible(!dropdownVisible);
//     Animated.timing(dropdownAnim, {
//       toValue,
//       duration: 200,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeDropdown = () => {
//     setDropdownVisible(false);
//     Animated.timing(dropdownAnim, {
//       toValue: 0,
//       duration: 150,
//       useNativeDriver: true,
//     }).start();
//   };

//   const webDropdownItems = [
//     { label: '💼 Become a Vendor', key: 'vendor' },
//     { label: '👨‍👩‍👧 Groups', key: 'groups' },
//     { label: '👥 Community', key: 'community' },
//     { label: '🔔 Notifications', key: 'alerts' },
//     { label: '⚙️ Settings', key: 'settings' },
//     { label: '🚪 Logout', key: 'logout' },
//   ];

//   const mobileDropdownItems = [
//     { label: '💼 Become a Vendor', key: 'vendor' },
//     { label: '👨‍👩‍👧 Groups', key: 'groups' },
//     { label: '🔔 Notifications', key: 'alerts' },
//     { label: '⚙️ Settings', key: 'settings' },
//     { label: '🚪 Logout', key: 'logout' },
//   ];

//   const dropdownItems = isMobile ? mobileDropdownItems : webDropdownItems;

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
//             {webDropdownItems.slice(0, 4).map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 style={[styles.navButton, selectedItem === item.key && styles.activeButton]}
//                 onPress={() => handleItemPress(item.key)}
//               >
//                 <Text style={styles.navButtonText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         <View style={styles.rightSection}>
//           {isMobile && (
//             <TouchableOpacity onPress={() => handleItemPress('alerts')} style={styles.iconButton}>
//               <Ionicons name="notifications-outline" size={22} color="#003366" />
//             </TouchableOpacity>
//           )}

//           {!isMobile && (
//             <TouchableOpacity onPress={() => handleItemPress('alerts')} style={styles.iconButton}>
//               <Ionicons name="notifications-outline" size={22} color="#003366" />
//             </TouchableOpacity>
//           )}

//           {!isMobile && (
//             <TouchableOpacity onPress={() => handleItemPress('profile')} style={styles.profileButton}>
//               <Text style={styles.profileText}>M</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton}>
//             <Ionicons name="menu" size={26} color="#003366" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {dropdownVisible && (
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
//           <Animated.View
//             style={[
//               styles.dropdownMenu,
//               {
//                 opacity: dropdownAnim,
//                 transform: [
//                   {
//                     translateY: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] })
//                   }
//                 ],
//                 ...(isMobile ? styles.mobileDropdown : {})
//               }
//             ]}
//           >
//             {dropdownItems.map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 style={styles.dropdownItem}
//                 onPress={() => handleItemPress(item.key)}
//               >
//                 <Text style={styles.dropdownText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </Animated.View>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerWrapper: {
//     backgroundColor: '#ffffff', paddingTop: 28, paddingBottom: 6, paddingHorizontal: 24, alignItems: 'center',
//     ...(Platform.OS === 'web' && {
//       position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, width: '100%',
//       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
//     })
//   },
//   headerInner: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
//   },
//   brand: {
//     flexDirection: 'row', alignItems: 'center'
//   },
//   logo: { fontSize: 38, marginRight: 12 },
//   appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
//   tagline: { fontSize: 14, color: '#555', marginTop: 2, fontWeight: '500' },
//   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   navButton: {
//     backgroundColor: '#f9f9f9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24,
//     borderWidth: 1, borderColor: '#ddd', elevation: 2,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
//   },
//   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
//   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },
//   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   iconButton: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 20 },
//   profileButton: {
//     backgroundColor: '#222', width: 35, height: 35, borderRadius: 20,
//     justifyContent: 'center', alignItems: 'center',
//   },
//   profileText: { color: '#fff', fontWeight: 'bold' },
//   menuButton: { paddingHorizontal: 8, paddingVertical: 6 },
//   overlay: {
//     position: 'absolute', top: 0, bottom: -500, left: 0, right: 0,
//     backgroundColor: 'transparent', zIndex: 5
//   },
//   dropdownMenu: {
//     position: 'absolute', top: 78, right: 16, backgroundColor: '#fff',
//     padding: 10, borderRadius: 12, width: 240,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3, shadowRadius: 6, elevation: 6, zIndex: 10
//   },
//   mobileDropdown: {
//     right: 0, left: 0, borderRadius: 0, width: '100%'
//   },
//   dropdownItem: {
//     paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#eee'
//   },
//   dropdownText: { fontSize: 15, color: '#333' },
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
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../../RoleContext';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();
  const { setRole } = useRole();

  const [selectedItem, setSelectedItem] = useState('explore');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useState(new Animated.Value(0))[0];

  const handleItemPress = (key) => {
    setSelectedItem(key);
    closeDropdown();

    switch (key) {
      case 'explore': navigation.navigate('TravelerDashboard'); break;
      case 'tripplanner': navigation.navigate('CrowdsourceItineraries'); break;
      case 'events': navigation.navigate('EventIntegration'); break;
      case 'services': navigation.navigate('TravelerServicesScreen'); break;
      case 'alerts': navigation.navigate('RealTimeAlerts'); break;
      case 'profile': navigation.navigate('TravelerProfile'); break;
      case 'groups': navigation.navigate('GroupScreen'); break;
      case 'community': navigation.navigate('CommunityScreen'); break;
      case 'settings': navigation.navigate('ManageTravelerProfile'); break;
      case 'vendor': setRole('vendor'); navigation.navigate('VendorVerificationScreen'); break;
      case 'logout': navigation.navigate('Landing Page'); break;
      default: break;
    }
  };

  const toggleDropdown = () => {
    const toValue = dropdownVisible ? 0 : 1;
    setDropdownVisible(!dropdownVisible);
    Animated.timing(dropdownAnim, {
      toValue,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const webDropdownItems = [
    { label: '🧭 Explore', key: 'explore' },
    { label: '📝 Trip Planner', key: 'tripplanner' },
    { label: '🎉 Events', key: 'events' },
    { label: '🛎 Services', key: 'services' },
    { label: '💼 Become a Vendor', key: 'vendor' },
    { label: '👨‍👩‍👧 Groups', key: 'groups' },
    { label: '👥 Community', key: 'community' },
    { label: '🔔 Notifications', key: 'alerts' },
    { label: '⚙️ Settings', key: 'settings' },
    { label: '🚪 Logout', key: 'logout' },
  ];

  const mobileDropdownItems = [
    { label: '💼 Become a Vendor', key: 'vendor' },
    { label: '👨‍👩‍👧 Groups', key: 'groups' },
    { label: '🔔 Notifications', key: 'alerts' },
    { label: '⚙️ Settings', key: 'settings' },
    { label: '🚪 Logout', key: 'logout' },
    
  ];

  const dropdownItems = isMobile ? mobileDropdownItems : webDropdownItems;

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
            {webDropdownItems.slice(0, 4).map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.navButton, selectedItem === item.key && styles.activeButton]}
                onPress={() => handleItemPress(item.key)}
              >
                <Text style={styles.navButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.rightSection}>
          {isMobile && (
            <TouchableOpacity onPress={() => handleItemPress('alerts')} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color="#003366" />
            </TouchableOpacity>
          )}

          {!isMobile && (
            <TouchableOpacity onPress={() => handleItemPress('alerts')} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color="#003366" />
            </TouchableOpacity>
          )}

          {!isMobile && (
            <TouchableOpacity onPress={() => handleItemPress('profile')} style={styles.profileButton}>
              <Text style={styles.profileText}>M</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton}>
            <Ionicons name="menu" size={26} color="#003366" />
          </TouchableOpacity>
        </View>
      </View>

      {dropdownVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
          <Animated.View
            style={[
              styles.dropdownMenu,
              {
                opacity: dropdownAnim,
                transform: [
                  {
                    translateY: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] })
                  }
                ],
                ...(isMobile ? styles.mobileDropdown : {})
              }
            ]}
          >
            {dropdownItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.dropdownItem}
                onPress={() => handleItemPress(item.key)}
              >
                <Text style={styles.dropdownText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#ffffff', paddingTop: 28, paddingBottom: 15, paddingHorizontal: 24, alignItems: 'center',
    ...(Platform.OS === 'web' && {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, width: '100%',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    })
  },
  headerInner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  brand: {
    flexDirection: 'row', alignItems: 'center'
  },
  logo: { fontSize: 38, marginRight: 12 },
  appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
  tagline: { fontSize: 14, color: '#555', marginTop: 2, fontWeight: '500' },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navButton: {
    backgroundColor: '#f9f9f9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24,
    borderWidth: 1, borderColor: '#ddd', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
  navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 20 },
  profileButton: {
    backgroundColor: '#222', width: 35, height: 35, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  profileText: { color: '#fff', fontWeight: 'bold' },
  menuButton: { paddingHorizontal: 8, paddingVertical: 6 },
  overlay: {
    position: 'absolute', top: 0, bottom: -500, left: 0, right: 0,
    backgroundColor: 'transparent', zIndex: 5
  },
  dropdownMenu: {
    position: 'absolute', top: 78, right: 16, backgroundColor: '#fff',
    padding: 10, borderRadius: 12, width: 240,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 6, zIndex: 10
  },
  mobileDropdown: {
    right: 0, left: 0, borderRadius: 0, width: '100%'
  },
  dropdownItem: {
    paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  dropdownText: { fontSize: 15, color: '#333' },
});

export default Header;
