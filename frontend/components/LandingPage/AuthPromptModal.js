import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

const AuthPromptModal = ({ visible, onClose, onContinue }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Sign In Required</Text>
          <Text style={styles.message}>
            You need to sign in to explore full details and make bookings.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={styles.cancelText}>Not Now</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onContinue} style={styles.continue}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 360,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#003366',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancel: {
    flex: 1,
    marginRight: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  continue: {
    flex: 1,
    marginLeft: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0077b6',
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  continueText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AuthPromptModal;
