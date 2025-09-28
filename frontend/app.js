
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
import EventIntegrationScreen from './screens/EventIntegrationScreen';

/* Traveler Screens */
import TravelerProfile from './screens/TravelerProfile';
import VendorProfile from './screens/VendorProfile';
import TravelerProfileDetailsScreen from './screens/traveler/TravelerProfileDetailsScreen';
import VendorProfileDetailsScreen from './screens/vendor/VendorProfileDetailsScreen';

import CrowdsourceItinerariesScreen from './screens/CrowdsourceItineraries/CrowdsourceItinerariesScreen';
import ManageItinerariesScreen from "./screens/CrowdsourceItineraries/ManageItinerariesScreen";
import CreateItineraryScreen from './screens/CrowdsourceItineraries/CreateItineraryScreen';
import EditItineraryScreen from "./screens/CrowdsourceItineraries/EditItineraryScreen";
import SocialDashboard from './screens/SocialDashboard';
import GroupsHomeScreen from "./components/Groups/GroupsHomeScreen";

// import ItineraryDetailsScreen from "./screens/CrowdsourceItineraries/ItineraryDetailsScreen";
import PdfViewerScreen from './screens/PdfViewerScreen';
import RecommendationScreen from './screens/Recommendations/RecommendationScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ResetPasswordScreen2 from './screens/ResetPasswordScreen2';
import ItineraryDetailScreen from './screens/ItineraryDetailScreen';
import TravelerServicesScreen from './screens/VendorServices/TravelerServicesScreen';
import AccommodationListingScreen from './screens/VendorServices/AccommodationListingScreen';
import TravelerProductScreen from './screens/VendorServices/TravelerProductScreen';
import CulturalExchangeScreen from './screens/VendorServices/CulturalExchangeScreen';
import GroupScreen from './screens/GroupScreen';
import ProfileCompletionScreen from './screens/ProfileCompletionScreen';
import ItinerariesHub from './screens/ItinerariesHub';
import completeitinerrarydetail from "./screens/completeitinerrarydetail";

/*Vendor Type Selection */
import VendorTypeSelectionScreen from './screens/vendor/VendorTypeSelectionScreen';

/* Accommodation Provider */
import My_Services from './screens/Accommodations/My_Services';
import Add_New_Services from './screens/Accommodations/Add_New_Services';
import Create_Offer from './screens/Accommodations/Create_Offer';
import Manage_My_Offer from './screens/Accommodations/Manage_My_Offer';
import Booking_Requests from './screens/Accommodations/Booking_Requests';
import Booking_Analytics from './screens/Accommodations/Booking_Analytics';
import Chat_With_Guest from './screens/Accommodations/Chat_With_Guest';
import Notifications from './screens/Accommodations/Notifications';

/* Community / Messages */

import MessagesScreen from './screens/MessagesScreen';

/* Cultural Exchange */
import Offer_Cultural_Skill from './screens/Cultural_exchange/Offer_Cultural_Skill';
import My_Cultural_Listings from './screens/Cultural_exchange/My_Cultural_Listings';
import Manage_Requests from './screens/Cultural_exchange/Manage_Requests';
import Chat_With_Interested_Travelers from './screens/Cultural_exchange/Chat_With_Interested_Travelers';
import Upload_Cultural_Moments from './screens/Cultural_exchange/Upload_Cultural_Moments';
import Traveler_Feedback from './screens/Cultural_exchange/Traveler_Feedback';
import Cultural_Engagement_Stats from './screens/Cultural_exchange/Cultural_Engagement_Stats';

/* Product Seller */
import Add_New_Product from './screens/Product/Add_New_Product';
import My_Product_Listings from './screens/Product/My_Product_Listings';
import Manage_Orders from './screens/Product/Manage_Orders';
import Chat_With_Customers from './screens/Product/Chat_With_Customers';
import Customer_Feedback from './screens/Product/Customer_Feedback';
import Product_Sales_Analytics from './screens/Product/Product_Sales_Analytics';
import Upload_Product_Gallery from './screens/Product/Upload_Product_Gallery';

/* Transport Provider */
import Add_New_Transport from './screens/Transport/Add_New_Transport';
import My_Transport_Listings from './screens/Transport/My_Transport_Listings';
import Transport_Analytics from './screens/Transport/Transport_Analytics';
import Transport_Bookings from './screens/Transport/Transport_Bookings';
import Transport_Offers from './screens/Transport/Transport_Offers';

/* NEW: CommunityHub + Offline */

