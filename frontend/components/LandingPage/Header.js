
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  useWindowDimensions,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();

  const underlineLeft = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;

  const positions = useRef({}); // Track layout of each menu item
  const [selectedItem, setSelectedItem] = useState('home');

  const animateUnderline = (key) => {
    const pos = positions.current[key];
    if (!pos) return;

    Animated.parallel([
      Animated.timing(underlineLeft, {
        toValue: pos.x,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(underlineWidth, {
        toValue: pos.width,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleItemPress = (key) => {
    setSelectedItem(key);
    animateUnderline(key);
    setMenuVisible(false);

    if (Platform.OS === 'web') {
      const targetIdMap = {
        home: 'top',
        itineraries: 'itineraries',
        events: 'events',
        travelers: 'travelers',
        culture: 'culture',
        contact: 'footer-section',
      };
      const targetId = targetIdMap[key];
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (key === 'signin') {
      navigation.navigate('RoleSelection');
    }

    if (key === 'vendor') {
      navigation.navigate('VendorTypeSelection');
    }
  };

  const menuItems = [
    { label: '🏠 Home', key: 'home' },
    { label: '📞 Contact', key: 'contact' },
    { label: '💼 Become a Vendor', key: 'vendor' },
    { label: '🔐 Sign In', key: 'signin' },
  ];

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerInner, { width: width < 900 ? '95%' : '85%' }]}>
        <View style={styles.brand}>
          <Text style={styles.logo}>✈️</Text>
          <View>
            <Text style={styles.appTitle}>TravelMate</Text>
            <Text style={styles.tagline}>Let the Crowd Be Your Guide</Text>
          </View>
        </View>

        {isMobile ? (
          <>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>

            <Modal
              visible={menuVisible}
              animationType="slide"
              transparent
              onRequestClose={() => setMenuVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalSheet}>
                  <TouchableOpacity onPress={() => setMenuVisible(false)}>
                    <Text style={styles.closeBtn}>✕ Close</Text>
                  </TouchableOpacity>
                  {menuItems.map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      style={styles.modalItem}
                      onPress={() => handleItemPress(item.key)}
                    >
                      <Text style={styles.modalItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <View style={styles.navRow}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => handleItemPress(item.key)}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  positions.current[item.key] = { x, width };
                  if (item.key === selectedItem) {
                    animateUnderline(item.key);
                  }
                }}
              >
                <Text
                  style={[
                    styles.navLink,
                    selectedItem === item.key && styles.activeLink,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            <Animated.View
              style={[
                styles.animatedUnderline,
                { left: underlineLeft, width: underlineWidth },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#ffffff',
    paddingTop: 28,
    paddingBottom: 6,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      width: '100%',
    }),
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 38,
    marginRight: 12,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#003366',
    lineHeight: 32,
  },
  tagline: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
    fontWeight: '500',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  navLink: {
    fontSize: 15,
    color: '#003366',
    marginHorizontal: 14,
    fontWeight: '600',
    paddingBottom: 4,
  },
  activeLink: {
    color: '#0077b6',
  },
  animatedUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: '#0077b6',
  },
  menuIcon: {
    fontSize: 30,
    color: '#003366',
    fontWeight: '700',
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  closeBtn: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0077b6',
    textAlign: 'right',
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
  },
});

export default Header;

