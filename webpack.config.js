var webpack = require('webpack')
var path = require('path')

var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfigPopup = new HtmlWebpackPlugin({
  title: 'Zimbra Mail Notifications - Popup',
  template: path.join(__dirname, 'src', 'html', 'popup.html'),
  filename: path.join('..','html','popup.html'),
  inject: 'body',
  chunks: ['popup']
})

var HTMLWebpackPluginConfigOpciones = new HtmlWebpackPlugin({
  title: 'Zimbra Mail Notifications - Opciones',
  template: path.join(__dirname, 'src', 'html', 'opciones.html'),
  filename: path.join('..','html','opciones.html'),
  inject: 'body',
  chunks: ['opciones']
})


var config = {
  entry: {
    background: path.join(__dirname, "src", "background.js"),
    popup: path.join(__dirname, "src", "popup.js"),
    opciones: path.join(__dirname, "src", "opciones.js")
  },
  output: {
    path: path.join(__dirname,"build","js"),
    filename: '[name]-bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : path.join(__dirname,"src"),
        loader : 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  plugins: [HTMLWebpackPluginConfigPopup, HTMLWebpackPluginConfigOpciones]
}

module.exports = config