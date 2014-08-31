var webpack = require('webpack');
var ReloadPlugin = require('webpack-reload-plugin');
var path = require('path');

// Support for extra commandline arguments
var argv = require('optimist')
            //--env=XXX: sets a global ENV variable (i.e. window.ENV="XXX")
            .alias('e','env').default('e','dev')
            //--minify:  minifies output
            .alias('m','minify')
            .argv;

var config = {
  context: __dirname,
  entry: './js/app.js',
  output:{
    path: './js',
    filename: 'bundle.js',
    publicPath: '../'
  },
  devServer: {
    publicPath: '/'
  },
  reload: isDevServer()? 'localhost': null,
  module:{
    loaders:[
      { test: /\.css$/,             loader: "style-loader!css-loader" },
      { test: /index\.html$/,       loader: "file-loader?name=[path][name].[ext]&context=./src" },
      { test: /const(ants)?\.js$/,  loader: "expose?CONST" }
    ]
  },
  plugins:[
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
      ENV: JSON.stringify(argv.env)
    }),
    new ReloadPlugin()
  ]
};

if(argv.minify){
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle:false}));
}

function isDevServer(){
  return process.argv.join('').indexOf('webpack-dev-server') > -1;
}

module.exports = config;


