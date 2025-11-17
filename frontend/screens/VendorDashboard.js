
// // screens/VendorDashboard.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';

// import VendorHeader from '../components/VendorDashboard/VendorHeader';
// import VendorBottomNavBar from '../components/VendorDashboard/VendorBottomNavBar';
// import CompleteProfilePrompt from './CompleteProfilePrompt';
// import VendorProfile from './VendorProfile';
// import CulturalServicesHub from './CulturalExchange/ServicesHub';
// import CulturalRequests from './vendor/CulturalRequests';
// import CulturalBooked from './vendor/CulturalBooked';
// import VendorNotifications from './vendor/VendorNotifications';

// const TAB = {
//   HOME: 'home',
//   SERVICES: 'services',
//   BOOKING: 'booking',
//   REQUEST: 'request',
//   ANALYSIS: 'analysis',
//   CHAT: 'chat',
//   NOTIFICATION: 'notification',
//   PROFILE: 'profile',
// };

// export default function VendorDashboardScreen() {
//   const [activeTab, setActiveTab] = useState(TAB.HOME);
//   const navigation = useNavigation();

//   useEffect(() => {
//     if (Platform.OS !== 'web' || typeof window === 'undefined') return;
//     const handler = (e) => {
//       const key = e?.detail?.tabKey && String(e.detail?.tabKey).split('-')[0];
//       if (key) setActiveTab(key);
//     };
//     window.addEventListener('vendorTabChange', handler);
//     return () => window.removeEventListener('vendorTabChange', handler);
//   }, []);

//   const handleTabChange = (key) => setActiveTab(key);

//   const isFillTab =
//     activeTab === TAB.SERVICES ||
//     activeTab === TAB.BOOKING ||
//     activeTab === TAB.REQUEST ||
//     activeTab === TAB.NOTIFICATION;

//   return (
//     <View style={styles.root}>
//       <VendorHeader onTabChange={handleTabChange} />

//       <SafeAreaView edges={['left', 'right']} style={styles.safe}>
//         {isFillTab ? (
//           <View
//             style={[
//               styles.fillContainer,
//               Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
//             ]}
//           >
//             {activeTab === TAB.SERVICES && <ServicesTab />}
//             {activeTab === TAB.BOOKING  && <BookingTab />}
//             {activeTab === TAB.REQUEST  && <RequestTab />}
//             {activeTab === TAB.NOTIFICATION && <NotificationTab />}
//           </View>
//         ) : (
//           <ScrollView
//             contentContainerStyle={[
//               styles.bodyContainer,
//               Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
//             ]}
//           >
//             {activeTab === TAB.HOME && <HomeTab />}
//             {activeTab === TAB.ANALYSIS && <AnalysisTab />}
//             {activeTab === TAB.CHAT && <ChatTab />}
//             {activeTab === TAB.PROFILE && <VendorProfile />}
//           </ScrollView>
//         )}
//       </SafeAreaView>

//       <CompleteProfilePrompt navigation={navigation} delayMs={5000} />
//       <VendorBottomNavBar onTabChange={handleTabChange} currentTab={activeTab} />
//     </View>
//   );
// }

// const Section = ({ title, children }) => (
//   <View style={{ marginBottom: 12 }}>
//     <Text style={styles.h2}>{title}</Text>
//     <View style={styles.card}>{children}</View>
//   </View>
// );

// function HomeTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <View style={styles.banner}>
//         <Text style={styles.bannerText}>
//           Tip: Go to Services to add your first cultural experience (class, workshop, city walk).
//         </Text>
//       </View>

//       <Section title="Quick Stats">
//         <Text>Pending Requests: 0 · Confirmed Bookings: 0 · Avg. Rating: —</Text>
//       </Section>

//       <Section title="My Services">
//         <Text>Your published cultural experiences will appear here.</Text>
//       </Section>

//       <Section title="Recent Requests">
//         <Text>Approve / Decline requests from travelers once bookings are enabled.</Text>
//       </Section>
//     </View>
//   );
// }

// function ServicesTab() {
//   return (
//     <View style={styles.tabFill}>
//       <Text style={styles.h2}>Cultural Exchange — Services</Text>
//       <View style={{ flex: 1 }}>
//         <CulturalServicesHub />
//       </View>
//     </View>
//   );
// }

// function BookingTab() {
//   return (
//     <View style={styles.tabFill}>
//       <Text style={styles.h2}>Bookings</Text>
//       <View style={{ flex: 1 }}>
//         <CulturalBooked />
//       </View>
//     </View>
//   );
// }

// function RequestTab() {
//   return (
//     <View style={styles.tabFill}>
//       <Text style={styles.h2}>Requests</Text>
//       <View style={{ flex: 1 }}>
//         <CulturalRequests />
//       </View>
//     </View>
//   );
// }

// function AnalysisTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Analytics">
//         <Text>KPIs: views, requests, confirmations, revenue. Charts to be added later.</Text>
//       </Section>
//     </View>
//   );
// }

// function ChatTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Chat">
//         <Text>Conversation list + thread preview (coming soon).</Text>
//       </Section>
//     </View>
//   );
// }

// function NotificationTab() {
//   return (
//     <View style={styles.tabFill}>
//       <VendorNotifications />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#F1F5F9' },
//   safe: { flex: 1 },
//   bodyContainer: { paddingHorizontal: 12, paddingBottom: 84 },
//   fillContainer: { flex: 1, paddingHorizontal: 12 },
//   webPaddingForFixedHeader: { paddingTop: 120 },
//   tabWrap: { paddingVertical: 12 },
//   tabFill: { flex: 1, paddingVertical: 12 },
//   h2: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
//   card: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 16,
//     padding: 12,
//   },
//   banner: {
//     backgroundColor: '#EFF6FF',
//     borderColor: '#BFDBFE',
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   bannerText: { color: '#1D4ED8' },
// });
// screens/VendorDashboard.js - Updated HomeTab function

