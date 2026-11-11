# EMSCPS - Hospital Management & A4 Referral Slip Customization

Refining hospital management with custom provinces and dual ambulance license plates (Ambulance 1 & 2), and streamlining the official A4 print and PDF slip to match provincial health office requirements.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following specific updates have been confirmed for implementation:

- **Hospital Management Form (+ ເພີ່ມໂຮງໝໍ / ສຸກສາລາໃໝ່)**:
  - **ຊື່ແຂວງ (Province Name)**: Free text input (default "ຈຳປາສັກ", customizable for any province).
  - **ຊື່ໂຮງໝໍເມືອງ (District Hospital Name)**: Text input.
  - **ລະຫັດຜ່ານເຂົ້າລະບົບ (Passcode)**: Password input.
  - **ຜູ້ອຳນວຍການ (Director)**: Text input.
  - **ທະບຽນລົດສຸກເສີນ (Ambulance Plates)**: Replaced count with 2 specific vehicle registration fields:
    - *ຄັນທີ 1 ເລກທະບຽນ (Ambulance 1 Plate)*: e.g. "ກກ 1122 ຈຳປາສັກ"
    - *ຄັນທີ 2 ເລກທະບຽນ (Ambulance 2 Plate)*: e.g. "ກຂ 3344 ຈຳປາສັກ"
  - In the referral intake form, the user can select either Ambulance 1 or Ambulance 2 license plate for patient dispatch!

- **Official A4 Print & PDF Slip (ດາວໂຫຼດ PDF & ພິມເອກະສານ)**:
  - **Header Structure**:
    - **Remove "ກະຊວງສາທາລະນະສຸກ"** completely from the header.
    - **Dynamic Left Block**:
      - `ພະແນກສາທາລະນະສຸກ: [ຊື່ແຂວງທີ່ຕັ້ງຄ່າ]` (e.g. ພະແນກສາທາລະນະສຸກ ແຂວງຈຳປາສັກ)
      - `ໂຮງໝໍ: [ຊື່ໂຮງໝໍຕົ້ນທາງ]`
    - **Header Right Block**:
      - `REF-2026-001 - HN: HN-PS-8921`
      - `ວັນທີ: [YYYY-MM-DD] | ເວລາ: [HH:mm]`
      - `Triage: [EMERGENCY / URGENT / ROUTINE]`
  - **Title & Section Labels**:
    - **Remove `(MEDICAL REFERRAL SLIP)`** from title -> Clean Lao title: **"ໃບສົ່ງຕໍ່ຄົນເຈັບ"**.
    - **Remove English transliterations** like `(PATIENT DEMOGRAPHICS)` -> **"I. ຂໍ້ມູນປະຈຳຕົວຄົນເຈັບ"**.
    - **Remove district English suffixes** like `(Paksong)`, `(Sanasomboun)`, `(Pakse)` -> Clean Lao names: **"ເມືອງປາກຊ່ອງ"**, **"ເມືອງຊະນະສົມບູນ"**, **"ເມືອງປາກເຊ"**.
    - Preserve essential universal clinical acronyms: BP, PR, RR, Temp, SpO2, GCS (Eye, Verbal, Motor).

```
┌────────────────────────────────────────────────────────────────────────┐
│                      UPDATED A4 HEADER SPECIFICATION                   │
└────────────────────────────────────────────────────────────────────────┘

                 ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ
               ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ
                           ─────────
 ພະແນກສາທາລະນະສຸກ: [ແຂວງທີ່ຕັ້ງຄ່າ]         [ID] - HN: [HN Number]
 ໂຮງໝໍ: [ໂຮງໝໍຕົ້ນທາງ]                    ວັນທີ: [Date] | ເວລາ: [Time]
                                        Triage: [EMERGENCY]
 ─────────────────────────────────────────────────────────────────────────
                             ໃບສົ່ງຕໍ່ຄົນເຈັບ
                    ລະບົບສົ່ງຕໍ່ສຸກເສີນ EMSCPS ໂຮງໝໍແຂວງຈຳປາສັກ

 I. ຂໍ້ມູນປະຈຳຕົວຄົນເຈັບ
   ຊື່ ແລະ ນາມສະກຸນ: ...           ເພດ: ...          ອາຍຸ: ...
   ບ້ານ: ...                     ເມືອງ: ເມືອງປາກຊ່ອງ   ແຂວງ: ຈຳປາສັກ
```

---

### 1. Overview & Core Concept

- **What It Does**: Aligns the referral printing layout with real provincial health office memos and adds granular vehicle tracking by license plate for each district hospital.
- **Key Value**: Provides accurate vehicle dispatch accountability and authentic Lao administrative document formatting.

---

### 2. User Experience & Visual Design

- **District Hospital Modal**:
  - Fields for Province, Hospital Name, Passcode, Director, Plate 1, Plate 2.
- **Referral Intake Form (Step 5)**:
  - Dropdown to pick which registered ambulance plate is transporting the patient (Plate 1 vs Plate 2).
- **A4 Print Slip**:
  - Pure Lao administrative styling, exact dynamic province binding, and clean tabular alignment.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Ambulance License Plates**:
  - *Chosen Approach*: Store `ambulancePlate1` and `ambulancePlate2` per hospital, allowing doctors to select the exact vehicle registration dispatched.
  - *Why*: Directly satisfies the user's requirement to record plate numbers rather than just vehicle counts.
- **Decision 2: Removal of Ministry Header**:
  - *Chosen Approach*: Remove "ກະຊວງສາທາລະນະສຸກ" and lead directly with Provincial Health Office ("ພະແນກສາທາລະນະສຸກ: [ແຂວງ]").
  - *Why*: Reflects provincial-level inter-hospital referral memos in Laos.
- **Decision 3: Lao-First Administrative Copy**:
  - *Chosen Approach*: Remove redundant English titles and transliterations while keeping universal clinical abbreviations (BP, PR, GCS, SpO2).

---

### 4. Implementation Steps (Upon Approval)

1. **Schema & Types Update (`src/types/referral.ts`)**:
   - Update `DistrictHospital` to include `province: string`, `ambulancePlate1: string`, `ambulancePlate2: string`.
   - Update `ReferralRecord` with `ambulancePlate?: string`.
2. **Facilities & Defaults Update (`src/data/facilities.ts`)**:
   - Strip English district suffixes (`(Paksong)` -> `ເມືອງປາກຊ່ອງ`).
   - Add default license plates for each district hospital.
3. **Hospital Management Modal Update (`src/components/HospitalManagementModal.tsx`)**:
   - Update form fields: Province (Text), District Hospital Name (Text), Passcode, Director, Plate 1 (Text), Plate 2 (Text).
4. **Referral Intake Form Update (`src/components/ReferralForm.tsx`)**:
   - Provide vehicle plate selection based on the sending hospital's registered plates.
5. **A4 Slip & PDF Update (`src/components/ReferralA4Print.tsx`)**:
   - Remove "ກະຊວງສາທາລະນະສຸກ".
   - Render dynamic province and hospital on the left, ID/Date/Triage on the right.
   - Clean title "ໃບສົ່ງຕໍ່ຄົນເຈັບ" and remove English section subtitle tags.
6. **Verification**:
   - Run `compile_applet` and `lint_applet`.
   - Test PDF download and print view.
