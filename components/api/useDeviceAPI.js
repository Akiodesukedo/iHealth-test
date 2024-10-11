import { useState, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { iHealthDeviceManagerModule } from '@ihealth/ihealthlibrary-react-native';
import deviceAPIs from '../api/getAPIs';

const useDeviceAPI = () => {
    const [response, setResponse] = useState("");

    useEffect(() => {
        const notifyListener = DeviceEventEmitter.addListener(deviceAPIs.getDeviceNotify(),  (event) => {
            console.log(event);
            setResponse(JSON.stringify(event));
        });
    
        return () => {
            notifyListener.remove();
        };
    }, []);
        
    return {
        response
    }
}

export default useDeviceAPI;