# inr-words-cli

A zero-dependency Indian currency and number-to-words utility for Node.js and the command line.

Converts numeric amounts into the Indian numbering scale (Thousands, Lakhs, Crores) and provides Indian comma grouping (`₹ 12,34,567.89`).

## Features

- **Zero dependencies**: Uses native Node.js APIs (`node:util`, `node:test`).
- **Indian numbering system**: Handles Hundreds, Thousands, Lakhs, Crores, and beyond.
- **Dual module support**: Works with CommonJS (`require`) and ES Modules (`import`).
- **TypeScript definitions**: Bundled `.d.ts` types out of the box.
- **CLI included**: Use directly via `npx` or global install.

## Installation

```bash
npm install inr-words-cli
```

## Quick Start

### CommonJS (require)

```javascript
const { toWords, formatINR } = require('inr-words-cli');

// Convert numbers to words
console.log(toWords(150000));
// => "One Lakh Fifty Thousand"

// Invoicing & cheques (currency style)
console.log(toWords(150250.75, { currency: true }));
// => "One Lakh Fifty Thousand Two Hundred Fifty Rupees and Seventy Five Paise Only"

// Format with Indian commas
console.log(formatINR(1234567.89));
// => "₹ 12,34,567.89"
```

### ES Modules (import)

```javascript
import { toWords, formatINR } from 'inr-words-cli';

console.log(toWords(2500000));
// => "Twenty Five Lakh"
```

## CLI Usage

Run without installing via `npx`:

```bash
# Basic conversion
npx inr-words-cli 150000
# Output: One Lakh Fifty Thousand

# Currency mode (Rupees and Paise)
npx inr-words-cli 150250.75 -c
# Output: One Lakh Fifty Thousand Two Hundred Fifty Rupees and Seventy Five Paise Only

# Indian comma formatting
npx inr-words-cli 1234567.89 -f
# Output: ₹ 12,34,567.89

# Pipe via stdin
echo "75000" | npx inr-words-cli -c
# Output: Seventy Five Thousand Rupees Only
```

## API Reference

### `toWords(amount, options)` / `numberToWords(amount, options)`

Converts a number, bigint, or numeric string into words.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `currency` | `boolean` | `false` | Appends "Rupees" / "Paise" / "Only" suffix |
| `ignoreDecimal` | `boolean` | `false` | Ignores decimal / paise fraction |
| `case` | `string` | `'title'` | Casing style: `'title'`, `'lower'`, `'upper'`, `'sentence'` |

### `formatINR(amount, options)`

Formats a number into an Indian comma-separated string (`12,34,567.89`).

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `symbol` | `string \| boolean` | `'₹ '` | Prefix currency symbol (`false` to omit) |
| `decimals` | `number` | `2` | Number of decimal places |

## Testing

Run the test suite using Node's built-in test runner:

```bash
npm test
```

## License

MIT
