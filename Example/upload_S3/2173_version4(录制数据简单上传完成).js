
/*
  fileName: 2173_version4

  desc:
    demo阶段 验证下面的代码 配合 后台代码 完成上传文件的逻辑
*/

let axios = require("axios")
let {$} = require("./src/assets/js/utils")

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

// 点击录制按钮所触发的回调
btn.addEventListener("click", async function() {

  // 选择录制区域 补货该区域的视频流 只要视频轨道
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  })

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

    try {
      let {data: res} = await axios({
        url: "http://127.0.0.1:3333/upload",
        method: "post",
        data: formdata
      })

      console.log("res: ", res)

    } catch(err) {
      console.log("error: ", err)
    }
    
  })




  // 2173 task 中我们并不关心 结束录制之后的路径
  mediaRecorder.addEventListener("stop", function() {

    // 清除用于验证时 开启的定时器
    // clearInterval(timer)
    
    console.log("视频录制结束")
  })
  

  // 指定开始录制 并每2000后触发一次dataavailable
  mediaRecorder.start(3000)
})