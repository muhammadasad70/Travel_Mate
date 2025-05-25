import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { RoleProvider } from './RoleContext';

// Core Screens
import TestHeaderScreen from './screens/TestHeaderScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TravelerDashboard from './screens/TravelerDashboardScreen';
import VendorDashboardScreen from './screens/VendorDashboardScreen';
import PostLoginCheckScreen from './screens/PostLoginCheckScreen';
import VendorVerificationScreen from './screens/VendorVerificationScreen';
import RealTimeAlertsScreen from './screens/RealTimeAlertsScreen';
import EventIntegrationScreen from './screens/EventIntegrationScreen';

// Traveler Screens
import TravelerProfileScreen from './screens/traveler/TravelerProfileScreen';
import ManageTravelerProfileScreen from './screens/traveler/ManageTravelerProfileScreen';
import VendorProfileScreen from './screens/vendor/VendorProfileScreen';
import ManageVendorProfileScreen from './screens/vendor/ManageVendorProfileScreen';
import CrowdsourceItinerariesScreen from './screens/CrowdsourceItineraries/CrowdsourceItinerariesScreen';
import CreateItineraryScreen from './screens/CrowdsourceItineraries/CreateItineraryScreen';
import EditItineraryScreen from './screens/CrowdsourceItineraries/EditItineraryScreen';
import UpdateItineraryScreen from './screens/CrowdsourceItineraries/UpdateItineraryScreen';
import PdfViewerScreen from './screens/PdfViewerScreen';
import ShareItineraryScreen from './screens/ShareItineraryScreen';
import ViewSavedItinerariesScreen from './screens/ViewSavedItinerariesScreen';
import RecommendationScreen from './screens/Recommendations/RecommendationScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ResetPasswordScreen2 from './screens/ResetPasswordScreen2';
import ItineraryDetailScreen from './screens/ItineraryDetailScreen';
import TravelerServicesScreen from './screens/VendorServices/TravelerServicesScreen';
import AccommodationListingScreen from './screens/VendorServices/AccommodationListingScreen';
import TravelerProductScreen  from './screens/VendorServices/TravelerProductScreen';
import CulturalExchangeScreen  from './screens/VendorServices/CulturalExchangeScreen';
import GroupScreen from './screens/Groups/GroupScreen';
import GroupDashboardScreen from './screens/Groups/GroupDashboardScreen';
import OptimizeItineraryScreen  from './screens/CrowdsourceItineraries/OptimizeItineraryScreen';




// Vendor Type Selection
import VendorTypeSelectionScreen from './screens/vendor/VendorTypeSelectionScreen';

// Accommodation Provider
import My_Services from './screens/Accommodations/My_Services';
import Add_New_Services from './screens/Accommodations/Add_New_Services';
import Create_Offer from './screens/Accommodations/Create_Offer';
import Manage_My_Offer from './screens/Accommodations/Manage_My_Offer';
import Booking_Requests from './screens/Accommodations/Booking_Requests';
import Booking_Analytics from './screens/Accommodations/Booking_Analytics';
import Chat_With_Guest from './screens/Accommodations/Chat_With_Guest';
import Notifications from './screens/Accommodations/Notifications';

// Cultural Exchange
import Offer_Cultural_Skill from './screens/Cultural_exchange/Offer_Cultural_Skill';
import My_Cultural_Listings from './screens/Cultural_exchange/My_Cultural_Listings';
import Manage_Requests from './screens/Cultural_exchange/Manage_Requests';
import Chat_With_Interested_Travelers from './screens/Cultural_exchange/Chat_With_Interested_Travelers';
import Upload_Cultural_Moments from './screens/Cultural_exchange/Upload_Cultural_Moments';
import Traveler_Feedback from './screens/Cultural_exchange/Traveler_Feedback';
import Cultural_Engagement_Stats from './screens/Cultural_exchange/Cultural_Engagement_Stats';

