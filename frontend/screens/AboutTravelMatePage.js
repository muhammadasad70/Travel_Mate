

// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Dimensions
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';

// const AboutTravelMatePage = () => {
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scrollRef = useRef();
//   const windowHeight = Dimensions.get('window').height;

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handleScroll = (event) => {
//     const yOffset = event.nativeEvent.contentOffset.y;
//     setShowScrollTop(yOffset > windowHeight / 2);
//   };

//   const scrollToTop = () => {
//     scrollRef.current?.scrollTo({ y: 0, animated: true });
//   };

//   const scrollToSection = (y) => {
//     scrollRef.current?.scrollTo({ y, animated: true });
//   };

//   return (
//     <View style={styles.pageWrapper}>
//       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//         <Text style={styles.mainTitle}>About TravelMate</Text>

//         <View style={styles.sectionNav}>
//           <TouchableOpacity onPress={() => scrollToSection(0)} style={styles.navBtn}>
//             <Icon name="globe" size={16} />
//             <Text style={styles.navText}>Mission</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(300)} style={styles.navBtn}>
//             <Icon name="cogs" size={16} />
//             <Text style={styles.navText}>How It Works</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(600)} style={styles.navBtn}>
//             <Icon name="rocket" size={16} />
//             <Text style={styles.navText}>Features</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(900)} style={styles.navBtn}>
//             <Icon name="lightbulb" size={16} />
//             <Text style={styles.navText}>Why Us</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(1200)} style={styles.navBtn}>
//             <Icon name="users" size={16} />
//             <Text style={styles.navText}>Who We Help</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(1500)} style={styles.navBtn}>
//             <Icon name="chart-line" size={16} />
//             <Text style={styles.navText}>Vision</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView
//           ref={scrollRef}
//           style={styles.scrollArea}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//         >
//           <View style={styles.card}>
//             <Text style={styles.heading}><Icon name="globe" /> Our Mission</Text>
//             <Text style={styles.para}>
//               "To empower travelers with authentic, community-driven experiences
//               by bridging real people, real places, and real-time insights."
//               {"\n\n"}
//               TravelMate exists to revolutionize the way travel is planned,
//               experienced, and shared. We move beyond generic itineraries and
//               offer a dynamic, user-driven platform where experiences are:
//               {"\n\n"}
//               • Crowdsourced
//               {"\n"}• Personalized through AI
//               {"\n"}• Enriched with real-time updates
//               {"\n\n"}
//               Our mission is to make travel smarter, deeply personalized, and truly human-centered — built around real connections and meaningful experiences
//             </Text>
//           </View>

//           <View style={styles.cardAlt}>
//             <Text style={styles.heading}><Icon name="cogs" /> How It Works</Text>
//             <Text style={styles.para}>
//               Users sign up as Travelers or Vendors.
//               {"\n\n"}
//               Travelers can explore and create itineraries, join travel groups,
//               and receive smart suggestions based on weather, location, and interests.
//               {"\n\n"}
//               Vendors (like hotels, guides, and local sellers) can register their
//               services, verify identity, and offer experiences directly to travelers.
//               {"\n\n"}
//               The platform supports offline access, real-time collaboration,
//               and location-based recommendations.
//             </Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.heading}><Icon name="rocket" /> Key Features</Text>
//             <Text style={styles.para}>
//               • Crowdsourced Itineraries
//               {"\n"}• AI Personalization
//               {"\n"}• Vendor Marketplace
//               {"\n"}• Group Planning
//               {"\n"}• Offline Mode
//               {"\n"}• Smart Alerts
//             </Text>
//           </View>

//           <View style={styles.cardAlt}>
//             <Text style={styles.heading}><Icon name="lightbulb" /> Why TravelMate is Different</Text>
//             <Text style={styles.para}>
//               • Real-Time Personalization: TravelMate dynamically adapts recommendations based on the traveler’s 
//               location, weather, and preferences, ensuring every experience is timely and relevant.
//               {"\n"}• Crowdsourced Authenticity: Itineraries, suggestions, and reviews are contributed by 
//               real travelers, creating a diverse and trustworthy travel platform.
//               {"\n"}• Multi-Role Collaboration: Unlike typical apps, TravelMate supports both 
//               travelers and vendors with distinct dashboards and workflows — from offering services to managing group trips.
//               {"\n"}• Offline Access & Smart Alerts: The platform offers offline functionality and real-time alerts for weather, 
//               local events, and disruptions, enhancing reliability in remote areas.
//               {"\n"}•Group-Based Planning & Voting: Enables collaborative trip planning where friends or groups can vote, 
//               comment, and make collective decisions with permission-based control.
//               {"\n"}•Location-Based Intelligence: Smart suggestions for events, vendors, and experiences are 
//               shown based on proximity and live data, enhancing exploration.
//             </Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.heading}><Icon name="users" /> Who We Help</Text>
//             <Text style={styles.para}>
//               • Travelers: Plan, explore, and experience trips with dynamic tools.
//               {"\n"}• Vendors: Promote verified services directly to travelers.
//               {"\n"}• Local Communities: Support local culture and sustainability.
//             </Text>
//           </View>

//           <View style={styles.cardAlt}>
//             <Text style={styles.heading}><Icon name="chart-line" /> Future Vision</Text>
//             <Text style={styles.para}>
//               • AR-Powered Itinerary Visualization
//               {"\n"}• Decentralized Vendor Trust
//               {"\n"}• Heatmap-Based Optimization
//               {"\n"}• Voice-Based Planning
//               {"\n"}• Global Partnerships
//             </Text>
//           </View>
//         </ScrollView>

//         {showScrollTop && (
//           <TouchableOpacity style={styles.scrollTopBtn} onPress={scrollToTop}>
//             <Icon name="arrow-up" size={18} color="#fff" />
//           </TouchableOpacity>
//         )}
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   pageWrapper: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingTop: 60,
//   },
//   mainTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#222',
//   },
//   scrollArea: {
//     flex: 1,
//   },
//   sectionNav: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     gap: 10,
//     marginBottom: 20,
//   },
//   navBtn: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     margin: 5,
//   },
//   navText: {
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     elevation: 3,
//   },
//   cardAlt: {
//     backgroundColor: '#f1f1f1',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     elevation: 3,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     flexDirection: 'row',
//   },
//   para: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#444',
//   },
//   scrollTopBtn: {
//     position: 'absolute',
//     bottom: 30,
//     right: 20,
//     backgroundColor: '#007bff',
//     borderRadius: 25,
//     padding: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//   },
// });

// export default AboutTravelMatePage;


import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const AboutTravelMatePage = () => {
  const navigation = useNavigation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setShowScrollTop(yOffset > windowHeight / 2);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const scrollToSection = (y) => {
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  return (
    <View style={styles.pageWrapper}>
      {/* Sticky Header with Home and Join Us */}
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.mainTitle}>About TravelMate</Text>

        <View style={styles.sectionNav}>
  {/* Home Button */}
  <TouchableOpacity onPress={() => navigation.navigate('Landing Page')} style={styles.navBtn}>
    <Icon name="home" size={16} />
    <Text style={styles.navText}>Home</Text>
  </TouchableOpacity>

  {/* Join Us Button */}
  <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')} style={styles.navBtn}>
    <Icon name="user-plus" size={16} />
    <Text style={styles.navText}>Join Us</Text>
  </TouchableOpacity>

  {/* Section Navigation Buttons */}
  <TouchableOpacity onPress={() => scrollToSection(0)} style={styles.navBtn}>
    <Icon name="globe" size={16} />
    <Text style={styles.navText}>Mission</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => scrollToSection(300)} style={styles.navBtn}>
    <Icon name="cogs" size={16} />
    <Text style={styles.navText}>How It Works</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => scrollToSection(600)} style={styles.navBtn}>
    <Icon name="rocket" size={16} />
    <Text style={styles.navText}>Features</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => scrollToSection(900)} style={styles.navBtn}>
    <Icon name="lightbulb" size={16} />
    <Text style={styles.navText}>Why Us</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => scrollToSection(1200)} style={styles.navBtn}>
    <Icon name="users" size={16} />
    <Text style={styles.navText}>Who We Help</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => scrollToSection(1500)} style={styles.navBtn}>
    <Icon name="chart-line" size={16} />
    <Text style={styles.navText}>Vision</Text>
  </TouchableOpacity>
