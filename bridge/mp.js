import Core from './core'
import { formatParams } from '@/utils/Url'

const routes = [
  {
    path: '/pages/index/main',
    name: 'index',
    isSwitch: true
  },
  {
    path: '/pages/webview/main',
    name: 'webview'
  },
  {
    path: '/pages/product/main',
    name: 'goods'
  },
  {
    path: '/pages/classification/main',
    name: 'category'
  }
]

class Mp extends Core {
  push (params) {
    if (this.isMiniProgram()) {
      const route = this.changeRoute(params)
      if (route.isSwitch) {
        window.wx.miniProgram.switchTab(route)
      } else {
        window.wx.miniProgram.navigateTo(route)
      }
    }
  }
  relaunch (params) {}
  replace (params) {
    this.isMiniProgram() && window.wx.miniProgram.redirectTo(params)
  }
  go (params) {
  }
  forward () {
  }
  back (delta = 1) {
    this.isMiniProgram() && window.wx.miniProgram.navigateBack({ delta })
  }
  open (params = {}) {
    this.isMiniProgram() && params.router && window.wx.miniProgram.navigateTo(this.changeRoute(params))
  }
  switch (params) {
    this.isMiniProgram() && window.wx.miniProgram.switchTab(params)
  }
  changeRoute (params) {
    const nroute = {}
    if (params.mp_path) {
      nroute.url = params.mp_path
    } else if (params.name) {
      const route = routes.find((item) => {
        return item.name === params.name
      })
      nroute.url = route.path
      nroute.isSwitch = route.isSwitch
    }
    if (params.query) {
      nroute.url = `${nroute.url}?${formatParams(params.query)}`
    }
    console.log('nroute', nroute)
    return nroute
  }
  isMiniProgram () {
    if (!window.wx || !window.wx.miniProgram) {
      return false
    }
    return true
  }
}

export default Mp
