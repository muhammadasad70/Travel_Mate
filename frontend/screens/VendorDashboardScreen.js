// // screens/VendorDashboardScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // ⬇️ your components
// import VendorHeader from '../components/VendorDashboard/VendorHeader';
// import VendorBottomNavBar from '../components/VendorDashboard/VendorBottomNavBar';

// // Later you'll hydrate this from storage/backend
// // For now keep null or a sample like 'Accommodation Provider'
// const INITIAL_ROLE = null; // 'Accommodation Provider';

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
//   const [role, setRole] = useState(INITIAL_ROLE);

//   // Keep header/bottom bar and screen in sync via event (web)
//   useEffect(() => {
//     if (Platform.OS !== 'web' || typeof window === 'undefined') return;
//     const handler = (e) => {
//       const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
//       if (key) setActiveTab(key);
//     };
//     window.addEventListener('vendorTabChange', handler);
//     return () => window.removeEventListener('vendorTabChange', handler);
//   }, []);

//   const handleTabChange = (key) => setActiveTab(key);

//   return (
//     <View style={styles.root}>
//       {/* Fixed header on web (your component already handles this) */}
//       <VendorHeader onTabChange={handleTabChange} />

//       {/* Body */}
//       <SafeAreaView edges={['left', 'right']} style={styles.safe}>
//         <ScrollView
//           contentContainerStyle={[
//             styles.bodyContainer,
//             Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null, // avoid underlap with fixed header
//           ]}
//         >
//           {activeTab === TAB.HOME && <HomeTab role={role} onPreviewRole={setRole} />}
//           {activeTab === TAB.SERVICES && <ServicesTab role={role} />}
//           {activeTab === TAB.BOOKING && <BookingTab role={role} />}
//           {activeTab === TAB.REQUEST && <RequestTab />}
//           {activeTab === TAB.ANALYSIS && <AnalysisTab />}
//           {activeTab === TAB.CHAT && <ChatTab />}
//           {activeTab === TAB.NOTIFICATION && <NotificationTab />}
//           {activeTab === TAB.PROFILE && <ProfileTab onSelectService={() => {/* open onboarding later */}} />}
//         </ScrollView>
//       </SafeAreaView>

//       {/* Mobile bottom bar (hidden on web by your component logic) */}
//       <VendorBottomNavBar onTabChange={handleTabChange} currentTab={activeTab} />
//     </View>
//   );
// }

// /* ---------- Simple placeholder tab bodies (swap later) ---------- */

// const Section = ({ title, children }) => (
//   <View style={{ gap: 8 }}>
//     <Text style={styles.h2}>{title}</Text>
//     <View style={styles.card}>{children}</View>
//   </View>
// );

// function HomeTab({ role, onPreviewRole }) {
//   return (
//     <View style={styles.tabWrap}>
//       {!role && (
//         <View style={styles.banner}>
//           <Text style={styles.bannerText}>No service selected yet. Go to Profile → Select/Change Service.</Text>
//         </View>
//       )}

//       <Section title="Quick Stats">
//         <Text>Pending Requests: 7 · Active Bookings: 12 · Active Offers: 3 · Rating: 4.8</Text>
//       </Section>

//       <Section title="My Services">
//         <Text>Show grid/list of vendor services here… (role: {role ?? '—'})</Text>
//       </Section>

//       <Section title="Booking Requests">
//         <Text>Compact cards with Approve / Decline actions…</Text>
//       </Section>

//       {/* Preview toggles for development; remove later */}
//       <View style={{ flexDirection: 'row', gap: 8 }}>
//         <Text onPress={() => onPreviewRole(null)} style={styles.link}>Preview: No Role</Text>
//         <Text onPress={() => onPreviewRole('Accommodation Provider')} style={styles.link}>Preview: Accommodation</Text>
//       </View>
//     </View>
//   );
// }

// function ServicesTab({ role }) {
//   return (
//     <View style={styles.tabWrap}>
//       {role ? (
//         <Section title={`${role} — Listings`}>
//           <Text>List + Add/Edit controls here…</Text>
//         </Section>
//       ) : (
//         <View style={styles.empty}>
//           <Text style={styles.emptyTitle}>No service selected</Text>
//           <Text style={styles.emptySub}>Pick a primary service to start adding listings.</Text>
//           <Text style={[styles.link, { marginTop: 6 }]}>Go to Profile → Select Service</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// function BookingTab({ role }) {
//   const label = role === 'Product Seller' ? 'Orders' : 'Bookings';
//   return (
//     <View style={styles.tabWrap}>
//       <Section title={label}>
//         <Text>Render {label.toLowerCase()} table/list here…</Text>
//       </Section>
//     </View>
//   );
// }

// function RequestTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Pending Requests">
//         <Text>Requests needing Approve/Decline…</Text>
//       </Section>
//     </View>
//   );
// }

// function AnalysisTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Analytics Overview">
//         <Text>Small KPI cards + chart placeholder…</Text>
//       </Section>
//     </View>
//   );
// }

