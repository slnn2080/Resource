/*
  思路: 
    每次执行 fn 的时候 先推入到队列中 然后从队列中取出第一个节点执行
      

      let temp = queue.shift()
      if(!temp.flag) {
        try {
          temp()
          temp.flag = true
        } catch(err) {
          temp.flag = false
        }
      } else {
        temp = queue.shift()
      }

    每次执行的时候 要判断 节点中的flag
      如果是 true 则

    如果 flag 为 false, 则不再从队列中取出 
    如果 flag 为 true,  则从队列中再次取出
*/

let start, duration, index, num, flag = false, queue = []

let node = {
  flag: false,
  fn: null
}

function init() {
  start = +new Date()
  duration = 0
  index = 1
  num = 0
}

init()

function fn1(str, num, queue) {
  console.log(str + num)
  console.log("队列信息:" , queue)
}

function fn2(str, num, queue) {
  // console.log(queue)
  console.log(str + num)
  console.log("队列信息:" , queue)
  // throw new Error("network")
}

let testFn = flag ? fn1 : fn2
let temp = null

while(true) {

  try {
    let end = +new Date()
    duration = end - start

    if(duration >= index * 1000) {

      index++
      num++
      
      // ----------

      try {
        // 第一次失败后会重新循环 我们判断下
        if(temp && !temp.flag) {

          temp.fn("失败的场合", num, queue)
          temp.flag = true
          temp = null
        
        // 如果没有 temp 说明是第一次
        } else if(!temp && !temp?.flag) {
          console.log(1)
          // 组织节点
          let node = {
            flag: false,
            fn: testFn
          }

          // 压到队列中
          queue.push(node)  

          // 先取出队列前元素
          temp = queue.shift()
          temp.fn("正常的场合", num, queue)
          temp.flag = true
          temp = null

        }

      } catch(err) {

        if(err.message == "network") {
          temp.flag = false
          continue
        }

      }      
    }

    if(duration > 10000) throw new Error("network")

  // throw "str" 并不会终止程序运行 catch里面会无限循环
  } catch(err) {
    if(err.message == "network") {
      init()
      continue
    }
  }
}

// let arr = [1,2,3,4,5]

// arr.reduce((pre, item) => {
//   return pre.then(() => {
//     return new Promise(resolve => {
//       console.log(item)
//       resolve()
//     })
//   })
// }, Promise.resolve())