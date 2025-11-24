
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const KEYS = {
//   ITINERARIES: 'offline_itineraries',
//   BOOKINGS: 'offline_bookings',
//   EVENTS: 'offline_events',
//   EMERGENCY_DATA: 'offline_emergency_data',
// };

// // ============ ITINERARIES ============
// export const saveItineraryOffline = async (itinerary) => {
//   try {
//     const existing = await getOfflineItineraries();
//     const updated = existing.filter(i => i.id !== itinerary.id);
//     updated.push({ ...itinerary, savedAt: new Date().toISOString() });
//     await AsyncStorage.setItem(KEYS.ITINERARIES, JSON.stringify(updated));
//     return true;
//   } catch (error) {
//     console.error('Save itinerary offline failed:', error);
//     return false;
//   }
// };

// export const getOfflineItineraries = async () => {
//   try {
//     const data = await AsyncStorage.getItem(KEYS.ITINERARIES);
//     return data ? JSON.parse(data) : [];
//   } catch (error) {
//     console.error('Get offline itineraries failed:', error);
//     return [];
//   }
// };

// export const removeOfflineItinerary = async (id) => {
//   try {
//     const existing = await getOfflineItineraries();
//     const filtered = existing.filter(i => i.id !== id);
//     await AsyncStorage.setItem(KEYS.ITINERARIES, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     console.error('Remove offline itinerary failed:', error);
//     return false;
//   }
// };

// export const isItinerarySavedOffline = async (id) => {
//   try {
//     const existing = await getOfflineItineraries();
//     return existing.some(i => i.id === id);
//   } catch (error) {
//     return false;
//   }
// };

// // ============ BOOKINGS ============
// export const saveBookingOffline = async (booking) => {
//   try {
//     const existing = await getOfflineBookings();
//     const updated = existing.filter(b => b.id !== booking.id);
//     updated.push({ ...booking, savedAt: new Date().toISOString() });
//     await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
//     return true;
//   } catch (error) {
//     console.error('Save booking offline failed:', error);
//     return false;
//   }
// };

// export const getOfflineBookings = async () => {
//   try {
//     const data = await AsyncStorage.getItem(KEYS.BOOKINGS);
//     return data ? JSON.parse(data) : [];
//   } catch (error) {
//     return [];
//   }
// };

// export const removeOfflineBooking = async (id) => {
//   try {
//     const existing = await getOfflineBookings();
//     const filtered = existing.filter(b => b.id !== id);
//     await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// // ============ EVENTS ============
// export const saveEventOffline = async (event) => {
//   try {
//     const existing = await getOfflineEvents();
//     const updated = existing.filter(e => e.id !== event.id);
//     updated.push({ ...event, savedAt: new Date().toISOString() });
//     await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
//     return true;
//   } catch (error) {
//     console.error('Save event offline failed:', error);
//     return false;
//   }
// };

// export const getOfflineEvents = async () => {
//   try {
//     const data = await AsyncStorage.getItem(KEYS.EVENTS);
//     return data ? JSON.parse(data) : [];
//   } catch (error) {
//     return [];
//   }
// };

// export const removeOfflineEvent = async (id) => {
//   try {
//     const existing = await getOfflineEvents();
//     const filtered = existing.filter(e => e.id !== id);
//     await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// // ✅ NEW: Check if event is saved offline
// export const isEventSavedOffline = async (id) => {
//   try {
//     const existing = await getOfflineEvents();
//     return existing.some(e => e.id === id);
//   } catch (error) {
//     return false;
//   }
// };

// // ============ EMERGENCY DATA ============
// export const saveEmergencyDataOffline = async (city, data) => {
//   try {
//     const existing = await getOfflineEmergencyData();
//     existing[city] = {
//       ...data,
//       cachedAt: new Date().toISOString(),
//     };
//     await AsyncStorage.setItem(KEYS.EMERGENCY_DATA, JSON.stringify(existing));
//     return true;
//   } catch (error) {
//     console.error('Save emergency data offline failed:', error);
//     return false;
//   }
// };

// export const getOfflineEmergencyData = async () => {
//   try {
//     const data = await AsyncStorage.getItem(KEYS.EMERGENCY_DATA);
//     return data ? JSON.parse(data) : {};
//   } catch (error) {
//     return {};
//   }
// };

// export const getOfflineEmergencyForCity = async (city) => {
//   try {
//     const allData = await getOfflineEmergencyData();
//     return allData[city] || null;
//   } catch (error) {
//     return null;
//   }
// };

// // ============ STORAGE MANAGEMENT ============
// export const clearAllOfflineData = async () => {
//   try {
//     await AsyncStorage.multiRemove([
//       KEYS.ITINERARIES,
//       KEYS.BOOKINGS,
//       KEYS.EVENTS,
//       KEYS.EMERGENCY_DATA,
//     ]);
//     return true;
//   } catch (error) {
//     console.error('Clear offline data failed:', error);
//     return false;
//   }
// };

// export const getStorageStats = async () => {
//   try {
//     const [itineraries, bookings, events, emergency] = await Promise.all([
//       getOfflineItineraries(),
//       getOfflineBookings(),
//       getOfflineEvents(),
//       getOfflineEmergencyData(),
//     ]);

//     // Estimate size in KB
//     const itinerariesSize = JSON.stringify(itineraries).length / 1024;
//     const bookingsSize = JSON.stringify(bookings).length / 1024;
//     const eventsSize = JSON.stringify(events).length / 1024;
//     const emergencySize = JSON.stringify(emergency).length / 1024;

//     return {
//       itineraries: {
//         count: itineraries.length,
//         size: itinerariesSize.toFixed(2),
//       },
//       bookings: {
//         count: bookings.length,
//         size: bookingsSize.toFixed(2),
//       },
//       events: {
//         count: events.length,
//         size: eventsSize.toFixed(2),
//       },
//       emergency: {
//         count: Object.keys(emergency).length,
//         size: emergencySize.toFixed(2),
//       },
//       total: {
//         count: itineraries.length + bookings.length + events.length + Object.keys(emergency).length,
//         size: (itinerariesSize + bookingsSize + eventsSize + emergencySize).toFixed(2),
//       },
//     };
//   } catch (error) {
//     return null;
//   }
// };



import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ITINERARIES: 'offline_itineraries',
  BOOKINGS: 'offline_bookings',
  EVENTS: 'offline_events',
  EMERGENCY_DATA: 'offline_emergency_data',
};

