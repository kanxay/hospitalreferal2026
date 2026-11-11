# Form Refinement: 4 Southern Provinces Comboboxes, Flat Field Styling, Imaging & Physical Exam Dropdowns

Upgrade the hospital management and clinical referral intake views with editable dropdown text inputs (comboboxes), expand regional coverage to all 4 southern provinces of Laos, remove all field drop shadows for a crisp flat medical aesthetic, and provide structured clinical presets for imaging and physical examinations.

## User Review & Critical Decisions

> [!IMPORTANT]
> All requested changes enhance data entry speed for medical personnel while retaining full typing flexibility (native combobox `<input list="...">` pattern).

- **Confirmed Decision 1**: Filter district options dynamically based on the selected province (Champasak, Salavan, Attapeu, Sekong), while still allowing medical staff to type any custom district or health center name.
- **Confirmed Decision 2**: English imaging dropdown includes `None` (ບໍ່ໄດ້ເຮັດ), `Normal` (ປົກກະຕິ), plus 5 core emergency/trauma conditions (`Intracranial Hemorrhage / Acute TBI`, `Pneumonia / Lung Consolidation`, `Pleural Effusion / Hemothorax`, `Pneumothorax`, `Intra-abdominal Free Fluid / Hemoperitoneum`).
- **Confirmed Decision 3**: Complete shadow removal across all form inputs, textareas, and select controls in the Clinical Referral Intake form to eliminate visual noise and deliver a clean, high-contrast, flat medical UI.
- **Confirmed Decision 4**: Physical examination sections (Motor weakness, Pupils, Lung, Heart, Abdomen, and Other findings) will provide quick-select dropdown lists alongside custom typing.

---

## 1. Overview & Core Concept

### What It Delivers
1. **4 Southern Provinces Geographic Coverage**:
   - **ຈຳປາສັກ (Champasak)**: 10 districts (Pakse, Sanasomboun, Bachiang, Paksong, Pathoumphone, Phonthong, Champasak, Soukhouma, Moonlapamok, Khong).
   - **ສາລະວັນ (Salavan)**: 8 districts (Salavan, Ta-Oy, Toumlane, Lakhonepheng, Vapy, Khongsedone, Lao Ngam, Samuoi).
   - **ອັດຕະປື (Attapeu)**: 5 districts (Samakkhixay, Xaysettha, Sanxay, Phouvong, Sanamxay).
   - **ເຊກອງ (Sekong)**: 4 districts (Lamam, Kaleum, Dakcheung, Thateng).
2. **Dual Mode Combobox Inputs (Dropdown Text)**:
   - Users can either pick from the dropdown list or type freely in `HospitalManagementModal` (Province & District) and `ReferralForm` (Province & District).
3. **Crisp Flat Form Architecture (Shadow Removal)**:
   - Purge all `shadow`, `shadow-sm`, `shadow-xs`, and `shadow-inner` classes from form input fields, textareas, and selects. The fields will use crisp 1px borders (`border-slate-300`) with emerald focus outlines (`focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600`).
4. **Standardized English Imaging Dropdowns**:
   - Modalities (CXR, Ultrasound, CT-Scan) feature native comboboxes with:
     - `None` (ບໍ່ໄດ້ເຮັດ)
     - `Normal` (ປົກກະຕິ)
     - 5 Emergency & Trauma Findings
5. **Physical Examination Quick Presets**:
   - Dropdown selections for Motor Weakness, Pupils (L/R), Lung, Heart, Abdomen, and Other Findings.

---

## 2. Technical Architecture & Component Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      src/data/facilities.ts                 │
│                                                             │
│   ├── SOUTHERN_PROVINCES (4 Southern Provinces)             │
│   ├── SOUTHERN_DISTRICTS_BY_PROVINCE (Champasak, Salavan,   │
│   │                                   Attapeu, Sekong)      │
│   ├── IMAGING_PRESET_OPTIONS (None, Normal, 5 Diseases)     │
│   └── PHYSICAL_EXAM_PRESETS (Pupils, Lung, Heart, Abdomen)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ HospitalManagementModal.tsx  │    │     ReferralForm.tsx         │
│                              │    │                              │
│ - Province Dropdown Text     │    │ - Step 1: Flat Inputs (No    │
│ - District Dropdown Text     │    │   Shadows) + 4-Province      │
│ - 2 Ambulance Plates         │    │   Filtered District Combobox │
│                              │    │ - Step 3: English Imaging    │
│                              │    │   Dropdown Text (None,       │
│                              │    │   Normal, 5 Conditions)      │
│                              │    │ - Step 4: Physical Exam      │
│                              │    │   Dropdown Presets           │
└──────────────────────────────┘    └──────────────────────────────┘
```

---

## 3. Implementation Plan Details

### Step 1: `src/data/facilities.ts`
- Define `SOUTHERN_PROVINCES = ['ຈຳປາສັກ', 'ສາລະວັນ', 'ອັດຕະປື', 'ເຊກອງ']`.
- Define `SOUTHERN_DISTRICTS_BY_PROVINCE` mapping each province to its official districts in clean Lao text.
- Define `IMAGING_ENGLISH_PRESETS`:
  - `None`
  - `Normal`
  - `Intracranial Hemorrhage / Acute TBI`
  - `Pneumonia / Lung Consolidation`
  - `Pleural Effusion / Hemothorax`
  - `Pneumothorax`
  - `Intra-abdominal Free Fluid / Hemoperitoneum (FAST Positive)`
- Define `PHYSICAL_EXAM_PRESETS` for pupils, lungs, heart, abdomen, and general exam.

### Step 2: `src/components/HospitalManagementModal.tsx`
- Replace static selects with editable Combobox text inputs (`<input list="..." />` with `<datalist>`):
  - `ຊື່ແຂວງ *`: Combobox with datalist of the 4 Southern Provinces + ability to type any province.
  - `ເມືອງ *`: Combobox with datalist of districts corresponding to the chosen province + ability to type any district/village/health center.

### Step 3: `src/components/ReferralForm.tsx`
- **Field Shadow Purge**: Remove all field shadows (`shadow`, `shadow-sm`, `shadow-xs`, etc.) across all 5 intake steps to ensure clean flat styling.
- **Demographics (Step 1)**:
  - Province & District converted to native comboboxes with datalists.
  - Changing province dynamically updates the district datalist suggestions.
- **Imaging (Step 3)**:
  - CXR, Ultrasound, and CT-Scan converted to English combobox inputs with quick preset options (`None`, `Normal`, 5 Emergency conditions).
- **Physical Exam (Step 4)**:
  - Add quick dropdown selection buttons / datalists for Motor weakness, Pupils, Lung exam, Heart exam, Abdomen exam, and Other findings.

### Step 4: Verification
- Execute `compile_applet` and `lint_applet` together.
- Test production build with `npm run build`.
