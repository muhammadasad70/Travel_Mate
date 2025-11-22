import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');

const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

const CITIES = [
  'Abbottabad', 'Galiyat', 'Bagh', 'Chitral', 'Dir', 'Kumrat', 'Gilgit',
  'Haveli', 'Hunza Valley', 'Islamabad', 'Karachi', 'Kotli', 'Lahore',
  'Multan', 'Muzaffarabad', 'Nagar Valley', 'Nagarparkar', 'Naran & Kaghan',
  'Neelum Valley', 'Rawalakot', 'Skardu', 'Swat Valley', 'Murree'
];

const BUDGETS = ['Budget-friendly', 'Mid-range', 'Luxury'];
const STYLES = ['Adventure', 'Cultural', 'Comfort'];
const INTERESTS = ['Hiking', 'Food', 'Photography', 'History', 'Nature', 'Shopping'];

// Weather icon mapper
const getWeatherIcon = (condition) => {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
  };
  return icons[condition] || '🌤️';
};

export default function WeatherAwareRecommendationsScreen() {
  const navigation = useNavigation();
  const [view, setView] = useState('form');
  
  // Form state
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(5);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [weatherEnabled, setWeatherEnabled] = useState(true);

  // Data state
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);

  // Fetch weather when city changes
  useEffect(() => {
    if (weatherEnabled && selectedCity) {
      fetchWeather();
    } else {
      setWeatherForecast(null);
    }
  }, [selectedCity, weatherEnabled]);

  const fetchWeather = async () => {
    try {
      setWeatherLoading(true);
      const token = await getAuthToken();
      
      const response = await fetch(
        `${API_BASE}/weather/forecast?city=${encodeURIComponent(selectedCity)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWeatherForecast(data.forecast);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const incrementDays = () => setNumberOfDays(prev => Math.min(14, prev + 1));
  const decrementDays = () => setNumberOfDays(prev => Math.max(1, prev - 1));

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const generateRecommendations = async () => {
    if (!selectedCity || !selectedBudget || !selectedStyle || selectedInterests.length === 0) {
      setError('Please fill in all fields: city, budget, travel style, duration, and at least one interest');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const durationString = numberOfDays === 1 ? '1 day' : `${numberOfDays} days`;
      
      const endpoint = weatherEnabled 
        ? '/recommendations/generate-weather-aware'
        : '/recommendations/generate';

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferred_cities: [selectedCity],
          preferred_budget: selectedBudget,
          preferred_style: selectedStyle,
          trip_duration: durationString,
          interests: selectedInterests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations || []);
        if (data.weather_forecast) {
          setWeatherForecast(data.weather_forecast);
        }
        setView('results');
      } else {
        setError(data.error || 'Failed to generate recommendations');
      }
    } catch (err) {
      setError('Network error. Check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  const saveItinerary = async (rec, index) => {
    setSaving(index);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE}/recommendations/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rec),
      });

      if (response.ok) {
        Alert.alert('Success!', 'Weather-smart itinerary saved successfully');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'Failed to save itinerary');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Check your connection.');
    } finally {
      setSaving(null);
    }
  };

  // FORM VIEW
  if (view === 'form') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weather-Smart Planner</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
          {/* Weather Toggle */}
          <View style={styles.weatherToggleCard}>
            <View style={styles.weatherToggleLeft}>
              <Ionicons name="partly-sunny" size={24} color="#8b5cf6" />
              <View style={{ flex: 1 }}>
                <Text style={styles.weatherToggleTitle}>Weather-Aware Planning</Text>
                <Text style={styles.weatherToggleSubtitle}>
                  AI will adapt activities based on forecast
                </Text>
              </View>
            </View>
            <Switch
              value={weatherEnabled}
              onValueChange={setWeatherEnabled}
              trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
              thumbColor={weatherEnabled ? '#8b5cf6' : '#f3f4f6'}
            />
          </View>

          {/* Weather Forecast Preview */}
          {weatherEnabled && weatherForecast && !weatherLoading && (
            <View style={styles.weatherCard}>
              <Text style={styles.weatherTitle}>📍 {weatherForecast.city} Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weatherScroll}>
                {weatherForecast.forecasts.slice(0, 5).map((day, index) => (
                  <View key={index} style={styles.weatherDay}>
                    <Text style={styles.weatherDate}>
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={styles.weatherIcon}>{getWeatherIcon(day.condition)}</Text>
                    <Text style={styles.weatherCondition}>{day.condition}</Text>
                    <Text style={styles.weatherTemp}>
                      {Math.round(day.temp_max)}°/{Math.round(day.temp_min)}°
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {weatherEnabled && weatherLoading && (
            <View style={styles.weatherLoadingCard}>
              <ActivityIndicator size="small" color="#8b5cf6" />
              <Text style={styles.weatherLoadingText}>Fetching weather forecast...</Text>
            </View>
          )}

          {/* City Selection */}
          <Text style={styles.sectionTitle}>Where do you want to go? *</Text>
          <Text style={styles.sectionSubtitle}>Select one city</Text>
          <View style={styles.chipContainer}>
            {CITIES.map(city => (
              <TouchableOpacity
                key={city}
                style={[styles.chip, selectedCity === city && styles.chipSelected]}
                onPress={() => setSelectedCity(city)}
              >
                <Text style={[styles.chipText, selectedCity === city && styles.chipTextSelected]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Budget */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Budget *</Text>
          <View style={styles.chipContainer}>
            {BUDGETS.map(budget => (
              <TouchableOpacity
                key={budget}
                style={[styles.chip, selectedBudget === budget && styles.chipSelected]}
                onPress={() => setSelectedBudget(budget)}
              >
                <Text style={[styles.chipText, selectedBudget === budget && styles.chipTextSelected]}>
                  {budget}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Travel Style */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Travel Style *</Text>
          <View style={styles.chipContainer}>
            {STYLES.map(style => (
              <TouchableOpacity
                key={style}
                style={[styles.chip, selectedStyle === style && styles.chipSelected]}
                onPress={() => setSelectedStyle(style)}
              >
                <Text style={[styles.chipText, selectedStyle === style && styles.chipTextSelected]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Duration */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trip Duration *</Text>
          <View style={styles.daysInputContainer}>
            <TouchableOpacity style={styles.daysButton} onPress={decrementDays} disabled={numberOfDays <= 1}>
              <Ionicons name="chevron-down" size={24} color={numberOfDays <= 1 ? '#d1d5db' : '#8b5cf6'} />
            </TouchableOpacity>
            <View style={styles.daysDisplayContainer}>
              <Text style={styles.daysNumber}>{numberOfDays}</Text>
              <Text style={styles.daysLabel}>{numberOfDays === 1 ? 'day' : 'days'}</Text>
            </View>
            <TouchableOpacity style={styles.daysButton} onPress={incrementDays}>
              <Ionicons name="chevron-up" size={24} color="#8b5cf6" />
            </TouchableOpacity>
          </View>

          {/* Interests */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Interests *</Text>
          <View style={styles.chipContainer}>
            {INTERESTS.map(interest => (
              <TouchableOpacity
                key={interest}
                style={[styles.chip, selectedInterests.includes(interest) && styles.chipSelected]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[styles.chipText, selectedInterests.includes(interest) && styles.chipTextSelected]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="warning" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.generateButton, generating && styles.generateButtonDisabled]}
            onPress={generateRecommendations}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name={weatherEnabled ? "partly-sunny" : "sparkles"} size={20} color="#fff" />
                <Text style={styles.generateButtonText}>
                  {weatherEnabled ? 'Generate Weather-Smart Plans' : 'Generate 3 Recommendations'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  // RESULTS VIEW
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {weatherEnabled ? 'Weather-Smart Plans' : 'AI Recommendations'}
        </Text>
        <TouchableOpacity onPress={() => setView('form')}>
          <Ionicons name="refresh" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsScroll} showsVerticalScrollIndicator={false}>
        {recommendations.map((rec, index) => (
          <View key={index} style={styles.resultCard}>
            {/* Weather Badge */}
            {rec.weather_adapted && (
              <View style={styles.weatherBadge}>
                <Ionicons name="partly-sunny" size={14} color="#8b5cf6" />
                <Text style={styles.weatherBadgeText}>Weather-Optimized</Text>
              </View>
            )}

            <View style={styles.cardHeader}>
              <View style={styles.cityBadge}>
                <Ionicons name="location" size={12} color="#fff" />
                <Text style={styles.cityText}>{rec.city}</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{rec.title}</Text>
            <Text style={styles.cardDescription}>{rec.description}</Text>

            {/* Weather Reasoning */}
            {rec.weather_reasoning && (
              <View style={styles.weatherReasoningBox}>
                <Ionicons name="bulb-outline" size={14} color="#f59e0b" />
                <Text style={styles.weatherReasoningText}>{rec.weather_reasoning}</Text>
              </View>
            )}

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="cash-outline" size={14} color="#6b7280" />
                <Text style={styles.metaText}>{rec.budget}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="compass-outline" size={14} color="#6b7280" />
                <Text style={styles.metaText}>{rec.style}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color="#6b7280" />
                <Text style={styles.metaText}>{rec.duration}</Text>
              </View>
            </View>

            {/* Day-wise Weather Preview */}
            {rec.day_wise_weather && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayWeatherScroll}>
                {rec.day_wise_weather.map((day, i) => (
                  <View key={i} style={styles.dayWeatherCard}>
                    <Text style={styles.dayWeatherNumber}>Day {day.day}</Text>
                    <Text style={styles.dayWeatherIcon}>
                      {day.activity_type === 'outdoor' ? '🏔️' : '🏛️'}
                    </Text>
                    <Text style={styles.dayWeatherCondition}>{day.condition}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.highlightsContainer}>
              <Text style={styles.highlightsTitle}>Daily Activities:</Text>
              {rec.highlights.slice(0, 5).map((highlight, i) => (
                <View key={i} style={styles.highlightItem}>
                  <Text style={styles.highlightDot}>•</Text>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving === index && styles.saveButtonDisabled]}
              onPress={() => saveItinerary(rec, index)}
              disabled={saving === index}
            >
              {saving === index ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="bookmark" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Save This Plan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  formScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultsScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  weatherToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  weatherToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  weatherToggleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  weatherToggleSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  weatherCard: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  weatherTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 12,
  },
  weatherScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  weatherDay: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  weatherDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  weatherIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  weatherTemp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  weatherLoadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  weatherLoadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  chipTextSelected: {
    color: '#fff',
  },
  daysInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    minWidth: 160,
  },
  daysButton: {
    padding: 8,
  },
  daysDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    marginHorizontal: 12,
  },
  daysNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#8b5cf6',
  },
  daysLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: -4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#dc2626',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ede9fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  weatherBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  cardHeader: {
    marginBottom: 12,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  cityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  weatherReasoningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  weatherReasoningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '600',
  },
  dayWeatherScroll: {
    marginVertical: 12,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  dayWeatherCard: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 70,
  },
  dayWeatherNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  dayWeatherIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  dayWeatherCondition: {
    fontSize: 11,
    color: '#9ca3af',
  },
  highlightsContainer: {
    marginBottom: 12,
  },
  highlightsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  highlightDot: {
    color: '#8b5cf6',
    marginRight: 6,
    fontSize: 14,
    fontWeight: '700',
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: '#4b5563',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Switch,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';

// const API_BASE = getBaseURL().replace(/\/+$/, '');

// const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
// const getAuthToken = async () => {
//   for (const k of TOKEN_KEYS) {
//     const v = await AsyncStorage.getItem(k);
//     if (v) return v;
//   }
//   return null;
// };

// const CITIES = [
//   'Abbottabad', 'Galiyat', 'Bagh', 'Chitral', 'Dir', 'Kumrat', 'Gilgit',
//   'Haveli', 'Hunza Valley', 'Islamabad', 'Karachi', 'Kotli', 'Lahore',
//   'Multan', 'Muzaffarabad', 'Nagar Valley', 'Nagarparkar', 'Naran & Kaghan',
//   'Neelum Valley', 'Rawalakot', 'Skardu', 'Swat Valley', 'Murree'
// ];

// const BUDGETS = ['Budget-friendly', 'Mid-range', 'Luxury'];
// const STYLES = ['Adventure', 'Cultural', 'Comfort'];
// const INTERESTS = ['Hiking', 'Food', 'Photography', 'History', 'Nature', 'Shopping'];

// // Weather icon mapper
// const getWeatherIcon = (condition) => {
//   const icons = {
//     'Clear': '☀️',
//     'Clouds': '☁️',
//     'Rain': '🌧️',
//     'Drizzle': '🌦️',
//     'Thunderstorm': '⛈️',
//     'Snow': '❄️',
//     'Mist': '🌫️',
//     'Fog': '🌫️',
//   };
//   return icons[condition] || '🌤️';
// };

// export default function WeatherAwareRecommendationsScreen() {
//   const navigation = useNavigation();
//   const [view, setView] = useState('form');
  
//   // Form state
//   const [selectedCity, setSelectedCity] = useState('');
//   const [selectedBudget, setSelectedBudget] = useState('');
//   const [selectedStyle, setSelectedStyle] = useState('');
//   const [numberOfDays, setNumberOfDays] = useState(5);
//   const [selectedInterests, setSelectedInterests] = useState([]);
//   const [weatherEnabled, setWeatherEnabled] = useState(true);

//   // ✅ NEW: Weather preferences (FE-2 & FE-3)
//   const [indoorOnlyMode, setIndoorOnlyMode] = useState(false);
//   const [preferredWeather, setPreferredWeather] = useState('any');
//   const [avoidRain, setAvoidRain] = useState(true);
//   const [avoidHighWind, setAvoidHighWind] = useState(false);

//   // Data state
//   const [weatherForecast, setWeatherForecast] = useState(null);
//   const [recommendations, setRecommendations] = useState([]);
  
//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [weatherLoading, setWeatherLoading] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [saving, setSaving] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch weather when city changes
//   useEffect(() => {
//     if (weatherEnabled && selectedCity) {
//       fetchWeather();
//     } else {
//       setWeatherForecast(null);
//     }
//   }, [selectedCity, weatherEnabled]);

//   const fetchWeather = async () => {
//     try {
//       setWeatherLoading(true);
//       const token = await getAuthToken();
      
//       const response = await fetch(
//         `${API_BASE}/weather/forecast?city=${encodeURIComponent(selectedCity)}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setWeatherForecast(data.forecast);
//       }
//     } catch (err) {
//       console.error('Weather fetch error:', err);
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   const incrementDays = () => setNumberOfDays(prev => Math.min(14, prev + 1));
//   const decrementDays = () => setNumberOfDays(prev => Math.max(1, prev - 1));

//   const toggleInterest = (interest) => {
//     if (selectedInterests.includes(interest)) {
//       setSelectedInterests(selectedInterests.filter(i => i !== interest));
//     } else {
//       setSelectedInterests([...selectedInterests, interest]);
//     }
//   };

//   const generateRecommendations = async () => {
//     if (!selectedCity || !selectedBudget || !selectedStyle || selectedInterests.length === 0) {
//       setError('Please fill in all fields: city, budget, travel style, duration, and at least one interest');
//       return;
//     }

//     setGenerating(true);
//     setError(null);

//     try {
//       const token = await getAuthToken();
//       const durationString = numberOfDays === 1 ? '1 day' : `${numberOfDays} days`;
      
//       const endpoint = weatherEnabled 
//         ? '/recommendations/generate-weather-aware'
//         : '/recommendations/generate';

//       // ✅ Build request body with weather preferences
//       const requestBody = {
//         preferred_cities: [selectedCity],
//         preferred_budget: selectedBudget,
//         preferred_style: selectedStyle,
//         trip_duration: durationString,
//         interests: selectedInterests,
//       };

//       // ✅ Add weather preferences if enabled (FE-2 & FE-3)
//       if (weatherEnabled) {
//         requestBody.weather_preferences = {
//           indoor_only: indoorOnlyMode,
//           avoid_rain: avoidRain,
//           avoid_high_wind: avoidHighWind,
//           preferred_conditions: preferredWeather,
//         };
//       }

//       const response = await fetch(`${API_BASE}${endpoint}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setRecommendations(data.recommendations || []);
//         if (data.weather_forecast) {
//           setWeatherForecast(data.weather_forecast);
//         }
//         setView('results');
//       } else {
//         setError(data.error || 'Failed to generate recommendations');
//       }
//     } catch (err) {
//       setError('Network error. Check your connection.');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const saveItinerary = async (rec, index) => {
//     setSaving(index);
//     try {
//       const token = await getAuthToken();
//       const response = await fetch(`${API_BASE}/recommendations/save`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(rec),
//       });

//       if (response.ok) {
//         Alert.alert('Success!', 'Weather-smart itinerary saved successfully');
//       } else {
//         const data = await response.json();
//         Alert.alert('Error', data.error || 'Failed to save itinerary');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Network error. Check your connection.');
//     } finally {
//       setSaving(null);
//     }
//   };

//   // FORM VIEW
//   if (view === 'form') {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="#1f2937" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Weather-Smart Planner</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
//           {/* Weather Toggle */}
//           <View style={styles.weatherToggleCard}>
//             <View style={styles.weatherToggleLeft}>
//               <Ionicons name="partly-sunny" size={24} color="#8b5cf6" />
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.weatherToggleTitle}>Weather-Aware Planning</Text>
//                 <Text style={styles.weatherToggleSubtitle}>
//                   AI will adapt activities based on forecast
//                 </Text>
//               </View>
//             </View>
//             <Switch
//               value={weatherEnabled}
//               onValueChange={setWeatherEnabled}
//               trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
//               thumbColor={weatherEnabled ? '#8b5cf6' : '#f3f4f6'}
//             />
//           </View>

//           {/* ✅ NEW: Weather Preferences Section (FE-2 & FE-3) */}
//           {weatherEnabled && (
//             <View style={styles.weatherPreferencesCard}>
//               <Text style={styles.weatherPrefTitle}>🌤️ Weather Preferences</Text>
//               <Text style={styles.weatherPrefSubtitle}>
//                 Customize how weather affects your itinerary
//               </Text>

//               {/* Indoor-Only Mode (FE-3) */}
//               <View style={styles.prefRow}>
//                 <View style={styles.prefLeft}>
//                   <Ionicons name="home-outline" size={20} color="#6b7280" />
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.prefLabel}>Indoor-Only Activities</Text>
//                     <Text style={styles.prefDesc}>Only recommend indoor activities</Text>
//                   </View>
//                 </View>
//                 <Switch
//                   value={indoorOnlyMode}
//                   onValueChange={setIndoorOnlyMode}
//                   trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
//                   thumbColor={indoorOnlyMode ? '#8b5cf6' : '#f3f4f6'}
//                 />
//               </View>

//               {/* Avoid Rain (FE-2) */}
//               <View style={styles.prefRow}>
//                 <View style={styles.prefLeft}>
//                   <Ionicons name="umbrella-outline" size={20} color="#6b7280" />
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.prefLabel}>Avoid Rainy Days</Text>
//                     <Text style={styles.prefDesc}>Skip outdoor activities on rainy days</Text>
//                   </View>
//                 </View>
//                 <Switch
//                   value={avoidRain}
//                   onValueChange={setAvoidRain}
//                   trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
//                   thumbColor={avoidRain ? '#8b5cf6' : '#f3f4f6'}
//                 />
//               </View>

