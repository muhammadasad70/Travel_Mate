import React, { useEffect } from 'react';
import { generateItineraryPDF } from '../../utils/generatePDF';
import {
  Alert,
  Platform,
  BackHandler,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Feather, Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;
const isWeb = Platform.OS === 'web';
const savedCount = 5;

const sampleItinerary = {
  title: 'Skardu Adventure',
  overview: 'An epic trip through the valleys of Skardu',
  budget: 'Mid-Range',
  style: 'Adventure',
  days: [
    { place: 'Skardu City', time: '9AM', activities: 'Visit Kharpocho Fort' },
    { place: 'Shigar Valley', time: '11AM', activities: 'Explore Shigar Fort' },
  ],
  images: ['https://example.com/skardu1.jpg', 'https://example.com/skardu2.jpg'],
};

const cards = [
  {
    title: 'Create Itinerary',
    subtitle: 'Start a new travel plan',
    icon: <Feather name="plus-circle" size={30} color="#333" />,
    color: '#dceeff',
  },
  {
    title: 'Update Itinerary',
    subtitle: 'Revise based on feedback',
    icon: <Entypo name="cycle" size={30} color="#333" />,
    color: '#ffeef1',
  },
  !isWeb && {
    title: 'Save as PDF',
    subtitle: 'Download your itinerary',
    icon: <Feather name="download" size={30} color="#333" />,
    color: '#e3f2fd',
  },
  {
    title: 'Manage My Itineraries',
    subtitle: 'Access itineraries you’ve bookmarked',
    icon: <Feather name="folder" size={30} color="#333" />,
    color: '#fff8dc',
    badge: savedCount,
  },
  {
    title: 'Optimize Your Itinerary',
    subtitle: 'Discover personalized suggestions based on your travel plan',
    icon: <Entypo name="cycle" size={30} color="#333" />,
    color: '#f5ffee',
  },
  
].filter(Boolean);

const CrowdsourceItinerariesScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('TravelerDashboard');
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleCardPress = async (title) => {
    if (title === 'Create Itinerary') {
      navigation.navigate('CreateItinerary');
    } else if (title === 'Edit Itinerary') {
      navigation.navigate('EditItinerary', {
        itineraryData: {
          title: 'Hunza Trip',
          overview: 'A scenic 3-day journey through Hunza...',
          budget: 'Mid-Range',
          style: 'Adventure',
          visibility: 'public',
          days: [{ place: 'Karimabad', time: '10AM', activities: 'Sightseeing' }],
          images: [],
        },
      });
    } else if (title === 'Update Itinerary') {
      navigation.navigate('UpdateItineraryScreen', {
        itineraryId: 'skardu123',
        mode: 'update',
      });
    } else if (title === 'Save as PDF') {
      await generateItineraryPDF(sampleItinerary, navigation);
    } else if (title === 'Share Itinerary') {
      navigation.navigate('ShareItinerary');
    } else if (title === 'Manage My Itineraries') {
      navigation.navigate('ViewSavedItineraries');
    }else if (title === 'Optimize Your Itinerary') {
      navigation.navigate('OptimizeItinerary'); // ✅ must match the name in App.jsa
    }
  };

  const handleKeepOriginal = () => {
    if (Platform.OS === 'web') {
      window.alert('✅ Kept as Original\nYou can view this itinerary from "View Saved Itineraries".');
    } else {
      Alert.alert(
        '✅ Kept as Original',
        'You can view this itinerary from "View Saved Itineraries".',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCustomize = () => {
    navigation.navigate('UpdateItineraryScreen', {
      itineraryId: 'skardu123',
      mode: 'update',
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Back Arrow (Web Only) */}
      {isWeb && (
        <TouchableOpacity
          onPress={() => navigation.navigate('TravelerDashboard')}
          style={styles.backArrow}
        >
          <Ionicons name="arrow-back" size={26} color="#007bff" />
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {cards.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => handleCardPress(item.title)}
            activeOpacity={0.85}
          >
            <View style={styles.iconRow}>
              {item.icon}
              {item.badge !== undefined && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>🔖 {item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}

        <View style={[styles.card, styles.feedbackCard]}>
          <Text style={styles.feedbackHeader}>🗣️ Feedback on Your Itinerary</Text>
          <Text style={styles.feedbackTitle}>Skardu Adventure</Text>
          <Text style={styles.feedbackStats}>
            👁 120 Views    ⭐ 4.8 Rating    💬 4 Comments
          </Text>
          <Text style={styles.feedbackPrompt}>
            This itinerary received community feedback. Would you like to:
          </Text>
          {/* <View style={styles.feedbackBtns}>
            <TouchableOpacity style={styles.keepBtn} onPress={handleKeepOriginal}>
              <Text style={styles.keepText}>✅ Keep Original</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.customizeBtn} onPress={handleCustomize}>
              <Text style={styles.customizeText}>✍️ Customize Itinerary</Text>
            </TouchableOpacity> */}
          {/* </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'center' : 'flex-start',
    padding: 16,
    gap: 16,
    paddingTop: isWeb ? 50 : 16, // ✅ Space for back button
  },
  backArrow: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 999,
    padding: 6,
  },
  card: {
    width: isMobile ? '90%' : '45%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    backgroundColor: '#fce4ec',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c2185b',
  },
  title: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    color: '#555',
  },
  feedbackCard: {
    backgroundColor: '#f6f0ff',
    borderColor: '#d8c8ff',
    width: '100%',
    marginTop: 12,
  },
  feedbackHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#4a148c',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  feedbackStats: {
    fontSize: 13,
    marginBottom: 8,
    color: '#444',
  },
  feedbackPrompt: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  feedbackBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 6,
  },
  keepBtn: {
    padding: 10,
    backgroundColor: '#d4edda',
    borderRadius: 6,
  },
  customizeBtn: {
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 6,
  },
  keepText: {
    color: '#155724',
    fontWeight: '600',
  },
  customizeText: {
    color: '#856404',
    fontWeight: '600',
  },
});

export default CrowdsourceItinerariesScreen;
