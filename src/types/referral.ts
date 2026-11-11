export type TriageLevel = 'emergency' | 'urgent' | 'routine';

export type ReferralStatus = 
  | 'pending'      // ລໍຖ້າຮັບ (Pending)
  | 'accepted'     // ຮັບເລື່ອງແລ້ວ (Accepted)
  | 'in_transit'   // ກຳລັງເດີນທາງ (En Route)
  | 'arrived'      // ຮອດ ER ແລ້ວ (Arrived ER)
  | 'admitted'     // ຮັບນອນໂຮງໝໍ/ICU (Admitted / ICU)
  | 'refer_back'   // ສົ່ງຕໍ່ກັບໂຮງໝໍຕົ້ນທາງ (Refer Back)
  | 'cancelled';   // ຍົກເລີກ (Cancelled)

export type UserRole = 'admin' | 'hospital';

export interface AuthSession {
  role: UserRole;
  hospitalId?: string;
  hospitalName?: string;
  displayName: string;
  loggedInAt: string;
}

export interface DistrictHospital {
  id: string;
  name: string;
  district: string;
  province: string;
  phone: string;
  passcode: string;
  directorName?: string;
  ambulancePlate1?: string;
  ambulancePlate2?: string;
  ambulanceCount?: number;
}

export interface LabResults {
  wbc?: string;
  hct?: string;
  hb?: string;
  plt?: string;
  glucose?: string;
  creatinine?: string;
  urea?: string;
  k?: string;
  na?: string;
  dengueNs1?: string;
  otherLabs?: string;
}

export interface ImagingResults {
  cxr?: string;
  ultrasound?: string;
  ctScan?: string;
  otherImaging?: string;
}

export interface PhysicalExamination {
  referringUnit: string; // ER, Ward, ICU, Delivery Room
  weightKg?: number;
  motorWeakness?: string; // ປົກກະຕິ, ອຳມະພຶກເຄິ່ງຊິກຂວາ, ອຳມະພຶກເຄິ່ງຊິກຊ້າຍ, ອຳມະພາດ 4 ຂາ
  pupilLeft?: string; // e.g. "3mm RTL", "4mm Fix"
  pupilRight?: string; // e.g. "3mm RTL", "4mm Fix"
  lungExam?: string; // Clear, Wheezing, Crepitation, Rhonchi
  heartExam?: string; // Normal S1 S2, Murmur
  abdomenExam?: string; // Soft, Guarding, Rebound Tenderness, Distension
  otherFindings?: string;
}

export interface GlasgowComaScale {
  eye: number;    // 1-4
  verbal: number; // 1-5
  motor: number;  // 1-6
  total: number;  // 3-15 (Eye + Verbal + Motor)
  severity: 'severe' | 'moderate' | 'mild';
}

export interface VitalSigns {
  bpSystolic: number; // mmHg
  bpDiastolic: number; // mmHg
  pulseRate: number; // bpm
  respiratoryRate: number; // /min
  temperature: number; // °C
  spO2: number; // %
  gcs: GlasgowComaScale;
  oxygenTherapy?: string;
  recordedAt: string;
}

export interface TransitVitalLog {
  id: string;
  time: string;
  bpSystolic: number;
  bpDiastolic: number;
  pulseRate: number;
  spO2: number;
  gcsTotal: number;
  note?: string;
}

export interface ReferralRecord {
  id: string; // e.g. "REF-2026-001"
  
  // Step 1: Patient Demographics & Origin
  patientName: string; // ຊື່ ແລະ ນາມສະກຸນ
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation?: string; // ອາຊີບ
  village: string; // ບ້ານ
  district: string; // ເມືອງ
  province: string; // ແຂວງ
  insuranceType?: string; // ປະເພດປະກັນສຸຂະພາບ
  idCardOrHN: string; // ເລກບັດປະຈຳຕົວ ຫຼື HN
  phone?: string;
  admissionDate: string; // ວັນທີຮັບເຂົ້າ
  transferTime: string; // ເວລາສົ່ງຕົວ
  originPhone?: string; // ເບີໂທຕິດຕໍ່ໂຮງໝໍຕົ້ນທາງ

  triageLevel: TriageLevel;
  status: ReferralStatus;

  originHospital: string; // ໂຮງໝໍຕົ້ນທາງ
  originHospitalId?: string; // e.g. "hosp_paksong"
  destinationHospital: string; // ໂຮງໝໍແຂວງຈຳປາສັກ
  receivingDepartment: string; // ພະແນກຮັບ

  // Step 2: Clinical History & Diagnosis
  provisionalDiagnosis: string; // Diagnosis ຫຼັກ (*)
  presentIllness: string; // ອາການປະຈຸບັນ
  pastMedicalHistory?: string; // ປະຫວັດເຈັບເປັນຜ່ານມາ
  currentMedications?: string; // ຢາທີ່ກິນປະຈຳ
  allergies?: string; // ປະຫວັດແພ້ຢາ
  chiefComplaint?: string;

  // Step 3: Labs & Imaging
  labs: LabResults;
  imaging: ImagingResults;

  // Step 4: Vitals & Physical Exam & GCS
  vitalSigns: VitalSigns;
  physicalExam: PhysicalExamination;
  transitVitalsHistory?: TransitVitalLog[];

  // Step 5: Management, Transfer & Logistics
  initialTreatment: string; // ການປິ່ນປົວເບື້ອງຕົ້ນທີ່ໃຫ້ແລ້ວ
  transferReason: string; // ເຫດຜົນທີ່ສົ່ງຕົວ (*)
  targetCoordinator: string; // ຜູ້ຮັບປາຍທາງ ER ໂຮງໝໍແຂວງ (*)
  transportVehicle: string; // ພາຫະນະນຳສົ່ງ
  referringDoctor: string; // ຊື່ທ່ານໝໍຜູ້ສົ່ງ (*)
  referringDoctorPhone: string; // ເບີໂທຕິດຕໍ່ທ່ານໝໍ (*)
  receivingDoctor?: string; // ທ່ານໝໍຜູ້ຮັບ
  
  ambulanceCode?: string;
  etaMinutes?: number;
  dispatchTime?: string;
  arrivalTime?: string;

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseStatus {
  isConnected: boolean;
  provider: 'turso' | 'local';
  url?: string;
  error?: string;
  lastSync?: string;
  recordCount: number;
}
