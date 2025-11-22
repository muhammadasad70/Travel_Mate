// // components/ShareButton.js
// import React, { useState } from 'react';
// import { 
//   TouchableOpacity, 
//   Text, 
//   StyleSheet, 
//   Share, 
//   Platform, 
//   Alert,
//   ActivityIndicator 
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// /**
//  * Universal Share Button Component
//  * Works on both mobile (native share) and web (Web Share API or clipboard)
//  * Supports sharing with images for better social media engagement
//  */
// export default function ShareButton({ 
//   title, 
//   message, 
//   url, 
//   imageUrl, 
//   style,
//   compact = false, // For smaller button variant
//   onShareComplete, // Callback after successful share
// }) {
//   const [isSharing, setIsSharing] = useState(false);

//   const handleShare = async () => {
//     try {
//       setIsSharing(true);

//       if (Platform.OS === 'web') {
//         await handleWebShare();
//       } else {
//         await handleMobileShare();
//       }

//       // Callback for analytics or UI updates
//       onShareComplete?.();
      
//     } catch (error) {
//       console.error('Share error:', error);
      
//       // Don't show error if user just cancelled
//       if (error.message !== 'User cancelled') {
//         Alert.alert('Share Failed', 'Could not share at this time. Please try again.');
//       }
//     } finally {
//       setIsSharing(false);
//     }
//   };

//   /**
//    * Handle sharing on web platform
//    */
//   const handleWebShare = async () => {
//     // Try modern Web Share API first
//     if (navigator.share) {
//       try {
//         const shareData = {
//           title: title,
//           text: message,
//           url: url,
//         };

//         // Try to include image if supported
//         if (imageUrl && navigator.canShare) {
//           try {
//             const response = await fetch(imageUrl);
//             const blob = await response.blob();
//             const file = new File([blob], 'share-image.jpg', { type: blob.type });
            
//             if (navigator.canShare({ files: [file] })) {
//               shareData.files = [file];
//             }
//           } catch (imgError) {
//             // Continue without image if fetch fails
//             console.log('Could not fetch image for sharing:', imgError);
//           }
//         }

//         await navigator.share(shareData);
//         return;
//       } catch (error) {
//         if (error.name === 'AbortError') {
//           throw new Error('User cancelled');
//         }
//         // Fall through to clipboard method
//       }
//     }

//     // Fallback: Copy to clipboard
//     const textToCopy = `${message}\n\n${url}`;
    
//     if (navigator.clipboard && navigator.clipboard.writeText) {
//       await navigator.clipboard.writeText(textToCopy);
//       Alert.alert('Copied!', 'Link copied to clipboard. You can now paste it on any social media!');
//     } else {
//       // Ultra-fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = textToCopy;
//       textArea.style.position = 'fixed';
//       textArea.style.opacity = '0';
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       Alert.alert('Copied!', 'Link copied to clipboard!');
//     }
//   };

//   /**
//    * Handle sharing on mobile platform (iOS/Android)
//    */
//   const handleMobileShare = async () => {
//     const shareOptions = {
//       title: title,
//       message: Platform.OS === 'android' 
//         ? `${message}\n\n${url}` // Android needs URL in message
//         : message,
//     };

//     // iOS can use url property
//     if (Platform.OS === 'ios') {
//       shareOptions.url = url;
//     }

//     // Add image if available (works better for Instagram Stories, WhatsApp)
//     if (imageUrl) {
//       shareOptions.url = imageUrl;
//     }

//     const result = await Share.share(shareOptions);

//     if (result.action === Share.dismissedAction) {
//       throw new Error('User cancelled');
//     }
//   };

//   // Compact variant (icon only)
//   if (compact) {
//     return (
//       <TouchableOpacity 
//         style={[styles.compactButton, style]} 
//         onPress={handleShare}
//         disabled={isSharing}
//         activeOpacity={0.7}
//       >
//         {isSharing ? (
//           <ActivityIndicator size="small" color="#3B82F6" />
//         ) : (
//           <Ionicons name="share-social-outline" size={22} color="#3B82F6" />
//         )}
//       </TouchableOpacity>
//     );
//   }

