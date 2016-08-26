var utils = require('./utils')
// 链接标签占比阈值，高于此值则表明当前节点可能不属于正文内容
var LINK_TAG_RATIO_THERSHOLD = 1 / 2
// 链接文本长度占总长度比例，高于此值则表明当前节点可能不属于正文内容
var LINK_TEXT_RATIO_THRESHOLD = 0.25

function filter(details) {
  return details.textCount > 0 &&
    details.linkTagCount / details.textNodeCount < LINK_TAG_RATIO_THERSHOLD &&
    details.linkTextCount / details.textCount < LINK_TEXT_RATIO_THRESHOLD
}

module.exports = filter
