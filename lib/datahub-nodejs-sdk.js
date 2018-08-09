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
 *
 * @description
 * ```javascript
 * const client = new SDK({
 *   port: 5678,
 *   hostname: '127.0.0.1',
 * });
 * ```
 */
class DataHubSDK {
  /**
   * Create a SDK client.
   * @param {string} [port=5678] - DataHub port.
   * @param {string} [hostname='127.0.0.1'] - DataHub hostname.
   * @param {string} [protocol='http'] - DataHub protocol.
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

  /**
   * switch one scene
   * @param {Object} options - switch scene options
   * @param {string} options.hub - hubname.
   * @param {string} options.pathname - pathname.
   * @param {string} options.scene - scene name.
   *
   * @description
   * ```javascript
   * await client.switchScene({
   *   hub: 'app',
   *   pathname: 'api',
   *   scene: 'success',
   * })
   * ```
   */
  async switchScene (options) {
    return await this.post('sdk/switch_scene', options);
  }

  /**
   * switch multi scenes
   * @param {Object[]} options - switch scene options
   * @param {string} options[].hub - hubname.
   * @param {string} options[].pathname - pathname.
   * @param {string} options[].scene - scene name.
   *
   * @description
   * ```javascript
   * await client.switchMultiScenes([{
   *   hub: 'app',
   *   pathname: 'api',
   *   scene: 'success',
   * }, {
   *   hub: 'app',
   *   pathname: 'api2',
   *   scene: 'success',
   * }])
   * ```
   */
  async switchMultiScenes (options) {
    return await this.post('sdk/switch_multi_scenes', options);
  }

  /**
   * switch all scenes
   * @param {Object} options - switch scene options
   * @param {string} options.hub - hubname.
   * @param {string} options.scene - scene name.
   *
   * @description
   * ```javascript
   * await client.switchAllScenes({
   *   hub: 'app',
   *   scene: 'success',
   * })
   * ```
   */
  async switchAllScenes (options) {
    return await this.post('sdk/switch_all_scenes', options);
  }
}

module.exports = DataHubSDK;
