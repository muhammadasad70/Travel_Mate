// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';

// const ItineraryDetailScreen = () => {
//   const [visibility, setVisibility] = useState('Private');

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>📝 Create Itinerary</Text>

//       <TextInput placeholder="Trip Title" style={styles.input} value="Skardu Adventure" />
//       <TextInput
//         placeholder="Trip Overview"
//         style={[styles.input, { height: 80 }]}
//         multiline
//         value="A 5-day adventure through the valleys of Skardu exploring lakes, mountains, and culture."
//       />

//       <Text style={styles.label}>Budget</Text>
//       <View style={styles.tagRow}>
//         <Tag label="Budget-Friendly" />
//         <Tag label="Mid-Range" selected />
//         <Tag label="Luxury" />
//       </View>

//       <Text style={styles.label}>Day-by-Day Planner</Text>
//       <View style={styles.tagRow}>
//         <Tag label="Adventure" selected />
//         <Tag label="Cultural" />
//         <Tag label="Relaxed" />
//       </View>

//       <Text style={styles.dayLabel}>Day 1</Text>
//       <TextInput placeholder="Place" style={styles.input} value="Satpara Lake" />
//       <TextInput placeholder="Time" style={styles.input} value="10:00 AM - 2:00 PM" />
//       <TextInput placeholder="Activities" style={styles.input} value="Boating, Lunch, Photography" />

//       <TouchableOpacity style={styles.addBtn}>
//         <Text style={styles.addText}>+ Add Day</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.addBtn}>
//         <Text style={styles.addText}>+ Upload Cover Images</Text>
//       </TouchableOpacity>

//       <Text style={styles.label}>Visibility</Text>
//       <View style={styles.tagRow}>
//         <TouchableOpacity
//           style={[styles.visibilityBtn, visibility === 'Public' && styles.selectedBtn]}
//           onPress={() => setVisibility('Public')}
//         >
//           <Text style={styles.btnText}>Public</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.visibilityBtn, visibility === 'Private' && styles.selectedBtn]}
//           onPress={() => setVisibility('Private')}
//         >
//           <Text style={styles.btnText}>Private</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity style={styles.saveBtn}>
//         <Text style={styles.saveText}>Save Itinerary</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const Tag = ({ label, selected }) => (
//   <View style={[styles.tag, selected && styles.selectedTag]}>
//     <Text style={styles.tagText}>{label}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f9fafa',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#222',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 12,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     marginBottom: 12,
//   },
//   label: {
//     fontWeight: '600',
//     marginBottom: 8,
//     marginTop: 10,
//   },
//   tagRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   tag: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     backgroundColor: '#eee',
//   },
//   selectedTag: {
//     backgroundColor: '#007bff',
//   },
//   tagText: {
//     color: '#000',
//     fontWeight: '500',
//   },
//   dayLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginVertical: 10,
//   },
//   addBtn: {
//     backgroundColor: '#e0f7fa',
//     padding: 10,
//     alignItems: 'center',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   addText: {
//     color: '#007bff',
//     fontWeight: '600',
//   },
//   visibilityBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginRight: 10,
//   },
//   selectedBtn: {
//     backgroundColor: '#007bff',
//     borderColor: '#007bff',
//   },
//   btnText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   saveBtn: {
//     backgroundColor: '#2ecc71',
//     padding: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   saveText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ItineraryDetailScreen;

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  BackHandler,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isWeb = Platform.OS === 'web';

const ItineraryDetailScreen = () => {
  const navigation = useNavigation();

  // ✅ Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('CrowdsourceItineraries');
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const itinerary = {
    title: 'Skardu Adventure',
    overview:
      'A 5-day adventure through the valleys of Skardu exploring lakes, mountains, and culture.',
    budget: 'Mid-Range',
    style: ['Adventure', 'Cultural'],
    visibility: 'Public',
    coverImage:
      'https://images.unsplash.com/photo-1621408617484-c6a1d54f0b33?auto=format&fit=crop&w=1200&q=80',
    days: [
      {
        day: 1,
        place: 'Satpara Lake',
        time: '10:00 AM - 2:00 PM',
        activities: 'Boating, Lunch, Photography',
      },
      {
        day: 2,
        place: 'Shangrila Resort',
        time: '3:00 PM - 6:00 PM',
        activities: 'Sightseeing, Tea, Relaxation',
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CrowdsourceItineraries')}
          style={styles.backArrow}
        >
          <Ionicons name="arrow-back" size={26} color="#007bff" />
        </TouchableOpacity>
      )}

      <Text style={styles.header}>📋 {itinerary.title}</Text>
      <Text style={styles.label}>Overview</Text>
      <Text style={styles.paragraph}>{itinerary.overview}</Text>

      <Image source={{ uri: itinerary.coverImage }} style={styles.image} />

      <Text style={styles.label}>Budget</Text>
      <Text style={styles.tag}>{itinerary.budget}</Text>

      <Text style={styles.label}>Travel Style</Text>
      <View style={styles.tagRow}>
        {itinerary.style.map((s, idx) => (
          <Text key={idx} style={styles.tag}>
            {s}
          </Text>
        ))}
      </View>

      <Text style={styles.label}>Day-by-Day Plan</Text>
      {itinerary.days.map((day) => (
        <View key={day.day} style={styles.dayCard}>
          <Text style={styles.dayTitle}>Day {day.day}: {day.place}</Text>
          <Text style={styles.subText}>🕒 {day.time}</Text>
          <Text style={styles.subText}>🎯 {day.activities}</Text>
        </View>
      ))}

      <Text style={styles.label}>Visibility</Text>
      <Text style={[styles.tag, itinerary.visibility === 'Public' ? styles.public : styles.private]}>
        {itinerary.visibility}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    paddingTop: 60,
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#003366',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
  },
  image: {
    width: screenWidth - 40,
    height: 180,
    borderRadius: 12,
    marginTop: 10,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#dceffe',
    color: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    fontSize: 13,
    fontWeight: '500',
    marginRight: 10,
    marginBottom: 6,
  },
  public: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  private: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dayTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: '#555',
  },
});

export default ItineraryDetailScreen;
