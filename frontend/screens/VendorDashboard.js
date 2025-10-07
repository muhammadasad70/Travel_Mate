
// // screens/VendorDashboard.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';

// import VendorHeader from '../components/VendorDashboard/VendorHeader';
// import VendorBottomNavBar from '../components/VendorDashboard/VendorBottomNavBar';
// import CompleteProfilePrompt from './CompleteProfilePrompt';
// import VendorProfile from './VendorProfile';

// // ⬇️ Cultural Exchange Services Hub (the UI you just added)
// import CulturalServicesHub from './CulturalExchange/ServicesHub';

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

//   // Keep header/bottom bar and screen in sync via custom event on web
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

//   return (
//     <View style={styles.root}>
//       <VendorHeader onTabChange={handleTabChange} />

//       <SafeAreaView edges={['left', 'right']} style={styles.safe}>
//         <ScrollView
//           contentContainerStyle={[
//             styles.bodyContainer,
//             Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
//           ]}
//         >
//           {activeTab === TAB.HOME && <HomeTab />}
//           {activeTab === TAB.SERVICES && <ServicesTab />}
//           {activeTab === TAB.BOOKING && <BookingTab />}
//           {activeTab === TAB.REQUEST && <RequestTab />}
//           {activeTab === TAB.ANALYSIS && <AnalysisTab />}
//           {activeTab === TAB.CHAT && <ChatTab />}
//           {activeTab === TAB.NOTIFICATION && <NotificationTab />}
//           {activeTab === TAB.PROFILE && <VendorProfile />}
//         </ScrollView>
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
//   // Always Cultural Exchange in this scope
//   return (
//     <View style={styles.tabWrap}>
//       <Text style={styles.h2}>Cultural Exchange — Services</Text>
//       <View style={styles.card}>
//         <CulturalServicesHub />
//       </View>
//     </View>
//   );
// }

// function BookingTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Bookings (Cultural Exchange)">
//         <Text>List of bookings will appear here (pending/confirmed/cancelled).</Text>
//       </Section>
//     </View>
//   );
// }

// function RequestTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Requests">
//         <Text>Incoming requests from travelers (approve/decline, message traveler).</Text>
//       </Section>
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
//     <View style={styles.tabWrap}>
//       <Section title="Notifications">
//         <Text>Unified alerts for requests, bookings, and reviews.</Text>
//       </Section>
//     </View>
//   );
// }

// /* ---------- styles ---------- */

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#F1F5F9' },
//   safe: { flex: 1 },
//   bodyContainer: { paddingHorizontal: 12, paddingBottom: 84, gap: 12 },
//   webPaddingForFixedHeader: { paddingTop: 120 },
//   tabWrap: { gap: 12 },
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

//   return (
//     <View style={styles.root}>
//       <VendorHeader onTabChange={handleTabChange} />

//       <SafeAreaView edges={['left', 'right']} style={styles.safe}>
//         {/* Services tab fills the viewport (no ScrollView wrapper) */}
//         {activeTab === TAB.SERVICES ? (
//           <View
//             style={[
//               styles.bodyContainer,
//               styles.bodyFill,
//               Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
//             ]}
//           >
//             <ServicesTab />
//           </View>
//         ) : (
//           // Other tabs keep ScrollView
//           <ScrollView
//             contentContainerStyle={[
//               styles.bodyContainer,
//               Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
//             ]}
//           >
//             {activeTab === TAB.HOME && <HomeTab />}
//             {activeTab === TAB.BOOKING && <BookingTab />}
//             {activeTab === TAB.REQUEST && <RequestTab />}
//             {activeTab === TAB.ANALYSIS && <AnalysisTab />}
//             {activeTab === TAB.CHAT && <ChatTab />}
//             {activeTab === TAB.NOTIFICATION && <NotificationTab />}
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
//   // Cultural Exchange scope
//   return (
//     <View style={styles.tabWrap}>
//       <Text style={styles.h2}>Cultural Exchange — Services</Text>
//       {/* Give the hub the whole remaining height (so FlatList can render) */}
//       <View style={{ flex: 1 }}>
//         <CulturalServicesHub />
//       </View>
//     </View>
//   );
// }

