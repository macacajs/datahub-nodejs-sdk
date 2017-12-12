'use strict';

const fetch = require('node-fetch');

const _ = require('./helper');

const defaultOptions = {
  port: 5678,
  hostname: '127.0.0.1'
};

function DataHubClient(options = {}) {
  this.options = Object.assign({}, options);
}

DataHubClient.prototype.updateSceneByProjectIdAndDataId = (projectId, dataId, scene) => {
  const url = `http://${defaultOptions.hostname}:${defaultOptions.port}/api/data/${projectId}/${dataId}`;

  return fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: _.serialize({
      currentScene: scene
    })
  });

};

module.exports = DataHubClient;
