// // // utils/shareImageHelper.js

// // /**
// //  * Smart image helper for social sharing
// //  * Provides fallback images when content doesn't have one
// //  * Works for both mobile and web
// //  */

// // export const getShareImage = (item, type) => {
// //   // Priority 1: Use item's own image if available
// //   if (item?.image_url) return item.image_url;
// //   if (item?.cover_url) return item.cover_url;
// //   if (item?.cover_image) return item.cover_image;
// //   if (item?.coverImage) return item.coverImage;
// //   if (item?.image) return item.image;
// //   if (item?.images?.[0]) return item.images[0];

// //   // Priority 2: Generate relevant placeholder from Unsplash
// //   const keyword = getKeywordForType(item, type);
  
// //   if (keyword && shouldUseDynamicImage(type)) {
// //     return `https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)},travel`;
// //   }

// //   // Priority 3: Fallback to app branding
// //   return 'https://via.placeholder.com/800x600/3B82F6/ffffff?text=TravelMate';
// // };

// // /**
// //  * Extract relevant keyword from item based on type
// //  */
// // const getKeywordForType = (item, type) => {
// //   switch(type) {
// //     case 'itinerary':
// //       return item?.city || item?.destination || item?.title || 'travel itinerary';
    
// //     case 'ai-recommendation':
// //       return item?.destination || item?.location || item?.city || 'travel destination';
    
// //     case 'service':
// //       return item?.category || item?.title || item?.service_type || 'cultural experience';
    
// //     case 'booking':
// //       return item?.service_name || item?.title || 'travel booking';
    
// //     default:
// //       return 'travel adventure';
// //   }
// // };

// // /**
// //  * Decide if we should use dynamic Unsplash images
// //  */
// // const shouldUseDynamicImage = (type) => {
// //   // Use dynamic images for AI recommendations and services
// //   // They usually don't have images but benefit from visual appeal
// //   return ['ai-recommendation', 'service', 'booking'].includes(type);
// // };

// // /**
// //  * Generate share text based on content type
// //  */
// // export const getShareMessage = (item, type) => {
// //   switch(type) {
// //     case 'itinerary':
// //       const itineraryTitle = item?.title || 'Amazing Trip';
// //       const itineraryCity = item?.city ? ` to ${item.city}` : '';
// //       return `Check out my travel itinerary${itineraryCity}: ${itineraryTitle}! Plan your journey with TravelMate.`;
    
// //     case 'ai-recommendation':
// //       const destination = item?.destination || item?.city || 'this destination';
// //       return `Discover ${destination} - AI-recommended travel experience! Find more on TravelMate.`;
    
// //     case 'service':
// //       const serviceTitle = item?.title || 'this cultural service';
// //       return `Experience ${serviceTitle} - Book amazing cultural activities on TravelMate!`;
    
// //     case 'booking':
// //       const bookingService = item?.service_name || item?.title || 'an amazing experience';
// //       return `I just booked ${bookingService} on TravelMate! 🎉 Join me on this adventure!`;
    
// //     default:
// //       return 'Discover amazing travel experiences on TravelMate - Your ultimate travel companion!';
// //   }
// // };

// // /**
// //  * Generate share URL
// //  */
// // export const getShareUrl = (item, type) => {
// //   const baseUrl = 'https://travelmate.app'; // Change to your actual domain when deployed
  
// //   const itemId = item?.id || item?._id || item?.itinerary_id || item?.service_id || 'share';
  
// //   switch(type) {
// //     case 'itinerary':
// //       return `${baseUrl}/itinerary/${itemId}`;
    
// //     case 'ai-recommendation':
// //       return `${baseUrl}/recommendation/${itemId}`;
    
// //     case 'service':
// //       return `${baseUrl}/service/${itemId}`;
    
// //     case 'booking':
// //       return `${baseUrl}/booking/${itemId}`;
    
// //     default:
// //       return baseUrl;
// //   }
// // };

// // /**
// //  * Check if item is from offline storage
// //  */
// // export const isOfflineContent = (item) => {
// //   // Check various indicators that content is offline
// //   return !!(
// //     item?._isOffline || 
// //     item?.isOffline || 
// //     item?.offline === true ||
// //     item?.source === 'offline'
// //   );
// // };


// // utils/shareImageHelper.js
// import { Share, Platform, Alert } from 'react-native';

