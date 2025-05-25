// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   Platform,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const isWeb = Platform.OS === 'web';
// const screenWidth = Dimensions.get('window').width;
// const isMobile = screenWidth < 768;

// const destinations = ['Hunza', 'Skardu', 'Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Gilgit', 'Swat', 'Azad Kashmir', 'KP'];
// const categories = ['Cultural', 'Food & Drink', 'Music', 'Arts', 'Sports'];

// const eventData = [
//     {
//       title: 'Cultural Parade',
//       date: 'April 25',
//       location: 'Hunza · Cultural',
//       image: 'https://images.unsplash.com/photo-1608889175127-68d18eec8b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     },
//     {
//       title: 'Street Food Market',
//       date: 'March 25',
//       location: 'Islamabad · Food & Drink',
//       image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     },
//     {
//       title: 'Traditional Dance Show',
//       date: 'June 5',
//       location: 'Skardu · Cultural',
//       image: 'https://images.unsplash.com/photo-1549307756-42b9387b47b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     },
//     {
//       title: 'Music Fiesta',
//       date: 'August 17',
//       location: 'Lahore · Music',
//       image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     },
//     {
//       title: 'Wine Tasting Tour',
//       date: 'October 3',
//       location: 'Swat · Food & Drink',
//       image: 'https://images.unsplash.com/photo-1600077108033-5e664fbd38c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     },
//     {
//       title: 'Marathon Event',
//       date: 'September 20',
//       location: 'Islamabad · Sports',
//       image: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     },
//   ];
  

