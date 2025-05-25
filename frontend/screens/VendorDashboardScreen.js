// ✅ Fully Responsive VendorDashboardScreen.js (Complete with All Original Logic)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const roleCardMap = {
  accommodation: [
    { label: 'My Services', screen: 'MyServices', icon: 'briefcase', color: '#D1FADF' },
    { label: 'Add New Services', screen: 'AddNewServices', icon: 'plus-square', color: '#DBEAFE' },
    { label: 'Create Offer', screen: 'CreateOffer', icon: 'edit-3', color: '#FEF9C3' },
    { label: 'Manage My Offers', screen: 'ManageMyOffer', icon: 'package', color: '#FEF3C7' },
    { label: 'Booking Requests', screen: 'BookingRequests', icon: 'inbox', color: '#CCFBF1' },
    { label: 'Booking Analytics', screen: 'BookingAnalytics', icon: 'bar-chart', color: '#FECACA' },
    { label: 'Chat with Guests', screen: 'ChatWithGuest', icon: 'message-circle', color: '#E5E7EB' },
    { label: 'Notifications', screen: 'Notifications', icon: 'bell', color: '#FEF3C7' },
  ],
  cultural: [
    { label: 'Offer a Cultural Skill', screen: 'OfferCulturalSkill', icon: 'book-open', color: '#FDE68A' },
    { label: 'My Cultural Listings', screen: 'MyCulturalListings', icon: 'clipboard-list', color: '#A7F3D0' },
    { label: 'Manage Requests', screen: 'ManageCulturalRequests', icon: 'inbox', color: '#BFDBFE' },
    { label: 'Chat with Interested Travelers', screen: 'CulturalChat', icon: 'message-circle', color: '#FBCFE8' },
    { label: 'Upload Cultural Moments', screen: 'UploadCulturalMedia', icon: 'camera', color: '#FECACA' },
    { label: 'Traveler Feedback', screen: 'CulturalFeedback', icon: 'star', color: '#FCD34D' },
    { label: 'Cultural Engagement Stats', screen: 'CulturalStats', icon: 'bar-chart-2', color: '#C4B5FD' }
  ],
  tour: [
    { label: 'Create Tour Package', screen: 'CreateTour', icon: 'map', color: '#A7F3D0' },
    { label: 'Manage Tours', screen: 'ManageTours', icon: 'compass', color: '#BAE6FD' },
    { label: 'Tour Bookings', screen: 'TourBookings', icon: 'clipboard', color: '#FCD34D' },
    { label: 'Chat with Travelers', screen: 'TravelerChat', icon: 'message-circle', color: '#F3F4F6' },
    { label: 'Traveler Feedback', screen: 'TourFeedback', icon: 'star', color: '#FDE68A' },
    { label: 'Tour Insights & Stats', screen: 'TourStats', icon: 'bar-chart-2', color: '#C4B5FD' }
  ],
  transport: [
    { label: 'My Transport Services', screen: 'My Transport Services', icon: 'truck', color: '#FDE68A' },
    { label: 'Add Transport Services', screen: 'AddTransport', icon: 'plus-circle', color: '#E0F2FE' },
    { label: 'Manage Bookings', screen: 'ManageTransportBookings', icon: 'list', color: '#F9A8D4' },
    { label: 'Chat with Travelers', screen: 'Chat with Travelers', icon: 'message-circle', color: '#F3F4F6' },
    { label: 'Traveler Feedback', screen: 'TourFeedback', icon: 'star', color: '#FDE68A' },
    { label: 'Transport Insights & Stats', screen: 'TransportStats', icon: 'bar-chart-2', color: '#C4B5FD' }
  ],
  product: [
    { label: 'Add New Product', screen: 'Add_New_Product', icon: 'plus-circle', color: '#D1FAE5' },
    { label: 'My Product Listings', screen: 'My_Product_Listings', icon: 'list', color: '#DBEAFE' },
    { label: 'Manage Orders', screen: 'Manage_Orders', icon: 'package', color: '#FCD34D' },
    { label: 'Chat with Customers', screen: 'Chat_With_Customers', icon: 'message-circle', color: '#F3F4F6' },
    { label: 'Customer Feedback', screen: 'Customer_Feedback', icon: 'star', color: '#FECACA' },
    { label: 'Product Sales Analytics', screen: 'Product_Sales_Analytics', icon: 'bar-chart-2', color: '#C4B5FD' },
    { label: 'Upload Product Gallery', screen: 'Upload_Product_Gallery', icon: 'image', color: '#A5F3FC' }
  ],
};

