# A.B.N. HERBALS – Invoice Billing Application

A high-fidelity, production-quality billing and invoice generation web application built specifically for **A.B.N. HERBALS** (Chennai, Tamil Nadu).

The invoice template strictly reproduces the exact visual identity, typography hierarchy, vertical line column separators, company information, bank details, terms, and payment QR code from the official reference document.

---

## 🚀 Key Features

### 1. Authentic Invoice Document Fidelity
- **A4 Portrait Alignment**: Standardized print layout with crisp 1px/1.5px black borders, authentic header typography, and exact column proportions.
- **Fixed Company Details**:
  - `A.B.N. HERBALS`
  - `No. 1/7, St. Mary's Road, Mandaveli, Chennai - 600 028.`
  - `Mobile: 94442 00321`
  - `MSME No.: UDYAM -TN-02-0090773`
  - `CREDIT INVOICE`
  - `GST: 33AMBPR9105L1ZW`
- **Dynamic Customer & Meta Sections**:
  - Customer Name, Clinic Name, Address, Mobile, and Email with inline editable fields.
  - Aligned Invoice details: Invoice No., Date (defaults to current date `DD.MM.YYYY`), LR No., Cases, Transport (default `AKR LORRY`), and Due Date.
- **Official Payment QR Code**:
  - Extracted directly from the reference PDF (`PPQR01.REKVAP@iob`) and rendered with pixel-perfect clarity.
- **Permanent Legal & Bank Details**:
  - Complete 5-point Drug & Cosmetics Act / Jurisdiction terms.
  - Bank Account: `IOB`, A/C No: `0060330000000113`, IFSC: `IOBA0000060`.
  - `FREIGHT TO PAY BY PARTY` & `For ABN HERBALS` authorization section.

### 2. Product Table & Real-Time Calculation Engine
- **13 Standard Columns**:
  `S.` | `Product` | `Packing` | `Mfr.` | `Batch` | `Exp.` | `Qty.` | `Free` | `M.R.P.` | `HSN` | `Rate` | `GST` | `Amount`
- **Immediate Math Engine**:
  - `Amount = Qty × Rate` (Free items do not incur bill amount).
  - `Subtotal = Σ(Line Amounts)`.
  - `IGST Amount = Subtotal × (IGST% / 100)`.
  - `Total = Subtotal + IGST Amount`.
  - `Discount Amount = Subtotal × (Discount% / 100)`.
  - `Grand Total = Total - Discount Amount + Round Off`.
- **Dynamic Amount in Words**:
  - Indian numbering system conversion supporting Units, Tens, Hundreds, Thousands, Lakhs, Crores, and Paise (e.g. *"Rupees Forty Thousand One Hundred Ninety Four Only"*).
- **Stationery Vertical Grid Lines**:
  - Automatically maintains the classic blank space with vertical column separator lines stretching down to the summary section when there are few products.

### 3. Workflow & Confirmation Process
1. **Dashboard**: View recent invoices, search by clinic or doctor name, inspect stats, or load one of the 3 reference samples with 1 click.
2. **Editor**: Add/remove rows, edit fields inline without breaking table formatting, clear form, or load presets. Autosaves drafts to `localStorage`.
3. **Review & Confirmation**: Displays completed invoice in 100% final printed appearance with verification banner (*"Please verify all invoice details before proceeding."*).
4. **Print / Save as PDF**: Opens native browser print dialog configured specifically for A4 portrait printing with zero UI clutter.
5. **Sequential Numbering**: Persists sequential invoice numbering (`localStorage`) and increments automatically upon confirmation.

### 4. Future Authentication Ready
- Clean `AuthProvider` in `src/auth/authContext.jsx` with `ADMIN` and `DEVELOPER` roles ready for server-side token or session integration without application refactoring.

---

## 📁 Project Structure

```
abninvoice/
├── public/
│   ├── leaf.svg            # Herbal brand favicon
│   ├── manifest.json       # PWA offline / desktop shortcut manifest
│   └── qr-code.png         # Extracted IOB UPI QR Code from reference PDF
├── src/
│   ├── auth/
│   │   └── authContext.jsx # Extensible authentication architecture
│   ├── components/
│   │   ├── Dashboard.jsx   # Home screen, invoice history & metrics
│   │   ├── InvoiceDocument.jsx # Exact A4 invoice matching reference PDF
│   │   ├── InvoiceEditor.jsx   # Inline editing canvas & controls
│   │   ├── ReviewView.jsx  # Final confirmation & review view
│   │   └── SettingsModal.jsx # Preferences & invoice sequence settings
│   ├── constants/
│   │   ├── companyDetails.js # Permanent company, terms & bank info
│   │   └── sampleData.js   # Samples 1, 2, and 3 from reference PDF
│   ├── styles/
│   │   ├── dashboard.css   # Modern dashboard styling
│   │   └── invoice.css     # Pixel-perfect invoice layout & print CSS
│   ├── utils/
│   │   ├── calculations.js # Real-time decimal math & tax formulas
│   │   ├── numberToWords.js # Indian currency word converter
│   │   └── storage.js      # LocalStorage & sequence counter management
│   ├── App.jsx             # Main application controller
│   ├── index.css           # Global reset & print media rules
│   └── main.jsx            # Entry point
├── dist/                   # Production-ready static build output
├── index.html              # HTML template
├── package.json            # Scripts & dependencies
├── qr-code.png             # Source extracted QR asset
└── vite.config.js          # Vite build configuration
```

---

## 🛠️ How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the URL displayed in the terminal).

### 3. Create a Production Build
```bash
npm run build
```
This generates optimized static files in the `dist/` directory.

### 4. Preview the Production Build Locally
```bash
npm run preview
```

---

## 🖨️ Printing & Saving as PDF Tips
- In the browser print dialog:
  - **Destination**: Choose your printer or select **"Save as PDF"**.
  - **Paper size**: **A4**.
  - **Margins**: **None** or **Default** (the print stylesheet automatically defines exact margins).
  - **Headers & Footers**: Uncheck "Headers and Footers" in your browser print options for a completely clean document.

