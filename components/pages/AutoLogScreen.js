import React, { useEffect, useState } from 'react'
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { View, StyleSheet, DeviceEventEmitter, Modal, Pressable } from 'react-native'
import { Button, Text } from '@rneui/themed';
import iHealthAPI from '../api/iHealthAPI';
import useScanAPI from '../api/useScanAPI';
import useDeviceAPI from '../api/useDeviceAPI';
import deviceAPIs from '../api/getAPIs';
import useConnectAPI from '../api/useConnectAPI';

const AutoLogScreen = ({ navigation }) => {

  // Authenticate with the iHealth SDK
  iHealthAPI.sdkAuthWithLicense('com_glucofit_glucofit_ios.pem');

  const [bluetoothState, setBluetoothState] = useState(null);
  const {onScanState, isScanning, scanDevice} = useScanAPI();
  const {onConnectedState, onConnectFailState, onDisConnectState, connectDevice} = useConnectAPI();
  const [scanDevices, setScanDevices] = useState([]);
  const { response } = useDeviceAPI();
  const [modalVisible, setModalVisible] = useState(false);

  const type = "BG5S";
  const mac = '004D32353E03';

  // Get startMeasure function from bg5sAPI.js
  const startMeasuringFunc = Reflect.get(deviceAPIs.getDeviceAPI().apis, 'startMeasure', mac);

  // Bluetooth state management
  useEffect(() => {
    BluetoothStateManager.getState().then((state) => {
      setBluetoothState(state);
    });

    const subscription = BluetoothStateManager.onStateChange((newState) => {
      setBluetoothState(newState);
    }, true);

    return () => subscription.remove();
  }, []);

  // Once bluetooth is on, it start searching a device
  useEffect(() => {
    if (bluetoothState === 'PoweredOn') {
      setScanDevices([]);
      scanDevice(type);
    }
  }, [bluetoothState])

  // Once find a device store the device in scanDevices variable
  useEffect(() => {
    if (onScanState.mac != null) {
      setScanDevices([
        onScanState
      ])
    }
  }, [onScanState])

  // Secure the connection between the device and a phone

  useEffect(() => {
    if (scanDevices[0]?.mac != null) {
      connectDevice(scanDevices[0]?.mac, scanDevices[0]?.type)
      console.log(onConnectedState.mac);
    }
  }, [scanDevices])

  useEffect(() => {
    if (onConnectedState.mac) {
      startMeasuringFunc(mac);
    }
  }, [onConnectedState])

  useEffect(() => {
    if (response.includes('ACTION_GET_BLOOD') || response.includes('ACTION_RESULT')) {
      setModalVisible(true);
    }
  }, [response])

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            { response.includes('ACTION_GET_BLOOD') ? 
              <Text style={styles.modalText}>
                Calculating your blood sugar level...
              </Text>
            : 
              response.includes('ACTION_RESULT') ? 
                <View>
                  <Text>
                    { response }
                  </Text>
                  <Text style={styles.modalText}>
                    Updating your blood sugar level...
                  </Text>                  
                </View>
              :
                <Text>
                  Error
                </Text>
            }
            
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Close result</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View>
        { bluetoothState === 'PoweredOn' && scanDevices[0]?.mac && onConnectedState.mac ?
          <Text>Device is connected</Text>
        :
          <Text>
            Make sure the bluetooth is turned on and the glucometer is nearby.
          </Text>
        }
      </View>
      <View>
        { response.includes('ACTION_STRIP_IN') || response.includes('ACTION_GET_BLOOD') || response.includes('ACTION_RESULT') ?
          <Text>
            Strip is inserted properly. Prepare your blood sample.
          </Text>
        :
          <Text>
            Insert test strip in the glucometer and prepare your blood sample.
          </Text>
        }
      </View>
      <View>
        { response.includes('ACTION_GET_BLOOD') || response.includes('ACTION_RESULT') ?
          <Text>
            Strip is in place. Wait for your reading.
          </Text>
        :
          <Text>
            Apply the strip to the blood and keep it in place.
          </Text>
        }
      </View>
      <Text>
        { response }
      </Text>
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})

export default AutoLogScreen
