/*
  fileName: 2173_version5

  desc:
    模拟upload文件的上传方式

  情况1: 没有进行错误处理 
    开启循环上传 
    循环上传中 如果没有对发生错误的时候的 part 做处理 那么它们会被忽略上传
    1-4, 9-14

  情况2: 进行错误处理 
    开始的时候 没有断网 正常上传 1-8
    当 9 的时候断网
      当次 上传失败 然后2秒后10开始尝试上传 失败 2秒后11开始尝试上传 失败
      也就是说 后续的part都会尝试上传

    当 恢复 网络的时候 9 - 13 上传成功



    dataavailable事件在第 3 秒的时候触发了 1 次
    上传后的时间是: 3, 上传的结果为: 上传成功 - 1.webm
    
    dataavailable事件在第 5 秒的时候触发了 2 次
    上传后的时间是: 5, 上传的结果为: 上传成功 - 2.webm
    
    dataavailable事件在第 7 秒的时候触发了 3 次
    上传后的时间是: 7, 上传的结果为: 上传成功 - 3.webm
    
    dataavailable事件在第 9 秒的时候触发了 4 次
    上传后的时间是: 9, 上传的结果为: 上传成功 - 4.webm
    
    dataavailable事件在第 11 秒的时候触发了 5 次
    上传后的时间是: 11, 上传的结果为: 上传成功 - 5.webm
    
    dataavailable事件在第 13 秒的时候触发了 6 次
    上传后的时间是: 13, 上传的结果为: 上传成功 - 6.webm
    
    dataavailable事件在第 15 秒的时候触发了 7 次
    上传后的时间是: 15, 上传的结果为: 上传成功 - 7.webm
    
    dataavailable事件在第 17 秒的时候触发了 8 次
    上传后的时间是: 17, 上传的结果为: 上传成功 - 8.webm
    
    dataavailable事件在第 19 秒的时候触发了 9 次
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED

    dataavailable事件在第 21 秒的时候触发了 10 次
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED

    dataavailable事件在第 23 秒的时候触发了 11 次
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED

    dataavailable事件在第 25 秒的时候触发了 12 次
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED

    dataavailable事件在第 27 秒的时候触发了 13 次
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
      POST http://127.0.0.1:3000/upload net::ERR_INTERNET_DISCONNECTED
    

    上传后的时间是: 29, 上传的结果为: 上传成功 - 9.webm
    上传后的时间是: 29, 上传的结果为: 上传成功 - 10.webm
    上传后的时间是: 29, 上传的结果为: 上传成功 - 11.webm
    上传后的时间是: 29, 上传的结果为: 上传成功 - 12.webm
    上传后的时间是: 29, 上传的结果为: 上传成功 - 13.webm
    

    dataavailable事件在第 29 秒的时候触发了 14 次
      上传后的时间是: 29, 上传的结果为: 上传成功 - 14.webm
    
    dataavailable事件在第 32 秒的时候触发了 15 次
      上传后的时间是: 32, 上传的结果为: 上传成功 - 15.webm
    
    dataavailable事件在第 34 秒的时候触发了 16 次
      上传后的时间是: 34, 上传的结果为: 上传成功 - 16.webm
    
    dataavailable事件在第 36 秒的时候触发了 17 次
      上传后的时间是: 36, 上传的结果为: 上传成功 - 17.webm
    
    dataavailable事件在第 38 秒的时候触发了 18 次
      上传后的时间是: 38, 上传的结果为: 上传成功 - 18.webm
    
    dataavailable事件在第 40 秒的时候触发了 19 次
      上传后的时间是: 40, 上传的结果为: 上传成功 - 19.webm
    
    dataavailable事件在第 42 秒的时候触发了 20 次
      上传后的时间是: 42, 上传的结果为: 上传成功 - 20.webm
    
    dataavailable事件在第 43 秒的时候触发了 21 次
      上传后的时间是: 43, 上传的结果为: 上传成功 - 21.webm
*/

let axios = require("axios")
let {$, sleep} = require("./src/assets/js/utils")

let btn = $(".record-btn")

// 创建 chunks 数组 用来存放 录制视频的数据 
let chunks = []

// 视频的标识 这里做为了文件名
let partNumber = 1

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



// 点击录制按钮所触发的回调
btn.addEventListener("click", async function() {

  // 选择录制区域 补货该区域的视频流 只要视频轨道
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  })

  let seconds = 0
  let timer = setInterval(() => {
    seconds++
  }, 1000)

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

    // 每次触发 dataavailable 事件后 将这一个部分的 data 上传到服务器
    chunks.push(e.data)

    // 每次将 chunks 中的数据封装成 blob 对象后清空 chunks
    let webm = new Blob(chunks, {type})
    chunks = []

    let formdata = new FormData()
    formdata.append("filename", partNumber++)
    formdata.append("filetype", type)
    formdata.append("file", webm)

    do {
      try {
        let {data: res} = await request({
          method: "post",
          data: formdata
        })
    
        console.log(`上传的结束时间: ${seconds}, 上传结果: 文件名: ${res.fileName} -- ${res.msg}`)
        console.log("")
  
        break
      } catch(err) {
        if(err.message == "Network Error") {
          // 如果是 Network Error 的情况下 让它 continue 如果直接continue会刷屏上传 所以让它睡一秒
          await sleep(1000)
          continue
        }
      }
    } while(true)
    
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
