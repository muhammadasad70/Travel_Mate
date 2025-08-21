


// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// /** >>> Same scheme as Traveler Bottom Bar <<< */
// const ACTIVE_COLOR = '#003366';      // primary (used in Traveler when active)
// const INACTIVE_COLOR = '#6B7280';    // gray (Traveler inactive)
// const INACTIVE_BG = '#F3F4F6';       // Traveler inactive circle bg
// const BORDER_COLOR = '#E5E7EB';      // Traveler circle border & bar border

// // keep mounted on resize; just hide when not mobile
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

// const BottomNavBar = () => {
//   const isMobile = useIsMobile();
//   const navigation = useNavigation();

//   const navItems = useMemo(() => ([
//     { label: 'Be a Vendor', icon: 'briefcase-outline',          key: 'vendor' },
//     { label: 'About Us',    icon: 'information-circle-outline', key: 'about'  },
//     { label: 'Sign In',     icon: 'log-in-outline',             key: 'signin' },
//   ]), []);

//   const handlePress = (key) => {
//     if (Platform.OS === 'web') {
//       const targetIdMap = { home: 'top', contact: 'footer-section', about: 'about-section' };
//       const el = document.getElementById(targetIdMap[key]);
//       if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
//     }
//     if (key === 'vendor') navigation.navigate('Login', { selectedRole: 'vendor' });
//     else if (key === 'signin') navigation.navigate('RoleSelection');
//     else if (key === 'about') navigation.navigate('AboutTravelMatePage');
//   };

//   return (
//     <View style={[styles.root, !isMobile && styles.hidden]} pointerEvents={isMobile ? 'auto' : 'none'}>
//       <SafeAreaView edges={['bottom']} style={styles.safeArea}>
//         <View style={styles.glassWrap}>
//           <View style={styles.container}>
//             {navItems.map((item) => (
//               <TouchableOpacity
//                 key={item.key}
//                 onPress={() => handlePress(item.key)}
//                 style={styles.navItem}
//                 activeOpacity={0.9}
//               >
//                 {/* EXACT same icon capsule as Traveler (inactive look) */}
//                 <View style={styles.iconCircle}>
//                   <Ionicons name={item.icon} size={22} color={INACTIVE_COLOR} />
//                 </View>
//                 <Text style={[styles.label, { color: INACTIVE_COLOR }]}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// /** Sizes & styles mirrored from Traveler bar */
// const styles = StyleSheet.create({
//   root: {
//     position: 'fixed',
//     left: 0, right: 0, bottom: 0,
//     zIndex: 1000,
//   },
//   hidden: { opacity: 0, height: 0 },
//   safeArea: { backgroundColor: 'transparent' },

//   // same frosted shell
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
//     borderTopColor: BORDER_COLOR,
//   },

//   container: {
//     height: 76,
//     paddingBottom: Platform.OS === 'android' ? 8 : 4,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },

//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 58,
//   },

//   // <<< exact same capsule as Traveler >>>
//   iconCircle: {
//     padding: 7,
//     borderRadius: 32,
//     marginBottom: 4,
//     borderWidth: 1,
//     backgroundColor: INACTIVE_BG,
//     borderColor: BORDER_COLOR,
//   },

//   label: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
// });

// export default BottomNavBar;


import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BAR_BG = '#FFFFFF';
const BORDER = '#E5E7EB';
const ACTIVE_COLOR = '#003366';
const INACTIVE_COLOR = '#6B7280';

// keep mounted on resize; just hide when not mobile
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

const BottomNavBar = () => {
  const isMobile = useIsMobile();
  const navigation = useNavigation();

  const navItems = useMemo(
    () => [
      { label: 'Be a Vendor', icon: 'briefcase-outline',          key: 'vendor' },
      { label: 'About Us',    icon: 'information-circle-outline', key: 'about'  },
      { label: 'Sign In',     icon: 'log-in-outline',             key: 'signin' },
    ],
    []
  );

  const handlePress = (key) => {
    if (Platform.OS === 'web') {
      const targetIdMap = { home: 'top', contact: 'footer-section', about: 'about-section' };
      const el = document.getElementById(targetIdMap[key]);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    if (key === 'vendor') navigation.navigate('Login', { selectedRole: 'vendor' });
    else if (key === 'signin') navigation.navigate('RoleSelection');
    else if (key === 'about') navigation.navigate('AboutTravelMatePage');
  };

  return (
    <View style={[styles.root, !isMobile && styles.hidden]} pointerEvents={isMobile ? 'auto' : 'none'}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.bar}>
          <View style={styles.container}>
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => handlePress(item.key)}
                style={styles.navItem}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name={item.icon} size={22} color={INACTIVE_COLOR} />
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  /** Positioning */
  root: {
    position: 'fixed',   // RN-web uses this; native is fine with SafeArea bottom
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  hidden: { opacity: 0, height: 0 },
  safeArea: { backgroundColor: 'transparent' },

  /** Simple white bar — no blur, no shadow, thin border top */
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

  /** Item (icon + label) */
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: INACTIVE_COLOR,
  },
});

export default BottomNavBar;
