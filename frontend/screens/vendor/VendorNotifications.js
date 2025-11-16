// // screens/vendor/VendorNotifications.js
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from '../../config/env'; // ✅ Import your config

// const API_URL = getBaseURL().replace(/\/+$/, ''); // ✅ Use your existing config

// // Rest of the code remains the same...

// export default function VendorNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filter, setFilter] = useState('all'); // 'all' or 'unread'

//   useEffect(() => {
//     fetchNotifications();
//   }, [filter]);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
      
//       const url = filter === 'unread' 
//         ? `${API_URL}/notifications?unread=true` 
//         : `${API_URL}/notifications?limit=50`;

//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setNotifications(response.data || []);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       Alert.alert('Error', 'Failed to load notifications');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchNotifications();
//   }, [filter]);

//   const markAsRead = async (notificationId) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       await axios.patch(
//         `${API_URL}/notifications/${notificationId}/read`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update local state
//       setNotifications((prev) =>
//         prev.map((n) =>
//           n.id === notificationId ? { ...n, is_read: true } : n
//         )
//       );
//     } catch (error) {
//       console.error('Error marking as read:', error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       await axios.patch(
//         `${API_URL}/notifications/read-all`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update local state
//       setNotifications((prev) =>
//         prev.map((n) => ({ ...n, is_read: true }))
//       );
      
//       Alert.alert('Success', 'All notifications marked as read');
//     } catch (error) {
//       console.error('Error marking all as read:', error);
//       Alert.alert('Error', 'Failed to mark all as read');
//     }
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       await axios.delete(
//         `${API_URL}/notifications/${notificationId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//       Alert.alert('Error', 'Failed to delete notification');
//     }
//   };

//   const handleNotificationPress = (notification) => {
//     if (!notification.is_read) {
//       markAsRead(notification.id);
//     }
    
//     // Navigate based on notification type
//     if (notification.related_type === 'booking') {
//       // You can add navigation logic here
//       // navigation.navigate('RequestDetails', { bookingId: notification.related_id });
//     }
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInMs = now - date;
//     const diffInMinutes = Math.floor(diffInMs / 60000);
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     const diffInDays = Math.floor(diffInHours / 24);

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInHours < 24) return `${diffInHours}h ago`;
//     if (diffInDays < 7) return `${diffInDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'booking_request':
//         return { name: 'calendar', color: '#3B82F6' };
//       case 'booking_confirmed':
//         return { name: 'check-circle', color: '#10B981' };
//       case 'booking_declined':
//         return { name: 'x-circle', color: '#EF4444' };
//       case 'booking_cancelled':
//         return { name: 'slash', color: '#F59E0B' };
//       default:
//         return { name: 'bell', color: '#6B7280' };
//     }
//   };

//   const renderNotification = ({ item }) => {
//     const icon = getNotificationIcon(item.type);

//     return (
//       <TouchableOpacity
//         style={[
//           styles.notificationCard,
//           !item.is_read && styles.unreadCard,
//         ]}
//         onPress={() => handleNotificationPress(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.notificationContent}>
//           {/* Icon */}
//           <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
//             <Feather name={icon.name} size={20} color={icon.color} />
//           </View>

//           {/* Content */}
//           <View style={styles.textContainer}>
//             <View style={styles.titleRow}>
//               {!item.is_read && <View style={styles.unreadDot} />}
//               <Text style={styles.title}>{item.title}</Text>
//             </View>
//             <Text style={styles.message}>{item.message}</Text>
//             <Text style={styles.time}>{formatTime(item.created_at)}</Text>
//           </View>

