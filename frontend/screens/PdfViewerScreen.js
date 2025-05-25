import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Sharing from 'expo-sharing';

const PdfViewerScreen = ({ route }) => {
  const { filePath } = route.params;

  const handleDownload = async () => {
    if (Platform.OS === 'web') {
      window.open(filePath, '_blank');
    } else {
      try {
        await Sharing.shareAsync(filePath);
      } catch (error) {
        alert('❌ Error while sharing PDF');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.webNotice}>
          {Platform.OS === 'web'
            ? '⚠️ PDF preview is not supported on web. You can download it below.'
            : '📄 PDF generated. Download it below.'}
        </Text>
        <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
          <Text style={styles.downloadText}>⬇️ Download PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  webNotice: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  downloadButton: {
    padding: 12,
    backgroundColor: '#4caf50',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  downloadText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PdfViewerScreen;
