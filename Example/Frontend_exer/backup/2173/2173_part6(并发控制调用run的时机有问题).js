/*
  fileName: 2173_part6

  desc:
    开启验证队列上传逻辑

  
*/

let axios = require("axios")
let {$, sleep} = require("./src/assets/js/utils")

let btn = $(".record-btn")

// 创建 chunks 数组 用来存放 录制视频的数据 
let chunks = []

// 视频的标识 这里做为了文件名
let partNumber = 1

// 视频的标识 这里做为了console面板 不能使用上面的 因为多次++
let partNum = 1

// 视频的类型
let type = "video/webm;codecs=vp9"

// 视频的类型 拿到全局是为了让 stop 中也能用到
let mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm"


// 队列上传逻辑部分:
// 定义队列上传时所需要的变量
let queue = []
let temp = null

let flag = false

let seconds = 0
let timer = setInterval(() => {
  seconds++
}, 1000)


// Queue类
class TaskQueue {

  constructor() {
    this.max = 2
    this.taskList = []

    // setTimeout(() => {
    //   this.run()
    // })
  }

  addTask(task) {
    this.taskList.push(task)
  }

  async run() {
    console.log("run方法执行了")

    const length = this.taskList.length
    if(!length) return

    const min = Math.min(this.max, length)

    for(let i = 0; i < min; i++) {
      this.max--

      const task = this.taskList.shift()

      try {
        let res = await task.fn()
        console.log(`上传的结束时间: ${seconds}, 上传结果: 文件名: ${res.fileName} -- ${res.msg}`)
        console.log("")

      } catch(err) {
        if(err.message == "Network Error") {
          // 如果是 Network Error 的情况下 让它 continue 如果直接continue会刷屏上传 所以让它睡一秒
          await sleep(1000)
          continue
        }
      } finally {
        this.max++
        this.run()
      }
    }
  }
}


// 点击录制按钮所触发的回调
btn.addEventListener("click", async function() {

  // 选择录制区域 补货该区域的视频流 只要视频轨道
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  })

  const taskQueue = new TaskQueue()

  // let seconds = 0
  // let timer = setInterval(() => {
  //   seconds++
  // }, 1000)

  // 判断浏览器是否支持该类型 做判断处理
  let mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm"

  // 拿到record的实例对象 用于获取录制数据 传入录制数据的类型
  let mediaRecorder = new MediaRecorder(stream, {
    mimeType: mime
  })

  // dataavailable start(2000)该方法中指定了多少秒后 调用一次dataavailable方法
  mediaRecorder.addEventListener("dataavailable", async function(e) {

    console.log("dataavailable --- 触发了")

    // 每次触发 dataavailable 事件后 将这一个部分的 data 上传到服务器
    chunks.push(e.data)

    // 每次将 chunks 中的数据封装成 blob 对象后清空 chunks
    let webm = new Blob(chunks, {type})
    chunks = []

    let formdata = new FormData()
    formdata.append("filename", partNumber++)
    formdata.append("filetype", type)
    formdata.append("file", webm)

    // do {
    //   try {
    //     let {data: res} = await request({
    //       method: "post",
    //       data: formdata
    //     })
    
    //     console.log(`上传的结束时间: ${seconds}, 上传结果: 文件名: ${res.fileName} -- ${res.msg}`)
    //     console.log("")
  
    //     break
    //   } catch(err) {
    //     if(err.message == "Network Error") {
    //       // 如果是 Network Error 的情况下 让它 continue 如果直接continue会刷屏上传 所以让它睡一秒
    //       await sleep(1000)
    //       continue
    //     }
    //   }
    // } while(true)

    taskQueue.addTask({part: partNum++, fn: fn(formdata)})
  })




  // 2173 task 中我们并不关心 结束录制之后的路径
  mediaRecorder.addEventListener("stop", function() {

    // 清除用于验证时 开启的定时器
    clearInterval(timer)
    
    console.log("视频录制结束")
  })
  

  // 指定开始录制 并每2000后触发一次dataavailable
  mediaRecorder.start(2000)
})



// 工具函数

// 返回一个函数 调用内层函数后 会发起请求 以promise形式拿到结果
function fn(formdata) {
  return function() {
    return new Promise(resolve => {
      axios({
        url: "http://127.0.0.1:3333/upload",
        method: "post",
        data: formdata
      }).then(res => {
        resolve(res.data)
      })
    })
  }
}

function request(config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:3333/upload',
    timeout: 5000
  })

  return instance(config)
}
