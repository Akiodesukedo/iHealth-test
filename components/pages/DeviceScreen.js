import { StatusBar } from 'expo-status-bar';
import { Button, DeviceEventEmitter, StyleSheet, Text, View , ScrollView} from 'react-native';
import { iHealthDeviceManagerModule } from '@ihealth/ihealthlibrary-react-native';
import React, { useState, useEffect } from 'react'
import { ListItem } from '@rneui/themed';
import deviceAPIs from '../api/getAPIs';
import useDeviceAPI from '../api/useDeviceAPI';
import useConnectAPI from '../api/useConnectAPI';
import iHealthAPI from '../api/iHealthAPI';

const DeviceScreen = ({ navigation }) => {
  // Authenticate with the iHealth SDK
  iHealthAPI.sdkAuthWithLicense('com_glucofit_glucofit_ios.pem');
  
  const mac = '004D32353E03';
  const type = 'BG5S'
  const { response } = useDeviceAPI();
  const { onDisConnectState } = useConnectAPI();

  useEffect(() => {
    console.log('onDisConnectState', onDisConnectState);
    if (onDisConnectState.mac != null || mac == onDisConnectState.mac) {
      navigation.goBack();
    }
    return () => {
      const fn = Reflect.get(deviceAPIs.getDeviceAPI().apis, 'disConnect', mac);
      console.log(fn);
      fn(mac);
    }
  }, [onDisConnectState])

  return (
    <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
      <View>
      {
        type ? 
        Object.keys(deviceAPIs.getDeviceAPI().apis).map(item => {
          return (
            <ListItem
              key={item}
              onPress={() => {  
                const fn = Reflect.get(deviceAPIs.getDeviceAPI().apis, item, mac);
                fn(mac);
              }}
              bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{`Function:  ${item}`}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            )
        })
        : <View />
      }
      </View>
      <View style={{ }}>
        <Text style={{ fontSize: 20 }}>{response}</Text>
      </View>
    </ScrollView>
  )
}

export default DeviceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});