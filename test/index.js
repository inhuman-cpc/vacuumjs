var fs = require('fs')
var urlList = [
  // 'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations?hl=zh-cn'
]
var proxy = 'socks://127.0.0.1:1080'
var parse5 = require('parse5')

var vacuumjs = require('../src/layout_similarity')
vacuumjs.parse(urlList, {
  proxy: proxy,
  referenceUrl: 'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=zh-cn'
}).then(nodes => {
  var htmlList = nodes.map(node => {
    return vacuumjs.serialize(node)
  })
  fs.writeFile('./index.html', htmlList.join('\n\n********\n\n'))
})
