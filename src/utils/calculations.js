/**
 * Precision calculation utilities for A.B.N. HERBALS Invoice Billing
 */

export function roundTo2(num) {
  const n = Number(num);
  if (isNaN(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
}

export function formatIndianNumber(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '0.00';
  const parts = num.toFixed(2).split('.');
  let intPart = parts[0];
  const decPart = parts[1];

  // Indian numbering regex: last 3 digits, then groups of 2
  const lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== '') {
    intPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return intPart + '.' + decPart;
}

export function calculateLineAmount(qty, rate) {
  const q = parseFloat(qty) || 0;
  const r = parseFloat(rate) || 0;
  return roundTo2(q * r);
}

/**
 * Calculates complete invoice totals.
 * @param {Array} items - List of product rows
 * @param {number} igstPercent - IGST percentage (e.g. 5)
 * @param {number} discountPercent - Discount percentage (e.g. 5)
 * @param {number} manualDiscountAmount - Optional explicit discount amount if discountPercent is custom/empty
 * @param {number} roundOff - User entered or auto round off
 */
export function calculateInvoiceTotals(
  items = [],
  igstPercent = 5,
  discountPercent = '',
  discountAmountInput = '',
  roundOffInput = 0,
  lastDiscountEdit = 'PERCENT'
) {
  // 1. Subtotal = Sum of all product amounts
  let subtotal = 0;
  const processedItems = items.map((item, index) => {
    const lineAmount = calculateLineAmount(item.qty, item.rate);
    subtotal += lineAmount;
    return {
      ...item,
      sNo: index + 1,
      amount: lineAmount
    };
  });

  subtotal = roundTo2(subtotal);

  // 2. IGST Amount = Subtotal * (IGST% / 100)
  const taxRate = parseFloat(igstPercent) || 0;
  const igstAmount = roundTo2(subtotal * (taxRate / 100));

  // 3. Total = Subtotal + IGST Amount
  const total = roundTo2(subtotal + igstAmount);

  // 4. Discount Amount
  let discountAmount = 0;
  let effectiveDiscountPercent = 0;

  const hasPercent = discountPercent !== null && discountPercent !== undefined && discountPercent !== '' && !isNaN(parseFloat(discountPercent));
  const hasAmount = discountAmountInput !== null && discountAmountInput !== undefined && discountAmountInput !== '' && !isNaN(parseFloat(discountAmountInput));

  if (lastDiscountEdit === 'AMOUNT' && hasAmount) {
    discountAmount = roundTo2(parseFloat(discountAmountInput) || 0);
    effectiveDiscountPercent = subtotal > 0 ? roundTo2((discountAmount / subtotal) * 100) : 0;
  } else if (hasPercent) {
    effectiveDiscountPercent = parseFloat(discountPercent) || 0;
    discountAmount = roundTo2((subtotal * effectiveDiscountPercent) / 100);
  } else if (hasAmount) {
    discountAmount = roundTo2(parseFloat(discountAmountInput) || 0);
    effectiveDiscountPercent = subtotal > 0 ? roundTo2((discountAmount / subtotal) * 100) : 0;
  }

  // 5. Round off and Grand Total: Subtract round off as per accounting requirement
  const roundOff = parseFloat(roundOffInput) || 0;
  const rawGrandTotal = total - discountAmount - roundOff;
  const grandTotal = roundTo2(rawGrandTotal);

  return {
    items: processedItems,
    subtotal,
    igstPercent: taxRate,
    igstAmount,
    total,
    discountPercent: effectiveDiscountPercent,
    discountAmount,
    roundOff,
    grandTotal
  };
}

export function generateIgstInfoText(subtotal, igstPercent, igstAmount) {
  const s = parseFloat(subtotal) || 0;
  if (s <= 0) return '';
  const taxRate = parseFloat(igstPercent) || 0;
  const half = (taxRate / 2).toFixed(1);
  const amt = parseFloat(igstAmount) || 0;
  return `IGST ${formatIndianNumber(s)} ${half}%+${half}% = ${formatIndianNumber(amt)} IGST`;
}


