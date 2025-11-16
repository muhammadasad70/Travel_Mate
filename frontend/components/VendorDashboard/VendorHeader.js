


// // // components/VendorDashboard/VendorHeader.js
// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   useWindowDimensions,
// //   Platform,
// //   Animated,
// //   Easing,
// // } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import { Ionicons } from '@expo/vector-icons';
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';


// // import getBaseURL from '../../config/env';

// // const HEADER_DROPDOWN_TOP = Platform.OS === 'web' ? 78 : 70;
// // const API_URL = getBaseURL().replace(/\/+$/, ''); // ✅ Use your existing config



// // const VendorHeader = ({ onTabChange }) => {
// //   const { width } = useWindowDimensions();
// //   const isMobile = width < 600;
// //   const navigation = useNavigation();

// //   const [selectedItem, setSelectedItem] = useState('home');
// //   const [dropdownVisible, setDropdownVisible] = useState(false);
// //   const [unreadCount, setUnreadCount] = useState(0); // ✅ NEW: Unread notification count
// //   const dropdownAnim = useState(new Animated.Value(0))[0];

// //   // ✅ NEW: Fetch unread count on mount and poll every 30 seconds
// //   useEffect(() => {
// //     fetchUnreadCount();
    
// //     const interval = setInterval(() => {
// //       fetchUnreadCount();
// //     }, 30000); // Poll every 30 seconds

// //     return () => clearInterval(interval);
// //   }, []);

// //   // ✅ NEW: Fetch unread notification count
// //   const fetchUnreadCount = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('token');
// //       if (!token) return;

// //       const response = await axios.get(`${API_URL}/notifications/unread-count`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
      
// //       setUnreadCount(response.data.unread_count || 0);
// //     } catch (error) {
// //       console.error('Error fetching unread count:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (Platform.OS === 'web' && typeof window !== 'undefined') {
// //       const handleTabChange = (e) => {
// //         if (e?.detail?.tabKey) {
// //           setSelectedItem(String(e.detail.tabKey).split('-')[0]);
// //         }
// //       };
// //       window.addEventListener('vendorTabChange', handleTabChange);
// //       return () => window.removeEventListener('vendorTabChange', handleTabChange);
// //     }
// //   }, []);

// //   const dispatchTab = (key) => {
// //     const isWeb = Platform.OS === 'web';
// //     onTabChange?.(key);
// //     if (isWeb && typeof window !== 'undefined') {
// //       try {
// //         const event = new CustomEvent('vendorTabChange', { detail: { tabKey: key } });
// //         window.dispatchEvent(event);
// //       } catch {}
// //     }
// //     navigation.navigate('VendorDashboard', { tabKey: `${key}-${Date.now()}` });
// //   };

// //   const handleItemPress = (key) => {
// //     setSelectedItem(key);
// //     closeDropdown();
    
// //     // ✅ Refresh count when notification tab is opened
// //     if (key === 'notification') {
// //       fetchUnreadCount();
// //     }
    
// //     switch (key) {
// //       case 'home':
// //       case 'services':
// //       case 'add_services':
// //       case 'booking':
// //       case 'request':
// //       case 'analysis':
// //       case 'chat':
// //       case 'notification':
// //       case 'profile':
// //         dispatchTab(key);
// //         break;
// //       case 'settings':
// //         navigation.navigate('ManageVendorProfile');
// //         break;
// //       case 'support':
// //         navigation.navigate('AboutTravelMatePage');
// //         break;
// //       case 'logout':
// //         navigation.navigate('Landing Page');
// //         break;
// //       default:
// //         break;
// //     }
// //   };

// //   const toggleDropdown = () => {
// //     const toValue = dropdownVisible ? 0 : 1;
// //     setDropdownVisible(!dropdownVisible);
// //     Animated.timing(dropdownAnim, {
// //       toValue,
// //       duration: 220,
// //       easing: Easing.out(Easing.cubic),
// //       useNativeDriver: true,
// //     }).start();
// //   };

// //   const closeDropdown = () => {
// //     setDropdownVisible(false);
// //     Animated.timing(dropdownAnim, {
// //       toValue: 0,
// //       duration: 160,
// //       useNativeDriver: true,
// //       easing: Easing.in(Easing.quad),
// //     }).start();
// //   };

