'use strict';

const sinon = require('sinon');
const assert = require('assert');

const SDK = require('..');

describe('test', function() {

  let stub;

  it('default options', function() {
    assert.ok(SDK);
  });

  it('pass options', function() {
    const client = new SDK();
    assert.deepStrictEqual(client.options, {
      port: 5678,
      hostname: '127.0.0.1'
    });
  });

  it('updateSceneByProjectIdAndDataId', function() {
    const client = new SDK();
    stub = sinon.stub(client, 'fetch').callsFake(function(...args) {
      stub.restore();
      return Promise.resolve(args);
    });
    return client.updateSceneByProjectIdAndDataId('projectId', 'dataId', {
      currentScene: 'default',
      delay: '2'
    }).then(data => {
      assert(data[0] === 'http://127.0.0.1:5678/api/data/projectId/dataId');
      assert.deepStrictEqual(data[1], {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'currentScene=default&delay=2'
      });
    });
  });

  it('updateSceneByProjectIdAndDataId with null', function() {
    const client = new SDK();
    stub = sinon.stub(client, 'fetch').callsFake(function(...args) {
      stub.restore();
      return Promise.resolve(args);
    });
    return client.updateSceneByProjectIdAndDataId('projectId', 'dataId', {
      currentScene: 'default',
      delay: null
    }).then(data => {
      assert(data[0] === 'http://127.0.0.1:5678/api/data/projectId/dataId');
      assert.deepStrictEqual(data[1], {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'currentScene=default&delay='
      });
    });
  });

  it('getDataListByProjectId success', function() {
    const client = new SDK();
    stub = sinon.stub(client, 'fetch').callsFake(function(...args) {
      stub.restore();
      return Promise.resolve({
        json: () => { return args; }
      });
    });
    return client.getDataListByProjectId('projectId')
      .then(data => {
        assert.equal(data[0], 'http://127.0.0.1:5678/api/data/projectId');
        assert.deepStrictEqual(data[1], {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      });
  });

  it('getDataListByProjectId failed', function() {
    const client = new SDK();
    stub = sinon.stub(client, 'fetch').callsFake(function(...args) {
      stub.restore();
      return Promise.reject(new Error('fail'));
    });
    return client.getDataListByProjectId('projectId')
      .then(data => {
        assert.deepStrictEqual(data, {});
      });
  });
});

