// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   useWindowDimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';

// const stories = [
//   {
//     title: 'Learn Pottery in Multan',
//     button: 'Discover More Cultural Stories',
//     icon: require('../../assets/pottery_1.jpg'),
//   },
//   {
//     title: 'Explore Calligraphy in Lahore',
//     button: 'Uncover Artistic Heritage',
//     icon: require('../../assets/calligraphy.jpg'),
//   },
//   {
//     title: 'Truck Art in Karachi',
//     button: 'Dive Into Colors of Culture',
//     icon: require('../../assets/pottery_1.jpg'),
//   },
//   {
//     title: 'Folk Music of Sindh',
//     button: 'Feel the Rhythms',
//     icon: require('../../assets/calligraphy.jpg'),
//   },
//   {
//     title: 'Learn Pottery in Multan',
//     button: 'Discover More Cultural Stories',
//     icon: require('../../assets/pottery_1.jpg'),
//   },
//   {
//     title: 'Explore Calligraphy in Lahore',
//     button: 'Uncover Artistic Heritage',
//     icon: require('../../assets/calligraphy.jpg'),
//   },
//   {
//     title: 'Truck Art in Karachi',
//     button: 'Dive Into Colors of Culture',
//     icon: require('../../assets/pottery_1.jpg'),
//   },
//   {
//     title: 'Folk Music of Sindh',
//     button: 'Feel the Rhythms',
//     icon: require('../../assets/calligraphy.jpg'),
//   },
// ];

// const CulturalExchange = () => {
//   const navigation = useNavigation();
//   const scrollRef = useRef();
//   const { width } = useWindowDimensions();

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

//   const handlePress = (story) => {
//     navigation.navigate('CulturalDetail', { story });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Cultural Exchange</Text>

//       <View style={styles.rowContainer}>
//         {showLeftArrow && (
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
//           {stories.map((story, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.card}
//               onPress={() => handlePress(story)}
//             >
//               <Image source={story.icon} style={styles.image} />
//               <View style={styles.content}>
//                 <Text style={styles.title}>{story.title}</Text>
//                 <TouchableOpacity style={styles.button}>
//                   <Text style={styles.buttonText}>{story.button}</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {showRightArrow && (
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
//     paddingVertical: 30,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
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
//     backgroundColor: '#fcfcfc',
//     borderRadius: 14,
//     overflow: 'hidden',
//     elevation: 2,
//   },
//   image: {
//     width: '100%',
//     height: 140,
//     resizeMode: 'cover',
//   },
//   content: {
//     padding: 12,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#1abc9c',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '500',
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

// export default CulturalExchange;

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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const stories = [
  {
    title: 'Learn Pottery in Multan',
    button: 'Discover More Cultural Stories',
    icon: require('../../assets/pottery_1.jpg'),
  },
  {
    title: 'Explore Calligraphy in Lahore',
    button: 'Uncover Artistic Heritage',
    icon: require('../../assets/calligraphy.jpg'),
  },
  {
    title: 'Truck Art in Karachi',
    button: 'Dive Into Colors of Culture',
    icon: require('../../assets/pottery_1.jpg'),
  },
  {
    title: 'Folk Music of Sindh',
    button: 'Feel the Rhythms',
    icon: require('../../assets/calligraphy.jpg'),
  },
  {
    title: 'Learn Pottery in Multan',
    button: 'Discover More Cultural Stories',
    icon: require('../../assets/pottery_1.jpg'),
  },
  {
    title: 'Explore Calligraphy in Lahore',
    button: 'Uncover Artistic Heritage',
    icon: require('../../assets/calligraphy.jpg'),
  },
  {
    title: 'Truck Art in Karachi',
    button: 'Dive Into Colors of Culture',
    icon: require('../../assets/pottery_1.jpg'),
  },
  {
    title: 'Folk Music of Sindh',
    button: 'Feel the Rhythms',
    icon: require('../../assets/calligraphy.jpg'),
  },
];

const CulturalExchange = () => {
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

  const handlePress = (story) => {
    navigation.navigate('CulturalDetail', { story });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cultural Connect</Text>

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
          {stories.map((story, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handlePress(story)}
            >
              <Image source={story.icon} style={styles.image} />
              <View style={styles.content}>
                <Text style={styles.title}>{story.title}</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>{story.button}</Text>
                </TouchableOpacity>
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
  container: {
    paddingVertical: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: '#fcfcfc',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
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

export default CulturalExchange;
