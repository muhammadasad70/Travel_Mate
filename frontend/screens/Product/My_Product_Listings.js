// ✅ Responsive My_Product_Listings.js with Platform-aware Back Arrow

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const My_Product_Listings = () => {
  const navigation = useNavigation();

  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Handmade Hunza Shawl',
      price: 'PKR 3500',
      description: 'Warm, locally crafted woolen shawl from Hunza.',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Multani Pottery Vase',
      price: 'PKR 2000',
      description: 'Traditional hand-painted Multani ceramic vase.',
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header with back arrow (web only) */}
      <View style={styles.header}>
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>My Product Listings</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
  list: {
    padding: isMobile ? 12 : 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    flexDirection: isMobile ? 'column' : 'row',
  },
  image: {
    width: isMobile ? '100%' : 120,
    height: 120,
  },
  info: {
    flex: 1,
    padding: isMobile ? 12 : 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    color: '#2e8b57',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default My_Product_Listings;