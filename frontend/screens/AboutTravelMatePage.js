
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
// import { useNavigation } from '@react-navigation/native';

// const AboutTravelMatePage = () => {
//   const navigation = useNavigation();
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
//       {/* Sticky Header with Home and Join Us */}
//       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//         <Text style={styles.mainTitle}>About TravelMate</Text>

//         <View style={styles.sectionNav}>
//   {/* Home Button */}
//   <TouchableOpacity onPress={() => navigation.navigate('Landing Page')} style={styles.navBtn}>
//     <Icon name="home" size={16} />
//     <Text style={styles.navText}>Home</Text>
//   </TouchableOpacity>

//   {/* Join Us Button */}
//   <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')} style={styles.navBtn}>
//     <Icon name="user-plus" size={16} />
//     <Text style={styles.navText}>Join Us</Text>
//   </TouchableOpacity>

//   {/* Section Navigation Buttons */}
//   <TouchableOpacity onPress={() => scrollToSection(0)} style={styles.navBtn}>
//     <Icon name="globe" size={16} />
//     <Text style={styles.navText}>Mission</Text>
//   </TouchableOpacity>
//   <TouchableOpacity onPress={() => scrollToSection(300)} style={styles.navBtn}>
//     <Icon name="cogs" size={16} />
//     <Text style={styles.navText}>How It Works</Text>
//   </TouchableOpacity>
//   <TouchableOpacity onPress={() => scrollToSection(600)} style={styles.navBtn}>
//     <Icon name="rocket" size={16} />
//     <Text style={styles.navText}>Features</Text>
//   </TouchableOpacity>
//   <TouchableOpacity onPress={() => scrollToSection(900)} style={styles.navBtn}>
//     <Icon name="lightbulb" size={16} />
//     <Text style={styles.navText}>Why Us</Text>
//   </TouchableOpacity>
//   <TouchableOpacity onPress={() => scrollToSection(1200)} style={styles.navBtn}>
//     <Icon name="users" size={16} />
//     <Text style={styles.navText}>Who We Help</Text>
//   </TouchableOpacity>
//   <TouchableOpacity onPress={() => scrollToSection(1500)} style={styles.navBtn}>
//     <Icon name="chart-line" size={16} />
//     <Text style={styles.navText}>Vision</Text>
//   </TouchableOpacity>
// </View>


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
//               Our mission is to make travel smarter, deeply personalized, and truly human-centered —
//               built around real connections and meaningful experiences.
//             </Text>
//           </View>

//           <View style={styles.cardAlt}>
//             <Text style={styles.heading}><Icon name="cogs" /> How It Works</Text>
//             <Text style={styles.para}>
//               • Travelers or Vendors can register easily.
//               {"\n\n"}• Travelers explore and create itineraries, join groups,
//               and receive AI-based suggestions.
//               {"\n\n"}• Vendors offer services directly after verification.
//               {"\n\n"}• The platform supports offline access and real-time collaboration.
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
//               • Real-Time Personalization
//               {"\n"}• Crowdsourced Authenticity
//               {"\n"}• Multi-Role Collaboration
//               {"\n"}• Offline Access & Smart Alerts
//               {"\n"}• Group Planning & Voting
//               {"\n"}• Location-Based Intelligence
//             </Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.heading}><Icon name="users" /> Who We Help</Text>
//             <Text style={styles.para}>
//               • Travelers: Personalized, smart planning tools.
//               {"\n"}• Vendors: Direct access to potential customers.
//               {"\n"}• Communities: Promote local culture and eco-tourism.
//             </Text>
//           </View>

//           <View style={styles.cardAlt}>
//             <Text style={styles.heading}><Icon name="chart-line" /> Future Vision</Text>
//             <Text style={styles.para}>
//               • AR Exploration Mode
//               {"\n"}• Voice-Based Trip Management
//               {"\n"}• Heatmap Optimization
//               {"\n"}• Sustainability Insights
//               {"\n"}• Global Eco & Culture Partnerships
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
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//   },
//   topIcon: {
//     paddingHorizontal: 10,
//   },
//   container: {
//     flex: 1,
//     padding: 5,
//     paddingTop: 30,
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



// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   Image,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { useNavigation } from '@react-navigation/native';

// const AboutTravelMatePage = () => {
//   const navigation = useNavigation();
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scrollRef = useRef();
//   const windowHeight = Dimensions.get('window').height;
//   const { width } = useWindowDimensions();

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
//         <View style={styles.heroBanner}>
//           <Text style={styles.subHeading}>Let the Crowd Be Your Guide</Text>
//           <Text style={styles.mainHeading}>Empowering Travel with Real People and Real Places</Text>
//         </View>