const readableRoles = {
  accommodation: '🏨 Accommodations provider',
  cultural: '🧑‍🤝‍🧑 Cultural Exchanger',
  tour: '🗺️ Tour Guider',
  transport: '🚌 Transport Provider',
  product: '🛍️ Product Seller',
};

const roleColors = {
  accommodation: '#D1FAE5',
  cultural: '#FBCFE8',
  tour: '#BAE6FD',
  transport: '#FDE68A',
  product: '#E9D5FF',
};
const VendorDashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedTypes = [], name = 'Vendor' } = route.params || {};

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);


  const displayRoleLabels = selectedTypes.map(role => {
    const actualRole = role === 'hotel' ? 'accommodation' : role;
    return {
      label: readableRoles[actualRole] || actualRole,
      color: roleColors[actualRole] || '#D1FAE5'
    };
  });

  const cardMap = new Map();
  selectedTypes.forEach(role => {
    const actualRole = role === 'hotel' ? 'accommodation' : role;
    (roleCardMap[actualRole] || []).forEach(card => {
      const existing = cardMap.get(card.label);
      if (existing) {
        existing.roles.push(role);
      } else {
        cardMap.set(card.label, { ...card, roles: [actualRole] });
      }
    });
  });
  const mergedCards = Array.from(cardMap.values());

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        {isMobile && (
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={{ marginLeft: 12 }}>
            <Feather name="menu" size={22} />
          </TouchableOpacity>
        )}
        <Text style={styles.dashboardText}>Vendor Dashboard</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.centerStatusWrapper}>
          {displayRoleLabels.map((item, index) => (
            <Text key={index} style={[styles.roleBadge, { backgroundColor: item.color }]}>{item.label}</Text>
          ))}
        </ScrollView>
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => setShowNotificationPopup(true)}>
            <Feather name="bell" size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowProfileMenu(!showProfileMenu)}>
            <Feather name="user" size={22} style={styles.iconSpacing} />
          </TouchableOpacity>
        </View>
      </View>

      {/* DROPDOWN SIDEBAR FOR MOBILE */}
      {isMobile && showDropdown && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => setShowHelp(true)}><Text style={styles.dropdownItem}>Help</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setShowContact(true)}><Text style={styles.dropdownItem}>Contact Us</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setShowLanguage(true)}><Text style={styles.dropdownItem}>Languages</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSettings(true)}><Text style={styles.dropdownItem}>Settings</Text></TouchableOpacity>
        </View>
      )}

      {/* MODALS */}
      {showNotificationPopup && (
        <Modal transparent visible={showNotificationPopup} animationType="fade">
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowNotificationPopup(false)}>
            <View style={styles.notificationsBox}>
              <Text style={styles.notificationItem}>📢 New booking request in Accommodations</Text>
              <Text style={styles.notificationItem}>📸 Someone liked your Cultural Moment</Text>
              <Text style={styles.notificationItem}>🛒 New order placed for your product</Text>
              <Text style={styles.notificationItem}>📊 Stats updated for Cultural Engagement</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showHelp && (
        <Modal transparent visible={showHelp} animationType="fade">
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowHelp(false)}>
            <View style={styles.notificationsBox}>
              <Text style={styles.notificationItem}>❓ Help Center</Text>
              <Text style={styles.notificationItem}>Visit our FAQ section or email support@travelmate.com</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showContact && (
        <Modal transparent visible={showContact} animationType="fade">
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowContact(false)}>
            <View style={styles.notificationsBox}>
              <Text style={styles.notificationItem}>📞 Contact Us</Text>
              <Text style={styles.notificationItem}>Email: support@travelmate.com</Text>
              <Text style={styles.notificationItem}>Phone: +92 000 1234567</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showLanguage && (
        <Modal transparent visible={showLanguage} animationType="fade">
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowLanguage(false)}>
            <View style={styles.notificationsBox}>
              <Text style={styles.notificationItem}>🌐 Language Settings</Text>
              <Text style={styles.notificationItem}>Current: English</Text>
              <Text style={styles.notificationItem}>Other options: Urdu, Arabic, French</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showSettings && (
        <Modal transparent visible={showSettings} animationType="fade">
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowSettings(false)}>
            <View style={styles.notificationsBox}>
              <Text style={styles.notificationItem}>⚙️ Settings</Text>
              <Text style={styles.notificationItem}>Notifications: On</Text>
              <Text style={styles.notificationItem}>Dark Mode: Off</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showProfileMenu && (
        <View style={styles.profileMenu}>
          <Pressable onPress={() =>  navigation.navigate('VendorProfile')}><Text style={styles.profileItem}>👤 Profile</Text></Pressable>
          <Pressable onPress={() =>  navigation.navigate('ManageVendorProfile')}><Text style={styles.profileItem}>🛠️ Manage Profile</Text></Pressable>
          <Pressable onPress={() => navigation.navigate('TestHeader')}><Text style={styles.profileItem}>🚪 Logout</Text></Pressable>
        </View>
      )}

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 10 }}>
          <Feather name="search" size={18} color="#666" style={{ marginRight: 6 }} />
          <TextInput placeholder="Search offers, bookings, travelers..." style={styles.searchBar} placeholderTextColor="#666" />
        </View>
      </View>

      {/* SIDEBAR + CARDS */}
      <View style={styles.body}>
        {!isMobile && (
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={() => {}}><Text style={[styles.sidebarItem, styles.activeSidebar]}>Home</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setShowHelp(true)}><Text style={styles.sidebarItem}>Help</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setShowContact(true)}><Text style={styles.sidebarItem}>Contact Us</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLanguage(true)}><Text style={styles.sidebarItem}>Languages</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettings(true)}><Text style={styles.sidebarItem}>Settings</Text></TouchableOpacity>
          </View>
        )}

        <ScrollView contentContainerStyle={[styles.cardsContainer, { justifyContent: isMobile ? 'center' : 'flex-start' }]}>
          {mergedCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: card.color, width: isMobile ? '100%' : '28%' }]}
              onPress={() => navigation.navigate(card.screen)}
            >
              <Feather name={card.icon} size={24} style={styles.cardIcon} />
              <Text style={styles.cardText}>{card.label}</Text>
              <Text style={styles.cardSubText}>{card.roles.map(r => readableRoles[r]).join(', ')}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  dashboardText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  centerStatusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    maxHeight: 40,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginRight: 8,
    color: '#047857',
  },
  icons: { flexDirection: 'row', alignItems: 'center' },
  iconSpacing: { marginLeft: 16 },
  profileMenu: {
    position: 'absolute',
    right: 20,
    top: 60,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  profileItem: {
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  notificationItem: {
    fontSize: 14,
    marginBottom: 8,
  },
  searchWrapper: {
    paddingHorizontal: 32,
    marginBottom: 12,
    alignItems: 'center',
  },
  searchBar: {
    width: '100%',
    maxWidth: 600,
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
  },
  body: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 180,
    padding: 16,
    backgroundColor: '#E5E7EB',
  },
  sidebarItem: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  activeSidebar: {
    color: '#2563EB',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 16,
    gap: 16,
  },
  card: {
    width: '28%',
    minWidth: 200,
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardIcon: {
    marginBottom: 10,
    color: '#111827',
  },
  cardText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#111827',
    textAlign: 'center',
  },
  cardSubText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 4,
  },
  profileView: {
    padding: 24,
    gap: 12,
    flex: 1,
    backgroundColor: '#fff',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backArrow: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#22C55E',
    padding: 10,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
  },
  dropdownMenu: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItem: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
    color: '#1F2937',
  },
  
});

export default VendorDashboardScreen;


