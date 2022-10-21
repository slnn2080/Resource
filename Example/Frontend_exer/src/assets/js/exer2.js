/*
// 原版
async function asyncPool(poolLimit, arr, iteratorFn) {

  // 存储所有的异步任务
  const ret = []

  // 存储正在执行的异步任务
  const executing = []

  // 对arr任务数组进行循环
  for(const item of arr) {

    // 调用 iteratorFn函数创建异步任务
    const p = Promise.resolve().then(() => iteratorFn(item, arr))

    // 保存新的异步任务
    ret.push(p)

    // 当poolLimit值小于或等于总任务个数时 进行并发控制
    if(poolLimit <= arr.length) {
      // 当任务完成后 从正在执行的任务数组中移除已完成的任务
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))

      // 保存正在执行的异步任务
      executing.push(e) 

      // 如果执行的任务 > 限制
      if(executing.length >= poolLimit) {
        // 进来后使用 race() 方法 捕获err
        await Promise.race(executing.map(function(item) {
          return item.catch(function(err) {
            return err
          })
        }))
      }
    }
  }

  // 使用 promise.all 对err进行处理
  return Promise.all(ret.map(function(item) {
    return item.catch(function(err) {
      return err
    })
  }))
}

const timeout = (i, x) => new Promise(
  
  (resolve, reject) => {
  setTimeout(() => {
    console.log(i)

    if(i == 2000) {
      reject({err: i})
    } else {
      resolve({success: i})
    }
  }, i)

})

asyncPool(2, [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], timeout).then(res => {
  console.log("res: ", res)
})
*/


// 2
/*
  场景:
    前面页面中需要同时发送20个请求, 但是服务器端有限制 需要前端控制并发数 保证最多只能同时发送10个请求

  1. 最多同时执行的任务数为10个
  2. 当前任务执行完成后 释放队列空间 自动执行下一个任务
  3. 所有任务添加到任务队列后 自动开始执行任务
*/

// 创建 异步任务
/*
function createTask(i) {
  return () => {
    return new Promise((resolve, reject) => {
      // 将每次传入的 i 进行 resolve
      setTimeout(() => {
        resolve(i)
      }, 2000)
    })
  }
}


class TaskQueue {

  constructor() {
    // 设置最大并发数
    this.max = 10;

    // 存储任务
    this.taskList = []

    // 当任务全部添加完毕后自动执行
    setTimeout(() => {
      this.run()
    })
  }

  // 添加任务到队列 -- 同步方法
  addTask(task) {
    this.taskList.push(task)
  }

  // 自动执行任务队列
  run() {
    // 获取任务队列中的数量
    const length = this.taskList.length

    // 如果 length 为0 代表所有的任务完成
    if(!length) {
      return
    }

    // 大于 max 取 max 如果 任务队列的长度 < max 取队列的长度 保证并发数量不会超过10
    const min = Math.min(this.max, length)

    // 取出任务队列中的任务执行
    for(let i = 0; i < min; i++) {
      // 将max的值进行 -- 操作 开始占用一个任务的空间
      this.max--

      const task = this.taskList.shift()
      task().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 上面 max-- 占用空间 现在要释放一个任务空间
        this.max++

        // 因为自动执行下面的任务
        this.run()
      })
    }
  }
}

const taskQueue = new TaskQueue()

// 初始化 20 个任务
for(let i = 0; i < 20; i++) {
  const task = createTask(i)

  // 将任务添加到 队列后自动执行
  taskQueue.addTask(task)
}
*/

