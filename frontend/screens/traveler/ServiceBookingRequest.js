
// // import React, { useState } from 'react';
// // import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import getBaseURL from '../../config/env';
// // import { Ionicons } from '@expo/vector-icons';

// // const API_BASE = getBaseURL().replace(/\/+$/, '');
// // const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// // const getAuthToken = async () => { for (const k of TOKEN_KEYS){ const v = await AsyncStorage.getItem(k); if (v) return v; } return null; };

// // const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || '').trim());
// // const showAlert = (title, msg) => {
// //   if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
// //   else Alert.alert(title, msg);
// // };

// // export default function ServiceBookingRequest({ route, navigation }) {
// //   const { id, fixedDates = [] } = route.params || {};
// //   const [participants, setParticipants] = useState('1');
// //   const [date, setDate] = useState('');
// //   const [message, setMessage] = useState('');
// //   const [dateError, setDateError] = useState('');
// //   const [submitting, setSubmitting] = useState(false);

// //   const submit = async () => {
// //     try {
// //       setDateError('');
// //       if (!id) { showAlert('Missing info', 'Service is not specified.'); return; }

// //       const token = await getAuthToken();
// //       if (!token) { showAlert('Login required', 'Please sign in to continue.'); return; }

// //       const dateTrim = (date || '').trim();
// //       if (!isYMD(dateTrim)) {
// //         const msg = 'Please enter date as YYYY-MM-DD.';
// //         setDateError(msg);
// //         showAlert('Pick a date', msg);
// //         return;
// //       }

// //       // Optional client-side hint if service has fixed dates
// //       if (Array.isArray(fixedDates) && fixedDates.length > 0 && !fixedDates.includes(dateTrim)) {
// //         showAlert('Date not available', 'This host only accepts one of the fixed dates shown on the experience.');
// //         return;
// //       }

// //       const p = Math.max(1, parseInt(String(participants || '1'), 10) || 1);

// //       setSubmitting(true);
// //       const res = await fetch(`${API_BASE}/cultural/bookings`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// //         body: JSON.stringify({
// //           service_id: id,
// //           participants: p,
// //           chosen_date: dateTrim,
// //           message: message || '',
// //         }),
// //       });

// //       let json = null;
// //       try { json = await res.json(); } catch {}

// //       if (res.status === 401) {
// //         showAlert('Session expired', 'Please log in again.');
// //         return;
// //       }

// //       if (!res.ok) {
// //         if (res.status === 409) {
// //           showAlert('Already booked', json?.error || 'You already booked this service for that date.');
// //         } else if (res.status === 400) {
// //           showAlert('Invalid data', json?.error || 'Please check your inputs.');
// //         } else {
// //           showAlert('Error', json?.error || 'Could not send booking request.');
// //         }
// //         return;
// //       }

// //       showAlert('Request sent', 'The host will confirm or decline.');
// //       navigation.goBack();
// //     } catch (e) {
// //       showAlert('Error', e.message || 'Could not request');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <View style={{ padding: 12 }}>
// //       <Text style={styles.h1}>Request Booking</Text>

// //       <TextInput
// //         style={styles.inp}
// //         placeholder="Participants"
// //         keyboardType="numeric"
// //         value={participants}
// //         onChangeText={setParticipants}
// //         onSubmitEditing={submit}
// //       />

// //       <TextInput
// //         style={[styles.inp, !!dateError && styles.inpError]}
// //         placeholder="Preferred date (YYYY-MM-DD) — required"
// //         value={date}
// //         onChangeText={(t) => { setDate(t); setDateError(''); }}
// //         onSubmitEditing={submit}
// //       />
// //       {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}

// //       <TextInput
// //         style={[styles.inp, { height: 120, textAlignVertical: 'top' }]}
// //         multiline
// //         placeholder="Message to host (optional)"
// //         value={message}
// //         onChangeText={setMessage}
// //       />

// //       <TouchableOpacity style={[styles.btn, submitting && { opacity: 0.7 }]} onPress={submit} disabled={submitting}>
// //         <Ionicons name="paper-plane-outline" size={16} color="#fff" />
// //         <Text style={styles.btnText}>{submitting ? 'Sending...' : 'Send Request'}</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   h1: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
// //   inp: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 10, marginBottom: 8 },
// //   inpError: { borderColor: '#EF4444' },
// //   errorText: { color: '#EF4444', marginTop: -4, marginBottom: 6, fontSize: 12, fontWeight: '600' },
// //   btn: { backgroundColor: '#0ea5e9', padding: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
// //   btnText: { color: '#fff', fontWeight: '800' },
// // });



