import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const languages = [
  { code: 'en', label: 'English', region: 'United States', flag: '🇺🇸' },
  { code: 'ur', label: 'اردو', region: 'پاکستان', flag: '🇵🇰' },
  { code: 'de', label: 'Deutsch', region: 'Deutschland', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', region: 'France', flag: '🇫🇷' },
  { code: 'tr', label: 'Türkçe', region: 'Türkiye', flag: '🇹🇷' },
  // Add more here as needed
];

const LanguageSelectorModal = ({ visible, onClose, onSelect }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>🌐 Choose a Language & Region</Text>

          <ScrollView style={styles.scroll}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.option}
                onPress={() => {
                  onSelect(lang.code);
                  onClose();
                }}
              >
                <Text style={styles.optionText}>
                  {lang.flag} {lang.label} ({lang.region})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close ✕</Text>
          </TouchableOpacity>
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
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    elevation: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#003366',
  },
  scroll: {
    marginBottom: 10,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  closeBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#0077b6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LanguageSelectorModal;
