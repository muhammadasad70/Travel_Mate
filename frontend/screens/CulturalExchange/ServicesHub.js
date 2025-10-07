
// screens/vendor/CulturalServicesHub.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddCulturalServiceForm from './AddCulturalServiceForm';
import ManageCulturalServices from './ManageCulturalServices';

export default function CulturalServicesHub() {
  const [mode, setMode] = useState('hub'); // ✅ JS only

  if (mode === 'add') {
    return <AddCulturalServiceForm onDone={() => setMode('manage')} onBack={() => setMode('hub')} />;
  }
  if (mode === 'manage') {
    return <ManageCulturalServices onBack={() => setMode('hub')} onAdd={() => setMode('add')} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cultural Exchange — Services</Text>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.tile} onPress={() => setMode('add')} activeOpacity={0.9}>
          <Ionicons name="add-circle" size={28} />
          <Text style={styles.tileTitle}>Add Service</Text>
          <Text style={styles.tileSub}>Create a new cultural experience.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tile} onPress={() => setMode('manage')} activeOpacity={0.9}>
          <Ionicons name="albums-outline" size={28} />
          <Text style={styles.tileTitle}>Manage My Services</Text>
          <Text style={styles.tileSub}>View, edit, or delete your listings.</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 88 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 12, paddingBottom: 88 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  grid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  tile: {
    flexGrow: 1, minWidth: 240, flexBasis: '48%',
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 6px 20px rgba(15,23,42,.08)' }
      : { elevation: 2 }),
  },
  tileTitle: { marginTop: 8, fontWeight: '800', color: '#0f172a' },
  tileSub: { color: '#475569', marginTop: 4 },
});