// // screens/Traveler/ServiceBookingRequest.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env';
// import { Ionicons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';

// const API_BASE = getBaseURL().replace(/\/+$/, '');
// const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
// const getAuthToken = async () => { for (const k of TOKEN_KEYS){ const v = await AsyncStorage.getItem(k); if (v) return v; } return null; };

// const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || '').trim());
// const showAlert = (title, msg) => {
//   if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
//   else Alert.alert(title, msg);
// };

// export default function ServiceBookingRequest({ route }) {
//   const navigation = useNavigation();
//   const { id, fixedDates = [] } = route.params || {};

//   const [participants, setParticipants] = useState('1');
//   const [date, setDate] = useState('');
//   const [message, setMessage] = useState('');
//   const [dateError, setDateError] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   const handleBack = () => {
//     if (navigation.canGoBack()) navigation.goBack();
//     else navigation.navigate('TravelerDashboard'); // safe fallback
//   };

//   const submit = async () => {
//     try {
//       setDateError('');
//       if (!id) { showAlert('Missing info', 'Service is not specified.'); return; }

//       const token = await getAuthToken();
//       if (!token) { showAlert('Login required', 'Please sign in to continue.'); return; }

//       const dateTrim = (date || '').trim();
//       if (!isYMD(dateTrim)) {
//         const msg = 'Please enter date as YYYY-MM-DD.';
//         setDateError(msg);
//         showAlert('Pick a date', msg);
//         return;
//       }

//       // Optional client-side hint if service has fixed dates
//       if (Array.isArray(fixedDates) && fixedDates.length > 0 && !fixedDates.includes(dateTrim)) {
//         showAlert('Date not available', 'This host only accepts one of the fixed dates shown on the experience.');
//         return;
//       }

//       const p = Math.max(1, parseInt(String(participants || '1'), 10) || 1);

//       setSubmitting(true);
//       const res = await fetch(`${API_BASE}/cultural/bookings`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           service_id: id,
//           participants: p,
//           chosen_date: dateTrim,
//           message: message || '',
//         }),
//       });

//       let json = null;
//       try { json = await res.json(); } catch {}

//       if (res.status === 401) {
//         showAlert('Session expired', 'Please log in again.');
//         return;
//       }

//       if (!res.ok) {
//         if (res.status === 409) {
//           showAlert('Already booked', json?.error || 'You already booked this service for that date.');
//         } else if (res.status === 400) {
//           showAlert('Invalid data', json?.error || 'Please check your inputs.');
//         } else {
//           showAlert('Error', json?.error || 'Could not send booking request.');
//         }
//         return;
//       }

//       showAlert('Request sent', 'The host will confirm or decline.');
//       handleBack();
//     } catch (e) {
//       showAlert('Error', e.message || 'Could not request');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backBtn} onPress={handleBack} hitSlop={8}>
//           <Ionicons name="arrow-back" size={18} color="#0f172a" />
//           <Text style={styles.backTxt}>Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.h1}>Request Booking</Text>
//       </View>

//       <View style={{ padding: 12 }}>
//         <TextInput
//           style={styles.inp}
//           placeholder="Participants"
//           keyboardType="numeric"
//           value={participants}
//           onChangeText={setParticipants}
//           onSubmitEditing={submit}
//         />

//         <TextInput
//           style={[styles.inp, !!dateError && styles.inpError]}
//           placeholder="Preferred date (YYYY-MM-DD) — required"
//           value={date}
//           onChangeText={(t) => { setDate(t); setDateError(''); }}
//           onSubmitEditing={submit}
//         />
//         {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}

//         <TextInput
//           style={[styles.inp, { height: 120, textAlignVertical: 'top' }]}
//           multiline
//           placeholder="Message to host (optional)"
//           value={message}
//           onChangeText={setMessage}
//         />

//         <TouchableOpacity style={[styles.btn, submitting && { opacity: 0.7 }]} onPress={submit} disabled={submitting}>
//           <Ionicons name="paper-plane-outline" size={16} color="#fff" />
//           <Text style={styles.btnText}>{submitting ? 'Sending...' : 'Send Request'}</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     paddingHorizontal: 12,
//     paddingTop: 8,
//     paddingBottom: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E2E8F0',
//     backgroundColor: '#F8FAFC',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   backBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#F1F5F9',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 999,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   backTxt: { fontWeight: '800', color: '#0f172a' },

