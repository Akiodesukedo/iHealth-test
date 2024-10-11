import { DeviceEventEmitter } from 'react-native';
import { iHealthDeviceManagerModule } from '@ihealth/ihealthlibrary-react-native';

const TAG = 'iHealthAPI';

const sdkAuthWithLicense = (filename) => {
  const licenseData = require(`${filename}`); // Load the PEM file as NSData
  
  iHealthDeviceManagerModule.commandSDKUserValidationWithLicense(
    licenseData,
    (userDeviceAccess) => {
      // Callback when user device access is provided
      console.log(`${TAG} User Device Access:`, userDeviceAccess);
    },
    (userValidationSuccess) => {
      // Callback when the user validation is successful
      console.log(`${TAG} User Validation Success:`, userValidationSuccess);
    },
    (validationError) => {
      // Callback for validation error
      console.error(`${TAG} Validation Error:`, validationError);
    }
  );
}

export default {
  sdkAuthWithLicense,
};
