import { 
  Database, 
  Plus, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  HardDrive, 
  LogOut, 
  Building2,
  Settings
} from 'lucide-react';
import { AuthSession, DatabaseStatus } from '../types/referral';

interface HeaderProps {
  currentTab: 'dashboard' | 'new-referral' | 'settings';
  onSelectTab: (tab: 'dashboard' | 'new-referral' | 'settings') => void;
  dbStatus: DatabaseStatus;
  onOpenDbSettings: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
  currentUser: AuthSession | null;
  onLogout: () => void;
  onOpenHospitalManagement: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  dbStatus,
  onOpenDbSettings,
  onRefreshData,
  isRefreshing,
  currentUser,
  onLogout,
  onOpenHospitalManagement,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark / Brand lockup */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-sm ring-1 ring-emerald-900">
                <Activity className="w-6 h-6 text-emerald-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-emerald-950 leading-tight">
                  EMSCPS
                </span>
                <span className="text-xs font-semibold text-emerald-800/80">
                  ໂຮງໝໍແຂວງຈຳປາສັກ
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 ${
                currentTab === 'dashboard'
                  ? 'border-emerald-700 text-emerald-950 font-bold'
                  : 'border-transparent text-slate-600 hover:text-emerald-900'
              }`}
            >
              {isAdmin ? 'ທຸກເຄສທົ່ວແຂວງ (All Referrals)' : 'ລາຍການສົ່ງຕໍ່ຂອງໂຮງໝໍ'}
            </button>

            {/* User only: Show "+ ປ້ອນໃບສົ່ງຕໍ່ໃໝ່" nav link */}
            {!isAdmin && (
              <button
                onClick={() => onSelectTab('new-referral')}
                className={`transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 ${
                  currentTab === 'new-referral'
                    ? 'border-emerald-700 text-emerald-950 font-bold'
                    : 'border-transparent text-slate-600 hover:text-emerald-900'
                }`}
              >
                + ປ້ອນໃບສົ່ງຕໍ່ໃໝ່
              </button>
            )}

            {/* Admin only: Tab ຕັ້ງຄ່າ (Settings) */}
            {isAdmin && (
              <button
                onClick={() => onSelectTab('settings')}
                className={`transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 flex items-center gap-1.5 ${
                  currentTab === 'settings'
                    ? 'border-emerald-700 text-emerald-950 font-bold'
                    : 'border-transparent text-slate-600 hover:text-emerald-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-emerald-700" />
                <span>ຕັ້ງຄ່າ (Settings)</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions & User Session */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Refresh */}
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              title="ໂຫຼດຂໍ້ມູນໃໝ່"
              className="p-2 text-slate-500 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-700' : ''}`} />
            </button>

            {/* Admin ONLY: Database mode button (Hidden completely from regular hospital users) */}
            {isAdmin && (
              <button
                onClick={onOpenDbSettings}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                  dbStatus.provider === 'turso' && dbStatus.isConnected
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title="ຕັ້ງຄ່າຖານຂໍ້ມູນ Turso LibSQL"
              >
                {dbStatus.provider === 'turso' && dbStatus.isConnected ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Turso Cloud</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    <span>Local DB</span>
                  </>
                )}
                <Database className="w-3 h-3 opacity-60 ml-0.5" />
              </button>
            )}

            {/* Current User Badge */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-emerald-900/10">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-emerald-950 leading-tight truncate max-w-[150px]">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                    {isAdmin ? 'ER Admin' : 'District User'}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  title="ອອກຈາກລະບົບ (Logout)"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* User ONLY: Primary Action Button "+ ສ້າງໃບສົ່ງຕົວ" (Removed for Admin) */}
            {!isAdmin && (
              <button
                onClick={() => onSelectTab('new-referral')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors whitespace-nowrap shadow-xs ml-1"
              >
                <Plus className="w-4 h-4" />
                <span>+ ສ້າງໃບສົ່ງຕົວ</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
