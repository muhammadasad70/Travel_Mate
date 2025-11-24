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
// // Add this after removeOfflineEvent
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

// ============ ITINERARIES ============
export const saveItineraryOffline = async (itinerary) => {
  try {
    const existing = await getOfflineItineraries();
    const updated = existing.filter(i => i.id !== itinerary.id);
    updated.push({ ...itinerary, savedAt: new Date().toISOString() });
    await AsyncStorage.setItem(KEYS.ITINERARIES, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Save itinerary offline failed:', error);
    return false;
  }
};

export const getOfflineItineraries = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ITINERARIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Get offline itineraries failed:', error);
    return [];
  }
};

export const removeOfflineItinerary = async (id) => {
  try {
    const existing = await getOfflineItineraries();
    const filtered = existing.filter(i => i.id !== id);
    await AsyncStorage.setItem(KEYS.ITINERARIES, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Remove offline itinerary failed:', error);
    return false;
  }
};

export const isItinerarySavedOffline = async (id) => {
  try {
    const existing = await getOfflineItineraries();
    return existing.some(i => i.id === id);
  } catch (error) {
    return false;
  }
};

// ============ BOOKINGS ============
export const saveBookingOffline = async (booking) => {
  try {
    const existing = await getOfflineBookings();
    const updated = existing.filter(b => b.id !== booking.id);
    updated.push({ ...booking, savedAt: new Date().toISOString() });
    await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Save booking offline failed:', error);
    return false;
  }
};

export const getOfflineBookings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const removeOfflineBooking = async (id) => {
  try {
    const existing = await getOfflineBookings();
    const filtered = existing.filter(b => b.id !== id);
    await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    return false;
  }
};

// ============ EVENTS ============
export const saveEventOffline = async (event) => {
  try {
    const existing = await getOfflineEvents();
    const updated = existing.filter(e => e.id !== event.id);
    updated.push({ ...event, savedAt: new Date().toISOString() });
    await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Save event offline failed:', error);
    return false;
  }
};

export const getOfflineEvents = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const removeOfflineEvent = async (id) => {
  try {
    const existing = await getOfflineEvents();
    const filtered = existing.filter(e => e.id !== id);
    await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    return false;
  }
};

// ✅ NEW: Check if event is saved offline
export const isEventSavedOffline = async (id) => {
  try {
    const existing = await getOfflineEvents();
    return existing.some(e => e.id === id);
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
    await AsyncStorage.multiRemove([
      KEYS.ITINERARIES,
      KEYS.BOOKINGS,
      KEYS.EVENTS,
      KEYS.EMERGENCY_DATA,
    ]);
    return true;
  } catch (error) {
    console.error('Clear offline data failed:', error);
    return false;
  }
};

export const getStorageStats = async () => {
  try {
    const [itineraries, bookings, events, emergency] = await Promise.all([
      getOfflineItineraries(),
      getOfflineBookings(),
      getOfflineEvents(),
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