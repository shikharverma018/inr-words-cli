#!/usr/bin/env node

const { parseArgs } = require('node:util');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { numberToWords, formatINR } = require('../src/index');

const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

const cliOptions = {
  currency: { type: 'boolean', short: 'c', default: false },
  format: { type: 'boolean', short: 'f', default: false },
  case: { type: 'string', default: 'title' },
  symbol: { type: 'string', short: 's', default: '₹ ' },
  decimals: { type: 'string', short: 'd', default: '2' },
  help: { type: 'boolean', short: 'h', default: false },
  version: { type: 'boolean', short: 'v', default: false }
};

function displayHelp() {
  console.log(`
inr-words-cli (v${packageJson.version})
Convert numbers and INR amounts to words or Indian comma format.

Usage:
  inr-words <number> [flags]
  echo "125000" | inr-words [flags]

Flags:
  -c, --currency          Format as currency (Rupees and Paise)
  -f, --format            Format as Indian comma separated string
      --case <style>      Letter casing: title, lower, upper, sentence
  -s, --symbol <text>     Prefix symbol when using --format (default: "₹ ")
  -d, --decimals <count>  Decimal places when using --format (default: 2)
  -v, --version           Print version
  -h, --help              Print this guidance

Examples:
  inr-words 150000
  inr-words 150250.75 -c
  inr-words 10000000 --format
  inr-words 5000 -c --case lower
`);
}

function main() {
  let parsed;
  try {
    parsed = parseArgs({
      options: cliOptions,
      allowPositionals: true,
      strict: true
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { values, positionals } = parsed;

  if (values.help) {
    displayHelp();
    process.exit(0);
  }

  if (values.version) {
    console.log(packageJson.version);
    process.exit(0);
  }

  let valueToProcess = positionals[0];

  // Fall back to standard input if no positional argument was provided
  if (!valueToProcess && !process.stdin.isTTY) {
    try {
      valueToProcess = readFileSync(0, 'utf-8').trim();
    } catch {
      valueToProcess = '';
    }
  }

  if (!valueToProcess) {
    console.error('Error: Please provide a numeric value.');
    console.error('Try "inr-words --help" for available options.');
    process.exit(1);
  }

  try {
    if (values.format) {
      const parsedDec = parseInt(values.decimals, 10);
      const formatted = formatINR(valueToProcess, {
        symbol: values.symbol,
        decimals: Number.isInteger(parsedDec) ? parsedDec : 2
      });
      console.log(formatted);
    } else {
      const words = numberToWords(valueToProcess, {
        currency: values.currency,
        case: values.case
      });
      console.log(words);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
