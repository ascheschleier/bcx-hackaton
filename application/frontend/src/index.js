import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/App'
import './index.css'
import cookie from './cookie'
import './sdk'
const { credential, defaults } = window.calponia

credential(cookie.get('calponia')
  ? cookie.get('calponia').accessToken
  : { id: '4Y8P9hCxTFxnNlfVXEaieqDDuAu59AhIQciCXb9tHnfovbR7UvtJ8yd4N6A9GRIK', userId: '596d1c30854359001fcc72e4' })

// const [, HOST] = window.location.host.match(/.*app\.(.*)/) || []
const HOST = "calponia-bcx.de"
const sdkSettings = HOST ? {
  REST: `https://api-internal.${HOST}`,
  SOCKET: `${/^https/.test(window.location.protocol) ? 'wss' : 'ws'}://api-internal.${HOST}`,
  FILE_DOWNLOAD: `${window.location.protocol}//download.${HOST}/download/`
} : {}

console.log(sdkSettings, "HALLO")
defaults({
  rest: {
    baseUrl: sdkSettings.REST
  },
  socket: {
    baseUrl: sdkSettings.SOCKET
  },
  file: {
    download: sdkSettings.FILE_DOWNLOAD
  }
})

ReactDOM.render(<App />, document.getElementById('root'))
