
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AuthPromptModal from './AuthPromptModal'; // ✅ Imported modal

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const navigation = useNavigation();

  const options = [
    'Itineraries',
    'Top Events',
    'Cultural Exchange',
    'Top Travelers',
    'Service Providers',
  ];

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setShowDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);

  const handleItemPress = (item) => {
    setQuery(item);
    setShowDropdown(false);
  };

  const handleSearchClick = () => {
    if (!query.trim()) return;
    setShowModal(true); // ✅ Use modal instead of Alert
  };

  return (
    <View nativeID="top" style={styles.wrapper}>
      <View
        ref={containerRef}
        style={[styles.inner, { width: isMobile ? '92%' : '70%' }]}
      >
        <Text style={styles.heading}>Start Planning Your Next Journey</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Search destinations, itineraries, or events..."
            placeholderTextColor="#999"
            value={query}
            onFocus={() => setShowDropdown(true)}
            onChangeText={(text) => {
              setQuery(text);
              setShowDropdown(true);
            }}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearchClick}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {showDropdown && (
          <View style={styles.dropdown}>
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleItemPress(item)}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <AuthPromptModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onContinue={() => {
          setShowModal(false);
          navigation.navigate('RoleSelection');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F7F7F7',
    paddingBottom: 60,
    alignItems: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  heading: {
    paddingTop: 30,
    fontSize: 28,
    fontWeight: '700',
    color: '#003554',
    textAlign: 'center',
    marginBottom: 26,
    maxWidth: 720,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 40,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'web' ? 16 : 14,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 6,
    color: '#222',
    outlineStyle: 'none',
  },
  button: {
    backgroundColor: '#00b4d8',
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginLeft: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  dropdown: {
    marginTop: 8,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
