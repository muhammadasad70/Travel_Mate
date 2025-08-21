

// import React, { useState, useEffect } from 'react';
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

// const HEADER_DROPDOWN_TOP = Platform.OS === 'web' ? 78 : 70;

// const Header = ({ onTabChange }) => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();
//   const { setRole } = useRole();

//   const [selectedItem, setSelectedItem] = useState('explore');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const dropdownAnim = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       const handleTabChange = (e) => {
//         if (e?.detail?.tabKey) setSelectedItem(String(e.detail.tabKey).split('-')[0]);
//       };
//       window.addEventListener('tabChange', handleTabChange);
//       return () => window.removeEventListener('tabChange', handleTabChange);
//     }
//   }, []);

//   const dispatchTab = (key) => {
//     const isWeb = Platform.OS === 'web';
//     onTabChange?.(key);
//     if (isWeb && typeof window !== 'undefined') {
//       try {
//         const event = new CustomEvent('tabChange', { detail: { tabKey: key } });
//         window.dispatchEvent(event);
//       } catch (err) {
//         console.warn('Failed to dispatch tabChange event:', err);
//       }
//     }
//     navigation.navigate('TravelerDashboard', { tabKey: `${key}-${Date.now()}` });
//   };

//   const handleItemPress = (key) => {
//     setSelectedItem(key);
//     closeDropdown();

//     switch (key) {
//       case 'explore':
//       case 'tripplanner':
//       case 'events':
//       case 'services':
//       case 'profile':
//         dispatchTab(key);
//         break;
//       case 'notification':
//         dispatchTab('notification');
//         break;
//       case 'groups':
//         navigation.navigate('GroupScreen');
//         break;
//       case 'community':
//         navigation.navigate('CommunityScreen');
//         break;
//       case 'settings':
//         navigation.navigate('ManageTravelerProfile');
//         break;
//       case 'vendor':
//         setRole('vendor');
//         navigation.navigate('Login', { selectedRole: 'vendor' });
//         break;
//       case 'logout':
//         navigation.navigate('Landing Page');
//         break;
//       // You can still keep 'messages' accessible from Profile or dropdown;
//       // icon removed from header per your request.
//       case 'messages':
//         navigation.navigate('MessagesScreen');
//         break;
//       default:
//         break;
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
//     { label: '💼 Become a Vendor', key: 'vendor' },
//     { label: '👨‍👩‍👧 Groups', key: 'groups' },
//     { label: '👥 Community', key: 'community' },
//     { label: '📢 Alerts', key: 'notification' },
//     { label: '⚙️ Settings', key: 'settings' },
//     { label: '🚪 Logout', key: 'logout' },
//     // No 'profile'—avatar handles it directly
//     // You can also keep a 'messages' item here if you want it in the dropdown.
//   ];

//   const dropdownItems = webDropdownItems.filter(
//     (item) => !['explore', 'tripplanner', 'events', 'services'].includes(item.key)
//   );

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
//           {/* Alerts (icon + caption) — caption now visible on mobile too */}
//           <View style={styles.iconWithLabel}>
//             <TouchableOpacity
//               onPress={() => handleItemPress('notification')}
//               style={styles.iconNoBg}
//               accessibilityLabel="Alerts"
//             >
//               <Ionicons name="notifications-outline" size={22} color="#003366" />
//             </TouchableOpacity>
//             <Text style={styles.iconCaption}>Alerts</Text>
//           </View>

//           {/* Profile avatar (opens in‑page Profile tab) */}
//           {!isMobile && (
//             <>
//               <TouchableOpacity
//                 onPress={() => handleItemPress('profile')}
//                 style={styles.profileButton}
//                 hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                 accessibilityLabel="Open profile"
//               >
//                 <Text style={styles.profileText}>M</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton} accessibilityLabel="Open menu">
//                 <Ionicons name="menu" size={26} color="#003366" />
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>

