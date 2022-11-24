/*
  fileName: 2173_version3

  验证:
    在 part2 的基础上 在 dataavailable 事件 和 notify 之间使用 async await 查看结果是否有变化

  结论:
    添加 await 后 确实 dataavailable 和 notify 之间会排队等待

    输出顺序规整很多了  其实感觉和不加await的规律差不多

      dataavailable事件在第 4 秒的时候触发了 1 次
      第一次的await str输出放在了 第二个dataavailable事件触发中

      dataavailable事件在第 7 秒的时候触发了 2 次
      在 第 7 秒 的时候输出 await --- : 第 1 的3000的setTimout

      dataavailable事件在第 10 秒的时候触发了 3 次
      在 第 10 秒 的时候输出 await --- : 第 2 的3000的setTimout

      dataavailable事件在第 12 秒的时候触发了 4 次
      在 第 13 秒 的时候输出 await --- : 第 3 的3000的setTimout

      dataavailable事件在第 15 秒的时候触发了 5 次
      在 第 15 秒 的时候输出 await --- : 第 4 的3000的setTimout

      dataavailable事件在第 17 秒的时候触发了 6 次
      在 第 18 秒 的时候输出 await --- : 第 5 的3000的setTimout

      dataavailable事件在第 20 秒的时候触发了 7 次
      在 第 20 秒 的时候输出 await --- : 第 6 的3000的setTimout

      dataavailable事件在第 22 秒的时候触发了 8 次
      在 第 23 秒 的时候输出 await --- : 第 7 的3000的setTimout

      dataavailable事件在第 24 秒的时候触发了 9 次
      在 第 25 秒 的时候输出 await --- : 第 8 的3000的setTimout

      dataavailable事件在第 26 秒的时候触发了 10 次
      在 第 27 秒 的时候输出 await --- : 第 9 的3000的setTimout

      dataavailable事件在第 29 秒的时候触发了 11 次
      在 第 29 秒 的时候输出 await --- : 第 10 的3000的setTimout

      dataavailable事件在第 31 秒的时候触发了 12 次
      在 第 32 秒 的时候输出 await --- : 第 11 的3000的setTimout

      dataavailable事件在第 33 秒的时候触发了 13 次
      在 第 33 秒 的时候输出 await --- : 第 12 的3000的setTimout

      在 第 33 秒 的时候输出 await --- : 第 13 的3000的setTimout

------

    如果 await 的时间比 dataavailable 要长 它会等到 执行次数dataavailable的事件触发的时候再执行
      dataavailable事件在第 4 秒的时候触发了 1 次
      dataavailable事件在第 6 秒的时候触发了 2 次

      dataavailable事件在第 9 秒的时候触发了 3 次
      在 第 9 秒 的时候输出 await --- : 第 1 的5000的setTimout

      dataavailable事件在第 11 秒的时候触发了 4 次
      在 第 11 秒 的时候输出 await --- : 第 2 的5000的setTimout

      dataavailable事件在第 13 秒的时候触发了 5 次
      在 第 14 秒 的时候输出 await --- : 第 3 的5000的setTimout

      dataavailable事件在第 16 秒的时候触发了 6 次
      在 第 16 秒 的时候输出 await --- : 第 4 的5000的setTimout

      dataavailable事件在第 18 秒的时候触发了 7 次
      在 第 18 秒 的时候输出 await --- : 第 5 的5000的setTimout

      dataavailable事件在第 20 秒的时候触发了 8 次
      在 第 21 秒 的时候输出 await --- : 第 6 的5000的setTimout

      dataavailable事件在第 21 秒的时候触发了 9 次
      在 第 21 秒 的时候输出 await --- : 第 7 的5000的setTimout

    当事件结束的时候 剩下的 await 输出会补回执行
      在 第 21 秒 的时候输出 await --- : 第 8 的5000的setTimout

      在 第 21 秒 的时候输出 await --- : 第 9 的5000的setTimout
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
    console.log("测试用定时器第" + seconds + " 秒")
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

    let str = await notify()
    console.log(`在 第 ${seconds} 秒 的时候输出 await --- : ${str}`)
    console.log("")

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


function notify() {
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`第 ${setTimeoutCount++} 的3000的setTimout`)
    }, 3000)
  })
  
}