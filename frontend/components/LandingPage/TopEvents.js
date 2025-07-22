
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

const events = [
  {
    title: 'Shandur Polo Festival',
    location: 'Chitral, Pakistan',
    date: 'July 5, 2025',
    type: 'Sports',
    tagColor: '#fbbc04',
    image: require('../../assets/sandu.jpg'),
  },
  {
    title: 'Lahore Literary Festival',
    location: 'Lahore, Pakistan',
    date: 'March 15, 2025',
    type: 'Literary',
    tagColor: '#b39ddb',
    image: require('../../assets/lahore_event.jpg'),
  },
  {
    title: 'Lok Mela',
    location: 'Islamabad, Pakistan',
    date: 'October 20, 2025',
    type: 'Cultural',
    tagColor: '#4fc3f7',
    image: require('../../assets/lok_mela.jpg'),
  },
  {
    title: 'Pakistan Fashion Week',
    location: 'Karachi, Pakistan',
    date: 'November 10, 2025',
    type: 'Fashion',
    tagColor: '#ef9a9a',
    image: require('../../assets/fashion.jpg'),
  },
  {
    title: 'Repeat - Shandur Polo Festival',
    location: 'Chitral, Pakistan',
    date: 'July 5, 2025',
    type: 'Sports',
    tagColor: '#fbbc04',
    image: require('../../assets/sandu.jpg'),
  },
  {
    title: 'Shandur Polo Festival',
    location: 'Chitral, Pakistan',
    date: 'July 5, 2025',
    type: 'Sports',
    tagColor: '#fbbc04',
    image: require('../../assets/sandu.jpg'),
  },
  {
    title: 'Lahore Literary Festival',
    location: 'Lahore, Pakistan',
    date: 'March 15, 2025',
    type: 'Literary',
    tagColor: '#b39ddb',
    image: require('../../assets/lahore_event.jpg'),
  },
  {
    title: 'Lok Mela',
    location: 'Islamabad, Pakistan',
    date: 'October 20, 2025',
    type: 'Cultural',
    tagColor: '#4fc3f7',
    image: require('../../assets/lok_mela.jpg'),
  },
  {
    title: 'Pakistan Fashion Week',
    location: 'Karachi, Pakistan',
    date: 'November 10, 2025',
    type: 'Fashion',
    tagColor: '#ef9a9a',
    image: require('../../assets/fashion.jpg'),
  },
  {
    title: 'Repeat - Shandur Polo Festival',
    location: 'Chitral, Pakistan',
    date: 'July 5, 2025',
    type: 'Sports',
    tagColor: '#fbbc04',
    image: require('../../assets/sandu.jpg'),
  },
];

const TopEvents = () => {
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

  const handlePress = (event) => {
    navigation.navigate('EventDetail', { event });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Buzzing Events</Text>

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
          {events.map((event, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handlePress(event)}
            >
              <Image source={event.image} style={styles.image} />
              <View style={styles.infoBox}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.location}>{event.location}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.date}>{event.date}</Text>
                  <Text style={[styles.tagText, { backgroundColor: event.tagColor }]}>
                    {event.type}
                  </Text>
                </View>
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
  location: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
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

export default TopEvents;
