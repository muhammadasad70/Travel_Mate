// screens/traveler/TravelerAlerts.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const API_BASE = getBaseURL().replace(/\/+$/, '');

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'booking', label: 'Bookings', icon: 'calendar-outline' },
  { id: 'system', label: 'System', icon: 'megaphone-outline' },
  { id: 'community', label: 'Community', icon: 'people-outline' },
];

export default function TravelerAlerts() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const getNotificationIcon = (type) => {
    if (type === 'booking_confirmed') return { name: 'checkmark-circle', color: '#10B981', category: 'booking' };
    if (type === 'booking_declined') return { name: 'close-circle', color: '#EF4444', category: 'booking' };
    if (type === 'booking_cancelled') return { name: 'alert-circle', color: '#F59E0B', category: 'booking' };
    if (type === 'booking_reminder') return { name: 'time', color: '#3B82F6', category: 'booking' };
    if (type === 'system_update') return { name: 'megaphone', color: '#8B5CF6', category: 'system' };
    if (type === 'new_follower') return { name: 'person-add', color: '#6366F1', category: 'community' };
    return { name: 'notifications', color: '#6366F1', category: 'other' };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = activeCategory === 'all' 
    ? notifications 
    : notifications.filter(n => {
        const icon = getNotificationIcon(n.type);
        return icon.category === activeCategory;
      });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const renderNotification = ({ item }) => {
    const icon = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.is_read && styles.unreadCard]}
        onPress={() => !item.is_read && markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconCircle, { backgroundColor: `${icon.color}15` }]}>
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            {!item.is_read && <View style={styles.unreadDot} />}
          </View>
          
          <Text style={styles.notificationMessage}>{item.message}</Text>
          
          <View style={styles.notificationFooter}>
            <Text style={styles.notificationTime}>{formatTime(item.created_at)}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: `${icon.color}15` }]}>
              <Text style={[styles.categoryText, { color: icon.color }]}>
                {icon.category}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryTab, activeCategory === cat.id && styles.activeCategoryTab]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Ionicons name={cat.icon} size={18} color={activeCategory === cat.id ? '#6366F1' : '#6B7280'} />
            <Text style={[styles.categoryLabel, activeCategory === cat.id && styles.activeCategoryLabel]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Unread Banner */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            {unreadCount} unread alert{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* List */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>
            {activeCategory === 'all' ? 'No alerts yet' : `No ${activeCategory} alerts`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeCategory === 'booking' ? "You'll see booking updates here" : "You'll see updates here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  markAllButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#EFF6FF', borderRadius: 8 },
  markAllText: { fontSize: 13, fontWeight: '600', color: '#6366F1' },
  
  categoryTabs: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  categoryTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginHorizontal: 4 },
  activeCategoryTab: { backgroundColor: '#EFF6FF' },
  categoryLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginLeft: 6 },
  activeCategoryLabel: { color: '#6366F1' },
  
  unreadBanner: { backgroundColor: '#EFF6FF', paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#DBEAFE' },
  unreadText: { fontSize: 13, fontWeight: '600', color: '#3B82F6' },
  listContent: { padding: 16 },
  notificationCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  unreadCard: { backgroundColor: '#F0F9FF', borderColor: '#BFDBFE' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notificationContent: { flex: 1 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  notificationTitle: { fontSize: 15, fontWeight: '700', color: '#111827', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginLeft: 8 },
  notificationMessage: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 8 },
  notificationFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notificationTime: { fontSize: 12, color: '#9CA3AF' },
  categoryBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  categoryText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#6B7280', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
});