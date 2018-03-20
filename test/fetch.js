'use strict';

const sinon = require('sinon');
const assert = require('assert');

const SDK = require('..');

const config = require('./config');

const localhost = config.localhost;

describe('fetch test', function () {
  it('get with params', function () {
    const client = new SDK();
    const stub = sinon.stub(client, 'fetch').callsFake(function (...args) {
      stub.restore();
      return Promise.resolve({
        json: () => Promise.resolve(args),
      });
    });
    return client.get('data/baz/fred', {
      key: 'value',
      key2: null,
    }, {
      headers: {
        'proxy-key': 'proxy-value',
      },
    }).then(data => {
      assert(data[0] === `${localhost}/api/data/baz/fred?key=value&key2=`, data[0]);
      assert.deepStrictEqual(data[1], {
        credentials: 'same-origin',
        headers: {
          'proxy-key': 'proxy-value',
        },
      });
    });
  });
});

