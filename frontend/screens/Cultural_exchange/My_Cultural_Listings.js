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
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const My_Cultural_Listings = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with Back Button (Web Only) */}
        {Platform.OS === 'web' && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={22} color="#111" />
            </TouchableOpacity>
            <Text style={styles.headerText}>My Cultural Listings</Text>
          </View>
        )}

        {/* Dummy Content */}
        <View style={styles.content}>
          <Text style={styles.label}>📝 You currently have 2 cultural listings:</Text>

          <View style={styles.listingBox}>
            <Text style={styles.listingTitle}>🎨 Hunza Pottery Workshop</Text>
            <Text style={styles.description}>Hands-on session to learn and create traditional pottery.</Text>
          </View>

          <View style={styles.listingBox}>
            <Text style={styles.listingTitle}>🧵 Phulkari Embroidery Experience</Text>
            <Text style={styles.description}>Showcase of Punjabi embroidery with storytelling and try-it-yourself setup.</Text>
          </View>

          <Text style={styles.tip}>🔔 Add more cultural listings from your vendor dashboard.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  content: {
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  listingBox: {
    backgroundColor: '#FFF7ED',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#374151',
  },
  tip: {
    marginTop: 16,
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});

export default My_Cultural_Listings;
