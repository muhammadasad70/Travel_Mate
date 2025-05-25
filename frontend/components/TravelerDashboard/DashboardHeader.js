import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const DashboardHeader = ({ name }) => {
  const [query, setQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigation = useNavigation();

  const dummyNotifications = [
    '🌦️ Weather Alert: Rain expected tomorrow in Skardu.',
    '🎉 Event Alert: New Festival in Hunza this weekend!',
    '⚙️ System Notification: App update available.',
    '👥 Group Notification: Your hiking group posted an update.',
    '💬 Community Notification: New comment on your itinerary.',
  ];

  const dummySuggestions = [
    'Hunza Valley Itinerary',
    'Skardu Festival Event',
    'Swat Waterfall Tour',
    'Murree Snow Hiking',
    'Fairy Meadows Adventure',
  ];

  const handleSearch = () => {
    if (!query.trim()) return;
    console.log('Searching:', query);
    setShowSuggestions(false);
  };
  const handleOptionPress = (option) => {
    setShowProfileMenu(false);
  
    switch (option) {
      case 'Profile':
        navigation.navigate('TravelerProfile');
        break;
      case 'Manage Profile':
        navigation.navigate('ManageTravelerProfile');
        break;
      case 'Logout':
        Alert.alert('✅ Successfully logged out!');
        navigation.navigate('TestHeader');
        break;
      default:
        break;
    }
  };
  

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Text style={styles.greeting}>
          {name ? `Welcome, ${name} 👋` : 'Traveler Dashboard'}
        </Text>
        {!isMobile && (
          <View style={styles.icons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowNotification(true)}
            >
              <Feather name="bell" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowProfileMenu(true)}
            >
              <FontAwesome name="user-circle" size={30} color="#333" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search itineraries, vendors..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
            <Feather name="search" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {showSuggestions && (
          <View style={styles.suggestionsBox}>
            {dummySuggestions.map((suggestion, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setQuery(suggestion);
                  setShowSuggestions(false);
                  handleSearch();
                }}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {isMobile && (
        <View style={styles.icons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowNotification(true)}
          >
            <Feather name="bell" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowProfileMenu(true)}
          >
            <FontAwesome name="user-circle" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Dropdown */}
      <Modal
        transparent
        visible={showProfileMenu}
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <Pressable
          style={styles.fullscreenDismiss}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.modalContent}>
            {['Profile', 'Manage Profile', 'Logout'].map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionPress(option)}
                style={styles.modalItem}
              >
                <Text style={styles.modalText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Notification Modal */}
      <Modal
        transparent
        visible={showNotification}
        animationType="slide"
        onRequestClose={() => setShowNotification(false)}
      >
        <Pressable
          style={styles.fullscreenDismiss}
          onPress={() => setShowNotification(false)}
        >
          <View style={styles.notificationBox}>
            <Text style={styles.notificationTitle}>🔔 Notifications</Text>
            <ScrollView style={styles.notificationList}>
              {dummyNotifications.map((note, idx) => (
                <Text key={idx} style={styles.notificationItem}>{note}</Text>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  searchContainer: {
    width: '100%',
    alignSelf: 'center',
    maxWidth: 700,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    color: '#212529',
  },
  searchIcon: {
    paddingLeft: 10,
  },
  suggestionsBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 4,
    zIndex: 999,
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  icons: {
    flexDirection: 'row',
    gap: 14,
    alignSelf: 'center',
  },
  iconButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 100,
  },
  fullscreenDismiss: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 180,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  notificationBox: {
    marginTop: 100,
    marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    maxHeight: 300,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  notificationList: {
    maxHeight: 220,
  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    fontSize: 15,
    color: '#444',
  },
});

export default DashboardHeader;
