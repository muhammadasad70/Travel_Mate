import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const TravelerProductScreen = () => {
  const navigation = useNavigation();

  const productSections = [
    {
      label: '🛒 Browse Products',
      color: '#d1fae5',
      onPress: () => navigation.navigate('BrowseProductsScreen'),
    },
    {
      label: '📦 My Orders',
      color: '#fee2e2',
      onPress: () => navigation.navigate('MyOrdersScreen'),
    },
    {
      label: '📝 Contact with us ',
      color: '#e0e7ff',
      onPress: () => navigation.navigate('MyReviewsScreen'),
    },
    {
      label: '🖼️ Cart',
      color: '#fef3c7',
      onPress: () => navigation.navigate('SavedItemsScreen'),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>🛍️ Traveler Product Dashboard</Text>

      <View style={styles.grid}>
        {productSections.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={item.onPress}
          >
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 60 : 20,
    backgroundColor: '#f7fafd',
    flexGrow: 1,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003366',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isTablet ? 'space-between' : 'center',
    gap: 16,
  },
  card: {
    width: isTablet ? '48%' : '100%',
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});

export default TravelerProductScreen;
