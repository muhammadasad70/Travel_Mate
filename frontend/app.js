

// App.js
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RoleProvider } from './RoleContext';
import { setOnUnauthorized, setOnPrecondition } from './api';

/* Core Screens */
import LandingScreen from './screens/LandingScreen';
import AboutTravelMatePage from './components/LandingPage/AboutTravelMatePage';
import TravelerDashboard from './screens/TravelerDashboard';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VendorDashboard from './screens/VendorDashboard';
import RealTimeAlertsScreen from './screens/RealTimeAlertsScreen';
import EventsExplorerScreen from "./screens/EventsExplorerScreen";

/* Traveler Screens */
import TravelerProfile from './screens/TravelerProfile';
import VendorProfile from './screens/VendorProfile';
import TravelerProfileDetailsScreen from './screens/traveler/TravelerProfileDetailsScreen';
import VendorProfileDetailsScreen from './screens/vendor/VendorProfileDetailsScreen';

import CrowdsourceItineraries from './screens/CrowdsourceItineraries/CrowdsourceItinerariesScreen';
import ManageItinerariesScreen from "./screens/CrowdsourceItineraries/ManageItinerariesScreen";
import CreateItineraryScreen from './screens/CrowdsourceItineraries/CreateItineraryScreen';
import EditItineraryScreen from "./screens/CrowdsourceItineraries/EditItineraryScreen";
import SocialDashboard from './screens/SocialDashboard';
import CreateGroupModal from "./components/Groups/CreateGroupModal";
import GroupsHomeScreen from "./components/Groups/GroupsHomeScreen";
import GroupDashboard from "./screens/GroupDashboard";

import PdfViewerScreen from './screens/PdfViewerScreen';
import RecommendationScreen from './screens/Recommendations/RecommendationScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ResetPasswordScreen2 from './screens/ResetPasswordScreen2';
import GroupScreen from './screens/GroupScreen';
import ProfileCompletionScreen from './screens/ProfileCompletionScreen';
import ItinerariesHub from './screens/ItinerariesHub';
import completeitinerrarydetail from "./screens/CrowdsourceItineraries/completeitinerrarydetail";
import CommunityExplorer from "./screens/CrowdsourceItineraries/CommunityExplorerScreen";
import ServicesHub from './screens/ServicesHub';
import AIRecommendationsFormScreen from './screens/CrowdsourceItineraries/AIRecommendationsFormScreen';
import SavedAIItinerariesScreen from './screens/CrowdsourceItineraries/SavedAIItinerariesScreen';

/* Vendor Type Selection */
import VendorTypeSelectionScreen from './screens/vendor/VendorTypeSelectionScreen';
/* Community / Messages */
import MessagesScreen from './screens/MessagesScreen';

/* Cultural Exchange Screens */
import CulturalServiceDetail from './screens/CulturalExchange/CulturalServiceDetail';
import AddCulturalServiceForm from './screens/CulturalExchange/AddCulturalServiceForm';
import CulturalServicesExplorerScreen from './screens/CulturalExchange/CulturalServicesExplorerScreen';
import PublicHostProfile from './screens/CulturalExchange/PublicHostProfile';
import PublicTravelerProfile from './screens/CulturalExchange/PublicTravelerProfile';

/* Vendor Screens */
import CulturalRequests from './screens/vendor/CulturalRequests';
import CulturalBooked from './screens/vendor/CulturalBooked';

/* Traveler Booking Screens */
import ServicesBrowse from './screens/traveler/ServicesBrowse';
import ServiceBookingRequest from './screens/traveler/ServiceBookingRequest';
import MyBookings from './screens/traveler/MyBookings';

/* Offline Screens */
import OfflineScreen from './screens/OfflineScreen';
import OfflineCenterScreen from './components/Offline/OfflineCenterScreen';
import OfflineItineraryViewer from './components/Offline/OfflineItineraryViewer';
import OfflineEmergency from './components/Offline/OfflineEmergency';


import BookingChatList from './screens/BookingChatList';
import BookingChat from './screens/BookingChat';
import WeatherAwareRecommendationsScreen from './screens/CrowdsourceItineraries/WeatherAwareRecommendationsScreen';

/* Offline hook: start auto-sync once */
import { startAutoSync } from './hooks/useOfflineItineraries';


const Stack = createNativeStackNavigator();

