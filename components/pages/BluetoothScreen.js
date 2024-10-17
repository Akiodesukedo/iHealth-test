import React, { useEffect, useState } from 'react'
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native'
import { Button, Text } from '@rneui/themed';
import iHealthAPI from '../api/iHealthAPI';

const BluetoothScreen = ({ navigation }) => {

  // Authenticate with the iHealth SDK
  iHealthAPI.sdkAuthWithLicense('com_glucofit_glucofit_ios.pem');

  const [bluetoothState, setBluetoothState] = useState(null);

  useEffect(() => {
    // Get the initial state of Bluetooth
    BluetoothStateManager.getState().then((state) => {
      setBluetoothState(state);
    });

    // Listen for changes in the Bluetooth state
    const subscription = BluetoothStateManager.onStateChange((newState) => {
      setBluetoothState(newState);
    }, true);

    // Clean up the subscription on component unmount
    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>
        Bluetooth is {bluetoothState === 'PoweredOn' ? 'ON' : 'OFF'}
      </Text>
      {bluetoothState === 'PoweredOn' ? 
        <Text>
          Good to go to next page
        </Text>
      :
        <Text>
          You have to turn on bluetooth on your phone.
        </Text>
      }
      <Button
        containerStyle={styles.containerStyle}  
        buttonStyle={styles.buttonStyle} 
        title="Go to Scan"
        onPress={() => {
          navigation.navigate('Scan');;
        }} 
        disabled={bluetoothState!=="PoweredOn"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    width: '50%',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonStyle: {
    backgroundColor: '#2089dc',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10,
  }
})

export default BluetoothScreen
