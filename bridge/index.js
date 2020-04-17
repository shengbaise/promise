import Core from './core'
import App from './app'
import Mp from './mp'
import Wx from './wx'
import Alipay from './alipay'
import Observer from '../Observer'
import { isBTSAndroid, isBTSIOS, isBTSAPP, isWeiXin, isMiniProgram, isAliPay } from '@/utils/detector/browse.js'

class Bridge {
  constructor (config = {}) {
    // 当前环境
    this.env = this.getEnv()
    // 内核对象
    this.core = {
      'app': new App(config),
      'mp': new Mp(config),
      'wx': new Wx(config),
      'alipay': new Alipay(config),
      'unknown': new Core(config)
    }[this.env]
    // 路由
    this.$router = new Router({
      bridge: this.core,
      config: config.router
    })
    // 观察者
    this.observer = new Observer()
  }

  isBTSAndroid () {
    return isBTSAndroid()
  }
  isBTSIOS () {
    return isBTSIOS()
  }
  isBTSAPP () {
    return isBTSAPP()
  }
  isWeiXin () {
    return isWeiXin()
  }
  isMiniProgram () {
    return isMiniProgram()
  }
  isAliPay () {
    return isAliPay()
  }
  getEnv () {
    if (this.isBTSAPP()) return 'app'
    if (this.isMiniProgram()) return 'mp'
    if (this.isWeiXin()) return 'wx'
    if (this.isAliPay()) return 'alipay'
    return 'unknown'
  }
  call (config = {}) {
    return this.core.call(config)
  }
  on (config = {}) {
    this.core.on(config)
    this.observer.$on(config.key, config.action)
  }
  emit () {
    this.observer.$emit(...arguments)
  }
  off (key) {
    this.observer.$off(key)
  }
}

class Router {
  constructor (options = {}) {
    this.config = options.config
    this.bridge = options.bridge
  }
  relaunch (params = {}) {
    this.bridge.relaunch(params)
  }
  push (params = {}) {
    this.bridge.push(params)
  }
  replace (params = {}) {
    this.bridge.replace(params)
  }
  back () {
    this.bridge.back()
  }
  go (params) {
    this.bridge.go(params)
  }
  forward () {
    this.bridge.forward()
  }
  open (params) {
    this.bridge.open(params)
  }
}

export default Bridge
