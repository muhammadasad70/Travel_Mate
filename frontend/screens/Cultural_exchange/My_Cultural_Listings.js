import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VendorHeader from '../../components/VendorDashboard/VendorHeader';
import VendorBottomNavBar from '../../components/VendorDashboard/VendorBottomNavBar';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 900;

const My_Cultural_Listings = ({ onAddService }) => {
  const navigation = useNavigation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showListings, setShowListings] = useState(false);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const storedSkills = await AsyncStorage.getItem('cultural_skills');
      const skillsList = storedSkills ? JSON.parse(storedSkills) : [];
      setSkills(skillsList);
    } catch (error) {
      console.error('Error loading cultural skills:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
    const unsubscribe = navigation.addListener('focus', fetchSkills);
    return unsubscribe;
  }, [fetchSkills, navigation]);

  const handleEdit = (skill) => {
    if (onAddService) {
      onAddService(skill); // Pass the skill data to the callback
    } else {
      navigation.navigate('OfferCulturalSkill', { skill });
    }
  };



  const handleDelete = async (skillId) => {
    try {
      const storedSkills = await AsyncStorage.getItem('cultural_skills');
      const currentSkills = storedSkills ? JSON.parse(storedSkills) : [];
      const updated = currentSkills.filter((s) => s.id !== skillId);
      await AsyncStorage.setItem('cultural_skills', JSON.stringify(updated));
      await fetchSkills();
    } catch {}
  };

  const confirmDelete = (skillId) => {
    Alert.alert('Delete Cultural Skill', 'Are you sure you want to delete this cultural skill?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(skillId) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <VendorHeader />
      <View style={styles.container}>
        {/* Add Cultural Skill Card Button */}
        <TouchableOpacity 
          style={styles.addSkillCard}
          onPress={() => onAddService ? onAddService() : navigation.navigate('OfferCulturalSkill')}
        >
          <View style={styles.addSkillCardContent}>
            <Ionicons name="add-circle" size={24} color="#0ea5e9" />
            <Text style={styles.addSkillCardText}>Add Cultural Skill</Text>
          </View>
        </TouchableOpacity>

        {/* View Cultural Listings Card Button */}
        <TouchableOpacity 
          style={styles.viewListingsCard}
          onPress={() => setShowListings(!showListings)}
        >
          <View style={styles.viewListingsCardContent}>
            <Ionicons name="list" size={24} color="#10b981" />
            <Text style={styles.viewListingsCardText}>View Cultural Listings</Text>
          </View>
        </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {showListings && (
          <>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading your cultural skills...</Text>
              </View>
            ) : (
              <View style={styles.content}>
                <Text style={styles.label}>
                  📝 You currently have {skills.length} cultural skill{skills.length !== 1 ? 's' : ''}:
                </Text>

                {skills.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyTitle}>No cultural skills yet</Text>
                    <Text style={styles.emptyDescription}>Create your first cultural skill to get started.</Text>
                    <TouchableOpacity 
                      style={styles.addButton} 
                      onPress={() => onAddService ? onAddService() : navigation.navigate('OfferCulturalSkill')}
                    >
                      <Text style={styles.addButtonText}>Add Cultural Skill</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  skills.map((skill) => {
                    const skillImage = skill.imageUrl && skill.imageUrl.trim() ? skill.imageUrl.trim() : null;
                    
                    return (
                      <View key={skill.id} style={styles.listingBox}>
                        <View style={styles.skillRow}>
                          <View style={styles.skillContent}>
                            <Text style={styles.listingTitle}>{skill.title}</Text>
                            <Text style={styles.description}>Duration: {skill.duration}</Text>
                            <Text style={styles.description}>Location: {skill.location}</Text>
                            <Text style={styles.description}>Price: {skill.price}</Text>
                            <Text style={styles.description}>Slots Available: {skill.slotsAvailable}</Text>
                            <Text style={styles.description}>Contact: {skill.contactEmail}</Text>
                            <View style={styles.actionsRow}>
                              <TouchableOpacity 
                                onPress={() => handleEdit(skill)} 
                                style={[styles.actionButton, styles.editButton]}
                              >
                                <Text style={styles.actionButtonText}>Edit</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                onPress={() => confirmDelete(skill.id)} 
                                style={[styles.actionButton, styles.deleteButton]}
                              >
                                <Text style={styles.actionButtonText}>Delete</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={styles.imageCol}>
                            {skillImage ? (
                              <Image source={{ uri: skillImage }} style={styles.skillImage} resizeMode="cover" />
                            ) : (
                              <View style={[styles.skillImage, styles.imagePlaceholder]}>
                                <Text style={styles.imagePlaceholderText}>No image</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })
                )}

                {skills.length > 0 && (
                  <Text style={styles.tip}>Add more cultural skills using the "Add Cultural Skill" button above.</Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
      </View>
      <VendorBottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isMobile ? 16 : 24,
    paddingTop: 0, // Remove extra padding since we're in dashboard mode
  },
  scrollContainer: {
    paddingBottom: 100, // Increased to account for bottom navigation bar
  },
  addSkillCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  addSkillCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSkillCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  viewListingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  viewListingsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewListingsCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  content: {
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  listingBox: {
    backgroundColor: '#FFF7ED',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  skillRow: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  skillContent: {
    flex: 1,
  },
  imageCol: {
    width: isMobile ? '100%' : '38%',
    alignSelf: 'stretch',
  },
  skillImage: {
    width: '100%',
    height: '100%',
    minHeight: 120,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#374151',
  },
  tip: {
    marginTop: 16,
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#0284c7',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default My_Cultural_Listings;
