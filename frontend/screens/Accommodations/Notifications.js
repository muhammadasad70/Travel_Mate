import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const dummyNotifications = [
  { id: '1', message: '🛎️ You received a new booking for 2 guests.' },
  { id: '2', message: '📊 Your analytics report has been updated.' },
  { id: '3', message: '💬 New message from a traveler: “Can I get a late check-in?”' },
  { id: '4', message: '📢 System update scheduled for tonight at 12:00 AM.' },
];

const Notifications = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        {/* ✅ Web-only back button */}
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Feather name="arrow-left" size={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.heading}>🔔 Notifications</Text>

        <FlatList
          data={dummyNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: isMobile ? 16 : 32,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    flexGrow: 1,
  },
  backArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#1F2937',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  listContainer: {
    gap: 12,
    paddingBottom: 60,
  },
  notificationItem: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
  },
  notificationText: {
    fontSize: 14,
    color: '#1F2937',
  },
});

export default Notifications;
