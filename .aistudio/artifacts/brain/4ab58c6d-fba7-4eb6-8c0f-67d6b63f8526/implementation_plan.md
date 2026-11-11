# ICD-10 Diagnosis Searchable Combobox & Admin Settings CSV Upload

Transform the Provisional/Principal Diagnosis field into a high-performance searchable dropdown supporting ICD-10 code and disease name search, backed by an Admin Settings panel with subtabs (`ຈັດການບັນຊີໂຮງໝໍເມືອງ / ສຸກສາລາ` and `ຕັ້ງຄ່າບົ່ງມະຕິ`) capable of uploading and querying full 74,889-row ICD-10 CSV datasets using browser IndexedDB.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the following architectural and UX choices:
> 1. **Diagnosis Format**: Combined code and name format when selected (e.g., `I21.9 - Acute myocardial infarction`).
> 2. **Preloaded Codes**: No preloaded default codes; only load codes after the user uploads their CSV file. If empty, allow free typing with a quiet note pointing to the Admin upload.
> 3. **Storage Engine**: High-speed browser IndexedDB database for instant, zero-latency search without memory bloat or server round-trips for 74,889 rows.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Admin Settings View**: Creates a dedicated `ຕັ້ງຄ່າ` (Settings) tab in the admin header alongside `ທຸກເຄສທົ່ວແຂວງ (All Referrals)`, featuring two subtabs:
     - Subtab 1: `ຈັດການບັນຊີໂຮງໝໍເມືອງ / ສຸກສາລາ` (District Hospitals & Health Centers).
     - Subtab 2: `ຕັ້ງຄ່າບົ່ງມະຕິ` (ICD-10 Diagnosis Management with CSV file uploader for 74,889 rows).
  2. **CSV Import**: Fast chunked CSV parser reading Column A = `CODE` and Column B = `NAME OF DISEASE` into an IndexedDB store with real-time percentage progress bar.
  3. **Clinical Diagnosis Search**: The `ການບົ່ງມະຕິພະຍາດຫຼັກ *` field in `ReferralForm.tsx` becomes an autocomplete combobox allowing typing either code (e.g. `S06`, `I21`) or disease letters (e.g. `trauma`, `infarction`, `pneumonia`), displaying live filtered results and populating as `[CODE] - [NAME OF DISEASE]`.

---

## 2. User Experience & Visual Design

### Admin View Architecture
- **Header Nav**:
  - `ທຸກເຄສທົ່ວແຂວງ (All Referrals)` (Active referral list + triage dashboard)
  - `ຕັ້ງຄ່າ (Settings)` (Opens settings workspace)
- **Settings Subtabs**:
  - `[ ໂຮງໝໍເມືອງ / ສຸກສາລາ ]` | `[ ຕັ້ງຄ່າບົ່ງມະຕິ (ICD-10) ]`
- **ICD-10 Management Panel**:
  - Drag-and-drop CSV upload zone with file picker button.
  - Live upload progress indicator: `ກຳລັງບັນທຶກ: 45,000 / 74,889 ລະຫັດ (60%)`.
  - Status card: Total imported codes counter (e.g., `74,889 ລະຫັດພະຍາດ`), last updated timestamp, and "Clear / Reset" button.
  - Interactive search test sandbox: lets admin verify search queries immediately after upload.

### Referral Form Diagnosis Field
- **Combobox Input**:
  - Flat border, zero shadow (`shadow-none border border-slate-300 focus:border-emerald-600`).
  - Dropdown menu appears on focus/type showing top 50 matches with highlighted code tag (`font-mono font-bold text-emerald-800`) and disease name.
  - Full keyboard navigation (Arrow Up/Down, Enter to select, Escape to close).
  - Allows custom typing fallback if a clinician needs to add custom specifiers.

---

## 3. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                 Admin Settings View (App.tsx)               │
│                                                             │
│  Tab 1: ທຸກເຄສທົ່ວແຂວງ (All Referrals)                      │
│  Tab 2: ຕັ້ງຄ່າ (Settings)                                  │
│         ├── Subtab 1: ຈັດການບັນຊີໂຮງໝໍເມືອງ / ສຸກສາລາ       │
│         └── Subtab 2: ຕັ້ງຄ່າບົ່ງມະຕິ (ICD-10 CSV Import)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              IndexedDB Engine (icd10Service.ts)             │
│                                                             │
│  - Database: emscps_icd10_db                                │
│  - Store: icd10_codes (keyPath: code)                       │
│  - Index: code, name_lower                                  │
│  - Chunked batch write (5,000 rows/transaction)             │
│  - Prefix & substring search returning top 50 in <15ms      │
└──────────────────────────────┬──────────────────────────────┘
                               │ queries
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             ReferralForm (Clinical Intake Step 2)           │
│                                                             │
│  - Searchable Combobox: provisionalDiagnosis                │
│  - Searches by code ("I21") or name ("infarct")             │
│  - Formats as: "I21.9 - Acute myocardial infarction"        │
└─────────────────────────────────────────────────────────────┘
```

### Key Modules to Create / Modify
1. **`src/services/icd10Service.ts`**:
   - `initDb()`: Initializes IndexedDB schema.
   - `importCsvText(csvText, onProgress)`: High-performance streaming parser and batch insert into IndexedDB.
   - `searchCodes(query, limit = 50)`: Fast search matching either `code` prefix or words in `name_lower`.
   - `getCount()`: Returns count of currently loaded codes.
   - `clearCodes()`: Truncates store.
2. **`src/components/AdminSettingsView.tsx`**:
   - Container component with subtabs:
     - Subtab 1: Hospital & Health Center Management (embeds full hospital CRUD).
     - Subtab 2: Diagnosis & ICD-10 CSV Upload with live progress, stats, and search tester.
3. **`src/components/Icd10Combobox.tsx`**:
   - High-performance debounced autocomplete combobox component.
   - Renders code and disease name cleanly.
4. **`src/components/ReferralForm.tsx`**:
   - Integrate `Icd10Combobox` into Step 2 for `provisionalDiagnosis`.
5. **`src/components/Header.tsx` & `src/App.tsx`**:
   - Add `ຕັ້ງຄ່າ` tab for admin in header and route to `AdminSettingsView`.
