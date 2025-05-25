import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const dummyFeedback = [
  { id: '1', name: 'Ali Raza', rating: 5, comment: 'Amazing experience! Learned so much about local culture.' },
  { id: '2', name: 'Sara Khan', rating: 4, comment: 'Photography session was fun and well organized.' },
  { id: '3', name: 'John Doe', rating: 5, comment: 'Great cooking class, will recommend to others!' },
];

const Traveler_Feedback = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Web-only Back Button */}
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#111" />
            <Text style={styles.backText}>Back to Dashboard</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.title}>Traveler Feedback</Text>
        <FlatList
          data={dummyFeedback}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  rating: {
    color: '#F59E0B',
    marginVertical: 4,
  },
  comment: {
    color: '#374151',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#111',
  },
});

export default Traveler_Feedback;