// ✅ NEW: Get current user ID from AsyncStorage
const getCurrentUserId = async () => {
  try {
    // Try multiple possible keys for user ID
    const possibleKeys = ['user_id', 'userId', 'USER_ID', 'currentUserId'];
    
    for (const key of possibleKeys) {
      const id = await AsyncStorage.getItem(key);
      if (id) {
        console.log(`✅ Found user ID in key: ${key} = ${id}`);
        return String(id);
      }
    }
    
    // Try to get from user object
    const userDataKeys = ['user', 'userData', 'currentUser', 'USER'];
    for (const key of userDataKeys) {
      const userData = await AsyncStorage.getItem(key);
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed.id) {
            console.log(`✅ Found user ID in ${key}.id = ${parsed.id}`);
            return String(parsed.id);
          }
          if (parsed.user_id) {
            console.log(`✅ Found user ID in ${key}.user_id = ${parsed.user_id}`);
            return String(parsed.user_id);
          }
          if (parsed.ID) {
            console.log(`✅ Found user ID in ${key}.ID = ${parsed.ID}`);
            return String(parsed.ID);
          }
        } catch (e) {
          // Continue to next key
        }
      }
    }
    
    console.warn('⚠️ Could not find user ID in storage');
    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// ============ ITINERARIES ============
export const saveItineraryOffline = async (itinerary) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('⚠️ No user ID found when saving itinerary');
    }

    const existing = await getOfflineItineraries();
    const updated = existing.filter(i => i.id !== itinerary.id);
    
    // ✅ Add user_id to itinerary
    updated.push({ 
      ...itinerary, 
      user_id: userId,
      savedAt: new Date().toISOString() 
    });
    
    // Get ALL itineraries from storage (not just current user's)
    const allData = await AsyncStorage.getItem(KEYS.ITINERARIES);
    const allItineraries = allData ? JSON.parse(allData) : [];
    
    // Remove old version of this itinerary for this user
    const filteredAll = allItineraries.filter(i => 
      !(i.id === itinerary.id && i.user_id === userId)
    );
    
    // Add new version
    filteredAll.push({ 
      ...itinerary, 
      user_id: userId,
      savedAt: new Date().toISOString() 
    });
    
    await AsyncStorage.setItem(KEYS.ITINERARIES, JSON.stringify(filteredAll));
    console.log(`✅ Itinerary saved offline for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Save itinerary offline failed:', error);
    return false;
  }
};

export const getOfflineItineraries = async () => {
  try {
    const userId = await getCurrentUserId();
    const data = await AsyncStorage.getItem(KEYS.ITINERARIES);
    if (!data) return [];
    
    const allItineraries = JSON.parse(data);
    
    // ✅ Filter by current user ID
    if (userId) {
      const userItineraries = allItineraries.filter(i => i.user_id === userId);
      console.log(`📍 Loaded ${userItineraries.length}/${allItineraries.length} itineraries for user ${userId}`);
      return userItineraries;
    }
    
    console.warn('⚠️ No user ID found, returning all itineraries');
    return allItineraries;
  } catch (error) {
    console.error('Get offline itineraries failed:', error);
    return [];
  }
};

export const removeOfflineItinerary = async (id) => {
  try {
    const userId = await getCurrentUserId();
    const data = await AsyncStorage.getItem(KEYS.ITINERARIES);
    if (!data) return true;
    
    const allItineraries = JSON.parse(data);
    
    // ✅ Only remove if it belongs to current user
    const filtered = allItineraries.filter(i => 
      !(i.id === id && i.user_id === userId)
    );
    
    await AsyncStorage.setItem(KEYS.ITINERARIES, JSON.stringify(filtered));
    console.log(`✅ Itinerary ${id} removed for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Remove offline itinerary failed:', error);
    return false;
  }
};

