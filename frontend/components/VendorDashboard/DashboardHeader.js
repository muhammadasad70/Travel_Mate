// // VendorDashboardHeader.js

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
//   ScrollView,
//   Pressable,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const screenWidth = Dimensions.get('window').width;
// const isMobile = screenWidth < 768;

// const readableRoles = {
//   accommodation: '🏨 Accommodations Provider',
//   cultural: '🧑‍🤝‍🧑 Cultural Exchanger',
//   tour: '🗺️ Tour Guider',
//   transport: '🚌 Transport Provider',
//   product: '🛍️ Product Seller',
// };

// const roleColors = {
//   accommodation: '#D1FAE5',
//   cultural: '#FBCFE8',
//   tour: '#BAE6FD',
//   transport: '#FDE68A',
//   product: '#E9D5FF',
// };

// const dummySuggestions = [
//   'New Offer: Winter Deal',
//   'Accommodation Booking Insight',
//   'Customer Feedbacks',
//   'Product Orders',
//   'Engagement Stats'
// ];

// const DashboardHeader = () => {
//   const [query, setQuery] = useState('');
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showNotification, setShowNotification] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const route = useRoute();
//   const navigation = useNavigation();
//   const { selectedTypes = [], name = 'Vendor' } = route.params || {};

//   const displayRoleLabels = selectedTypes.map(role => {
//     const actualRole = role === 'hotel' ? 'accommodation' : role;
//     return {
//       label: readableRoles[actualRole] || actualRole,
//       color: roleColors[actualRole] || '#D1FAE5',
//     };
//   });

//   const handleSearch = () => {
//     if (!query.trim()) return;
//     console.log('Searching:', query);
//     setShowSuggestions(false);
//   };

//   return (
//     <View style={styles.header}>
//       <View style={styles.topRow}>
//         <Text style={styles.greeting}>{name ? `Welcome, ${name} 👋` : 'Vendor Dashboard'}</Text>
//       </View>

//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleContainer}>
//         {displayRoleLabels.map((item, index) => (
//           <Text key={index} style={[styles.roleBadge, { backgroundColor: item.color }]}>{item.label}</Text>
//         ))}
//       </ScrollView>

//       <View style={styles.searchContainer}>
//         <View style={styles.searchBox}>
//           <Feather name="search" size={18} color="#666" style={{ marginRight: 6 }} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search vendor features..."
//             placeholderTextColor="#888"
//             value={query}
//             onChangeText={(text) => {
//               setQuery(text);
//               setShowSuggestions(true);
//             }}
//             onFocus={() => setShowSuggestions(true)}
//             onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//             onSubmitEditing={handleSearch}
//           />
//         </View>

//         {showSuggestions && (
//           <View style={styles.suggestionsBox}>
//             {dummySuggestions.map((suggestion, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 onPress={() => {
//                   setQuery(suggestion);
//                   setShowSuggestions(false);
//                   handleSearch();
//                 }}
//                 style={styles.suggestionItem}
//               >
//                 <Text style={styles.suggestionText}>{suggestion}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>

//       <View style={styles.icons}>
//         <TouchableOpacity
//           style={styles.iconButton}
//           onPress={() => setShowNotification(true)}
//         >
//           <Feather name="bell" size={22} color="#333" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.iconButton}
//           onPress={() => setShowProfileMenu(true)}
//         >
//           <Feather name="user" size={22} color="#333" />
//         </TouchableOpacity>
//       </View>

