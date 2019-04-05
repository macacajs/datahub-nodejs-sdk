# datahub-nodejs-sdk

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/datahub-nodejs-sdk.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datahub-nodejs-sdk
[travis-image]: https://img.shields.io/travis/macacajs/datahub-nodejs-sdk.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/datahub-nodejs-sdk
[codecov-image]: https://img.shields.io/codecov/c/github/macacajs/datahub-nodejs-sdk.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/macacajs/datahub-nodejs-sdk/branch/master
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/datahub-nodejs-sdk.svg?style=flat-square
[download-url]: https://npmjs.org/package/datahub-nodejs-sdk

> DataHub Node.js SDK

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars1.githubusercontent.com/u/2139038?v=4" width="100px;"/><br/><sub><b>zhangyuheng</b></sub>](https://github.com/zhangyuheng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/11460601?v=4" width="100px;"/><br/><sub><b>zivyangll</b></sub>](https://github.com/zivyangll)<br/>|
| :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Fri Feb 15 2019 23:07:40 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## Installment

```bash
$ npm i datahub-nodejs-sdk --save-dev
```

## Common Usage

```javascript
import DataHubSDK from 'datahub-nodejs-sdk';

const sdkClient = new DataHubSDK();

// switch currentScene for 'POST api/create' to 'sucess'
await sdkClient.switchScene({
  hub: 'app',
  pathname: 'api/create',
  scene: 'success',
  method: 'POST',   // method is optional, default method is 'ALL'
})

// switch currentScene for 'GET api/read' to 'success'
// switch currentScene for 'DELETE api/delete' to 'success'
await sdkClient.switchMultiScenes([{
  hub: 'app',
  pathname: 'api/read',
  scene: 'success',
  method: 'GET',   // method is optional, default method is 'ALL'
}, {
  hub: 'app',
  pathname: 'api/delete',
  scene: 'success',
  method: 'DELETE',  // method is optional, default method is 'ALL'
}])

// switch all scenes for all pathnames under app to 'success'
await sdkClient.switchAllScenes({
  hub: 'app',
  scene: 'success',
})
```

## [API Documents](//macacajs.github.io/datahub-nodejs-sdk/)

## License

The MIT License (MIT)
