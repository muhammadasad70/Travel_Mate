// ✅ Responsive Product_Sales_Analytics.js with Platform-aware Back Arrow

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Product_Sales_Analytics = () => {
  const navigation = useNavigation();

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header with back arrow (web only) */}
      <View style={styles.header}>
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Sales Analytics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📊 Product Sales Analytics</Text>

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
    paddingBottom: 80,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 20,
    width: '100%',
    maxWidth: 600,
    borderRadius: 10,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default Product_Sales_Analytics;