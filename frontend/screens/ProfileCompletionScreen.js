
// // import React, { useState } from 'react';
// // import {
// //   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, Platform
// // } from 'react-native';
// // import { Picker } from '@react-native-picker/picker';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import api from '../api';

// // const { width } = Dimensions.get('window');

// // const COUNTRY_OPTIONS = [
// //   { country: 'United States', code: '+1' }, { country: 'Pakistan', code: '+92' },
// //   { country: 'India', code: '+91' },        { country: 'United Kingdom', code: '+44' },
// //   { country: 'Canada', code: '+1' },        { country: 'Australia', code: '+61' },
// //   { country: 'Germany', code: '+49' },      { country: 'France', code: '+33' },
// //   { country: 'Italy', code: '+39' },        { country: 'Spain', code: '+34' },
// //   { country: 'China', code: '+86' },        { country: 'Japan', code: '+81' },
// //   { country: 'South Korea', code: '+82' },  { country: 'UAE', code: '+971' },
// //   { country: 'Saudi Arabia', code: '+966' },{ country: 'Turkey', code: '+90' },
// //   { country: 'Malaysia', code: '+60' },     { country: 'Indonesia', code: '+62' },
// //   { country: 'Bangladesh', code: '+880' },  { country: 'Sri Lanka', code: '+94' },
// //   { country: 'Nepal', code: '+977' },       { country: 'Singapore', code: '+65' },
// //   { country: 'Thailand', code: '+66' },     { country: 'Philippines', code: '+63' },
// //   { country: 'South Africa', code: '+27' }, { country: 'Nigeria', code: '+234' },
// //   { country: 'Brazil', code: '+55' },       { country: 'Mexico', code: '+52' },
// //   { country: 'Argentina', code: '+54' },    { country: 'Russia', code: '+7' }
// // ];

// // export default function ProfileCompletionScreen({ navigation, route }) {
// //   const selectedRoleParam = route?.params?.selectedRole;

// //   const [firstName, setFirstName]     = useState('');
// //   const [lastName, setLastName]       = useState('');
// //   const [country, setCountry]         = useState('');
// //   const [countryCode, setCountryCode] = useState('');
// //   const [phone, setPhone]             = useState('');
// //   const [loading, setLoading]         = useState(false);

// //   const showMsg = (title, msg) => {
// //     Platform.OS === 'web' ? alert(`${title ? title + ': ' : ''}${msg}`) : Alert.alert(title || 'Notice', msg);
// //   };

// //   const goToLogin = async () => {
// //     const role = selectedRoleParam || (await AsyncStorage.getItem('role')) || 'traveler';
// //     try {
// //       await AsyncStorage.multiRemove(['token', 'isLoggedIn', 'userId', 'completed']);
// //     } catch {}
// //     navigation.reset({ index: 0, routes: [{ name: 'Login', params: { selectedRole: role } }] });
// //   };

// //   const handleSave = async () => {
// //     const f  = firstName.trim();
// //     const l  = lastName.trim();
// //     const c  = country.trim();
// //     const cc = countryCode.trim();
// //     const ph = phone.trim();

