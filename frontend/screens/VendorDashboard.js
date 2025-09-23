
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native'; // ← added Text
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import VendorHeader from '../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../components/VendorDashboard/VendorBottomNavBar';
import CompleteProfilePrompt from './CompleteProfilePrompt';

// Renders inside dashboard when activeTab === 'profile'
import VendorProfile from './VendorProfile';
// Import My_Services for accommodation providers
import My_Services from './Accommodations/My_Services';
// Import Add_New_Services for accommodation providers
import Add_New_Services from './Accommodations/Add_New_Services';
// Import Booking_Requests for accommodation providers
import Booking_Requests from './Accommodations/Booking_Requests';
// Import Create_Offer for accommodation providers
import Create_Offer from './Accommodations/Create_Offer';
// Import Booking_Analytics for accommodation providers
import Booking_Analytics from './Accommodations/Booking_Analytics';
// Import My_Cultural_Listings for cultural exchangers
import My_Cultural_Listings from './Cultural_exchange/My_Cultural_Listings';
// Import Offer_Cultural_Skill for cultural exchangers
import Offer_Cultural_Skill from './Cultural_exchange/Offer_Cultural_Skill';
// Import Manage_Requests for cultural exchangers
import Manage_Requests from './Cultural_exchange/Manage_Requests';
// Import Traveler_Feedback for cultural exchangers
import Traveler_Feedback from './Cultural_exchange/Traveler_Feedback';
// Import Cultural_Engagement_Stats for cultural exchangers
import Cultural_Engagement_Stats from './Cultural_exchange/Cultural_Engagement_Stats';
// Import My_Product_Listings for product sellers
import My_Product_Listings from './Product/My_Product_Listings';
// Import Add_New_Product for product sellers
import Add_New_Product from './Product/Add_New_Product';
// Import Manage_Orders for product sellers
import Manage_Orders from './Product/Manage_Orders';
// Import Product_Sales_Analytics for product sellers
import Product_Sales_Analytics from './Product/Product_Sales_Analytics';
// Import Customer_Feedback for product sellers
import Customer_Feedback from './Product/Customer_Feedback';
// Import My_Transport_Listings for transport providers
import My_Transport_Listings from './Transport/My_Transport_Listings';
// Import Add_New_Transport for transport providers
import Add_New_Transport from './Transport/Add_New_Transport';
// Import Transport_Bookings for transport providers
import Transport_Bookings from './Transport/Transport_Bookings';
// Import Transport_Offers for transport providers
import Transport_Offers from './Transport/Transport_Offers';
// Import Transport_Analytics for transport providers
import Transport_Analytics from './Transport/Transport_Analytics';

const TAB = {
  HOME: 'home',
  SERVICES: 'services',
  ADD_SERVICES: 'add_services',
  BOOKING: 'booking',
  REQUEST: 'request',
  ANALYSIS: 'analysis',
  CHAT: 'chat',
  NOTIFICATION: 'notification',
  PROFILE: 'profile',
};

