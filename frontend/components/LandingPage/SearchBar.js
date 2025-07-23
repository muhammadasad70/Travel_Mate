// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   useWindowDimensions,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const SearchBar = () => {
//   const [query, setQuery] = useState('');
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;

//   const handleSearch = () => {
//     console.log('Searching for:', query);
//   };

//   return (
//     <View nativeID="top" style={styles.wrapper}>
//       <View style={[styles.inner, { width: isMobile ? '92%' : '70%' }]}>
//         <Text style={styles.heading}>Start Planning Your Next Journey</Text>
//         <View style={styles.searchBox}>
//           <Ionicons name="search" size={22} color="#666" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Search destinations, itineraries, or events..."
//             placeholderTextColor="#999"
//             value={query}
//             onChangeText={setQuery}
//           />
//           <TouchableOpacity style={styles.button} onPress={handleSearch}>
//             <Text style={styles.buttonText}>Search</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     backgroundColor: '#f7f9fb',
//     paddingBottom: 60,
//     alignItems: 'center',
//     // 🧨 REMOVE ANY TOP SPACING
//     marginTop: 0,
//     paddingTop: 0,
//   },
//   inner: {
//     alignItems: 'center',
//   },
//   heading: {
//     paddingTop:30,
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#003554',
//     textAlign: 'center',
//     marginBottom: 26,
//     maxWidth: 720,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 40,
//     paddingHorizontal: 18,
//     paddingVertical: Platform.OS === 'web' ? 16 : 14,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 17,
//     paddingVertical: 6,
//     color: '#222',
//     outlineStyle: 'none',
//   },
//   button: {
//     backgroundColor: '#00b4d8',
//     borderRadius: 22,
//     paddingHorizontal: 22,
//     paddingVertical: 10,
//     marginLeft: 12,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 15,
//   },
// });

// export default SearchBar;


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   useWindowDimensions,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const SearchBar = () => {
//   const [query, setQuery] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;
//   const navigation = useNavigation();

//   const dropdownItems = [
//     'Itineraries',
//     'Top Events',
//     'Cultural Exchange',
//     'Top Travelers',
//     'Service Providers',
//   ];

//   const handleItemClick = (item) => {
//     setShowDropdown(false);
//     if (Platform.OS === 'web') {
//       const confirmed = window.confirm(
//         `To explore ${item}, please sign up or log in first.`
//       );
//       if (confirmed) navigation.navigate('RoleSelection');
//     } else {
//       Alert.alert(
//         'Join TravelMate',
//         `To explore ${item}, please sign up or log in.`,
//         [{ text: 'OK', onPress: () => navigation.navigate('RoleSelection') }]
//       );
//     }
//   };

//   return (
//     <View nativeID="top" style={styles.wrapper}>
//       <View style={[styles.inner, { width: isMobile ? '92%' : '70%' }]}>
//         <Text style={styles.heading}>Start Planning Your Next Journey</Text>
//         <View style={styles.searchBox}>
//           <Ionicons name="search" size={22} color="#666" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Search destinations, itineraries, or events..."
//             placeholderTextColor="#999"
//             value={query}
//             onChangeText={setQuery}
//             onFocus={() => setShowDropdown(true)}
//           />
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Search</Text>
//           </TouchableOpacity>
//         </View>

//         {showDropdown && (
//           <ScrollView style={styles.dropdown} nestedScrollEnabled>
//             {dropdownItems.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.dropdownItem}
//                 onPress={() => handleItemClick(item)}
//               >
//                 <Text style={styles.dropdownText}>{item}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     backgroundColor: '#f7f9fb',
//     paddingBottom: 60,
//     alignItems: 'center',
//     marginTop: 0,
//     paddingTop: 0,
//   },
//   inner: {
//     alignItems: 'center',
//     position: 'relative',
//     zIndex: 5,
//   },
//   heading: {
//     paddingTop: 30,
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#003554',
//     textAlign: 'center',
//     marginBottom: 26,
//     maxWidth: 720,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 40,
//     paddingHorizontal: 18,
//     paddingVertical: Platform.OS === 'web' ? 16 : 14,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 17,
//     paddingVertical: 6,
//     color: '#222',
//     outlineStyle: 'none',
//   },
//   button: {
//     backgroundColor: '#00b4d8',
//     borderRadius: 22,
//     paddingHorizontal: 22,
//     paddingVertical: 10,
//     marginLeft: 12,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 15,
//   },
//   dropdown: {
//     backgroundColor: '#fff',
//     marginTop: 10,
//     borderRadius: 10,
//     maxHeight: 200,
//     width: '100%',
//     borderColor: '#ddd',
//     borderWidth: 1,
//     zIndex: 10,
//   },
//   dropdownItem: {
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   dropdownText: {
//     fontSize: 16,
//     color: '#333',
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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const navigation = useNavigation();

  const handleItemPress = (item) => {
    const promptMsg = `To explore ${item}, please sign up or log in.`;
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(promptMsg);
      if (confirmed) {
        navigation.navigate('RoleSelection');
      }
    } else {
      Alert.alert(
        'Authentication Required',
        promptMsg,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join Now', onPress: () => navigation.navigate('RoleSelection') },
        ],
        { cancelable: true }
      );
    }
    setShowDropdown(false);
  };

  const handleSearchClick = () => {
    setShowDropdown(true); // Show dropdown only on input click
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
            onFocus={handleSearchClick}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.button} onPress={() => setShowDropdown(true)}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {showDropdown && (
          <View style={styles.dropdown}>
            {['Itineraries', 'Top Events', 'Cultural Exchange', 'Top Travelers', 'Service Providers'].map((item) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f7f9fb',
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
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





