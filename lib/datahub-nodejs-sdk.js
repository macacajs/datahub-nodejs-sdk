'use strict';

const fetch = require('isomorphic-fetch');

const defaultOptions = {
  port: 5678,
  hostname: '127.0.0.1',
  protocol: 'http',
  retryMaxCount: 5,
  retryInterval: 3000,
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

  sleep (ms) {
    return new Promise(resolve => {
      setTimeout(function () {
        resolve();
      }, ms);
    });
  }

  async fetchWithRetry (retryTimes, ...args) {
    try {
      return await this.fetch(...args);
    } catch (e) {
      if (retryTimes) {
        console.log(`fetch ${args[0]} fail because of '${e.message}', will retry after ${this.options.retryInterval}ms, retry count: ${retryTimes}`);
        await this.sleep(this.options.retryInterval);
        retryTimes--;
        return await this.fetchWithRetry(retryTimes, ...args);
      }
      throw e;
    }
  }

  /* istanbul ignore next */
  get (apiPath, data, options) {
    const url = `${this.rootUrl}${apiPath}`;
    return this.fetchWithRetry(this.options.retryMaxCount, url, Object.assign({
      credentials: 'same-origin',
    }, options)).then(res => res.json())
      .catch((e) => {
        return this.EXCEPTION_RESPONSE;
      });
  }

  post (apiPath, data, options) {
    const url = `${this.rootUrl}${apiPath}`;
    return this.fetchWithRetry(this.options.retryMaxCount, url, Object.assign({
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

  async switchScene (options) {
    return await this.post('sdk/switch_scene', options);
  }
  async switchMultiScenes (options) {
    return await this.post('sdk/switch_multi_scenes', options);
  }
  async switchAllScenes (options) {
    return await this.post('sdk/switch_all_scenes', options);
  }
}

module.exports = DataHubSDK;
