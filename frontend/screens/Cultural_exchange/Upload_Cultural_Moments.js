import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Upload_Cultural_Moments = () => {
  const navigation = useNavigation();

  const dummyMedia = [
    { id: 1, uri: 'https://placekitten.com/300/200', caption: 'Calligraphy Workshop' },
    { id: 2, uri: 'https://placekitten.com/301/200', caption: 'Cultural Dinner Night' },
    { id: 3, uri: 'https://placekitten.com/302/200', caption: 'Traditional Music Session' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Web-only Back Button */}
        {Platform.OS === 'web' && (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#333" />
            <Text style={styles.backText}>Back to Dashboard</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.heading}>📸 Cultural Moments Gallery</Text>

        <View style={styles.galleryContainer}>
          {dummyMedia.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <Text style={styles.caption}>{item.caption}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.uploadButton}>
            <Feather name="upload" size={20} color="#fff" />
            <Text style={styles.uploadText}>Upload New Moment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#1F2937',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#111827',
  },
  galleryContainer: {
    paddingVertical: 12,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  caption: {
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#F3F4F6',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  uploadText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default Upload_Cultural_Moments;
