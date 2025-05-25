// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const { width } = Dimensions.get('window');
// const isMobile = width < 768;

// const PostLoginCheckScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { name, email, selectedTypes = [] } = route.params || {};

//   const handleVerified = () => {
//     navigation.navigate('VendorDashboard', {
//       name,
//       email,
//       selectedTypes,
//     });
//   };

//   const handleNotVerified = () => {
//     navigation.navigate('VendorVerificationScreen', {
//       name,
//       email,
//       selectedTypes,
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.cardWrapper}>
//         <Text style={styles.title}>Vendor Verification</Text>
//         <Text style={styles.subTitle}>
//           Hello {name || 'Vendor'}, please confirm your verification status to continue.
//         </Text>

//         {/* ✅ I Am Verified */}
//         <TouchableOpacity
//           style={[styles.card, styles.greenCard]}
//           onPress={handleVerified}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.cardTitle}>✅ I Am Verified</Text>
//           <Text style={styles.cardDescription}>
//             I have already received a verification token from the admin.
//           </Text>
//         </TouchableOpacity>

//         {/* ❌ I Need to Verify */}
//         <TouchableOpacity
//           style={[styles.card, styles.redCard]}
//           onPress={handleNotVerified}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.cardTitle}>❌ I Need to Verify</Text>
//           <Text style={styles.cardDescription}>
//             I haven’t verified my account yet. I want to upload verification documents now.
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e9f0f7',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   cardWrapper: {
//     backgroundColor: '#fff',
//     width: '100%',
//     maxWidth: 500,
//     padding: 30,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 8 },
//     shadowRadius: 12,
//     elevation: 10,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: isMobile ? 24 : 28,
//     fontWeight: '800',
//     color: '#003554',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   subTitle: {
//     fontSize: 14,
//     color: '#444',
//     textAlign: 'center',
//     marginBottom: 28,
//     paddingHorizontal: 10,
//   },
//   card: {
//     width: '100%',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOpacity: Platform.OS === 'web' ? 0.08 : 0.15,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 10,
//     elevation: 6,
//     borderWidth: 2,
//   },
//   greenCard: {
//     backgroundColor: '#e7fbe7',
//     borderColor: '#2e7d32',
//   },
//   redCard: {
//     backgroundColor: '#fde6e6',
//     borderColor: '#d32f2f',
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111',
//     marginBottom: 8,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: '#444',
//     lineHeight: 20,
//   },
// });

// export default PostLoginCheckScreen;

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PostLoginCheckScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Fallbacks to avoid undefined issues
  const {
    name = 'Demo Vendor',
    email = 'demo@example.com',
    selectedTypes = ['hotel'],
  } = route.params || {};

  useEffect(() => {
    const simulateVerificationCheck = async () => {
      console.log('⏳ Starting 10s verification check...');

      await new Promise(resolve => setTimeout(resolve, 10000));

      console.log('✅ Verification complete, redirecting...');

      navigation.replace('VendorDashboardScreen', {
        name,
        selectedTypes,
        verified: true,
      });
    };

    simulateVerificationCheck();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0077b6" />
      <Text style={styles.text}>Checking your verification status...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
});

export default PostLoginCheckScreen;
