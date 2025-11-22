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
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import GroupsHeader from '../components/Groups/GroupsHeader';
import GroupsBottomBar from '../components/Groups/GroupsBottomBar';
import MembersScreen from '../components/Groups/MembersScreen';
import getBaseURL from '../config/env';
import api from '../api';

// OverviewScreen component
const OverviewScreen = ({ groupId }) => {
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [pollsCount, setPollsCount] = useState(0);
  const [membersCount, setMembersCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId || groupId === 0) {
      setLoading(false);
      return;
    }

    const loadOverview = async () => {
      try {
        setError(null);
        const token = await AsyncStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // Fetch group details, polls, and members in parallel
        const [groupRes, pollsRes, membersRes] = await Promise.all([
          fetch(`${getBaseURL()}/groups/${groupId}`, { headers }).catch(() => ({ ok: false })),
          fetch(`${getBaseURL()}/groups/${groupId}/polls`, { headers }).catch(() => ({ ok: false })),
          fetch(`${getBaseURL()}/groups/${groupId}/members`, { headers }).catch(() => ({ ok: false })),
        ]);

        if (groupRes.ok) {
          const group = await groupRes.json();
          setGroupData(group);
        }

        if (pollsRes.ok) {
          const pollsData = await pollsRes.json();
          // Handle both { polls: [...] } and direct array response
          const polls = Array.isArray(pollsData.polls) ? pollsData.polls : (Array.isArray(pollsData) ? pollsData : []);
          setPollsCount(polls.length);
        }

        if (membersRes.ok) {
          const membersData = await membersRes.json();
          // Members endpoint returns array directly
          const members = Array.isArray(membersData) ? membersData : (Array.isArray(membersData.members) ? membersData.members : []);
          setMembersCount(members.length);
        }
      } catch (err) {
        setError('Failed to load group overview');
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [groupId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#0F70F0" />
        <Text style={[styles.desc, { marginTop: 12, textAlign: 'center' }]}>Loading overview...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#EF4444' }]}>Error</Text>
        <Text style={styles.desc}>{error}</Text>
      </View>
    );
  }

  if (!groupData) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Overview</Text>
        <Text style={styles.desc}>Group information not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.overviewContainer}>
      {/* Group Title & Description */}
      <View style={styles.card}>
        <View style={styles.groupHeader}>
          <View style={styles.groupIcon}>
            <Text style={styles.groupIconText}>
              {groupData.name ? groupData.name.charAt(0).toUpperCase() : 'G'}
            </Text>
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupTitle}>{groupData.name || 'Untitled Group'}</Text>
            {groupData.description && (
              <Text style={styles.groupDescription}>{groupData.description}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardFirst]}>
          <View style={styles.statIcon}>
            <Text style={styles.statIconEmoji}>👥</Text>
          </View>
          <Text style={styles.statValue}>{membersCount}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Text style={styles.statIconEmoji}>📊</Text>
          </View>
          <Text style={styles.statValue}>{pollsCount}</Text>
          <Text style={styles.statLabel}>Polls</Text>
        </View>
      </View>

      {/* Group Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Group Details</Text>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {formatDate(groupData.lastActivity || groupData.createdAt)}
            </Text>
          </View>
          {groupData.id && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Group ID</Text>
              <Text style={styles.detailValue}>#{groupData.id}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Actions Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.desc}>
          • Create polls to make group decisions{'\n'}
          • Invite members to join your group{'\n'}
          • View and manage group members{'\n'}
          • Plan trips and activities together
        </Text>
      </View>
    </View>
  );
};
// Budget options
const BUDGET_OPTIONS = ['Budget-friendly', 'Mid-range', 'Luxury'];

// DateField component (similar to itinerary)
const DateField = ({ label, value, onChange, error, minimumDate }) => {
  const [show, setShow] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  const minDate = minimumDate || today;
  const minDateStr = minDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  // For web, use a simple TextInput that accepts date format
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, marginBottom: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' }}>{label}</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? '#EF4444' : '#E6EDF7',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}>
          <Ionicons name="calendar-outline" size={18} color="#0F70F0" style={{ marginRight: 8 }} />
          <TextInput
            value={value || ''}
            onChangeText={(text) => {
              // Validate date format and minimum date
              if (text && text.length === 10) {
                if (text >= minDateStr) {
                  onChange(text);
                }
              } else if (!text) {
                onChange('');
              } else {
                onChange(text);
              }
            }}
            placeholder="YYYY-MM-DD"
            style={{ flex: 1, fontSize: 14, color: value ? '#333' : '#999' }}
            keyboardType="default"
          />
        </View>
        {error && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' }}>{label}</Text>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? '#EF4444' : '#E6EDF7',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={18} color="#0F70F0" style={{ marginRight: 8 }} />
        <Text style={{ flex: 1, fontSize: 14, color: value ? '#333' : '#999' }}>
          {value || 'YYYY-MM-DD'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{error}</Text>}
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : minDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          minimumDate={minDate}
          onChange={(event, d) => {
            setShow(false);
            if (event?.type === 'dismissed') return;
            if (d) {
              // Ensure selected date is not in the past
              const selectedDate = new Date(d);
              selectedDate.setHours(0, 0, 0, 0);
              if (selectedDate >= minDate) {
                const iso = d.toISOString().split('T')[0];
                onChange(iso);
              }
            }
          }}
        />
      )}
    </View>
  );
};

// PlansScreen component
const PlansScreen = ({ groupId }) => {
  // Early return if no groupId
  if (!groupId || groupId === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: '#666', textAlign: 'center' }}>No group selected</Text>
      </View>
    );
  }

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [deletingPlanId, setDeletingPlanId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    start_date: '',
    end_date: '',
    budget: '',
  });

  // Load current user ID
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const stored = await AsyncStorage.getItem('userId');
        const userId = stored ? Number(stored) : null;
        setCurrentUserId(userId);
      } catch (err) {
        setCurrentUserId(null);
      }
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (!groupId || groupId === 0) {
      setLoading(false);
      return;
    }
    loadPlans();
  }, [groupId, loadPlans]);

  const loadPlans = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${getBaseURL()}/groups/${groupId}/plans`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const plansList = data.plans || [];
      setPlans(plansList);
    } catch (err) {
      setError(err?.message || 'Failed to load plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const loadComments = async (planId) => {
    if (comments[planId]) return; // Already loaded

    try {
      setLoadingComments((prev) => ({ ...prev, [planId]: true }));
      const token = await AsyncStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${getBaseURL()}/groups/${groupId}/plans/${planId}/comments`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setComments((prev) => ({ ...prev, [planId]: data.comments || [] }));
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments((prev) => ({ ...prev, [planId]: false }));
    }
  };

  const handleCreatePlan = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!groupId || groupId === 0) {
      setError('Invalid group ID');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const body = {
        title: formData.title,
        ...(formData.description ? { description: formData.description } : {}),
        ...(formData.destination ? { destination: formData.destination } : {}),
        ...(formData.start_date ? { start_date: formData.start_date } : {}),
        ...(formData.end_date ? { end_date: formData.end_date } : {}),
        ...(formData.budget ? { budget: formData.budget } : {}),
      };

      const url = `${getBaseURL()}/groups/${groupId}/plans`;
      console.log('[CreatePlan] Request:', { url, method: 'POST', body });

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      console.log('[CreatePlan] Response status:', res.status);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.error || data.message || `HTTP ${res.status}: ${res.statusText}`;
        console.error('[CreatePlan] Error:', errorMsg, data);
        throw new Error(errorMsg);
      }

      const result = await res.json();
      console.log('[CreatePlan] Success:', result);

      // Reset form and reload
      setFormData({
        title: '',
        description: '',
        destination: '',
        start_date: '',
        end_date: '',
        budget: '',
      });
      setShowCreateForm(false);
      await loadPlans();
    } catch (err) {
      setError(err?.message || 'Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (planId) => {
    const comment = commentText[planId]?.trim();
    if (!comment) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${getBaseURL()}/groups/${groupId}/plans/${planId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ comment }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      // Clear comment input and reload comments
      setCommentText((prev) => ({ ...prev, [planId]: '' }));
      await loadComments(planId);
      // Reload plans to update comment count
      await loadPlans();
    } catch (err) {
      setError(err?.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (planId, commentId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${getBaseURL()}/groups/${groupId}/plans/${planId}/comments/${commentId}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      // Reload comments and plans
      await loadComments(planId);
      await loadPlans();
    } catch (err) {
      setError(err?.message || 'Failed to delete comment');
    }
  };

  const handleDeletePlan = async (planId) => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this plan? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingPlanId(planId);
              setError(null);
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                const errMsg = 'Not authenticated. Please log in again.';
                setError(errMsg);
                Alert.alert('Error', errMsg);
                return;
              }

              const url = `${getBaseURL()}/groups/${groupId}/plans/${planId}`;
              const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              };

              const res = await fetch(url, {
                method: 'DELETE',
                headers,
              });

              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const errorMsg = data.error || data.message || `HTTP ${res.status}: ${res.statusText}`;
                throw new Error(errorMsg);
              }

              // Reload plans
              await loadPlans();
              setError(null);
              Alert.alert('Success', 'Plan deleted successfully');
            } catch (err) {
              const errMsg = err?.message || 'Failed to delete plan';
              console.error('[DeletePlan] Exception:', err);
              setError(errMsg);
              Alert.alert('Error', errMsg);
            } finally {
              setDeletingPlanId(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const togglePlanExpansion = (planId) => {
    if (expandedPlan === planId) {
      setExpandedPlan(null);
    } else {
      setExpandedPlan(planId);
      loadComments(planId);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ActivityIndicator size="large" color="#0F70F0" />
        <Text style={{ marginTop: 12, textAlign: 'center', color: '#666' }}>Loading plans...</Text>
      </View>
    );
  }

  // Simple error fallback
  if (error && !showCreateForm && plans.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#EF4444', marginBottom: 8 }}>Error Loading Plans</Text>
        <Text style={{ color: '#666', marginBottom: 12 }}>{error}</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#0F70F0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
          onPress={loadPlans}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
      >
        {/* Create Plan Button */}
      {!showCreateForm && (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#0F70F0', marginTop: 16 }]}
          onPress={() => setShowCreateForm(true)}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16, textAlign: 'center' }}>
            + Create New Plan
          </Text>
        </TouchableOpacity>
      )}

      {/* Create Plan Form */}
      {showCreateForm && (
        <View style={styles.card}>
          <Text style={styles.title}>Create Trip Plan</Text>
          {error && (
            <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 12 }}>
              <Text style={{ color: '#EF4444', fontWeight: '600' }}>{error}</Text>
            </View>
          )}

          <TextInput
            placeholder="Plan Title *"
            value={formData.title}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={formData.description}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          <TextInput
            placeholder="Destination"
            value={formData.destination}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, destination: text }))}
            style={styles.input}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <DateField
              label="Start Date"
              value={formData.start_date}
              onChange={(value) => {
                setFormData((prev) => {
                  // If end date is before new start date, clear it
                  const newStart = value;
                  const endDate = prev.end_date;
                  if (endDate && newStart && endDate < newStart) {
                    return { ...prev, start_date: value, end_date: '' };
                  }
                  return { ...prev, start_date: value };
                });
              }}
              minimumDate={new Date()} // Today or later
            />
            <DateField
              label="End Date"
              value={formData.end_date}
              onChange={(value) => setFormData((prev) => ({ ...prev, end_date: value }))}
              minimumDate={
                formData.start_date
                  ? new Date(formData.start_date)
                  : new Date() // Start date or today, whichever is later
              }
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' }}>Budget</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {BUDGET_OPTIONS.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[
                    {
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: formData.budget === b ? '#0F70F0' : '#E6EDF7',
                      backgroundColor: formData.budget === b ? '#E6F2FF' : '#F7F9FC',
                    },
                  ]}
                  onPress={() => setFormData((prev) => ({ ...prev, budget: b }))}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: formData.budget === b ? '600' : '500',
                      color: formData.budget === b ? '#0F70F0' : '#666',
                    }}
                  >
                    {b}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: '#E6EDF7' }]}
              onPress={() => {
                setShowCreateForm(false);
                setFormData({
                  title: '',
                  description: '',
                  destination: '',
                  start_date: '',
                  end_date: '',
                  budget: '',
                });
                setError(null);
              }}
            >
              <Text style={{ color: '#0F3A6B', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: '#0F70F0' }]}
              onPress={handleCreatePlan}
              disabled={submitting}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                {submitting ? 'Creating...' : 'Create Plan'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Error Display */}
      {error && !showCreateForm && (
        <View style={[styles.card, { backgroundColor: '#FEE2E2', marginTop: 16 }]}>
          <Text style={{ color: '#EF4444', fontWeight: '600' }}>{error}</Text>
          <TouchableOpacity
            onPress={() => setError(null)}
            style={{ marginTop: 8, alignSelf: 'flex-start' }}
          >
            <Text style={{ color: '#EF4444', textDecorationLine: 'underline' }}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Plans List */}
      {plans.length === 0 && !showCreateForm ? (
        <View style={styles.card}>
          <Text style={styles.title}>No Plans Yet</Text>
          <Text style={styles.desc}>Create the first trip plan for your group!</Text>
        </View>
      ) : (
        plans.map((plan) => (
          <View key={plan.id} style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.title}>{plan.title}</Text>
                  {(() => {
                    const isCreator = currentUserId && (plan.creator_id === currentUserId || plan.creatorId === currentUserId);
                    return isCreator ? (
                      <TouchableOpacity
                        onPress={() => handleDeletePlan(plan.id)}
                        disabled={deletingPlanId === plan.id}
                        style={{ padding: 8 }}
                      >
                        {deletingPlanId === plan.id ? (
                          <ActivityIndicator size="small" color="#EF4444" />
                        ) : (
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        )}
                      </TouchableOpacity>
                    ) : null;
                  })()}
                </View>
                {plan.description && <Text style={styles.desc}>{plan.description}</Text>}
                <View style={{ marginTop: 8, gap: 4 }}>
                  {plan.destination && (
                    <Text style={styles.meta}>📍 {plan.destination}</Text>
                  )}
                  {plan.start_date && plan.end_date && (
                    <Text style={styles.meta}>
                      📅 {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                    </Text>
                  )}
                  {plan.budget && <Text style={styles.meta}>💰 {plan.budget}</Text>}
                  <Text style={styles.meta}>
                    Created by {plan.creator_name || plan.creator_email} • {formatDate(plan.created_at)}
                  </Text>
                  <Text style={styles.meta}>
                    💬 {plan.comment_count || 0} comment{(plan.comment_count || 0) !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Comments Section */}
            <TouchableOpacity
              style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EAF0F6' }}
              onPress={() => togglePlanExpansion(plan.id)}
            >
              <Text style={{ color: '#0F70F0', fontWeight: '600' }}>
                {expandedPlan === plan.id ? '▼ Hide Comments' : '▶ Show Comments'}
              </Text>
            </TouchableOpacity>

            {expandedPlan === plan.id && (
              <View style={{ marginTop: 12 }}>
                {/* Add Comment */}
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                  <TextInput
                    placeholder="Add a comment..."
                    value={commentText[plan.id] || ''}
                    onChangeText={(text) => setCommentText((prev) => ({ ...prev, [plan.id]: text }))}
                    style={[styles.input, { flex: 1, marginTop: 0 }]}
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#0F70F0', paddingHorizontal: 16 }]}
                    onPress={() => handleAddComment(plan.id)}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Post</Text>
                  </TouchableOpacity>
                </View>

                {/* Comments List */}
                {loadingComments[plan.id] ? (
                  <ActivityIndicator size="small" color="#0F70F0" />
                ) : (
                  <View>
                    {(comments[plan.id] || []).length === 0 ? (
                      <Text style={[styles.desc, { fontStyle: 'italic' }]}>No comments yet</Text>
                    ) : (
                      (comments[plan.id] || []).map((comment) => (
                        <View
                          key={comment.id}
                          style={{
                            padding: 12,
                            backgroundColor: '#F8FAFF',
                            borderRadius: 8,
                            marginBottom: 8,
                          }}
                        >
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontWeight: '700', color: '#0F3A6B', marginBottom: 4 }}>
                                {comment.user_name || comment.user_email}
                              </Text>
                              <Text style={{ color: '#5B6B7B' }}>{comment.comment}</Text>
                              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                                {formatDate(comment.created_at)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        ))
      )}
      </ScrollView>
    </View>
  );
};

const PollsScreen = ({ groupId }) => {
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const [votingKey, setVotingKey] = useState(null);

  const loadPolls = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const res = await api.get(`/groups/${groupId}/polls`);
      const list = res.data?.polls || [];
      setPolls(list);
    } catch (err) {
      console.warn('Failed to load polls', err?.userMessage || err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const updateOption = (idx, value) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const addOption = () => {
    setOptions((prev) => [...prev, '']);
  };

  const handleCreate = async () => {
    const trimmedQuestion = question.trim();
    const cleanedOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (!trimmedQuestion || cleanedOptions.length < 2 || !groupId) return;

    setSubmitting(true);
    try {
      await api.post(`/groups/${groupId}/polls`, {
        question: trimmedQuestion,
        options: cleanedOptions,
      });
      setQuestion('');
      setOptions(['', '']);
      await loadPolls();
    } catch (err) {
      console.warn('Failed to create poll', err?.userMessage || err?.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (pollId, optionIndex, currentVote) => {
    if (!groupId) {
      console.warn('[Poll] No groupId provided');
      return;
    }
    
    // Ensure optionIndex is a number
    const idx = Number(optionIndex);
    if (isNaN(idx) || idx < 0) {
      console.error('[Poll] Invalid optionIndex:', optionIndex);
      return;
    }
    
    // Convert currentVote to number for comparison (it might be null/undefined or a number)
    const currentVoteNum = currentVote != null ? Number(currentVote) : null;
    
    if (currentVoteNum === idx) {
      console.log('[Poll] Already voted for this option, skipping');
      return; // already selected
    }
    
    console.log('[Poll] Voting:', { pollId, optionIndex: idx, currentVote: currentVoteNum });
    
    const key = `${pollId}-${idx}`;
    setVotingKey(key);
    try {
      await api.post(`/groups/${groupId}/polls/${pollId}/vote`, { optionIndex: idx });
      console.log('[Poll] Vote successful, reloading polls...');
      await loadPolls();
    } catch (err) {
      console.error('[Poll] Failed to vote:', err?.userMessage || err?.message);
      Alert.alert('Error', err?.userMessage || err?.message || 'Failed to vote on poll');
    } finally {
      setVotingKey(null);
    }
  };

  const renderPoll = (poll) => {
    const counts = poll.counts || [];
    const totalVotes = counts.reduce((sum, v) => sum + v, 0);

    return (
      <View key={poll.id} style={[styles.card, { marginTop: 16 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Text style={[styles.title, { flex: 1 }]}>{poll.question}</Text>
          {poll.creatorName && (
            <Text style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginLeft: 8 }}>
              by {poll.creatorName}
            </Text>
          )}
        </View>
        {poll.options.map((opt, idx) => {
          // Ensure idx is a number and counts array is properly indexed
          const optionIndex = Number(idx);
          const count = Array.isArray(counts) && counts[optionIndex] !== undefined ? counts[optionIndex] : 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          
          // Convert userVote to number for comparison (handle null/undefined)
          const userVoteNum = poll.userVote != null ? Number(poll.userVote) : null;
          const isSelected = userVoteNum === optionIndex;
          const isVoting = votingKey === `${poll.id}-${optionIndex}`;
          
          return (
            <TouchableOpacity
              key={`${poll.id}-${optionIndex}`}
              style={[
                styles.pollOption,
                isSelected && styles.pollOptionSelected,
                isVoting && { opacity: 0.6 },
              ]}
              onPress={() => handleVote(poll.id, optionIndex, poll.userVote)}
              disabled={isVoting}
            >
              <Text style={{ fontWeight: '600', color: '#0F3A6B' }}>{opt}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ color: '#5B6B7B' }}>
                  {count} vote{count === 1 ? '' : 's'} {totalVotes > 0 ? `(${pct}%)` : ''}
                </Text>
                {isSelected && <Text style={{ color: '#2563EB', fontWeight: '600' }}>Your vote</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>Create Poll</Text>
        <TextInput
          placeholder="Poll question"
          value={question}
          onChangeText={setQuestion}
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: '#FFFFFF',
          }}
        />
        {options.map((opt, idx) => (
          <TextInput
            key={idx}
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChangeText={(val) => updateOption(idx, val)}
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginBottom: 6,
              backgroundColor: '#FFFFFF',
            }}
          />
        ))}
        <TouchableOpacity
          onPress={addOption}
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: '#BFDBFE',
            backgroundColor: '#EFF6FF',
            marginTop: 4,
          }}
        >
          <Text style={{ color: '#1D4ED8', fontWeight: '600' }}>+ Add option</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCreate}
          disabled={submitting}
          style={{
            marginTop: 10,
            alignSelf: 'flex-end',
            backgroundColor: submitting ? '#9CA3AF' : '#2563EB',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
            {submitting ? 'Creating…' : 'Create Poll'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      )}

      {polls.map(renderPoll)}

      {!loading && polls.length === 0 && (
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.title}>No polls yet</Text>
          <Text style={styles.desc}>Create the first poll to start planning together.</Text>
        </View>
      )}
    </View>
  );
};
const SettingsScreen = ({ groupId }) => {
  const [auth, setAuth] = useState({ token: null, userId: null });
  const [groupName, setGroupName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'member'
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const [[, token], [, userId]] = await AsyncStorage.multiGet(["token", "user_id"]);
      setAuth({ token: token || null, userId: userId ? parseInt(userId, 10) : null });
    })();
  }, []);

  const loadGroup = useCallback(async () => {
    if (!groupId || !auth.token) {
      if (!groupId) {
        setError('No group selected');
      } else if (!auth.token) {
        setError('Not authenticated. Please log in again.');
      }
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Load group details
      const groupRes = await fetch(`${getBaseURL()}/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (groupRes.ok) {
        const groupData = await groupRes.json();
        setGroupName(groupData.name || '');
        setNewGroupName(groupData.name || '');
      } else {
        const errorData = await groupRes.json().catch(() => ({}));
        setError(errorData.error || 'Failed to load group details');
      }
      
      // Load user's role from group members (optional - only if userId is available)
      if (auth.userId) {
        try {
          const membersRes = await fetch(`${getBaseURL()}/groups/${groupId}/members`, {
            headers: { Authorization: `Bearer ${auth.token}` }
          });
          if (membersRes.ok) {
            const membersData = await membersRes.json();
            const members = membersData.data || membersData.membersArray || [];
            const currentUser = members.find(m => 
              m.userId === auth.userId || 
              m.user_id === auth.userId ||
              (m.UserID && m.UserID === auth.userId)
            );
            if (currentUser) {
              setUserRole(currentUser.role || 'member');
            } else {
              setUserRole(null);
            }
          }
        } catch (memberErr) {
          console.error('[SettingsScreen] Failed to load user role:', memberErr);
          // Don't fail the entire load if role loading fails
        }
      }
    } catch (err) {
      console.error('[SettingsScreen] Failed to load group:', err);
      setError(err.message || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [groupId, auth.token, auth.userId]);

  useEffect(() => {
    if (auth.token) {
      loadGroup();
    }
  }, [loadGroup, auth.token]);

  const handleUpdateName = async () => {
    if (!newGroupName.trim() || newGroupName.trim() === groupName) {
      setIsEditing(false);
      return;
    }

    if (newGroupName.trim().length < 4) {
      Alert.alert('Error', 'Group name must be at least 4 characters');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      const res = await fetch(`${getBaseURL()}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ name: newGroupName.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        setGroupName(data.group?.name || newGroupName.trim());
        setNewGroupName(data.group?.name || newGroupName.trim());
        setIsEditing(false);
        Alert.alert('Success', 'Group name updated successfully');
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update group name');
      }
    } catch (err) {
      console.error('[SettingsScreen] Failed to update group name:', err);
      setError(err.message || 'Failed to update group name');
      Alert.alert('Error', err.message || 'Failed to update group name');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteGroup = () => {
    // Check if user is admin before allowing delete
    if (userRole !== 'admin') {
      const message = 'Only admins can delete the group.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Permission Required', message);
      }
      return;
    }
    
    const confirmMessage = 'Are you sure you want to delete this group? This action cannot be undone and all group data will be permanently deleted.';
    
    const performDelete = async () => {
      try {
        setDeleting(true);
        setError(null);
        
        if (!auth.token) {
          throw new Error('Not authenticated. Please log in again.');
        }
        
        if (!groupId) {
          throw new Error('No group selected');
        }
        
        console.log('[SettingsScreen] Deleting group:', groupId);
        const url = `${getBaseURL()}/groups/${groupId}`;
        console.log('[SettingsScreen] DELETE URL:', url);
        
        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`
          }
        });

        console.log('[SettingsScreen] Delete response status:', res.status, res.statusText);

        if (res.ok) {
          const responseData = await res.json().catch(() => ({}));
          console.log('[SettingsScreen] Group deleted successfully:', responseData);
          
          // Show success message
          if (Platform.OS === 'web') {
            window.alert('Group deleted successfully');
            navigation.navigate('GroupsHome');
          } else {
            Alert.alert('Success', 'Group deleted successfully', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('GroupsHome');
                }
              }
            ]);
          }
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error('[SettingsScreen] Delete failed:', res.status, errorData);
          const errorMsg = errorData.error || errorData.message || `HTTP ${res.status}: Failed to delete group`;
          throw new Error(errorMsg);
        }
      } catch (err) {
        console.error('[SettingsScreen] Failed to delete group:', err);
        const errorMsg = err.message || 'Failed to delete group';
        setError(errorMsg);
        
        // Show error message
        if (Platform.OS === 'web') {
          window.alert(`Error: ${errorMsg}`);
        } else {
          Alert.alert('Error', errorMsg);
        }
      } finally {
        setDeleting(false);
      }
    };

    // Platform-specific confirmation
    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Group',
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  if (!groupId) {
    return (
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#EF4444' }]}>Error</Text>
        <Text style={styles.desc}>No group selected. Please select a group to view settings.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#0F70F0" />
        <Text style={[styles.desc, { marginTop: 12, textAlign: 'center' }]}>Loading settings...</Text>
      </View>
    );
  }

  if (error && !isEditing) {
    return (
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#EF4444' }]}>Error</Text>
        <Text style={styles.desc}>{error}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#0F70F0', marginTop: 12 }]}
          onPress={loadGroup}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Group Settings</Text>
      
      {/* Update Group Name Section */}
      <View style={{ marginTop: 24 }}>
        <Text style={[styles.desc, { fontWeight: '600', marginBottom: 8 }]}>Group Name</Text>
        {isEditing ? (
          <View>
            <TextInput
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="Enter group name"
              style={[styles.input, { marginBottom: 12 }]}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#10B981', flex: 1 }]}
                onPress={handleUpdateName}
                disabled={updating}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                  {updating ? 'Updating...' : 'Save'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#6B7280', flex: 1 }]}
                onPress={() => {
                  setNewGroupName(groupName);
                  setIsEditing(false);
                }}
                disabled={updating}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[styles.desc, { fontSize: 16 }]}>{groupName}</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#0F70F0', paddingHorizontal: 16, paddingVertical: 8 }]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Delete Group Section */}
      <View style={{ marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <Text style={[styles.desc, { fontWeight: '600', marginBottom: 8, color: '#EF4444' }]}>Danger Zone</Text>
        <Text style={[styles.desc, { fontSize: 14, marginBottom: 16 }]}>
          Once you delete a group, there is no going back. Please be certain.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#EF4444' }]}
          onPress={handleDeleteGroup}
          disabled={deleting}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
            {deleting ? 'Deleting...' : 'Delete Group'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Notifications = ({ groupId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useState({ token: null, userId: null });
  
  console.log("[Notifications] Component mounted with groupId:", groupId);

  useEffect(() => {
    (async () => {
      const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
      setAuth({ token: token || null, userId: uid ? Number(uid) : null });
    })();
  }, []);

  const authHeaders = useMemo(() => 
    auth.token ? { Authorization: `Bearer ${auth.token}` } : {}, 
    [auth.token]
  );

  const loadNotifications = useCallback(async () => {
    if (!auth.token || !groupId) {
      console.log("[Notifications] Waiting for auth token or groupId...");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      // Use the new group-specific notifications endpoint
      const url = `${getBaseURL()}/groups/${groupId}/notifications?limit=100`;
      console.log("[Notifications] Fetching group notifications from:", url);
      const res = await fetch(url, { headers: authHeaders });
      
      console.log("[Notifications] Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[Notifications] Error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      console.log("[Notifications] Received group notifications:", data);
      console.log("[Notifications] Data type:", Array.isArray(data) ? "array" : typeof data);
      console.log("[Notifications] Data length:", Array.isArray(data) ? data.length : "N/A");
      
      // Handle both array and object with notifications property
      const groupNotifications = Array.isArray(data) ? data : (data?.notifications || []);
      console.log("[Notifications] Group notifications count:", groupNotifications.length);
      
      setNotifications(groupNotifications);
    } catch (e) {
      console.error("[Notifications] Error:", e);
      setError(e?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [auth.token, authHeaders, groupId]);

  useEffect(() => {
    loadNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      const url = `${getBaseURL()}/notifications/${notificationId}/read`;
      await fetch(url, {
        method: "PATCH",
        headers: authHeaders,
      });
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      
      // Trigger badge refresh event for group notifications
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new CustomEvent('notificationRead', { detail: { groupId } }));
        } catch (err) {
          console.error('[Notifications] Failed to dispatch notificationRead event:', err);
        }
      }
      
      // Also refresh the badge count by triggering a reload after a short delay
      setTimeout(() => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          try {
            window.dispatchEvent(new CustomEvent('refreshNotificationBadge', { detail: { groupId } }));
          } catch (err) {}
        }
      }, 500);
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    if (type?.includes("poll")) return "stats-chart-outline";
    if (type?.includes("member") || type?.includes("join")) return "person-add-outline";
    if (type?.includes("request")) return "mail-outline";
    return "notifications-outline";
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#0F70F0" />
        <Text style={[styles.desc, { marginTop: 12, textAlign: "center" }]}>Loading notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={[styles.title, { color: "#EF4444" }]}>Error</Text>
        <Text style={styles.desc}>{error}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#0F70F0", marginTop: 12 }]}
          onPress={loadNotifications}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600", textAlign: "center" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (notifications.length === 0 && !loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.desc}>
          {error 
            ? `Error: ${error}` 
            : "No notifications yet. You'll see updates about group activity here (member joined, poll created, poll voted, etc.)."}
        </Text>
        {error && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#0F70F0", marginTop: 12 }]}
            onPress={loadNotifications}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600", textAlign: "center" }}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.card,
              {
                marginTop: 16,
                opacity: notification.is_read ? 0.7 : 1,
                borderLeftWidth: notification.is_read ? 0 : 4,
                borderLeftColor: "#0F70F0",
              },
            ]}
            onPress={() => !notification.is_read && markAsRead(notification.id)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E7F0FF",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  size={20}
                  color="#0F70F0"
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.title, { fontSize: 16, marginBottom: 4 }]}>
                  {notification.title}
                </Text>
                <Text style={[styles.desc, { marginBottom: 8 }]}>{notification.message}</Text>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  {formatDate(notification.created_at)}
                </Text>
              </View>
              {!notification.is_read && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#0F70F0",
                    marginLeft: 8,
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
// ChatScreen component with member search
const ChatScreen = ({ groupId }) => {
  const [auth, setAuth] = useState({ token: null, userId: null });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    (async () => {
      const [[, token], [, uid]] = await AsyncStorage.multiGet(["token", "userId"]);
      setAuth({ token: token || null, userId: uid ? Number(uid) : null });
    })();
  }, []);

  const authHeaders = useMemo(() => 
    auth.token ? { Authorization: `Bearer ${auth.token}` } : {}, 
    [auth.token]
  );

  // Load group members
  const loadMembers = useCallback(async () => {
    if (!groupId || !auth.token) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${getBaseURL()}/groups/${groupId}/members`, {
        headers: authHeaders
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      console.log('[ChatScreen] Raw API response:', data);
      
      // Handle both { members: [...] } and direct array response
      const membersArray = Array.isArray(data) ? data : (data?.members || []);
      console.log('[ChatScreen] Extracted members array:', membersArray.length, membersArray);
      
      // Map members to consistent structure (same as MembersScreen)
      const mappedMembers = membersArray.map((r) => {
        // Handle multiple possible field names from API (backend uses snake_case: first_name, last_name)
        const userId = Number(r.userId ?? r.user_id ?? r.userid ?? r.id ?? 0);
        const firstName = (r.first_name || r.firstName || "").trim();
        const lastName = (r.last_name || r.lastName || "").trim();
        const email = (r.email || "").trim();
        
        const member = {
          userId,
          first_name: firstName,
          last_name: lastName,
          email,
          role: r.role || "member",
        };
        console.log('[ChatScreen] Mapped member:', member);
        return member;
      });
      
      console.log('[ChatScreen] Total mapped members:', mappedMembers.length);
      
      // Filter out current user
      const otherMembers = mappedMembers.filter(m => {
        const isOther = Number(m.userId) !== Number(auth.userId);
        if (!isOther) {
          console.log('[ChatScreen] Filtered out current user:', m);
        }
        return isOther;
      });
      console.log('[ChatScreen] Other members (after filtering current user):', otherMembers.length, otherMembers);
      setMembers(otherMembers);
    } catch (err) {
      console.error('[ChatScreen] Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  }, [groupId, auth.token, authHeaders, auth.userId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Filter members by search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = members.filter(m => {
      // Build full name from first and last name
      const fullName = `${(m.first_name || '').trim()} ${(m.last_name || '').trim()}`.trim().toLowerCase();
      const firstName = (m.first_name || '').trim().toLowerCase();
      const lastName = (m.last_name || '').trim().toLowerCase();
      const email = (m.email || '').trim().toLowerCase();
      
      // Check if query matches any part of name or email
      return fullName.includes(query) || 
             firstName.includes(query) || 
             lastName.includes(query) || 
             email.includes(query);
    });
    
    console.log('[ChatScreen] Search query:', query, 'Results:', filtered.length, filtered);
    return filtered;
  }, [members, searchQuery]);

  // Ensure direct conversation exists and open it
  const openConversation = useCallback(async (member) => {
    if (!auth.userId || !auth.token) return;
    
    try {
      // Ensure direct conversation exists
      const res = await fetch(`${getBaseURL()}/follows/ensure-direct`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_id: auth.userId,
          following_id: member.userId
        })
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      const conversation = data.conversation;
      
      if (conversation) {
        setSelectedConversation(conversation);
        setSelectedMember(member);
      }
    } catch (err) {
      console.error('[ChatScreen] Failed to open conversation:', err);
      Alert.alert('Error', 'Failed to start conversation. Please try again.');
    }
  }, [auth.userId, auth.token, authHeaders]);

  // If conversation is selected, show chat window
  if (selectedConversation) {
    return (
      <ChatWindow
        auth={auth}
        headers={authHeaders}
        conversation={selectedConversation}
        memberName={selectedMember ? `${selectedMember.first_name || ''} ${selectedMember.last_name || ''}`.trim() || selectedMember.email : 'Member'}
        onBack={() => {
          setSelectedConversation(null);
          setSelectedMember(null);
        }}
        onMessageSent={() => {
          // Optionally refresh conversations list
        }}
      />
    );
  }

  // Show member list with search
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Group Chat</Text>
      <Text style={styles.desc}>Search and message group members</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#5B6B7B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members by name or email..."
          placeholderTextColor="#8CA0B3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#5B6B7B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Members List */}
      {loading ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0F70F0" />
          <Text style={{ marginTop: 12, color: '#5B6B7B' }}>Loading members...</Text>
        </View>
      ) : filteredMembers.length === 0 ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Ionicons name="people-outline" size={48} color="#C4D1E0" />
          <Text style={{ marginTop: 12, color: '#5B6B7B', textAlign: 'center' }}>
            {searchQuery ? 'No members found matching your search' : 'No members to chat with'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => String(item.userId)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.memberItem}
              onPress={() => openConversation(item)}
              activeOpacity={0.7}
            >
              <View style={styles.memberAvatar}>
                <Text style={styles.memberAvatarText}>
                  {(item.first_name?.[0] || item.email?.[0] || '?').toUpperCase()}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>
                  {`${item.first_name || ''} ${item.last_name || ''}`.trim() || item.email || 'Unknown'}
                </Text>
                <Text style={styles.memberEmail} numberOfLines={1}>
                  {item.email}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C4D1E0" />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

// ChatWindow component for displaying messages
const ChatWindow = ({ auth, headers, conversation, memberName, onBack, onMessageSent }) => {
  const listRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const convId = conversation?.id;

  const load = useCallback(async () => {
    if (!convId || !auth.token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${getBaseURL()}/conversations/${convId}/messages`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data?.messages || [];
      rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setMessages(rows);

      // Mark unread messages as read
      const myId = Number(auth.userId);
      rows.forEach(async (m) => {
        if (m.sender_id !== myId && !m.read_at && m.id) {
          try {
            await fetch(`${getBaseURL()}/messages/${m.id}/read`, { method: "POST", headers });
          } catch {}
        }
      });

      requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));
    } catch (e) {
      setErr(e?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [convId, headers, auth.userId, auth.token]);

  useEffect(() => {
    load();
  }, [load]);

  const send = async () => {
    const body = (text || "").trim();
    if (!body || sending || !convId || !auth.token) return;
    setSending(true);

    // Optimistic update
    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      sender_id: Number(auth.userId),
      content: body,
      message_type: "text",
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setText("");
    requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));

    try {
      const res = await fetch(`${getBaseURL()}/conversations/${convId}/messages`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ content: body, message_type: "text" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      setMessages((m) => m.map((x) => (x.id === tempId ? saved : x)));
      onMessageSent?.();
    } catch {
      setMessages((m) => m.filter((x) => x.id !== tempId));
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (Platform.OS === "web") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    }
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <View style={styles.chatContainer}>
      {/* Header */}
      <View style={styles.chatHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#0F3A6B" />
          </TouchableOpacity>
        )}
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>
            {(memberName?.[0] || '?').toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {memberName || 'Member'}
          </Text>
          <Text style={styles.chatMeta} numberOfLines={1}>
            Direct message
          </Text>
        </View>
      </View>

      {/* Message List */}
      <View style={styles.chatBody}>
        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator />
            <Text style={styles.meta}>Loading messages...</Text>
          </View>
        ) : err ? (
          <View style={styles.centerWrap}>
            <Text style={[styles.meta, { color: '#E53E3E' }]}>{err}</Text>
            <TouchableOpacity onPress={load} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.centerWrap}>
            <Text style={styles.meta}>No messages — say hello 👋</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m, i) => String(m.id ?? i)}
            renderItem={({ item }) => {
              const isMe = Number(item.sender_id) === Number(auth.userId);
              return (
                <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
                  <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
                    {item.content || ''}
                  </Text>
                  <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeOther]}>
                    {formatTime(item.created_at)}
                  </Text>
                </View>
              );
            }}
            contentContainerStyle={{ padding: 14 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: true })}
          />
        )}
      </View>

      {/* Composer */}
      <View style={styles.composer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Type a message..."
          placeholderTextColor="#8CA0B3"
          value={text}
          onChangeText={setText}
          onKeyDown={onKeyDown}
          multiline
        />
        <TouchableOpacity
          onPress={send}
          disabled={!text.trim() || sending}
          activeOpacity={0.9}
          style={[styles.sendBtn, (!text.trim() || sending) && { opacity: 0.6 }]}
        >
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Messages = ({ groupId }) => <ChatScreen groupId={groupId} />;

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
      case 'polls':        return <PollsScreen groupId={groupId} />;
      case 'members':      return <MembersScreen groupId={groupId} />;
      case 'settings':     return <SettingsScreen groupId={groupId} />;
      case 'notification': return <Notifications groupId={groupId} />;
      case 'messages':     return <Messages groupId={groupId} />;
      case 'overview':
      default:             return <OverviewScreen groupId={groupId} />;
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
  // OverviewScreen styles
  overviewContainer: {
    paddingBottom: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F70F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupIconText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  groupInfo: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F3A6B',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: '#5B6B7B',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    padding: 16,
    alignItems: 'center',
  },
  statCardFirst: {
    marginLeft: 0,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F3A6B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#5B6B7B',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F3A6B',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#5B6B7B',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#0F3A6B',
    fontWeight: '700',
  },
  pollOption: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    backgroundColor: '#F8FAFF',
  },
  pollOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF2FF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAF0F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    fontSize: 13,
    color: '#5B6B7B',
    marginTop: 2,
  },
  // ChatScreen styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAF0F6',
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F3A6B',
  },
  clearButton: {
    padding: 4,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EAF0F6',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F70F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
    minWidth: 0,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F3A6B',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 13,
    color: '#5B6B7B',
  },
  // ChatWindow styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAF0F6',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F3A6B',
  },
  chatMeta: {
    fontSize: 12,
    color: '#5B6B7B',
    marginTop: 2,
  },
  chatBody: {
    flex: 1,
    backgroundColor: '#F6FAFD',
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  retryBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#0F70F0',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 14,
  },
  messageBubbleMe: {
    backgroundColor: '#0F70F0',
    alignSelf: 'flex-end',
  },
  messageBubbleOther: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#EAF0F6',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: '#0F3A6B',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  messageTimeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageTimeOther: {
    color: '#8CA0B3',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 60,
    borderTopWidth: 1,
    borderTopColor: '#EAF0F6',
    backgroundColor: '#FFFFFF',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#EAF0F6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0F3A6B',
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#0F70F0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default GroupDashboard;
