
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
      case 'communityHub':
      case 'groups':
      case 'offline':
      case 'messages':
        dispatchTab(key);
        break;

      case 'notification':
        dispatchTab('notification'); break;

      // dedicated screens
      case 'saved': navigation.navigate('SavedScreen'); break;
      case 'history': navigation.navigate('TripsScreen'); break;

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
      useNativeDriver: true,
      easing: Easing.in(Easing.quad),
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
              { label: '👥 Community', key: 'communityHub' },   // NEW
              { label: '🧑‍🤝‍🧑 Groups', key: 'groups' },       // NEW
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

        {/* Right actions (vendor icon removed; still available in dropdown) */}
        <View style={styles.rightSection}>
          <IconWithCaption
            icon="notifications-outline"
            label="Alerts"
            onPress={() => handleItemPress('notification')}
          />

          {isMobile && (
            <IconWithCaption
              icon="chatbubble-ellipses-outline"
              label="Messages"
              onPress={() => handleItemPress('messages')}
            />
          )}

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
            {/* Quick actions */}
            <Text style={styles.sectionLabel}>Quick actions</Text>
            <View style={styles.menuGrid}>
              <MenuTile icon="people-circle-outline" label="Community" onPress={() => handleItemPress('communityHub')} />
              <MenuTile icon="chatbubbles-outline" label="Group" onPress={() => handleItemPress('communityHub')} />
              <MenuTile icon="heart-outline" label="Saved" onPress={() => handleItemPress('saved')} />
              <MenuTile icon="time-outline" label="History" onPress={() => handleItemPress('history')} />
            </View>

            {/* Your tools */}
            <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Your tools</Text>
            <RowAction icon="person-circle-outline" label="Profile" onPress={() => handleItemPress('profile')} />
            <RowAction icon="chatbubble-ellipses-outline" label="Messages" onPress={() => handleItemPress('messages')} />

            {/* CTA (vendor kept here) */}
            <TouchableOpacity style={styles.vendorCta} onPress={() => handleItemPress('vendor')} activeOpacity={0.9}>
              <Ionicons name="briefcase-outline" size={18} color="#fff" />
              <Text style={styles.vendorCtaText} numberOfLines={1}>Become a Vendor</Text>
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
    {!!label && <Text style={styles.iconCaption}>{label}</Text>}
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

  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 15 },

  iconWithLabel: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  iconCaption: { fontSize: 10, fontWeight: '500', color: '#003366', lineHeight: 12 },
  iconNoBg: { padding: 5, backgroundColor: 'transparent' },

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
