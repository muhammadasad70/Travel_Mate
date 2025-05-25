


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { Ionicons, Feather } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const screenWidth = Dimensions.get('window').width;
// const isWeb = Platform.OS === 'web';

// const initialItineraries = [
//   { id: '1', title: 'Swat Valley Trip', description: '3-day adventure...', cover: 'https://via.placeholder.com/100' },
//   { id: '2', title: 'Neelum Valley Escape', description: 'Peaceful journey...', cover: 'https://via.placeholder.com/100' },
//   { id: '3', title: 'Murree & Patriata', description: 'Short nature getaway...', cover: 'https://via.placeholder.com/100' },
// ];

// export default function ViewSavedItinerariesScreen() {
//   const [itineraries, setItineraries] = useState(initialItineraries);
//   const navigation = useNavigation();

//   const onDelete = (id) => {
//     Alert.alert(
//       'Delete Itinerary',
//       'Are you sure?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', style: 'destructive', onPress: () => setItineraries(itineraries.filter(i => i.id !== id)) },
//       ]
//     );
//   };

//   const onShare = (itinerary) => {
//     Alert.alert('Share', `Share "${itinerary.title}"`, [
//       { text: 'Share to TravelMate', onPress: () => {} },
//       { text: 'Share via Social', onPress: () => {} },
//       { text: 'Cancel', style: 'cancel' },
//     ]);
//   };

//   const onEdit = (it) => {
//     navigation.navigate('EditItinerary', { itinerary: it });
//   };

//   const onView = (it) => {
//     navigation.navigate('ItineraryDetail', { itinerary: it });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {isWeb && (
//         <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#007bff" />
//         </TouchableOpacity>
//       )}

//       <Text style={styles.heading}>📁 Manage My Itineraries</Text>

//       {itineraries.map((it) => (
//         <View key={it.id} style={styles.card}>
//           <TouchableOpacity onPress={() => onView(it)}>
//             <Image source={{ uri: it.cover }} style={styles.cover} />
//           </TouchableOpacity>
//           <View style={styles.info}>
//             <Text style={styles.title}>{it.title}</Text>
//             <Text style={styles.desc}>{it.description}</Text>
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => onView(it)}>
//                 <Text style={styles.actionText}>View Details</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onEdit(it)}>
//                 <Text style={styles.actionText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onShare(it)}>
//                 <Text style={styles.actionText}>Share</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onDelete(it.id)}>
//                 <Feather name="trash-2" size={16} color="#dc2626" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       ))}

//       {itineraries.length === 0 && (
//         <View style={styles.empty}>
//           <Text style={styles.emptyText}>No itineraries saved yet.</Text>
//           <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateItinerary')}>
//             <Text style={styles.createText}>➕ Create New Itinerary</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f7fafc',
//     paddingTop: Platform.OS === 'web' ? 60 : 20,
//   },
//   back: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   card: {
//     flexDirection: screenWidth < 600 ? 'column' : 'row',
//     backgroundColor: '#fff',
//     marginBottom: 12,
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 2,
//   },
//   cover: {
//     width: 100,
//     height: 100,
//   },
//   info: {
//     flex: 1,
//     padding: 12,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   desc: {
//     fontSize: 13,
//     color: '#555',
//     marginBottom: 8,
//   },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   actionText: {
//     fontSize: 13,
//     color: '#0077b6',
//     marginRight: 16,
//   },
//   empty: {
//     marginTop: 60,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 12,
//   },
//   createBtn: {
//     backgroundColor: '#0077b6',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   createText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { Ionicons, Feather } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const screenWidth = Dimensions.get('window').width;
// const isWeb = Platform.OS === 'web';

// const initialItineraries = [
//   { id: '1', title: 'Swat Valley Trip', description: '3-day adventure...', cover: 'https://via.placeholder.com/100' },
//   { id: '2', title: 'Neelum Valley Escape', description: 'Peaceful journey...', cover: 'https://via.placeholder.com/100' },
//   { id: '3', title: 'Murree & Patriata', description: 'Short nature getaway...', cover: 'https://via.placeholder.com/100' },
// ];

