// ✅ Responsive Manage_Orders.js with Platform-aware Back Arrow

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Manage_Orders = () => {
  const navigation = useNavigation();

  const [orders, setOrders] = useState([
    {
      id: '101',
      product: 'Handmade Hunza Shawl',
      buyer: 'Ali Raza',
      date: 'May 22, 2025',
      status: 'Pending',
    },
    {
      id: '102',
      product: 'Multani Pottery Vase',
      buyer: 'Zara Khan',
      date: 'May 21, 2025',
      status: 'Shipped',
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.orderInfo}>
        <Text style={styles.productName}>🛍️ {item.product}</Text>
        <Text style={styles.detail}>👤 Buyer: {item.buyer}</Text>
        <Text style={styles.detail}>📅 Date: {item.date}</Text>
        <Text style={styles.detail}>
          📦 Status: <Text style={styles.status}>{item.status}</Text>
        </Text>
      </View>
      <View style={styles.buttons}>
        {item.status === 'Pending' && (
          <>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleUpdateStatus(item.id, 'Shipped')}
            >
              <Text style={styles.btnText}>Mark as Shipped</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => handleUpdateStatus(item.id, 'Cancelled')}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'Shipped' && (
          <TouchableOpacity style={styles.completeBtn}>
            <Text style={styles.btnText}>In Transit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      {/* Header with back arrow (web only) */}
      <View style={styles.header}>
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Manage Orders</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
    borderRadius: 10,
    padding: isMobile ? 12 : 16,
    marginBottom: 12,
    elevation: 3,
  },
  orderInfo: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontWeight: '600',
    color: '#007bff',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  approveBtn: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 6,
  },
  completeBtn: {
    backgroundColor: '#ffc107',
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Manage_Orders;
