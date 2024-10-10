import { StatusBar } from 'expo-status-bar';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { iHealthDeviceManagerModule } from '@ihealth/ihealthlibrary-react-native';
import { useEffect } from 'react';

const licenseFileName = 'com_glucofit_glucofit_ios.pem';

const ConnectDevice = ({ navigation }) => {

  useEffect(() => {
    iHealthDeviceManagerModule.sdkAuthWithLicense(licenseFileName);

    const authListener = DeviceEventEmitter.addListener(
      iHealthDeviceManagerModule.Event_Authenticate_Result,
      (e) => {
        console.log('Connect Result:', e);
      }
    );

    return () => {
      authListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Connect screen</Text>
      <StatusBar style="auto" />
    </View>
  );

}

export default ConnectDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
