import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Phone, 
  KeyRound, 
  Truck,
  UserCheck,
  MapPin
} from 'lucide-react';
import { DistrictHospital } from '../types/referral';
import { 
  CHAMPASAK_DISTRICTS, 
  SOUTHERN_PROVINCES, 
  SOUTHERN_DISTRICTS_BY_PROVINCE, 
  ALL_SOUTHERN_DISTRICTS 
} from '../data/facilities';
import { dbService } from '../services/db';

interface HospitalManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitals: DistrictHospital[];
  onRefreshHospitals: () => void;
}

export const HospitalManagementModal: React.FC<HospitalManagementModalProps> = ({
  isOpen,
  onClose,
  hospitals,
  onRefreshHospitals,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states matching user specification:
  // - ຊື່ແຂວງ: Text
  // - ຊື່ໂຮງຫມໍເມື່ອງ: Text
  // - ລະຫັດຜ່ານເຂົ້າລະບົບ (Passcode) *
  // - ຜູ້ອຳນວຍການ
  // - ຄັນທີ 1 ເລກທະບຽນ
  // - ຄັນທີ 2 ເລກທະບຽນ
  const [province, setProvince] = useState('ຈຳປາສັກ');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState<string>(CHAMPASAK_DISTRICTS[0]);
  const [passcode, setPasscode] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [phone, setPhone] = useState('');
  const [ambulancePlate1, setAmbulancePlate1] = useState('');
  const [ambulancePlate2, setAmbulancePlate2] = useState('');

  if (!isOpen) return null;

  const startEdit = (hosp: DistrictHospital) => {
    setEditingId(hosp.id);
    setProvince(hosp.province || 'ຈຳປາສັກ');
    setName(hosp.name);
    setDistrict(hosp.district || CHAMPASAK_DISTRICTS[0]);
    setPasscode(hosp.passcode);
    setDirectorName(hosp.directorName || '');
    setPhone(hosp.phone || '');
    setAmbulancePlate1(hosp.ambulancePlate1 || '');
    setAmbulancePlate2(hosp.ambulancePlate2 || '');
    setShowAddForm(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    dbService.saveHospital({
      id: editingId,
      name: name.trim(),
      province: province.trim() || 'ຈຳປາສັກ',
      district,
      passcode: passcode.trim(),
      directorName: directorName.trim(),
      phone: phone.trim() || '-',
      ambulancePlate1: ambulancePlate1.trim(),
      ambulancePlate2: ambulancePlate2.trim(),
      ambulanceCount: (ambulancePlate1.trim() ? 1 : 0) + (ambulancePlate2.trim() ? 1 : 0),
    });

    setEditingId(null);
    onRefreshHospitals();
  };

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `hosp_${Date.now()}`;
    dbService.saveHospital({
      id: newId,
      name: name.trim(),
      province: province.trim() || 'ຈຳປາສັກ',
      district,
      passcode: passcode.trim() || 'cps2026',
      directorName: directorName.trim(),
      phone: phone.trim() || '-',
      ambulancePlate1: ambulancePlate1.trim() || 'ກກ 1122 ຈຳປາສັກ',
      ambulancePlate2: ambulancePlate2.trim() || 'ກຂ 3344 ຈຳປາສັກ',
      ambulanceCount: 2,
    });

    setShowAddForm(false);
    resetForm();
    onRefreshHospitals();
  };

  const resetForm = () => {
    setProvince('ຈຳປາສັກ');
    setName('');
    setDistrict(CHAMPASAK_DISTRICTS[0]);
    setPasscode('');
    setDirectorName('');
    setPhone('');
    setAmbulancePlate1('');
    setAmbulancePlate2('');
  };

  const handleDelete = (id: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໂຮງໝໍນີ້ອອກຈາກລະບົບ?')) {
      dbService.deleteHospital(id);
      onRefreshHospitals();
    }
  };

  const handleResetDefaults = () => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຣີເຊັດບັນຊີ 10 ໂຮງໝໍເມືອງເປັນຄ່າເລີ່ມຕົ້ນ?')) {
      dbService.resetDefaultHospitals();
      onRefreshHospitals();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col border border-emerald-900/10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                ຈັດການບັນຊີໂຮງໝໍເມືອງ / ສຸກສາລາ
              </h3>
              <p className="text-xs text-slate-500">
                ກຳນົດສິດ, ແຂວງ, ເມືອງ, ທະບຽນລົດສຸກເສີນ, ແລະ ລະຫັດຜ່ານເຂົ້າລະບົບ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-emerald-950 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
              resetForm();
              setPasscode('cps2026');
              setAmbulancePlate1('ກກ 1122 ຈຳປາສັກ');
              setAmbulancePlate2('ກຂ 3344 ຈຳປາສັກ');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ ເພີ່ມໂຮງໝໍ / ສຸກສາລາໃໝ່</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-900 p-1.5"
            title="ຣີເຊັດເປັນ 10 ໂຮງໝໍເມືອງຕົ້ນສະບັບ"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ຣີເຊັດຄ່າເລີ່ມຕົ້ນ</span>
          </button>
        </div>

        {/* Modal Body: Add/Edit Form or List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {/* Add / Edit Form */}
          {(showAddForm || editingId) && (
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-900/15 space-y-3">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-800" />
                <span>{editingId ? 'ແກ້ໄຂຂໍ້ມູນໂຮງໝໍ' : 'ເພີ່ມໂຮງໝໍເມືອງ / ສຸກສາລາໃໝ່'}</span>
              </h4>

              <form onSubmit={editingId ? handleSaveEdit : handleCreateHospital} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* 1. ຊື່ແຂວງ: DROPDOWN TEXT (ເລືອກໄດ້ ແລະ ພິມໄດ້) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ຊື່ແຂວງ * (ເລືອກ ຫຼື ພິມເອງ)
                  </label>
                  <input
                    type="text"
                    required
                    list="modal-provinces-list"
                    value={province}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProvince(val);
                      const dists = SOUTHERN_DISTRICTS_BY_PROVINCE[val];
                      if (dists && dists.length > 0 && !dists.includes(district)) {
                        setDistrict(dists[0]);
                      }
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-emerald-600"
                  />
                  <datalist id="modal-provinces-list">
                    {SOUTHERN_PROVINCES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </datalist>
                </div>

                {/* ເມືອງ: DROPDOWN TEXT (ເລືອກໄດ້ ແລະ ພິມໄດ້) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ເມືອງ * (ເລືອກ ຫຼື ພິມເອງ)
                  </label>
                  <input
                    type="text"
                    required
                    list="modal-districts-list"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-emerald-600"
                  />
                  <datalist id="modal-districts-list">
                    {(SOUTHERN_DISTRICTS_BY_PROVINCE[province] || ALL_SOUTHERN_DISTRICTS).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </datalist>
                </div>

                {/* 2. ຊື່ໂຮງຫມໍເມື່ອງ: Text */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    ຊື່ໂຮງໝໍເມືອງ / ສຸກສາລາ *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                {/* 3. ລະຫັດຜ່ານເຂົ້າລະບົບ (Passcode) * */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ລະຫັດຜ່ານເຂົ້າລະບົບ (Passcode) *
                  </label>
                  <input
                    type="text"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono font-bold text-emerald-900"
                  />
                </div>

                {/* 4. ຜູ້ອຳນວຍການ : Text */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ຜູ້ອຳນວຍການ
                  </label>
                  <input
                    type="text"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                {/* ເບີໂທສຸກເສີນ */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ເບີໂທຕິດຕໍ່ / ສຸກເສີນ
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>

                <div className="hidden sm:block"></div>

                {/* 5. ທະບຽນລົດສຸກເສີນ: ຄັນທີ 1 & ຄັນທີ 2 */}
                <div className="sm:col-span-2 pt-2 border-t border-emerald-900/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 mb-2">
                    <Truck className="w-4 h-4 text-emerald-800" />
                    <span>ທະບຽນລົດສຸກເສີນທີ່ປະຈຳການ (2 ຄັນ)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        ຄັນທີ 1: ເລກທະບຽນ
                      </label>
                      <input
                        type="text"
                        value={ambulancePlate1}
                        onChange={(e) => setAmbulancePlate1(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        ຄັນທີ 2: ເລກທະບຽນ
                      </label>
                      <input
                        type="text"
                        value={ambulancePlate2}
                        onChange={(e) => setAmbulancePlate2(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-emerald-900/10">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200"
                  >
                    ຍົກເລີກ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 shadow-2xs"
                  >
                    ບັນທຶກຂໍ້ມູນ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Hospitals list */}
          <div className="divide-y divide-emerald-900/10 border border-emerald-900/10 rounded-xl overflow-hidden bg-white">
            {hospitals.map(hosp => (
              <div key={hosp.id} className="p-3.5 hover:bg-emerald-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-emerald-950 text-sm">{hosp.name}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                      <MapPin className="w-3 h-3" />
                      {hosp.district} · ແຂວງ{hosp.province || 'ຈຳປາສັກ'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600 flex-wrap text-[11px]">
                    {hosp.directorName && (
                      <span className="flex items-center gap-1 text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>ຜອ: {hosp.directorName}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {hosp.phone}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-900 font-bold font-mono">
                      <KeyRound className="w-3 h-3 text-emerald-700" />
                      Passcode: {hosp.passcode}
                    </span>
                  </div>

                  {/* Registered Ambulance Plates */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600 pt-0.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="text-slate-500 font-sans">ທະບຽນລົດ:</span>
                    <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                      ຄັນ 1: {hosp.ambulancePlate1 || 'ຍັງບໍ່ໄດ້ກຳນົດ'}
                    </span>
                    <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                      ຄັນ 2: {hosp.ambulancePlate2 || 'ຍັງບໍ່ໄດ້ກຳນົດ'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => startEdit(hosp)}
                    className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="ແກ້ໄຂ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(hosp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="ລຶບ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-emerald-900/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            ປິດໜ້າຕ່າງ
          </button>
        </div>

      </div>
    </div>
  );
};
