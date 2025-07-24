// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const vendors = [
//   {
//     name: 'TourNest Pvt Ltd',
//     category: 'Accommodation Provider',
//     services: '120 bookings/month',
//     image: require('../../assets/boy_1.webp'),
//   },
//   {
//     name: 'Cultura Exchange Hub',
//     category: 'Cultural Exchanger',
//     services: '65 sessions/month',
//     image: require('../../assets/boy_2.jpg'),
//   },
//   {
//     name: 'Handmade Treasures',
//     category: 'Product Seller',
//     services: '40 items sold/week',
//     image: require('../../assets/boy_3.jpg'),
//   },
//   {
//     name: 'Pak Tours',
//     category: 'Tour Guider',
//     services: '35 guided tours/month',
//     image: require('../../assets/boy_1.webp'),
//   },
//   {
//     name: 'RideOn Wheels',
//     category: 'Transport Provider',
//     services: '75 rides/week',
//     image: require('../../assets/boy_2.jpg'),
//   },
//   {
//     name: 'Handmade Treasures',
//     category: 'Product Seller',
//     services: '40 items sold/week',
//     image: require('../../assets/boy_3.jpg'),
//   },
//   {
//     name: 'Pak Tours',
//     category: 'Tour Guider',
//     services: '35 guided tours/month',
//     image: require('../../assets/boy_1.webp'),
//   },
// ];

// const TopServiceProviders = () => {
//   const scrollRef = useRef();
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;

//   const [scrollX, setScrollX] = useState(0);
//   const [contentWidth, setContentWidth] = useState(0);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(true);

//   const SCROLL_AMOUNT = 300;

//   const updateArrowVisibility = (x) => {
//     setScrollX(x);
//     setShowLeftArrow(x > 0);
//     setShowRightArrow(x < contentWidth - width);
//   };

//   const scrollBy = (direction) => {
//     const newX = direction === 'left' ? scrollX - SCROLL_AMOUNT : scrollX + SCROLL_AMOUNT;
//     scrollRef.current.scrollTo({ x: newX, animated: true });
//     updateArrowVisibility(newX);
//   };

//   const handleScroll = (event) => {
//     const x = event.nativeEvent.contentOffset.x;
//     updateArrowVisibility(x);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Traveler-Approved Services</Text>

//       <View style={styles.rowContainer}>
//         {!isMobile && showLeftArrow && (
//           <TouchableOpacity onPress={() => scrollBy('left')} style={styles.arrowLeft}>
//             <Ionicons name="chevron-back" size={24} color="#444" />
//           </TouchableOpacity>
//         )}

//         <ScrollView
//           horizontal
//           ref={scrollRef}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//           onContentSizeChange={(w) => setContentWidth(w)}
//         >
//           {vendors.map((vendor, index) => (
//             <View key={index} style={styles.card}>
//               <Image source={vendor.image} style={styles.image} />
//               <View style={styles.infoBox}>
//                 <Text style={styles.name}>{vendor.name}</Text>
//                 <Text style={styles.category}>{vendor.category}</Text>
//                 <Text style={styles.services}>{vendor.services}</Text>
//               </View>
//             </View>
//           ))}
//         </ScrollView>

//         {!isMobile && showRightArrow && (
//           <TouchableOpacity onPress={() => scrollBy('right')} style={styles.arrowRight}>
//             <Ionicons name="chevron-forward" size={24} color="#444" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 20,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   rowContainer: {
//     position: 'relative',
//     width: '100%',
//     justifyContent: 'center',
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//   },
//   card: {
//     width: 260,
//     marginHorizontal: 8,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 2,
//     alignItems: 'center',
//   },
//   image: {
//     width: '100%',
//     height: 140,
//     resizeMode: 'cover',
//   },
//   infoBox: {
//     padding: 10,
//     alignItems: 'center',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//     color: '#222',
//     textAlign: 'center',
//   },
//   category: {
//     fontSize: 13,
//     color: '#4a90e2',
//     marginBottom: 4,
//   },
//   services: {
//     fontSize: 12,
//     color: '#777',
//   },
//   arrowLeft: {
//     position: 'absolute',
//     left: 4,
//     top: '35%',
//     zIndex: 10,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 16,
//     padding: 4,
//     elevation: 3,
//   },
//   arrowRight: {
//     position: 'absolute',
//     right: 4,
//     top: '35%',
//     zIndex: 10,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 16,
//     padding: 4,
//     elevation: 3,
//   },
// });

