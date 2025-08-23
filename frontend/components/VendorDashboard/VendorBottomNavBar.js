
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
// import { SafeAreaView } from 'react-native-safe-area-context';

// const ACTIVE_COLOR = '#003366';
// const INACTIVE_COLOR = '#6B7280';
// const BAR_BG = '#FFFFFF';
// const BORDER = '#E5E7EB';
// const NATIVE_DRIVER = Platform.OS !== 'web';

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

// const VendorBottomNavBar = ({ onTabChange, currentTab }) => {
//   const isMobile = useIsMobile();
//   const [activeKey, setActiveKey] = useState(currentTab || 'home');
//   const [moreOpen, setMoreOpen] = useState(false);

//   // Primary vendor tabs
//   const navItems = useMemo(
//     () => [
//       { label: 'Home',     icon: 'home-outline',                   key: 'home',     isTab: true  },
//       { label: 'Services', icon: 'briefcase-outline',              key: 'services', isTab: true  },
//       { label: 'Booking',  icon: 'calendar-outline',               key: 'booking',  isTab: true  },
//       { label: 'Chat',     icon: 'chatbubble-ellipses-outline',    key: 'chat',     isTab: true  },
//       { label: 'Profile',  icon: 'person-circle-outline',          key: 'profile',  isTab: true  },
//       { label: 'More',     icon: 'ellipsis-horizontal-circle-outline', key: 'more', isTab: false },
//     ],
//     []
//   );

//   useEffect(() => {
//     if (currentTab && currentTab !== activeKey) setActiveKey(currentTab);
//   }, [currentTab]);

//   // Listen to vendor tab changes (web)
//   useEffect(() => {
//     const handler = (e) => {
//       const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
//       if (key) setActiveKey(key);
//     };
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       window.addEventListener('vendorTabChange', handler);
//       return () => window.removeEventListener('vendorTabChange', handler);
//     }
//   }, []);

