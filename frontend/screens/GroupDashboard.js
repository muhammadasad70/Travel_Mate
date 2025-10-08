// // screens/Groups/GroupDashboard.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Platform, ScrollView, ActivityIndicator } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import GroupsHeader from '../components/Groups/GroupsHeader';
// import GroupsBottomBar from '../components/Groups/GroupsBottomBar';
// import MembersScreen from "../components/Groups/MembersScreen";

// // TODO: Replace these with your real group modules when ready:
// const OverviewScreen = () => (
//   <View style={styles.card}><Text style={styles.title}>Overview</Text><Text style={styles.desc}>Group activity, highlights, next steps.</Text></View>
// );
// const PlansScreen = () => (
//   <View style={styles.card}><Text style={styles.title}>Plans</Text><Text style={styles.desc}>Shared itineraries, tasks, timelines.</Text></View>
// );
// const PollsScreen = () => (
//   <View style={styles.card}><Text style={styles.title}>Polls</Text><Text style={styles.desc}>Vote on destinations, dates, activities.</Text></View>
// );
// const MembersScreen = () => (
//   <View style={styles.card}><Text style={styles.title}>Members</Text><Text style={styles.desc}>Roles, permissions, invitations.</Text></View>
// );
// const SettingsScreen = () => (
//   <View style={styles.card}><Text style={styles.title}>Settings</Text><Text style={styles.desc}>Group preferences & permissions.</Text></View>
// );
// const Notifications = () => (
//   <View style={styles.card}><Text style={styles.title}>Notifications</Text><Text style={styles.desc}>All your group notifications.</Text></View>
// );
// const Messages = () => (
//   <View style={styles.card}><Text style={styles.title}>Messages</Text><Text style={styles.desc}>Direct & group chats.</Text></View>
// );

// const GroupDashboard = () => {
//   const route = useRoute();
//   const [selectedTab, setSelectedTab] = useState('overview');

//   // Example: load current user / admin checks if needed
//   const [loadingUserId, setLoadingUserId] = useState(true);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const stored = await AsyncStorage.getItem('userId');
//         if (!cancelled) {
//           setCurrentUserId(stored ? Number(stored) : 0);
//           setLoadingUserId(false);
//         }
//       } catch {
//         if (!cancelled) {
//           setCurrentUserId(0);
//           setLoadingUserId(false);
//         }
//       }
//     })();
//     return () => { cancelled = true; };
//   }, []);

//   // keep selected tab in sync with navigation e.g., navigate('GroupDashboard',{tabKey:'polls-...'}) )
//   useEffect(() => {
//     if (route?.params?.tabKey) {
//       const key = String(route.params.tabKey).split('-')[0];
//       setSelectedTab(key);
//     }
//   }, [route?.params?.tabKey]);

//   // listen to custom window event header/bottom emit on web
//   useEffect(() => {
//     const handler = (e) => {
//       const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
//       if (key) setSelectedTab(key);
//     };
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       window.addEventListener('tabChange', handler);
//       return () => window.removeEventListener('tabChange', handler);
//     }
//   }, []);

//   const renderBody = () => {
//     switch (selectedTab) {
//       case 'plans':        return <PlansScreen />;
//       case 'polls':        return <PollsScreen />;
//       case 'members':      return <MembersScreen />;
//       case 'settings':     return <SettingsScreen />;
//       case 'notification': return <Notifications />;
//       case 'messages':     return <Messages />;
//       case 'overview':
//       default:             return <OverviewScreen />;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <GroupsHeader active={selectedTab} onTabChange={setSelectedTab} />

//       {/* Keep search-like screens unwrapped if they use VirtualizedList; these are static for now */}
//       <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
//         {loadingUserId ? (
//           <View style={{ padding: 24, alignItems: 'center' }}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 8, color: '#5B6B7B', fontWeight: '600' }}>Loading…</Text>
//           </View>
//         ) : (
//           renderBody()
//         )}
//       </ScrollView>

//       <GroupsBottomBar onTabChange={setSelectedTab} currentTab={selectedTab} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F6FAFD',
//     paddingTop: Platform.OS === 'web' ? 90 : 0, // space for fixed header on web
//   },
//   content: {
//     paddingHorizontal: 16,
//     paddingBottom: 120, // space for bottom bar on mobile
//   },
//   card: {
//     marginTop: 16,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#EAF0F6',
//     padding: 16,
//   },
//   title: { fontSize: 18, fontWeight: '800', color: '#0F3A6B', marginBottom: 6 },
//   desc:  { color: '#5B6B7B', fontWeight: '600' },
// });

// export default GroupDashboard;



