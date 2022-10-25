/*
  fileName: 2173_part6

  desc:
    开启验证队列上传逻辑 这个部分并没有加入并发控制 仅仅是在 do while 从队列中取出item执行上传
    在停止上传的部分 调用清空队列的逻辑


  完成:
    这个版本应该是可以进行 队列上传的逻辑 同时也测试了在内存中能存储的情况 2.25 小时 754MB

    下个版本 要改造清理队列部分的逻辑 同时 看看技巧笔记中 并发2 的逻辑 看看能不能改造下
    现在的写法不太好



  测试描述部分:
    网络好的时候 可以正常的依次上传

    网络不好的时候 dataavailable 会一直往队列中推 当part4断网的时候 part4会上传失败
    这时候会循环上传part4 通过队列中的item会不断的增加
    当恢复网络的时候 会再从队列中取出item来执行上传 但是当停止上传的时候 队列中还有残余


    这里还要解决 在停止上传的时候 队列中的残余问题
      该问题已经解决 在 stop 里对应写了逻辑


  测试方式:
    选择区域
    开始上传
    然后断网
    恢复网络
    点击停止录制

    观察 queue 的情况
    
  
  真实项目中的内存情况:
    280MB 大概是一个小时左右

  这个演示项目的内容情况
    一共测试了 2.25 小时 一共在内存中缓存了 754MB 没有问题
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

    // 将上传逻辑 放到队列中
    queue.push({part: partNum++, flag: false, size: webm.size, fn: fn(formdata)})
    console.log("队列中的元素有: \t", queue)

    // 用于查看队里中文件的大小
    let total = queue.reduce((pre, item) => pre + item.size, 0)
    console.log("queue的总大小: ", (total / 1024 / 1024).toFixed(2) + "MB")

    do {
      try {

        if(!temp) {
          temp = queue.shift()
          console.log("进入到 if 逻辑: \t", temp)

          let res = await temp.fn()
           // 一旦出错后 下面的逻辑都不会执行 而是到 catch中
          console.log("上传成功后的res: \t", res)

          temp.flag = true
          console.log("上传成功后的temp:", temp)
          console.log("")
          temp = null
          break
        } else if(temp && !temp?.flag){
          console.log("")
          console.log("进入到 else if 逻辑")
          console.log("失败后的temp: \t", temp)

          let res = await temp.fn()
          console.log("再次上传的res: \t", res)
          console.log("")
          temp.flag = true
          temp = null
          break
        }

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
  mediaRecorder.addEventListener("stop", async function() {

    // 清除用于验证时 开启的定时器
    clearInterval(timer)
    console.log("")
    console.log("视频录制结束")
    console.log("开始进行最后的清理操作")

    // 在停止录制的时候 应该判断队列中是否有item 如果有开启循环上传
    if(queue.length > 0) {

      // 循环做清理队列的逻辑 这个部分可以优化
      for(let i = 0; i < queue.length; i++) {
        let item = queue[i]

        do {
          try {
            let res = await item.fn()
            console.log("清理工作 -- ", res)
            await sleep(1000)
            break
          } catch(err) {
            if(err.message == "Network Error") {
              await sleep(1000)
              continue
            }
          }
        } while(true)
        
      }

      queue = []
    }
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
