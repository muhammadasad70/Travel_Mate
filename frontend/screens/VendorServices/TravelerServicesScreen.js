




// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';

// const isWeb = Platform.OS === 'web';

// const services = [
//   { label: '🏨 Book Accommodation', screen: 'BookAccommodationScreen', color: '#d7f3f7' },
//   { label: '🛍️ Buy Local Products', screen: 'BuyLocalProductsScreen', color: '#ffe3e3' },
//   { label: '🗺️ Book Tour Guide', screen: 'BookTourGuideScreen', color: '#ddfbe6' },
//   { label: '🚌 Book Transport', screen: 'BookTransportScreen', color: '#fff2bd' },
//   { label: '🤝 Be a Cultural Exchanger', screen: 'BookCulturalExchangeScreen', color: '#ead9ff' },
// ];

// const bookings = {
//   Upcoming: {
//     Accommodation: [{ name: 'Skardu Inn', status: 'Confirmed' }],
//     Transport: [{ name: 'Gilgit Jeep', status: 'Pending' }],
//     Tour: [{ name: 'Skardu Hiking Tour', status: 'Pending' }],
//   },
//   Previous: {
//     Product: [{ name: 'Hunza Shawl', status: 'Delivered' }],
//     Cultural: [{ name: 'Local Music Workshop', status: 'Completed' }],
//   },
// };

// export default function TravelerServicesScreen() {
//   const [tab, setTab] = useState('explore');
//   const navigation = useNavigation();

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {isWeb && (
//         <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#007bff" />
//         </TouchableOpacity>
//       )}

//       <Text style={styles.heading}>🎯 Explore Vendor Services</Text>

//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, tab === 'explore' && styles.activeTab]}
//           onPress={() => setTab('explore')}
//         >
//           <Text style={[styles.tabText, tab === 'explore' && styles.activeText]}>Explore Services</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, tab === 'bookings' && styles.activeTab]}
//           onPress={() => setTab('bookings')}
//         >
//           <Text style={[styles.tabText, tab === 'bookings' && styles.activeText]}>My Bookings</Text>
//         </TouchableOpacity>
//       </View>

//       {tab === 'explore' ? (
//         services.map((service, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[styles.card, { backgroundColor: service.color }]}
//             onPress={() => navigation.navigate(service.screen)}
//           >
//             <Text style={styles.cardText}>{service.label}</Text>
//           </TouchableOpacity>
//         ))
//       ) : (
//         <View style={styles.bookingWrapper}>
//           {Object.entries(bookings).map(([category, categories]) => (
//             <View key={category}>
//               <Text style={styles.categoryHeading}>{category} Bookings</Text>
//               {Object.entries(categories).map(([type, items]) => (
//                 <View key={type} style={styles.section}>
//                   <Text style={styles.sectionTitle}>📦 {type}</Text>
//                   {items.map((item, i) => (
//                     <View key={i} style={styles.bookingCard}>
//                       <Text style={styles.bookingName}>{item.name}</Text>
//                       <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
//                     </View>
//                   ))}
//                 </View>
//               ))}
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const getStatusStyle = (status) => {
//   if (status === 'Confirmed') return { color: 'green' };
//   if (status === 'Pending') return { color: '#f59e0b' };
//   if (status === 'Delivered') return { color: '#3b82f6' };
//   if (status === 'Completed') return { color: '#10b981' };
//   return { color: '#666' };
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingTop: Platform.OS === 'web' ? 60 : 20,
//     backgroundColor: '#f7fafd',
//     flexGrow: 1,
//   },
//   back: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     zIndex: 10,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#003366',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   tab: {
//     backgroundColor: '#e5e7eb',
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 20,
//     marginHorizontal: 6,
//   },
//   activeTab: {
//     backgroundColor: '#2563eb',
//   },
//   tabText: {
//     color: '#374151',
//     fontWeight: '600',
//   },
//   activeText: {
//     color: '#fff',
//   },
//   card: {
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 12,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   cardText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#003554',
//   },
//   bookingWrapper: {
//     marginTop: 12,
//   },
//   categoryHeading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 8,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     marginBottom: 8,
//     color: '#111827',
//   },
//   bookingCard: {
//     backgroundColor: '#fff',
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 10,
//     elevation: 1,
//   },
//   bookingName: {
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   status: {
//     marginTop: 4,
//     fontSize: 13,
//     fontWeight: '500',
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const isWeb = Platform.OS === 'web';

const services = [
  { label: '🏨 Book Accommodation', screen: 'AccommodationListingScreen', color: '#d7f3f7' },
  { label: '🛍️ Buy Local Products', screen: 'TravelerProductScreen', color: '#ffe3e3' },
  { label: '🗺️ Book Tour Guide', screen: 'BookTourGuideScreen', color: '#ddfbe6' },
  { label: '🚌 Book Transport', screen: 'BookTransportScreen', color: '#fff2bd' },
  { label: '🤝 Be a Cultural Exchanger', screen: 'CulturalExchangeScreen', color: '#ead9ff' },
];

const bookings = {
  Upcoming: {
    Accommodation: [{ name: 'Skardu Inn', status: 'Confirmed' }],
    Transport: [{ name: 'Gilgit Jeep', status: 'Pending' }],
    Tour: [{ name: 'Skardu Hiking Tour', status: 'Pending' }],
  },
  Previous: {
    Product: [{ name: 'Hunza Shawl', status: 'Delivered' }],
    Cultural: [{ name: 'Local Music Workshop', status: 'Completed' }],
  },
};

export default function TravelerServicesScreen() {
  const [tab, setTab] = useState('explore');
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>🎯 Explore Vendor Services</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'explore' && styles.activeTab]}
          onPress={() => setTab('explore')}
        >
          <Text style={[styles.tabText, tab === 'explore' && styles.activeText]}>Explore Services</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'bookings' && styles.activeTab]}
          onPress={() => setTab('bookings')}
        >
          <Text style={[styles.tabText, tab === 'bookings' && styles.activeText]}>My Bookings</Text>
        </TouchableOpacity>
      </View>

      {tab === 'explore' ? (
        services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: service.color }]}
            onPress={() => navigation.navigate(service.screen)}
          >
            <Text style={styles.cardText}>{service.label}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.bookingWrapper}>
          {Object.entries(bookings).map(([category, categories]) => (
            <View key={category}>
              <Text style={styles.categoryHeading}>{category} Bookings</Text>
              {Object.entries(categories).map(([type, items]) => (
                <View key={type} style={styles.section}>
                  <Text style={styles.sectionTitle}>📦 {type}</Text>
                  {items.map((item, i) => (
                    <View key={i} style={styles.bookingCard}>
                      <Text style={styles.bookingName}>{item.name}</Text>
                      <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const getStatusStyle = (status) => {
  if (status === 'Confirmed') return { color: 'green' };
  if (status === 'Pending') return { color: '#f59e0b' };
  if (status === 'Delivered') return { color: '#3b82f6' };
  if (status === 'Completed') return { color: '#10b981' };
  return { color: '#666' };
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 60 : 20,
    backgroundColor: '#f7fafd',
    flexGrow: 1,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003366',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tab: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#374151',
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  card: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003554',
  },
  bookingWrapper: {
    marginTop: 12,
  },
  categoryHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  bookingCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  bookingName: {
    fontSize: 15,
    fontWeight: '600',
  },
  status: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },
});
