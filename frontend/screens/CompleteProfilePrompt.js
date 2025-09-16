

// import React, { useEffect, useState } from 'react';
// import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../api';

// export default function CompleteProfilePrompt({ navigation, delayMs = 5000 }) {
//   const [visible, setVisible] = useState(false);
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const t = setTimeout(async () => {
//       // 🚦 Don’t run if not logged in / no token
//       const [isLoggedIn, token] = await Promise.all([
//         AsyncStorage.getItem('isLoggedIn'),
//         AsyncStorage.getItem('token'),
//       ]);
//       if (isLoggedIn !== 'true' || !token) {
//         setChecking(false);
//         return;
//       }

//       try {
//         // Use cached status if available
//         const cached = await AsyncStorage.getItem('completed');
//         if (cached === 'true') {
//           setChecking(false);
//           return;
//         }

//         // Hit backend for profile status
//         const res = await api.get('/user/profile-status'); // token auto-added by interceptor
//         const completed = !!res.data?.completed;

//         await AsyncStorage.setItem('completed', String(completed));
//         setVisible(!completed);
//       } catch (err) {
//         console.warn('Profile check failed:', err.userMessage || err.message);
//       } finally {
//         setChecking(false);
//       }
//     }, delayMs);

//     return () => clearTimeout(t);
//   }, [delayMs]);

//   if (checking || !visible) return null;

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       transparent
//       onRequestClose={() => setVisible(false)}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.box}>
//           <Text style={styles.title}>Complete Your Profile 🎯</Text>
//           <Text style={styles.sub}>
//             You’re almost ready! Add your details to unlock the full TravelMate experience.
//           </Text>
//           <View style={styles.actions}>
//             <TouchableOpacity
//               style={[styles.btn, styles.primary]}
//               onPress={() => {
//                 setVisible(false);
//                 navigation.navigate('ProfileCompletion');
//               }}
//             >
//               <Text style={styles.btnText}>Complete Now</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={() => setVisible(false)}>
//               <Text style={[styles.btnText, { color: '#0f172a' }]}>Later</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   box: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     width: Platform.OS === 'web' ? 400 : '90%',
//     gap: 12,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0f172a',
//   },
//   sub: {
//     fontSize: 14,
//     color: '#475569',
//     marginTop: 4,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 18,
//     gap: 12,
//   },
//   btn: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   primary: {
//     backgroundColor: '#2563eb',
//   },
//   secondary: {
//     backgroundColor: '#f1f5f9',
//   },
//   btnText: {
//     fontWeight: '600',
//     color: '#fff',
//   },
// });


// screens/CompleteProfilePrompt.js

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const SNOOZE_KEY = 'profilePromptSnoozeUntil';
const COMPLETED_KEY = 'completed';

export default function CompleteProfilePrompt({ navigation, delayMs = 5000 }) {
  const [visible, setVisible] = useState(false);
  const [checking, setChecking] = useState(true);
  const openedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        // 0) must be logged in with a token
        const [isLoggedIn, token] = await Promise.all([
          AsyncStorage.getItem('isLoggedIn'),
          AsyncStorage.getItem('token'),
        ]);
        if (isLoggedIn !== 'true' || !token) {
          if (mountedRef.current) setChecking(false);
          return;
        }

        // 1) respect snooze
        const snoozeStr = await AsyncStorage.getItem(SNOOZE_KEY);
        if (snoozeStr) {
          const until = Number(snoozeStr);
          if (!Number.isNaN(until) && Date.now() < until) {
            if (mountedRef.current) setChecking(false);
            return;
          }
        }

        // 2) always check backend (ignore cache truth)
        let completed = false;
        try {
          const res = await api.get('/user/profile-status');
          completed = !!res.data?.completed;
        } catch {
          if (mountedRef.current) setChecking(false);
          return;
        }

        await AsyncStorage.setItem(COMPLETED_KEY, String(completed));

        if (!completed && !openedRef.current && mountedRef.current) {
          openedRef.current = true;
          setVisible(true);
        }
      } finally {
        if (mountedRef.current) setChecking(false);
      }
    }, delayMs);

    return () => clearTimeout(t);
  }, [delayMs]);

  if (checking || !visible) return null;

  const handleLater = async () => {
    setVisible(false);
    const twentyFourHrs = Date.now() + 24 * 60 * 60 * 1000;
    await AsyncStorage.setItem(SNOOZE_KEY, String(twentyFourHrs));
  };

  const handleCompleteNow = () => {
    setVisible(false);
    navigation?.navigate?.('ProfileCompletion');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Complete Your Profile 🎯</Text>
          <Text style={styles.sub}>
            You’re almost ready! Add your details to unlock the full TravelMate experience.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.primary]} onPress={handleCompleteNow}>
              <Text style={styles.btnText}>Complete Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={handleLater}>
              <Text style={[styles.btnText, { color: '#0f172a' }]}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* -------- styles -------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: Platform.select({ web: 420, default: '92%' }),
    gap: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 16px 40px rgba(2, 6, 23, 0.18)' }
      : { elevation: 6 }),
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  sub: { fontSize: 14, color: '#475569', marginTop: 4 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 12,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primary: { backgroundColor: '#2563eb' },
  secondary: { backgroundColor: '#f1f5f9' },
  btnText: { fontWeight: '700', color: '#fff' },
});
