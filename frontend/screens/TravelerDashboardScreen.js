// import React from 'react';
// import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native'; // ✅ import useNavigation
// import DashboardHeader from '../components/TravelerDashboard/DashboardHeader';
// import DashboardSidebar from '../components/TravelerDashboard/DashboardSidebar';
// import DashboardMain from '../components/TravelerDashboard/DashboardMain';

// const screenWidth = Dimensions.get('window').width;
// const isMobile = screenWidth < 768;

// const TravelerDashboardScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation(); // ✅ get navigation object
//   const { name } = route.params || {};

//   const handleSidebarSelect = (item) => {
//     console.log('Sidebar:', item);
//     // Later, handle sidebar navigation here
//   };

//   const handleCardClick = (item) => {
//     console.log('Card:', item);

//     if (item === 'Crowdsource Itineraries') {
//       navigation.navigate('CrowdsourceItineraries'); // ✅ must match App.js name
//     } else if (item === 'Recommendations') {
//       navigation.navigate('RecommendationScreen'); // ✅ navigate to RecommendationScreen
//     }else if (item === 'Vendor Services') {
//       navigation.navigate('TravelerServicesScreen'); // ✅ must match the name in App.js
//     }else if (item === 'Group') {
//       navigation.navigate('GroupScreen'); // ✅ must match the name in App.js
//     }else if (item === 'Real-Time Alerts') {
//       navigation.navigate('RealTimeAlerts'); // ✅ must match the name in App.js
//     }else if (item === 'Events Discovery & Integration') {
//       navigation.navigate('EventIntegration'); // ✅ must match the name in App.js
//     }

//     // Add more navigations for other cards if needed
//   }; 

//   return (
//     <View style={styles.container}>
//       <DashboardHeader name={name} />
//       <ScrollView contentContainerStyle={styles.body}>
//         <DashboardSidebar onSelect={handleSidebarSelect} />
//         <DashboardMain onCardPress={handleCardClick} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   body: {
//     flexDirection: isMobile ? 'column' : 'row',
//     flexGrow: 1,
//     alignItems: 'flex-start',
//   },
// });

// export default TravelerDashboardScreen;


// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ScrollView, Text } from 'react-native';
// import Header from '../components/TravelerDashboard/TravelerHeaderScreen';
// import BottomNavBar from '../components/TravelerDashboard/TravelerBottomScreen';

// // Screens to render
// import CrowdsourceItineraries from './CrowdsourceItineraries';
// import EventIntegration from './EventIntegration';
// import TravelerServicesScreen from './TravelerServicesScreen';

// const TravelerDashboardScreen = () => {
//   const [selectedTab, setSelectedTab] = useState('explore');

//   useEffect(() => {
//     const handleTabChange = (e) => {
//       if (e?.detail?.tabKey) setSelectedTab(e.detail.tabKey);
//     };
//     window.addEventListener('tabChange', handleTabChange);
//     return () => window.removeEventListener('tabChange', handleTabChange);
//   }, []);

//   const renderCurrentTab = () => {
//     switch (selectedTab) {
//       case 'tripplanner':
//         return <CrowdsourceItineraries />;
//       case 'events':
//         return <EventIntegration />;
//       case 'services':
//         return <TravelerServicesScreen />;
//       default:
//         return (
//           <View style={styles.placeholder}>
//             <Text style={styles.placeholderText}>Welcome to TravelMate Explore!</Text>
//           </View>
//         );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Header />
//       <ScrollView contentContainerStyle={styles.contentWrapper}>
//         {renderCurrentTab()}
//       </ScrollView>
//       <BottomNavBar />
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
//   placeholder: {
//     paddingVertical: 100,
//     alignItems: 'center',
//   },
//   placeholderText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#003366',
//   },
// });

// export default TravelerDashboardScreen;
