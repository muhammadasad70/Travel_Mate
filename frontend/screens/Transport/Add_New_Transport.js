import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const PAK_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta',
  'Sialkot', 'Gujranwala', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas', 'Jacobabad',
  'Shikarpur', 'Kandhkot', 'Kashmore', 'Ghotki', 'Dadu', 'Khairpur', 'Naushahro Feroze', 'Sanghar',
  'Thatta', 'Badin', 'Tando Muhammad Khan', 'Tando Allahyar', 'Matli', 'Umerkot', 'Tharparkar'
];

const TRANSPORT_TYPES = [
  'Bus', 'Car', 'Van', 'Motorcycle', 'Bicycle', 'Truck', 'Taxi', 'Rickshaw', 'Other'
];

const Add_New_Transport = ({ route, onBackToServices }) => {
  const navigation = useNavigation();
  const transportId = route?.params?.transportId;
  const editingTransport = route?.params?.transport;

  const [transportType, setTransportType] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pricePerKm, setPricePerKm] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransport) {
      setTransportType(editingTransport.transportType || '');
      setVehicleName(editingTransport.vehicleName || '');
      setDescription(editingTransport.description || '');
      setCapacity(editingTransport.capacity || '');
      setPricePerKm(editingTransport.pricePerKm || '');
      setPricePerHour(editingTransport.pricePerHour || '');
      setFromCity(editingTransport.fromCity || '');
      setToCity(editingTransport.toCity || '');
      setContactNumber(editingTransport.contactNumber || '');
      setContactEmail(editingTransport.contactEmail || '');
      setVendorName(editingTransport.vendorName || '');
      setVendorEmail(editingTransport.vendorEmail || '');
    }
  }, [editingTransport]);

  const onSubmit = async () => {
    if (!transportType || !vehicleName || !description || !capacity || !fromCity || !toCity || !contactNumber || !contactEmail || !vendorName || !vendorEmail) {
      setError('Please fill in all required fields');
      return;
    }

    if (!pricePerKm && !pricePerHour) {
      setError('Please provide either price per km or price per hour');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const transportData = {
        id: transportId || Date.now().toString(),
        transportType,
        vehicleName,
        description,
        capacity,
        pricePerKm: pricePerKm || '0',
        pricePerHour: pricePerHour || '0',
        fromCity,
        toCity,
        contactNumber,
        contactEmail,
        vendorName,
        vendorEmail,
        createdAt: editingTransport?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingTransports = await AsyncStorage.getItem('my_transports');
      const transports = existingTransports ? JSON.parse(existingTransports) : [];

      if (editingTransport) {
        const updatedTransports = transports.map(t => t.id === transportId ? transportData : t);
        await AsyncStorage.setItem('my_transports', JSON.stringify(updatedTransports));
        Alert.alert('Success', 'Transport service updated successfully!');
      } else {
        transports.push(transportData);
        await AsyncStorage.setItem('my_transports', JSON.stringify(transports));
        Alert.alert('Success', 'Transport service added successfully!');
      }

      if (onBackToServices) {
        onBackToServices();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving transport:', error);
      setError('Failed to save transport service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;

  return (
    <SafeAreaView style={styles.wrapper}>
      {!isInDashboard && <VendorHeader />}
      
      {/* Back Button */}
      <TouchableOpacity 
        style={[styles.backButton, isInDashboard && { marginTop: 0 }]}
        onPress={() => onBackToServices ? onBackToServices() : navigation.navigate('My_Transport_Listings')}
      >
        <Feather name="arrow-left" size={20} color="#374151" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.titleWithIcon}>
          <Ionicons name={editingTransport ? "create-outline" : "car-outline"} size={24} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.title}>{editingTransport ? 'Edit Transport Service' : 'Add New Transport Service'}</Text>
        </View>

        <Text style={styles.sectionLabel}>Transport Type *</Text>
        <TextInput value={transportType} onChangeText={setTransportType} placeholder="e.g., Bus, Car, Van, Motorcycle" style={styles.input} />

        <Text style={styles.sectionLabel}>Vehicle Name/Model *</Text>
        <TextInput value={vehicleName} onChangeText={setVehicleName} placeholder="e.g., Toyota Corolla, Honda City" style={styles.input} />

        <Text style={styles.sectionLabel}>Description *</Text>
        <TextInput value={description} onChangeText={setDescription} placeholder="Describe your transport service, amenities, etc." style={[styles.input, styles.textArea]} multiline />

        <Text style={styles.sectionLabel}>Passenger Capacity *</Text>
        <TextInput value={capacity} onChangeText={setCapacity} placeholder="e.g., 4, 7, 15, 50" keyboardType="numeric" style={styles.input} />

        <View style={styles.priceRow}>
          <View style={styles.priceInput}>
            <Text style={styles.sectionLabel}>Price per KM (PKR)</Text>
            <TextInput value={pricePerKm} onChangeText={setPricePerKm} placeholder="0" keyboardType="numeric" style={styles.input} />
          </View>
          <View style={styles.priceInput}>
            <Text style={styles.sectionLabel}>Price per Hour (PKR)</Text>
            <TextInput value={pricePerHour} onChangeText={setPricePerHour} placeholder="0" keyboardType="numeric" style={styles.input} />
          </View>
        </View>

        <View style={styles.locationRow}>
          <View style={styles.locationInput}>
            <Text style={styles.sectionLabel}>From City *</Text>
            <TextInput value={fromCity} onChangeText={setFromCity} placeholder="Departure city" style={styles.input} />
          </View>
          <View style={styles.locationInput}>
            <Text style={styles.sectionLabel}>To City *</Text>
            <TextInput value={toCity} onChangeText={setToCity} placeholder="Destination city" style={styles.input} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Contact Information</Text>
        <TextInput value={contactNumber} onChangeText={setContactNumber} placeholder="Phone number" keyboardType="phone-pad" style={styles.input} />
        <TextInput value={contactEmail} onChangeText={setContactEmail} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" style={styles.input} />

        <Text style={styles.sectionLabel}>Vendor Information</Text>
        <TextInput value={vendorName} onChangeText={setVendorName} placeholder="Your full name" style={styles.input} />
        <TextInput value={vendorEmail} onChangeText={setVendorEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{editingTransport ? 'Update Transport Service' : 'Add Transport Service'}</Text>}
        </TouchableOpacity>
      </ScrollView>
      {!isInDashboard && <VendorBottomNavBar />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { 
    padding: isMobile ? 16 : 32, 
    width: '100%', 
    flexGrow: 1,
    paddingTop: Platform.OS === 'web' ? 8 : 8,
    paddingBottom: 100, // Account for bottom navigation bar
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  input: { height: 44, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 8, marginBottom: 14, paddingHorizontal: 12, backgroundColor: '#FFFFFF' },
  textArea: { height: 120, textAlignVertical: 'top' },
  sectionLabel: { fontWeight: '700', color: '#0f172a', marginTop: 6, marginBottom: 6 },
  priceRow: { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-start', marginBottom: 12 },
  priceInput: { flex: 1, marginRight: isMobile ? 0 : 12, marginBottom: isMobile ? 12 : 0 },
  locationRow: { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-start', marginBottom: 12 },
  locationInput: { flex: 1, marginRight: isMobile ? 0 : 12, marginBottom: isMobile ? 12 : 0 },
  button: { backgroundColor: '#0ea5e9', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  errorText: { color: '#ef4444', fontSize: 14, marginBottom: 16, textAlign: 'center' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: isMobile ? 16 : 24,
    paddingVertical: 12,
    marginTop: Platform.OS === 'web' ? 100 : 0, // Increased margin for fixed header on web
  },
  backText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});

export default Add_New_Transport;