// export default function ViewSavedItinerariesScreen() {
//   const [itineraries, setItineraries] = useState(initialItineraries);
//   const navigation = useNavigation();

//   const onDelete = (id) => {
//     Alert.alert(
//       'Delete Itinerary',
//       'Are you sure?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', style: 'destructive', onPress: () => setItineraries(itineraries.filter(i => i.id !== id)) },
//       ]
//     );
//   };

//   const onShare = (itinerary) => {
//     Alert.alert('Share', `Share "${itinerary.title}"`, [
//       { text: 'Share to TravelMate', onPress: () => {} },
//       { text: 'Share via Social', onPress: () => {} },
//       { text: 'Cancel', style: 'cancel' },
//     ]);
//   };

//   const onEdit = (it) => {
//     navigation.navigate('EditItinerary', { itinerary: it });
//   };

//   const onView = (it) => {
//     navigation.navigate('ItineraryDetail', { itinerary: it });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {isWeb && (
//         <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#007bff" />
//         </TouchableOpacity>
//       )}

//       <Text style={styles.heading}>📁 Manage My Itineraries</Text>

//       {itineraries.map((it) => (
//         <View key={it.id} style={styles.card}>
//           <TouchableOpacity onPress={() => onView(it)}>
//             <Image source={{ uri: it.cover }} style={styles.cover} />
//           </TouchableOpacity>
//           <View style={styles.info}>
//             <Text style={styles.title}>{it.title}</Text>
//             <Text style={styles.desc}>{it.description}</Text>
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => onView(it)}>
//                 <Text style={styles.actionText}>View Details</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onEdit(it)}>
//                 <Text style={styles.actionText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onShare(it)}>
//                 <Text style={styles.actionText}>Share</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onDelete(it.id)}>
//                 <Feather name="trash-2" size={16} color="#dc2626" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       ))}

//       {itineraries.length === 0 && (
//         <View style={styles.empty}>
//           <Text style={styles.emptyText}>No itineraries saved yet.</Text>
//           <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateItinerary')}>
//             <Text style={styles.createText}>➕ Create New Itinerary</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f7fafc',
//     paddingTop: Platform.OS === 'web' ? 60 : 20,
//   },
//   back: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   card: {
//     flexDirection: screenWidth < 600 ? 'column' : 'row',
//     backgroundColor: '#fff',
//     marginBottom: 12,
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 2,
//   },
//   cover: {
//     width: 100,
//     height: 100,
//   },
//   info: {
//     flex: 1,
//     padding: 12,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   desc: {
//     fontSize: 13,
//     color: '#555',
//     marginBottom: 8,
//   },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   actionText: {
//     fontSize: 13,
//     color: '#0077b6',
//     marginRight: 16,
//   },
//   empty: {
//     marginTop: 60,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 12,
//   },
//   createBtn: {
//     backgroundColor: '#0077b6',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   createText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { Ionicons, Feather } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const screenWidth = Dimensions.get('window').width;
// const isWeb = Platform.OS === 'web';

// const initialItineraries = [
//   { id: '1', title: 'Swat Valley Trip', description: '3-day adventure...', cover: 'https://via.placeholder.com/100' },
//   { id: '2', title: 'Neelum Valley Escape', description: 'Peaceful journey...', cover: 'https://via.placeholder.com/100' },
//   { id: '3', title: 'Murree & Patriata', description: 'Short nature getaway...', cover: 'https://via.placeholder.com/100' },
// ];

// export default function ManageItinerariesScreen() {
//   const [itineraries, setItineraries] = useState(initialItineraries);
//   const navigation = useNavigation();

//   const onDelete = (id) => {
//     Alert.alert(
//       'Delete Itinerary',
//       'Are you sure?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', style: 'destructive', onPress: () => setItineraries(itineraries.filter(i => i.id !== id)) },
//       ]
//     );
//   };

//   const onShare = (itinerary) => {
//     navigation.navigate('ShareItinerary', { itinerary });
//   };

//   const onEdit = (it) => {
//     navigation.navigate('EditItinerary', { itinerary: it });
//   };

//   const onView = (it) => {
//     navigation.navigate('ItineraryDetailScreen', { itinerary: it });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {isWeb && (
//         <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#007bff" />
//         </TouchableOpacity>
//       )}

