
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

import CrowdsourceItineraries from './CrowdsourceItineraries/CrowdsourceItinerariesScreen';
import EventIntegration from './EventIntegrationScreen';
import TravelerServicesScreen from './VendorServices/TravelerServicesScreen';
import TravelerNotifications from './RealTimeAlertsScreen';
import TravelerProfile from './TravelerProfile';
import GroupScreen from './GroupScreen';
import CommunityHubScreen from './CommunityHubScreen';
import OfflineScreen from './OfflineScreen';
import CommunityScreen from './CommunityScreen';
import MessagesScreen from './MessagesScreen';
import ItinerariesHub from './ItinerariesHub';

// 🔔 Popup that checks /user/profile-status after 5s
import CompleteProfilePrompt from './CompleteProfilePrompt';

const TravelerDashboard = () => {
  const route = useRoute();
  const navigation = useNavigation();
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
// return < CrowdsourceItineraries />;
  const renderCurrentTab = () => {
    switch (selectedTab) {
      case 'tripplanner':
        return <ItinerariesHub />;
      case 'events':
        return <EventIntegration />;
      case 'services':
        return <TravelerServicesScreen />;
      case 'notification':
        return <TravelerNotifications />;
      case 'profile':
        return <TravelerProfile inPage />;
      case 'communityHub':
        return <CommunityHubScreen inPage />;
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

      {/* 🔔 Show “Complete Profile” popup 5s after landing (only if incomplete) */}
      <CompleteProfilePrompt navigation={navigation} delayMs={5000} />

      {/* Bottom navigation bar (highlights based on current tab) */}
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
