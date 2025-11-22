import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from '../../config/env';

const API = getBaseURL();

const COLORS = {
  text: '#0F3A6B',
  sub: '#5B6B7B',
  page: '#F7F9FC',
  card: '#FFFFFF',
  border: '#E6EDF7',
  soft: '#F1F5FE',
  primary: '#0F70F0',
  success: '#10B981',
  danger: '#EF4444',
};

export default function InvitationsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [invites, setInvites] = useState([]);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useState({ token: null });

  useEffect(() => {
    (async () => {
      const [[, token]] = await AsyncStorage.multiGet(['token']);
      setAuth({ token: token || null });
    })();
  }, []);

  const authHeaders = useMemo(() => {
    const h = { 'Content-Type': 'application/json' };
    if (auth.token) h.Authorization = `Bearer ${auth.token}`;
    return h;
  }, [auth.token]);

  const loadInvites = async () => {
    try {
      setError(null);
      const res = await fetch(`${API}/groups/invites/mine`, {
        method: 'GET',
        headers: authHeaders,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setInvites(data.invites || []);
    } catch (err) {
      setError(err?.message || 'Failed to load invitations');
      setInvites([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadInvites();
    }
  }, [auth.token]);

  const onRefresh = () => {
    setRefreshing(true);
    loadInvites();
  };

  const handleAccept = async (inviteId, groupId) => {
    try {
      const res = await fetch(`${API}/groups/invites/${inviteId}/accept`, {
        method: 'POST',
        headers: authHeaders,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      Alert.alert('Success', 'You have joined the group!', [
        {
          text: 'OK',
          onPress: () => {
            loadInvites();
            // Navigate to the group dashboard
            navigation.navigate('GroupDashboard', {
              groupId: groupId,
            });
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to accept invitation');
    }
  };

  const handleDecline = async (inviteId) => {
    Alert.alert(
      'Decline Invitation',
      'Are you sure you want to decline this invitation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API}/groups/invites/${inviteId}/decline`, {
                method: 'POST',
                headers: authHeaders,
              });

              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${res.status}`);
              }

              Alert.alert('Success', 'Invitation declined');
              loadInvites();
            } catch (err) {
              Alert.alert('Error', err?.message || 'Failed to decline invitation');
            }
          },
        },
      ]
    );
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    } catch {
      return iso;
    }
  };

  const renderInvite = ({ item }) => (
    <View style={styles.inviteCard}>
      <View style={styles.inviteHeader}>
        <View style={styles.groupIcon}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.inviteInfo}>
          <Text style={styles.groupName}>{item.group_name}</Text>
          <Text style={styles.inviteDate}>Invited on {formatDate(item.created_at)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAccept(item.id, item.group_id)}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => handleDecline(item.id)}
        >
          <Ionicons name="close-circle" size={20} color="#FFFFFF" />
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading invitations...</Text>
      </View>
    );
  }

  if (error && invites.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.sub} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInvites}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (invites.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="mail-outline" size={64} color={COLORS.border} />
        <Text style={styles.emptyTitle}>No Invitations</Text>
        <Text style={styles.emptyText}>You don't have any pending group invitations</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Group Invitations</Text>
        <Text style={styles.subtitle}>{invites.length} pending invitation{invites.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList
        data={invites}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderInvite}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.page,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.sub,
  },
  listContent: {
    padding: 16,
  },
  inviteCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.soft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inviteInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  inviteDate: {
    fontSize: 12,
    color: COLORS.sub,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: COLORS.success,
  },
  declineButton: {
    backgroundColor: COLORS.danger,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  declineButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.sub,
    fontSize: 14,
  },
  errorText: {
    marginTop: 12,
    color: COLORS.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.sub,
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.soft,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  refreshButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});


