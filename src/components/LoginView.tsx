import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Activity, 
  Hospital, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { AuthSession, DistrictHospital } from '../types/referral';
import { dbService } from '../services/db';

interface LoginViewProps {
  onLoginSuccess: (session: AuthSession) => void;
  hospitals: DistrictHospital[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  hospitals,
}) => {
  const [activeTab, setActiveTab] = useState<'hospital' | 'admin'>('hospital');
  
  // Hospital Login State
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(
    hospitals[0]?.id || 'hosp_paksong'
  );
  const [hospitalPasscode, setHospitalPasscode] = useState('');

  // Admin Login State
  const [adminPasscode, setAdminPasscode] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);

  const handleHospitalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedHospital) {
      setErrorMsg('ກະລຸນາເລືອກໂຮງໝໍເມືອງຕົ້ນທາງ');
      return;
    }

    const cleanPass = hospitalPasscode.trim();
    if (!cleanPass) {
      setErrorMsg('ກະລຸນາປ້ອນລະຫັດຜ່ານຂອງໂຮງໝໍ');
      return;
    }

    if (cleanPass !== selectedHospital.passcode && cleanPass !== 'cps@252173') {
      setErrorMsg('ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ ກະລຸນາກວດສອບຄືນ');
      return;
    }

    const session: AuthSession = {
      role: 'hospital',
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      displayName: selectedHospital.name,
      loggedInAt: new Date().toISOString(),
    };

    dbService.setStoredSession(session);
    onLoginSuccess(session);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPass = adminPasscode.trim();
    if (!cleanPass) {
      setErrorMsg('ກະລຸນາປ້ອນລະຫັດຜ່ານ Admin');
      return;
    }

    if (cleanPass !== 'cps@252173') {
      setErrorMsg('ລະຫັດຜ່ານ Admin ບໍ່ຖືກຕ້ອງ ກະລຸນາກວດສອບຄືນ');
      return;
    }

    const session: AuthSession = {
      role: 'admin',
      displayName: 'ຜູ້ດູແລລະບົບ ER ໂຮງໝໍແຂວງຈຳປາສັກ',
      hospitalName: 'ໂຮງໝໍແຂວງຈຳປາສັກ (ສູນສັ່ງການສົ່ງຕໍ່)',
      loggedInAt: new Date().toISOString(),
    };

    dbService.setStoredSession(session);
    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-800 text-white items-center justify-center shadow-lg ring-4 ring-emerald-600/10 mb-3.5">
          <Activity className="w-8 h-8 text-emerald-100" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
          ລະບົບສົ່ງຕໍ່ຄົນເຈັບ EMSCPS
        </h2>
        <p className="mt-1 text-xs font-medium text-emerald-800/80">
          ໂຮງໝໍແຂວງຈຳປາສັກ (Champasak Provincial Hospital Referral Network)
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-emerald-900/10">
          
          {/* Role selector tabs */}
          <div className="flex p-1 bg-emerald-50/60 border border-emerald-900/5 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('hospital');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'hospital'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-emerald-800/70 hover:text-emerald-950'
              }`}
            >
              <Hospital className="w-3.5 h-3.5 text-emerald-700" />
              <span>ໂຮງໝໍເມືອງ (User)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-emerald-800/70 hover:text-emerald-950'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>ຜູ້ດູແລລະບົບ (Admin)</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form 1: District Hospital User Login */}
          {activeTab === 'hospital' && (
            <form onSubmit={handleHospitalLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  ເລືອກໂຮງໝໍເມືອງຂອງທ່ານ (10 ເມືອງ ແຂວງຈຳປາສັກ)
                </label>
                <div className="relative">
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-semibold bg-white border border-emerald-900/20 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-emerald-950"
                  >
                    {hospitals.map((hosp) => (
                      <option key={hosp.id} value={hosp.id}>
                        {hosp.name} ({hosp.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  ລະຫັດຜ່ານໂຮງໝໍ (Passcode)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-700/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={hospitalPasscode}
                    onChange={(e) => setHospitalPasscode(e.target.value)}
                    placeholder="ປ້ອນລະຫັດຜ່ານ..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-emerald-900/20 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                <p className="font-semibold text-emerald-950">ສິດທິການໃຊ້ງານຂອງໂຮງໝໍເມືອງ:</p>
                <p>• ປ້ອນຂໍ້ມູນໃບສົ່ງຕົວຄົນເຈັບສຸກເສີນ (Clinical Referral Form)</p>
                <p>• ເບິ່ງປະຫວັດ ແລະ ຕິດຕາມສະຖານະເຄສສະເພາະໂຮງໝໍຕົນເອງ</p>
                <p>• ພິມໃບສົ່ງຕໍ່ມາດຕະຖານ A4 ແລະ ດາວໂຫຼດ PDF</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>ເຂົ້າສູ່ລະບົບ (Login as District Hospital)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 2: Admin Login */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  ລະຫັດຜ່ານ Admin Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-emerald-700/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="ປ້ອນລະຫັດຜ່ານ Admin..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-emerald-900/20 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                <p className="font-semibold text-emerald-950">ສິດທິຂອງ Admin (ໂຮງໝໍແຂວງຈຳປາສັກ):</p>
                <p>• ເຂົ້າເຖິງ ແລະ ຕິດຕາມທຸກເຄສຈາກ 10 ເມືອງທົ່ວແຂວງ</p>
                <p>• ປ່ຽນສະຖານະ: Pending ➔ En Route ➔ Arrived ER ➔ Admitted/ICU ➔ Refer Back</p>
                <p>• ຈັດການບັນຊີໂຮງໝໍເມືອງ (Hospital Management)</p>
                <p>• ສົ່ງອອກລາຍງານທັງໝົດເປັນ Excel CSV ພາສາລາວ (UTF-8 BOM)</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-900 hover:bg-emerald-950 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>ເຂົ້າສູ່ລະບົບ Admin (Login as Admin)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

        <p className="text-center text-xs text-emerald-800/60 mt-6 font-mono">
          EMSCPS Champasak Provincial Hospital EMS Referral Network 2026
        </p>

      </div>
    </div>
  );
};
