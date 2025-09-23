import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
//import VendorHeader from '../../components/VendorDashboard/VendorHeader';*/
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 900;

const My_Services = ({ onAddService }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [showServices, setShowServices] = useState(false);

  const fetchLocal = async () => {
    try {
      const raw = await AsyncStorage.getItem('my_services');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const storeLocal = async (list) => {
    await AsyncStorage.setItem('my_services', JSON.stringify(list));
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const local = await fetchLocal();
      console.log('Local services:', local);
      let remote = [];
      try {
        const res = await api.get('/services/mine');
        remote = res?.data?.services || [];
      } catch {}
      const combined = [...local, ...remote];
      console.log('Combined services:', combined);
      setServices(combined);
    } catch (e) {
      setError('Failed to load your services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    const unsubscribe = navigation.addListener('focus', fetchServices);
    return unsubscribe;
  }, [fetchServices, navigation]);

  const handleDelete = async (id) => {
    try {
      const local = await fetchLocal();
      const updated = local.filter((s) => s.id !== id);
      await storeLocal(updated);
      await fetchServices();
    } catch {}
  };

  const confirmDelete = (id) => {
    Alert.alert('Delete Service', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
    ]);
  };

  const onEdit = (service) => {
    if (onAddService) {
      // We're in dashboard mode, use callback to switch tabs and pass service data
      onAddService(service);
    } else {
      // We're in standalone mode, use direct navigation
      navigation.navigate('AddNewServices', { service });
    }
  };




  // If onAddService is provided, we're in dashboard mode (no header/bottom nav)
  const isInDashboard = !!onAddService;
  
  if (isInDashboard) {
    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 0 }]}>
        {/* Add Services Card Button */}
        <TouchableOpacity 
          onPress={() => onAddService ? onAddService() : navigation.navigate('AddNewServices')} 
          style={styles.addServiceCard}
        >
          <View style={styles.addServiceCardContent}>
            <View style={styles.addServiceIconContainer}>
              <Ionicons name="add-circle" size={32} color="#0ea5e9" />
            </View>
            <View style={styles.addServiceTextContainer}>
              <Text style={styles.addServiceTitle}>Add New Service</Text>
              <Text style={styles.addServiceSubtitle}>Create a new accommodation or cultural service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </View>
        </TouchableOpacity>

        {/* View Services Card Button */}
        <TouchableOpacity 
          onPress={() => setShowServices(!showServices)} 
          style={styles.viewServiceCard}
        >
          <View style={styles.viewServiceCardContent}>
            <View style={styles.viewServiceIconContainer}>
              <Ionicons name="list" size={32} color="#059669" />
            </View>
            <View style={styles.viewServiceTextContainer}>
              <Text style={styles.viewServiceTitle}>View Services</Text>
              <Text style={styles.viewServiceSubtitle}>
                {showServices ? 'Hide your created services' : 'View all your created services'}
              </Text>
            </View>
            <Ionicons 
              name={showServices ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#64748b" 
            />
          </View>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loaderText}>Loading services…</Text>
          </View>
        )}

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && services.length === 0 && !error && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No services yet</Text>
            <Text style={styles.emptyText}>Create your first cultural or accommodation service to get started.</Text>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => onAddService ? onAddService() : navigation.navigate('AddNewServices')}>
              <Text style={styles.ctaText}>Create a Service</Text>
            </TouchableOpacity>
          </View>
        )}

        {showServices && !loading && services.map((s) => {
          let scheduleText = '';
          try {
            if (s.schedule) {
              const sch = typeof s.schedule === 'string' ? JSON.parse(s.schedule) : s.schedule;
              const parts = [];
              if (sch?.range?.from || sch?.range?.to) {
                parts.push(`From ${sch?.range?.from || '—'} To ${sch?.range?.to || '—'}`);
              }
              if (sch?.time) parts.push(sch.time);
              scheduleText = parts.join(' • ');
            }
          } catch {}

          const imgs = Array.isArray(s.images) ? s.images : [];
          const firstImage = imgs.find((u) => typeof u === 'string' && u.length > 0);

          return (
            <View key={s.id || `${s.title}-${Math.random()}`} style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{s.title || 'Untitled Service'}</Text>
                  <Text style={styles.cardMeta}>{s.location || 'Location not set'}</Text>
                  {(s.city || s.address) && (
                    <Text style={styles.cardMeta}>City: {s.city || '—'} • Address: {s.address || '—'}</Text>
                  )}
                  <Text style={styles.cardDesc}>{s.description}</Text>
                  {!!scheduleText && <Text style={styles.cardSchedule}>Schedule: {scheduleText}</Text>}
                  {(s.vendor_name || s.vendor_email) && (
                    <Text style={styles.contactLine}>Contact: Email: {s.vendor_email || '—'}, Vendor name: {s.vendor_name || '—'}</Text>
                  )}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => onEdit(s)} style={[styles.smallBtn, { backgroundColor: '#0284c7' }]}>
                      <Text style={styles.smallBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete(s.id)} style={[styles.smallBtn, { backgroundColor: '#dc2626' }]}>
                      <Text style={styles.smallBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.badge, s.availability ? styles.badgeAvailable : styles.badgeUnavailable]}>
                      {s.availability ? 'Available' : 'Unavailable'}
                    </Text>
                    {s.is_vendor_provided && <Text style={[styles.badge, styles.badgeVendor]}>Vendor-provided</Text>}
                  </View>
                </View>
                <View style={styles.imageCol}>
                  {firstImage ? (
                    <Image source={{ uri: firstImage }} style={styles.cardImageRight} resizeMode="cover" />
                  ) : (
                    <View style={[styles.cardImageRight, styles.cardImagePlaceholder]}>
                      <Text style={styles.cardImagePlaceholderText}>No image</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );})}

      </ScrollView>
    );
  }

  // Standalone mode with header and bottom nav
  return (
    <SafeAreaView style={styles.wrapper}>
     /* <VendorHeader /> */
      <ScrollView contentContainerStyle={styles.container}>
        {/* Add Services Card Button */}
        <TouchableOpacity 
          onPress={() => onAddService ? onAddService() : navigation.navigate('AddNewServices')} 
          style={styles.addServiceCard}
        >
          <View style={styles.addServiceCardContent}>
            <View style={styles.addServiceIconContainer}>
              <Ionicons name="add-circle" size={32} color="#0ea5e9" />
            </View>
            <View style={styles.addServiceTextContainer}>
              <Text style={styles.addServiceTitle}>Add New Service</Text>
              <Text style={styles.addServiceSubtitle}>Create a new accommodation or cultural service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </View>
        </TouchableOpacity>

        {/* View Services Card Button */}
        <TouchableOpacity 
          onPress={() => setShowServices(!showServices)} 
          style={styles.viewServiceCard}
        >
          <View style={styles.viewServiceCardContent}>
            <View style={styles.viewServiceIconContainer}>
              <Ionicons name="list" size={32} color="#059669" />
            </View>
            <View style={styles.viewServiceTextContainer}>
              <Text style={styles.viewServiceTitle}>View Services</Text>
              <Text style={styles.viewServiceSubtitle}>
                {showServices ? 'Hide your created services' : 'View all your created services'}
              </Text>
            </View>
            <Ionicons 
              name={showServices ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#64748b" 
            />
          </View>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loaderText}>Loading services…</Text>
          </View>
        )}

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && services.length === 0 && !error && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No services yet</Text>
            <Text style={styles.emptyText}>Create your first cultural or accommodation service to get started.</Text>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => onAddService ? onAddService() : navigation.navigate('AddNewServices')}>
              <Text style={styles.ctaText}>Create a Service</Text>
            </TouchableOpacity>
          </View>
        )}

        {showServices && !loading && services.map((s) => {
          let scheduleText = '';
          try {
            if (s.schedule) {
              const sch = typeof s.schedule === 'string' ? JSON.parse(s.schedule) : s.schedule;
              const parts = [];
              if (sch?.range?.from || sch?.range?.to) {
                parts.push(`From ${sch?.range?.from || '—'} To ${sch?.range?.to || '—'}`);
              }
              if (sch?.time) parts.push(sch.time);
              scheduleText = parts.join(' • ');
            }
          } catch {}

          const imgs = Array.isArray(s.images) ? s.images : [];
          const firstImage = imgs.find((u) => typeof u === 'string' && u.length > 0);

          return (
            <View key={s.id || `${s.title}-${Math.random()}`} style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{s.title || 'Untitled Service'}</Text>
                  <Text style={styles.cardMeta}>{s.location || 'Location not set'}</Text>
                  {(s.city || s.address) && (
                    <Text style={styles.cardMeta}>City: {s.city || '—'} • Address: {s.address || '—'}</Text>
                  )}
                  <Text style={styles.cardDesc}>{s.description}</Text>
                  {!!scheduleText && <Text style={styles.cardSchedule}>Schedule: {scheduleText}</Text>}
                  {(s.vendor_name || s.vendor_email) && (
                    <Text style={styles.contactLine}>Contact: Email: {s.vendor_email || '—'}, Vendor name: {s.vendor_name || '—'}</Text>
                  )}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => onEdit(s)} style={[styles.smallBtn, { backgroundColor: '#0284c7' }]}>
                      <Text style={styles.smallBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete(s.id)} style={[styles.smallBtn, { backgroundColor: '#dc2626' }]}>
                      <Text style={styles.smallBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.badge, s.availability ? styles.badgeAvailable : styles.badgeUnavailable]}>
                      {s.availability ? 'Available' : 'Unavailable'}
                    </Text>
                    {s.is_vendor_provided && <Text style={[styles.badge, styles.badgeVendor]}>Vendor-provided</Text>}
                  </View>
                </View>
                <View style={styles.imageCol}>
                  {firstImage ? (
                    <Image source={{ uri: firstImage }} style={styles.cardImageRight} resizeMode="cover" />
                  ) : (
                    <View style={[styles.cardImageRight, styles.cardImagePlaceholder]}>
                      <Text style={styles.cardImagePlaceholderText}>No image</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );})}

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
  addServiceCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addServiceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  addServiceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addServiceTextContainer: {
    flex: 1,
  },
  addServiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  addServiceSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  viewServiceCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewServiceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  viewServiceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewServiceTextContainer: {
    flex: 1,
  },
  viewServiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  viewServiceSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  container: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Increased to account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Add top padding for fixed header on web
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  brandRowFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e8f2ff',
    borderRadius: 12,
  },
  logo: { fontSize: 36, marginRight: 10 },
  brandTitle: { fontSize: 24, fontWeight: '800', color: '#0F3A6B' },
  brandTag: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  headerActions: { flexDirection: 'row', gap: 16, marginBottom: 18, flexWrap: 'wrap' },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  actionText: { color: '#fff', fontWeight: '700' },
  loaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  loaderText: { color: '#374151' },
  errorText: { color: '#b91c1c', marginBottom: 12 },
  emptyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4, color: '#0f172a' },
  emptyText: { color: '#475569', marginBottom: 10 },
  ctaBtn: { backgroundColor: '#2563EB', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  ctaText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'stretch', gap: 12 },
  cardContent: { flex: 1 },
  imageCol: { width: '38%', alignSelf: 'stretch' },
  cardImageRight: { width: '100%', height: '100%', minHeight: 120, borderRadius: 8, backgroundColor: '#f1f5f9' },
  cardImagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  cardImagePlaceholderText: { color: '#64748b', fontSize: 10, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  cardMeta: { fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 4 },
  cardDesc: { color: '#334155' },
  cardSchedule: { color: '#334155', marginTop: 6 },
  contactLine: { marginTop: 8, fontWeight: '700', color: '#0f172a' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 10, flexWrap: 'wrap' },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  smallBtnText: { color: '#fff', fontWeight: '700' },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontSize: 12, overflow: 'hidden', color: '#0f172a' },
  badgeAvailable: { backgroundColor: '#dcfce7' },
  badgeUnavailable: { backgroundColor: '#fee2e2' },
  badgeVendor: { backgroundColor: '#e0e7ff' },
  note: {
    marginTop: 30,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
  },
});

export default My_Services;