export const isItinerarySavedOffline = async (id) => {
  try {
    const userId = await getCurrentUserId();
    const data = await AsyncStorage.getItem(KEYS.ITINERARIES);
    if (!data) return false;
    
    const allItineraries = JSON.parse(data);
    
    // ✅ Check if exists for current user
    return allItineraries.some(i => i.id === id && i.user_id === userId);
  } catch (error) {
    return false;
  }
};

// ============ BOOKINGS ============
export const saveBookingOffline = async (booking) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('⚠️ No user ID found when saving booking');
    }

    // Get ALL bookings from storage (not just current user's)
    const allData = await AsyncStorage.getItem(KEYS.BOOKINGS);
    const allBookings = allData ? JSON.parse(allData) : [];
    
    // Remove old version of this booking for this user
    const filteredAll = allBookings.filter(b => 
      !(b.id === booking.id && b.user_id === userId)
    );
    
    // ✅ Add new version with user_id
    filteredAll.push({ 
      ...booking, 
      user_id: userId,
      savedAt: new Date().toISOString() 
    });
    
    await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(filteredAll));
    console.log(`✅ Booking saved offline for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Save booking offline failed:', error);
    return false;
  }
};

export const getOfflineBookings = async () => {
  try {
    const userId = await getCurrentUserId();
    const data = await AsyncStorage.getItem(KEYS.BOOKINGS);
    if (!data) return [];
    
    const allBookings = JSON.parse(data);
    
    // ✅ Filter by current user ID
    if (userId) {
      const userBookings = allBookings.filter(b => b.user_id === userId);
      console.log(`📍 Loaded ${userBookings.length}/${allBookings.length} bookings for user ${userId}`);
      return userBookings;
    }
    
    console.warn('⚠️ No user ID found, returning all bookings');
    return allBookings;
  } catch (error) {
    return [];
  }
};

export const removeOfflineBooking = async (id) => {
  try {
    const userId = await getCurrentUserId();
    const data = await AsyncStorage.getItem(KEYS.BOOKINGS);
    if (!data) return true;
    
    const allBookings = JSON.parse(data);
    
    // ✅ Only remove if it belongs to current user
    const filtered = allBookings.filter(b => 
      !(b.id === id && b.user_id === userId)
    );
    
    await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(filtered));
    console.log(`✅ Booking ${id} removed for user: ${userId}`);
    return true;
  } catch (error) {
    return false;
  }
};

// ============ EVENTS ============
export const saveEventOffline = async (event) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('⚠️ No user ID found when saving event');
    }

    // Get ALL events from storage (not just current user's)
    const allData = await AsyncStorage.getItem(KEYS.EVENTS);
    const allEvents = allData ? JSON.parse(allData) : [];
    
    // Remove old version of this event for this user
    const filteredAll = allEvents.filter(e => 
      !(e.id === event.id && e.user_id === userId)
    );
    
    // ✅ Add new version with user_id
    filteredAll.push({ 
      ...event, 
      user_id: userId,
      savedAt: new Date().toISOString() 
    });
    
    await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(filteredAll));
    console.log(`✅ Event saved offline for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Save event offline failed:', error);
    return false;
  }
};

export const getOfflineEvents = async () => {
  try {
    const userId = await getCurrentUserId();
    const data = await AsyncStorage.getItem(KEYS.EVENTS);
    if (!data) return [];
    
    const allEvents = JSON.parse(data);
    
    // ✅ Filter by current user ID
    if (userId) {
      const userEvents = allEvents.filter(e => e.user_id === userId);
      console.log(`📍 Loaded ${userEvents.length}/${allEvents.length} events for user ${userId}`);
      return userEvents;
    }
    
    console.warn('⚠️ No user ID found, returning all events');
    return allEvents;
  } catch (error) {
    return [];
  }
};