export default function VendorDashboardScreen() {
  const [activeTab, setActiveTab] = useState(TAB.HOME);
  const [role, setRole] = useState(null);
  const [vendorType, setVendorType] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingTransport, setEditingTransport] = useState(null);
  const navigation = useNavigation();

  // Get vendor type from AsyncStorage
  useEffect(() => {
    const getVendorType = async () => {
      try {
        const type = await AsyncStorage.getItem('vendor_type');
        setVendorType(type);
      } catch (error) {
        console.log('Error getting vendor type:', error);
      }
    };
    getVendorType();
  }, []);



  // Keep header/bottom bar and screen in sync via custom event on web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const handler = (e) => {
      const key = e?.detail?.tabKey && String(e.detail?.tabKey).split('-')[0];
      if (key) setActiveTab(key);
    };
    window.addEventListener('vendorTabChange', handler);
    return () => window.removeEventListener('vendorTabChange', handler);
  }, []);

  const handleTabChange = (key, data = null) => {
    setActiveTab(key);
    if (data) {
      // Determine if it's a product, service, skill, or transport based on vendor type
      if (vendorType === 'product') {
        setEditingProduct(data);
        setEditingService(null);
        setEditingSkill(null);
        setEditingTransport(null);
      } else if (vendorType === 'hotel') {
        setEditingService(data);
        setEditingProduct(null);
        setEditingSkill(null);
        setEditingTransport(null);
      } else if (vendorType === 'cultural') {
        setEditingSkill(data);
        setEditingProduct(null);
        setEditingService(null);
        setEditingTransport(null);
      } else if (vendorType === 'transport') {
        setEditingTransport(data);
        setEditingProduct(null);
        setEditingService(null);
        setEditingSkill(null);
      }
    } else if (key === 'services') {
      setEditingProduct(null); // Clear editing product when going back to services
      setEditingService(null); // Clear editing service when going back to services
      setEditingSkill(null); // Clear editing skill when going back to services
      setEditingTransport(null); // Clear editing transport when going back to services
    }
  };

  return (
    <View style={styles.root}>
      <VendorHeader onTabChange={handleTabChange} />

      <SafeAreaView edges={['left', 'right']} style={styles.safe}>
        <ScrollView
          contentContainerStyle={[
            styles.bodyContainer,
            Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
          ]}
        >
          {activeTab === TAB.HOME && <HomeTab role={role} onPreviewRole={setRole} />}
          {activeTab === TAB.SERVICES && <ServicesTab role={role} vendorType={vendorType} onTabChange={handleTabChange} />}
          {activeTab === TAB.ADD_SERVICES && <AddServicesTab vendorType={vendorType} editingProduct={editingProduct} editingService={editingService} editingSkill={editingSkill} editingTransport={editingTransport} onBackToServices={() => handleTabChange('services')} />}
          {activeTab === TAB.BOOKING && <BookingTab role={role} vendorType={vendorType} />}
          {activeTab === TAB.REQUEST && <RequestTab vendorType={vendorType} />}
          {activeTab === TAB.ANALYSIS && <AnalysisTab vendorType={vendorType} />}
          {activeTab === TAB.CHAT && <ChatTab />}
          {activeTab === TAB.NOTIFICATION && <NotificationTab />}
          {activeTab === TAB.PROFILE && <VendorProfile />}{/* ← renders inside dashboard */}
        </ScrollView>
      </SafeAreaView>

      <CompleteProfilePrompt navigation={navigation} delayMs={5000} />
      <VendorBottomNavBar onTabChange={handleTabChange} currentTab={activeTab} />
    </View>
  );
}

/* ---------- inline demo tab bodies ---------- */

const Section = ({ title, children }) => (
  <View style={{ gap: 8 }}>
    <Text style={styles.h2}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

function HomeTab({ role, onPreviewRole }) {
  return (
    <View style={styles.tabWrap}>
      {!role && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            No service selected yet. Go to Profile → Select/Change Service.
          </Text>
        </View>
      )}

      <Section title="Quick Stats">
        <Text>Pending Requests: 7 · Active Bookings: 12 · Active Offers: 3 · Rating: 4.8</Text>
      </Section>

      <Section title="My Services">
        <Text>Show grid/list of vendor services here… (role: {role ?? '—'})</Text>
      </Section>

      <Section title="Booking Requests">
        <Text>Compact cards with Approve / Decline actions…</Text>
      </Section>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Text onPress={() => onPreviewRole(null)} style={styles.link}>Preview: No Role</Text>
        <Text onPress={() => onPreviewRole('Accommodation Provider')} style={styles.link}>
          Preview: Accommodation
        </Text>
      </View>
    </View>
  );
}

function ServicesTab({ role, vendorType, onTabChange }) {
  // Check if vendor type is accommodation provider
  if (vendorType === 'hotel') {
    return <My_Services onAddService={(service) => onTabChange('add_services', service)} />;
  }
  
  // Check if vendor type is cultural exchanger
  if (vendorType === 'cultural') {
    return <My_Cultural_Listings onAddService={(skill) => onTabChange('add_services', skill)} />;
  }
  
  // Check if vendor type is product seller
  if (vendorType === 'product') {
    return <My_Product_Listings onAddService={(product) => onTabChange('add_services', product)} />;
  }
  
  // Check if vendor type is transport provider
  if (vendorType === 'transport') {
    return <My_Transport_Listings onAddService={(transport) => onTabChange('add_services', transport)} />;
  }
  
  return (
    <View style={styles.tabWrap}>
      {role ? (
        <Section title={`${role} — Listings`}>
          <Text>List + Add/Edit controls here…</Text>
        </Section>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No service selected</Text>
          <Text style={styles.emptySub}>Pick a primary service to start adding listings.</Text>
          <Text style={[styles.link, { marginTop: 6 }]}>Go to Profile → Select Service</Text>
        </View>
      )}
    </View>
  );
}

