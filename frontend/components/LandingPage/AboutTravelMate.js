
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AboutTravelMate = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const navigation = useNavigation();

  return (
    <View style={styles.outerWrapper}>
      <ImageBackground
        source={require('../../assets/welcome.jpg')}
        style={[styles.background, { height: isMobile ? 220 : 280 }]}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={[styles.heading, { fontSize: isMobile ? 20 : 24 }]}>
            What is TravelMate?
          </Text>
          <Text style={[styles.subtext, { fontSize: isMobile ? 14 : 15 }]}>
            TravelMate helps travelers explore Pakistan like locals—by sharing and discovering
            real itineraries created by the community. Our goal is simple: Let the crowd be your guide.
            Plan smarter, experience more, and connect with real people.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AboutTravelMatePage')}
          >
            <Text style={styles.buttonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: '#F7F7F7',
  },
  background: {
    width: '100%',
    maxWidth: 1000,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    color: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#00c9a7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AboutTravelMate;
