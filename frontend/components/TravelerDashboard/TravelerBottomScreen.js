

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Platform,
//   Animated,
//   Easing,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const ACTIVE_COLOR = '#003366';
// const INACTIVE_COLOR = '#6B7280';
// const ACTIVE_BG = '#EAF7FF';
// const INACTIVE_BG = '#F3F4F6';
// const NATIVE_DRIVER = Platform.OS !== 'web';

// /** Web + native: single source of truth for "mobile" without unmounting */
// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(() => {
//     if (Platform.OS !== 'web') return true;
//     if (typeof window === 'undefined' || !window.matchMedia) return false;
//     return window.matchMedia('(max-width: 599px)').matches;
//   });

//   useEffect(() => {
//     if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.matchMedia) return;
//     const mql = window.matchMedia('(max-width: 599px)');
//     const handler = (e) => setIsMobile(e.matches);
//     if (mql.addEventListener) mql.addEventListener('change', handler);
//     else mql.addListener(handler);
//     return () => {
//       if (mql.removeEventListener) mql.removeEventListener('change', handler);
//       else mql.removeListener(handler);
//     };
//   }, []);

//   return isMobile;
// }

// const BottomNavBar = ({ onTabChange, currentTab }) => {
//   const isMobile = useIsMobile();
//   const navigation = useNavigation();
//   const [activeKey, setActiveKey] = useState(currentTab || 'explore');

//   // Tabs rendered in-place on TravelerDashboard
//   const navItems = useMemo(
//     () => [
//       { label: 'Explore',  icon: 'compass-outline',       key: 'explore',      isTab: true  },
//       { label: 'Planner',  icon: 'calendar-outline',      key: 'tripplanner',  isTab: true  },
//       { label: 'Events',   icon: 'sparkles-outline',      key: 'events',       isTab: true  },
//       { label: 'Services', icon: 'briefcase-outline',     key: 'services',     isTab: true  },
//       { label: 'Groups',   icon: 'chatbubbles-outline',   key: 'groups',       isTab: false },
//       { label: 'Profile',  icon: 'person-circle-outline', key: 'profile',      isTab: true  }, // ✅ now a tab
//     ],
//     []
//   );

//   // Keep highlight in sync if parent/header changes the tab
//   useEffect(() => {
//     if (currentTab && currentTab !== activeKey) setActiveKey(currentTab);
//   }, [currentTab]);

//   // Also sync with window event (web) so header dispatches are reflected
//   useEffect(() => {
//     const handler = (e) => {
//       const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
//       if (key) setActiveKey(key);
//     };
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       window.addEventListener('tabChange', handler);
//       return () => window.removeEventListener('tabChange', handler);
//     }
//   }, []);

//   const handlePress = (item) => {
//     if (item.isTab) {
//       setActiveKey(item.key);
//       onTabChange?.(item.key); // swap content inside TravelerDashboard
//       return;
//     }
//     // Dedicated screens (non-tabs)
//     switch (item.key) {
//       case 'groups':
//         navigation.navigate('GroupScreen');
//         break;
//       default:
//         break;
//     }
//   };

//   // Always mounted; hidden on wide screens so resize never unmounts it
//   return (
//     <View style={[styles.root, !isMobile && styles.hidden]} pointerEvents={isMobile ? 'auto' : 'none'}>
//       <SafeAreaView edges={['bottom']} style={styles.safeArea}>
//         <View style={styles.glassWrap}>
//           <View style={styles.container}>
//             {navItems.map((item) => {
//               const active = item.key === activeKey && item.isTab;
//               return (
//                 <NavButton
//                   key={item.key}
//                   item={item}
//                   active={active}
//                   onPress={() => handlePress(item)}
//                 />
//               );
//             })}
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// const NavButton = ({ item, active, onPress }) => {
//   const scale = useRef(new Animated.Value(1)).current;

//   const onPressIn = () => {
//     Animated.timing(scale, {
//       toValue: 0.94,
//       duration: 80,
//       easing: Easing.out(Easing.quad),
//       useNativeDriver: NATIVE_DRIVER,
//     }).start();
//   };
//   const onPressOut = () => {
//     Animated.timing(scale, {
//       toValue: 1,
//       duration: 120,
//       easing: Easing.out(Easing.quad),
//       useNativeDriver: NATIVE_DRIVER,
//     }).start();
//   };

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       onPressIn={onPressIn}
//       onPressOut={onPressOut}
//       style={styles.navItem}
//       activeOpacity={0.9}
//     >
//       <Animated.View
//         style={[
//           styles.iconCircle,
//           active ? styles.iconCircleActive : styles.iconCircleInactive,
//           { transform: [{ scale }] },
//         ]}
//       >
//         <Ionicons
//           name={item.icon}
//           size={active ? 26 : 22}
//           color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
//         />
//       </Animated.View>
//       <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
//         {item.label}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   /** Positioning */
//   root: {
//     position: 'fixed', // RN-web uses this; native ignores and SafeArea handles bottom
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1000,
//   },
//   hidden: { opacity: 0, height: 0 },
//   safeArea: { backgroundColor: 'transparent' },

