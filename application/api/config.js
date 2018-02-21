const request = require('request-promise-native')
module.exports = {
  api: request.defaults({
    baseUrl: `http://api.calponia/api`,
    json: true
  })
}
