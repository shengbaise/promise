import Core from './core'
import dsbridge from 'dsbridge'

class App extends Core {
  $call (config) {
    if (config.callback) {
      return dsbridge.call(config.key, config.params, config.callback)
    } else {
      return dsbridge.call(config.key, config.params)
    }
  }
  $register (config) {
    dsbridge.register(config.key, config.action)
  }
  $push (config) {
    dsbridge.call('jumpController', config)
  }
  $replace (config) {
    dsbridge.call('jumpController', config)
  }
}

export default App
