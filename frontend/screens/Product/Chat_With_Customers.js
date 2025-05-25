// ✅ Responsive Chat_With_Customers.js with Platform-Aware Back Arrow

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const Chat_With_Customers = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! I’m interested in your Hunza shawl.', sender: 'customer' },
    { id: '2', text: 'Hello! Yes, it’s handmade and available in 3 colors.', sender: 'vendor' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'vendor',
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'vendor' ? styles.vendorBubble : styles.customerBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Back Header */}
      <View style={styles.header}>
        {Platform.OS === 'web' && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, Platform.OS !== 'web' && { marginLeft: 0 }]}>Chat With Customers</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Platform.OS === 'web' ? 12 : 0,
    color: '#111827',
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: isMobile ? 10 : 20,
  },
  chatContainer: {
    paddingVertical: 10,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
  vendorBubble: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  customerBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Chat_With_Customers;