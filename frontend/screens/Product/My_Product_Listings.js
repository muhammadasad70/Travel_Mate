import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 900;

const My_Product_Listings = ({ onAddService }) => {
  const navigation = useNavigation();

  // Check if we're in dashboard mode
  const isInDashboard = !!onAddService;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProducts, setShowProducts] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const storedProducts = await AsyncStorage.getItem('my_products');
      const productsList = storedProducts ? JSON.parse(storedProducts) : [];
      setProducts(productsList);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const unsubscribe = navigation.addListener('focus', fetchProducts);
    return unsubscribe;
  }, [fetchProducts, navigation]);

  const handleEdit = (product) => {
    if (onAddService) {
      onAddService(product); // Pass the product data to the callback
    } else {
      navigation.navigate('Add_New_Product', { product });
    }
  };

  const handleDelete = async (productId) => {
    try {
      const storedProducts = await AsyncStorage.getItem('my_products');
      const currentProducts = storedProducts ? JSON.parse(storedProducts) : [];
      const updated = currentProducts.filter((p) => p.id !== productId);
      await AsyncStorage.setItem('my_products', JSON.stringify(updated));
      await fetchProducts();
    } catch {}
  };

  const confirmDelete = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(productId) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {!isInDashboard && <VendorHeader />}
      <ScrollView contentContainerStyle={[styles.container, isInDashboard && { paddingTop: 0 }]}>
        {/* Add Product Card Button */}
        <TouchableOpacity 
          style={styles.addProductCard}
          onPress={() => onAddService ? onAddService() : navigation.navigate('Add_New_Product')}
        >
          <View style={styles.addProductCardContent}>
            <Ionicons name="add-circle" size={24} color="#0ea5e9" />
            <Text style={styles.addProductCardText}>Add Product</Text>
          </View>
        </TouchableOpacity>

        {/* View Products Card Button */}
        <TouchableOpacity 
          style={styles.viewProductsCard}
          onPress={() => setShowProducts(!showProducts)}
        >
          <View style={styles.viewProductsCardContent}>
            <Ionicons name="list" size={24} color="#10b981" />
            <Text style={styles.viewProductsCardText}>View Products</Text>
          </View>
        </TouchableOpacity>

        {showProducts && (
          <>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Products Yet</Text>
                <Text style={styles.emptyText}>
                  Start by adding your first artisanal product using the "Add Product" button above.
                </Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => onAddService ? onAddService() : navigation.navigate('Add_New_Product')}
                >
                  <Text style={styles.addButtonText}>Add New Product</Text>
                </TouchableOpacity>
              </View>
            ) : (
              products.map((product) => {
                const productImage = product.imageUrl && product.imageUrl.trim() ? product.imageUrl.trim() : null;
                
                return (
                  <View key={product.id} style={styles.productBox}>
                    <View style={styles.productRow}>
                      <View style={styles.productContent}>
                        <Text style={styles.productTitle}>{product.name}</Text>
                        <Text style={styles.description}>Category: {product.category}</Text>
                        <Text style={styles.description}>Price: {product.price}</Text>
                        <Text style={styles.description}>Description: {product.description}</Text>
                        <Text style={styles.description}>Contact: {product.contactEmail}</Text>
                        <View style={styles.actionsRow}>
                          <TouchableOpacity 
                            onPress={() => handleEdit(product)} 
                            style={[styles.actionButton, styles.editButton]}
                          >
                            <Text style={styles.actionButtonText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => confirmDelete(product.id)} 
                            style={[styles.actionButton, styles.deleteButton]}
                          >
                            <Text style={styles.actionButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.imageCol}>
                        {productImage ? (
                          <Image source={{ uri: productImage }} style={styles.productImage} resizeMode="cover" />
                        ) : (
                          <View style={[styles.productImage, styles.imagePlaceholder]}>
                            <Text style={styles.imagePlaceholderText}>No image</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            )}

            {products.length > 0 && (
              <Text style={styles.tip}>Add more products using the "Add Product" button above.</Text>
            )}
          </>
        )}
      </ScrollView>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Adjust for fixed header on web
  },
  // Card button styles
  addProductCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  addProductCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProductCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  viewProductsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  viewProductsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProductsCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 8,
  },
  backArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  productBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    minHeight: 180,
  },
  productRow: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  productContent: {
    flex: 1,
  },
  imageCol: {
    width: isMobile ? '100%' : '38%',
    alignSelf: 'stretch',
  },
  productImage: {
    width: '100%',
    height: '100%',
    minHeight: 140,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  tip: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default My_Product_Listings;