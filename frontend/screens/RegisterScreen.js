
// import React, { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import api from '../api';

// const { width } = Dimensions.get('window');

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { selectedRole } = route.params;

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [countryCode, setCountryCode] = useState('');
//   const [phone, setPhone] = useState('');
//   const [country, setCountry] = useState('');

//   const handleRegister = async () => {
//     if (!email || !password || !firstName || !lastName || !countryCode || !phone || !country) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     try {
//       const payload = {
//         email,
//         password,
//         role: selectedRole,
//         first_name: firstName,
//         last_name: lastName,
//         country_code: countryCode,
//         phone,
//         country
//       };

//       const res = await api.post('/auth/complete-registration', payload);
//       Alert.alert('✅ Success', 'Account created');
//       // navigation.navigate(selectedRole === 'vendor' ? 'VendorDashboard' : 'TravelerDashboard');
//       navigation.navigate('Login', { selectedRole });

//     } catch (err) {
//       Alert.alert('❌ Failed', err.response?.data?.error || 'Signup failed');
//     }
//   };

//   const countries = ['United States', 'Pakistan', 'India', 'UK', 'Canada', 'Australia', 'Germany'];
//   const countryCodes = [
//     { label: '+1 (US)', value: '+1' },
//     { label: '+92 (Pakistan)', value: '+92' },
//     { label: '+91 (India)', value: '+91' },
//     { label: '+44 (UK)', value: '+44' },
//     { label: '+61 (Australia)', value: '+61' },
//     { label: '+49 (Germany)', value: '+49' }
//   ];
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.brand}>TravelMate</Text>
//         <Text style={styles.title}>Register as {selectedRole}</Text>
  
//         <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
//         <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />
//         <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
//         <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
  
//         <View style={styles.phoneRow}>
//           <View style={styles.countryCodeWrapper}>
//             <Picker
//               selectedValue={countryCode}
//               onValueChange={setCountryCode}
//               style={styles.picker}
//               dropdownIconColor="#0077b6"
//             >
//               <Picker.Item label="+Code" value="" color="#777" />
//               {countryCodes.map((code) => (
//                 <Picker.Item key={code.value} label={code.label} value={code.value} />
//               ))}
//             </Picker>
//           </View>
//           <TextInput
//             style={styles.phoneInput}
//             placeholder="Phone Number"
//             placeholderTextColor="#aaa"
//             value={phone}
//             onChangeText={setPhone}
//             keyboardType="phone-pad"
//           />
//         </View>
  
//         <View style={styles.pickerWrapper}>
//           <Picker
//             selectedValue={country}
//             onValueChange={setCountry}
//             style={styles.picker}
//             dropdownIconColor="#0077b6"
//           >
//             <Picker.Item label="Select Country" value="" color="#777" />
//             {countries.map((c) => (
//               <Picker.Item key={c} label={c} value={c} />
//             ))}
//           </Picker>
//         </View>
  
//         <TouchableOpacity style={styles.button} onPress={handleRegister}>
//           <Text style={styles.buttonText}>Create Account</Text>
//         </TouchableOpacity>
  
//         <TouchableOpacity onPress={() => navigation.navigate('Login', { selectedRole })}>
//           <Text style={styles.loginLink}>
//             Already have an account? <Text style={styles.login}>Login</Text>
//           </Text>
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
//     paddingVertical: 30,
//     backgroundColor: '#f0f4f8'
//   },
//   card: {
//     width: '95%',
//     maxWidth: 450,
//     backgroundColor: '#fff',
//     padding: width < 360 ? 20 : 30,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 4,
//     alignItems: 'center'
//   },
//   brand: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#003366',
//     marginBottom: 5
//   },
//   title: {
//     fontSize: 18,
//     color: '#333',
//     marginBottom: 20
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     marginBottom: 15
//   },
//   phoneRow: {
//     flexDirection: 'row',
//     width: '100%',
//     marginBottom: 15,
//     gap: 10
//   },
//   countryCodeWrapper: {
//     flex: 1.2,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     overflow: 'hidden'
//   },
//   phoneInput: {
//     flex: 2,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16
//   },
//   pickerWrapper: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     overflow: 'hidden',
//     width: '100%',
//     marginBottom: 20
//   },
//   picker: {
//     height: 50,
//     color: '#333'
//   },
//   button: {
//     backgroundColor: '#0077b6',
//     paddingVertical: 14,
//     borderRadius: 10,
//     width: '100%',
//     marginTop: 10
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center'
//   },
//   loginLink: {
//     marginTop: 20,
//     fontSize: 14,
//     color: '#555'
//   },
//   login: {
//     fontWeight: '600',
//     color: '#0077b6'
//   }
// });
// export default RegisterScreen;

// import React, { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import api from '../api';

// const { width } = Dimensions.get('window');

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { selectedRole } = route.params;

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [countryCode, setCountryCode] = useState('');
//   const [phone, setPhone] = useState('');
//   const [country, setCountry] = useState('');
//   const [errors, setErrors] = useState({});