//         <Text style={styles.pageTitle}>About TravelMate</Text>

//         <View style={styles.sectionNav}>
//           <TouchableOpacity onPress={() => navigation.navigate('Landing Page')} style={styles.navBtn}>
//             <Icon name="home" size={16} />
//             <Text style={styles.navText}>Home</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')} style={styles.navBtn}>
//             <Icon name="user-plus" size={16} />
//             <Text style={styles.navText}>Join Us</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => scrollToSection(0)} style={styles.navBtn}>
//             <Icon name="globe" size={16} />
//             <Text style={styles.navText}>Mission</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(400)} style={styles.navBtn}>
//             <Icon name="cogs" size={16} />
//             <Text style={styles.navText}>How It Works</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(800)} style={styles.navBtn}>
//             <Icon name="rocket" size={16} />
//             <Text style={styles.navText}>Features</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(1200)} style={styles.navBtn}>
//             <Icon name="heart" size={16} />
//             <Text style={styles.navText}>Why Us</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(1600)} style={styles.navBtn}>
//             <Icon name="users" size={16} />
//             <Text style={styles.navText}>Who We Help</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollToSection(2000)} style={styles.navBtn}>
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
//           <View style={styles.cardRow}>
//             <View style={styles.cardWide}>
//               <Text style={styles.sectionTitle}><Icon name="globe" /> Our Mission</Text>
//               <Text style={styles.para}>
//                 “To empower travelers with authentic, community-driven experiences by bridging <Text style={styles.bold}>real people, real places, and real-time insights</Text>.”
//               </Text>
//               <Text style={styles.para}>
//                 TravelMate aims to revolutionize travel. We move beyond generic itineraries and offer experiences that are:
//               </Text>
//               <Text style={styles.bullet}>• Crowdsourced</Text>
//               <Text style={styles.bullet}>• <Text style={styles.link}>AI-Based Personalization</Text></Text>
//               <Text style={styles.bullet}>• <Text style={styles.link}>Real-Time Updates</Text></Text>
//             </View>
//             <Image
//               source={{ uri: 'https://cdn-icons-png.flaticon.com/512/201/201623.png' }}
//               style={styles.illustration}
//               resizeMode="contain"
//             />
//           </View>

//           <View style={styles.cardYellow}>
//             <Text style={styles.sectionTitle}><Icon name="star" /> Key Features</Text>
//             <Text style={styles.bullet}>• Travelers or Vendors can register easily</Text>
//             <Text style={styles.bullet}>• Travelers explore and create itineraries</Text>
//             <Text style={styles.bullet}>• Vendors offer services after verification</Text>
//             <Text style={styles.bullet}>• Offline access and real-time suggestions</Text>
//           </View>

//           <View style={styles.cardPink}>
//             <Text style={styles.sectionTitle}><Icon name="heart" /> Why Us</Text>
//             <Text style={styles.para}>
//               We are committed to <Text style={styles.bold}>deeply personalized</Text> travel — built around real connections and meaningful experiences.
//             </Text>
//             <Text style={styles.bullet}>• Travel Planners</Text>
//             <Text style={styles.bullet}>• Adventurers</Text>
//             <Text style={styles.bullet}>• Service Providers</Text>
//           </View>

//           <View style={styles.cardAlt}>
//             <Text style={styles.sectionTitle}><Icon name="users" /> Who We Help</Text>
//             <Text style={styles.bullet}>• Travelers: Smart planning tools</Text>
//             <Text style={styles.bullet}>• Vendors: Reach real customers</Text>
//             <Text style={styles.bullet}>• Communities: Promote eco-tourism</Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}><Icon name="chart-line" /> Vision</Text>
//             <Text style={styles.bullet}>• AR Exploration Mode</Text>
//             <Text style={styles.bullet}>• Voice-Based Trip Management</Text>
//             <Text style={styles.bullet}>• Heatmap Optimization</Text>
//             <Text style={styles.bullet}>• Sustainability Insights</Text>
//           </View>

