import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const isMobile = Dimensions.get('window').width < 768;
const isWeb = Platform.OS === 'web';

const sampleItinerary = {
  title: 'Skardu Adventure',
  overview: 'A 5-day adventure through the valleys of Skardu exploring lakes, mountains, and culture.',
  budget: 'Mid-Range',
  style: ['Adventure', 'Cultural'],
  days: [
    { day: 1, place: 'Satpara Lake', time: '10:00 AM - 2:00 PM', activities: 'Boating, Lunch, Photography' },
    { day: 2, place: 'Shangrila Resort', time: '3:00 PM - 6:00 PM', activities: 'Sightseeing, Tea, Relaxation' }
  ],
  visibility: 'Public'
};

const weatherTips = [
  '🌧️ Carry a raincoat — light showers expected in Skardu.',
  '🧣 Nights are cold — pack warm layers!',
  '☀️ Sunscreen recommended for high altitude sunlight.'
];

const dummyEvents = [
  '🎉 Hunza Cultural Festival - Day 2, 5PM',
  '🎶 Music Night at Altit Fort - Day 3, 8PM'
];

const serviceTypes = ['Accommodation', 'Transport', 'Tour Guide', 'Cultural Exchange', 'Products'];
const dummyServices = {
  Accommodation: '🏨 Baltistan View Hotel',
  Transport: '🚌 Skardu Shuttle Service',
  'Tour Guide': '🧭 Local Guide: Rehmat Ali',
  'Cultural Exchange': '🧑‍🤝‍🧑 Handicraft Experience with Locals',
  Products: '🛍️ Traditional Hunza Cap'
};

const OptimizeItineraryScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Weather');
  const [selectedService, setSelectedService] = useState('Accommodation');
  const [showPreferences, setShowPreferences] = useState(false);
  const [weatherPrefs, setWeatherPrefs] = useState({
    noRain: false,
    mildTemp: false,
    noWind: false,
  });
  const navigation = useNavigation();

  const togglePref = (key) => {
    setWeatherPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>Optimize Your Itinerary</Text>
      <Text style={styles.subheading}>Get the most out of your trip with smart suggestions based on your itinerary.</Text>

      <View style={styles.itineraryBox}>
        <Text style={styles.itineraryTitle}>📍 {sampleItinerary.title}</Text>
        <Text style={styles.itineraryText}>{sampleItinerary.overview}</Text>
        <Text style={styles.itineraryLabel}>Budget:</Text>
        <Text style={styles.itineraryValue}>{sampleItinerary.budget}</Text>
        <Text style={styles.itineraryLabel}>Travel Style:</Text>
        <View style={styles.styleTags}>
          {sampleItinerary.style.map((tag, i) => (
            <Text key={i} style={styles.styleTag}>{tag}</Text>
          ))}
        </View>
        <Text style={styles.itineraryLabel}>Day-by-Day Plan:</Text>
        {sampleItinerary.days.map((day) => (
          <Text key={day.day} style={styles.itineraryDay}>
            Day {day.day}: {day.place} — {day.time}{"\n"}🗺 {day.activities}
          </Text>
        ))}
        <Text style={styles.itineraryLabel}>Visibility:</Text>
        <Text style={styles.public}>Public</Text>
      </View>

      <View style={styles.toggleGroup}>
        <TouchableOpacity style={[styles.toggleBtn, selectedTab === 'Weather' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => setSelectedTab('Weather')}>
          <Text style={[styles.toggleText, selectedTab === 'Weather' ? styles.activeText : styles.inactiveText]}>Weather-Based Suggestions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, selectedTab === 'Events' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => setSelectedTab('Events')}>
          <Text style={[styles.toggleText, selectedTab === 'Events' ? styles.activeText : styles.inactiveText]}>Event Recommendations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, selectedTab === 'Services' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => setSelectedTab('Services')}>
          <Text style={[styles.toggleText, selectedTab === 'Services' ? styles.activeText : styles.inactiveText]}>Services Nearby</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsBox}>
        {selectedTab === 'Weather' && (
          <>
            {weatherTips.map((tip, i) => (<Text key={i} style={styles.tip}>• {tip}</Text>))}
            <TouchableOpacity style={styles.integrateBtn}><Text style={styles.integrateText}>📥 Integrate into Itinerary</Text></TouchableOpacity>
          </>
        )}
        {selectedTab === 'Events' && (
          <>
            {dummyEvents.map((ev, i) => (<Text key={i} style={styles.tip}>• {ev}</Text>))}
            <TouchableOpacity style={styles.integrateBtn}><Text style={styles.integrateText}>📥 Integrate into Itinerary</Text></TouchableOpacity>
          </>
        )}
        {selectedTab === 'Services' && (
          <>
            <View style={styles.serviceTabs}>
              {serviceTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedService(type)}
                  style={[styles.serviceTab, selectedService === type && styles.serviceActive]}
                >
                  <Text style={{ color: selectedService === type ? '#fff' : '#333' }}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.tip}>• {dummyServices[selectedService]}</Text>
            <TouchableOpacity style={styles.integrateBtn}><Text style={styles.integrateText}>📥 Integrate into Itinerary</Text></TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.preferenceBox}>
        <TouchableOpacity onPress={() => setShowPreferences(!showPreferences)}>
          <Text style={styles.prefToggle}>
            {showPreferences ? '🔽 Hide Preferred Weather Settings' : '⚙️ Set Preferred Weather Settings'}
          </Text>
        </TouchableOpacity>

        {showPreferences && (
          <View style={styles.prefOptions}>
            <TouchableOpacity style={styles.prefItem} onPress={() => togglePref('noRain')}>
              <Text style={{ color: weatherPrefs.noRain ? '#007bff' : '#333' }}>
                {weatherPrefs.noRain ? '☑️' : '⬜️'} Avoid Rain
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.prefItem} onPress={() => togglePref('mildTemp')}>
              <Text style={{ color: weatherPrefs.mildTemp ? '#007bff' : '#333' }}>
                {weatherPrefs.mildTemp ? '☑️' : '⬜️'} Prefer Mild Temperatures
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.prefItem} onPress={() => togglePref('noWind')}>
              <Text style={{ color: weatherPrefs.noWind ? '#007bff' : '#333' }}>
                {weatherPrefs.noWind ? '☑️' : '⬜️'} No Strong Wind
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', position: 'relative' },
  backArrow: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 4, color: '#222', paddingTop: isWeb ? 50 : 0 },
  subheading: { fontSize: 14, marginBottom: 16, color: '#555' },
  itineraryBox: { padding: 16, backgroundColor: '#f8f9fa', borderRadius: 12, marginBottom: 16 },
  itineraryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  itineraryText: { fontSize: 14, marginBottom: 8 },
  itineraryLabel: { fontWeight: '600', marginTop: 8 },
  itineraryValue: { fontSize: 14, marginBottom: 4 },
  styleTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  styleTag: { backgroundColor: '#e2e6ea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 13, marginRight: 6, marginBottom: 6 },
  itineraryDay: { marginVertical: 4, fontSize: 13, lineHeight: 18 },
  public: { backgroundColor: '#d4edda', color: '#155724', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  toggleGroup: { flexDirection: 'row', justifyContent: isMobile ? 'center' : 'flex-start', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  toggleBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
  activeBtn: { backgroundColor: '#007bff', borderColor: '#007bff' },
  inactiveBtn: { backgroundColor: '#f0f0f0', borderColor: '#ccc' },
  toggleText: { fontSize: 13, fontWeight: '600' },
  activeText: { color: '#fff' },
  inactiveText: { color: '#333' },
  suggestionsBox: { padding: 16, backgroundColor: '#f1f3f5', borderRadius: 10 },
  tip: { fontSize: 14, marginBottom: 6, color: '#333' },
  integrateBtn: { marginTop: 12, backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'center', minWidth: 200, maxWidth: 300 },
  integrateText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  serviceTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  serviceTab: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#eee', borderRadius: 6 },
  serviceActive: { backgroundColor: '#007bff' },
  preferenceBox: { marginTop: 20, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 10 },
  prefToggle: { fontWeight: '600', fontSize: 14, color: '#007bff', marginBottom: 8 },
  prefOptions: { marginTop: 8, gap: 8 },
  prefItem: { paddingVertical: 6 }
});

export default OptimizeItineraryScreen;
