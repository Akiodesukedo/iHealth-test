import { StatusBar } from 'expo-status-bar';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { iHealthDeviceManagerModule } from '@ihealth/ihealthlibrary-react-native';

// Path to the license file
const licenseFileName = 'com_glucofit_glucofit_ios.pem'; // Replace with actual filename

iHealthDeviceManagerModule.sdkAuthWithLicense(licenseFileName);

// Add listener for the authentication result
DeviceEventEmitter.addListener(iHealthDeviceManagerModule.Event_Authenticate_Result, (e) => {
  console.log('Authentication Result:', e);
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
