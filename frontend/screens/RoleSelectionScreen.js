
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../RoleContext';
import BgImage from '../assets/background.jpg';
import TravelerLogo from '../assets/traveler.avif';
import VendorLogo from '../assets/vendor.jpg';

const { width } = Dimensions.get('window');

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const { setRole } = useRole();

  const handleSelect = (selectedRole) => {
    setRole(selectedRole);
    navigation.navigate('Login', { selectedRole });
  };

  return (
    <ImageBackground source={BgImage} style={styles.background} resizeMode="">
      <View style={styles.overlay}>
        <Text style={styles.heading}>
          Select <Text style={styles.highlight}>how you'd like to explore… ✈️</Text>
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.roleCard} onPress={() => handleSelect('traveler')}>
            <Image source={TravelerLogo} style={styles.roleIcon} resizeMode="contain" />
            <Text style={styles.roleText}>Traveler</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.roleCard} onPress={() => handleSelect('vendor')}>
            <Image source={VendorLogo} style={styles.roleIcon} resizeMode="contain" />
            <Text style={styles.roleText}>Vendor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  homeButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 40,
    left: 16,
    zIndex: 10,
    backgroundColor: '#ffffffcc',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  homeButtonText: {
    color: '#003366',
    fontWeight: '600',
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: width < 480 ? 20 : 40,
  },
  heading: {
    fontSize: width < 380 ? 22 : width < 768 ? 28 : 32,
    fontWeight: 'bold',
    color: '#00264d',
    marginBottom: 30,
    textAlign: 'center',
  },
  highlight: {
    color: '#004a99',
  },
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
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: width < 400 ? 240 : 160,
    marginBottom: width < 600 ? 20 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  roleIcon: {
    width: width < 400 ? 60 : 70,
    height: width < 400 ? 60 : 70,
    marginBottom: 10,
  },
  roleText: {
    fontSize: width < 380 ? 14 : 16,
    fontWeight: '600',
    color: '#1e3a8a',
  },
});

export default RoleSelectionScreen;
