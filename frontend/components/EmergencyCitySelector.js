// // components/EmergencyCitySelector.js
// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const COLORS = {
//   primary: '#0c2444ff',
//   background: '#F6FAFD',
//   card: '#FFFFFF',
//   text: '#0F3A6B',
//   subtext: '#6B7280',
//   border: '#EAF0F6',
//   error: '#EF4444',
// };

// export default function EmergencyCitySelector({ 
//   visible, 
//   cities, 
//   onSelectCity, 
//   onClose 
// }) {
//   console.log('🎨 EmergencyCitySelector rendered');
//   console.log('   visible:', visible);
//   console.log('   cities:', JSON.stringify(cities));
//   console.log('   cities length:', cities?.length);
//   console.log('   cities is array:', Array.isArray(cities));
  
//   if (!visible) {
//     return null;
//   }
  
//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View style={styles.headerIcon}>
//               <Ionicons name="medical" size={24} color={COLORS.error} />
//             </View>
//             <Text style={styles.headerTitle}>Select Destination</Text>
//             <Text style={styles.headerSubtitle}>
//               Choose a city for emergency contacts
//             </Text>
//           </View>

//           {/* Cities Grid */}
//           <View style={styles.content}>
//             {/* Debug: Always show this text */}
//             <Text style={{ padding: 20, textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 16 }}>
//               {cities && cities.length > 0 
//                 ? `Found ${cities.length} cities` 
//                 : 'No cities detected'}
//             </Text>
            
//             <ScrollView style={styles.scrollView}>
//               {cities && cities.length > 0 ? (
//                 <View style={styles.grid}>
//                   {cities.map((city, index) => (
//                     <View key={`city-${index}`} style={styles.cityCardWrapper}>
//                       <TouchableOpacity
//                         style={styles.cityCard}
//                         onPress={() => {
//                           console.log('City card pressed:', city);
//                           onSelectCity(city);
//                           onClose();
//                         }}
//                         activeOpacity={0.7}
//                       >
//                         <View style={styles.cityIconContainer}>
//                           <Ionicons name="location" size={28} color={COLORS.error} />
//                         </View>
//                         <Text style={styles.cityName} numberOfLines={2}>
//                           {city}
//                         </Text>
//                         <View style={styles.badge}>
//                           <Ionicons name="sparkles" size={10} color="#10B981" />
//                           <Text style={styles.badgeText}>From your trip</Text>
//                         </View>
//                       </TouchableOpacity>
//                     </View>
//                   ))}

//                   {/* Other City Option */}
//                   <View style={styles.cityCardWrapper}>
//                     <TouchableOpacity
//                       style={[styles.cityCard, styles.otherCityCard]}
//                       onPress={() => {
//                         console.log('Other city pressed');
//                         onSelectCity('Islamabad');
//                         onClose();
//                       }}
//                       activeOpacity={0.7}
//                     >
//                       <View style={[styles.cityIconContainer, styles.otherIcon]}>
//                         <Ionicons name="search" size={28} color={COLORS.primary} />
//                       </View>
//                       <Text style={styles.cityName}>Other City</Text>
//                       <Text style={styles.otherText}>Browse all cities</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               ) : (
//                 <View style={styles.noCitiesContainer}>
//                   <Ionicons name="location-outline" size={48} color={COLORS.subtext} />
//                   <Text style={styles.noCitiesText}>No cities detected from your trips</Text>
//                   <TouchableOpacity
//                     style={styles.defaultCityButton}
//                     onPress={() => {
//                       console.log('Default city button pressed');
//                       onSelectCity('Islamabad');
//                       onClose();
//                     }}
//                     activeOpacity={0.7}
//                   >
//                     <Text style={styles.defaultCityButtonText}>Use Islamabad</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </ScrollView>
//           </View>

