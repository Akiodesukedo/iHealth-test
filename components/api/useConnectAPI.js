import { useState, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { iHealthDeviceManagerModule } from '@ihealth/ihealthlibrary-react-native';

const useConnectAPI = () => {
    const [onConnectedState, setConnectedState] = useState({});
    const [onConnectFailState, setConnectFailState] = useState({});
    const [onDisConnectState, setDisConnectState] = useState({});
    
    const connectDevice = (mac, type) => {
        console.log("connect device: ", mac, type)
        iHealthDeviceManagerModule.connectDevice(mac, type);
    }

    useEffect(() => {
        const connectedListener = DeviceEventEmitter.addListener(iHealthDeviceManagerModule.Event_Device_Connected, (event) => {
            console.log(iHealthDeviceManagerModule.Event_Device_Connected, event);
            setConnectedState(event);
        });

        const connectFailListener = DeviceEventEmitter.addListener(iHealthDeviceManagerModule.Event_Device_Connect_Failed, (event) => {
            console.log(iHealthDeviceManagerModule.Event_Device_Connect_Failed, event);
            setConnectFailState(event);
        });

        this.disconnectListener = DeviceEventEmitter.addListener(iHealthDeviceManagerModule.Event_Device_Disconnect, (event) => {
            console.log(iHealthDeviceManagerModule.Event_Device_Disconnect, event);
            setDisConnectState(event);
        });
    
        return () => {
            connectedListener.remove();
            connectFailListener.remove();
            disconnectListener.remove();
        };
    }, []);
        
    return {
        connectDevice,
        onConnectedState,
        onConnectFailState,
        onDisConnectState
    }
}

export default useConnectAPI;