// const EventIntegrationScreen = () => {
//   const navigation = useNavigation();
//   const [showDestinations, setShowDestinations] = useState(false);
//   const [showCategories, setShowCategories] = useState(false);
//   const [selectedDestination, setSelectedDestination] = useState('Destination');
//   const [selectedCategory, setSelectedCategory] = useState('Category');

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {isWeb && (
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
//           <Ionicons name="arrow-back" size={24} color="#007bff" />
//         </TouchableOpacity>
//       )}
//       <Text style={styles.heading}>Event Integration</Text>
//       <Text style={styles.subheading}>Explore upcoming events and effortlessly add them to your itinerary.</Text>

//       {/* Filters */}
//       <View style={styles.filtersRow}>
//         <View style={styles.dropdownWrapper}>
//           <TouchableOpacity style={styles.dropdown} onPress={() => setShowDestinations(!showDestinations)}>
//             <Text style={styles.dropdownText}>{selectedDestination}</Text>
//           </TouchableOpacity>
//           {showDestinations && (
//             <View style={styles.dropdownMenu}>
//               {destinations.map((dest, index) => (
//                 <Text key={index} style={styles.dropdownItem}>{dest}</Text>
//               ))}
//             </View>
//           )}
//         </View>

//         <TouchableOpacity style={styles.dropdown}>
//           <Text style={styles.dropdownText}>Date</Text>
//         </TouchableOpacity>

//         <View style={styles.dropdownWrapper}>
//           <TouchableOpacity style={styles.dropdown} onPress={() => setShowCategories(!showCategories)}>
//             <Text style={styles.dropdownText}>{selectedCategory}</Text>
//           </TouchableOpacity>
//           {showCategories && (
//             <View style={styles.dropdownMenu}>
//               {categories.map((cat, index) => (
//                 <Text key={index} style={styles.dropdownItem}>{cat}</Text>
//               ))}
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Event Cards */}
//       <View style={styles.cardGrid}>
//         {eventData.map((event, index) => (
//           <View key={index} style={styles.card}>
//             <Image source={{ uri: event.image }} style={styles.image} />
//             <Text style={styles.date}>{event.date}</Text>
//             <Text style={styles.title}>{event.title}</Text>
//             <Text style={styles.location}>{event.location}</Text>
//             <TouchableOpacity style={styles.actionButton}>
//               <Text style={styles.buttonText}>➕ Add to Itinerary</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Text style={styles.buttonText}>🗓️ Sync with Calendar</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Text style={styles.buttonText}>📤 Share</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 16, backgroundColor: '#fff' },
//   backArrow: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
//   heading: { fontSize: 22, fontWeight: '700', marginTop: isWeb ? 40 : 0, color: '#222' },
//   subheading: { fontSize: 14, color: '#555', marginBottom: 20 },
//   filtersRow: {
//     flexDirection: isMobile ? 'column' : 'row',
//     gap: 12,
//     marginBottom: 16,
//     zIndex: 100,
//   },
//   dropdownWrapper: {
//     position: 'relative',
//   },
//   dropdown: {
//     backgroundColor: '#f1f3f5',
//     padding: 10,
//     borderRadius: 8,
//     minWidth: 120,
//   },
//   dropdownText: {
//     color: '#333',
//     fontWeight: '600',
//   },
//   dropdownMenu: {
//     backgroundColor: '#fff',
//     position: 'absolute',
//     top: 44,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 6,
//     zIndex: 100,
//   },
//   dropdownItem: {
//     padding: 6,
//     fontSize: 13,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#eee',
//   },
//   cardGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 16,
//     justifyContent: isMobile ? 'center' : 'flex-start',
//   },
//   card: {
//     width: isMobile ? '90%' : '30%',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   image: {
//     width: '100%',
//     height: 130,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   date: { fontSize: 13, color: '#999' },
//   title: { fontSize: 15, fontWeight: '700', marginVertical: 4 },
//   location: { fontSize: 13, color: '#555', marginBottom: 10 },
//   actionButton: {
//     paddingVertical: 8,
//     borderRadius: 6,
//     backgroundColor: '#007bff',
//     marginBottom: 6,
//     alignItems: 'center',
//   },
//   buttonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
// });

// export default EventIntegrationScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const isWeb = Platform.OS === 'web';
const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const destinations = ['Hunza', 'Skardu', 'Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Gilgit', 'Swat', 'Azad Kashmir', 'KP'];
const categories = ['Cultural', 'Food & Drink', 'Music', 'Arts', 'Sports'];
const eventData = [
  {
    title: 'Cultural Parade',
    date: 'April 25',
    location: 'Hunza · Cultural',
    image: 'https://picsum.photos/seed/parade/600/400',
  },
  {
    title: 'Street Food Market',
    date: 'March 25',
    location: 'Islamabad · Food & Drink',
    image: 'https://picsum.photos/seed/streetfood/600/400',
  },
  {
    title: 'Traditional Dance Show',
    date: 'June 5',
    location: 'Skardu · Cultural',
    image: 'https://picsum.photos/seed/danceshow/600/400',
  },
  {
    title: 'Music Fiesta',
    date: 'August 17',
    location: 'Lahore · Music',
    image: 'https://picsum.photos/seed/music/600/400',
  },
  {
    title: 'Wine Tasting Tour',
    date: 'October 3',
    location: 'Swat · Food & Drink',
    image: 'https://picsum.photos/seed/winetour/600/400',
  },
  {
    title: 'Marathon Event',
    date: 'September 20',
    location: 'Islamabad · Sports',
    image: 'https://picsum.photos/seed/marathon/600/400',
  },
];

const EventIntegrationScreen = () => {
  const navigation = useNavigation();
  const [showDestinations, setShowDestinations] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Destination');
  const [selectedCategory, setSelectedCategory] = useState('Category');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}
      <Text style={styles.heading}>Event Integration</Text>
      <Text style={styles.subheading}>Explore upcoming events and effortlessly add them to your itinerary.</Text>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowDestinations(!showDestinations)}>
            <Text style={styles.dropdownText}>{selectedDestination}</Text>
          </TouchableOpacity>
          {showDestinations && (
            <View style={styles.dropdownMenu}>
              {destinations.map((dest, index) => (
                <Text key={index} style={styles.dropdownItem}>{dest}</Text>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Date</Text>
        </TouchableOpacity>

        <View style={styles.dropdownWrapper}>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowCategories(!showCategories)}>
            <Text style={styles.dropdownText}>{selectedCategory}</Text>
          </TouchableOpacity>
          {showCategories && (
            <View style={styles.dropdownMenu}>
              {categories.map((cat, index) => (
                <Text key={index} style={styles.dropdownItem}>{cat}</Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Event Cards */}
      <View style={styles.cardGrid}>
        {eventData.map((event, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: event.image }} style={styles.image} />
            <Text style={styles.date}>{event.date}</Text>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.location}>{event.location}</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>➕ Add to Itinerary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>🗓️ Sync with Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>📤 Share</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  backArrow: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
  heading: { fontSize: 22, fontWeight: '700', marginTop: isWeb ? 40 : 0, color: '#222' },
  subheading: { fontSize: 14, color: '#555', marginBottom: 20 },
  filtersRow: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 12,
    marginBottom: 16,
    zIndex: 100,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdown: {
    backgroundColor: '#f1f3f5',
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
  },
  dropdownText: {
    color: '#333',
    fontWeight: '600',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 44,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 6,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 6,
    fontSize: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: isMobile ? 'center' : 'flex-start',
  },
  card: {
    width: isMobile ? '90%' : '30%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
  },
  date: { fontSize: 13, color: '#999' },
  title: { fontSize: 15, fontWeight: '700', marginVertical: 4 },
  location: { fontSize: 13, color: '#555', marginBottom: 10 },
  actionButton: {
    paddingVertical: 6,  // reduced from 8
    borderRadius: 6,
    backgroundColor: '#007bff',
    marginBottom: 5,
    alignItems: 'center',
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 12,        // reduced from 13
    fontWeight: '600',
  },
  
});

export default EventIntegrationScreen;