//           <View style={styles.finalCTA}>
//             <Text style={styles.ctaText}>Ready to Plan Smarter? <Text style={styles.link}>Join Us Today!</Text></Text>
//             <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('RoleSelection')}>
//               <Text style={styles.ctaButtonText}>Join Now</Text>
//             </TouchableOpacity>
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
//     backgroundColor: '#f5f8fa',
//   },
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     paddingHorizontal: 12,
//   },
//   heroBanner: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   subHeading: {
//     fontSize: 16,
//     color: '#0077b6',
//   },
//   mainHeading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#023e8a',
//     textAlign: 'center',
//     paddingHorizontal: 12,
//     marginTop: 5,
//   },
//   pageTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   sectionNav: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   navBtn: {
//     backgroundColor: '#fff',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     margin: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   navText: {
//     marginLeft: 6,
//   },
//   scrollArea: {
//     flex: 1,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 16,
//   },
//   cardAlt: {
//     backgroundColor: '#f1f1f1',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 16,
//   },
//   cardYellow: {
//     backgroundColor: '#fff3cd',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 16,
//   },
//   cardPink: {
//     backgroundColor: '#fde2e4',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   para: {
//     fontSize: 15,
//     color: '#444',
//     marginBottom: 8,
//   },
//   bullet: {
//     fontSize: 15,
//     color: '#333',
//     marginBottom: 6,
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
//   link: {
//     color: '#0077b6',
//     fontWeight: '600',
//   },
//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     marginBottom: 16,
//   },
//   cardWide: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     marginRight: 10,
//   },
//   illustration: {
//     width: 120,
//     height: 120,
//     marginRight: 8,
//     marginTop: 10,
//   },
//   finalCTA: {
//     alignItems: 'center',
//     paddingVertical: 30,
//   },
//   ctaText: {
//     fontSize: 17,
//     fontWeight: '500',
//   },
//   ctaButton: {
//     backgroundColor: '#00b4d8',
//     paddingVertical: 10,
//     paddingHorizontal: 24,
//     borderRadius: 25,
//     marginTop: 12,
//   },
//   ctaButtonText: {
//     color: '#fff',
//     fontWeight: '700',
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


// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   Image
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { useNavigation } from '@react-navigation/native';

// const AboutTravelMatePage = () => {
//   const navigation = useNavigation();
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

//   return (
//     <View style={styles.pageWrapper}>
//       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//         <Text style={styles.subHeader}>Let the Crowd Be Your Guide</Text>
//         <Text style={styles.mainTitle}>Empowering Travel with Real People and Real Places</Text>

//         <View style={styles.sectionNav}>
//           <TouchableOpacity onPress={() => navigation.navigate('Landing Page')} style={styles.navBtn}>
//             <Icon name="home" size={16} />
//             <Text style={styles.navText}>Home</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')} style={styles.navBtn}>
//             <Icon name="user-plus" size={16} />
//             <Text style={styles.navText}>Join Us</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollRef.current.scrollTo({ y: 0, animated: true })} style={styles.navBtn}>
//             <Icon name="globe" size={16} />
//             <Text style={styles.navText}>Mission</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollRef.current.scrollTo({ y: 500, animated: true })} style={styles.navBtn}>
//             <Icon name="cogs" size={16} />
//             <Text style={styles.navText}>How It Works</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollRef.current.scrollTo({ y: 1000, animated: true })} style={styles.navBtn}>
//             <Icon name="rocket" size={16} />
//             <Text style={styles.navText}>Features</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollRef.current.scrollTo({ y: 1500, animated: true })} style={styles.navBtn}>
//             <Icon name="heart" size={16} />
//             <Text style={styles.navText}>Why Us</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollRef.current.scrollTo({ y: 2000, animated: true })} style={styles.navBtn}>
//             <Icon name="users" size={16} />
//             <Text style={styles.navText}>Who We Help</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => scrollRef.current.scrollToEnd({ animated: true })} style={styles.navBtn}>
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
//           <View style={styles.cardRowSingle}>
//             <View style={styles.cardLeft}>
//               <Text style={styles.heading}><Icon name="globe" /> Our Mission</Text>
//               <Text style={styles.para}>
//                 “To empower travelers with authentic, community-driven experiences by bridging real people, real places, and real-time insights.”
//                 {"\n\n"}
//                 TravelMate aims to revolutionize travel. We move beyond generic itineraries and offer experiences that are:
//                 {"\n\n"} • Crowdsourced
//                 {"\n"} • <Text style={styles.link}>AI-Based Personalization</Text>
//                 {"\n"} • <Text style={styles.link}>Real-Time Updates</Text>
//               </Text>
//             </View>
//             <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/201/201623.png' }} style={styles.imageIcon} />
//           </View>

