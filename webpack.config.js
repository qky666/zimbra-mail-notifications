var webpack = require('webpack')
var path = require('path')

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
  }
}

module.exports = config