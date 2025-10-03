

// screens/SocialDashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SocialHeader from '../components/Social/SocialHeader';
import SocialBottomBar from '../components/Social/SocialBottomBar';
import CreatePostScreen from '../components/Social/CreatePostScreen';
import UserSearch from '../components/Social/UserSearch';
import Notifications from '../components/Social/Notifications';
import Messages from '../components/Social/Messages';
import HomeFeed from '../components/Social/HomeFeed';
import CommunityProfileScreen from '../components/Social/CommunityProfileScreen';


const SocialDashboard = () => {
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState('home');

  // pulled from storage (LoginScreen wrote `userId`)
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(true);

  // load user id from AsyncStorage; allow route param to override
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // highest priority: explicit nav param
        if (route?.params?.currentUserId != null) {
          if (!cancelled) {
            setCurrentUserId(Number(route.params.currentUserId) || 0);
            setLoadingUserId(false);
          }
          return;
        }

        const stored = await AsyncStorage.getItem('userId'); // ⬅️ same key you saved
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
  }, [route?.params?.currentUserId]);

  // keep selected tab in sync with navigation (e.g., navigate('SocialDashboard',{tabKey:'post-...'}) )
  useEffect(() => {
    if (route?.params?.tabKey) {
      const key = String(route.params.tabKey).split('-')[0];
      setSelectedTab(key);
    }
  }, [route?.params?.tabKey]);

  // listen to custom window event the header/bottom emit on web
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
        // Avoid wrapping the FlatList search screen with another ScrollView
        if (loadingUserId) {
          return (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <ActivityIndicator />
              <Text style={{ marginTop: 8, color: '#5B6B7B', fontWeight: '600' }}>Loading…</Text>
            </View>
          );
        }
        return (
          <View style={{ marginTop: 16, flex: 1 }}>
            <UserSearch currentUserId={currentUserId || 0} />
          </View>
        );

      case 'profile':
        return <CommunityProfileScreen />;

      case 'notification':
        return <Notifications />;
      case 'messages':
        return <Messages />;

      case 'home':
      default:
        return <HomeFeed />;
    }
  };

  return (
    <View style={styles.container}>
      <SocialHeader active={selectedTab} onTabChange={setSelectedTab} />

      {/* When search tab is active, let it render full-height (no wrapper ScrollView) */}
      {selectedTab === 'search' ? (
        <View style={[styles.content, { flex: 1 }]}>{renderBody()}</View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {renderBody()}
        </ScrollView>
      )}

      <SocialBottomBar onTabChange={setSelectedTab} currentTab={selectedTab} />
    </View>
  );
};

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
