import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './auth/authContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import InvoiceEditor from './components/InvoiceEditor';
import ReviewView from './components/ReviewView';
import SettingsModal from './components/SettingsModal';
import { calculateInvoiceTotals, generateIgstInfoText } from './utils/calculations';
import {
  getNextInvoiceNumber,
  incrementInvoiceNumber,
  getSavedInvoices,
  saveInvoiceToHistory,
  deleteSavedInvoice,
  getDraftInvoice,
  saveDraftInvoice,
  clearDraftInvoice,
  getSettings
} from './utils/storage';
import { SAMPLE_INVOICE_1 } from './constants/sampleData';

function getTodayFormatted() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

function createBlankInvoice(nextNo) {
  const settings = getSettings();
  return {
    id: `inv-${Date.now()}`,
    customer: {
      name: '',
      clinicName: '',
      address: '',
      mobile: '',
      email: ''
    },
    invoiceMeta: {
      invoiceNo: (nextNo || 2519).toString(),
      date: getTodayFormatted(),
      lrNo: settings.defaultLrNo || 'AKR',
      cases: '',
      transport: settings.defaultTransport || 'AKR LORRY',
      dueDate: ''
    },
    items: [
      {
        id: 'item-1',
        product: '',
        packing: '',
        mfr: 'Panasa',
        batch: '',
        exp: '',
        qty: '',
        free: '',
        mrp: '',
        hsn: '0490',
        rate: '',
        gst: '5%'
      }
    ],
    taxSettings: {
      igstPercent: settings.defaultIgstPercent ?? 5,
      discountPercent: '',
      discountAmount: '',
      roundOff: ''
    },
    igstInfoText: '',
    remarks: ''
  };
}

