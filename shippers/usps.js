'use strict';
const https = require('https');
const http = require('http');
const extend = require('extend');
const parser = require('xml2js');
const builder = require('xmlbuilder');
const path = require('path');
const util = require('util');
const ip = require('ip');

const _buildTrackingRequest = function(data, options) {
  let root = builder.create('TrackFieldRequest', { headless: true });
  root.att('USERID', options.username);
  let params = {
    Revision: 1,
    ClientIp: ip.address(),
    SourceId: options.sourceId
  };
  let request = Object.assign({}, params, { TrackID: { '@ID': data } });
  root.ele(request);
  return root.end({ pretty: options.pretty });
};

const _doRequest = function(body, options, id) {
  return new Promise((resolve, reject) => {
    let req = https.request({
      host: options.hostname,
      path: `${options.endpoint}?API=${options.api}&XML=${encodeURIComponent(options.xmlVersion)}${encodeURIComponent(body)}`,
      method: 'GET',
      headers: {
        'User-Agent': options.user_agent
      }
    });

    req.on('error', e => {
      console.log('ERROR!', e.message);
      reject(e);
    });
    req.on('response', function(res) {
      let resData = '';
      res.on('data', function(data) {
        resData += data.toString();
      });

      res.on('end', function(data) {
        let result = {
          shipper: 'USPS',
          trackingId: id,
          data: {}
        };

        parser.parseString(resData, { explicitArray: false }, (err, res) => {
          if (err) {
            console.log('Parse error', err.message);
            reject(err);
          }
          result.data = res;
          resolve(result);
        });
      });
    });
    req.end();
  });
};

class USPS {
  constructor(args) {
    this.defaults = {
      hostname: 'secure.shippingapis.com',
      endpoint: '/ShippingAPI.dll',
      api: 'TrackV2',
      xmlVersion: '<?xml version="1.0" encoding="UTF-8" ?>',
      imperial: true, // for inches/lbs, false for metric cm/kgs
      currency: 'USD',
      language: 'en-US',
      test: false,
      username: '',
      password: '',
      sourceId: '',
      debug: false,
      pretty: false,
      user_agent: 'shipper, Co | shipmaster'
    };
    this.options = Object.assign({}, this.defaults, args);
  }

  track(data) {
    const request = _buildTrackingRequest(data, this.options);
    return _doRequest(request, this.options, data);
  }
}

module.exports = USPS;
