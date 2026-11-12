import React, { useState } from 'react';
import { ArrowLeft, Printer, Edit3, AlertCircle, Check, QrCode } from 'lucide-react';
import { formatIndianNumber } from '../utils/calculations';
import InvoiceDocument from './InvoiceDocument';

export default function ReviewView({
  invoiceData,
  onEdit,
  onConfirmAndPrint,
  onBackToDashboard
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [includeQrAmount, setIncludeQrAmount] = useState(true);

  const grandTotal = invoiceData?.totals?.grandTotal || 0;

  const handlePrintClick = () => {
    setConfirmed(true);
    onConfirmAndPrint();
  };

  return (
    <div className="review-container">
      {/* Top Review Bar */}
      <div className="editor-nav-bar no-print">
        <div className="editor-nav-left">
          <button type="button" className="btn-secondary" onClick={onEdit}>
            <ArrowLeft size={16} />
            <span>Back to Edit</span>
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
            Invoice Review &amp; Confirmation
          </span>
        </div>

        <div className="editor-nav-right">
          <button type="button" className="btn-secondary" onClick={onEdit}>
            <Edit3 size={15} />
            <span>Edit Invoice</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handlePrintClick}
            style={{ padding: '0.625rem 1.5rem', backgroundColor: '#0f766e' }}
          >
            <Printer size={16} />
            <span>Confirm &amp; Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <div className="invoice-page-wrapper">
        {/* Verification Alert Banner */}
        <div className="review-banner no-print">
          <div className="review-banner-text">
            <AlertCircle size={20} />
            <span>Please verify all invoice details before proceeding.</span>
          </div>

          <div className="review-qr-toggle-group">
            <div className="qr-badge">
              <QrCode size={15} />
              <span>QR Code: <strong>{includeQrAmount ? `₹${formatIndianNumber(grandTotal)} Dynamic` : 'Original PDF Mode'}</strong></span>
            </div>
            <button
              type="button"
              className="btn-qr-mode"
              onClick={() => setIncludeQrAmount(!includeQrAmount)}
              title={includeQrAmount ? 'Switch to original PDF mode without amount' : 'Switch to dynamic bill amount mode'}
            >
              {includeQrAmount ? 'Switch to Original PDF Mode (No Amount)' : 'Switch to Dynamic Bill Amount'}
            </button>
          </div>

          <div className="review-banner-actions">
            <button type="button" className="btn-secondary" onClick={onEdit}>
              <Edit3 size={14} />
              <span>Edit Invoice</span>
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handlePrintClick}
              style={{ backgroundColor: '#0f766e' }}
            >
              <Printer size={14} />
              <span>Confirm &amp; Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* 100% Print-identical rendered invoice document */}
        <div className="print-wrapper">
          <InvoiceDocument
            invoiceData={invoiceData}
            isEditing={false}
            includeQrAmount={includeQrAmount}
          />
        </div>
      </div>
    </div>
  );
}