//           {/* Close Button */}
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={onClose}
//             activeOpacity={0.9}
//           >
//             <Text style={styles.closeButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   container: {
//     backgroundColor: COLORS.background,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingTop: 20,
//     paddingBottom: 40,
//     maxHeight: '90%',
//     height: 600,
//   },
//   header: {
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   headerIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#FEE2E2',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: COLORS.text,
//     marginBottom: 6,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: COLORS.subtext,
//     textAlign: 'center',
//   },
//   content: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//     paddingTop: 10,
//     minHeight: 400,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 12,
//     paddingBottom: 20,
//   },
//   cityCardWrapper: {
//     width: '50%',
//     padding: 6,
//   },
//   cityCard: {
//     width: '100%',
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.error,
//     minHeight: 160,
//   },
//   otherCityCard: {
//     borderColor: COLORS.border,
//     borderStyle: 'dashed',
//   },
//   cityIconContainer: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#FEE2E2',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   otherIcon: {
//     backgroundColor: '#EFF6FF',
//   },
//   cityName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: COLORS.text,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#DCFCE7',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginTop: 4,
//   },
//   badgeText: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: '#10B981',
//     marginLeft: 4,
//   },
//   otherText: {
//     fontSize: 12,
//     color: COLORS.subtext,
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   noCitiesContainer: {
//     width: '100%',
//     alignItems: 'center',
//     padding: 40,
//     marginTop: 20,
//   },
//   noCitiesText: {
//     fontSize: 15,
//     color: COLORS.subtext,
//     marginTop: 12,
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   defaultCityButton: {
//     backgroundColor: COLORS.error,
//     paddingVertical: 14,
//     paddingHorizontal: 32,
//     borderRadius: 12,
//   },
//   defaultCityButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   closeButton: {
//     marginHorizontal: 24,
//     marginTop: 12,
//     marginBottom: 8,
//     backgroundColor: COLORS.card,
//     paddingVertical: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   closeButtonText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.text,
//     textAlign: 'center',
//   },
// });



// components/EmergencyCitySelector.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#0c2444ff',
  background: '#F6FAFD',
  card: '#FFFFFF',
  text: '#0F3A6B',
  subtext: '#6B7280',
  border: '#EAF0F6',
  error: '#EF4444',
};

export default function EmergencyCitySelector({ 
  visible, 
  cities, 
  onSelectCity, 
  onClose 
}) {
  if (!visible) {
    return null;
  }
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="medical" size={24} color={COLORS.error} />
            </View>
            <Text style={styles.headerTitle}>Select Destination</Text>
            <Text style={styles.headerSubtitle}>
              Choose a city for emergency contacts
            </Text>
          </View>

          {/* Cities Grid */}
          <View style={styles.content}>
            <ScrollView style={styles.scrollView}>
              {cities && cities.length > 0 ? (
                <View style={styles.grid}>
                  {cities.map((city, index) => (
                    <View key={`city-${index}`} style={styles.cityCardWrapper}>
                      <TouchableOpacity
                        style={styles.cityCard}
                        onPress={() => {
                          onSelectCity(city);
                          onClose();
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.cityIconContainer}>
                          <Ionicons name="location" size={28} color={COLORS.error} />
                        </View>
                        <Text style={styles.cityName} numberOfLines={2}>
                          {city}
                        </Text>
                        <View style={styles.badge}>
                          <Ionicons name="sparkles" size={10} color="#10B981" />
                          <Text style={styles.badgeText}>From your trip</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Other City Option */}
                  <View style={styles.cityCardWrapper}>
                    <TouchableOpacity
                      style={[styles.cityCard, styles.otherCityCard]}
                      onPress={() => {
                        onSelectCity('Islamabad');
                        onClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.cityIconContainer, styles.otherIcon]}>
                        <Ionicons name="search" size={28} color={COLORS.primary} />
                      </View>
                      <Text style={styles.cityName}>Other City</Text>
                      <Text style={styles.otherText}>Browse all cities</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.noCitiesContainer}>
                  <Ionicons name="location-outline" size={48} color={COLORS.subtext} />
                  <Text style={styles.noCitiesText}>No cities detected from your trips</Text>
                  <TouchableOpacity
                    style={styles.defaultCityButton}
                    onPress={() => {
                      onSelectCity('Islamabad');
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.defaultCityButtonText}>Use Islamabad</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.9}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '90%',
    height: 600,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 10,
    minHeight: 400,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingBottom: 80,
  },
  cityCardWrapper: {
    width: '50%',
    padding: 6,
  },
  cityCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.error,
    minHeight: 160,
  },
  otherCityCard: {
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  cityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  otherIcon: {
    backgroundColor: '#EFF6FF',
  },
  cityName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  otherText: {
    fontSize: 12,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 4,
  },
  noCitiesContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
    paddingBottom: 100,
  },
  noCitiesText: {
    fontSize: 15,
    color: COLORS.subtext,
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  defaultCityButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  defaultCityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
});