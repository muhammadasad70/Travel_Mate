import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  BackHandler,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;
const isWeb = Platform.OS === 'web';

const dummyAlerts = [
  { type: '🚨', title: 'Road Block Ahead', message: 'Main highway to Skardu is temporarily blocked due to landslide.' },
  { type: '⚠️', title: 'Weather Alert', message: 'Heavy rainfall expected in Hunza tonight. Avoid outdoor activities.' },
  { type: '🚧', title: 'Attraction Closed', message: 'Altit Fort is closed for renovation till Friday.' },
  { type: '🌡️', title: 'Heatwave Alert', message: 'High temperatures expected in Lahore. Stay hydrated.' },
  { type: '🚑', title: 'Emergency Nearby', message: 'Nearest hospital: Skardu Medical Center (1.5 km away).' },
  { type: '🚓', title: 'Police Alert', message: 'Avoid Saddar Bazaar area in Murree after 8 PM.' },
  { type: '🌪️', title: 'Windstorm Warning', message: 'Strong winds in Fairy Meadows. Camping not advised.' },
  { type: '📵', title: 'Signal Loss Zone', message: 'Low mobile signal area ahead near Deosai Plains.' },
  { type: '🏕️', title: 'Safe Shelter', message: 'Nearest shelter: Hilltop Lodge, 3km from your location.' },
  { type: '📍', title: 'Overcrowding Notice', message: 'Lake Saif-ul-Mulook is overcrowded. Try going early morning.' },
  { type: '🌧️', title: 'Rain Detected', message: 'It started raining in Neelum Valley. Carry waterproof gear.' },
  { type: '🛑', title: 'Bridge Maintenance', message: 'Temporary bridge to Chilas under repair. Use alternate route.' },
];

const RealTimeAlertsScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>📡 Real-Time Alerts</Text>
      <Text style={styles.subheading}>Stay updated with important alerts and notifications during your trip.</Text>

      {dummyAlerts.map((alert, index) => (
        <View key={index} style={styles.alertBox}>
          <Text style={styles.alertTitle}>{alert.type} {alert.title}</Text>
          <Text style={styles.alertMessage}>{alert.message}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: isWeb ? 70 : 16,
    backgroundColor: '#f9fafb',
    minHeight: '100%',
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1a1a1a',
  },
  subheading: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1c1c1e',
  },
  alertMessage: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  }
});

export default RealTimeAlertsScreen;
