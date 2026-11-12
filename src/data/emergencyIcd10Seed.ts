/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Essential Emergency & District Hospital Referral ICD-10 Starter Dataset.
 * Automatically seeded when client IndexedDB is empty or before full 74,889-row CSV is downloaded.
 */

export interface EmergencyIcd10Seed {
  code: string;
  name: string;
}

export const EMERGENCY_ICD10_SEEDS: EmergencyIcd10Seed[] = [
  // Traumatology & Head Injuries (TBI / Accidents)
  { code: 'S06.0', name: 'Concussion (ການກະທົບກະເທືອນສະໝອງ)' },
  { code: 'S06.4', name: 'Epidural haemorrhage (ເລືອດອອກນອກເຍື່ອຫຸ້ມສະໝອງ)' },
  { code: 'S06.5', name: 'Traumatic subdural haemorrhage (ເລືອດອອກໃຕ້ເຍື່ອຫຸ້ມສະໝອງຈາກອຸບັດເຫດ)' },
  { code: 'S06.6', name: 'Traumatic subarachnoid haemorrhage (ເລືອດອອກໃຕ້ເຍື່ອຫຸ້ມສະໝອງຊັ້ນກາງ)' },
  { code: 'S06.9', name: 'Intracranial injury, unspecified / Severe TBI (ບາດເຈັບໃນກະໂຫຼກຫົວຮຸນແຮງ)' },
  { code: 'S02.0', name: 'Fracture of vault of skull (ກະໂຫຼກຫົວແຕກ)' },
  { code: 'S02.1', name: 'Fracture of base of skull (ຖານກະໂຫຼກຫົວແຕກ)' },
  { code: 'S02.9', name: 'Fracture of skull and facial bones, unspecified (ກະດູກກະໂຫຼກ ແລະ ໃບໜ້າຫັກ)' },
  { code: 'S09.9', name: 'Unspecified injury of head (ບາດເຈັບບໍລິເວນຫົວ)' },
  { code: 'T07', name: 'Unspecified multiple injuries / Polytrauma (ບາດເຈັບຫຼາຍແຫ່ງຮຸນແຮງ)' },

  // Spine & Orthopedic Fractures
  { code: 'S12.9', name: 'Fracture of neck, unspecified / Cervical spine fracture (ກະດູກຄໍຫັກ)' },
  { code: 'S22.0', name: 'Fracture of thoracic vertebra (ກະດູກສັນຫຼັງສ່ວນເອິກຫັກ)' },
  { code: 'S32.0', name: 'Fracture of lumbar vertebra (ກະດູກສັນຫຼັງສ່ວນແອວຫັກ)' },
  { code: 'S32.8', name: 'Fracture of other parts of pelvis / Pelvic fracture (ກະດູກຊາມຫັກ)' },
  { code: 'S72.0', name: 'Fracture of neck of femur (ກະດູກຄໍກົກຂາຫັກ)' },
  { code: 'S72.3', name: 'Fracture of shaft of femur (ກະດູກກົກຂາຫັກ)' },
  { code: 'S82.2', name: 'Fracture of shaft of tibia (ກະດູກແຂ່ງຫັກ)' },
  { code: 'S42.0', name: 'Fracture of clavicle (ກະດູກໄຫປາລ້າຫັກ)' },
  { code: 'S42.2', name: 'Fracture of upper end of humerus (ກະດູກຕົ້ນແຂນຫັກ)' },
  { code: 'S52.5', name: 'Fracture of lower end of radius (ກະດູກປາຍແຂນຫັກ)' },
  { code: 'T14.8', name: 'Open fracture of unspecified body region (ກະດູກຫັກແບບເປີດມີບາດແຜ)' },

  // Chest & Abdominal Trauma / Acute Abdomen
  { code: 'S27.0', name: 'Traumatic pneumothorax (ລົມຮົ່ວໃນຊ່ອງເອິກຈາກອຸບັດເຫດ)' },
  { code: 'S27.1', name: 'Traumatic haemothorax (ເລືອດອອກໃນຊ່ອງເອິກ)' },
  { code: 'S27.2', name: 'Traumatic haemopneumothorax (ເລືອດ ແລະ ລົມຮົ່ວໃນຊ່ອງເອິກ)' },
  { code: 'S22.4', name: 'Multiple fractures of ribs / Flail chest (ກະດູກຂ້າງຫັກຫຼາຍທ່ອນ)' },
  { code: 'S36.0', name: 'Injury of spleen / Splenic rupture (ມ້າມຈີກຂາດ/ເລືອດອອກ)' },
  { code: 'S36.1', name: 'Injury of liver or gallbladder (ຕັບຈີກຂາດ)' },
  { code: 'K35.8', name: 'Acute appendicitis, other and unspecified (ໄສ້ຕິ່ງອັກເສບສ້ວຍແຫຼມ)' },
  { code: 'K35.2', name: 'Acute appendicitis with generalized peritonitis (ໄສ້ຕິ່ງແຕກ/ເຍື່ອບຸທ້ອງອັກເສບ)' },
  { code: 'K56.6', name: 'Other and unspecified intestinal obstruction (ໄສ້ຕັນ)' },
  { code: 'K25.5', name: 'Gastric ulcer with perforation (ກະເພາະອາຫານເປັນບາດຊຶມ/ທະລຸ)' },
  { code: 'K85.9', name: 'Acute pancreatitis, unspecified (ຕັບອ່ອນອັກເສບສ້ວຍແຫຼມ)' },
  { code: 'K80.0', name: 'Calculus of gallbladder with acute cholecystitis (ຖົງບີອັກເສບຈາກໜິ້ວ)' },
  { code: 'K92.0', name: 'Haematemesis / Upper GI Bleeding (ຮາກເປັນເລືອດ)' },
  { code: 'K92.1', name: 'Melaena (ຖ່າຍອາຈົມດຳຈາກເລືອດອອກທາງເດີນອາຫານ)' },
  { code: 'K92.2', name: 'Gastrointestinal haemorrhage, unspecified (ເລືອດອອກໃນລະບົບທາງເດີນອາຫານ)' },

  // Cardiovascular Emergencies
  { code: 'I21.0', name: 'Acute transmural myocardial infarction of anterior wall / STEMI (ກ້າມຊີ້ນຫົວໃຈຕາຍສ້ວຍແຫຼມ)' },
  { code: 'I21.9', name: 'Acute myocardial infarction, unspecified (ກ້າມຊີ້ນຫົວໃຈຂາດເລືອດສ້ວຍແຫຼມ)' },
  { code: 'I20.0', name: 'Unstable angina (ເຈັບໜ້າເອິກບໍ່ສະໝ່ຳສະເໝີ)' },
  { code: 'I50.9', name: 'Heart failure, unspecified / Acute Pulmonary Edema (ຫົວໃຈຊຸດໂຊມ/ນ້ຳຖ້ວມປອດ)' },
  { code: 'I46.9', name: 'Cardiac arrest, unspecified (ຫົວໃຈຢຸດເຕັ້ນ)' },
  { code: 'I49.9', name: 'Cardiac arrhythmia, unspecified (ຫົວໃຈເຕັ້ນຜິດຈັງຫວະ)' },
  { code: 'I10', name: 'Essential (primary) hypertension / Hypertensive crisis (ຄວາມດັນເລືອດສູງວິກິດ)' },
  { code: 'I71.0', name: 'Dissection of aorta [any part] (ເສັ້ນເລືອດແດງໃຫຍ່ເອອໍຕາຈີກແຍກ)' },

  // Neurological & Cerebrovascular Emergencies
  { code: 'I61.9', name: 'Nontraumatic intracerebral haemorrhage / Hemorrhagic Stroke (ເລືອດອອກໃນສະໝອງ)' },
  { code: 'I63.9', name: 'Cerebral infarction, unspecified / Ischemic Stroke (ສະໝອງຂາດເລືອດ/ເສັ້ນເລືອດສະໝອງຕັນ)' },
  { code: 'I64', name: 'Stroke, not specified as haemorrhage or infarction (ພະຍາດເສັ້ນເລືອດສະໝອງ)' },
  { code: 'G40.9', name: 'Epilepsy, unspecified / Status epilepticus (ຊັກກະຕຸກຕໍ່ເນື່ອງ)' },
  { code: 'R56.0', name: 'Febrile convulsions (ຊັກຈາກໄຂ້ສູງ)' },
  { code: 'G00.9', name: 'Bacterial meningitis, unspecified (ເຍື່ອຫຸ້ມສະໝອງອັກເສບຈາກເຊື້ອແບັກທີເຣຍ)' },
  { code: 'G04.9', name: 'Encephalitis, myelitis and encephalomyelitis, unspecified (ສະໝອງອັກເສບ)' },

  // Respiratory Emergencies
  { code: 'J44.1', name: 'Chronic obstructive pulmonary disease with acute exacerbation (COPD ກຳເລີບສ້ວຍແຫຼມ)' },
  { code: 'J45.9', name: 'Asthma, unspecified / Acute severe asthma (ຫືດຫອບກຳເລີບຮຸນແຮງ)' },
  { code: 'J18.9', name: 'Pneumonia, unspecified organism (ປອດອັກເສບຮຸນແຮງ)' },
  { code: 'J80', name: 'Acute respiratory distress syndrome [ARDS] (ພາວະຫາຍໃຈລົ້ມເຫຼວສ້ວຍແຫຼມ)' },
  { code: 'J96.0', name: 'Acute respiratory failure (ລະບົບຫາຍໃຈລົ້ມເຫຼວ)' },
  { code: 'J69.0', name: 'Pneumonitis due to food and vomit / Aspiration pneumonia (ປອດອັກເສບຈາກການສຳລັກ)' },

  // Sepsis & Infectious Diseases
  { code: 'A41.9', name: 'Sepsis, unspecified / Septic shock (ຕິດເຊື້ອໃນກະແສເລືອດຮຸນແຮງ)' },
  { code: 'R57.2', name: 'Septic shock (ຊ໊ອກຈາກການຕິດເຊື້ອ)' },
  { code: 'R57.0', name: 'Cardiogenic shock (ຊ໊ອກຈາກຫົວໃຈ)' },
  { code: 'R57.1', name: 'Hypovolaemic shock (ຊ໊ອກຈາກການຂາດນ້ຳ/ເສຍເລືອດ)' },
  { code: 'R57.9', name: 'Shock, unspecified (ພາວະຊ໊ອກບໍ່ລະບຸສາເຫດ)' },
  { code: 'A97.2', name: 'Severe dengue / Dengue shock syndrome (ໄຂ້ເລືອດອອກຂັ້ນຮຸນແຮງ/ຊ໊ອກ)' },
  { code: 'A97.9', name: 'Dengue, unspecified (ໄຂ້ເລືອດອອກເດັງກີ)' },
  { code: 'B54', name: 'Unspecified malaria / Severe Malaria (ໄຂ້ຍຸງມາລາເຣຍຂັ້ນຮຸນແຮງ)' },
  { code: 'A01.0', name: 'Typhoid fever (ໄຂ້ທໍລະພິດ/ໄທຟອຍ)' },
  { code: 'A00.9', name: 'Cholera, unspecified (ອະຫິວາ)' },
  { code: 'A09', name: 'Infectious gastroenteritis and colitis, unspecified (ຖ່າຍເທອກສ້ວຍແຫຼມ/ຂາດນ້ຳຮຸນແຮງ)' },
  { code: 'A35', name: 'Other tetanus (ບາດທະຍັກ)' },
  { code: 'A82.9', name: 'Rabies, unspecified (ພະຍາດວໍ້/ໝາວໍ້)' },

  // Obstetric & Gynecological Emergencies
  { code: 'O14.1', name: 'Severe pre-eclampsia (ພິດແຫ່ງຄັນຮຸນແຮງ)' },
  { code: 'O15.0', name: 'Eclampsia in pregnancy (ຊັກຈາກພິດແຫ່ງຄັນ)' },
  { code: 'O00.9', name: 'Ectopic pregnancy, unspecified / Ruptured ectopic (ຖືພາຕັ້ງຢູ່ນອກມົດລູກແຕກ)' },
  { code: 'O44.1', name: 'Placenta praevia with haemorrhage (ໝາກແຫ່ເກາະຕ່ຳມີເລືອດອອກ)' },
  { code: 'O45.9', name: 'Premature separation of placenta [abruptio placentae] (ລອກຕົວກ່ອນກຳນົດຂອງໝາກແຫ່)' },
  { code: 'O72.1', name: 'Other immediate postpartum haemorrhage / PPH (ຕົກເລືອດຫຼັງເກີດ)' },
  { code: 'O63.0', name: 'Prolonged first stage of labour (ເຈັບທ້ອງເກີດລູກຍາວນານ)' },
  { code: 'O64.9', name: 'Obstructed labour due to malposition and malpresentation (ເກີດລູກຕິດຂັດທ່າລູກຜິດປົກກະຕິ)' },
  { code: 'O71.1', name: 'Rupture of uterus during labour (ມົດລູກແຕກ)' },
  { code: 'O85', name: 'Puerperal sepsis (ຕິດເຊື້ອຫຼັງເກີດລູກ)' },

  // Pediatric & Neonatal Emergencies
  { code: 'P21.9', name: 'Birth asphyxia, unspecified (ເດັກທາລົກຂາດອົກຊີແຊນຕອນເກີດ)' },
  { code: 'P07.3', name: 'Other preterm infants (ເດັກເກີດກ່ອນກຳນົດ)' },
  { code: 'P36.9', name: 'Bacterial sepsis of newborn, unspecified (ເດັກເກີດໃໝ່ຕິດເຊື້ອໃນກະແສເລືອດ)' },
  { code: 'P59.9', name: 'Neonatal jaundice, unspecified (ເດັກຕາເຫຼືອງຮຸນແຮງ)' },
  { code: 'P22.0', name: 'Respiratory distress syndrome of newborn [RDS] (ຫາຍໃຈຍາກໃນທາລົກ)' },

  // Metabolic, Endocrine, Renal & Poisoning
  { code: 'E14.0', name: 'Unspecified diabetes mellitus with ketoacidosis [DKA] (ເບົາຫວານພາວະເລືອດເປັນກົດ)' },
  { code: 'E16.0', name: 'Drug-induced hypoglycaemia without coma / Severe Hypoglycemia (ນ້ຳຕານໃນເລືອດຕ່ຳວິກິດ)' },
  { code: 'N17.9', name: 'Acute kidney failure, unspecified (ໝາກໄຂ່ຫຼັງວາຍສ້ວຍແຫຼມ)' },
  { code: 'N20.1', name: 'Calculus of ureter with renal colic (ໜິ້ວທໍ່ໝາກໄຂ່ຫຼັງເຈັບຮຸນແຮງ)' },
  { code: 'T60.0', name: 'Organophosphate and carbamate insecticides (ສານພິດຢາຂ້າແມງໄມ້)' },
  { code: 'T65.9', name: 'Toxic effect of unspecified substance / Acute Poisoning (ໄດ້ຮັບສານພິດສ້ວຍແຫຼມ)' },
  { code: 'T63.0', name: 'Snake venom / Snake bite with envenomation (ງູພິດກັດ)' },
  { code: 'T78.2', name: 'Anaphylactic shock, unspecified (ແພ້ຮຸນແຮງຊ໊ອກ)' },
  { code: 'T30.0', name: 'Burn of unspecified body region, unspecified degree (ໄຟໄໝ້/ນ້ຳຮ້ອນລວກຮຸນແຮງ)' },
  { code: 'T75.1', name: 'Drowning and nonfatal submersion (ຈົມນ້ຳ)' },
  { code: 'T75.0', name: 'Effects of lightning / Electrocution (ຖືກຟ້າຜ່າ/ໄຟຟ້າດູດ)' }
];
