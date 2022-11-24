/*
  fileName: 2173_version2

  验证:
    dataavailable的事件回调 和 setTimeout 是否在一个队列中排队

  结论:
    不是！
    每2秒会触发一次 dataavailable 它里面会执行 notify() 
    notify()中 直接就是 setTimeout 

    注意part2的测试中并没有使用 async await 我们看下执行结果

        测试用定时器第0 秒
        测试用定时器第1 秒
        dataavailable事件在第 2 秒的时候触发了 1 次

        测试用定时器第2 秒
        测试用定时器第3 秒
        dataavailable事件在第 4 秒的时候触发了 2 次

        测试用定时器第4 秒
        第 1 的3000的setTimout

        测试用定时器第5 秒
        dataavailable事件在第 6 秒的时候触发了 3 次

        测试用定时器第6 秒
        第 2 的3000的setTimout

        测试用定时器第7 秒
        dataavailable事件在第 8 秒的时候触发了 4 次
        dataavailable事件在第 8 秒的时候触发了 5 次
        视频录制结束
        
        第 3 的3000的setTimout
        第 4 的3000的setTimout
        第 5 的3000的setTimout


    我们能够发现 dataavailable只是负责执行 并往任务队列中推 setTimeout  
    setTimeout的执行会根据它们自己的排队时间 夹杂着执行

    也就是说 dataavailable 和 setTimeout 相当于两条车道同时在走 谁的时间先到了 谁就执行
*/

let axios = require("axios")
let {$} = require("./src/assets/js/utils")

let btn = $(".record-btn")

// 创建 chunks 数组 用来存放 录制视频的数据 
let chunks = []

// 用于测试 dataavailable 方法调用的次数
let count = 1

// 用于测试 notify 相关
let setTimeoutCount = 1


// 视频的标识 这里做为了文件名
let partNumber = 1

// 视频的类型
let type = "video/webm;codecs=vp9"

// 视频的类型 拿到全局是为了让 stop 中也能用到
let mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm"

// 点击录制按钮所触发的回调
btn.addEventListener("click", async function() {

  // 选择录制区域 补货该区域的视频流 只要视频轨道
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  })

  // 尝试1用: 当点击 录制按钮的时候启动计时器  seconds 就是秒数 用于验证 dataavailable 是不是每指定秒数后触发一次
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
  mediaRecorder.addEventListener("dataavailable", async function(e) {

    console.log(`dataavailable事件在第 ${seconds} 秒的时候触发了 ${count++} 次`)
    notify()

  })




  // 2173 task 中我们并不关心 结束录制之后的路径
  mediaRecorder.addEventListener("stop", function() {
    // 清除用于验证时 开启的定时器
    clearInterval(timer)
    console.log("视频录制结束")
  })
  

  // 指定开始录制 并每3000后触发一次dataavailable
  mediaRecorder.start(3000)
})


// 内部封装了 3000 的setTimeout 调用notify的时候 就会向执行setTimeout
function notify() {
  
  setTimeout(() => {
    console.log(`第 ${setTimeoutCount++} 的3000的setTimout`)
  }, 3000)
  
}
