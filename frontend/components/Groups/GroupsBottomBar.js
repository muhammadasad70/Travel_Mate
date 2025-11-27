// // components/groups/GroupsBottomBar.js
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

// const ACTIVE_TXT = '#003366';
// const MUTED_TXT  = '#6B7280';
// const BAR_BG     = '#FFFFFF';
// const BORDER     = '#E5E7EB';
// const NATIVE     = Platform.OS !== 'web';

// // Accent colors per tab (for active bubble)
// const ACCENTS = {
//   overview: '#2563EB',
//   plans:    '#8B5CF6',
//   polls:    '#F59E0B',
//   members:  '#10B981',
//   settings: '#EF4444',
// };

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
//     mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
//     return () => {
//       mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
//     };
//   }, []);
//   return isMobile;
// }

// export default function GroupsBottomBar({ onTabChange, currentTab = 'overview' }) {
//   const isMobile = useIsMobile();
//   const [activeKey, setActiveKey] = useState(currentTab);

//   const items = useMemo(
//     () => [
//       { k: 'overview', label: 'Overview', icon: 'grid-outline' },
//       { k: 'plans',    label: 'Plans',    icon: 'map-outline' },
//       { k: 'polls',    label: 'Polls',    icon: 'stats-chart-outline' },
//       { k: 'members',  label: 'Members',  icon: 'people-outline' },
//       { k: 'settings', label: 'Settings', icon: 'settings-outline' },
//     ],
//     []
//   );

//   useEffect(() => { if (currentTab !== activeKey) setActiveKey(currentTab); }, [currentTab]);

//   useEffect(() => {
//     if (Platform.OS !== 'web' || typeof window === 'undefined') return;
//     const h = (e) => {
//       const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
//       if (key) setActiveKey(key);
//     };
//     window.addEventListener('tabChange', h);
//     return () => window.removeEventListener('tabChange', h);
//   }, []);

//   const go = (k) => {
//     setActiveKey(k);
//     onTabChange?.(k);
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       try { window.dispatchEvent(new CustomEvent('tabChange', { detail: { tabKey: k } })); } catch {}
//     }
//   };

//   if (!isMobile) return <View style={styles.hidden} />;

//   return (
//     <View style={styles.root}>
//       <SafeAreaView edges={['bottom']} style={styles.safeArea}>
//         <View style={styles.barShadowWrap}>
//           <View style={styles.bar}>
//             {items.map((it) => (
//               <NavItem
//                 key={it.k}
//                 k={it.k}
//                 label={it.label}
//                 icon={it.icon}
//                 active={activeKey === it.k}
//                 onPress={() => go(it.k)}
//               />
//             ))}
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// }

// function NavItem({ k, label, icon, active, onPress }) {
//   const scale = useRef(new Animated.Value(1)).current;
//   const onIn  = () => Animated.timing(scale, { toValue: 0.95, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: NATIVE }).start();
//   const onOut = () => Animated.timing(scale, { toValue: 1,    duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: NATIVE }).start();

//   const color = ACCENTS[k] || ACTIVE_TXT;

//   return (
//     <TouchableOpacity onPress={onPress} onPressIn={onIn} onPressOut={onOut} style={styles.item} activeOpacity={0.85}>
//       <Animated.View
//         style={[
//           styles.iconBubble,
//           active && { backgroundColor: hex(color, 0.12), borderColor: hex(color, 0.4) },
//           { transform: [{ scale }] },
//         ]}
//       >
//         <Ionicons name={icon} size={22} color={active ? color : MUTED_TXT} />
//       </Animated.View>
//       <Text style={[styles.label, active ? { color } : null]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* helpers */
// function hex(hexStr, alpha) {
//   const r = parseInt(hexStr.slice(1,3), 16);
//   const g = parseInt(hexStr.slice(3,5), 16);
//   const b = parseInt(hexStr.slice(5,7), 16);
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// }

// /* styles */
// const styles = StyleSheet.create({
//   hidden: { display: 'none' },

//   root: {
//     position: 'fixed',
//     left: 0, right: 0, bottom: 0,
//     zIndex: 1000,
//   },
//   safeArea: { backgroundColor: 'transparent' },

//   barShadowWrap: {
//     paddingHorizontal: 10,
//     paddingBottom: Platform.OS === 'android' ? 6 : 2,
//   },

//   bar: {
//     height: 74,
//     backgroundColor: BAR_BG,
//     borderTopWidth: 1,
//     borderTopColor: BORDER,
//     borderTopLeftRadius: 18,
//     borderTopRightRadius: 18,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     shadowColor: '#000',
//     ...Platform.select({
//       ios:     { shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -4 } },
//       android: { elevation: 10 },
//       web:     { boxShadow: '0 -8px 24px rgba(0,0,0,0.06)' },
//     }),
//   },

