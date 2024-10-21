// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import DeviceScreen from '../pages/DeviceScreen';
import ScanScreen from '../pages/ScanScreen';
import SearchDevice from '../pages/SearchDevice';
import BluetoothScreen from '../pages/BluetoothScreen';
import AutoLogScreen from '../pages/AutoLogScreen';

// Create a Stack Navigator
const Stack = createStackNavigator();

const AppStack = ({ mac, setMac }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Bluetooth" component={BluetoothScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Device" component={DeviceScreen} />
        <Stack.Screen name="AutoLog" component={AutoLogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
