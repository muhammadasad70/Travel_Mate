import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Offer_Cultural_Skill = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Web-only Back Arrow */}
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#111827" />
            <Text style={styles.backText}>Back to Dashboard</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.title}>Offer a Cultural Skill</Text>
        <Text style={styles.description}>
          Here you can offer your unique cultural skills to travelers. Whether it's traditional cooking, local arts, or storytelling, let people explore your culture.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skill Name: Traditional Pottery</Text>
          <Text style={styles.cardText}>Duration: 2 Hours</Text>
          <Text style={styles.cardText}>Location: Gilgit</Text>
          <Text style={styles.cardText}>Price: PKR 1500</Text>
          <Text style={styles.cardText}>Slots Available: 5</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skill Name: Folk Dance Lesson</Text>
          <Text style={styles.cardText}>Duration: 1.5 Hours</Text>
          <Text style={styles.cardText}>Location: Hunza</Text>
          <Text style={styles.cardText}>Price: PKR 1000</Text>
          <Text style={styles.cardText}>Slots Available: 8</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
});

export default Offer_Cultural_Skill;