//   item: { alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 68 },

//   iconBubble: {
//     width: 40, height: 40, borderRadius: 20,
//     alignItems: 'center', justifyContent: 'center',
//     backgroundColor: '#F3F6FA',
//     borderWidth: 1, borderColor: BORDER,
//   },

//   label: { fontSize: 12, fontWeight: '800', color: MUTED_TXT },
// });


// components/groups/GroupsBottomBar.js
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

const ACTIVE_TXT = '#003366';
const MUTED_TXT  = '#6B7280';
const BAR_BG     = '#FFFFFF';
const BORDER     = '#E5E7EB';
const NATIVE     = Platform.OS !== 'web';

// Accent colors per tab (for active bubble)
const ACCENTS = {
  overview: '#2563EB',
  plans:    '#8B5CF6',
  polls:    '#F59E0B',
  members:  '#10B981',
  settings: '#EF4444',
};

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
    mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
    };
  }, []);
  return isMobile;
}

/**
 * Bottom bar for group tabs (mobile only).
 * Accepts groupId and forwards it via callbacks and window events.
 */
export default function GroupsBottomBar({ groupId, onTabChange, currentTab = 'overview' }) {
  const isMobile = useIsMobile();
  const [activeKey, setActiveKey] = useState(currentTab);

  const items = useMemo(
    () => [
      { k: 'overview', label: 'Overview', icon: 'grid-outline' },
      { k: 'polls',    label: 'Polls',    icon: 'stats-chart-outline' },
      { k: 'plan',     label: 'Plan',     icon: 'calendar-outline' },
      { k: 'members',  label: 'Members',  icon: 'people-outline' },
      { k: 'settings', label: 'Settings', icon: 'settings-outline' },
    ],
    []
  );

  useEffect(() => { if (currentTab !== activeKey) setActiveKey(currentTab); }, [currentTab]);

  // Listen for global tabChange events (only for the SAME groupId if provided)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const h = (e) => {
        const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
        const evGroupId = e?.detail?.groupId;
        // Only react if groupId matches (or event has no groupId for backward compatibility)
        if (key && (evGroupId == null || Number(evGroupId) === Number(groupId))) {
          setActiveKey(key);
        }
      };
      window.addEventListener('tabChange', h);
      return () => window.removeEventListener('tabChange', h);
    }
  }, [groupId]);

  const go = (k) => {
    setActiveKey(k);
    // pass groupId as second arg for convenience
    onTabChange?.(k, groupId);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('tabChange', { detail: { tabKey: k, groupId } }));
      } catch {}
    }
  };

  if (!isMobile) return <View style={styles.hidden} />;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.barShadowWrap}>
          <View style={styles.bar}>
            {items.map((it) => (
              <NavItem
                key={it.k}
                k={it.k}
                label={it.label}
                icon={it.icon}
                active={activeKey === it.k}
                onPress={() => go(it.k)}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function NavItem({ k, label, icon, active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.timing(scale, { toValue: 0.95, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: NATIVE }).start();
  const onOut = () => Animated.timing(scale, { toValue: 1,    duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: NATIVE }).start();

  const color = ACCENTS[k] || ACTIVE_TXT;

  return (
    <TouchableOpacity onPress={onPress} onPressIn={onIn} onPressOut={onOut} style={styles.item} activeOpacity={0.85}>
      <Animated.View
        style={[
          styles.iconBubble,
          active && { backgroundColor: hex(color, 0.12), borderColor: hex(color, 0.4) },
          { transform: [{ scale }] },
        ]}
      >
        <Ionicons name={icon} size={22} color={active ? color : MUTED_TXT} />
      </Animated.View>
      <Text style={[styles.label, active ? { color } : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* helpers */
function hex(hexStr, alpha) {
  const r = parseInt(hexStr.slice(1,3), 16);
  const g = parseInt(hexStr.slice(3,5), 16);
  const b = parseInt(hexStr.slice(5,7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* styles */
const styles = StyleSheet.create({
  hidden: { display: 'none' },

  root: {
    position: 'fixed',
    left: 0, right: 0, bottom: 0,
    zIndex: 1000,
  },
  safeArea: { backgroundColor: 'transparent' },

  barShadowWrap: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'android' ? 6 : 2,
  },

  bar: {
    height: 74,
    backgroundColor: BAR_BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    ...Platform.select({
      ios:     { shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -4 } },
      android: { elevation: 10 },
      web:     { boxShadow: '0 -8px 24px rgba(0,0,0,0.06)' },
    }),
  },

  item: { alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 68 },

  iconBubble: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F3F6FA',
    borderWidth: 1, borderColor: BORDER,
  },

  label: { fontSize: 12, fontWeight: '800', color: MUTED_TXT },
});
