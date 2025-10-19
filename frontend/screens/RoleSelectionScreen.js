

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   Animated,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useRole } from '../RoleContext';
// import BgImage from '../assets/background.jpg';
// import TravelerLogo from '../assets/traveler.jpeg';
// import VendorLogo from '../assets/vendor.jpg';

// const { width } = Dimensions.get('window');

// const RoleSelectionScreen = () => {
//   const navigation = useNavigation();
//   const { setRole } = useRole();

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const [activeRole, setActiveRole] = useState(null);

//   const handleSelect = (selectedRole) => {
//     setActiveRole(selectedRole); // highlight clicked card
//     setRole(selectedRole);

//     setTimeout(() => {
//       navigation.navigate('Login', { selectedRole });
//     }, 200); // slight delay to show effect
//   };

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 600,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   return (
//     <ImageBackground source={BgImage} style={styles.background} resizeMode="cover">
//       <View style={styles.overlay}>
//         <Animated.View style={{ opacity: fadeAnim }}>
//           <Text style={styles.heading}>
//             Select <Text style={styles.highlight}>how you'd like to explore… ✈️</Text>
//           </Text>

//           <View style={styles.buttonRow}>
//             <TouchableOpacity
//               style={[
//                 styles.roleCard,
//                 Platform.OS === 'web' && styles.webHover,
//                 Platform.OS === 'web' && activeRole === 'traveler' && styles.activeCard,
//               ]}
//               onPress={() => handleSelect('traveler')}
//               className="roleCard"
//             >
//               <Image source={TravelerLogo} style={styles.roleIcon} resizeMode="cover" />
//               <Text style={styles.roleText}>Traveler</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.roleCard,
//                 Platform.OS === 'web' && styles.webHover,
//                 Platform.OS === 'web' && activeRole === 'vendor' && styles.activeCard,
//               ]}
//               onPress={() => handleSelect('vendor')}
//               className="roleCard"
//             >
//               <Image source={VendorLogo} style={styles.roleIcon} resizeMode="cover" />
//               <Text style={styles.roleText}>Vendor</Text>
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.joinText}>
//             Join the TravelMate community and start your journey now! 🌍
//           </Text>
//         </Animated.View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: width < 480 ? 20 : 40,
//     backgroundColor: 'transparent',
//   },
//   heading: {
//     fontSize: width < 380 ? 22 : width < 768 ? 28 : 32,
//     fontWeight: 'bold',
//     color: '#00264d',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   highlight: {
//     color: '#004a99',
//   },
//   buttonRow: {
//     flexDirection: width < 600 ? 'column' : 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 20,
//     marginBottom: 20,
//   },
//   roleCard: {
//     backgroundColor: '#ffffffee',
//     borderRadius: 16,
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     width: width < 400 ? 240 : 180,
//     marginBottom: width < 600 ? 20 : 0,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//     elevation: 6,
//     transition: Platform.OS === 'web' ? 'transform 0.3s, box-shadow 0.3s' : undefined,
//   },
//   activeCard: {
//     borderWidth: 2,
//     borderColor: '#004a99',
//     backgroundColor: '#f0f8ff',
//   },
//   roleIcon: {
//     width: width < 400 ? 90 : 100,
//     height: width < 400 ? 90 : 100,
//     marginBottom: 12,
//     borderRadius: 50,
//   },
//   roleText: {
//     fontSize: width < 380 ? 14 : 16,
//     fontWeight: '600',
//     color: '#1e3a8a',
//   },
//   joinText: {
//     marginTop: 30,
//     fontSize: 15,
//     textAlign: 'center',
//     color: '#003366',
//     fontWeight: '500',
//   },
//   webHover: Platform.OS === 'web' && {
//     cursor: 'pointer',
//   },
// });

// // Web-only hover style injection
// if (Platform.OS === 'web' && typeof document !== 'undefined') {
//   const styleTag = document.createElement('style');
//   styleTag.innerHTML = `
//     .roleCard:hover {
//       transform: scale(1.05);
//       box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
//     }
//   `;
//   document.head.appendChild(styleTag);
// }

// export default RoleSelectionScreen;




import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';            
import { useRole } from '../RoleContext';
import BgImage from '../assets/background.jpg';
import TravelerLogo from '../assets/traveler.jpeg';
import VendorLogo from '../assets/vendor.jpg';

const { width } = Dimensions.get('window');

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const { setRole } = useRole();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeRole, setActiveRole] = useState(null);

  const handleSelect = (selectedRole) => {
    setActiveRole(selectedRole);
    setRole(selectedRole);
    setTimeout(() => {
      navigation.navigate('Login', { selectedRole });
    }, 200);
  };

  const handleBack = () => {
    // goBack if possible, otherwise land on your landing screen
    if (navigation.canGoBack?.()) navigation.goBack();
    else navigation.navigate('Landing Page');
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground source={BgImage} style={styles.background} resizeMode="cover">
      {/* Back pill (top-left) */}
      <View style={styles.backWrap}>
        <TouchableOpacity style={styles.backPill} onPress={handleBack} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overlay}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.heading}>
            Select <Text style={styles.highlight}>how you'd like to explore… ✈️</Text>
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                Platform.OS === 'web' && styles.webHover,
                Platform.OS === 'web' && activeRole === 'traveler' && styles.activeCard,
              ]}
              onPress={() => handleSelect('traveler')}
              className="roleCard"
            >
              <Image source={TravelerLogo} style={styles.roleIcon} resizeMode="cover" />
              <Text style={styles.roleText}>Traveler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                Platform.OS === 'web' && styles.webHover,
                Platform.OS === 'web' && activeRole === 'vendor' && styles.activeCard,
              ]}
              onPress={() => handleSelect('vendor')}
              className="roleCard"
            >
              <Image source={VendorLogo} style={styles.roleIcon} resizeMode="cover" />
              <Text style={styles.roleText}>Vendor</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.joinText}>
            Join the TravelMate community and start your journey now! 🌍
          </Text>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },

  // back button area (kept above content)
  backWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 24, // basic notch-safe offset
    left: 16,
    zIndex: 10,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9EDF2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  backText: { fontWeight: '800', color: '#0f172a' },

  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: width < 480 ? 20 : 40,
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: width < 380 ? 22 : width < 768 ? 28 : 32,
    fontWeight: 'bold',
    color: '#00264d',
    marginBottom: 30,
    textAlign: 'center',
  },
  highlight: { color: '#004a99' },

  buttonRow: {
    flexDirection: width < 600 ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },

  roleCard: {
    backgroundColor: '#ffffffee',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: width < 400 ? 240 : 180,
    marginBottom: width < 600 ? 20 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    transition: Platform.OS === 'web' ? 'transform 0.3s, box-shadow 0.3s' : undefined,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: '#004a99',
    backgroundColor: '#f0f8ff',
  },
  roleIcon: {
    width: width < 400 ? 90 : 100,
    height: width < 400 ? 90 : 100,
    marginBottom: 12,
    borderRadius: 50,
  },
  roleText: { fontSize: width < 380 ? 14 : 16, fontWeight: '600', color: '#1e3a8a' },

  joinText: {
    marginTop: 30,
    fontSize: 15,
    textAlign: 'center',
    color: '#003366',
    fontWeight: '500',
  },

  webHover: Platform.OS === 'web' && { cursor: 'pointer' },
});

// Web-only hover style
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    .roleCard:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }
  `;
  document.head.appendChild(styleTag);
}

export default RoleSelectionScreen;
