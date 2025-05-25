import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const dummyOffers = [
  {
    id: '1',
    title: '10% Off - Deluxe Room',
    validTill: '2025-06-30',
  },
  {
    id: '2',
    title: 'Weekend Getaway Deal',
    validTill: '2025-07-15',
  },
];

const Manage_My_Offer = () => {
  const navigation = useNavigation();

  const handleEdit = (id) => alert(`Edit Offer ${id}`);
  const handleDelete = (id) => alert(`Deleted Offer ${id}`);

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* ✅ Web-only back arrow */}
      {Platform.OS === 'web' && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Feather name="arrow-left" size={20} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.heading}>📋 Manage My Offers</Text>

      <FlatList
        data={dummyOffers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.offerCard}>
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerSubtitle}>Valid Till: {item.validTill}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item.id)}>
                <Feather name="edit" size={18} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Feather name="trash-2" size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: isMobile ? 16 : 32,
    paddingTop: 20,
    backgroundColor: '#F9FAFB',
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
    marginBottom: 20,
    color: '#111827',
  },
  listContainer: {
    paddingBottom: 20,
  },
  offerCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  offerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default Manage_My_Offer;
