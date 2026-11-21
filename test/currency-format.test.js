const test = require('node:test');
const assert = require('node:assert/strict');
const { formatINR } = require('../src/index');

test('formatINR - standard formatting with symbol', () => {
  assert.equal(formatINR(0), '₹ 0.00');
  assert.equal(formatINR(500), '₹ 500.00');
  assert.equal(formatINR(1000), '₹ 1,000.00');
  assert.equal(formatINR(10000), '₹ 10,000.00');
  assert.equal(formatINR(100000), '₹ 1,00,000.00');
  assert.equal(formatINR(1234567.89), '₹ 12,34,567.89');
  assert.equal(formatINR(10000000), '₹ 1,00,00,000.00');
});

test('formatINR - custom symbol and no symbol', () => {
  assert.equal(formatINR(50000, { symbol: false }), '50,000.00');
  assert.equal(formatINR(50000, { symbol: 'Rs. ' }), 'Rs. 50,000.00');
  assert.equal(formatINR(50000, { symbol: 'INR ' }), 'INR 50,000.00');
});

test('formatINR - custom decimals', () => {
  assert.equal(formatINR(150000, { decimals: 0 }), '₹ 1,50,000');
  assert.equal(formatINR(150000.456, { decimals: 3 }), '₹ 1,50,000.456');
});

test('formatINR - negative values', () => {
  assert.equal(formatINR(-25000), '-₹ 25,000.00');
});

test('formatINR - string inputs', () => {
  assert.equal(formatINR('150000.50'), '₹ 1,50,000.50');
  assert.equal(formatINR('  1,50,000.50  '), '₹ 1,50,000.50');
});

test('formatINR - error on invalid inputs', () => {
  assert.throws(() => formatINR(null), /TypeError/);
  assert.throws(() => formatINR('invalid'), /RangeError/);
});
