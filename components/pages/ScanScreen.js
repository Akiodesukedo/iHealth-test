import React, { useEffect, useState } from 'react'
import { View, StyleSheet, DeviceEventEmitter } from 'react-native'
import { Button, ListItem } from '@rneui/themed';
import useScanAPI from '../api/useScanAPI';
import useConnectAPI  from '../api/useConnectAPI';
import iHealthAPI from '../api/iHealthAPI';

const ScanScreen = ({ navigation }) => {

  // Authenticate with the iHealth SDK
  iHealthAPI.sdkAuthWithLicense('com_glucofit_glucofit_ios.pem');
  
  const {onScanState, isScanning, scanDevice} = useScanAPI();
  const {onConnectedState, onConnectFailState, onDisConnectState, connectDevice} = useConnectAPI();
  const [scanDevices, setScanDevices] = useState([]);

  const type = "BG5S";

  const handleScan = (type) => {
    setScanDevices([]);
    scanDevice(type);
  }

  // useEffect(() => {
  //   if (onConnectedState.mac != null) {
  //     const {mac, type} = onConnectedState;
  //     navigation.navigate('Device', {
  //       mac, type
  //     });
  //   }
  // }, [onConnectedState]);

  useEffect(() => {
    if (onScanState.mac != null) {
      setScanDevices([
        ...scanDevices,
        onScanState
      ])
    }
  }, [onScanState])

  return (
    <View>
      {/* <Button
        containerStyle={styles.containerStyle}  
        buttonStyle={styles.buttonStyle} 
        title="Scan Device"
        loading={isScanning} 
        onPress={() => {
          handleScan(type);
        }} 
      />
        {
        scanDevices.map(item => {
          return (
            <ListItem
              key={item.mac}
              onPress={() => {  
                connectDevice(item.mac, item.type);
              }}
              bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{item.mac}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )
          })
        } */}
      <Button
        containerStyle={styles.containerStyle}  
        buttonStyle={styles.buttonStyle} 
        title="Go to Auto Log"
        onPress={() => {
          navigation.navigate('AutoLog');;
        }} 
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

export default ScanScreen
