

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  ScrollView,
  Dimensions,
  BackHandler,
} from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isWeb = Platform.OS === 'web';

const ShareItineraryScreen = () => {
  const navigation = useNavigation();

  // ✅ Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('CrowdsourceItineraries');
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleShareWithCommunity = () => {
    if (Platform.OS === 'web') {
      window.alert('✅ Your itinerary has been shared with the TravelMate Community!');
    } else {
      Alert.alert('✅ Shared', 'Itinerary successfully shared with the community!');
    }
  };

  const handleShareOnSocial = (platform) => {
    const message = encodeURIComponent('📍 Check out my TravelMate itinerary!');
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${message}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${message}`;
        break;
      case 'instagram':
        url = `https://www.instagram.com/`;
        break;
      case 'google':
        url = `mailto:?subject=My TravelMate Itinerary&body=${message}`;
        break;
      default:
        return;
    }
    Linking.openURL(url).catch((err) => console.error('Linking error', err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Back Arrow for Web */}
      {isWeb && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CrowdsourceItineraries')}
          style={styles.backArrow}
        >
          <Ionicons name="arrow-back" size={26} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>📤 Share Your Itinerary</Text>

      <TouchableOpacity style={styles.communityCard} onPress={handleShareWithCommunity}>
        <Text style={styles.communityText}>🌍 Share with TravelMate Community</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or share on</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity onPress={() => handleShareOnSocial('facebook')}>
          <FontAwesome name="facebook-square" size={48} color="#1877f2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShareOnSocial('twitter')}>
          <FontAwesome name="twitter" size={48} color="#1da1f2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShareOnSocial('instagram')}>
          <FontAwesome name="instagram" size={48} color="#e1306c" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShareOnSocial('google')}>
          <Entypo name="mail" size={48} color="#4285f4" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 20,
    backgroundColor: '#f4f6fc',
    flexGrow: 1,
    alignItems: 'center',
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
  },
  communityCard: {
    backgroundColor: '#4caf50',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 32,
  },
  communityText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  orText: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    gap: 30,
    flexWrap: 'wrap',
  },
});

export default ShareItineraryScreen;


