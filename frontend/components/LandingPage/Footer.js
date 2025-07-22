
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';

const Footer = ({ onScrollToTop }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <View style={styles.footer}>
      {/* Top Section */}
      <View style={[styles.columns, { flexDirection: isMobile ? 'column' : 'row' }]}>
        {/* About Column */}
        <View style={[styles.column, { width: isMobile ? '100%' : '45%' }]}>
          <Text style={styles.heading}>About</Text>
          <Text style={styles.link}>About TravelMate</Text>
          <Text style={styles.link}>Contact Us</Text>
        </View>

        {/* Legal Column */}
        <View style={[styles.column, { width: isMobile ? '100%' : '45%' }]}>
          <Text style={styles.heading}>Legal</Text>
          <Text style={styles.link}>Terms of Service</Text>
          <Text style={styles.link}>Privacy Policy</Text>
          <Text style={styles.link}>Cookies</Text>
        </View>
      </View>

      {/* Newsletter Signup */}
      <View style={styles.newsletter}>
        <Text style={styles.heading}>Stay in the Loop</Text>
        <View
          style={[
            styles.subscribeRow,
            { flexDirection: isMobile ? 'column' : 'row' },
          ]}
        >
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#999"
            style={[styles.input, { marginBottom: isMobile ? 10 : 0 }]}
          />
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <Text style={styles.copyright}>
          © 2024 TravelMate. All rights reserved.
        </Text>

        <View
          style={[
            styles.langSocial,
            {
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 10 : 0,
            },
          ]}
        >
          <TouchableOpacity style={styles.langButton}>
            <Text style={styles.langText}>English (US)</Text>
            <Feather name="chevron-down" size={14} color="#333" />
          </TouchableOpacity>

          <View style={styles.socialIcons}>
            <FontAwesome name="facebook" size={18} style={styles.icon} />
            <FontAwesome name="twitter" size={18} style={styles.icon} />
            <FontAwesome name="instagram" size={18} style={styles.icon} />
          </View>
        </View>
      </View>

      {/* Back to Top Button */}
      <TouchableOpacity style={styles.backToTop} onPress={onScrollToTop}>
        <Feather name="arrow-up" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'relative',
  },
  columns: {
    justifyContent: 'space-between',
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 20,
  },
  column: {
    marginBottom: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#222',
  },
  link: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  newsletter: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 24,
  },
  subscribeRow: {
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 13,
    marginRight: 10,
    color: '#000',
  },
  subscribeBtn: {
    backgroundColor: '#1abc9c',
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
  },
  subscribeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 16,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  bottomRow: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  copyright: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  langSocial: {
    justifyContent: 'space-between',
    width: '100%',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  langText: {
    fontSize: 12,
    marginRight: 4,
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 4,
  },
  icon: {
    marginRight: 12,
    color: '#333',
  },
  backToTop: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1abc9c',
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
});

export default Footer;