// //     if (!f || !l || !c || !cc || !ph) {
// //       showMsg('Error', 'Please fill all fields.');
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       await api.put('/user/profile', {
// //         first_name: f,
// //         last_name: l,
// //         country_code: cc,
// //         phone: ph,
// //         country: c,
// //       });

// //       if (Platform.OS === 'web') {
// //         alert('✅ Account created successfully! Please log in to continue.');
// //         await goToLogin();
// //       } else {
// //         Alert.alert('Success', 'Account created successfully! Please log in to continue.', [
// //           { text: 'OK', onPress: goToLogin },
// //         ]);
// //       }
// //     } catch (error) {
// //       console.log('❌ Profile update failed:', error?.response?.data || error?.message);
// //       showMsg('Error', 'Failed to save profile.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <View style={styles.card}>
// //         <Text style={styles.title}>Complete Your Profile</Text>

// //         <TextInput
// //           style={styles.input}
// //           placeholder="First Name"
// //           placeholderTextColor="#777"
// //           value={firstName}
// //           onChangeText={setFirstName}
// //         />

// //         <TextInput
// //           style={styles.input}
// //           placeholder="Last Name"
// //           placeholderTextColor="#777"
// //           value={lastName}
// //           onChangeText={setLastName}
// //         />

// //         {/* Country */}
// //         <View style={styles.input}>
// //           <Picker
// //             selectedValue={country}
// //             onValueChange={(val) => {
// //               setCountry(val);
// //               const selected = COUNTRY_OPTIONS.find((c) => c.country === val);
// //               setCountryCode(selected ? selected.code : '');
// //             }}
// //             style={styles.picker}
// //           >
// //             <Picker.Item label="Select Country" value="" color="#777" />
// //             {COUNTRY_OPTIONS.map((c) => (
// //               <Picker.Item key={c.country} label={c.country} value={c.country} />
// //             ))}
// //           </Picker>
// //         </View>

// //         {/* Country Code + Phone */}
// //         <View style={styles.row}>
// //           <TextInput
// //             style={[styles.input, styles.codeInput]}
// //             placeholder="+Code"
// //             placeholderTextColor="#777"
// //             value={countryCode}
// //             editable={false}
// //           />
// //           <TextInput
// //             style={[styles.input, styles.phoneInput]}
// //             placeholder="Phone Number"
// //             placeholderTextColor="#777"
// //             keyboardType="phone-pad"
// //             value={phone}
// //             onChangeText={setPhone}
// //           />
// //         </View>

// //         <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
// //           <Text style={styles.buttonText}>{loading ? 'Saving…' : 'Save & Continue'}</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container:{ flexGrow:1, justifyContent:'center', alignItems:'center', backgroundColor:'#f4f7fb', padding:20 },
// //   card:{ width:'95%', maxWidth:420, backgroundColor:'#fff', padding:25, borderRadius:15, shadowColor:'#000', shadowOpacity:0.15, shadowOffset:{width:0,height:4}, shadowRadius:6, elevation:4 },
// //   title:{ fontSize:20, fontWeight:'700', textAlign:'center', marginBottom:20, color:'#003366' },
// //   input:{ width:'100%', backgroundColor:'#f5f5f5', borderRadius:10, paddingVertical:12, paddingHorizontal:15, fontSize:16, marginBottom:12, borderWidth:1, borderColor:'#ccc' },
// //   picker:{ width:'100%', height:48, fontSize:16, color:'#333' },
// //   row:{ flexDirection:'row', justifyContent:'space-between', gap:10 },
// //   codeInput:{ flex:1 },
// //   phoneInput:{ flex:2 },
// //   button:{ backgroundColor:'#0077b6', paddingVertical:14, borderRadius:10, marginTop:10 },
// //   buttonText:{ color:'#fff', fontWeight:'bold', fontSize:16, textAlign:'center' },
// // });


// // screens/ProfileCompletionScreen.js
// import React, { useMemo, useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, Platform
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../api';

// const { width } = Dimensions.get('window');

// const COUNTRY_OPTIONS = [
//   { country: 'United States', code: '+1' },     { country: 'Pakistan', code: '+92' },
//   { country: 'India', code: '+91' },            { country: 'United Kingdom', code: '+44' },
//   { country: 'Canada', code: '+1' },            { country: 'Australia', code: '+61' },
//   { country: 'Germany', code: '+49' },          { country: 'France', code: '+33' },
//   { country: 'Italy', code: '+39' },            { country: 'Spain', code: '+34' },
//   { country: 'China', code: '+86' },            { country: 'Japan', code: '+81' },
//   { country: 'South Korea', code: '+82' },      { country: 'UAE', code: '+971' },
//   { country: 'Saudi Arabia', code: '+966' },    { country: 'Turkey', code: '+90' },
//   { country: 'Malaysia', code: '+60' },         { country: 'Indonesia', code: '+62' },
//   { country: 'Bangladesh', code: '+880' },      { country: 'Sri Lanka', code: '+94' },
//   { country: 'Nepal', code: '+977' },           { country: 'Singapore', code: '+65' },
//   { country: 'Thailand', code: '+66' },         { country: 'Philippines', code: '+63' },
//   { country: 'South Africa', code: '+27' },     { country: 'Nigeria', code: '+234' },
//   { country: 'Brazil', code: '+55' },           { country: 'Mexico', code: '+52' },
//   { country: 'Argentina', code: '+54' },        { country: 'Russia', code: '+7' }
// ];

// /** Country-specific LOCAL number lengths (digits, without +code). 
//  *  If a country isn't listed, fallback 7–12 digits is used. */
// const PHONE_RULES = {
//   Pakistan: 11,          // enforce exactly 11 as requested (e.g., 03xxxxxxxxx)
//   India: 10,
//   Bangladesh: 10,
//   Nepal: 10,
//   'Sri Lanka': 10,
//   'United States': 10,
//   Canada: 10,
//   'United Kingdom': 10,  // UK can vary; we keep 10 here for simplicity
//   Germany: 10,
//   France: 9,
//   Italy: 10,
//   Spain: 9,
//   China: 11,
//   Japan: 10,
//   'South Korea': 10,
//   UAE: 9,
//   'Saudi Arabia': 9,
//   Turkey: 10,
//   Malaysia: 9,
//   Indonesia: 10,
//   Singapore: 8,
//   Thailand: 9,
//   Philippines: 10,
//   'South Africa': 9,
//   Nigeria: 10,
//   Brazil: 10,           // typically 10 or 11; we accept 10
//   Mexico: 10,
//   Argentina: 10,
//   Russia: 10,           // often 10 after trunk ‘8’/leading zeros stripped
// };

// /* --- Name validation: letters (any language), spaces, hyphens, apostrophes; 
//    min 2 chars; disallow obvious repetitions like hhh/kkk --- */
// const NAME_RE = /^[\p{L}][\p{L}' -]{1,48}$/u;
// const REPEAT_RE = /(.)\1\1/; // 3+ same chars in a row

// function isRealName(s) {
//   const t = (s || '').trim();
//   if (!NAME_RE.test(t)) return false;
//   if (REPEAT_RE.test(t.toLowerCase())) return false;
//   const lettersOnly = t.toLowerCase().replace(/[^a-z\u00c0-\u024f]/g, '');
//   return new Set(lettersOnly).size >= 2;
// }

// function sanitizeDigits(s) {
//   return (s || '').replace(/\D/g, '');
// }

// function validatePhone(country, localDigits) {
//   const target = PHONE_RULES[country];
//   if (typeof target === 'number') {
//     return localDigits.length === target;
//   }
//   // fallback if country not in table
//   return localDigits.length >= 7 && localDigits.length <= 12;
// }

// export default function ProfileCompletionScreen({ navigation, route }) {
//   const selectedRoleParam = route?.params?.selectedRole;

//   const [firstName, setFirstName]     = useState('');
//   const [lastName, setLastName]       = useState('');
//   const [country, setCountry]         = useState('');
//   const [countryCode, setCountryCode] = useState('');
//   const [phone, setPhone]             = useState('');
//   const [loading, setLoading]         = useState(false);

//   const showMsg = (title, msg) => {
//     Platform.OS === 'web'
//       ? alert(`${title ? title + ': ' : ''}${msg}`)
//       : Alert.alert(title || 'Notice', msg);
//   };

//   const goToLogin = async () => {
//     const role = selectedRoleParam || (await AsyncStorage.getItem('role')) || 'traveler';
//     try {
//       await AsyncStorage.multiRemove(['token', 'isLoggedIn', 'userId', 'completed']);
//     } catch {}
//     navigation.reset({ index: 0, routes: [{ name: 'Login', params: { selectedRole: role } }] });
//   };

//   const handleSave = async () => {
//     const f  = firstName.trim();
//     const l  = lastName.trim();
//     const c  = country.trim();
//     const cc = countryCode.trim();
//     const phDigits = sanitizeDigits(phone);

//     // required
//     if (!f || !l || !c || !cc || !phDigits) {
//       showMsg('Error', 'Please fill all fields.');
//       return;
//     }

//     // name checks
//     if (!isRealName(f)) {
//       showMsg('Invalid first name', 'Use real letters only; no “hhh/kkk”; min 2 different letters.');
//       return;
//     }
//     if (!isRealName(l)) {
//       showMsg('Invalid last name', 'Use real letters only; no “hhh/kkk”; min 2 different letters.');
//       return;
//     }

//     // country code check
//     if (!/^\+\d{1,4}$/.test(cc)) {
//       showMsg('Invalid country code', 'Code must start with + and contain 1–4 digits (e.g., +92).');
//       return;
//     }

//     // phone check (country-aware)
//     if (!validatePhone(c, phDigits)) {
//       const extra = c === 'Pakistan'
//         ? 'For Pakistan (+92), enter exactly 11 digits like 03XXXXXXXXX.'
//         : 'Please enter a valid phone number for the selected country.';
//       showMsg('Invalid phone number', extra);
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.put('/user/profile', {
//         first_name: f,
//         last_name: l,
//         country_code: cc,
//         phone: phDigits,
//         country: c,
//       });

//       if (Platform.OS === 'web') {
//         alert('✅ Account created successfully! Please log in to continue.');
//         await goToLogin();
//       } else {
//         Alert.alert('Success', 'Account created successfully! Please log in to continue.', [
//           { text: 'OK', onPress: goToLogin },
//         ]);
//       }
//     } catch (error) {
//       console.log('❌ Profile update failed:', error?.response?.data || error?.message);
//       showMsg('Error', error?.response?.data?.error || 'Failed to save profile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Complete Your Profile</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="First Name"
//           placeholderTextColor="#777"
//           autoCapitalize="words"
//           value={firstName}
//           onChangeText={setFirstName}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Last Name"
//           placeholderTextColor="#777"
//           autoCapitalize="words"
//           value={lastName}
//           onChangeText={setLastName}
//         />

//         {/* Country */}
//         <View style={styles.input}>
//           <Picker
//             selectedValue={country}
//             onValueChange={(val) => {
//               setCountry(val);
//               const selected = COUNTRY_OPTIONS.find((c) => c.country === val);
//               setCountryCode(selected ? selected.code : '');
//             }}
//             style={styles.picker}
//           >
//             <Picker.Item label="Select Country" value="" color="#777" />
//             {COUNTRY_OPTIONS.map((c) => (
//               <Picker.Item key={c.country} label={c.country} value={c.country} />
//             ))}
//           </Picker>
//         </View>

//         {/* Country Code + Phone */}
//         <View style={styles.row}>
//           <TextInput
//             style={[styles.input, styles.codeInput]}
//             placeholder="+Code"
//             placeholderTextColor="#777"
//             value={countryCode}
//             editable={false}
//           />
//           <TextInput
//             style={[styles.input, styles.phoneInput]}
//             placeholder={country === 'Pakistan' ? 'Phone (11 digits, e.g., 03XXXXXXXXX)' : 'Phone Number'}
//             placeholderTextColor="#777"
//             keyboardType="phone-pad"
//             value={phone}
//             onChangeText={(t) => setPhone(t.replace(/[^0-9\s-]/g, ''))} // allow digits, space, dash for UX
//             maxLength={20}
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.button, loading && { opacity: 0.7 }]}
//           onPress={handleSave}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>{loading ? 'Saving…' : 'Save & Continue'}</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container:{ flexGrow:1, justifyContent:'center', alignItems:'center', backgroundColor:'#f4f7fb', padding:20 },
//   card:{ width:'95%', maxWidth:420, backgroundColor:'#fff', padding:25, borderRadius:15, shadowColor:'#000', shadowOpacity:0.15, shadowOffset:{width:0,height:4}, shadowRadius:6, elevation:4 },
//   title:{ fontSize:20, fontWeight:'700', textAlign:'center', marginBottom:20, color:'#003366' },
//   input:{ width:'100%', backgroundColor:'#f5f5f5', borderRadius:10, paddingVertical:12, paddingHorizontal:15, fontSize:16, marginBottom:12, borderWidth:1, borderColor:'#ccc' },
//   picker:{ width:'100%', height:48, fontSize:16, color:'#333' },
//   row:{ flexDirection:'row', justifyContent:'space-between', gap:10 },
//   codeInput:{ flex:1 },
//   phoneInput:{ flex:2 },
//   button:{ backgroundColor:'#0077b6', paddingVertical:14, borderRadius:10, marginTop:10 },
//   buttonText:{ color:'#fff', fontWeight:'bold', fontSize:16, textAlign:'center' },
// });


// screens/ProfileCompletionScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,
  Dimensions, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const { width } = Dimensions.get('window');

const COUNTRY_OPTIONS = [
  { country: 'United States', code: '+1' },     { country: 'Pakistan', code: '+92' },
  { country: 'India', code: '+91' },            { country: 'United Kingdom', code: '+44' },
  { country: 'Canada', code: '+1' },            { country: 'Australia', code: '+61' },
  { country: 'Germany', code: '+49' },          { country: 'France', code: '+33' },
  { country: 'Italy', code: '+39' },            { country: 'Spain', code: '+34' },
  { country: 'China', code: '+86' },            { country: 'Japan', code: '+81' },
  { country: 'South Korea', code: '+82' },      { country: 'UAE', code: '+971' },
  { country: 'Saudi Arabia', code: '+966' },    { country: 'Turkey', code: '+90' },
  { country: 'Malaysia', code: '+60' },         { country: 'Indonesia', code: '+62' },
  { country: 'Bangladesh', code: '+880' },      { country: 'Sri Lanka', code: '+94' },
  { country: 'Nepal', code: '+977' },           { country: 'Singapore', code: '+65' },
  { country: 'Thailand', code: '+66' },         { country: 'Philippines', code: '+63' },
  { country: 'South Africa', code: '+27' },     { country: 'Nigeria', code: '+234' },
  { country: 'Brazil', code: '+55' },           { country: 'Mexico', code: '+52' },
  { country: 'Argentina', code: '+54' },        { country: 'Russia', code: '+7' },
];

const PHONE_RULES = {
  Pakistan: 11,
  India: 10,
  Bangladesh: 10,
  Nepal: 10,
  'Sri Lanka': 10,
  'United States': 10,
  Canada: 10,
  'United Kingdom': 10,
  Germany: 10,
  France: 9,
  Italy: 10,
  Spain: 9,
  China: 11,
  Japan: 10,
  'South Korea': 10,
  UAE: 9,
  'Saudi Arabia': 9,
  Turkey: 10,
  Malaysia: 9,
  Indonesia: 10,
  Singapore: 8,
  Thailand: 9,
  Philippines: 10,
  'South Africa': 9,
  Nigeria: 10,
  Brazil: 10,
  Mexico: 10,
  Argentina: 10,
  Russia: 10,
};

const NAME_RE = /^[\p{L}][\p{L}' -]{1,48}$/u;
const REPEAT_RE = /(.)\1\1/; // 3+ same chars

function isRealName(s) {
  const t = (s || '').trim();
  if (!NAME_RE.test(t)) return false;
  if (REPEAT_RE.test(t.toLowerCase())) return false;
  const lettersOnly = t.toLowerCase().replace(/[^a-z\u00c0-\u024f]/g, '');
  return new Set(lettersOnly).size >= 2;
}

function sanitizeDigits(s) {
  return (s || '').replace(/\D/g, '');
}

function validatePhone(country, localDigits) {
  const target = PHONE_RULES[country];
  if (typeof target === 'number') return localDigits.length === target;
  return localDigits.length >= 7 && localDigits.length <= 12;
}

export default function ProfileCompletionScreen({ navigation, route }) {
  const selectedRoleParam = route?.params?.selectedRole;

  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [country, setCountry]         = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone]             = useState('');
  const [loading, setLoading]         = useState(false);

  const showMsg = (title, msg) => {
    Platform.OS === 'web'
      ? alert(`${title ? title + ': ' : ''}${msg}`)
      : Alert.alert(title || 'Notice', msg);
  };

  // After saving, keep the user logged in and move forward
  const routeForward = async () => {
    const storedRole =
      selectedRoleParam ||
      (await AsyncStorage.getItem('role')) ||
      (await AsyncStorage.getItem('login_role')) ||
      'traveler';

    await AsyncStorage.setItem('completed', 'true');

    if (storedRole === 'vendor') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'VendorTypeSelection' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'TravelerDashboard' }],
      });
    }
  };

  const handleSave = async () => {
    const f  = firstName.trim();
    const l  = lastName.trim();
    const c  = country.trim();
    const cc = countryCode.trim();
    const phDigits = sanitizeDigits(phone);

    // required
    if (!f || !l || !c || !cc || !phDigits) {
      showMsg('Error', 'Please fill all fields.');
      return;
    }

    // name checks
    if (!isRealName(f)) {
      showMsg('Invalid first name', 'Use real letters only; no “hhh/kkk”; min 2 different letters.');
      return;
    }
    if (!isRealName(l)) {
      showMsg('Invalid last name', 'Use real letters only; no “hhh/kkk”; min 2 different letters.');
      return;
    }

    // country code check
    if (!/^\+\d{1,4}$/.test(cc)) {
      showMsg('Invalid country code', 'Code must start with + and contain 1–4 digits (e.g., +92).');
      return;
    }

    // phone check (country-aware)
    if (!validatePhone(c, phDigits)) {
      const extra = c === 'Pakistan'
        ? 'For Pakistan (+92), enter exactly 11 digits like 03XXXXXXXXX.'
        : 'Please enter a valid phone number for the selected country.';
      showMsg('Invalid phone number', extra);
      return;
    }

    try {
      setLoading(true);

      // api instance should already attach Authorization header (Bearer token)
      await api.put('/user/profile', {
        first_name: f,
        last_name: l,
        country_code: cc,
        phone: phDigits,
        country: c,
      });

      showMsg('✅ Success', 'Profile updated successfully.');
      await routeForward();
    } catch (error) {
      console.log('❌ Profile update failed:', error?.response?.data || error?.message);
      showMsg('Error', error?.response?.data?.error || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Complete Your Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#777"
          autoCapitalize="words"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#777"
          autoCapitalize="words"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Country */}
        <View style={styles.input}>
          <Picker
            selectedValue={country}
            onValueChange={(val) => {
              setCountry(val);
              const selected = COUNTRY_OPTIONS.find((c) => c.country === val);
              setCountryCode(selected ? selected.code : '');
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select Country" value="" color="#777" />
            {COUNTRY_OPTIONS.map((c) => (
              <Picker.Item key={c.country} label={c.country} value={c.country} />
            ))}
          </Picker>
        </View>

        {/* Country Code + Phone */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.codeInput]}
            placeholder="+Code"
            placeholderTextColor="#777"
            value={countryCode}
            editable={false}
          />
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder={country === 'Pakistan' ? 'Phone (11 digits, e.g., 03XXXXXXXXX)' : 'Phone Number'}
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/[^0-9\s-]/g, ''))} // allow digits, space, dash for UX
            maxLength={20}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
          accessibilityLabel="Save profile and continue"
        >
          <Text style={styles.buttonText}>{loading ? 'Saving…' : 'Save & Continue'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flexGrow:1, justifyContent:'center', alignItems:'center', backgroundColor:'#f4f7fb', padding:20 },
  card:{ width:'95%', maxWidth:420, backgroundColor:'#fff', padding:25, borderRadius:15, shadowColor:'#000', shadowOpacity:0.15, shadowOffset:{width:0,height:4}, shadowRadius:6, elevation:4 },
  title:{ fontSize:20, fontWeight:'700', textAlign:'center', marginBottom:20, color:'#003366' },
  input:{ width:'100%', backgroundColor:'#f5f5f5', borderRadius:10, paddingVertical:12, paddingHorizontal:15, fontSize:16, marginBottom:12, borderWidth:1, borderColor:'#ccc' },
  picker:{ width:'100%', height:48, fontSize:16, color:'#333' },
  row:{ flexDirection:'row', justifyContent:'space-between', gap:10 },
  codeInput:{ flex:1 },
  phoneInput:{ flex:2 },
  button:{ backgroundColor:'#0077b6', paddingVertical:14, borderRadius:10, marginTop:10 },
  buttonText:{ color:'#fff', fontWeight:'bold', fontSize:16, textAlign:'center' },
});

