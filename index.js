'use strict';
const USPS = require('./shippers/usps');
const UPS = require('./shippers/ups');

class Shipmaster {
  constructor(args) {}

  USPS(args) {
    return new USPS(args);
  }
  UPS(args) {
    return new UPS(args);
  }
}

module.exports = Shipmaster;