export default function App() {
  const navRef = useNavigationContainerRef();

  /* 🔹 Start offline auto-sync (reconnect → push queued edits) */
  useEffect(() => {
    const unsub = startAutoSync();
    return () => unsub && unsub();
  }, []);

  /* Keep your auth / precondition redirects */
  useEffect(() => {
    setOnUnauthorized(() => {
      if (navRef.isReady()) {
        navRef.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    });
    setOnPrecondition(() => {
      if (navRef.isReady()) {
        navRef.reset({ index: 0, routes: [{ name: 'ProfileCompletion' }] });
      }
    });
  }, [navRef]);

  return (
    <RoleProvider>
      <SafeAreaProvider>
        <NavigationContainer ref={navRef}>
          <Stack.Navigator initialRouteName="Landing Page" screenOptions={{ headerShown: false }}>
            {/* Core Navigation */}
            <Stack.Screen name="Landing Page" component={LandingScreen} />
            <Stack.Screen name="AboutTravelMatePage" component={AboutTravelMatePage} />
            <Stack.Screen name="TravelerDashboard" component={TravelerDashboard} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />
            <Stack.Screen name="VendorTypeSelection" component={VendorTypeSelectionScreen} />

            {/* Dashboards */}
            <Stack.Screen name="RealTimeAlerts" component={RealTimeAlertsScreen} />
            <Stack.Screen name="VendorDashboard" component={VendorDashboard} />
            <Stack.Screen name="ItinerariesHub" component={ItinerariesHub} />
            <Stack.Screen name="ItineraryDetails" component={completeitinerrarydetail} />
            <Stack.Screen name="SocialDashboard" component={SocialDashboard} />
            <Stack.Screen name="GroupsHome" component={GroupsHomeScreen} />
            <Stack.Screen name="CreateGroupModal" component={CreateGroupModal} />

            {/* Offline Screens */}
            <Stack.Screen name="OfflineScreen" component={OfflineScreen} />
            <Stack.Screen name="OfflineCenter" component={OfflineCenterScreen} />
            <Stack.Screen name="OfflineItineraryViewer" component={OfflineItineraryViewer} />
            <Stack.Screen name="OfflineEmergency" component={OfflineEmergency} />

            {/* Community / Messages */}
            <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />

            {/* Traveler Screens */}
            <Stack.Screen name="TravelerProfile" component={TravelerProfile} />
            <Stack.Screen name="VendorProfile" component={VendorProfile} />
            <Stack.Screen name="TravelerProfileDetailsScreen" component={TravelerProfileDetailsScreen} />
            <Stack.Screen name="VendorProfileDetailsScreen" component={VendorProfileDetailsScreen} />
            <Stack.Screen name="CrowdsourceItineraries" component={CrowdsourceItineraries} />
            <Stack.Screen name="CreateItinerary" component={CreateItineraryScreen} />
            <Stack.Screen name="EditItinerary" component={EditItineraryScreen} />
            <Stack.Screen name="ManageItineraries" component={ManageItinerariesScreen} />
            <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
            <Stack.Screen name="RecommendationScreen" component={RecommendationScreen} />
            <Stack.Screen name="EventsExplorer" component={EventsExplorerScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="ResetPasswordScreen2" component={ResetPasswordScreen2} />
            <Stack.Screen name="GroupScreen" component={GroupScreen} />
            <Stack.Screen name="GroupDashboard" component={GroupDashboard} />
            <Stack.Screen name="CommunityExplorer" component={CommunityExplorer} />
            <Stack.Screen name="ServicesHub" component={ServicesHub} />
            <Stack.Screen name="AIRecommendationsFormScreen" component={AIRecommendationsFormScreen} />
            <Stack.Screen name="SavedAIItinerariesScreen" component={SavedAIItinerariesScreen} />

            {/* Cultural Exchange Screens */}
            <Stack.Screen name="CulturalServiceDetail" component={CulturalServiceDetail} />
            <Stack.Screen name="AddCulturalService" component={AddCulturalServiceForm} />
            <Stack.Screen name="CulturalServicesExplorerScreen" component={CulturalServicesExplorerScreen} />
            
            {/* 🔹 NEW: Public Profile Screens */}
            <Stack.Screen name="PublicHostProfile" component={PublicHostProfile} />
            <Stack.Screen name="PublicTravelerProfile" component={PublicTravelerProfile} />

            {/* Vendor Booking Management */}
            <Stack.Screen name="VendorRequests" component={CulturalRequests} />
            <Stack.Screen name="VendorBooked" component={CulturalBooked} />

            {/* Traveler Booking Screens */}
            <Stack.Screen name="ServiceBookingRequest" component={ServiceBookingRequest} />
            <Stack.Screen name="MyBookings" component={MyBookings} />
            <Stack.Screen name="ServicesBrowse" component={ServicesBrowse} />


            <Stack.Screen name="BookingChatList" component={BookingChatList} />
            <Stack.Screen name="BookingChat" component={BookingChat} />
            <Stack.Screen name="WeatherAwareRecommendations" component={WeatherAwareRecommendationsScreen} 
/>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </RoleProvider>
  );
}