const webpack = require('webpack')
const getConfig = require('hjs-webpack')
const path = require('path')

// Helpers for file traversing
const join = path.join
const resolve = path.resolve
const root = resolve(__dirname)
const src = join(root, 'src/')
const build = join(root, 'build')

// Flags for environment management
const NODE_ENV = process.env.NODE_ENV || 'development'
const isDev = NODE_ENV !== 'production'
const isUniversal = NODE_ENV === 'universal'

// Generate the base webpack config
let config = getConfig({
  isDev: isDev,
  in: join(src, 'index.js'),
  out: build,
  devServer: {
    port: process.env.NODE_PORT || 9001
  },
  clearBeforeBuild: NODE_ENV !== 'universal',
  output: {
    filename: isDev ? '[name].js' : '[name].[chunkhash].js',
    cssFilename: isDev ? '[name].css' : '[name].[contenthash].css'
  },
  node: {
    fs: 'empty',
    net: 'empty',
    child_process: 'empty',
    tls: 'empty'
  },
  target: 'node'
})

config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
  'process.env.SDK': JSON.stringify({
    REST: process.env.SDK_REST || undefined,
    SOCKET: process.env.SDK_SOCKET || undefined,
    FILE_UPLOAD: process.env.SDK_FILE_UPLOAD || undefined,
    FILE_DOWNLOAD: process.env.SDK_FILE_DOWNLOAD || undefined,
    APP: process.env.SDK_APP || undefined
  }),
  'process.env.APP_HOST': JSON.stringify(process.env.APP_HOST || 'http://app.calponia.d3v'),
  'process.env.APP_SOCKET': JSON.stringify(process.env.APP_SOCKET || 'ws://app.calponia.d3v')
}))

// Split our code and vendor code into two bundles
config.plugins.push(new webpack.HashedModuleIdsPlugin())
config.plugins.push(new (require('webpack-chunk-hash'))())
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}))
config.entry = {
  vendor: ['react', 'react-dom'],
  main: config.entry
}

// Remove the CSS loader that is included by hjs-webpack
config.module.rules = config.module.rules.filter(rule => {
  return !rule.test.toString().includes('.css')
})

// Write our own CSS loader to support CSS modules
const cssLoaders = [
  {
    loader: 'css-loader',
    options: {
      modules: true,
      minimize: true,
      localIdentName: isDev && !isUniversal
        ? '[path][name]__[local]__[hash:base64:5]'
        : '[hash:base64:5]'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [
        // Report errors when bundling
        require('postcss-reporter'),

        // Inline @import css files instead of generating multiple files
        require('postcss-import')({path: [src]}),

        // Auto-prefixing, new css features (e.g. variables)
        require('postcss-cssnext')()
      ]
    }
  }
]

const rule = isDev
  ? [{loader: 'style-loader'}].concat(cssLoaders)
  : require('extract-text-webpack-plugin').extract({fallback: 'style-loader', use: cssLoaders})

config.module.rules.push({
  test: /\.css$/,
  use: rule
})

// Generate the HTML output
config.plugins.push(new (require('html-webpack-plugin'))({
  title: 'Porsche Connectivity',
  template: join(src, 'index.html'),
  minify: {collapseWhitespace: true, removeRedundantAttributes: true},
  cache: false
}))

/* // Copy files from src/files/ into the output directly (e.g. for favicons)
config.plugins.push(new (require('copy-webpack-plugin'))([
  {from: join(src, 'files/'), to: build}
])) */

// Export the finished config!
module.exports = config
