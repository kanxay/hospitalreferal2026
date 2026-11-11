import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  ChevronRight, 
  Truck, 
  Clock, 
  HeartPulse, 
  Building2,
  Stethoscope,
  Download
} from 'lucide-react';
import { AuthSession, ReferralRecord, ReferralStatus } from '../types/referral';
import { CHAMPASAK_DISTRICTS } from '../data/facilities';
import { dbService } from '../services/db';

interface ReferralListProps {
  referrals: ReferralRecord[];
  onSelectReferral: (referral: ReferralRecord) => void;
  onPrintReferral: (referral: ReferralRecord) => void;
  onUpdateStatus: (id: string, newStatus: ReferralStatus) => void;
  activeTriageFilter: string;
  currentUser: AuthSession;
}

export const ReferralList: React.FC<ReferralListProps> = ({
  referrals,
  onSelectReferral,
  onPrintReferral,
  onUpdateStatus,
  activeTriageFilter,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  const filteredReferrals = useMemo(() => {
    return referrals.filter(record => {
      // Role filtering: If logged in as district hospital, restrict to their hospital's records
      if (currentUser.role === 'hospital' && currentUser.hospitalId) {
        if (record.originHospitalId && record.originHospitalId !== currentUser.hospitalId) {
          if (!record.originHospital.includes(currentUser.hospitalName || '')) {
            return false;
          }
        }
      }

      // Triage filter
      if (activeTriageFilter !== 'all') {
        if (activeTriageFilter === 'in_transit') {
          if (record.status !== 'in_transit') return false;
        } else if (record.triageLevel !== activeTriageFilter) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && record.status !== statusFilter) {
        return false;
      }

      // District filter
      if (districtFilter !== 'all' && record.district !== districtFilter) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = record.patientName.toLowerCase().includes(query);
        const matchHn = record.idCardOrHN.toLowerCase().includes(query);
        const matchId = record.id.toLowerCase().includes(query);
        const matchDiag = record.provisionalDiagnosis.toLowerCase().includes(query);
        const matchOrigin = record.originHospital.toLowerCase().includes(query);
        return matchName || matchHn || matchId || matchDiag || matchOrigin;
      }

      return true;
    });
  }, [referrals, activeTriageFilter, statusFilter, districtFilter, searchTerm, currentUser]);

  const getTriageBadge = (level: string) => {
    switch (level) {
      case 'emergency':
        return {
          label: 'ສຸກເສີນວິກິດ (Red)',
          textColor: 'text-rose-700 font-bold',
        };
      case 'urgent':
        return {
          label: 'ຮີບດ່ວນ (Yellow)',
          textColor: 'text-amber-700 font-bold',
        };
      case 'routine':
      default:
        return {
          label: 'ທົ່ວໄປ (Green)',
          textColor: 'text-emerald-700 font-bold',
        };
    }
  };

  const getStatusInfo = (status: ReferralStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'ລໍຖ້າຮັບ', color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'accepted':
        return { label: 'ຮັບເລື່ອງແລ້ວ', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      case 'in_transit':
        return { label: 'ກຳລັງເດີນທາງ', color: 'text-teal-800 bg-teal-50 border-teal-200' };
      case 'arrived':
        return { label: 'ຮອດ ER ແລ້ວ', color: 'text-emerald-900 bg-emerald-100/80 border-emerald-300' };
      case 'admitted':
        return { label: 'ຮັບນອນ/ICU', color: 'text-purple-800 bg-purple-50 border-purple-200' };
      case 'refer_back':
        return { label: 'ສົ່ງຕໍ່ກັບ', color: 'text-slate-800 bg-slate-100 border-slate-200' };
      case 'cancelled':
        return { label: 'ຍົກເລີກ', color: 'text-rose-800 bg-rose-50 border-rose-200' };
    }
  };

  const handleExportCsv = () => {
    dbService.exportReferralsCsv(filteredReferrals);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-2xs overflow-hidden font-sans">
      
      {/* Controls Bar */}
      <div className="p-4 border-b border-emerald-900/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-emerald-50/30">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ຄົ້ນຫາ: ຊື່ຄົນເຈັບ, HN, ລະຫັດສົ່ງຕໍ່, ພະຍາດ..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-emerald-900/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950"
          />
        </div>

        {/* Filter Dropdowns & CSV Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-emerald-900/15 rounded-xl text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">ທຸກສະຖານະ (All Status)</option>
            <option value="pending">ລໍຖ້າຮັບ (Pending)</option>
            <option value="accepted">ຮັບແລ້ວ (Accepted)</option>
            <option value="in_transit">ກຳລັງເດີນທາງ (En Route)</option>
            <option value="arrived">ຮອດ ER ແລ້ວ (Arrived ER)</option>
            <option value="admitted">ຮັບນອນ/ICU (Admitted)</option>
            <option value="refer_back">ສົ່ງຕໍ່ກັບ (Refer Back)</option>
          </select>

          {/* District selector (Especially useful for Admin) */}
          {currentUser.role === 'admin' && (
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-emerald-900/15 rounded-xl text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-600 max-w-[170px] truncate"
            >
              <option value="all">ທຸກເມືອງ (All Districts)</option>
              {CHAMPASAK_DISTRICTS.map(dist => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          )}

          {/* Export CSV with UTF-8 BOM button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-950 bg-white hover:bg-emerald-50/70 rounded-xl border border-emerald-900/15 transition-colors shadow-2xs"
            title="ສົ່ງອອກລາຍງານເປັນ Excel CSV ພາສາລາວ (UTF-8 BOM)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {(searchTerm || statusFilter !== 'all' || districtFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDistrictFilter('all');
              }}
              className="px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-emerald-900 transition-colors"
            >
              ລ້າງຄ່າ
            </button>
          )}
        </div>

      </div>

      {/* Referral Table / List View */}
      {filteredReferrals.length === 0 ? (
        <div className="p-12 text-center">
          <HeartPulse className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-emerald-950">ບໍ່ພົບລາຍການສົ່ງຕໍ່ຄົນເຈັບ</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {currentUser.role === 'hospital'
              ? `ບໍ່ມີເຄສຂອງ ${currentUser.hospitalName} ທີ່ຕົງກັບເງື່ອນໄຂ`
              : 'ບໍ່ມີລາຍການທີ່ຕົງກັບເງື່ອນໄຂການຄົ້ນຫາ'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-emerald-900/5">
          {filteredReferrals.map((record) => {
            const triage = getTriageBadge(record.triageLevel);
            const statusInfo = getStatusInfo(record.status);
            const gcsTotal = record.vitalSigns.gcs?.total ?? 15;

            return (
              <div
                key={record.id}
                className="p-4 hover:bg-emerald-50/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                
                {/* Left: Patient and Transfer Route */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded text-[11px]">
                      {record.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-slate-600 font-medium">
                      HN: {record.idCardOrHN}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className={triage.textColor}>
                      {triage.label}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {record.transferTime || new Date(record.updatedAt).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>

                  {/* Patient Name & Primary Diagnosis */}
                  <div className="flex flex-wrap items-baseline gap-2">
                    <button
                      onClick={() => onSelectReferral(record)}
                      className="text-base font-bold text-slate-900 hover:text-emerald-800 transition-colors text-left"
                    >
                      {record.patientName}
                    </button>
                    <span className="text-xs text-slate-500">
                      ({record.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'}, {record.age} ປີ)
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <p className="text-sm text-slate-700 line-clamp-1">
                    <span className="font-bold text-emerald-950">ການບົ່ງມະຕິ:</span> {record.provisionalDiagnosis}
                  </p>

                  {/* Route & Destination */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700/70 shrink-0" />
                      {record.originHospital}
                    </span>
                    <span className="text-slate-300">➔</span>
                    <span className="flex items-center gap-1 text-emerald-900 font-semibold">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      {record.receivingDepartment}
                    </span>
                    {record.transportVehicle && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 text-teal-800 font-medium">
                          <Truck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          {record.ambulanceCode ? `${record.ambulanceCode} · ` : ''}
                          {record.etaMinutes ? `~${record.etaMinutes} ນາທີ` : 'En Route'}
                        </span>
                      </>
                    )}
                  </div>

                </div>

                {/* Center: Vitals & GCS Glance */}
                <div className="flex items-center gap-2.5 bg-emerald-50/40 px-3 py-2 rounded-xl border border-emerald-900/10 text-xs shrink-0 font-mono tabular-nums">
                  <div className="text-center px-1">
                    <span className="text-[10px] uppercase text-slate-500 block font-bold">BP</span>
                    <span className="font-bold text-slate-800">
                      {record.vitalSigns.bpSystolic}/{record.vitalSigns.bpDiastolic}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-emerald-200/60" />
                  <div className="text-center px-1">
                    <span className="text-[10px] uppercase text-slate-500 block font-bold">PR</span>
                    <span className="font-bold text-slate-800">
                      {record.vitalSigns.pulseRate}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-emerald-200/60" />
                  <div className="text-center px-1">
                    <span className="text-[10px] uppercase text-slate-500 block font-bold">SpO2</span>
                    <span className={`font-bold ${record.vitalSigns.spO2 < 95 ? 'text-rose-600 font-black' : 'text-slate-800'}`}>
                      {record.vitalSigns.spO2}%
                    </span>
                  </div>
                  <div className="w-px h-6 bg-emerald-200/60" />
                  <div className="text-center px-1">
                    <span className="text-[10px] uppercase text-emerald-800 block font-bold">GCS</span>
                    <span className={`font-black ${gcsTotal <= 8 ? 'text-rose-600' : 'text-emerald-900'}`}>
                      {gcsTotal}/15
                    </span>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  
                  {/* Status Dropdown */}
                  <select
                    value={record.status}
                    onChange={(e) => onUpdateStatus(record.id, e.target.value as ReferralStatus)}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${statusInfo.color}`}
                  >
                    <option value="pending">ລໍຖ້າຮັບ (Pending)</option>
                    <option value="accepted">ຮັບແລ້ວ (Accepted)</option>
                    <option value="in_transit">ກຳລັງເດີນທາງ (En Route)</option>
                    <option value="arrived">ຮອດ ER ແລ້ວ (Arrived ER)</option>
                    <option value="admitted">ຮັບນອນ/ICU (Admitted)</option>
                    <option value="refer_back">ສົ່ງຕໍ່ກັບ (Refer Back)</option>
                    <option value="cancelled">ຍົກເລີກ</option>
                  </select>

                  {/* Print A4 slip */}
                  <button
                    onClick={() => onPrintReferral(record)}
                    title="ພິມໃບສົ່ງຕໍ່ A4 / Export PDF"
                    className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-900/10"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  {/* View Details */}
                  <button
                    onClick={() => onSelectReferral(record)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-950 hover:text-white bg-emerald-50 hover:bg-emerald-800 rounded-xl transition-colors"
                  >
                    <span>ລາຍລະອຽດ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Footer count */}
      <div className="px-4 py-3 bg-emerald-50/30 border-t border-emerald-900/10 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <span>ສະແດງ {filteredReferrals.length} ຈາກທັງໝົດ {referrals.length} ເຄສ</span>
        <span className="font-mono text-slate-400">
          {currentUser.role === 'admin' ? 'ER Command Mode · 10 Districts' : currentUser.hospitalName}
        </span>
      </div>

    </div>
  );
};