// export default TopServiceProviders;

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AuthPromptModal from './AuthPromptModal'; // ✅ Import modal

const vendors = [
  {
    name: 'TourNest Pvt Ltd',
    category: 'Accommodation Provider',
    services: '120 bookings/month',
    image: require('../../assets/boy_1.webp'),
  },
  {
    name: 'Cultura Exchange Hub',
    category: 'Cultural Exchanger',
    services: '65 sessions/month',
    image: require('../../assets/boy_2.jpg'),
  },
  {
    name: 'Handmade Treasures',
    category: 'Product Seller',
    services: '40 items sold/week',
    image: require('../../assets/boy_3.jpg'),
  },
  {
    name: 'Pak Tours',
    category: 'Tour Guider',
    services: '35 guided tours/month',
    image: require('../../assets/boy_1.webp'),
  },
  {
    name: 'RideOn Wheels',
    category: 'Transport Provider',
    services: '75 rides/week',
    image: require('../../assets/boy_2.jpg'),
  },
  {
    name: 'Handmade Treasures',
    category: 'Product Seller',
    services: '40 items sold/week',
    image: require('../../assets/boy_3.jpg'),
  },
  {
    name: 'Pak Tours',
    category: 'Tour Guider',
    services: '35 guided tours/month',
    image: require('../../assets/boy_1.webp'),
  },
];

const TopServiceProviders = () => {
  const scrollRef = useRef();
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const isMobile = width < 768;

  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showModal, setShowModal] = useState(false); // ✅ Modal control

  const SCROLL_AMOUNT = 300;

  const updateArrowVisibility = (x) => {
    setScrollX(x);
    setShowLeftArrow(x > 0);
    setShowRightArrow(x < contentWidth - width);
  };

  const scrollBy = (direction) => {
    const newX = direction === 'left' ? scrollX - SCROLL_AMOUNT : scrollX + SCROLL_AMOUNT;
    scrollRef.current.scrollTo({ x: newX, animated: true });
    updateArrowVisibility(newX);
  };

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    updateArrowVisibility(x);
  };

  const handlePress = () => {
    setShowModal(true); // ✅ Show modal on vendor card press
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Traveler-Approved Services</Text>

      <View style={styles.rowContainer}>
        {!isMobile && showLeftArrow && (
          <TouchableOpacity onPress={() => scrollBy('left')} style={styles.arrowLeft}>
            <Ionicons name="chevron-back" size={24} color="#444" />
          </TouchableOpacity>
        )}

        <ScrollView
          horizontal
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={(w) => setContentWidth(w)}
        >
          {vendors.map((vendor, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={handlePress}>
              <Image source={vendor.image} style={styles.image} />
              <View style={styles.infoBox}>
                <Text style={styles.name}>{vendor.name}</Text>
                <Text style={styles.category}>{vendor.category}</Text>
                <Text style={styles.services}>{vendor.services}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {!isMobile && showRightArrow && (
          <TouchableOpacity onPress={() => scrollBy('right')} style={styles.arrowRight}>
            <Ionicons name="chevron-forward" size={24} color="#444" />
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ Modal for auth prompt */}
      <AuthPromptModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onContinue={() => {
          setShowModal(false);
          navigation.navigate('RoleSelection');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rowContainer: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    width: 260,
    marginHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  infoBox: {
    padding: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
    textAlign: 'center',
  },
  category: {
    fontSize: 13,
    color: '#4a90e2',
    marginBottom: 4,
  },
  services: {
    fontSize: 12,
    color: '#777',
  },
  arrowLeft: {
    position: 'absolute',
    left: 4,
    top: '35%',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 4,
    elevation: 3,
  },
  arrowRight: {
    position: 'absolute',
    right: 4,
    top: '35%',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 4,
    elevation: 3,
  },
});

export default TopServiceProviders;