//               {/* ✅ NEW: Avoid High Wind (FE-2) */}
//               <View style={styles.prefRow}>
//                 <View style={styles.prefLeft}>
//                   <Ionicons name="flag-outline" size={20} color="#6b7280" />
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.prefLabel}>Avoid Windy Conditions</Text>
//                     <Text style={styles.prefDesc}>Skip activities when wind speed {'>'} 25 km/h</Text>
//                   </View>
//                 </View>
//                 <Switch
//                   value={avoidHighWind}
//                   onValueChange={setAvoidHighWind}
//                   trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
//                   thumbColor={avoidHighWind ? '#8b5cf6' : '#f3f4f6'}
//                 />
//               </View>

//               {/* Preferred Weather (FE-3) */}
//               <View style={styles.prefSection}>
//                 <Text style={styles.prefSectionTitle}>Preferred Weather Conditions:</Text>
//                 <View style={styles.chipContainer}>
//                   <TouchableOpacity
//                     style={[styles.weatherChip, preferredWeather === 'any' && styles.weatherChipSelected]}
//                     onPress={() => setPreferredWeather('any')}
//                   >
//                     <Text style={[styles.weatherChipText, preferredWeather === 'any' && styles.weatherChipTextSelected]}>
//                       🌈 Any Weather
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[styles.weatherChip, preferredWeather === 'clear' && styles.weatherChipSelected]}
//                     onPress={() => setPreferredWeather('clear')}
//                   >
//                     <Text style={[styles.weatherChipText, preferredWeather === 'clear' && styles.weatherChipTextSelected]}>
//                       ☀️ Clear Skies
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[styles.weatherChip, preferredWeather === 'cloudy' && styles.weatherChipSelected]}
//                     onPress={() => setPreferredWeather('cloudy')}
//                   >
//                     <Text style={[styles.weatherChipText, preferredWeather === 'cloudy' && styles.weatherChipTextSelected]}>
//                       ☁️ Cloudy
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[styles.weatherChip, preferredWeather === 'cool' && styles.weatherChipSelected]}
//                     onPress={() => setPreferredWeather('cool')}
//                   >
//                     <Text style={[styles.weatherChipText, preferredWeather === 'cool' && styles.weatherChipTextSelected]}>
//                       ❄️ Cool Weather
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )}

