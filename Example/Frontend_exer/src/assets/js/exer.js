// function p() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(10)
//     }, 3000)
//   })
// }

// async function fn() {
//   console.log("这里就是同步的逻辑")

//   // await 再等上面的promise传出结果 await的时候并不会阻塞 它也会在等待期间执行其它的代码
//   let res = await p()
//   console.log(1)

//   // 只有上面的结果出来后才会执行打印res 这里阻塞住了
//   console.log(res)
// }

// fn()
// console.log("主线程")
// console.log(2)

let arr = []
for(let i=0; i<10; i++) {
  arr.push(i)
}

console.log("主线程")

let temp = null
Promise.resolve().then(() => {
  while(true) {
    if(arr.length <= 0) break

    temp = arr.shift()
    console.log(temp)
  }

  console.log(arr)
})

console.log("主线程2")