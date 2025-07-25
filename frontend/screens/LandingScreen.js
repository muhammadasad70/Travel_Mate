
// import React, { useRef } from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   View,
//   Platform,
// } from 'react-native';

// import Header from '../components/LandingPage/Header';
// import SearchBar from '../components/LandingPage/SearchBar';
// import AboutTravelMate from '../components/LandingPage/AboutTravelMate';
// import TrendingItineraries from '../components/LandingPage/TrendingItineraries';
// import TopEvents from '../components/LandingPage/TopEvents';
// import TopTravelers from '../components/LandingPage/TopTravelers';
// import CulturalExchange from '../components/LandingPage/CulturalExchange';
// import TopServiceProviders from '../components/LandingPage/TopServiceProviders';
// import Footer from '../components/LandingPage/Footer';

// // ✅ ✅ ✅ NEW IMPORT
// import BottomNavBar from '../components/LandingPage/BottomNavBar';

// const LandingScreen = () => {
//   const scrollRef = useRef();

//   const scrollToSection = (sectionId) => {
//     if (Platform.OS === 'web') {
//       const el = document.getElementById(sectionId);
//       if (el) {
//         el.scrollIntoView({ behavior: 'smooth' });
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header onNavigate={scrollToSection} />

//       <ScrollView
//         ref={scrollRef}
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         {Platform.OS === 'web' && <View nativeID="top" />}

//         <View style={{ paddingTop: Platform.OS === 'web' ? 100 : 0 }}>
//           <SearchBar />
//           <View nativeID="about-section">
//             <AboutTravelMate />
//           </View>
//           <TrendingItineraries />
//           <TopEvents />
//           <TopTravelers />
//           <CulturalExchange />
//           <TopServiceProviders />
//           <View nativeID="footer-section">
//             <Footer onScrollToTop={() => scrollToSection('top')} />
//           </View>
//         </View>
//       </ScrollView>

//       {/* ✅ Add BottomNavBar outside ScrollView */}
//       <BottomNavBar />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//   },
//   content: {
//     paddingBottom: Platform.OS === 'web' ? 30 : 100, // ✅ Prevents overlap with mobile nav
//   },
// });

// export default LandingScreen;


import React, { useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  findNodeHandle,
  UIManager,
} from 'react-native';

import Header from '../components/LandingPage/Header';
import SearchBar from '../components/LandingPage/SearchBar';
import AboutTravelMate from '../components/LandingPage/AboutTravelMate';
import TrendingItineraries from '../components/LandingPage/TrendingItineraries';
import TopEvents from '../components/LandingPage/TopEvents';
import TopTravelers from '../components/LandingPage/TopTravelers';
import CulturalExchange from '../components/LandingPage/CulturalExchange';
import TopServiceProviders from '../components/LandingPage/TopServiceProviders';
import Footer from '../components/LandingPage/Footer';
import BottomNavBar from '../components/LandingPage/BottomNavBar';

const LandingScreen = () => {
  const scrollRef = useRef();

  const sectionRefs = {
    top: useRef(),
    about: useRef(),
    itineraries: useRef(),
    events: useRef(),
    travelers: useRef(),
    culture: useRef(),
    services: useRef(),        // ✅ Added ref for services section
    footer: useRef(),
  };

  const scrollToSection = (sectionId) => {
    if (Platform.OS === 'web') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const ref = sectionRefs[sectionId];
      if (ref?.current) {
        const nodeHandle = findNodeHandle(ref.current);
        if (nodeHandle) {
          UIManager.measure(nodeHandle, (_x, _y, _width, _height, _pageX, pageY) => {
            scrollRef.current?.scrollTo({ y: pageY - 100, animated: true });
          });
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onNavigate={scrollToSection} />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View ref={sectionRefs.top} nativeID="top" />

        <View style={{ paddingTop: Platform.OS === 'web' ? 100 : 0 }}>
          <SearchBar />

          <View ref={sectionRefs.about} nativeID="about-section">
            <AboutTravelMate />
          </View>

          <View ref={sectionRefs.itineraries} nativeID="itineraries">
            <TrendingItineraries />
          </View>

          <View ref={sectionRefs.events} nativeID="events">
            <TopEvents />
          </View>

          <View ref={sectionRefs.travelers} nativeID="travelers">
            <TopTravelers />
          </View>

          <View ref={sectionRefs.culture} nativeID="culture">
            <CulturalExchange />
          </View>

          {/* ✅ Added services section */}
          <View ref={sectionRefs.services} nativeID="services">
            <TopServiceProviders />
          </View>

          <View ref={sectionRefs.footer} nativeID="footer-section">
            <Footer onScrollToTop={() => scrollToSection('top')} />
          </View>
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    paddingBottom: Platform.OS === 'web' ? 30 : 100,
  },
});

export default LandingScreen;
