// // components/groups/GroupsHeader.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const GroupsHeader = ({ onTabChange }) => {
//   const { width } = useWindowDimensions();
//   const navigation = useNavigation();

//   const isMobile = width < 600;
//   const isNarrow = width < 380;   // small phones
//   const isTiny   = width < 330;   // very small / split view

//   const [selectedItem, setSelectedItem] = useState('overview');

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
//     onTabChange?.(key);
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       try {
//         window.dispatchEvent(new CustomEvent('tabChange', { detail: { tabKey: key } }));
//       } catch {}
//     }
//     navigation.navigate('GroupDashboard', { tabKey: `${key}-${Date.now()}` });
//   };

//   const handleItemPress = (key) => {
//     setSelectedItem(key);
//     dispatchTab(key);
//   };

//   const handleBack = () => {
//     if (navigation.canGoBack()) navigation.goBack();
//     else navigation.navigate('GroupsHome'); // fallback to groups home
//   };

//   // Responsive type sizes
//   const titleSize   = isTiny ? 20 : isNarrow ? 24 : isMobile ? 26 : 30;
//   const taglineSize = isTiny ? 10 : isNarrow ? 11 : 12;

//   return (
//     <SafeAreaView edges={['top']} style={styles.safeWrap}>
//       <View style={styles.headerWrapper}>
//         <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
          
//           {/* Brand + Back */}
//           <View style={styles.brandBlock}>
//             <TouchableOpacity
//               onPress={handleBack}
//               style={styles.backBtn}
//               activeOpacity={0.8}
//             >
//               <Ionicons name="chevron-back" size={22} color="#003366" />
//             </TouchableOpacity>

//             <Text style={[styles.logo, { fontSize: isMobile ? 28 : 38 }]}>👥</Text>
//             <View style={styles.brandTextWrap}>
//               <Text
//                 style={[styles.appTitle, { fontSize: titleSize }]}
//                 numberOfLines={1}
//                 ellipsizeMode="tail"
//               >
//                 Groups
//               </Text>
//               {!isTiny && (
//                 <Text
//                   style={[styles.tagline, { fontSize: taglineSize }]}
//                   numberOfLines={1}
//                   ellipsizeMode="tail"
//                 >
//                   Plan together, stay in sync
//                 </Text>
//               )}
//             </View>
//           </View>

//           {/* Center pills (web only) */}
//           {!isMobile && (
//             <View style={styles.navRow}>
//               {[
//                 { label: 'Overview', key: 'overview' },
//                 { label: 'Plans',    key: 'plans' },
//                 { label: 'Polls',    key: 'polls' },
//                 { label: 'Members',  key: 'members' },
//               ].map((item) => (
//                 <TouchableOpacity
//                   key={item.key}
//                   style={[styles.navButton, selectedItem === item.key && styles.activeButton]}
//                   onPress={() => handleItemPress(item.key)}
//                 >
//                   <Text style={styles.navButtonText}>{item.label}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           {/* Right actions */}
//           <View style={styles.rightSection}>
//             <IconButton
//               icon="notifications-outline"
//               onPress={() => handleItemPress('notification')}
//             />
//             <IconButton
//               icon="chatbubble-ellipses-outline"
//               onPress={() => handleItemPress('messages')}
//             />
//             {/* Settings on web header (always visible on right) */}
//             {!isMobile && (
//               <IconButton
//                 icon="settings-outline"
//                 onPress={() => handleItemPress('settings')}
//               />
//             )}
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const IconButton = ({ icon, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={styles.iconBtn} activeOpacity={0.85}>
//     <Ionicons name={icon} size={22} color="#003366" />
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   safeWrap: { backgroundColor: '#fff' },
//   headerWrapper: {
//     backgroundColor: '#ffffff',
//     paddingTop: 10,
//     paddingBottom: 10,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     ...(Platform.OS === 'web' && {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       zIndex: 999,
//       width: '100%',
//       boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//     }),
//   },
//   headerInner: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   brandBlock: { flexDirection: 'row', alignItems: 'center', minWidth: 0 },
//   backBtn: {
//     marginRight: 6,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F3F6FA',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   logo: { marginRight: 10, lineHeight: 32 },
//   brandTextWrap: { minWidth: 0, maxWidth: 320 },

//   appTitle: { fontWeight: '800', color: '#003366', lineHeight: 30 },
//   tagline: { color: '#3b556f', fontWeight: '600', marginTop: 2, opacity: 0.9 },

//   navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   navButton: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
//   navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

//   rightSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 12 },
//   iconBtn: {
//     padding: 6,
//     backgroundColor: '#F3F6FA',
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
// });

// export default GroupsHeader;


// components/groups/GroupsHeader.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const GroupsHeader = ({ onTabChange }) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const isMobile = width < 600;
  const isNarrow = width < 380;   // small phones
  const isTiny   = width < 330;   // very small / split view

  const [selectedItem, setSelectedItem] = useState('overview');

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
    onTabChange?.(key);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try { window.dispatchEvent(new CustomEvent('tabChange', { detail: { tabKey: key } })); } catch {}
    }
    navigation.navigate('GroupDashboard', { tabKey: `${key}-${Date.now()}` });
  };

  const handleItemPress = (key) => {
    setSelectedItem(key);
    dispatchTab(key);
  };

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('GroupsHome');
  };

  // Responsive type sizes — match Community header feel
  const titleSize   = isTiny ? 20 : isNarrow ? 24 : isMobile ? 26 : 30;
  const taglineSize = isTiny ? 10 : isNarrow ? 11 : 12;

  const tabs = [
    { label: 'Overview', key: 'overview', icon: 'grid-outline' },
    { label: 'Plans',    key: 'plans',    icon: 'map-outline' },
    { label: 'Polls',    key: 'polls',    icon: 'stats-chart-outline' },
    { label: 'Members',  key: 'members',  icon: 'people-outline' },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safeWrap}>
      <View style={styles.headerWrapper}>
        <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
          
          {/* Brand + Back + Travel Mate logo (emoji like Community) */}
          <View style={styles.brandBlock}>
            <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={22} color="#003366" />
            </TouchableOpacity>

            <Text style={[styles.logo, { fontSize: isMobile ? 28 : 38 }]}>✈️</Text>
            <View style={styles.brandTextWrap}>
              <Text
                style={[styles.appTitle, { fontSize: titleSize }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Groups
              </Text>
              {!isTiny && (
                <Text
                  style={[styles.tagline, { fontSize: taglineSize }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Plan together
                </Text>
              )}
            </View>
          </View>

          {/* Center pills (web only) with icons */}
          {!isMobile && (
            <View style={styles.navRow}>
              {tabs.map((item) => {
                const active = selectedItem === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.navButton, active && styles.activeButton]}
                    onPress={() => handleItemPress(item.key)}
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name={item.icon}
                      size={16}
                      color={active ? '#0B74C8' : '#003366'}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.navButtonText, active && { color: '#0B74C8' }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Right actions: notifications, messages, settings (settings only on web header) */}
          <View style={styles.rightSection}>
            <IconButton icon="notifications-outline" onPress={() => handleItemPress('notification')} />
            <IconButton icon="chatbubble-ellipses-outline" onPress={() => handleItemPress('messages')} />
            {!isMobile && (
              <IconButton icon="settings-outline" onPress={() => handleItemPress('settings')} />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const IconButton = ({ icon, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.iconBtn} activeOpacity={0.85}>
    <Ionicons name={icon} size={22} color="#003366" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeWrap: { backgroundColor: '#fff' },
  headerWrapper: {
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 999,
      width: '100%',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    }),
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brandBlock: { flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  backBtn: {
    marginRight: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logo: { marginRight: 10, lineHeight: 32 },
  brandTextWrap: { minWidth: 0, maxWidth: 320 },

  appTitle: { fontWeight: '800', color: '#003366', lineHeight: 30 },
  tagline: { color: '#3b556f', fontWeight: '600', marginTop: 2, opacity: 0.9 },

  navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeButton: { backgroundColor: '#e0f4ff', borderColor: '#0077b6' },
  navButtonText: { fontSize: 14, fontWeight: '600', color: '#003366' },

  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 12 },
  iconBtn: {
    padding: 6,
    backgroundColor: '#F3F6FA',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default GroupsHeader;