// screens/VendorDashboard.js

// screens/VendorDashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import VendorHeader from '../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../components/VendorDashboard/VendorBottomNavBar';
import CompleteProfilePrompt from './CompleteProfilePrompt';
import VendorProfile from './VendorProfile';
import CulturalServicesHub from './CulturalExchange/ServicesHub';
import CulturalRequests from './vendor/CulturalRequests';
import CulturalBooked from './vendor/CulturalBooked';
import VendorNotifications from './vendor/VendorNotifications';
import VendorHome from './vendor/VendorHome';

const TAB = {
  HOME: 'home',
  SERVICES: 'services',
  BOOKING: 'booking',
  REQUEST: 'request',
  ANALYSIS: 'analysis',
  CHAT: 'chat',
  NOTIFICATION: 'notification',
  PROFILE: 'profile',
};

export default function VendorDashboardScreen() {
  const [activeTab, setActiveTab] = useState(TAB.HOME);
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const handler = (e) => {
      const key = e?.detail?.tabKey && String(e.detail?.tabKey).split('-')[0];
      if (key) setActiveTab(key);
    };
    window.addEventListener('vendorTabChange', handler);
    return () => window.removeEventListener('vendorTabChange', handler);
  }, []);

  const handleTabChange = (key) => setActiveTab(key);

  const dispatchTab = (key) => {
    setActiveTab(key);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const event = new CustomEvent('vendorTabChange', { detail: { tabKey: key } });
        window.dispatchEvent(event);
      } catch {}
    }
  };

  const isFillTab =
    activeTab === TAB.SERVICES ||
    activeTab === TAB.BOOKING ||
    activeTab === TAB.REQUEST ||
    activeTab === TAB.NOTIFICATION;

  return (
    <View style={styles.root}>
      <VendorHeader onTabChange={handleTabChange} />

      <SafeAreaView edges={['left', 'right']} style={styles.safe}>
        {isFillTab ? (
          <View
            style={[
              styles.fillContainer,
              Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
            ]}
          >
            {activeTab === TAB.SERVICES && <ServicesTab />}
            {activeTab === TAB.BOOKING  && <BookingTab />}
            {activeTab === TAB.REQUEST  && <RequestTab />}
            {activeTab === TAB.NOTIFICATION && <NotificationTab />}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.bodyContainer,
              Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
            ]}
          >
            {activeTab === TAB.HOME && <VendorHome dispatchTab={dispatchTab} navigation={navigation} />}
            {activeTab === TAB.ANALYSIS && <AnalysisTab />}
            {activeTab === TAB.CHAT && <ChatTab />}
            {activeTab === TAB.PROFILE && <VendorProfile />}
          </ScrollView>
        )}
      </SafeAreaView>

      <CompleteProfilePrompt navigation={navigation} delayMs={5000} />
      <VendorBottomNavBar onTabChange={handleTabChange} currentTab={activeTab} />
    </View>
  );
}

/* ---------- Tab Components ---------- */

function ServicesTab() {
  return (
    <View style={styles.tabFill}>
      <Text style={styles.h2}>Cultural Exchange — Services</Text>
      <View style={{ flex: 1 }}>
        <CulturalServicesHub />
      </View>
    </View>
  );
}

function BookingTab() {
  return (
    <View style={styles.tabFill}>
      <Text style={styles.h2}>Bookings</Text>
      <View style={{ flex: 1 }}>
        <CulturalBooked />
      </View>
    </View>
  );
}

function RequestTab() {
  return (
    <View style={styles.tabFill}>
      <Text style={styles.h2}>Requests</Text>
      <View style={{ flex: 1 }}>
        <CulturalRequests />
      </View>
    </View>
  );
}

function AnalysisTab() {
  return (
    <View style={styles.tabWrap}>
      <View style={styles.card}>
        <View style={styles.comingSoonContainer}>
          <Ionicons name="stats-chart-outline" size={48} color="#9CA3AF" />
          <Text style={styles.comingSoonText}>Analytics Dashboard</Text>
          <Text style={styles.comingSoonSubtext}>
            Detailed analytics including views, bookings, revenue, and performance metrics coming soon!
          </Text>
        </View>
      </View>
    </View>
  );
}

function ChatTab() {
  return (
    <View style={styles.tabWrap}>
      <View style={styles.card}>
        <View style={styles.comingSoonContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={48} color="#9CA3AF" />
          <Text style={styles.comingSoonText}>Messaging System</Text>
          <Text style={styles.comingSoonSubtext}>
            Chat with travelers about bookings and answer questions. Coming soon!
          </Text>
        </View>
      </View>
    </View>
  );
}

function NotificationTab() {
  return (
    <View style={styles.tabFill}>
      <VendorNotifications />
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1F5F9' },
  safe: { flex: 1 },
  bodyContainer: { paddingHorizontal: 12, paddingBottom: 84 },
  fillContainer: { flex: 1, paddingHorizontal: 12 },
  webPaddingForFixedHeader: { paddingTop: 120 },
  tabWrap: { paddingVertical: 12 },
  tabFill: { flex: 1, paddingVertical: 12 },
  
  h2: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
  },

  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});