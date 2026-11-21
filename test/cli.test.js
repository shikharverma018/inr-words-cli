const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const cliPath = path.resolve(__dirname, '../bin/cli.js');

function runCli(args, input = '') {
  return execFileSync(process.execPath, [cliPath, ...args], {
    input,
    encoding: 'utf-8'
  }).trim();
}

test('CLI - converts plain number to words', () => {
  const result = runCli(['150000']);
  assert.equal(result, 'One Lakh Fifty Thousand');
});

test('CLI - converts currency with -c flag', () => {
  const result = runCli(['150250.75', '-c']);
  assert.equal(result, 'One Lakh Fifty Thousand Two Hundred Fifty Rupees and Seventy Five Paise Only');
});

test('CLI - supports casing options', () => {
  const result = runCli(['5000', '-c', '--case', 'lower']);
  assert.equal(result, 'five thousand rupees only');
});

test('CLI - formats as Indian currency string with -f', () => {
  const result = runCli(['1234567.89', '-f']);
  assert.equal(result, '₹ 12,34,567.89');
});

test('CLI - reads from stdin pipe', () => {
  const result = runCli([], '25000');
  assert.equal(result, 'Twenty Five Thousand');
});
