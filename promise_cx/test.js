const Promise = require('./index.js')
const a = function () {
    const dfd = Promise.defer()
    dfd.resolve(1000)
    return dfd.promise
}
const promise1 = a().then((v) => {
    console.info(v, 'vvv')
    return v
}, (e) => {
    console.info(e, 'eee')
}).then((value) => {
    console.info(value, 'promise1')
})
