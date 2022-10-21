import PQ from "p-queue"
import events from "events"

// const bus = new events.EventEmitter()
// let fnArr = [
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn0")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn1")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn2")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn3")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn4")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn5")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn6")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn7")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn8")
//       }, 3000)
//     })
//   },
//   () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve("fn9")
//       }, 3000)
//     })
//   },
// ]


const queue = new PQ({
  concurrency: 1,
  // autoStart: true
})

function fn() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("我是fn")
      reject(1)
    }, 3000)
  })
}

function fn2() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("我是fn2")
      resolve(2)
    }, 3000)
  })
}

let q = queue.add(fn)
q.then().catch(err => console.log("q, err: --- ", err))
queue.add(fn2)

queue.on("completed", result => {
  console.log(`Completed: --- 项目完成 拿到该项目的结果为: ${result}`)
  console.log(queue.size)
})

queue.on("error", err => {
  console.log("error: ", err)
  console.log(queue.size)
})

queue.start()



// let id = 0
// let index = 0

// bus.on("AddQueueItem", () => {
//   let node = {
//     id: id++,
//     flag: false,
//     fn: fnArr[index]
//   }
//   queue.add(node)
//   index++
// })




// function fn() {
//   return new Promise(resolve => {
//     bus.emit("AddQueueItem")
//     setTimeout(resolve, 1000)
//   })
// }


// let fnArr2 = [fn, fn, fn, fn, fn]
// ;(async () => {
//   for(let fn of fnArr2) {
//     await fn()
//     console.log("async: ", queue.size)
//   }
// })();

// let flag = false
// function notify() {
//   if(!flag) {

//   }
// }



// console.log("主线程:", queue.size)

// queue.on("add", () => {
//   console.log(`queue的size: ${queue.size}`)
// })





