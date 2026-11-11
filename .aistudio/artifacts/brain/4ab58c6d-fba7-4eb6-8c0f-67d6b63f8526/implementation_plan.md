# ແຜນຈັດຕັ້ງປະຕິບັດ: ປັບປຸງລາຍການພາຫະນະ, ຜູ້ຮັບປາຍທາງ ER, ແລະ ຕັດຂໍ້ຄວາມທີ່ບໍ່ຕ້ອງການອອກ

## ສະຖານະ: ສຳເລັດສົມບູນ (Completed)

1. ຕັດຂໍ້ຄວາມ `EMSCPS Champasak Provincial Hospital EMS Referral Network · Generated electronically` ທ້າຍເຈ້ຍ A4 ອອກທັງໝົດ.
2. ຕັດຄຳວ່າ `(ບ່ອນເຊັນ ແລະ ປະທັບກາ)` ແລະ `(ບ່ອນລາຍເຊັນ)` ອອກ, ປ່ອຍເປັນຊ່ອງວ່າງຂາວສະອາດສຳລັບເຊັນ ແລະ ປະທັບກາຕົວຈິງ.
3. ປັບລາຍການພາຫະນະນຳສົ່ງ (Transport Vehicle) ເປັນ 5 ຕົວເລືອກສະອາດ: `ລົດສຸກເສີນ EMS ຂັ້ນສູງ`, `ລົດສຸກເສີນ EMS ຂັ້ນພື້ນຖານ`, `ລົດຕູ້ສົ່ງຕໍ່ຄົນເຈັບພ້ອມຖັງ O2`, `ເຮືອໄວສຸກເສີນ`, `ລົດຍາດຕິພີ່ນ້ອງ/ລົດຮັບຈ້າງ`.
4. ຜູ້ຮັບປາຍທາງ ER ໂຮງໝໍແຂວງຈຳປາສັກ ຕັ້ງຄ່າເລີ່ມຕົ້ນ ແລະ ມາດຕະຖານເປັນ: `ແພດຍາດສຸກເສີນ`.

---

## 1. ລາຍລະອຽດການດັດແກ້ໂຄດ (Code Implementation)

### ຂັ້ນຕອນທີ 1: ປັບປຸງ `src/components/ReferralA4Print.tsx`
- ລົບສ່ວນ Footer Note ທ້າຍເຈ້ຍ A4:
  ```tsx
  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-400 text-center font-mono">
    EMSCPS Champasak Provincial Hospital EMS Referral Network · Generated electronically
  </div>
  ```
- ໃນສ່ວນລາຍເຊັນ (ຜູ້ອຳນວຍການ ແລະ ທ່ານໝໍສົ່ງຄົນເຈັບ):
  - ລົບ `<span className="text-[12px] text-slate-300 print:hidden select-none">(ບ່ອນເຊັນ ແລະ ປະທັບກາ)</span>`
  - ລົບ `<span className="text-[12px] text-slate-300 print:hidden select-none">(ບ່ອນລາຍເຊັນ)</span>`
  - ຮັກສາຄວາມສູງຂອງຊ່ອງວ່າງ `min-h-[120px] sm:min-h-[135px]` ໄວ້ຄືເກົ່າ ເພື່ອໃຫ້ພໍດີເຕັມໜ້າ A4 ໂດຍເປັນພື້ນທີ່ຫວ່າງສີຂາວສະອາດ 100%.
- ອັບເດດຂໍ້ຄວາມ fallback ຂອງຜູ້ຮັບປາຍທາງ ER ເປັນ: `{referral.targetCoordinator || 'ແພດຍາດສຸກເສີນ'}`.

### ຂັ້ນຕອນທີ 2: ປັບປຸງ `src/data/facilities.ts`
- ອັບເດດ Array `TRANSPORT_VEHICLES` ໃຫ້ມີ 5 ລາຍການຕາມທີ່ລະບຸ:
  ```ts
  export const TRANSPORT_VEHICLES = [
    'ລົດສຸກເສີນ EMS ຂັ້ນສູງ',
    'ລົດສຸກເສີນ EMS ຂັ້ນພື້ນຖານ',
    'ລົດຕູ້ສົ່ງຕໍ່ຄົນເຈັບພ້ອມຖັງ O2',
    'ເຮືອໄວສຸກເສີນ',
    'ລົດຍາດຕິພີ່ນ້ອງ/ລົດຮັບຈ້າງ',
  ] as const;
  ```

### ຂັ້ນຕອນທີ 3: ປັບປຸງ `src/components/ReferralForm.tsx`
- ຕັ້ງຄ່າ State ເລີ່ມຕົ້ນຂອງ `targetCoordinator` ເປັນ `'ແພດຍາດສຸກເສີນ'`.
- ປັບ UI ຂອງຊ່ອງ **ຜູ້ຮັບປາຍທາງ ER ໂຮງໝໍແຂວງຈຳປາສັກ (Target Coordinator) ***:
  - ຕັ້ງຄ່າຄົງທີ່ເປັນ `'ແພດຍາດສຸກເສີນ'` ພ້ອມອະນຸຍາດໃຫ້ຢືນຢັນຄ່ານີ້ (ຕັດຕົວເລືອກອື່ນໆອອກຕາມທີ່ລະບຸ).
- ຕັ້ງຄ່າເລີ່ມຕົ້ນຂອງ `transportVehicle` ເປັນ `TRANSPORT_VEHICLES[0]` (`ລົດສຸກເສີນ EMS ຂັ້ນສູງ`).

### ຂັ້ນຕອນທີ 4: ປັບປຸງ `src/components/ReferralDetail.tsx`
- ອັບເດດ default coordinator fallback ໃນໜ້າລາຍລະອຽດເຄສເປັນ `'ແພດຍາດສຸກເສີນ'`.

---

## 2. ການກວດສອບ ແລະ ທົດສອບ (Verification & Testing)
1. ກວດສອບໜ້າສ້າງໃບສົ່ງຕໍ່ໃໝ່ (`ReferralForm.tsx`):
   - ເມນູເລືອກພາຫະນະມີສະເພາະ 5 ລາຍການໃໝ່.
   - ຊ່ອງຜູ້ຮັບປາຍທາງ ER ສະແດງ `ແພດຍາດສຸກເສີນ`.
2. ກວດສອບໜ້າພິມ A4 (`ReferralA4Print.tsx`):
   - ບໍ່ມີຂໍ້ຄວາມ `EMSCPS Champasak Provincial Hospital...` ທ້າຍເຈ້ຍ.
   - ບໍ່ມີຄຳວ່າ `(ບ່ອນເຊັນ ແລະ ປະທັບກາ)` ແລະ `(ບ່ອນລາຍເຊັນ)`.
   - ຊ່ອງວ່າງລາຍເຊັນຂາວສະອາດ ແລະ ພໍດີເຕັມໜ້າ A4 1 ໜ້າພໍດີ.
3. ກວດສອບ build ດ້ວຍ `compile_applet` ແລະ `lint_applet`.
