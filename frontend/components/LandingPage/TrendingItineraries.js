

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const itineraries = [
  {
    title: 'Hunza Valley',
    author: 'Sarah M.',
    rating: '4.8',
    image: require('../../assets/hunza_2.jpg'),
  },
  {
    title: 'Skardu',
    author: 'Sarah M.',
    rating: '4.7',
    image: require('../../assets/skardu.jpg'),
  },
  {
    title: 'Fairy Meadows',
    author: 'Sarah M.',
    rating: '4.8',
    image: require('../../assets/fari_mados.jpg'),
  },
  {
    title: 'Swat Valley',
    author: 'Sarah M.',
    rating: '4.6',
    image: require('../../assets/swat.jpg'),
  },
  {
    title: 'Naran & Kaghan',
    author: 'Sarah M.',
    rating: '4.7',
    image: require('../../assets/naran_kagan.jpg'),
  },
  {
    title: 'Neelum Valley',
    author: 'Sarah M.',
    rating: '4.6',
    image: require('../../assets/nelam.jpg'),
  },
];

const TrendingItineraries = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const handlePress = (item) => {
    navigation.navigate('ItineraryDetail', { itinerary: item });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Trending Itineraries</Text>
      <View style={styles.wrapper}>
        <View style={[styles.grid, { justifyContent: isMobile ? 'center' : 'space-between' }]}>
          {itineraries.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                { width: isMobile ? '100%' : '48%' },
              ]}
              onPress={() => handlePress(item)}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>by {item.author}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wrapper: {
    maxWidth: 1000,
    width: '100%',
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginHorizontal: 10,
  },
  author: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 10,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 8,
    marginHorizontal: 10,
    color: '#ffa500',
  },
});

export default TrendingItineraries;
