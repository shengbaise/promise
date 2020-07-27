// 1、promise有三种状态 pending，fulfilled，rejected
// 2、promise链式调用
const PENDING = 'pending'
const FULFIlled = 'fulfilled'
const REJECRED = 'rejected'

const resolvePromise = (promise2, x, resolve, reject) => {
    if (x === promise2) {
       return reject(new TypeError('链路循环'))
    } 
    let used
    if (x && (typeof x === 'function' || typeof x === 'object')) {
        try {
            const then = x.then
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (used) return
                    resolvePromise(promise2, y, resolve, reject)
                    used = true
                }, (r) => {
                    if (used) return
                    reject(r)
                    used = true
                })
            } else {
                if (used) return
                resolve(x)
                used = true
            }
        } catch (error) {
            if (used) return
            reject(error)
            used = true
        }
    } else {
       return resolve(x)
    }
}

class Promise {
    constructor (executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        this.onRejectedCallback = [] // 存储异步失败状态函数
        this.onFulfilledCallback = [] // 存储异步成功状态函数

        const resolve = (value) => {
            if (value instanceof Promise) {
                return value.then(resolve, reject)
            }
            if (this.status === PENDING) {
                this.status = FULFIlled
                this.value = value
                this.onFulfilledCallback.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECRED
                this.reason = reason
                this.onRejectedCallback.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then (onFulfilled, onRejected) {
        const promise2 = new Promise((resolve, reject) => {
            onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
            onRejected = typeof onRejected  === 'function' ? onRejected : err => {throw err}
            if (this.status === FULFIlled) {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value) // 上一个promise的返回值传给下一个promise
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
               
            } else if (this.status === REJECRED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason) // 上一个promise的返回值传给下一个promise
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            } else {
                this.onRejectedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason) // 上一个promise的返回值传给下一个promise
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })
                this.onFulfilledCallback.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value) // 上一个promise的返回值传给下一个promise
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })
            }
        })
        
        return promise2
    }
    catch (errCallback) {
        this.then(null, errCallback)
    }
}

// 如果value是一个promise会等待这个promise执行完才会往下传递值
Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value)
    })
}

// 如果value是一个promise会立即往下传递值
Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason)
    })
}

Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = Promise
