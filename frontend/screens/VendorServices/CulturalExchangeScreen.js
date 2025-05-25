import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const CulturalExchangeScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState({});

  const culturalHosts = [
    {
      name: 'Aisha Rahman',
      location: 'Hunza',
      type: 'Calligrgraphy Workshop',
      date: 'April 30',
      rating: '4.7',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Hasan Ali',
      location: 'Lahore',
      type: 'Cooking Class',
      date: 'May 5',
      rating: '4.9',
      avatar: 'https://randomuser.me/api/portraits/men/31.jpg'
    },
    {
      name: 'Fatima Akhtar',
      location: 'Hunza',
      type: 'Music Session',
      date: 'May 12',
      rating: '4.8',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ];

  const renderCard = (title, desc, bg, icon) => (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Text style={styles.cardTitle}>{icon} {title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  );

  const renderFilter = (label) => (
    <TouchableOpacity style={styles.filterButton}>
      <Text style={styles.filterText}>{label} ▼</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>Cultural Exchange Dashboard</Text>

      <View style={styles.gridRow}>
        {renderCard('Explore Cultural Hosts', 'View list of verified locals offering cultural sessions', '#e0f2fe', '🔍')}
        {renderCard('Chat with Hosts', 'Chat interface with hosts of confirmed bookings', '#ffe4e6', '💬')}
      </View>
      <View style={styles.gridRow}>
        {renderCard('Chat with Hosts', 'Chat interface with hosts of confirmed bookings', '#dcfce7', '💬')}
        {renderCard('Feedback & Reviews', 'Submit reviews or see reviews given to your hosts', '#fef3c7', '⭐')}
      </View>

      <Text style={styles.subHeading}>Explore Cultural Hosts</Text>

      <View style={styles.filtersRow}>
        {renderFilter('Location')}
        {renderFilter('Type')}
        {renderFilter('Duration')}
        {renderFilter('Host Rating')}
      </View>

      <View style={styles.hostList}>
        {culturalHosts.map((host, index) => (
          <View key={index} style={styles.hostCard}>
            <Image source={{ uri: host.avatar }} style={styles.avatar} />
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>{host.name}</Text>
              <Text style={styles.meta}>{host.location}</Text>
              <Text style={styles.meta}>{host.type} · {host.date}</Text>
            </View>
            <View>
              <Text style={styles.hostDate}>{host.date}</Text>
              <Text style={styles.rating}>⭐ {host.rating}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  back: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0f172a',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#334155',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#0f172a',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginBottom: 10,
  },
  filterText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  hostList: {
    marginTop: 8,
  },
  hostCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  meta: {
    fontSize: 13,
    color: '#64748b',
  },
  hostDate: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
    textAlign: 'right',
  },
  rating: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
    textAlign: 'right',
  },
});

export default CulturalExchangeScreen;
