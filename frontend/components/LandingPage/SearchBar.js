import React, { useState } from 'react';
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

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleSearch = () => {
    console.log('Searching for:', query);
  };

  return (
    <View nativeID="top" style={styles.wrapper}>
      <View style={[styles.inner, { width: isMobile ? '92%' : '70%' }]}>
        <Text style={styles.heading}>Start Planning Your Next Journey</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Search destinations, itineraries, or events..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f7f9fb',
    paddingBottom: 60,
    alignItems: 'center',
    // 🧨 REMOVE ANY TOP SPACING
    marginTop: 0,
    paddingTop: 0,
  },
  inner: {
    alignItems: 'center',
  },
  heading: {
    paddingTop:30,
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
});

export default SearchBar;
