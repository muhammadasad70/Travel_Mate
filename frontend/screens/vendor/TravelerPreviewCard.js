// // // screens/Vendor/TravelerPreviewCard.js
// // import React from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';

// // const TravelerPreviewCard = ({ traveler, onViewProfile }) => {
// //   if (!traveler) return null;

// //   // Generate initials for avatar fallback
// //   const getInitials = () => {
// //     const name = traveler.name?.String || traveler.name || '';
// //     const parts = name.trim().split(' ');
// //     if (parts.length >= 2) {
// //       return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
// //     }
// //     return name.charAt(0).toUpperCase() || 'T';
// //   };

// //   // Get display name (first name only for privacy)
// //   const getDisplayName = () => {
// //     const name = traveler.name?.String || traveler.name || 'Traveler';
// //     const parts = name.trim().split(' ');
// //     if (parts.length >= 2) {
// //       return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
// //     }
// //     return parts[0] || 'Traveler';
// //   };

// //   const avatarUrl = traveler.avatar_url?.String || traveler.avatar_url;

// //   return (
// //     <View style={styles.card}>
// //       <View style={styles.header}>
// //         <View style={styles.avatarSection}>
// //           {avatarUrl ? (
// //             <Image source={{ uri: avatarUrl }} style={styles.avatar} />
// //           ) : (
// //             <View style={styles.avatarFallback}>
// //               <Text style={styles.initials}>{getInitials()}</Text>
// //             </View>
// //           )}
// //           <View style={styles.nameSection}>
// //             <View style={styles.nameRow}>
// //               <Text style={styles.name}>{getDisplayName()}</Text>
// //               <Ionicons name="person-circle" size={18} color="#6366F1" />
// //             </View>
// //             <Text style={styles.roleText}>TravelMate Traveler</Text>
// //           </View>
// //         </View>
// //       </View>

// //       {/* View Profile Button */}
// //       {onViewProfile && (
// //         <TouchableOpacity style={styles.viewProfileBtn} onPress={onViewProfile}>
// //           <Text style={styles.viewProfileText}>View traveler profile</Text>
// //           <Ionicons name="chevron-forward" size={16} color="#6366F1" />
// //         </TouchableOpacity>
// //       )}
// //     </View>
// //   );
// // };

// // export default TravelerPreviewCard;

