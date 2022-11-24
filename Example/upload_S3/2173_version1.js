/*
  fileName: 2173_version1

  desc:
    简单的构建 视频录制 上传数据到服务端的基本流程

  验证:
    dataavailable 确实是指定 毫秒后 触发一次

  结论:
    1. 程序会在start(2000)指定秒数后 dataavailable 会触发一次

    2. 当最后我们点击停止录制的时候 马上会再次触发一次 dataavailable 方法

    3. mediaRecorder.state 
      在录制的时候为 recording
      在点击停止时为 inactive

    4. e.data
      Blob: {
        size: 32042
        type: "video/webm;codecs=vp9"
      }
*/

let axios = require("axios")
let {$} = require("./src/assets/js/utils")
let btn = $(".record-btn")


// 视频的类型
let type = "video/webm;codecs=vp9"

// 视频的类型 拿到全局是为了让 stop 中也能用到
let mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm"

// 点击录制按钮所触发的回调
btn.addEventListener("click",async function() {

  // 选择录制区域 补货该区域的视频流 只要视频轨道
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  })

  // 验证用: 当点击 录制按钮的时候启动计时器  seconds 就是秒数 用于验证 dataavailable 是不是每指定秒数后触发一次
  let seconds = 0
  let timer = setInterval(() => {
    console.log("测试用定时器开启！", seconds)
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
  mediaRecorder.addEventListener("dataavailable", function(e) {

    console.log(`dataavailable事件在第 ${seconds} 秒的时候触发了 ${count++} 次`)
    console.log("mediaRecorder.state: ", mediaRecorder.state)
    console.log(e.data)
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