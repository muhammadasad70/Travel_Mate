// screens/Cultural/Cultural_Engagement_Stats.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Cultural_Engagement_Stats = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={styles.container}>
        {/* Web-only Back Arrow */}
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#111" />
            <Text style={styles.backText}>Back to Dashboard</Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <Text style={styles.heading}>📊 Cultural Engagement Stats</Text>

        {/* Dummy Stats */}
        <View style={styles.statsBox}>
          <Text style={styles.statTitle}>Most Liked Listing:</Text>
          <Text style={styles.statValue}>Photography Exchange - 124 Likes</Text>

          <Text style={styles.statTitle}>Total Cultural Sessions:</Text>
          <Text style={styles.statValue}>38 Sessions</Text>

          <Text style={styles.statTitle}>Top Participating Nationalities:</Text>
          <Text style={styles.statValue}>🇵🇰 🇫🇷 🇹🇷 🇩🇪</Text>

          <Text style={styles.statTitle}>Total Reviews Received:</Text>
          <Text style={styles.statValue}>102 Reviews</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isMobile ? 16 : 24,
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statsBox: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 20,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    marginBottom: 16,
  },
});

export default Cultural_Engagement_Stats;