//   h1: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

//   inp: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 10, marginBottom: 8, marginTop: 8 },
//   inpError: { borderColor: '#EF4444' },
//   errorText: { color: '#EF4444', marginTop: -4, marginBottom: 6, fontSize: 12, fontWeight: '600' },
//   btn: { backgroundColor: '#0ea5e9', padding: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 6 },
//   btnText: { color: '#fff', fontWeight: '800' },
// });



// screens/Traveler/ServiceBookingRequest.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const API_BASE = getBaseURL().replace(/\/+$/, '');
const TOKEN_KEYS = ['token','auth_token','jwt','access_token','AUTH_TOKEN','userToken'];
const getAuthToken = async () => { for (const k of TOKEN_KEYS){ const v = await AsyncStorage.getItem(k); if (v) return v; } return null; };

const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || '').trim());
const showAlert = (title, msg) => {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
};

export default function ServiceBookingRequest({ route }) {
  const navigation = useNavigation();
  const { id, fixedDates = [] } = route.params || {};

  const [participants, setParticipants] = useState('1');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [dateError, setDateError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('TravelerDashboard'); // safe fallback
  };

  const submit = async () => {
    try {
      setDateError('');
      if (!id) { showAlert('Missing info', 'Service is not specified.'); return; }

      const token = await getAuthToken();
      if (!token) { showAlert('Login required', 'Please sign in to continue.'); return; }

      const dateTrim = (date || '').trim();
      if (!isYMD(dateTrim)) {
        const msg = 'Please enter date as YYYY-MM-DD.';
        setDateError(msg);
        showAlert('Pick a date', msg);
        return;
      }

      // Optional client-side hint if service has fixed dates
      if (Array.isArray(fixedDates) && fixedDates.length > 0 && !fixedDates.includes(dateTrim)) {
        showAlert('Date not available', 'This host only accepts one of the fixed dates shown on the experience.');
        return;
      }

      const p = Math.max(1, parseInt(String(participants || '1'), 10) || 1);

      setSubmitting(true);
      const res = await fetch(`${API_BASE}/cultural/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          service_id: id,
          participants: p,
          chosen_date: dateTrim,
          message: message || '',
        }),
      });

      let json = null;
      try { json = await res.json(); } catch {}

      if (res.status === 401) {
        showAlert('Session expired', 'Please log in again.');
        return;
      }

      if (!res.ok) {
        if (res.status === 409) {
          showAlert('Already booked', json?.error || 'You already booked this service for that date.');
        } else if (res.status === 400) {
          showAlert('Invalid data', json?.error || 'Please check your inputs.');
        } else {
          showAlert('Error', json?.error || 'Could not send booking request.');
        }
        return;
      }

      showAlert('Request sent', 'The host will confirm or decline.');
      handleBack();
    } catch (e) {
      showAlert('Error', e.message || 'Could not request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.h1}>Request Booking</Text>
      </View>

      <View style={{ padding: 12 }}>
        <TextInput
          style={styles.inp}
          placeholder="Participants"
          keyboardType="numeric"
          value={participants}
          onChangeText={setParticipants}
          onSubmitEditing={submit}
        />

        <TextInput
          style={[styles.inp, !!dateError && styles.inpError]}
          placeholder="Preferred date (YYYY-MM-DD) — required"
          value={date}
          onChangeText={(t) => { setDate(t); setDateError(''); }}
          onSubmitEditing={submit}
        />
        {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}

        <TextInput
          style={[styles.inp, { height: 120, textAlignVertical: 'top' }]}
          multiline
          placeholder="Message to host (optional)"
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={[styles.btn, submitting && { opacity: 0.7 }]} onPress={submit} disabled={submitting}>
          <Ionicons name="paper-plane-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>{submitting ? 'Sending...' : 'Send Request'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backTxt: { fontWeight: '800', color: '#0f172a' },

  h1: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

  inp: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 10, marginBottom: 8, marginTop: 8 },
  inpError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', marginTop: -4, marginBottom: 6, fontSize: 12, fontWeight: '600' },
  btn: { backgroundColor: '#0ea5e9', padding: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 6 },
  btnText: { color: '#fff', fontWeight: '800' },
});
