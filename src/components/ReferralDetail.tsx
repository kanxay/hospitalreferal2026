import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Phone, 
  Building2, 
  User, 
  Stethoscope, 
  Plus, 
  Trash2, 
  FlaskConical, 
  BrainCircuit 
} from 'lucide-react';
import { AuthSession, ReferralRecord, ReferralStatus, TransitVitalLog } from '../types/referral';

interface ReferralDetailProps {
  referral: ReferralRecord;
  onBack: () => void;
  onPrint: () => void;
  onUpdateStatus: (id: string, newStatus: ReferralStatus) => void;
  onAddTransitVital: (id: string, vital: TransitVitalLog) => void;
  onDelete: (id: string) => void;
  currentUser: AuthSession;
}

export const ReferralDetail: React.FC<ReferralDetailProps> = ({
  referral,
  onBack,
  onPrint,
  onUpdateStatus,
  onAddTransitVital,
  onDelete,
  currentUser,
}) => {
  const [showAddVitalModal, setShowAddVitalModal] = useState(false);
  const [transitBpSys, setTransitBpSys] = useState(referral.vitalSigns.bpSystolic);
  const [transitBpDia, setTransitBpDia] = useState(referral.vitalSigns.bpDiastolic);
  const [transitPulse, setTransitPulse] = useState(referral.vitalSigns.pulseRate);
  const [transitSpO2, setTransitSpO2] = useState(referral.vitalSigns.spO2);
  const [transitGcs, setTransitGcs] = useState(referral.vitalSigns.gcs?.total ?? 15);
  const [transitNote, setTransitNote] = useState('');

  const statusOptions: { key: ReferralStatus; label: string; desc: string }[] = [
    { key: 'pending', label: '1. ລໍຖ້າຮັບ (Pending)', desc: 'ສົ່ງຂໍ້ມູນມາແລ້ວ' },
    { key: 'accepted', label: '2. ຮັບເລື່ອງ (Accepted)', desc: 'ແພດ ER ຢືນຢັນ' },
    { key: 'in_transit', label: '3. ກຳລັງເດີນທາງ (En Route)', desc: 'ລົດສຸກເສີນກຳລັງມາ' },
    { key: 'arrived', label: '4. ຮອດ ER ແລ້ວ (Arrived ER)', desc: 'ເຂົ້າຫ້ອງກວດສຸກເສີນ' },
    { key: 'admitted', label: '5. ຮັບນອນ/ICU (Admitted)', desc: 'ເຂົ້າ Ward ຫຼື ICU ແລ້ວ' },
    { key: 'refer_back', label: '6. ສົ່ງຕໍ່ກັບ (Refer Back)', desc: 'ສົ່ງກັບໂຮງໝໍເມືອງຕົ້ນທາງ' },
  ];

  const handleSaveTransitVital = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: TransitVitalLog = {
      id: `tv-${Date.now()}`,
      time: new Date().toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit', hour12: false }),
      bpSystolic: Number(transitBpSys),
      bpDiastolic: Number(transitBpDia),
      pulseRate: Number(transitPulse),
      spO2: Number(transitSpO2),
      gcsTotal: Number(transitGcs),
      note: transitNote.trim() || undefined,
    };
    onAddTransitVital(referral.id, newLog);
    setShowAddVitalModal(false);
    setTransitNote('');
  };

  const gcs = referral.vitalSigns.gcs || {
    eye: 4,
    verbal: 5,
    motor: 6,
    total: 15,
    severity: 'mild',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-950 bg-slate-100 hover:bg-emerald-50 px-3 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນໜ້າລາຍການ</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>ພິມໃບສົ່ງຕໍ່ A4 / Export PDF</span>
          </button>
          
          {currentUser.role === 'admin' && (
            <button
              onClick={() => {
                if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລາຍການສົ່ງຕໍ່ນີ້?')) {
                  onDelete(referral.id);
                }
              }}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="ລຶບລາຍການນີ້"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Patient Header Dossier */}
      <div className="bg-white rounded-2xl border border-emerald-900/10 p-6 shadow-2xs space-y-4">
        
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-emerald-900/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                {referral.id}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-xs font-bold text-slate-700">
                HN: {referral.idCardOrHN}
              </span>
              <span className="text-slate-300">·</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                referral.triageLevel === 'emergency' ? 'bg-rose-100 text-rose-800' :
                referral.triageLevel === 'urgent' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {referral.triageLevel === 'emergency' ? 'ສຸກເສີນວິກິດ (Red)' :
                 referral.triageLevel === 'urgent' ? 'ຮີບດ່ວນ (Yellow)' : 'ທົ່ວໄປ (Green)'}
              </span>
              {referral.insuranceType && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {referral.insuranceType}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {referral.patientName}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              ເພດ: {referral.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'} · ອາຍຸ: {referral.age} ປີ {referral.occupation ? `· ອາຊີບ: ${referral.occupation}` : ''} · ບ້ານ: {referral.village}, {referral.district}
            </p>
          </div>

          {/* Quick status selector */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs text-emerald-950 font-bold">ປ່ຽນສະຖານະເຄສ:</span>
            <select
              value={referral.status}
              onChange={(e) => onUpdateStatus(referral.id, e.target.value as ReferralStatus)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-emerald-900/20 bg-white text-emerald-950 shadow-2xs cursor-pointer focus:ring-2 focus:ring-emerald-600"
            >
              {statusOptions.map(opt => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
              <option value="cancelled">ຍົກເລີກ (Cancelled)</option>
            </select>
          </div>
        </div>

        {/* Status Lifecycle Progress Bar */}
        <div className="pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {statusOptions.map((step) => {
              const isCurrent = referral.status === step.key;

              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => onUpdateStatus(referral.id, step.key)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:bg-emerald-50/20 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-700' : 'text-slate-300'}`} />
                    <span className={`text-[11px] font-bold ${isCurrent ? 'text-emerald-950' : 'text-slate-700'}`}>
                      {step.label.split(' ')[1]}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {step.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid: Left Clinical & Vitals, Right Route & Transport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Clinical Dossier */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Current Vital Signs Card & GCS Breakdown */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-emerald-950">
                  ສັນຍານຊີບ & ລະດັບສະຕິ GCS (Baseline Vitals)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {referral.vitalSigns.recordedAt ? new Date(referral.vitalSigns.recordedAt).toLocaleTimeString('lo-LA') : ''}
              </span>
            </div>

            {/* Vitals Numbers */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono tabular-nums">
              <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-900/10">
                <span className="text-[10px] uppercase text-slate-600 font-bold block">BP</span>
                <span className="text-sm font-bold text-slate-900">
                  {referral.vitalSigns.bpSystolic}/{referral.vitalSigns.bpDiastolic}
                </span>
                <span className="text-[9px] text-slate-600 block">mmHg</span>
              </div>

              <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-900/10">
                <span className="text-[10px] uppercase text-slate-600 font-bold block">PR</span>
                <span className="text-sm font-bold text-slate-900">
                  {referral.vitalSigns.pulseRate}
                </span>
                <span className="text-[9px] text-slate-600 block">bpm</span>
              </div>

              <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-900/10">
                <span className="text-[10px] uppercase text-slate-600 font-bold block">RR</span>
                <span className="text-sm font-bold text-slate-900">
                  {referral.vitalSigns.respiratoryRate}
                </span>
                <span className="text-[9px] text-slate-600 block">/min</span>
              </div>

              <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-900/10">
                <span className="text-[10px] uppercase text-slate-600 font-bold block">Temp</span>
                <span className="text-sm font-bold text-slate-900">
                  {referral.vitalSigns.temperature}°C
                </span>
                <span className="text-[9px] text-slate-600 block">ອຸນຫະພູມ</span>
              </div>

              <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-900/10">
                <span className="text-[10px] uppercase text-slate-600 font-bold block">SpO2</span>
                <span className={`text-sm font-bold ${referral.vitalSigns.spO2 < 95 ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                  {referral.vitalSigns.spO2}%
                </span>
                <span className="text-[9px] text-slate-600 block">O2 Sat</span>
              </div>

              <div className="bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300">
                <span className="text-[10px] uppercase text-emerald-900 font-bold block">GCS Score</span>
                <span className={`text-base font-black ${gcs.total <= 8 ? 'text-rose-600' : 'text-emerald-950'}`}>
                  {gcs.total}/15
                </span>
                <span className="text-[9px] text-emerald-800 font-semibold block">{gcs.severity}</span>
              </div>
            </div>

            {/* GCS Subscores breakdown */}
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-900/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <BrainCircuit className="w-4 h-4 text-emerald-800" />
                <span>GCS Breakdown:</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span>Eye (E): <strong>{gcs.eye}</strong>/4</span>
                <span>·</span>
                <span>Verbal (V): <strong>{gcs.verbal}</strong>/5</span>
                <span>·</span>
                <span>Motor (M): <strong>{gcs.motor}</strong>/6</span>
              </div>
            </div>

            {referral.vitalSigns.oxygenTherapy && (
              <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Oxygen Device:</span> {referral.vitalSigns.oxygenTherapy}
              </div>
            )}
          </div>

          {/* Clinical Findings & Treatment Given */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/10">
              <Stethoscope className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-emerald-950">
                ການບົ່ງມະຕິ ແລະ ອາການ (Clinical Findings)
              </h3>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                ການບົ່ງມະຕິພະຍາດຫຼັກ (Provisional Diagnosis)
              </span>
              <p className="text-sm font-bold text-emerald-950 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                {referral.provisionalDiagnosis}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                ອາການປະຈຸບັນ & ອາການຕົ້ນຕໍ (Chief Complaint & Present Illness)
              </span>
              <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {referral.presentIllness || referral.chiefComplaint}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 block mb-1">ປະຫວັດເຈັບເປັນຜ່ານມາ:</span>
                <p className="text-slate-600">{referral.pastMedicalHistory || 'ບໍ່ມີ'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 block mb-1">ຢາທີ່ກິນປະຈຳ & ແພ້ຢາ:</span>
                <p className="text-slate-600">
                  ຢາ: {referral.currentMedications || 'ບໍ່ມີ'} · ແພ້: {referral.allergies || 'ປະຕິເສດ'}
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                ການປິ່ນປົວເບື້ອງຕົ້ນທີ່ໄດ້ໃຫ້ໄປແລ້ວ (Initial Treatments Given)
              </span>
              <p className="text-xs text-slate-800 whitespace-pre-line bg-amber-50/40 p-3 rounded-xl border border-amber-200/60 leading-relaxed font-mono">
                {referral.initialTreatment}
              </p>
            </div>
          </div>

          {/* Laboratory & Imaging Results */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/10">
              <FlaskConical className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-emerald-950">
                ຜົນກວດ Labs & Imaging
              </h3>
            </div>

            {/* Labs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">WBC</span>
                <span className="font-bold text-slate-800">{referral.labs?.wbc || '-'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">HCT / HB</span>
                <span className="font-bold text-slate-800">
                  {referral.labs?.hct || '-'} / {referral.labs?.hb || '-'}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">PLT</span>
                <span className="font-bold text-slate-800">{referral.labs?.plt || '-'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Blood Glucose</span>
                <span className="font-bold text-slate-800">{referral.labs?.glucose || '-'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Creatinine / Urea</span>
                <span className="font-bold text-slate-800">
                  {referral.labs?.creatinine || '-'} / {referral.labs?.urea || '-'}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Electrolytes K/Na</span>
                <span className="font-bold text-slate-800">
                  K: {referral.labs?.k || '-'} | Na: {referral.labs?.na || '-'}
                </span>
              </div>
              <div className="col-span-2 p-2 bg-slate-50 rounded-lg border border-slate-100 font-sans">
                <span className="text-[10px] text-slate-500 block">Dengue NS1 / Other</span>
                <span className="font-bold text-slate-800">
                  {referral.labs?.dengueNs1 || referral.labs?.otherLabs || '-'}
                </span>
              </div>
            </div>

            {/* Imaging results */}
            {(referral.imaging?.cxr || referral.imaging?.ultrasound || referral.imaging?.ctScan) && (
              <div className="space-y-1.5 pt-2 text-xs">
                {referral.imaging?.cxr && (
                  <p><strong className="text-slate-800">CXR:</strong> {referral.imaging.cxr}</p>
                )}
                {referral.imaging?.ultrasound && (
                  <p><strong className="text-slate-800">Ultrasound:</strong> {referral.imaging.ultrasound}</p>
                )}
                {referral.imaging?.ctScan && (
                  <p><strong className="text-slate-800">CT-Scan:</strong> {referral.imaging.ctScan}</p>
                )}
              </div>
            )}
          </div>

          {/* Physical Examination Details */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 shadow-2xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-emerald-950 pb-1 border-b border-emerald-900/10">
              ຜົນກວດຮ່າງກາຍ (Physical Examination Findings)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <p><strong>Motor Weakness:</strong> {referral.physicalExam?.motorWeakness || 'ປົກກະຕິ'}</p>
              <p><strong>Pupils:</strong> L: {referral.physicalExam?.pupilLeft || '3mm RTL'} | R: {referral.physicalExam?.pupilRight || '3mm RTL'}</p>
              <p><strong>Lung Exam:</strong> {referral.physicalExam?.lungExam || 'Clear'}</p>
              <p><strong>Heart Exam:</strong> {referral.physicalExam?.heartExam || 'Normal S1 S2'}</p>
              <p className="sm:col-span-2"><strong>Abdomen:</strong> {referral.physicalExam?.abdomenExam || 'Soft'}</p>
              {referral.physicalExam?.otherFindings && (
                <p className="sm:col-span-2"><strong>ອາການເພີ່ມເຕີມ:</strong> {referral.physicalExam.otherFindings}</p>
              )}
            </div>
          </div>

          {/* Transit Vital Signs Timeline */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/10">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-emerald-950">
                  ບັນທຶກສັນຍານຊີບລະຫວ່າງທາງ (En-Route Transit Monitoring)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVitalModal(true)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-900 hover:text-white bg-emerald-50 hover:bg-emerald-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ ບັນທຶກສັນຍານຊີບໃໝ່</span>
              </button>
            </div>

            {(!referral.transitVitalsHistory || referral.transitVitalsHistory.length === 0) ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                ຍັງບໍ່ມີບັນທຶກລະຫວ່າງທາງ (ທີມລົດສຸກເສີນກົດ "+ ບັນທຶກສັນຍານຊີບໃໝ່" ເພື່ອບັນທຶກ)
              </p>
            ) : (
              <div className="space-y-2">
                {referral.transitVitalsHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-900/10 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-700">{item.time}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono tabular-nums text-slate-800">
                      <span>BP: <strong>{item.bpSystolic}/{item.bpDiastolic}</strong></span>
                      <span>·</span>
                      <span>PR: <strong>{item.pulseRate}</strong></span>
                      <span>·</span>
                      <span>SpO2: <strong className={item.spO2 < 95 ? 'text-rose-600' : ''}>{item.spO2}%</strong></span>
                      <span>·</span>
                      <span>GCS: <strong>{item.gcsTotal}</strong></span>
                    </div>

                    {item.note && (
                      <div className="w-full text-slate-500 text-[11px] pt-1 border-t border-slate-200/50">
                        {item.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Route & Transport */}
        <div className="space-y-6">
          
          {/* Transfer Route Card */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/10">
              <Building2 className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-emerald-950">
                ເສັ້ນທາງການສົ່ງຕໍ່ (Routing)
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-600 block mb-0.5">ໂຮງໝໍຕົ້ນທາງ:</span>
                <span className="font-bold text-slate-900 text-sm block">
                  {referral.originHospital}
                </span>
                <span className="text-slate-500">ເມືອງ {referral.district}</span>
              </div>

              <div className="py-2 border-y border-emerald-900/10">
                <span className="text-slate-600 block mb-0.5">ໂຮງໝໍປາຍທາງ:</span>
                <span className="font-bold text-emerald-950 text-sm block">
                  {referral.destinationHospital}
                </span>
                <span className="text-emerald-700 font-semibold">{referral.receivingDepartment}</span>
              </div>

              <div>
                <span className="text-slate-600 block mb-0.5">ເຫດຜົນໃນການສົ່ງຕໍ່:</span>
                <span className="text-slate-800 leading-relaxed block font-medium">
                  {referral.transferReason}
                </span>
              </div>
            </div>
          </div>

          {/* Personnel, Vehicle & Contact */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/10">
              <User className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-emerald-950">
                ຜູ້ປະສານງານ & ພາຫະນະ
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-600 block">ທ່ານໝໍຜູ້ສົ່ງ (Referring MD):</span>
                <span className="font-semibold text-slate-900 block">{referral.referringDoctor}</span>
                {referral.referringDoctorPhone && (
                  <span className="text-emerald-800 font-mono flex items-center gap-1 mt-0.5 font-bold">
                    <Phone className="w-3 h-3" />
                    {referral.referringDoctorPhone}
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-600 block">ຜູ້ຮັບປາຍທາງ ER ໂຮງໝໍແຂວງ:</span>
                <span className="font-semibold text-slate-900 block">
                  {referral.targetCoordinator || referral.receivingDoctor || 'ແພດຍາດສຸກເສີນ'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-600 block">ພາຫະນະນຳສົ່ງ (Vehicle):</span>
                <span className="font-semibold text-emerald-900 block">
                  {referral.transportVehicle || 'ລົດສຸກເສີນ EMS'}
                </span>
                {referral.ambulanceCode && (
                  <span className="font-mono text-emerald-950 font-semibold block mt-0.5">
                    ທະບຽນລົດ: {referral.ambulanceCode}
                  </span>
                )}
                {referral.etaMinutes && (
                  <span className="text-slate-500 font-medium block">
                    ETA: ~{referral.etaMinutes} ນາທີ
                  </span>
                )}
              </div>

              {referral.notes && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-600 block">ໝາຍເຫດທີມ ER:</span>
                  <span className="text-slate-700 block bg-emerald-50/60 p-2 rounded-lg mt-1 border border-emerald-100">
                    {referral.notes}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Transit Vital Modal */}
      {showAddVitalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-emerald-950">
              ບັນທຶກສັນຍານຊີບລະຫວ່າງທາງ (En-Route Vitals Check)
            </h3>
            
            <form onSubmit={handleSaveTransitVital} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">BP (mmHg)</label>
                  <div className="flex items-center gap-1 font-mono">
                    <input
                      type="number"
                      value={transitBpSys}
                      onChange={(e) => setTransitBpSys(Number(e.target.value))}
                      className="w-16 p-2 border rounded-lg text-center"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={transitBpDia}
                      onChange={(e) => setTransitBpDia(Number(e.target.value))}
                      className="w-16 p-2 border rounded-lg text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">PR (bpm)</label>
                  <input
                    type="number"
                    value={transitPulse}
                    onChange={(e) => setTransitPulse(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg text-center font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={transitSpO2}
                    onChange={(e) => setTransitSpO2(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg text-center font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">GCS (3-15)</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    value={transitGcs}
                    onChange={(e) => setTransitGcs(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg text-center font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">ໝາຍເຫດອາການ</label>
                <input
                  type="text"
                  value={transitNote}
                  onChange={(e) => setTransitNote(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVitalModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900"
                >
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