// //   const ICON_COLOR = '#003366';
// //   const menuItems = [
// //     { label: 'Home', key: 'home', icon: 'home-outline' },
// //     { label: 'Services', key: 'services', icon: 'construct-outline' },
// //     { label: 'Booking', key: 'booking', icon: 'calendar-outline' },
// //     { label: 'Request', key: 'request', icon: 'download-outline' },
// //     { label: 'Analysis', key: 'analysis', icon: 'stats-chart-outline' },
// //   ];

// //   return (
// //     <View style={styles.headerWrapper}>
// //       <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
// //         {/* Brand */}
// //         <View style={styles.brand}>
// //           <Text style={styles.logo}>✈️</Text>
// //           <View>
// //             <Text style={styles.appTitle}>TravelMate</Text>
// //             <Text style={styles.tagline}>Here Vendors Connect with Travelers</Text>
// //           </View>
// //         </View>

// //         {/* Web: center pills */}
// //         {!isMobile && (
// //           <View style={styles.navRow}>
// //             {menuItems.map((item) => (
// //               <TouchableOpacity
// //                 key={item.key}
// //                 style={[styles.navButton, selectedItem === item.key && styles.activeButton]}
// //                 onPress={() => handleItemPress(item.key)}
// //               >
// //                 <Ionicons
// //                   name={item.icon}
// //                   size={16}
// //                   color={ICON_COLOR}
// //                   style={{ marginRight: 6 }}
// //                 />
// //                 <Text style={styles.navButtonText}>{item.label}</Text>
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //         )}

// //         {/* Right actions */}
// //         <View style={styles.rightSection}>
// //           {Platform.OS === 'web' && !isMobile && (
// //             <IconWithCaption
// //               icon="chatbubble-ellipses-outline"
// //               label="Chat"
// //               onPress={() => handleItemPress('chat')}
// //             />
// //           )}

// //           {/* ✅ Updated: Notification icon with badge */}
// //           <IconWithCaption
// //             icon="notifications-outline"
// //             label="Notifications"
// //             onPress={() => handleItemPress('notification')}
// //             badgeCount={unreadCount}
// //           />

// //           {!isMobile && (
// //             <>
// //               <IconAvatar label="Profile" onPress={() => handleItemPress('profile')} />
// //               <IconWithCaption icon="menu" label="Menu" onPress={toggleDropdown} isMenu />
// //             </>
// //           )}
// //         </View>
// //       </View>

// //       {/* Web: dropdown */}
// //       {!isMobile && dropdownVisible && (
// //         <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
// //           <Animated.View
// //             style={[
// //               styles.menuPanel,
// //               {
// //                 opacity: dropdownAnim,
// //                 transform: [
// //                   {
// //                     translateY: dropdownAnim.interpolate({
// //                       inputRange: [0, 1],
// //                       outputRange: [-10, 0],
// //                     }),
// //                   },
// //                 ],
// //               },
// //             ]}
// //           >
// //             <Text style={styles.sectionLabel}>Quick actions</Text>
// //             <View style={styles.menuGrid}>
// //               <MenuTile icon="add-circle-outline" label="Add Service" onPress={() => handleItemPress('services')} />
// //               <MenuTile icon="list-outline" label="Booking Requests" onPress={() => handleItemPress('request')} />
// //               <MenuTile icon="calendar-outline" label="Bookings" onPress={() => handleItemPress('booking')} />
// //               <MenuTile icon="stats-chart-outline" label="Analytics" onPress={() => handleItemPress('analysis')} />
// //             </View>

// //             <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Your tools</Text>
// //             <RowAction icon="person-circle-outline" label="Profile" onPress={() => handleItemPress('profile')} />
// //             <RowAction icon="chatbubble-ellipses-outline" label="Chat" onPress={() => handleItemPress('chat')} />

// //             <Text style={[styles.sectionLabel, { marginTop: 12 }]}>More</Text>
// //             <FooterItem icon="settings-outline" label="Account Settings" onPress={() => handleItemPress('settings')} />
// //             <FooterItem icon="help-circle-outline" label="Help & Support" onPress={() => handleItemPress('support')} />
// //             <FooterItem icon="notifications-outline" label="System Notifications" onPress={() => handleItemPress('notification')} />
// //             <FooterItem icon="log-out-outline" label="Logout" onPress={() => handleItemPress('logout')} />
// //           </Animated.View>
// //         </TouchableOpacity>
// //       )}
// //     </View>
// //   );
// // };

// // /* helpers + styles */

