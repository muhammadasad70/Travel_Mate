
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const stories = [
  {
    title: 'Learn Pottery in Multan',
    button: 'Discover More Cultural Stories',
    icon: require('../../assets/pottery_1.jpg'),
  },
  {
    title: 'Explore Calligraphy in Lahore',
    button: 'Uncover Artistic Heritage',
    icon: require('../../assets/calligraphy.jpg'),
  },
];

const CulturalExchange = () => {
  const navigation = useNavigation();

  const handlePress = (story) => {
    navigation.navigate('CulturalDetail', { story });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Cultural Exchange</Text>
      <View style={styles.wrapper}>
        <View style={styles.grid}>
          {stories.map((story, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handlePress(story)}
            >
              <Image source={story.icon} style={styles.image} />
              <View style={styles.content}>
                <Text style={styles.title}>{story.title}</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>{story.button}</Text>
                </TouchableOpacity>
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
    maxWidth: 1000,
    width: '100%',
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fcfcfc',
    borderRadius: 14,
    marginBottom: 20,
    overflow: 'hidden', // 👈 ensures rounded image corners show
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160, // 👈 taller image for better clarity
    resizeMode: 'cover',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  content: {
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default CulturalExchange;