import OfflineScreen from './screens/OfflineScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const navRef = useNavigationContainerRef();

  // Bind handlers WITHOUT rendering anything inside NavigationContainer
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
            <Stack.Screen name="ItineraryDetailScreen" component={ItineraryDetailScreen} />
            <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />
            <Stack.Screen name="VendorTypeSelection" component={VendorTypeSelectionScreen} />

            {/* Dashboards */}
            <Stack.Screen name="RealTimeAlerts" component={RealTimeAlertsScreen} />
            <Stack.Screen name="VendorDashboard" component={VendorDashboard} />
            <Stack.Screen name="EventIntegration" component={EventIntegrationScreen} />
            <Stack.Screen name="ItinerariesHub" component={ItinerariesHub} />
            <Stack.Screen name="ItineraryDetails" component={completeitinerrarydetail} />
            <Stack.Screen name="SocialDashboard" component={SocialDashboard} />
            <Stack.Screen name="GroupsHome" component={GroupsHomeScreen} />

            {/* NEW entry points */}
            <Stack.Screen name="OfflineScreen" component={OfflineScreen} />

            {/* Community / Messages */}
            <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />

            {/* Traveler Screens */}
            <Stack.Screen name="TravelerProfile" component={TravelerProfile} />
            <Stack.Screen name="VendorProfile" component={VendorProfile} />
            <Stack.Screen name="TravelerProfileDetailsScreen" component={TravelerProfileDetailsScreen} />
            <Stack.Screen name="VendorProfileDetailsScreen" component={VendorProfileDetailsScreen} />
            <Stack.Screen name="CrowdsourceItineraries" component={CrowdsourceItinerariesScreen} />
            <Stack.Screen name="CreateItinerary" component={CreateItineraryScreen} />
            <Stack.Screen name="EditItinerary" component={EditItineraryScreen} />
            <Stack.Screen name="ManageItineraries" component={ManageItinerariesScreen} />
            <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
            <Stack.Screen name="RecommendationScreen" component={RecommendationScreen} />
             {/* <Stack.Screen name="ItineraryDetails" component={ItineraryDetailsScreen} /> */}
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="ResetPasswordScreen2" component={ResetPasswordScreen2} />
            <Stack.Screen name="TravelerServicesScreen" component={TravelerServicesScreen} />
            <Stack.Screen name="AccommodationListingScreen" component={AccommodationListingScreen} />
            <Stack.Screen name="TravelerProductScreen" component={TravelerProductScreen} />
            <Stack.Screen name="CulturalExchangeScreen" component={CulturalExchangeScreen} />
            <Stack.Screen name="GroupScreen" component={GroupScreen} />
            

            {/* Accommodation Provider Screens */}
            <Stack.Screen name="MyServices" component={My_Services} />
            <Stack.Screen name="AddNewServices" component={Add_New_Services} />
            <Stack.Screen name="CreateOffer" component={Create_Offer} />
            <Stack.Screen name="ManageMyOffer" component={Manage_My_Offer} />
            <Stack.Screen name="BookingRequests" component={Booking_Requests} />
            <Stack.Screen name="BookingAnalytics" component={Booking_Analytics} />
            <Stack.Screen name="ChatWithGuest" component={Chat_With_Guest} />
            <Stack.Screen name="Notifications" component={Notifications} />

            {/* Cultural Exchange Screens */}
            <Stack.Screen name="OfferCulturalSkill" component={Offer_Cultural_Skill} />
            <Stack.Screen name="MyCulturalListings" component={My_Cultural_Listings} />
            <Stack.Screen name="ManageCulturalRequests" component={Manage_Requests} />
            <Stack.Screen name="CulturalChat" component={Chat_With_Interested_Travelers} />
            <Stack.Screen name="UploadCulturalMedia" component={Upload_Cultural_Moments} />
            <Stack.Screen name="CulturalFeedback" component={Traveler_Feedback} />
            <Stack.Screen name="CulturalStats" component={Cultural_Engagement_Stats} />

            {/* Product Seller Screens */}
            <Stack.Screen name="Add_New_Product" component={Add_New_Product} />
            <Stack.Screen name="My_Product_Listings" component={My_Product_Listings} />
            <Stack.Screen name="Manage_Orders" component={Manage_Orders} />
            <Stack.Screen name="Chat_With_Customers" component={Chat_With_Customers} />
            <Stack.Screen name="Customer_Feedback" component={Customer_Feedback} />
            <Stack.Screen name="Product_Sales_Analytics" component={Product_Sales_Analytics} />
            <Stack.Screen name="Upload_Product_Gallery" component={Upload_Product_Gallery} />
            {/* Transport Provider Screens */}
            <Stack.Screen name="AddNewTransport" component={Add_New_Transport} />
            <Stack.Screen name="MyTransportListings" component={My_Transport_Listings} />
            <Stack.Screen name="TransportAnalytics" component={Transport_Analytics} />
            <Stack.Screen name="TransportBookings" component={Transport_Bookings} />
            <Stack.Screen name="TransportOffers" component={Transport_Offers} />


          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </RoleProvider>
  );
}
