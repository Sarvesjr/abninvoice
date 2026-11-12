import React, { useState } from 'react';
import { useAuth } from '../auth/authContext';
import {
  PlusCircle,
  FileText,
  Search,
  Settings,
  Printer,
  Edit,
  Copy,
  Trash2,
  TrendingUp,
  Hash,
  ShoppingBag,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { formatIndianNumber } from '../utils/calculations';
import { SAMPLE_INVOICE_1, SAMPLE_INVOICE_2, SAMPLE_INVOICE_3 } from '../constants/sampleData';

export default function Dashboard({
  invoices = [],
  nextInvoiceNo,
  onCreateNew,
  onOpenInvoice,
  onEditInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onOpenSettings,
  onLoadSamplePreset
}) {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics
  const totalInvoicesCount = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);

  // Filter invoices by search term
  const filteredInvoices = invoices.filter(inv => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (inv.invoiceNo && inv.invoiceNo.toString().toLowerCase().includes(term)) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(term)) ||
      (inv.clinicName && inv.clinicName.toLowerCase().includes(term)) ||
      (inv.date && inv.date.toLowerCase().includes(term))
    );
  });

  return (
    <div className="dashboard-container no-print">
      {/* Top Navbar */}
      <header className="dashboard-nav">
        <div className="brand-section">
          <div className="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div>
            <h1 className="brand-title">A.B.N. HERBALS</h1>
            <div className="brand-subtitle">Invoice Billing System</div>
          </div>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onOpenSettings}
            title="System Preferences & Next Invoice Number"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onCreateNew}
          >
            <PlusCircle size={18} />
            <span>Create New Invoice</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={logout}
            title="Sign out of billing portal"
            style={{ color: '#dc2626' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Stats Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Next Invoice Number</div>
            <div className="stat-value" style={{ color: '#15803d', fontFamily: 'monospace' }}>
              #{nextInvoiceNo}
            </div>
            <div className="stat-sub">Auto-assigned to next bill</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Total Invoices</div>
            <div className="stat-value">{totalInvoicesCount}</div>
            <div className="stat-sub">Saved in local records</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Total Billed</div>
            <div className="stat-value">₹{formatIndianNumber(totalRevenue)}</div>
            <div className="stat-sub">Cumulative grand total</div>
          </div>
        </div>

        {/* Invoices List Card */}
        <div className="invoices-card">
          <div className="invoices-header">
            <div className="invoices-title-group">
              <h2>Invoice History &amp; Records</h2>
              <p>Manage, review, reprint, or duplicate generated bills</p>
            </div>

            <div className="invoices-toolbar">
              <div className="search-input-wrapper">
                <Search size={16} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search invoice, doctor, clinic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="sample-preset-pills">
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Presets:</span>
                <button
                  type="button"
                  className="pill-btn"
                  onClick={() => onLoadSamplePreset(SAMPLE_INVOICE_1)}
                  title="Load Sample 1 (2516)"
                >
                  Sample 1 (2516)
                </button>
                <button
                  type="button"
                  className="pill-btn"
                  onClick={() => onLoadSamplePreset(SAMPLE_INVOICE_2)}
                  title="Load Sample 2 (2517)"
                >
                  Sample 2 (2517)
                </button>
                <button
                  type="button"
                  className="pill-btn"
                  onClick={() => onLoadSamplePreset(SAMPLE_INVOICE_3)}
                  title="Load Sample 3 (2518)"
                >
                  Sample 3 (2518)
                </button>
              </div>
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <h3>{searchTerm ? 'No matching invoices found' : 'No invoices created yet'}</h3>
              <p>
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by creating your first invoice or loading one of the sample presets from the reference PDF.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button type="button" className="btn-primary" onClick={onCreateNew}>
                  <PlusCircle size={16} />
                  <span>Create First Invoice</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onLoadSamplePreset(SAMPLE_INVOICE_1)}
                >
                  Load Sample 1
                </button>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Inv #</th>
                    <th>Date</th>
                    <th>Customer &amp; Clinic</th>
                    <th>Items</th>
                    <th style={{ textAlign: 'right' }}>Grand Total</th>
                    <th style={{ textAlign: 'center', width: '220px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <span className="badge-inv">#{inv.invoiceNo}</span>
                      </td>
                      <td>{inv.date}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inv.customerName || 'Unnamed'}</div>
                        {inv.clinicName && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {inv.clinicName}
                          </div>
                        )}
                      </td>
                      <td>{inv.itemsCount || (inv.data?.items?.length ?? 1)} items</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge-amount">
                          ₹{formatIndianNumber(inv.grandTotal || 0)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => onOpenInvoice(inv.data)}
                            title="View / Print Invoice"
                          >
                            <Printer size={13} />
                            <span>Print</span>
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => onEditInvoice(inv.data)}
                            title="Edit Invoice"
                          >
                            <Edit size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => onDuplicateInvoice(inv.data)}
                            title="Duplicate as new invoice"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-outline-danger"
                            onClick={() => onDeleteInvoice(inv.id)}
                            title="Delete record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

