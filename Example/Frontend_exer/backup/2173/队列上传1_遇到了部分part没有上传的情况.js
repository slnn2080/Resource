let axios = require("axios")
let {$, sleep} = require("./src/assets/js/utils")

let div = document.createElement("div")
let body = document.body
body.appendChild(div)

let btn = $(".record-btn")

let chunks = []
let count = 1
// let setTimeoutCount = 1

let partNumber = 1
let partNum = 1

let type = "video/webm;codecs=vp9"

let queue = []
// let cbs = []
let temp = null


btn.addEventListener("click", async function() {

  let seconds = 0
  let timer = setInterval(() => {
    seconds++
    // div.innerHTML = seconds
  }, 1000)

  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  })

  let mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm"

  let mediaRecorder = new MediaRecorder(stream, {
    mimeType: mime
  })

  

  mediaRecorder.addEventListener("dataavailable", async function(e) {


    // chunks.push(e.data)
    console.log(`dataavailable事件在第 ${seconds} 秒的时候触发了 ${count++} 次`)

    // let str = await notify()
    // console.log(`在 第 ${seconds} 秒 的时候输出 await --- : ${str}`)
    // console.log("")

    // 每次触发 dataavailable 事件后 将这一个部分的 data 上传到服务器
    chunks.push(e.data)
    // type = chunks[0].type
    let webm = new Blob(chunks, {type})
    chunks = []

    let formdata = new FormData()
    formdata.append("filename", partNumber++)
    formdata.append("filetype", type)
    formdata.append("file", webm)

    // 将上传逻辑 放到队列中
    queue.push({part: partNum++, flag: false, fn: fn(formdata)})
    console.log("队列中的元素有: \t", queue)


    // 循环上传队列
    do {

      try {

        // 在 temp: null 的时候先从队列中取出一个 part
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
          await sleep(1000)
          continue
        }

      }

    } while(true)

    // do {

    //   /*
    //     队列的思考:
    //       现在我要将 上传的request 封装到一个队列中去
    //       1. 执行队列 会封装一个方法
    //       2. push队列也是一个方法 在这个方法里面 调用执行队列的方法
    //   */
    //   try {

    //     let {data: res} = await request({
    //       method: "post",
    //       data: formdata
    //     })
    //     console.log(`上传后的时间是: ${seconds}, 上传的结果为: ${res.msg} - ${res.partNumber}`)
    //     console.log("")

    //     break
        
    //   } catch(err) {

    //     // console.log("error: ", err.message) // "Network Error"
    //     if(err.message == "Network Error") {
          
    //       // 如果是 Network Error 的情况下 让它 continue 如果直接continue会刷屏上传 所以让它睡一秒
    //       await sleep(1000)
    //       continue
    //     }
    //   }

    // } while(true)
  })

  mediaRecorder.addEventListener("stop", function() {

    clearInterval(timer)

    // let blob = new Blob(chunks, {
    //   type
    // })

    // let url = URL.createObjectURL(blob)
    // let video = document.querySelector(".video")
    // video.src = url
  })
  

  mediaRecorder.start(5000)
})

/*
  验证6: 
    循环上传中 如果没有对发生错误的时候的 part 做处理 那么它们会被忽略上传
    1-4, 9-14

  验证7:
    开启循环上传后的 错误处理 

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


  验证8: 
    开启队列上传模式 查看结果
*/






function fn(formdata) {
  return function() {
    return new Promise(resolve => {
      axios({
        url: "http://127.0.0.1:3000/upload",
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
    baseURL: 'http://127.0.0.1:3000/upload',
    timeout: 5000
  })

  return instance(config)
}

