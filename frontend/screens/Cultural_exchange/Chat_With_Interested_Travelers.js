import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Chat_With_Interested_Travelers = () => {
  const navigation = useNavigation();

  const dummyChats = [
    { name: 'Ayesha from Lahore', message: 'Loved your photography workshop!' },
    { name: 'Ali from Karachi', message: 'When is the next cooking class?' },
    { name: 'Zara from Islamabad', message: 'Can I bring a friend to the session?' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={styles.container}>
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="#111" />
            <Text style={styles.backText}>Back to Dashboard</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.header}>💬 Chat with Interested Travelers</Text>

        <ScrollView contentContainerStyle={styles.chatList}>
          {dummyChats.map((chat, index) => (
            <View key={index} style={styles.chatCard}>
              <Text style={styles.name}>{chat.name}</Text>
              <Text style={styles.message}>{chat.message}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isMobile ? 16 : 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatList: {
    gap: 16,
  },
  chatCard: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
  },
});

export default Chat_With_Interested_Travelers;