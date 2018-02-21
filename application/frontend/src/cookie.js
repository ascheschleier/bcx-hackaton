module.exports = {
  get: function (key) {
    const document = window.document || {cookie: ''}
    try {
      return JSON.parse(('; ' + document.cookie).split('; ' + key + '=').pop().split(';').shift().replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent))
    } catch (e) { }
    return null
  }
}
