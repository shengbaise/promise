class Core {
  constructor (config) {
    this.$router = config.router
  }
  call () {}
  on () {}
  push (params) {
    if (params.url && /http(s)?/.test(params.url)) {
      window.location.href = params.url
    } else {
      this.$router.push(params)
    }
  }
  relaunch (params) {}
  replace (params) {
    this.$router.replace(params)
  }
  go (params) {
    this.$router.go(params)
  }
  forward () {
    this.$router.forward()
  }
  back () {
    this.$router.back()
  }
  // TODO 改成窗口重开
  open (params = {}) {
    if (!params.url) return
    if (/http(s)?/.test(params.url)) {
      window.location.href = params.url
    } else {
      this.$router.push(params.url)
    }
  }
}

export default Core