// // // ✅ Updated: IconWithCaption with badge support
// // const IconWithCaption = ({ icon, label, onPress, isMenu, badgeCount = 0 }) => (
// //   <View style={styles.iconWithLabel}>
// //     <TouchableOpacity
// //       onPress={onPress}
// //       style={[styles.iconNoBg, Platform.OS === 'web' && { cursor: 'pointer' }]}
// //       activeOpacity={0.85}
// //     >
// //       <Ionicons name={icon} size={isMenu ? 26 : 22} color="#003366" />
// //       {/* ✅ Badge */}
// //       {badgeCount > 0 && (
// //         <View style={styles.badge}>
// //           <Text style={styles.badgeText}>
// //             {badgeCount > 9 ? '9+' : badgeCount}
// //           </Text>
// //         </View>
// //       )}
// //     </TouchableOpacity>
// //     <Text style={styles.iconCaption}>{label}</Text>
// //   </View>
// // );

// // const IconAvatar = ({ label, onPress }) => (
// //   <View style={styles.iconWithLabel}>
// //     <TouchableOpacity
// //       onPress={onPress}
// //       style={styles.profileButton}
// //       hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
// //       activeOpacity={0.85}
// //     >
// //       <Text style={styles.profileText}>M</Text>
// //     </TouchableOpacity>
// //     <Text style={styles.iconCaption}>{label}</Text>
// //   </View>
// // );

// // const MenuTile = ({ icon, label, onPress }) => {
// //   const [hovered, setHovered] = useState(false);
// //   return (
// //     <TouchableOpacity
// //       activeOpacity={0.9}
// //       onPress={onPress}
// //       onMouseEnter={() => setHovered(true)}
// //       onMouseLeave={() => setHovered(false)}
// //       style={[
// //         styles.tile,
// //         hovered && styles.tileHover,
// //         Platform.OS === 'web' && { cursor: 'pointer' },
// //       ]}
// //     >
// //       <View style={[styles.tileIconCircle, hovered && { backgroundColor: '#eaf3ff' }]}>
// //         <Ionicons name={icon} size={20} color="#0F3A6B" />
// //       </View>
// //       <Text style={styles.tileText}>{label}</Text>
// //     </TouchableOpacity>
// //   );
// // };

// // const RowAction = ({ icon, label, onPress }) => (
// //   <TouchableOpacity
// //     activeOpacity={0.9}
// //     onPress={onPress}
// //     style={[styles.rowAction, Platform.OS === 'web' && { cursor: 'pointer' }]}
// //   >
// //     <View style={styles.rowIconWrap}>
// //       <Ionicons name={icon} size={18} color="#0F3A6B" />
// //     </View>
// //     <Text style={styles.rowActionText} numberOfLines={1}>{label}</Text>
// //     <Ionicons name="chevron-forward" size={18} color="#9aa3af" />
// //   </TouchableOpacity>
// // );

// // const FooterItem = ({ icon, label, onPress }) => (
// //   <TouchableOpacity
// //     activeOpacity={0.9}
// //     onPress={onPress}
// //     style={[styles.footerItem, Platform.OS === 'web' && { cursor: 'pointer' }]}
// //   >
// //     <Ionicons name={icon} size={18} color="#0F3A6B" />
// //     <Text style={styles.footerItemText}>{label}</Text>
// //   </TouchableOpacity>
// // );

// // const styles = StyleSheet.create({
// //   headerWrapper: {
// //     backgroundColor: '#ffffff',
// //     paddingTop: 28,
// //     paddingBottom: 15,
// //     paddingHorizontal: 24,
// //     alignItems: 'center',
// //     ...(Platform.OS === 'web' && {
// //       position: 'fixed',
// //       top: 0, left: 0, right: 0,
// //       zIndex: 999,
// //       width: '100%',
// //       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
// //     }),
// //   },
// //   headerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// //   brand: { flexDirection: 'row', alignItems: 'center' },
// //   logo: { fontSize: 38, marginRight: 12 },
// //   appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
// //   tagline: { fontSize: 12, color: '#555', marginTop: 2, fontWeight: '600' },

// //   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
// //   navButton: {
// //     backgroundColor: '#f9f9f9',
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     borderRadius: 24,
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
// //   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

// //   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 12 },

// //   iconWithLabel: { alignItems: 'center', justifyContent: 'center', gap: 2 },
// //   iconCaption: { fontSize: 10, fontWeight: '500', color: '#003366', lineHeight: 12 },
// //   iconNoBg: { padding: 5, backgroundColor: 'transparent', position: 'relative' },

