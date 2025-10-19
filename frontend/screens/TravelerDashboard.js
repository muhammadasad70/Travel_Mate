// // import React, { useState, useEffect } from 'react';
// // import { View, StyleSheet, ScrollView, Platform } from 'react-native';
// // import { useRoute, useNavigation } from '@react-navigation/native';

// // import Header from '../components/TravelerDashboard/TravelerHeaderScreen';
// // import BottomNavBar from '../components/TravelerDashboard/TravelerBottomScreen';

// // import TrendingItineraries from '../components/TravelerDashboard/TrendingItineraries';
// // import TopEvents from '../components/TravelerDashboard/TopEvents';
// // import TopTravelers from '../components/TravelerDashboard/TopTravelers';
// // import CulturalExchange from '../components/TravelerDashboard/CulturalExchange';
// // import TopServiceProviders from '../components/TravelerDashboard/TravelerTopServiceProviders';
// // import Footer from '../components/TravelerDashboard/Footer';
// // import TravelerNotifications from './RealTimeAlertsScreen';
// // import TravelerProfile from './TravelerProfile';
// // import OfflineScreen from './OfflineScreen';
// // import MessagesScreen from './MessagesScreen';
// // import ItinerariesHub from './ItinerariesHub';

// // import CompleteProfilePrompt from './CompleteProfilePrompt';
// // import EventsExplorerScreen from './EventsExplorerScreen'; // <— Events screen (FlatList-based)

// // const TravelerDashboard = () => {
// //   const route = useRoute();
// //   const navigation = useNavigation();

// //   const [selectedTab, setSelectedTab] = useState('explore');
// //   const [plannerView, setPlannerView] = useState('hub'); // 'hub' | 'create'

// //   useEffect(() => {
// //     if (route.params?.tabKey) {
// //       const normalizedKey = String(route.params.tabKey).split('-')[0];
// //       setSelectedTab(normalizedKey);
// //     }
// //   }, [route.params?.tabKey]);

// //   useEffect(() => {
// //     const handleTabChange = (e) => {
// //       if (e?.detail?.tabKey) {
// //         const normalizedKey = String(e.detail.tabKey).split('-')[0];
// //         setSelectedTab(normalizedKey);
// //       }
// //     };
// //     if (Platform.OS === 'web' && typeof window !== 'undefined') {
// //       window.addEventListener('tabChange', handleTabChange);
// //       return () => window.removeEventListener('tabChange', handleTabChange);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (selectedTab !== 'tripplanner' && plannerView !== 'hub') {
// //       setPlannerView('hub');
// //     }
// //   }, [selectedTab, plannerView]);

// //   useEffect(() => {
// //     if (selectedTab === 'communityHub') {
// //       navigation.navigate('SocialDashboard', {
// //         tabKey: `home-${Date.now()}`,
// //         from: 'TravelerDashboard',
// //       });
// //       setTimeout(() => setSelectedTab('explore'), 0);
// //     }
// //   }, [selectedTab, navigation]);

// //   useEffect(() => {
// //     if (selectedTab === 'groups') {
// //       navigation.navigate('GroupsHome', { from: 'TravelerDashboard' });
// //       setTimeout(() => setSelectedTab('explore'), 0);
// //     }
// //   }, [selectedTab, navigation]);

// //   const renderCurrentTab = () => {
// //     switch (selectedTab) {
// //       case 'tripplanner':
// //         return (
// //           <ItinerariesHub
// //             mode={plannerView}
// //             onOpenCreate={() => setPlannerView('create')}
// //             onBackToHub={() => setPlannerView('hub')}
// //           />
// //         );
// //       case 'events':
// //         // IMPORTANT: EventsExplorerScreen owns its SafeArea + FlatList.
// //         // We render it outside the ScrollView below.
// //         return <EventsExplorerScreen />;
// //       case 'services':
// //         return <EventsExplorerScreen />;
// //       case 'notification':
// //         return <TravelerNotifications />;
// //       case 'profile':
// //         return <TravelerProfile inPage />;
// //       case 'offline':
// //         return <OfflineScreen inPage />;
// //       case 'messages':
// //         return <MessagesScreen inPage />;
// //       default:
// //         return (
// //           <>
// //             <TrendingItineraries />
// //             <TopEvents />
// //             <TopTravelers />
// //             <CulturalExchange />
// //             <TopServiceProviders />
// //             <Footer />
// //           </>
// //         );
// //     }
// //   };

// //   const isEvents = selectedTab === 'events';

// //   return (
// //     <View style={styles.container}>
// //       <Header onTabChange={setSelectedTab} />

// //       {isEvents ? (
// //         // Do NOT wrap Events (FlatList) in ScrollView to avoid nested VirtualizedList
// //         <View style={styles.eventsHost}>
// //           {renderCurrentTab()}
// //         </View>
// //       ) : (
// //         <ScrollView
// //           contentContainerStyle={styles.contentWrapper}
// //           keyboardShouldPersistTaps="handled"
// //         >
// //           {renderCurrentTab()}
// //         </ScrollView>
// //       )}

