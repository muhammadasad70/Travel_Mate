import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const accommodations = [
  {
    id: '1',
    name: 'Skardu Inn',
    location: 'Skardu',
    price: '$40 per night',
    rating: '⭐ 4.8',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/a7/cc/7c/panoramic-suite.jpg',
  },
  {
    id: '2',
    name: 'Hunza Valley Stay',
    location: 'Hunza',
    price: '$55 per night',
    rating: '⭐ 4.9',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/0c/96/43/caption.jpg',
  },
  {
    id: '3',
    name: 'Fairy Meadows Cabin',
    location: 'Fairy Meadows',
    price: '$65 per night',
    rating: '⭐ 5.0',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/a7/cc/7c/panoramic-suite.jpg',
  },
];

export default function AccommodationListingScreen() {
  const navigation = useNavigation();
  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>🏨 Book Accommodation</Text>

      <View style={styles.grid}>
        {accommodations.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('AccommodationDetailScreen', { accommodation: item })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoBox}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.meta}>
                {item.price} · {item.rating}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f9fc',
    flexGrow: 1,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#003366',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isTablet ? 'space-between' : 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    width: isTablet ? '48%' : '100%',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  infoBox: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#0077b6',
    fontWeight: '600',
  },
});
