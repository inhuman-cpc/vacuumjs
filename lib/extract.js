/**
 * 基于布局相似性的网页正文内容提取
 * 参考论文：http://www.arocmag.com/article/01-2015-09-005.html
 *
 * 目前只是初步实现，缺点主要有：
 * 1）依赖于参考页面
 * 2）某些时候参考页面选定的不好对结果分析影响很大，尤其是对于多语言或者功能模块较多角色较多的页面
 * 这种页面会根据相关条件会有较大变化从而难以确定参考页面
 */

import * as utils from './utils'
import {isContent} from './filter'

export default function(targetNode, baseNode) {
  if (!targetNode || !baseNode) {
    return null
  }

  let diffNodes = []
  let pushNode = (target) => {
    if (utils.isInlineNode(target)) {
      let parent = utils.getLowestContainer(target)
      if (diffNodes.indexOf(parent) === -1) {
        diffNodes.push(parent)
      }
    } else {
      diffNodes.push(target)
    }
  }
  let diff = (target, old) => {
    if (utils.isExcludedNode(target)) {
      return
    }

    if (utils.isDiffrentNode(target, old)) {
      pushNode(target)
      return
    }

    if (!target.childNodes) return

    let oldChildNodes = old.childNodes || []
    target.childNodes.forEach((node, i) => {
      if (oldChildNodes[i]) {
        diff(node, oldChildNodes[i])
      } else {
        pushNode(node)
      }
    })
  }

  diff(targetNode, baseNode)

  diffNodes = diffNodes.filter(el => {
    let details = utils.getNodeDetails(el)
    el.__details = details
    return isContent(details)
  }).sort((a, b) => {
    return b.__details.textCount - a.__details.textCount
  })

  if (diffNodes.length > 1) {
    return utils.getLowestCommonAncestor(diffNodes[0], diffNodes[1])
  } else if (diffNodes.length === 1) {
    return diffNodes[0]
  } else {
    console.error('Unable to extract page content')
    return null
  }
}
