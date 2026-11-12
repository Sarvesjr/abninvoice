import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { getSettings, saveSettings, setNextInvoiceNumber, getNextInvoiceNumber } from '../utils/storage';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  if (!isOpen) return null;

  const currentSettings = getSettings();
  const currentNextNumber = getNextInvoiceNumber();

  const [form, setForm] = useState({
    startingInvoiceNo: currentNextNumber,
    defaultTransport: currentSettings.defaultTransport || 'AKR LORRY',
    defaultLrNo: currentSettings.defaultLrNo || 'AKR',
    defaultIgstPercent: currentSettings.defaultIgstPercent ?? 5,
    defaultDiscountPercent: currentSettings.defaultDiscountPercent ?? 5
  });

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings({
      defaultTransport: form.defaultTransport,
      defaultLrNo: form.defaultLrNo,
      defaultIgstPercent: parseFloat(form.defaultIgstPercent) || 5,
      defaultDiscountPercent: parseFloat(form.defaultDiscountPercent) || 0,
      startingInvoiceNo: parseInt(form.startingInvoiceNo, 10) || 2519
    });

    setNextInvoiceNumber(form.startingInvoiceNo);
    if (onSettingsUpdated) onSettingsUpdated();
    onClose();
  };

  return (
    <div className="modal-backdrop no-print" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Application Preferences</h3>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="form-group">
              <label>Next Sequential Invoice Number</label>
              <input
                type="number"
                value={form.startingInvoiceNo}
                onChange={(e) => setForm({ ...form, startingInvoiceNo: e.target.value })}
                required
              />
              <div className="form-help">
                Automatically increments by 1 with each confirmed invoice.
              </div>
            </div>

            <div className="form-group">
              <label>Default Transport Name</label>
              <input
                type="text"
                value={form.defaultTransport}
                onChange={(e) => setForm({ ...form, defaultTransport: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Default LR No.</label>
              <input
                type="text"
                value={form.defaultLrNo}
                onChange={(e) => setForm({ ...form, defaultLrNo: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Default IGST %</label>
                <input
                  type="number"
                  value={form.defaultIgstPercent}
                  onChange={(e) => setForm({ ...form, defaultIgstPercent: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Default Discount %</label>
                <input
                  type="number"
                  value={form.defaultDiscountPercent}
                  onChange={(e) => setForm({ ...form, defaultDiscountPercent: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

