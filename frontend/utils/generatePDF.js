import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export const generateItineraryPDF = async (itineraryData) => {
  const {
    title = 'Untitled Trip',
    overview = '',
    budget = '',
    style = '',
    days = [],
    images = [],
  } = itineraryData;

  const dayHTML = days
    .map(
      (day, idx) => `
        <h3>Day ${idx + 1}</h3>
        <p><strong>Place:</strong> ${day.place}</p>
        <p><strong>Time:</strong> ${day.time}</p>
        <p><strong>Activities:</strong> ${day.activities}</p>
        <hr/>
      `
    )
    .join('');

  const imageHTML = images
    .map((uri) => `<img src="${uri}" width="300" style="margin:10px 0;" />`)
    .join('');

  const html = `
    <html>
      <body style="font-family: Arial; padding: 20px;">
        <h1>${title}</h1>
        <p><strong>Overview:</strong> ${overview}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Style:</strong> ${style}</p>
        <hr/>
        ${dayHTML}
        <h3>📸 Images</h3>
        ${imageHTML}
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    if (Platform.OS !== 'web') {
      await Sharing.shareAsync(uri);
    } else {
      window.open(uri, '_blank');
    }
  } catch (err) {
    console.error(err);
    alert('❌ Failed to generate PDF');
  }
};
