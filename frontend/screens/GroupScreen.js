// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const screenWidth = Dimensions.get('window').width;
// const isMobile = screenWidth < 768;

// const dummyGroups = [
//   { id: '1', name: 'Family Vacation' },
//   { id: '2', name: 'Work Trip' },
//   { id: '3', name: 'Friends Reunion' },
//   { id: '4', name: 'Hiking Club' },
// ];

// const GroupScreen = () => {
//   const [activeTab, setActiveTab] = useState('create');
//   const [groupName, setGroupName] = useState('');
//   const [description, setDescription] = useState('');
//   const [members, setMembers] = useState('');

//   const navigation = useNavigation();

//   const handleCreateGroup = () => {
//     if (!groupName.trim()) return;

//     navigation.navigate('GroupDashboard', {
//       name: groupName,
//       description,
//       role: 'Admin',
//     });
//   };

//   const renderGroupList = () => (
//     <View style={styles.tabContent}>
//       <View style={styles.formContainer}>
//         <Text style={styles.sectionTitle}>View Groups</Text>
//       </View>
//       <FlatList
//         contentContainerStyle={styles.formContainer}
//         data={dummyGroups}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.groupItem}
//             onPress={() =>
//               navigation.navigate('GroupDashboard', {
//                 name: item.name,
//                 description: 'Welcome to ' + item.name,
//                 role: 'Viewer',
//               })
//             }
//           >
//             <Text style={styles.groupName}>{item.name}</Text>
//             <Text style={styles.arrow}>›</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );

//   const renderCreateForm = () => (
//     <View style={styles.tabContent}>
//       <View style={styles.formContainer}>
//         <Text style={styles.sectionTitle}>Create Group</Text>
//         <TextInput
//           placeholder="Group Name"
//           value={groupName}
//           onChangeText={setGroupName}
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Description"
//           value={description}
//           onChangeText={setDescription}
//           style={styles.input}
//         />
//         <TextInput
//           placeholder="Add Members +"
//           value={members}
//           onChangeText={setMembers}
//           style={styles.input}
//         />
//         <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
//           <Text style={styles.createButtonText}>Create</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {!isMobile && (
//         <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//       )}

//       <View style={styles.toggleWrapper}>
//         <TouchableOpacity
//           style={[styles.toggleButton, activeTab === 'create' && styles.toggleActive]}
//           onPress={() => setActiveTab('create')}
//         >
//           <Text style={activeTab === 'create' ? styles.toggleTextActive : styles.toggleText}>
//             Create Group
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.toggleButton, activeTab === 'view' && styles.toggleActive]}
//           onPress={() => setActiveTab('view')}
//         >
//           <Text style={activeTab === 'view' ? styles.toggleTextActive : styles.toggleText}>
//             View Groups
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {activeTab === 'create' ? renderCreateForm() : renderGroupList()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   backArrow: {
//     marginBottom: 10,
//   },
//   toggleWrapper: {
//     flexDirection: 'row',
//     borderRadius: 8,
//     overflow: 'hidden',
//     marginBottom: 20,
//     alignSelf: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     width: 300,
//   },
//   toggleButton: {
//     flex: 1,
//     padding: 14,
//     backgroundColor: '#f0f0f0',
//     alignItems: 'center',
//   },
//   toggleActive: {
//     backgroundColor: '#007bff',
//   },
//   toggleText: {
//     fontWeight: '600',
//     color: '#333',
//   },
//   toggleTextActive: {
//     fontWeight: '600',
//     color: '#fff',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   formContainer: {
//     width: '100%',
//     maxWidth: 500,
//     alignSelf: 'center',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   createButton: {
//     backgroundColor: '#007bff',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//     alignSelf: 'center',
//     width: 200,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   groupItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 14,
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   groupName: {
//     fontSize: 16,
//   },
//   arrow: {
//     fontSize: 20,
//     color: '#999',
//   },
// });

// export default GroupScreen;


// screens/GroupScreen.js


import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const dummyGroups = [
  { id: '1', name: 'Family Vacation' },
  { id: '2', name: 'Work Trip' },
  { id: '3', name: 'Friends Reunion' },
  { id: '4', name: 'Hiking Club' },
];

const GroupScreen = ({ inPage = false }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState('');
  const navigation = useNavigation();

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    navigation.navigate('GroupDashboard', {
      name: groupName,
      description,
      role: 'Admin',
    });
  };

  const renderGroupList = () => (
    <View style={styles.tabContent}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>View Groups</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.formContainer}
        data={dummyGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() =>
              navigation.navigate('GroupDashboard', {
                name: item.name,
                description: `Welcome to ${item.name}`,
                role: 'Viewer',
              })
            }
          >
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderCreateForm = () => (
    <View style={styles.tabContent}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Create Group</Text>
        <TextInput
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Add Members +"
          value={members}
          onChangeText={setMembers}
          style={styles.input}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, inPage && styles.containerInPage]}>
      {/* Hide the back arrow when embedded in the Dashboard */}
      {!inPage && (
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}

      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'create' && styles.toggleActive]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={activeTab === 'create' ? styles.toggleTextActive : styles.toggleText}>
            Create Group
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'view' && styles.toggleActive]}
          onPress={() => setActiveTab('view')}
        >
          <Text style={activeTab === 'view' ? styles.toggleTextActive : styles.toggleText}>
            View Groups
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'create' ? renderCreateForm() : renderGroupList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Less vertical padding when used inside TravelerDashboard
  containerInPage: {
    paddingTop: Platform.OS === 'web' ? 8 : 12,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
  backArrow: { marginBottom: 10 },
  toggleWrapper: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    width: 300,
  },
  toggleButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: '#007bff' },
  toggleText: { fontWeight: '600', color: '#333' },
  toggleTextActive: { fontWeight: '600', color: '#fff' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  formContainer: { width: '100%', maxWidth: 500, alignSelf: 'center' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    width: 200,
  },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  tabContent: { width: '100%' },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: { fontSize: 16 },
  arrow: { fontSize: 20, color: '#999' },
});

export default GroupScreen;
