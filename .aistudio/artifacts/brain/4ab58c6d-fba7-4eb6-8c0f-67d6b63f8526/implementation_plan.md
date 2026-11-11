# ແຜນຈັດຕັ້ງປະຕິບັດ: ລະບົບກາໝາຍຊາດລາວ (Official Lao Emblem) ຜ່ານ Public Assets & Logo Uploader

## ສະຖານະ: ສຳເລັດສົມບູນ (Completed)

ທັງສອງລະບົບ (ໂຫຼດຜ່ານ `/assets/lao-emblem.png` ແລະ ລະບົບອັບໂຫຼດຮູບ Logo ຕົວຈິງໃນໜ້າຕັ້ງຄ່າ) ໄດ້ຖືກສ້າງ ແລະ ເຊື່ອມຕໍ່ເຂົ້າກັນຮຽບຮ້ອຍແລ້ວ.

---

## 1. ຂັ້ນຕອນການຈັດຕັ້ງປະຕິບັດ (Implementation Steps)

### ຂັ້ນຕອນທີ 1: ສ້າງໂຄງສ້າງ Folder `public/assets/` ແລະ ໄຟລ໌ `logoService.ts`
- ກວດສອບ ແລະ ສ້າງ Directory `/public/assets/` ໃຫ້ພ້ອມໃຊ້ງານໃນໂຄງການ.
- ສ້າງ Service `src/services/logoService.ts` ສຳລັບ:
  - ກວດສອບ ແລະ ດຶງຮູບ Logo ທີ່ຜູ້ໃຊ້ເຄີຍອັບໂຫຼດໄວ້ໃນ `localStorage` / `IndexedDB`.
  - ຖ້າບໍ່ມີການອັບໂຫຼດ, ຈະໃຊ້ຄ່າເລີ່ມຕົ້ນ `/assets/lao-emblem.png`.
  - ຟັງຊັນ `saveCustomLogo(base64)` ແລະ `resetToDefaultLogo()`.

### ຂັ້ນຕອນທີ 2: ເພີ່ມ Subtab "ຕັ້ງຄ່າກາໝາຍຊາດ / ໂລໂກ້" ໃນ `AdminSettingsView.tsx`
- ເພີ່ມ Subtab ທີ 3 ໃນໜ້າ **ຕັ້ງຄ່າ (Settings)**:
  1. `ໂຮງໝໍເມືອງ / ສຸກສາລາ`
  2. `ຕັ້ງຄ່າບົ່ງມະຕິ (ICD-10)`
  3. `ກາໝາຍຊາດ / ໂລໂກ້ໃບສົ່ງຕໍ່ (Emblem / Logo)`
- ໃນ Subtab ນີ້ຈະມີ:
  - ຊ່ອງເລືອກໄຟລ໌ (Upload PNG/JPG) ພ້ອມ Preview ຮູບຕົວຢ່າງທັນທີ.
  - ປຸ່ມ "ບັນທຶກຮູບ Logo" ເຊິ່ງຈະບັນທຶກໄວ້ໃນ browser ເພື່ອນຳໄປໃຊ້ໃນທຸກໆໃບສົ່ງຕໍ່ ແລະ ການພິມ PDF.
  - ປຸ່ມ "ຣີເຊັດເປັນຄ່າເລີ່ມຕົ້ນ (`/assets/lao-emblem.png`)".
  - ຄຳແນະນຳວິທີເອົາໄຟລ໌ `lao-emblem.png` ໄປວາງໃນ Folder `public/assets/` ສຳລັບການ Deploy ຂຶ້ນ Cloudflare Pages.

### ຂັ້ນຕອນທີ 3: ປັບປຸງ `ReferralA4Print.tsx` ໃຫ້ສະແດງຜົນຜ່ານ `<img>`
- ແທນທີ່ການແຕ້ມຮູບດ້ວຍ SVG ມາເປັນ HTML Tag `<img>` ມາດຕະຖານ:
  ```tsx
  <img 
    src={emblemSrc} 
    alt="ກາໝາຍຊາດ ສປປ ລາວ" 
    className="w-16 h-16 mx-auto mb-1.5 object-contain"
    onError={handleImageFallback}
  />
  ```
- ຮອງຮັບ `onError` ຢ່າງປອດໄພ (ຖ້າໄຟລ໌ໃນ public ຍັງບໍ່ຖືກວາງ ຫຼື ກຳລັງໂຫຼດ ຈະບໍ່ເຮັດໃຫ້ໜ້າເຈ້ຍເສຍຮູບຮ່າງ).
- ຮັກສາຮູບແບບ **A4 Single-page 1 ໜ້າພໍດີ** ໄວ້ຢ່າງສົມບູນ.

---

## 2. ການກວດສອບ ແລະ ທົດສອບ (Verification & Testing)
1. ທົດສອບການໂຫຼດຮູບຈາກ `/assets/lao-emblem.png`.
2. ທົດສອບການອັບໂຫຼດຮູບ PNG ຕົວຈິງຜ່ານໜ້າ `ຕັ້ງຄ່າ` ແລະ ກວດເບິ່ງວ່າຮູບປາກົດໃນໃບສົ່ງຕໍ່ຄົນເຈັບທັນທີ.
3. ທົດສອບກົດ **"ພິມເອກະສານ (Print A4)"** ແລະ **"ດາວໂຫຼດ PDF (A4)"** ເພື່ອກວດສອບວ່າຮູບພາບຖືກດຶງໄປສະແດງໃນ Print/PDF Dialog ຢ່າງຄົມຊັດ ແລະ ບໍ່ຕິດບັນຫາເລື່ອງໜ້າເຈ້ຍເກີນ.
4. Run `compile_applet` ແລະ `lint_applet` ເພື່ອຢືນຢັນວ່າບໍ່ມີ Error.