// //       <CompleteProfilePrompt navigation={navigation} delayMs={5000} />
// //       <BottomNavBar onTabChange={setSelectedTab} currentTab={selectedTab} />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f4f9fc',
// //     paddingTop: Platform.OS === 'web' ? 100 : 0,
// //   },
// //   contentWrapper: {
// //     paddingBottom: 90,     // leaves room for bottom bar on non-Events tabs
// //     paddingHorizontal: 16,
// //     minHeight: '100%',
// //   },
// //   eventsHost: {
// //     flex: 1,               // make EventsExplorerScreen fill the remaining height
// //   },
// // });

// // export default TravelerDashboard;


// // screens/TravelerDashboard.js
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
// import TravelerNotifications from './RealTimeAlertsScreen';
// import TravelerProfile from './TravelerProfile';
// import OfflineScreen from './OfflineScreen';
// import MessagesScreen from './MessagesScreen';
// import ItinerariesHub from './ItinerariesHub';

// import CompleteProfilePrompt from './CompleteProfilePrompt';
// import EventsExplorerScreen from './EventsExplorerScreen';

// // Traveler-facing services explorer
// import CulturalServicesExplorerScreen from './CulturalExchange/CulturalServicesExplorerScreen';

// const TravelerDashboard = () => {
//   const route = useRoute();
//   const navigation = useNavigation();

//   const [selectedTab, setSelectedTab] = useState('explore');
//   const [plannerView, setPlannerView] = useState('hub'); // 'hub' | 'create'

//   useEffect(() => {
//     if (route.params?.tabKey) {
//       const normalizedKey = String(route.params.tabKey).split('-')[0];
//       setSelectedTab(normalizedKey);
//     }
//   }, [route.params?.tabKey]);

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

//   useEffect(() => {
//     if (selectedTab !== 'tripplanner' && plannerView !== 'hub') {
//       setPlannerView('hub');
//     }
//   }, [selectedTab, plannerView]);

//   useEffect(() => {
//     if (selectedTab === 'communityHub') {
//       navigation.navigate('SocialDashboard', {
//         tabKey: `home-${Date.now()}`,
//         from: 'TravelerDashboard',
//       });
//       setTimeout(() => setSelectedTab('explore'), 0);
//     }
//   }, [selectedTab, navigation]);

//   useEffect(() => {
//     if (selectedTab === 'groups') {
//       navigation.navigate('GroupsHome', { from: 'TravelerDashboard' });
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
//         return <EventsExplorerScreen />;
//       case 'services':
//         return <CulturalServicesExplorerScreen />;
//       case 'notification':
//         return <TravelerNotifications />;
//       case 'profile':
//         return <TravelerProfile inPage />;
//       case 'offline':
//         return <OfflineScreen inPage />;
//       case 'messages':
//         return <MessagesScreen inPage />;
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

//   const isFillList = selectedTab === 'events' || selectedTab === 'services';

//   return (
//     <View style={styles.container}>
//       <Header onTabChange={setSelectedTab} />

//       {isFillList ? (
//         <View style={styles.fillHost}>
//           {renderCurrentTab()}
//         </View>
//       ) : (
//         <ScrollView
//           contentContainerStyle={styles.contentWrapper}
//           keyboardShouldPersistTaps="handled"
//         >
//           {renderCurrentTab()}
//         </ScrollView>
//       )}

//       <CompleteProfilePrompt navigation={navigation} delayMs={5000} />
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
//   fillHost: {
//     flex: 1,
//   },
// });

// export default TravelerDashboard;





// screens/TravelerDashboard.js
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
import TravelerNotifications from './RealTimeAlertsScreen';
import TravelerProfile from './TravelerProfile';
import OfflineScreen from './OfflineScreen';
import MessagesScreen from './MessagesScreen';
import ItinerariesHub from './ItinerariesHub';

import CompleteProfilePrompt from './CompleteProfilePrompt';
import EventsExplorerScreen from './EventsExplorerScreen';

// Traveler-facing services explorer
import CulturalServicesExplorerScreen from './CulturalExchange/CulturalServicesExplorerScreen';
import ServicesHub from './ServicesHub';

const TravelerDashboard = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState('explore');
  const [plannerView, setPlannerView] = useState('hub'); // 'hub' | 'create'

  useEffect(() => {
    if (route.params?.tabKey) {
      const normalizedKey = String(route.params.tabKey).split('-')[0];
      setSelectedTab(normalizedKey);
    }
  }, [route.params?.tabKey]);

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

  useEffect(() => {
    if (selectedTab !== 'tripplanner' && plannerView !== 'hub') {
      setPlannerView('hub');
    }
  }, [selectedTab, plannerView]);

  useEffect(() => {
    if (selectedTab === 'communityHub') {
      navigation.navigate('SocialDashboard', {
        tabKey: `home-${Date.now()}`,
        from: 'TravelerDashboard',
      });
      setTimeout(() => setSelectedTab('explore'), 0);
    }
  }, [selectedTab, navigation]);

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
      case 'events':
        return <EventsExplorerScreen />;
      case 'services':
        // return <CulturalServicesExplorerScreen />;
        return <ServicesHub />;
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

  const isFillList = selectedTab === 'events' || selectedTab === 'services';

  return (
    <View style={styles.container}>
      <Header onTabChange={setSelectedTab} />

      {isFillList ? (
        <View style={styles.fillHost}>
          {renderCurrentTab()}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentWrapper}
          keyboardShouldPersistTaps="handled"
        >
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
  fillHost: {
    flex: 1,
  },
});

export default TravelerDashboard;
