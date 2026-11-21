const test = require('node:test');
const assert = require('node:assert/strict');
const { numberToWords, toWords } = require('../src/index');

test('numberToWords - single digits and teens', () => {
  assert.equal(numberToWords(0), 'Zero');
  assert.equal(numberToWords(1), 'One');
  assert.equal(numberToWords(7), 'Seven');
  assert.equal(numberToWords(11), 'Eleven');
  assert.equal(numberToWords(19), 'Nineteen');
});

test('numberToWords - tens and hundreds', () => {
  assert.equal(numberToWords(20), 'Twenty');
  assert.equal(numberToWords(45), 'Forty Five');
  assert.equal(numberToWords(100), 'One Hundred');
  assert.equal(numberToWords(105), 'One Hundred Five');
  assert.equal(numberToWords(999), 'Nine Hundred Ninety Nine');
});

test('numberToWords - Indian scale (Thousands, Lakhs, Crores)', () => {
  assert.equal(numberToWords(1000), 'One Thousand');
  assert.equal(numberToWords(25000), 'Twenty Five Thousand');
  assert.equal(numberToWords(100000), 'One Lakh');
  assert.equal(numberToWords(1500000), 'Fifteen Lakh');
  assert.equal(numberToWords(10000000), 'One Crore');
  assert.equal(numberToWords(20500000), 'Two Crore Five Lakh');
  assert.equal(numberToWords(1050000000), 'One Hundred Five Crore');
});

test('numberToWords - decimals without currency option', () => {
  assert.equal(numberToWords(10.5), 'Ten point Fifty');
  assert.equal(numberToWords(10.05), 'Ten point Five');
  assert.equal(numberToWords(10.75, { ignoreDecimal: true }), 'Ten');
});

test('numberToWords - with currency: true', () => {
  assert.equal(numberToWords(0, { currency: true }), 'Zero Rupees Only');
  assert.equal(numberToWords(1, { currency: true }), 'One Rupee Only');
  assert.equal(numberToWords(2, { currency: true }), 'Two Rupees Only');
  assert.equal(numberToWords(0.5, { currency: true }), 'Fifty Paise Only');
  assert.equal(numberToWords(0.01, { currency: true }), 'One Paisa Only');
  assert.equal(numberToWords(150250.75, { currency: true }), 'One Lakh Fifty Thousand Two Hundred Fifty Rupees and Seventy Five Paise Only');
  assert.equal(numberToWords('50,000', { currency: true }), 'Fifty Thousand Rupees Only');
});

test('numberToWords - negative values', () => {
  assert.equal(numberToWords(-500), 'Minus Five Hundred');
  assert.equal(numberToWords(-150.5, { currency: true }), 'Minus One Hundred Fifty Rupees and Fifty Paise Only');
});

test('numberToWords - casing options', () => {
  assert.equal(numberToWords(500, { case: 'lower' }), 'five hundred');
  assert.equal(numberToWords(500, { case: 'upper' }), 'FIVE HUNDRED');
  assert.equal(numberToWords(500, { case: 'sentence' }), 'Five hundred');
});

test('numberToWords - alias toWords works identically', () => {
  assert.equal(toWords(1000), 'One Thousand');
});

test('numberToWords - invalid inputs throw descriptive errors', () => {
  assert.throws(() => numberToWords(null), /TypeError/);
  assert.throws(() => numberToWords(undefined), /TypeError/);
  assert.throws(() => numberToWords('not-a-number'), /TypeError/);
  assert.throws(() => numberToWords(Infinity), /RangeError/);
});