// /**
//  * Generate rich, descriptive share message (NO broken links for FYP)
//  */
// export const getShareMessage = (item, type) => {
//   switch (type) {
//     case 'itinerary':
//       return `🗺️ Check out my travel itinerary to ${item.destination || item.city || 'an amazing place'}:

// 📍 ${item.title || 'My Travel Plan'}
// ${item.description ? `\n${item.description}\n` : ''}
// 📅 Duration: ${item.duration || 'Multiple days'}
// 🏨 ${item.accommodation_details || 'Accommodation included'}
// 🚗 ${item.transport_details || 'Transportation arranged'}

// ${item.activities && item.activities.length > 0 ? `✨ Activities:\n${item.activities.slice(0, 5).map((a, i) => `${i + 1}. ${a}`).join('\n')}` : ''}

// Plan your journey with TravelMate! 🌍✈️`;

//     case 'booking':
//       return `🎉 I just booked ${item.service_name || item.title || 'an amazing experience'} on TravelMate! 🎊

// ${item.service_name || item.title}
// 📍 ${item.city || item.location || 'Amazing location'}
// 📅 Date: ${item.chosen_date || item.booking_date || 'Coming soon'}
// 👥 ${item.participants || 1} participant(s)
// 💰 ${item.price ? `Rs ${item.price}` : 'Great price'}

// Join me on this adventure! 🚀`;

//     case 'service':
//       return `🎭 Experience ${item.title || 'amazing cultural activities'}!

// 📍 ${item.city || 'Pakistan'}
// ⏰ Duration: ${item.duration_hours || item.durationHours || 'Flexible'} hours
// 👥 Group size: ${item.group_size_max || item.groupSize || 'Small groups'}
// 💰 Price: Rs ${item.price_per_person || item.pricePerPerson || 'Affordable'} per person
// ${item.experience_type ? `\n🎨 Type: ${item.experience_type}` : ''}
// ${item.category ? `\n📂 Category: ${item.category}` : ''}

// Book amazing cultural activities on TravelMate! 🌟`;

//     case 'ai-recommendation':
//       return `🤖 AI-recommended travel experience!

// 🌍 ${item.title || 'Discover amazing places'}
// 📍 ${item.city || item.destination || 'Pakistan'}
// ${item.description ? `\n${item.description}\n` : ''}
// 💰 Budget: ${item.budget || 'Flexible'}
// ✈️ Style: ${item.style || 'Adventure'}
// ⏱️ Duration: ${item.duration || 'Multi-day trip'}

// ${item.highlights && item.highlights.length > 0 ? `✨ Highlights:\n${item.highlights.slice(0, 5).map((h, i) => `${i + 1}. ${h}`).join('\n')}\n` : ''}
// Find more on TravelMate! 🎯`;

//     default:
//       return `🌍 Check this out on TravelMate - Your travel companion! ✈️`;
//   }
// };

// /**
//  * ❌ REMOVED: getShareUrl - No broken domain links for FYP
//  * Instead, we share complete descriptive text
//  */

// /**
//  * Universal share function - Works on mobile & web
//  * NO broken links - just rich descriptive text!
//  */
// export const shareContent = async (item, type) => {
//   try {
//     const message = getShareMessage(item, type);
//     const title = item.title || item.service_name || 'TravelMate';

//     if (Platform.OS === 'web') {
//       // Web: Try Web Share API, fallback to clipboard
//       if (navigator.share) {
//         await navigator.share({
//           title: title,
//           text: message,
//         });
//       } else if (navigator.clipboard) {
//         await navigator.clipboard.writeText(message);
//         Alert.alert('Copied!', 'Message copied to clipboard. Paste it anywhere!');
//       } else {
//         // Ultimate fallback: prompt user
//         prompt('Copy this message:', message);
//       }
//     } else {
//       // Mobile: Native share sheet
//       await Share.share({
//         title: title,
//         message: message,
//       });
//     }

//     console.log('✅ Content shared successfully');
//     return true;
//   } catch (error) {
//     if (error.message !== 'User cancelled' && error.name !== 'AbortError') {
//       console.error('Share error:', error);
//       Alert.alert('Share Error', 'Could not share right now. Try again!');
//     }
//     return false;
//   }
// };

// // Export for backward compatibility
// export const getShareUrl = () => ''; // Returns empty - no broken links
// export { shareContent as default };


