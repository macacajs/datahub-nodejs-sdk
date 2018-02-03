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
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'currentScene=default&delay=2&proxyContent=%7B%7D',
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
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'currentScene=default&delay=&proxyContent=%7B%7D',
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
    const stub = sinon.stub(client, 'getDataByProjectIdAndDataId').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        success: true,
        data: {
          proxyContent: 'invalid json string',
        },
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
});
