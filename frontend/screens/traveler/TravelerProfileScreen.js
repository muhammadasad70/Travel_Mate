// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';

// const TravelerProfileScreen = () => {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>👤 My Profile</Text>

//       <Text style={styles.label}>First Name</Text>
//       <Text style={styles.value}>Ali</Text>

//       <Text style={styles.label}>Last Name</Text>
//       <Text style={styles.value}>Raza</Text>

//       <Text style={styles.label}>Email</Text>
//       <Text style={styles.value}>ali.raza@example.com</Text>

//       <Text style={styles.label}>Country Code</Text>
//       <Text style={styles.value}>+92</Text>

//       <Text style={styles.label}>Phone Number</Text>
//       <Text style={styles.value}>3012345678</Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 20,
//     color: '#003554',
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#555',
//     marginTop: 14,
//   },
//   value: {
//     fontSize: 16,
//     color: '#222',
//     marginTop: 4,
//   },
// });

// export default TravelerProfileScreen;


import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const isWeb = Platform.OS === 'web';

const TravelerProfileScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('TravelerDashboard');
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Web back arrow */}
      {isWeb && (
        <TouchableOpacity
          onPress={() => navigation.navigate('TravelerDashboard')}
          style={styles.backArrow}
        >
          <Ionicons name="arrow-back" size={26} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.header}>👤 My Profile</Text>

      <Text style={styles.label}>First Name</Text>
      <Text style={styles.value}>Ali</Text>

      <Text style={styles.label}>Last Name</Text>
      <Text style={styles.value}>Raza</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>ali.raza@example.com</Text>

      <Text style={styles.label}>Country Code</Text>
      <Text style={styles.value}>+92</Text>

      <Text style={styles.label}>Phone Number</Text>
      <Text style={styles.value}>3012345678</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    paddingTop: 60,
    flexGrow: 1,
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#003554',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 14,
  },
  value: {
    fontSize: 16,
    color: '#222',
    marginTop: 4,
  },
});

export default TravelerProfileScreen;