//       {/* WEB dropdown (secondary actions) */}
//       {!isMobile && dropdownVisible && (
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
//           <Animated.View
//             style={[
//               styles.dropdownMenu,
//               {
//                 opacity: dropdownAnim,
//                 transform: [
//                   {
//                     translateY: dropdownAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [-10, 0],
//                     }),
//                   },
//                 ],
//               },
//             ]}
//           >
//             {dropdownItems.map((item) => (
//               <TouchableOpacity key={item.key} style={styles.dropdownItem} onPress={() => handleItemPress(item.key)}>
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
//     paddingBottom: 15,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     ...(Platform.OS === 'web' && {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       zIndex: 999,
//       width: '100%',
//       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
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
//   logo: { fontSize: 38, marginRight: 12 },
//   appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
//   tagline: { fontSize: 14, color: '#555', marginTop: 2, fontWeight: '500' },

//   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   navButton: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
//   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

//   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },

//   iconWithLabel: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 2,
//   },
//   iconCaption: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#003366',
//     lineHeight: 12,
//   },

//   iconNoBg: { padding: 6, backgroundColor: 'transparent' },

//   profileButton: {
//     backgroundColor: '#222',
//     width: 35,
//     height: 35,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

//   menuButton: { paddingHorizontal: 4, paddingVertical: 6 },

//   overlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: -500,
//     left: 0,
//     right: 0,
//     backgroundColor: 'transparent',
//     zIndex: 5,
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: HEADER_DROPDOWN_TOP,
//     right: 16,
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 12,
//     width: 240,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 10,
//     zIndex: 10,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   dropdownText: { fontSize: 15, color: '#333' },
// });

// export default Header;

// frontend/components/TravelerDashboard/TravelerHeaderScreen.js




// import React, { useState, useEffect } from 'react';
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

// const HEADER_DROPDOWN_TOP = Platform.OS === 'web' ? 78 : 70;

// const Header = ({ onTabChange }) => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();
//   const { setRole } = useRole();

//   const [selectedItem, setSelectedItem] = useState('explore');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const dropdownAnim = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       const handleTabChange = (e) => {
//         if (e?.detail?.tabKey) setSelectedItem(String(e.detail.tabKey).split('-')[0]);
//       };
//       window.addEventListener('tabChange', handleTabChange);
//       return () => window.removeEventListener('tabChange', handleTabChange);
//     }
//   }, []);

//   const dispatchTab = (key) => {
//     const isWeb = Platform.OS === 'web';
//     onTabChange?.(key);
//     if (isWeb && typeof window !== 'undefined') {
//       try {
//         const event = new CustomEvent('tabChange', { detail: { tabKey: key } });
//         window.dispatchEvent(event);
//       } catch {}
//     }
//     navigation.navigate('TravelerDashboard', { tabKey: `${key}-${Date.now()}` });
//   };

//   const handleItemPress = (key) => {
//     setSelectedItem(key);
//     closeDropdown();

//     switch (key) {
//       case 'explore':
//       case 'tripplanner':
//       case 'events':
//       case 'services':
//       case 'profile':
//         dispatchTab(key);
//         break;
//       case 'notification':
//         dispatchTab('notification');
//         break;
//       case 'groups':
//         navigation.navigate('GroupScreen');
//         break;
//       case 'community':
//         navigation.navigate('CommunityScreen');
//         break;
//       case 'settings':
//         navigation.navigate('ManageTravelerProfile');
//         break;
//       case 'vendor':
//         setRole('vendor');
//         navigation.navigate('Login', { selectedRole: 'vendor' });
//         break;
//       case 'logout':
//         navigation.navigate('Landing Page');
//         break;
//       case 'messages':
//         navigation.navigate('MessagesScreen');
//         break;
//       default:
//         break;
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
//     { label: '💼 Become a Vendor', key: 'vendor' },
//     { label: '👨‍👩‍👧 Groups', key: 'groups' },
//     { label: '👥 Community', key: 'community' },
//     { label: '📢 Alerts', key: 'notification' },
//     { label: '⚙️ Settings', key: 'settings' },
//     { label: '🚪 Logout', key: 'logout' },
//   ];

//   const dropdownItems = webDropdownItems.filter(
//     (item) => !['explore', 'tripplanner', 'events', 'services'].includes(item.key)
//   );

//   return (
//     <View style={styles.headerWrapper}>
//       <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
//         {/* Brand */}
//         <View style={styles.brand}>
//           <Text style={styles.logo}>✈️</Text>
//           <View>
//             <Text style={styles.appTitle}>TravelMate</Text>
//             <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
//           </View>
//         </View>