// function ChatTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Chat">
//         <Text>Conversation list + thread preview…</Text>
//       </Section>
//     </View>
//   );
// }

// function NotificationTab() {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Notifications">
//         <Text>Unified alerts list…</Text>
//       </Section>
//     </View>
//   );
// }

// function ProfileTab({ onSelectService }) {
//   return (
//     <View style={styles.tabWrap}>
//       <Section title="Profile & Verification">
//         <Text>Name / Phone / Address / Verification…</Text>
//         <Text onPress={onSelectService} style={[styles.link, { marginTop: 6 }]}>
//           Select/Change Service
//         </Text>
//       </Section>
//     </View>
//   );
// }

// /* ------------------------- styles ------------------------- */

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#F1F5F9' },
//   safe: { flex: 1 },
//   bodyContainer: {
//     paddingHorizontal: 12,
//     paddingBottom: 84, // space for mobile bottom bar
//     gap: 12,
//   },
//   webPaddingForFixedHeader: {
//     paddingTop: 120, // avoids overlap with fixed header on web
//   },
//   tabWrap: { gap: 12 },
//   h2: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
//   card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 12 },
//   banner: {
//     backgroundColor: '#FFFBEB', borderColor: '#FDE68A', borderWidth: 1,
//     padding: 10, borderRadius: 12,
//   },
//   bannerText: { color: '#B45309' },
//   empty: {
//     alignItems: 'center', padding: 18, backgroundColor: '#fff',
//     borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16,
//   },
//   emptyTitle: { fontWeight: '800', color: '#0f172a' },
//   emptySub: { color: '#475569', marginTop: 4 },
//   link: { color: '#0f172a', fontWeight: '700' },
// });



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Your components
import VendorHeader from '../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../components/VendorDashboard/VendorBottomNavBar';

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
  const [role, setRole] = useState(null); // e.g., 'Accommodation Provider' later

  // Keep header/bottom bar and screen in sync via event (web)
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
        <ScrollView
          contentContainerStyle={[
            styles.bodyContainer,
            Platform.OS === 'web' ? styles.webPaddingForFixedHeader : null,
          ]}
        >
          {activeTab === TAB.HOME && <HomeTab role={role} onPreviewRole={setRole} />}
          {activeTab === TAB.SERVICES && <ServicesTab role={role} />}
          {activeTab === TAB.BOOKING && <BookingTab role={role} />}
          {activeTab === TAB.REQUEST && <RequestTab />}
          {activeTab === TAB.ANALYSIS && <AnalysisTab />}
          {activeTab === TAB.CHAT && <ChatTab />}
          {activeTab === TAB.NOTIFICATION && <NotificationTab />}
          {activeTab === TAB.PROFILE && <ProfileTab onSelectService={() => { /* open onboarding later */ }} />}
        </ScrollView>
      </SafeAreaView>

      <VendorBottomNavBar onTabChange={handleTabChange} currentTab={activeTab} />
    </View>
  );
}

/* ---------- Simple placeholder tab bodies (swap later) ---------- */

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
          <Text style={styles.bannerText}>No service selected yet. Go to Profile → Select/Change Service.</Text>
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

      {/* Dev preview toggles; remove later */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Text onPress={() => onPreviewRole(null)} style={styles.link}>Preview: No Role</Text>
        <Text onPress={() => onPreviewRole('Accommodation Provider')} style={styles.link}>Preview: Accommodation</Text>
      </View>
    </View>
  );
}

function ServicesTab({ role }) {
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

function BookingTab({ role }) {
  const label = role === 'Product Seller' ? 'Orders' : 'Bookings';
  return (
    <View style={styles.tabWrap}>
      <Section title={label}>
        <Text>Render {label.toLowerCase()} table/list here…</Text>
      </Section>
    </View>
  );
}

function RequestTab() {
  return (
    <View style={styles.tabWrap}>
      <Section title="Pending Requests">
        <Text>Requests needing Approve/Decline…</Text>
      </Section>
    </View>
  );
}

function AnalysisTab() {
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

function ProfileTab({ onSelectService }) {
  return (
    <View style={styles.tabWrap}>
      <Section title="Profile & Verification">
        <Text>Name / Phone / Address / Verification…</Text>
        <Text onPress={onSelectService} style={[styles.link, { marginTop: 6 }]}>
          Select/Change Service
        </Text>
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
    paddingBottom: 84, // space for mobile bottom bar
    gap: 12,
  },
  webPaddingForFixedHeader: {
    paddingTop: 120, // avoids overlap with fixed header on web
  },
  tabWrap: { gap: 12 },
  h2: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 12 },
  banner: {
    backgroundColor: '#FFFBEB', borderColor: '#FDE68A', borderWidth: 1,
    padding: 10, borderRadius: 12,
  },
  bannerText: { color: '#B45309' },
  empty: {
    alignItems: 'center', padding: 18, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16,
  },
  emptyTitle: { fontWeight: '800', color: '#0f172a' },
  emptySub: { color: '#475569', marginTop: 4 },
  link: { color: '#0f172a', fontWeight: '700' },
});
