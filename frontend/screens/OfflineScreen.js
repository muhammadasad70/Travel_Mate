// screens/OfflineScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OfflineScreen = ({ inPage }) => {
  return (
    <View style={[styles.container, inPage && { paddingTop: 0 }]}>
      <Text style={styles.title}>Offline</Text>
      <Text style={styles.subtitle}>
        Save maps, itineraries, and key info for low‑connectivity areas. (Placeholder UI)
      </Text>
    </View>
  );
};

export default OfflineScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
});
