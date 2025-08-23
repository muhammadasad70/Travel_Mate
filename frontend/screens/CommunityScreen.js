import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CommunityScreen = ({ inPage }) => {
  const content = (
    <View style={[styles.inner, inPage && styles.innerInPage]}>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.subtitle}>
        This is the Community screen. Here you’ll show forums, groups, or discussions.
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

export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  inPageWrapper: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 12,
  },
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