// screens/Groups/GroupDashboard.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Platform, ScrollView, ActivityIndicator } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import GroupsHeader from '../components/Groups/GroupsHeader';
// import GroupsBottomBar from '../components/Groups/GroupsBottomBar';
// import MembersScreen from '../components/Groups/MembersScreen'; 

// // TODO: Replace these with your real group modules when ready:
// const OverviewScreen = () => (
//   <View style={styles.card}>
//     <Text style={styles.title}>Overview</Text>
//     <Text style={styles.desc}>Group activity, highlights, next steps.</Text>
//   </View>
// );
// const PlansScreen = () => (
//   <View style={styles.card}>
//     <Text style={styles.title}>Plans</Text>
//     <Text style={styles.desc}>Shared itineraries, tasks, timelines.</Text>
//   </View>
// );
// const PollsScreen = () => (
//   <View style={styles.card}>
//     <Text style={styles.title}>Polls</Text>
//     <Text style={styles.desc}>Vote on destinations, dates, activities.</Text>
//   </View>
// );
// const SettingsScreen = () => (
//   <View style={styles.card}>
//     <Text style={styles.title}>Settings</Text>
//     <Text style={styles.desc}>Group preferences & permissions.</Text>
//   </View>
// );
// const Notifications = () => (
//   <View style={styles.card}>
//     <Text style={styles.title}>Notifications</Text>
//     <Text style={styles.desc}>All your group notifications.</Text>
//   </View>
// );
// const Messages = () => (
//   <View style={styles.card}>
//     <Text style={styles.title}>Messages</Text>
//     <Text style={styles.desc}>Direct & group chats.</Text>
//   </View>
// );

// const GroupDashboard = () => {
//   const route = useRoute();
//   const [selectedTab, setSelectedTab] = useState('overview');

//   // Example: load current user / admin checks if needed
//   const [loadingUserId, setLoadingUserId] = useState(true);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const stored = await AsyncStorage.getItem('userId');
//         if (!cancelled) {
//           setCurrentUserId(stored ? Number(stored) : 0);
//           setLoadingUserId(false);
//         }
//       } catch {
//         if (!cancelled) {
//           setCurrentUserId(0);
//           setLoadingUserId(false);
//         }
//       }
//     })();
//     return () => { cancelled = true; };
//   }, []);

//   // keep selected tab in sync with navigation e.g., navigate('GroupDashboard',{tabKey:'polls-...'}) )
//   useEffect(() => {
//     if (route?.params?.tabKey) {
//       const key = String(route.params.tabKey).split('-')[0];
//       setSelectedTab(key);
//     }
//   }, [route?.params?.tabKey]);

//   // listen to custom window event header/bottom emit on web
//   useEffect(() => {
//     const handler = (e) => {
//       const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
//       if (key) setSelectedTab(key);
//     };
//     if (Platform.OS === 'web' && typeof window !== 'undefined') {
//       window.addEventListener('tabChange', handler);
//       return () => window.removeEventListener('tabChange', handler);
//     }
//   }, []);

//   const renderBody = () => {
//     switch (selectedTab) {
//       case 'plans':        return <PlansScreen />;
//       case 'polls':        return <PollsScreen />;
//       case 'members':      return <MembersScreen />;  // <-- now renders the real People UI
//       case 'settings':     return <SettingsScreen />;
//       case 'notification': return <Notifications />;
//       case 'messages':     return <Messages />;
//       case 'overview':
//       default:             return <OverviewScreen />;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <GroupsHeader active={selectedTab} onTabChange={setSelectedTab} />

//       {/* Keep search-like screens unwrapped if they use VirtualizedList; these are static for now */}
//       <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
//         {loadingUserId ? (
//           <View style={{ padding: 24, alignItems: 'center' }}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 8, color: '#5B6B7B', fontWeight: '600' }}>Loading…</Text>
//           </View>
//         ) : (
//           renderBody()
//         )}
//       </ScrollView>

//       <GroupsBottomBar onTabChange={setSelectedTab} currentTab={selectedTab} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F6FAFD',
//     paddingTop: Platform.OS === 'web' ? 90 : 0, // space for fixed header on web
//   },
//   content: {
//     paddingHorizontal: 16,
//     paddingBottom: 120, // space for bottom bar on mobile
//   },
//   card: {
//     marginTop: 16,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#EAF0F6',
//     padding: 16,
//   },
//   title: { fontSize: 18, fontWeight: '800', color: '#0F3A6B', marginBottom: 6 },
//   desc:  { color: '#5B6B7B', fontWeight: '600' },
// });

// export default GroupDashboard;


// screens/Groups/GroupDashboard.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GroupsHeader from '../components/Groups/GroupsHeader';
import GroupsBottomBar from '../components/Groups/GroupsBottomBar';
import MembersScreen from '../components/Groups/MembersScreen';

