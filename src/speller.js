const DIGIT_WORDS = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen'
];

const TENS_WORDS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety'
];

function spellUnderHundred(val) {
  if (val < 20) {
    return DIGIT_WORDS[val];
  }
  const tensPart = TENS_WORDS[Math.floor(val / 10)];
  const unitPart = DIGIT_WORDS[val % 10];
  return unitPart ? `${tensPart} ${unitPart}` : tensPart;
}

function spellUnderThousand(val) {
  if (val === 0) return '';
  const hundreds = Math.floor(val / 100);
  const remainder = val % 100;

  if (hundreds > 0 && remainder > 0) {
    return `${DIGIT_WORDS[hundreds]} Hundred ${spellUnderHundred(remainder)}`;
  }
  if (hundreds > 0) {
    return `${DIGIT_WORDS[hundreds]} Hundred`;
  }
  return spellUnderHundred(remainder);
}

// Indian numbering scale: Thousands (10^3), Lakhs (10^5), Crores (10^7)
function spellPositiveInteger(val) {
  if (val === 0) return 'Zero';

  // Recursive handle for values >= 1 Crore (handles arbitrarily large numbers)
  if (val >= 10000000) {
    const crores = Math.floor(val / 10000000);
    const rem = val % 10000000;
    const croreLabel = `${spellPositiveInteger(crores)} Crore`;
    return rem > 0 ? `${croreLabel} ${spellPositiveInteger(rem)}` : croreLabel;
  }

  const chunks = [];

  const lakhs = Math.floor(val / 100000);
  if (lakhs > 0) {
    chunks.push(`${spellUnderHundred(lakhs)} Lakh`);
    val %= 100000;
  }

  const thousands = Math.floor(val / 1000);
  if (thousands > 0) {
    chunks.push(`${spellUnderHundred(thousands)} Thousand`);
    val %= 1000;
  }

  if (val > 0) {
    chunks.push(spellUnderThousand(val));
  }

  return chunks.join(' ').trim();
}

function normalizeInput(value) {
  if (value === null || value === undefined) {
    throw new TypeError('Amount must be provided as a number or string');
  }

  if (typeof value === 'bigint') {
    const isNegative = value < 0n;
    const unsigned = isNegative ? -value : value;
    return { isNegative, integerPart: Number(unsigned), fractionPart: 0 };
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new RangeError('Amount must be a finite number');
    }
    const isNegative = value < 0;
    const abs = Math.abs(value);
    const integerPart = Math.floor(abs);
    // Avoid floating point inaccuracies by parsing fixed decimals
    const rawFrac = Math.round((abs - integerPart) * 100);
    if (rawFrac === 100) {
      return { isNegative, integerPart: integerPart + 1, fractionPart: 0 };
    }
    return { isNegative, integerPart, fractionPart: rawFrac };
  }

  if (typeof value === 'string') {
    const sanitized = value.trim().replace(/,/g, '');
    if (!sanitized || isNaN(Number(sanitized))) {
      throw new TypeError(`Cannot parse invalid numeric string: "${value}"`);
    }
    const isNegative = sanitized.startsWith('-');
    const cleanStr = isNegative ? sanitized.slice(1) : sanitized;
    const [intStr, decStr] = cleanStr.split('.');

    let integerPart = parseInt(intStr || '0', 10);
    let fractionPart = 0;

    if (decStr) {
      const parsedDec = Math.round(parseFloat(`0.${decStr}`) * 100);
      if (parsedDec === 100) {
        integerPart += 1;
      } else {
        fractionPart = parsedDec;
      }
    }

    return { isNegative, integerPart, fractionPart };
  }

  throw new TypeError(`Unsupported input type: ${typeof value}`);
}

function applyCasing(text, casing) {
  switch (casing) {
    case 'lower':
      return text.toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'title':
    default:
      return text;
  }
}

function numberToWords(amount, options = {}) {
  const {
    currency = false,
    ignoreDecimal = false,
    case: casing = 'title'
  } = options;

  const { isNegative, integerPart, fractionPart } = normalizeInput(amount);

  let output = '';

  if (currency) {
    const hasRupees = integerPart > 0;
    const hasPaise = fractionPart > 0 && !ignoreDecimal;

    if (!hasRupees && !hasPaise) {
      output = 'Zero Rupees Only';
    } else {
      const parts = [];

      if (hasRupees) {
        const word = spellPositiveInteger(integerPart);
        const unit = integerPart === 1 ? 'Rupee' : 'Rupees';
        parts.push(`${word} ${unit}`);
      }

      if (hasPaise) {
        const word = spellUnderHundred(fractionPart);
        const unit = fractionPart === 1 ? 'Paisa' : 'Paise';
        if (parts.length > 0) {
          parts.push(`and ${word} ${unit}`);
        } else {
          parts.push(`${word} ${unit}`);
        }
      }

      output = `${parts.join(' ')} Only`;
    }
  } else {
    output = spellPositiveInteger(integerPart);

    if (fractionPart > 0 && !ignoreDecimal) {
      const decWords = spellUnderHundred(fractionPart);
      output = `${output} point ${decWords}`;
    }
  }

  // Prepend minus for negative values
  if (isNegative) {
    output = `Minus ${output}`;
  }

  return applyCasing(output, casing);
}

module.exports = {
  numberToWords,
  spellPositiveInteger,
  spellUnderHundred
};
