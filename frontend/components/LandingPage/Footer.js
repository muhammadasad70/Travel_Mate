
// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import { FontAwesome, Feather } from '@expo/vector-icons';

// const Footer = ({ onScrollToTop }) => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;

//   return (
//     <View style={styles.footer}>
//       {/* Top Section */}
//       <View style={[styles.columns, { flexDirection: isMobile ? 'column' : 'row' }]}>
//         {/* About Column */}
//         <View style={[styles.column, { width: isMobile ? '100%' : '45%' }]}>
//           <Text style={styles.heading}>About</Text>
//           <Text style={styles.link}>About TravelMate</Text>
//           <Text style={styles.link}>Contact Us</Text>
//         </View>

//         {/* Legal Column */}
//         <View style={[styles.column, { width: isMobile ? '100%' : '45%' }]}>
//           <Text style={styles.heading}>Legal</Text>
//           <Text style={styles.link}>Terms of Service</Text>
//           <Text style={styles.link}>Privacy Policy</Text>
//           <Text style={styles.link}>Cookies</Text>
//         </View>
//       </View>

//       {/* Newsletter Signup */}
//       <View style={styles.newsletter}>
//         <Text style={styles.heading}>Stay in the Loop</Text>
//         <View
//           style={[
//             styles.subscribeRow,
//             { flexDirection: isMobile ? 'column' : 'row' },
//           ]}
//         >
//           <TextInput
//             placeholder="Enter your email"
//             placeholderTextColor="#999"
//             style={[styles.input, { marginBottom: isMobile ? 10 : 0 }]}
//           />
//           <TouchableOpacity style={styles.subscribeBtn}>
//             <Text style={styles.subscribeText}>Subscribe</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Divider */}
//       <View style={styles.divider} />

//       {/* Bottom Row */}
//       <View style={styles.bottomRow}>
//         <Text style={styles.copyright}>
//           © 2024 TravelMate. All rights reserved.
//         </Text>

//         <View
//           style={[
//             styles.langSocial,
//             {
//               flexDirection: isMobile ? 'column' : 'row',
//               alignItems: isMobile ? 'flex-start' : 'center',
//               gap: isMobile ? 10 : 0,
//             },
//           ]}
//         >
//           <TouchableOpacity style={styles.langButton}>
//             <Text style={styles.langText}>English (US)</Text>
//             <Feather name="chevron-down" size={14} color="#333" />
//           </TouchableOpacity>

//           <View style={styles.socialIcons}>
//             <FontAwesome name="facebook" size={18} style={styles.icon} />
//             <FontAwesome name="twitter" size={18} style={styles.icon} />
//             <FontAwesome name="instagram" size={18} style={styles.icon} />
//           </View>
//         </View>
//       </View>

//       {/* Back to Top Button */}
//       <TouchableOpacity style={styles.backToTop} onPress={onScrollToTop}>
//         <Feather name="arrow-up" size={22} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   footer: {
//     backgroundColor: '#f9f9f9',
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//     position: 'relative',
//   },
//   columns: {
//     justifyContent: 'space-between',
//     maxWidth: 1000,
//     alignSelf: 'center',
//     width: '100%',
//     marginBottom: 20,
//   },
//   column: {
//     marginBottom: 16,
//   },
//   heading: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 12,
//     color: '#222',
//   },
//   link: {
//     fontSize: 13,
//     color: '#555',
//     marginBottom: 6,
//   },
//   newsletter: {
//     maxWidth: 1000,
//     alignSelf: 'center',
//     width: '100%',
//     marginBottom: 24,
//   },
//   subscribeRow: {
//     marginTop: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 6,
//     fontSize: 13,
//     marginRight: 10,
//     color: '#000',
//   },
//   subscribeBtn: {
//     backgroundColor: '#1abc9c',
//     paddingHorizontal: 16,
//     borderRadius: 6,
//     justifyContent: 'center',
//   },
//   subscribeText: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#ddd',
//     marginBottom: 16,
//     maxWidth: 1000,
//     alignSelf: 'center',
//     width: '100%',
//   },
//   bottomRow: {
//     maxWidth: 1000,
//     alignSelf: 'center',
//     width: '100%',
//   },
//   copyright: {
//     fontSize: 12,
//     color: '#777',
//     marginBottom: 10,
//   },
//   langSocial: {
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   langButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   langText: {
//     fontSize: 12,
//     marginRight: 4,
//   },
//   socialIcons: {
//     flexDirection: 'row',
//     marginTop: 4,
//   },
//   icon: {
//     marginRight: 12,
//     color: '#333',
//   },
//   backToTop: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#1abc9c',
//     padding: 10,
//     borderRadius: 25,
//     elevation: 5,
//   },
// });

// export default Footer;


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
      </View>

      {/* Back to Top Button */}
      {/* <TouchableOpacity style={styles.backToTop} onPress={onScrollToTop}>
        <Feather name="arrow-up" size={22} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: '#f6fbff',
    paddingVertical: 30,
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
    paddingBottom: 20,
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
