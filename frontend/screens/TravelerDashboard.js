

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Text,
//   Platform,
// } from 'react-native';

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
// import TravelerNotifications from '../screens/RealTimeAlertsScreen';


// const TravelerDashboard = () => {
//   const [selectedTab, setSelectedTab] = useState('explore');

//   // Platform-specific listener for tab switching (web only)
//   useEffect(() => {
//     const handleTabChange = (e) => {
//       if (e?.detail?.tabKey) {
//         setSelectedTab(e.detail.tabKey);
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
//     switch (selectedTab) {
//       case 'tripplanner':
//         return <CrowdsourceItineraries />;
//       case 'events':
//         return <EventIntegration />;
//       case 'services':
//         return <TravelerServicesScreen />;
//       case 'notification':
//         return <TravelerNotifications />;
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


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Text,
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

// const TravelerDashboard = () => {
//   const route = useRoute();
//   const [selectedTab, setSelectedTab] = useState('explore');

//   // ✅ Apply tab from navigation (mobile route param)
//   useEffect(() => {
//     if (route.params?.tabKey) {
//       setSelectedTab(route.params.tabKey);
//     }
//   }, [route.params?.tabKey]);

//   // ✅ Apply tab from web CustomEvent
//   useEffect(() => {
//     const handleTabChange = (e) => {
//       if (e?.detail?.tabKey) {
//         setSelectedTab(e.detail.tabKey);
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
//     switch (selectedTab) {
//       case 'tripplanner':
//         return <CrowdsourceItineraries />;
//       case 'events':
//         return <EventIntegration />;
//       case 'services':
//         return <TravelerServicesScreen />;
//       case 'notification':
//         return <TravelerNotifications />;
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
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
} from 'react-native';

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

const TravelerDashboard = () => {
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState('explore');

  // ✅ Mobile tab switching via route.params
  useEffect(() => {
    if (route.params?.tabKey) {
      const normalizedKey = route.params.tabKey.split('-')[0];
      setSelectedTab(normalizedKey);
    }
  }, [route.params?.tabKey]);

  // ✅ Web tab switching via window event
  useEffect(() => {
    const handleTabChange = (e) => {
      if (e?.detail?.tabKey) {
        const normalizedKey = e.detail.tabKey.split('-')[0];
        setSelectedTab(normalizedKey);
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('tabChange', handleTabChange);
      return () => {
        window.removeEventListener('tabChange', handleTabChange);
      };
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



