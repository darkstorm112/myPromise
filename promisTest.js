const myPromise = require('./newPromise.js')
const p = new myPromise((resolve,reject)=>{
  // reject('报错')
  // throw new Error('报错啦，兄弟们')
  resolve('success')
  // reject('err')
  // setTimeout(()=>{
  //   resolve('success')
  // },2000)
})
// p.then(value=>{
//   console.log('resolve', value)
// },reason=>{
//   console.log('reject',reason)
// })
// p.then(value=>{
//   console.log(1)
//   console.log('resolve',value)
// })
// p.then(value=>{
//   console.log(2)
//   console.log('resolve',value)
// })
// p.then(value=>{
//   console.log(3)
//   console.log('resolve',value)
// })

// function other () {
//   return new Promise((resolve,reject)=>{
//     resolve('other')
//   })
// }
// p.then((value)=>{
//   console.log(1)
//   console.log('resolve',value)
//   return other()
// }).then((value)=>{
//   console.log(2)
//   console.log('resolve',value)
//   return 'hhhh'
// }).then((value)=>{
//   console.log(3)
//   console.log('resolve',value)
// })

let p1 =  
// p.then(value=>{
//   console.log('resolve',value)
// },reason=>{
//   console.log(222)
//   console.log(reason)
//   return 5
// }).then(value=>{
//   console.log('------------',value)
// })
  p.then()
  .then(value=>{console.log('---------------2'+value)})
// setTimeout(()=>{
//   console.log(p1)
// },1000)

// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
// const p1 = p.then(value => {
//   console.log(1)
//   console.log('resolve', value)
//   return p1
// })

// // 运行的时候会走reject
// p1.then(value => {
//  console.log(2)
//  console.log('resolve', value)
// }, reason => {
//  console.log(3)
//  console.log(reason.message)
// })






