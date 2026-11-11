import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  RefreshCw, 
  HardDrive, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { DatabaseStatus } from '../types/referral';
import { dbService } from '../services/db';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: DatabaseStatus;
  onRefresh: () => void;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefresh,
}) => {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveTurso = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setFeedback(null);

    const res = await dbService.configureTurso(url, token);
    setIsTesting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      onRefresh();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleSwitchToLocal = async () => {
    setIsTesting(true);
    setFeedback(null);
    const res = await dbService.configureTurso('', '');
    setIsTesting(false);
    setUrl('');
    setToken('');
    setFeedback({ type: 'success', message: res.message });
    onRefresh();
  };

  const handleExportBackup = () => {
    const data = dbService.getLocalReferrals();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = `emscps_referrals_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(dlUrl);
  };

  const handleResetSampleData = () => {
    if (confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຣີເຊັດຂໍ້ມູນເປັນຂໍ້ມູນຕົວຢ່າງຕົ້ນສະບັບ?')) {
      dbService.resetSampleData();
      onRefresh();
      setFeedback({ type: 'success', message: 'ຣີເຊັດຂໍ້ມູນຕົວຢ່າງສຳເລັດແລ້ວ' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-emerald-900/10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                ການຕັ້ງຄ່າຖານຂໍ້ມູນ (Turso & Local DB)
              </h3>
              <p className="text-xs text-slate-500">
                ຈັດການການເຊື່ອມຕໍ່ Turso LibSQL Database ສຳລັບ EMSCPS
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

        {/* Current status card */}
        <div className={`p-4 rounded-xl border ${
          status.provider === 'turso' && status.isConnected
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              ສະຖານະປັດຈຸບັນ
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              {status.provider === 'turso' && status.isConnected ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-emerald-900">Turso Cloud (Online)</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-4 h-4 text-slate-500" />
                  <span>Local DB Mode</span>
                </>
              )}
            </span>
          </div>

          <div className="text-xs space-y-1 text-slate-600">
            {status.url && (
              <p><strong className="text-slate-800">Database URL:</strong> <code className="font-mono text-[11px] text-emerald-800">{status.url}</code></p>
            )}
            <p><strong className="text-slate-800">ຈຳນວນລາຍການ:</strong> {status.recordCount} ລາຍການ</p>
            {status.lastSync && (
              <p><strong className="text-slate-800">ອັບເດດລ່າສຸດ:</strong> {status.lastSync}</p>
            )}
            {status.error && (
              <p className="text-rose-600 pt-1 font-medium">{status.error}</p>
            )}
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Configure Turso form */}
        <form onSubmit={handleSaveTurso} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-emerald-950">
              ເຊື່ອມຕໍ່ Turso LibSQL Cloud
            </label>
            <a
              href="https://turso.tech"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              <span>turso.tech</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Database URL (e.g. libsql://emscps-db-user.turso.io)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="libsql://your-database-name.turso.io"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Auth Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOi..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isTesting || !url.trim()}
              className="flex-1 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-2xs disabled:opacity-50"
            >
              {isTesting ? 'ກຳລັງກວດສອບ...' : 'ທົດສອບ & ເຊື່ອມຕໍ່ Turso'}
            </button>
            {status.provider === 'turso' && (
              <button
                type="button"
                onClick={handleSwitchToLocal}
                disabled={isTesting}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200"
              >
                ປ່ຽນເປັນ Local
              </button>
            )}
          </div>
        </form>

        {/* Data Tools */}
        <div className="pt-3 border-t border-emerald-900/10 space-y-2">
          <label className="text-xs font-bold text-emerald-950 block">
            ຈັດການຂໍ້ມູນສຳຮອງ (Backup & Tools)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-emerald-950 bg-emerald-50/50 hover:bg-emerald-100/60 rounded-xl border border-emerald-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Export JSON Backup</span>
            </button>
            <button
              type="button"
              onClick={handleResetSampleData}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>ຣີເຊັດຂໍ້ມູນຕົວຢ່າງ</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