//           <View style={styles.cardRowSplit}>
//             <View style={[styles.cardColumn, { backgroundColor: '#fffbe6' }]}>
//               <Text style={styles.heading}><Icon name="star" /> Key Features</Text>
//               <Text style={styles.para}>
//                 • Travelers or Vendors can register easily
//                 {"\n"} • Travelers explore and create itineraries
//                 {"\n"} • Vendors offer services after verification
//                 {"\n"} • Offline access and real-time suggestions
//               </Text>
//             </View>
//             <View style={[styles.cardColumn, { backgroundColor: '#ffeef0' }]}>
//               <Text style={styles.heading}><Icon name="heart" /> Why Us</Text>
//               <Text style={styles.para}>
//                 We are committed to <Text style={{ fontWeight: 'bold' }}>deeply personalized</Text> travel — built around real connections and meaningful experiences.
//                 {"\n\n"} • Travel Planners
//                 {"\n"} • Adventurers
//                 {"\n"} • Service Providers
//               </Text>
//             </View>
//           </View>

//           <View style={styles.cardRowSplit}>
//             <View style={[styles.cardColumn, { backgroundColor: '#e6f7ff' }]}>
//               <Text style={styles.heading}><Icon name="users" /> Who We Help</Text>
//               <Text style={styles.para}>
//                 • Travelers: Personalized, smart planning tools
//                 {"\n"} • Vendors: Direct access to customers
//                 {"\n"} • Communities: Promote eco-tourism
//               </Text>
//             </View>
//             <View style={[styles.cardColumn, { backgroundColor: '#e8f5e9' }]}>
//               <Text style={styles.heading}><Icon name="lightbulb" /> How We're Different</Text>
//               <Text style={styles.para}>
//                 • Real-Time Personalization
//                 {"\n"} • Crowdsourced Authenticity
//                 {"\n"} • Multi-Role Collaboration
//                 {"\n"} • Smart Alerts & Heatmaps
//               </Text>
//             </View>
//           </View>