//         {/* Top tabs (web only) */}
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

//         {/* Right actions */}
//         <View style={styles.rightSection}>
//           {/* WEB‑ONLY: Vendor quick action (icon + caption) */}
//           {!isMobile && (
//             <View style={styles.iconWithLabel}>
//               <TouchableOpacity
//                 onPress={() => handleItemPress('vendor')}
//                 style={styles.iconNoBg}
//                 accessibilityLabel="Be a vendor"
//               >
//                 <Ionicons name="briefcase-outline" size={22} color="#003366" />
//               </TouchableOpacity>
//               <Text style={styles.iconCaption}>Be a vendor</Text>
//             </View>
//           )}

//           {/* Alerts (icon + caption) */}
//           <View style={styles.iconWithLabel}>
//             <TouchableOpacity
//               onPress={() => handleItemPress('notification')}
//               style={styles.iconNoBg}
//               accessibilityLabel="Alerts"
//             >
//               <Ionicons name="notifications-outline" size={22} color="#003366" />
//             </TouchableOpacity>
//             <Text style={styles.iconCaption}>Alerts</Text>
//           </View>

//           {/* WEB‑ONLY: Profile (avatar + caption) */}
//           {!isMobile && (
//             <View style={styles.iconWithLabel}>
//               <TouchableOpacity
//                 onPress={() => handleItemPress('profile')}
//                 style={styles.profileButton}
//                 hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                 accessibilityLabel="Open profile"
//               >
//                 <Text style={styles.profileText}>M</Text>
//               </TouchableOpacity>
//               <Text style={styles.iconCaption}>Profile</Text>
//             </View>
//           )}

//           {/* WEB‑ONLY: Menu (icon + caption) */}
//           {!isMobile && (
//             <View style={styles.iconWithLabel}>
//               <TouchableOpacity
//                 onPress={toggleDropdown}
//                 style={styles.menuButton}
//                 accessibilityLabel="Open menu"
//               >
//                 <Ionicons name="menu" size={26} color="#003366" />
//               </TouchableOpacity>
//               <Text style={styles.iconCaption}>Menu</Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* WEB dropdown (secondary actions) */}
//       {!isMobile && dropdownVisible && (
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
//           <Animated.View
//             style={[
//               styles.dropdownMenu,
//               {
//                 opacity: dropdownAnim,
//                 transform: [
//                   {
//                     translateY: dropdownAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [-10, 0],
//                     }),
//                   },
//                 ],
//               },
//             ]}
//           >
//             {dropdownItems.map((item) => (
//               <TouchableOpacity key={item.key} style={styles.dropdownItem} onPress={() => handleItemPress(item.key)}>
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
//     paddingBottom: 15,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     ...(Platform.OS === 'web' && {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       zIndex: 999,
//       width: '100%',
//       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
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
//   logo: { fontSize: 38, marginRight: 12 },
//   appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
//   tagline: { fontSize: 14, color: '#555', marginTop: 2, fontWeight: '500' },

//   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   navButton: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
//   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

//   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 14 },

//   iconWithLabel: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 2,
//   },
//   iconCaption: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#003366',
//     lineHeight: 12,
//   },

//   iconNoBg: { padding: 6, backgroundColor: 'transparent' },

//   profileButton: {
//     backgroundColor: '#222',
//     width: 35,
//     height: 35,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

//   menuButton: { paddingHorizontal: 4, paddingVertical: 6 },

//   overlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: -500,
//     left: 0,
//     right: 0,
//     backgroundColor: 'transparent',
//   },
//   dropdownMenu: {
//     position: 'absolute',
//     top: HEADER_DROPDOWN_TOP,
//     right: 16,
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 12,
//     width: 240,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 10,
//     zIndex: 10,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   dropdownText: { fontSize: 15, color: '#333' },
// });

// export default Header;




// import React, { useState, useEffect } from 'react';
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

// const HEADER_DROPDOWN_TOP = Platform.OS === 'web' ? 78 : 70;

// const Header = ({ onTabChange }) => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();
//   const { setRole } = useRole();

