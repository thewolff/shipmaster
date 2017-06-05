'use strict';

const https = require('https');
const http = require('http');
const extend = require('extend');
const parser = require('xml2js');
const builder = require('xmlbuilder');
const path = require('path');
const util = require('util');
const ip = require('ip');

const _buildAccessRequest = function(options) {
  let root = builder.create('AccessRequest', { headless: true });
  root.att('xml:lang', 'en-US');
  root.ele('UserId', options.username);
  root.ele('Password', options.password);
  root.ele('AccessLicenseNumber', options.access_key);
  return root.end({ pretty: options.pretty });
};

const _buildTrackingRequest = function(data, options) {
  let root = builder.create('TrackRequest', { headless: true });
  let request = {
    Request: {
      RequestAction: 'Track',
      RequestOption: options.latest === true ? '0' : '1',
      TransactionReference: {
        CustomerContext: options.transaction_id || ''
      }
    }
  };
  request['TrackingNumber'] = data;
  if (
    options &&
    options.extra_params &&
    typeof options.extra_params === 'object'
  ) {
    request = extend(true, request, options.extra_params);
  }

  root.ele(request);
  return root.end({ pretty: options.pretty });
};

const _doRequest = function(reqBody, options, id) {
  return new Promise((resolve, reject) => {
    let authorize = _buildAccessRequest(options);
    let body = `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>${authorize}<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>${reqBody}`;
    let params = {
      host: options.hostname,
      path: options.path,
      method: 'POST',
      headers: {
        'Content-Length': body.length,
        'Content-Type': 'text/xml',
        'User-Agent': options.user_agent
      }
    };
    let req = https.request(params);
    req.write(body);

    req.on('error', e => {
      console.log('ERROR!', e.message);
      reject(e);
    });
    req.on('response', res => {
      let resData = '';
      res.on('data', data => {
        resData += data.toString();
      });

      res.on('end', data => {
        let result = {
          shipper: 'UPS',
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

class UPS {
  constructor(args) {
    this.defaults = {
      hostname: 'onlinetools.ups.com',
      path: '/ups.app/xml/Track',
      imperial: true, // for inches/lbs, false for metric cm/kgs
      currency: 'USD',
      environment: 'sandbox',
      access_key: '',
      username: '',
      password: '',
      pretty: false,
      user_agent: 'shipper, Co | shipmaster',
      debug: false
    };
    this.options = Object.assign({}, this.defaults, args);
  }
  track(data, callback) {
    const request = _buildTrackingRequest(data, this.options);
    return _doRequest(request, this.options, data);
  }
}
module.exports = UPS;
