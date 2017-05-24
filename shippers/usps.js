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

const _handleResponse = function(res, callback) {
  return callback(null, res);
};

const _doRequest = function(body, options, callback) {
  let req = https.request({
    host: options.hostname,
    path: `${options.endpoint}?API=${options.api}&XML=${encodeURIComponent(options.xmlVersion)}${encodeURIComponent(body)}`,
    method: 'GET',
    headers: {
      'User-Agent': options.user_agent
    }
  });

  req.on('error', function(e) {
    return callback(e, null);
  });
  req.on('response', function(res) {
    let resData = '';
    res.on('data', function(data) {
      resData += data.toString();
    });

    res.on('end', function(data) {
      parser.parseString(resData, { explicitArray: false }, callback);
    });
  });
  req.end();
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

  track(data, callback) {
    const request = _buildTrackingRequest(data, this.options);
    _doRequest(request, this.options, function(err, res) {
      if (err) {
        return callback(err, null);
      }
      return _handleResponse(res, callback);
    });
  }
}

module.exports = USPS;
