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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const PAK_CITIES = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta','Hyderabad','Gujranwala','Sialkot','Bahawalpur','Sargodha','Sukkur','Larkana','Sheikhupura','Jhang','Rahim Yar Khan','Mardan','Abbottabad','Wah Cantonment','Kasur','Okara','Mingora','Nawabshah','Chiniot','Kotri','Kamoke','Hafizabad','Sadiqabad','Dera Ghazi Khan','Gojra','Muridke','Mandi Bahauddin','Shikarpur','Jacobabad','Khanewal','Kohat','Dera Ismail Khan','Turbat','Gwadar','Muzaffarabad','Mirpur','Skardu','Hunza','Gilgit','Chitral'
];

const Add_New_Services = ({ onBackToServices, editingService: propEditingService }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingService = propEditingService || route?.params?.service || null;

  const [serviceId, setServiceId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrlsInput, setImageUrlsInput] = useState('');
  const [pickedImages, setPickedImages] = useState([]);
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [showCityList, setShowCityList] = useState(false);
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmPm] = useState('AM');
  const [availability, setAvailability] = useState(true);
  const [isVendorProvided, setIsVendorProvided] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (editingService) {
      setServiceId(editingService.id || null);
      setTitle(editingService.title || '');
      setDescription(editingService.description || '');
      setCity(editingService.city || '');
      setAddress(editingService.address || '');
      setLocation(editingService.location || '');
      setVendorEmail(editingService.vendor_email || '');
      setVendorName(editingService.vendor_name || '');
      setAvailability(!!editingService.availability);
      setIsVendorProvided(!!editingService.is_vendor_provided);
      const imgs = Array.isArray(editingService.images) ? editingService.images : [];
      const urlImgs = imgs.filter((u) => typeof u === 'string' && /^https?:\/\//.test(u));
      const localImgs = imgs.filter((u) => typeof u === 'string' && !/^https?:\/\//.test(u));
      setImageUrlsInput(urlImgs.join(', '));
      setPickedImages(localImgs);
      try {
        const sch = typeof editingService.schedule === 'string' ? JSON.parse(editingService.schedule) : editingService.schedule;
        setFromDate(sch?.range?.from || '');
        setToDate(sch?.range?.to || '');
        if (sch?.time) {
          const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(sch.time);
          if (match) {
            setHour(Number(match[1]));
            setMinute(Number(match[2]));
            setAmPm(match[3].toUpperCase());
          }
        }
      } catch {}
      if (!editingService.city && !editingService.address && editingService.location) {
        const parts = String(editingService.location).split(',');
        if (parts.length >= 2) {
          const c = parts[0].trim();
          const a = parts.slice(1).join(',').trim();
          if (c) setCity(c);
          if (a) setAddress(a);
        }
      }
    }
  }, [editingService]);

  const formatTime = () => {
    const hh = Math.max(1, Math.min(12, Number(hour) || 1));
    const mm = Math.max(0, Math.min(59, Number(minute) || 0));
    const mmPadded = String(mm).padStart(2, '0');
    return `${hh}:${mmPadded} ${ampm}`;
  };

  const validateDates = () => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(fromDate) && re.test(toDate);
  };

  const handlePickImagesWeb = async () => {
    try {
      if (Platform.OS !== 'web') return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = () => {
        const files = Array.from(input.files || []);
        const uris = files.map((f) => URL.createObjectURL(f));
        setPickedImages((prev) => [...prev, ...uris]);
      };
      input.click();
    } catch {}
  };

  const onSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      if (!title || !description) {
        setError('Please fill title and description');
        setSaving(false);
        return;
      }
      if (!validateDates()) {
        setError('Please enter valid From/To dates as YYYY-MM-DD');
        setSaving(false);
        return;
      }
      if (!city) {
        setError('Please select a city');
        setSaving(false);
        return;
      }
      if (!address) {
        setError('Please enter a complete address');
        setSaving(false);
        return;
      }

      const urlList = imageUrlsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const images = [...urlList, ...pickedImages];

      const composedLocation = city && address ? `${city}, ${address}` : (location || '');

      const baseService = {
        title,
        description,
        images,
        location: composedLocation,
        city,
        address,
        schedule: JSON.stringify({ range: { from: fromDate, to: toDate }, time: formatTime() }),
        availability,
        is_vendor_provided: isVendorProvided,
        vendor_email: vendorEmail,
        vendor_name: vendorName,
        allow_booking: true,
        allow_saving: true,
      };

      const existing = await AsyncStorage.getItem('my_services');
      const list = existing ? JSON.parse(existing) : [];

      if (serviceId) {
        const updated = list.map((s) => (s.id === serviceId ? { ...s, ...baseService } : s));
        await AsyncStorage.setItem('my_services', JSON.stringify(updated));
      } else {
        const newService = {
          id: Date.now(),
          ...baseService,
          created_at: new Date().toISOString(),
        };
        list.unshift(newService);
        await AsyncStorage.setItem('my_services', JSON.stringify(list));
      }

      if (onBackToServices) {
        // We're in dashboard mode, use callback to switch back to services tab
        onBackToServices();
      } else {
        // We're in standalone mode, use direct navigation
        navigation.navigate('MyServices');
      }
    } catch (e) {
      setError('Failed to save locally');
    } finally {
      setSaving(false);
    }
  };

  const CityModal = () => (
    <View style={styles.modalWrap} pointerEvents="box-none">
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowCityList(false)} />
      <View style={styles.modalPanel}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select City</Text>
          <TouchableOpacity onPress={() => setShowCityList(false)}><Feather name="x" size={18} color="#334155" /></TouchableOpacity>
        </View>
        <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
          {PAK_CITIES.map((c) => (
            <TouchableOpacity key={c} onPress={() => { setCity(c); setShowCityList(false); }} style={styles.cityItem}>
              <Text style={{ color: '#0f172a' }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  // If onBackToServices is provided, we're in dashboard mode (no header/bottom nav)
  const isInDashboard = !!onBackToServices;
  
  if (isInDashboard) {
    return (
      <View style={styles.wrapper}>
        {showCityList && <CityModal />}
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: 0 }]} keyboardShouldPersistTaps="handled">
        {Platform.OS === 'web' && (
          <TouchableOpacity 
            onPress={() => onBackToServices ? onBackToServices() : navigation.goBack()} 
            style={styles.backArrow}
          >
            <Feather name="arrow-left" size={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <View style={styles.titleWithIcon}>
          <Ionicons 
            name={serviceId ? "create-outline" : "add-circle-outline"} 
            size={24} 
            color="#1f2937" 
            style={{ marginRight: 8 }} 
          />
          <Text style={styles.title}>{serviceId ? 'Edit Service' : 'Add New Service'}</Text>
        </View>

        <TextInput placeholder="Service Title" value={title} onChangeText={setTitle} style={styles.input} />

        <Text style={styles.sectionLabel}>Location</Text>
        <View style={styles.locationRow}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => setShowCityList(true)} style={styles.citySelector}>
              <Text style={{ color: city ? '#111827' : '#6b7280' }}>{city || 'Select City (Pakistan)'}</Text>
              <Feather name="chevron-down" size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 2 }}>
            <TextInput placeholder="Complete address for the event in selected city" value={address} onChangeText={setAddress} style={styles.input} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Date Range (From → To)</Text>
        <View style={styles.dateRow}>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={fromDate}
            onChangeText={setFromDate}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
          <Text style={{ marginHorizontal: 6, fontWeight: '800' }}>→</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={toDate}
            onChangeText={setToDate}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
        </View>

        <Text style={styles.sectionLabel}>Select Time</Text>
        <View style={[styles.timeRow, { marginBottom: 16 }]}>
          <View style={styles.spinnerBox}>
            <TouchableOpacity onPress={() => setHour((h) => (h >= 12 ? 1 : h + 1))} style={styles.spinBtn}><Text>▲</Text></TouchableOpacity>
            <Text style={styles.spinValue}>{hour}</Text>
            <TouchableOpacity onPress={() => setHour((h) => (h <= 1 ? 12 : h - 1))} style={styles.spinBtn}><Text>▼</Text></TouchableOpacity>
          </View>
          <Text style={{ marginHorizontal: 6, fontWeight: '800' }}>:</Text>
          <View style={styles.spinnerBox}>
            <TouchableOpacity onPress={() => setMinute((m) => (m >= 59 ? 0 : m + 1))} style={styles.spinBtn}><Text>▲</Text></TouchableOpacity>
            <Text style={styles.spinValue}>{String(minute).padStart(2, '0')}</Text>
            <TouchableOpacity onPress={() => setMinute((m) => (m <= 0 ? 59 : m - 1))} style={styles.spinBtn}><Text>▼</Text></TouchableOpacity>
          </View>
          <View style={[styles.spinnerBox, { marginLeft: 16 }] }>
            <TouchableOpacity onPress={() => setAmPm(ampm === 'AM' ? 'PM' : 'AM')} style={styles.spinBtn}><Text>⇅</Text></TouchableOpacity>
            <Text style={styles.spinValue}>{ampm}</Text>
            <View style={styles.spinBtn} />
          </View>
        </View>
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline numberOfLines={5} style={[styles.input, styles.textArea]} />

        <Text style={styles.sectionLabel}>Images</Text>
        <TextInput placeholder="Image URLs (comma separated)" value={imageUrlsInput} onChangeText={setImageUrlsInput} style={styles.input} />
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={handlePickImagesWeb} style={[styles.smallBtn, styles.pickBtn]}>
            <Text style={styles.smallBtnText}>Choose Images from device</Text>
          </TouchableOpacity>
        )}
        {!!pickedImages.length && (
          <Text style={{ color: '#6b7280', marginTop: 8, marginBottom: 8 }}>{pickedImages.length} image(s) selected</Text>
        )}

        <View style={[styles.toggleRow, { marginTop: 10, marginBottom: 18 }]}>
          <TouchableOpacity onPress={() => setAvailability((v) => !v)} style={[styles.toggleBtn, availability ? styles.on : styles.off]}>
            <Text style={styles.toggleText}>{availability ? 'Available' : 'Unavailable'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsVendorProvided((v) => !v)} style={[styles.toggleBtn, isVendorProvided ? styles.on : styles.off]}>
            <Text style={styles.toggleText}>{isVendorProvided ? 'Vendor-provided' : 'Third-party'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerBox}>
          <Text style={styles.footerLabel}>Vendor Name</Text>
          <TextInput value={vendorName} onChangeText={setVendorName} placeholder="Your full name" style={styles.input} />
          <Text style={[styles.footerLabel, { marginTop: 6 }]}>Vendor Email</Text>
          <TextInput value={vendorEmail} onChangeText={setVendorEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        </View>

        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{serviceId ? 'Save Changes' : 'Save Experience'}</Text>}
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
    );
  }

  // Standalone mode with header and bottom nav
  return (
    <SafeAreaView style={styles.wrapper}>
      {showCityList && <CityModal />}
      <VendorHeader />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {Platform.OS === 'web' && (
          <TouchableOpacity 
            onPress={() => onBackToServices ? onBackToServices() : navigation.goBack()} 
            style={styles.backArrow}
          >
            <Feather name="arrow-left" size={20} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.form}>
          <Text style={styles.title}>{editingService ? 'Edit Service' : 'Add New Service'}</Text>
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter service title"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your service"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowCityList(true)}>
              <Text style={[styles.inputText, !city && styles.placeholderText]}>{city || 'Select city'}</Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter complete address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vendor Email</Text>
            <TextInput
              style={styles.input}
              value={vendorEmail}
              onChangeText={setVendorEmail}
              placeholder="Enter vendor email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vendor Name</Text>
            <TextInput
              style={styles.input}
              value={vendorName}
              onChangeText={setVendorName}
              placeholder="Enter vendor name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>From Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              value={fromDate}
              onChangeText={setFromDate}
              placeholder="2024-01-01"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>To Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              value={toDate}
              onChangeText={setToDate}
              placeholder="2024-12-31"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.input}
                  value={hour.toString()}
                  onChangeText={(text) => setHour(parseInt(text) || 0)}
                  placeholder="9"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.input}
                  value={minute.toString().padStart(2, '0')}
                  onChangeText={(text) => setMinute(parseInt(text) || 0)}
                  placeholder="00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity style={styles.ampmButton} onPress={() => setAmPm(ampm === 'AM' ? 'PM' : 'AM')}>
                <Text style={styles.ampmText}>{ampm}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URLs (one per line)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={imageUrlsInput}
              onChangeText={setImageUrlsInput}
              placeholder="Enter image URLs, one per line"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          {Platform.OS === 'web' && (
            <View style={styles.inputGroup}>
              <TouchableOpacity style={styles.imageButton} onPress={handlePickImagesWeb}>
                <Feather name="image" size={20} color="#FFFFFF" />
                <Text style={styles.imageButtonText}>Pick Images</Text>
              </TouchableOpacity>
            </View>
          )}

          {pickedImages.length > 0 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Selected Images</Text>
              <ScrollView horizontal style={styles.imagePreview}>
                {pickedImages.map((uri, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Text style={styles.imageUrl}>{uri.substring(0, 30)}...</Text>
                    <TouchableOpacity onPress={() => setPickedImages(prev => prev.filter((_, i) => i !== index))} style={styles.removeImage}>
                      <Feather name="x" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAvailability(!availability)}>
              <View style={[styles.checkbox, availability && styles.checkboxChecked]}>
                {availability && <Feather name="check" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Available</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setIsVendorProvided(!isVendorProvided)}>
              <View style={[styles.checkbox, isVendorProvided && styles.checkboxChecked]}>
                {isVendorProvided && <Feather name="check" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Vendor Provided</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{serviceId ? 'Save Changes' : 'Save Experience'}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { 
    padding: isMobile ? 16 : 32, 
    width: '100%', 
    flexGrow: 1,
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Add top padding for fixed header on web
    paddingBottom: 100, // Account for bottom navigation bar
  },
  backArrow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 16 },
  backText: { marginLeft: 6, fontSize: 14 },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  input: { height: 44, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 8, marginBottom: 14, paddingHorizontal: 12, backgroundColor: '#FFFFFF' },
  textArea: { height: 120, textAlignVertical: 'top' },
  sectionLabel: { fontWeight: '700', color: '#0f172a', marginTop: 6, marginBottom: 6 },
  locationRow: { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-start', marginBottom: 12 },
  citySelector: { height: 44, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  smallBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  smallBtnText: { color: '#fff', fontWeight: '700' },
  pickBtn: { backgroundColor: '#6366f1', alignSelf: 'flex-start', marginTop: 4, marginBottom: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  spinnerBox: { alignItems: 'center', justifyContent: 'center' },
  spinBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  spinValue: { minWidth: 26, textAlign: 'center', fontWeight: '800', color: '#0f172a', marginVertical: 4 },
  toggleRow: { flexDirection: 'row', gap: 14 },
  toggleBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  on: { backgroundColor: '#dcfce7' },
  off: { backgroundColor: '#fee2e2' },
  toggleText: { fontWeight: '700', color: '#0f172a' },
  footerBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 16, marginTop: 8 },
  button: { marginTop: 10, backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  errorText: { color: '#b91c1c', marginBottom: 8, textAlign: 'left' },
  // Modal styles
  modalWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000, alignItems: 'center', justifyContent: 'center' },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)' },
  modalPanel: { width: Math.min(500, screenWidth - 40), maxHeight: 420, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalTitle: { fontWeight: '800', color: '#0f172a' },
  modalScroll: { paddingVertical: 6 },
  cityItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
});

export default Add_New_Services;
