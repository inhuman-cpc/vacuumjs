# vacuumjs

A low-level node.js web page content extractor based on `parse5`.

[![Build Status](https://semaphoreci.com/api/v1/damngoto/vacuumjs/branches/master/badge.svg)](https://semaphoreci.com/damngoto/vacuumjs)
[![codecov](https://codecov.io/gh/simongfxu/vacuumjs/branch/master/graph/badge.svg)](https://codecov.io/gh/simongfxu/vacuumjs)

## Usage

```js
var extract = require('vacuumjs')
var targetDOM = parse5.parse('some page content')
// the reference dom, not optional
var refDOM = parse5.parse('reference page content')
console.log(extract(targetDOM, refDOM))
```

## Principium

> * Layout similairity
> * Text density