function AddServicesTab({ vendorType, editingProduct, editingService, editingSkill, editingTransport, onBackToServices }) {
  // Check if vendor type is accommodation provider
  if (vendorType === 'hotel') {
    return <Add_New_Services onBackToServices={onBackToServices} editingService={editingService} />;
  }
  
  // Check if vendor type is cultural exchanger
  if (vendorType === 'cultural') {
    return <Offer_Cultural_Skill onBackToServices={onBackToServices} route={{ params: { skill: editingSkill } }} />;
  }
  
  // Check if vendor type is product seller
  if (vendorType === 'product') {
    return <Add_New_Product onBackToServices={onBackToServices} route={{ params: { product: editingProduct } }} />;
  }
  
  // Check if vendor type is transport provider
  if (vendorType === 'transport') {
    return <Add_New_Transport onBackToServices={onBackToServices} route={{ params: { transport: editingTransport } }} />;
  }
  
  return (
    <View style={styles.tabWrap}>
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Add Services</Text>
        <Text style={styles.emptySub}>Add new services for {vendorType} vendor type.</Text>
      </View>
    </View>
  );
}

function BookingTab({ role, vendorType }) {
  // Check if vendor type is accommodation provider
  if (vendorType === 'hotel') {
    return <Booking_Requests onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is cultural exchanger
  if (vendorType === 'cultural') {
    return <Manage_Requests onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is product seller
  if (vendorType === 'product') {
    return <Manage_Orders onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is transport provider
  if (vendorType === 'transport') {
    return <Transport_Bookings onBackToServices={() => {}} />;
  }
  
  const label = role === 'Product Seller' ? 'Orders' : 'Bookings';
  return (
    <View style={styles.tabWrap}>
      <Section title={label}>
        <Text>Render {label.toLowerCase()} table/list here…</Text>
      </Section>
    </View>
  );
}

function RequestTab({ vendorType }) {
  // Check if vendor type is accommodation provider
  if (vendorType === 'hotel') {
    return <Create_Offer onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is cultural exchanger
  if (vendorType === 'cultural') {
    return <Traveler_Feedback onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is product seller
  if (vendorType === 'product') {
    return <Product_Sales_Analytics onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is transport provider
  if (vendorType === 'transport') {
    return <Transport_Offers onBackToServices={() => {}} />;
  }
  
  return (
    <View style={styles.tabWrap}>
      <Section title="Pending Requests">
        <Text>Requests needing Approve/Decline…</Text>
      </Section>
    </View>
  );
}

function AnalysisTab({ vendorType }) {
  // Check if vendor type is accommodation provider
  if (vendorType === 'hotel') {
    return <Booking_Analytics onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is cultural exchanger
  if (vendorType === 'cultural') {
    return <Cultural_Engagement_Stats onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is product seller
  if (vendorType === 'product') {
    return <Customer_Feedback onBackToServices={() => {}} />;
  }
  
  // Check if vendor type is transport provider
  if (vendorType === 'transport') {
    return <Transport_Analytics onBackToServices={() => {}} />;
  }
  
  return (
    <View style={styles.tabWrap}>
      <Section title="Analytics Overview">
        <Text>Small KPI cards + chart placeholder…</Text>
      </Section>
    </View>
  );
}

function ChatTab() {
  return (
    <View style={styles.tabWrap}>
      <Section title="Chat">
        <Text>Conversation list + thread preview…</Text>
      </Section>
    </View>
  );
}

function NotificationTab() {
  return (
    <View style={styles.tabWrap}>
      <Section title="Notifications">
        <Text>Unified alerts list…</Text>
      </Section>
    </View>
  );
}

/* ------------------------- styles ------------------------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1F5F9' },
  safe: { flex: 1 },
  bodyContainer: {
    paddingHorizontal: 12,
    paddingBottom: 84,
    gap: 12,
  },
  webPaddingForFixedHeader: { paddingTop: 120 },
  tabWrap: { gap: 12 },
  h2: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
  },
  banner: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
  },
  bannerText: { color: '#B45309' },
  empty: {
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },
  emptyTitle: { fontWeight: '800', color: '#0f172a' },
  emptySub: { color: '#475569', marginTop: 4 },
  link: { color: '#0f172a', fontWeight: '700' },
});
