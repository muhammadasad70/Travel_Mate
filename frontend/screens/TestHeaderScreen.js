



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
// import QuickAccessCards from '../components/LandingPage/QuickAccessCards';
// import AboutTravelMate from '../components/LandingPage/AboutTravelMate';
// import TrendingItineraries from '../components/LandingPage/TrendingItineraries';
// import TopEvents from '../components/LandingPage/TopEvents';
// import TopTravelers from '../components/LandingPage/TopTravelers';
// import CulturalExchange from '../components/LandingPage/CulturalExchange';
// import Footer from '../components/LandingPage/Footer';

// const TestHeaderScreen = () => {
//   const scrollRef = useRef();

//   const scrollToTop = () => {
//     if (Platform.OS === 'web') {
//       const topEl = document.getElementById('top');
//       if (topEl) {
//         topEl.scrollIntoView({ behavior: 'smooth' });
//       } else {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//       }
//     } else {
//       scrollRef?.current?.scrollTo({ y: 0, animated: true });
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
//         {/* 👇 Anchor for web scroll-to-top */}
//         {Platform.OS === 'web' && <View nativeID="top" />}

//         <Header />
//         <SearchBar />
//         <QuickAccessCards />
//         <AboutTravelMate />
//         <TrendingItineraries />
//         <TopEvents />
//         <TopTravelers />
//         <CulturalExchange />
//         {/* ✅ Pass scrollToTop function to Footer */}
//         <Footer onScrollToTop={scrollToTop} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//   },
//   content: {
//     paddingBottom: 30,
//   },
// });

// export default TestHeaderScreen;


import React, { useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import Header from '../components/LandingPage/Header';
import SearchBar from '../components/LandingPage/SearchBar';
import QuickAccessCards from '../components/LandingPage/QuickAccessCards';
import AboutTravelMate from '../components/LandingPage/AboutTravelMate';
import TrendingItineraries from '../components/LandingPage/TrendingItineraries';
import TopEvents from '../components/LandingPage/TopEvents';
import TopTravelers from '../components/LandingPage/TopTravelers';
import CulturalExchange from '../components/LandingPage/CulturalExchange';
import Footer from '../components/LandingPage/Footer';

const TestHeaderScreen = () => {
  const scrollRef = useRef();

  const scrollToSection = (sectionId) => {
    if (Platform.OS === 'web') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // You can extend this for mobile scroll logic if needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        {/* 👇 Top Anchor for "Home" scroll */}
        {Platform.OS === 'web' && <View nativeID="top" />}

        <Header onNavigate={scrollToSection} />
        <SearchBar />
        <QuickAccessCards />
        <View nativeID="about-section"><AboutTravelMate /></View>
        <TrendingItineraries />
        <TopEvents />
        <TopTravelers />
        <CulturalExchange />
        <View nativeID="footer-section">
          <Footer onScrollToTop={() => scrollToSection('top')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    paddingBottom: 30,
  },
});

export default TestHeaderScreen;
