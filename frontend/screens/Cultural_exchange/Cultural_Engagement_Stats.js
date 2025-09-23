// screens/Cultural/Cultural_Engagement_Stats.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Cultural_Engagement_Stats = ({ onBackToServices }) => {
  const navigation = useNavigation();

  // Dummy cultural engagement data
  const engagementData = [
    { month: 'Jan', participants: 12, exchanges: 8 },
    { month: 'Feb', participants: 18, exchanges: 14 },
    { month: 'Mar', participants: 25, exchanges: 20 },
    { month: 'Apr', participants: 22, exchanges: 18 },
    { month: 'May', participants: 30, exchanges: 25 },
    { month: 'Jun', participants: 35, exchanges: 28 },
  ];

  const topSkills = [
    { name: 'Photography Exchange', participants: 45, rating: 4.9 },
    { name: 'Language Learning', participants: 38, rating: 4.8 },
    { name: 'Cooking Classes', participants: 32, rating: 4.7 },
    { name: 'Music Lessons', participants: 28, rating: 4.6 },
  ];

  // If onBackToServices is provided, we're in dashboard mode (no header/bottom nav)
  const isInDashboard = !!onBackToServices;
  
  if (isInDashboard) {
    return (
      <View style={[styles.content, { paddingTop: 0 }]}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="bar-chart-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Cultural Engagement Stats</Text>
        </View>

        {/* Engagement Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Engagement</Text>
          <View style={styles.chartContainer}>
            {engagementData.map((data, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { height: (data.participants / 35) * 100 }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{data.month}</Text>
                <Text style={styles.barValue}>{data.participants}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Most Popular Skills</Text>
          {topSkills.map((skill, index) => (
            <View key={index} style={styles.skillCard}>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillStats}>
                  {skill.participants} participants • ⭐ {skill.rating}
                </Text>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Standalone mode with header and bottom nav
  return (
    <SafeAreaView style={styles.container}>
      <VendorHeader />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="bar-chart-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
            <Text style={styles.title}>Cultural Engagement Stats</Text>
          </View>

          {/* Engagement Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Engagement</Text>
            <View style={styles.chartContainer}>
              {engagementData.map((data, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar, 
                        { height: (data.participants / 35) * 100 }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{data.month}</Text>
                  <Text style={styles.barValue}>{data.participants}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Top Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Most Popular Skills</Text>
            {topSkills.map((skill, index) => (
              <View key={index} style={styles.skillCard}>
                <View style={styles.skillInfo}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillStats}>
                    {skill.participants} participants • ⭐ {skill.rating}
                  </Text>
                </View>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  // Content styles
  scrollView: {
    flex: 1,
  },
  content: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Minimal top padding to ensure title is visible under header
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  statsBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  // Chart styles
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    backgroundColor: '#10b981',
    width: 30,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  // Skill card styles
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  skillStats: {
    fontSize: 14,
    color: '#64748b',
  },
  rankBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Cultural_Engagement_Stats;
