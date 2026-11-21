const { numberToWords } = require('./speller');
const { formatINR } = require('./currency-format');

module.exports = {
  numberToWords,
  toWords: numberToWords,
  formatINR
};
