// // components/BookingChatBadge.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../config/env';

// const API_BASE = getBaseURL().replace(/\/+$/, '');

// export default function BookingChatBadge() {
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     fetchUnreadCount();
//     const interval = setInterval(fetchUnreadCount, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchUnreadCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;

//       const response = await fetch(`${API_BASE}/booking-chat/unread-count`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUnreadCount(data.unread_count || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching unread count:', error);
//     }
//   };

//   if (unreadCount === 0) return null;

//   return (
//     <View style={styles.badge}>
//       <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   badge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: '#EF4444',
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   badgeText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#fff',
//   },
// });

// components/BookingChatBadge.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');

export default function BookingChatBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const isMountedRef = useRef(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch
    fetchUnreadCount();
    
    // Set up polling
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        fetchUnreadCount();
      }
    }, 30000);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !isMountedRef.current) return;

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE}/booking-chat/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok && isMountedRef.current) {
        const data = await response.json();
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      // Only log non-abort errors
      if (error.name !== 'AbortError' && isMountedRef.current) {
        console.error('Error fetching unread count:', error);
      }
    }
  };

  if (unreadCount === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});