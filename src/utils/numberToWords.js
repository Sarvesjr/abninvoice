/**
 * Converts a number to Indian Currency Words format.
 * E.g., 40194.00 -> "Rupees Forty Thousand One Hundred Ninety Four Only"
 */

const units = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(n) {
  let str = '';
  if (n >= 100) {
    str += units[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += tens[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += units[n] + ' ';
  }
  return str.trim();
}

export function numberToWordsIndian(amount) {
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) return '';
  if (num === 0) return 'Rupees Zero Only';

  const fixed = num.toFixed(2);
  const parts = fixed.split('.');
  let integerPart = parseInt(parts[0], 10);
  const paisePart = parseInt(parts[1], 10);

  if (integerPart === 0 && paisePart === 0) {
    return 'Rupees Zero Only';
  }

  let words = '';

  const crore = Math.floor(integerPart / 10000000);
  integerPart %= 10000000;

  const lakh = Math.floor(integerPart / 100000);
  integerPart %= 100000;

  const thousand = Math.floor(integerPart / 1000);
  integerPart %= 1000;

  const remainder = integerPart;

  if (crore > 0) {
    words += convertBelowThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertBelowThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertBelowThousand(thousand) + ' Thousand ';
  }
  if (remainder > 0) {
    words += convertBelowThousand(remainder) + ' ';
  }

  words = words.trim();
  let result = words ? `Rupees ${words}` : '';

  if (paisePart > 0) {
    const paiseWords = convertBelowThousand(paisePart);
    if (result) {
      result += ` and ${paiseWords} Paise`;
    } else {
      result = `${paiseWords} Paise`;
    }
  }

  return `${result} Only`;
}