//           {/* Weather Forecast Preview */}
//           {weatherEnabled && weatherForecast && !weatherLoading && (
//             <View style={styles.weatherCard}>
//               <Text style={styles.weatherTitle}>📍 {weatherForecast.city} Forecast</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weatherScroll}>
//                 {weatherForecast.forecasts.slice(0, 5).map((day, index) => (
//                   <View key={index} style={styles.weatherDay}>
//                     <Text style={styles.weatherDate}>
//                       {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                     </Text>
//                     <Text style={styles.weatherIcon}>{getWeatherIcon(day.condition)}</Text>
//                     <Text style={styles.weatherCondition}>{day.condition}</Text>
//                     <Text style={styles.weatherTemp}>
//                       {Math.round(day.temp_max)}°/{Math.round(day.temp_min)}°
//                     </Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             </View>
//           )}

//           {weatherEnabled && weatherLoading && (
//             <View style={styles.weatherLoadingCard}>
//               <ActivityIndicator size="small" color="#8b5cf6" />
//               <Text style={styles.weatherLoadingText}>Fetching weather forecast...</Text>
//             </View>
//           )}

//           {/* City Selection */}
//           <Text style={styles.sectionTitle}>Where do you want to go? *</Text>
//           <Text style={styles.sectionSubtitle}>Select one city</Text>
//           <View style={styles.chipContainer}>
//             {CITIES.map(city => (
//               <TouchableOpacity
//                 key={city}
//                 style={[styles.chip, selectedCity === city && styles.chipSelected]}
//                 onPress={() => setSelectedCity(city)}
//               >
//                 <Text style={[styles.chipText, selectedCity === city && styles.chipTextSelected]}>
//                   {city}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Budget */}
//           <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Budget *</Text>
//           <View style={styles.chipContainer}>
//             {BUDGETS.map(budget => (
//               <TouchableOpacity
//                 key={budget}
//                 style={[styles.chip, selectedBudget === budget && styles.chipSelected]}
//                 onPress={() => setSelectedBudget(budget)}
//               >
//                 <Text style={[styles.chipText, selectedBudget === budget && styles.chipTextSelected]}>
//                   {budget}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Travel Style */}
//           <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Travel Style *</Text>
//           <View style={styles.chipContainer}>
//             {STYLES.map(style => (
//               <TouchableOpacity
//                 key={style}
//                 style={[styles.chip, selectedStyle === style && styles.chipSelected]}
//                 onPress={() => setSelectedStyle(style)}
//               >
//                 <Text style={[styles.chipText, selectedStyle === style && styles.chipTextSelected]}>
//                   {style}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Duration */}
//           <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trip Duration *</Text>
//           <View style={styles.daysInputContainer}>
//             <TouchableOpacity style={styles.daysButton} onPress={decrementDays} disabled={numberOfDays <= 1}>
//               <Ionicons name="chevron-down" size={24} color={numberOfDays <= 1 ? '#d1d5db' : '#8b5cf6'} />
//             </TouchableOpacity>
//             <View style={styles.daysDisplayContainer}>
//               <Text style={styles.daysNumber}>{numberOfDays}</Text>
//               <Text style={styles.daysLabel}>{numberOfDays === 1 ? 'day' : 'days'}</Text>
//             </View>
//             <TouchableOpacity style={styles.daysButton} onPress={incrementDays}>
//               <Ionicons name="chevron-up" size={24} color="#8b5cf6" />
//             </TouchableOpacity>
//           </View>

