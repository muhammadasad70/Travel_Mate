import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
const DURATIONS = ['2-3 days', '3-5 days', '5-7 days', '1 week+'];
const INTERESTS = ['Hiking', 'Food', 'Photography', 'History', 'Nature', 'Shopping'];

export default function AIRecommendationsFormScreen() {
  const navigation = useNavigation();
  const [view, setView] = useState('form'); // 'form' or 'results'
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE}/recommendations/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
    }
  };

  const generateRecommendations = async () => {
    if (selectedCities.length === 0 || !selectedBudget || !selectedStyle) {
      setError('Please select at least one city, budget, and travel style');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE}/recommendations/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferred_cities: selectedCities,
          preferred_budget: selectedBudget,
          preferred_style: selectedStyle,
          trip_duration: selectedDuration,
          interests: selectedInterests,
        }),
        
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setRecommendations(data.recommendations || []);
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
        Alert.alert('Success!', 'Itinerary saved successfully', [
          { text: 'OK' }
        ]);
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

  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else if (selectedCities.length < 3) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Form View
  if (view === 'form') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Generate AI Itinerary</Text>
          <View style={{ width: 24 }} />
        </View>

        {analysis && analysis.total_itineraries > 0 && (
          <View style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>Your Travel Profile</Text>
            <Text style={styles.analysisText}>
              📊 {analysis.total_itineraries} trips planned
            </Text>
            {Object.keys(analysis.cities_visited || {}).length > 0 && (
              <Text style={styles.analysisText}>
                🌍 Visited: {Object.keys(analysis.cities_visited).slice(0, 3).join(', ')}
              </Text>
            )}
          </View>
        )}

        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Where do you want to go?</Text>
          <Text style={styles.sectionSubtitle}>Select up to 3 cities</Text>
          <View style={styles.chipContainer}>
            {CITIES.map(city => (
              <TouchableOpacity
                key={city}
                style={[styles.chip, selectedCities.includes(city) && styles.chipSelected]}
                onPress={() => toggleCity(city)}
              >
                <Text style={[styles.chipText, selectedCities.includes(city) && styles.chipTextSelected]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Budget</Text>
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

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Travel Style</Text>
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

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trip Duration (Optional)</Text>
          <View style={styles.chipContainer}>
            {DURATIONS.map(duration => (
              <TouchableOpacity
                key={duration}
                style={[styles.chip, selectedDuration === duration && styles.chipSelected]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text style={[styles.chipText, selectedDuration === duration && styles.chipTextSelected]}>
                  {duration}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Interests (Optional)</Text>
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
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.generateButtonText}>Generate Recommendations</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  // Results View
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your AI Recommendations</Text>
        <TouchableOpacity onPress={() => setView('form')}>
          <Ionicons name="refresh" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsScroll} showsVerticalScrollIndicator={false}>
        {recommendations.map((rec, index) => (
          <View key={index} style={styles.resultCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cityBadge}>
                <Ionicons name="location" size={12} color="#fff" />
                <Text style={styles.cityText}>{rec.city}</Text>
              </View>
              <Text style={styles.confidenceEmoji}>🎯</Text>
            </View>

            <Text style={styles.cardTitle}>{rec.title}</Text>
            <Text style={styles.cardDescription}>{rec.description}</Text>

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

            <View style={styles.highlightsContainer}>
              <Text style={styles.highlightsTitle}>Highlights:</Text>
              {rec.highlights.slice(0, 4).map((highlight, i) => (
                <View key={i} style={styles.highlightItem}>
                  <Text style={styles.highlightDot}>•</Text>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>

            <View style={styles.reasoningContainer}>
              <Ionicons name="bulb-outline" size={14} color="#8b5cf6" />
              <Text style={styles.reasoningText}>{rec.reasoning}</Text>
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
                  <Text style={styles.saveButtonText}>Use This Plan</Text>
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
  analysisCard: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  analysisTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  analysisText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  cityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  confidenceEmoji: {
    fontSize: 20,
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
  reasoningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  reasoningText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
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