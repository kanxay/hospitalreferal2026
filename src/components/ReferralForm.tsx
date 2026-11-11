import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  Stethoscope, 
  User, 
  Activity, 
  Truck, 
  Hospital, 
  FlaskConical, 
  ChevronRight, 
  ChevronLeft,
  BrainCircuit,
  FileCheck2
} from 'lucide-react';
import { 
  ReferralRecord, 
  TriageLevel, 
  AuthSession, 
  DistrictHospital,
  GlasgowComaScale 
} from '../types/referral';
import { 
  CHAMPASAK_DISTRICTS, 
  SOUTHERN_PROVINCES,
  SOUTHERN_DISTRICTS_BY_PROVINCE,
  ALL_SOUTHERN_DISTRICTS,
  IMAGING_ENGLISH_PRESETS,
  PHYSICAL_EXAM_PRESETS,
  RECEIVING_DEPARTMENTS, 
  INSURANCE_TYPES, 
  TRANSPORT_VEHICLES,
  GCS_EYE_OPTIONS,
  GCS_VERBAL_OPTIONS,
  GCS_MOTOR_OPTIONS,
  calculateGcs 
} from '../data/facilities';
import { Icd10Combobox } from './Icd10Combobox';

interface ReferralFormProps {
  onCancel: () => void;
  onSubmit: (record: Omit<ReferralRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting?: boolean;
  currentUser: AuthSession;
  hospitals: DistrictHospital[];
}

export const ReferralForm: React.FC<ReferralFormProps> = ({
  onCancel,
  onSubmit,
  isSubmitting = false,
  currentUser,
  hospitals,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState('');

  const matchedHosp = hospitals.find(h => h.id === currentUser.hospitalId) || hospitals[0];

  // --- Step 1: Patient Demographics & Origin ---
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [occupation, setOccupation] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState<string>(matchedHosp?.district || CHAMPASAK_DISTRICTS[3]);
  const [province, setProvince] = useState(matchedHosp?.province || 'ຈຳປາສັກ');
  const [insuranceType, setInsuranceType] = useState<string>(INSURANCE_TYPES[0]);
  const [idCardOrHN, setIdCardOrHN] = useState('');
  const [phone, setPhone] = useState('');
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [transferTime, setTransferTime] = useState(
    new Date().toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [originHospital, setOriginHospital] = useState(
    currentUser.hospitalName || matchedHosp?.name || 'ໂຮງໝໍຊຸມຊົນເມືອງປາກຊ່ອງ'
  );
  const [originPhone, setOriginPhone] = useState(matchedHosp?.phone || '');
  const [destinationHospital] = useState('ໂຮງໝໍແຂວງຈຳປາສັກ');
  const [receivingDepartment, setReceivingDepartment] = useState<string>(RECEIVING_DEPARTMENTS[0]);
  const [triageLevel, setTriageLevel] = useState<TriageLevel>('emergency');

  // --- Step 2: Clinical History & Diagnosis ---
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('');
  const [presentIllness, setPresentIllness] = useState('');
  const [pastMedicalHistory, setPastMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('ປະຕິເສດການແພ້ຢາ');
  const [chiefComplaint, setChiefComplaint] = useState('');

  // --- Step 3: Labs & Imaging ---
  const [wbc, setWbc] = useState('');
  const [hct, setHct] = useState('');
  const [hb, setHb] = useState('');
  const [plt, setPlt] = useState('');
  const [glucose, setGlucose] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [urea, setUrea] = useState('');
  const [k, setK] = useState('');
  const [na, setNa] = useState('');
  const [dengueNs1, setDengueNs1] = useState('');
  const [otherLabs, setOtherLabs] = useState('');

  const [cxr, setCxr] = useState('');
  const [ultrasound, setUltrasound] = useState('');
  const [ctScan, setCtScan] = useState('');

  // --- Step 4: Vitals, Physical Exam & GCS ---
  const [referringUnit, setReferringUnit] = useState('ER ສຸກເສີນ');
  const [bpSystolic, setBpSystolic] = useState<number | ''>(120);
  const [bpDiastolic, setBpDiastolic] = useState<number | ''>(80);
  const [pulseRate, setPulseRate] = useState<number | ''>(80);
  const [respiratoryRate, setRespiratoryRate] = useState<number | ''>(20);
  const [temperature, setTemperature] = useState<number | ''>(36.8);
  const [spO2, setSpO2] = useState<number | ''>(98);
  const [weightKg, setWeightKg] = useState<number | ''>(60);
  const [oxygenTherapy, setOxygenTherapy] = useState('Room Air');

  // GCS State
  const [gcsEye, setGcsEye] = useState<number>(4);
  const [gcsVerbal, setGcsVerbal] = useState<number>(5);
  const [gcsMotor, setGcsMotor] = useState<number>(6);
  const [calculatedGcs, setCalculatedGcs] = useState<GlasgowComaScale>(calculateGcs(4, 5, 6));

  useEffect(() => {
    setCalculatedGcs(calculateGcs(gcsEye, gcsVerbal, gcsMotor));
  }, [gcsEye, gcsVerbal, gcsMotor]);

  // Physical Exam
  const [motorWeakness, setMotorWeakness] = useState('ປົກກະຕິ (No weakness)');
  const [pupilLeft, setPupilLeft] = useState('3mm RTL');
  const [pupilRight, setPupilRight] = useState('3mm RTL');
  const [lungExam, setLungExam] = useState('Clear, no adventitious sound');
  const [heartExam, setHeartExam] = useState('Normal S1 S2, regular, no murmur');
  const [abdomenExam, setAbdomenExam] = useState('Soft, non-tender');
  const [otherFindings, setOtherFindings] = useState('');

  // --- Step 5: Management, Transfer & Logistics ---
  const [initialTreatment, setInitialTreatment] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [targetCoordinator, setTargetCoordinator] = useState('ແພດຍາດສຸກເສີນ');
  const [transportVehicle, setTransportVehicle] = useState<string>(TRANSPORT_VEHICLES[0]);
  const [referringDoctor, setReferringDoctor] = useState('');
  const [referringDoctorPhone, setReferringDoctorPhone] = useState(matchedHosp?.phone || '');
  const [ambulanceCode, setAmbulanceCode] = useState(matchedHosp?.ambulancePlate1 || 'ກກ 1122 ຈຳປາສັກ');
  const [etaMinutes, setEtaMinutes] = useState<number | ''>(35);
  const [notes, setNotes] = useState('');

  const steps = [
    { num: 1, title: 'ຂໍ້ມູນຄົນເຈັບ & ຕົ້ນທາງ', subtitle: 'Demographics' },
    { num: 2, title: 'ປະຫວັດ & ການບົ່ງມະຕິ', subtitle: 'Clinical History' },
    { num: 3, title: 'ຜົນກວດ Labs & Imaging', subtitle: 'Investigations' },
    { num: 4, title: 'ສັນຍານຊີບ & GCS Scale', subtitle: 'Vitals & GCS' },
    { num: 5, title: 'ການປິ່ນປົວ & ການນຳສົ່ງ', subtitle: 'Logistics' },
  ];

  const handleNextStep = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!patientName.trim()) {
        setErrorMsg('ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນຄົນເຈັບ');
        return;
      }
      if (!age || Number(age) < 0) {
        setErrorMsg('ກະລຸນາປ້ອນອາຍຸຄົນເຈັບ');
        return;
      }
    } else if (currentStep === 2) {
      if (!provisionalDiagnosis.trim()) {
        setErrorMsg('ກະລຸນາປ້ອນການບົ່ງມະຕິພະຍາດຂັ້ນຕົ້ນ (Provisional Diagnosis)');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນຄົນເຈັບ (ຂັ້ນຕອນທີ 1)');
      setCurrentStep(1);
      return;
    }

    if (!provisionalDiagnosis.trim()) {
      setErrorMsg('ກະລຸນາປ້ອນການບົ່ງມະຕິພະຍາດຂັ້ນຕົ້ນ (ຂັ້ນຕອນທີ 2)');
      setCurrentStep(2);
      return;
    }

    if (!transferReason.trim()) {
      setErrorMsg('ກະລຸນາປ້ອນເຫດຜົນໃນການສົ່ງຕົວ (ຂັ້ນຕອນທີ 5)');
      setCurrentStep(5);
      return;
    }

    if (!referringDoctor.trim()) {
      setErrorMsg('ກະລຸນາປ້ອນຊື່ທ່ານໝໍຜູ້ສົ່ງ (ຂັ້ນຕອນທີ 5)');
      setCurrentStep(5);
      return;
    }

    const payload: Omit<ReferralRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      patientName: patientName.trim(),
      age: Number(age) || 0,
      gender,
      occupation: occupation.trim() || undefined,
      village: village.trim() || 'ບໍ່ລະບຸ',
      district,
      province,
      insuranceType,
      idCardOrHN: idCardOrHN.trim() || `HN-${Math.floor(Math.random() * 89999 + 10000)}`,
      phone: phone.trim(),
      admissionDate,
      transferTime,
      originPhone: originPhone.trim(),
      triageLevel,
      status: 'pending',
      originHospital,
      originHospitalId: currentUser.hospitalId || matchedHosp?.id,
      destinationHospital,
      receivingDepartment,

      provisionalDiagnosis: provisionalDiagnosis.trim(),
      presentIllness: presentIllness.trim() || 'ອາການສຸກເສີນ',
      pastMedicalHistory: pastMedicalHistory.trim() || 'ບໍ່ມີ',
      currentMedications: currentMedications.trim() || 'ບໍ່ມີ',
      allergies: allergies.trim() || 'ປະຕິເສດ',
      chiefComplaint: chiefComplaint.trim() || presentIllness.trim() || provisionalDiagnosis.trim(),

      labs: {
        wbc: wbc.trim() || undefined,
        hct: hct.trim() || undefined,
        hb: hb.trim() || undefined,
        plt: plt.trim() || undefined,
        glucose: glucose.trim() || undefined,
        creatinine: creatinine.trim() || undefined,
        urea: urea.trim() || undefined,
        k: k.trim() || undefined,
        na: na.trim() || undefined,
        dengueNs1: dengueNs1.trim() || undefined,
        otherLabs: otherLabs.trim() || undefined,
      },

      imaging: {
        cxr: cxr.trim() || undefined,
        ultrasound: ultrasound.trim() || undefined,
        ctScan: ctScan.trim() || undefined,
      },

      vitalSigns: {
        bpSystolic: Number(bpSystolic) || 120,
        bpDiastolic: Number(bpDiastolic) || 80,
        pulseRate: Number(pulseRate) || 80,
        respiratoryRate: Number(respiratoryRate) || 20,
        temperature: Number(temperature) || 36.8,
        spO2: Number(spO2) || 98,
        gcs: calculatedGcs,
        oxygenTherapy: oxygenTherapy.trim(),
        recordedAt: new Date().toISOString(),
      },

      physicalExam: {
        referringUnit,
        weightKg: weightKg ? Number(weightKg) : undefined,
        motorWeakness: motorWeakness.trim(),
        pupilLeft: pupilLeft.trim(),
        pupilRight: pupilRight.trim(),
        lungExam: lungExam.trim(),
        heartExam: heartExam.trim(),
        abdomenExam: abdomenExam.trim(),
        otherFindings: otherFindings.trim(),
      },

      initialTreatment: initialTreatment.trim() || 'ໃຫ້ການປິ່ນປົວເບື້ອງຕົ້ນຕາມອາການ',
      transferReason: transferReason.trim(),
      targetCoordinator: targetCoordinator.trim(),
      transportVehicle,
      referringDoctor: referringDoctor.trim(),
      referringDoctorPhone: referringDoctorPhone.trim() || originPhone,
      ambulanceCode: ambulanceCode.trim(),
      etaMinutes: etaMinutes ? Number(etaMinutes) : undefined,
      notes: notes.trim(),
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setErrorMsg(err?.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/15 max-w-4xl mx-auto overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="p-5 border-b border-emerald-900/10 flex items-center justify-between bg-emerald-50/40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-emerald-950 hover:bg-emerald-100/60 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-emerald-950">
              ໃບສົ່ງຕໍ່ຄົນເຈັບສຸກເສີນ (Clinical Referral Intake)
            </h2>
            <p className="text-xs text-emerald-800/80">
              {originHospital} ➔ ໂຮງໝໍແຂວງຈຳປາສັກ
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-emerald-950"
        >
          ຍົກເລີກ
        </button>
      </div>

      {/* Step Progress Tracker */}
      <div className="border-b border-emerald-900/10 bg-white px-4 py-3 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {steps.map((st) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-2 text-left py-1.5 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-700 font-bold'
                    : isCompleted
                    ? 'text-slate-700 font-semibold hover:bg-emerald-50/40'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <div className="flex flex-col text-xs">
                  <span className="leading-tight">{st.title}</span>
                  <span className="text-[10px] opacity-70">{st.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================= STEP 1 ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Triage Level Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                ລະດັບຄວາມຮີບດ່ວນ Triage *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTriageLevel('emergency')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    triageLevel === 'emergency'
                      ? 'border-2 border-rose-600 bg-rose-50/90 font-bold'
                      : 'border-slate-200 hover:bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    <span>ສຸກເສີນວິກິດ (Red Level 1)</span>
                  </div>
                  <p className="text-[11px] text-rose-700 mt-0.5">ຄຸກຄາມຊີວິດ ຕ້ອງການການກູ້ຊີບດ່ວນທັນທີ</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTriageLevel('urgent')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    triageLevel === 'urgent'
                      ? 'border-2 border-amber-600 bg-amber-50/90 font-bold'
                      : 'border-slate-200 hover:bg-amber-50/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>ຮີບດ່ວນ (Yellow Level 2)</span>
                  </div>
                  <p className="text-[11px] text-amber-700 mt-0.5">ອາການຮຸນແຮງ ຕ້ອງປິ່ນປົວພາຍໃນ 30-60 ນາທີ</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTriageLevel('routine')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    triageLevel === 'routine'
                      ? 'border-2 border-emerald-600 bg-emerald-50/90 font-bold'
                      : 'border-slate-200 hover:bg-emerald-50/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>ທົ່ວໄປ (Green Level 3)</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">ອາການຄົງທີ່ ສົ່ງຕໍ່ເພື່ອກວດວິເຄາະພິເສດ</p>
                </button>
              </div>
            </div>

            {/* Demographics inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">ຊື່ ແລະ ນາມສະກຸນຄົນເຈັບ *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ເພດ *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                >
                  <option value="male">ຊາຍ (Male)</option>
                  <option value="female">ຍິງ (Female)</option>
                  <option value="other">ອື່ນໆ (Other)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ອາຍຸ (ປີ) *</label>
                <input
                  type="number"
                  min="0"
                  max="125"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ເລກບັດປະຈຳຕົວ / HN</label>
                <input
                  type="text"
                  value={idCardOrHN}
                  onChange={(e) => setIdCardOrHN(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ອາຊີບ (Occupation)</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ບ້ານຢູ່ປັດຈຸບັນ</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ແຂວງ * (ເລືອກ ຫຼື ພິມເອງ)</label>
                <input
                  type="text"
                  required
                  list="form-province-list"
                  value={province}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProvince(val);
                    const dists = SOUTHERN_DISTRICTS_BY_PROVINCE[val];
                    if (dists && dists.length > 0 && !dists.includes(district)) {
                      setDistrict(dists[0]);
                    }
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                />
                <datalist id="form-province-list">
                  {SOUTHERN_PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ເມືອງ * (4 ແຂວງພາກໃຕ້)</label>
                <input
                  type="text"
                  required
                  list="form-district-list"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                />
                <datalist id="form-district-list">
                  {(SOUTHERN_DISTRICTS_BY_PROVINCE[province] || ALL_SOUTHERN_DISTRICTS).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ເບີໂທຕິດຕໍ່ຄົນເຈັບ / ຍາດພີ່ນ້ອງ</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">
                  ປະເພດປະກັນສຸຂະພາບ / ກອງທຶນປະກັນສັງຄົມ
                </label>
                <select
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
                >
                  {INSURANCE_TYPES.map(ins => (
                    <option key={ins} value={ins}>{ins}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Origin & Routing */}
            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-900/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-emerald-950 mb-1">ໂຮງໝໍຕົ້ນທາງ (Origin Hospital) *</label>
                <input
                  type="text"
                  value={originHospital}
                  onChange={(e) => setOriginHospital(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-950 mb-1">ພະແນກປາຍທາງ ໂຮງໝໍແຂວງຈຳປາສັກ *</label>
                <select
                  value={receivingDepartment}
                  onChange={(e) => setReceivingDepartment(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none focus:ring-0"
                >
                  {RECEIVING_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ວັນທີສົ່ງຕົວ *</label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ເວລາສົ່ງຕົວ (ຊົ່ວໂມງ:ນາທີ) *</label>
                <input
                  type="text"
                  value={transferTime}
                  onChange={(e) => setTransferTime(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div>
              <label className="block font-bold text-emerald-950 mb-1 text-sm flex items-center justify-between">
                <span>ການບົ່ງມະຕິພະຍາດຫຼັກ (Provisional / Principal Diagnosis) *</span>
                <span className="text-[11px] font-mono font-normal text-emerald-800">
                  ຄົ້ນຫາຕາມລະຫັດ ICD-10 ຫຼື ຊື່ພະຍາດ
                </span>
              </label>
              <Icd10Combobox
                required
                value={provisionalDiagnosis}
                onChange={setProvisionalDiagnosis}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ອາການຕົ້ນຕໍທີ່ມານຳ (Chief Complaint)
              </label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ອາການປະຈຸບັນ (Present Illness)
              </label>
              <textarea
                rows={3}
                value={presentIllness}
                onChange={(e) => setPresentIllness(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ປະຫວັດເຈັບເປັນຜ່ານມາ (Past Medical History)
                </label>
                <textarea
                  rows={2}
                  value={pastMedicalHistory}
                  onChange={(e) => setPastMedicalHistory(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ຢາທີ່ກິນປະຈຳ (Current Medications)
                </label>
                <textarea
                  rows={2}
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ປະຫວັດການແພ້ຢາ / ອາຫານ (Drug Allergies)
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none focus:ring-0"
              />
            </div>

          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in text-xs">
            
            {/* Blood Tests */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-emerald-900/10">
                <FlaskConical className="w-4 h-4 text-emerald-800" />
                <h4 className="font-bold text-emerald-950 text-sm">
                  ຜົນກວດເລືອດ (Laboratory Investigations)
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 font-mono shadow-none">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">WBC (/uL)</label>
                  <input
                    type="text"
                    value={wbc}
                    onChange={(e) => setWbc(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">HCT (%)</label>
                  <input
                    type="text"
                    value={hct}
                    onChange={(e) => setHct(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">HB (g/dL)</label>
                  <input
                    type="text"
                    value={hb}
                    onChange={(e) => setHb(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">PLT (/uL)</label>
                  <input
                    type="text"
                    value={plt}
                    onChange={(e) => setPlt(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Glucose (mg/dL)</label>
                  <input
                    type="text"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Creatinine (mg/dL)</label>
                  <input
                    type="text"
                    value={creatinine}
                    onChange={(e) => setCreatinine(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Urea / BUN (mg/dL)</label>
                  <input
                    type="text"
                    value={urea}
                    onChange={(e) => setUrea(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">K+ / Na+ (mEq/L)</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={k}
                      onChange={(e) => setK(e.target.value)}
                      className="w-1/2 p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                    />
                    <input
                      type="text"
                      value={na}
                      onChange={(e) => setNa(e.target.value)}
                      className="w-1/2 p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">Dengue NS1 / IgM-IgG (ຜົນກວດໄຂ້ເລືອດອອກ)</label>
                  <input
                    type="text"
                    value={dengueNs1}
                    onChange={(e) => setDengueNs1(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-sans shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">ຜົນກວດເລືອດອື່ນໆ (Other Labs: Troponin-T, Malaria, ABG)</label>
                  <input
                    type="text"
                    value={otherLabs}
                    onChange={(e) => setOtherLabs(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-sans shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0 focus:shadow-none"
                  />
                </div>

              </div>
            </div>

            {/* Imaging */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-emerald-900/10">
                <FileCheck2 className="w-4 h-4 text-emerald-800" />
                <h4 className="font-bold text-emerald-950 text-sm">
                  ຜົນກວດວິນິດໄສດ້ວຍຮູບພາບ (Imaging Investigations)
                </h4>
              </div>

              <div className="space-y-4">
                
                {/* Datalist for all Imaging comboboxes */}
                <datalist id="imaging-english-options">
                  {IMAGING_ENGLISH_PRESETS.map(item => (
                    <option key={item} value={item} />
                  ))}
                </datalist>

                {/* Chest X-Ray (CXR) */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 text-xs">
                      1. Chest X-Ray (CXR) · ຜົນກວດເອັກສະເຣເອິກ
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">English Dropdown Text</span>
                  </div>
                  <input
                    type="text"
                    list="imaging-english-options"
                    value={cxr}
                    onChange={(e) => setCxr(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setCxr('None')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        cxr === 'None'
                          ? 'bg-slate-700 text-white border-slate-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      None (ບໍ່ໄດ້ເຮັດ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCxr('Normal')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        cxr === 'Normal'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      Normal (ປົກກະຕິ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCxr('Pneumonia / Lung Consolidation')}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Pneumonia
                    </button>
                    <button
                      type="button"
                      onClick={() => setCxr('Pleural Effusion / Hemothorax')}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Pleural Effusion
                    </button>
                    <button
                      type="button"
                      onClick={() => setCxr('Pneumothorax')}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Pneumothorax
                    </button>
                  </div>
                </div>

                {/* Ultrasound */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 text-xs">
                      2. Ultrasound (FAST / Abdomen / Echo) · ເອໂກ້-ອານຕຣາຊາວ
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">English Dropdown Text</span>
                  </div>
                  <input
                    type="text"
                    list="imaging-english-options"
                    value={ultrasound}
                    onChange={(e) => setUltrasound(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setUltrasound('None')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        ultrasound === 'None'
                          ? 'bg-slate-700 text-white border-slate-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      None (ບໍ່ໄດ້ເຮັດ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUltrasound('Normal')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        ultrasound === 'Normal'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      Normal (ປົກກະຕິ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUltrasound('Intra-abdominal Free Fluid / Hemoperitoneum (FAST Positive)')}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      FAST Positive / Free Fluid
                    </button>
                    <button
                      type="button"
                      onClick={() => setUltrasound('Pleural Effusion / Hemothorax')}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Pleural Fluid
                    </button>
                  </div>
                </div>

                {/* CT-Scan */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 text-xs">
                      3. CT-Scan (Brain / Abdomen / Chest) · ຄອມພິວເຕີສະແກນ
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">English Dropdown Text</span>
                  </div>
                  <input
                    type="text"
                    list="imaging-english-options"
                    value={ctScan}
                    onChange={(e) => setCtScan(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setCtScan('None')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        ctScan === 'None'
                          ? 'bg-slate-700 text-white border-slate-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      None (ບໍ່ໄດ້ເຮັດ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCtScan('Normal')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        ctScan === 'Normal'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      Normal (ປົກກະຕິ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCtScan('Intracranial Hemorrhage / Acute TBI')}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Intracranial Hemorrhage (TBI)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCtScan('Pending CT Brain at Champasak Hospital')}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Pending CT Brain at ER
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in text-xs">
            
            {/* Vital Signs Grid */}
            <div className="space-y-2">
              <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-800" />
                <span>ສັນຍານຊີບຂັ້ນຕົ້ນ (Vital Signs)</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-none">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1 uppercase text-[11px]">BP (mmHg) - Sys / Dia</label>
                  <div className="flex items-center gap-1 font-mono">
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-16 p-2 border border-slate-300 rounded-lg text-center bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-16 p-2 border border-slate-300 rounded-lg text-center bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1 uppercase text-[11px]">PR ຊີບພະຈອນ (bpm)</label>
                  <input
                    type="number"
                    value={pulseRate}
                    onChange={(e) => setPulseRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center bg-white font-mono shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1 uppercase text-[11px]">RR ອັດຕາຫາຍໃຈ (/min)</label>
                  <input
                    type="number"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center bg-white font-mono shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1 uppercase text-[11px]">Temp ອຸນຫະພູມ (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center bg-white font-mono shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1 uppercase text-[11px]">SpO2 ອົກຊີແຊນ (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={spO2}
                    onChange={(e) => setSpO2(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center bg-white font-mono font-bold shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1 uppercase text-[11px]">ນ້ຳໜັກ (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center bg-white font-mono shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1 uppercase text-[11px]">Oxygen Therapy (ການໃຫ້ອົກຊີແຊນ)</label>
                  <input
                    type="text"
                    value={oxygenTherapy}
                    onChange={(e) => setOxygenTherapy(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Glasgow Coma Scale (GCS) System */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-900/15 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/10">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">
                      Glasgow Coma Scale (GCS) - ປະເມີນລະດັບສະຕິ
                    </h4>
                    <p className="text-[11px] text-emerald-800/80">
                      ລະບົບຄຳນວນຄະແນນລວມອັດຕະໂນມັດ (E + V + M)
                    </p>
                  </div>
                </div>

                {/* GCS Total Result Badge */}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 font-mono">
                  <span className="text-xs font-bold text-emerald-950">
                    GCS: <strong className="text-base text-emerald-800">{calculatedGcs.total}</strong>/15
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    calculatedGcs.severity === 'severe'
                      ? 'bg-rose-100 text-rose-800'
                      : calculatedGcs.severity === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {calculatedGcs.severity === 'severe' ? 'Severe (ວິກິດ/ໝົດສະຕິ)' :
                     calculatedGcs.severity === 'moderate' ? 'Moderate (ປານກາງ)' : 'Mild (ເລັກນ້ອຍ)'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Eye Opening */}
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">
                    Eye Opening (E: 1-4)
                  </label>
                  <select
                    value={gcsEye}
                    onChange={(e) => setGcsEye(Number(e.target.value))}
                    className="w-full p-2 border border-emerald-200 rounded-lg bg-white text-xs font-medium text-emerald-950"
                  >
                    {GCS_EYE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Verbal Response */}
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">
                    Verbal Response (V: 1-5)
                  </label>
                  <select
                    value={gcsVerbal}
                    onChange={(e) => setGcsVerbal(Number(e.target.value))}
                    className="w-full p-2 border border-emerald-200 rounded-lg bg-white text-xs font-medium text-emerald-950"
                  >
                    {GCS_VERBAL_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Motor Response */}
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">
                    Motor Response (M: 1-6)
                  </label>
                  <select
                    value={gcsMotor}
                    onChange={(e) => setGcsMotor(Number(e.target.value))}
                    className="w-full p-2 border border-emerald-200 rounded-lg bg-white text-xs font-medium text-emerald-950"
                  >
                    {GCS_MOTOR_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Other Physical Exam with Dropdown Lists */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-900/10">
                <h4 className="font-bold text-emerald-950 text-sm">
                  ຜົນກວດຮ່າງກາຍອື່ນໆ (Physical Examination)
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">Dropdown List & Typing</span>
              </div>

              {/* Datalists for Physical Exam */}
              <datalist id="exam-motor-list">
                {PHYSICAL_EXAM_PRESETS.motorWeakness.map(item => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <datalist id="exam-pupil-list">
                {PHYSICAL_EXAM_PRESETS.pupils.map(item => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <datalist id="exam-lung-list">
                {PHYSICAL_EXAM_PRESETS.lungExam.map(item => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <datalist id="exam-heart-list">
                {PHYSICAL_EXAM_PRESETS.heartExam.map(item => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <datalist id="exam-abdomen-list">
                {PHYSICAL_EXAM_PRESETS.abdomenExam.map(item => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <datalist id="exam-other-list">
                {PHYSICAL_EXAM_PRESETS.otherExam.map(item => (
                  <option key={item} value={item} />
                ))}
              </datalist>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Motor Weakness */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Motor Weakness (ກ້າມຊີ້ນອ່ອນແຮງ / ອຳມະພຶກ)
                  </label>
                  <input
                    type="text"
                    list="exam-motor-list"
                    value={motorWeakness}
                    onChange={(e) => setMotorWeakness(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setMotorWeakness('ປົກກະຕິ (No weakness)')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      ປົກກະຕິ
                    </button>
                    <button
                      type="button"
                      onClick={() => setMotorWeakness('Left hemiparesis (ອຳມະພຶກເຄິ່ງຊິກຊ້າຍ)')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      ເຄິ່ງຊິກຊ້າຍ
                    </button>
                    <button
                      type="button"
                      onClick={() => setMotorWeakness('Right hemiparesis (ອຳມະພຶກເຄິ່ງຊິກຂວາ)')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      ເຄິ່ງຊິກຂວາ
                    </button>
                  </div>
                </div>

                {/* Pupils */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pupils ຮູມ່ານຕາ (ຊ້າຍ Left - ຂວາ Right)
                  </label>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <input
                        type="text"
                        list="exam-pupil-list"
                        value={pupilLeft}
                        onChange={(e) => setPupilLeft(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        list="exam-pupil-list"
                        value={pupilRight}
                        onChange={(e) => setPupilRight(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-mono text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => { setPupilLeft('3mm RTL'); setPupilRight('3mm RTL'); }}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      3mm RTL (ທັງ 2 ຂ້າງ)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPupilLeft('3mm RTL'); setPupilRight('4.5mm sluggish (Anisocoria)'); }}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Anisocoria (ບໍ່ເທົ່າກັນ)
                    </button>
                  </div>
                </div>

                {/* Lung Exam */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Lung Exam (ຟັງສຽງປອດ)
                  </label>
                  <input
                    type="text"
                    list="exam-lung-list"
                    value={lungExam}
                    onChange={(e) => setLungExam(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setLungExam('Clear bilaterally')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setLungExam('Wheezing bilaterally')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Wheezing
                    </button>
                    <button
                      type="button"
                      onClick={() => setLungExam('Crepitation / Crackles')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Crepitation
                    </button>
                  </div>
                </div>

                {/* Heart Exam */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Heart Exam (ຟັງສຽງຫົວໃຈ)
                  </label>
                  <input
                    type="text"
                    list="exam-heart-list"
                    value={heartExam}
                    onChange={(e) => setHeartExam(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setHeartExam('Normal S1 S2, regular, no murmur')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Normal S1 S2
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeartExam('Tachycardia (HR > 100 bpm)')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Tachycardia
                    </button>
                  </div>
                </div>

                {/* Abdomen Exam */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Abdomen Exam (ກວດທ້ອງ)
                  </label>
                  <input
                    type="text"
                    list="exam-abdomen-list"
                    value={abdomenExam}
                    onChange={(e) => setAbdomenExam(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setAbdomenExam('Soft, non-tender, not distended')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Soft, non-tender
                    </button>
                    <button
                      type="button"
                      onClick={() => setAbdomenExam('Guarding / Abdominal rigidity')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Guarding
                    </button>
                    <button
                      type="button"
                      onClick={() => setAbdomenExam('Rebound tenderness (+)')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Rebound (+)
                    </button>
                  </div>
                </div>

                {/* Other Findings */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Other Findings (ອາການກວດຮ່າງກາຍອື່ນໆ)
                  </label>
                  <input
                    type="text"
                    list="exam-other-list"
                    value={otherFindings}
                    onChange={(e) => setOtherFindings(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setOtherFindings('Normal / No acute distress')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtherFindings('Battle sign / Otorrhea (+)')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Battle sign (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtherFindings('Pale conjunctiva / Anemia')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
                    >
                      Pale
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 5 ================= */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div>
              <label className="block font-bold text-emerald-950 mb-1">
                ການປິ່ນປົວເບື້ອງຕົ້ນທີ່ໄດ້ໃຫ້ໄປແລ້ວ (Initial Treatments Given) *
              </label>
              <textarea
                rows={3}
                required
                value={initialTreatment}
                onChange={(e) => setInitialTreatment(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-950 mb-1">
                ເຫດຜົນໃນການສົ່ງຕົວ (Reason for Referral) *
              </label>
              <input
                type="text"
                required
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-0 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ຜູ້ຮັບປາຍທາງ ER ໂຮງໝໍແຂວງຈຳປາສັກ (Target Coordinator) *
                </label>
                <input
                  type="text"
                  required
                  value={targetCoordinator}
                  onChange={(e) => setTargetCoordinator(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ພາຫະນະນຳສົ່ງ (Transport Vehicle) *
                </label>
                <select
                  value={transportVehicle}
                  onChange={(e) => setTransportVehicle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none focus:ring-0"
                >
                  {TRANSPORT_VEHICLES.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ຊື່ທ່ານໝໍຜູ້ສົ່ງ (Attending / Referring Doctor) *
                </label>
                <input
                  type="text"
                  required
                  value={referringDoctor}
                  onChange={(e) => setReferringDoctor(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ເບີໂທຕິດຕໍ່ທ່ານໝໍຜູ້ສົ່ງ *
                </label>
                <input
                  type="tel"
                  required
                  value={referringDoctorPhone}
                  onChange={(e) => setReferringDoctorPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono bg-white focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  ທະບຽນລົດສຸກເສີນທີ່ມາສົ່ງ (Ambulance Vehicle) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setAmbulanceCode(matchedHosp?.ambulancePlate1 || 'ກກ 1122 ຈຳປາສັກ')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      ambulanceCode === (matchedHosp?.ambulancePlate1 || 'ກກ 1122 ຈຳປາສັກ')
                        ? 'border-2 border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                      <span>ຄັນທີ 1 ເລກທະບຽນ</span>
                      {ambulanceCode === (matchedHosp?.ambulancePlate1 || 'ກກ 1122 ຈຳປາສັກ') && (
                        <span className="text-emerald-700 font-bold">✓ ເລືອກແລ້ວ</span>
                      )}
                    </div>
                    <div className="font-mono text-sm font-bold text-emerald-900">
                      {matchedHosp?.ambulancePlate1 || 'ກກ 1122 ຈຳປາສັກ'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmbulanceCode(matchedHosp?.ambulancePlate2 || 'ກຂ 3344 ຈຳປາສັກ')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      ambulanceCode === (matchedHosp?.ambulancePlate2 || 'ກຂ 3344 ຈຳປາສັກ')
                        ? 'border-2 border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                      <span>ຄັນທີ 2 ເລກທະບຽນ</span>
                      {ambulanceCode === (matchedHosp?.ambulancePlate2 || 'ກຂ 3344 ຈຳປາສັກ') && (
                        <span className="text-emerald-700 font-bold">✓ ເລືອກແລ້ວ</span>
                      )}
                    </div>
                    <div className="font-mono text-sm font-bold text-emerald-900">
                      {matchedHosp?.ambulancePlate2 || 'ກຂ 3344 ຈຳປາສັກ'}
                    </div>
                  </button>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={ambulanceCode}
                    onChange={(e) => setAmbulanceCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                  />
                  <p className="text-[11px] text-slate-500">
                    ເລືອກລະຫວ່າງຄັນທີ 1 ຫຼື ຄັນທີ 2 ຂອງ {originHospital} ຫຼື ແກ້ໄຂເລກທະບຽນໄດ້ຕາມຕົວຈິງ
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ເວລາຄາດຄະເນເດີນທາງຮອດ (ETA ໃນນາທີ)
                </label>
                <input
                  type="number"
                  value={etaMinutes}
                  onChange={(e) => setEtaMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  ໝາຍເຫດເພີ່ມເຕີມສຳລັບທີມ ER ໂຮງໝໍແຂວງ
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white shadow-none appearance-none focus:border-emerald-600 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-emerald-900/10">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-950 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ຍ້ອນກັບ (Back)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors"
              >
                <span>ຂັ້ນຕອນຕໍ່ໄປ (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ ແລະ ສົ່ງໃບສົ່ງຕົວ (Submit Referral)'}</span>
              </button>
            )}
          </div>
        </div>

      </form>

    </div>
  );
};
