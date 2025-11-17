
// // components/VendorDashboard/VendorBottomNavBar.js
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

//   const navItems = useMemo(
//     () => [
//       { label: 'Home',     icon: 'home-outline',                key: 'home' },
//       { label: 'Services', icon: 'briefcase-outline',           key: 'services' },
//       { label: 'Booking',  icon: 'calendar-outline',            key: 'booking' },
//       { label: 'Requests', icon: 'list-outline',                key: 'request' },
//       { label: 'Analysis', icon: 'stats-chart-outline',         key: 'analysis' },
//       { label: 'Chat',     icon: 'chatbubble-ellipses-outline', key: 'chat' },
//       { label: 'Profile',  icon: 'person-circle-outline',       key: 'profile' },
//     ],
//     []
//   );

//   useEffect(() => {
//     if (currentTab && currentTab !== activeKey) setActiveKey(currentTab);
//   }, [currentTab]);

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
//     setActiveKey(item.key);
//     dispatchVendorTab(item.key);
//   };

//   return (
//     <View style={[styles.root, !isMobile && styles.hidden]} pointerEvents={isMobile ? 'auto' : 'none'}>
//       <SafeAreaView edges={['bottom']} style={styles.safeArea}>
//         <View style={styles.bar}>
//           <View style={styles.container}>
//             {navItems.map((item) => {
//               const active = item.key === activeKey;
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
//     paddingHorizontal: 6,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 50,
//     ...(Platform.OS === 'web' && { cursor: 'pointer' }),
//   },

//   label: {
//     fontSize: 10,
//     fontWeight: '600',
//     marginTop: 4,
//   },
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

  // 🔹 Removed "Analysis" option
  const navItems = useMemo(
    () => [
      { label: 'Home',     icon: 'home-outline',                key: 'home' },
      { label: 'Services', icon: 'briefcase-outline',           key: 'services' },
      { label: 'Booking',  icon: 'calendar-outline',            key: 'booking' },
      { label: 'Requests', icon: 'list-outline',                key: 'request' },
      { label: 'Chat',     icon: 'chatbubble-ellipses-outline', key: 'chat' },
      { label: 'Profile',  icon: 'person-circle-outline',       key: 'profile' },
    ],
    []
  );

  useEffect(() => {
    if (currentTab && currentTab !== activeKey) setActiveKey(currentTab);
  }, [currentTab]);

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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default VendorBottomNavBar;
