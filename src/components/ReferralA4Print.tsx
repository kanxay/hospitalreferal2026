import React, { useRef, useState } from 'react';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReferralRecord } from '../types/referral';

interface ReferralA4PrintProps {
  referral: ReferralRecord;
  onBack: () => void;
}

export const ReferralA4Print: React.FC<ReferralA4PrintProps> = ({
  referral,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`EMSCPS_Referral_${referral.id}_${referral.patientName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('ເກີດຂໍ້ຜິດພາດໃນການສ້າງ PDF ກະລຸນາລອງໃຊ້ປຸ່ມ "ພິມເອກະສານ" ແທນ');
    } finally {
      setIsExporting(false);
    }
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

  const provinceName = stripEnglishTag(referral.province) || 'ຈຳປາສັກ';
  const provinceDisplay = provinceName.startsWith('ແຂວງ') ? provinceName : `ແຂວງ${provinceName}`;
  const cleanDistrict = stripEnglishTag(referral.district);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      
      {/* Control bar (Hidden during print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນ</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{isExporting ? 'ກຳລັງສ້າງ PDF...' : 'ດາວໂຫຼດ PDF (A4)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>ພິມເອກະສານ (Print A4)</span>
          </button>
        </div>
      </div>

      {/* Official Printable A4 Document Container */}
      <div className="bg-slate-100 p-2 sm:p-6 flex justify-center rounded-2xl overflow-x-auto">
        <div
          ref={printRef}
          className="a4-page bg-white text-slate-900 shadow-xl border border-slate-300 p-8 sm:p-12 w-full max-w-[210mm] min-h-[297mm] text-[12px] leading-normal font-sans"
        >
          
          {/* Official Lao National Header (ກະຊວງສາທາລະນະສຸກ ຕັດອອກ) */}
          <div className="pb-3 border-b-2 border-slate-800">
            <div className="text-center space-y-0.5">
              <h3 className="font-bold text-sm tracking-wide">
                ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ
              </h3>
              <p className="text-xs font-semibold">
                ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນະຖາວອນ
              </p>
              <div className="w-28 h-0.5 bg-slate-800 mx-auto my-1" />
            </div>
            
            {/* Header Left (ພະແນກ & ໂຮງໝໍ) vs Header Right (REF, HN, Date, Triage) */}
            <div className="flex justify-between items-start text-xs pt-2 text-left">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800">
                  ພະແນກສາທາລະນະສຸກ: {provinceDisplay}
                </p>
                <p className="font-bold text-emerald-950 text-sm">
                  ໂຮງໝໍເມືອງ: {referral.originHospital}
                </p>
                {referral.originPhone && (
                  <p className="text-[11px] text-slate-500 font-mono">
                    ໂທ: {referral.originPhone}
                  </p>
                )}
              </div>
              
              <div className="text-right text-xs space-y-0.5">
                <p className="font-mono font-bold text-slate-900 text-sm">
                  {referral.id} - HN: {referral.idCardOrHN}
                </p>
                <p className="text-slate-600">
                  ວັນທີ: {referral.admissionDate || referral.createdAt.split('T')[0]} | ເວລາ: {referral.transferTime || '12:00'}
                </p>
                <p className="font-bold text-rose-700 uppercase">
                  Triage: {referral.triageLevel.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Slip Title: ໃບສົ່ງຕໍ່ຄົນເຈັບ (MEDICAL REFERRAL SLIP ຕັດອອກ) */}
          <div className="text-center my-4">
            <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
              ໃບສົ່ງຕໍ່ຄົນເຈັບ
            </h1>
            <p className="text-[11px] font-semibold text-slate-600">
              ລະບົບສົ່ງຕໍ່ສຸກເສີນ EMSCPS · ໂຮງໝໍແຂວງຈຳປາສັກ
            </p>
          </div>

          {/* Section 1: Patient Information (PATIENT DEMOGRAPHICS ຕັດອອກ) */}
          <div className="space-y-2 mb-4">
            <div className="bg-slate-100 px-3 py-1 font-bold text-[11px] uppercase tracking-wide border border-slate-300">
              I. ຂໍ້ມູນປະຈຳຕົວຄົນເຈັບ
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs">
              <div className="sm:col-span-2">
                <span className="font-bold">ຊື່ ແລະ ນາມສະກຸນ: </span>
                <span className="font-semibold text-slate-900">{referral.patientName}</span>
              </div>
              <div>
                <span className="font-bold">ເພດ: </span>
                <span>{referral.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}</span>
              </div>
              <div>
                <span className="font-bold">ອາຍຸ: </span>
                <span className="font-mono font-bold">{referral.age}</span> ປີ
              </div>

              <div>
                <span className="font-bold">ອາຊີບ: </span>
                <span>{referral.occupation || '-'}</span>
              </div>
              <div>
                <span className="font-bold">ບ້ານ: </span>
                <span>{referral.village}</span>
              </div>
              <div>
                <span className="font-bold">ເມືອງ: </span>
                <span>{cleanDistrict}</span>
              </div>
              <div>
                <span className="font-bold">ເບີໂທ: </span>
                <span className="font-mono">{referral.phone || '-'}</span>
              </div>

              <div className="sm:col-span-4">
                <span className="font-bold">ປະກັນສຸຂະພາບ/ກອງທຶນ: </span>
                <span>{referral.insuranceType || 'ກອງທຶນປະກັນສຸຂະພາບແຫ່ງຊາດ'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Summary & Diagnosis */}
          <div className="space-y-2 mb-4">
            <div className="bg-slate-100 px-3 py-1 font-bold text-[11px] uppercase tracking-wide border border-slate-300">
              II. ຂໍ້ມູນອາການ ແລະ ການບົ່ງມະຕິ
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 bg-slate-50 border border-slate-300 rounded">
                <span className="font-bold text-slate-900">ການບົ່ງມະຕິພະຍາດຫຼັກ: </span>
                <span className="font-bold text-emerald-950 text-sm">{referral.provisionalDiagnosis}</span>
              </div>

              <div>
                <span className="font-bold text-slate-900">ອາການປະຈຸບັນ & ອາການຕົ້ນຕໍ: </span>
                <span className="text-slate-800">{referral.presentIllness || referral.chiefComplaint}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">ປະຫວັດເຈັບເປັນຜ່ານມາ: </span>
                  <span className="text-slate-700">{referral.pastMedicalHistory || 'ບໍ່ມີ'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">ຢາທີ່ກິນປະຈຳ & ແພ້ຢາ: </span>
                  <span className="text-slate-700">{referral.currentMedications || 'ບໍ່ມີ'} (ແພ້ຢາ: {referral.allergies || 'ປະຕິເສດ'})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Vitals & Glasgow Coma Scale (GCS) */}
          <div className="space-y-2 mb-4">
            <div className="bg-slate-100 px-3 py-1 font-bold text-[11px] uppercase tracking-wide border border-slate-300 flex justify-between">
              <span>III. ສັນຍານຊີບ & ລະດັບສະຕິ GCS</span>
              <span className="font-mono">Unit: {referral.physicalExam?.referringUnit || 'ER'}</span>
            </div>

            <table className="w-full text-center border-collapse border border-slate-300 text-xs font-mono tabular-nums">
              <thead>
                <tr className="bg-slate-50 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 p-1">BP (mmHg)</th>
                  <th className="border border-slate-300 p-1">PR (bpm)</th>
                  <th className="border border-slate-300 p-1">RR (/min)</th>
                  <th className="border border-slate-300 p-1">Temp (°C)</th>
                  <th className="border border-slate-300 p-1">SpO2 (%)</th>
                  <th className="border border-slate-300 p-1 bg-emerald-50 text-emerald-950">GCS Total</th>
                  <th className="border border-slate-300 p-1">GCS (E, V, M)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-1.5 font-bold">
                    {referral.vitalSigns.bpSystolic}/{referral.vitalSigns.bpDiastolic}
                  </td>
                  <td className="border border-slate-300 p-1.5">
                    {referral.vitalSigns.pulseRate}
                  </td>
                  <td className="border border-slate-300 p-1.5">
                    {referral.vitalSigns.respiratoryRate}
                  </td>
                  <td className="border border-slate-300 p-1.5">
                    {referral.vitalSigns.temperature}°
                  </td>
                  <td className="border border-slate-300 p-1.5 font-bold">
                    {referral.vitalSigns.spO2}%
                  </td>
                  <td className="border border-slate-300 p-1.5 font-black bg-emerald-50 text-emerald-950">
                    {gcs.total}/15 ({gcs.severity})
                  </td>
                  <td className="border border-slate-300 p-1.5 text-[11px]">
                    E{gcs.eye} V{gcs.verbal} M{gcs.motor}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Physical Exam Notes */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <p><span className="font-bold">Motor Weakness:</span> {referral.physicalExam?.motorWeakness || 'ປົກກະຕິ'}</p>
              <p><span className="font-bold">Pupils:</span> L: {referral.physicalExam?.pupilLeft || '3mm RTL'} | R: {referral.physicalExam?.pupilRight || '3mm RTL'}</p>
              <p><span className="font-bold">Lung:</span> {referral.physicalExam?.lungExam || 'Clear'}</p>
              <p><span className="font-bold">Heart:</span> {referral.physicalExam?.heartExam || 'Normal S1 S2'}</p>
              {referral.vitalSigns.oxygenTherapy && (
                <p className="col-span-2 text-slate-600 italic">
                  * Oxygen Device: {referral.vitalSigns.oxygenTherapy}
                </p>
              )}
            </div>
          </div>

          {/* Section 4: Laboratory & Imaging */}
          <div className="space-y-2 mb-4">
            <div className="bg-slate-100 px-3 py-1 font-bold text-[11px] uppercase tracking-wide border border-slate-300">
              IV. ຜົນກວດ LABS & IMAGING
            </div>

            <table className="w-full text-center border-collapse border border-slate-300 text-xs font-mono tabular-nums">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 text-[11px]">
                  <th className="border border-slate-300 p-1">WBC</th>
                  <th className="border border-slate-300 p-1">HCT/HB</th>
                  <th className="border border-slate-300 p-1">PLT</th>
                  <th className="border border-slate-300 p-1">Glucose</th>
                  <th className="border border-slate-300 p-1">Cr / Urea</th>
                  <th className="border border-slate-300 p-1">Electrolytes</th>
                  <th className="border border-slate-300 p-1 font-sans">Dengue/Other</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-1">{referral.labs?.wbc || '-'}</td>
                  <td className="border border-slate-300 p-1">{referral.labs?.hct || '-'} / {referral.labs?.hb || '-'}</td>
                  <td className="border border-slate-300 p-1">{referral.labs?.plt || '-'}</td>
                  <td className="border border-slate-300 p-1">{referral.labs?.glucose || '-'}</td>
                  <td className="border border-slate-300 p-1">{referral.labs?.creatinine || '-'} / {referral.labs?.urea || '-'}</td>
                  <td className="border border-slate-300 p-1">K:{referral.labs?.k || '-'} Na:{referral.labs?.na || '-'}</td>
                  <td className="border border-slate-300 p-1 font-sans">{referral.labs?.dengueNs1 || referral.labs?.otherLabs || '-'}</td>
                </tr>
              </tbody>
            </table>

            {(referral.imaging?.cxr || referral.imaging?.ultrasound || referral.imaging?.ctScan) && (
              <div className="text-xs pt-1 space-y-0.5">
                {referral.imaging?.cxr && <p><span className="font-bold">CXR: </span>{referral.imaging.cxr}</p>}
                {referral.imaging?.ultrasound && <p><span className="font-bold">Ultrasound: </span>{referral.imaging.ultrasound}</p>}
                {referral.imaging?.ctScan && <p><span className="font-bold">CT-Scan: </span>{referral.imaging.ctScan}</p>}
              </div>
            )}
          </div>

          {/* Section 5: Treatments & Reason */}
          <div className="space-y-2 mb-6">
            <div className="bg-slate-100 px-3 py-1 font-bold text-[11px] uppercase tracking-wide border border-slate-300">
              V. ການປິ່ນປົວເບື້ອງຕົ້ນ & ເສັ້ນທາງສົ່ງຕໍ່
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <span className="font-bold block text-slate-900">ການປິ່ນປົວເບື້ອງຕົ້ນທີ່ໄດ້ໃຫ້ໄປແລ້ວ:</span>
                <p className="pl-2 font-mono text-slate-800 whitespace-pre-line">{referral.initialTreatment}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                <div>
                  <p><span className="font-bold">ເຫດຜົນໃນການສົ່ງຕໍ່: </span>{referral.transferReason}</p>
                  <p>
                    <span className="font-bold">ພາຫະນະ: </span>
                    {referral.transportVehicle || 'ລົດສຸກເສີນ EMS'}
                    {referral.ambulanceCode && (
                      <span className="font-semibold text-emerald-900"> ({referral.ambulanceCode})</span>
                    )}
                  </p>
                </div>
                <div>
                  <p><span className="font-bold">ພະແນກປາຍທາງ: </span>{referral.receivingDepartment} (ໂຮງໝໍແຂວງຈຳປາສັກ)</p>
                  <p><span className="font-bold">ຜູ້ຮັບປາຍທາງ ER: </span>{referral.targetCoordinator || 'ແພດເວນ ER'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature blocks */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-300 text-xs text-center">
            {/* Origin Doctor */}
            <div className="space-y-12">
              <div>
                <p className="font-bold">ທ່ານໝໍຜູ້ສົ່ງ</p>
                <p className="text-slate-500">{referral.originHospital}</p>
              </div>
              <div>
                <div className="w-44 border-b border-dotted border-slate-600 mx-auto mb-1" />
                <p className="font-bold text-slate-900">{referral.referringDoctor}</p>
                <p className="text-slate-500 font-mono text-[11px]">ໂທ: {referral.referringDoctorPhone || '-'}</p>
              </div>
            </div>

            {/* Receiving Doctor */}
            <div className="space-y-12">
              <div>
                <p className="font-bold">ແພດ/ພະຍາບານ ຜູ້ຮັບຄົນເຈັບ</p>
                <p className="text-slate-500">ໂຮງໝໍແຂວງຈຳປາສັກ</p>
              </div>
              <div>
                <div className="w-44 border-b border-dotted border-slate-600 mx-auto mb-1" />
                <p className="font-bold text-slate-900">{referral.receivingDoctor || '(..................................................)'}</p>
                <p className="text-slate-500 text-[11px]">ລາຍເຊັນ ແລະ ກາປະທັບ</p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-2 border-t border-slate-200 text-[9px] text-slate-400 text-center font-mono">
            EMSCPS Champasak Provincial Hospital EMS Referral Network · Generated electronically
          </div>

        </div>
      </div>

    </div>
  );
};