// Product Seller
import Add_New_Product from './screens/Product/Add_New_Product';
import My_Product_Listings from './screens/Product/My_Product_Listings';
import Manage_Orders from './screens/Product/Manage_Orders';
import Chat_With_Customers from './screens/Product/Chat_With_Customers';
import Customer_Feedback from './screens/Product/Customer_Feedback';
import Product_Sales_Analytics from './screens/Product/Product_Sales_Analytics';
import Upload_Product_Gallery from './screens/Product/Upload_Product_Gallery';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <RoleProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TestHeader" screenOptions={{ headerShown: false }}>
          {/* Core Navigation */}
          <Stack.Screen name="TestHeader" component={TestHeaderScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="PostLoginCheckScreen" component={PostLoginCheckScreen} />
          <Stack.Screen name="ItineraryDetailScreen" component={ItineraryDetailScreen} />

          {/* Dashboards */}
          <Stack.Screen name="TravelerDashboard" component={TravelerDashboard} />
          <Stack.Screen name="RealTimeAlerts" component={RealTimeAlertsScreen} />
          <Stack.Screen name="VendorDashboardScreen" component={VendorDashboardScreen} />
          <Stack.Screen name="VendorVerificationScreen" component={VendorVerificationScreen} />
          <Stack.Screen name="EventIntegration" component={EventIntegrationScreen} />
          {/* Traveler Screens */}
          <Stack.Screen name="TravelerProfile" component={TravelerProfileScreen} />
          <Stack.Screen name="ManageTravelerProfile" component={ManageTravelerProfileScreen} />
          <Stack.Screen name="VendorProfile" component={VendorProfileScreen} />
          <Stack.Screen name="ManageVendorProfile" component={ManageVendorProfileScreen} />
          <Stack.Screen name="CrowdsourceItineraries" component={CrowdsourceItinerariesScreen} />
          <Stack.Screen name="OptimizeItinerary" component={OptimizeItineraryScreen} />
          <Stack.Screen name="CreateItinerary" component={CreateItineraryScreen} />
          <Stack.Screen name="EditItinerary" component={EditItineraryScreen} />
          <Stack.Screen name="UpdateItineraryScreen" component={UpdateItineraryScreen} />
          <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
          <Stack.Screen name="ShareItinerary" component={ShareItineraryScreen} />
          <Stack.Screen name="ViewSavedItineraries" component={ViewSavedItinerariesScreen} />
          <Stack.Screen name="RecommendationScreen" component={RecommendationScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="ResetPasswordScreen2" component={ResetPasswordScreen2} />
          <Stack.Screen name="TravelerServicesScreen" component={TravelerServicesScreen}/>
          <Stack.Screen name="AccommodationListingScreen" component={AccommodationListingScreen} />
          <Stack.Screen name="TravelerProductScreen" component={TravelerProductScreen} />
          <Stack.Screen name="CulturalExchangeScreen" component={CulturalExchangeScreen} />
          <Stack.Screen name="GroupScreen" component={GroupScreen} />
          <Stack.Screen name="GroupDashboard" component={GroupDashboardScreen} />




          {/* Vendor Role Selection */}
          <Stack.Screen name="VendorTypeSelectionScreen" component={VendorTypeSelectionScreen} />

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

          {/* Product Seller Screens - No title options */}
          <Stack.Screen name="Add_New_Product" component={Add_New_Product} />
          <Stack.Screen name="My_Product_Listings" component={My_Product_Listings} />
          <Stack.Screen name="Manage_Orders" component={Manage_Orders} />
          <Stack.Screen name="Chat_With_Customers" component={Chat_With_Customers} />
          <Stack.Screen name="Customer_Feedback" component={Customer_Feedback} />
          <Stack.Screen name="Product_Sales_Analytics" component={Product_Sales_Analytics} />
          <Stack.Screen name="Upload_Product_Gallery" component={Upload_Product_Gallery} />
        </Stack.Navigator>
      </NavigationContainer>
    </RoleProvider>
  );
}