//           {/* Interests */}
//           <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Interests *</Text>
//           <View style={styles.chipContainer}>
//             {INTERESTS.map(interest => (
//               <TouchableOpacity
//                 key={interest}
//                 style={[styles.chip, selectedInterests.includes(interest) && styles.chipSelected]}
//                 onPress={() => toggleInterest(interest)}
//               >
//                 <Text style={[styles.chipText, selectedInterests.includes(interest) && styles.chipTextSelected]}>
//                   {interest}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {error && (
//             <View style={styles.errorBanner}>
//               <Ionicons name="warning" size={16} color="#dc2626" />
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           )}

//           <TouchableOpacity
//             style={[styles.generateButton, generating && styles.generateButtonDisabled]}
//             onPress={generateRecommendations}
//             disabled={generating}
//           >
//             {generating ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name={weatherEnabled ? "partly-sunny" : "sparkles"} size={20} color="#fff" />
//                 <Text style={styles.generateButtonText}>
//                   {weatherEnabled ? 'Generate Weather-Smart Plans' : 'Generate 3 Recommendations'}
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>

//           <View style={{ height: 40 }} />
//         </ScrollView>
//       </View>
//     );
//   }

//   // RESULTS VIEW
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1f2937" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           {weatherEnabled ? 'Weather-Smart Plans' : 'AI Recommendations'}
//         </Text>
//         <TouchableOpacity onPress={() => setView('form')}>
//           <Ionicons name="refresh" size={20} color="#6b7280" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.resultsScroll} showsVerticalScrollIndicator={false}>
//         {recommendations.map((rec, index) => (
//           <View key={index} style={styles.resultCard}>
//             {/* Weather Badge */}
//             {rec.weather_adapted && (
//               <View style={styles.weatherBadge}>
//                 <Ionicons name="partly-sunny" size={14} color="#8b5cf6" />
//                 <Text style={styles.weatherBadgeText}>Weather-Optimized</Text>
//               </View>
//             )}

