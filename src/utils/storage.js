/**
 * LocalStorage management for ABN Herbals Billing Application
 */

const STORAGE_KEYS = {
  INVOICE_SEQUENCE: 'abn_invoice_sequence',
  SAVED_INVOICES: 'abn_saved_invoices',
  CURRENT_DRAFT: 'abn_invoice_draft',
  SETTINGS: 'abn_app_settings'
};

const DEFAULT_SETTINGS = {
  defaultTransport: 'AKR LORRY',
  defaultLrNo: 'AKR',
  defaultIgstPercent: 5,
  defaultDiscountPercent: '',
  startingInvoiceNo: 2519
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getNextInvoiceNumber() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.INVOICE_SEQUENCE);
    if (stored !== null && !isNaN(parseInt(stored, 10))) {
      return parseInt(stored, 10);
    }
    const settings = getSettings();
    return settings.startingInvoiceNo || 2519;
  } catch (e) {
    return 2519;
  }
}

export function incrementInvoiceNumber(usedNumber) {
  try {
    const current = parseInt(usedNumber, 10);
    const next = isNaN(current) ? getNextInvoiceNumber() + 1 : current + 1;
    localStorage.setItem(STORAGE_KEYS.INVOICE_SEQUENCE, next.toString());
    return next;
  } catch (e) {
    console.error('Failed to increment invoice number:', e);
  }
}

export function setNextInvoiceNumber(number) {
  try {
    localStorage.setItem(STORAGE_KEYS.INVOICE_SEQUENCE, number.toString());
  } catch (e) {
    console.error('Failed to set next invoice number:', e);
  }
}

export function getSavedInvoices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_INVOICES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load saved invoices:', e);
    return [];
  }
}

export function saveInvoiceToHistory(invoiceData) {
  try {
    const list = getSavedInvoices();
    const existingIndex = list.findIndex(inv => inv.id === invoiceData.id);
    const invoiceRecord = {
      id: invoiceData.id || `inv-${Date.now()}`,
      invoiceNo: invoiceData.invoiceMeta.invoiceNo,
      date: invoiceData.invoiceMeta.date,
      customerName: invoiceData.customer.name,
      clinicName: invoiceData.customer.clinicName,
      grandTotal: invoiceData.totals.grandTotal,
      itemsCount: invoiceData.items.length,
      updatedAt: new Date().toISOString(),
      data: invoiceData
    };

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = invoiceRecord;
    } else {
      updatedList = [invoiceRecord, ...list];
    }

    localStorage.setItem(STORAGE_KEYS.SAVED_INVOICES, JSON.stringify(updatedList));
    return invoiceRecord;
  } catch (e) {
    console.error('Failed to save invoice record:', e);
    return null;
  }
}

export function setAllSavedInvoices(invoicesList) {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_INVOICES, JSON.stringify(invoicesList));
    return invoicesList;
  } catch (e) {
    console.error('Failed to set saved invoices:', e);
    return [];
  }
}

export function deleteSavedInvoice(id) {
  try {
    const list = getSavedInvoices().filter(inv => inv.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_INVOICES, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error('Failed to delete invoice:', e);
    return [];
  }
}

export function getDraftInvoice() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load draft:', e);
    return null;
  }
}

export function saveDraftInvoice(draft) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to save draft:', e);
  }
}

export function clearDraftInvoice() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);
  } catch (e) {
    console.error('Failed to clear draft:', e);
  }
}

