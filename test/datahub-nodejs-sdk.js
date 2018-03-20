'use strict';

const sinon = require('sinon');
const assert = require('assert');

const SDK = require('..');

const config = require('./config');

const localhost = config.localhost;

describe('sdk test', function () {
  it('default options', function () {
    assert.ok(SDK);
  });

  it('pass options', function () {
    const client = new SDK();
    assert.deepStrictEqual(client.options, {
      port: 5678,
      hostname: '127.0.0.1',
      protocol: 'http',
    });
  });

  it('assert required params', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'getDataByProjectIdAndDataId').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        success: false,
        data: {},
      });
    });
    return client.updateSceneByProjectIdAndDataId(undefined, undefined, {})
      .then(data => {
        assert.fail();
      }).catch(e => {
        assert(e.message === 'projectId is required');
      });
  });

  it('updateSceneByProjectIdAndDataId', function () {
    const client = new SDK();
    const stub1 = sinon.stub(client, 'getDataByProjectIdAndDataId').callsFake(function (...args) {
      stub1.restore();
      return Promise.resolve({
        success: true,
        data: {
          proxyContent: '{}',
        },
      });
    });
    const stub2 = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub2.restore();
      return Promise.resolve({
        json: () => Promise.resolve(args),
      });
    });
    return client.updateSceneByProjectIdAndDataId('projectId', 'dataId', {
      currentScene: 'default',
      delay: '2',
    }).then(data => {
      assert(data[0] === `${localhost}/api/data/projectId/dataId`);
      assert.deepStrictEqual(data[1], {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"currentScene":"default","delay":"2","proxyContent":"{}"}',
      });
    });
  });

  it('updateSceneByProjectIdAndDataId with null', function () {
    const client = new SDK();
    const stub1 = sinon.stub(client, 'getDataByProjectIdAndDataId').callsFake(function (...args) {
      stub1.restore();
      return Promise.resolve({
        success: true,
        data: {
          proxyContent: '{}',
        },
      });
    });
    const stub2 = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub2.restore();
      return Promise.resolve({
        json: () => Promise.resolve(args),
      });
    });
    return client.updateSceneByProjectIdAndDataId('projectId', 'dataId', {
      currentScene: 'default',
      delay: null,
    }).then(data => {
      assert(data[0] === `${localhost}/api/data/projectId/dataId`);
      assert.deepStrictEqual(data[1], {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"currentScene":"default","delay":null,"proxyContent":"{}"}',
      });
    });
  });

  it('updateSceneByProjectIdAndDataId getData failed', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'getDataByProjectIdAndDataId').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        success: false,
        data: {},
      });
    });
    return client.updateSceneByProjectIdAndDataId('projectId', 'dataId', {
      currentScene: 'default',
      delay: null,
    }).then(data => {
      assert.deepStrictEqual(data, {
        success: false,
        data: {},
      });
    });
  });

  it('updateSceneByProjectIdAndDataId proxyContent parse failed', function () {
    const client = new SDK();
    const stub1 = sinon.stub(client, 'getDataByProjectIdAndDataId').callsFake(function (...args) {
      stub1.restore();
      return Promise.resolve({
        success: true,
        data: {
          proxyContent: 'invalid json string',
        },
      });
    });
    const stub2 = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub2.restore();
      return Promise.resolve({
        json: () => {
          return Promise.resolve(args);
        },
      });
    });
    return client.updateSceneByProjectIdAndDataId('projectId', 'dataId', {
      currentScene: 'default',
      delay: null,
    }).then(data => {
      assert(data[0] === `${localhost}/api/data/projectId/dataId`);
      assert.deepStrictEqual(data[1], {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"currentScene":"default","delay":null,"proxyContent":"{}"}',
      });
    });
  });

  it('updateSceneByProjectIdAndDataId update failed', function () {
    const client = new SDK();
    const stub1 = sinon.stub(client, 'getDataByProjectIdAndDataId').callsFake(function (...args) {
      stub1.restore();
      return Promise.resolve({
        success: true,
        data: {
          proxyContent: '{}',
        },
      });
    });
    const stub2 = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub2.restore();
      return Promise.reject(new Error('fail'));
    });
    return client.updateSceneByProjectIdAndDataId('projectId', 'dataId', {
      currentScene: 'default',
      delay: null,
    }).then(data => {
      assert.deepStrictEqual(data, {
        success: false,
        data: {},
      });
    });
  });

  it('getDataListByProjectId success', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        json: () => {
          return Promise.resolve(args);
        },
      });
    });
    return client.getDataListByProjectId('projectId')
      .then(data => {
        assert.equal(data[0], `${localhost}/api/data/projectId`);
        assert.deepStrictEqual(data[1], {
          credentials: 'same-origin',
        });
      });
  });

  it('getDataListByProjectId failed', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.reject(new Error('fail'));
    });
    return client.getDataListByProjectId('projectId')
      .then(data => {
        assert.deepStrictEqual(data, {
          success: false,
          data: {},
        });
      });
  });

  it('getDataByProjectIdAndDataId success', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        json: () => {
          return Promise.resolve(args);
        },
      });
    });
    return client.getDataByProjectIdAndDataId('projectId', 'dataId')
      .then(data => {
        assert.equal(data[0], `${localhost}/api/data/projectId/dataId`);
        assert.deepStrictEqual(data[1], {
          credentials: 'same-origin',
        });
      });
  });

  it('getDataByProjectIdAndDataId failed', function () {
    const client = new SDK();
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

  it('updateMultiData success', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        json: () => {
          return Promise.resolve(args);
        },
      });
    });
    return client.updateMultiData([{
      projectId: 'thud',
      dataId: 'baz',
      currentScene: 'corge',
    }, {
      projectId: 'qux',
      dataId: 'grault',
      currentScene: 'quux',
    }]).then(data => {
      assert.equal(data[0], `${localhost}/api/multi/data`);
      assert.deepStrictEqual(data[1], {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '[{"projectId":"thud","dataId":"baz","currentScene":"corge"},{"projectId":"qux","dataId":"grault","currentScene":"quux"}]',
      });
    });
  });

  it('updateMultiData failed', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.reject(new Error('fail'));
    });
    return client.updateMultiData([{
      projectId: 'thud',
      dataId: 'baz',
      currentScene: 'corge',
    }, {
      projectId: 'qux',
      dataId: 'grault',
      currentScene: 'quux',
    }]).then(data => {
      assert.deepStrictEqual(data, {
        success: false,
        data: {},
      });
    });
  });
});
