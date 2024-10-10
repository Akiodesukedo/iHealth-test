import { StatusBar } from 'expo-status-bar';
import { Button, DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { iHealthDeviceManagerModule, BG5SModule, BG5SProfileModule } from '@ihealth/ihealthlibrary-react-native';
import { useEffect } from 'react';

const licenseFileName = 'com_glucofit_glucofit_ios.pem';

const SearchDevice = ({ navigation }) => {

  useEffect(() => {
    iHealthDeviceManagerModule.sdkAuthWithLicense(licenseFileName);

    const authListener = DeviceEventEmitter.addListener(
      iHealthDeviceManagerModule.Event_Authenticate_Result,
      (e) => {
        console.log('Auth result:', e);
      }
    );

    const type = 'BG5S';
    const searchListner = DeviceEventEmitter.addListener(
      iHealthDeviceManagerModule.Event_Scan_Device_Result,
      (e) => {
        console.log('Search result:', e)
      }
    )

    iHealthDeviceManagerModule.startDiscovery(type);

    return () => {
      authListener.remove();
      searchListner.remove();
      iHealthDeviceManagerModule.stopDiscovery(type);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Search screen</Text>
      <StatusBar style="auto" />
      <Button
        title="Connect Device"
        onPress={() => navigation.navigate('Connect Device')}
      />
    </View>
  )

}

export default SearchDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
