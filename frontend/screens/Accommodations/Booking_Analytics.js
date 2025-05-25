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
import { Feather } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Booking_Analytics = () => {
  const navigation = useNavigation();

  const dummyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12, 19, 15, 20, 25, 22],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ Show back only on web */}
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Feather name="arrow-left" size={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.heading}>📊 Booking Analytics</Text>

        <Text style={styles.subheading}>Monthly Booking Trend</Text>
        <BarChart
          data={dummyData}
          width={screenWidth - (isMobile ? 32 : 120)}
          height={220}
          fromZero
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#F9FAFB',
            backgroundGradientTo: '#F3F4F6',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            labelColor: () => '#374151',
          }}
          style={styles.chart}
        />

        <View style={styles.statsBox}>
          <Text style={styles.statItem}>📈 Total Bookings: 113</Text>
          <Text style={styles.statItem}>⭐ Avg Rating: 4.6</Text>
          <Text style={styles.statItem}>💰 Revenue: PKR 980,000</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    paddingHorizontal: isMobile ? 16 : 40,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
    alignItems: 'flex-start',
  },
  backArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: 'center',
  },
  statsBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  statItem: {
    fontSize: 14,
    marginBottom: 6,
    color: '#111827',
  },
});

export default Booking_Analytics;
