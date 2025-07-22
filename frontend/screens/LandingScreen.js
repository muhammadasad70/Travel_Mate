
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
import AboutTravelMate from '../components/LandingPage/AboutTravelMate';
import TrendingItineraries from '../components/LandingPage/TrendingItineraries';
import TopEvents from '../components/LandingPage/TopEvents';
import TopTravelers from '../components/LandingPage/TopTravelers';
import CulturalExchange from '../components/LandingPage/CulturalExchange';
import TopServiceProviders from '../components/LandingPage/TopServiceProviders'; // ✅ Import the new component
import Footer from '../components/LandingPage/Footer';

const LandingScreen = () => {
  const scrollRef = useRef();

  const scrollToSection = (sectionId) => {
    if (Platform.OS === 'web') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
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
        {Platform.OS === 'web' && <View nativeID="top" />}

        <View style={{ paddingTop: Platform.OS === 'web' ? 100 : 0 }}>
          <SearchBar />
          <View nativeID="about-section">
            <AboutTravelMate />
          </View>
          <TrendingItineraries />
          <TopEvents />
          <TopTravelers />
          <CulturalExchange />
          <TopServiceProviders />
          <View nativeID="footer-section">
            <Footer onScrollToTop={() => scrollToSection('top')} />
          </View>
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

export default LandingScreen;