//             <View style={styles.cardHeader}>
//               <View style={styles.cityBadge}>
//                 <Ionicons name="location" size={12} color="#fff" />
//                 <Text style={styles.cityText}>{rec.city}</Text>
//               </View>
//             </View>

//             <Text style={styles.cardTitle}>{rec.title}</Text>
//             <Text style={styles.cardDescription}>{rec.description}</Text>

//             {/* Weather Reasoning */}
//             {rec.weather_reasoning && (
//               <View style={styles.weatherReasoningBox}>
//                 <Ionicons name="bulb-outline" size={14} color="#f59e0b" />
//                 <Text style={styles.weatherReasoningText}>{rec.weather_reasoning}</Text>
//               </View>
//             )}

//             <View style={styles.metaRow}>
//               <View style={styles.metaItem}>
//                 <Ionicons name="cash-outline" size={14} color="#6b7280" />
//                 <Text style={styles.metaText}>{rec.budget}</Text>
//               </View>
//               <View style={styles.metaItem}>
//                 <Ionicons name="compass-outline" size={14} color="#6b7280" />
//                 <Text style={styles.metaText}>{rec.style}</Text>
//               </View>
//               <View style={styles.metaItem}>
//                 <Ionicons name="time-outline" size={14} color="#6b7280" />
//                 <Text style={styles.metaText}>{rec.duration}</Text>
//               </View>
//             </View>