// 3
/*
// url 7个
const urls = [
  "bytedance.com",
  "tencent.com",
  "alibaba.com",
  "apple.com",
  "hulu.com",
  "amazon.com",
  "microsoft.com"
]

// 需求 3个为一组 看看3个中哪个先完成 3个中完成一个的话 就将这个踢出去从剩下的4个中再追加进来

// 并发的类
class PromisePoll {
  constructor(max, fn) {
    // 最大并发数
    this.max = max
    // 自定义请求函数
    this.fn = fn

    // 并发池 让池子里面始终保持3个
    this.pool = []

    // 剩余的请求地址
    this.urls = []
  }

  start(urls) {
    this.urls = urls

    // 循环把并发池塞满 < 最大并发数就一直往里面塞
    while(this.pool.length < this.max) {

      // 拿到队列前的 url
      let url = this.urls.shift()
      this.setTask(url)
    }

    // 前3个执行完了 需要补充
    // 利用 promise.race 方法 来获取并发池中某个任务完成的信号
    let race = Promise.race(this.pool)
    this.run(race)
  }

  setTask(url) {
    if(!url) return 

    // 让 fn 执行 返回一个 task
    let task = this.fn(url)

    // 将返回的promise -- 任务 推到pool并发吃中
    this.pool.push(task)
    console.log(`${url}开始, 当前的并发数: ${this.pool.length}`)

    task.then(res => {
      // 请求结束 将 该promise任务从并发池中移除
      this.pool.splice(this.pool.indexOf(task), 1)

      console.log(`${url}结束, 当前的并发数: ${this.pool.length}`)
    })
  }

  run(race) {
    // 执行完成
    race.then(res => {
      // 每当并发池中完成一个任务 就再塞入一个任务
      // 到then里面 当前的任务说明成功了 我们就再塞进来一个
      let url = this.urls.shift()
      this.setTask(url)
      this.run(Promise.race(this.pool))
    })
  }

}

// 模拟的异步请求函数
let n = 0
let requestFn = url => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`任务${url}完成`)
    }, 1000 * n++)
  }).then(res => {
    console.log("外部逻辑: ", res)
  })
}
// 并发数为3
const pool = new PromisePoll(3, requestFn)

pool.start(urls)
*/


// 4.
/*
  实现一个 dispatch 函数 可以接受多个函数做为参数 每个函数作为一个任务 并返回一个promise
  限制同时执行的任务次数
*/

/*
  实现一个 dispatch 函数 
  可以接受多个函数做为参数 每个函数作为一个任务 并返回一个promise
  限制同时执行的任务次数
*/

// 每次任务是函数 返回一个 promise
type Task<T = any> = () => Promise<T>

// dispatch函数的类型定义 
// 限制同时执行的任务次数 比如我们传入5个任务 它最大执行数是3 那么只有当前3个任务执行完毕后 才会执行下一个任务
type Dispatch = (...task: Task[]) => void



// 因为我们要定义最大的执行量 这里利用了闭包 捕获 max
function createTaskDispatch(max = 5): Dispatch {

  // 没有被执行到的 tasks
  const untouchedTasks: Task[] = []

  // 声明一个函数让其消耗 untouchedTasks 队列
  // 使用防抖 保证连续调用 drainUntouchedTask 的时候只有后面的一次生效
  const drainUntouchedTask = debounce(() => {
    // 当 数组 > 0 的时候才会一个个取出执行
    while(max > 0 && untouchedTasks.length > 0) {
      // 取出一个任务来执行 当数组长度为0的时候可能会返回null 所以我们要定义 ! 表示确认不为0
      const task = untouchedTasks.shift()!

      /*
        如果我们直接执行 drainUntouchedTask 因为循环它会一直取数组中的task 拿出来执行 执行完所有的 这样起步到限制的作用 所以我们利用 max

        假设我们有10个任务 推到数组中后我们开始 drainUntouchedTask 当 drain5个的时候 max已经减为0了 那么当下一次while循环的时候 发现 max == 0 就不符合条件了 那么整个while 都会被退出

        当task()执行完后 max会加回来 当加回来后我们再次的调用 drainUntouchedTask

        请尝试将 `lib` 编译器选项更改为 es2018 或更高版
      */ 
      // 每当拿出来后 准备执行之前
      max--
      // 执行完后 将max++ 加回来
      task().finally(() => {
        max++

        // 当max加回来后 我们再次的调用 drainUntouchedTask 执行剩下的队列中的任务
      })
    }
  })

  return function dispatch(...task: Task[]): void {
    // 每当执行 dispatch 的时候 将所有的task丢进untouchedTasks
    untouchedTasks.push(...task)

    // 这样有一个问题 每当我们push的时候 都会频繁的调用drainUntouchedTask
    drainUntouchedTask()
  }
} 


// 测试用例
const dispatch = createTaskDispatch(3)

// 该函数会返回一个 promise 8秒后会打印 hello
const sayHello: Task = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("hello")
      resolve()
    }, 800)
  })
}


// 版本2
const sayHello = (num: number): Task => {
  return () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        console.log("hello", num)
        resolve()
      }, 800);
    })
  }
}

dispatch(sayHello, sayHello, sayHello, sayHello, sayHello)
