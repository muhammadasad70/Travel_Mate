
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Dimensions
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// const ResetPasswordScreen2 = () => {
//   const [token, setToken] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [redirect, setRedirect] = useState(false);
//   const navigation = useNavigation();

//   const handleResetPassword = async () => {
//     if (!token || !newPassword) {
//       Alert.alert('Error', 'Please enter both token and new password');
//       return;
//     }

//     Alert.alert(
//       '✅ Password Changed',
//       'Your password has been updated successfully!',
//       [
//         {
//           text: 'OK',
//           onPress: () => setRedirect(true) // ✅ Set flag
//         }
//       ]
//     );

//     setToken('');
//     setNewPassword('');
//   };

//   useEffect(() => {
//     if (redirect) {
//       const timer = setTimeout(() => {
//         navigation.navigate('Login');
//       }, 200); // small delay to let alert close smoothly

//       return () => clearTimeout(timer);
//     }
//   }, [redirect]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.header}>Reset Password</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Enter reset token"
//           value={token}
//           onChangeText={setToken}
//           autoCapitalize="none"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="New password"
//           value={newPassword}
//           onChangeText={setNewPassword}
//           secureTextEntry
//         />

//         <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
//           <Text style={styles.buttonText}>Update Password</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f8fa'
//   },
//   card: {
//     width: '95%',
//     maxWidth: 450,
//     backgroundColor: '#ffffffee',
//     padding: 25,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 6,
//     alignItems: 'center'
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#003554',
//     marginBottom: 15
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16
//   },
//   button: {
//     backgroundColor: '#0077b6',
//     width: '100%',
//     paddingVertical: 14,
//     borderRadius: 12
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center'
//   }
// });

// export default ResetPasswordScreen2;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const ResetPasswordScreen2 = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!token || !newPassword) {
      Alert.alert('Error', 'Please enter both token and new password');
      return;
    }

    Alert.alert(
      '✅ Password Changed',
      'Your password has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => setRedirect(true)
        }
      ]
    );

    setToken('');
    setNewPassword('');
  };

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        navigation.navigate('Login');
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [redirect]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.header}>Reset Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter reset token"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f8fa'
  },
  backArrow: {
    position: 'absolute',
    top: 30,
    left: 30,
    zIndex: 10,
  },
  card: {
    width: '95%',
    maxWidth: 450,
    backgroundColor: '#ffffffee',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center'
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003554',
    marginBottom: 15
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16
  },
  button: {
    backgroundColor: '#0077b6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default ResetPasswordScreen2;
