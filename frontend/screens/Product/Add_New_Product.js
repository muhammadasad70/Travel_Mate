// ✅ Responsive Add_New_Product.js with Platform-Aware Back Arrow

import React from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Add_New_Product = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Back Arrow Header */}
      <View style={styles.header}>
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>🛍️ Add New Product</Text>

        {/* Product 1 */}
        <Text style={styles.subHeading}>Product 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          defaultValue="Hunza Handmade Shawl"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Description"
          multiline
          numberOfLines={3}
          defaultValue="A beautifully woven traditional shawl made in Hunza with premium wool."
        />
        <TextInput
          style={styles.input}
          placeholder="Price (PKR)"
          keyboardType="numeric"
          defaultValue="2500"
        />
        <TextInput
          style={styles.input}
          placeholder="Category (e.g. Handicrafts, Food)"
          defaultValue="Handicrafts"
        />

        {/* Product 2 */}
        <Text style={styles.subHeading}>Product 2</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          defaultValue="Multani Blue Pottery Vase"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Description"
          multiline
          numberOfLines={3}
          defaultValue="Elegant blue pottery vase from Multan, perfect for decor."
        />
        <TextInput
          style={styles.input}
          placeholder="Price (PKR)"
          keyboardType="numeric"
          defaultValue="1800"
        />
        <TextInput
          style={styles.input}
          placeholder="Category (e.g. Handicrafts, Food)"
          defaultValue="Handicrafts"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Submit Products</Text>
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
    padding: isMobile ? 16 : 32,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B5563',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#374151',
  },
  input: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  textarea: {
    height: 90,
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Add_New_Product;