//   const [selectedItem, setSelectedItem] = useState('explore');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const dropdownAnim = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       const handleTabChange = (e) => {
//         if (e?.detail?.tabKey) setSelectedItem(String(e.detail.tabKey).split('-')[0]);
//       };
//       window.addEventListener('tabChange', handleTabChange);
//       return () => window.removeEventListener('tabChange', handleTabChange);
//     }
//   }, []);

//   const dispatchTab = (key) => {
//     const isWeb = Platform.OS === 'web';
//     onTabChange?.(key);
//     if (isWeb && typeof window !== 'undefined') {
//       try {
//         const event = new CustomEvent('tabChange', { detail: { tabKey: key } });
//         window.dispatchEvent(event);
//       } catch {}
//     }
//     navigation.navigate('TravelerDashboard', { tabKey: `${key}-${Date.now()}` });
//   };

//   const handleItemPress = (key) => {
//     setSelectedItem(key);
//     closeDropdown();

//     switch (key) {
//       // in‑page tabs
//       case 'explore':
//       case 'tripplanner':
//       case 'events':
//       case 'services':
//       case 'profile':
//         dispatchTab(key);
//         break;

//       case 'notification': // System Notifications
//         dispatchTab('notification');
//         break;

//       // dedicated screens
//       case 'groups':
//         navigation.navigate('GroupScreen');
//         break;
//       case 'community':
//         navigation.navigate('CommunityScreen');
//         break;
//       case 'saved':
//         navigation.navigate('SavedScreen');
//         break;
//       case 'history':
//         navigation.navigate('TripsScreen');
//         break;
//       case 'messages':
//         navigation.navigate('MessagesScreen');
//         break;

//       case 'settings': // Account Settings
//         navigation.navigate('ManageTravelerProfile');
//         break;
//       case 'support': // Help & Support
//         navigation.navigate('HelpScreen');
//         break;

//       // vendor
//       case 'vendor':
//         setRole('vendor');
//         navigation.navigate('Login', { selectedRole: 'vendor' });
//         break;

//       case 'logout':
//         navigation.navigate('Landing Page');
//         break;
//       default:
//         break;
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

//   return (
//     <View style={styles.headerWrapper}>
//       <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
//         {/* Brand */}
//         <View style={styles.brand}>
//           <Text style={styles.logo}>✈️</Text>
//           <View>
//             <Text style={styles.appTitle}>TravelMate</Text>
//             <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
//           </View>
//         </View>

//         {/* Top tabs (web only) */}
//         {!isMobile && (
//           <View style={styles.navRow}>
//             {[
//               { label: '🧭 Explore', key: 'explore' },
//               { label: '📝 Trip Planner', key: 'tripplanner' },
//               { label: '🎉 Events', key: 'events' },
//               { label: '🛎 Services', key: 'services' },
//             ].map((item) => (
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

//         {/* Right actions */}
//         <View style={styles.rightSection}>
//           {/* WEB: Vendor quick action */}
//           {!isMobile && (
//             <View style={styles.iconWithLabel}>
//               <TouchableOpacity
//                 onPress={() => handleItemPress('vendor')}
//                 style={styles.iconNoBg}
//                 accessibilityLabel="Be a vendor"
//               >
//                 <Ionicons name="briefcase-outline" size={22} color="#003366" />
//               </TouchableOpacity>
//               <Text style={styles.iconCaption}>Be a vendor</Text>
//             </View>
//           )}

//           {/* Alerts */}
//           <View style={styles.iconWithLabel}>
//             <TouchableOpacity
//               onPress={() => handleItemPress('notification')}
//               style={styles.iconNoBg}
//               accessibilityLabel="Alerts"
//             >
//               <Ionicons name="notifications-outline" size={22} color="#003366" />
//             </TouchableOpacity>
//             <Text style={styles.iconCaption}>Alerts</Text>
//           </View>

//           {/* WEB: Profile + Menu (with captions) */}
//           {!isMobile && (
//             <>
//               <View style={styles.iconWithLabel}>
//                 <TouchableOpacity
//                   onPress={() => handleItemPress('profile')}
//                   style={styles.profileButton}
//                   hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                   accessibilityLabel="Open profile"
//                 >
//                   <Text style={styles.profileText}>M</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.iconCaption}>Profile</Text>
//               </View>

