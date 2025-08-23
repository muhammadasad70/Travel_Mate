import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MessagesScreen = ({ inPage }) => {
  const content = (
    <View style={[styles.inner, inPage && styles.innerInPage]}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.subtitle}>
        This is the Messages screen. Here you’ll show chat threads, inbox, or notifications.
      </Text>
    </View>
  );

  if (inPage) {
    // Embedded inside TravelerDashboard scroll
    return <View style={styles.inPageWrapper}>{content}</View>;
  }

  // Standalone screen mode
  return <ScrollView contentContainerStyle={styles.container}>{content}</ScrollView>;
};

export default MessagesScreen;

const styles = StyleSheet.create({
  // Standalone (full screen)
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  // In‑page wrapper so it flows with dashboard sections
  inPageWrapper: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 12,
  },

  // Card-like inner container
  inner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  innerInPage: {
    alignItems: 'flex-start',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
  },
});
