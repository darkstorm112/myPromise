
// promiseA+
function Promise (execute) {
  // 初始状态
  this.PromiseState = 'pending'
  // this.PromiseResult = ''
  this.callBack = []

  let self = this
  function resolve (value) {
    if(self.PromiseState!=='pending')return
    self.PromiseState = 'fulfilled'
    self.PromiseResult = value
    self.callBack.forEach(item => {
      try {
        let res = item.success(self.PromiseResult)
        item.resolve(res)
      }catch(e){
        item.reject(e)
      }
    });
  }
  function reject (reason) {
    if(self.PromiseState!=='pending')return
    self.PromiseState = 'reject'
    self.PromiseResult = reason
    self.callBack.forEach(item => {
      try {
        let res = item.failed(self.PromiseResult)
        item.reject(res)
      }catch(e){
        item.reject(e)
      }
    });
  }

  setTimeout(()=>{
    try{
      execute(resolve, reject)
    }catch(e){
      // console.log(e)
      reject(e)
    }
  })
}
Promise.prototype.then = function (success,failed) {
  if(typeof success!== 'function'){
    success = function(resolve){}
  }
  if(typeof failed!== 'function'){
    failed = function(reject){return reject}
  }

  return new Promise((resolve, reject)=>{
    if(this.PromiseState === 'fulfilled'){
      try {
        let res = success(this.PromiseResult)
        resolve(res)
      }catch(e){
        reject(e)
      }
    }
    if(this.PromiseState === 'reject'){
      try {
        let res = failed(this.PromiseResult)
        reject(res)
      }catch(e){
        reject(e)
      }
    }
    if(this.PromiseState==='pending'){
      this.callBack.push({
        resolve,
        success,
        reject,
        failed,
      })
    }
  })
}
Promise.prototype.catch = function (failed) {
  return this.then(undefined,failed)
}