// //   // ✅ NEW: Badge styles
// //   badge: {
// //     position: 'absolute',
// //     top: 2,
// //     right: 2,
// //     backgroundColor: '#EF4444',
// //     borderRadius: 10,
// //     minWidth: 18,
// //     height: 18,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 4,
// //     borderWidth: 2,
// //     borderColor: '#fff',
// //   },
// //   badgeText: {
// //     color: '#fff',
// //     fontSize: 10,
// //     fontWeight: '700',
// //     lineHeight: 12,
// //   },

// //   profileButton: {
// //     backgroundColor: '#222',
// //     width: 35, height: 35, borderRadius: 20,
// //     justifyContent: 'center', alignItems: 'center',
// //   },
// //   profileText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

// //   overlay: { position: 'absolute', top: 0, bottom: -500, left: 0, right: 0, backgroundColor: 'transparent' },

// //   menuPanel: {
// //     position: 'absolute',
// //     top: HEADER_DROPDOWN_TOP,
// //     right: 12,
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 14,
// //     borderWidth: 1,
// //     borderColor: '#E5E7EB',
// //     width: 400,
// //     maxWidth: '42vw',
// //     minWidth: 420,
// //     boxShadow: Platform.OS === 'web' ? '0 18px 40px rgba(0,0,0,0.16)' : undefined,
// //   },

// //   sectionLabel: { fontSize: 12, letterSpacing: 0.3, fontWeight: '800', color: '#6B7280', marginBottom: 8 },

// //   menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
// //   tile: {
// //     width: '48%',
// //     height: 76,
// //     borderRadius: 14,
// //     borderWidth: 1,
// //     borderColor: '#EAEFF5',
// //     backgroundColor: '#FAFCFF',
// //     paddingHorizontal: 12,
// //     justifyContent: 'center',
// //     gap: 8,
// //     ...(Platform.OS === 'web' && { transition: 'background-color .15s, border-color .15s' }),
// //   },
// //   tileHover: { borderColor: '#cfe2ff', backgroundColor: '#f6faff' },
// //   tileIconCircle: {
// //     width: 34, height: 34, borderRadius: 17,
// //     backgroundColor: '#f0f6ff',
// //     alignItems: 'center', justifyContent: 'center',
// //   },
// //   tileText: { fontWeight: '700', color: '#0F172A' },

// //   rowAction: {
// //     height: 48,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#EAEFF5',
// //     backgroundColor: '#FFFFFF',
// //     paddingHorizontal: 12,
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //     gap: 10,
// //     marginTop: 8,
// //   },
// //   rowIconWrap: {
// //     width: 30, height: 30, borderRadius: 15,
// //     alignItems: 'center', justifyContent: 'center',
// //     backgroundColor: '#F3F6FA',
// //   },
// //   rowActionText: { fontWeight: '700', color: '#0F172A', flex: 1 },

// //   footerItem: {
// //     height: 42,
// //     borderRadius: 10,
// //     paddingHorizontal: 10,
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //     gap: 10,
// //   },
// //   footerItemText: { fontWeight: '700', color: '#0F172A' },
// // });

// // export default VendorHeader;


// // components/VendorDashboard/VendorHeader.js
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
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';

// const HEADER_DROPDOWN_TOP = Platform.OS === 'web' ? 78 : 70;
// const API_URL = getBaseURL().replace(/\/+$/, '');

// // ✅ Token helper
// const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };

// const VendorHeader = ({ onTabChange }) => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;
//   const navigation = useNavigation();

//   const [selectedItem, setSelectedItem] = useState('home');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const dropdownAnim = useState(new Animated.Value(0))[0];

//   // Fetch unread count on mount and poll every 30 seconds
//   useEffect(() => {
//     fetchUnreadCount();
    
//     const interval = setInterval(() => {
//       fetchUnreadCount();
//     }, 30000);

//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Updated: Fetch unread notification count with timeout
//   const fetchUnreadCount = async () => {
//     try {
//       const token = await getAuthToken();
//       if (!token) return;

//       const response = await axios.get(`${API_URL}/notifications/unread-count`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 5000,
//       });
      
//       setUnreadCount(response.data.unread_count || 0);
//     } catch (error) {
//       console.error('Error fetching unread count:', error);
//       // Silently fail for badge - don't show alert
//     }
//   };

