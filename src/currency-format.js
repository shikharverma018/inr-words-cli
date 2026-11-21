function formatINR(amount, options = {}) {
  const {
    symbol = '₹ ',
    decimals = 2
  } = options;

  if (amount === null || amount === undefined) {
    throw new TypeError('Amount must be provided as a number or string');
  }

  const numVal = typeof amount === 'string'
    ? parseFloat(amount.trim().replace(/,/g, ''))
    : Number(amount);

  if (!Number.isFinite(numVal)) {
    throw new RangeError('Amount must be a finite number');
  }

  const isNegative = numVal < 0;
  const absVal = Math.abs(numVal);

  const fixedStr = absVal.toFixed(decimals);
  const [intPart, decPart] = fixedStr.split('.');

  // Indian comma format: 3 rightmost digits, followed by pairs of 2
  let formattedInt = '';
  if (intPart.length > 3) {
    const lastThree = intPart.slice(-3);
    const leading = intPart.slice(0, -3);
    const groupedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formattedInt = `${groupedLeading},${lastThree}`;
  } else {
    formattedInt = intPart;
  }

  const decimalSuffix = decimals > 0 && decPart !== undefined ? `.${decPart}` : '';
  const prefix = typeof symbol === 'string' ? symbol : (symbol ? '₹ ' : '');
  const sign = isNegative ? '-' : '';

  return `${sign}${prefix}${formattedInt}${decimalSuffix}`;
}

module.exports = {
  formatINR
};
