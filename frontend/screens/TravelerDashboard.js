
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

import Header from '../components/Dashboardoftraveler/TravelerHeader';
import TrendingItineraries from '../components/Dashboardoftraveler/TrendingItineraries';
import TopEvents from '../components/Dashboardoftraveler/TopEvents';
import TopTravelers from '../components/Dashboardoftraveler/TopTravelers';
import CulturalExchange from '../components/Dashboardoftraveler/CulturalExchange';
import TopServiceProviders from '../components/Dashboardoftraveler/TravelerTopServiceProviders';
import Footer from '../components/Dashboardoftraveler/Footer';
import BottomNavBar from '../components/Dashboardoftraveler/BottomNavBar';




const TravelerDashboard = () => {
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

        <View >
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

export default TravelerDashboard;
