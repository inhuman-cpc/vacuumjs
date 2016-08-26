/**
 * 基于布局相似性的网页正文内容提取
 * 参考论文：http://www.arocmag.com/article/01-2015-09-005.html
 *
 * 目前只是初步实现，缺点主要有：
 * 1）依赖于参考页面
 * 2）某些时候参考页面选定的不好对结果分析影响很大，尤其是对于多语言或者功能模块较多角色较多的页面
 * 这种页面会根据相关条件会有较大变化从而难以确定参考页面
 */

var Promise = require('bluebird')
var parse5 = require('parse5')
var extract = require('./extract')
var request = require('./http')
var filter = require('./filter')

function parse(urls, opts) {
  urls = urls.concat(opts.referenceUrl)
  opts = opts || {}

  return Promise.map(urls, (url) => {
    return request(url, {
      proxy: opts.proxy
    })
  }).then(list => {
    var domList = list.map(text => {
      return parse5.parse(text)
    })
    var refDOM = domList.pop()
    var nodes = domList.map(dom => {
      return extract(dom, refDOM)
    })

    return nodes
  })
}

function serialize(node) {
  if (!node) return ''

  return parse5.serialize(node, {
    treeAdapter: Object.assign({}, parse5.treeAdapters.default, {
      // 仅保留图片和链接的资源url
      getAttrList: function(node) {
        if (node.tagName === 'a' || node.tagName === 'img') {
          return node.attrs.filter(item => {
            return item.name === 'href' || item.name === 'src'
          })
        }

        return []
      }
    })
  })
}

exports.parse = parse
exports.serialize = serialize
