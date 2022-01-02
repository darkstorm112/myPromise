// 定义三个常量表示状态
const PENDING = 'pengding'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class myPromise {
  constructor (executor) {
    // executor 是一个执行器，传入会立刻执行
    // 传入resolve 和 reject 方法
    try {
      executor(this.resolve, this.reject)
    }catch (e) {
      this.reject(e)
    }
  }

  // 存储状态的变量 初始值为pending
  status = PENDING
  // 成功之后的值
  value = null
  // 失败之后的值
  reason = null

  // 存储成功回调函数
  onFulfilledCallBacks = []
  // 存储失败回调函数
  onRejectedCallBacks = []

  // 用箭头函数 可以保证this指向promise  普通函数this指向window或者undefined
  // 成功函数
  resolve = (value)=>{
    // 更改成功后的状态
    if(this.status!==PENDING)return
    this.status = FULFILLED
    this.value = value

    // 如果存在回调函数那么就执行回调函数
    // this.onFulfilledCallBack && this.onFulfilledCallBack(value)
    // 循环调用成功函数
    while (this.onFulfilledCallBacks.length) {
      this.onFulfilledCallBacks.shift()(value)
    }
  }
  // 失败函数
  reject = (reason)=>{
    // 更改失败后的状态
    if(this.status!==PENDING)return
    this.status = REJECTED
    this.reason = reason

    // 如果存在回调函数那么就执行回调函数
    // this.onRejectedCallBack && this.onRejectedCallBack(reason)
    // 循环调用成功函数
    while (this.onRejectedCallBacks.length) {
      this.onRejectedCallBacks.shift()(reason)
    }
  }

  then(onFulfiled, onRejected){

    const realOnFulfiled = typeof onFulfiled === 'function'? onFulfiled:value => value;
    const realOnRejected = typeof onRejected === 'function'? onRejected:reason => {throw reason};

    const p2 =  new myPromise((resolve,reject)=>{

      // 提取下重复代码
      const FulliledMicotask = ()=>{
        queueMicrotask(()=>{
          try {
            // 获取成功回调函数的执行结果
            let x = realOnFulfiled(this.value)
            // 传入 resolvePromise 集中处理
            resolvePromise(p2, x, resolve, reject)
          }catch (e) {
            reject(e)
          }
        })
      }

      const RejectedMicotask = ()=>{
        queueMicrotask(()=>{
          try {
            // 获取成功回调函数的执行结果
            let x = realOnRejected(this.reason)
            // 传入 resolvePromise 集中处理
            resolvePromise(p2, x, resolve, reject)
          }catch (e) {
            reject(e)
          }
        })
      }

      // 判断状态 调用不同的函数
      switch (this.status) {
        case FULFILLED:
          // 获取成功执行函数的执行结果

          // 这样子执行失败
          // let x = onFulfiled(this.value)
          // resolvePromise(p2, x, resolve, reject)

          // 开启一个异步微任务 创建一个微任务等待 p2 完成初始化
          // queueMicrotask(()=>{
          //   try {
          //     // 获取成功回调函数的执行结果
          //     let x = onFulfiled(this.value)
          //     // 传入 resolvePromise 集中处理
          //     resolvePromise(p2, x, resolve, reject)
          //   }catch (e) {
          //     reject(e)
          //   }
          // })
          FulliledMicotask()
          break
        case REJECTED:
          // 创建一个微任务等待p2初始化完成
          // queueMicrotask(()=>{
          //   try {
          //     // 获取成功回调函数的执行结果
          //     let x = onRejected(this.reason)
          //     // 传入 resolvePromise 集中处理
          //     resolvePromise(p2, x, resolve, reject)
          //   }catch (e) {
          //     reject(e)
          //   }
          // })
          RejectedMicotask()
          // 相同的处理方法
          // reject(onRejected(this.reason))
          break
        case PENDING:
          this.onFulfilledCallBacks.push(FulliledMicotask)
          this.onRejectedCallBacks.push(RejectedMicotask)
          break
        default:
          break
      }
    })
    return p2
  }

  static resolve (parameter) {
    // 入参为promise 则返回对象为promise
    if(parameter instanceof myPromise){
      return parameter
    }

    // 其他入参则返回一个成功的promise对象
    return new myPromise((resolve)=>{
      resolve(parameter)
    })
  }

  static reject (reason) {
    // 返回一个失败的promise对象
    return new myPromise((resolve,reject)=>{
      reject(parameter)
    })
  }
}

function resolvePromise (p2, x, resolve, reject) {
  // 当返回的值为本身时 报错提示下  测试不通过 改下
  // if(p2 === x){
  //   return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  // }
  // // 判断x是不是Promise对象实例
  // if(x instanceof myPromise){
  //   // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
  //   // x.then(value => resolve(value), reason => reject(reason))
  //   // 简化之后
  //   x.then(resolve,reject)
  // }else {
  //   // 普通值
  //   resolve(x)
  // }

  if(p2 === x){
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }

  if( typeof x === 'object' || typeof x === 'function') {
    // x为null单独处理
    if(x === null) {
      return resolve(x)
    }

    let then

    try {
      then = x.then
    }catch(e){
      return reject(e)
    }
    // 抄的代码
    if(typeof then==='function'){
      let called = false;
      try {
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          y => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return;
            called = true;
            resolvePromise(p2, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          r => {
            if (called) return;
            called = true;
            reject(r);
          });
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return;

        // 否则以 error 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
    //   then(resolve,reject)
    // }else {
    //   // 普通值
    //   resolve(x)
    // }
  }else {
    // 普通值
    resolve(x)
  }
}

// promiseA+测试
myPromise.deferred = function () {
  var result = []
  result.promise = new myPromise (function(resolve,reject){
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

// 导出对象
module.exports = myPromise