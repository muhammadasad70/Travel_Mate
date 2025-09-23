import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';
// import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Product_Sales_Analytics = ({ onBackToServices }) => {
  const navigation = useNavigation();

  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Chart data and configuration - commented out since analytics section is disabled
  /*
  const chartData = {
    labels: ['Shawl', 'Pottery', 'Bracelet', 'Cap', 'Carpet'],
    datasets: [
      {
        data: [20, 15, 8, 12, 25],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f1f3f6',
    backgroundGradientTo: '#f1f3f6',
    color: (opacity = 1) => `rgba(30, 60, 180, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
    barPercentage: 0.6,
    decimalPlaces: 0,
  };
  */

  const handleSubmitOffer = () => {
    // Handle offer submission logic here
    console.log('Offer submitted:', { offerTitle, offerDescription, discountPercentage, validFrom, validUntil });
  };

  // Dashboard mode rendering (without VendorHeader and VendorBottomNavBar)
  if (isInDashboard) {
    return (
      <View style={[styles.scrollContainer, { paddingTop: 0 }]}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="gift-outline" size={24} color="#111" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Product Sales Analytics</Text>
        </View>

        {/* Product Offers Section */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Create Product Offer</Text>
          <Text style={styles.sectionSubtitle}>Create special discounted products or promotional offers</Text>
          
          <TextInput
            placeholder="Offer Title"
            value={offerTitle}
            onChangeText={setOfferTitle}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Offer Description"
            value={offerDescription}
            onChangeText={setOfferDescription}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
          />
          
          <TextInput
            placeholder="Discount Percentage (%)"
            value={discountPercentage}
            onChangeText={setDiscountPercentage}
            style={styles.input}
            keyboardType="numeric"
          />
          
          <TextInput
            placeholder="Valid From (YYYY-MM-DD)"
            value={validFrom}
            onChangeText={setValidFrom}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Valid Until (YYYY-MM-DD)"
            value={validUntil}
            onChangeText={setValidUntil}
            style={styles.input}
          />
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOffer}>
            <Text style={styles.submitButtonText}>Create Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <VendorHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="gift-outline" size={24} color="#111" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Product Offer</Text>
        </View>

        {/* Product Offers Section */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Create Product Offer</Text>
          <Text style={styles.sectionSubtitle}>Create special discounted products or promotional offers</Text>
          
          <TextInput
            placeholder="Offer Title"
            value={offerTitle}
            onChangeText={setOfferTitle}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Offer Description"
            value={offerDescription}
            onChangeText={setOfferDescription}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
          />
          
          <TextInput
            placeholder="Discount Percentage (%)"
            value={discountPercentage}
            onChangeText={setDiscountPercentage}
            style={styles.input}
            keyboardType="numeric"
          />
          
          <TextInput
            placeholder="Valid From (YYYY-MM-DD)"
            value={validFrom}
            onChangeText={setValidFrom}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Valid Until (YYYY-MM-DD)"
            value={validUntil}
            onChangeText={setValidUntil}
            style={styles.input}
          />
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOffer}>
            <Text style={styles.submitButtonText}>Create Offer</Text>
          </TouchableOpacity>
        </View>

        {/* Analytics Section - Commented Out */}
        {/* 
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>Sales Analytics</Text>

          <BarChart
            data={chartData}
            width={screenWidth - (isMobile ? 24 : 64)}
            height={240}
            yAxisLabel=""
            yAxisSuffix=" sold"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero
            style={styles.chart}
          />

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>📈 Summary</Text>
            <Text>Total Products Sold: 80</Text>
            <Text>Top Seller: Carpet (25 sales)</Text>
            <Text>Lowest Seller: Bracelet (8 sales)</Text>
          </View>
        </View>
        */}
      </ScrollView>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  // Content styles
  scrollContainer: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Adjust for fixed header on web
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  // Offers section styles
  offersSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  input: {
    height: 44,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 140,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Analytics section styles
  analyticsSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
});

export default Product_Sales_Analytics;