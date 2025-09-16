
// import React, { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, Platform
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../api';

// const { width } = Dimensions.get('window');

// const COUNTRY_OPTIONS = [
//   { country: 'United States', code: '+1' },
//   { country: 'Pakistan', code: '+92' },
//   { country: 'India', code: '+91' },
//   { country: 'United Kingdom', code: '+44' },
//   { country: 'Canada', code: '+1' },
//   { country: 'Australia', code: '+61' },
//   { country: 'Germany', code: '+49' },
//   { country: 'France', code: '+33' },
//   { country: 'Italy', code: '+39' },
//   { country: 'Spain', code: '+34' },
//   { country: 'China', code: '+86' },
//   { country: 'Japan', code: '+81' },
//   { country: 'South Korea', code: '+82' },
//   { country: 'UAE', code: '+971' },
//   { country: 'Saudi Arabia', code: '+966' },
//   { country: 'Turkey', code: '+90' },
//   { country: 'Malaysia', code: '+60' },
//   { country: 'Indonesia', code: '+62' },
//   { country: 'Bangladesh', code: '+880' },
//   { country: 'Sri Lanka', code: '+94' },
//   { country: 'Nepal', code: '+977' },
//   { country: 'Singapore', code: '+65' },
//   { country: 'Thailand', code: '+66' },
//   { country: 'Philippines', code: '+63' },
//   { country: 'South Africa', code: '+27' },
//   { country: 'Nigeria', code: '+234' },
//   { country: 'Brazil', code: '+55' },
//   { country: 'Mexico', code: '+52' },
//   { country: 'Argentina', code: '+54' },
//   { country: 'Russia', code: '+7' }
// ];

// export default function ProfileCompletionScreen({ navigation, route }) {
//   const selectedRoleParam = route?.params?.selectedRole;

//   const [firstName, setFirstName]     = useState('');
//   const [lastName, setLastName]       = useState('');
//   const [country, setCountry]         = useState('');
//   const [countryCode, setCountryCode] = useState('');
//   const [city, setCity]               = useState('');
//   const [phone, setPhone]             = useState('');
//   const [loading, setLoading]         = useState(false);

//   const showMsg = (title, msg) => {
//     if (Platform.OS === 'web') alert(`${title ? title + ': ' : ''}${msg}`);
//     else Alert.alert(title || 'Notice', msg);
//   };

//   const goToLogin = async () => {
//     const role = selectedRoleParam || (await AsyncStorage.getItem('role')) || 'traveler';
//     // Optional: clear temp token so user must log in
//     try { await AsyncStorage.removeItem('token'); } catch {}
//     try { await AsyncStorage.removeItem('completed'); } catch {}

//     // Reset stack to Login
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login', params: { selectedRole: role } }],
//     });
//   };

//   const handleSave = async () => {
//     const f  = firstName.trim();
//     const l  = lastName.trim();
//     const c  = country.trim();
//     const cc = countryCode.trim();
//     const ci = city.trim();
//     const ph = phone.trim();

//     if (!f || !l || !c || !cc || !ci || !ph) {
//       showMsg('Error', 'Please fill all fields.');
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.put('/user/profile', {
//         first_name: f,
//         last_name: l,
//         country_code: cc,
//         phone: ph,
//         country: c,
//         city: ci,
//       });

//       // Success → tell user profile is completed and ask them to login
//       if (Platform.OS === 'web') {
//         alert('✅ Account created successfully! Please log in to continue.');
//         await goToLogin();
//       } else {
//         Alert.alert(
//           'Success',
//           'Account created successfully! Please log in to continue.',
//           [{ text: 'OK', onPress: goToLogin }]
//         );
//       }
//     } catch (error) {
//       console.log('❌ Profile update failed:', error?.response?.data || error?.message);
//       showMsg('Error', 'Failed to save profile.');
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
//           value={firstName}
//           onChangeText={setFirstName}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Last Name"
//           placeholderTextColor="#777"
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

//         {/* City (manual) */}
//         <TextInput
//           style={styles.input}
//           placeholder="City"
//           placeholderTextColor="#777"
//           value={city}
//           onChangeText={setCity}
//           editable={!!country}
//         />

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
//             placeholder="Phone Number"
//             placeholderTextColor="#777"
//             keyboardType="phone-pad"
//             value={phone}
//             onChangeText={setPhone}
//           />
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
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


import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const { width } = Dimensions.get('window');

const COUNTRY_OPTIONS = [
  { country: 'United States', code: '+1' }, { country: 'Pakistan', code: '+92' },
  { country: 'India', code: '+91' },        { country: 'United Kingdom', code: '+44' },
  { country: 'Canada', code: '+1' },        { country: 'Australia', code: '+61' },
  { country: 'Germany', code: '+49' },      { country: 'France', code: '+33' },
  { country: 'Italy', code: '+39' },        { country: 'Spain', code: '+34' },
  { country: 'China', code: '+86' },        { country: 'Japan', code: '+81' },
  { country: 'South Korea', code: '+82' },  { country: 'UAE', code: '+971' },
  { country: 'Saudi Arabia', code: '+966' },{ country: 'Turkey', code: '+90' },
  { country: 'Malaysia', code: '+60' },     { country: 'Indonesia', code: '+62' },
  { country: 'Bangladesh', code: '+880' },  { country: 'Sri Lanka', code: '+94' },
  { country: 'Nepal', code: '+977' },       { country: 'Singapore', code: '+65' },
  { country: 'Thailand', code: '+66' },     { country: 'Philippines', code: '+63' },
  { country: 'South Africa', code: '+27' }, { country: 'Nigeria', code: '+234' },
  { country: 'Brazil', code: '+55' },       { country: 'Mexico', code: '+52' },
  { country: 'Argentina', code: '+54' },    { country: 'Russia', code: '+7' }
];

export default function ProfileCompletionScreen({ navigation, route }) {
  const selectedRoleParam = route?.params?.selectedRole;

  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [country, setCountry]         = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone]             = useState('');
  const [loading, setLoading]         = useState(false);

  const showMsg = (title, msg) => {
    Platform.OS === 'web' ? alert(`${title ? title + ': ' : ''}${msg}`) : Alert.alert(title || 'Notice', msg);
  };

  const goToLogin = async () => {
    const role = selectedRoleParam || (await AsyncStorage.getItem('role')) || 'traveler';
    try {
      await AsyncStorage.multiRemove(['token', 'isLoggedIn', 'userId', 'completed']);
    } catch {}
    navigation.reset({ index: 0, routes: [{ name: 'Login', params: { selectedRole: role } }] });
  };

  const handleSave = async () => {
    const f  = firstName.trim();
    const l  = lastName.trim();
    const c  = country.trim();
    const cc = countryCode.trim();
    const ph = phone.trim();

    if (!f || !l || !c || !cc || !ph) {
      showMsg('Error', 'Please fill all fields.');
      return;
    }

    try {
      setLoading(true);
      await api.put('/user/profile', {
        first_name: f,
        last_name: l,
        country_code: cc,
        phone: ph,
        country: c,
      });

      if (Platform.OS === 'web') {
        alert('✅ Account created successfully! Please log in to continue.');
        await goToLogin();
      } else {
        Alert.alert('Success', 'Account created successfully! Please log in to continue.', [
          { text: 'OK', onPress: goToLogin },
        ]);
      }
    } catch (error) {
      console.log('❌ Profile update failed:', error?.response?.data || error?.message);
      showMsg('Error', 'Failed to save profile.');
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
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#777"
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
            placeholder="Phone Number"
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
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
