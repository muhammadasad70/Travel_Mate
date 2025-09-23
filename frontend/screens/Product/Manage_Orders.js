import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Manage_Orders = ({ onBackToServices }) => {
  const navigation = useNavigation();

  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;

  const [orders, setOrders] = useState([
    {
      id: '101',
      product: 'Handmade Hunza Shawl',
      buyer: 'Ali Raza',
      email: 'ali.raza@gmail.com',
      phone: '+92-300-1234567',
      date: '2025-01-15',
      status: 'Pending',
      quantity: 1,
      totalPrice: 'PKR 3,500',
    },
    {
      id: '102',
      product: 'Multani Blue Pottery Vase',
      buyer: 'Zara Khan',
      email: 'zara.khan@yahoo.com',
      phone: '+92-301-9876543',
      date: '2025-01-14',
      status: 'Pending',
      quantity: 2,
      totalPrice: 'PKR 3,600',
    },
  ]);

  const handleAccept = (id) => {
    Alert.alert(
      'Accept Order',
      'Are you sure you want to accept this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => {
    const updatedOrders = orders.map(order =>
              order.id === id ? { ...order, status: 'Accepted' } : order
    );
    setOrders(updatedOrders);
            Alert.alert('Success', 'Order accepted successfully!');
          }
        },
      ]
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedOrders = orders.filter(order => order.id !== id);
            setOrders(updatedOrders);
            Alert.alert('Success', 'Order request deleted successfully!');
          }
        },
      ]
    );
  };

  // Dashboard mode rendering (without VendorHeader and VendorBottomNavBar)
  if (isInDashboard) {
    return (
      <View style={[styles.content, { paddingTop: 0 }]}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="cube-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Manage Orders</Text>
        </View>
        
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderBox}>
              <View style={styles.orderHeader}>
                <Text style={styles.productName}>{order.product}</Text>
                <View style={[styles.statusBadge, order.status === 'Pending' ? styles.pendingBadge : styles.acceptedBadge]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              
              <View style={styles.orderDetails}>
                <Text style={styles.detail}>👤 Buyer: {order.buyer}</Text>
                <Text style={styles.detail}>📧 Email: {order.email}</Text>
                <Text style={styles.detail}>📱 Phone: {order.phone}</Text>
                <Text style={styles.detail}>📅 Date: {order.date}</Text>
                <Text style={styles.detail}>🔢 Quantity: {order.quantity}</Text>
                <Text style={styles.detail}>💰 Total: {order.totalPrice}</Text>
              </View>

              {order.status === 'Pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(order.id)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDecline(order.id)}
                  >
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <VendorHeader />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="cube-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
            <Text style={styles.title}>Booking Requests</Text>
          </View>
          
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No booking requests yet</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderBox}>
                <View style={styles.orderHeader}>
                  <Text style={styles.productName}>{order.product}</Text>
                  <View style={[styles.statusBadge, order.status === 'Pending' ? styles.pendingBadge : styles.acceptedBadge]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>
                
                <View style={styles.orderDetails}>
                  <Text style={styles.detail}>👤 Buyer: {order.buyer}</Text>
                  <Text style={styles.detail}>📧 Email: {order.email}</Text>
                  <Text style={styles.detail}>📱 Phone: {order.phone}</Text>
                  <Text style={styles.detail}>📅 Date: {order.date}</Text>
                  <Text style={styles.detail}>🔢 Quantity: {order.quantity}</Text>
                  <Text style={styles.detail}>💰 Total: {order.totalPrice}</Text>
      </View>

                {order.status === 'Pending' && (
                  <View style={styles.actionButtons}>
            <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAccept(order.id)}
            >
                      <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(order.id)}
            >
                      <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
                  </View>
        )}
      </View>
            ))
          )}
      </View>
      </ScrollView>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Adjust for fixed header on web
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  orderBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  acceptedBadge: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  orderDetails: {
    marginBottom: 16,
  },
  detail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-start',
  },
  acceptButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 60,
  },
});

export default Manage_Orders;
