'use strict';

const xutil = require('xutil');

const _ = xutil.merge({}, xutil);

_.serialize = function(obj) {
  let s = [];

  for (let item in obj) {
    const k = encodeURIComponent(item);
    const v = encodeURIComponent(obj[item] == null ? '' : obj[item]);
    s.push(`${k}=${v}`);
  }

  return s.join('&');
};

module.exports = _;
