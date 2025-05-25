// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
//   Modal,
//   Alert,
//   ScrollView,
//   Pressable,
// } from 'react-native';
// import { Feather, Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const screenWidth = Dimensions.get('window').width;
// const isMobile = screenWidth < 768;

// const DashboardHeader = () => {
//   const [query, setQuery] = useState('');
//   const [showNotification, setShowNotification] = useState(false);

//   const navigation = useNavigation();

//   const dummyNotifications = [
//     '📝 Group Update: New itinerary added by Ali.',
//     '📊 Poll Alert: Vote on next destination.',
//     '💬 Message: New comment on your shared service.',
//   ];

//   const handleSearch = () => {
//     if (!query.trim()) return;
//     console.log('Group search:', query);
//   };

//   return (
//     <View style={styles.headerWrapper}>
//       <View style={styles.header}>
//         <View style={styles.topRow}>
//           <View style={styles.leftGroup}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//               <Ionicons name="arrow-back" size={22} color="#333" />
//             </TouchableOpacity>
//             <View>
//               <Text style={styles.greeting}>Group: Islamabad Adventure</Text>
//               <Text style={styles.subtext}>Planning an unforgettable trip together 🚀</Text>
//             </View>
//           </View>

//           <View style={styles.icons}>
//             <TouchableOpacity
//               style={styles.iconButton}
//               onPress={() => setShowNotification(true)}
//             >
//               <Feather name="bell" size={22} color="#333" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.iconButton}
//               onPress={() => Alert.alert('📨 Opening group messages...')}
//             >
//               <Feather name="message-square" size={22} color="#333" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.searchContainer}>
//           <View style={styles.searchBox}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search group itineraries, events, services..."
//               placeholderTextColor="#888"
//               value={query}
//               onChangeText={setQuery}
//               onSubmitEditing={handleSearch}
//             />
//             <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
//               <Feather name="search" size={22} color="#333" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Notification Modal */}
//       <Modal
//         transparent
//         visible={showNotification}
//         animationType="slide"
//         onRequestClose={() => setShowNotification(false)}
//       >
//         <Pressable
//           style={styles.fullscreenDismiss}
//           onPress={() => setShowNotification(false)}
//         >
//           <View style={styles.notificationBox}>
//             <Text style={styles.notificationTitle}>🔔 Group Notifications</Text>
//             <ScrollView style={styles.notificationList}>
//               {dummyNotifications.map((note, idx) => (
//                 <Text key={idx} style={styles.notificationItem}>{note}</Text>
//               ))}
//             </ScrollView>
//           </View>
//         </Pressable>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerWrapper: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderColor: '#dee2e6',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === 'web' ? 20 : 12,
//     paddingBottom: 16,
//     gap: 12,
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//   },
//   leftGroup: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   backButton: {
//     marginRight: 8,
//   },
//   greeting: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#212529',
//   },
//   subtext: {
//     fontSize: 14,
//     color: '#555',
//   },
//   searchContainer: {
//     width: '100%',
//     alignSelf: 'center',
//     maxWidth: 700,
//     zIndex: 10,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     paddingVertical: Platform.OS === 'web' ? 10 : 8,
//     color: '#212529',
//   },
//   searchIcon: {
//     paddingLeft: 10,
//   },
//   icons: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     gap: 12,
//   },
//   iconButton: {
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//     borderRadius: 100,
//     minWidth: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   fullscreenDismiss: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.1)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-end',
//     paddingTop: 70,
//     paddingRight: 20,
//   },
//   notificationBox: {
//     marginTop: 100,
//     marginRight: 20,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     width: 300,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 4 },
//     maxHeight: 300,
//   },
//   notificationTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 12,
//     color: '#222',
//   },
//   notificationList: {
//     maxHeight: 220,
//   },
//   notificationItem: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     fontSize: 15,
//     color: '#444',
//   },
// });

// export default DashboardHeader;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Modal,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DashboardHeader = () => {
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || width < 768;

  const [query, setQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const navigation = useNavigation();

  const dummyNotifications = [
    '📝 Group Update: New itinerary added by Ali.',
    '📊 Poll Alert: Vote on next destination.',
    '💬 Message: New comment on your shared service.',
  ];

  const handleSearch = () => {
    if (!query.trim()) return;
    console.log('Group search:', query);
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.leftGroup}>
            {isMobile && (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#333" />
              </TouchableOpacity>
            )}
            <View>
              <Text style={styles.greeting}>Group: Islamabad Adventure</Text>
              <Text style={styles.subtext}>Planning an unforgettable trip together 🚀</Text>
            </View>
          </View>

          <View style={styles.icons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowNotification(true)}
            >
              <Feather name="bell" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Alert.alert('📨 Opening group messages...')}
            >
              <Feather name="message-square" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search group itineraries, events, services..."
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
              <Feather name="search" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Notification Modal */}
      <Modal
        transparent
        visible={showNotification}
        animationType="slide"
        onRequestClose={() => setShowNotification(false)}
      >
        <Pressable
          style={styles.fullscreenDismiss}
          onPress={() => setShowNotification(false)}
        >
          <View style={styles.notificationBox}>
            <Text style={styles.notificationTitle}>🔔 Group Notifications</Text>
            <ScrollView style={styles.notificationList}>
              {dummyNotifications.map((note, idx) => (
                <Text key={idx} style={styles.notificationItem}>{note}</Text>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 12,
    paddingBottom: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    marginRight: 8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  subtext: {
    fontSize: 14,
    color: '#555',
  },
  searchContainer: {
    width: '100%',
    alignSelf: 'center',
    maxWidth: 700,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    color: '#212529',
  },
  searchIcon: {
    paddingLeft: 10,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap',
    flexShrink: 1,
  },
  
  iconButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  fullscreenDismiss: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 20,
  },
  notificationBox: {
    marginTop: 100,
    marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    maxHeight: 300,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  notificationList: {
    maxHeight: 220,
  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    fontSize: 15,
    color: '#444',
  },
});

export default DashboardHeader;
