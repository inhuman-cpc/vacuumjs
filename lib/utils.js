import {dfs} from './traverse'
import {EXCLUDE_TAGS, INLINE_TAGS} from './const'

export function getTextLength(txt) {
  return txt.replace(/\s/g, '').length
}

export function isEmptyText(txt) {
  return !txt || /^\s+$/.test(txt)
}

export function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x)
}

/**
 * 是否为文本节点
 */
export function isTextNode(node) {
  return node && node.nodeName === '#text'
}

/**
 * 是否为注释节点
 */
export function isCommnetNode(node) {
  return node && node.nodeName === '#comment'
}

/**
 * 获取节点的innerText
 * TODO pre/code标签比较特殊可能包含格式化的标签元素
 * markdown转化的时候需要清楚这些标签获取文本
 */
export function getNodeText(node) {
  if (isTextNode(node)) {
    return node.value
  }

  let textFragment = []
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
export function getNodePathList(node) {
  let parents = [node]
  let parent = node
  while (parent = parent.parentNode) {
    parents.unshift(parent)
  }

  return parents
}

/**
 * 获取最近的公共祖先
 */
export function getLowestCommonAncestor(nodeA, nodeB) {
  let paList = getNodePathList(nodeA)
  let pbList = getNodePathList(nodeB)
  let len = Math.min(paList.length, pbList.length)
  for (let i = len - 1; i >= 0 ; i -= 1) {
    if (paList[i] === pbList[i]) {
      return paList[i]
    }
  }
}

/**
 * 对比节点差异时，是否需要排除此此节点
 * 如果节点不存在或者与正文内容无关则需要排除
 */
export function isExcludedNode(node) {
  return node && (EXCLUDE_TAGS.indexOf(node.tagName) > -1 || node.nodeName === '#comment')
}

/**
 * 是否拥有不同的节点属性
 * TODO
 */
export function hasDifferentAttr(target, old) {
  return false
}

/**
 * 是否为不同节点，判断标准：
 * 1) 标签元素，标签名不同或者属性不一致
 * 2) 文本元素，判断内容是否一致（注释节点忽略）
 */
export function isDiffrentNode(target, old) {
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
export function getLowestContainer(node) {
  let wrapper = node.parentNode
  while (wrapper) {
    if (INLINE_TAGS.indexOf(wrapper.tagName) === -1) {
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
export function isInlineNode(target) {
  return target.nodeName === '#text' || INLINE_TAGS.indexOf(target.tagName) > -1
}

/**
 * 递归遍历节点
 * 将符合目标条件的节点加入到指定集合中
 */
export function traverseNode(node, list, filter, map) {
  if (!node || isCommnetNode(node) || !node.childNodes) return

  node.childNodes.forEach(el => {
    if (!filter || filter(el)) {
      list.push(map ? map(el) : el)
    } else {
      traverseNode(el, list, filter, map)
    }
  })
}

export function getNodeDetails(node) {
  // 文本总数
  let textCount = 0
  // 链接文本总数
  let linkTextCount = 0
  let textNodeCount = 0
  let linkTagCount = 0
  let imgTagCount = 0
  let paragraphTagCount = 0
  let tagCount = 0
  // 节点全部标签种类
  let childTagSet = new Set()
  // 深度优先遍历子节点，排除非内容节点
  let nodes = dfs(node, (el) => {
    // pre标签内部多为代码，容易造成干扰，忽略（虽说一般也只有正文才会用）
    // NOTE 是否还有其它标签和pre类似
    return EXCLUDE_TAGS.indexOf(el.parentNode.tagName) === -1 && el.tagName !== 'pre'
  })

  let currentNode
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
      let txtLength = getTextLength(currentNode.value)
      textCount += txtLength

      if (currentNode.parentNode.tagName === 'a') {
        linkTextCount += txtLength
      } else {
        let parents = getNodePathList(currentNode)
        parents.pop()
        let isParentLink = parents.some(el => {
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