//           {/* Actions */}
//           <View style={styles.actions}>
//             {!item.is_read && (
//               <TouchableOpacity
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   markAsRead(item.id);
//                 }}
//                 style={styles.actionButton}
//               >
//                 <Feather name="check" size={18} color="#6B7280" />
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity
//               onPress={(e) => {
//                 e.stopPropagation();
//                 Alert.alert(
//                   'Delete Notification',
//                   'Are you sure you want to delete this notification?',
//                   [
//                     { text: 'Cancel', style: 'cancel' },
//                     { 
//                       text: 'Delete', 
//                       style: 'destructive',
//                       onPress: () => deleteNotification(item.id),
//                     },
//                   ]
//                 );
//               }}
//               style={styles.actionButton}
//             >
//               <Feather name="trash-2" size={18} color="#EF4444" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#3B82F6" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.filterContainer}>
//           <TouchableOpacity
//             style={[
//               styles.filterButton,
//               filter === 'all' && styles.filterButtonActive,
//             ]}
//             onPress={() => setFilter('all')}
//           >
//             <Text
//               style={[
//                 styles.filterText,
//                 filter === 'all' && styles.filterTextActive,
//               ]}
//             >
//               All
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.filterButton,
//               filter === 'unread' && styles.filterButtonActive,
//             ]}
//             onPress={() => setFilter('unread')}
//           >
//             <Text
//               style={[
//                 styles.filterText,
//                 filter === 'unread' && styles.filterTextActive,
//               ]}
//             >
//               Unread {unreadCount > 0 && `(${unreadCount})`}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {unreadCount > 0 && (
//           <TouchableOpacity
//             style={styles.markAllButton}
//             onPress={markAllAsRead}
//           >
//             <Text style={styles.markAllText}>Mark all as read</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Notifications List */}
//       <FlatList
//         data={notifications}
//         renderItem={renderNotification}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContainer}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Feather name="bell-off" size={48} color="#D1D5DB" />
//             <Text style={styles.emptyText}>No notifications yet</Text>
//             <Text style={styles.emptySubtext}>
//               You'll see booking requests and updates here
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     gap: 12,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   filterButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     backgroundColor: '#F3F4F6',
//   },
//   filterButtonActive: {
//     backgroundColor: '#3B82F6',
//   },
//   filterText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   filterTextActive: {
//     color: '#fff',
//   },
//   markAllButton: {
//     alignSelf: 'flex-end',
//   },
//   markAllText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#3B82F6',
//   },
//   listContainer: {
//     padding: 12,
//     gap: 8,
//   },
//   notificationCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     overflow: 'hidden',
//   },
//   unreadCard: {
//     backgroundColor: '#EFF6FF',
//     borderColor: '#BFDBFE',
//   },
//   notificationContent: {
//     flexDirection: 'row',
//     padding: 12,
//     gap: 12,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textContainer: {
//     flex: 1,
//     gap: 4,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#3B82F6',
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1F2937',
//     flex: 1,
//   },
//   message: {
//     fontSize: 14,
//     color: '#6B7280',
//     lineHeight: 20,
//   },
//   time: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 2,
//   },
//   actions: {
//     flexDirection: 'row',
//     gap: 8,
//     alignItems: 'flex-start',
//   },
//   actionButton: {
//     padding: 4,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//     gap: 8,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#6B7280',
//     marginTop: 12,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//   },
// });


// screens/vendor/VendorNotifications.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const API_URL = getBaseURL().replace(/\/+$/, '');

// ✅ Token helper (matching your other files)
const TOKEN_KEYS = ['token', 'auth_token', 'jwt', 'access_token', 'AUTH_TOKEN', 'userToken'];
const getAuthToken = async () => {
  for (const k of TOKEN_KEYS) {
    const v = await AsyncStorage.getItem(k);
    if (v) return v;
  }
  return null;
};

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken(); // ✅ Use token helper
      
      if (!token) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      const url = filter === 'unread' 
        ? `${API_URL}/notifications?unread=true` 
        : `${API_URL}/notifications?limit=50`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // ✅ Add timeout
      });

      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.code !== 'ECONNABORTED') {
        Alert.alert('Error', 'Failed to load notifications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [filter]);

  const markAsRead = async (notificationId) => {
    try {
      const token = await getAuthToken();
      
      await axios.patch(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await getAuthToken();
      
      await axios.patch(
        `${API_URL}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = await getAuthToken();
      
      await axios.delete(
        `${API_URL}/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_request':
        return { name: 'calendar', color: '#3B82F6' };
      case 'booking_confirmed':
        return { name: 'check-circle', color: '#10B981' };
      case 'booking_declined':
        return { name: 'x-circle', color: '#EF4444' };
      case 'booking_cancelled':
        return { name: 'slash', color: '#F59E0B' };
      default:
        return { name: 'bell', color: '#6B7280' };
    }
  };

  const renderNotification = ({ item }) => {
    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.is_read && styles.unreadCard,
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
            <Feather name={icon.name} size={20} color={icon.color} />
          </View>

          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              {!item.is_read && <View style={styles.unreadDot} />}
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{formatTime(item.created_at)}</Text>
          </View>

          <View style={styles.actions}>
            {!item.is_read && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  markAsRead(item.id);
                }}
                style={styles.actionButton}
              >
                <Feather name="check" size={18} color="#6B7280" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                Alert.alert(
                  'Delete Notification',
                  'Are you sure you want to delete this notification?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive',
                      onPress: () => deleteNotification(item.id),
                    },
                  ]
                );
              }}
              style={styles.actionButton}
            >
              <Feather name="trash-2" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'unread' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('unread')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'unread' && styles.filterTextActive,
              ]}
            >
              {/* ✅ Fixed: Wrap in Text */}
              Unread {unreadCount > 0 && <Text>({unreadCount})</Text>}
            </Text>
          </TouchableOpacity>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              You'll see booking requests and updates here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12, // ✅ Added gap
  },
  loadingText: { // ✅ Added loading text style
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  markAllButton: {
    alignSelf: 'flex-end',
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  listContainer: {
    padding: 12,
    gap: 8,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  unreadCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});