//               <View style={styles.iconWithLabel}>
//                 <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton} accessibilityLabel="Open menu">
//                   <Ionicons name="menu" size={26} color="#003366" />
//                 </TouchableOpacity>
//                 <Text style={styles.iconCaption}>Menu</Text>
//               </View>
//             </>
//           )}
//         </View>
//       </View>

//       {/* WEB: Airbnb‑style menu panel */}
//       {!isMobile && dropdownVisible && (
//         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
//           <Animated.View
//             style={[
//               styles.menuPanel,
//               {
//                 opacity: dropdownAnim,
//                 transform: [
//                   {
//                     translateY: dropdownAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [-10, 0],
//                     }),
//                   },
//                 ],
//               },
//             ]}
//           >
//             {/* Grid: Community, Group, Saved, History */}
//             <View style={styles.menuGrid}>
//               <MenuTile
//                 icon="people-circle-outline"
//                 label="Community"
//                 onPress={() => handleItemPress('community')}
//               />
//               <MenuTile
//                 icon="chatbubbles-outline"
//                 label="Group"
//                 onPress={() => handleItemPress('groups')}
//               />
//               <MenuTile
//                 icon="heart-outline"
//                 label="Saved"
//                 onPress={() => handleItemPress('saved')}
//               />
//               <MenuTile
//                 icon="time-outline"
//                 label="History"
//                 onPress={() => handleItemPress('history')}
//               />
//             </View>

//             {/* Row: Profile | Messages */}
//             <View style={styles.rowActions}>
//               <RowAction
//                 icon="person-circle-outline"
//                 label="Profile"
//                 onPress={() => handleItemPress('profile')}
//               />
//               <RowAction
//                 icon="chatbubble-ellipses-outline"
//                 label="Messages"
//                 onPress={() => handleItemPress('messages')}
//               />
//             </View>

//             {/* CTA: Become a Vendor */}
//             <TouchableOpacity style={styles.vendorCta} onPress={() => handleItemPress('vendor')} activeOpacity={0.9}>
//               <Ionicons name="briefcase-outline" size={18} color="#fff" />
//               <Text style={styles.vendorCtaText}>Become a Vendor</Text>
//             </TouchableOpacity>

//             {/* Footer list */}
//             <View style={styles.footerList}>
//               <FooterItem
//                 icon="settings-outline"
//                 label="Account Settings"
//                 onPress={() => handleItemPress('settings')}
//               />
//               <FooterItem
//                 icon="help-circle-outline"
//                 label="Help & Support"
//                 onPress={() => handleItemPress('support')}
//               />
//               <FooterItem
//                 icon="notifications-outline"
//                 label="System Notifications"
//                 onPress={() => handleItemPress('notification')}
//               />
//               <FooterItem icon="log-out-outline" label="Logout" onPress={() => handleItemPress('logout')} />
//             </View>
//           </Animated.View>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// /* ===== Small presentational helpers (web only) ===== */
// const MenuTile = ({ icon, label, onPress }) => (
//   <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.9}>
//     <Ionicons name={icon} size={22} color="#0F3A6B" />
//     <Text style={styles.tileText}>{label}</Text>
//   </TouchableOpacity>
// );

// const RowAction = ({ icon, label, onPress }) => (
//   <TouchableOpacity style={styles.rowAction} onPress={onPress} activeOpacity={0.9}>
//     <Ionicons name={icon} size={20} color="#0F3A6B" />
//     <Text style={styles.rowActionText}>{label}</Text>
//   </TouchableOpacity>
// );

// const FooterItem = ({ icon, label, onPress }) => (
//   <TouchableOpacity style={styles.footerItem} onPress={onPress} activeOpacity={0.8}>
//     <Ionicons name={icon} size={18} color="#0F3A6B" />
//     <Text style={styles.footerItemText}>{label}</Text>
//   </TouchableOpacity>
// );

