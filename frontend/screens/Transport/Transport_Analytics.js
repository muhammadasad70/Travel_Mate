import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Transport_Analytics = ({ onBackToServices }) => {
  const navigation = useNavigation();

  // Dummy analytics data
  const [analyticsData] = useState({
    overview: {
      totalBookings: 47,
      totalRevenue: 125000,
      averageRating: 4.7,
      completionRate: 94.2,
    },
    monthlyStats: {
      currentMonth: 'January 2024',
      bookings: 12,
      revenue: 32000,
      previousMonth: {
        bookings: 8,
        revenue: 22000,
      }
    },
    popularRoutes: [
      { route: 'Karachi → Lahore', bookings: 15, revenue: 45000 },
      { route: 'Islamabad → Peshawar', bookings: 12, revenue: 18000 },
      { route: 'Lahore → Faisalabad', bookings: 8, revenue: 12000 },
      { route: 'Karachi → Hyderabad', bookings: 6, revenue: 9000 },
    ],
    vehiclePerformance: [
      { vehicle: 'Toyota Corolla', bookings: 18, revenue: 54000, rating: 4.8 },
      { vehicle: 'Honda City', bookings: 15, revenue: 45000, rating: 4.6 },
      { vehicle: 'Hino Bus', bookings: 8, revenue: 16000, rating: 4.5 },
      { vehicle: 'Suzuki Swift', bookings: 6, revenue: 10000, rating: 4.7 },
    ],
    customerFeedback: [
      { rating: 5, count: 28, percentage: 59.6 },
      { rating: 4, count: 15, percentage: 31.9 },
      { rating: 3, count: 3, percentage: 6.4 },
      { rating: 2, count: 1, percentage: 2.1 },
      { rating: 1, count: 0, percentage: 0 },
    ],
    timeAnalysis: {
      peakHours: ['09:00 AM', '02:00 PM', '06:00 PM'],
      peakDays: ['Friday', 'Saturday', 'Sunday'],
      averageTripDuration: '2.5 hours',
      averageDistance: '180 km',
    }
  });

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
          {trend && (
            <View style={styles.trendContainer}>
              <Ionicons 
                name={trend > 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={trend > 0 ? "#10b981" : "#ef4444"} 
              />
              <Text style={[styles.trendText, { color: trend > 0 ? "#10b981" : "#ef4444" }]}>
                {Math.abs(trend)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const RouteCard = ({ route, bookings, revenue, index }) => (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={styles.routeNumber}>
          <Text style={styles.routeNumberText}>#{index + 1}</Text>
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{route}</Text>
          <Text style={styles.routeStats}>{bookings} bookings • PKR {revenue.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  const VehicleCard = ({ vehicle, bookings, revenue, rating }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleHeader}>
        <Ionicons name="car" size={20} color="#0ea5e9" />
        <Text style={styles.vehicleName}>{vehicle}</Text>
      </View>
      <View style={styles.vehicleStats}>
        <View style={styles.vehicleStat}>
          <Text style={styles.vehicleStatValue}>{bookings}</Text>
          <Text style={styles.vehicleStatLabel}>Bookings</Text>
        </View>
        <View style={styles.vehicleStat}>
          <Text style={styles.vehicleStatValue}>PKR {revenue.toLocaleString()}</Text>
          <Text style={styles.vehicleStatLabel}>Revenue</Text>
        </View>
        <View style={styles.vehicleStat}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          <Text style={styles.vehicleStatLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );

  const calculateTrend = (current, previous) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  const bookingTrend = calculateTrend(analyticsData.monthlyStats.bookings, analyticsData.monthlyStats.previousMonth.bookings);
  const revenueTrend = calculateTrend(analyticsData.monthlyStats.revenue, analyticsData.monthlyStats.previousMonth.revenue);

  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;

  return (
    <SafeAreaView style={styles.container}>
      {!isInDashboard && <VendorHeader />}
      
      <ScrollView style={[styles.scrollView, isInDashboard && { paddingTop: 0 }]}>
        <View style={[styles.content, isInDashboard && { paddingTop: 0 }]}>
          <View style={[styles.titleWithIcon, isInDashboard && { marginTop: 0 }]}>
            <Ionicons name="analytics-outline" size={24} color="#1f2937" style={{ marginRight: 8 }} />
            <Text style={styles.title}>Transport Analytics</Text>
          </View>

          <Text style={styles.subtitle}>Track your transport business performance and insights</Text>

          {/* Overview Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Bookings"
                value={analyticsData.overview.totalBookings}
                icon="car-outline"
                color="#0ea5e9"
                subtitle="All time"
              />
              <StatCard
                title="Total Revenue"
                value={`PKR ${analyticsData.overview.totalRevenue.toLocaleString()}`}
                icon="cash-outline"
                color="#10b981"
                subtitle="All time"
              />
              <StatCard
                title="Average Rating"
                value={analyticsData.overview.averageRating}
                icon="star-outline"
                color="#fbbf24"
                subtitle="Out of 5.0"
              />
              <StatCard
                title="Completion Rate"
                value={`${analyticsData.overview.completionRate}%`}
                icon="checkmark-circle-outline"
                color="#8b5cf6"
                subtitle="Successful trips"
              />
            </View>
          </View>

          {/* Monthly Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Performance - {analyticsData.monthlyStats.currentMonth}</Text>
            <View style={styles.monthlyStatsContainer}>
              <StatCard
                title="Bookings This Month"
                value={analyticsData.monthlyStats.bookings}
                icon="calendar-outline"
                color="#3b82f6"
                subtitle={`vs ${analyticsData.monthlyStats.previousMonth.bookings} last month`}
                trend={bookingTrend}
              />
              <StatCard
                title="Revenue This Month"
                value={`PKR ${analyticsData.monthlyStats.revenue.toLocaleString()}`}
                icon="trending-up-outline"
                color="#10b981"
                subtitle={`vs PKR ${analyticsData.monthlyStats.previousMonth.revenue.toLocaleString()} last month`}
                trend={revenueTrend}
              />
            </View>
          </View>

          {/* Popular Routes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Routes</Text>
            {analyticsData.popularRoutes.map((route, index) => (
              <RouteCard
                key={index}
                route={route.route}
                bookings={route.bookings}
                revenue={route.revenue}
                index={index}
              />
            ))}
          </View>

          {/* Vehicle Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Performance</Text>
            {analyticsData.vehiclePerformance.map((vehicle, index) => (
              <VehicleCard
                key={index}
                vehicle={vehicle.vehicle}
                bookings={vehicle.bookings}
                revenue={vehicle.revenue}
                rating={vehicle.rating}
              />
            ))}
          </View>

          {/* Customer Feedback */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Feedback Distribution</Text>
            <View style={styles.feedbackContainer}>
              {analyticsData.customerFeedback.map((feedback, index) => (
                <View key={index} style={styles.feedbackRow}>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingNumber}>{feedback.rating}</Text>
                    <Ionicons name="star" size={16} color="#fbbf24" />
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${feedback.percentage}%` }
                        ]} 
                      />
                    </View>
                  </View>
                  <Text style={styles.feedbackCount}>{feedback.count}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Time Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time Analysis</Text>
            <View style={styles.timeAnalysisContainer}>
              <View style={styles.timeCard}>
                <Ionicons name="time-outline" size={24} color="#0ea5e9" />
                <Text style={styles.timeCardTitle}>Peak Hours</Text>
                <Text style={styles.timeCardValue}>{analyticsData.timeAnalysis.peakHours.join(', ')}</Text>
              </View>
              <View style={styles.timeCard}>
                <Ionicons name="calendar-outline" size={24} color="#10b981" />
                <Text style={styles.timeCardTitle}>Peak Days</Text>
                <Text style={styles.timeCardValue}>{analyticsData.timeAnalysis.peakDays.join(', ')}</Text>
              </View>
              <View style={styles.timeCard}>
                <Ionicons name="speedometer-outline" size={24} color="#f59e0b" />
                <Text style={styles.timeCardTitle}>Avg Trip Duration</Text>
                <Text style={styles.timeCardValue}>{analyticsData.timeAnalysis.averageTripDuration}</Text>
              </View>
              <View style={styles.timeCard}>
                <Ionicons name="location-outline" size={24} color="#8b5cf6" />
                <Text style={styles.timeCardTitle}>Avg Distance</Text>
                <Text style={styles.timeCardValue}>{analyticsData.timeAnalysis.averageDistance}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {!isInDashboard && <VendorBottomNavBar />}
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
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: isMobile ? '100%' : '45%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  monthlyStatsContainer: {
    gap: 12,
  },
  routeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routeNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  routeStats: {
    fontSize: 14,
    color: '#6b7280',
  },
  vehicleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleStat: {
    alignItems: 'center',
  },
  vehicleStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  vehicleStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 4,
  },
  feedbackContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 4,
  },
  feedbackCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 30,
    textAlign: 'right',
  },
  timeAnalysisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: isMobile ? '100%' : '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  timeCardValue: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default Transport_Analytics;