//   useEffect(() => {
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       const handleTabChange = (e) => {
//         if (e?.detail?.tabKey) {
//           setSelectedItem(String(e.detail.tabKey).split('-')[0]);
//         }
//       };
//       window.addEventListener('vendorTabChange', handleTabChange);
//       return () => window.removeEventListener('vendorTabChange', handleTabChange);
//     }
//   }, []);

//   const dispatchTab = (key) => {
//     const isWeb = Platform.OS === 'web';
//     onTabChange?.(key);
//     if (isWeb && typeof window !== 'undefined') {
//       try {
//         const event = new CustomEvent('vendorTabChange', { detail: { tabKey: key } });
//         window.dispatchEvent(event);
//       } catch {}
//     }
//     navigation.navigate('VendorDashboard', { tabKey: `${key}-${Date.now()}` });
//   };

//   const handleItemPress = (key) => {
//     setSelectedItem(key);
//     closeDropdown();
    
//     // Refresh count when notification tab is opened
//     if (key === 'notification') {
//       fetchUnreadCount();
//     }
    
//     switch (key) {
//       case 'home':
//       case 'services':
//       case 'add_services':
//       case 'booking':
//       case 'request':
//       case 'analysis':
//       case 'chat':
//       case 'notification':
//       case 'profile':
//         dispatchTab(key);
//         break;
//       case 'settings':
//         navigation.navigate('ManageVendorProfile');
//         break;
//       case 'support':
//         navigation.navigate('AboutTravelMatePage');
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
//       duration: 220,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeDropdown = () => {
//     setDropdownVisible(false);
//     Animated.timing(dropdownAnim, {
//       toValue: 0,
//       duration: 160,
//       useNativeDriver: true,
//       easing: Easing.in(Easing.quad),
//     }).start();
//   };

//   const ICON_COLOR = '#003366';
//   const menuItems = [
//     { label: 'Home', key: 'home', icon: 'home-outline' },
//     { label: 'Services', key: 'services', icon: 'construct-outline' },
//     { label: 'Booking', key: 'booking', icon: 'calendar-outline' },
//     { label: 'Request', key: 'request', icon: 'download-outline' },
//     { label: 'Analysis', key: 'analysis', icon: 'stats-chart-outline' },
//   ];

//   return (
//     <View style={styles.headerWrapper}>
//       <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
//         {/* Brand */}
//         <View style={styles.brand}>
//           <Text style={styles.logo}>✈️</Text>
//           <View>
//             <Text style={styles.appTitle}>TravelMate</Text>
//             <Text style={styles.tagline}>Here Vendors Connect with Travelers</Text>
//           </View>
//         </View>

//         {/* Web: center pills */}
//         {!isMobile && (
//           <View style={styles.navRow}>
//             {menuItems.map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 style={[styles.navButton, selectedItem === item.key && styles.activeButton]}
//                 onPress={() => handleItemPress(item.key)}
//               >
//                 <Ionicons
//                   name={item.icon}
//                   size={16}
//                   color={ICON_COLOR}
//                   style={{ marginRight: 6 }}
//                 />
//                 <Text style={styles.navButtonText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Right actions */}
//         <View style={styles.rightSection}>
//           {Platform.OS === 'web' && !isMobile && (
//             <IconWithCaption
//               icon="chatbubble-ellipses-outline"
//               label="Chat"
//               onPress={() => handleItemPress('chat')}
//             />
//           )}

//           <IconWithCaption
//             icon="notifications-outline"
//             label="Notifications"
//             onPress={() => handleItemPress('notification')}
//             badgeCount={unreadCount}
//           />

//           {!isMobile && (
//             <>
//               <IconAvatar label="Profile" onPress={() => handleItemPress('profile')} />
//               <IconWithCaption icon="menu" label="Menu" onPress={toggleDropdown} isMenu />
//             </>
//           )}
//         </View>
//       </View>

//       {/* Web: dropdown */}
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
//             <Text style={styles.sectionLabel}>Quick actions</Text>
//             <View style={styles.menuGrid}>
//               <MenuTile icon="add-circle-outline" label="Add Service" onPress={() => handleItemPress('services')} />
//               <MenuTile icon="list-outline" label="Booking Requests" onPress={() => handleItemPress('request')} />
//               <MenuTile icon="calendar-outline" label="Bookings" onPress={() => handleItemPress('booking')} />
//               <MenuTile icon="stats-chart-outline" label="Analytics" onPress={() => handleItemPress('analysis')} />
//             </View>

//             <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Your tools</Text>
//             <RowAction icon="person-circle-outline" label="Profile" onPress={() => handleItemPress('profile')} />
//             <RowAction icon="chatbubble-ellipses-outline" label="Chat" onPress={() => handleItemPress('chat')} />

//             <Text style={[styles.sectionLabel, { marginTop: 12 }]}>More</Text>
//             <FooterItem icon="settings-outline" label="Account Settings" onPress={() => handleItemPress('settings')} />
//             <FooterItem icon="help-circle-outline" label="Help & Support" onPress={() => handleItemPress('support')} />
//             <FooterItem icon="notifications-outline" label="System Notifications" onPress={() => handleItemPress('notification')} />
//             <FooterItem icon="log-out-outline" label="Logout" onPress={() => handleItemPress('logout')} />
//           </Animated.View>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// /* helpers + styles */

// const IconWithCaption = ({ icon, label, onPress, isMenu, badgeCount = 0 }) => (
//   <View style={styles.iconWithLabel}>
//     <TouchableOpacity
//       onPress={onPress}
//       style={[styles.iconNoBg, Platform.OS === 'web' && { cursor: 'pointer' }]}
//       activeOpacity={0.85}
//     >
//       <Ionicons name={icon} size={isMenu ? 26 : 22} color="#003366" />
//       {badgeCount > 0 && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>
//             {badgeCount > 9 ? '9+' : badgeCount}
//           </Text>
//         </View>
//       )}
//     </TouchableOpacity>
//     <Text style={styles.iconCaption}>{label}</Text>
//   </View>
// );

// const IconAvatar = ({ label, onPress }) => (
//   <View style={styles.iconWithLabel}>
//     <TouchableOpacity
//       onPress={onPress}
//       style={styles.profileButton}
//       hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//       activeOpacity={0.85}
//     >
//       <Text style={styles.profileText}>M</Text>
//     </TouchableOpacity>
//     <Text style={styles.iconCaption}>{label}</Text>
//   </View>
// );

// const MenuTile = ({ icon, label, onPress }) => {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <TouchableOpacity
//       activeOpacity={0.9}
//       onPress={onPress}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={[
//         styles.tile,
//         hovered && styles.tileHover,
//         Platform.OS === 'web' && { cursor: 'pointer' },
//       ]}
//     >
//       <View style={[styles.tileIconCircle, hovered && { backgroundColor: '#eaf3ff' }]}>
//         <Ionicons name={icon} size={20} color="#0F3A6B" />
//       </View>
//       <Text style={styles.tileText}>{label}</Text>
//     </TouchableOpacity>
//   );
// };

// const RowAction = ({ icon, label, onPress }) => (
//   <TouchableOpacity
//     activeOpacity={0.9}
//     onPress={onPress}
//     style={[styles.rowAction, Platform.OS === 'web' && { cursor: 'pointer' }]}
//   >
//     <View style={styles.rowIconWrap}>
//       <Ionicons name={icon} size={18} color="#0F3A6B" />
//     </View>
//     <Text style={styles.rowActionText} numberOfLines={1}>{label}</Text>
//     <Ionicons name="chevron-forward" size={18} color="#9aa3af" />
//   </TouchableOpacity>
// );

// const FooterItem = ({ icon, label, onPress }) => (
//   <TouchableOpacity
//     activeOpacity={0.9}
//     onPress={onPress}
//     style={[styles.footerItem, Platform.OS === 'web' && { cursor: 'pointer' }]}
//   >
//     <Ionicons name={icon} size={18} color="#0F3A6B" />
//     <Text style={styles.footerItemText}>{label}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   headerWrapper: {
//     backgroundColor: '#ffffff',
//     paddingTop: 28,
//     paddingBottom: 15,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     ...(Platform.OS === 'web' && {
//       position: 'fixed',
//       top: 0, left: 0, right: 0,
//       zIndex: 999,
//       width: '100%',
//       boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
//     }),
//   },
//   headerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   brand: { flexDirection: 'row', alignItems: 'center' },
//   logo: { fontSize: 38, marginRight: 12 },
//   appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
//   tagline: { fontSize: 12, color: '#555', marginTop: 2, fontWeight: '600' },

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
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
//   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

//   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 12 },

//   iconWithLabel: { alignItems: 'center', justifyContent: 'center', gap: 2 },
//   iconCaption: { fontSize: 10, fontWeight: '500', color: '#003366', lineHeight: 12 },
//   iconNoBg: { padding: 5, backgroundColor: 'transparent', position: 'relative' },

//   badge: {
//     position: 'absolute',
//     top: 2,
//     right: 2,
//     backgroundColor: '#EF4444',
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '700',
//     lineHeight: 12,
//   },

//   profileButton: {
//     backgroundColor: '#222',
//     width: 35, height: 35, borderRadius: 20,
//     justifyContent: 'center', alignItems: 'center',
//   },
//   profileText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

//   overlay: { position: 'absolute', top: 0, bottom: -500, left: 0, right: 0, backgroundColor: 'transparent' },

//   menuPanel: {
//     position: 'absolute',
//     top: HEADER_DROPDOWN_TOP,
//     right: 12,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     width: 400,
//     maxWidth: '42vw',
//     minWidth: 420,
//     boxShadow: Platform.OS === 'web' ? '0 18px 40px rgba(0,0,0,0.16)' : undefined,
//   },

//   sectionLabel: { fontSize: 12, letterSpacing: 0.3, fontWeight: '800', color: '#6B7280', marginBottom: 8 },

//   menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
//   tile: {
//     width: '48%',
//     height: 76,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#EAEFF5',
//     backgroundColor: '#FAFCFF',
//     paddingHorizontal: 12,
//     justifyContent: 'center',
//     gap: 8,
//     ...(Platform.OS === 'web' && { transition: 'background-color .15s, border-color .15s' }),
//   },
//   tileHover: { borderColor: '#cfe2ff', backgroundColor: '#f6faff' },
//   tileIconCircle: {
//     width: 34, height: 34, borderRadius: 17,
//     backgroundColor: '#f0f6ff',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   tileText: { fontWeight: '700', color: '#0F172A' },

//   rowAction: {
//     height: 48,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#EAEFF5',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 8,
//   },
//   rowIconWrap: {
//     width: 30, height: 30, borderRadius: 15,
//     alignItems: 'center', justifyContent: 'center',
//     backgroundColor: '#F3F6FA',
//   },
//   rowActionText: { fontWeight: '700', color: '#0F172A', flex: 1 },

//   footerItem: {
//     height: 42,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 10,
//   },
//   footerItemText: { fontWeight: '700', color: '#0F172A' },
// });

// export default VendorHeader;
// components/VendorDashboard/VendorHeader.js
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
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const HEADER_DROPDOWN_TOP = Platform.OS === 'web' ? 78 : 70;
const API_URL = getBaseURL().replace(/\/+$/, '');

const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

const VendorHeader = ({ onTabChange }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();

  const [selectedItem, setSelectedItem] = useState('home');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchUnreadCount();
    
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.get(`${API_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleTabChange = (e) => {
        if (e?.detail?.tabKey) {
          setSelectedItem(String(e.detail.tabKey).split('-')[0]);
        }
      };
      window.addEventListener('vendorTabChange', handleTabChange);
      return () => window.removeEventListener('vendorTabChange', handleTabChange);
    }
  }, []);

  const dispatchTab = (key) => {
    const isWeb = Platform.OS === 'web';
    onTabChange?.(key);
    if (isWeb && typeof window !== 'undefined') {
      try {
        const event = new CustomEvent('vendorTabChange', { detail: { tabKey: key } });
        window.dispatchEvent(event);
      } catch {}
    }
    navigation.navigate('VendorDashboard', { tabKey: `${key}-${Date.now()}` });
  };

  const handleItemPress = (key) => {
    setSelectedItem(key);
    closeDropdown();
    
    if (key === 'notification') {
      fetchUnreadCount();
    }
    
    switch (key) {
      case 'home':
      case 'services':
      case 'add_services':
      case 'booking':
      case 'request':
      case 'analysis':
      case 'chat':
      case 'notification':
      case 'profile':
        dispatchTab(key);
        break;
      case 'settings':
        navigation.navigate('ManageVendorProfile');
        break;
      case 'support':
        navigation.navigate('AboutTravelMatePage');
        break;
      case 'logout':
        navigation.navigate('Landing Page');
        break;
      default:
        break;
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
      useNativeDriver: true,
      easing: Easing.in(Easing.quad),
    }).start();
  };

  const ICON_COLOR = '#003366';
  const menuItems = [
    { label: 'Home', key: 'home', icon: 'home-outline' },
    { label: 'Services', key: 'services', icon: 'construct-outline' },
    { label: 'Booking', key: 'booking', icon: 'calendar-outline' },
    { label: 'Request', key: 'request', icon: 'download-outline' },
    { label: 'Analysis', key: 'analysis', icon: 'stats-chart-outline' },
  ];

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
        <View style={styles.brand}>
          <Text style={styles.logo}>✈️</Text>
          <View>
            <Text style={styles.appTitle}>TravelMate</Text>
            <Text style={styles.tagline}>Here Vendors Connect with Travelers</Text>
          </View>
        </View>

        {!isMobile && (
          <View style={styles.navRow}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.navButton,
                  selectedItem === item.key && styles.activeButton,
                  index > 0 && { marginLeft: 12 }
                ]}
                onPress={() => handleItemPress(item.key)}
              >
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={ICON_COLOR}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.navButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.rightSection}>
          {Platform.OS === 'web' && !isMobile && (
            <IconWithCaption
              icon="chatbubble-ellipses-outline"
              label="Chat"
              onPress={() => handleItemPress('chat')}
            />
          )}

          <IconWithCaption
            icon="notifications-outline"
            label="Notifications"
            onPress={() => handleItemPress('notification')}
            badgeCount={unreadCount}
          />

          {!isMobile && (
            <>
              <IconAvatar label="Profile" onPress={() => handleItemPress('profile')} />
              <IconWithCaption icon="menu" label="Menu" onPress={toggleDropdown} isMenu />
            </>
          )}
        </View>
      </View>

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
            <Text style={styles.sectionLabel}>Quick actions</Text>
            <View style={styles.menuGrid}>
              <MenuTile icon="add-circle-outline" label="Add Service" onPress={() => handleItemPress('services')} />
              <MenuTile icon="list-outline" label="Booking Requests" onPress={() => handleItemPress('request')} />
              <MenuTile icon="calendar-outline" label="Bookings" onPress={() => handleItemPress('booking')} />
              <MenuTile icon="stats-chart-outline" label="Analytics" onPress={() => handleItemPress('analysis')} />
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Your tools</Text>
            <RowAction icon="person-circle-outline" label="Profile" onPress={() => handleItemPress('profile')} />
            <RowAction icon="chatbubble-ellipses-outline" label="Chat" onPress={() => handleItemPress('chat')} />

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

const IconWithCaption = ({ icon, label, onPress, isMenu, badgeCount = 0 }) => (
  <View style={styles.iconWithLabel}>
    <TouchableOpacity
      onPress={onPress}
      style={[styles.iconNoBg, Platform.OS === 'web' && { cursor: 'pointer' }]}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={isMenu ? 26 : 22} color="#003366" />
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 9 ? '9+' : badgeCount}
          </Text>
        </View>
      )}
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
    <Ionicons name={icon} size={18} color="#0F3A6B" style={{ marginRight: 10 }} />
    <Text style={styles.footerItemText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#ffffff',
    paddingTop: 28,
    paddingBottom: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 999,
      width: '100%',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    }),
  },
  headerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 38, marginRight: 12 },
  appTitle: { fontSize: 30, fontWeight: '700', color: '#003366', lineHeight: 32 },
  tagline: { fontSize: 12, color: '#555', marginTop: 2, fontWeight: '600' },

  navRow: { flexDirection: 'row', alignItems: 'center' },
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
  navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

  rightSection: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },

  iconWithLabel: { alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  iconCaption: { fontSize: 10, fontWeight: '500', color: '#003366', lineHeight: 12, marginTop: 2 },
  iconNoBg: { padding: 5, backgroundColor: 'transparent', position: 'relative' },

  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },

  profileButton: {
    backgroundColor: '#222',
    width: 35, height: 35, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  profileText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  overlay: { position: 'absolute', top: 0, bottom: -500, left: 0, right: 0, backgroundColor: 'transparent' },

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
    ...(Platform.OS === 'web' && { boxShadow: '0 18px 40px rgba(0,0,0,0.16)' }),
  },

  sectionLabel: { fontSize: 12, letterSpacing: 0.3, fontWeight: '800', color: '#6B7280', marginBottom: 8 },

  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    height: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEFF5',
    backgroundColor: '#FAFCFF',
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 10,
    ...(Platform.OS === 'web' && { transition: 'background-color .15s, border-color .15s' }),
  },
  tileHover: { borderColor: '#cfe2ff', backgroundColor: '#f6faff' },
  tileIconCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#f0f6ff',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
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
    marginTop: 8,
  },
  rowIconWrap: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F3F6FA',
    marginRight: 10,
  },
  rowActionText: { fontWeight: '700', color: '#0F172A', flex: 1 },

  footerItem: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerItemText: { fontWeight: '700', color: '#0F172A' },
});

export default VendorHeader;