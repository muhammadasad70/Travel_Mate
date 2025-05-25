// ✅ Responsive Upload_Product_Gallery.js with Platform-aware Back Arrow

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Upload_Product_Gallery = () => {
  const navigation = useNavigation();
  const [gallery, setGallery] = useState([]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow access to media library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets || [result];
      setGallery([...gallery, ...newImages]);
    }
  };

  const removeImage = (uri) => {
    setGallery(gallery.filter((img) => img.uri !== uri));
  };

  const handleUpload = () => {
    if (gallery.length === 0) {
      Alert.alert('No Images', 'Please select at least one image.');
      return;
    }
    // TODO: Integrate with backend to upload images
    Alert.alert('✅ Success', 'Images uploaded (dummy response).');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Header with back arrow (web only) */}
      <View style={styles.header}>
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Upload Gallery</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🖼️ Upload Product Gallery</Text>

        <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
          <FontAwesome name="image" size={18} color="#fff" />
          <Text style={styles.pickText}>Select Images</Text>
        </TouchableOpacity>

        <View style={styles.galleryGrid}>
          {gallery.map((img) => (
            <View key={img.uri} style={styles.imageContainer}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImage(img.uri)}
              >
                <Text style={styles.removeText}>✖</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Text style={styles.uploadText}>Upload Gallery</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Platform.OS === 'web' ? 12 : 0,
    color: '#111827',
  },
  container: {
    padding: isMobile ? 16 : 24,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  pickText: {
    color: '#fff',
    fontWeight: '600',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: isMobile ? 90 : 100,
    height: isMobile ? 90 : 100,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  uploadText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Upload_Product_Gallery;