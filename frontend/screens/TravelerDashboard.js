


// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ScrollView, Platform } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';

// import Header from '../components/TravelerDashboard/TravelerHeaderScreen';
// import BottomNavBar from '../components/TravelerDashboard/TravelerBottomScreen';

// import TrendingItineraries from '../components/TravelerDashboard/TrendingItineraries';
// import TopEvents from '../components/TravelerDashboard/TopEvents';
// import TopTravelers from '../components/TravelerDashboard/TopTravelers';
// import CulturalExchange from '../components/TravelerDashboard/CulturalExchange';
// import TopServiceProviders from '../components/TravelerDashboard/TravelerTopServiceProviders';
// import Footer from '../components/TravelerDashboard/Footer';
// import EventIntegration from './EventIntegrationScreen';
// import TravelerServicesScreen from './VendorServices/TravelerServicesScreen';
// import TravelerNotifications from './RealTimeAlertsScreen';
// import TravelerProfile from './TravelerProfile';
// import OfflineScreen from './OfflineScreen';
// import MessagesScreen from './MessagesScreen';
// import ItinerariesHub from './ItinerariesHub';

// // 🔔 Popup that checks /user/profile-status after 5s
// import CompleteProfilePrompt from './CompleteProfilePrompt';

// const TravelerDashboard = () => {
//   const route = useRoute();
//   const navigation = useNavigation();

//   const [selectedTab, setSelectedTab] = useState('explore');
//   const [plannerView, setPlannerView] = useState('hub'); // 'hub' | 'create'

//   // Mobile: tab switching via route.params
//   useEffect(() => {
//     if (route.params?.tabKey) {
//       const normalizedKey = String(route.params.tabKey).split('-')[0];
//       setSelectedTab(normalizedKey);
//     }
//   }, [route.params?.tabKey]);

//   // Web: tab switching via window event
//   useEffect(() => {
//     const handleTabChange = (e) => {
//       if (e?.detail?.tabKey) {
//         const normalizedKey = String(e.detail.tabKey).split('-')[0];
//         setSelectedTab(normalizedKey);
//       }
//     };

//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       window.addEventListener('tabChange', handleTabChange);
//       return () => window.removeEventListener('tabChange', handleTabChange);
//     }
//   }, []);

//   // If user leaves the tripplanner tab, reset sub-view to hub
//   useEffect(() => {
//     if (selectedTab !== 'tripplanner' && plannerView !== 'hub') {
//       setPlannerView('hub');
//     }
//   }, [selectedTab, plannerView]);

//   // 👉 Community Hub redirect (existing)
//   useEffect(() => {
//     if (selectedTab === 'communityHub') {
//       navigation.navigate('SocialDashboard', {
//         tabKey: `home-${Date.now()}`,
//         from: 'TravelerDashboard',
//       });
//       // Prevent redirect loop when user returns
//       setTimeout(() => setSelectedTab('explore'), 0);
//     }
//   }, [selectedTab, navigation]);

//   // ✅ NEW: Groups redirect — when Header/BottomBar sets selectedTab === 'groups'
//   useEffect(() => {
//     if (selectedTab === 'groups') {
//       navigation.navigate('GroupsHome', { from: 'TravelerDashboard' });
//       // Reset tab so coming back lands on Explore and avoids re-trigger
//       setTimeout(() => setSelectedTab('explore'), 0);
//     }
//   }, [selectedTab, navigation]);

//   const renderCurrentTab = () => {
//     switch (selectedTab) {
//       case 'tripplanner':
//         return (
//           <ItinerariesHub
//             mode={plannerView}
//             onOpenCreate={() => setPlannerView('create')}
//             onBackToHub={() => setPlannerView('hub')}
//           />
//         );
//       case 'events':
//         return <EventIntegration />;
//       case 'services':
//         return <TravelerServicesScreen />;
//       case 'notification':
//         return <TravelerNotifications />;
//       case 'profile':
//         return <TravelerProfile inPage />;
//       case 'offline':
//         return <OfflineScreen inPage />;
//       case 'messages':
//         return <MessagesScreen inPage />;
//       // 'communityHub' and 'groups' are handled by effects above
//       default:
//         return (
//           <>
//             <TrendingItineraries />
//             <TopEvents />
//             <TopTravelers />
//             <CulturalExchange />
//             <TopServiceProviders />
//             <Footer />
//           </>
//         );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header should have a "Groups" control that calls onTabChange('groups') */}
//       <Header onTabChange={setSelectedTab} />

//       <ScrollView contentContainerStyle={styles.contentWrapper}>
//         {renderCurrentTab()}
//       </ScrollView>

//       {/* 🔔 Show “Complete Profile” popup 5s after landing (only if incomplete) */}
//       <CompleteProfilePrompt navigation={navigation} delayMs={5000} />

//       {/* Bottom navigation bar (highlights based on current tab) */}
//       <BottomNavBar onTabChange={setSelectedTab} currentTab={selectedTab} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f9fc',
//     paddingTop: Platform.OS === 'web' ? 100 : 0,
//   },
//   contentWrapper: {
//     paddingBottom: 90,
//     paddingHorizontal: 16,
//     minHeight: '100%',
//   },
// });