//   const validateInputs = () => {
//     const newErrors = {};
//     if (!/^[\w.-]+@[\w.-]+\.\w{2,4}$/.test(email)) newErrors.email = 'Invalid email format';
//     if (!/^(?=.*[A-Z]).{6,}$/.test(password)) newErrors.password = 'Min 6 chars, 1 capital letter';
//     if (!/^[A-Za-z]{3,}$/.test(firstName)) newErrors.firstName = 'Min 3 letters';
//     if (!/^[A-Za-z]{3,}$/.test(lastName)) newErrors.lastName = 'Min 3 letters';
//     if (!/^[1-9][0-9]{9}$/.test(phone)) newErrors.phone = '10 digits, no leading 0';
//     if (!/^\+\d{1,4}$/.test(countryCode)) newErrors.countryCode = 'Invalid country code';
//     if (!country) newErrors.country = 'Select country';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleRegister = async () => {
//     if (!validateInputs()) {
//       Platform.OS === 'web' ? alert('❗ Please fix the errors') : null;
//       return;
//     }

//     try {
//       const payload = {
//         email,
//         password,
//         role: selectedRole,
//         first_name: firstName,
//         last_name: lastName,
//         country_code: countryCode,
//         phone,
//         country
//       };

//       const res = await api.post('/auth/complete-registration', payload);

//       Platform.OS === 'web'
//         ? alert('✅ Account created successfully!')
//         : Alert.alert('✅ Success', 'Account created');

//       navigation.navigate('Login', { selectedRole });
//     } catch (err) {
//       const message = err.response?.data?.error || 'Signup failed';
//       Platform.OS === 'web' ? alert('❌ ' + message) : Alert.alert('❌ Failed', message);
//     }
//   };

//   const inputStyle = (field) => [styles.input, errors[field] && { borderColor: 'red' }];

//   const countries = ['United States', 'Pakistan', 'India', 'UK', 'Canada', 'Australia', 'Germany'];
//   const countryCodes = [
//     { label: '+1 (US)', value: '+1' },
//     { label: '+92 (Pakistan)', value: '+92' },
//     { label: '+91 (India)', value: '+91' },
//     { label: '+44 (UK)', value: '+44' },
//     { label: '+61 (Australia)', value: '+61' },
//     { label: '+49 (Germany)', value: '+49' }
//   ];

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.brand}>TravelMate</Text>
//         <Text style={styles.title}>Register as {selectedRole}</Text>

//         <TextInput style={inputStyle('email')} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
//         {errors.email && <Text style={styles.error}>{errors.email}</Text>}

//         <TextInput style={inputStyle('password')} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />
//         {errors.password && <Text style={styles.error}>{errors.password}</Text>}

//         <TextInput style={inputStyle('firstName')} placeholder="First Name" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
//         {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

//         <TextInput style={inputStyle('lastName')} placeholder="Last Name" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
//         {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

//         <View style={styles.phoneRow}>
//           <View style={[styles.countryCodeWrapper, errors.countryCode && { borderColor: 'red' }]}> 
//             <Picker selectedValue={countryCode} onValueChange={setCountryCode} style={styles.picker}>
//               <Picker.Item label="+Code" value="" color="#777" />
//               {countryCodes.map((code) => (
//                 <Picker.Item key={code.value} label={code.label} value={code.value} />
//               ))}
//             </Picker>
//           </View>

//           <TextInput
//             style={[styles.phoneInput, errors.phone && { borderColor: 'red' }]}
//             placeholder="Phone Number"
//             placeholderTextColor="#aaa"
//             value={phone}
//             onChangeText={setPhone}
//             keyboardType="phone-pad"
//           />
//         </View>
//         {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

//         <View style={[styles.pickerWrapper, errors.country && { borderColor: 'red' }]}> 
//           <Picker selectedValue={country} onValueChange={setCountry} style={styles.picker}>
//             <Picker.Item label="Select Country" value="" color="#777" />
//             {countries.map((c) => (
//               <Picker.Item key={c} label={c} value={c} />
//             ))}
//           </Picker>
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleRegister}>
//           <Text style={styles.buttonText}>Create Account</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.navigate('Login', { selectedRole })}>
//           <Text style={styles.loginLink}>
//             Already have an account? <Text style={styles.login}>Login</Text>
//           </Text>
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
//     paddingVertical: 30,
//     backgroundColor: '#f0f4f8'
//   },
//   card: {
//     width: '95%',
//     maxWidth: 450,
//     backgroundColor: '#fff',
//     padding: width < 360 ? 20 : 30,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 4,
//     alignItems: 'center'
//   },
//   brand: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#003366',
//     marginBottom: 5
//   },
//   title: {
//     fontSize: 18,
//     color: '#333',
//     marginBottom: 20
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#ccc'
//   },
//   error: {
//     color: 'red',
//     fontSize: 12,
//     alignSelf: 'flex-start',
//     marginBottom: 5
//   },
//   phoneRow: {
//     flexDirection: 'row',
//     width: '100%',
//     marginBottom: 10,
//     gap: 10
//   },
//   countryCodeWrapper: {
//     flex: 1.2,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#ccc'
//   },
//   phoneInput: {
//     flex: 2,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ccc'
//   },
//   pickerWrapper: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     overflow: 'hidden',
//     width: '100%',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ccc'
//   },
//   picker: {
//     height: 50,
//     color: '#333'
//   },
//   button: {
//     backgroundColor: '#0077b6',
//     paddingVertical: 14,
//     borderRadius: 10,
//     width: '100%',
//     marginTop: 10
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center'
//   },
//   loginLink: {
//     marginTop: 20,
//     fontSize: 14,
//     color: '#555'
//   },
//   login: {
//     fontWeight: '600',
//     color: '#0077b6'
//   }
// });