export const removeOfflineEvent = async (id) => {
  try {
    const userId = await getCurrentUserId();
    const data = await AsyncStorage.getItem(KEYS.EVENTS);
    if (!data) return true;
    
    const allEvents = JSON.parse(data);
    
    // ✅ Only remove if it belongs to current user
    const filtered = allEvents.filter(e => 
      !(e.id === id && e.user_id === userId)
    );
    
    await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(filtered));
    console.log(`✅ Event ${id} removed for user: ${userId}`);
    return true;
  } catch (error) {
    return false;
  }
};

// ✅ Check if event is saved offline
export const isEventSavedOffline = async (id) => {
  try {
    const userId = await getCurrentUserId();
    const data = await AsyncStorage.getItem(KEYS.EVENTS);
    if (!data) return false;
    
    const allEvents = JSON.parse(data);
    
    // ✅ Check if exists for current user
    return allEvents.some(e => e.id === id && e.user_id === userId);
  } catch (error) {
    return false;
  }
};

// ============ EMERGENCY DATA ============
export const saveEmergencyDataOffline = async (city, data) => {
  try {
    const existing = await getOfflineEmergencyData();
    existing[city] = {
      ...data,
      cachedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(KEYS.EMERGENCY_DATA, JSON.stringify(existing));
    return true;
  } catch (error) {
    console.error('Save emergency data offline failed:', error);
    return false;
  }
};

export const getOfflineEmergencyData = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.EMERGENCY_DATA);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
};

export const getOfflineEmergencyForCity = async (city) => {
  try {
    const allData = await getOfflineEmergencyData();
    return allData[city] || null;
  } catch (error) {
    return null;
  }
};

// ============ STORAGE MANAGEMENT ============
export const clearAllOfflineData = async () => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      // If no user ID, clear everything (dangerous!)
      await AsyncStorage.multiRemove([
        KEYS.ITINERARIES,
        KEYS.BOOKINGS,
        KEYS.EVENTS,
        KEYS.EMERGENCY_DATA,
      ]);
      console.log('✅ All offline data cleared (no user filter)');
      return true;
    }

    // ✅ Only clear current user's data (keep other users' data)
    const [itinerariesData, bookingsData, eventsData] = await Promise.all([
      AsyncStorage.getItem(KEYS.ITINERARIES),
      AsyncStorage.getItem(KEYS.BOOKINGS),
      AsyncStorage.getItem(KEYS.EVENTS),
    ]);

    const itineraries = itinerariesData ? JSON.parse(itinerariesData) : [];
    const bookings = bookingsData ? JSON.parse(bookingsData) : [];
    const events = eventsData ? JSON.parse(eventsData) : [];

    // Filter out current user's data (keep other users)
    const filteredItineraries = itineraries.filter(i => i.user_id !== userId);
    const filteredBookings = bookings.filter(b => b.user_id !== userId);
    const filteredEvents = events.filter(e => e.user_id !== userId);

    await Promise.all([
      AsyncStorage.setItem(KEYS.ITINERARIES, JSON.stringify(filteredItineraries)),
      AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(filteredBookings)),
      AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(filteredEvents)),
    ]);

    console.log(`✅ Cleared offline data for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Clear offline data failed:', error);
    return false;
  }
};

export const getStorageStats = async () => {
  try {
    const userId = await getCurrentUserId();
    
    const [itineraries, bookings, events, emergency] = await Promise.all([
      getOfflineItineraries(),  // ✅ Already filtered by user
      getOfflineBookings(),      // ✅ Already filtered by user
      getOfflineEvents(),        // ✅ Already filtered by user
      getOfflineEmergencyData(),
    ]);

    // Estimate size in KB
    const itinerariesSize = JSON.stringify(itineraries).length / 1024;
    const bookingsSize = JSON.stringify(bookings).length / 1024;
    const eventsSize = JSON.stringify(events).length / 1024;
    const emergencySize = JSON.stringify(emergency).length / 1024;

    return {
      itineraries: {
        count: itineraries.length,
        size: itinerariesSize.toFixed(2),
      },
      bookings: {
        count: bookings.length,
        size: bookingsSize.toFixed(2),
      },
      events: {
        count: events.length,
        size: eventsSize.toFixed(2),
      },
      emergency: {
        count: Object.keys(emergency).length,
        size: emergencySize.toFixed(2),
      },
      total: {
        count: itineraries.length + bookings.length + events.length + Object.keys(emergency).length,
        size: (itinerariesSize + bookingsSize + eventsSize + emergencySize).toFixed(2),
      },
    };
  } catch (error) {
    return null;
  }
};