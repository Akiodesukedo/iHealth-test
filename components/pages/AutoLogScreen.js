import React, { useEffect, useState } from 'react'
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { View, StyleSheet, DeviceEventEmitter, Modal, Pressable } from 'react-native'
import { Button, Image, Text } from '@rneui/themed';
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
  const [parsedRes, setParsedRes] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [BGL, setBGL] = useState();

  const type = "BG5S";
  const mac = '004D32353E03';

  // Get startMeasure function from bg5sAPI.js
  const startMeasuringFunc = Reflect.get(deviceAPIs.getDeviceAPI().apis, 'startMeasure', mac);

  // Parse response
  useEffect(() => {
    if (response !== null && response !== "" ) {
      const resString = response;
      const parsedObj = JSON.parse(resString);
      setParsedRes(parsedObj);
    }
  }, [response])

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

  // Once the device is connected, automatically start measuring
  useEffect(() => {
    if (onConnectedState.mac) {
      startMeasuringFunc(mac);
    }
  }, [onConnectedState])

  // Show the modal once it gets blood and starts calculation
  useEffect(() => {
    if (parsedRes?.action === 'ACTION_GET_BLOOD' || parsedRes?.action === 'ACTION_RESULT') {
      setModalVisible(true);
      if (parsedRes?.action === 'ACTION_RESULT') {
        const mmolValue = Math.round(parsedRes.RESULT_VALUE * 0.555) / 10
        setBGL(mmolValue);
      }
    }
  }, [parsedRes])

  const moveToResult = (BGL) => {
    setModalVisible(false)
    navigation.navigate('Result', {
      BGL
    });
  }

  return (
    <View style={styles.containerStyle}>
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
            { parsedRes?.action === 'ACTION_GET_BLOOD' ? 
              // Calculating modal
              <View style={styles.viewStyle}>
                <Image 
                  source={require('../../assets/imgs/loading.png')}
                  style={{width: 30, height: 30}}
                />
                <Text>
                  Calculating your blood glucose level...
                </Text>
              </View>
            : 
            parsedRes?.action === 'ACTION_RESULT' ? 
                // Result modal
                <View style={styles.viewStyle}>
                  <Image 
                    source={require('../../assets/imgs/gluco-chan.png')}
                    style={{width: 44, height: 40}}
                  />
                  <Text>
                    { BGL } mmol/L
                  </Text>
                  <Text style={styles.modalText}>
                    Updating your reading...
                  </Text>                  
                </View>
              :
                // Error modal for measurement
                <View style={styles.viewStyle}>
                  <Image 
                    source={require('../../assets/imgs/error-measure.png')}
                    style={{width: 30, height: 30}}
                  />
                  <Text>
                    Oops! We couldn't process your reading.The test strip may be contaminated or not have enough blood sample. Please try again.
                  </Text>
                </View>
            }
            
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => moveToResult(BGL)}>
              <Text style={styles.textStyle}>Next</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      { parsedRes?.action === 'ACTION_STRIP_IN' || parsedRes?.action === 'ACTION_GET_BLOOD' || parsedRes?.action === 'ACTION_RESULT' ?
        // Third Screen
        <View style={styles.viewStyle}>
          <Image 
            source={require('../../assets/imgs/ready-to-measure.png')}
            style={{width: 200, height: 200}}
          />
          <Text>
            Strip is in place. Waiting for your blood sample.
          </Text>
        </View>
      :
        bluetoothState === 'PoweredOn' && scanDevices[0]?.mac && onConnectedState.mac ?
          parsedRes?.action === 'ACTION_STRIP_OUT' ? 
            // Strip Out Screen
            <View style={styles.viewStyle}>
              <Image 
                source={require('../../assets/imgs/strip-error.png')}
                style={{width: 200, height: 200}}
              />
              <Text>
                Strip is not inserted properly.
              </Text>
              <Text>
                Please insert it again.
              </Text>
            </View>
          :
            parsedRes?.action === 'ACTION_ERROR_BG' && parsedRes.ERROR_NUM_BG === 3 ?
              // Strip already used Screen
              <View style={styles.viewStyle}>
                <Image 
                  source={require('../../assets/imgs/strip-error.png')}
                  style={{width: 200, height: 200}}
                />
                <Text>
                  Strip is already used or unknown moisture detected, discard the test strip and repeat the test with a new strip.
                </Text>
              </View>
            :
              // Second Screen
              <View style={styles.viewStyle}>
                <Image 
                  source={require('../../assets/imgs/insert-strip.png')}
                  style={{width: 200, height: 200}}
                />
                <Text>
                  Insert test strip in the glucometer and prepare your blood sample.
                </Text>   
              </View>
        :
          // First Screen
          <View style={styles.viewStyle}>
            <Image 
              source={require('../../assets/imgs/connect-device.png')}
              style={{width: 200, height: 200}}
            />
            <Text>
              Make sure the bluetooth is turned on and the glucometer is nearby.
            </Text>  
          </View>
      }
      <Text>
        { parsedRes?.action }
        { parsedRes?.RESULT_VALUE }
      </Text>
      {/* <Button
        buttonStyle={styles.buttonStyle} 
        onPress={() => moveToResult(5.5)}
        title="For fake result screen"
      />   */}
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  viewStyle: {
    alignItems: 'center',
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
    padding: 20,
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