//             {/* Day-wise Weather Preview */}
//             {rec.day_wise_weather && (
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayWeatherScroll}>
//                 {rec.day_wise_weather.map((day, i) => (
//                   <View key={i} style={styles.dayWeatherCard}>
//                     <Text style={styles.dayWeatherNumber}>Day {day.day}</Text>
//                     <Text style={styles.dayWeatherIcon}>
//                       {day.activity_type === 'outdoor' ? '🏔️' : '🏛️'}
//                     </Text>
//                     <Text style={styles.dayWeatherCondition}>{day.condition}</Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             )}

//             <View style={styles.highlightsContainer}>
//               <Text style={styles.highlightsTitle}>Daily Activities:</Text>
//               {rec.highlights.slice(0, 5).map((highlight, i) => (
//                 <View key={i} style={styles.highlightItem}>
//                   <Text style={styles.highlightDot}>•</Text>
//                   <Text style={styles.highlightText}>{highlight}</Text>
//                 </View>
//               ))}
//             </View>

//             <TouchableOpacity
//               style={[styles.saveButton, saving === index && styles.saveButtonDisabled]}
//               onPress={() => saveItinerary(rec, index)}
//               disabled={saving === index}
//             >
//               {saving === index ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <>
//                   <Ionicons name="bookmark" size={20} color="#fff" />
//                   <Text style={styles.saveButtonText}>Save This Plan</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F9FC',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#1f2937',
//   },
//   formScroll: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   resultsScroll: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   weatherToggleCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   weatherToggleLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     flex: 1,
//   },
//   weatherToggleTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1f2937',
//   },
//   weatherToggleSubtitle: {
//     fontSize: 13,
//     color: '#6b7280',
//     marginTop: 2,
//   },
//   // ✅ NEW: Weather Preferences Styles
//   weatherPreferencesCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   weatherPrefTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   weatherPrefSubtitle: {
//     fontSize: 13,
//     color: '#6b7280',
//     marginBottom: 16,
//   },
//   prefRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f3f4f6',
//   },
//   prefLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     flex: 1,
//   },
//   prefLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1f2937',
//   },
//   prefDesc: {
//     fontSize: 12,
//     color: '#9ca3af',
//     marginTop: 2,
//   },
//   prefSection: {
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#f3f4f6',
//   },
//   prefSectionTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1f2937',
//     marginBottom: 12,
//   },
//   weatherChip: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: '#d1d5db',
//     backgroundColor: '#fff',
//   },
//   weatherChipSelected: {
//     backgroundColor: '#8b5cf6',
//     borderColor: '#8b5cf6',
//   },
//   weatherChipText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#4b5563',
//   },
//   weatherChipTextSelected: {
//     color: '#fff',
//   },
//   weatherCard: {
//     backgroundColor: '#eff6ff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   weatherTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#1e40af',
//     marginBottom: 12,
//   },
//   weatherScroll: {
//     marginHorizontal: -16,
//     paddingHorizontal: 16,
//   },
//   weatherDay: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginRight: 8,
//     alignItems: 'center',
//     minWidth: 80,
//   },
//   weatherDate: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6b7280',
//     marginBottom: 4,
//   },
//   weatherIcon: {
//     fontSize: 32,
//     marginBottom: 4,
//   },
//   weatherCondition: {
//     fontSize: 12,
//     color: '#374151',
//     marginBottom: 4,
//   },
//   weatherTemp: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   weatherLoadingCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     backgroundColor: '#f3f4f6',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   weatherLoadingText: {
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: '#6b7280',
//     marginBottom: 12,
//   },
//   chipContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   chip: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: '#d1d5db',
//     backgroundColor: '#fff',
//   },
//   chipSelected: {
//     backgroundColor: '#8b5cf6',
//     borderColor: '#8b5cf6',
//   },
//   chipText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#4b5563',
//   },
//   chipTextSelected: {
//     color: '#fff',
//   },
//   daysInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: '#d1d5db',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     alignSelf: 'flex-start',
//     minWidth: 160,
//   },
//   daysButton: {
//     padding: 8,
//   },
//   daysDisplayContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 60,
//     marginHorizontal: 12,
//   },
//   daysNumber: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#8b5cf6',
//   },
//   daysLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#6b7280',
//     marginTop: -4,
//   },
//   errorBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#fee2e2',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   errorText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#dc2626',
//   },
//   generateButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     backgroundColor: '#8b5cf6',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 24,
//   },
//   generateButtonDisabled: {
//     opacity: 0.6,
//   },
//   generateButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   resultCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   weatherBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: '#ede9fe',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     marginBottom: 12,
//   },
//   weatherBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#8b5cf6',
//   },
//   cardHeader: {
//     marginBottom: 12,
//   },
//   cityBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#8b5cf6',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//     alignSelf: 'flex-start',
//   },
//   cityText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#1f2937',
//     marginBottom: 8,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: '#6b7280',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   weatherReasoningBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 8,
//     backgroundColor: '#fef3c7',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   weatherReasoningText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#92400e',
//     lineHeight: 18,
//   },
//   metaRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 12,
//     color: '#4b5563',
//     fontWeight: '600',
//   },
//   dayWeatherScroll: {
//     marginVertical: 12,
//     marginHorizontal: -16,
//     paddingHorizontal: 16,
//   },
//   dayWeatherCard: {
//     backgroundColor: '#f3f4f6',
//     padding: 12,
//     borderRadius: 8,
//     marginRight: 8,
//     alignItems: 'center',
//     minWidth: 70,
//   },
//   dayWeatherNumber: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6b7280',
//     marginBottom: 4,
//   },
//   dayWeatherIcon: {
//     fontSize: 24,
//     marginBottom: 4,
//   },
//   dayWeatherCondition: {
//     fontSize: 11,
//     color: '#9ca3af',
//   },
//   highlightsContainer: {
//     marginBottom: 12,
//   },
//   highlightsTitle: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#1f2937',
//     marginBottom: 6,
//   },
//   highlightItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 4,
//   },
//   highlightDot: {
//     color: '#8b5cf6',
//     marginRight: 6,
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   highlightText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#4b5563',
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     backgroundColor: '#8b5cf6',
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   saveButtonDisabled: {
//     opacity: 0.6,
//   },
//   saveButtonText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#fff',
//   },
// });