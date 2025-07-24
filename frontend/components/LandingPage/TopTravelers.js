

// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   useWindowDimensions,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const travelers = [
//   {
//     name: 'Sarah M.',
//     title: 'Local Expert',
//     subtitle: 'Shared 25 itineraries',
//     tagColor: '#43a047',
//     image: require('../../assets/boy_1.webp'),
//   },
//   {
//     name: 'James T.',
//     title: 'Top Reviewer',
//     subtitle: '95 contributions',
//     tagColor: '#fb8c00',
//     image: require('../../assets/boy_2.jpg'),
//   },
//   {
//     name: 'Emma R.',
//     title: 'Cultural Explorer',
//     subtitle: '12 contributions',
//     tagColor: '#1e88e5',
//     image: require('../../assets/boy_3.jpg'),
//   },
//   {
//     name: 'Sarah M.',
//     title: 'Local Expert',
//     subtitle: 'Shared 25 itineraries',
//     tagColor: '#43a047',
//     image: require('../../assets/boy_1.webp'),
//   },
//   {
//     name: 'James T.',
//     title: 'Top Reviewer',
//     subtitle: '95 contributions',
//     tagColor: '#fb8c00',
//     image: require('../../assets/boy_2.jpg'),
//   },
//   {
//     name: 'Emma R.',
//     title: 'Cultural Explorer',
//     subtitle: '12 contributions',
//     tagColor: '#1e88e5',
//     image: require('../../assets/boy_3.jpg'),
//   },
//   {
//     name: 'Sarah M.',
//     title: 'Local Expert',
//     subtitle: 'Shared 25 itineraries',
//     tagColor: '#43a047',
//     image: require('../../assets/boy_1.webp'),
//   },
//   {
//     name: 'James T.',
//     title: 'Top Reviewer',
//     subtitle: '95 contributions',
//     tagColor: '#fb8c00',
//     image: require('../../assets/boy_2.jpg'),
//   },
// ];

// const TopTravelers = () => {
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
//       <Text style={styles.heading}>Our Top Travelers</Text>

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
//           {travelers.map((traveler, index) => (
//             <View key={index} style={styles.card}>
//               <Image source={traveler.image} style={styles.image} />
//               <View style={styles.infoBox}>
//                 <Text style={styles.name}>{traveler.name}</Text>
//                 <Text style={[styles.title, { backgroundColor: traveler.tagColor }]}>
//                   {traveler.title}
//                 </Text>
//                 <Text style={styles.subtitle}>{traveler.subtitle}</Text>
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
//     marginBottom: 6,
//     color: '#222',
//   },
//   title: {
//     fontSize: 12,
//     color: '#fff',
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     overflow: 'hidden',
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   subtitle: {
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

// export default TopTravelers;


import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AuthPromptModal from './AuthPromptModal'; // ✅ Import modal

const travelers = [
  {
    name: 'Sarah M.',
    title: 'Local Expert',
    subtitle: 'Shared 25 itineraries',
    tagColor: '#43a047',
    image: require('../../assets/boy_1.webp'),
  },
  {
    name: 'James T.',
    title: 'Top Reviewer',
    subtitle: '95 contributions',
    tagColor: '#fb8c00',
    image: require('../../assets/boy_2.jpg'),
  },
  {
    name: 'Emma R.',
    title: 'Cultural Explorer',
    subtitle: '12 contributions',
    tagColor: '#1e88e5',
    image: require('../../assets/boy_3.jpg'),
  },
  {
    name: 'Sarah M.',
    title: 'Local Expert',
    subtitle: 'Shared 25 itineraries',
    tagColor: '#43a047',
    image: require('../../assets/boy_1.webp'),
  },
  {
    name: 'James T.',
    title: 'Top Reviewer',
    subtitle: '95 contributions',
    tagColor: '#fb8c00',
    image: require('../../assets/boy_2.jpg'),
  },
  {
    name: 'Emma R.',
    title: 'Cultural Explorer',
    subtitle: '12 contributions',
    tagColor: '#1e88e5',
    image: require('../../assets/boy_3.jpg'),
  },
  {
    name: 'Sarah M.',
    title: 'Local Expert',
    subtitle: 'Shared 25 itineraries',
    tagColor: '#43a047',
    image: require('../../assets/boy_1.webp'),
  },
  {
    name: 'James T.',
    title: 'Top Reviewer',
    subtitle: '95 contributions',
    tagColor: '#fb8c00',
    image: require('../../assets/boy_2.jpg'),
  },
];

const TopTravelers = () => {
  const navigation = useNavigation();
  const scrollRef = useRef();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Our Top Travelers</Text>

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
          {travelers.map((traveler, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={handlePress}
            >
              <Image source={traveler.image} style={styles.image} />
              <View style={styles.infoBox}>
                <Text style={styles.name}>{traveler.name}</Text>
                <Text style={[styles.title, { backgroundColor: traveler.tagColor }]}>
                  {traveler.title}
                </Text>
                <Text style={styles.subtitle}>{traveler.subtitle}</Text>
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

      {/* ✅ Auth Prompt Modal */}
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
    marginBottom: 6,
    color: '#222',
  },
  title: {
    fontSize: 12,
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    fontWeight: '500',
    marginBottom: 4,
  },
  subtitle: {
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

export default TopTravelers;
