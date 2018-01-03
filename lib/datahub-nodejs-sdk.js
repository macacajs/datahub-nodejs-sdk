'use strict';

const fetch = require('node-fetch');

const _ = require('./helper');

const defaultOptions = {
  port: 5678,
  hostname: '127.0.0.1'
};

module.exports = class DataHubClient {
  constructor(options = {}) {
    this.options = Object.assign(defaultOptions, options);
    this.fetch = fetch;
  }

  updateSceneByProjectIdAndDataId (projectId, dataId, data) {
    const url = `http://${this.options.hostname}:${this.options.port}/api/data/${projectId}/${dataId}`;

    return this.fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: _.serialize(data)
    });
  }

  getDataListByProjectId (projectId) {
    const url = `http://${this.options.hostname}:${this.options.port}/api/data/${projectId}`;

    return this.fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => res.json())
      .catch(() => { return {}; });
  }
};

