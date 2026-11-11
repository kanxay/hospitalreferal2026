/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TriageSummary } from './components/TriageSummary';
import { ReferralList } from './components/ReferralList';
import { ReferralForm } from './components/ReferralForm';
import { ReferralDetail } from './components/ReferralDetail';
import { ReferralA4Print } from './components/ReferralA4Print';
import { DatabaseSettingsModal } from './components/DatabaseSettingsModal';
import { HospitalManagementModal } from './components/HospitalManagementModal';
import { LoginView } from './components/LoginView';
import { dbService } from './services/db';
import { 
  AuthSession, 
  DatabaseStatus, 
  DistrictHospital, 
  ReferralRecord, 
  ReferralStatus, 
  TransitVitalLog 
} from './types/referral';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(() => {
    return dbService.getStoredSession();
  });
  
  const [hospitals, setHospitals] = useState<DistrictHospital[]>(() => {
    return dbService.getHospitals();
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'new-referral' | 'detail' | 'print'>('dashboard');
  const [activeReferral, setActiveReferral] = useState<ReferralRecord | null>(null);
  const [triageFilter, setTriageFilter] = useState<string>('all');
  
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    isConnected: false,
    provider: 'local',
    recordCount: 0,
  });
  
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadHospitals = useCallback(() => {
    setHospitals(dbService.getHospitals());
  }, []);

  const loadData = useCallback(async () => {
    try {
      const records = await dbService.getReferrals();
      setReferrals(records);
      const status = await dbService.getStatus();
      setDbStatus(status);
      loadHospitals();
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [loadHospitals]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    showToast('ອັບເດດຂໍ້ມູນລ່າສຸດສຳເລັດແລ້ວ', 'info');
  };

  const handleLoginSuccess = (session: AuthSession) => {
    setCurrentUser(session);
    setCurrentView('dashboard');
    showToast(`ຍິນດີຕ້ອນຮັບ: ${session.displayName}`);
  };

  const handleLogout = () => {
    dbService.setStoredSession(null);
    setCurrentUser(null);
    setActiveReferral(null);
    setCurrentView('dashboard');
    showToast('ອອກຈາກລະບົບຮຽບຮ້ອຍແລ້ວ', 'info');
  };

  const handleSelectReferral = (record: ReferralRecord) => {
    setActiveReferral(record);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintReferral = (record: ReferralRecord) => {
    setActiveReferral(record);
    setCurrentView('print');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateReferral = async (data: Omit<ReferralRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await dbService.createReferral(data);
      await loadData();
      setActiveReferral(created);
      setCurrentView('detail');
      showToast(`ສ້າງໃບສົ່ງຕົວເລກທີ ${created.id} ສຳເລັດແລ້ວ!`);
    } catch (err: any) {
      console.error('Create referral error:', err);
      throw err;
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ReferralStatus) => {
    const updated = await dbService.updateReferral(id, { 
      status: newStatus,
      arrivalTime: newStatus === 'arrived' ? new Date().toISOString() : undefined,
    });
    if (updated) {
      setReferrals(prev => prev.map(r => (r.id === id ? updated : r)));
      if (activeReferral && activeReferral.id === id) {
        setActiveReferral(updated);
      }
      showToast(`ອັບເດດສະຖານະເປັນ "${getStatusText(newStatus)}" ແລ້ວ`);
    }
  };

  const handleAddTransitVital = async (id: string, newVital: TransitVitalLog) => {
    const target = referrals.find(r => r.id === id);
    if (!target) return;

    const existingLogs = target.transitVitalsHistory || [];
    const updatedLogs = [newVital, ...existingLogs];

    const updated = await dbService.updateReferral(id, {
      transitVitalsHistory: updatedLogs,
      vitalSigns: {
        ...target.vitalSigns,
        bpSystolic: newVital.bpSystolic,
        bpDiastolic: newVital.bpDiastolic,
        pulseRate: newVital.pulseRate,
        spO2: newVital.spO2,
        recordedAt: new Date().toISOString(),
      }
    });

    if (updated) {
      setReferrals(prev => prev.map(r => (r.id === id ? updated : r)));
      if (activeReferral && activeReferral.id === id) {
        setActiveReferral(updated);
      }
      showToast('ບັນທຶກສັນຍານຊີບລະຫວ່າງທາງຮຽບຮ້ອຍແລ້ວ');
    }
  };

  const handleDeleteReferral = async (id: string) => {
    await dbService.deleteReferral(id);
    await loadData();
    setActiveReferral(null);
    setCurrentView('dashboard');
    showToast('ລຶບລາຍການສົ່ງຕໍ່ແລ້ວ');
  };

  const getStatusText = (status: ReferralStatus) => {
    switch (status) {
      case 'pending': return 'ລໍຖ້າຮັບເລື່ອງ';
      case 'accepted': return 'ຮັບເລື່ອງແລ້ວ';
      case 'in_transit': return 'ກຳລັງເດີນທາງ (En Route)';
      case 'arrived': return 'ຮອດ ER ແລ້ວ';
      case 'admitted': return 'ຮັບນອນ/ICU';
      case 'refer_back': return 'ສົ່ງຕໍ່ກັບ';
      case 'cancelled': return 'ຍົກເລີກ';
    }
  };

  // If not authenticated, render LoginView
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        hospitals={hospitals}
      />
    );
  }

  // Filter referrals viewable by current user
  const visibleReferrals = referrals.filter(r => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'hospital' && currentUser.hospitalId) {
      if (r.originHospitalId && r.originHospitalId === currentUser.hospitalId) return true;
      if (r.originHospital.includes(currentUser.hospitalName || '')) return true;
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 flex flex-col font-sans">
      
      {/* Toast alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        currentTab={currentView === 'new-referral' ? 'new-referral' : 'dashboard'}
        onSelectTab={(tab) => {
          if (currentUser.role === 'admin') {
            setCurrentView('dashboard');
          } else {
            setCurrentView(tab);
          }
        }}
        dbStatus={dbStatus}
        onOpenDbSettings={() => setIsDbModalOpen(true)}
        onRefreshData={handleRefresh}
        isRefreshing={isRefreshing}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenHospitalManagement={() => setIsHospitalModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-emerald-800/80 font-medium">ກຳລັງໂຫຼດຂໍ້ມູນລະບົບ EMSCPS...</p>
          </div>
        ) : (
          <>
            {/* View: Dashboard Overview */}
            {currentView === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Triage Overview Bar */}
                <TriageSummary
                  referrals={visibleReferrals}
                  activeFilter={triageFilter}
                  onFilterChange={setTriageFilter}
                />

                {/* Referral Data Table */}
                <ReferralList
                  referrals={visibleReferrals}
                  onSelectReferral={handleSelectReferral}
                  onPrintReferral={handlePrintReferral}
                  onUpdateStatus={handleUpdateStatus}
                  activeTriageFilter={triageFilter}
                  currentUser={currentUser}
                />

              </div>
            )}

            {/* View: 5-Step New Referral Intake Form (Accessible only to District Hospitals) */}
            {currentView === 'new-referral' && currentUser.role === 'hospital' && (
              <ReferralForm
                onCancel={() => setCurrentView('dashboard')}
                onSubmit={handleCreateReferral}
                currentUser={currentUser}
                hospitals={hospitals}
              />
            )}

            {/* View: Referral Detail & Transit Tracker */}
            {currentView === 'detail' && activeReferral && (
              <ReferralDetail
                referral={activeReferral}
                onBack={() => setCurrentView('dashboard')}
                onPrint={() => setCurrentView('print')}
                onUpdateStatus={handleUpdateStatus}
                onAddTransitVital={handleAddTransitVital}
                onDelete={handleDeleteReferral}
                currentUser={currentUser}
              />
            )}

            {/* View: Official Printable A4 Slip */}
            {currentView === 'print' && activeReferral && (
              <ReferralA4Print
                referral={activeReferral}
                onBack={() => setCurrentView('detail')}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="no-print bg-white/80 border-t border-emerald-900/10 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-emerald-950 font-medium">
            © 2026 EMSCPS · ລະບົບສົ່ງຕໍ່ຄົນເຈັບສຸກເສີນ ໂຮງໝໍແຂວງຈຳປາສັກ (Champasak Provincial Hospital)
          </span>
          <span className="text-[11px] font-mono text-emerald-800/70">
            Cloudflare Pages · Turso LibSQL Database
          </span>
        </div>
      </footer>

      {/* Database Settings Modal (Admin Only) */}
      {currentUser.role === 'admin' && (
        <DatabaseSettingsModal
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
          status={dbStatus}
          onRefresh={loadData}
        />
      )}

      {/* Hospital Management Modal (Admin Only) */}
      {currentUser.role === 'admin' && (
        <HospitalManagementModal
          isOpen={isHospitalModalOpen}
          onClose={() => setIsHospitalModalOpen(false)}
          hospitals={hospitals}
          onRefreshHospitals={loadHospitals}
        />
      )}

    </div>
  );
}
