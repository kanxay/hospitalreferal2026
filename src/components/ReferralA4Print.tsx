import React, { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Download, Info } from 'lucide-react';
import { ReferralRecord } from '../types/referral';
import { logoService, DEFAULT_EMBLEM_PATH } from '../services/logoService';

interface ReferralA4PrintProps {
  referral: ReferralRecord;
  onBack: () => void;
}

// Built-in high-resolution vector SVG of the National Emblem of Laos (1991–2025)
// Featuring Pha That Luang pagoda, ripe rice stalks, industrial cogwheel, dam reservoir, and red ribbons
export const LaoNationalEmblem: React.FC<{ className?: string }> = ({ className = "w-13 h-13" }) => (
  <svg
    viewBox="0 0 120 120"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Emblem of Laos"
  >
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="ribbonRed" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
    </defs>

    {/* Background Circle */}
    <circle cx="60" cy="60" r="54" fill="url(#skyGrad)" stroke="#D97706" strokeWidth="1" />

    {/* Sunrays radiating from That Luang */}
    <g stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 3" opacity="0.75">
      <line x1="60" y1="20" x2="60" y2="48" />
      <line x1="36" y1="30" x2="52" y2="50" />
      <line x1="84" y1="30" x2="68" y2="50" />
      <line x1="25" y1="46" x2="50" y2="54" />
      <line x1="95" y1="46" x2="70" y2="54" />
    </g>

    {/* Hydroelectric Dam & Water reservoir at base of stupa */}
    <path d="M 35 74 L 85 74 L 80 84 L 40 84 Z" fill="#64748B" />
    <path d="M 42 74 L 46 84 M 50 74 L 52 84 M 58 74 L 58 84 M 66 74 L 64 84 M 74 74 L 70 84" stroke="#94A3B8" strokeWidth="1" />
    <path d="M 28 82 Q 60 88 92 82 L 90 88 Q 60 94 30 88 Z" fill="#0284C7" />

    {/* Asphalt road leading to That Luang */}
    <polygon points="56,66 64,66 70,82 50,82" fill="#334155" />
    <line x1="60" y1="68" x2="60" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="2 1" />

    {/* Green fields / vegetation */}
    <path d="M 30 76 Q 45 70 56 68 L 48 82 Z" fill="#15803D" />
    <path d="M 90 76 Q 75 70 64 68 L 72 82 Z" fill="#15803D" />

    {/* Pha That Luang Pagoda / Stupa */}
    <g fill="url(#goldGrad)" stroke="#B45309" strokeWidth="0.6">
      {/* Base terrace */}
      <rect x="50" y="60" width="20" height="5" rx="1" />
      <rect x="52" y="55" width="16" height="5" rx="0.5" />
      {/* Tiered middle section */}
      <polygon points="53,55 67,55 65,46 55,46" />
      {/* Corner stupas */}
      <polygon points="52,55 54,55 53,50" />
      <polygon points="66,55 68,55 67,50" />
      {/* Main Golden Spire */}
      <polygon points="55,46 65,46 62,32 58,32" />
      {/* Finial / Spire tip */}
      <polygon points="58,32 62,32 60.5,21 59.5,21" />
      <circle cx="60" cy="20" r="1.5" />
    </g>

    {/* Left Rice Stalk Arch */}
    <path d="M 22 84 C 12 55 24 24 54 14" fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
    <g fill="#F59E0B" stroke="#B45309" strokeWidth="0.4">
      <ellipse cx="21" cy="74" rx="3.2" ry="1.8" transform="rotate(-30 21 74)" />
      <ellipse cx="17" cy="63" rx="3.2" ry="1.8" transform="rotate(-15 17 63)" />
      <ellipse cx="16" cy="51" rx="3.2" ry="1.8" transform="rotate(5 16 51)" />
      <ellipse cx="19" cy="39" rx="3.2" ry="1.8" transform="rotate(25 19 39)" />
      <ellipse cx="26" cy="28" rx="3.2" ry="1.8" transform="rotate(45 26 28)" />
      <ellipse cx="37" cy="20" rx="3.2" ry="1.8" transform="rotate(65 37 20)" />
      <ellipse cx="49" cy="15" rx="3.2" ry="1.8" transform="rotate(80 49 15)" />
    </g>

    {/* Right Rice Stalk Arch */}
    <path d="M 98 84 C 108 55 96 24 66 14" fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
    <g fill="#F59E0B" stroke="#B45309" strokeWidth="0.4">
      <ellipse cx="99" cy="74" rx="3.2" ry="1.8" transform="rotate(30 99 74)" />
      <ellipse cx="103" cy="63" rx="3.2" ry="1.8" transform="rotate(15 103 63)" />
      <ellipse cx="104" cy="51" rx="3.2" ry="1.8" transform="rotate(-5 104 51)" />
      <ellipse cx="101" cy="39" rx="3.2" ry="1.8" transform="rotate(-25 101 39)" />
      <ellipse cx="94" cy="28" rx="3.2" ry="1.8" transform="rotate(-45 94 28)" />
      <ellipse cx="83" cy="20" rx="3.2" ry="1.8" transform="rotate(-65 83 20)" />
      <ellipse cx="71" cy="15" rx="3.2" ry="1.8" transform="rotate(-80 71 15)" />
    </g>

    {/* Industrial Cogwheel (Gear) */}
    <g fill="#0F172A" stroke="#334155" strokeWidth="0.5">
      <circle cx="60" cy="88" r="16" />
      <rect x="57" y="70" width="6" height="5" />
      <rect x="57" y="101" width="6" height="5" />
      <rect x="42" y="85" width="5" height="6" />
      <rect x="73" y="85" width="5" height="6" />
      <rect x="47" y="74" width="5" height="5" transform="rotate(45 49.5 76.5)" />
      <rect x="68" y="95" width="5" height="5" transform="rotate(45 70.5 97.5)" />
      <rect x="68" y="74" width="5" height="5" transform="rotate(-45 70.5 76.5)" />
      <rect x="47" y="95" width="5" height="5" transform="rotate(-45 49.5 97.5)" />
      <circle cx="60" cy="88" r="8" fill="#F8FAFC" />
    </g>

    {/* Red Ribbon Wrapping Wings and Center Banner */}
    <path d="M 16 88 L 36 82 L 40 92 L 18 97 Z" fill="url(#ribbonRed)" stroke="#7F1D1D" strokeWidth="0.8" />
    <path d="M 16 88 L 12 94 L 18 97 Z" fill="#991B1B" />
    <path d="M 104 88 L 84 82 L 80 92 L 102 97 Z" fill="url(#ribbonRed)" stroke="#7F1D1D" strokeWidth="0.8" />
    <path d="M 104 88 L 108 94 L 102 97 Z" fill="#991B1B" />
    <path d="M 28 92 Q 60 96 92 92 L 94 104 Q 60 109 26 104 Z" fill="url(#ribbonRed)" stroke="#7F1D1D" strokeWidth="0.8" />

    {/* Gold trim on ribbon */}
    <path d="M 28 92 Q 60 96 92 92" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
    <path d="M 26 104 Q 60 109 94 104" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
    <line x1="38" y1="98" x2="82" y2="98" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 1.5" />
    <line x1="20" y1="90" x2="34" y2="86" stroke="#FEF08A" strokeWidth="1" strokeDasharray="2 1" />
    <line x1="86" y1="86" x2="100" y2="90" stroke="#FEF08A" strokeWidth="1" strokeDasharray="2 1" />
  </svg>
);