// Placeholder tabs — replace with real modules when ready
const OverviewScreen = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Overview</Text>
    <Text style={styles.desc}>Group activity, highlights, next steps.</Text>
  </View>
);
const PlansScreen = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Plans</Text>
    <Text style={styles.desc}>Shared itineraries, tasks, timelines.</Text>
  </View>
);
const PollsScreen = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Polls</Text>
    <Text style={styles.desc}>Vote on destinations, dates, activities.</Text>
  </View>
);
const SettingsScreen = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.desc}>Group preferences & permissions.</Text>
  </View>
);
const Notifications = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Notifications</Text>
    <Text style={styles.desc}>All your group notifications.</Text>
  </View>
);
const Messages = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Messages</Text>
    <Text style={styles.desc}>Direct & group chats.</Text>
  </View>
);

// Web querystring helper: ?groupId=123
function getQSGroupIdWeb() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const qs = new URLSearchParams(window.location.search);
  const v = qs.get('groupId');
  const n = v ? Number(v) : null;
  return Number.isFinite(n) && n > 0 ? n : null;
}

const GroupDashboard = () => {
  const route = useRoute();

  // 1) from navigation params, 2) fallback to web querystring, else 0
  const paramId = route?.params?.groupId ? Number(route.params.groupId) : null;
  const qsId = getQSGroupIdWeb();
  const initialGroupId = paramId || qsId || 0;

  const [groupId, setGroupId] = useState(initialGroupId);

  // selected tab — default overview unless a tabKey param is provided
  const [selectedTab, setSelectedTab] = useState(() => {
    const tk = route?.params?.tabKey ? String(route.params.tabKey) : '';
    return tk ? tk.split('-')[0] : 'overview';
  });

  // Example: load current user if needed
  const [loadingUserId, setLoadingUserId] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('userId');
        if (!cancelled) {
          setCurrentUserId(stored ? Number(stored) : 0);
          setLoadingUserId(false);
        }
      } catch {
        if (!cancelled) {
          setCurrentUserId(0);
          setLoadingUserId(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Keep state in sync if navigation updates groupId or tabKey later
  useEffect(() => {
    const nextId = route?.params?.groupId ? Number(route.params.groupId) : null;
    if (Number.isFinite(nextId) && nextId > 0 && nextId !== groupId) {
      setGroupId(nextId);
    }
    if (route?.params?.tabKey) {
      const key = String(route.params.tabKey).split('-')[0];
      if (key && key !== selectedTab) setSelectedTab(key);
    }
  }, [route?.params?.groupId, route?.params?.tabKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen to global tabChange events on web — only for the same groupId
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const handler = (e) => {
      const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
      const evGroupId = e?.detail?.groupId;
      if (key && (evGroupId == null || Number(evGroupId) === Number(groupId))) {
        setSelectedTab(key);
      }
    };
    window.addEventListener('tabChange', handler);
    return () => window.removeEventListener('tabChange', handler);
  }, [groupId]);

  // Make sure children also propagate/reflect tab changes
  const onTabChange = useCallback((key /*, gIdFromChild */) => {
    setSelectedTab(key);
  }, []);

  const Body = useMemo(() => {
    switch (selectedTab) {
      case 'plans':        return <PlansScreen />;
      case 'polls':        return <PollsScreen />;
      case 'members':      return <MembersScreen groupId={groupId} />;
      case 'settings':     return <SettingsScreen />;
      case 'notification': return <Notifications />;
      case 'messages':     return <Messages />;
      case 'overview':
      default:             return <OverviewScreen />;
    }
  }, [selectedTab, groupId]);

  return (
    <View style={styles.container}>
      {/* Header needs groupId so its navigation/events include the id */}
      <GroupsHeader groupId={groupId} onTabChange={onTabChange} />

      {/* Avoid wrapping VirtualizedLists in ScrollView; MembersScreen uses FlatList inside itself.
          For now our placeholder tabs are simple, so ScrollView is fine. */}
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {loadingUserId ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: '#5B6B7B', fontWeight: '600' }}>Loading…</Text>
          </View>
        ) : (
          Body
        )}
      </ScrollView>

      {/* Bottom bar also receives groupId so it emits filtered events */}
      <GroupsBottomBar groupId={groupId} onTabChange={onTabChange} currentTab={selectedTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAFD',
    paddingTop: Platform.OS === 'web' ? 90 : 0, // space for fixed header on web
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120, // space for bottom bar on mobile
  },
  card: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0F3A6B', marginBottom: 6 },
  desc:  { color: '#5B6B7B', fontWeight: '600' },
});

export default GroupDashboard;
