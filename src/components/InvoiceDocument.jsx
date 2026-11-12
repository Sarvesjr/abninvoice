import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { COMPANY_DETAILS, BANK_DETAILS, TERMS_AND_CONDITIONS } from '../constants/companyDetails';
import { numberToWordsIndian } from '../utils/numberToWords';
import { formatIndianNumber, calculateLineAmount, generateIgstInfoText } from '../utils/calculations';
import { Trash2, QrCode } from 'lucide-react';

export default function InvoiceDocument({
  invoiceData,
  isEditing = false,
  includeQrAmount = true,
  onCustomerChange,
  onMetaChange,
  onItemChange,
  onRemoveItem,
  onAddItem,
  onTaxSettingsChange,
  onIgstInfoChange,
  onRemarksChange
}) {
  const { customer, invoiceMeta, items, totals, taxSettings, igstInfoText, remarks } = invoiceData;

  // Dynamic UPI Payment QR Code string
  // Defaults to official IOB VPA PPQR01.REKVAP@iob as found in the reference document
  const grandTotal = totals?.grandTotal || 0;
  const vpa = COMPANY_DETAILS.upiVpa || 'PPQR01.REKVAP@iob';
  const payeeName = COMPANY_DETAILS.upiPayeeName || 'PPQR01.REKVAP';
  const upiQrValue = includeQrAmount && grandTotal > 0
    ? `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${Number(grandTotal).toFixed(2)}&cu=INR`
    : `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

  // Compute amount in words dynamically from grandTotal
  const wordsRepresentation = numberToWordsIndian(totals?.grandTotal || 0);

  // Traditional pre-printed bill filler rows so vertical lines extend to fill the A4 page
  const totalItemRows = items.length;
  // Generous filler height to fill the A4 sheet proportionally without bottom gap
  const fillerHeight = Math.max(40, 390 - totalItemRows * 26);

  // Handle keyboard navigation: pressing Enter creates a new row on the last line, or moves to next row
  const handleKeyDown = (e, rowIndex, fieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (rowIndex === items.length - 1) {
        if (onAddItem) onAddItem();
        setTimeout(() => {
          const nextInput = document.querySelector(`input[data-row="${rowIndex + 1}"][data-field="product"]`);
          if (nextInput) {
            nextInput.focus();
          }
        }, 80);
      } else {
        const nextInput =
          document.querySelector(`input[data-row="${rowIndex + 1}"][data-field="${fieldName}"]`) ||
          document.querySelector(`input[data-row="${rowIndex + 1}"][data-field="product"]`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  return (
    <div className="invoice-box">
      {/* ====================================================================
          1. FIXED COMPANY HEADER
          ==================================================================== */}
      <div className="inv-header-company">
        <h1 className="inv-company-name">{COMPANY_DETAILS.name}</h1>
        <div className="inv-company-address">{COMPANY_DETAILS.address}</div>
        <div className="inv-company-mobile">Mobile: {COMPANY_DETAILS.mobile}</div>
      </div>

      {/* Row 2: MSME No. & CREDIT INVOICE */}
      <div className="inv-header-meta-row">
        <div className="inv-msme">MSME No.: {COMPANY_DETAILS.msme}</div>
        <div className="inv-title">{COMPANY_DETAILS.invoiceTitle}</div>
        <div className="inv-meta-spacer"></div>
      </div>

      {/* Row 3: GSTIN */}
      <div className="inv-header-gst-row">
        GST: {COMPANY_DETAILS.gstin}
      </div>

      {/* ====================================================================
          2. CUSTOMER INFO (LEFT) & INVOICE DETAILS (RIGHT)
          ==================================================================== */}
      <div className="inv-details-section">
        {/* Left Column: Customer details */}
        <div className="inv-customer-col">
          <div>
            <div className="inv-cust-name">
              {isEditing ? (
                <input
                  type="text"
                  className="edit-input"
                  placeholder="Doctor / Customer Name (e.g. Dr. PAUN SAMY)"
                  value={customer.name || ''}
                  onChange={(e) => onCustomerChange('name', e.target.value)}
                />
              ) : (
                customer.name || '\u00A0'
              )}
            </div>
            <div className="inv-cust-clinic">
              {isEditing ? (
                <input
                  type="text"
                  className="edit-input"
                  placeholder="Business / Clinic Name (e.g. Amuthasurabhi Siddha Clinic)"
                  value={customer.clinicName || ''}
                  onChange={(e) => onCustomerChange('clinicName', e.target.value)}
                />
              ) : (
                customer.clinicName || '\u00A0'
              )}
            </div>
            <div className="inv-cust-address">
              {isEditing ? (
                <textarea
                  className="edit-input"
                  rows={2}
                  placeholder="Address (Street, City, Pincode)"
                  value={customer.address || ''}
                  onChange={(e) => onCustomerChange('address', e.target.value)}
                  style={{ resize: 'none' }}
                />
              ) : (
                customer.address || '\u00A0'
              )}
            </div>
          </div>
          <div className="inv-cust-contact">
            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Cell:</span>
                <input
                  type="text"
                  className="edit-input"
                  placeholder="Mobile (e.g. 93626 88198)"
                  value={customer.mobile || ''}
                  onChange={(e) => onCustomerChange('mobile', e.target.value)}
                  style={{ width: '120px' }}
                />
                <span style={{ whiteSpace: 'nowrap' }}>Email:</span>
                <input
                  type="email"
                  className="edit-input"
                  placeholder="Email Address"
                  value={customer.email || ''}
                  onChange={(e) => onCustomerChange('email', e.target.value)}
                />
              </div>
            ) : (
              <>
                {customer.mobile ? `Cell: ${customer.mobile}` : ''}
                {customer.mobile && customer.email ? '  ' : ''}
                {customer.email ? `Email: ${customer.email}` : ''}
                {!customer.mobile && !customer.email && '\u00A0'}
              </>
            )}
          </div>
        </div>

        {/* Right Column: Invoice Meta */}
        <div className="inv-meta-col">
          <table className="inv-meta-table">
            <tbody>
              <tr>
                <td className="meta-label">Invoice No.</td>
                <td className="meta-colon">:</td>
                <td className="meta-val">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={invoiceMeta.invoiceNo || ''}
                      onChange={(e) => onMetaChange('invoiceNo', e.target.value)}
                    />
                  ) : (
                    invoiceMeta.invoiceNo || ''
                  )}
                </td>
              </tr>
              <tr>
                <td className="meta-label">Date</td>
                <td className="meta-colon">:</td>
                <td className="meta-val">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input"
                      placeholder="DD.MM.YYYY"
                      value={invoiceMeta.date || ''}
                      onChange={(e) => onMetaChange('date', e.target.value)}
                    />
                  ) : (
                    invoiceMeta.date || ''
                  )}
                </td>
              </tr>
              <tr>
                <td className="meta-label">LR No.</td>
                <td className="meta-colon">:</td>
                <td className="meta-val">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={invoiceMeta.lrNo || ''}
                      onChange={(e) => onMetaChange('lrNo', e.target.value)}
                    />
                  ) : (
                    invoiceMeta.lrNo || ''
                  )}
                </td>
              </tr>
              <tr>
                <td className="meta-label">Cases</td>
                <td className="meta-colon">:</td>
                <td className="meta-val">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={invoiceMeta.cases || ''}
                      onChange={(e) => onMetaChange('cases', e.target.value)}
                    />
                  ) : (
                    invoiceMeta.cases || ''
                  )}
                </td>
              </tr>
              <tr>
                <td className="meta-label">Transport</td>
                <td className="meta-colon">:</td>
                <td className="meta-val">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={invoiceMeta.transport || ''}
                      onChange={(e) => onMetaChange('transport', e.target.value)}
                    />
                  ) : (
                    invoiceMeta.transport || ''
                  )}
                </td>
              </tr>
              <tr>
                <td className="meta-label">Due Date</td>
                <td className="meta-colon">:</td>
                <td className="meta-val">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={invoiceMeta.dueDate || ''}
                      onChange={(e) => onMetaChange('dueDate', e.target.value)}
                    />
                  ) : (
                    invoiceMeta.dueDate || ''
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================================
          3. PRODUCT TABLE
          ==================================================================== */}
      <div className="inv-table-section">
        <table className="inv-table">
          <thead>
            <tr>
              <th className="col-sno">S.</th>
              <th className="col-product">Product</th>
              <th className="col-packing">Packing</th>
              <th className="col-mfr">Mfr.</th>
              <th className="col-batch">Batch</th>
              <th className="col-exp">Exp.</th>
              <th className="col-qty">Qty.</th>
              <th className="col-free">Free</th>
              <th className="col-mrp">M.R.P.</th>
              <th className="col-hsn">HSN</th>
              <th className="col-rate">Rate</th>
              <th className="col-gst">GST</th>
              <th className="col-amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index} className="row-with-action">
                <td className="col-sno text-center" style={{ position: 'relative' }}>
                  <span>{index + 1}.</span>
                  {isEditing && items.length > 1 && (
                    <button
                      type="button"
                      className="row-delete-btn no-print"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(index);
                      }}
                      title="Remove product row"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </td>

                <td className="col-product text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input text-left"
                      placeholder="Product Name"
                      data-row={index}
                      data-field="product"
                      value={item.product || ''}
                      onKeyDown={(e) => handleKeyDown(e, index, 'product')}
                      onChange={(e) => onItemChange(index, 'product', e.target.value)}
                    />
                  ) : (
                    item.product || ''
                  )}
                </td>

                <td className="col-packing text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input text-center"
                      placeholder="e.g. 200 ml"
                      data-row={index}
                      data-field="packing"
                      value={item.packing || ''}
                      onKeyDown={(e) => handleKeyDown(e, index, 'packing')}
                      onChange={(e) => onItemChange(index, 'packing', e.target.value)}
                    />
                  ) : (
                    item.packing || ''
                  )}
                </td>

                <td className="col-mfr text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input text-center"
                      placeholder="Panasa"
                      data-row={index}
                      data-field="mfr"
                      value={item.mfr || ''}
                      onKeyDown={(e) => handleKeyDown(e, index, 'mfr')}
                      onChange={(e) => onItemChange(index, 'mfr', e.target.value)}
                    />
                  ) : (
                    item.mfr || ''
                  )}
                </td>

                <td className="col-batch text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input text-center"
                      placeholder="Batch"
                      data-row={index}
                      data-field="batch"
                      value={item.batch || ''}
                      onKeyDown={(e) => handleKeyDown(e, index, 'batch')}
                      onChange={(e) => onItemChange(index, 'batch', e.target.value)}
                    />
                  ) : (
                    item.batch || ''
                  )}
                </td>

                <td className="col-exp text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input text-center"
                      placeholder="MM/YY"
                      data-row={index}
                      data-field="exp"
                      value={item.exp || ''}
                      onKeyDown={(e) => handleKeyDown(e, index, 'exp')}
                      onChange={(e) => onItemChange(index, 'exp', e.target.value)}
                    />
                  ) : (
                    item.exp || ''
                  )}
                </td>

                <td className="col-qty text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      className="edit-input text-center"
                      placeholder="0"
                      data-row={index}
                      data-field="qty"
                      value={item.qty === 0 || item.qty === '0' ? '' : (item.qty ?? '')}
                      onKeyDown={(e) => handleKeyDown(e, index, 'qty')}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        if (/^\d*$/.test(val)) {
                          onItemChange(index, 'qty', val);
                        }
                      }}
                    />
                  ) : (
                    item.qty || ''
                  )}
                </td>

                <td className="col-free text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input text-center"
                      placeholder=""
                      data-row={index}
                      data-field="free"
                      value={item.free ?? ''}
                      onKeyDown={(e) => handleKeyDown(e, index, 'free')}
                      onChange={(e) => onItemChange(index, 'free', e.target.value)}
                    />
                  ) : (
                    item.free || ''
                  )}
                </td>

                <td className="col-mrp text-right">
                  {isEditing ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      className="edit-input text-right"
                      placeholder="0.00"
                      data-row={index}
                      data-field="mrp"
                      value={item.mrp === 0 || item.mrp === '0' || item.mrp === '0.00' ? '' : (item.mrp ?? '')}
                      onKeyDown={(e) => handleKeyDown(e, index, 'mrp')}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        if (/^\d*\.?\d*$/.test(val)) {
                          onItemChange(index, 'mrp', val);
                        }
                      }}
                    />
                  ) : (
                    item.mrp ? Number(item.mrp).toFixed(2) : ''
                  )}
                </td>

                <td className="col-hsn text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input text-center"
                      placeholder="HSN"
                      data-row={index}
                      data-field="hsn"
                      value={item.hsn || ''}
                      onKeyDown={(e) => handleKeyDown(e, index, 'hsn')}
                      onChange={(e) => onItemChange(index, 'hsn', e.target.value)}
                    />
                  ) : (
                    item.hsn || ''
                  )}
                </td>

                <td className="col-rate text-right">
                  {isEditing ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      className="edit-input text-right"
                      placeholder="0.00"
                      data-row={index}
                      data-field="rate"
                      value={item.rate === 0 || item.rate === '0' || item.rate === '0.00' ? '' : (item.rate ?? '')}
                      onKeyDown={(e) => handleKeyDown(e, index, 'rate')}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        if (/^\d*\.?\d*$/.test(val)) {
                          onItemChange(index, 'rate', val);
                        }
                      }}
                    />
                  ) : (
                    item.rate ? Number(item.rate).toFixed(2) : ''
                  )}
                </td>

                <td className="col-gst text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-input text-center"
                      placeholder="5%"
                      data-row={index}
                      data-field="gst"
                      value={item.gst || ''}
                      onKeyDown={(e) => handleKeyDown(e, index, 'gst')}
                      onChange={(e) => onItemChange(index, 'gst', e.target.value)}
                    />
                  ) : (
                    item.gst || ''
                  )}
                </td>

                <td className="col-amount text-right">
                  {formatIndianNumber(calculateLineAmount(item.qty, item.rate))}
                </td>
              </tr>
            ))}

            {/* Traditional vertical line extender filler row */}
            {fillerHeight > 0 && (
              <tr className="inv-filler-row">
                <td className="col-sno" style={{ height: `${fillerHeight}px` }}></td>
                <td className="col-product"></td>
                <td className="col-packing"></td>
                <td className="col-mfr"></td>
                <td className="col-batch"></td>
                <td className="col-exp"></td>
                <td className="col-qty"></td>
                <td className="col-free"></td>
                <td className="col-mrp"></td>
                <td className="col-hsn"></td>
                <td className="col-rate"></td>
                <td className="col-gst"></td>
                <td className="col-amount"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          4. SUMMARY & TAX BREAKDOWN
          ==================================================================== */}
      <div className="inv-summary-section">
        {/* Left side: IGST Info text & Remarks */}
        <div className="inv-summary-left">
          <div className="inv-igst-info">
            {isEditing ? (
              <input
                type="text"
                className="edit-input"
                placeholder={generateIgstInfoText(totals?.subtotal, taxSettings?.igstPercent, totals?.igstAmount) || 'IGST calculation note'}
                value={igstInfoText || ''}
                onChange={(e) => onIgstInfoChange(e.target.value)}
              />
            ) : (
              igstInfoText || generateIgstInfoText(totals?.subtotal, taxSettings?.igstPercent, totals?.igstAmount) || '\u00A0'
            )}
          </div>
          <div className="inv-remarks">
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ whiteSpace: 'nowrap', marginRight: '4px' }}>Remarks:</span>
                <input
                  type="text"
                  className="edit-input"
                  placeholder="Optional remarks..."
                  value={remarks || ''}
                  onChange={(e) => onRemarksChange(e.target.value)}
                />
              </div>
            ) : (
              `Remarks: ${remarks || ''}`
            )}
          </div>
        </div>

        {/* Right side: Subtotal, IGST, Total, Discount, Round Off */}
        <div className="inv-summary-right">
          <table className="summary-calc-table">
            <tbody>
              <tr>
                <td className="sum-label">SUB TOTAL</td>
                <td className="sum-val">{formatIndianNumber(totals?.subtotal || 0)}</td>
              </tr>
              <tr>
                <td className="sum-label">
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <span>IGST</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="edit-input text-center"
                        style={{ width: '38px', fontWeight: 'bold' }}
                        value={taxSettings?.igstPercent ?? 5}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          if (/^\d*\.?\d*$/.test(val)) {
                            onTaxSettingsChange('igstPercent', val);
                          }
                        }}
                      />
                      <span>%</span>
                    </div>
                  ) : (
                    `IGST ${taxSettings?.igstPercent || 5}%`
                  )}
                </td>
                <td className="sum-val">{formatIndianNumber(totals?.igstAmount || 0)}</td>
              </tr>
              <tr>
                <td className="sum-label">TOTAL</td>
                <td className="sum-val">{formatIndianNumber(totals?.total || 0)}</td>
              </tr>
              <tr>
                <td className="sum-label">
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <span>DISCOUNT</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="edit-input text-center"
                        style={{ width: '42px', fontWeight: 'bold' }}
                        placeholder="0"
                        value={
                          taxSettings?.discountPercent === 0 || taxSettings?.discountPercent === '0' || taxSettings?.discountPercent === ''
                            ? ''
                            : (taxSettings?.discountPercent ?? (totals?.discountPercent && totals.discountPercent > 0 ? totals.discountPercent.toString() : ''))
                        }
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          if (val === '' || val === '0') {
                            onTaxSettingsChange({ discountPercent: '', discountAmount: '', lastDiscountEdit: null });
                            return;
                          }
                          if (/^\d*\.?\d*$/.test(val)) {
                            const pct = parseFloat(val);
                            const sub = totals?.subtotal || 0;
                            const calculatedAmt = sub > 0 && !isNaN(pct) && pct > 0
                              ? (Math.round(((sub * pct) / 100) * 100) / 100).toFixed(2)
                              : '';
                            onTaxSettingsChange({
                              discountPercent: val,
                              discountAmount: calculatedAmt,
                              lastDiscountEdit: 'PERCENT'
                            });
                          }
                        }}
                      />
                      <span>%</span>
                    </div>
                  ) : (
                    `DISCOUNT ${taxSettings?.discountPercent && parseFloat(taxSettings.discountPercent) > 0 ? `${taxSettings.discountPercent}%` : '%'}`
                  )}
                </td>
                <td className="sum-val">
                  {isEditing ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      className="edit-input text-right"
                      style={{ width: '90px', fontWeight: 'bold' }}
                      placeholder="0.00"
                      value={
                        taxSettings?.discountAmount === 0 || taxSettings?.discountAmount === '0' || taxSettings?.discountAmount === '0.00' || taxSettings?.discountAmount === ''
                          ? ''
                          : (taxSettings?.discountAmount ?? (totals?.discountAmount && totals.discountAmount > 0 ? totals.discountAmount.toFixed(2) : ''))
                      }
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        if (val === '' || val === '0' || val === '0.00') {
                          onTaxSettingsChange({ discountAmount: '', discountPercent: '', lastDiscountEdit: null });
                          return;
                        }
                        if (/^\d*\.?\d*$/.test(val)) {
                          const amt = parseFloat(val);
                          const sub = totals?.subtotal || 0;
                          const calculatedPct = sub > 0 && !isNaN(amt) && amt > 0
                            ? (Math.round((amt / sub) * 10000) / 100).toString()
                            : '';
                          onTaxSettingsChange({
                            discountAmount: val,
                            discountPercent: calculatedPct,
                            lastDiscountEdit: 'AMOUNT'
                          });
                        }
                      }}
                    />
                  ) : (
                    totals?.discountAmount && totals.discountAmount > 0 ? formatIndianNumber(totals.discountAmount) : ''
                  )}
                </td>
              </tr>
              <tr>
                <td className="sum-label">ROUND OFF</td>
                <td className="sum-val">
                  {isEditing ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      className="edit-input text-right"
                      style={{ width: '75px', fontWeight: 'bold' }}
                      value={taxSettings?.roundOff === 0 || taxSettings?.roundOff === '0' || taxSettings?.roundOff === '0.00' || taxSettings?.roundOff === '' ? '' : (taxSettings?.roundOff ?? '')}
                      placeholder="0.00"
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        if (val === '' || val === '0' || val === '0.00') {
                          onTaxSettingsChange('roundOff', '');
                          return;
                        }
                        if (/^\d*\.?\d*$/.test(val)) {
                          onTaxSettingsChange('roundOff', val);
                        }
                      }}
                    />
                  ) : (
                    totals?.roundOff ? formatIndianNumber(totals.roundOff) : ''
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================================
          5. GRAND TOTAL & AMOUNT IN WORDS
          ==================================================================== */}
      <div className="inv-grand-total-section">
        <div className="inv-words-col">
          Rs.: {wordsRepresentation.toLowerCase()}
        </div>
        <div className="inv-grand-total-col">
          <span>GRAND TOTAL</span>
          <span>{formatIndianNumber(totals?.grandTotal || 0)}</span>
        </div>
      </div>

      {/* ====================================================================
          6. FOOTER (TERMS & CONDITIONS, BANK DETAILS, SIGNATURE, QR CODE)
          ==================================================================== */}
      <div className="inv-footer-section">
        {/* Left side: Freight note, terms, bank details */}
        <div className="inv-footer-left">
          <div className="inv-freight-note">{COMPANY_DETAILS.freightNote}</div>
          <div className="inv-terms-box">
            <div className="terms-heading">Terms &amp; Conditions</div>
            <ol className="terms-list">
              {TERMS_AND_CONDITIONS.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ol>
          </div>
          <div className="inv-bank-box">
            <table className="bank-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>BANK</th>
                  <th style={{ width: '45%' }}>A/C NO.</th>
                  <th style={{ width: '30%' }}>IFSC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{BANK_DETAILS.bank}</td>
                  <td>{BANK_DETAILS.accountNo}</td>
                  <td>{BANK_DETAILS.ifsc}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: For ABN HERBALS & QR Code */}
        <div className="inv-footer-right">
          <div className="for-abn-title">{COMPANY_DETAILS.signatureLabel}</div>

          {isEditing && (
            <div className="inv-qr-edit-placeholder no-print">
              <QrCode size={30} className="qr-placeholder-icon" />
              <div className="qr-placeholder-title">UPI Payment QR</div>
              <div className="qr-placeholder-sub">Generated on Review</div>
            </div>
          )}

          <div className={`inv-qr-wrapper ${isEditing ? 'print-only' : ''}`}>
            <QRCodeSVG
              value={upiQrValue}
              size={120}
              level="M"
              includeMargin={true}
              className="inv-qr-svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

