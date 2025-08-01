
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
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';


// const itineraries = [
//   { title: 'Hunza Valley', author: 'Sarah M.', rating: '4.8', image: require('../../assets/hunza_2.jpg') },
//   { title: 'Skardu', author: 'Sarah M.', rating: '4.7', image: require('../../assets/skardu.jpg') },
//   { title: 'Fairy Meadows', author: 'Sarah M.', rating: '4.8', image: require('../../assets/fari_mados.jpg') },
//   { title: 'Swat Valley', author: 'Sarah M.', rating: '4.6', image: require('../../assets/swat.jpg') },
//   { title: 'Naran & Kaghan', author: 'Sarah M.', rating: '4.7', image: require('../../assets/naran_kagan.jpg') },
//   { title: 'Neelum Valley', author: 'Sarah M.', rating: '4.6', image: require('../../assets/nelam.jpg') },
// ];

// const TrendingItineraries = () => {
//   const navigation = useNavigation();
//   const scrollRef = useRef();
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;
//   const [scrollX, setScrollX] = useState(0);
//   const [contentWidth, setContentWidth] = useState(0);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(true);
//   const [showModal, setShowModal] = useState(false);

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

//   const handlePress = () => {
//     setShowModal(true); // ✅ Open modal
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Trending Itineraries</Text>

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
//           {itineraries.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.card}
//               onPress={handlePress} // ✅ Use modal trigger
//             >
//               <Image source={item.image} style={styles.image} />
//               <View style={styles.infoBox}>
//                 <Text style={styles.title}>{item.title}</Text>
//                 <Text style={styles.author}>by {item.author}</Text>
//                 <Text style={styles.rating}>⭐ {item.rating}</Text>
//               </View>
//             </TouchableOpacity>
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
//     paddingTop: 100,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 26,
//     paddingTop:5,
//     fontWeight: 'bold',
//     marginBottom: 30,
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
//   },
//   image: {
//     width: '100%',
//     height: 140,
//     resizeMode: 'cover',
//   },
//   infoBox: {
//     padding: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//     color: '#222',
//   },
//   author: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   rating: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#ffa500',
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

// export default TrendingItineraries;


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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const itineraries = [
  { title: 'Hunza Valley', author: 'Sarah M.', rating: '4.8', image: require('../../assets/hunza_2.jpg') },
  { title: 'Skardu', author: 'Sarah M.', rating: '4.7', image: require('../../assets/skardu.jpg') },
  { title: 'Fairy Meadows', author: 'Sarah M.', rating: '4.8', image: require('../../assets/fari_mados.jpg') },
  { title: 'Swat Valley', author: 'Sarah M.', rating: '4.6', image: require('../../assets/swat.jpg') },
  { title: 'Naran & Kaghan', author: 'Sarah M.', rating: '4.7', image: require('../../assets/naran_kagan.jpg') },
  { title: 'Neelum Valley', author: 'Sarah M.', rating: '4.6', image: require('../../assets/nelam.jpg') },
];

const TrendingItineraries = () => {
  const navigation = useNavigation();
  const scrollRef = useRef();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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

  const containerStyle = {
    paddingVertical: 20,
    paddingTop: Platform.OS === 'web' ? 100 : 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  };

  return (
    <View style={containerStyle}>
      <Text style={styles.heading}>Trending Itineraries</Text>

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
          {itineraries.map((item, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.infoBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>by {item.author}</Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
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
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  infoBox: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  author: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffa500',
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

export default TrendingItineraries;