// // const styles = StyleSheet.create({
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 14,
// //     borderWidth: 1,
// //     borderColor: '#E6EDF7',
// //     padding: 12,
// //     marginTop: 10,
// //     gap: 10,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //   },
// //   avatarSection: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //     flex: 1,
// //   },
// //   avatar: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     backgroundColor: '#E5E7EB',
// //   },
// //   avatarFallback: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     backgroundColor: '#6366F1',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   initials: {
// //     fontSize: 18,
// //     fontWeight: '800',
// //     color: '#fff',
// //   },
// //   nameSection: {
// //     flex: 1,
// //     gap: 3,
// //   },
// //   nameRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //   },
// //   name: {
// //     fontSize: 16,
// //     fontWeight: '800',
// //     color: '#0f172a',
// //   },
// //   roleText: {
// //     fontSize: 12,
// //     color: '#6366F1',
// //     fontWeight: '600',
// //   },
// //   viewProfileBtn: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingVertical: 8,
// //     paddingHorizontal: 10,
// //     backgroundColor: '#EEF2FF',
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: '#C7D2FE',
// //   },
// //   viewProfileText: {
// //     fontSize: 13,
// //     fontWeight: '800',
// //     color: '#6366F1',
// //   },
// // });
// // screens/Vendor/TravelerPreviewCard.js
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const TravelerPreviewCard = ({ traveler, onViewProfile }) => {
//   if (!traveler) return null;

//   // Generate initials for avatar fallback
//   const getInitials = () => {
//     const name = traveler.name?.String || traveler.name || '';
//     const parts = name.trim().split(' ');
//     if (parts.length >= 2) {
//       return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
//     }
//     return name.charAt(0).toUpperCase() || 'T';
//   };

//   // Get display name (first name only for privacy)
//   const getDisplayName = () => {
//     const name = traveler.name?.String || traveler.name || 'Traveler';
//     const parts = name.trim().split(' ');
//     if (parts.length >= 2) {
//       return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
//     }
//     return parts[0] || 'Traveler';
//   };

//   // ✅ FIXED: Safely extract avatar URL as a string
//   const getAvatarUrl = () => {
//     const avatar = traveler.avatar_url;
    
//     // If it's null or undefined, return null
//     if (!avatar) return null;
    
//     // If it's already a string, return it
//     if (typeof avatar === 'string') {
//       return avatar.trim() !== '' ? avatar : null;
//     }
    
//     // If it's an object with a String property (from Go backend)
//     if (avatar.String !== undefined) {
//       return avatar.String && avatar.String.trim() !== '' ? avatar.String : null;
//     }
    
//     // If it's an object with a uri property
//     if (avatar.uri && typeof avatar.uri === 'string') {
//       return avatar.uri.trim() !== '' ? avatar.uri : null;
//     }
    
//     // Default: return null (no avatar)
//     return null;
//   };

//   const avatarUrl = getAvatarUrl();

//   return (
//     <View style={styles.card}>
//       <View style={styles.header}>
//         <View style={styles.avatarSection}>
//           {avatarUrl ? (
//             <Image 
//               source={{ uri: avatarUrl }} 
//               style={styles.avatar}
//               onError={(error) => {
//                 console.log('Avatar image failed to load:', error.nativeEvent.error);
//               }}
//             />
//           ) : (
//             <View style={styles.avatarFallback}>
//               <Text style={styles.initials}>{getInitials()}</Text>
//             </View>
//           )}
//           <View style={styles.nameSection}>
//             <View style={styles.nameRow}>
//               <Text style={styles.name}>{getDisplayName()}</Text>
//               <Ionicons name="person-circle" size={18} color="#6366F1" style={{ marginLeft: 6 }} />
//             </View>
//             <Text style={styles.roleText}>TravelMate Traveler</Text>
//           </View>
//         </View>
//       </View>

//       {/* View Profile Button */}
//       {onViewProfile && (
//         <TouchableOpacity style={styles.viewProfileBtn} onPress={onViewProfile}>
//           <Text style={styles.viewProfileText}>View traveler profile</Text>
//           <Ionicons name="chevron-forward" size={16} color="#6366F1" />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default TravelerPreviewCard;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#E6EDF7',
//     padding: 12,
//     marginTop: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   avatarSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#E5E7EB',
//     marginRight: 12,
//   },
//   avatarFallback: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#6366F1',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   initials: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#fff',
//   },
//   nameSection: {
//     flex: 1,
//   },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 3,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: '#0f172a',
//   },
//   roleText: {
//     fontSize: 12,
//     color: '#6366F1',
//     fontWeight: '600',
//   },
//   viewProfileBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     backgroundColor: '#EEF2FF',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#C7D2FE',
//   },
//   viewProfileText: {
//     fontSize: 13,
//     fontWeight: '800',
//     color: '#6366F1',
//   },
// });
// screens/Vendor/TravelerPreviewCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TravelerPreviewCard = ({ traveler, onViewProfile }) => {
  if (!traveler) return null;

  // ✅ Safe string extractor for Go backend sql.NullString format
  const safeString = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    // Handle Go's sql.NullString format: {String: "value", Valid: true/false}
    if (val.Valid === false) return '';
    if (val.String !== undefined) return val.String || '';
    return String(val);
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    const name = safeString(traveler.name);
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase() || 'T';
  };

  // Get display name (first name only for privacy)
  const getDisplayName = () => {
    const name = safeString(traveler.name) || 'Traveler';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
    }
    return parts[0] || 'Traveler';
  };

  // ✅ FIXED: Safely extract avatar URL - handle Go's sql.NullString
  const getAvatarUrl = () => {
    const avatar = traveler.avatar_url;
    
    // Handle Go's sql.NullString format
    if (avatar && typeof avatar === 'object') {
      // If Valid is false, don't use the string
      if (avatar.Valid === false) return null;
      
      // If Valid is true, get the String value
      if (avatar.String && avatar.String.trim() !== '') {
        return avatar.String;
      }
      return null;
    }
    
    // Handle direct string
    if (typeof avatar === 'string' && avatar.trim() !== '') {
      return avatar;
    }
    
    // Default: no avatar
    return null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          {avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }} 
              style={styles.avatar}
              onError={(error) => {
                console.log('Avatar image failed to load:', error.nativeEvent.error);
              }}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.initials}>{getInitials()}</Text>
            </View>
          )}
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{getDisplayName()}</Text>
              <Ionicons name="person-circle" size={18} color="#6366F1" style={{ marginLeft: 6 }} />
            </View>
            <Text style={styles.roleText}>TravelMate Traveler</Text>
          </View>
        </View>
      </View>

      {/* View Profile Button */}
      {onViewProfile && (
        <TouchableOpacity style={styles.viewProfileBtn} onPress={onViewProfile}>
          <Text style={styles.viewProfileText}>View traveler profile</Text>
          <Ionicons name="chevron-forward" size={16} color="#6366F1" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TravelerPreviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6EDF7',
    padding: 12,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  initials: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  nameSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  roleText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366F1',
  },
});