'use strict';
const USPS = require('./shippers/usps');
const UPS = require('./shippers/ups');
const guess = require('./shippers/guess');

class Shipmaster {
  constructor(args) {}

  USPS(args) {
    return new USPS(args);
  }
  UPS(args) {
    return new UPS(args);
  }
  guess(args) {
    return new guess(args);
  }
}

module.exports = Shipmaster;
