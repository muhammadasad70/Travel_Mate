
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const screenWidth = Dimensions.get('window').width;

// const SearchBar = () => {
//   const [query, setQuery] = useState('');

//   const handleSearch = () => {
//     console.log('Searching for:', query);
//   };

//   return (
//     <View style={styles.wrapper}>
//       <View style={styles.container}>
//         <Text style={styles.heading}>Find places, itineraries, events...</Text>

//         <View style={styles.searchBox}>
//           <Ionicons name="search" size={22} color="#666" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Find places, itineraries, events..."
//             placeholderTextColor="#999"
//             value={query}
//             onChangeText={setQuery}
//           />
//           <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
//             <Text style={styles.searchButtonText}>Search</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     backgroundColor: '#f7f9fb',
//     paddingVertical: 60,
//     alignItems: 'center',
//   },
//   container: {
//     width: screenWidth < 768 ? '90%' : '70%',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#003554',
//     textAlign: 'center',
//     marginBottom: 28,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 40,
//     paddingHorizontal: 18,
//     paddingVertical: Platform.OS === 'web' ? 16 : 14,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 17,
//     paddingVertical: 6,
//     color: '#333',
//     outlineStyle: 'none', // for web
//   },
//   searchButton: {
//     backgroundColor: '#00b4d8',
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 22,
//     marginLeft: 12,
//   },
//   searchButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default SearchBar;

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
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: isMobile ? '90%' : '70%' }]}>
        <Text style={styles.heading}>Find places, itineraries, events...</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Find places, itineraries, events..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f7f9fb',
    paddingVertical: 60,
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#003554',
    textAlign: 'center',
    marginBottom: 28,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'web' ? 16 : 14,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 6,
    color: '#333',
    outlineStyle: 'none', // only applies on web
  },
  searchButton: {
    backgroundColor: '#00b4d8',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginLeft: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SearchBar;
