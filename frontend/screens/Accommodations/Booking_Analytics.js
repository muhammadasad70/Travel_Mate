import React, { useEffect, useMemo, useState } from 'react';
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
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;
const isSmallScreen = screenWidth < 900;

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Booking_Analytics = ({ onBackToServices }) => {
  const navigation = useNavigation();
  const [monthlyCounts, setMonthlyCounts] = useState(Array(12).fill(0));

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('my_services');
        const list = raw ? JSON.parse(raw) : [];
        const counts = Array(12).fill(0);
        list.forEach((s) => {
          try {
            if (!s.schedule) return;
            const sch = typeof s.schedule === 'string' ? JSON.parse(s.schedule) : s.schedule;
            const from = sch?.range?.from; // YYYY-MM-DD
            if (!from || !/^\d{4}-\d{2}-\d{2}$/.test(from)) return;
            const monthIdx = Number(from.slice(5,7)) - 1; // 0..11
            if (monthIdx >= 0 && monthIdx < 12) counts[monthIdx] += 1;
          } catch {}
        });
        setMonthlyCounts(counts);
      } catch {}
    })();
  }, []);

  const chartData = useMemo(() => ({
    labels: months,
    datasets: [{ data: monthlyCounts }],
  }), [monthlyCounts]);

  // If onBackToServices is provided, we're in dashboard mode (no header/bottom nav)
  const isInDashboard = !!onBackToServices;
  
  if (isInDashboard) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: isMobile ? 16 : 40, paddingBottom: 20, paddingTop: 0, paddingVertical: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12, marginTop: 0, paddingTop: 0 }}>
          <Ionicons name="bar-chart-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.heading}>Booking Analytics</Text>
        </View>

        <Text style={styles.subheading}>Monthly Services Added (as proxy for bookings)</Text>
        {isSmallScreen ? (
          <ScrollView 
            style={styles.chartScrollView} 
            horizontal={true} 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.chartScrollContent}
            bounces={false}
            decelerationRate="fast"
          >
            <BarChart
              data={chartData}
              width={screenWidth * 2.5}
              height={220}
              fromZero
              chartConfig={{
                backgroundColor: '#FFF',
                backgroundGradientFrom: '#F9FAFB',
                backgroundGradientTo: '#F3F4F6',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
              }}
              style={styles.chart}
            />
          </ScrollView>
        ) : (
          <BarChart
            data={chartData}
            width={screenWidth - (isMobile ? 40 : 100)}
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
        )}

        <View style={styles.statsBox}>
          <Text style={styles.statItem}>📈 Total Services: {monthlyCounts.reduce((a,b)=>a+b,0)}</Text>
          <Text style={styles.statItem}>🗓️ Peak Month: {(() => { const max = Math.max(...monthlyCounts); const idx = monthlyCounts.indexOf(max); return max>0 ? months[idx] : '—'; })()}</Text>
        </View>
        </ScrollView>
      </View>
    );
  }

  // Standalone mode with header and bottom nav
  return (
    <SafeAreaView style={styles.wrapper}>
    //  <VendorHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="bar-chart-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.heading}>Booking Analytics</Text>
        </View>

        <Text style={styles.subheading}>Monthly Services Added (as proxy for bookings)</Text>
        {isSmallScreen ? (
          <ScrollView 
            style={styles.chartScrollView} 
            horizontal={true} 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.chartScrollContent}
            bounces={false}
            decelerationRate="fast"
          >
            <BarChart
              data={chartData}
              width={screenWidth * 2.5}
              height={220}
              fromZero
              chartConfig={{
                backgroundColor: '#FFF',
                backgroundGradientFrom: '#F9FAFB',
                backgroundGradientTo: '#F3F4F6',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '6', strokeWidth: '2', stroke: '#2563EB' },
              }}
              style={styles.chart}
            />
          </ScrollView>
        ) : (
          <BarChart
            data={chartData}
            width={screenWidth - 80}
            height={220}
            fromZero
            chartConfig={{
              backgroundColor: '#FFF',
              backgroundGradientFrom: '#F9FAFB',
              backgroundGradientTo: '#F3F4F6',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#2563EB' },
            }}
            style={styles.chart}
          />
        )}

        <View style={styles.statsBox}>
          <Text style={styles.statItem}>📈 Total Services: {monthlyCounts.reduce((a,b)=>a+b,0)}</Text>
          <Text style={styles.statItem}>🗓️ Peak Month: {(() => { const max = Math.max(...monthlyCounts); const idx = monthlyCounts.indexOf(max); return max>0 ? months[idx] : '—'; })()}</Text>
        </View>
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
    paddingHorizontal: isMobile ? 16 : 40,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'web' ? 120 : 24, // Add top padding for fixed header on web
    paddingBottom: 100, // Add bottom padding for bottom navigation bar
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: 'center',
  },
  chartScrollView: {
    marginBottom: 24,
    height: 250,
    width: '100%',
  },
  chartScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    minWidth: '100%',
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
