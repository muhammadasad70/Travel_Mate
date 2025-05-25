// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Modal,
//   Pressable,
//   Platform,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';

// const screenWidth = Dimensions.get('window').width;
// const isMobile = screenWidth < 768;

// const menuItems = [
//   'Group Settings',
//   'Set Permissions',
//   'Share Itinerary',
//   'Events',
//   'Services',
//   'Destinations',
//   'Restaurants',
//   'See Results',
//   'Admin Settings',
// ];

// const DashboardSidebar = ({ onSelect, currentScreen = 'Group Settings' }) => {
//   const [showMenu, setShowMenu] = useState(false);

//   const handleItemPress = (item) => {
//     setShowMenu(false);
//     onSelect?.(item);
//   };

//   const renderItem = (item, index, inModal = false) => (
//     <TouchableOpacity
//       key={index}
//       onPress={() => handleItemPress(item)}
//       style={[
//         inModal ? styles.modalItem : styles.item,
//         item === currentScreen && styles.activeItem,
//       ]}
//     >
//       <Text
//         style={[
//           inModal ? styles.modalItemText : styles.text,
//           item === currentScreen && styles.activeText,
//         ]}
//       >
//         {item}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       {!isMobile ? (
//         <View style={styles.sidebar}>
//           {menuItems.map((item, index) => renderItem(item, index))}
//         </View>
//       ) : (
//         <View style={styles.dropdownContainer}>
//           <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.dropdownButton}>
//             <Text style={styles.dropdownButtonText}>☰ Menu</Text>
//             <Feather name="chevron-down" size={20} color="#333" />
//           </TouchableOpacity>

//           <Modal transparent visible={showMenu} animationType="slide">
//             <Pressable
//               style={styles.modalBackdrop}
//               onPress={() => setShowMenu(false)}
//             >
//               <View style={styles.modalContent}>
//                 {menuItems.map((item, index) => renderItem(item, index, true))}
//                 <TouchableOpacity
//                   onPress={() => setShowMenu(false)}
//                   style={{ marginTop: 12, alignSelf: 'center' }}
//                 >
//                   <Text style={{ color: 'red', fontSize: 16 }}>Close</Text>
//                 </TouchableOpacity>
//               </View>
//             </Pressable>
//           </Modal>
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   sidebar: {
//     width: 200,
//     backgroundColor: '#f8f9fa',
//     borderRightWidth: 1,
//     borderColor: '#dee2e6',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },
//   item: {
//     paddingVertical: 10,
//   },
//   activeItem: {
//     backgroundColor: '#e2e6ea',
//     borderRadius: 8,
//   },
//   text: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   activeText: {
//     color: '#007bff',
//   },
//   dropdownContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   dropdownButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#f0f0f0',
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 8,
//   },
//   dropdownButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     paddingTop: 80,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     width: '85%',
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     elevation: 5,
//   },
//   modalItem: {
//     paddingVertical: 12,
//   },
//   modalItemText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//   },
// });

// export default DashboardSidebar;


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const menuItems = [
  'Group Settings',
  'Set Permissions',
  'Share Itinerary',
  'Events',
  'Services',
  'Destinations',
  'Restaurants',
  'See Results',
  'Admin Settings',
];

const DashboardSidebar = ({ onSelect, currentScreen = 'Group Settings' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || width < 768;

  const handleItemPress = (item) => {
    setShowMenu(false);
    onSelect?.(item);
  };

  const renderItem = (item, index, inModal = false) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleItemPress(item)}
      style={[
        inModal ? styles.modalItem : styles.item,
        item === currentScreen && styles.activeItem,
      ]}
    >
      <Text
        style={[
          inModal ? styles.modalItemText : styles.text,
          item === currentScreen && styles.activeText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      {!isMobile ? (
        <View style={styles.sidebar}>
          {menuItems.map((item, index) => renderItem(item, index))}
        </View>
      ) : (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.dropdownButton}>
            <Feather name="menu" size={20} color="#333" />
            <Text style={styles.dropdownButtonText}>Menu</Text>
            <Feather name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>

          <Modal transparent visible={showMenu} animationType="fade">
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setShowMenu(false)}
            >
              <View style={styles.modalContent}>
                {menuItems.map((item, index) => renderItem(item, index, true))}
                <TouchableOpacity
                  onPress={() => setShowMenu(false)}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderColor: '#dee2e6',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  item: {
    paddingVertical: 10,
  },
  activeItem: {
    backgroundColor: '#e2e6ea',
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeText: {
    color: '#007bff',
  },
  dropdownContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '85%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  closeBtn: {
    marginTop: 16,
    alignSelf: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
});

export default DashboardSidebar;
