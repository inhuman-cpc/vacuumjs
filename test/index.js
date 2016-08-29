import fs from 'fs'
import parse5 from 'parse5'
import {expect} from 'chai'
import extract from '../lib/extract'
import utils from '../lib/utils'

function split(array, index) {
  return array.filter((item, i) => i !== index)
}

// 提取系列文章：https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=zh-cn
let samples = []
for (let i = 1; i < 9; i += 1) {
  samples[i - 1] = parse5.parse(fs.readFileSync(`${__dirname}/../sample/${i}.html`, 'utf8'))
}

describe('#extract', function() {
  it('should get null when reference dom is null or the same', function() {
    let node = extract(samples[0], samples[0])
    let node2 = extract(samples[0])
    expect(node).to.be.null
    expect(node2).to.be.null
  })

  it('should get the content node that has a class named page-content', function() {
    for (let i = 0; i < 8; i += 1) {
      let refDOM = samples[i]
      let targets = split(samples, i)
      targets.forEach((dom, index) => {
        let contentNode = extract(dom, refDOM)
        expect(contentNode).to.not.be.null
        expect(contentNode.attrs[0].value).equal('page-content')
      })
    }
  })
})
