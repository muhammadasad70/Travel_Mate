

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const events = [
  {
    title: 'Shandur Polo Festival',
    location: 'Chitral, Pakistan',
    date: 'July 5, 2025',
    type: 'Sports',
    tagColor: '#fbbc04',
    image: require('../../assets/sandu.jpg'),
  },
  {
    title: 'Lahore Literary Festival',
    location: 'Lahore, Pakistan',
    date: 'March 15, 2025',
    type: 'Literary',
    tagColor: '#b39ddb',
    image: require('../../assets/lahore_event.jpg'),
  },
  {
    title: 'Lok Mela',
    location: 'Islamabad, Pakistan',
    date: 'October 20, 2025',
    type: 'Cultural',
    tagColor: '#4fc3f7',
    image: require('../../assets/lok_mela.jpg'),
  },
  {
    title: 'Pakistan Fashion Week',
    location: 'Karachi, Pakistan',
    date: 'November 10, 2025',
    type: 'Fashion',
    tagColor: '#ef9a9a',
    image: require('../../assets/fashion.jpg'),
  },
];

const TopEvents = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const handlePress = (event) => {
    navigation.navigate('EventDetail', { event });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Top Events</Text>
      <View style={styles.wrapper}>
        <View style={[styles.grid, { justifyContent: isMobile ? 'center' : 'space-between' }]}>
          {events.map((event, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { width: isMobile ? '100%' : '48%' }]}
              onPress={() => handlePress(event)}
            >
              <Image source={event.image} style={styles.image} />
              <View style={styles.infoBox}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.location}>{event.location}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.date}>{event.date}</Text>
                  <Text style={[styles.tagText, { backgroundColor: event.tagColor }]}>
                    {event.type}
                  </Text>
                </View>
              </View>
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
    height: 140,
    resizeMode: 'cover',
  },
  infoBox: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    fontWeight: '500',
  },
});

export default TopEvents;