</View>


        <ScrollView
          ref={scrollRef}
          style={styles.scrollArea}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.card}>
            <Text style={styles.heading}><Icon name="globe" /> Our Mission</Text>
            <Text style={styles.para}>
              "To empower travelers with authentic, community-driven experiences
              by bridging real people, real places, and real-time insights."
              {"\n\n"}
              TravelMate exists to revolutionize the way travel is planned,
              experienced, and shared. We move beyond generic itineraries and
              offer a dynamic, user-driven platform where experiences are:
              {"\n\n"}
              • Crowdsourced
              {"\n"}• Personalized through AI
              {"\n"}• Enriched with real-time updates
              {"\n\n"}
              Our mission is to make travel smarter, deeply personalized, and truly human-centered —
              built around real connections and meaningful experiences.
            </Text>
          </View>

          <View style={styles.cardAlt}>
            <Text style={styles.heading}><Icon name="cogs" /> How It Works</Text>
            <Text style={styles.para}>
              • Travelers or Vendors can register easily.
              {"\n\n"}• Travelers explore and create itineraries, join groups,
              and receive AI-based suggestions.
              {"\n\n"}• Vendors offer services directly after verification.
              {"\n\n"}• The platform supports offline access and real-time collaboration.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}><Icon name="rocket" /> Key Features</Text>
            <Text style={styles.para}>
              • Crowdsourced Itineraries
              {"\n"}• AI Personalization
              {"\n"}• Vendor Marketplace
              {"\n"}• Group Planning
              {"\n"}• Offline Mode
              {"\n"}• Smart Alerts
            </Text>
          </View>

          <View style={styles.cardAlt}>
            <Text style={styles.heading}><Icon name="lightbulb" /> Why TravelMate is Different</Text>
            <Text style={styles.para}>
              • Real-Time Personalization
              {"\n"}• Crowdsourced Authenticity
              {"\n"}• Multi-Role Collaboration
              {"\n"}• Offline Access & Smart Alerts
              {"\n"}• Group Planning & Voting
              {"\n"}• Location-Based Intelligence
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}><Icon name="users" /> Who We Help</Text>
            <Text style={styles.para}>
              • Travelers: Personalized, smart planning tools.
              {"\n"}• Vendors: Direct access to potential customers.
              {"\n"}• Communities: Promote local culture and eco-tourism.
            </Text>
          </View>

          <View style={styles.cardAlt}>
            <Text style={styles.heading}><Icon name="chart-line" /> Future Vision</Text>
            <Text style={styles.para}>
              • AR Exploration Mode
              {"\n"}• Voice-Based Trip Management
              {"\n"}• Heatmap Optimization
              {"\n"}• Sustainability Insights
              {"\n"}• Global Eco & Culture Partnerships
            </Text>
          </View>
        </ScrollView>

        {showScrollTop && (
          <TouchableOpacity style={styles.scrollTopBtn} onPress={scrollToTop}>
            <Icon name="arrow-up" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topIcon: {
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#222',
  },
  scrollArea: {
    flex: 1,
  },
  sectionNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  navBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
  },
  navText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  cardAlt: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    flexDirection: 'row',
  },
  para: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  scrollTopBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 25,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default AboutTravelMatePage;
