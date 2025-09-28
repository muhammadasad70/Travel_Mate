// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Platform } from 'react-native';
// import SocialHeader from '../components/Social/SocialHeader';
// import SocialBottomBar from '../components/Social/SocialBottomBar';
// import CreatePostScreen from '../screens/social/CreatePostScreen';

// const SocialDashboard = () => {
//   const [selectedTab, setSelectedTab] = useState('home');

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <SocialHeader active={selectedTab} onTabChange={setSelectedTab} />

//       {/* Dummy center just to see space */}
//       <View style={styles.dummy}>
//         <Text style={styles.text}>Selected Tab: {selectedTab}</Text>
//       </View>

//       {/* Bottom bar (mobile only) */}
//       <SocialBottomBar onTabChange={setSelectedTab} currentTab={selectedTab} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f9fc',
//     paddingTop: Platform.OS === 'web' ? 90 : 0,
//   },
//   dummy: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: { fontSize: 18, fontWeight: '600', color: '#003366' },
// });

// export default SocialDashboard;


// screens/SocialDashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

import SocialHeader from '../components/Social/SocialHeader';
import SocialBottomBar from '../components/Social/SocialBottomBar';
import CreatePostScreen from '../components/Social/CreatePostScreen';

const SocialDashboard = () => {
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState('home');

  /* Keep selected tab in sync with navigation (e.g., navigate('SocialDashboard',{tabKey:'post-...'}) ) */
  useEffect(() => {
    if (route?.params?.tabKey) {
      const key = String(route.params.tabKey).split('-')[0];
      setSelectedTab(key);
    }
  }, [route?.params?.tabKey]);

  /* Also listen to the custom window event the header/bottom emit on web */
  useEffect(() => {
    const handler = (e) => {
      const key = e?.detail?.tabKey && String(e.detail.tabKey).split('-')[0];
      if (key) setSelectedTab(key);
    };
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('tabChange', handler);
      return () => window.removeEventListener('tabChange', handler);
    }
  }, []);

  const renderBody = () => {
    switch (selectedTab) {
      case 'post':
        return <CreatePostScreen onSubmit={(type) => console.log('Submit', type)} />;

      case 'search':
        return (
          <Placeholder title="Search" desc="Search people, itineraries, events…" />
        );

      case 'profile':
        return (
          <Placeholder title="Profile" desc="Your posts, followers, and saved items." />
        );

      case 'notification':
        return (
          <Placeholder title="Notifications" desc="Mentions, likes, and alerts." />
        );

      case 'messages':
        return (
          <Placeholder title="Messages" desc="Your chats will appear here." />
        );

      case 'home':
      default:
        return (
          <Placeholder title="Home Feed" desc="Posts from people you follow will appear here." />
        );
    }
  };

  return (
    <View style={styles.container}>
      <SocialHeader active={selectedTab} onTabChange={setSelectedTab} />

      {/* Scrollable content area; header is fixed on web so add top padding via container */}
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {renderBody()}
      </ScrollView>

      <SocialBottomBar onTabChange={setSelectedTab} currentTab={selectedTab} />
    </View>
  );
};

/* Slim, pleasant placeholder to prove inline rendering works */
const Placeholder = ({ title, desc }) => (
  <View style={styles.placeholder}>
    <Text style={styles.phTitle}>{title}</Text>
    <Text style={styles.phDesc}>{desc}</Text>
  </View>
);

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

  placeholder: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    padding: 16,
  },
  phTitle: { fontSize: 18, fontWeight: '800', color: '#0F3A6B', marginBottom: 6 },
  phDesc: { color: '#5B6B7B', fontWeight: '600' },
});

export default SocialDashboard;
