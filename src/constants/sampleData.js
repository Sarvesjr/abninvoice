/**
 * Sample datasets extracted from the three reference invoices in the attached PDF.
 * These can be loaded directly from the UI for quick demonstration and layout verification.
 */

export const SAMPLE_INVOICE_1 = {
  customer: {
    name: 'Dr. PAUN SAMY',
    clinicName: 'Amuthasurabhi Siddha Clinic',
    address: '6/674, Theveethi, Thingalur, Perundurai - 638 055.',
    mobile: '93626 88198',
    email: 'aataozapursamy.74@gmail.com'
  },
  invoiceMeta: {
    invoiceNo: '2516',
    date: '28.10.2026',
    lrNo: 'AKR',
    cases: '',
    transport: 'AKR LORRY',
    dueDate: ''
  },
  items: [
    {
      id: 'item-1',
      product: 'Partho -D Oint.',
      packing: '30 gm',
      mfr: 'Panasa',
      batch: '127',
      exp: '9/29',
      qty: 300,
      free: '',
      mrp: 99.00,
      hsn: '0490',
      rate: 49.50, // 300 * 49.50 = 14850.00 (matches PDF Line 1 amount and 40194 subtotal)
      gst: '5%'
    },
    {
      id: 'item-2',
      product: 'Parthod - D Syrup',
      packing: '200 ml',
      mfr: 'Panasa',
      batch: '183',
      exp: '9/29',
      qty: 288,
      free: '',
      mrp: 176.00,
      hsn: '0490',
      rate: 88.00, // 288 * 88.00 = 25344.00 (matches PDF Line 2 amount)
      gst: '5%'
    }
  ],
  taxSettings: {
    igstPercent: 5,
    discountPercent: 5,
    discountAmount: 2009.70,
    roundOff: 0.00
  },
  igstInfoText: '',
  remarks: ''
};

export const SAMPLE_INVOICE_2 = {
  customer: {
    name: 'Dr. PAUN SAMY',
    clinicName: 'Amuthasurabhi Siddha Clinic',
    address: '6/674, Theveethi, Thingalur, Perundurai - 638 055.',
    mobile: '93626 88198',
    email: 'aataozapursamy.74@gmail.com'
  },
  invoiceMeta: {
    invoiceNo: '2517',
    date: '28.10.2026',
    lrNo: 'AKR',
    cases: '',
    transport: 'AKR LORRY',
    dueDate: ''
  },
  items: [
    {
      id: 'item-1',
      product: 'Dhamasa 360 Syrup',
      packing: '1x200 ml',
      mfr: 'Panasa',
      batch: '020',
      exp: '8/29',
      qty: 144,
      free: '',
      mrp: 176.00,
      hsn: '0490',
      rate: 88.00,
      gst: '5%'
    },
    {
      id: 'item-2',
      product: 'Madhumuktha Tab',
      packing: '1x100 ml',
      mfr: 'Panasa',
      batch: '016',
      exp: '8/29',
      qty: 24,
      free: '',
      mrp: 534.00,
      hsn: '0490',
      rate: 267.00,
      gst: '5%'
    },
    {
      id: 'item-3',
      product: 'A.V. Zyme Syrup',
      packing: '1x200 ml',
      mfr: 'Panasa',
      batch: '023',
      exp: '7/29',
      qty: 144,
      free: '',
      mrp: 176.00,
      hsn: '0490',
      rate: 88.00,
      gst: '5%'
    },
    {
      id: 'item-4',
      product: 'Topsil Cream',
      packing: '1x100 ml',
      mfr: 'Panasa',
      batch: '017',
      exp: '9/29',
      qty: 120,
      free: '',
      mrp: 88.00,
      hsn: '0490',
      rate: 44.00,
      gst: '5%'
    }
  ],
  taxSettings: {
    igstPercent: 5,
    discountPercent: 5,
    discountAmount: 1851.60,
    roundOff: 0.00
  },
  igstInfoText: '',
  remarks: ''
};

export const SAMPLE_INVOICE_3 = {
  customer: {
    name: 'Dr. PAUN SAMY',
    clinicName: 'Amuthasurabhi Siddha Clinic',
    address: '6/674, Theveethi, Thingalur, Perundurai - 638 055.',
    mobile: '93626 88198',
    email: 'aataozapursamy.74@gmail.com'
  },
  invoiceMeta: {
    invoiceNo: '2518',
    date: '28.10.2026',
    lrNo: 'AKR',
    cases: '',
    transport: 'AKR LORRY',
    dueDate: ''
  },
  items: [
    {
      id: 'item-1',
      product: 'Fat Burner',
      packing: '200 ml',
      mfr: 'Dr. Veda',
      batch: '023',
      exp: '6/29',
      qty: 432,
      free: '',
      mrp: 206.00,
      hsn: '0490',
      rate: 103.00,
      gst: '5%'
    }
  ],
  taxSettings: {
    igstPercent: 5,
    discountPercent: 5,
    discountAmount: 2224.80,
    roundOff: 0.00
  },
  igstInfoText: '',
  remarks: ''
};
