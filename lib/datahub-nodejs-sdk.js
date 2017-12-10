'use strict';

const request = require('request');

const _ = require('./helper');

const defaultOptions = {
  port: 5678,
  hostname: '127.0.0.1'
};

function DataHubClient(options = {}) {
  this.options = Object.assign({}, options);
}

DataHubClient.prototype.updateData = () => {

};

module.exports = DataHubClient;
