const {resolve} = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
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
              "@babel/preset-env", {
                targets: {
                  "chrome": "58", 
                  "ie": "11", 
                  "firefox": "60", 
                  "safari": "11", 
                  "edge": "11"
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        oneOf: [
          {
            test: /\.(jpg|png|gif)$/,
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
              esModule: false,
              name: "[name].[ext]"
            },
          },
          {
            test: /\.html$/,
            loader: "html-loader",
          },
          {
            exclude: /\.(css|js|html)$/,
            loader: "file-loader",
            options: {
              esModule: false,
              name: "[hash:10].[ext]"
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./media_recorder.html",
      title: "多图片上传"
    })
  ],
  mode: "development",
  devServer: {
    contentBase: resolve(__dirname, "build"),
    compress: true,
    port: 3001
  },
  devtool: "inline-source-map"
}