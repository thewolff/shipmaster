'use strict';

const _ = require('lodash');

const upperCase = require('change-case').upperCase;
const uniq = require('lodash').uniq;

const trueTrueArr = [true, true];
const trueFalseArr = [true, false];
const falseFalseArr = [false, false];
let multi1 = [3, 1];
let multi2 = [...multi1, 7];
let multi3 = [...multi1].reverse();

let _preprocess = id => upperCase(id.replace(/\s+/g, ''));

let _confirmUps = function(id) {
  let sum = 0;
  for (let index = 2; index <= 16; index++) {
    var num;
    let asciiValue = id[index].charCodeAt(0);
    if (asciiValue >= 48 && asciiValue <= 57) {
      num = parseInt(id[index], 10);
    } else {
      num = (asciiValue - 63) % 10;
    }

    if (index % 2 !== 0) {
      num = num * 2;
    }
    sum += num;
  }

  let checkdigit = sum % 10 > 0 ? 10 - sum % 10 : 0;
  if (checkdigit === parseInt(id[17], 10)) {
    return trueTrueArr;
  }
  return falseFalseArr;
};

let _checkDigit = function(id, multipliers, mod) {
  let checkdigit;
  let midx = 0;
  let sum = 0;
  for (
    let index = 0, end = id.length - 2, asc = 0 <= end;
    asc ? index <= end : index >= end;
    asc ? index++ : index--
  ) {
    sum += parseInt(id[index], 10) * multipliers[midx];
    midx = midx === multipliers.length - 1 ? 0 : midx + 1;
  }
  if (mod === 11) {
    checkdigit = sum % 11;
    if (checkdigit === 10) {
      checkdigit = 0;
    }
  }
  if (mod === 10) {
    checkdigit = 0;
    if (sum % 10 > 0) {
      checkdigit = 10 - sum % 10;
    }
  }
  return checkdigit === parseInt(id[id.length - 1]);
};

let _confirmUpsFreight = function(id) {
  let firstChar = `${(id.charCodeAt(0) - 63) % 10}`;
  let remaining = id.slice(1);
  id = `${firstChar}${remaining}`;
  if (_checkDigit(id, multi2, 10)) {
    return trueTrueArr;
  }
  return falseFalseArr;
};

let _confirmFedex12 = function(id) {
  if (_checkDigit(id, multi2, 11)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmFedexDoorTag = function(id) {
  if (_checkDigit(id.match(/^DT(\d{12})$/)[1], multi2, 11)) {
    return trueTrueArr;
  }
  return falseFalseArr;
};

let _confirmFedexSmartPost = function(id) {
  if (_checkDigit(`91${id}`, multi1, 10)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmFedex15 = function(id) {
  if (_checkDigit(id, multi3, 10)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmFedex20 = function(id) {
  if (_checkDigit(id, multi2, 11)) {
    return trueFalseArr;
  } else {
    let alteredId = `92${id}`;
    if (_checkDigit(alteredId, multi1, 10)) {
      return trueFalseArr;
    }
  }
  return falseFalseArr;
};

let _confirmUsps20 = function(id) {
  if (_checkDigit(id, multi1, 10)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmFedex9622 = function(id) {
  if (_checkDigit(id, multi2, 11)) {
    return trueFalseArr;
  }
  if (_checkDigit(id.slice(7), multi3, 10)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmUsps22 = function(id) {
  if (_checkDigit(id, multi1, 10)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmUsps26 = function(id) {
  if (_checkDigit(id, multi1, 10)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmUsps420Zip = function(id) {
  if (_checkDigit(id.match(/^420\d{5}(\d{22})$/)[1], multi1, 10)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmUsps420ZipPlus4 = function(id) {
  if (_checkDigit(id.match(/^420\d{9}(\d{22})$/)[1], multi1, 10)) {
    return trueFalseArr;
  } else {
    if (_checkDigit(id.match(/^420\d{5}(\d{26})$/)[1], multi1, 10)) {
      return trueFalseArr;
    }
  }
  return falseFalseArr;
};

let _confirmCanadaPost16 = function(id) {
  if (_checkDigit(id, multi1, 10)) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

let _confirmA1International = function(id) {
  if (id.length === 9 || id.length === 13) {
    return trueFalseArr;
  }
  return falseFalseArr;
};

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

class Guess {
  constructor(id) {
    const pid = _preprocess(id);
    let carriers = [];
    CARRIERS.every(function(c) {
      if (id.match(c.regex)) {
        if (c.confirm != null) {
          let [good, stop] = Array.from(c.confirm(id));
          if (good) {
            carriers.push(c.name);
          }
          return !stop;
        }
        carriers.push(c.name);
        return true;
      }
      return true;
    });
    return uniq(carriers);
  }
}

module.exports = Guess;
