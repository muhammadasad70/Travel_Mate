import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const pakistanCities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Peshawar', 'Quetta', 'Sialkot',
  'Bahawalpur', 'Sargodha', 'Sukkur', 'Jhang', 'Sheikhupura', 'Mardan', 'Gujrat', 'Larkana', 'Kasur', 'Rahim Yar Khan',
  'Sahiwal', 'Okara', 'Wah Cantonment', 'Mingora', 'Nawabshah', 'Chiniot', 'Kotri', 'Khanpur', 'Hafizabad', 'Kohat',
  'Jacobabad', 'Shikarpur', 'Muzaffargarh', 'Khanewal', 'Jhelum', 'Hub', 'Daska', 'Gojra', 'Dadu', 'Mandi Bahauddin',
  'Tando Allahyar', 'Vehari', 'Kot Addu', 'Nowshera', 'Charsadda', 'Qila Abdullah', 'Bahawalnagar', 'Dera Ismail Khan',
  'Chakwal', 'Swabi', 'Lodhran', 'Nankana Sahib', 'Hasilpur', 'Awaran', 'Zhob', 'Mailsi', 'Kotli', 'Hangu'
];

const Offer_Cultural_Skill = ({ route, onBackToServices }) => {
  const navigation = useNavigation();
  const editingSkill = route?.params?.skill;
  
  const [skillTitle, setSkillTitle] = useState(editingSkill?.title || '');
  const [duration, setDuration] = useState(editingSkill?.duration || '');
  const [selectedCity, setSelectedCity] = useState(editingSkill?.city || '');
  const [address, setAddress] = useState(editingSkill?.address || '');
  const [price, setPrice] = useState(editingSkill?.price || '');
  const [contactEmail, setContactEmail] = useState(editingSkill?.contactEmail || '');
  const [slotsAvailable, setSlotsAvailable] = useState(editingSkill?.slotsAvailable?.toString() || '');
  const [imageUrl, setImageUrl] = useState(editingSkill?.imageUrl || '');
  const [cityModalVisible, setCityModalVisible] = useState(false);

  // Initialize form state based on whether we're editing or creating
  useEffect(() => {
    if (editingSkill) {
      setSkillTitle(editingSkill.title || '');
      setDuration(editingSkill.duration || '');
      setSelectedCity(editingSkill.city || '');
      setAddress(editingSkill.address || '');
      setPrice(editingSkill.price || '');
      setContactEmail(editingSkill.contactEmail || '');
      setSlotsAvailable(editingSkill.slotsAvailable?.toString() || '');
      setImageUrl(editingSkill.imageUrl || '');
    } else {
      // Clear form for new skill
      setSkillTitle('');
      setDuration('');
      setSelectedCity('');
      setAddress('');
      setPrice('');
      setContactEmail('');
      setSlotsAvailable('');
      setImageUrl('');
    }
  }, [editingSkill]);

  const handleSave = async () => {
    if (!skillTitle || !duration || !selectedCity || !address || !price || !contactEmail || !slotsAvailable) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const skillData = {
        title: skillTitle,
        duration: duration,
        city: selectedCity,
        address: address,
        location: `${selectedCity}, ${address}`,
        price: price,
        contactEmail: contactEmail,
        slotsAvailable: parseInt(slotsAvailable),
        imageUrl: imageUrl,
        type: 'cultural_skill'
      };

      // Get existing skills from AsyncStorage
      const existingSkills = await AsyncStorage.getItem('cultural_skills');
      const skills = existingSkills ? JSON.parse(existingSkills) : [];
      
      if (editingSkill) {
        // Update existing skill
        const updatedSkills = skills.map(skill => 
          skill.id === editingSkill.id 
            ? { ...skill, ...skillData, updated_at: new Date().toISOString() }
            : skill
        );
        await AsyncStorage.setItem('cultural_skills', JSON.stringify(updatedSkills));
        Alert.alert('Success', 'Cultural skill updated successfully!');
        // Navigate immediately after showing the alert
        setTimeout(() => {
          navigation.navigate('MyCulturalListings');
        }, 100);
      } else {
        // Create new skill
        const newSkill = {
          id: Date.now(),
          ...skillData,
          created_at: new Date().toISOString(),
        };
        skills.unshift(newSkill);
        await AsyncStorage.setItem('cultural_skills', JSON.stringify(skills));
        Alert.alert('Success', 'Cultural skill saved successfully!');
        // Navigate immediately after showing the alert
        setTimeout(() => {
          navigation.navigate('MyCulturalListings');
        }, 100);
      }
    } catch (error) {
      console.error('Error saving cultural skill:', error);
      Alert.alert('Error', 'Failed to save cultural skill');
    }
  };


  // Check if we're in dashboard mode
  const isInDashboard = !!onBackToServices;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {!isInDashboard && <VendorHeader />}
      <ScrollView contentContainerStyle={[styles.container, isInDashboard && { paddingTop: 0 }]}>
        <TouchableOpacity onPress={() => onBackToServices ? onBackToServices() : navigation.navigate('MyCulturalListings')} style={styles.backArrow}>
          <Feather name="arrow-left" size={20} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleWithIcon}>
          <Ionicons 
            name={editingSkill ? "create-outline" : "add-circle-outline"} 
            size={24} 
            color="#1f2937" 
            style={{ marginRight: 8 }} 
          />
          <Text style={styles.title}>
            {editingSkill ? 'Edit Cultural Skill' : 'Add Cultural Skill'}
          </Text>
        </View>
        
        <TextInput
          placeholder="Skill Title (e.g., Traditional Pottery Workshop)"
          value={skillTitle}
          onChangeText={setSkillTitle}
          style={styles.input}
        />
        
        <TextInput
          placeholder="Duration (e.g., 2 hours, 1 day)"
          value={duration}
          onChangeText={setDuration}
          style={styles.input}
        />
        
        <View style={styles.locationRow}>
          <TouchableOpacity style={[styles.input, styles.cityInput]} onPress={() => setCityModalVisible(true)}>
            <Text style={selectedCity ? styles.cityText : styles.cityPlaceholder}>
              {selectedCity || 'Select City (Pakistan)'}
            </Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Complete address"
            value={address}
            onChangeText={setAddress}
            style={[styles.input, styles.addressInput]}
          />
        </View>

        <TextInput
          placeholder="Price (e.g., PKR 1500)"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
        />
        
        <TextInput
          placeholder="Contact Email"
          value={contactEmail}
          onChangeText={setContactEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        
        <TextInput
          placeholder="Slots Available (number)"
          value={slotsAvailable}
          onChangeText={setSlotsAvailable}
          style={styles.input}
          keyboardType="numeric"
        />
        
        <TextInput
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {editingSkill ? 'Update Listing' : 'Save Cultural Skill'}
          </Text>
        </TouchableOpacity>

        {/* City Selection Modal */}
        <Modal
          visible={cityModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setCityModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select City</Text>
                <TouchableOpacity onPress={() => setCityModalVisible(false)}>
                  <Feather name="x" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={pakistanCities}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => {
                      setSelectedCity(item);
                      setCityModalVisible(false);
                    }}
                  >
                    <Text style={styles.cityItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.cityList}
              />
            </View>
        </View>
        </Modal>
      </ScrollView>
      {!isInDashboard && <VendorBottomNavBar />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 100, // Account for bottom navigation bar
    paddingTop: Platform.OS === 'web' ? 120 : 16, // Adjust for fixed header on web
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  locationRow: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 12,
    marginBottom: 16,
  },
  cityInput: {
    flex: isMobile ? 1 : 0.4,
    justifyContent: 'center',
  },
  addressInput: {
    flex: isMobile ? 1 : 0.6,
  },
  cityText: {
    fontSize: 16,
    color: '#111827',
  },
  cityPlaceholder: {
    fontSize: 16,
    color: '#9ca3af',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cityList: {
    maxHeight: 300,
  },
  cityItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cityItemText: {
    fontSize: 16,
    color: '#374151',
  },
  backArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#374151',
  },
});

export default Offer_Cultural_Skill;
