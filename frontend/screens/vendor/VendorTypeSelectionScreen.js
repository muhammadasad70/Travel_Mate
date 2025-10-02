

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const vendorTypes = [
//   { label: 'Accommodations', value: 'accommodation', icon: <FontAwesome5 name="hotel" size={20} /> },
//   { label: 'Cultural Exchange', value: 'cultural', icon: <MaterialCommunityIcons name="account-group" size={20} /> },
//   { label: 'Tour Guider', value: 'guide', icon: <MaterialCommunityIcons name="map-marker-path" size={22} /> },
//   { label: 'Product Seller', value: 'product', icon: <Feather name="shopping-bag" size={20} /> },
// ];

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;
// const isMobile = screenWidth < 768;

// const VendorTypeSelectionScreen = () => {
//   const [selectedType, setSelectedType] = useState(null);
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { name, email } = route.params || {};

//   const selectType = (type) => setSelectedType(type);

//   const handleContinue = async () => {
//     if (!selectedType) {
//       Alert.alert('Select a category', 'Please choose one vendor category to continue.');
//       return;
//     }

//     try {
//       await AsyncStorage.setItem('vendor_type', selectedType);
//     } catch (error) {
//       console.log('Error storing vendor type:', error);
//     }

//     // Go to a single dashboard that is role-aware
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'VendorDashboard' }],
//     });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={[styles.card, { width: isMobile ? '100%' : '90%' }]}>
//         <View style={styles.titleContainer}>
//           <Feather name="user-plus" size={24} color="#0ea5e9" style={{ marginRight: 8 }} />
//           <Text style={styles.greeting}>Vendor Registration</Text>
//         </View>

//         <Text style={styles.subText}>
//           <Text style={styles.subHighlight}>Select one category</Text> to register your services:
//         </Text>

//         <View style={styles.cardsContainer}>
//           {vendorTypes.map((type, idx) => {
//             const isSelected = selectedType === type.value;
//             return (
//               <TouchableOpacity
//                 key={idx}
//                 style={[styles.cardOption, isSelected && styles.selectedCardOption]}
//                 onPress={() => selectType(type.value)}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.cardContent}>
//                   <View style={styles.iconContainer}>{type.icon}</View>
//                   <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
//                     {type.label}
//                   </Text>
//                   {isSelected && (
//                     <View style={styles.checkmarkContainer}>
//                       <Text style={styles.checkmark}>✅</Text>
//                     </View>
//                   )}
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
//           <Feather name="arrow-right" size={20} color="#ffffff" style={{ marginRight: 8 }} />
//           <Text style={styles.btnText}>Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     minHeight: screenHeight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#f0f4f8',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 30,
//     borderRadius: 20,
//     maxWidth: 500,
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 5 },
//     shadowRadius: 8,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: '#003554',
//     textAlign: 'center',
//   },
//   subText: {
//     fontSize: 15,
//     color: '#333',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   subHighlight: {
//     fontWeight: '700',
//     color: '#000',
//   },
//   cardsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 20,
//   },
//   cardOption: {
//     width: '48%',
//     backgroundColor: '#f8fafc',
//     borderRadius: 16,
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: '#e2e8f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   selectedCardOption: {
//     backgroundColor: '#ecfdf5',
//     borderColor: '#10b981',
//     shadowColor: '#10b981',
//     shadowOpacity: 0.2,
//   },
//   cardContent: {
//     padding: 20,
//     alignItems: 'center',
//     position: 'relative',
//     minHeight: 120,
//     justifyContent: 'center',
//   },
//   iconContainer: {
//     marginBottom: 12,
//     padding: 12,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   cardText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   selectedCardText: {
//     color: '#059669',
//     fontWeight: '700',
//   },
//   checkmarkContainer: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: '#10b981',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkmark: {
//     fontSize: 12,
//   },
//   continueBtn: {
//     backgroundColor: '#0077b6',
//     paddingVertical: 14,
//     borderRadius: 12,
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   btnText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//   },
// });

// export default VendorTypeSelectionScreen;


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const vendorTypes = [
  { label: 'Accommodation',     value: 'hotel',    icon: <FontAwesome5 name="hotel" size={20} /> },
  { label: 'Cultural Exchange', value: 'cultural', icon: <MaterialCommunityIcons name="account-group" size={20} /> },
  { label: 'Tour Guide',        value: 'guide',    icon: <MaterialCommunityIcons name="map-marker-path" size={22} /> },
  { label: 'Product Seller',    value: 'product',  icon: <Feather name="shopping-bag" size={20} /> },
];

const screenWidth  = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const isMobile     = screenWidth < 768;

const VendorTypeSelectionScreen = () => {
  const [selectedType, setSelectedType] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { name, email } = route.params || {};

  useEffect(() => {
    (async () => {
      try {
        const prev = await AsyncStorage.getItem('vendor_type');
        if (prev && ['hotel','cultural','guide','product'].includes(prev)) {
          setSelectedType(prev);
        }
      } catch (e) {
        if (Platform.OS !== 'web') console.log('Prefill vendor_type failed:', e);
      }
    })();
  }, []);

  const selectType = (type) => setSelectedType(type);

  const handleContinue = async () => {
    if (!selectedType) {
      Alert.alert('Select a category', 'Please choose one vendor category to continue.');
      return;
    }
    try {
      await AsyncStorage.setItem('vendor_type', selectedType);
      await AsyncStorage.setItem('role', 'vendor'); // optional
    } catch (error) {
      if (Platform.OS !== 'web') console.log('Error storing vendor type:', error);
    }

    navigation.reset({ index: 0, routes: [{ name: 'VendorDashboard' }] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { width: isMobile ? '100%' : '90%' }]}>
        <View style={styles.titleContainer}>
          <Feather name="user-plus" size={24} color="#0ea5e9" style={{ marginRight: 8 }} />
          <Text style={styles.greeting}>Vendor Registration</Text>
        </View>

        <Text style={styles.subText}>
          <Text style={styles.subHighlight}>Select one category</Text> to register your services:
        </Text>

        <View style={styles.cardsContainer}>
          {vendorTypes.map((type, idx) => {
            const isSelected = selectedType === type.value;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.cardOption, isSelected && styles.selectedCardOption]}
                onPress={() => selectType(type.value)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>{type.icon}</View>
                  <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
                    {type.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <Text style={styles.checkmark}>✅</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Feather name="arrow-right" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    maxWidth: 500,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: '#003554', textAlign: 'center' },
  subText: { fontSize: 15, color: '#333', marginBottom: 20, textAlign: 'center' },
  subHighlight: { fontWeight: '700', color: '#000' },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  cardOption: {
    width: '48%', backgroundColor: '#f8fafc', borderRadius: 16, marginBottom: 16,
    borderWidth: 2, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  selectedCardOption: { backgroundColor: '#ecfdf5', borderColor: '#10b981', shadowColor: '#10b981', shadowOpacity: 0.2 },
  cardContent: { padding: 20, alignItems: 'center', position: 'relative', minHeight: 120, justifyContent: 'center' },
  iconContainer: {
    marginBottom: 12, padding: 12, backgroundColor: '#ffffff', borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  cardText: { fontSize: 14, fontWeight: '600', color: '#374151', textAlign: 'center', lineHeight: 20 },
  selectedCardText: { color: '#059669', fontWeight: '700' },
  checkmarkContainer: { position: 'absolute', top: 8, right: 8, backgroundColor: '#10b981', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  checkmark: { fontSize: 12 },
  continueBtn: {
    backgroundColor: '#0077b6', paddingVertical: 14, borderRadius: 12, width: '100%',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default VendorTypeSelectionScreen;
