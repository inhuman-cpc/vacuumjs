/**
 * 深度优先遍历节点
 */
export function dfs(node, filter) {
  let dequeIn = [node]
  let dequeOut = []

  while (dequeIn.length) {
    let item = dequeIn.pop()
    dequeOut.push(item)
    let children = item.childNodes || []
    let len = children.length
    for (let i = 0; i < len; i += 1) {
      let item = children[len - 1 - i]
      if (!filter || filter(item)) {
        dequeIn.push(item)
      }
    }
  }

  return dequeOut
}
