
// // screens/VendorDashboard.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';

// import VendorHeader from '../components/VendorDashboard/VendorHeader';
// import VendorBottomNavBar from '../components/VendorDashboard/VendorBottomNavBar';
// import CompleteProfilePrompt from './CompleteProfilePrompt';
// import VendorProfile from './VendorProfile';

// // Cultural Exchange Services Hub
// import CulturalServicesHub from './CulturalExchange/ServicesHub';

// // ✅ Vendor request & booking screens
// import CulturalRequests from './vendor/CulturalRequests';
// import CulturalBooked from './vendor/CulturalBooked';

// // ✅ NEW: Vendor Notifications
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

//   // Tabs that should occupy the full viewport (these screens render their own FlatLists/scroll)
//   const isFillTab =
//     activeTab === TAB.SERVICES ||
//     activeTab === TAB.BOOKING ||
//     activeTab === TAB.REQUEST ||
//     activeTab === TAB.NOTIFICATION; // ✅ Added NOTIFICATION

//   return (
//     <View style={styles.root}>
//       <VendorHeader onTabChange={handleTabChange} />

//       <SafeAreaView edges={['left', 'right']} style={styles.safe}>
//         {isFillTab ? (
//           // ✅ Fill-height container for Services, Bookings, Requests, Notifications
//           <View
//             style={[
//               styles.fillContainer,
//               Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
//             ]}
//           >
//             {activeTab === TAB.SERVICES && <ServicesTab />}
//             {activeTab === TAB.BOOKING  && <BookingTab />}
//             {activeTab === TAB.REQUEST  && <RequestTab />}
//             {activeTab === TAB.NOTIFICATION && <NotificationTab />} {/* ✅ Updated */}
//           </View>
//         ) : (
//           // Scroll container for the rest
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

// /* ---------- tabs ---------- */

// const Section = ({ title, children }) => (
//   <View style={{ gap: 8 }}>
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

// // ✅ BookingTab now renders the real Booked view (fills height)
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

// // ✅ RequestTab now renders the real Requests view (fills height)
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

// // ✅ Updated NotificationTab to render the full screen
// function NotificationTab() {
//   return (
//     <View style={styles.tabFill}>
//       <VendorNotifications />
//     </View>
//   );
// }

// /* ---------- styles ---------- */

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#F1F5F9' },
//   safe: { flex: 1 },

//   // Scrollable tabs (Home/Analysis/Chat/Profile)
//   bodyContainer: { paddingHorizontal: 12, paddingBottom: 84, gap: 12 },

//   // Fill-height container for Services/Bookings/Requests/Notifications
//   fillContainer: { flex: 1, paddingHorizontal: 12, gap: 12 },

//   webPaddingForFixedHeader: { paddingTop: 120 },

//   tabWrap: { gap: 12 },
//   tabFill: { gap: 12, flex: 1 },

//   h2: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
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
//   },
//   bannerText: { color: '#1D4ED8' },
// });
// screens/VendorDashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import VendorHeader from '../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../components/VendorDashboard/VendorBottomNavBar';
import CompleteProfilePrompt from './CompleteProfilePrompt';
import VendorProfile from './VendorProfile';
import CulturalServicesHub from './CulturalExchange/ServicesHub';
import CulturalRequests from './vendor/CulturalRequests';
import CulturalBooked from './vendor/CulturalBooked';
import VendorNotifications from './vendor/VendorNotifications';

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
            {activeTab === TAB.HOME && <HomeTab />}
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

const Section = ({ title, children }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.h2}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

function HomeTab() {
  return (
    <View style={styles.tabWrap}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Tip: Go to Services to add your first cultural experience (class, workshop, city walk).
        </Text>
      </View>

      <Section title="Quick Stats">
        <Text>Pending Requests: 0 · Confirmed Bookings: 0 · Avg. Rating: —</Text>
      </Section>

      <Section title="My Services">
        <Text>Your published cultural experiences will appear here.</Text>
      </Section>

      <Section title="Recent Requests">
        <Text>Approve / Decline requests from travelers once bookings are enabled.</Text>
      </Section>
    </View>
  );
}

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
      <Section title="Analytics">
        <Text>KPIs: views, requests, confirmations, revenue. Charts to be added later.</Text>
      </Section>
    </View>
  );
}

function ChatTab() {
  return (
    <View style={styles.tabWrap}>
      <Section title="Chat">
        <Text>Conversation list + thread preview (coming soon).</Text>
      </Section>
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
  banner: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  bannerText: { color: '#1D4ED8' },
});