import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Customer_Feedback = ({ onBackToServices }) => {
  const navigation = useNavigation();

  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;

  // Dummy sales analytics data
  const salesData = [
    { month: 'Jan', sales: 8, revenue: 'PKR 28,000' },
    { month: 'Feb', sales: 12, revenue: 'PKR 42,000' },
    { month: 'Mar', sales: 15, revenue: 'PKR 52,500' },
    { month: 'Apr', sales: 10, revenue: 'PKR 35,000' },
    { month: 'May', sales: 18, revenue: 'PKR 63,000' },
    { month: 'Jun', sales: 22, revenue: 'PKR 77,000' },
  ];

  const topProducts = [
    { name: 'Handmade Hunza Shawl', sales: 25, revenue: 'PKR 87,500' },
    { name: 'Multani Blue Pottery Vase', sales: 18, revenue: 'PKR 32,400' },
    { name: 'Lahori Chappal', sales: 12, revenue: 'PKR 18,000' },
    { name: 'Peshawari Namda', sales: 8, revenue: 'PKR 16,000' },
  ];

  const customerFeedback = [
    { 
      customer: 'Ali Raza', 
      product: 'Handmade Hunza Shawl', 
      rating: 5, 
      comment: 'Excellent quality! Very warm and beautifully crafted.',
      date: '2025-01-10'
    },
    { 
      customer: 'Zara Khan', 
      product: 'Multani Blue Pottery Vase', 
      rating: 4, 
      comment: 'Beautiful vase, perfect for home decoration. Fast delivery.',
      date: '2025-01-08'
    },
    { 
      customer: 'Ahmed Hassan', 
      product: 'Lahori Chappal', 
      rating: 5, 
      comment: 'Authentic craftsmanship! Very comfortable to wear.',
      date: '2025-01-05'
    },
  ];

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Dashboard mode rendering (without VendorHeader and VendorBottomNavBar)
  if (isInDashboard) {
    return (
      <View style={[styles.content, { paddingTop: 0 }]}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="bar-chart-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Customer Feedback</Text>
        </View>

        {/* Sales Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Sales</Text>
          <View style={styles.chartContainer}>
            {salesData.map((data, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { height: (data.sales / 25) * 100 }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{data.month}</Text>
                <Text style={styles.barValue}>{data.sales}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Top Selling Products</Text>
          {topProducts.map((product, index) => (
            <View key={index} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productStats}>
                  {product.sales} sales • {product.revenue}
                </Text>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Customer Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Feedback</Text>
          {customerFeedback.map((feedback, index) => (
            <View key={index} style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.customerName}>{feedback.customer}</Text>
                <Text style={styles.feedbackDate}>{feedback.date}</Text>
              </View>
              <Text style={styles.productName}>{feedback.product}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{renderStars(feedback.rating)}</Text>
              </View>
              <Text style={styles.comment}>{feedback.comment}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <VendorHeader />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="bar-chart-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
            <Text style={styles.title}>Product Sales Analytics</Text>
          </View>

          {/* Sales Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Sales</Text>
            <View style={styles.chartContainer}>
              {salesData.map((data, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar, 
                        { height: (data.sales / 25) * 100 }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{data.month}</Text>
                  <Text style={styles.barValue}>{data.sales}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Top Products */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Top Selling Products</Text>
            {topProducts.map((product, index) => (
              <View key={index} style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productStats}>
                    {product.sales} sales • {product.revenue}
                  </Text>
                </View>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Customer Feedback */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Feedback</Text>
            {customerFeedback.map((feedback, index) => (
              <View key={index} style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <Text style={styles.customerName}>{feedback.customer}</Text>
                  <Text style={styles.feedbackDate}>{feedback.date}</Text>
                </View>
                <Text style={styles.productName}>{feedback.product}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>{renderStars(feedback.rating)}</Text>
                </View>
                <Text style={styles.comment}>{feedback.comment}</Text>
              </View>
            ))}
          </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    backgroundColor: '#0ea5e9',
    width: 30,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  productStats: {
    fontSize: 14,
    color: '#64748b',
  },
  rankBadge: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  feedbackCard: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  feedbackDate: {
    fontSize: 12,
    color: '#64748b',
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
  },
  comment: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default Customer_Feedback;