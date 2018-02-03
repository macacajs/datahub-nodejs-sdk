'use strict';

const fetch = require('node-fetch');
const assert = require('assert');

const _ = require('./helper');

const defaultOptions = {
  port: 5678,
  hostname: '127.0.0.1',
};

module.exports = class DataHubClient {
  constructor (options = {}) {
    this.options = Object.assign(defaultOptions, options);
    this.fetch = fetch;
    this.rootUrl = `http://${this.options.hostname}:${this.options.port}/api/`;
  }

  get EXCEPTION_RESPONSE () {
    return {
      success: false,
      data: {},
    };
  }

  get (apiPath, data, options) {
    const params = _.serialize(data);
    const url = `${this.rootUrl}${apiPath}`;
    return this.fetch(params ? `${url}?${params}` : url, Object.assign({
      credentials: 'same-origin',
    }, options)).then(res => res.json())
      .catch((e) => {
        return this.EXCEPTION_RESPONSE;
      });
  }

  post (apiPath, data, options) {
    const params = _.serialize(data);
    const url = `${this.rootUrl}${apiPath}`;
    return this.fetch(url, Object.assign({
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    }, options)).then(res => res.json())
      .catch(() => {
        return this.EXCEPTION_RESPONSE;
      });
  }

  async updateSceneByProjectIdAndDataId (projectId, dataId, {
    currentScene,
    delay,
    statusCode,
    responseHeaders,
  }) {
    assert(projectId, 'projectId is required');
    assert(dataId, 'dataId is required');
    const res = await this.getDataByProjectIdAndDataId(projectId, dataId);
    if (!res.success) {
      return this.EXCEPTION_RESPONSE;
    }
    let proxyContent = {};
    try {
      proxyContent = JSON.parse(res.data.proxyContent);
    } catch (e) {
      return this.EXCEPTION_RESPONSE;
    }
    proxyContent.statusCode = statusCode;
    proxyContent.responseHeaders = responseHeaders;
    return this.post(`data/${projectId}/${dataId}`, {
      currentScene,
      delay,
      proxyContent: JSON.stringify(proxyContent),
    });
  }

  async getDataByProjectIdAndDataId (projectId, dataId) {
    assert(projectId, 'projectId is required');
    assert(dataId, 'dataId is required');
    return this.get(`data/${projectId}/${dataId}`);
  }

  async getDataListByProjectId (projectId) {
    assert(projectId, 'projectId is required');
    return this.get(`data/${projectId}`);
  }
};

