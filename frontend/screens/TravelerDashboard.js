
// // import React, { useRef } from 'react';
// // import {
// //   SafeAreaView,
// //   ScrollView,
// //   StyleSheet,
// //   View,
// //   Platform,
// //   findNodeHandle,
// //   UIManager,
// // } from 'react-native';

// // import Header from '../components/Dashboardoftraveler/TravelerHeader';
// // import TrendingItineraries from '../components/Dashboardoftraveler/TrendingItineraries';
// // import TopEvents from '../components/Dashboardoftraveler/TopEvents';
// // import TopTravelers from '../components/Dashboardoftraveler/TopTravelers';
// // import CulturalExchange from '../components/Dashboardoftraveler/CulturalExchange';
// // import TopServiceProviders from '../components/Dashboardoftraveler/TravelerTopServiceProviders';
// // import Footer from '../components/Dashboardoftraveler/Footer';
// // import BottomNavBar from '../components/Dashboardoftraveler/BottomNavBar';




// // const TravelerDashboard = () => {
// //   const scrollRef = useRef();

// //   const sectionRefs = {
// //     top: useRef(),
// //     about: useRef(),
// //     itineraries: useRef(),
// //     events: useRef(),
// //     travelers: useRef(),
// //     culture: useRef(),
// //     services: useRef(),        // ✅ Added ref for services section
// //     footer: useRef(),
// //   };

// //   const scrollToSection = (sectionId) => {
// //     if (Platform.OS === 'web') {
// //       const el = document.getElementById(sectionId);
// //       if (el) {
// //         el.scrollIntoView({ behavior: 'smooth' });
// //       }
// //     } else {
// //       const ref = sectionRefs[sectionId];
// //       if (ref?.current) {
// //         const nodeHandle = findNodeHandle(ref.current);
// //         if (nodeHandle) {
// //           UIManager.measure(nodeHandle, (_x, _y, _width, _height, _pageX, pageY) => {
// //             scrollRef.current?.scrollTo({ y: pageY - 100, animated: true });
// //           });
// //         }
// //       }
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Header onNavigate={scrollToSection} />

// //       <ScrollView
// //         ref={scrollRef}
// //         contentContainerStyle={styles.content}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         <View ref={sectionRefs.top} nativeID="top" />

// //         <View >
// //           <View ref={sectionRefs.itineraries} nativeID="itineraries">
// //             <TrendingItineraries />
// //           </View>

// //           <View ref={sectionRefs.events} nativeID="events">
// //             <TopEvents />
// //           </View>

// //           <View ref={sectionRefs.travelers} nativeID="travelers">
// //             <TopTravelers />
// //           </View>

// //           <View ref={sectionRefs.culture} nativeID="culture">
// //             <CulturalExchange />
// //           </View>

// //           {/* ✅ Added services section */}
// //           <View ref={sectionRefs.services} nativeID="services">
// //             <TopServiceProviders />
// //           </View>

// //           <View ref={sectionRefs.footer} nativeID="footer-section">
// //             <Footer onScrollToTop={() => scrollToSection('top')} />
// //           </View>
// //         </View>
// //       </ScrollView>

// //       <BottomNavBar />
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f2f2f2',
// //   },
// //   content: {
// //     paddingBottom: Platform.OS === 'web' ? 30 : 100,
// //   },
// // });

// // export default TravelerDashboard;



// // TravelerDashboard.js


// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   StyleSheet,
// //   ScrollView,
// //   Text,
// //   Platform,
// // } from 'react-native';

// // import Header from '../components/TravelerDashboard/TravelerHeaderScreen';
// // import BottomNavBar from '../components/TravelerDashboard/TravelerBottomScreen';

// // // Screens to render
// // import CrowdsourceItineraries from './CrowdsourceItineraries/CrowdsourceItinerariesScreen';
// // import EventIntegration from './EventIntegrationScreen';
// // import TravelerServicesScreen from './VendorServices/TravelerServicesScreen';

// // const TravelerDashboard = () => {
// //   const [selectedTab, setSelectedTab] = useState('explore');

// //   useEffect(() => {
// //     const handleTabChange = (e) => {
// //       if (e?.detail?.tabKey) {
// //         setSelectedTab(e.detail.tabKey);
// //       }
// //     };

// //     if (Platform.OS === 'web' && typeof window !== 'undefined') {
// //       window.addEventListener('tabChange', handleTabChange);
// //       return () => {
// //         window.removeEventListener('tabChange', handleTabChange);
// //       };
// //     }
// //   }, []);

// //   const renderCurrentTab = () => {
// //     switch (selectedTab) {
// //       case 'tripplanner':
// //         return <CrowdsourceItineraries />;
// //       case 'events':
// //         return <EventIntegration />;
// //       case 'services':
// //         return <TravelerServicesScreen />;
// //       default:
// //         return (
// //           <View style={styles.placeholder}>
// //             <Text style={styles.placeholderText}>Welcome to TravelMate Explore!</Text>
// //           </View>
// //         );
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Header />
// //       <ScrollView contentContainerStyle={styles.contentWrapper}>
// //         {renderCurrentTab()}
// //       </ScrollView>
// //       <BottomNavBar onTabChange={setSelectedTab} />
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
// //     paddingBottom: 90,
// //     paddingHorizontal: 16,
// //     minHeight: '100%',
// //   },
// //   placeholder: {
// //     paddingVertical: 100,
// //     alignItems: 'center',
// //   },
// //   placeholderText: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#003366',
// //   },
// // });

// // export default TravelerDashboard;




// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
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

// // Screens to render
// import CrowdsourceItineraries from './CrowdsourceItineraries/CrowdsourceItinerariesScreen';
// import EventIntegration from './EventIntegrationScreen';
// import TravelerServicesScreen from './VendorServices/TravelerServicesScreen';

// // Explore Tab Sections


// const TravelerDashboard = () => {
//   const [selectedTab, setSelectedTab] = useState('explore');

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
//   switch (selectedTab) {
//     case 'tripplanner':
//       return <CrowdsourceItineraries />;
//     case 'events':
//       return <EventIntegration />;
//     case 'services':
//       return <TravelerServicesScreen />;
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
//       <Header />
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

const TravelerDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('explore');

  // Platform-specific listener for tab switching (web only)
  useEffect(() => {
    const handleTabChange = (e) => {
      if (e?.detail?.tabKey) {
        setSelectedTab(e.detail.tabKey);
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
