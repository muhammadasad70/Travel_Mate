
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

const travelers = [
  {
    name: 'Sarah M.',
    role: 'Local Expert',
    roleColor: '#28a745',
    contributions: 'Shared 25 itineraries',
    image: require('../../assets/boy_2.jpg'),
  },
  {
    name: 'James T.',
    role: 'Top Reviewer',
    roleColor: '#ff9800',
    contributions: '95 contributions',
    image: require('../../assets/boy_3.jpg'),
  },
  {
    name: 'Emma R.',
    role: 'Cultural Explorer',
    roleColor: '#42a5f5',
    contributions: '12 contributions',
    image: require('../../assets/boy_2.jpg'),
  },
];

const TopTravelers = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const handlePress = (traveler) => {
    navigation.navigate('TravelerDetail', { traveler });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Top Travelers</Text>
      <View style={styles.wrapper}>
        <View style={[styles.grid, { justifyContent: isMobile ? 'center' : 'space-between' }]}>
          {travelers.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { width: isMobile ? '100%' : '30%' }]}
              onPress={() => handlePress(item)}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.role, { backgroundColor: item.roleColor }]}>
                {item.role}
              </Text>
              <Text style={styles.contributions}>{item.contributions}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wrapper: {
    width: '100%',
    maxWidth: 1000,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    marginHorizontal: 6,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  role: {
    color: '#fff',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '500',
    marginBottom: 6,
  },
  contributions: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});

export default TopTravelers;
