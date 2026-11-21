export interface SpellOptions {
  currency?: boolean;
  ignoreDecimal?: boolean;
  case?: 'title' | 'lower' | 'upper' | 'sentence';
}

export interface FormatOptions {
  symbol?: boolean | string;
  decimals?: number;
}

export function numberToWords(amount: number | string | bigint, options?: SpellOptions): string;
export function toWords(amount: number | string | bigint, options?: SpellOptions): string;
export function formatINR(amount: number | string, options?: FormatOptions): string;

declare const inrToolkit: {
  numberToWords: typeof numberToWords;
  toWords: typeof toWords;
  formatINR: typeof formatINR;
};

export default inrToolkit;
