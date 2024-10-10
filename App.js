import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import AppStack from './components/stack/AppStack';
import { useState } from 'react';

// Path to the license file
const licenseFileName = 'com_glucofit_glucofit_ios.pem';

export default function App() {

  const [mac, setMac] = useState('');

  return (
    <View style={styles.container}>
      <AppStack mac={mac} setMac={setMac} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
