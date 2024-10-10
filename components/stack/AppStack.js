// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import JustAuth from '../pages/JustAuth';
import ConnectDevice from '../pages/ConnectDevice';
import SearchDevice from '../pages/SearchDevice';

// Create a Stack Navigator
const Stack = createStackNavigator();

const AppStack = ({ mac, setMac }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={JustAuth} />
        <Stack.Screen name="Search Device" component={SearchDevice} initialParams={{ mac, setMac }} />
        <Stack.Screen name="Connect Device" component={ConnectDevice} initialParams={{ mac, setMac }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