//   // Full button with text
//   return (
//     <TouchableOpacity 
//       style={[styles.shareButton, style]} 
//       onPress={handleShare}
//       disabled={isSharing}
//       activeOpacity={0.7}
//     >
//       {isSharing ? (
//         <>
//           <ActivityIndicator size="small" color="#3B82F6" />
//           <Text style={styles.shareText}>Sharing...</Text>
//         </>
//       ) : (
//         <>
//           <Ionicons name="share-social-outline" size={20} color="#3B82F6" />
//           <Text style={styles.shareText}>Share</Text>
//         </>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   shareButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: '#EFF6FF',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#BFDBFE',
//     minHeight: 44, // Good touch target
//   },
//   shareText: {
//     marginLeft: 8,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#3B82F6',
//   },
//   compactButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#EFF6FF',
//     borderWidth: 1,
//     borderColor: '#BFDBFE',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });


// components/ShareButton.js
import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Share, 
  Platform, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Universal Share Button Component
 * Works on both mobile (native share) and web (Web Share API or clipboard)
 * Supports sharing with images for better social media engagement
 * 
 * @param {string} title - Share title
 * @param {string} message - Share message/description
 * @param {string} url - URL to share
 * @param {string} imageUrl - Optional image URL for better social media preview
 * @param {object} style - Custom styles
 * @param {boolean} compact - Use compact icon-only variant
 * @param {function} onShareComplete - Callback after successful share
 */
export default function ShareButton({ 
  title, 
  message, 
  url, 
  imageUrl, 
  style,
  compact = false,
  onShareComplete,
}) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    try {
      setIsSharing(true);

      if (Platform.OS === 'web') {
        await handleWebShare();
      } else {
        await handleMobileShare();
      }

      // Callback for analytics or UI updates
      if (onShareComplete) {
        onShareComplete();
      }
      
    } catch (error) {
      console.error('Share error:', error);
      
      // Don't show error if user just cancelled
      if (error.message !== 'User cancelled' && error.name !== 'AbortError') {
        Alert.alert('Share Failed', 'Could not share at this time. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Handle sharing on web platform
   */
  const handleWebShare = async () => {
    // Try modern Web Share API first
    if (navigator.share) {
      try {
        const shareData = {
          title: title,
          text: message,
          url: url,
        };

        // Try to include image if supported
        if (imageUrl && navigator.canShare) {
          try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'share-image.jpg', { type: blob.type });
            
            if (navigator.canShare({ files: [file] })) {
              shareData.files = [file];
            }
          } catch (imgError) {
            // Continue without image if fetch fails
            console.log('Could not fetch image for sharing:', imgError);
          }
        }

        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('User cancelled');
        }
        // Fall through to clipboard method
      }
    }

    // Fallback: Copy to clipboard
    const textToCopy = `${message}\n\n${url}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
      Alert.alert('Copied!', 'Link copied to clipboard. You can now paste it on any social media!');
    } else {
      // Ultra-fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      Alert.alert('Copied!', 'Link copied to clipboard!');
    }
  };

  /**
   * Handle sharing on mobile platform (iOS/Android)
   */
  const handleMobileShare = async () => {
    const shareOptions = {
      title: title,
      message: Platform.OS === 'android' 
        ? `${message}\n\n${url}` // Android needs URL in message
        : message,
    };

    // iOS can use url property
    if (Platform.OS === 'ios') {
      shareOptions.url = url;
    }

    // Add image if available (works better for Instagram Stories, WhatsApp)
    if (imageUrl && Platform.OS === 'ios') {
      shareOptions.url = imageUrl;
    }

    const result = await Share.share(shareOptions);

    if (result.action === Share.dismissedAction) {
      throw new Error('User cancelled');
    }
  };

  // Compact variant (icon only)
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactButton, style]} 
        onPress={handleShare}
        disabled={isSharing}
        activeOpacity={0.7}
      >
        {isSharing ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <Ionicons name="share-social-outline" size={20} color="#3B82F6" />
        )}
      </TouchableOpacity>
    );
  }

  // Full button with text
  return (
    <TouchableOpacity 
      style={[styles.shareButton, style]} 
      onPress={handleShare}
      disabled={isSharing}
      activeOpacity={0.7}
    >
      {isSharing ? (
        <>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.shareText}>Sharing...</Text>
        </>
      ) : (
        <>
          <Ionicons name="share-social-outline" size={20} color="#3B82F6" />
          <Text style={styles.shareText}>Share</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    minHeight: 44, // Good touch target
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  shareText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
});