//       <Modal
//         transparent
//         visible={showProfileMenu}
//         animationType="fade"
//         onRequestClose={() => setShowProfileMenu(false)}
//       >
//         <Pressable
//           style={styles.fullscreenDismiss}
//           onPress={() => setShowProfileMenu(false)}
//         >
//           <View style={styles.modalContent}>
//             {['Profile', 'Manage Profile', 'Logout'].map((option, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => {
//                   setShowProfileMenu(false);
//                   if (option === 'Logout') navigation.navigate('TestHeader');
//                   else alert(`${option} clicked`);
//                 }}
//                 style={styles.modalItem}
//               >
//                 <Text style={styles.modalText}>{option}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </Pressable>
//       </Modal>

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
//             <Text style={styles.notificationTitle}>🔔 Notifications</Text>
//             <ScrollView>
//               <Text style={styles.notificationItem}>📢 New booking received</Text>
//               <Text style={styles.notificationItem}>🛒 New product order</Text>
//               <Text style={styles.notificationItem}>📊 Updated analytics available</Text>
//             </ScrollView>
//           </View>
//         </Pressable>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     width: '100%',
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === 'web' ? 20 : 12,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderColor: '#dee2e6',
//     gap: 12,
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//   },
//   greeting: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#212529',
//   },
//   roleContainer: {
//     flexDirection: 'row',
//     gap: 8,
//     paddingVertical: 4,
//   },
//   roleBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     color: '#111827',
//     fontWeight: '500',
//     marginRight: 6,
//   },
//   searchContainer: {
//     width: '100%',
//     alignSelf: 'center',
//     maxWidth: 700,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#212529',
//     paddingVertical: 10,
//   },
//   suggestionsBox: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderTopWidth: 0,
//     borderBottomLeftRadius: 10,
//     borderBottomRightRadius: 10,
//     elevation: 4,
//     zIndex: 999,
//     maxHeight: 200,
//   },
//   suggestionItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   suggestionText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   icons: {
//     flexDirection: 'row',
//     gap: 14,
//     alignSelf: 'center',
//   },
//   iconButton: {
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//     borderRadius: 100,
//   },
//   fullscreenDismiss: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.1)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-end',
//     paddingTop: 70,
//     paddingRight: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     width: 180,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   modalItem: {
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#333',
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
  Dimensions,
  Modal,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const readableRoles = {
  accommodation: '🏨 Accommodations Provider',
  cultural: '🧑‍🤝‍🧑 Cultural Exchanger',
  tour: '🗺️ Tour Guider',
  transport: '🚌 Transport Provider',
  product: '🛍️ Product Seller',
};

const roleColors = {
  accommodation: '#D1FAE5',
  cultural: '#FBCFE8',
  tour: '#BAE6FD',
  transport: '#FDE68A',
  product: '#E9D5FF',
};

const DashboardHeader = () => {
  const [query, setQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { selectedTypes = [], name = 'Vendor' } = route.params || {};

  const displayRoleLabels = selectedTypes.map(role => {
    const actualRole = role === 'hotel' ? 'accommodation' : role;
    return {
      label: readableRoles[actualRole] || actualRole,
      color: roleColors[actualRole] || '#D1FAE5',
    };
  });

  const handleOptionPress = (option) => {
    setShowProfileMenu(false);

    switch (option) {
      case 'Profile':
        navigation.navigate('VendorProfile');
        break;
      case 'Manage Profile':
        navigation.navigate('ManageVendorProfile');
        break;
      case 'Logout':
        navigation.navigate('TestHeader');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.header}>
      {/* Greeting + Roles */}
      <Text style={styles.greeting}>{`Welcome, ${name} 👋`}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleContainer}>
        {displayRoleLabels.map((item, index) => (
          <Text key={index} style={[styles.roleBadge, { backgroundColor: item.color }]}>{item.label}</Text>
        ))}
      </ScrollView>

      {/* Search + Icons */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#666" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vendor features..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.icons}>
          <TouchableOpacity onPress={() => setShowNotification(true)} style={styles.iconButton}>
            <Feather name="bell" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowProfileMenu(true)} style={styles.iconButton}>
            <FontAwesome name="user-circle" size={26} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Modal */}
      <Modal transparent visible={showNotification} animationType="slide" onRequestClose={() => setShowNotification(false)}>
        <Pressable style={styles.fullscreenDismiss} onPress={() => setShowNotification(false)}>
          <View style={styles.notificationBox}>
            <Text style={styles.notificationTitle}>🔔 Notifications</Text>
            <ScrollView style={{ maxHeight: 220 }}>
              <Text style={styles.notificationItem}>📢 New booking received</Text>
              <Text style={styles.notificationItem}>🛒 New product order</Text>
              <Text style={styles.notificationItem}>📊 Analytics updated</Text>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Profile Modal */}
      <Modal transparent visible={showProfileMenu} animationType="fade" onRequestClose={() => setShowProfileMenu(false)}>
        <Pressable style={styles.fullscreenDismiss} onPress={() => setShowProfileMenu(false)}>
          <View style={styles.modalBox}>
            {['Profile', 'Manage Profile', 'Logout'].map((option, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleOptionPress(option)}>
                <Text style={styles.modalText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
    gap: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#111827',
    fontWeight: '500',
    marginRight: 6,
  },
  searchContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
    paddingVertical: 10,
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: isMobile ? 10 : 0,
  },
  iconButton: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  notificationItem: {
    fontSize: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 180,
    elevation: 4,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
});

export default DashboardHeader;