// /* =================== Styles =================== */
// const styles = StyleSheet.create({
//   headerWrapper: {
//     backgroundColor: '#ffffff',
//     paddingTop: 28,
//     paddingBottom: 15,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     ...(Platform.OS === 'web' && {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       zIndex: 999,
//       width: '100%',
//       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
//     }),
//   },
//   headerInner: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   brand: { flexDirection: 'row', alignItems: 'center' },
//   logo: { fontSize: 38, marginRight: 12 },
//   appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
//   tagline: { fontSize: 14, color: '#555', marginTop: 2, fontWeight: '500' },

//   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   navButton: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
//   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

//   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 14 },

//   iconWithLabel: { alignItems: 'center', justifyContent: 'center', gap: 2 },
//   iconCaption: { fontSize: 11, fontWeight: '600', color: '#003366', lineHeight: 12 },
//   iconNoBg: { padding: 6, backgroundColor: 'transparent' },

//   profileButton: {
//     backgroundColor: '#222',
//     width: 35,
//     height: 35,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
//   menuButton: { paddingHorizontal: 4, paddingVertical: 6 },

//   /* Overlay & panel */
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: -500,
//     left: 0,
//     right: 0,
//     backgroundColor: 'transparent',
//   },
//   menuPanel: {
//     position: 'absolute',
//     top: HEADER_DROPDOWN_TOP,
//     right: 12,
//     width: 420,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     boxShadow: Platform.OS === 'web' ? '0 12px 28px rgba(0,0,0,0.12)' : undefined,
//   },

//   /* Grid section */
//   menuGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//     justifyContent: 'space-between',
//   },
//   tile: {
//     width: '48%',
//     height: 72,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#EAEFF5',
//     backgroundColor: '#FAFCFF',
//     paddingHorizontal: 12,
//     justifyContent: 'center',
//     gap: 6,
//   },
//   tileText: { fontWeight: '700', color: '#0F172A' },

//   /* Row actions */
//   rowActions: {
//     marginTop: 12,
//     flexDirection: 'row',
//     gap: 10,
//   },
//   rowAction: {
//     flex: 1,
//     height: 44,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#EAEFF5',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 8,
//   },
//   rowActionText: { fontWeight: '600', color: '#0F172A' },

//   /* CTA */
//   vendorCta: {
//     marginTop: 12,
//     height: 44,
//     borderRadius: 999,
//     backgroundColor: '#003366',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 8,
//   },
//   vendorCtaText: { color: '#fff', fontWeight: '800' },

//   /* Footer list */
//   footerList: {
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#EAEFF5',
//     paddingTop: 8,
//     gap: 8,
//   },
//   footerItem: {
//     height: 40,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 8,
//   },
//   footerItemText: { fontWeight: '600', color: '#0F172A' },
// });

// export default Header;





import React, { useState, useEffect } from 'react';
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

const HEADER_DROPDOWN_TOP = Platform.OS === 'web' ? 78 : 70;