// export default RegisterScreen;
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedRole } = route.params;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    if (!/^[\w.-]+@[\w.-]+\.\w{2,4}$/.test(email)) newErrors.email = 'Invalid email format';
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) newErrors.password = 'Min 8 chars, 1 capital, 1 special char';
    if (!/^[A-Za-z]{3,}$/.test(firstName)) newErrors.firstName = 'Min 3 letters';
    if (!/^[A-Za-z]{3,}$/.test(lastName)) newErrors.lastName = 'Min 3 letters';
    if (!/^[1-9][0-9]{9}$/.test(phone)) newErrors.phone = '10 digits, no leading 0';
    if (!/^\+\d{1,4}$/.test(countryCode)) newErrors.countryCode = 'Invalid country code';
    if (!country) newErrors.country = 'Select country';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      Platform.OS === 'web' ? alert('❗ Please fix the errors') : null;
      return;
    }

    try {
      const payload = {
        email,
        password,
        role: selectedRole,
        first_name: firstName,
        last_name: lastName,
        country_code: countryCode,
        phone,
        country
      };

      const res = await api.post('/auth/complete-registration', payload);

      Platform.OS === 'web'
        ? alert('✅ Account created successfully!')
        : Alert.alert('✅ Success', 'Account created');

      navigation.navigate('Login', { selectedRole });
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed';
      Platform.OS === 'web' ? alert('❌ ' + message) : Alert.alert('❌ Failed', message);
    }
  };

  const inputStyle = (field) => [styles.input, errors[field] && { borderColor: 'red' }];

  const countries = ['United States', 'Pakistan', 'India', 'UK', 'Canada', 'Australia', 'Germany'];
  const countryCodes = [
    { label: '+1 (US)', value: '+1' },
    { label: '+92 (Pakistan)', value: '+92' },
    { label: '+91 (India)', value: '+91' },
    { label: '+44 (UK)', value: '+44' },
    { label: '+61 (Australia)', value: '+61' },
    { label: '+49 (Germany)', value: '+49' }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.brand}>TravelMate</Text>
        <Text style={styles.title}>Register as {selectedRole}</Text>

        <TextInput style={inputStyle('email')} placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <TextInput style={inputStyle('password')} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <TextInput style={inputStyle('firstName')} placeholder="First Name" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
        {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

        <TextInput style={inputStyle('lastName')} placeholder="Last Name" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
        {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

        <View style={styles.phoneRow}>
          <View style={[styles.countryCodeWrapper, errors.countryCode && { borderColor: 'red' }]}> 
            <Picker selectedValue={countryCode} onValueChange={setCountryCode} style={styles.picker}>
              <Picker.Item label="+Code" value="" color="#777" />
              {countryCodes.map((code) => (
                <Picker.Item key={code.value} label={code.label} value={code.value} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={[styles.phoneInput, errors.phone && { borderColor: 'red' }]}
            placeholder="Phone Number"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

        <View style={[styles.pickerWrapper, errors.country && { borderColor: 'red' }]}> 
          <Picker selectedValue={country} onValueChange={setCountry} style={styles.picker}>
            <Picker.Item label="Select Country" value="" color="#777" />
            {countries.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login', { selectedRole })}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.login}>Login</Text>
          </Text>
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
    paddingVertical: 30,
    backgroundColor: '#f0f4f8'
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
  },
  card: {
    width: '95%',
    maxWidth: 450,
    backgroundColor: '#fff',
    padding: width < 360 ? 20 : 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center'
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  error: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 5
  },
  phoneRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    gap: 10
  },
  countryCodeWrapper: {
    flex: 1.2,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  phoneInput: {
    flex: 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  pickerWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  picker: {
    height: 50,
    color: '#333'
  },
  button: {
    backgroundColor: '#0077b6',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  loginLink: {
    marginTop: 20,
    fontSize: 14,
    color: '#555'
  },
  login: {
    fontWeight: '600',
    color: '#0077b6'
  }
});

export default RegisterScreen;
