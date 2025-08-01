
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