//   /** Frosted/Glass wrapper (web blur, native translucent white) */
//   glassWrap: {
//     ...(Platform.OS === 'web'
//       ? { backgroundColor: 'rgba(255,255,255,0.82)', backdropFilter: 'saturate(160%) blur(10px)' }
//       : { backgroundColor: 'rgba(255,255,255,0.92)' }),
//     borderTopLeftRadius: 18,
//     borderTopRightRadius: 18,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 12,
//     borderTopWidth: 0.5,
//     borderTopColor: '#E5E7EB',
//   },

//   /** Content row */
//   container: {
//     height: 76,
//     paddingBottom: Platform.OS === 'android' ? 8 : 4,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },

//   /** Item */
//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 58,
//   },

//   /** Icon capsule */
//   iconCircle: {
//     padding: 7,
//     borderRadius: 32,
//     marginBottom: 4,
//     borderWidth: 1,
//   },
//   iconCircleActive: {
//     backgroundColor: ACTIVE_BG,
//     borderColor: '#e8eff4ff',
//     shadowColor: '#003366',
//     shadowOpacity: 0.25,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   iconCircleInactive: {
//     backgroundColor: INACTIVE_BG,
//     borderColor: '#E5E7EB',
//   },

//   /** Labels */
//   label: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   labelActive: { color: ACTIVE_COLOR },
//   labelInactive: { color: INACTIVE_COLOR },
// });

// export default BottomNavBar;



import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ACTIVE_COLOR = '#003366';
const INACTIVE_COLOR = '#6B7280';
const BAR_BG = '#FFFFFF';
const BORDER = '#E5E7EB';
const NATIVE_DRIVER = Platform.OS !== 'web';

/** Web + native: single source of truth for "mobile" without unmounting */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (Platform.OS !== 'web') return true;
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(max-width: 599px)').matches;
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(max-width: 599px)');
    const handler = (e) => setIsMobile(e.matches);
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else mql.removeListener(handler);
    };
  }, []);

  return isMobile;
}

const BottomNavBar = ({ onTabChange, currentTab }) => {
  const isMobile = useIsMobile();
  const navigation = useNavigation();
  const [activeKey, setActiveKey] = useState(currentTab || 'explore');

  // Tabs rendered in-place on TravelerDashboard
  const navItems = useMemo(
    () => [
      { label: 'Explore',  icon: 'compass-outline',       key: 'explore',      isTab: true  },
      { label: 'Planner',  icon: 'calendar-outline',      key: 'tripplanner',  isTab: true  },
      { label: 'Events',   icon: 'sparkles-outline',      key: 'events',       isTab: true  },
      { label: 'Services', icon: 'briefcase-outline',     key: 'services',     isTab: true  },
      { label: 'Groups',   icon: 'chatbubbles-outline',   key: 'groups',       isTab: false },
      { label: 'Profile',  icon: 'person-circle-outline', key: 'profile',      isTab: true  },
    ],
    []
  );

  // Keep highlight in sync if parent/header changes the tab
  useEffect(() => {
    if (currentTab && currentTab !== activeKey) setActiveKey(currentTab);
  }, [currentTab]);

  // Also sync with window event (web) so header dispatches are reflected
  useEffect(() => {
    const handler = (e) => {
      const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
      if (key) setActiveKey(key);
    };
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('tabChange', handler);
      return () => window.removeEventListener('tabChange', handler);
    }
  }, []);

  const handlePress = (item) => {
    if (item.isTab) {
      setActiveKey(item.key);
      onTabChange?.(item.key); // swap content inside TravelerDashboard
      return;
    }
    // Dedicated screens (non-tabs)
    switch (item.key) {
      case 'groups':
        navigation.navigate('GroupScreen');
        break;
      default:
        break;
    }
  };

  // Always mounted; hidden on wide screens so resize never unmounts it
  return (
    <View style={[styles.root, !isMobile && styles.hidden]} pointerEvents={isMobile ? 'auto' : 'none'}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.bar}>
          <View style={styles.container}>
            {navItems.map((item) => {
              const active = item.key === activeKey && item.isTab;
              return (
                <NavButton
                  key={item.key}
                  item={item}
                  active={!!active}
                  onPress={() => handlePress(item)}
                />
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const NavButton = ({ item, active, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scale, {
      toValue: 0.96,
      duration: 80,
      easing: Easing.out(Easing.quad),
      useNativeDriver: NATIVE_DRIVER,
    }).start();
  };
  const onPressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: NATIVE_DRIVER,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.navItem}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={item.icon}
          size={22}
          color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
      </Animated.View>
      <Text style={[styles.label, { color: active ? ACTIVE_COLOR : INACTIVE_COLOR }]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  /** Positioning */
  root: {
    position: 'fixed', // RN-web uses this; native ignores and SafeArea handles bottom
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  hidden: { opacity: 0, height: 0 },
  safeArea: { backgroundColor: 'transparent' },

  /** Flat white bar (Airbnb style) */
  bar: {
    backgroundColor: BAR_BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  /** Content row */
  container: {
    height: 64,
    paddingBottom: Platform.OS === 'android' ? 6 : 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  /** Item (no capsules) */
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
    gap: 4,
  },

  /** Labels */
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default BottomNavBar;
