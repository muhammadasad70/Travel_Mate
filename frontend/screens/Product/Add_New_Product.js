import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Add_New_Product = ({ route, onBackToServices }) => {
  const navigation = useNavigation();

  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;
  const editingProduct = route?.params?.product;

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name || '');
      setDescription(editingProduct.description || '');
      setCategory(editingProduct.category || '');
      setPrice(editingProduct.price || '');
      setContactEmail(editingProduct.contactEmail || '');
      setImageUrl(editingProduct.imageUrl || '');
    } else {
      // Clear form for new product
      setProductName('');
      setDescription('');
      setCategory('');
      setPrice('');
      setContactEmail('');
      setImageUrl('');
    }
  }, [editingProduct]);


  const handleSave = async () => {
    if (!productName || !description || !category || !price || !contactEmail) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const productData = {
        name: productName,
        description: description,
        category: category,
        price: price,
        contactEmail: contactEmail,
        imageUrl: imageUrl,
        type: 'artisanal_product'
      };

      // Get existing products from AsyncStorage
      const existingProducts = await AsyncStorage.getItem('my_products');
      const products = existingProducts ? JSON.parse(existingProducts) : [];
      
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map(product => 
          product.id === editingProduct.id 
            ? { ...product, ...productData, updated_at: new Date().toISOString() }
            : product
        );
        await AsyncStorage.setItem('my_products', JSON.stringify(updatedProducts));
        Alert.alert('Success', 'Product updated successfully!');
        // Navigate immediately after showing the alert
        setTimeout(() => {
          if (onBackToServices) {
            onBackToServices();
          } else {
            navigation.goBack();
          }
        }, 100);
      } else {
        // Create new product
        const newProduct = {
          id: Date.now(),
          ...productData,
          created_at: new Date().toISOString(),
        };
        products.unshift(newProduct);
        await AsyncStorage.setItem('my_products', JSON.stringify(products));
        Alert.alert('Success', 'Product saved successfully!');
        // Navigate immediately after showing the alert
        setTimeout(() => {
          if (onBackToServices) {
            onBackToServices();
          } else {
            navigation.goBack();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isInDashboard && <VendorHeader />}
      
      {/* Back Arrow */}
      <TouchableOpacity 
        style={[styles.backButton, isInDashboard && { marginTop: 0 }]}
        onPress={() => onBackToServices ? onBackToServices() : navigation.goBack()}
      >
        <Feather name="arrow-left" size={20} color="#374151" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.titleWithIcon}>
            <Ionicons 
              name={editingProduct ? "create-outline" : "add-circle-outline"} 
              size={24} 
              color="#1f2937" 
              style={{ marginRight: 8 }} 
            />
            <Text style={styles.heading}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={productName}
              onChangeText={setProductName}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describe your product"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Category *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Handicrafts, Food, Textiles"
              value={category}
              onChangeText={setCategory}
            />

            <Text style={styles.label}>Price (PKR) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price in PKR"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <Text style={styles.label}>Contact Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              value={contactEmail}
              onChangeText={setContactEmail}
            />

            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChangeText={setImageUrl}
            />

            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {!isInDashboard && <VendorBottomNavBar />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: isMobile ? 16 : 24,
    paddingVertical: 12,
    marginTop: Platform.OS === 'web' ? 100 : 0, // Increased margin for fixed header on web
  },
  backText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: 8, // Further reduced since back button has more margin
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Add_New_Product;
