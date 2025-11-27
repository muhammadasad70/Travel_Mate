
// screens/CrowdsourceItineraries/ItineraryCard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Share as RNShare,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BORDER = '#E6EDF7';
const PRIMARY = '#003366';

export default function ItineraryCard({ item, onPress, onView, onEdit, onDelete, onShareToGroup }) {
  const [imageError, setImageError] = useState(false);

  // ✅ FIXED: Better image source handler
  const getImageSource = () => {
    // Try different possible image fields
    const possibleImages = [
      item?.cover_url,           // From detail screen
      item?.images?.[0],         // Array of images
      item?.image,               // Single image field
      item?.coverImage,          // Alternative field
      item?.thumbnail,           // Thumbnail field
    ];

    for (const img of possibleImages) {
      if (!img) continue;
      
      // If it's already a string URL
      if (typeof img === 'string' && img.length > 0) {
        return { uri: img };
      }
      
      // If it's an object with url
      if (img.url) return { uri: img.url };
      if (img.uri) return { uri: img.uri };
    }

    return null;
  };

  const imageSource = getImageSource();

  // ✅ Generate detailed day-by-day itinerary share message
  const handleShare = async () => {
    try {
      // Build comprehensive share message
      let message = `🗺️ Travel Itinerary: ${item.title || 'My Trip'}\n`;
      message += `📍 Destination: ${item.destination || item.city || 'Amazing Places'}\n`;
      
      if (item.description) {
        message += `\n${item.description}\n`;
      }

      // Add trip details
      message += `\n📅 Duration: ${item.duration || 'Multiple days'}`;
      if (item.budget) message += `\n💰 Budget: ${item.budget}`;
      if (item.accommodation_details) message += `\n🏨 Accommodation: ${item.accommodation_details}`;
      if (item.transport_details) message += `\n🚗 Transport: ${item.transport_details}`;

      // ✅ Add day-by-day schedule
      if (item.days && Array.isArray(item.days) && item.days.length > 0) {
        message += `\n\n📋 Day-by-Day Itinerary:\n`;
        message += `${'='.repeat(30)}\n`;

        item.days
          .slice()
          .sort((a, b) => (a.day_number || 0) - (b.day_number || 0))
          .forEach((day, idx) => {
            const dayNum = day.day_number || idx + 1;
            const place = day.place || day.Place || '';
            const startTime = day.start_time || day.StartTime || '';
            const endTime = day.end_time || day.EndTime || '';
            const activities = day.activities || day.Activities || '';

            message += `\n📆 Day ${dayNum}:\n`;
            
            if (place) {
              message += `  📍 ${place}\n`;
            }
            
            if (startTime || endTime) {
              const times = [startTime, endTime].filter(Boolean).join(' - ');
              message += `  🕐 ${times}\n`;
            }
            
            if (activities) {
              message += `  ${activities}\n`;
            }
          });
      }

      // Add tags/highlights
      if (item.tags && item.tags.length > 0) {
        message += `\n🏷️ Tags: ${item.tags.join(', ')}`;
      }

      message += `\n\n✨ Plan your journey with TravelMate! 🌍✈️`;

      // Share using native share sheet
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: item.title || 'My Travel Itinerary',
            text: message,
          });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(message);
          Alert.alert('Copied!', 'Itinerary copied to clipboard. Paste it anywhere!');
        } else {
          alert(message);
        }
      } else {
        await RNShare.share({
          title: item.title || 'My Travel Itinerary',
          message: message,
        });
      }

      console.log('✅ Itinerary shared with day-by-day details');
    } catch (error) {
      if (error.message !== 'User cancelled' && error.name !== 'AbortError') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Could not share itinerary');
      }
    }
  };

  // ✅ Debug: Log what we're getting
  console.log('Card item:', {
    id: item?.id,
    title: item?.title,
    cover_url: item?.cover_url,
    images: item?.images,
    imageSource: imageSource,
  });

  return (
    <View style={styles.card}>
      {/* Image */}
      {imageSource && !imageError ? (
        <Image
          source={imageSource}
          style={styles.image}
          onError={(e) => {
            console.log('Image load error:', e.nativeEvent);
            setImageError(true);
          }}
          onLoad={() => console.log('Image loaded successfully')}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={36} color="#CBD5E1" />
          {/* ✅ Debug text */}
          <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
            {imageError ? 'Failed to load' : 'No image'}
          </Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title || 'Untitled Itinerary'}
        </Text>

        {(item.destination || item.city) && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color={PRIMARY} />
            <Text style={styles.destination}>{item.destination || item.city}</Text>
          </View>
        )}

        {item.duration && (
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.meta}>{item.duration}</Text>
          </View>
        )}

        {item.budget && (
          <View style={styles.row}>
            <Ionicons name="cash-outline" size={14} color="#059669" />
            <Text style={styles.meta}>{item.budget}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {onView && (
            <TouchableOpacity style={styles.actionBtn} onPress={onView}>
              <Ionicons name="eye-outline" size={16} color={PRIMARY} />
              <Text style={styles.actionText}>View</Text>
            </TouchableOpacity>
          )}

          {onEdit && (
            <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
              <Ionicons name="create-outline" size={16} color={PRIMARY} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}

          {/* ✅ Share button with day-by-day details */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={16} color={PRIMARY} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          {/* ✅ Share to Group button */}
          {onShareToGroup && (
            <TouchableOpacity style={styles.actionBtn} onPress={onShareToGroup}>
              <Ionicons name="people-outline" size={16} color={PRIMARY} />
              <Text style={styles.actionText}>Share to Group</Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color="#B91C1C" />
              <Text style={[styles.actionText, styles.actionTextDanger]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 12px rgba(15,23,42,.06)' }
      : { elevation: 2 }),
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  destination: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
  },
  meta: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
  },
  actionBtnDanger: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionText: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 12,
  },
  actionTextDanger: {
    color: '#B91C1C',
  },
});