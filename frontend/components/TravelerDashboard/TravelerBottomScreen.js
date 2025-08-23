
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

  const navItems = useMemo(
    () => [
      { label: 'Explore',   icon: 'compass-outline',         key: 'explore',     isTab: true  },
      { label: 'Planner',   icon: 'calendar-outline',        key: 'tripplanner', isTab: true  },
      { label: 'Events',    icon: 'sparkles-outline',        key: 'events',      isTab: true  },
      { label: 'Offline',    icon: 'download-outline',      key: 'offline',       isTab: true },
      { label: 'Services',  icon: 'briefcase-outline',       key: 'services',    isTab: true  },
      { label: 'Community',  icon: 'people-circle-outline', key: 'communityHub',  isTab: true }, 
      { label: 'Profile',   icon: 'person-circle-outline',   key: 'profile',     isTab: true  },
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
      window.addEventListener('tabChange', handler);
      return () => window.removeEventListener('tabChange', handler);
    }
  }, []);

  const handlePress = (item) => {
    if (item.isTab) {
      setActiveKey(item.key);
      onTabChange?.(item.key);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          const evt = new CustomEvent('tabChange', { detail: { tabKey: item.key } });
          window.dispatchEvent(evt);
        } catch {}
      }
      return;
    }

    // (No non-tab items now; keeping for future)
    if (item.key === 'messages') {
      navigation.navigate('MessagesScreen');
    }
  };

  return (
    <View style={[styles.root, !isMobile && styles.hidden]} pointerEvents={isMobile ? 'auto' : 'none'}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.bar}>
          <View style={styles.container}>
            {navItems.map((item) => {
              const active = item.isTab && item.key === activeKey;
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
      accessibilityRole="button"
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    gap: 4,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default BottomNavBar;
