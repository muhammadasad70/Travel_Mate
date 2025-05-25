import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // ✅ import useNavigation
import DashboardHeader from '../components/TravelerDashboard/DashboardHeader';
import DashboardSidebar from '../components/TravelerDashboard/DashboardSidebar';
import DashboardMain from '../components/TravelerDashboard/DashboardMain';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const TravelerDashboardScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); // ✅ get navigation object
  const { name } = route.params || {};

  const handleSidebarSelect = (item) => {
    console.log('Sidebar:', item);
    // Later, handle sidebar navigation here
  };

  const handleCardClick = (item) => {
    console.log('Card:', item);

    if (item === 'Crowdsource Itineraries') {
      navigation.navigate('CrowdsourceItineraries'); // ✅ must match App.js name
    } else if (item === 'Recommendations') {
      navigation.navigate('RecommendationScreen'); // ✅ navigate to RecommendationScreen
    }else if (item === 'Vendor Services') {
      navigation.navigate('TravelerServicesScreen'); // ✅ must match the name in App.js
    }else if (item === 'Group') {
      navigation.navigate('GroupScreen'); // ✅ must match the name in App.js
    }else if (item === 'Real-Time Alerts') {
      navigation.navigate('RealTimeAlerts'); // ✅ must match the name in App.js
    }else if (item === 'Events Discovery & Integration') {
      navigation.navigate('EventIntegration'); // ✅ must match the name in App.js
    }

    // Add more navigations for other cards if needed
  }; 

  return (
    <View style={styles.container}>
      <DashboardHeader name={name} />
      <ScrollView contentContainerStyle={styles.body}>
        <DashboardSidebar onSelect={handleSidebarSelect} />
        <DashboardMain onCardPress={handleCardClick} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  body: {
    flexDirection: isMobile ? 'column' : 'row',
    flexGrow: 1,
    alignItems: 'flex-start',
  },
});

export default TravelerDashboardScreen;
