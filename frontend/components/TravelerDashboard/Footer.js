
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
import { FontAwesome, Feather, Entypo, MaterialIcons } from '@expo/vector-icons';

const Footer = ({ onScrollToTop }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <View style={styles.footerWrapper}>
      <View style={styles.footerContent}>
        {/* Top Row - 3 Columns */}
        <View style={[styles.columnsContainer, { flexDirection: isMobile ? 'column' : 'row' }]}>
          {/* Column 1: Company */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Company</Text>
            <View style={styles.linkRow}><Feather name="info" size={16} color="#333" /><Text style={styles.link}>  About TravelMate</Text></View>
            <View style={styles.linkRow}><Feather name="phone" size={16} color="#333" /><Text style={styles.link}>  Contact Us</Text></View>
            <View style={styles.linkRow}><Entypo name="text-document" size={16} color="#333" /><Text style={styles.link}>  Terms of Service</Text></View>
            <View style={styles.linkRow}><Entypo name="lock" size={16} color="#333" /><Text style={styles.link}>  Privacy Policy</Text></View>
          </View>

          {/* Column 2: Explore */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Explore</Text>
            <View style={styles.linkRow}><Entypo name="location-pin" size={16} color="#333" /><Text style={styles.link}>  Destinations</Text></View>
            <View style={styles.linkRow}><Entypo name="suitcase" size={16} color="#333" /><Text style={styles.link}>  Itineraries</Text></View>
            <View style={styles.linkRow}><Entypo name="calendar" size={16} color="#333" /><Text style={styles.link}>  Events</Text></View>
          </View>

          {/* Column 3: Connect */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Connect</Text>
            <View style={styles.linkRow}><FontAwesome name="facebook" size={16} color="#333" /><Text style={styles.link}>  Facebook</Text></View>
            <View style={styles.linkRow}><FontAwesome name="instagram" size={16} color="#333" /><Text style={styles.link}>  Instagram</Text></View>
            <View style={styles.linkRow}><FontAwesome name="twitter" size={16} color="#333" /><Text style={styles.link}>  Twitter</Text></View>
          </View>
        </View>

        {/* Newsletter Section */}
        <View style={styles.newsletterBox}>
          <Text style={styles.newsletterHeading}>📩 Stay in the Loop</Text>
          <Text style={styles.newsletterSubtext}>Get updates on new itineraries, local experiences & more.</Text>

          <View style={[styles.subscribeRow, { flexDirection: isMobile ? 'column' : 'row' }]}>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={18} color="#999" style={{ marginLeft: 10 }} />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#999"
                style={styles.input}
              />
            </View>
            <TouchableOpacity style={styles.subscribeBtn}>
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomRow}>
          <Text style={styles.copyright}>© 2024 TravelMate. All rights reserved.</Text>

          <View style={styles.bottomRight}>
            <TouchableOpacity style={styles.langButton}>
              <Text style={styles.langText}>English (US)</Text>
              <Feather name="chevron-down" size={14} color="#333" />
            </TouchableOpacity>
            <View style={styles.bottomIcons}>
              <FontAwesome name="facebook" size={18} style={styles.icon} />
              <FontAwesome name="twitter" size={18} style={styles.icon} />
              <FontAwesome name="instagram" size={18} style={styles.icon} />
            </View>
          </View>
        </View>

        {/* Spacer for Bottom NavBar */}
        {Platform.OS !== 'web' && <View style={{ height: 60 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: 'relative',
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
  },
  footerContent: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  columnsContainer: {
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  column: {
    marginBottom: 16,
  },
  columnTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#222',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: '#333',
  },
  newsletterBox: {
    marginBottom: 30,
    alignItems: 'center',
  },
  newsletterHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  newsletterSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    marginBottom: 12,
  },
  subscribeRow: {
    alignItems: 'center',
    gap: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    backgroundColor: '#fff',
    width: Platform.OS === 'web' ? 400 : '100%',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingLeft: 10,
    color: '#000',
  },
  subscribeBtn: {
    backgroundColor: '#1abc9c',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 50,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 16,
    flexDirection: 'column',
    paddingBottom: 0, // Reduced to avoid excessive bottom gap
    gap: 10,
  },
  copyright: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  bottomRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  langText: {
    fontSize: 13,
    marginRight: 4,
  },
  bottomIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 6,
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