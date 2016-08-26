/**
 * 深度优先遍历节点
 */
function dfs(node, filter) {
  var dequeIn = [node]
  var dequeOut = []

  while (dequeIn.length) {
    var item = dequeIn.pop()
    dequeOut.push(item)
    var children = item.childNodes || []
    var len = children.length
    for (var i = 0; i < len; i += 1) {
      var item = children[len - 1 - i]
      if (!filter || filter(item)) {
        dequeIn.push(item)
      }
    }
  }

  return dequeOut
}

exports.dfs = dfs
