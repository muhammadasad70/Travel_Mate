import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const dummyTravelerSkills = [
  { 
    id: '1', 
    name: 'Ali Raza', 
    skill: 'Photography Guide', 
    location: 'Lahore',
    rating: 5, 
    experience: 'Professional photographer with 5 years experience in travel photography. Specializes in cultural and landscape photography.',
    price: 'PKR 2000 per session'
  },
  { 
    id: '2', 
    name: 'Sara Khan', 
    skill: 'Local Food Expert', 
    location: 'Karachi',
    rating: 4, 
    experience: 'Food blogger and local cuisine expert. Knows all the hidden gems and authentic street food spots in Karachi.',
    price: 'PKR 1500 per tour'
  },
];

const Traveler_Feedback = ({ navigation, onBackToServices }) => {
  // If onBackToServices is provided, we're in dashboard mode (no header/bottom nav)
  const isInDashboard = !!onBackToServices;
  
  if (isInDashboard) {
    return (
      <View style={[styles.container, { paddingTop: 0 }]}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="people-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Available Traveler Skills</Text>
        </View>
        <Text style={styles.subtitle}>Connect with travelers who offer their skills and expertise</Text>
        
        <FlatList
          data={dummyTravelerSkills}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </View>
              <Text style={styles.skillTitle}>{item.skill}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text style={styles.experience}>{item.experience}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Traveler</Text>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  // Standalone mode with header and bottom nav
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <VendorHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="people-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Available Traveler Skills</Text>
        </View>
        <Text style={styles.subtitle}>Connect with travelers who offer their skills and expertise</Text>
        
        <FlatList
          data={dummyTravelerSkills}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </View>
              <Text style={styles.skillTitle}>{item.skill}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text style={styles.experience}>{item.experience}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Traveler</Text>
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
        />
      </ScrollView>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Add top padding for fixed header on web
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontWeight: '700',
    fontSize: 18,
    color: '#111827',
  },
  rating: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
  },
  skillTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  experience: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 140,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Traveler_Feedback;
