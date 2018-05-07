'use strict';

const sinon = require('sinon');
const assert = require('assert');

const SDK = require('..');

describe('fetch test', function () {
  it('fetch with retry', function () {
    const client = new SDK({
      retryMaxCount: 2,
      retryInterval: 100,
    });
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.reject(new Error('fail'));
    });
    return client.getDataByProjectIdAndDataId('projectId', 'dataId')
      .then(data => {
        assert.deepStrictEqual(data, {
          success: false,
          data: {},
        });
      });
  });
});

