import React from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, FileText, Plus } from 'lucide-react';
import InvoiceDocument from './InvoiceDocument';
import { SAMPLE_INVOICE_1, SAMPLE_INVOICE_2, SAMPLE_INVOICE_3 } from '../constants/sampleData';

export default function InvoiceEditor({
  invoiceData,
  onChangeInvoiceData,
  onReview,
  onBackToDashboard,
  onClearForm
}) {
  const { customer, invoiceMeta, items, taxSettings, igstInfoText, remarks } = invoiceData;

  const handleCustomerChange = (field, val) => {
    onChangeInvoiceData({
      ...invoiceData,
      customer: { ...customer, [field]: val }
    });
  };

  const handleMetaChange = (field, val) => {
    onChangeInvoiceData({
      ...invoiceData,
      invoiceMeta: { ...invoiceMeta, [field]: val }
    });
  };

  const handleItemChange = (index, field, val) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    onChangeInvoiceData({
      ...invoiceData,
      items: updated
    });
  };

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}-${Math.random()}`,
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
    };
    onChangeInvoiceData({
      ...invoiceData,
      items: [...items, newItem]
    });
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    onChangeInvoiceData({
      ...invoiceData,
      items: updated
    });
  };

  const handleTaxSettingsChange = (fieldOrUpdates, maybeVal) => {
    if (typeof fieldOrUpdates === 'string') {
      onChangeInvoiceData({
        ...invoiceData,
        taxSettings: { ...taxSettings, [fieldOrUpdates]: maybeVal }
      });
    } else {
      onChangeInvoiceData({
        ...invoiceData,
        taxSettings: { ...taxSettings, ...fieldOrUpdates }
      });
    }
  };

  const handleIgstInfoChange = (val) => {
    onChangeInvoiceData({
      ...invoiceData,
      igstInfoText: val,
      isCustomIgstText: val.trim() !== ''
    });
  };

  const handleRemarksChange = (val) => {
    onChangeInvoiceData({
      ...invoiceData,
      remarks: val
    });
  };

  const loadSample = (sampleType) => {
    let chosenSample;
    if (sampleType === '1') chosenSample = SAMPLE_INVOICE_1;
    else if (sampleType === '2') chosenSample = SAMPLE_INVOICE_2;
    else if (sampleType === '3') chosenSample = SAMPLE_INVOICE_3;

    if (chosenSample) {
      onChangeInvoiceData({
        ...invoiceData,
        customer: { ...chosenSample.customer },
        invoiceMeta: {
          ...invoiceData.invoiceMeta, // keep current invoice # or use sample's
          invoiceNo: chosenSample.invoiceMeta.invoiceNo,
          date: chosenSample.invoiceMeta.date,
          lrNo: chosenSample.invoiceMeta.lrNo,
          transport: chosenSample.invoiceMeta.transport
        },
        items: chosenSample.items.map(it => ({ ...it, id: `item-${Math.random()}` })),
        taxSettings: { ...chosenSample.taxSettings },
        igstInfoText: chosenSample.igstInfoText,
        remarks: chosenSample.remarks
      });
    }
  };

  return (
    <div>
      {/* Top Editor Action Bar */}
      <div className="editor-nav-bar no-print">
        <div className="editor-nav-left">
          <button type="button" className="btn-secondary" onClick={onBackToDashboard}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
              Invoice #{invoiceMeta.invoiceNo || 'New'}
            </span>
          </div>
        </div>

        <div className="editor-nav-right">
          {/* Quick Preset Selector for Reference Invoices */}
          <div className="sample-selector">
            <FileText size={15} />
            <span>Presets:</span>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  loadSample(e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <option value="" disabled>Load Reference Sample...</option>
              <option value="1">Sample 1: Dr. Paun Samy (Inv 2516)</option>
              <option value="2">Sample 2: 4 Syrups &amp; Tabs (Inv 2517)</option>
              <option value="3">Sample 3: Fat Burner (Inv 2518)</option>
            </select>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleAddItem}
            title="Add a new product row (or press Enter in any row)"
          >
            <Plus size={15} />
            <span>+ Add Row (Enter)</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onClearForm}
            title="Reset form to blank"
          >
            <RotateCcw size={15} />
            <span>Clear Form</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onReview}
            style={{ padding: '0.625rem 1.5rem' }}
          >
            <CheckCircle2 size={16} />
            <span>Review Invoice</span>
          </button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="invoice-page-wrapper">
        <InvoiceDocument
          invoiceData={invoiceData}
          isEditing={true}
          onCustomerChange={handleCustomerChange}
          onMetaChange={handleMetaChange}
          onItemChange={handleItemChange}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onTaxSettingsChange={handleTaxSettingsChange}
          onIgstInfoChange={handleIgstInfoChange}
          onRemarksChange={handleRemarksChange}
        />
      </div>
    </div>
  );
}

