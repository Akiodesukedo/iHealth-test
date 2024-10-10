import { StatusBar } from 'expo-status-bar';
import { Button, DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { iHealthDeviceManagerModule } from '@ihealth/ihealthlibrary-react-native';
import { useEffect } from 'react';

// Path to the license file
const licenseFileName = 'com_glucofit_glucofit_ios.pem';

const JustAuth = ({ navigation }) => {
  useEffect(() => {
    // Authenticate with the iHealth SDK
    iHealthDeviceManagerModule.sdkAuthWithLicense(licenseFileName);

    // Add listener for the authentication result
    const authListener = DeviceEventEmitter.addListener(
      iHealthDeviceManagerModule.Event_Authenticate_Result,
      (e) => {
        console.log('Authentication Result:', e);
      }
    );

    // Clean up the listener on component unmount
    return () => {
      authListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Authentication test screen</Text>
      <Button
        title="Connect Device"
        onPress={() => navigation.navigate('Connect Device')}
      />
      <Button
        title="Search Device"
        onPress={() => navigation.navigate('Search Device')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default JustAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});