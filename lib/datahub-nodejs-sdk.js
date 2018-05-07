'use strict';

const fetch = require('isomorphic-fetch');

const assertArgument = (value, message) => {
  if (typeof value === 'undefined') {
    throw new Error(message);
  }
};

const _ = require('./helper');

const defaultOptions = {
  port: 5678,
  hostname: '127.0.0.1',
  protocol: 'http',
};

/**
 * DataHub Node.js SDK.
 * @module DataHubSDK
 * @class
 */
class DataHubSDK {
  /**
   * Create a SDK client.
   * @param {string} port - port.
   * @param {string} hostname - hostname.
   * @param {string} protocol - protocol.
   */
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
    const url = `${this.rootUrl}${apiPath}`;
    return this.fetch(url, Object.assign({
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
    assertArgument(projectId, 'projectId is required');
    assertArgument(dataId, 'dataId is required');
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
   * update multiple data
   * @async
   * @param {object} data list
   * @returns {Promise}
   */
  async updateMultiData (data) {
    assertArgument(data, 'data is required');
    return this.post('multi/data', data);
  }

  /**
   * get data list by projectId and dataId.
   * @async
   * @param {string} projectId
   * @param {string} dataId
   * @returns {Promise}
   */
  async getDataByProjectIdAndDataId (projectId, dataId) {
    assertArgument(projectId, 'projectId is required');
    assertArgument(dataId, 'dataId is required');
    return this.get(`data/${projectId}/${dataId}`);
  }

  /**
   * get data list by projectId.
   * @async
   * @param {string} projectId
   * @returns {Promise}
   */
  async getDataListByProjectId (projectId) {
    assertArgument(projectId, 'projectId is required');
    return this.get(`data/${projectId}`);
  }

  /**
   * get scene data
   * @async
   * @param {string} projectId
   * @param {string} dataId
   * @param {string} sceneId
   * @returns {Object} scene data
   */
  async getSceneDataByProjectIdAndDataId (projectId, dataId, sceneId) {
    assertArgument(projectId, 'projectId is required');
    assertArgument(dataId, 'dataId is required');
    assertArgument(sceneId, 'sceneId is required');
    const res = await this.getDataByProjectIdAndDataId(projectId, dataId);
    try {
      const jsonData = JSON.parse(res.data.scenes);
      return jsonData.find(i => i.name === sceneId);
    } catch (_) {
      return {};
    }
  }
}

module.exports = DataHubSDK;