// function BookingTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Bookings (Cultural Exchange)">
//         <Text>List of bookings will appear here (pending/confirmed/cancelled).</Text>
//       </Section>
//     </View>
//   );
// }

// function RequestTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Requests">
//         <Text>Incoming requests from travelers (approve/decline, message traveler).</Text>
//       </Section>
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
//     <View style={styles.tabWrap}>
//       <Section title="Notifications">
//         <Text>Unified alerts for requests, bookings, and reviews.</Text>
//       </Section>
//     </View>
//   );
// }

// /* ---------- styles ---------- */

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#F1F5F9' },
//   safe: { flex: 1 },
//   bodyContainer: { paddingHorizontal: 12, paddingBottom: 84, gap: 12 },
//   bodyFill: { flex: 1 }, // important for Services tab
//   webPaddingForFixedHeader: { paddingTop: 120 },
//   tabWrap: { gap: 12, flex: 1 }, // fill height
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

// Cultural Exchange Services Hub
import CulturalServicesHub from './CulturalExchange/ServicesHub';

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

  return (
    <View style={styles.root}>
      <VendorHeader onTabChange={handleTabChange} />

      <SafeAreaView edges={['left', 'right']} style={styles.safe}>
        {/* Services tab fills the viewport and uses its own spacing (NO bottom padding). */}
        {activeTab === TAB.SERVICES ? (
          <View
            style={[
              styles.servicesContainer,                    // ← no paddingBottom here
              Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
            ]}
          >
            <ServicesTab />
          </View>
        ) : (
          // Other tabs stay scrollable and use the general container (with bottom padding).
          <ScrollView
            contentContainerStyle={[
              styles.bodyContainer,                       // ← has paddingBottom for scroll tabs
              Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
            ]}
          >
            {activeTab === TAB.HOME && <HomeTab />}
            {activeTab === TAB.BOOKING && <BookingTab />}
            {activeTab === TAB.REQUEST && <RequestTab />}
            {activeTab === TAB.ANALYSIS && <AnalysisTab />}
            {activeTab === TAB.CHAT && <ChatTab />}
            {activeTab === TAB.NOTIFICATION && <NotificationTab />}
            {activeTab === TAB.PROFILE && <VendorProfile />}
          </ScrollView>
        )}
      </SafeAreaView>

      <CompleteProfilePrompt navigation={navigation} delayMs={5000} />
      <VendorBottomNavBar onTabChange={handleTabChange} currentTab={activeTab} />
    </View>
  );
}

/* ---------- tabs ---------- */

const Section = ({ title, children }) => (
  <View style={{ gap: 8 }}>
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
      {/* Give the hub all remaining height so its FlatList can scroll */}
      <View style={{ flex: 1 }}>
        <CulturalServicesHub />
      </View>
    </View>
  );
}

function BookingTab() {
  return (
    <View style={styles.tabWrap}>
      <Section title="Bookings (Cultural Exchange)">
        <Text>List of bookings will appear here (pending/confirmed/cancelled).</Text>
      </Section>
    </View>
  );
}

function RequestTab() {
  return (
    <View style={styles.tabWrap}>
      <Section title="Requests">
        <Text>Incoming requests from travelers (approve/decline, message traveler).</Text>
      </Section>
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
    <View style={styles.tabWrap}>
      <Section title="Notifications">
        <Text>Unified alerts for requests, bookings, and reviews.</Text>
      </Section>
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1F5F9' },
  safe: { flex: 1 },

  // Used by scrollable tabs (Home/Booking/Request/Analysis/Chat/Notification/Profile)
  bodyContainer: { paddingHorizontal: 12, paddingBottom: 84, gap: 12 },

  // Used ONLY by Services tab (no bottom padding so there's no giant gap)
  servicesContainer: { flex: 1, paddingHorizontal: 12, gap: 12 },

  webPaddingForFixedHeader: { paddingTop: 120 },

  tabWrap: { gap: 12 },
  tabFill: { gap: 12, flex: 1 }, // ServicesTab needs to fill height

  h2: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
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
  },
  bannerText: { color: '#1D4ED8' },
});
