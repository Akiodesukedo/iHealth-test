import { StatusBar } from 'expo-status-bar';
import { Button, DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { iHealthDeviceManagerModule, BG5SModule, BG5SProfileModule } from '@ihealth/ihealthlibrary-react-native';
import { useEffect } from 'react';

const licenseFileName = 'com_glucofit_glucofit_ios.pem';

const SearchDevice = ({ navigation }) => {

  useEffect(() => {
    iHealthDeviceManagerModule.sdkAuthWithLicense(licenseFileName);

    const notifyListener = DeviceEventEmitter.addListener(BG5SModule.Event_Notify,  (event) => {
      console.log(event);
    });

    // const authListener = DeviceEventEmitter.addListener(
    //   iHealthDeviceManagerModule.Event_Authenticate_Result,
    //   (e) => {
    //     console.log('Auth result:', e);
    //   }
    // );

    const type = 'BG5S';
    iHealthDeviceManagerModule.startDiscovery(type);
    const mac = '004D32353E03';
    iHealthDeviceManagerModule.connectDevice(mac, type);

    // const searchListner = DeviceEventEmitter.addListener(
    //   iHealthDeviceManagerModule.Event_Scan_Device,
    //   (e) => {
    //     console.log('Search result:', e)
    //   }
    // )


    return () => {
      notifyListener.remove();
    }

    // return () => {
    //   authListener.remove();
    //   searchListner.remove();
    //   iHealthDeviceManagerModule.stopDiscovery(type);
    // };
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
