const express = require("express")
const cors = require("cors")
const uploader = require("express-fileupload")
const uploadRouter = require("./router/uploader")

const app = express()
app.use(cors())
app.use(uploader())
app.use(uploadRouter)

app.use(express.static(__dirname + "/public"))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.listen(3333, () => {
  console.log("server is running at http://localhost:3333")
})