import bg5sAPI   from './bg5sAPI'
import { BG5SModule } from '@ihealth/ihealthlibrary-react-native'

export default {

  getDeviceNotify: () => {
    return BG5SModule.Event_Notify
  },

  getDeviceAPI: () => {
    return bg5sAPI
  }
}