// utils/shareImageHelper.js
import { Share, Platform, Alert } from 'react-native';

/**
 * Check if content is available offline
 */
export const isOfflineContent = (item) => {
  return item?.__offline === true || item?.offline === true;
};

/**
 * Get share image URL (placeholder for now - returns null for FYP)
 */
export const getShareImage = (item, type) => {
  // For FYP, we don't use images in shares
  // You can add cover_url logic here if needed
  return null;
};

/**
 * Generate rich, descriptive share message (NO broken links for FYP)
 */
export const getShareMessage = (item, type) => {
  switch (type) {
    case 'itinerary':
      return `🗺️ Check out my travel itinerary to ${item.destination || item.city || 'an amazing place'}:

📍 ${item.title || 'My Travel Plan'}
${item.description ? `\n${item.description}\n` : ''}
📅 Duration: ${item.duration || 'Multiple days'}
🏨 ${item.accommodation_details || 'Accommodation included'}
🚗 ${item.transport_details || 'Transportation arranged'}

${item.activities && item.activities.length > 0 ? `✨ Activities:\n${item.activities.slice(0, 5).map((a, i) => `${i + 1}. ${a}`).join('\n')}` : ''}

Plan your journey with TravelMate! 🌍✈️`;

    case 'booking':
      return `🎉 I just booked ${item.service_name || item.title || 'an amazing experience'} on TravelMate! 🎊

${item.service_name || item.title}
📍 ${item.city || item.location || 'Amazing location'}
📅 Date: ${item.chosen_date || item.booking_date || 'Coming soon'}
👥 ${item.participants || 1} participant(s)
💰 ${item.price ? `Rs ${item.price}` : 'Great price'}

Join me on this adventure! 🚀`;

    case 'service':
      return `🎭 Experience ${item.title || 'amazing cultural activities'}!

📍 ${item.city || 'Pakistan'}
⏰ Duration: ${item.duration_hours || item.durationHours || 'Flexible'} hours
👥 Group size: ${item.group_size_max || item.groupSize || 'Small groups'}
💰 Price: Rs ${item.price_per_person || item.pricePerPerson || 'Affordable'} per person
${item.experience_type ? `\n🎨 Type: ${item.experience_type}` : ''}
${item.category ? `\n📂 Category: ${item.category}` : ''}

Book amazing cultural activities on TravelMate! 🌟`;

    case 'ai-recommendation':
      return `🤖 AI-recommended travel experience!

🌍 ${item.title || 'Discover amazing places'}
📍 ${item.city || item.destination || 'Pakistan'}
${item.description ? `\n${item.description}\n` : ''}
💰 Budget: ${item.budget || 'Flexible'}
✈️ Style: ${item.style || 'Adventure'}
⏱️ Duration: ${item.duration || 'Multi-day trip'}

${item.highlights && item.highlights.length > 0 ? `✨ Highlights:\n${item.highlights.slice(0, 5).map((h, i) => `${i + 1}. ${h}`).join('\n')}\n` : ''}
Find more on TravelMate! 🎯`;

    default:
      return `🌍 Check this out on TravelMate - Your travel companion! ✈️`;
  }
};

/**
 * Get share URL (returns empty for FYP - no broken domain links)
 */
export const getShareUrl = (item, type) => {
  // For FYP, we don't share URLs since there's no domain
  // Just return empty string
  return '';
};

/**
 * Universal share function - Works on mobile & web
 * NO broken links - just rich descriptive text!
 */
export const shareContent = async (item, type) => {
  try {
    const message = getShareMessage(item, type);
    const title = item.title || item.service_name || 'TravelMate';

    if (Platform.OS === 'web') {
      // Web: Try Web Share API, fallback to clipboard
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: message,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        Alert.alert('Copied!', 'Message copied to clipboard. Paste it anywhere!');
      } else {
        // Ultimate fallback: prompt user
        prompt('Copy this message:', message);
      }
    } else {
      // Mobile: Native share sheet
      await Share.share({
        title: title,
        message: message,
      });
    }

    console.log('✅ Content shared successfully');
    return true;
  } catch (error) {
    if (error.message !== 'User cancelled' && error.name !== 'AbortError') {
      console.error('Share error:', error);
      Alert.alert('Share Error', 'Could not share right now. Try again!');
    }
    return false;
  }
};

// Export default
export default shareContent;