const Header = ({ onTabChange }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();
  const { setRole } = useRole();

  const [selectedItem, setSelectedItem] = useState('explore');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleTabChange = (e) => {
        if (e?.detail?.tabKey) setSelectedItem(String(e.detail.tabKey).split('-')[0]);
      };
      window.addEventListener('tabChange', handleTabChange);
      return () => window.removeEventListener('tabChange', handleTabChange);
    }
  }, []);

  const dispatchTab = (key) => {
    const isWeb = Platform.OS === 'web';
    onTabChange?.(key);
    if (isWeb && typeof window !== 'undefined') {
      try {
        const event = new CustomEvent('tabChange', { detail: { tabKey: key } });
        window.dispatchEvent(event);
      } catch {}
    }
    navigation.navigate('TravelerDashboard', { tabKey: `${key}-${Date.now()}` });
  };

  const handleItemPress = (key) => {
    setSelectedItem(key);
    closeDropdown();

    switch (key) {
      // in-place tabs
      case 'explore':
      case 'tripplanner':
      case 'events':
      case 'services':
      case 'profile':
        dispatchTab(key);
        break;

      case 'notification':
        dispatchTab('notification'); break;

      // dedicated screens
      case 'groups': navigation.navigate('GroupScreen'); break;
      case 'community': navigation.navigate('CommunityScreen'); break;
      case 'saved': navigation.navigate('SavedScreen'); break;
      case 'history': navigation.navigate('TripsScreen'); break;
      case 'messages': navigation.navigate('MessagesScreen'); break;

      case 'settings': navigation.navigate('ManageTravelerProfile'); break;
      case 'support': navigation.navigate('HelpScreen'); break;

      case 'vendor':
        setRole('vendor');
        navigation.navigate('Login', { selectedRole: 'vendor' });
        break;

      case 'logout': navigation.navigate('Landing Page'); break;
      default: break;
    }
  };

  const toggleDropdown = () => {
    const toValue = dropdownVisible ? 0 : 1;
    setDropdownVisible(!dropdownVisible);
    Animated.timing(dropdownAnim, {
      toValue,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 160,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={styles.logo}>✈️</Text>
          <View>
            <Text style={styles.appTitle}>TravelMate</Text>
            <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
          </View>
        </View>

        {/* Web: top pills */}
        {!isMobile && (
          <View style={styles.navRow}>
            {[
              { label: '🧭 Explore', key: 'explore' },
              { label: '📝 Trip Planner', key: 'tripplanner' },
              { label: '🎉 Events', key: 'events' },
              { label: '🛎 Services', key: 'services' },
            ].map((item) => (
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

        {/* Right actions */}
        <View style={styles.rightSection}>
          {/* web-only vendor */}
          {!isMobile && (
            <IconWithCaption
              icon="briefcase-outline"
              label="Be a vendor"
              onPress={() => handleItemPress('vendor')}
            />
          )}

          {/* alerts (web + mobile) */}
          <IconWithCaption
            icon="notifications-outline"
            label="Alerts"
            onPress={() => handleItemPress('notification')}
          />

          {/* web-only profile + menu */}
          {!isMobile && (
            <>
              <IconAvatar label="Profile" onPress={() => handleItemPress('profile')} />
              <IconWithCaption icon="menu" label="Menu" onPress={toggleDropdown} isMenu />
            </>
          )}
        </View>
      </View>

      {/* Web: enhanced dropdown */}
      {!isMobile && dropdownVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
          <Animated.View
            style={[
              styles.menuPanel,
              {
                opacity: dropdownAnim,
                transform: [
                  {
                    translateY: dropdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* header cap */}
            {/* <View style={styles.panelAccent} /> */}

            {/* Quick actions */}
            <Text style={styles.sectionLabel}>Quick actions</Text>
            <View style={styles.menuGrid}>
              <MenuTile icon="people-circle-outline" label="Community" onPress={() => handleItemPress('community')} />
              <MenuTile icon="chatbubbles-outline" label="Group" onPress={() => handleItemPress('groups')} />
              <MenuTile icon="heart-outline" label="Saved" onPress={() => handleItemPress('saved')} />
              <MenuTile icon="time-outline" label="History" onPress={() => handleItemPress('history')} />
            </View>

            {/* Your tools */}
            <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Your tools</Text>
            <RowAction icon="person-circle-outline" label="Profile" onPress={() => handleItemPress('profile')} />
            <RowAction icon="chatbubble-ellipses-outline" label="Messages" onPress={() => handleItemPress('messages')} />

            {/* CTA */}
            <TouchableOpacity style={styles.vendorCta} onPress={() => handleItemPress('vendor')} activeOpacity={0.9}>
              <Ionicons name="briefcase-outline" size={18} color="#fff" />
              <Text
                style={styles.vendorCtaText}
                numberOfLines={1}
              >
                Become a Vendor
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>

            {/* More */}
            <Text style={[styles.sectionLabel, { marginTop: 12 }]}>More</Text>
            <FooterItem icon="settings-outline" label="Account Settings" onPress={() => handleItemPress('settings')} />
            <FooterItem icon="help-circle-outline" label="Help & Support" onPress={() => handleItemPress('support')} />
            <FooterItem icon="notifications-outline" label="System Notifications" onPress={() => handleItemPress('notification')} />
            <FooterItem icon="log-out-outline" label="Logout" onPress={() => handleItemPress('logout')} />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

/* ---------- small presentational helpers ---------- */
const IconWithCaption = ({ icon, label, onPress, isMenu }) => (
  <View style={styles.iconWithLabel}>
    <TouchableOpacity
      onPress={onPress}
      style={[styles.iconNoBg, Platform.OS === 'web' && { cursor: 'pointer' }]}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={isMenu ? 26 : 22} color="#003366" />
    </TouchableOpacity>
    <Text style={styles.iconCaption}>{label}</Text>
  </View>
);

const IconAvatar = ({ label, onPress }) => (
  <View style={styles.iconWithLabel}>
    <TouchableOpacity
      onPress={onPress}
      style={styles.profileButton}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      activeOpacity={0.85}
    >
      <Text style={styles.profileText}>M</Text>
    </TouchableOpacity>
    <Text style={styles.iconCaption}>{label}</Text>
  </View>
);

const MenuTile = ({ icon, label, onPress }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={[
        styles.tile,
        hovered && styles.tileHover,
        Platform.OS === 'web' && { cursor: 'pointer' },
      ]}
    >
      <View style={[styles.tileIconCircle, hovered && { backgroundColor: '#eaf3ff' }]}>
        <Ionicons name={icon} size={20} color="#0F3A6B" />
      </View>
      <Text style={styles.tileText}>{label}</Text>
    </TouchableOpacity>
  );
};

const RowAction = ({ icon, label, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    style={[styles.rowAction, Platform.OS === 'web' && { cursor: 'pointer' }]}
  >
    <View style={styles.rowIconWrap}>
      <Ionicons name={icon} size={18} color="#0F3A6B" />
    </View>
    <Text style={styles.rowActionText} numberOfLines={1}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#9aa3af" />
  </TouchableOpacity>
);

const FooterItem = ({ icon, label, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    style={[styles.footerItem, Platform.OS === 'web' && { cursor: 'pointer' }]}
  >
    <Ionicons name={icon} size={18} color="#0F3A6B" />
    <Text style={styles.footerItemText}>{label}</Text>
  </TouchableOpacity>
);

/* ----------------------- styles ----------------------- */
const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#ffffff',
    paddingTop: 28,
    paddingBottom: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      width: '100%',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    }),
  },
  headerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 38, marginRight: 12 },
  appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
  tagline: { fontSize: 14, color: '#555', marginTop: 2, fontWeight: '500' },

  navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navButton: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
  navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  iconWithLabel: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  iconCaption: { fontSize: 11, fontWeight: '600', color: '#003366', lineHeight: 12 },
  iconNoBg: { padding: 6, backgroundColor: 'transparent' },

  profileButton: {
    backgroundColor: '#222',
    width: 35, height: 35, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  profileText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  overlay: { position: 'absolute', top: 0, bottom: -500, left: 0, right: 0, backgroundColor: 'transparent' },

  /* menu */
  menuPanel: {
    position: 'absolute',
    top: HEADER_DROPDOWN_TOP,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: 400,
    maxWidth: '42vw',
    minWidth: 420,
    boxShadow: Platform.OS === 'web' ? '0 18px 40px rgba(0,0,0,0.16)' : undefined,
  },
 
  sectionLabel: { fontSize: 12, letterSpacing: 0.3, fontWeight: '800', color: '#6B7280', marginBottom: 8 },

  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  tile: {
    width: '48%',
    height: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    backgroundColor: '#FAFCFF',
    paddingHorizontal: 12,
    justifyContent: 'center',
    gap: 8,
    ...(Platform.OS === 'web' && { transition: 'background-color .15s, border-color .15s' }),
  },
  tileHover: { borderColor: '#cfe2ff', backgroundColor: '#f6faff' },
  tileIconCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#f0f6ff',
    alignItems: 'center', justifyContent: 'center',
  },
  tileText: { fontWeight: '700', color: '#0F172A' },

  rowAction: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  rowIconWrap: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F3F6FA',
  },
  rowActionText: { fontWeight: '700', color: '#0F172A', flex: 1 },

  vendorCta: {
    marginTop: 12,
    height: 46,
    borderRadius: 999,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
  },
  vendorCtaText: {
    color: '#fff',
    fontWeight: '800',
    ...(Platform.OS === 'web' && { whiteSpace: 'nowrap' }),
  },

  footerItem: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  footerItemText: { fontWeight: '700', color: '#0F172A' },
});

export default Header;