// export default TravelerDashboard;



import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import Header from '../components/TravelerDashboard/TravelerHeaderScreen';
import BottomNavBar from '../components/TravelerDashboard/TravelerBottomScreen';

import TrendingItineraries from '../components/TravelerDashboard/TrendingItineraries';
import TopEvents from '../components/TravelerDashboard/TopEvents';
import TopTravelers from '../components/TravelerDashboard/TopTravelers';
import CulturalExchange from '../components/TravelerDashboard/CulturalExchange';
import TopServiceProviders from '../components/TravelerDashboard/TravelerTopServiceProviders';
import Footer from '../components/TravelerDashboard/Footer';
import TravelerServicesScreen from './VendorServices/TravelerServicesScreen';
import TravelerNotifications from './RealTimeAlertsScreen';
import TravelerProfile from './TravelerProfile';
import OfflineScreen from './OfflineScreen';
import MessagesScreen from './MessagesScreen';
import ItinerariesHub from './ItinerariesHub';

// 🔔 Popup that checks /user/profile-status after 5s
import CompleteProfilePrompt from './CompleteProfilePrompt';

// ✅ NEW: Events explorer (flatlist-based; do NOT wrap in ScrollView)
import EventsExplorerScreen from './EventsExplorerScreen'; // <-- add this import

const TravelerDashboard = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState('explore');
  const [plannerView, setPlannerView] = useState('hub'); // 'hub' | 'create'

  // Mobile: tab switching via route.params
  useEffect(() => {
    if (route.params?.tabKey) {
      const normalizedKey = String(route.params.tabKey).split('-')[0];
      setSelectedTab(normalizedKey);
    }
  }, [route.params?.tabKey]);

  // Web: tab switching via window event
  useEffect(() => {
    const handleTabChange = (e) => {
      if (e?.detail?.tabKey) {
        const normalizedKey = String(e.detail.tabKey).split('-')[0];
        setSelectedTab(normalizedKey);
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('tabChange', handleTabChange);
      return () => window.removeEventListener('tabChange', handleTabChange);
    }
  }, []);

  // If user leaves the tripplanner tab, reset sub-view to hub
  useEffect(() => {
    if (selectedTab !== 'tripplanner' && plannerView !== 'hub') {
      setPlannerView('hub');
    }
  }, [selectedTab, plannerView]);

  // 👉 Community Hub redirect (existing)
  useEffect(() => {
    if (selectedTab === 'communityHub') {
      navigation.navigate('SocialDashboard', {
        tabKey: `home-${Date.now()}`,
        from: 'TravelerDashboard',
      });
      // Prevent redirect loop when user returns
      setTimeout(() => setSelectedTab('explore'), 0);
    }
  }, [selectedTab, navigation]);

  // ✅ Groups redirect (existing behavior)
  useEffect(() => {
    if (selectedTab === 'groups') {
      navigation.navigate('GroupsHome', { from: 'TravelerDashboard' });
      setTimeout(() => setSelectedTab('explore'), 0);
    }
  }, [selectedTab, navigation]);

  const renderCurrentTab = () => {
    switch (selectedTab) {
      case 'tripplanner':
        return (
          <ItinerariesHub
            mode={plannerView}
            onOpenCreate={() => setPlannerView('create')}
            onBackToHub={() => setPlannerView('hub')}
          />
        );

      // ✅ REPLACED: use the real Events explorer screen here
      case 'events':
        return <EventsExplorerScreen />;

      case 'services':
        return <TravelerServicesScreen />;
      case 'notification':
        return <TravelerNotifications />;
      case 'profile':
        return <TravelerProfile inPage />;
      case 'offline':
        return <OfflineScreen inPage />;
      case 'messages':
        return <MessagesScreen inPage />;
      default:
        return (
          <>
            <TrendingItineraries />
            <TopEvents />
            <TopTravelers />
            <CulturalExchange />
            <TopServiceProviders />
            <Footer />
          </>
        );
    }
  };

  // ⚠️ IMPORTANT: avoid wrapping Events (FlatList) inside ScrollView
  const isFlatListTab = selectedTab === 'events';

  return (
    <View style={styles.container}>
      <Header onTabChange={setSelectedTab} />

      {isFlatListTab ? (
        // Full-height container for EventsExplorerScreen (it manages its own SafeArea + FlatList)
        <View style={[styles.contentWrapper, { flex: 1, paddingHorizontal: 0, paddingBottom: 0 }]}>
          {renderCurrentTab()}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentWrapper} keyboardShouldPersistTaps="handled">
          {renderCurrentTab()}
        </ScrollView>
      )}

      <CompleteProfilePrompt navigation={navigation} delayMs={5000} />
      <BottomNavBar onTabChange={setSelectedTab} currentTab={selectedTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9fc',
    paddingTop: Platform.OS === 'web' ? 100 : 0,
  },
  contentWrapper: {
    paddingBottom: 90,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
});

export default TravelerDashboard;
