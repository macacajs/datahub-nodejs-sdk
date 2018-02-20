'use strict';

const assert = require('assert');
const fetch = require('node-fetch');

const _ = require('./helper');

const defaultOptions = {
  port: 5678,
  hostname: '127.0.0.1',
  protocol: 'http',
};

/**
 * DataHub Node.js SDK client.
 * @class
 */
class DataHubSDK {
  constructor (options = {}) {
    this.options = Object.assign(defaultOptions, options);
    this.fetch = fetch;
    this.rootUrl = `${this.options.protocol}://${this.options.hostname}:${this.options.port}/api/`;
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

  /**
   * update scene by projectId and dataId.
   * @async
   * @param {string} projectId
   * @param {string} dataId
   * @returns {Promise}
   */
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
    } catch (_) { /* ignore invalid proxyContent */ }
    proxyContent.statusCode = statusCode;
    proxyContent.responseHeaders = responseHeaders;
    return this.post(`data/${projectId}/${dataId}`, {
      currentScene,
      delay,
      proxyContent: JSON.stringify(proxyContent),
    });
  }

  /**
   * get data list by projectId and dataId.
   * @async
   * @param {string} projectId
   * @param {string} dataId
   * @returns {Promise}
   */
  async getDataByProjectIdAndDataId (projectId, dataId) {
    assert(projectId, 'projectId is required');
    assert(dataId, 'dataId is required');
    return this.get(`data/${projectId}/${dataId}`);
  }

  /**
   * get data list by projectId.
   * @async
   * @param {string} projectId
   * @returns {Promise}
   */
  async getDataListByProjectId (projectId) {
    assert(projectId, 'projectId is required');
    return this.get(`data/${projectId}`);
  }
};

export default DataHubSDK;
