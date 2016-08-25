var extract = require('../src/extract')
var parse5 = require('parse5')
var fs = require('fs')
var domA = parse5.parse(fs.readFileSync('./1.html', 'utf8'))
var domB = parse5.parse(fs.readFileSync('./2.html', 'utf8'))

extract(domA, domB)
console.log('--------')
extract(domB, domA)
