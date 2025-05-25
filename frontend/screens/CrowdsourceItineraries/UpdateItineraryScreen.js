import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;
const isWeb = Platform.OS === 'web';

const mockComments = [
  { id: 1, user: 'Ayesha', comment: 'Add more detail for Day 2 activities.' },
  { id: 2, user: 'Ali', comment: 'Include budget estimates for transport.' },
  { id: 3, user: 'Zara', comment: 'Mention good spots for food in Skardu.' },
];

const UpdateItineraryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { itineraryId, mode } = route.params || {};

  const [title, setTitle] = useState('Skardu Adventure');
  const [overview, setOverview] = useState('A 4-day trek through Skardu valley.');
  const [budget, setBudget] = useState('Mid-Range');
  const [style, setStyle] = useState('Adventure');
  const [days, setDays] = useState([
    { place: 'Skardu City', time: '9AM', activities: 'Explore market & food spots' },
  ]);
  const [images, setImages] = useState([]);
  const [visibility, setVisibility] = useState('public');

  const addDay = () => setDays([...days, { place: '', time: '', activities: '' }]);

  const handleDayChange = (field, value, index) => {
    const updated = [...days];
    updated[index][field] = value;
    setDays(updated);
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = () => {
    const updated = { title, overview, budget, style, days, images, visibility };
    console.log('Updated Itinerary:', updated);
    alert('Itinerary updated based on feedback!');
    navigation.navigate('CrowdsourceItineraries');
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

      <Text style={styles.heading}>✍️ Update Based on Feedback</Text>

      <View style={styles.commentBox}>
        <Text style={styles.commentHeading}>💬 Community Suggestions:</Text>
        {mockComments.map((c) => (
          <Text key={c.id} style={styles.commentText}>
            <Text style={{ fontWeight: '700' }}>{c.user}:</Text> {c.comment}
          </Text>
        ))}
      </View>

      <TextInput style={styles.input} placeholder="Trip Title" value={title} onChangeText={setTitle} />
      <TextInput
        style={styles.input}
        placeholder="Trip Overview"
        value={overview}
        onChangeText={setOverview}
        multiline
      />

      <Text style={styles.label}>Budget</Text>
      <View style={styles.optionsRow}>
        {['Budget-Friendly', 'Mid-Range', 'Luxury'].map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, budget === opt && styles.optionSelected]}
            onPress={() => setBudget(opt)}
          >
            <Text>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Travel Style</Text>
      <View style={styles.optionsRow}>
        {['Adventure', 'Cultural', 'Relaxed'].map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, style === opt && styles.optionSelected]}
            onPress={() => setStyle(opt)}
          >
            <Text>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {days.map((day, index) => (
        <View key={index} style={styles.dayBlock}>
          <Text style={styles.subheading}>Day {index + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Place"
            value={day.place}
            onChangeText={(val) => handleDayChange('place', val, index)}
          />
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={day.time}
            onChangeText={(val) => handleDayChange('time', val, index)}
          />
          <TextInput
            style={styles.input}
            placeholder="Activities"
            value={day.activities}
            onChangeText={(val) => handleDayChange('activities', val, index)}
          />
        </View>
      ))}

      <TouchableOpacity onPress={addDay} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Day</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
        <Text style={styles.uploadText}>+ Upload Cover Images</Text>
      </TouchableOpacity>

      <View style={styles.imagePreviewRow}>
        {images.map((img, index) => (
          <View key={index} style={styles.previewContainer}>
            <Image source={{ uri: img }} style={styles.previewImage} />
            <TouchableOpacity onPress={() => removeImage(index)}>
              <Text style={styles.removeImage}>❌</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Visibility</Text>
      <View style={styles.optionsRow}>
        {['Public', 'Private'].map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, visibility === opt.toLowerCase() && styles.optionSelected]}
            onPress={() => setVisibility(opt.toLowerCase())}
          >
            <Text>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>💾 Save Updates</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  commentBox: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  commentHeading: {
    fontWeight: '700',
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  optionSelected: {
    backgroundColor: '#b3e5fc',
    borderColor: '#0288d1',
  },
  dayBlock: {
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#00796b',
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    color: '#333',
    fontWeight: '500',
  },
  imagePreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  previewContainer: {
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 4,
    fontSize: 12,
    color: 'red',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default UpdateItineraryScreen;