//       <Text style={styles.heading}>📁 Manage My Itineraries</Text>

//       {itineraries.map((it) => (
//         <View key={it.id} style={styles.card}>
//           <TouchableOpacity onPress={() => onView(it)}>
//             <Image source={{ uri: it.cover }} style={styles.cover} />
//           </TouchableOpacity>
//           <View style={styles.info}>
//             <Text style={styles.title}>{it.title}</Text>
//             <Text style={styles.desc}>{it.description}</Text>
//             <View style={styles.actions}>
//               <TouchableOpacity onPress={() => onView(it)}>
//                 <Text style={styles.actionText}>View Details</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onEdit(it)}>
//                 <Text style={styles.actionText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onShare(it)}>
//                 <Text style={styles.actionText}>Share</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onDelete(it.id)}>
//                 <Feather name="trash-2" size={16} color="#dc2626" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       ))}

//       {itineraries.length === 0 && (
//         <View style={styles.empty}>
//           <Text style={styles.emptyText}>No itineraries saved yet.</Text>
//           <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateItinerary')}>
//             <Text style={styles.createText}>➕ Create New Itinerary</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f7fafc',
//     paddingTop: Platform.OS === 'web' ? 60 : 20,
//   },
//   back: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   card: {
//     flexDirection: screenWidth < 600 ? 'column' : 'row',
//     backgroundColor: '#fff',
//     marginBottom: 12,
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 2,
//   },
//   cover: {
//     width: 100,
//     height: 100,
//   },
//   info: {
//     flex: 1,
//     padding: 12,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   desc: {
//     fontSize: 13,
//     color: '#555',
//     marginBottom: 8,
//   },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   actionText: {
//     fontSize: 13,
//     color: '#0077b6',
//     marginRight: 16,
//   },
//   empty: {
//     marginTop: 60,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 12,
//   },
//   createBtn: {
//     backgroundColor: '#0077b6',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   createText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isWeb = Platform.OS === 'web';

const initialItineraries = [
  { id: '1', title: 'Swat Valley Trip', description: '3-day adventure...', cover: 'https://via.placeholder.com/100' },
  { id: '2', title: 'Neelum Valley Escape', description: 'Peaceful journey...', cover: 'https://via.placeholder.com/100' },
  { id: '3', title: 'Murree & Patriata', description: 'Short nature getaway...', cover: 'https://via.placeholder.com/100' },
];

export default function ManageItinerariesScreen() {
  const [itineraries, setItineraries] = useState(initialItineraries);
  const navigation = useNavigation();

  const onDelete = (id) => {
    Alert.alert(
      'Delete Itinerary',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setItineraries(itineraries.filter(i => i.id !== id)) },
      ]
    );
  };

  const onShare = (itinerary) => {
    navigation.navigate('ShareItinerary', { itinerary });
  };

  const onEdit = (it) => {
    navigation.navigate('EditItinerary', { itinerary: it });
  };

  const onView = (it) => {
    navigation.navigate('ItineraryDetailScreen', { itinerary: it });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>📁 Manage My Itineraries</Text>

      {itineraries.map((it) => (
        <View key={it.id} style={styles.card}>
          <TouchableOpacity onPress={() => onView(it)}>
            <Image source={{ uri: it.cover }} style={styles.cover} />
          </TouchableOpacity>
          <View style={styles.info}>
            <Text style={styles.title}>{it.title}</Text>
            <Text style={styles.desc}>{it.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => onView(it)}>
                <Text style={styles.actionText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onEdit(it)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onShare(it)}>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(it.id)}>
                <Feather name="trash-2" size={16} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {itineraries.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No itineraries saved yet.</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateItinerary')}>
            <Text style={styles.createText}>➕ Create New Itinerary</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7fafc',
    paddingTop: Platform.OS === 'web' ? 60 : 20,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: screenWidth < 600 ? 'column' : 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  cover: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionText: {
    fontSize: 13,
    color: '#0077b6',
    marginRight: 16,
  },
  empty: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  createBtn: {
    backgroundColor: '#0077b6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createText: {
    color: '#fff',
    fontWeight: '600',
  },
});