export const ReferralA4Print: React.FC<ReferralA4PrintProps> = ({
  referral,
  onBack,
}) => {
  const [showPdfHint, setShowPdfHint] = useState(false);
  const [emblemSrc, setEmblemSrc] = useState<string>(logoService.getEmblemLogo());
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    const unsubscribe = logoService.subscribe((newLogo) => {
      setEmblemSrc(newLogo);
      setImageLoadError(false);
    });
    return unsubscribe;
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setShowPdfHint(true);
    // Short delay so the user sees the hint before the print dialog overlays
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const gcs = referral.vitalSigns.gcs || {
    eye: 4,
    verbal: 5,
    motor: 6,
    total: 15,
    severity: 'mild',
  };

  // Helper to remove any English transliteration tags like (Paksong)
  const stripEnglishTag = (text?: string) => {
    if (!text) return '';
    return text.replace(/\s*\([^)]*[a-zA-Z]+[^)]*\)/g, '').trim();
  };

  // Helper to remove abbreviation (NHI/ປສຊ) as requested: "(NHI/ປສຊ) ຕັດຕົວຫຍໍ້ອອກ"
  const cleanInsurance = (text?: string) => {
    if (!text) return 'ກອງທຶນປະກັນສຸຂະພາບແຫ່ງຊາດ';
    return text
      .replace(/\s*\([^)]*(?:NHI|ປສຊ)[^)]*\)/gi, '')
      .replace(/\b(?:NHI|ປສຊ)\b/gi, '')
      .trim() || 'ກອງທຶນປະກັນສຸຂະພາບແຫ່ງຊາດ';
  };

  const provinceName = stripEnglishTag(referral.province) || 'ຈຳປາສັກ';
  const provinceDisplay = provinceName.startsWith('ແຂວງ') ? provinceName : `ແຂວງ${provinceName}`;
  const cleanDistrict = stripEnglishTag(referral.district);

  // Triage badge color
  const triageColorClass = {
    resuscitation: 'text-rose-700 bg-rose-50 border-rose-300',
    emergency: 'text-red-700 bg-red-50 border-red-300',
    urgent: 'text-amber-700 bg-amber-50 border-amber-300',
    'semi-urgent': 'text-emerald-700 bg-emerald-50 border-emerald-300',
    'non-urgent': 'text-slate-700 bg-slate-50 border-slate-300',
  }[referral.triageLevel.toLowerCase()] || 'text-red-700 bg-red-50 border-red-300';

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16 print:pb-0 print:space-y-0 font-sans">
      
      {/* Control bar (Hidden during print) */}
      <div className="no-print bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນ</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
            title="ບັນທຶກເປັນໄຟລ໌ PDF A4 1 ໜ້າ"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>ດາວໂຫຼດ PDF (A4)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>ພິມເອກະສານ (Print A4)</span>
          </button>
        </div>
      </div>

      {/* PDF download hint banner for first-time click */}
      {showPdfHint && (
        <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>ຄຳແນະນຳດາວໂຫຼດ PDF:</strong> ໃນປ່ອງພິມ (Print Dialog), ໃຫ້ເລືອກ Destination/ເຄື່ອງພິມ ເປັນ <strong>"Save as PDF"</strong> (ບັນທຶກເປັນ PDF) ເພື່ອຮັບໄຟລ໌ PDF A4 1 ໜ້າທີ່ຄົມຊັດສູງ.
            </span>
          </div>
          <button
            onClick={() => setShowPdfHint(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold ml-2 underline cursor-pointer"
          >
            ປິດ
          </button>
        </div>
      )}

      {/* Official Printable A4 Document Container */}
      <div className="bg-slate-100 p-2 sm:p-5 print:p-0 print:bg-white flex justify-center rounded-2xl overflow-x-auto print:overflow-visible">
        <div
          className="a4-page print-container bg-white text-slate-900 shadow-lg border border-slate-300 p-6 sm:p-8 print:p-0 print:border-none print:shadow-none w-full max-w-[210mm] text-[13px] leading-normal font-sans"
        >
          
          {/* Official Lao National Header (Centred Lao Logo & Motto) */}
          <div className="text-center space-y-0.5 mb-2.5">
            <div className="flex justify-center mb-1">
              {!imageLoadError ? (
                <img
                  src={emblemSrc}
                  alt="Lao National Emblem"
                  className="w-13 h-13 sm:w-14 sm:h-14 object-contain drop-shadow-xs"
                  onError={() => {
                    if (emblemSrc !== DEFAULT_EMBLEM_PATH) {
                      setEmblemSrc(DEFAULT_EMBLEM_PATH);
                    } else {
                      setImageLoadError(true);
                    }
                  }}
                />
              ) : (
                <LaoNationalEmblem className="w-13 h-13 sm:w-14 sm:h-14 drop-shadow-xs" />
              )}
            </div>
            <h2 className="font-bold text-[13px] tracking-wide text-slate-900">
              ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ
            </h2>
            <p className="text-[13px] font-semibold text-slate-700">
              ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ
            </p>
            <p className="text-[13px] font-mono tracking-widest text-slate-600">
              ***==***
            </p>
          </div>

          {/* Sub-Header: Left (ພະແນກ, ໂຮງໝໍ) vs Right (REF, HN, ໂທ, Triage) */}
          {/* Note: Divider line removed as explicitly requested ("ຕັດຂີດເສັ້ນອອກ") */}
          <div className="flex justify-between items-start text-[13px] pb-2 text-left">
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-800 text-[13px]">
                ພະແນກສາທາລະນະສຸກ: {provinceDisplay}
              </p>
              <p className="font-bold text-emerald-950 text-[13px]">
                ໂຮງໝໍເມືອງ: {referral.originHospital}
              </p>
            </div>
            
            <div className="text-right space-y-0.5 text-[13px]">
              <p className="font-mono font-bold text-slate-900 text-[13px]">
                {referral.id} - HN: {referral.idCardOrHN}
              </p>
              <p className="text-slate-800 text-[13px]">
                <span>ໂທ: {referral.originPhone || '031 920 114'} </span>
                <span className="font-bold text-slate-900 ml-1">Triage: </span>
                <span className={`font-bold uppercase px-1.5 py-0.5 rounded text-[12px] ${triageColorClass}`}>
                  {referral.triageLevel.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Slip Title: ໃບສົ່ງຕໍ່ຄົນເຈັບ (ຂະໜາດ 18 ໂດດເດັ່ນ) */}
          <div className="text-center my-2.5 pb-1.5 border-b border-slate-300">
            <h1 className="text-[18px] font-bold uppercase tracking-wider text-slate-900">
              ໃບສົ່ງຕໍ່ຄົນເຈັບ
            </h1>
            <p className="text-[12px] font-medium text-slate-500 mt-0.5">
              ລະບົບສົ່ງຕໍ່ສຸກເສີນ EMSCPS · ໂຮງໝໍແຂວງຈຳປາສັກ | ວັນທີ: {referral.admissionDate || referral.createdAt.split('T')[0]} {referral.transferTime ? `(${referral.transferTime})` : ''}
            </p>
          </div>

          {/* Section 1: Patient Information */}
          <div className="mb-2.5 sm:mb-3">
            <div className="bg-slate-100 px-2.5 py-1 font-bold text-[13px] uppercase tracking-wide border border-slate-300 mb-1.5">
              I. ຂໍ້ມູນປະຈຳຕົວຄົນເຈັບ
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-[13px] px-1">
              <div className="sm:col-span-2">
                <span className="font-bold text-slate-800">ຊື່ ແລະ ນາມສະກຸນ: </span>
                <span className="font-bold text-slate-950">{referral.patientName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">ເພດ: </span>
                <span>{referral.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">ອາຍຸ: </span>
                <span className="font-mono font-bold">{referral.age}</span> ປີ
              </div>

              <div>
                <span className="font-bold text-slate-800">ອາຊີບ: </span>
                <span>{referral.occupation || '-'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">ບ້ານ: </span>
                <span>{referral.village}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">ເມືອງ: </span>
                <span>{cleanDistrict}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">ເບີໂທ: </span>
                <span className="font-mono">{referral.phone || '-'}</span>
              </div>

              {/* Insurance: (NHI/ປສຊ) ຕັດຕົວຫຍໍ້ອອກ */}
              <div className="sm:col-span-4">
                <span className="font-bold text-slate-800">ປະກັນສຸຂະພາບ / ກອງທຶນ: </span>
                <span className="text-slate-900">{cleanInsurance(referral.insuranceType)}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Summary & Diagnosis (Inline Diagnosis: "II. ຂໍ້ມູນອາການ ແລະ ການບົ່ງມະຕິ: ຕໍ່ເລີຍ...") */}
          <div className="mb-2.5 sm:mb-3">
            <div className="bg-slate-100 px-2.5 py-1 font-bold text-[13px] uppercase tracking-wide border border-slate-300 mb-1.5">
              <span>II. ຂໍ້ມູນອາການ ແລະ ການບົ່ງມະຕິ: </span>
              <span className="text-emerald-950 font-black normal-case text-[13px] ml-1">
                {referral.provisionalDiagnosis}
              </span>
            </div>

            <div className="space-y-1.5 text-[13px] px-1">
              <div>
                <span className="font-bold text-slate-800">ອາການປະຈຸບັນ & ອາການຕົ້ນຕໍ: </span>
                <span className="text-slate-900">{referral.presentIllness || referral.chiefComplaint}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[13px]">
                <div>
                  <span className="font-bold text-slate-800">ປະຫວັດເຈັບເປັນຜ່ານມາ: </span>
                  <span className="text-slate-700">{referral.pastMedicalHistory || 'ບໍ່ມີ'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">ຢາທີ່ກິນປະຈຳ & ແພ້ຢາ: </span>
                  <span className="text-slate-700">{referral.currentMedications || 'ບໍ່ມີ'} (ແພ້ຢາ: {referral.allergies || 'ປະຕິເສດ'})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Vitals & Glasgow Coma Scale (GCS) */}
          <div className="mb-2.5 sm:mb-3">
            <div className="bg-slate-100 px-2.5 py-1 font-bold text-[13px] uppercase tracking-wide border border-slate-300 flex justify-between items-center mb-1.5">
              <span>III. ສັນຍານຊີບ & ລະດັບສະຕິ GCS</span>
              <span className="font-mono text-[13px] text-slate-600">Unit: {referral.physicalExam?.referringUnit || 'ER'}</span>
            </div>

            <table className="w-full text-center border-collapse border border-slate-300 text-[13px] font-mono tabular-nums">
              <thead>
                <tr className="bg-slate-50 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 py-1 px-1.5">BP (mmHg)</th>
                  <th className="border border-slate-300 py-1 px-1.5">PR (bpm)</th>
                  <th className="border border-slate-300 py-1 px-1.5">RR (/min)</th>
                  <th className="border border-slate-300 py-1 px-1.5">Temp (°C)</th>
                  <th className="border border-slate-300 py-1 px-1.5">SpO2 (%)</th>
                  <th className="border border-slate-300 py-1 px-1.5 bg-emerald-50 text-emerald-950 font-bold">GCS Total</th>
                  <th className="border border-slate-300 py-1 px-1.5">GCS (E, V, M)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 py-1 px-1.5 font-bold">
                    {referral.vitalSigns.bpSystolic}/{referral.vitalSigns.bpDiastolic}
                  </td>
                  <td className="border border-slate-300 py-1 px-1.5">
                    {referral.vitalSigns.pulseRate}
                  </td>
                  <td className="border border-slate-300 py-1 px-1.5">
                    {referral.vitalSigns.respiratoryRate}
                  </td>
                  <td className="border border-slate-300 py-1 px-1.5">
                    {referral.vitalSigns.temperature}°
                  </td>
                  <td className="border border-slate-300 py-1 px-1.5 font-bold">
                    {referral.vitalSigns.spO2}%
                  </td>
                  <td className="border border-slate-300 py-1 px-1.5 font-black bg-emerald-50 text-emerald-950">
                    {gcs.total}/15 ({gcs.severity})
                  </td>
                  <td className="border border-slate-300 py-1 px-1.5 text-[13px]">
                    E{gcs.eye} V{gcs.verbal} M{gcs.motor}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Physical Exam Summary (Spurious Oxygen Device line removed as requested) */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[13px] pt-1.5 px-1 text-slate-800">
              <p><span className="font-bold">Motor Weakness:</span> {referral.physicalExam?.motorWeakness || 'ປົກກະຕິ'}</p>
              <p><span className="font-bold">Pupils:</span> L: {referral.physicalExam?.pupilLeft || '3mm RTL'} | R: {referral.physicalExam?.pupilRight || '3mm RTL'}</p>
              <p><span className="font-bold">Lung:</span> {referral.physicalExam?.lungExam || 'Clear'}</p>
              <p><span className="font-bold">Heart:</span> {referral.physicalExam?.heartExam || 'Normal S1 S2'}</p>
            </div>
          </div>

          {/* Section 4: Laboratory & Imaging */}
          <div className="mb-2.5 sm:mb-3">
            <div className="bg-slate-100 px-2.5 py-1 font-bold text-[13px] uppercase tracking-wide border border-slate-300 mb-1.5">
              IV. ຜົນກວດ LABS & IMAGING
            </div>

            <table className="w-full text-center border-collapse border border-slate-300 text-[13px] font-mono tabular-nums">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 text-[13px]">
                  <th className="border border-slate-300 py-1 px-1.5">WBC</th>
                  <th className="border border-slate-300 py-1 px-1.5">HCT/HB</th>
                  <th className="border border-slate-300 py-1 px-1.5">PLT</th>
                  <th className="border border-slate-300 py-1 px-1.5">Glucose</th>
                  <th className="border border-slate-300 py-1 px-1.5">Cr / Urea</th>
                  <th className="border border-slate-300 py-1 px-1.5">Electrolytes</th>
                  <th className="border border-slate-300 py-1 px-1.5 font-sans">Dengue/Other</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 py-1 px-1.5">{referral.labs?.wbc || '-'}</td>
                  <td className="border border-slate-300 py-1 px-1.5">{referral.labs?.hct || '-'} / {referral.labs?.hb || '-'}</td>
                  <td className="border border-slate-300 py-1 px-1.5">{referral.labs?.plt || '-'}</td>
                  <td className="border border-slate-300 py-1 px-1.5">{referral.labs?.glucose || '-'}</td>
                  <td className="border border-slate-300 py-1 px-1.5">{referral.labs?.creatinine || '-'} / {referral.labs?.urea || '-'}</td>
                  <td className="border border-slate-300 py-1 px-1.5">K:{referral.labs?.k || '-'} Na:{referral.labs?.na || '-'}</td>
                  <td className="border border-slate-300 py-1 px-1.5 font-sans">{referral.labs?.dengueNs1 || referral.labs?.otherLabs || '-'}</td>
                </tr>
              </tbody>
            </table>

            {(referral.imaging?.cxr || referral.imaging?.ultrasound || referral.imaging?.ctScan) && (
              <div className="text-[13px] pt-1.5 px-1 flex flex-wrap gap-x-4 gap-y-0.5 text-slate-800">
                {referral.imaging?.cxr && <p><span className="font-bold">CXR: </span>{referral.imaging.cxr}</p>}
                {referral.imaging?.ultrasound && <p><span className="font-bold">Ultrasound: </span>{referral.imaging.ultrasound}</p>}
                {referral.imaging?.ctScan && <p><span className="font-bold">CT-Scan: </span>{referral.imaging.ctScan}</p>}
              </div>
            )}
          </div>

          {/* Section 5: Treatments & Reason (Inline initial treatment continuation) */}
          <div className="mb-2.5 sm:mb-3">
            <div className="bg-slate-100 px-2.5 py-1 font-bold text-[13px] uppercase tracking-wide border border-slate-300 mb-1.5">
              V. ການປິ່ນປົວເບື້ອງຕົ້ນ & ເສັ້ນທາງສົ່ງຕໍ່
            </div>

            <div className="space-y-1.5 text-[13px] px-1">
              {/* Initial treatment inline continuation: "ການປິ່ນປົວເບື້ອງຕົ້ນທີ່ໄດ້ໃຫ້ໄປແລ້ວ: ຕໍ່ເລີຍ..." */}
              <div>
                <span className="font-bold text-slate-900">ການປິ່ນປົວເບື້ອງຕົ້ນທີ່ໄດ້ໃຫ້ໄປແລ້ວ: </span>
                <span className="font-mono text-slate-800">
                  {referral.initialTreatment || 'ໃຫ້ການປະຖົມພະຍາບານເບື້ອງຕົ້ນ ແລະ ສັນຍານຊີບຄົງທີ່'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200 text-[13px]">
                <div>
                  <p><span className="font-bold text-slate-800">ເຫດຜົນໃນການສົ່ງຕໍ່: </span>{referral.transferReason}</p>
                  <p>
                    <span className="font-bold text-slate-800">ພາຫະນະ: </span>
                    {referral.transportVehicle || 'ລົດສຸກເສີນ EMS'}
                    {referral.ambulanceCode && (
                      <span className="font-semibold text-emerald-900"> ({referral.ambulanceCode})</span>
                    )}
                  </p>
                </div>
                <div>
                  <p><span className="font-bold text-slate-800">ພະແນກປາຍທາງ: </span>{referral.receivingDepartment} (ໂຮງໝໍແຂວງຈຳປາສັກ)</p>
                  <p><span className="font-bold text-slate-800">ຜູ້ຮັບປາຍທາງ ER: </span>{referral.targetCoordinator || 'ແພດຍາດສຸກເສີນ'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature section (Expanded blank space for manual signature & stamp) */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-300 text-[13px] text-center">
            {/* Left Column: ຜູ້ອຳນວຍການ */}
            <div>
              <p className="font-bold text-slate-900 text-[13px]">ຜູ້ອຳນວຍການ</p>
              {/* Clean blank space for manual signature & official seal */}
              <div className="min-h-[85px] sm:min-h-[95px]" />
            </div>

            {/* Right Column: ທ່ານຫມໍສົ່ງຄົນເຈັບ */}
            <div>
              <p className="font-bold text-slate-900 text-[13px]">ທ່ານຫມໍສົ່ງຄົນເຈັບ</p>
              {/* Clean blank space for manual signature */}
              <div className="min-h-[85px] sm:min-h-[95px]" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
