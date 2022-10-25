const express = require("express")
const {resolve} = require("path")
const router = express.Router()

router.get("/upload", (req, res) => {

  res.json({
    code: 200,
    msg: "get上传接口登录成功"
  })
})

let num = 1
router.post("/upload", (req, res) => {
  

  // file相关的属性是在 body 参数中
  let {filename} = req.body
  // file相当数据是在 files 中
  let {file: {data, mv, size}} = req.files

  // 从 req.files 能解构出如下属性
  // console.log(data) // buf
  // console.log(name) // movie.mp4
  // console.log(size) // 3624406
  // console.log(mimetype) // video/mp4

  filename = filename + ".webm"
  console.log("上传了" + filename + "文件大小: ", (size / 1024 / 1024).toFixed(2))

  let filePath = resolve(__dirname, "../", "public/media/", filename)
  // console.log(filePath) // D:\Sam\Backend_exer\public\media\movie.mp4

  mv(filePath, err => {
    if(err) {
      console.log("err: ", err)
      res.json({code: 400, msg: "文件上传失败"})
      return
    }

    res.json({
      code: 200,
      msg: "上传文件成功",
      fileName: filename,
      filePath: `http://localhost:3333/media/${filename}`
    })
  })

  // res.send({
  //   msg: "test"
  // })
})

module.exports = router