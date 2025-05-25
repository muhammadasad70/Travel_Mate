// components/CommonHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CommonHeader = ({ title = "TravelMate" }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {navigation.canGoBack() && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('TravelerDashboard')}>
        <Text style={styles.link}>🏠 Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1e1e1e',
  },
  back: {
    fontSize: 20,
    color: '#007aff',
  },
  link: {
    fontSize: 16,
    color: '#007aff',
  },
});

export default CommonHeader;
