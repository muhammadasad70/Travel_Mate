

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Platform,
//   BackHandler,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';

// const screenWidth = Dimensions.get('window').width;
// const isWeb = Platform.OS === 'web';

// const ManageTravelerProfileScreen = () => {
//   const navigation = useNavigation();

//   const [form, setForm] = useState({
//     firstName: 'Ali',
//     lastName: 'Raza',
//     email: 'ali.raza@example.com',
//     countryCode: '+92',
//     phone: '3012345678',
//   });

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       navigation.navigate('TravelerDashboard');
//       return true;
//     });

//     return () => backHandler.remove();
//   }, []);

//   const handleChange = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   const handleSubmit = () => {
//     alert('✅ Traveler profile updated successfully!');
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {isWeb && (
//         <TouchableOpacity
//           style={styles.backArrow}
//           onPress={() => navigation.navigate('TravelerDashboard')}
//         >
//           <Ionicons name="arrow-back" size={26} color="#007bff" />
//         </TouchableOpacity>
//       )}

//       <Text style={styles.header}>✏️ Manage Profile</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="First Name"
//         value={form.firstName}
//         onChangeText={(text) => handleChange('firstName', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Last Name"
//         value={form.lastName}
//         onChangeText={(text) => handleChange('lastName', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={form.email}
//         keyboardType="email-address"
//         onChangeText={(text) => handleChange('email', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Country Code"
//         value={form.countryCode}
//         onChangeText={(text) => handleChange('countryCode', text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         value={form.phone}
//         keyboardType="phone-pad"
//         onChangeText={(text) => handleChange('phone', text)}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>💾 Save Changes</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//     flexGrow: 1,
//     paddingTop: 60,
//   },
//   backArrow: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     zIndex: 10,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 20,
//     color: '#003554',
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 14,
//     borderRadius: 10,
//     fontSize: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   button: {
//     backgroundColor: '#0077b6',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default ManageTravelerProfileScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  BackHandler,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isWeb = Platform.OS === 'web';

const ManageTravelerProfileScreen = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    firstName: 'Ali',
    lastName: 'Raza',
    email: 'ali.raza@example.com',
    countryCode: '+92',
    phone: '3012345678',
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('TravelerDashboard');
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    alert('✅ Traveler profile updated successfully!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your profile? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            alert('🗑️ Your profile has been deleted.');
            navigation.navigate('TestHeader'); // or any welcome/landing screen
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.navigate('TravelerDashboard')}
        >
          <Ionicons name="arrow-back" size={26} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.header}>✏️ Manage Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Country Code"
        value={form.countryCode}
        onChangeText={(text) => handleChange('countryCode', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={form.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange('phone', text)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>💾 Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>🗑️ Delete Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
    paddingTop: 60,
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
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManageTravelerProfileScreen;
