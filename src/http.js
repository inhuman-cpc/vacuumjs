var request = require('superagent')
require('superagent-proxy')(request)

module.exports = function loadPageContent(url, opts) {
  return new Promise((resolve, reject) => {
    var req = request.get(url)
    if (opts.proxy) {
      req = req.proxy(opts.proxy)
    }

    req.end((err, res) => {
      if (err) {
        reject(err)
        return
      }

      resolve(res.text)
    })
  })
}
