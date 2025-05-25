
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const quickAccessData = [
  { label: 'Itineraries', icon: 'route', color: '#e0f7fa' },
  { label: 'Events', icon: 'calendar-alt', color: '#fff3e0' },
  { label: 'Community', icon: 'users', color: '#e8f5e9' },
  { label: 'Offline Access', icon: 'cloud', color: '#f3e5f5' },
  { label: 'Cultural Exchange', icon: 'globe', color: '#e1f5fe' },
  { label: 'Vendors', icon: 'briefcase', color: '#fbe9e7' },
];

const QuickAccessCards = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <View style={styles.container}>
      {quickAccessData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: item.color,
              width: isMobile ? '100%' : '30%',
            },
          ]}
          onPress={() => console.log(`${item.label} clicked`)}
        >
          <View style={styles.iconWrapper}>
            <FontAwesome5 name={item.icon} size={24} color="#003366" />
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
    backgroundColor: '#f9f9f9',
  },
  card: {
    paddingVertical: 24,
    marginBottom: 16,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 5,
  },
  iconWrapper: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '600',
  },
});

export default QuickAccessCards;
