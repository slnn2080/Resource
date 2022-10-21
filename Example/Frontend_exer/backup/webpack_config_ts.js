const htmlWebpackPlugin = require("html-webpack-plugin")
const {resolve} = require("path")
module.exports = {
  entry: "./index.js",
  output: {
    filename: "build.js",
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env", 
              {
                targets: {
                  "chrome": "58"
                }
              }
            ]
          ],
          // 注意它们两个的配置顺序
          plugins: [
            [
              "@babel/plugin-proposal-decorators",
              {"legacy": true}
            ],
            [
              "@babel/plugin-proposal-class-properties",
              { "loose": false }
            ]
          ]
        }
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: "url-loader",
        // loader的配置项
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: "[name].[ext]"
        },
      },
      {
        test: /\.css$/,
        use:[
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        // 排除 正则匹配的文件 相当于打包其他资源
        exclude: /\.(css|js|html)$/,
        // 其他资源都会通过file-loader来处理
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]"
        }
      }

    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./upload_demo.html"
    })
  ],
  mode: "development",
  devServer: {
    // 项目构建后的路径
    contentBase: resolve(__dirname, "build"),
  
    // 端口号
    port: 3001,
  
    // 启动 gzip 压缩
    compress: true,
  
    // 自动打开浏览器
    open: true,
  }
}