var traverse = require('./traverse')

/**
 * 如下标签与网页正文内容关联很小
 * 对比节点差异时直接忽略
 */
var excludeTags = 'svg,style,link,meta,iframe,noscript,footer,header'.split(',')

/**
 * 如下内联元素可能作为网页正文的修饰标签出现
 */
var inlineTags = 'b,big,i,small,tt,abbr,acronym,cite,code,dfn,em,kbd,strong,samp,time,var,a,bdo,br,img,map,object,q,span,sub,sup,button,input,label,select,textarea'.split(',')

function getTextLength(txt) {
  return txt.replace(/\s/g, '').length
}

function isEmptyText(txt) {
  return !txt || /^\s+$/.test(txt)
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x)
}

/**
 * 是否为文本节点
 */
function isTextNode(node) {
  return node && node.nodeName === '#text'
}

/**
 * 是否为注释节点
 */
function isCommnetNode(node) {
  return node && node.nodeName === '#comment'
}

/**
 * 获取节点的innerText
 * TODO pre/code标签比较特殊可能包含格式化的标签元素
 * markdown转化的时候需要清楚这些标签获取文本
 */
function getNodeText(node) {
  if (isTextNode(node)) {
    return node.value
  }

  var textFragment = []
  traverseNode(node, textFragment, (el) => {
    return isTextNode(el)
  }, (el) => {
    return el.value
  })

  return textFragment.join(' ')
}

/**
 * 获取节点路径上的所有节点（自身和所有父节点）
 */
function getNodePathList(node) {
  var parents = [node]
  var parent = node
  while (parent = parent.parentNode) {
    parents.unshift(parent)
  }

  return parents
}

/**
 * 获取最近的公共祖先
 */
function getLowestCommonAncestor(nodeA, nodeB) {
  var paList = getNodePathList(nodeA)
  var pbList = getNodePathList(nodeB)
  var len = Math.min(paList.length, pbList.length)
  for (var i = len - 1; i >= 0 ; i -= 1) {
    if (paList[i] === pbList[i]) {
      return paList[i]
    }
  }
}

/**
 * 对比节点差异时，是否需要排除此此节点
 * 如果节点不存在或者与正文内容无关则需要排除
 */
function isExcludedNode(node) {
  return node && (excludeTags.indexOf(node.tagName) > -1 || node.nodeName === '#comment')
}

/**
 * 是否拥有不同的节点属性
 * TODO
 */
function hasDifferentAttr(target, old) {
  return false
}

/**
 * 是否为不同节点，判断标准：
 * 1) 标签元素，标签名不同或者属性不一致
 * 2) 文本元素，判断内容是否一致（注释节点忽略）
 */
function isDiffrentNode(target, old) {
  if (!target || isCommnetNode(target)) {
    return false
  }

  if (!old) return true

  // 标签节点
  if (target.tagName) {
    return target.tagName !== old.tagName
  }

  // 文本节点
  if (target.nodeName) {
    return target.value !== old.value
  }

  // 属性不完全一致
  if (hasDifferentAttr(target, old)) {
    return true
  }

  // 注释节点
  return false
}

/**
 * 获取节点最近的父级容器节点
 */
function getLowestContainer(node) {
  var wrapper = node.parentNode
  while (wrapper) {
    if (inlineTags.indexOf(wrapper.tagName) === -1) {
      return wrapper
    } else {
      wrapper = wrapper.parentNode
    }
  }

  return node
}

/**
 * 是否为内联节点：文本节点和内联元素
 */
function isInlineNode(target) {
  return target.nodeName === '#text' || inlineTags.indexOf(target.tagName) > -1
}

/**
 * 递归遍历节点
 * 将符合目标条件的节点加入到指定集合中
 */
function traverseNode(node, list, filter, map) {
  if (!node || isCommnetNode(node) || !node.childNodes) return

  node.childNodes.forEach(el => {
    if (!filter || filter(el)) {
      list.push(map ? map(el) : el)
    } else {
      traverseNode(el, list, filter, map)
    }
  })
}

function getNodeDetails(node) {
  // 文本总数
  var textCount = 0
  // 链接文本总数
  var linkTextCount = 0
  var textNodeCount = 0
  var linkTagCount = 0
  var imgTagCount = 0
  var paragraphTagCount = 0
  var tagCount = 0
  // 节点全部标签种类
  var childTagSet = new Set()
  // 深度优先遍历子节点，排除非内容节点
  var nodes = traverse.dfs(node, (el) => {
    // pre标签内部多为代码，容易造成干扰，忽略（虽说一般也只有正文才会用）
    // NOTE 是否还有其它标签和pre类似
    return excludeTags.indexOf(el.parentNode.tagName) === -1 && el.tagName !== 'pre'
  })

  var currentNode
  while(currentNode = nodes.pop()) {
    if (currentNode.tagName) {
      childTagSet.add(currentNode.tagName)

      tagCount += 1
    }

    if (currentNode.nodeName === '#text') {
      if (isEmptyText(currentNode.value)) {
        continue
      }

      textNodeCount += 1
      var txtLength = getTextLength(currentNode.value)
      textCount += txtLength

      if (currentNode.parentNode.tagName === 'a') {
        linkTextCount += txtLength
      } else {
        var parents = getNodePathList(currentNode)
        parents.pop()
        var isParentLink = parents.some(el => {
          return el.tagName === 'a'
        })
        if (isParentLink) {
          linkTextCount += txtLength
        }
      }
    }

    if (currentNode.tagName === 'img') {
      imgTagCount += 1
    }

    if (currentNode.tagName === 'a') {
      linkTagCount += 1
    }

    if (currentNode.tagName === 'p') {
      paragraphTagCount += 1
    }
  }

  return {
    textCount: textCount,
    textNodeCount: textNodeCount,
    linkTextCount: linkTextCount,
    linkTagCount: linkTagCount,
    imgTagCount: imgTagCount,
    tagCount: tagCount,
    tagTypeCount: childTagSet.size,
    paragraphTagCount: paragraphTagCount
  }
}

exports.inlineTags = inlineTags
exports.excludeTags = excludeTags
exports.isTextNode = isTextNode
exports.isCommnetNode = isCommnetNode
exports.getNodeText = getNodeText
exports.getNodePathList = getNodePathList
exports.getLowestCommonAncestor = getLowestCommonAncestor
exports.isExcludedNode = isExcludedNode
exports.hasDifferentAttr = hasDifferentAttr
exports.isDiffrentNode = isDiffrentNode
exports.getLowestContainer = getLowestContainer
exports.isInlineNode = isInlineNode
exports.getNodeDetails = getNodeDetails
