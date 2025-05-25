// Updated DashboardSidebar.js for Vendor (role-aware)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const menuItems = ['Home', 'Help', 'Contact Us 📞', 'Languages 🌐', 'Settings ⚙️'];

const readableRoles = {
  accommodation: '🏨 Accommodations Provider',
  cultural: '🧑‍🤝‍🧑 Cultural Exchanger',
  tour: '🗺️ Tour Guider',
  transport: '🚌 Transport Provider',
  product: '🛍️ Product Seller',
};

const DashboardSidebar = ({ onSelect, currentScreen = 'Home' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const route = useRoute();
  const { selectedTypes = [] } = route.params || {};

  const displayRoles = selectedTypes.map((role) => readableRoles[role] || role);

  const handleItemPress = (item) => {
    setShowMenu(false);

    if (item === 'Home') {
      onSelect?.(item);
    } else {
      let content = '';
      switch (item) {
        case 'Help':
          content = `📘 Help:\n\nRole-specific Help for:\n${displayRoles.join(', ')}`;
          break;
        case 'Contact Us 📞':
          content = '📞 Contact Us:\n\nEmail: support@travelmate.com\nPhone: +92-300-1234567';
          break;
        case 'Languages 🌐':
          content = '🌐 Languages:\n\n- English\n- Urdu\n- Arabic\n- French';
          break;
        case 'Settings ⚙️':
          content = '⚙️ Settings:\n\n- Notifications\n- Privacy\n- App Version';
          break;
        default:
          content = '';
      }
      setModalContent(content);
      setShowModal(true);
    }
  };

  const renderItem = (item, index, isDropdown = false) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleItemPress(item)}
      style={[
        isDropdown ? styles.modalItem : styles.item,
        item === 'Home' ? styles.activeItem : null,
      ]}
    >
      <Text style={[styles.text, item === 'Home' ? styles.activeText : null]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {!isMobile ? (
        <View style={styles.sidebar}>
          {menuItems.map((item, index) => renderItem(item, index))}
        </View>
      ) : (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>☰ Menu</Text>
            <Feather name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>

          <Modal transparent animationType="slide" visible={showMenu}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                {menuItems.map((item, index) => renderItem(item, index, true))}
                <TouchableOpacity onPress={() => setShowMenu(false)}>
                  <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}

      {/* Modal for dummy content */}
      <Modal transparent visible={showModal} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowModal(false)}>
          <View style={styles.popup}>
            <Text style={styles.popupText}>{modalContent}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 180,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderColor: '#dee2e6',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  item: {
    paddingVertical: 10,
  },
  activeItem: {
    backgroundColor: '#e2e6ea',
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeText: {
    color: '#007bff',
  },
  dropdownContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  popupText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default DashboardSidebar;
