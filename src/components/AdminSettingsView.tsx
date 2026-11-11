/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Trash2, 
  FileText, 
  ArrowLeft,
  RefreshCw,
  Plus,
  ShieldCheck,
  Phone,
  Truck,
  Download
} from 'lucide-react';
import { icd10Service } from '../services/icd10Service';
import { DistrictHospital } from '../types/referral';
import { HospitalManagementModal } from './HospitalManagementModal';

interface AdminSettingsViewProps {
  hospitals: DistrictHospital[];
  onRefreshHospitals: () => void;
  onBackToReferrals: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  hospitals,
  onRefreshHospitals,
  onBackToReferrals
}) => {
  const [activeSubtab, setActiveSubtab] = useState<'hospitals' | 'diagnosis'>('diagnosis');
  
  // Hospital Modal State
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);

  // ICD-10 Stats & Upload State
  const [stats, setStats] = useState<{ count: number; lastUpdated: string | null }>({ count: 0, lastUpdated: null });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ loaded: number; total: number }>({ loaded: 0, total: 0 });
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Search Tester State
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState<Array<{ code: string; name: string }>>([]);
  const [searchLatency, setSearchLatency] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stats on mount
  const refreshStats = async () => {
    const s = await icd10Service.getStats();
    setStats(s);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  // Handle CSV file selection and chunked upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress({ loaded: 0, total: 0 });
    setUploadSuccessMessage(null);
    setUploadError(null);

    try {
      const result = await icd10Service.importCsvFile(file, (loaded, total) => {
        setUploadProgress({ loaded, total });
      });

      await refreshStats();
      setUploadSuccessMessage(`ອັບໂຫຼດ ແລະ ບັນທຶກລະຫັດ ICD-10 ສຳເລັດແລ້ວ ທັງໝົດ ${result.count.toLocaleString()} ລາຍການ!`);
    } catch (err: any) {
      console.error('CSV import failed:', err);
      setUploadError(`ເກີດຂໍ້ຜິດພາດໃນການອ່ານໄຟລ໌ CSV: ${err?.message || 'ຮູບແບບໄຟລ໌ບໍ່ຖືກຕ້ອງ'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Clear all ICD-10 codes
  const handleClearDatabase = async () => {
    if (!window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນລະຫັດ ICD-10 ທັງໝົດອອກຈາກລະບົບ?')) {
      return;
    }

    try {
      await icd10Service.clearAll();
      await refreshStats();
      setTestResults([]);
      setTestQuery('');
      setUploadSuccessMessage('ລຶບຂໍ້ມູນລະຫັດ ICD-10 ຮຽບຮ້ອຍແລ້ວ');
    } catch (err) {
      console.error('Failed to clear ICD-10:', err);
    }
  };

  // Run test search
  useEffect(() => {
    const q = testQuery.trim();
    if (!q) {
      setTestResults([]);
      setSearchLatency(null);
      return;
    }

    setIsSearching(true);
    const start = performance.now();
    const timer = setTimeout(async () => {
      try {
        const res = await icd10Service.searchCodes(q, 30);
        const end = performance.now();
        setTestResults(res);
        setSearchLatency(Math.round(end - start));
      } catch (err) {
        console.error('Test search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [testQuery]);

  // Sample CSV template generator
  const handleDownloadSampleCsv = () => {
    const sample = `CODE,NAME OF DISEASE
A00.0,Cholera due to Vibrio cholerae 01 biovar cholerae
A00.9,Cholera unspecified
A09.0,Other and unspecified gastroenteritis and colitis of infectious origin
I21.0,ST elevation (STEMI) myocardial infarction of anterior wall
I21.9,Acute myocardial infarction unspecified
J18.9,Pneumonia unspecified organism
K35.80,Unspecified acute appendicitis
S06.0X0A,Concussion without loss of consciousness initial encounter
S06.2X0A,Diffuse traumatic brain injury without loss of consciousness initial encounter
R57.0,Cardiogenic shock
R57.1,Hypovolemic shock`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_icd10_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Top Header Navigation */}
      <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToReferrals}
            className="p-2 text-slate-500 hover:text-emerald-950 hover:bg-emerald-50 rounded-xl transition-colors"
            title="ກັບຄືນໜ້າທຸກເຄສທົ່ວແຂວງ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-emerald-950">
              ຕັ້ງຄ່າລະບົບ EMSCPS (Admin Settings)
            </h2>
            <p className="text-xs text-emerald-800/80">
              ຈັດການບັນຊີໂຮງໝໍເມືອງ/ສຸກສາລາ ແລະ ຕັ້ງຄ່າຖານຂໍ້ມູນການບົ່ງມະຕິພະຍາດ ICD-10
            </p>
          </div>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center p-1 bg-emerald-50/60 rounded-xl border border-emerald-900/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSubtab('diagnosis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeSubtab === 'diagnosis'
                ? 'bg-white text-emerald-950 border border-emerald-900/15 shadow-sm'
                : 'text-slate-600 hover:text-emerald-950'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-800" />
            <span>ຕັ້ງຄ່າບົ່ງມະຕິ (ICD-10)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubtab('hospitals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeSubtab === 'hospitals'
                ? 'bg-white text-emerald-950 border border-emerald-900/15 shadow-sm'
                : 'text-slate-600 hover:text-emerald-950'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-800" />
            <span>ຈັດການບັນຊີໂຮງໝໍເມືອງ / ສຸກສາລາ</span>
          </button>
        </div>
      </div>

      {/* ================= SUBTAB 2: ຕັ້ງຄ່າບົ່ງມະຕິ (ICD-10) ================= */}
      {activeSubtab === 'diagnosis' && (
        <div className="space-y-6">
          
          {/* Status & Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  ລະຫັດ ICD-10 ໃນລະບົບ
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-950 mt-1 block">
                  {stats.count.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {stats.count >= 70000 ? '✓ ຊຸດຂໍ້ມູນ ICD-10 ຄົບຖ້ວນ' : stats.count > 0 ? '✓ ພ້ອມໃຊ້ງານ' : 'ຍັງບໍ່ມີຂໍ້ມູນ'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  ຖານຂໍ້ມູນ IndexedDB
                </span>
                <span className="text-sm font-bold text-emerald-950 mt-1 block">
                  High-Speed Local Storage
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {stats.lastUpdated ? `ອັບເດດ: ${new Date(stats.lastUpdated).toLocaleDateString('lo-LA')}` : 'ຍັງບໍ່ເຄີຍອັບເດດ'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-900/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  ການຈັດການຂໍ້ມູນ
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ຕົວຢ່າງ CSV</span>
                  </button>
                  {stats.count > 0 && (
                    <button
                      type="button"
                      onClick={handleClearDatabase}
                      disabled={isUploading}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ລຶບຂໍ້ມູນ</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-800" />
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">
                    ອັບໂຫຼດໄຟລ໌ CSV ລະຫັດພະຍາດ (Upload ICD-10 CSV)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ຮອງຮັບໄຟລ໌ CSV ຂະໜາດໃຫຍ່ (74,889 ແຖວ): ຖັນ A = CODE, ຖັນ B = NAME OF DISEASE
                  </p>
                </div>
              </div>
            </div>

            {/* Alert messages */}
            {uploadSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-emerald-900/20 rounded-2xl p-8 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id="icd10-csv-input"
              />

              {isUploading ? (
                <div className="max-w-md mx-auto space-y-3">
                  <div className="w-10 h-10 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-bold text-emerald-950 text-sm">
                    ກຳລັງອ່ານ ແລະ ບັນທຶກລະຫັດພະຍາດລົງໃນ IndexedDB...
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-700 h-3 transition-all duration-150 rounded-full"
                      style={{
                        width: uploadProgress.total > 0
                          ? `${Math.min(100, Math.round((uploadProgress.loaded / uploadProgress.total) * 100))}%`
                          : '15%'
                      }}
                    />
                  </div>
                  
                  <p className="font-mono text-xs text-emerald-900 font-bold">
                    {uploadProgress.loaded.toLocaleString()} {uploadProgress.total > 0 ? `/ ${uploadProgress.total.toLocaleString()} ລາຍການ` : 'ແຖວ...'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <label
                      htmlFor="icd10-csv-input"
                      className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>ເລືອກໄຟລ໌ CSV ລະຫັດພະຍາດ (Browse CSV File)</span>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">
                    ຫຼື ລາກໄຟລ໌ CSV (ເຊັ່ນ ໄຟລ໌ 74,889 ແຖວ) ມາວາງລົງບ່ອນນີ້
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ຮູບແບບ: Column 1 = ລະຫັດ ICD-10 (CODE), Column 2 = ຊື່ພະຍາດ (NAME OF DISEASE)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Search Sandbox Tester */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-800" />
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">
                    ທົດລອງຄົ້ນຫາລະຫັດພະຍາດ (Live Search Tester)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ທົດສອບຄວາມໄວ ແລະ ຄວາມຖືກຕ້ອງຂອງລະບົບຄົ້ນຫາ ICD-10 ໃນຖານຂໍ້ມູນ IndexedDB
                  </p>
                </div>
              </div>
              {searchLatency !== null && (
                <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ຄວາມໄວ: {searchLatency}ms
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="ພິມທົດສອບ: ເຊັ່ນ I21, S06, Appendicitis, Pneumonia, Shock..."
                className="w-full p-3 pr-10 border border-slate-300 rounded-xl bg-white text-xs focus:border-emerald-600 focus:outline-none focus:ring-0 shadow-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Test Results Display */}
            {testResults.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                {testResults.map((item) => (
                  <div key={item.code} className="p-2.5 hover:bg-emerald-50/50 flex items-start gap-3">
                    <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded shrink-0">
                      {item.code}
                    </span>
                    <span className="font-medium text-slate-800 flex-1">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : testQuery.trim() ? (
              <div className="p-4 text-center text-xs text-slate-500">
                ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັບ "{testQuery}"
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                * ພິມລະຫັດ ຫຼື ຊື່ພະຍາດໃນຊ່ອງຄົ້ນຫາດ້ານເທິງ ເພື່ອທົດສອບຜົນລັບ
              </p>
            )}
          </div>

        </div>
      )}

      {/* ================= SUBTAB 1: ຈັດການບັນຊີໂຮງໝໍເມືອງ / ສຸກສາລາ ================= */}
      {activeSubtab === 'hospitals' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">
                ລາຍຊື່ໂຮງໝໍເມືອງ ແລະ ສຸກສາລາ ທັງໝົດ ({hospitals.length} ແຫ່ງ)
              </h3>
              <p className="text-xs text-slate-500">
                ຈັດການຊື່ແຂວງ, ເມືອງ (4 ແຂວງພາກໃຕ້), ລະຫັດຜ່ານເຂົ້າລະບົບ, ແລະ ທະບຽນລົດສຸກເສີນປະຈຳການ
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsHospitalModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ ເພີ່ມໂຮງໝໍ / ສຸກສາລາ</span>
            </button>
          </div>

          {/* Hospitals Table */}
          <div className="bg-white rounded-2xl border border-emerald-900/10 overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-emerald-50/60 border-b border-emerald-900/10 text-emerald-950 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">ໂຮງໝໍເມືອງ / ສຸກສາລາ</th>
                    <th className="py-3 px-4">ແຂວງ / ເມືອງ</th>
                    <th className="py-3 px-4">ລະຫັດຜ່ານ (Passcode)</th>
                    <th className="py-3 px-4">ຜູ້ອຳນວຍການ / ເບີໂທ</th>
                    <th className="py-3 px-4">ທະບຽນລົດສຸກເສີນ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hospitals.map((hosp) => (
                    <tr key={hosp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-emerald-950">
                        {hosp.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">{hosp.district}</span>
                        <span className="text-slate-400 text-[11px] block">{hosp.province}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {hosp.passcode}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">{hosp.directorName || '-'}</span>
                        <span className="font-mono text-[11px] text-slate-500">{hosp.phone || '-'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <div className="flex items-center gap-1 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>1: {hosp.ambulancePlate1 || '-'}</span>
                          </div>
                          {hosp.ambulancePlate2 && (
                            <div className="flex items-center gap-1 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              <span>2: {hosp.ambulancePlate2}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Modal for Full CRUD */}
      {isHospitalModalOpen && (
        <HospitalManagementModal
          isOpen={isHospitalModalOpen}
          onClose={() => setIsHospitalModalOpen(false)}
          hospitals={hospitals}
          onRefreshHospitals={onRefreshHospitals}
        />
      )}

    </div>
  );
};