//   const dispatchVendorTab = (key) => {
//     onTabChange?.(key);
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       try {
//         const evt = new CustomEvent('vendorTabChange', { detail: { tabKey: key } });
//         window.dispatchEvent(evt);
//       } catch {}
//     }
//   };

//   const handlePress = (item) => {
//     if (item.isTab) {
//       setActiveKey(item.key);
//       dispatchVendorTab(item.key);
//       return;
//     }
//     if (item.key === 'more') setMoreOpen(true);
//   };

//   const pickExtra = (key) => {
//     setMoreOpen(false);
//     setActiveKey(key);
//     dispatchVendorTab(key);
//   };

//   return (
//     <View style={[styles.root, !isMobile && styles.hidden]} pointerEvents={isMobile ? 'auto' : 'none'}>
//       <SafeAreaView edges={['bottom']} style={styles.safeArea}>
//         <View style={styles.bar}>
//           <View style={styles.container}>
//             {navItems.map((item) => {
//               const active = item.isTab && item.key === activeKey;
//               return (
//                 <NavButton
//                   key={item.key}
//                   item={item}
//                   active={!!active}
//                   onPress={() => handlePress(item)}
//                 />
//               );
//             })}
//           </View>
//         </View>
//       </SafeAreaView>

//       {/* More sheet (Request, Analysis, Notification) */}
//       {moreOpen && (
//         <View style={styles.sheetOverlay}>
//           <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setMoreOpen(false)} />
//           <View style={styles.sheet}>
//             <View style={styles.sheetHandle} />
//             <SheetRow icon="list-outline" label="Request" onPress={() => pickExtra('request')} />
//             <SheetRow icon="stats-chart-outline" label="Analysis" onPress={() => pickExtra('analysis')} />
//             <SheetRow icon="notifications-outline" label="Notification" onPress={() => pickExtra('notification')} />
//             <View style={{ height: 6 }} />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const NavButton = ({ item, active, onPress }) => {
//   const scale = useRef(new Animated.Value(1)).current;

//   const onPressIn = () => {
//     Animated.timing(scale, {
//       toValue: 0.96,
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
//       activeOpacity={0.7}
//       accessibilityRole="tab"
//       accessibilityState={{ selected: !!active }}
//       accessibilityLabel={item.label}
//     >
//       <Animated.View style={{ transform: [{ scale }] }}>
//         <Ionicons
//           name={item.icon}
//           size={22}
//           color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
//         />
//       </Animated.View>
//       <Text style={[styles.label, { color: active ? ACTIVE_COLOR : INACTIVE_COLOR }]}>
//         {item.label}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const SheetRow = ({ icon, label, onPress }) => (
//   <TouchableOpacity style={styles.sheetRow} onPress={onPress} activeOpacity={0.9}>
//     <Ionicons name={icon} size={20} color="#0f172a" />
//     <Text style={styles.sheetRowText}>{label}</Text>
//     <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   root: {
//     position: 'fixed',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1000,
//   },
//   hidden: { opacity: 0, height: 0 },
//   safeArea: { backgroundColor: 'transparent' },

//   bar: {
//     backgroundColor: BAR_BG,
//     borderTopWidth: 1,
//     borderTopColor: BORDER,
//   },

//   container: {
//     height: 64,
//     paddingBottom: Platform.OS === 'android' ? 6 : 2,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },

//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 54,
//     gap: 4,
//     ...(Platform.OS === 'web' && { cursor: 'pointer' }),
//   },

//   label: {
//     fontSize: 11,
//     fontWeight: '600',
//   },

//   // More sheet
//   sheetOverlay: {
//     position: 'fixed',
//     left: 0, right: 0, bottom: 0, top: 0,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     justifyContent: 'flex-end',
//   },
//   sheet: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     padding: 12,
//     borderTopWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   sheetHandle: {
//     alignSelf: 'center',
//     width: 40, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginBottom: 6,
//   },
//   sheetRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 4,
//   },
//   sheetRowText: { fontSize: 16, color: '#0f172a', flex: 1 },
// });

// export default VendorBottomNavBar;



// components/VendorDashboard/VendorBottomNavBar.js
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
import { SafeAreaView } from 'react-native-safe-area-context';

const ACTIVE_COLOR = '#003366';
const INACTIVE_COLOR = '#6B7280';
const BAR_BG = '#FFFFFF';
const BORDER = '#E5E7EB';
const NATIVE_DRIVER = Platform.OS !== 'web';

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

const VendorBottomNavBar = ({ onTabChange, currentTab }) => {
  const isMobile = useIsMobile();
  const [activeKey, setActiveKey] = useState(currentTab || 'home');

  // Exact vendor tabs (all are tabs)
  const navItems = useMemo(
    () => [
      { label: 'Home',     icon: 'home-outline',                key: 'home' },
      { label: 'Services', icon: 'briefcase-outline',           key: 'services' },
      { label: 'Booking',  icon: 'calendar-outline',            key: 'booking' },
      { label: 'Requests', icon: 'list-outline',                key: 'request' },
      { label: 'Analysis', icon: 'stats-chart-outline',         key: 'analysis' },
      { label: 'Chat',     icon: 'chatbubble-ellipses-outline', key: 'chat' },
      { label: 'Profile',  icon: 'person-circle-outline',       key: 'profile' },
    ],
    []
  );

  useEffect(() => {
    if (currentTab && currentTab !== activeKey) setActiveKey(currentTab);
  }, [currentTab]);

  // Listen to vendor tab changes (web)
  useEffect(() => {
    const handler = (e) => {
      const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
      if (key) setActiveKey(key);
    };
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('vendorTabChange', handler);
      return () => window.removeEventListener('vendorTabChange', handler);
    }
  }, []);

  const dispatchVendorTab = (key) => {
    onTabChange?.(key);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const evt = new CustomEvent('vendorTabChange', { detail: { tabKey: key } });
        window.dispatchEvent(evt);
      } catch {}
    }
  };

  const handlePress = (item) => {
    setActiveKey(item.key);
    dispatchVendorTab(item.key);
  };

  return (
    <View style={[styles.root, !isMobile && styles.hidden]} pointerEvents={isMobile ? 'auto' : 'none'}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.bar}>
          <View style={styles.container}>
            {navItems.map((item) => {
              const active = item.key === activeKey;
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
      accessibilityRole="tab"
      accessibilityState={{ selected: !!active }}
      accessibilityLabel={item.label}
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
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  hidden: { opacity: 0, height: 0 },
  safeArea: { backgroundColor: 'transparent' },

  bar: {
    backgroundColor: BAR_BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  container: {
    height: 64,
    paddingBottom: Platform.OS === 'android' ? 6 : 2,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between', // 7 items need tighter spacing
    alignItems: 'center',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44, // tightened to fit 7 items
    gap: 4,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },

  label: {
    fontSize: 10, // slightly smaller to fit
    fontWeight: '600',
  },
});

export default VendorBottomNavBar;