export default function App() {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState('DASHBOARD'); // 'DASHBOARD' | 'EDIT' | 'REVIEW'
  const [invoices, setInvoices] = useState([]);
  const [nextInvoiceNo, setNextInvoiceNo] = useState(2519);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(() => createBlankInvoice(2519));

  // Initialize data on mount
  useEffect(() => {
    const list = getSavedInvoices();
    setInvoices(list);
    const nextNo = getNextInvoiceNumber();
    setNextInvoiceNo(nextNo);

    // If no invoices exist in storage yet, seed with Sample 1 so the user has immediate data to test!
    if (list.length === 0) {
      const seededTotals = calculateInvoiceTotals(
        SAMPLE_INVOICE_1.items,
        SAMPLE_INVOICE_1.taxSettings.igstPercent,
        SAMPLE_INVOICE_1.taxSettings.discountPercent,
        SAMPLE_INVOICE_1.taxSettings.discountAmount,
        SAMPLE_INVOICE_1.taxSettings.roundOff
      );
      const seeded = {
        ...SAMPLE_INVOICE_1,
        id: 'seed-2516',
        totals: seededTotals
      };
      saveInvoiceToHistory(seeded);
      setInvoices(getSavedInvoices());
    }
  }, []);

  // Compute calculated totals dynamically whenever invoiceData changes
  const computedInvoiceData = useMemo(() => {
    const calculated = calculateInvoiceTotals(
      invoiceData.items,
      invoiceData.taxSettings?.igstPercent,
      invoiceData.taxSettings?.discountPercent,
      invoiceData.taxSettings?.discountAmount,
      invoiceData.taxSettings?.roundOff,
      invoiceData.taxSettings?.lastDiscountEdit || 'PERCENT'
    );

    // Auto-generate dynamic IGST breakdown note from actual subtotal & tax rate
    const dynamicIgstText = generateIgstInfoText(
      calculated.subtotal,
      calculated.igstPercent,
      calculated.igstAmount
    );

    const effectiveIgstText = invoiceData.isCustomIgstText
      ? (invoiceData.igstInfoText || dynamicIgstText)
      : dynamicIgstText;

    return {
      ...invoiceData,
      igstInfoText: effectiveIgstText,
      totals: calculated
    };
  }, [invoiceData]);

  // Handle invoice data updates from the editor
  const handleUpdateInvoiceData = (updated) => {
    setInvoiceData(updated);
    saveDraftInvoice(updated);
  };

  // Create new invoice
  const handleCreateNew = () => {
    const currentNext = getNextInvoiceNumber();
    setNextInvoiceNo(currentNext);
    const newInv = createBlankInvoice(currentNext);
    setInvoiceData(newInv);
    setView('EDIT');
  };

  // Open existing invoice in Review mode
  const handleOpenInvoice = (existingData) => {
    setInvoiceData(existingData);
    setView('REVIEW');
  };

  // Open existing invoice in Edit mode
  const handleEditInvoice = (existingData) => {
    setInvoiceData(existingData);
    setView('EDIT');
  };

  // Duplicate an existing invoice
  const handleDuplicateInvoice = (existingData) => {
    const currentNext = getNextInvoiceNumber();
    const duplicated = {
      ...existingData,
      id: `inv-${Date.now()}`,
      invoiceMeta: {
        ...existingData.invoiceMeta,
        invoiceNo: currentNext.toString(),
        date: getTodayFormatted()
      }
    };
    setInvoiceData(duplicated);
    setView('EDIT');
  };

  // Delete invoice
  const handleDeleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice record?')) {
      const updated = deleteSavedInvoice(id);
      setInvoices(updated);
    }
  };

  // Clear current form
  const handleClearForm = () => {
    if (window.confirm('Clear all form fields and start fresh?')) {
      const currentNext = getNextInvoiceNumber();
      const fresh = createBlankInvoice(currentNext);
      setInvoiceData(fresh);
      clearDraftInvoice();
    }
  };

  // Load sample preset directly from Dashboard or presets
  const handleLoadSamplePreset = (presetData) => {
    const calculated = calculateInvoiceTotals(
      presetData.items,
      presetData.taxSettings?.igstPercent,
      presetData.taxSettings?.discountPercent,
      presetData.taxSettings?.discountAmount,
      presetData.taxSettings?.roundOff
    );
    const loaded = {
      ...presetData,
      id: `sample-${presetData.invoiceMeta.invoiceNo}`,
      totals: calculated
    };
    setInvoiceData(loaded);
    setView('REVIEW');
  };

  // Transition from Editor to Review
  const handleReview = () => {
    // Validate that there is at least one item
    if (!computedInvoiceData.items || computedInvoiceData.items.length === 0) {
      alert('Please include at least one product in the invoice.');
      return;
    }
    setView('REVIEW');
  };

  // Confirm and Print
  const handleConfirmAndPrint = () => {
    // Save to history
    saveInvoiceToHistory(computedInvoiceData);
    setInvoices(getSavedInvoices());

    // Increment invoice sequence if this invoice used the current next number
    const usedNo = parseInt(computedInvoiceData.invoiceMeta.invoiceNo, 10);
    const updatedNext = incrementInvoiceNumber(usedNo);
    setNextInvoiceNo(updatedNext);

    // Clear active draft
    clearDraftInvoice();

    // Trigger browser native printing dialog
    window.print();
  };

  // Settings updated
  const handleSettingsUpdated = () => {
    const nextNo = getNextInvoiceNumber();
    setNextInvoiceNo(nextNo);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-root">
      {view === 'DASHBOARD' && (
        <Dashboard
          invoices={invoices}
          nextInvoiceNo={nextInvoiceNo}
          onCreateNew={handleCreateNew}
          onOpenInvoice={handleOpenInvoice}
          onEditInvoice={handleEditInvoice}
          onDuplicateInvoice={handleDuplicateInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLoadSamplePreset={handleLoadSamplePreset}
        />
      )}

      {view === 'EDIT' && (
        <InvoiceEditor
          invoiceData={computedInvoiceData}
          onChangeInvoiceData={handleUpdateInvoiceData}
          onReview={handleReview}
          onBackToDashboard={() => setView('DASHBOARD')}
          onClearForm={handleClearForm}
        />
      )}

      {view === 'REVIEW' && (
        <ReviewView
          invoiceData={computedInvoiceData}
          onEdit={() => setView('EDIT')}
          onConfirmAndPrint={handleConfirmAndPrint}
          onBackToDashboard={() => setView('DASHBOARD')}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={handleSettingsUpdated}
      />
    </div>
  );
}

