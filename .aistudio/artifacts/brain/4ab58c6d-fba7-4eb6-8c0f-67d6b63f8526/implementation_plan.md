# ແຜນຈັດຕັ້ງປະຕິບັດ: ແກ້ໄຂລະບົບພິມ ແລະ ດາວໂຫຼດ PDF A4 (Print Isolation)

## ສະຖານະ: ສຳເລັດສົມບູນ (Completed)

ລະບົບ Print Container Isolation ໄດ້ຖືກຈັດຕັ້ງປະຕິບັດ ແລະ ທົດສອບຮຽບຮ້ອຍແລ້ວ:
- ເຊື່ອງ Desktop Header, ພື້ນຫຼັງ ແລະ ປຸ່ມກົດທັງໝົດດ້ວຍ `body * { visibility: hidden !important; }` ແລະ `.no-print`.
- ສະແດງສະເພາະຕົວໃບສົ່ງຕໍ່ `.print-container` ທີ່ຕຳແໜ່ງ (0, 0) ຂອງເຈ້ຍ A4.
- ຕັ້ງຄ່າຂອບເຈ້ຍ A4 8mm–10mm ເຮັດໃຫ້ເນື້ອໃນທັງໝົດພໍດີ 1 ໜ້າເຈ້ຍ A4 ພໍດີ 100%.

---

## 1. ລາຍລະອຽດການດັດແກ້ໂຄດ (Code Implementation)

### ຂັ້ນຕອນທີ 1: ອັບເດດ CSS Print Stylesheet ໃນ `src/index.css`
ປັບປຸງ `@media print` ໃຫ້ສົມບູນແບບ:
- `body * { visibility: hidden !important; }`
- `.print-container, .print-container * { visibility: visible !important; }`
- `.print-container { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; ... }`
- `.no-print { display: none !important; }`
- `@page { size: A4 portrait; margin: 8mm 10mm; }`
- ປ້ອງກັນການແຕກໜ້າເຈ້ຍ (`page-break-after: avoid !important; break-after: avoid !important;`).

### ຂັ້ນຕອນທີ 2: ຕິດ Class `print-container` ໃນ `src/components/ReferralA4Print.tsx`
- ໃຫ້ແນ່ໃຈວ່າຕົວຫໍ່ໃບສົ່ງຕໍ່ A4 ມີ Class `print-container`:
  ```tsx
  <div className="a4-page print-container bg-white text-slate-900 shadow-lg border border-slate-300 p-6 sm:p-8 w-full max-w-[210mm] text-[11px] leading-snug font-sans">
  ```
- ກວດສອບປຸ່ມ Back, Download, Print ແລະ ຄຳແນະນຳ ໃຫ້ມີ `no-print`.

### ຂັ້ນຕອນທີ 3: ຕິດ Class `no-print` ໃນ `src/App.tsx`
- ໃສ່ `className="no-print"` ໃຫ້ກັບ:
  - ສ່ວນຫົວຂອງລະບົບ `<Header ... />`
  - ສ່ວນທ້າຍ `<footer ... />`
  - ກ່ອງແຈ້ງເຕືອນ Toast alert

---

## 2. ການກວດສອບ ແລະ ທົດສອບ (Verification & Testing)
1. ທົດສອບກົດປຸ່ມ **"ພິມເອກະສານ (Print A4)"** ແລະ **"ດາວໂຫຼດ PDF (A4)"**.
2. ກວດສອບໃນໜ້າຕ່າງ Print Preview ຂອງ Browser ວ່າ:
   - ບໍ່ມີ Header ລະບົບ (EMSCPS ລະບົບສົ່ງຕໍ່...) ຕິດມາ.
   - ບໍ່ມີປຸ່ມ Back, Download, Print ຕິດມາ.
   - ບໍ່ມີພື້ນຫຼັງສີເທົາຂອງ Desktop ຕິດມາ.
   - ມີສະເພາະໃບສົ່ງຕໍ່ສີຂາວທີ່ສະອາດ ພໍດີ 1 ໜ້າເຈ້ຍ A4 ພໍດີ.
3. ກວດສອບ build ດ້ວຍ `compile_applet` ແລະ `lint_applet`.
