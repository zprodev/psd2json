# psd2json

[![Build Status](https://travis-ci.org/zprodev/psd2json.svg?branch=master)](https://travis-ci.org/zprodev/psd2json)
[![npm](https://img.shields.io/npm/v/psd2json.svg)](https://www.npmjs.com/package/psd2json)
[![license](https://img.shields.io/github/license/zprodev/psd2json.svg)](LICENSE)

Convart PSD layout to JSON.

![01.png](https://raw.githubusercontent.com/zprodev/psd2json/master/docs/img/01.png)
![02.png](https://raw.githubusercontent.com/zprodev/psd2json/master/docs/img/02.png)

# Usage

First, install this module in your project.

```
$ npm install psd2json
```

Import this module to your source code and call like below.

```
var psd2json = require('psd2json');

psd2json('./target.psd');              // Output of ./target.json
psd2json('./target.psd', './outdir');  // Output of ./outdir/target.json
```

# License

This software is released under the MIT License, see [LICENSE](LICENSE)
