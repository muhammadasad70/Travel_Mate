
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Platform,
// } from 'react-native';

// import { useRoute } from '@react-navigation/native';

// import Header from '../components/TravelerDashboard/TravelerHeaderScreen';
// import BottomNavBar from '../components/TravelerDashboard/TravelerBottomScreen';

// import TrendingItineraries from '../components/TravelerDashboard/TrendingItineraries';
// import TopEvents from '../components/TravelerDashboard/TopEvents';
// import TopTravelers from '../components/TravelerDashboard/TopTravelers';
// import CulturalExchange from '../components/TravelerDashboard/CulturalExchange';
// import TopServiceProviders from '../components/TravelerDashboard/TravelerTopServiceProviders';
// import Footer from '../components/TravelerDashboard/Footer';

// import CrowdsourceItineraries from './CrowdsourceItineraries/CrowdsourceItinerariesScreen';
// import EventIntegration from './EventIntegrationScreen';
// import TravelerServicesScreen from './VendorServices/TravelerServicesScreen';
// import TravelerNotifications from './RealTimeAlertsScreen';
// import TravelerProfile from './TravelerProfile'; // ✅ NEW
// import GroupScreen from './GroupScreen'; // ⬅️ import it

// const TravelerDashboard = () => {
//   const route = useRoute();
//   const [selectedTab, setSelectedTab] = useState('explore');

//   // ✅ Mobile tab switching via route.params
//   useEffect(() => {
//     if (route.params?.tabKey) {
//       const normalizedKey = String(route.params.tabKey).split('-')[0];
//       setSelectedTab(normalizedKey);
//     }
//   }, [route.params?.tabKey]);

//   // ✅ Web tab switching via window event
//   useEffect(() => {
//     const handleTabChange = (e) => {
//       if (e?.detail?.tabKey) {
//         const normalizedKey = String(e.detail.tabKey).split('-')[0];
//         setSelectedTab(normalizedKey);
//       }
//     };

//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       window.addEventListener('tabChange', handleTabChange);
//       return () => {
//         window.removeEventListener('tabChange', handleTabChange);
//       };
//     }
//   }, []);
//   const renderCurrentTab = () => {
//   switch (selectedTab) {
//     case 'tripplanner':
//       return <CrowdsourceItineraries />;
//     case 'events':
//       return <EventIntegration />;
//     case 'services':
//       return <TravelerServicesScreen />;
//     case 'notification':
//       return <TravelerNotifications />;
//     case 'profile':
//       return <TravelerProfile inPage />;
//     case 'groups':                               // ⬅️ NEW
//       return <GroupScreen inPage />;            // ⬅️ embed, no nested scroll
//     default:
//       return (
//         <>
//           <TrendingItineraries />
//           <TopEvents />
//           <TopTravelers />
//           <CulturalExchange />
//           <TopServiceProviders />
//           <Footer />
//         </>
//       );
//   }
// };



//   return (
//     <View style={styles.container}>
//       {/* Header can still call onTabChange directly if you pass it down */}
//       <Header onTabChange={setSelectedTab} />
//       <ScrollView contentContainerStyle={styles.contentWrapper}>
//         {renderCurrentTab()}
//       </ScrollView>
//       <BottomNavBar onTabChange={setSelectedTab} />
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
import { useRoute } from '@react-navigation/native';

import Header from '../components/TravelerDashboard/TravelerHeaderScreen';
import BottomNavBar from '../components/TravelerDashboard/TravelerBottomScreen';

import TrendingItineraries from '../components/TravelerDashboard/TrendingItineraries';
import TopEvents from '../components/TravelerDashboard/TopEvents';
import TopTravelers from '../components/TravelerDashboard/TopTravelers';
import CulturalExchange from '../components/TravelerDashboard/CulturalExchange';
import TopServiceProviders from '../components/TravelerDashboard/TravelerTopServiceProviders';
import Footer from '../components/TravelerDashboard/Footer';

import CrowdsourceItineraries from './CrowdsourceItineraries/CrowdsourceItinerariesScreen';
import EventIntegration from './EventIntegrationScreen';
import TravelerServicesScreen from './VendorServices/TravelerServicesScreen';
import TravelerNotifications from './RealTimeAlertsScreen';
import TravelerProfile from './TravelerProfile';
import GroupScreen from './GroupScreen';
import CommunityHubScreen from './CommunityHubScreen';
import OfflineScreen from './OfflineScreen';
// ⬇️ NEW: render these in-page too
import CommunityScreen from './CommunityScreen';
import MessagesScreen from './MessagesScreen';

const TravelerDashboard = () => {
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState('explore');

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

  const renderCurrentTab = () => {
    switch (selectedTab) {
      case 'tripplanner':
        return <CrowdsourceItineraries />;
      case 'events':
        return <EventIntegration />;
      case 'services':
        return <TravelerServicesScreen />;
      case 'notification':
        return <TravelerNotifications />;
      case 'profile':
        return <TravelerProfile inPage />;
      case 'communityHub':
        return <CommunityHubScreen inPage />;  // ✅ merged hub
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

  return (
    <View style={styles.container}>
      <Header onTabChange={setSelectedTab} />
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        {renderCurrentTab()}
      </ScrollView>
      {/* If you want the bar to highlight correctly when header changes tabs, you can pass currentTab={selectedTab} */}
      <BottomNavBar onTabChange={setSelectedTab} />
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
