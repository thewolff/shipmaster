'use strict';

const _ = require('lodash');

const upperCase = require('change-case').upperCase;
const uniq = require('lodash').uniq;

const _confirmUps = id => {};

const _confirmUpsFreight = id => {};

const _confirmFedex12 = id => {};

const _confirmFedex15 = id => {};

const _confirmFedex20 = id => {};

const _confirmUsps20 = id => {};

const _confirmFedexSmartPost = id => {};

const _confirmFedexDoorTag = id => {};

const _confirmFedex9622 = id => {};

const _confirmUsps22 = id => {};

const _confirmUsps26 = id => {};

const _confirmUsps420Zip = id => {};

const _confirmUsps420ZipPlus4 = id => {};

const _confirmCanadaPost16 = id => {};

const _confirmA1International = id => {};

const CARRIERS = [
  {
    name: 'ups',
    regex: /^1Z[0-9A-Z]{16}$/,
    confirm: _confirmUps
  },
  {
    name: 'ups',
    regex: /^(H|T|J|K|F|W|M|Q|A)\d{10}$/,
    confirm: _confirmUpsFreight
  },
  {
    name: 'amazon',
    regex: /^1\d{2}-\d{7}-\d{7}:\d{13}$/
  },
  {
    name: 'fedex',
    regex: /^\d{12}$/,
    confirm: _confirmFedex12
  },
  {
    name: 'fedex',
    regex: /^\d{15}$/,
    confirm: _confirmFedex15
  },
  {
    name: 'fedex',
    regex: /^\d{20}$/,
    confirm: _confirmFedex20
  },
  {
    name: 'usps',
    regex: /^\d{20}$/,
    confirm: _confirmUsps20
  },
  {
    name: 'usps',
    regex: /^02\d{18}$/,
    confirm: _confirmFedexSmartPost
  },
  {
    name: 'fedex',
    regex: /^02\d{18}$/,
    confirm: _confirmFedexSmartPost
  },
  {
    name: 'fedex',
    regex: /^DT\d{12}$/,
    confirm: _confirmFedexDoorTag
  },
  {
    name: 'fedex',
    regex: /^927489\d{16}$/
  },
  {
    name: 'fedex',
    regex: /^926129\d{16}$/
  },
  {
    name: 'upsmi',
    regex: /^927489\d{16}$/
  },
  {
    name: 'upsmi',
    regex: /^926129\d{16}$/
  },
  {
    name: 'upsmi',
    regex: /^927489\d{20}$/
  },
  {
    name: 'fedex',
    regex: /^96\d{20}$/,
    confirm: _confirmFedex9622
  },
  {
    name: 'usps',
    regex: /^927489\d{16}$/
  },
  {
    name: 'usps',
    regex: /^926129\d{16}$/
  },
  {
    name: 'fedex',
    regex: /^7489\d{16}$/
  },
  {
    name: 'fedex',
    regex: /^6129\d{16}$/
  },
  {
    name: 'usps',
    regex: /^(91|92|93|94|95|96)\d{20}$/,
    confirm: _confirmUsps22
  },
  {
    name: 'usps',
    regex: /^\d{26}$/,
    confirm: _confirmUsps26
  },
  {
    name: 'usps',
    regex: /^420\d{27}$/,
    confirm: _confirmUsps420Zip
  },
  {
    name: 'usps',
    regex: /^420\d{31}$/,
    confirm: _confirmUsps420ZipPlus4
  },
  {
    name: 'dhlgm',
    regex: /^420\d{27}$/,
    confirm: _confirmUsps420Zip
  },
  {
    name: 'dhlgm',
    regex: /^420\d{31}$/,
    confirm: _confirmUsps420ZipPlus4
  },
  {
    name: 'dhlgm',
    regex: /^94748\d{17}$/,
    confirm: _confirmUsps22
  },
  {
    name: 'dhlgm',
    regex: /^93612\d{17}$/,
    confirm: _confirmUsps22
  },
  {
    name: 'dhlgm',
    regex: /^GM\d{16}/
  },
  {
    name: 'usps',
    regex: /^[A-Z]{2}\d{9}[A-Z]{2}$/
  },
  {
    name: 'canadapost',
    regex: /^\d{16}$/,
    confirm: _confirmCanadaPost16
  },
  {
    name: 'lasership',
    regex: /^L[A-Z]\d{8}$/
  },
  {
    name: 'lasership',
    regex: /^1LS\d{12}/
  },
  {
    name: 'lasership',
    regex: /^Q\d{8}[A-Z]/
  },
  {
    name: 'ontrac',
    regex: /^(C|D)\d{14}$/
  },
  {
    name: 'prestige',
    regex: /^P[A-Z]{1}\d{8}/
  },
  {
    name: 'a1intl',
    regex: /^AZ.\d+/,
    confirm: _confirmA1International
  }
];

const _preProcess = id => {
  return upperCase(id.replace(/\s+/g, ''));
};

class Guess {
  constructor(id) {
    let pid = _preProcess(id);
    CARRIERS.every(carrier => {
      let good, stop, _ref;
      if (pid.match(carrier.regex)) {
        if (carrier.confirm != null) {
          (_ref = carrier.confirm(pid)), (good = _ref[0]), (stop = _ref[1]);
          console.log('ref', _ref);
          if (good) {
            carriers.push(carrier.name);
          }
          return !stop;
        }
        carriers.push(carrer.name);
        return true;
      }
      return true;
    });
    return uniq(carriers);
  }
}

module.exports = Guess;
