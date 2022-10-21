let uploadBox = document.querySelector(".uploadBox")
let btn = document.querySelector(".button")
let oInp = document.querySelector("#uploadInp")


// 点击 button 按钮之后 调出 文件选择框
btn.addEventListener("click", function() {
  oInp.click()
})

// 给 文件input 绑定change事件
oInp.addEventListener("change",async function() {
  // 多图上传 获取文件 类数组 列表
  let files = Array.from(this.files)


  // 如果没有选择文件 return
  if(files.length == 0) return


  // 当我们在 文件选择 弹窗里 选择多少文件 创建多少 card
  // 构建上传列表 成员是 {file: , base64: card: }
  let uploadList = []


  // 将选择的文件 添加到 上传列表中(该列表就是上传的参数列表)
  files.forEach((file, index) => {
    uploadList[index] = {
      file: file,
      base64: null,
      card: null
    }
  })


  // 获取 base64 和 动态创建 card
  /*
    将上传文件列表中的每一个文件 通过异步方法读成base64 我们要将10个文件都读取完了之后 统一做什么样的处理 这就需要并行处理 Promise.all() 方法

    files.map(file => readerFile(file))
    map会返回一个数组 里面全是promise: [p1, p2, ...] 
    
    Promise.all() 会等里面的promise都resolve才会返回结果
    这里的顺序还是按照files文件的顺序 这就是 Promise.all 的特点

    Promise.all()本身返回的也是 promise 所以我们用 await 接收最后的结果
  */
  let base64List = await Promise.all(files.map(file => readerFile(file)))

  // 下面我们会根据 多少base64 创建对应的node节点 每创建一次 往页面添加一次不好 回流次数太多 这里我们利用文档碎片
  let frag = document.createDocumentFragment()

  // files有多少文件 这里就会有 多少base64 数量是一一对应的
  base64List.forEach((base64, index) => {
    
    // 我们这里根据 多少base64 创建对应的 card
    let card = document.createElement("div")
    card.className = "card"

    // 添加 card 里面结构
    card.innerHTML = `
      <img src="${base64}" alt="">
      <div class="progress">
        <div class="line"></div>
      </div>
      <div class="mark"></div>
    `

    // 将创建的节点 先放到文档碎片中
    frag.appendChild(card)

    // 完善上传列表
    uploadList[index].base64 = base64
    uploadList[index].card = card
  })

  // 最后都处理好了 我们将文件碎片中的node 一次性的添加到指定节点中
  uploadBox.appendChild(frag)
  

  // 按照上传列表 批量上传图片 && 监听进度
  // 使用 base64 的方法上传 注意请求头和url编码格式的请求体
  uploadList.forEach(async item => {
    let {file, base64, card} = item

    // 接口中需要 chunk 和 filename
    let params = {
      chunk: encodeURIComponent(base64),
      filename: file.name
    }

    let {data: res} = await axios({
      url: "http://127.0.0.1:3000/single2",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      // 创建进度监测
      onUploadProgress(e) {
        // e.loaded: 已经加载的
        // e.total: 总共要加载多少
        let radio = e.loaded / e.total * 100 + "%"

        // 控制 card 下的 progress 下的 line 盒子
        card.querySelector(".line").style.width = radio
      },
      // headers指定的 url编码格式 我们的 data 请求体 也要通过 Qs 转换为 url编码格式
      data: Qs.stringify(params)
    })

    // 上传成功
    if(res.code == 200) {
      let progress = card.querySelector(".progress")
      let mark = card.querySelector(".mark")

      // 隐藏
      // progress.style.display = "none"
      // mark.style.display = "none"

      // 或者移除
      card.removeChild(progress)
      card.removeChild(mark)
    }
  })

})


// 延迟函数: 目的在 delay() 方法没有执行完后 后面的逻辑不执行
function delay(ms = 500) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// 读取文件成 base64
function readerFile(file) {
  return new Promise((resolve, reject) => {

    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function() {
      resolve(this.result)
    }

    reader.onerror = function(err) {
      reject(err)
    }
  })
}