//           <View style={styles.cardRowSingle}>
//             <View style={styles.cardLeft}>
//               <Text style={styles.heading}><Icon name="chart-line" /> Our Vision</Text>
//               <Text style={styles.para}>
//                 • Augmented Reality Exploration
//                 {"\n"} • Voice-Based Trip Assistant
//                 {"\n"} • Global Culture Partnerships
//                 {"\n"} • Sustainability Insights
//               </Text>
//             </View>
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
//     padding: 12,
//     paddingTop: 40,
//   },
//   scrollArea: {
//     flex: 1,
//   },
//   subHeader: {
//     textAlign: 'center',
//     color: '#007bff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   mainTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 15,
//     color: '#002244',
//   },
//   sectionNav: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     gap: 10,
//     marginBottom: 20,
//   },
//   navBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     margin: 4,
//   },
//   navText: {
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   cardRowSingle: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     backgroundColor: '#fff',
//     margin: 10,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   cardLeft: {
//     flex: 1,
//     paddingRight: 10,
//   },
//   imageIcon: {
//     width: 80,
//     height: 80,
//     resizeMode: 'contain',
//   },
//   cardRowSplit: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     margin: 10,
//   },
//   cardColumn: {
//     flex: 1,
//     margin: 5,
//     padding: 15,
//     borderRadius: 10,
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   para: {
//     fontSize: 15,
//     lineHeight: 22,
//   },
//   link: {
//     color: '#007bff',
//     textDecorationLine: 'underline',
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


// AboutTravelMatePage.js

// AboutTravelMatePage.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const AboutTravelMatePage = () => {
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const windowHeight = Dimensions.get('window').height;
  const [sections] = useState([]);

  const scrollTo = (id) => {
    const yPositions = {
      mission: 0,
      how: windowHeight * 0.6,
      features: windowHeight * 1.2,
      why: windowHeight * 1.6,
      who: windowHeight * 2.0,
      vision: windowHeight * 2.4,
    };
    scrollViewRef.current.scrollTo({ y: yPositions[id], animated: true });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.stickyHeader}>
        <Text style={styles.topText}>Let the Crowd Be Your Guide</Text>
        <Text style={styles.heroText}>Empowering Travel with Real People and Real Places</Text>
        <Text style={styles.heading}>About TravelMate</Text>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Landing Page')} style={styles.navBtn}><Icon name="home" /><Text> Home</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')} style={styles.navBtn}><Icon name="user-plus" /><Text> Join Us</Text></TouchableOpacity>
          {sections.map((sec) => (
            <TouchableOpacity key={sec.id} onPress={() => scrollTo(sec.id)} style={styles.navBtn}>
              <Icon name="dot-circle" /><Text> {sec.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Icon name="globe" /> Our Mission</Text>
          <Text style={styles.paragraph}>
            "To empower travelers with authentic, community-driven experiences by bridging real people, real places, and real-time insights."
            {'\n'}TravelMate aims to revolutionize travel. We move beyond generic itineraries and offer experiences that are:
          </Text>
          <Text style={styles.bullet}>• Crowdsourced{''}• <Text style={styles.link} onPress={() => Linking.openURL('https://example.com')}>AI-Based Personalization</Text>{''}• <Text style={styles.link} onPress={() => Linking.openURL('https://example.com')}>Real-Time Updates</Text></Text>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/201/201623.png' }} style={styles.image} />
        </View>

        <View style={styles.rowCardWrapper}>
          <View style={[styles.card, { backgroundColor: '#FFF9C4' }]}> 
            <Text style={styles.sectionTitle}><Icon name="star" /> Key Features</Text>
            <Text style={styles.bullet}>• Travelers or Vendors can register easily{''}• Explore and create itineraries{''}• Vendor service verification{''}• Offline access and smart suggestions</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#FFEBEE' }]}>
            <Text style={styles.sectionTitle}><Icon name="heart" /> Why Us</Text>
            <Text style={styles.paragraph}>
              We are committed to <Text style={{ fontWeight: 'bold' }}>deeply personalized</Text> travel — built around real connections and meaningful experiences.
            </Text>
            <Text style={styles.bullet}>• Travel Planners{''}• Adventurers{''}• Service Providers</Text>
          </View>
        </View>

        <View style={styles.rowCardWrapper}>
          <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}> 
            <Text style={styles.sectionTitle}><Icon name="users" /> Who We Help</Text>
            <Text style={styles.bullet}>• Travelers: Planning tools{''}• Vendors: Market reach{''}• Communities: Promote eco-tourism</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}> 
            <Text style={styles.sectionTitle}><Icon name="lightbulb" /> How We're Different</Text>
            <Text style={styles.bullet}>• Real-Time Personalization{''}• Crowdsourced Authenticity{''}• Multi-Role Collaboration{''}• Smart Alerts & Heatmaps</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Icon name="chart-line" /> Vision</Text>
          <Text style={styles.paragraph}>
            Our vision is to create a future where every journey is informed, enriched, and enhanced by the wisdom of the crowd — blending AI, authenticity, and adventure.
          </Text>
        </View>
        <View style={styles.ctaSection}>
          <Text style={styles.ctaText}>Ready to Plan Smarter? <Text style={{ color: '#00bfff' }}>Join Us Today!</Text></Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('RoleSelection')}>
            <Text style={styles.ctaBtnText}>Join Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fafafa' },
  stickyHeader: {
    backgroundColor: '#E3F2FD',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    position: 'sticky', 
    top: 0,
    zIndex: 100,
  },
  topText: { color: '#007BFF', fontSize: 14 },
  heroText: { fontSize: 20, fontWeight: 'bold', color: '#004080', marginTop: 5, textAlign: 'center' },
  heading: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  navBar: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 15,
  },
  navBtn: {
    backgroundColor: '#fff', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12,
    borderColor: '#ccc', borderWidth: 1, margin: 5, flexDirection: 'row', alignItems: 'center'
  },
  scrollView: { flex: 1 },
  section: { padding: 20, backgroundColor: '#fff', borderRadius: 10, margin: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  paragraph: { fontSize: 16, lineHeight: 24, color: '#444' },
  bullet: { fontSize: 15, lineHeight: 22, color: '#444' },
  rowCardWrapper: {
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, gap: 10,
    flexWrap: 'wrap', marginBottom: 20
  },
  card: {
    flex: 1,
    minWidth: 160,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginTop: 10,
  },
  ctaSection: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  ctaText: { fontSize: 18, fontWeight: '500' },
  ctaBtn: {
    backgroundColor: '#00bfff', paddingVertical: 12, paddingHorizontal: 30,
    borderRadius: 25, marginTop: 15,
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#007bff' },
  image: {
    width: 60, height: 60, alignSelf: 'flex-end', marginTop: 10,
    resizeMode: 'contain'
  },
});

export default AboutTravelMatePage;
